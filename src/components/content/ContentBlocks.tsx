import Link from 'next/link';
import type { Block, WorkedExample } from '@/content/types';
import { AnswerList, ContentTable } from './ContentTable';
import { Diagram } from './Diagrams';

export function WorkedExampleCard({ example }: { example: WorkedExample }) {
  const headingId = `example-${example.id}-heading`;
  return (
    <section className="example-card" id={`example-${example.id}`} aria-labelledby={headingId}>
      <span className="example-flag">Recalculated by the calculator engine as this page is built</span>
      <h3 id={headingId}>{example.title}</h3>
      <p className="example-scenario">{example.scenario}</p>
      <div className="example-grid">
        <div className="example-panel">
          <h4>Inputs</h4>
          <AnswerList rows={example.inputs} />
        </div>
      </div>
      <div className="example-results">
        <h4 className="sr-only">Results</h4>
        <AnswerList rows={example.results} />
      </div>
      {example.tables?.map((table, i) => <ContentTable table={table} key={i} />)}
      <p className="example-conclusion">{example.conclusion}</p>
    </section>
  );
}

function BlockView({ block, examples }: { block: Block; examples: WorkedExample[] }) {
  switch (block.kind) {
    case 'p':
      return <p>{block.text}</p>;
    case 'h3':
      return <h3 id={slugify(block.text)}>{block.text}</h3>;
    case 'ul':
      return (
        <ul>
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol>
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      );
    case 'checklist':
      return (
        <div className="checklist">
          <h3>{block.title}</h3>
          <ul>
            {block.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      );
    case 'steps':
      return (
        <ol className="steps">
          {block.items.map((item, i) => (
            <li key={i}>
              <strong>{item.title}</strong>
              <span className="steps-body">{item.body}</span>
            </li>
          ))}
        </ol>
      );
    case 'table':
      return <ContentTable table={block.table} />;
    case 'callout':
      return (
        <div className={`notice notice-${block.tone}`} role={block.tone === 'warning' ? 'note' : undefined}>
          <div>
            <strong>{block.title}</strong>
            <div>{block.text}</div>
          </div>
        </div>
      );
    case 'diagram':
      return <Diagram id={block.id} caption={block.caption} />;
    case 'example': {
      const example = examples.find((entry) => entry.id === block.id);
      if (!example) return null;
      return <WorkedExampleCard example={example} />;
    }
    case 'links':
      return (
        <>
          <h3 id={slugify(block.title)}>{block.title}</h3>
          <ul className="content-links">
            {block.items.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
                {item.note ? <span className="content-link-note">{item.note}</span> : null}
              </li>
            ))}
          </ul>
        </>
      );
    default:
      return null;
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function Blocks({ blocks, examples }: { blocks: Block[]; examples: WorkedExample[] }) {
  return (
    <>
      {blocks.map((block, i) => (
        <BlockView block={block} examples={examples} key={i} />
      ))}
    </>
  );
}
