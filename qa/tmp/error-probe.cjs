'use strict';
/** Capture console + page errors on /projects, with and without seeded storage. */
const { launch, BASE } = require('../lib.cjs');
const { seedProject } = require('./overflow-probe-seed.cjs');

const base = process.argv[2] || BASE;

async function run(browser, label, seed) {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}\n${e.stack || ''}`));
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(`console: ${msg.text()}`); });
  await page.setViewport({ width: 1274, height: 900 });
  await page.goto(`${base}/projects`, { waitUntil: 'networkidle0', timeout: 60000 });
  if (seed) {
    await page.evaluate((s) => localStorage.setItem('outdoor-project-v1', JSON.stringify(s)), seedProject());
    await page.reload({ waitUntil: 'networkidle0', timeout: 60000 });
  }
  await new Promise((r) => setTimeout(r, 1500));
  const state = await page.evaluate(() => ({
    text: document.body.innerText.slice(0, 300),
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
    hasDashboard: /Project dashboard/.test(document.body.innerText),
    hasError: /Application error/.test(document.body.innerText),
  }));
  console.log(`\n=== ${label} ===`);
  console.log(JSON.stringify(state, null, 2));
  if (errors.length) { console.log('--- errors ---'); console.log(errors.slice(0, 6).join('\n')); }
  await page.close();
}

(async () => {
  const browser = await launch();
  await run(browser, 'WITHOUT seed', false);
  await run(browser, 'WITH seed', true);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
