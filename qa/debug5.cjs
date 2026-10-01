'use strict';
const { launch, setFirstNumberInput, setByLabel, labelSelector } = require('./lib.cjs');
const { checkCalculator } = require('./calc-part1.cjs');

(async () => {
  const browser = await launch();
  const slug = 'fence-cost-calculator';
  const { page, log } = await checkCalculator(browser, slug);
  page.on('framenavigated', (f) => { if (f === page.mainFrame()) console.log('  >>> NAVIGATED', f.url()); });
  const url = () => page.evaluate(() => location.pathname);
  const at = () => page.evaluate(() => {
    const el = document.elementFromPoint(400, 300);
    return el ? el.tagName + '.' + String(el.className).slice(0, 30) : 'none';
  });

  console.log('start url =', await url());
  await setFirstNumberInput(page, '0');
  console.log('after setFirstNumberInput url =', await url());

  await setByLabel(page, 'Waste allowance', '-5').catch((e) => console.log('  miss ok'));
  console.log('after waste-allowance miss url =', await url());

  const sel = await labelSelector(page, 'Waste');
  console.log('waste selector =', sel);
  const box = await page.evaluate((s) => { const el = document.querySelector(s); const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height, scrollY: window.scrollY, value: el.value }; }, sel);
  console.log('waste box =', JSON.stringify(box));
  const handle = await page.$(sel);
  await handle.click();
  console.log('after click url =', await url(), 'active =', await page.evaluate(() => document.activeElement.tagName + '#' + (document.activeElement.id || '-')));
  await page.keyboard.down('Control'); await page.keyboard.press('KeyA'); await page.keyboard.up('Control');
  console.log('after ctrl+a url =', await url());
  await page.keyboard.press('Backspace');
  console.log('after Backspace url =', await url());
  await handle.type('-5', { delay: 2 });
  console.log('after type url =', await url());
  await handle.evaluate((el) => el.blur());
  console.log('after blur url =', await url());
  console.log('console:', JSON.stringify(log.console), 'pageErrors:', JSON.stringify(log.pageErrors));
  await browser.close();
})();
