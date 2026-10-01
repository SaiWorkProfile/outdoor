/**
 * Calculator SEO copy audit (development tool).
 *
 * Loads all 16 calculator definitions (registry structure + copy.ts page copy)
 * and checks the things a human reviewer would otherwise verify by hand:
 *   - unique, sensibly sized titles and meta descriptions
 *   - introduction length, FAQ count, and per-section content presence
 *   - duplicate paragraphs of 18+ words between calculator pages
 *   - duplicate FAQ questions across calculators
 *   - internal link targets that resolve to a known route
 *
 * It audits copy only: no rendering, no network, no engine changes.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { CALCULATORS, type CalculatorDefinition } from '@/components/calculators/registry';
import { CALCULATOR_GUIDES } from '@/content/guides';
import { CONTENT_PAGES } from '@/content';

const ROOT = path.resolve(__dirname, '..');
const MIN_PARAGRAPH_WORDS = 18;
const INTRO_MIN = 100;
const INTRO_MAX = 180;
const DESC_MAX = 165;
const DESC_MIN = 70;
/** metaTitle + the 17-char " | MeasureToBuild" suffix should stay within 70 chars. */
const TITLE_MAX = 53;

const words = (text: string): number => text.split(/\s+/).filter(Boolean).length;
const normalise = (text: string): string =>
  text.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

interface TextItem {
  field: string;
  text: string;
}

function copyTexts(c: CalculatorDefinition): TextItem[] {
  const items: TextItem[] = [
    { field: 'shortDescription', text: c.shortDescription },
    { field: 'metaTitle', text: c.metaTitle },
    { field: 'metaDescription', text: c.metaDescription },
    { field: 'intro', text: c.intro },
    { field: 'howItWorks', text: c.howItWorks },
    { field: 'formula', text: c.formula },
    { field: 'workedExample.note', text: c.workedExample.note },
  ];
  c.outputs.forEach((text, i) => items.push({ field: `outputs[${i}]`, text }));
  c.useCases.forEach((u, i) => items.push({ field: `useCases[${i}].detail`, text: u.detail }));
  c.outputNotes.forEach((n, i) => items.push({ field: `outputNotes[${i}].text`, text: n.text }));
  c.planning.forEach((text, i) => items.push({ field: `planning[${i}]`, text }));
  c.mistakes.forEach((text, i) => items.push({ field: `mistakes[${i}]`, text }));
  c.faq.forEach((f, i) => {
    items.push({ field: `faq[${i}].q`, text: f.q });
    items.push({ field: `faq[${i}].a`, text: f.a });
  });
  return items.filter((item) => item.text.trim().length > 0);
}

