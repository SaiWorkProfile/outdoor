import { CONTENT_PAGES } from '../src/content/index';
import { CALCULATORS } from '../src/components/calculators/registry';
import { CALCULATOR_GUIDES } from '../src/content/guides';
import { isMoneyAmount } from '../src/lib/currency/money-value';

const slugs = new Set(CALCULATORS.map(c=>c.slug));

/** True when a value carries a hand-written currency amount. */
const hasCurrencyAmount = (value:any):boolean => typeof value === 'string' && /[$€£¥₹]\s?\d/.test(value);

/**
 * Prose only. Structured money parts are skipped on purpose: the job of this audit is
 * to find currency written by hand in the copy, not money the components format.
 */
const proseOnly = (value:any):string => {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(proseOnly).join(' ');
  if (isMoneyAmount(value)) return '';
  return String(value ?? '');
};
const text = (page:any):string => {
  const out:string[] = [page.h1, page.metaTitle, page.metaDescription, page.lede, page.limitations];
  for (const f of page.keyFacts ?? []) out.push(f.label, f.value);
  for (const s of page.sections ?? []) { out.push(s.heading); for (const b of s.blocks ?? []) { out.push(b.text??'', b.title??'', b.caption??'', ...(b.items??[]).map((i:any)=> typeof i==='string'?i:`${i.title??''} ${i.body??''}`)); if (b.table){ out.push(b.table.caption??'', b.table.note??'', ...(b.table.rows??[]).flat().map(proseOnly).filter(Boolean)); } } }
  for (const e of page.workedExamples ?? []) { out.push(e.title, e.scenario, e.conclusion, ...(e.inputs??[]).map((r:any)=>`${r.label} ${proseOnly(r.value)}`), ...(e.results??[]).map((r:any)=>`${r.label} ${proseOnly(r.value)} ${proseOnly(r.note)}`)); }
  for (const f of page.faq ?? []) out.push(f.q, f.a);
  for (const s of page.sources ?? []) out.push(s.label, s.note);
  for (const r of page.related ?? []) out.push(r.label, r.note??'');
  return out.filter(Boolean).join('\n');
};

const claimRe = /\b(according to [^,.;]{3,60}|study|studies show|research shows|proven|guarantee[d]?|always lasts|never fails|expert(?:s)? (?:say|agree|recommend)|certified|award-winning|best in class|#1)\b/gi;
const priceRe = /(?:[$\u20ac\u00a3\u00a5\u20b9]|\b(?:USD|EUR|GBP|INR|JPY|CAD|AUD|NZD|SGD|AED|SAR|ZAR|CNY|CHF|SEK|NOK|DKK|PLN|BRL|MXN))\s?\d[\d,]*(?:\.\d{2})?/g;
const unitVariants = { 'cu yd':/\bcu\.? ?yd/gi, 'cubic yard':/cubic yards?/gi, 'yd³':/yd³/g, 'cu ft':/\bcu\.? ?ft/gi, 'cubic foot':/cubic feet/gi, 'sq ft':/\bsq\.? ?ft/gi, 'square foot':/square feet/gi, 'yd3':/yd3/g };

const rows = CONTENT_PAGES.map(p=>{
  const t = text(p);
  const calcRefs = [...new Set((t.match(/[A-Z][a-z]+ Calculator/g)||[]))];
  const badRefs = calcRefs.filter(n=>!CALCULATORS.some(c=>c.name===n));
  const prices = [...new Set(t.match(priceRe)??[])];
  const handwritten = (p.workedExamples??[]).filter((e:any)=>hasCurrencyAmount(e.conclusion)).map((e:any)=>e.title??'untitled');
  const claims = [...new Set(t.match(claimRe)??[])];
  const units = Object.entries(unitVariants).filter(([,re])=>re.test(t)).map(([k])=>k);
  const primary = (p as any).primaryCalculator;
  const related = (p as any).relatedCalculators ?? [];
  const badSlugs = [primary, ...related].filter((s:string)=>s && !slugs.has(s));
  const mentionsMethodology = /methodolog/i.test(t);
  const hasLinkMethodology = JSON.stringify(p).includes('/methodology');
  return { path:p.path, words:t.split(/\s+/).filter(Boolean).length, badRefs, prices, claims, units, badSlugs, handwritten, hasLimitations:!!p.limitations && p.limitations.length>40, mentionsMethodology, hasLinkMethodology, sources:(p.sources??[]).length };
});

console.log(JSON.stringify({
  pages: rows.length,
  currencyNote: 'pagesWithPrices reports only literal currency written in page copy: money rendered by the currency system is formatted at render time and is not listed here.',
  badCalculatorNameRefs: rows.filter(r=>r.badRefs.length).map(r=>({path:r.path,bad:r.badRefs})),
  badCalculatorSlugs: rows.filter(r=>r.badSlugs.length).map(r=>({path:r.path,bad:r.badSlugs})),
  pagesWithPrices: rows.filter(r=>r.prices.length).map(r=>({path:r.path,prices:r.prices})),
  handwrittenCurrencyInConclusions: rows.filter(r=>r.handwritten.length).map(r=>({path:r.path,examples:r.handwritten})),
  claimHits: rows.filter(r=>r.claims.length).map(r=>({path:r.path,claims:r.claims})),
  missingLimitations: rows.filter(r=>!r.hasLimitations).map(r=>r.path),
  noMethodologyMention: rows.filter(r=>!r.mentionsMethodology).map(r=>r.path),
  noMethodologyLink: rows.filter(r=>!r.hasLinkMethodology).map(r=>r.path),
  noSources: rows.filter(r=>r.sources===0).map(r=>r.path),
  unitVariantsPerPage: rows.map(r=>({path:r.path,units:r.units})),
}, null, 2));
console.log('guides entries:', CALCULATOR_GUIDES.length);
