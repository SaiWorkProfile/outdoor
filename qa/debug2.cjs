'use strict';
const { BASE, launch, emptyLog, watch, waitForCalculator, clickButton, setFirstNumberInput, setByLabel } = require('./lib.cjs');

(async () => {
  const browser = await launch();
  const page = await browser.newPage();
  const log = watch(page, emptyLog());
  await page.setViewport({ width: 1440, height: 1000 });
  await page.goto(`${BASE}/calculators/fence-cost-calculator`, { waitUntil: 'networkidle0' });
  await waitForCalculator(page);

  const state = async (tag) => {
    const s = await page.evaluate(() => ({
      url: location.pathname,
      buttons: Array.from(document.querySelectorAll('button')).map((b) => (b.textContent || '').trim().slice(0, 24)),
      fields: document.querySelectorAll('.field').length,
      bodyLen: document.body.innerText.length,
      caretInInput: document.activeElement ? document.activeElement.tagName + '#' + (document.activeElement.id || '-') : 'none',
    }));
    console.log(tag, JSON.stringify(s));
  };

  await state('start');
  await setFirstNumberInput(page, '0');
  await state('after setFirstNumberInput(0)');
  await setByLabel(page, 'Waste allowance', '-5').catch((e) => console.log('  (waste allowance miss:', e.message, ')'));
  await state('after waste allowance attempt');
  await setByLabel(page, 'Waste', '-5').catch((e) => console.log('  (waste miss:', e.message, ')'));
  await state('after waste -5');
  try {
    await clickButton(page, 'Calculate');
    console.log('calculate clicked');
  } catch (e) {
    console.log('clickButton FAILED:', e.message);
    await state('failure state');
  }
  await page.evaluate(() => new Promise((r) => setTimeout(r, 200)));
  console.log('after calculate:', JSON.stringify(await page.evaluate(() => ({
    metrics: document.querySelectorAll('.metric').length,
    summary: Array.from(document.querySelectorAll('.notice[role="alert"]')).map((e) => e.textContent.trim().slice(0, 120)),
    highlighted: Array.from(document.querySelectorAll('.field-invalid')).map((e) => ((e.querySelector('label') || {}).textContent) || '?'),
    ariaInvalid: Array.from(document.querySelectorAll('[aria-invalid="true"]')).map((e) => e.id || e.tagName),
  }))));
  console.log('console:', JSON.stringify(log.console), 'pageErrors:', JSON.stringify(log.pageErrors));
  await browser.close();
})();
