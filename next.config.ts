import type { NextConfig } from 'next';

/* The canonical production origin. Keep this in step with NEXT_PUBLIC_SITE_URL
   (.env.production) and with the fallback in src/lib/seo.ts. */
const CANONICAL_ORIGIN = 'https://www.measuretobuild.in';
const APEX_HOST = 'measuretobuild.in';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  async redirects() {
    return [
      /* Host normalisation: the apex host is a single permanent redirect to the
         canonical www origin, preserving path and query. Next.js matches the `host`
         value against the request hostname with an exact `^value$` test, so this rule
         never fires for www.measuretobuild.in and cannot loop. HTTP -> HTTPS is
         enforced by the hosting platform (a protocol-based app redirect risks loops
         behind a proxy), so it is intentionally not duplicated here. */
      { source: '/:path*', has: [{ type: 'host', value: APEX_HOST }], destination: `${CANONICAL_ORIGIN}/:path*`, permanent: true },
      /* Short aliases for the four headline calculators. The canonical, indexable slugs
         stay exactly as they are (/calculators/gravel-calculator etc.); these aliases only
         make the short forms resolve instead of 404. */
      { source: '/calculators/gravel', destination: '/calculators/gravel-calculator', permanent: true },
      { source: '/calculators/fence', destination: '/calculators/fence-calculator', permanent: true },
      { source: '/calculators/paver', destination: '/calculators/paver-calculator', permanent: true },
      { source: '/calculators/concrete', destination: '/calculators/concrete-calculator', permanent: true },
    ];
  },
};

export default nextConfig;
