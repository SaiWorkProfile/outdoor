import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  async redirects() {
    /* Short aliases for the four headline calculators. The canonical, indexable slugs
       stay exactly as they are (/calculators/gravel-calculator etc.); these aliases only
       make the short forms resolve instead of 404. */
    return [
      { source: '/calculators/gravel', destination: '/calculators/gravel-calculator', permanent: true },
      { source: '/calculators/fence', destination: '/calculators/fence-calculator', permanent: true },
      { source: '/calculators/paver', destination: '/calculators/paver-calculator', permanent: true },
      { source: '/calculators/concrete', destination: '/calculators/concrete-calculator', permanent: true },
    ];
  },
};

export default nextConfig;
