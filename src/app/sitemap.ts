import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/seo';
import { CALCULATORS } from '@/components/calculators/registry';
import { CONTENT_PAGES } from '@/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ['/', '/calculators', '/guides', '/projects', '/how-it-works', '/methodology', '/about', '/privacy', '/terms'];
  return [
    ...staticPaths.map((path) => ({ url: absoluteUrl(path), lastModified: new Date() })),
    ...CALCULATORS.map((c) => ({ url: absoluteUrl(`/calculators/${c.slug}`), lastModified: new Date() })),
    /* Content library. /projects/print is deliberately absent: it is a browser
       utility page with robots noindex. */
    ...CONTENT_PAGES.map((page) => ({ url: absoluteUrl(page.path), lastModified: new Date() })),
  ];
}

