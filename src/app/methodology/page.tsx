import Link from 'next/link';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ENGINE_ASSUMPTIONS } from '@/data/assumptions';
import { CONTENT_PAGES } from '@/content';

export const metadata: Metadata = {
  title: 'Methodology',
  description: 'The full calculation methodology: formulas in order, every central default from the assumptions file, cited sources and the documented limits of each estimate.',
  alternates: { canonical: '/methodology' },
  openGraph: {
    title: 'Methodology',
    description: 'The full calculation methodology: formulas in order, every central default from the assumptions file, cited sources and the documented limits of each estimate.',
    url: '/methodology',
    type: 'website',
  },
};

const TOC = [
  { id: 'principles', label: 'Principles' },
  { id: 'bulk', label: 'Bulk materials' },
  { id: 'pavers', label: 'Pavers' },
  { id: 'fence', label: 'Fence' },
  { id: 'deck', label: 'Deck' },
  { id: 'concrete', label: 'Concrete' },
  { id: 'defaults', label: 'Central defaults' },
  { id: 'sources', label: 'Sources' },
  { id: 'limits', label: 'Limitations' },
];

const SOURCES = (() => {
  const seen = new Set<string>();
  const out: Array<{ label: string; note: string; url: string }> = [];
  for (const page of CONTENT_PAGES) {
    for (const source of page.sources ?? []) {
      if (seen.has(source.url)) continue;
      seen.add(source.url);
      out.push(source);
    }
  }
  return out;
})();

const FENCE = ENGINE_ASSUMPTIONS.fence;
const PAVER = ENGINE_ASSUMPTIONS.paver;