function knownRoutes(): Set<string> {
  const routes = new Set<string>([
    '/', '/calculators', '/projects', '/guides', '/how-it-works', '/methodology',
    '/about', '/privacy', '/terms',
  ]);
  for (const c of CALCULATORS) routes.add(`/calculators/${c.slug}`);
  for (const page of CONTENT_PAGES) routes.add(page.path);
  return routes;
}
function main() {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (CALCULATORS.length !== 16) errors.push(`expected 16 calculators, found ${CALCULATORS.length}`);

  /* ------------------------------------------------------------ metadata */
  const titles = new Map<string, string[]>();
  const descriptions = new Map<string, string[]>();
  for (const c of CALCULATORS) {
    titles.set(c.metaTitle, [...(titles.get(c.metaTitle) ?? []), c.slug]);
    descriptions.set(c.metaDescription, [...(descriptions.get(c.metaDescription) ?? []), c.slug]);
    if (!c.metaTitle || c.metaTitle.trim().length < 10) errors.push(`${c.slug}: meta title too short`);
    if (c.metaTitle.length > TITLE_MAX) {
      warnings.push(`${c.slug}: meta title ${c.metaTitle.length} chars (>${TITLE_MAX}) before the site suffix`);
    }
    const descLength = c.metaDescription.length;
    if (descLength < DESC_MIN) errors.push(`${c.slug}: meta description only ${descLength} chars`);
    if (descLength > DESC_MAX) errors.push(`${c.slug}: meta description ${descLength} chars (max ${DESC_MAX})`);
    if (c.h1.trim().toLowerCase() !== c.name.trim().toLowerCase()) {
      warnings.push(`${c.slug}: H1 differs from calculator name`);
    }
  }
  for (const [title, slugs] of titles) if (slugs.length > 1) errors.push(`duplicate meta title "${title}": ${slugs.join(', ')}`);
  for (const [desc, slugs] of descriptions) if (slugs.length > 1) errors.push(`duplicate meta description on: ${slugs.join(', ')}`);

  /* ---------------------------------------------------------- structure */
  const faqCounts: Record<string, number> = {};
  for (const c of CALCULATORS) {
    faqCounts[c.slug] = c.faq.length;
    if (c.faq.length < 5 || c.faq.length > 8) errors.push(`${c.slug}: ${c.faq.length} FAQs (expected 5–8)`);
    const introWords = words(c.intro);
    if (introWords < INTRO_MIN || introWords > INTRO_MAX) {
      errors.push(`${c.slug}: intro ${introWords} words (expected ${INTRO_MIN}–${INTRO_MAX})`);
    }
    if (c.outputs.length < 4) errors.push(`${c.slug}: only ${c.outputs.length} outputs listed`);
    if (c.useCases.length < 3) errors.push(`${c.slug}: only ${c.useCases.length} use cases`);
    if (c.outputNotes.length < 2) errors.push(`${c.slug}: only ${c.outputNotes.length} output explanations`);
    if (c.planning.length < 4) errors.push(`${c.slug}: only ${c.planning.length} guidance items`);
    if (c.mistakes.length < 4) errors.push(`${c.slug}: only ${c.mistakes.length} common mistakes`);
    if (c.related.length < 2) errors.push(`${c.slug}: fewer than 2 related calculators`);
    if (c.related.includes(c.slug)) errors.push(`${c.slug}: links to itself`);
  }
  /* ------------------------------------------ duplicate paragraph audit */
  const paragraphIndex = new Map<string, Array<{ slug: string; field: string }>>();
  const questionIndex = new Map<string, string[]>();
  for (const c of CALCULATORS) {
    for (const item of copyTexts(c)) {
      const key = normalise(item.text);
      if (!key) continue;
      if (words(key) >= MIN_PARAGRAPH_WORDS) {
        const hits = paragraphIndex.get(key) ?? [];
        hits.push({ slug: c.slug, field: item.field });
        paragraphIndex.set(key, hits);
      }
      if (item.field.endsWith('.q')) {
        questionIndex.set(key, [...(questionIndex.get(key) ?? []), c.slug]);
      }
    }
  }
  const duplicateParagraphs = [...paragraphIndex.entries()]
    .filter(([, hits]) => new Set(hits.map((h) => h.slug)).size > 1)
    .map(([text, hits]) => ({
      text: text.slice(0, 140),
      occurrences: hits.map((h) => `${h.slug}:${h.field}`),
    }));
  for (const dup of duplicateParagraphs) {
    errors.push(`duplicate ${MIN_PARAGRAPH_WORDS}+ word paragraph: ${dup.occurrences.join(', ')} — "${dup.text}..."`);
  }
  const duplicateQuestions = [...questionIndex.entries()]
    .filter(([, slugs]) => new Set(slugs).size > 1)
    .map(([q, slugs]) => ({ q: q.slice(0, 120), slugs: [...new Set(slugs)] }));
  for (const dup of duplicateQuestions) {
    errors.push(`duplicate FAQ question across ${dup.slugs.join(', ')}: "${dup.q}"`);
  }

  /* ------------------------------------------------------ internal links */
  const routes = knownRoutes();
  const linkReport: Array<{ slug: string; links: string[] }> = [];
  for (const c of CALCULATORS) {
    const guide = CALCULATOR_GUIDES[c.slug];
    const hrefs = [guide.project, guide.material, guide.cost, guide.extra]
      .filter((item): item is { href: string; label: string } => Boolean(item))
      .map((item) => item.href);
    const calculatorHrefs = c.related.map((slug) => `/calculators/${slug}`);
    const all = [...hrefs, ...calculatorHrefs];
    for (const href of all) {
      if (!routes.has(href)) errors.push(`${c.slug}: internal link target not found: ${href}`);
    }
    linkReport.push({ slug: c.slug, links: all });
  }
  /* -------------------------------------------------------------- report */
  const summary = {
    calculatorCount: CALCULATORS.length,
    uniqueTitles: titles.size,
    uniqueDescriptions: descriptions.size,
    duplicateParagraphs: duplicateParagraphs.length,
    duplicateFaqQuestions: duplicateQuestions.length,
    faqCounts,
    introWordCounts: Object.fromEntries(CALCULATORS.map((c) => [c.slug, words(c.intro)])),
    metaDescriptionLengths: Object.fromEntries(CALCULATORS.map((c) => [c.slug, c.metaDescription.length])),
    internalLinks: linkReport.reduce((sum, r) => sum + r.links.length, 0),
    errors: errors.length,
    warnings: warnings.length,
  };

  mkdirSync(path.join(ROOT, 'qa', 'artifacts'), { recursive: true });
  writeFileSync(
    path.join(ROOT, 'qa', 'artifacts', 'calculator-seo.json'),
    JSON.stringify({ summary, duplicateParagraphs, duplicateQuestions, linkReport, errors, warnings }, null, 2),
  );

  console.log(JSON.stringify(summary, null, 2));
  for (const warning of warnings) console.log(`WARN ${warning}`);
  for (const error of errors) console.log(`FAIL ${error}`);
  if (errors.length) {
    console.log(`\ncalculator SEO audit: ${errors.length} failure(s)`);
    process.exitCode = 1;
  } else {
    console.log(`\ncalculator SEO audit: PASS (${CALCULATORS.length} pages, no duplicate paragraphs, metadata unique)`);
  }
}

main();
