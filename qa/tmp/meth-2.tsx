
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
