import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { getCalculator } from '@/components/calculators/registry';
import type { ContentPage } from '@/content/types';
import { Blocks } from './ContentBlocks';
import { AnswerList } from './ContentTable';

const CLUSTER_LABEL: Record<ContentPage['cluster'], string> = {
  projects: 'Project guide',
  materials: 'Material guide',
  costs: 'Cost guide',
};

export function ContentPageView({ page }: { page: ContentPage }) {
  const examples = page.workedExamples ?? [];
  const crumbs =
    page.cluster === 'projects'
      ? [{ label: 'Projects', href: '/projects' }, { label: page.crumb }]
      : [{ label: page.crumb }];
  const primary = getCalculator(page.primaryCalculator);
  const others = (page.relatedCalculators ?? []).map((slug) => getCalculator(slug)).filter(Boolean);

  return (
    <div className="container content-page">
      <Breadcrumbs items={crumbs} />
      <header className="page-intro" style={{ paddingLeft: 0 }}>
        <div className="eyebrow-row">
          <span className="eyebrow">{page.eyebrow}</span>
          <span className="chip">{CLUSTER_LABEL[page.cluster]}</span>
        </div>
        <h1>{page.h1}</h1>
        <p className="lede">{page.lede}</p>
      </header>

      <div className="content-page-grid">
        <div className="copy content-body">
          {page.sections.map((section) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`}>
              <h2 id={`${section.id}-heading`}>{section.heading}</h2>
              <Blocks blocks={section.blocks} examples={examples} />
            </section>
          ))}

          <section id="calculators" aria-labelledby="calculators-heading">
            <h2 id="calculators-heading">{primary ? `Try it: ${primary.name}` : 'Calculator'}</h2>
            {primary ? (
              <p>
                {primary.shortDescription} Every number on this page came from the same engine, so you can replace the example
                figures with your own measurements and compare.
              </p>
            ) : null}
            <ul className="calc-strip">
              {primary ? (
                <li>
                  <Link href={`/calculators/${primary.slug}`}>
                    <strong>{primary.name}</strong>
                    <span>{primary.shortDescription}</span>
                  </Link>
                </li>
              ) : null}
              {others.map((calculator) =>
                calculator ? (
                  <li key={calculator.slug}>
                    <Link href={`/calculators/${calculator.slug}`}>
                      <strong>{calculator.name}</strong>
                      <span>{calculator.shortDescription}</span>
                    </Link>
                  </li>
                ) : null,
              )}
            </ul>
          </section>

          {page.faq?.length ? (
            <section id="faq" aria-labelledby="faq-heading">
              <h2 id="faq-heading">Frequently asked questions</h2>
              <div className="faq">
                {page.faq.map((entry) => (
                  <details key={entry.q}>
                    <summary>{entry.q}</summary>
                    <p>{entry.a}</p>
                  </details>
                ))}
              </div>
            </section>
          ) : null}

          {page.sources?.length ? (
            <section id="sources" aria-labelledby="sources-heading">
              <h2 id="sources-heading">Sources and references</h2>
              <ul className="sources">
                {page.sources.map((source) => (
                  <li key={source.url}>
                    <a href={source.url} rel="nofollow noopener" target="_blank">
                      {source.label}
                    </a>
                    <span className="source-note">{source.note}</span>
                  </li>
                ))}
              </ul>
              <p className="subtle">
                These references support the general background on this page only. Product data, local requirements and
                site conditions take precedence over anything published here.
              </p>
            </section>
          ) : null}

          <section id="limits" aria-labelledby="limits-heading">
            <h2 id="limits-heading">Method and limitations</h2>
            <div className="limits-card">
              <h3>Where this estimate stops being useful</h3>
              <p>{page.limitations}</p>
            </div>
            <p>
              The <Link href="/methodology">methodology page</Link> documents how volume, waste, compaction and purchase
              quantities are produced, and the <Link href="/about">about page</Link> explains what this platform does and
              does not do.
            </p>
          </section>

          <section id="related" aria-labelledby="related-heading">
            <h2 id="related-heading">Related resources</h2>
            <ul className="content-links">
              {page.related.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                  {link.note ? <span className="content-link-note">{link.note}</span> : null}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="sticky-shell">
          {page.keyFacts?.length ? (
            <div className="answer-card">
              <h2>Quick answers</h2>
              <AnswerList rows={page.keyFacts.map((fact) => ({ label: fact.label, value: fact.value }))} />
            </div>
          ) : null}

          {primary ? (
            <div className="cta-card">
              <h2>{primary.name}</h2>
              <p>{primary.shortDescription}</p>
              <div className="content-actions">
                <Link className="button button-primary" href={`/calculators/${primary.slug}`}>
                  Open calculator
                </Link>
              </div>
            </div>
          ) : null}

          <nav className="content-toc" aria-labelledby="toc-heading">
            <h2 id="toc-heading">On this page</h2>
            <ol>
              {page.sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.heading}</a>
                </li>
              ))}
              <li>
                <a href="#calculators">Calculator</a>
              </li>
              <li>
                <a href="#limits">Method and limitations</a>
              </li>
              <li>
                <a href="#related">Related resources</a>
              </li>
            </ol>
          </nav>
        </aside>
      </div>
    </div>
  );
}
