import type { ContentPage } from './types';
import { absoluteUrl } from '@/lib/seo';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function contentStaticParams(pages: ContentPage[]): Array<{ slug: string }> {
  return pages.map((page) => ({ slug: page.slug }));
}

export function contentMetadata(page: ContentPage) {
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: absoluteUrl(page.path) },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: absoluteUrl(page.path),
      type: 'article' as const,
    },
  };
}

/**
 * BreadcrumbList for a content page.
 *
 * Only crumbs that resolve to a real URL are emitted in structured data, so
 * every `item` in the markup is a live page. Project guides sit under the
 * existing /projects route; material and cost guides are top-level sections
 * without a landing page, so their visible breadcrumb is two levels and the
 * markup matches it.
 */
export function contentBreadcrumbs(page: ContentPage): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];
  if (page.cluster === 'projects') items.push({ label: 'Projects', href: '/projects' });
  items.push({ label: page.crumb });
  return items;
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };
}
