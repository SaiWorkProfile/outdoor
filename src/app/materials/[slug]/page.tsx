import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ContentPageView } from '@/components/content/ContentPageView';
import { pagesInCluster } from '@/content';
import { breadcrumbJsonLd, contentBreadcrumbs, contentMetadata, contentStaticParams } from '@/content/route-helper';

const CLUSTER = 'materials' as const;

export function generateStaticParams() {
  return contentStaticParams(pagesInCluster(CLUSTER));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = pagesInCluster(CLUSTER).find((entry) => entry.slug === slug);
  return page ? contentMetadata(page) : {};
}

export default async function MaterialGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = pagesInCluster(CLUSTER).find((entry) => entry.slug === slug);
  if (!page) notFound();
  const jsonLd = breadcrumbJsonLd(contentBreadcrumbs(page));
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ContentPageView page={page} />
    </>
  );
}
