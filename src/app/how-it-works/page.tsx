import Link from 'next/link';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'How It Works',
  description: 'How MeasureToBuild turns measurements into material quantities: one tested engine, visible assumptions, your own prices, and Project Mode to keep every calculation together.',
  alternates: { canonical: '/how-it-works' },
  openGraph: {
    title: 'How It Works',
    description: 'How MeasureToBuild turns measurements into material quantities: one tested engine, visible assumptions, your own prices, and Project Mode to keep every calculation together.',
    url: '/how-it-works',
    type: 'website',
  },
};

const SECTIONS = [
  { id: 'measure', label: '1. Measure' },
  { id: 'calculate', label: '2. Calculate' },
  { id: 'plan', label: '3. Plan' },
  { id: 'verify', label: '4. Verify' },
  { id: 'one-engine', label: '5. One engine' },
  { id: 'validation', label: '6. Validation' },
  { id: 'assumptions', label: '7. Assumptions' },
  { id: 'provenance', label: '8. Result provenance' },
  { id: 'prices', label: '9. Your prices only' },
  { id: 'storage', label: '10. Local storage' },
  { id: 'content', label: '11. Guide content' },
  { id: 'limits', label: '12. Limits' },
] as const;

export default function HowItWorksPage() {
  return (
    <div className="container content-page section">
      <Breadcrumbs items={[{ label: 'How It Works' }]} />
      <header className="page-intro" style={{ paddingLeft: 0 }}>
        <div className="eyebrow">The product model</div>
        <h1>Measure → Calculate → Plan → Verify.</h1>
        <p className="lede">
          The calculator interface is presentation. The calculation engine is a separate, typed, tested source of
          truth — and everything the site shows, from results to guides to Project Mode, comes from that one place.
        </p>
        <p className="page-updated">Last updated: October 1, 2026</p>
      </header>

      <div className="content-page-grid">
        <div className="copy content-body">
          <section id="measure" aria-labelledby="measure-heading">
            <h2 id="measure-heading">1. Measure — break the job into measurable parts</h2>
            <p>
              A driveway is not one number and a fence is not one rectangle. Each calculator asks for the parts you
              can actually measure on site: lengths, widths, depths, spacing, gate counts. Areas can be summed
              rather than forced into a single shape, so irregular projects stay honest.
            </p>
            <p>
              Units are labelled on every field, and defaults are planning defaults (post spacing, joint width,
              layer depths) rather than arbitrary starting values — the same defaults the assumptions table shows.
            </p>
          </section>

          <section id="calculate" aria-labelledby="calculate-heading">
            <h2 id="calculate-heading">2. Calculate — the form hands off to the engine</h2>
            <p>
              When you press Calculate, the page converts your form state into a typed engine input and calls one
              function. No arithmetic happens in the interface layer, and no formula is written twice — the engine
              under <code>src/lib/calculations</code> is the only place a calculation exists.
            </p>
            <p>
              That is why the same number appears everywhere: the calculator page, the worked example in a guide and
              a line in Project Mode are all produced by the identical call.
            </p>
          </section>

          <section id="plan" aria-labelledby="plan-heading">
            <h2 id="plan-heading">3. Plan — results become one project</h2>
            <p>
              Any result can be added to <Link href="/projects">Project Mode</Link>. The calculation arrives as a
              material line that keeps its inputs, its result values, its form state, the calculator it came from
              and the assumptions that were used — so months later the line can still explain itself.
            </p>
            <p>
              From there the project grows into areas, quantities, costs from prices you enter, extra hand-written
              lines, a shopping list with checkboxes and a printable plan.
            </p>
          </section>

          <section id="verify" aria-labelledby="verify-heading">
            <h2 id="verify-heading">4. Verify — before anything is ordered</h2>
            <p>
              Estimates are planning aids. Before purchase or construction, confirm supplier packaging and yields,
              product density, site conditions, local requirements and manufacturer instructions. The site states
              this on every calculator and every guide, because the last mile of a project cannot be calculated
              from a browser.
            </p>
          </section>
          <section id="one-engine" aria-labelledby="one-engine-heading">
            <h2 id="one-engine-heading">5. One engine, one meaning per number</h2>
            <p>
              Because every calculator dispatches through the same engine, shared concepts have one definition:
              &quot;waste&quot;, &quot;compaction&quot; and &quot;tons&quot; mean the same thing on the gravel page
              and the driveway page. The engine-bridge layer only adds presentation summaries on top of typed
              results — it never recomputes them.
            </p>
            <p>
              The engine is covered by unit tests that assert quantity behaviour (spacing, rounding, waste
              interaction) rather than snapshots, so a formula cannot change silently.
            </p>
          </section>

          <section id="validation" aria-labelledby="validation-heading">
            <h2 id="validation-heading">6. Validation before arithmetic</h2>
            <p>
              Engine inputs are validated at the boundary: empty, negative or nonsensical values produce a named
              error instead of a plausible-looking wrong number. The interface shows those errors next to the field
              that caused them — you are told which input rejected the calculation, not given a NaN.
            </p>
          </section>

          <section id="assumptions" aria-labelledby="assumptions-heading">
            <h2 id="assumptions-heading">7. Assumptions are data, not prose</h2>
            <p>
              Waste percentages, densities, bag sizes, compaction factors, joint widths and rounding steps live in
              one centralized assumptions file shared by every calculator. The <Link href="/methodology">methodology
              page</Link> renders that file as a reference table, and every calculator shows the assumptions that
              applied to your result.
            </p>
            <p>
              Where a number matters to your project — waste, density, compaction — the calculator lets you override
              it rather than forcing a default on you.
            </p>
          </section>

          <section id="provenance" aria-labelledby="provenance-heading">
            <h2 id="provenance-heading">8. Results carry their provenance</h2>
            <p>
              Each result shows the inputs it was calculated from and the headline outputs that matter for ordering.
              When something cannot be derived from what you entered (for example, edge restraint without a
              perimeter), the result says so instead of inventing a figure.
            </p>
            <p>
              Guide pages work the same way: every worked example states its inputs and is generated by calling the
              engine, so a guide and a calculator can never disagree about the same measurement.
            </p>
          </section>
          <section id="prices" aria-labelledby="prices-heading">
            <h2 id="prices-heading">9. Your prices only — no invented costs</h2>
            <p>
              The site does not publish current market prices, because it has no live feed of them. Cost fields use
              the prices you enter; a missing price is shown as &quot;Price not entered&quot; and excluded from the
              total rather than filled with a guess. A cost total is only ever as current as the numbers you gave
              it.
            </p>
            <p>
              Cost calculations use the prices you enter. MeasureToBuild does not claim to know your local
              current market price.
            </p>
          </section>

          <section id="storage" aria-labelledby="storage-heading">
            <h2 id="storage-heading">10. Your project stays in your browser</h2>
            <p>
              Project Mode persists to your browser&apos;s local storage — no account, no server, no sync. Project
              Mode data is not transmitted to a MeasureToBuild server, and printing the plan works entirely on
              your machine.
              Clearing the project deletes the data, because there is no copy anywhere else. The{' '}
              <Link href="/privacy">privacy page</Link> spells out exactly what is stored.
            </p>
          </section>

          <section id="content" aria-labelledby="content-heading">
            <h2 id="content-heading">11. Guides are built from the same material</h2>
            <p>
              The <Link href="/guides">guide library</Link> — project, material and cost guides — is content data
              rendered through one accessible template. Its worked examples call the engine, its claims link to
              their sources where a claim is checkable, and every guide ends with what it cannot tell you. No page
              is given authority it has not earned: no fake bylines, no review scores, no invented statistics.
            </p>
          </section>

          <section id="limits" aria-labelledby="limits-heading">
            <h2 id="limits-heading">12. What the site will not do</h2>
            <p>
              It will not tell you a structure is safe, that a permit is not required, that a supplier will accept
              an order quantity, or what your project will cost at today&apos;s prices. Those decisions involve
              local code, site conditions and market information that a calculator cannot see. The site does the
              arithmetic honestly and tells you where its knowledge stops — then the{' '}
              <Link href="/methodology">methodology page</Link> and <Link href="/about">about page</Link> document
              both in full.
            </p>
          </section>
        </div>

        <aside className="sticky-shell">
          <nav className="content-toc" aria-labelledby="hiw-toc-heading">
            <h2 id="hiw-toc-heading">On this page</h2>
            <ol>
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.label}</a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="cta-card">
            <h2>Built-in principles</h2>
            <ul className="copy-list">
              <li>No fabricated current prices.</li>
              <li>No formula duplication in UI code.</li>
              <li>Assumptions remain inspectable.</li>
              <li>Project data remains browser-local.</li>
              <li>No account is required.</li>
              <li>Project Mode needs no backend.</li>
            </ul>
            <div className="content-actions">
              <Link className="button button-primary" href="/calculators">Try a calculator</Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
