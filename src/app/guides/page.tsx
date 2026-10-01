import Link from 'next/link';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { CONTENT_BY_CLUSTER } from '@/content';
import type { Cluster } from '@/content/types';

export const metadata: Metadata = {
  title: 'Guides',
  description: 'Every project, material and cost guide in one place: how the job is measured, what changes the quantity, what changes the price, and which calculator to use for it.',
  alternates: { canonical: '/guides' },
  openGraph: {
    title: 'Outdoor project guides',
    description: 'Project, material and cost guides for outdoor planning — each one backed by the same calculation engine.',
    url: '/guides',
    type: 'website',
  },
};

const CLUSTERS: Array<{ id: Cluster; title: string; blurb: string }> = [
  {
    id: 'projects',
    title: 'Project guides',
    blurb: 'The real-world planning process behind each calculator: what to measure, which depth to choose, where waste hides and what to confirm before ordering.',
  },
  {
    id: 'materials',
    title: 'Material guides',
    blurb: 'What each material is, what changes its quantity, how it is usually sold and which calculator plans it.',
  },
  {
    id: 'costs',
    title: 'Cost guides',
    blurb: 'What actually moves the price of a job — and why two quotes for the same quantity differ. Every price in these guides is yours to enter.',
  },
];

export default function GuidesPage() {
  return (
    <div className="container section">
      <Breadcrumbs items={[{ label: 'Guides' }]} />
      <div className="page-intro" style={{ paddingLeft: 0 }}>
        <div className="eyebrow">Guide library</div>
        <h1>Outdoor project guides</h1>
        <p>
          Twenty-eight guides in three groups: how to run a project, what the materials are, and what changes the
          price. Every worked figure in them is produced by the same engine the calculators use, so the examples and
          the calculators can never disagree.
        </p>
      </div>

      {CLUSTERS.map((cluster) => (
        <section className="category-block" key={cluster.id} aria-labelledby={`cluster-${cluster.id}`}>
          <h2 id={`cluster-${cluster.id}`}>{cluster.title}</h2>
          <p className="category-note">{cluster.blurb}</p>
          <ul className="calc-strip">
            {CONTENT_BY_CLUSTER[cluster.id].map((page) => (
              <li key={page.path}>
                <Link href={page.path}>
                  <strong>{page.h1}</strong>
                  <span>{page.lede}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="category-block" aria-labelledby="guides-where-next">
        <h2 id="guides-where-next">Where to start</h2>
        <p className="category-note">
          If you have measurements in hand, open a calculator and add its result to Project Mode — the guides are
          there for the judgement calls the calculator cannot make for you.
        </p>
        <div className="content-actions">
          <Link className="button button-primary" href="/calculators">Browse calculators</Link>
          <Link className="button button-secondary" href="/projects">Open Project Mode</Link>
        </div>
      </section>
    </div>
  );
}
