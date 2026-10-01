import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import './content.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CurrencyProvider } from '@/components/currency/CurrencyProvider';
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL, absoluteUrl } from '@/lib/seo';
import { GoogleTag } from '@/components/analytics/GoogleTag';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} — ${SITE_TAGLINE}`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: './' },
  robots: { index: true, follow: true },
  openGraph: { siteName: SITE_NAME, title: SITE_NAME, description: SITE_DESCRIPTION, type: 'website', url: absoluteUrl('/') },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Google tag — rendered into the document <head> on every page, once. */}
        <GoogleTag />
      </head>
      <body>
        <CurrencyProvider><Header/><main className="page">{children}</main><Footer/></CurrencyProvider>
      </body>
    </html>
  );
}
