'use strict';
const path = require('node:path');
const { BASE, launch, emptyLog, watch, waitForCalculator, clickButton, OUT } = require('./lib.cjs');

const CONTRAST = (selectors) => {
  const rgb = (c) => { const m = String(c).match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(',').map((x) => parseFloat(x)); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const lum = ({ r, g, b }) => { const f = (v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const ratio = (fg, bg) => { const a = lum(fg), b = lum(bg); return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05); };
  const bgOf = (el) => { let n = el; while (n && n !== document.documentElement) { const c = rgb(getComputedStyle(n).backgroundColor); if (c && c.a > 0.6) return c; n = n.parentElement; } return { r: 255, g: 255, b: 255, a: 1 }; };
  const out = [];
  for (const sel of selectors) {
    for (const el of Array.from(document.querySelectorAll(sel)).slice(0, 3)) {
      const cs = getComputedStyle(el);
      const fg = rgb(cs.color);
      if (!fg) continue;
      const bg = bgOf(el);
      const r = ratio(fg, bg);
      out.push({ sel, inResultCard: !!el.closest('.result-card'), ratio: Number(r.toFixed(2)), pass: r >= 4.5, color: cs.color, bg: `rgb(${bg.r},${bg.g},${bg.b})`, text: (el.textContent || '').trim().slice(0, 30) });
    }
  }
  return out;
};

(async () => {
  const browser = await launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1200 });

  // projects page: metrics on a white card
  await page.goto(`${BASE}/calculators/gravel-calculator`, { waitUntil: 'networkidle0' });
  await waitForCalculator(page);
  await clickButton(page, 'Calculate');
  await clickButton(page, 'Add to Project');
  await page.goto(`${BASE}/projects`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('#project-name', { timeout: 10000 });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 200)));
  await page.screenshot({ path: path.join(OUT, 'bug-projects-metrics.png'), clip: await page.evaluate(() => { const el = document.querySelector('.sticky-result, aside'); const r = el.getBoundingClientRect(); return { x: Math.max(0, r.x - 8), y: Math.max(0, r.y - 8), width: Math.min(520, r.width + 16), height: Math.min(700, r.height + 16) }; }) });
  console.log('PROJECTS metrics:', JSON.stringify(await page.evaluate(CONTRAST, ['.metric-label', '.metric-value', '.metric', '.total-box', '.shopping-item', '.qty-row']), null, 1));

  // calculator result card: notices + metrics on the dark card
  await page.goto(`${BASE}/calculators/fence-calculator`, { waitUntil: 'networkidle0' });
  await waitForCalculator(page);
  await clickButton(page, 'Calculate');
  await page.evaluate(() => new Promise((r) => setTimeout(r, 150)));
  const cardBox = await page.evaluate(() => { const el = document.querySelector('.result-card'); const r = el.getBoundingClientRect(); return { x: Math.max(0, r.x), y: Math.max(0, r.y), width: r.width, height: Math.min(1400, r.height) }; });
  await page.evaluate(() => document.querySelector('.result-card').scrollIntoView());
  await page.evaluate(() => new Promise((r) => setTimeout(r, 200)));
  const box2 = await page.evaluate(() => { const el = document.querySelector('.result-card'); const r = el.getBoundingClientRect(); return { x: Math.max(0, r.x), y: Math.max(0, r.y), width: r.width, height: Math.min(1500, r.height) }; });
  await page.screenshot({ path: path.join(OUT, 'bug-result-card.png'), clip: box2 });
  console.log('RESULT CARD:', JSON.stringify(await page.evaluate(CONTRAST, ['.metric-label', '.metric-value', '.notice', '.notice strong', '.result-table td', '.shopping-item', '.result-card .button-secondary', '.result-card .subtle']), null, 1));
  await browser.close();
})();
