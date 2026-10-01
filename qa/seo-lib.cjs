'use strict';
/** SEO + link audit against the running production server. */
const { BASE, launch, emptyLog, watch, writeJson } = require('./lib.cjs');

const CALC_SLUGS = [
  'gravel-calculator', 'mulch-calculator', 'topsoil-calculator', 'soil-calculator',
  'sand-calculator', 'pea-gravel-calculator', 'landscape-rock-calculator', 'paver-base-calculator',
  'driveway-gravel-calculator', 'concrete-calculator', 'paver-calculator', 'paver-patio-calculator',
  'fence-calculator', 'fence-cost-calculator', 'fence-post-calculator', 'deck-material-calculator',
];

/* Content library routes (project guides, material references and cost guides). */
const CONTENT_PATHS = [
  '/projects/how-much-gravel-do-i-need',
  '/projects/how-to-calculate-mulch',
  '/projects/how-much-topsoil-do-i-need',
  '/projects/how-to-calculate-landscaping-materials',
  '/projects/how-to-plan-a-gravel-driveway',
  '/projects/how-to-plan-a-fence',
  '/projects/how-to-calculate-fence-materials',
  '/projects/how-to-plan-a-paver-patio',
  '/projects/how-to-calculate-paver-materials',
  '/projects/how-to-calculate-concrete-for-a-slab',
  '/projects/how-to-estimate-deck-materials',
  '/projects/outdoor-project-cost-planning',
  '/materials/gravel',
  '/materials/pea-gravel',
  '/materials/mulch',
  '/materials/topsoil',
  '/materials/sand',
  '/materials/paver-base',
  '/materials/concrete',
  '/materials/fence-materials',
  '/materials/decking-materials',
  '/costs/gravel-cost',
  '/costs/mulch-cost',
  '/costs/fence-cost',
  '/costs/paver-patio-cost',
  '/costs/gravel-driveway-cost',
  '/costs/deck-cost',
  '/costs/landscaping-project-cost',
];

const STATIC_PAGES = ['/', '/calculators', '/guides', '/projects', '/projects/print', '/how-it-works', '/methodology', '/about', '/privacy', '/terms'];
const ALL_PAGES = [...STATIC_PAGES, ...CALC_SLUGS.map((s) => `/calculators/${s}`), ...CONTENT_PATHS];

async function statusOf(url) {
  try {
    const res = await fetch(url, { redirect: 'manual' });
    return res.status;
  } catch (e) {
    return `ERR:${e.message}`;
  }
}

const META_SCRIPT = () => {
  const attr = (sel, name) => { const el = document.querySelector(sel); return el ? el.getAttribute(name) : null; };
  const texts = (sel) => Array.from(document.querySelectorAll(sel)).map((e) => (e.textContent || '').trim());
  return {
    title: document.title,
    description: attr('meta[name="description"]', 'content'),
    canonical: attr('link[rel="canonical"]', 'href'),
    canonicalCount: document.querySelectorAll('link[rel="canonical"]').length,
    robotsMeta: attr('meta[name="robots"]', 'content'),
    ogTitle: attr('meta[property="og:title"]', 'content'),
    ogDescription: attr('meta[property="og:description"]', 'content'),
    ogUrl: attr('meta[property="og:url"]', 'content'),
    ogType: attr('meta[property="og:type"]', 'content'),
    viewport: attr('meta[name="viewport"]', 'content'),
    h1: texts('h1'),
    headingOrder: Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).map((h) => Number(h.tagName[1])),
    breadcrumbNav: !!document.querySelector('nav[aria-label="Breadcrumb"]'),
    breadcrumbText: (document.querySelector('nav[aria-label="Breadcrumb"]') || { textContent: '' }).textContent,
    breadcrumbCurrent: Array.from(document.querySelectorAll('nav[aria-label="Breadcrumb"] [aria-current="page"]')).map((e) => e.textContent.trim()),
    jsonLd: Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map((s) => { try { return JSON.parse(s.textContent || '{}'); } catch { return 'PARSE_ERROR'; } }),
    hrefs: Array.from(document.querySelectorAll('a[href]')).map((a) => a.getAttribute('href')),
    lang: document.documentElement.getAttribute('lang'),
    hasIcon: !!document.querySelector('link[rel="icon"]'),
    iconHref: attr('link[rel="icon"]', 'href'),
  };
};

module.exports = { CALC_SLUGS, STATIC_PAGES, ALL_PAGES, statusOf, META_SCRIPT };
