'use strict';
/** One-off: measure /projects layout details at given widths. */
const { launch, BASE } = require('../lib.cjs');
const { seedProject } = require('./overflow-probe-seed.cjs');

const base = process.argv[2] || BASE;
const WIDTHS = (process.argv[3] || '1263,768,320').split(',').map(Number);

const MEASURE = () => {
  const doc = document.documentElement;
  const rect = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { top: Math.round(r.top), left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width), height: Math.round(r.height) };
  };
  const grid = document.querySelector('.project-grid');
  const leftStack = grid ? grid.children[0] : null;
  const aside = grid ? grid.children[1] : null;
  const firstInLeft = leftStack ? leftStack.firstElementChild : null;
  return {
    innerWidth: window.innerWidth,
    clientWidth: doc.clientWidth,
    scrollWidth: doc.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
    container: rect('.project-page'),
    grid: rect('.project-grid'),
    leftStack: leftStack ? { ...leftStack.getBoundingClientRect().toJSON(), top: Math.round(leftStack.getBoundingClientRect().top), width: Math.round(leftStack.getBoundingClientRect().width), childCount: leftStack.children.length, firstChildTag: firstInLeft ? firstInLeft.className || firstInLeft.tagName : null, firstChildHeight: firstInLeft ? Math.round(firstInLeft.getBoundingClientRect().height) : null } : null,
    aside: aside ? { top: Math.round(aside.getBoundingClientRect().top), width: Math.round(aside.getBoundingClientRect().width), left: Math.round(aside.getBoundingClientRect().left) } : null,
    dashboard: rect('.project-grid .card'),
    tableWrap: rect('.project-page .table-wrap'),
    table: rect('.project-page .content-table'),
    tableScrolls: (() => { const w = document.querySelector('.project-page .table-wrap'); return w ? { scrollWidth: w.scrollWidth, clientWidth: w.clientWidth } : null; })(),
    firstInLeft: (() => {
      const grid = document.querySelector('.project-grid');
      const el = grid && grid.children[0] ? grid.children[0].firstElementChild : null;
      if (!el) return null;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return { html: el.innerHTML.slice(0, 400), height: Math.round(r.height), display: cs.display, padding: cs.padding, margin: cs.margin, minHeight: cs.minHeight, alignSelf: cs.alignSelf, childCount: el.childElementCount };
    })(),
    headerInner: rect('.site-header-inner'),
    footerGrid: rect('.footer-grid'),
  };
};

(async () => {
  const browser = await launch();
  for (const width of WIDTHS) {
    const page = await browser.newPage();
    await page.setViewport({ width, height: 900 });
    await page.goto(`${base}/projects`, { waitUntil: 'networkidle0', timeout: 60000 });
    await page.evaluate((s) => localStorage.setItem('outdoor-project-v1', JSON.stringify(s)), seedProject());
    await page.reload({ waitUntil: 'networkidle0', timeout: 60000 });
    await page.waitForFunction(() => /Project dashboard/.test(document.body.innerText), { timeout: 15000 }).catch(() => {});
    const m = await page.evaluate(MEASURE);
    console.log(`\n=== width ${width} ===`);
    console.log(JSON.stringify(m, null, 1));
    await page.close();
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
