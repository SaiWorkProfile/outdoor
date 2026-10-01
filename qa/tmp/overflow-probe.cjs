'use strict';
/**
 * Horizontal-overflow probe for /projects.
 * Reuses qa/lib.cjs (puppeteer-core + local Chrome). Usage:
 *   node qa/tmp/overflow-probe.cjs [baseUrl]
 * Prints, per viewport width, the page scrollWidth and every element that
 * extends past the viewport (and is not clipped by an overflow ancestor).
 */
const path = require('node:path');
const { launch, BASE } = require('../lib.cjs');

const base = process.argv[2] || BASE;
const WIDTHS = [320, 360, 375, 414, 480, 600, 680, 681, 768, 834, 900, 980, 981, 1000, 1024, 1100, 1180, 1212, 1263, 1300, 1366, 1440, 1512, 1600, 1920];

/* A realistic project: matches the user's screenshot (fence calculation). */
function seedProject() {
  const now = new Date().toISOString();
  return {
    id: 'local-project',
    name: 'My Outdoor Project — backyard fence and patio plan',
    date: now,
    unitSystem: 'us',
    areas: [{ id: 'a1', name: 'Patio area', shape: { kind: 'rectangle', length: 20, width: 30 } }],
    materials: [{
      id: 'fence-1',
      name: 'Fence Project',
      calculator: 'fence',
      calculatorName: 'Fence Calculator',
      role: 'framing',
      quantities: [
        { label: 'Total posts', quantity: 15, unit: 'posts', orderQuantity: 15, orderUnit: 'posts' },
        { label: 'Rails', quantity: 27, unit: 'rails', orderQuantity: 27, orderUnit: 'rails' },
        { label: 'Pickets', quantity: 226, unit: 'pickets', orderQuantity: 226, orderUnit: 'pickets' },
        { label: 'Post-hole concrete', quantity: 1.25, unit: 'cubic yards', orderQuantity: 1.25, orderUnit: 'bags' },
        { label: 'Hardware', quantity: 995, unit: 'each', orderQuantity: 995, orderUnit: 'each' },
      ],
      costs: [{ label: 'Fence Project materials', amount: 11, category: 'material', enteredPrice: 11, quantity: 1 }],
      inputs: [{ label: 'Fence length', value: '120 linear ft' }, { label: 'Panel width', value: '8 ft' }],
      results: [{ label: 'Fence runs', value: '2 runs' }, { label: 'Corners', value: '1 corner' }],
      assumptions: [{ key: 'waste', label: 'Waste factor', value: 10, unit: '%', editable: true, source: 'engine-default' }],
    }],
    costs: {
      currencyCode: 'USD', enteredMaterialCost: 11, enteredLaborCost: 0, enteredOtherCost: 0,
      totalEnteredCost: 11, isComplete: false, missingPrices: ['Pickets'],
      lines: [{ label: 'Fence Project materials', amount: 11, category: 'material' }],
      extraLines: [{ label: 'Permit', amount: 0, category: 'other' }],
    },
    waste: { materialWaste: [{ materialName: 'Pickets', percent: 10 }] },
    shoppingList: [
      { id: 'k1', category: 'material', name: 'Fence Project — Total posts', quantity: 15, unit: 'posts', checked: false },
      { id: 'k2', category: 'material', name: 'Fence Project — Rails', quantity: 27, unit: 'rails', checked: false },
      { id: 'k3', category: 'material', name: 'Fence Project — Pickets', quantity: 226, unit: 'pickets', checked: false },
      { id: 'k4', category: 'material', name: 'Fence Project — Post-hole concrete', quantity: 1.25, unit: 'bags', checked: true },
      { id: 'k5', category: 'hardware', name: 'Fence Project — Hardware', quantity: 995, unit: 'each', checked: false },
    ],
    notes: ['Delivery window — confirm with supplier before ordering materials.'],
    assumptions: [],
    methodologyDisclaimer: 'Calculations are planning estimates. Verify dimensions before purchasing.',
  };
}