const GENERAL_ROWS: Array<[string, string]> = [
  ['Waste default', `${ENGINE_ASSUMPTIONS.waste.defaultPercent}% of the calculated volume`],
  ['Waste warning / low-margin thresholds', `warns above ${ENGINE_ASSUMPTIONS.waste.warningAbovePercent}%, hints below ${ENGINE_ASSUMPTIONS.waste.lowMarginBelowPercent}%`],
  ['Truck capacity / order granularity', `${ENGINE_ASSUMPTIONS.truck.defaultCapacityTons} tons, ${ENGINE_ASSUMPTIONS.truck.orderGranularityCuYd} yd³ steps`],
  ['Bags vs bulk', `bagged below ${ENGINE_ASSUMPTIONS.bulk.bagsBelowCuYd} yd³, bulk above ${ENGINE_ASSUMPTIONS.bulk.bulkAboveCuYd} yd³`],
  ['Typical waste range shown', `${ENGINE_ASSUMPTIONS.bulk.typicalWasteMinPercent}–${ENGINE_ASSUMPTIONS.bulk.typicalWasteMaxPercent}%`],
  ['Driveway layers (depth × compaction)', ENGINE_ASSUMPTIONS.driveway.layers.map((layer) => `${layer.name}: ${layer.depthIn} in × ${layer.compactionFactor}`).join(' · ')],
  ['Paver base / bedding sand', `base ${PAVER.baseDepthIn} in × ${PAVER.baseCompactionFactor}, bedding ${PAVER.beddingSandDepthIn} in × ${PAVER.beddingSandCompactionFactor}`],
  ['Paver joint width / edge piece', `${PAVER.defaultJointWidthIn} in joints, ${PAVER.edgePieceLengthFt} ft edge pieces`],
  ['Fence spacing / rails', `posts every ${FENCE.defaultPostSpacingFt} ft; ${FENCE.defaultRailsForUpTo6Ft} rails up to 6 ft high, ${FENCE.defaultRailsAbove6Ft} above`],
  ['Fence post hole', `${FENCE.postHoleDiameterIn} in diameter × ${FENCE.postHoleDepthIn} in deep`],
  ['Fence infill defaults', `pickets ${FENCE.defaultPicketWidthIn} in at ${FENCE.defaultPicketSpacingIn} in spacing; panels ${FENCE.defaultPanelWidthFt} ft`],
  ['Deck board / joist spacing', `boards ${ENGINE_ASSUMPTIONS.deck.defaultBoardWidthIn} in wide with ${ENGINE_ASSUMPTIONS.deck.defaultBoardGapIn} in gap, joists every ${ENGINE_ASSUMPTIONS.deck.defaultJoistSpacingIn} in`],
  ['Concrete density / bag yields', `150 lb per ft³; bags ${ENGINE_ASSUMPTIONS.concrete.bags.map((bag) => `${bag.bagLb} lb → ${bag.yieldCuFt} ft³`).join(', ')}`],
];
export default function MethodologyPage() {
  return (
    <div className="container content-page section">
      <Breadcrumbs items={[{ label: 'Methodology' }]} />
      <header className="page-intro" style={{ paddingLeft: 0 }}>
        <div className="eyebrow">Calculation methodology</div>
        <h1>Transparent assumptions, visible limits.</h1>
        <p className="lede">
          The engine produces repeatable planning estimates while making every assumption available for review — and
          for override where it matters to your project. This page is the reference: formulas, defaults, sources
          and limits, in one place.
        </p>
      </header>

      <div className="content-page-grid">
        <div className="copy content-body">
          <section id="principles" aria-labelledby="principles-heading">
            <h2 id="principles-heading">Principles</h2>
            <ul>
              <li>One typed engine owns every formula; the interface never recomputes a value.</li>
              <li>Assumptions live in one file shared by all calculators, guides and Project Mode.</li>
              <li>Invalid input produces a named error, not a plausible-looking number.</li>
              <li>Costs use only prices the user entered. Current market prices are never generated.</li>
              <li>Where the supplied geometry is insufficient, a result is withheld instead of guessed.</li>
            </ul>
          </section>

          <section id="bulk" aria-labelledby="bulk-heading">
            <h2 id="bulk-heading">Bulk materials</h2>
            <p>
              Area × depth converts to cubic feet, then cubic yards. Compaction is applied first where the material
              settles, then waste, then the purchase quantity is rounded to the order granularity. Tons use the
              configured density for the material; bag counts round up because bags are indivisible.
            </p>
            <p>
              The engine recommends bags below the bag/bulk threshold and bulk above it, and shows both when the two
              are compared — but never converts a bag count into a fabricated bulk price.
            </p>
          </section>

          <section id="pavers" aria-labelledby="pavers-heading">
            <h2 id="pavers-heading">Pavers</h2>
            <p>
              Paver count uses a joint-aware module dimension, so joint width is part of the arithmetic rather than
              a footnote. Base and bedding sand are calculated independently, each with its own depth and compaction
              factor. Edge restraint is derived only when the perimeter geometry is available; otherwise the result
              is omitted, not estimated.
            </p>
          </section>

          <section id="fence" aria-labelledby="fence-heading">
            <h2 id="fence-heading">Fence</h2>
            <p>
              Post counts are spacing-based planning estimates with corners, ends and gates counted separately from
              the run. Rails follow fence height; pickets or panels follow the infill type chosen, but the posts and
              concrete do not change with it. Concrete uses cylindrical post-hole volume from the configured hole
              diameter and depth. Hardware allowances are generic — not a manufacturer-specific system.
            </p>
          </section>

          <section id="deck" aria-labelledby="deck-heading">
            <h2 id="deck-heading">Deck</h2>
            <p>
              Deck quantities estimate material only: boards from area and board width with the specified gap,
              joists from spacing, beams and posts from the plan you supply. The engine does not determine safe
              spans, footing sizes, load ratings, structural adequacy or code compliance.
            </p>
          </section>

          <section id="concrete" aria-labelledby="concrete-heading">
            <h2 id="concrete-heading">Concrete</h2>
            <p>
              Volume comes from geometry; weight uses the configured 150 lb per cubic foot normal-weight figure.
              Ready-mix is rounded up in delivery increments, bag counts round up by bag yield, and the bag-vs-bulk
              advice flips at the configured thresholds. Thin slabs trigger a thickness warning because they are
              commonly under-specified.
            </p>
          </section>
          <section id="defaults" aria-labelledby="defaults-heading">
            <h2 id="defaults-heading">Central defaults</h2>
            <p>
              Every value below comes from the single assumptions file the engine reads. Where a calculator exposes
              an override, the override is shown next to the result it affected.
            </p>
            <div className="assumption-list">
              {GENERAL_ROWS.map(([label, value]) => (
                <div className="assumption-row" key={label}>
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>

            <div className="table-wrap">
              <table className="content-table">
                <caption>Material planning densities and bag sizes</caption>
                <thead>
                  <tr>
                    <th scope="col">Material</th>
                    <th scope="col">Density (tons per yd³)</th>
                    <th scope="col">Bag sizes (ft³)</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(ENGINE_ASSUMPTIONS.materials).map(([name, spec]) => (
                    <tr key={name}>
                      <th scope="row">{name}</th>
                      <td>
                        {spec.densityTonsPerCuYd.typical} typical ({spec.densityTonsPerCuYd.min}–
                        {spec.densityTonsPerCuYd.max} range)
                      </td>
                      <td>{spec.bagSizesCuFt.join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="table-note">
                Densities are planning defaults for the named material; supplier products vary. Enter your
                supplier&apos;s figures where the calculator allows it.
              </p>
            </div>
          </section>
          <section id="sources" aria-labelledby="sources-heading">
            <h2 id="sources-heading">Sources</h2>
            <p>
              These are the external references cited across the guide library — published extension guidance and
              material reference material used to sanity-check the defaults above. Each guide cites the specific
              source where a claim is checkable.
            </p>
            <ul className="sources">
              {SOURCES.map((source) => (
                <li key={source.url}>
                  <a href={source.url} rel="nofollow noopener" target="_blank">
                    {source.label}
                  </a>
                  <span className="source-note">{source.note}</span>
                </li>
              ))}
            </ul>
            <p className="subtle">
              These references support general background only. Product data, local requirements and site
              conditions take precedence over anything published here.
            </p>
          </section>

          <section id="limits" aria-labelledby="limits-heading">
            <h2 id="limits-heading">Limitations</h2>
            <div className="limits-card">
              <h3>Where this estimate stops being useful</h3>
              <p>
                Densities, product yields, packaging, compaction behaviour, site conditions and local requirements
                vary, and this site cannot see any of them. Estimates are planning aids for ordering conversations —
                not structural engineering, property surveying, code review or manufacturer instructions, which
                remain required where they apply. Confirm quantities with your supplier before purchase, and have a
                qualified professional confirm anything structural, drainage-related or permit-dependent.
              </p>
            </div>
            <p>
              The <Link href="/about">about page</Link> explains what the platform does and does not do, and the{' '}
              <Link href="/how-it-works">how it works page</Link> walks through the workflow end to end.
            </p>
          </section>
        </div>

        <aside className="sticky-shell">
          <nav className="content-toc" aria-labelledby="methodology-toc-heading">
            <h2 id="methodology-toc-heading">On this page</h2>
            <ol>
              {TOC.map((entry) => (
                <li key={entry.id}>
                  <a href={`#${entry.id}`}>{entry.label}</a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="cta-card">
            <h2>Try it with your own numbers</h2>
            <p>Every calculator shows which assumptions applied to your result — and lets you override them.</p>
            <div className="content-actions">
              <Link className="button button-primary" href="/calculators">Browse calculators</Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
