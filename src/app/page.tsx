import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRightIcon, BookIcon, CalculatorIcon, CheckIcon, FolderIcon, RulerIcon, ShieldIcon } from '@/components/ui/icons';
import { getCalculator, type CalculatorSlug } from '@/components/calculators/registry';
import { POPULAR_SLUGS } from '@/components/calculators/groups';
import { HOME_TITLE, SITE_DESCRIPTION, absoluteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    title: HOME_TITLE,
    description: SITE_DESCRIPTION,
    url: absoluteUrl('/'),
    type: 'website',
  },
};

interface HomeCategory {
  title: string;
  note: string;
  slugs: CalculatorSlug[];
}

const CATEGORIES: HomeCategory[] = [
  {
    title: 'Landscaping materials',
    note: 'Bulk materials sold by the cubic yard, tonne or bag — planned from the area you actually measure.',
    slugs: ['gravel-calculator', 'mulch-calculator', 'topsoil-calculator', 'soil-calculator', 'sand-calculator', 'paver-base-calculator'],
  },
  {
    title: 'Driveways and hardscaping',
    note: 'Layered builds where base, bedding and surface are ordered and priced separately.',
    slugs: ['driveway-gravel-calculator', 'paver-calculator', 'paver-patio-calculator', 'concrete-calculator'],
  },
  {
    title: 'Fencing',
    note: 'Post layout, pickets, panels, rails, concrete and hardware for the fence you are planning.',
    slugs: ['fence-calculator', 'fence-cost-calculator', 'fence-post-calculator'],
  },
  {
    title: 'Decks and concrete',
    note: 'Material take-offs for decking and framing, plus concrete for slabs, footings and post holes.',
    slugs: ['deck-material-calculator', 'concrete-calculator'],
  },
];

const WHY_ESTIMATES_VARY = [
  ['Material density', 'The same volume of gravel, sand or soil weighs different amounts depending on the source, moisture and grading. A weight-based quote and a volume-based quote rarely match exactly.'],
  ['Waste', 'Cuts, compaction losses, spillage and irregular edges all consume material. Every calculator starts from a 10% allowance that you can change for your own job.'],
  ['Compaction', 'Base material and backfill shrink when compacted, so the depth you buy is not the depth you finish with. Compaction factors are shown and can be overridden where the calculator exposes them.'],
  ['Product yields', 'Bagged material is sold by weight or by a stated fill volume, and one bag rarely fills exactly one cubic foot. Bag counts here are planning estimates based on the fill volumes printed on the products.'],
  ['Supplier differences', 'Suppliers sell in different units, round to different increments, load trucks differently, and treat delivery, minimum loads and returns differently.'],
  ['User-entered prices', 'Every cost figure comes from a price you type in. The site does not publish or infer a current market price, because it cannot verify your supplier, region or product.'],
];

const POPULAR_GUIDES: Array<{ label: string; note: string; href: string }> = [
  { label: 'How much gravel do I need?', note: 'Measure an area, choose a depth and convert it into an order that matches how your supplier sells.', href: '/projects/how-much-gravel-do-i-need' },
  { label: 'How to plan a gravel driveway', note: 'Base, middle and surface layers — each with its own depth, material and compaction.', href: '/projects/how-to-plan-a-gravel-driveway' },
  { label: 'How to plan a paver patio', note: 'Shape, base depth, bedding sand and edge restraint, in the order they are built.', href: '/projects/how-to-plan-a-paver-patio' },
  { label: 'How to calculate fence materials', note: 'A complete 100 ft take-off: posts, rails, pickets, concrete and hardware.', href: '/projects/how-to-calculate-fence-materials' },
  { label: 'How to calculate concrete for a slab', note: 'Slab volume, ready-mix rounding and when bags stop making sense.', href: '/projects/how-to-calculate-concrete-for-a-slab' },
  { label: 'Outdoor project cost planning', note: 'The categories a real outdoor budget contains — with prices you supply.', href: '/projects/outdoor-project-cost-planning' },
];

const MATERIAL_REFERENCES: Array<{ label: string; note: string; href: string }> = [
  { label: 'Gravel', note: 'Sizing, uses and how quantities are planned.', href: '/materials/gravel' },
  { label: 'Pea gravel', note: 'Where it works and how coverage is estimated.', href: '/materials/pea-gravel' },
  { label: 'Mulch', note: 'Types, depth guidance, bag versus bulk.', href: '/materials/mulch' },
  { label: 'Topsoil', note: 'What you are buying and how much to order.', href: '/materials/topsoil' },
  { label: 'Sand', note: 'Bedding, leveling and fill sand compared.', href: '/materials/sand' },
  { label: 'Paver base', note: 'Why depth and compaction decide the result.', href: '/materials/paver-base' },
  { label: 'Concrete', note: 'Ready-mix and bagged options for outdoor work.', href: '/materials/concrete' },
  { label: 'Fence materials', note: 'Posts, rails, pickets, panels and hardware.', href: '/materials/fence-materials' },
  { label: 'Decking materials', note: 'Boards, framing and fasteners.', href: '/materials/decking-materials' },
];


