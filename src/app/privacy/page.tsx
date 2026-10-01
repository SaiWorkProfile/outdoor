import Link from 'next/link';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { CONTACT_EMAIL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'How this site handles data: calculator inputs stay in your browser, Project Mode uses local storage only, and Google Analytics measures site usage such as pages viewed, approximate location, and device information.',
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: 'Privacy',
    description: 'How this site handles data: calculator inputs stay in your browser, Project Mode uses local storage only, and Google Analytics measures site usage such as pages viewed, approximate location, and device information.',
    url: '/privacy',
    type: 'website',
  },
};

export default function PrivacyPage() {
  return (
    <div className="container section">
      <Breadcrumbs items={[{ label: 'Privacy' }]} />
      <header className="page-intro" style={{ paddingLeft: 0 }}>
        <div className="eyebrow">Privacy</div>
        <h1>Privacy on this site</h1>
        <p>
          The short version: calculator inputs are processed in your browser, Project Mode
          saves to your browser&apos;s local storage, and MeasureToBuild does not transmit
          Project Mode data to a MeasureToBuild server. There are no accounts, and
          advertising is not currently served on this site. Google Analytics is used to
          measure site usage and traffic.
        </p>
        <p className="page-updated">Last updated: October 1, 2026</p>
      </header>

      <div className="copy content-body">
        <section id="what-we-collect" aria-labelledby="what-we-collect-heading">
          <h2 id="what-we-collect-heading">What this site collects</h2>
          <p>
            You do not create an account, and there is no form that asks for your name or
            email address. Calculator measurements are processed in your browser, and the
            values you enter are not transmitted to a MeasureToBuild server.
          </p>
          <p>
            MeasureToBuild uses Google Analytics 4 to understand how the site is used.
            Depending on Analytics settings and the visitor&apos;s environment, this may
            include information such as pages viewed, session activity, approximate
            geographic location, browser and device information, and Analytics identifiers
            stored in cookies. Google Analytics does not receive the values you enter into
            the calculators or the data stored by Project Mode.
          </p>
          <p>
            Google Analytics is provided by Google. For more information about how Google
            handles data in its services, see{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google&apos;s Privacy Policy
            </a>.
          </p>
        </section>

        <section id="local-storage" aria-labelledby="local-storage-heading">
          <h2 id="local-storage-heading">Project Mode and local storage</h2>
          <p>
            If you use <Link href="/projects">Project Mode</Link>, your project is saved under the key
            {' '}<code>outdoor-project-v1</code> in your browser&apos;s local storage. It can include your project
            name, areas, calculation results, material lines, cost entries, shopping list items and the assumptions
            shown with them.
          </p>
          <p>
            That data stays on your device. It is never uploaded, synced or shared, and there is no server copy to
            delete — because none exists. Clearing the project inside Project Mode, or clearing your browser&apos;s
            site data, removes it permanently.
          </p>
        </section>

        <section id="cookies" aria-labelledby="cookies-heading">
          <h2 id="cookies-heading">Cookies</h2>
          <p>
            Google Analytics may set first-party cookies in your browser, including
            <code>_ga</code> and <code>_ga_&lt;id&gt;</code>, to distinguish visitors and
            sessions and measure how the site is used. Google Analytics may also process
            information such as approximate geographic location, browser and device
            information, and page or session activity. You can block or delete cookies
            through your browser settings. The calculators continue to provide their core
            functionality without Analytics cookies. As with most websites, the hosting
            provider may also keep standard technical request logs (such as IP address,
            time and requested path) for its own operational purposes, handled by the host
            under the host&apos;s policies.
          </p>
        </section>

        <section id="external-links" aria-labelledby="external-links-heading">
          <h2 id="external-links-heading">External links</h2>
          <p>
            Guides may link to external references and calculators link to your suppliers&apos; websites. Those
            sites are governed by their own privacy policies, which this site does not control.
          </p>
        </section>

        <section id="contact" aria-labelledby="contact-heading">
          <h2 id="contact-heading">Contact</h2>
          {CONTACT_EMAIL ? (
            <p>
              For questions about this page, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          ) : (
            <p>Contact details for this deployment are published by its operator on this page once configured.</p>
          )}
        </section>

        <section id="changes" aria-labelledby="changes-heading">
          <h2 id="changes-heading">Changes to this page</h2>
          <p>
            If the site&apos;s data handling changes, this page will be updated to match. The current version always
            lives at <Link href="/privacy">/privacy</Link>.
          </p>
          <p>
            See the <Link href="/terms">terms of use</Link> for how estimates produced by the calculators may be
            used, and the <Link href="/methodology">methodology page</Link> for how those estimates are made.
          </p>
        </section>
      </div>
    </div>
  );
}
