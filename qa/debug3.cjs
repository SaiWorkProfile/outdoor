'use strict';
const { BASE, launch, emptyLog, watch, waitForCalculator, setFirstNumberInput, setByLabel, labelSelector, clickButton } = require('./lib.cjs');

(async () => {
  const browser = await launch();
  const page = await browser.newPage();
  const log = emptyLog();
  watch(page, log);
  page.on('framenavigated', (f) => { if (f === page.mainFrame()) console.log('  >>> NAVIGATED to', f.url()); });
  await page.setViewport({ width: 1440, height: 1000 });
  await page.goto(`${BASE}/calculators/fence-cost-calculator`, { waitUntil: 'networkidle0' });
  await waitForCalculator(page);
  console.log('loaded:', await page.evaluate(() => location.pathname));

  await setFirstNumberInput(page, '0');
  console.log('after setFirstNumberInput:', await page.evaluate(() => location.pathname));

  await setByLabel(page, 'Waste allowance', '-5').catch((e) => console.log('  (miss:', e.message, ')'));
  console.log('after waste-allowance attempt:', await page.evaluate(() => location.pathname));

  const sel = await labelSelector(page, 'Waste');
  console.log('waste selector:', sel);
  const handle = await page.$(sel);
  await handle.click();
  console.log('after click, active =', await page.evaluate(() => document.activeElement.tagName + '#' + (document.activeElement.id || '-')), 'url=', await page.evaluate(() => location.pathname));
  await page.keyboard.down('Control');
  await page.keyboard.press('KeyA');
  await page.keyboard.up('Control');
  console.log('after ctrl+a, url=', await page.evaluate(() => location.pathname), 'value=', await page.evaluate((s) => document.querySelector(s).value, sel));
  await page.keyboard.press('Backspace');
  console.log('after Backspace, url=', await page.evaluate(() => location.pathname), 'value=', await page.evaluate((s) => document.querySelector(s).value, sel));
  await handle.type('-5', { delay: 2 });
  console.log('after type -5, url=', await page.evaluate(() => location.pathname), 'value=', await page.evaluate((s) => document.querySelector(s).value, sel));
  await handle.evaluate((el) => el.blur());
  console.log('after blur, url=', await page.evaluate(() => location.pathname));
  console.log('console:', JSON.stringify(log.console.slice(0, 3)));
  await browser.close();
})();
