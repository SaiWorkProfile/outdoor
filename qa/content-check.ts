/**
 * Content library audit (development tool).
 *
 * Loads every page in src/content/{projects,materials,costs}, then checks the
 * things a human reviewer would otherwise check by hand: word counts, duplicate
 * titles or descriptions, near-duplicate paragraphs between pages, placeholder
 * text, empty sections, and whether the worked examples resolve.
 */
import { readdirSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { flattenCurrencyText } from '../src/lib/currency/money-value';

type AnyRecord = Record<string, any>;

const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'src', 'content');
const CLUSTERS = ['projects', 'materials', 'costs'];
const PLACEHOLDER = /lorem ipsum|todo:|coming soon|placeholder|\bxxx\b|\btbd\b/i;

function blockText(block: AnyRecord): string[] {
  const out: string[] = [];
  if (block.text) out.push(block.text);
  if (block.title) out.push(block.title);
  if (block.caption) out.push(block.caption);
  for (const item of block.items ?? []) {
    if (typeof item === 'string') out.push(item);
    else if (item && typeof item === 'object') out.push(item.title ?? '', item.body ?? '', item.label ?? '', item.note ?? '');
  }
  if (block.table) {
    out.push(block.table.caption ?? '', block.table.note ?? '');
    /* Cells may be plain text or a money amount, so flatten before counting words. */
    for (const row of block.table.rows) out.push(...row.map((cell: any) => flattenCurrencyText(cell)));
  }
  return out;
}

function collectText(page: AnyRecord): string[] {
  const out: string[] = [page.h1, page.metaTitle, page.metaDescription, page.lede, page.limitations];
  for (const fact of page.keyFacts ?? []) out.push(fact.label, fact.value);
  for (const section of page.sections ?? []) {
    out.push(section.heading);
    for (const block of section.blocks ?? []) out.push(...blockText(block));
  }
  for (const example of page.workedExamples ?? []) {
    out.push(example.title, example.scenario, example.conclusion);
    for (const row of [...(example.inputs ?? []), ...(example.results ?? [])]) out.push(row.label, flattenCurrencyText(row.value), flattenCurrencyText(row.note));
    for (const table of example.tables ?? []) {
      out.push(table.caption ?? '', table.note ?? '');
      for (const row of table.rows) out.push(...row);
    }
  }
  for (const entry of page.faq ?? []) out.push(entry.q, entry.a);
  for (const source of page.sources ?? []) out.push(source.label, source.note);
  for (const link of page.related ?? []) out.push(link.label, link.note ?? '');
  return out.filter((value) => typeof value === 'string' && value.length > 0);
}

const words = (text: string): number => text.split(/\s+/).filter(Boolean).length;
const normalise = (text: string): string =>
  text.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

const RESERVED_SECTION_IDS = ['calculators', 'faq', 'sources', 'limits', 'related'];

