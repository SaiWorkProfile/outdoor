'use strict';
/** Mobile / responsive QA across 320 -> 1440 px on the production build. */
const { BASE, launch, emptyLog, watch, waitForCalculator, clickButton, writeJson } = require('./lib.cjs');

const WIDTHS = [320, 375, 390, 430, 768, 1024, 1440];
const PAGES = [
  ['/', 'home'],
  ['/calculators', 'index'],
  ['/calculators/gravel-calculator', 'gravel'],
  ['/calculators/fence-calculator', 'fence'],
  ['/calculators/paver-calculator', 'paver'],
  ['/calculators/paver-patio-calculator', 'paver-patio'],
  ['/calculators/concrete-calculator', 'concrete'],
  ['/calculators/deck-material-calculator', 'deck'],
  ['/calculators/fence-cost-calculator', 'fence-cost'],
  ['/projects', 'projects'],
  ['/projects/print', 'print'],
];

const MEASURE = () => {
  const de = document.documentElement;
  const vw = de.clientWidth;
  const wide = [];
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    if (r.right > vw + 1.5 || r.left < -1.5) {
      wide.push({ tag: el.tagName.toLowerCase(), cls: (el.className || '').toString().slice(0, 60), left: Math.round(r.left), right: Math.round(r.right), text: (el.textContent || '').trim().slice(0, 30) });
    }
  }
  const smallTargets = Array.from(document.querySelectorAll('button, a.button, input[type="checkbox"], select'))
    .map((el) => {
      const target = el.matches('input[type="checkbox"]') && el.closest('label') ? el.closest('label') : el;
      const r = target.getBoundingClientRect();
      return { tag: el.tagName.toLowerCase(), text: (el.textContent || el.value || '').trim().slice(0, 24), h: Math.round(r.height), w: Math.round(r.width), effective: target !== el };
    })
    .filter((x) => x.h > 0 && x.h < 40);
  const inputsOffscreen = Array.from(document.querySelectorAll('input, select, textarea'))
    .filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && (r.right > vw + 1.5 || r.left < -1.5); })
    .map((el) => ({ id: el.id || null, tag: el.tagName.toLowerCase() }));
  const tableOverflow = Array.from(document.querySelectorAll('table')).map((t) => ({
    cls: (t.className || '').toString(),
    scrollWidth: t.scrollWidth,
    clientWidth: t.clientWidth,
    parentOverflowX: getComputedStyle(t.parentElement).overflowX,
    rows: t.querySelectorAll('tr').length,
  }));
  const nav = document.querySelector('.main-nav');
  return {
    viewportWidth: vw,
    scrollWidth: de.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
    horizontalScroll: de.scrollWidth > vw + 1,
    overflowingElements: wide.slice(0, 8),
    overflowingCount: wide.length,
    smallTargets: smallTargets.slice(0, 8),
    smallTargetCount: smallTargets.length,
    inputsOffscreen,
    tableOverflow,
    navDisplay: nav ? getComputedStyle(nav).display : null,
    navVisible: nav ? nav.getBoundingClientRect().height > 0 : null,
    headerOverflow: (() => { const h = document.querySelector('.site-header-inner'); if (!h) return null; return h.scrollWidth > h.clientWidth + 1; })(),
    contentHeight: de.scrollHeight,
  };
};

(async () => {
  const browser = await launch();
  const report = {};

  // seed a project so /projects and /projects/print have realistic long tables
  const seed = await browser.newPage();
  await seed.goto(`${BASE}/calculators/fence-calculator`, { waitUntil: 'networkidle0' });
  await waitForCalculator(seed);
  await clickButton(seed, 'Calculate');
  await clickButton(seed, 'Add to Project');
  await seed.goto(`${BASE}/calculators/deck-material-calculator`, { waitUntil: 'networkidle0' });
  await waitForCalculator(seed);
  await clickButton(seed, 'Calculate');
  await clickButton(seed, 'Add to Project');
  await seed.goto(`${BASE}/calculators/gravel-calculator`, { waitUntil: 'networkidle0' });
  await waitForCalculator(seed);
  await clickButton(seed, 'Calculate');
  await clickButton(seed, 'Add to Project');
  await seed.close();

  for (const [route, name] of PAGES) {
    report[name] = { route, widths: {} };
    for (const w of WIDTHS) {
      const page = await browser.newPage();
      const log = watch(page, emptyLog());
      await page.setViewport({ width: w, height: 900, deviceScaleFactor: 1 });
      await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle0', timeout: 30000 });
      if (route.includes('/calculators/')) {
        await waitForCalculator(page);
        await clickButton(page, 'Calculate').catch(() => {});
        await page.evaluate(() => new Promise((r) => setTimeout(r, 80)));
      }
      const m = await page.evaluate(MEASURE);
      m.console = log.console.length + log.pageErrors.length;
      report[name].widths[w] = m;
      if (w === 375 || w === 1440) {
        await page.screenshot({ path: `${require('path').join(__dirname, 'artifacts')}/shot-${name}-${w}.png`, fullPage: false });
      }
      await page.close();
    }
  }
  writeJson('responsive.json', report);

  const summary = {};
  for (const [name, data] of Object.entries(report)) {
    const issues = [];
    for (const [w, m] of Object.entries(data.widths)) {
      if (m.horizontalScroll) issues.push(`${w}px: horizontal scroll (${m.scrollWidth} > ${m.viewportWidth})`);
      if (m.inputsOffscreen.length) issues.push(`${w}px: ${m.inputsOffscreen.length} input(s) outside viewport`);
      if (m.smallTargetCount) issues.push(`${w}px: ${m.smallTargetCount} tap target(s) under 40px`);
      if (m.headerOverflow) issues.push(`${w}px: header overflow`);
      const badTables = m.tableOverflow.filter((t) => t.scrollWidth > m.viewportWidth && !/auto|scroll/.test(t.parentOverflowX || ''));
      if (badTables.length) issues.push(`${w}px: ${badTables.length} table(s) wider than viewport`);
    }
    summary[name] = { issues: [...new Set(issues)], overflowing: Object.fromEntries(Object.entries(data.widths).map(([w, m]) => [w, m.overflowingElements.map((e) => e.tag + '.' + e.cls)])) };
  }
  console.log(JSON.stringify(summary, null, 2));
  await browser.close();
})();
