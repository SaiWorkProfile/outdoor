'use strict';
/**
 * Content library QA (development tool).
 *
 * Crawls the 28 content pages against the running production server and checks
 * the things that matter for a page a reader lands on directly: one H1, ordered
 * headings, parseable breadcrumb markup, captioned tables, labelled diagrams,
 * unique element ids, accessible link names, working table-of-contents anchors,
 * and no horizontal overflow at a narrow mobile width.
 */
const { BASE, launch, emptyLog, watch, writeJson } = require('./lib.cjs');

const PAGES = [
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

const PROBE = () => {
  const headings = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).map((h) => Number(h.tagName[1]));
  let headingSkip = null;
  let previous = null;
  for (const level of headings) {
    if (previous !== null && level > previous + 1) { headingSkip = 'h' + previous + ' -> h' + level; break; }
    previous = level;
  }
  const ids = Array.from(document.querySelectorAll('[id]')).map((el) => el.id);
  const duplicateIds = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
  const svgs = Array.from(document.querySelectorAll('.diagram svg'));
  const tables = Array.from(document.querySelectorAll('table.content-table'));
  const links = Array.from(document.querySelectorAll('a[href]'));
  return {
    h1Count: document.querySelectorAll('h1').length,
    headingSkip,
    jsonLdCount: document.querySelectorAll('script[type="application/ld+json"]').length,
    jsonLdParses: Array.from(document.querySelectorAll('script[type="application/ld+json"]')).every((s) => {
      try { JSON.parse(s.textContent || '{}'); return true; } catch { return false; }
    }),
    breadcrumbItems: document.querySelectorAll('nav[aria-label="Breadcrumb"] .breadcrumb-item').length,
    currentCrumbCount: document.querySelectorAll('nav[aria-label="Breadcrumb"] [aria-current="page"]').length,
    mainCount: document.querySelectorAll('main').length,
    tableCount: tables.length,
    uncaptionedTables: tables.filter((t) => !t.querySelector('caption')).length,
    diagramCount: svgs.length,
    unlabelledDiagrams: svgs.filter((s) => !s.getAttribute('aria-label') && !s.querySelector('title')).length,
    unlabelledLinks: links.filter((a) => !(a.textContent || '').trim() && !a.getAttribute('aria-label')).length,
    tocLinks: document.querySelectorAll('.content-toc a').length,
    tocBroken: Array.from(document.querySelectorAll('.content-toc a')).filter((a) => {
      const id = (a.getAttribute('href') || '').replace('#', '');
      return id && !document.getElementById(id);
    }).length,
    duplicateIds,
    overflowPx: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
  };
};

module.exports = { PAGES, PROBE };