async function main() {
  const pages: Array<{ file: string; page: AnyRecord }> = [];
  const loadErrors: Array<{ file: string; error: string }> = [];

  for (const cluster of CLUSTERS) {
    const dir = path.join(CONTENT_DIR, cluster);
    if (!existsSync(dir)) continue;
    for (const file of readdirSync(dir).filter((name) => name.endsWith('.ts') && name !== 'index.ts')) {
      const full = path.join(dir, file);
      try {
        const mod = await import(pathToFileURL(full).href);
        if (!mod.page) throw new Error('no exported `page`');
        pages.push({ file: `${cluster}/${file}`, page: mod.page });
      } catch (error) {
        loadErrors.push({ file: `${cluster}/${file}`, error: String((error as Error)?.message ?? error) });
      }
    }
  }

  const paragraphIndex = new Map<string, string[]>();
  const report = pages.map(({ file, page }) => {
    const text = collectText(page);
    for (const value of text.filter((entry) => words(entry) >= 18)) {
      const key = normalise(value);
      paragraphIndex.set(key, [...(paragraphIndex.get(key) ?? []), file]);
    }
    const sectionWords = (page.sections ?? []).map((section: AnyRecord) => {
      /* A section made of tables, diagrams, worked examples or link lists is not
         "empty" even though it carries few prose words. */
      const hasRichBlock = (section.blocks ?? []).some((b: AnyRecord) =>
        ['table', 'example', 'diagram', 'checklist', 'steps', 'links'].includes(b.kind),
      );
      return {
        id: section.id,
        words: collectText({ sections: [section] }).reduce((sum: number, value: string) => sum + words(value), 0),
        hasRichBlock,
      };
    });
    const blocks = (page.sections ?? []).flatMap((s: AnyRecord) => s.blocks ?? []);
    return {
      file,
      path: page.path,
      cluster: page.cluster,
      words: text.reduce((sum, value) => sum + words(value), 0),
      sectionCount: (page.sections ?? []).length,
      exampleCount: (page.workedExamples ?? []).length,
      faqCount: (page.faq ?? []).length,
      tableCount: blocks.filter((b: AnyRecord) => b.kind === 'table').length + (page.workedExamples ?? []).reduce((n: number, e: AnyRecord) => n + (e.tables?.length ?? 0), 0),
      diagramCount: blocks.filter((b: AnyRecord) => b.kind === 'diagram').length,
      sourceCount: (page.sources ?? []).length,
      relatedCount: (page.related ?? []).length,
      sectionIds: (page.sections ?? []).map((s: AnyRecord) => s.id),
      idCollisions: (() => {
        const ids = (page.sections ?? []).map((s: AnyRecord) => s.id as string);
        const exampleIds = (page.workedExamples ?? []).map((e: AnyRecord) => `example-${e.id}`);
        const duplicates = ids.filter((id: string, i: number) => ids.indexOf(id) !== i);
        const reserved = ids.filter((id: string) => RESERVED_SECTION_IDS.includes(id) || exampleIds.includes(id));
        return [...new Set([...duplicates, ...reserved])];
      })(),
      emptySections: sectionWords.filter((s: AnyRecord) => !s.hasRichBlock && s.words < 40).map((s: AnyRecord) => s.id),
      placeholderHits: text.filter((value) => PLACEHOLDER.test(value)),
      metaTitleWords: words(page.metaTitle ?? ''),
      metaDescriptionLength: (page.metaDescription ?? '').length,
      primaryCalculator: page.primaryCalculator,
      relatedCalculators: page.relatedCalculators ?? [],
      examplesWithoutResults: (page.workedExamples ?? []).filter((e: AnyRecord) => !e.results?.length).map((e: AnyRecord) => e.id),
    };
  });

  const duplicates = [...paragraphIndex.entries()]
    .filter(([, files]) => new Set(files).size > 1)
    .map(([text, files]) => ({ text: text.slice(0, 130), files: [...new Set(files)] }));

  const group = (key: string) => {
    const map = new Map<string, string[]>();
    for (const { file, page } of pages) map.set(page[key], [...(map.get(page[key]) ?? []), file]);
    return [...map.entries()].filter(([, files]) => files.length > 1);
  };

  const summary = {
    pageCount: pages.length,
    loadErrors,
    duplicateTitles: group('metaTitle'),
    duplicateDescriptions: group('metaDescription'),
    duplicatePaths: group('path'),
    duplicateParagraphs: duplicates,
    pagesWithPlaceholders: report.filter((r) => r.placeholderHits.length).map((r) => ({ file: r.file, hits: r.placeholderHits })),
    pagesWithEmptySections: report.filter((r) => r.emptySections.length).map((r) => ({ file: r.file, sections: r.emptySections })),
    examplesMissingResults: report.filter((r) => r.examplesWithoutResults.length),
    shortMetaTitles: report.filter((r) => r.metaTitleWords < 4).map((r) => r.file),
    longMetaDescriptions: report.filter((r) => r.metaDescriptionLength > 165).map((r) => ({ file: r.file, length: r.metaDescriptionLength })),
    pagesWithoutExamples: report.filter((r) => r.exampleCount === 0).map((r) => r.file),
    pagesWithoutRelated: report.filter((r) => r.relatedCount < 4).map((r) => r.file),
    sectionIdCollisions: report.filter((r) => r.idCollisions.length).map((r) => ({ file: r.file, ids: r.idCollisions })),
    totalWords: report.reduce((sum, r) => sum + r.words, 0),
    minWords: report.length ? Math.min(...report.map((r) => r.words)) : 0,
    maxWords: report.length ? Math.max(...report.map((r) => r.words)) : 0,
  };

  mkdirSync(path.join(ROOT, 'qa', 'artifacts'), { recursive: true });
  writeFileSync(path.join(ROOT, 'qa', 'artifacts', 'content.json'), JSON.stringify({ summary, report }, null, 2));
  console.log(JSON.stringify(summary, null, 2));
  console.log('\nPer page:');
  for (const row of report) {
    console.log(
      `${row.cluster.padEnd(9)} ${String(row.path).padEnd(54)} words=${String(row.words).padStart(5)} sections=${row.sectionCount} examples=${row.exampleCount} tables=${row.tableCount} diagrams=${row.diagramCount} faqs=${row.faqCount}`,
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