const MEASURE = () => {
  const doc = document.documentElement;
  const vw = window.innerWidth;
  const layoutW = doc.clientWidth; // viewport minus classic scrollbar (the true layout width)
  const scrollW = Math.max(doc.scrollWidth, document.body ? document.body.scrollWidth : 0);
  const page = document.querySelector('.project-page');
  const pageRect = page ? page.getBoundingClientRect() : null;
  const clippedBy = (el) => {
    let p = el.parentElement;
    while (p) {
      const ov = getComputedStyle(p);
      if (['auto', 'hidden', 'scroll', 'clip'].includes(ov.overflowX)) return p.className || p.tagName;
      p = p.parentElement;
    }
    return null;
  };
  const selPath = (el) => {
    const parts = [];
    while (el && el !== document.body && parts.length < 5) {
      let s = el.tagName.toLowerCase();
      if (el.className && typeof el.className === 'string') s += '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.');
      parts.unshift(s);
      el = el.parentElement;
    }
    return parts.join(' > ');
  };
  const offenders = [];
  const frameViolations = [];
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    const clipped = clippedBy(el);
    if ((r.right > layoutW + 0.5 || r.left < -0.5) && !clipped) {
      offenders.push({ sel: selPath(el), left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width), clipped, text: (el.textContent || '').trim().slice(0, 60) });
    }
    // "No cuts": nothing inside the page frame may render past the frame edge.
    if (pageRect && !clipped && el !== page && page.contains(el)
      && (r.right > pageRect.right + 0.5 || r.left < pageRect.left - 0.5)) {
      frameViolations.push({ sel: selPath(el), left: Math.round(r.left), right: Math.round(r.right), pageRight: Math.round(pageRect.right), text: (el.textContent || '').trim().slice(0, 60) });
    }
  }
  return {
    innerWidth: vw,
    layoutWidth: layoutW,
    scrollWidth: scrollW,
    overflow: scrollW - layoutW,
    offenders: offenders.slice(0, 12),
    frameViolations: frameViolations.slice(0, 12),
    tableScrolls: (() => { const w = document.querySelector('.project-page .table-wrap'); return w ? { scrollWidth: w.scrollWidth, clientWidth: w.clientWidth } : null; })(),
    firstInLeftHeight: (() => { const g = document.querySelector('.project-grid'); const el = g && g.children[0] ? g.children[0].firstElementChild : null; return el ? Math.round(el.getBoundingClientRect().height) : null; })(),
  };
};

(async () => {
  const browser = await launch();
  const report = [];
  for (const width of WIDTHS) {
    const page = await browser.newPage();
    await page.setViewport({ width, height: 900 });
    await page.goto(`${base}/projects`, { waitUntil: 'networkidle0', timeout: 60000 });
    await page.evaluate((seed) => localStorage.setItem('outdoor-project-v1', JSON.stringify(seed)), seedProject());
    await page.reload({ waitUntil: 'networkidle0', timeout: 60000 });
    // Wait for hydration (project dashboard rendered from seeded storage).
    const rendered = await page.waitForFunction(() => /Project dashboard/.test(document.body.innerText), { timeout: 15000 })
      .then(() => true).catch(() => false);
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    if (!rendered) {
      const body = await page.evaluate(() => document.body.innerText.slice(0, 200));
      console.log(`[ERROR] width=${width} — dashboard not rendered. Body: ${JSON.stringify(body)}`);
      await page.close();
      report.push({ width, overflow: -1, error: true });
      continue;
    }
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    const m = await page.evaluate(MEASURE);
    report.push({ width, ...m });
    const bad = m.overflow > 0 || m.frameViolations.length > 0;
    console.log(`[${bad ? 'FAIL' : 'PASS'}] width=${width} layout=${m.layoutWidth} scrollWidth=${m.scrollWidth} overflow=${m.overflow} frame=${m.frameViolations.length} table=${m.tableScrolls ? `${m.tableScrolls.scrollWidth}/${m.tableScrolls.clientWidth}` : '-'} firstChild=${m.firstInLeftHeight}`);
    for (const o of m.offenders) console.log(`    overflow - ${o.sel} right=${o.right} :: "${o.text}"`);
    for (const o of m.frameViolations) console.log(`    frame    - ${o.sel} left=${o.left} right=${o.right} pageRight=${o.pageRight} :: "${o.text}"`);
    if ([320, 768, 1263, 1920].includes(width)) {
      const file = path.join(__dirname, `projects-${width}.png`);
      await page.screenshot({ path: file });
      console.log(`    screenshot: ${file}`);
    }
    // Second pass with the "Add calculation" chooser open (panel must stay framed too).
    if ([320, 768, 981, 1263].includes(width)) {
      await page.evaluate(() => {
        const b = [...document.querySelectorAll('button')].find((x) => /add calculation/i.test(x.textContent || ''));
        if (b) b.click();
      });
      await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
      const p = await page.evaluate(MEASURE);
      const pbad = p.overflow > 0 || p.frameViolations.length > 0;
      report.push({ width, panelOpen: true, ...p });
      console.log(`[${pbad ? 'FAIL' : 'PASS'}] width=${width} (panel open) overflow=${p.overflow} frame=${p.frameViolations.length}`);
      for (const o of p.offenders) console.log(`    overflow - ${o.sel} right=${o.right} :: "${o.text}"`);
      for (const o of p.frameViolations) console.log(`    frame    - ${o.sel} left=${o.left} right=${o.right} pageRight=${o.pageRight} :: "${o.text}"`);
      if (width === 1263) await page.screenshot({ path: path.join(__dirname, 'projects-1263-panel.png') });
    }
    await page.close();
  }
  await browser.close();
  const failing = report.filter((r) => r.overflow > 0 || (r.frameViolations && r.frameViolations.length > 0));
  const errored = report.filter((r) => r.error);
  console.log(failing.length || errored.length ? `\n${failing.length} check(s) overflow or leave the frame, ${errored.length} errored.` : '\nNo horizontal overflow and no frame violations at any width.');
  process.exit(failing.length || errored.length ? 1 : 0);
})().catch((err) => { console.error(err); process.exit(2); });