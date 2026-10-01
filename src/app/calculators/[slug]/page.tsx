import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CALCULATORS, getCalculator, type CalculatorSlug } from '@/components/calculators/registry';
import { CalculatorClient } from '@/components/calculators/CalculatorClient';
import { absoluteUrl, SITE_NAME } from '@/lib/seo';

export function generateStaticParams() { return CALCULATORS.map(c => ({slug:c.slug})); }

export async function generateMetadata({ params }: { params: Promise<{ slug: CalculatorSlug }> }): Promise<Metadata> {
  const {slug}=await params; const c=getCalculator(slug); if(!c) return {};
  return {title:c.metaTitle,description:c.metaDescription,alternates:{canonical:absoluteUrl(`/calculators/${slug}`)},openGraph:{title:`${c.metaTitle} | ${SITE_NAME}`,description:c.metaDescription,url:absoluteUrl(`/calculators/${slug}`),type:'website'}};
}

export default async function CalculatorPage({params}:{params:Promise<{slug:CalculatorSlug}>}) { const {slug}=await params; const c=getCalculator(slug); if(!c) notFound(); const jsonLd={ '@context':'https://schema.org', '@type':'BreadcrumbList', itemListElement:[{ '@type':'ListItem', position:1, name:'Home', item:absoluteUrl('/') },{ '@type':'ListItem', position:2, name:'Calculators', item:absoluteUrl('/calculators') },{ '@type':'ListItem', position:3, name:c.name, item:absoluteUrl(`/calculators/${slug}`) }]}; return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd)}}/><CalculatorClient definition={c}/></>; }