const FAQ: Array<{ q: string; a: string }> = [
  { q: 'Are the calculators free, and do I need an account?', a: 'They are free and account-free. Project Mode saves your work in this browser only, so nothing you plan is uploaded or tied to a login.' },
  { q: 'Where do the cost figures come from?', a: 'From prices you enter. The calculators never publish a market price, so a total only reflects the numbers you type in — anything left blank is shown as "Price not entered" instead of being guessed.' },
  { q: 'Why might my supplier quote a different quantity?', a: 'Material density, moisture, bag fill, compaction, truck minimums and the way your supplier rounds an order all change the answer slightly. The estimate puts you in the right range and shows the assumption behind every number.' },
  { q: 'Should I order exactly the quantity shown?', a: 'The recommended order quantity already includes waste and compaction allowances. Treat it as a planning figure, confirm the unit your supplier sells in, and round up where cuts or hand placement are hard to predict.' },
  { q: 'Can I plan more than one material at the same time?', a: 'Yes. Project Mode combines calculation results into one project with an aggregated material list, cost summary and shopping list you can print or save as a PDF.' },
  { q: 'Is my project stored on a server?', a: 'No. It is stored in your browser\'s local storage. Clearing the project removes it, and saving the printable plan as a PDF is how you keep a copy outside the browser.' },
  { q: 'Does this replace professional advice?', a: 'No. The tools are planning aids. They do not provide structural engineering, site surveying, drainage design, code compliance or a professional site assessment where one is needed.' },
  { q: 'Can I change the waste allowance or the density?', a: 'Yes, wherever a calculator exposes the input. Waste is editable on every material calculator, and density or compaction can be overridden when you have supplier-specific figures.' },
];

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="kicker"><CheckIcon size={14}/> Practical project planning</span>
            <h1 className="hero-brandline">Measure. Calculate. Plan.</h1>
            <p>Plan outdoor projects with practical material calculators, transparent assumptions, and project-ready shopping lists.</p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/calculators">Start with a calculator <ArrowRightIcon size={17}/></Link>
              <Link className="button button-secondary" href="/guides">Browse project guides</Link>
            </div>
          </div>
          <div className="hero-card">
            <h2>From measurement to shopping list</h2>
            <p>One tested calculation engine runs every calculator, and Project Mode keeps the results, quantities, entered costs and shopping list together.</p>
            <div className="mini-flow">
              <div><RulerIcon size={17}/><br/>Measure</div>
              <div><CalculatorIcon size={17}/><br/>Calculate</div>
              <div><FolderIcon size={17}/><br/>Plan</div>
              <div><ShieldIcon size={17}/><br/>Verify</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div className="eyebrow">Why use MeasureToBuild?</div>
            <h2>The gap between "I measured it" and "I ordered the right amount".</h2>
            <p>Most outdoor projects go wrong before anyone breaks ground: the dimensions are converted into the wrong unit, the base depth is forgotten, waste is ignored, and the cost estimate is a number nobody can trace back to a price.</p>
          </div>
          <div className="grid-3">
            <article className="card">
              <h3>It solves a measurement problem</h3>
              <p>You already know your patio is 14 ft by 22 ft. The hard part is turning that into cubic yards, tonnes, bags or pieces using the same assumptions your supplier will use — and showing the arithmetic so you can check it.</p>
            </article>
            <article className="card">
              <h3>It keeps quantities and costs together</h3>
              <p>A driveway is not one material. Base, middle and surface layers, or pavers plus base plus bedding sand, all have their own depth, price and order unit. Project Mode keeps them in one plan instead of five browser tabs.</p>
            </article>
            <article className="card">
              <h3>It tells you what it does not know</h3>
              <p>Density, compaction and bag fill vary by product and supplier. Every calculator exposes the assumption it used, so you can replace it with your supplier's figure rather than trusting a black box.</p>
            </article>
          </div>
          <ul className="calc-strip">
            {POPULAR_SLUGS.map((slug) => {
              const definition = getCalculator(slug);
              if (!definition) return null;
              return (
                <li key={slug}>
                  <Link href={`/calculators/${definition.slug}`}>
                    <strong>{definition.name}</strong>
                    <span>{definition.shortDescription}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>


      <section className="section section-soft">
        <div className="container">
          <div className="section-heading">
            <div className="eyebrow">Calculator categories</div>
            <h2>Sixteen calculators, four jobs.</h2>
            <p>Every calculator below calls the same tested engine, so a quantity means the same thing wherever you calculate it.</p>
          </div>
          <div className="grid-2">
            {CATEGORIES.map((category) => (
              <article className="card" key={category.title}>
                <h3>{category.title}</h3>
                <p className="category-note">{category.note}</p>
                <ul className="content-links">
                  {category.slugs.map((slug) => {
                    const definition = getCalculator(slug);
                    if (!definition) return null;
                    return (
                      <li key={`${category.title}-${slug}`}>
                        <Link href={`/calculators/${definition.slug}`}>{definition.name}</Link>
                        <span className="content-link-note">{definition.shortDescription}</span>
                      </li>
                    );
                  })}
                </ul>
              </article>
            ))}
          </div>
          <p className="subtle" style={{ marginTop: 16 }}>
            See the full <Link href="/calculators">calculator directory</Link> for guidance on which calculator answers which question.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div className="eyebrow">How the calculations work</div>
            <h2>Measure → Calculate → Plan → Verify</h2>
            <p>The same four steps run through every calculator and through Project Mode.</p>
          </div>
          <ol className="steps">
            <li>
              <strong>Measure</strong>
              <span className="steps-body">Break the job into areas, layers or components you can actually measure. Multiple areas are supported, so an L-shaped garden bed does not have to be forced into one rectangle.</span>
            </li>
            <li>
              <strong>Calculate</strong>
              <span className="steps-body">The form converts your measurements into typed engine inputs. Area × depth becomes volume, volume becomes cubic yards or tonnes, and waste, compaction and rounding are applied in a fixed, documented order.</span>
            </li>
            <li>
              <strong>Plan</strong>
              <span className="steps-body">Add the result to Project Mode to combine materials, quantities, assumptions, entered prices and a shopping list into one plan you can print or save as a PDF.</span>
            </li>
            <li>
              <strong>Verify</strong>
              <span className="steps-body">Check the assumptions shown with each result against your supplier's packaging, product data and site conditions before you order. The estimate is the starting point for that conversation, not a replacement for it.</span>
            </li>
          </ol>
          <p className="subtle">
            <Link href="/how-it-works">Read the full explanation of the workflow</Link> or the <Link href="/methodology">calculation methodology</Link> for the assumptions behind each calculator.
          </p>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-heading">
            <div className="eyebrow">Why estimates vary</div>
            <h2>Two correct estimates can still differ.</h2>
            <p>None of these are errors. They are the reasons a good estimate is a range plus visible assumptions, not a single guaranteed number.</p>
          </div>
          <ul className="why-list">
            {WHY_ESTIMATES_VARY.map(([title, body]) => (
              <li key={title}><strong>{title}</strong><span>{body}</span></li>
            ))}
          </ul>
        </div>
      </section>


      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div className="eyebrow">Popular project guides</div>
            <h2>Plan the job, not just the material.</h2>
            <p>Each guide walks through the real process behind a calculator: measuring, choosing depths, allowing for waste and what to confirm before ordering.</p>
          </div>
          <div className="grid-3">
            {POPULAR_GUIDES.map((guide) => (
              <article className="tool-card card" key={guide.href}>
                <div className="tool-icon"><BookIcon size={20}/></div>
                <h3>{guide.label}</h3>
                <p>{guide.note}</p>
                <Link className="tool-card-link" href={guide.href}>Read the guide <ArrowRightIcon size={15}/></Link>
              </article>
            ))}
          </div>
          <p className="subtle" style={{ marginTop: 16 }}>
            <Link href="/guides">Browse all project, material and cost guides</Link>
          </p>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-heading">
            <div className="eyebrow">Material references</div>
            <h2>Understand the material before you calculate it.</h2>
            <p>What each product is used for, what changes its quantity, and which calculator plans it.</p>
          </div>
          <ul className="calc-strip">
            {MATERIAL_REFERENCES.map((reference) => (
              <li key={reference.href}>
                <Link href={reference.href}>
                  <strong>{reference.label}</strong>
                  <span>{reference.note}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div className="eyebrow">Frequently asked questions</div>
            <h2>Common questions about the estimates.</h2>
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

      <section className="section">
        <div className="container">
          <div className="cta-card">
            <h2>You can see every assumption — and change the ones that are yours to change</h2>
            <p>
              Waste allowances, depths, densities, compaction factors and prices are inputs, not secrets. Each result
              lists the assumptions it used, the methodology page documents how they combine, and Project Mode keeps the
              assumptions with the calculation so the plan can be reviewed later.
            </p>
            <div className="content-actions hero-actions">
              <Link className="button button-primary" href="/methodology">Read the methodology</Link>
              <Link className="button button-secondary" href="/how-it-works">See how it works</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
