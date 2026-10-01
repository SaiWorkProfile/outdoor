'use strict';
const { BASE, launch, emptyLog, watch, waitForCalculator, labelSelector, clickButton } = require('./lib.cjs');

const dump = (page) => page.evaluate(() => Array.from(document.querySelectorAll('.field')).map((f) => {
  const l = f.querySelector('label');
  const c = f.querySelector('input, select, textarea');
  return `${l ? l.textContent.trim() : '(none)'} = ${c ? c.value : '(no control)'}`;
}));

(async () => {
  const browser = await launch();
  for (const slug of ['concrete-calculator', 'paver-patio-calculator', 'deck-material-calculator']) {
    const page = await browser.newPage();
    const log = watch(page, emptyLog());
    await page.goto(`${BASE}/calculators/${slug}`, { waitUntil: 'networkidle0' });
    await waitForCalculator(page);
    console.log(`\n=== ${slug} :: initial ===`);
    console.log((await dump(page)).join('\n'));

    // simulate the exact helper flow used by calc.cjs
    const sel = await labelSelector(page, 'Length');
    console.log('selector for "Length":', sel);
    await page.click(sel, { clickCount: 3 });
    await page.keyboard.press('Backspace');
    await (await page.$(sel)).type('10', { delay: 1 });
    await page.evaluate((s) => document.querySelector(s).blur(), sel);
    console.log(`\n=== ${slug} :: after typing 10 into "Length" ===`);
    console.log((await dump(page)).join('\n'));
    console.log('console:', JSON.stringify(log.console));
    await page.close();
  }
  await browser.close();
})();
