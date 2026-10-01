import Link from 'next/link';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'How It Works',
  description: 'How the Outdoor Project Calculator turns measurements into material quantities: one tested engine, visible assumptions, your own prices, and Project Mode to keep every calculation together.',
  alternates: { canonical: '/how-it-works' },
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
