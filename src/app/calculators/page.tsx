import Link from 'next/link';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { CalculatorIcon, ArrowRightIcon } from '@/components/ui/icons';
import { getCalculator } from '@/components/calculators/registry';
import { CALCULATOR_GROUPS } from '@/components/calculators/groups';

export const metadata: Metadata = {
  title: 'Outdoor Calculators',
  description: 'Sixteen outdoor calculators grouped by job: landscaping materials, driveways and hardscape, fences and decks. Each one plans quantities, waste and costs you can enter yourself.',
  alternates: { canonical: '/calculators' },
  openGraph: { title: 'Outdoor project calculators', description: 'Browse material, driveway, fence, deck and cost calculators that all use one tested calculation engine.', url: '/calculators', type: 'website' },
};

const CHOOSING = [
  ['You need one material quantity', 'Start with a material calculator — gravel, mulch, topsoil, soil, sand, pea gravel, landscape rock or paver base. Each one takes your measured area and depth and returns volume, weight, bag counts and a cost estimate from your own price.'],
  ['You are building in layers', 'Use the driveway gravel, paver, paver patio or concrete calculator. They plan each layer separately — base, bedding, surface — because those layers have different depths, compaction factors and suppliers.'],
  ['You need a component take-off', 'Fence, fence post and deck material calculators break a build into posts, rails, pickets, panels, boards, joists and fasteners, so you can order from a cut list instead of a lump sum.'],
  ['You need a cost, not a quantity', 'Fence cost and paver cost inputs accept your supplier prices and flag anything unpriced. Nothing is priced for you, so a partial quote stays visibly partial.'],
];

const FAQ = [
  { q: 'Which calculator should I start with?', a: 'Start with the material you are ordering first — usually the base or bulk material. Once that quantity exists, add it to Project Mode and let the next calculation join it in the same plan.' },
  { q: 'Do all sixteen calculators work the same way?', a: 'They share the same engine and the same conventions: areas are added before volume is calculated, waste and compaction are applied consistently, and order quantities are rounded up where ordering requires it.' },
  { q: 'Do you support metric measurements?', a: 'The forms are built around US units (feet, inches, cubic yards, tons). Results include square and cubic metre conversions in the engine output, but the input forms ask for feet and inches.' },
  { q: 'Can I calculate several areas at once?', a: 'Yes. Area-based calculators accept multiple shapes — rectangles, circles, triangles or a known square footage — and add them before calculating volume.' },
  { q: 'Will the calculator fill in prices for me?', a: 'No. Every price is something you enter, and an estimate without a price shows "Price not entered" rather than an invented figure.' },
  { q: 'How do I keep the results?', a: 'Use Add to Project on any calculator, then open Project Mode to combine, edit and print the plan, or save the printable plan as a PDF.' },
];

export default function CalculatorsPage() {
  return (
    <div className="container page-intro">
      <Breadcrumbs items={[{ label: 'Calculators' }]} />
      <h1>Outdoor project calculators</h1>
      <p>
        Sixteen calculators that all call the same tested calculation layer. Pick the one that matches the decision you
        are making, then add the result to Project Mode to build a material, cost and shopping plan for the whole job.
      </p>

      {CALCULATOR_GROUPS.map((group) => (
        <section className="category-block" key={group.id} aria-labelledby={`group-${group.id}`}>
          <h2 id={`group-${group.id}`}>{group.title}</h2>
          <p className="category-note">{group.blurb}</p>
          <div className="calculator-index">
            {group.items.map((item) => {
              const definition = getCalculator(item.slug);
              if (!definition) return null;
              return (
                <Link className="calculator-link" href={`/calculators/${definition.slug}`} key={`${group.id}-${item.slug}`}>
                  <div className="tool-icon"><CalculatorIcon size={19}/></div>
                  <div>
                    <h3>{definition.name}</h3>
                    <p>{item.description}</p>
                    <span className="tool-card-link">Open <ArrowRightIcon size={14}/></span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}


      <section className="section" style={{ marginTop: 34 }}>
        <div className="section-heading">
          <div className="eyebrow">How to choose</div>
          <h2>Four questions decide which calculator you need</h2>
        </div>
        <ul className="why-list">
          {CHOOSING.map(([title, body]) => (
            <li key={title}><strong>{title}</strong><span>{body}</span></li>
          ))}
        </ul>
      </section>

      <section className="section section-soft" style={{ marginTop: 0 }}>
        <div className="container">
          <div className="section-heading">
            <div className="eyebrow">Project Mode</div>
            <h2>Calculators give you an answer. Project Mode keeps them together.</h2>
            <p>A driveway is not one material and a patio is not one order. Project Mode combines results from any calculator into a single plan.</p>
          </div>
          <div className="grid-3">
            <article className="card">
              <h3>One material list</h3>
              <p>Every added calculation becomes a material line with its quantity, unit, cost category, entered price and any assumptions that were used — together with a note of what it was calculated from.</p>
            </article>
            <article className="card">
              <h3>Costs you can trace</h3>
              <p>Costs group by category, missing prices are shown as "Price not entered" instead of being guessed, and extra lines like delivery, base rental or permits can be added by hand.</p>
            </article>
            <article className="card">
              <h3>A printable plan</h3>
              <p>The project prints as a material list, cost breakdown, shopping list with checkboxes and an assumptions page — so the plan works away from this browser.</p>
            </article>
          </div>
          <div className="content-actions" style={{ marginTop: 18 }}>
            <Link className="button button-primary" href="/projects">Open Project Mode <ArrowRightIcon size={16}/></Link>
            <Link className="button button-secondary" href="/how-it-works">How the workflow fits together</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div className="eyebrow">Frequently asked questions</div>
            <h2>Using these calculators</h2>
          </div>
          <div className="faq content-body">
            {FAQ.map((entry) => (
              <details key={entry.q}>
                <summary>{entry.q}</summary>
                <p>{entry.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
