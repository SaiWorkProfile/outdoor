import Link from 'next/link';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Terms',
  description: 'Terms of use: estimates are planning aids, you verify quantities before purchase, and Project Mode data lives only in your browser.',
  alternates: { canonical: '/terms' },
};

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

export default function TermsPage() {
  return (
    <div className="container section">
      <Breadcrumbs items={[{ label: 'Terms' }]} />
      <header className="page-intro" style={{ paddingLeft: 0 }}>
        <div className="eyebrow">Terms</div>
        <h1>Terms of use</h1>
        <p>
          This site provides free planning calculators and guides. By using it you agree to these terms — which are
          mainly a plain description of what the estimates are, what they are not, and what stays your
          responsibility.
        </p>
        <p className="page-updated">Last updated: September 30, 2026</p>
      </header>

      <div className="copy content-body">
        <section id="service" aria-labelledby="service-heading">
          <h2 id="service-heading">The service</h2>
          <p>
            The site is free to use without registration. There are no accounts and no paid plans.
            Calculators, Project Mode and the guides are provided as-is for planning purposes.
          </p>
        </section>

        <section id="estimates" aria-labelledby="estimates-heading">
          <h2 id="estimates-heading">Estimates are planning aids</h2>
          <p>
            Every result is a planning estimate produced from your inputs and the published assumptions on the
            <Link href="/methodology"> methodology page</Link>. Quantities can be affected by product packaging,
            material density, site conditions, compaction, waste, supplier rounding and installation methods that
            this site cannot see.
          </p>
          <p>
            Estimates are not structural engineering advice, a property survey, a code or permit determination, or a
            substitute for manufacturer instructions. Where those apply, consult the appropriate qualified
            professional before building or buying.
          </p>
        </section>

        <section id="responsibilities" aria-labelledby="responsibilities-heading">
          <h2 id="responsibilities-heading">Your responsibilities</h2>
          <ul>
            <li>Confirm your measurements — they drive every number the site produces.</li>
            <li>Confirm quantities, packaging, yields and prices with your supplier before ordering.</li>
            <li>Check local codes, permits, drainage and safety requirements that apply to your project.</li>
            <li>Follow manufacturer instructions for any product you install.</li>
          </ul>
          <p>
            Cost figures appear only where a price was entered by you. The site does not publish or invent current
            market prices, and a total built from your prices is only as current as the prices you entered.
          </p>
        </section>

        <section id="storage" aria-labelledby="storage-heading">
          <h2 id="storage-heading">Project Mode data</h2>
          <p>
            Project Mode stores your project in your browser&apos;s local storage only — there is no server copy and
            no backup. Clearing the project, clearing browser site data or switching browsers or devices can remove
            it. You are responsible for keeping any copy you need (for example, printing the plan). Details are in
            the <Link href="/privacy">privacy page</Link>.
          </p>
        </section>

        <section id="warranty" aria-labelledby="warranty-heading">
          <h2 id="warranty-heading">No warranty, limited liability</h2>
          <p>
            The site is provided without warranty of any kind, express or implied, including fitness for a
            particular purpose. To the extent permitted by law, the operator is not liable for decisions, purchases
            or work made in reliance on an estimate produced here. Nothing in these terms limits rights you have
            under applicable law that cannot be waived.
          </p>
        </section>

        <section id="intellectual-property" aria-labelledby="intellectual-property-heading">
          <h2 id="intellectual-property-heading">Intellectual property</h2>
          <p>
            The MeasureToBuild website, software, branding, original diagrams and original written content are
            protected by applicable intellectual-property laws unless otherwise stated. You may use calculator
            results and generated project plans for your own planning and projects. Third-party materials and
            references remain subject to their respective rights and terms.
          </p>
        </section>

        <section id="changes" aria-labelledby="changes-heading">
          <h2 id="changes-heading">Changes and contact</h2>
          <p>
            These terms may be updated as the site changes; the current version always lives at{' '}
            <Link href="/terms">/terms</Link>. Questions about these terms:
            {CONTACT_EMAIL ? (
              <>
                {' '}email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
              </>
            ) : (
              ' contact details are published by the operator of this deployment on this page once configured.'
            )}
          </p>
        </section>
      </div>
    </div>
  );
}
