'use strict';
/** Visual quality review: capture full-page and viewport screenshots of key pages. */
const path = require('node:path');
const { BASE, launch, emptyLog, watch, waitForCalculator, clickButton, OUT } = require('./lib.cjs');

const PAGES = [
  ['home', '/'],
  ['calculators-index', '/calculators'],
  ['gravel', '/calculators/gravel-calculator'],
  ['fence-cost', '/calculators/fence-cost-calculator'],
  ['projects', '/projects'],
  ['methodology', '/methodology'],
];

(async () => {
  const browser = await launch();
  // seed a project so /projects and the print plan look realistic
  const seed = await browser.newPage();
  await seed.goto(`${BASE}/calculators/gravel-calculator`, { waitUntil: 'networkidle0' });
  await waitForCalculator(seed);
  await clickButton(seed, 'Calculate');
  await clickButton(seed, 'Add to Project');
  await seed.goto(`${BASE}/calculators/fence-calculator`, { waitUntil: 'networkidle0' });
  await waitForCalculator(seed);
  await clickButton(seed, 'Calculate');
  await clickButton(seed, 'Add to Project');
  await seed.close();

  for (const [name, route] of PAGES) {
    const page = await browser.newPage();
    watch(page, emptyLog());
    await page.setViewport({ width: 1440, height: 1000 });
    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle0' });
    if (route.startsWith('/calculators/')) {
      await waitForCalculator(page);
      await clickButton(page, 'Calculate').catch(() => {});
      await page.evaluate(() => new Promise((r) => setTimeout(r, 150)));
      await page.evaluate(() => document.querySelector('.result-card').scrollIntoView({ block: 'start' }));
      await page.evaluate(() => new Promise((r) => setTimeout(r, 120)));
    }
    if (route === '/projects') await page.evaluate(() => new Promise((r) => setTimeout(r, 250)));
    await page.screenshot({ path: path.join(OUT, `view-${name}.png`), fullPage: false });
    await page.screenshot({ path: path.join(OUT, `full-${name}.png`), fullPage: true });
    // mobile viewport capture for the main calculator
    if (name === 'gravel' || name === 'projects') {
      await page.setViewport({ width: 390, height: 844 });
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.evaluate(() => new Promise((r) => setTimeout(r, 150)));
      await page.screenshot({ path: path.join(OUT, `mobile-${name}.png`), fullPage: false });
    }
    console.log('captured', name);
    await page.close();
  }
  await browser.close();
})();
