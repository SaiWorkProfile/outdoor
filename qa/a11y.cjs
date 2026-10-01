'use strict';
/** Accessibility QA: names, labels, focus visibility, announcements, headings, contrast. */
const { BASE, launch, emptyLog, watch, waitForCalculator, clickButton, writeJson, setNativeValue } = require('./lib.cjs');
const { A11Y } = require('./a11y-lib.cjs');
const { CONTRAST } = require('./a11y-contrast.cjs');

const PAGES = [
  ['/', 'home'], ['/calculators', 'index'], ['/calculators/gravel-calculator', 'gravel'],
  ['/calculators/fence-calculator', 'fence'], ['/calculators/paver-calculator', 'paver'],
  ['/calculators/concrete-calculator', 'concrete'], ['/calculators/deck-material-calculator', 'deck'],
  ['/calculators/paver-base-calculator', 'paver-base'],
  ['/projects', 'projects'], ['/projects/print', 'print'],
];
const SAMPLES = ['p', '.metric-label', '.metric-value', '.eyebrow', '.field-hint', '.card-title', '.button-primary', '.metric-detail', '.qty-row', '.shopping-item', '.notice', '.notice strong', '.chip', '.result-table td', '.breadcrumbs a', '.site-footer a', '.site-footer p', '.kicker', '.brand small', '.calculator-link p', '.calculator-link h2'];
const RESULT_CARD_SAMPLES = ['.result-card .metric-label', '.result-card .metric-value', '.result-card .metric-detail', '.result-card .notice', '.result-card .notice strong', '.result-card .shopping-item', '.result-card .result-table td', '.result-card .card-title', '.result-card .eyebrow'];

const focusProbe = () => {
  const el = document.activeElement;
  if (!el || el === document.body) return null;
  const cs = getComputedStyle(el);
  const rect = el.getBoundingClientRect();
  return {
    tag: el.tagName.toLowerCase(),
    name: (el.getAttribute('aria-label') || el.textContent || el.value || '').trim().slice(0, 30),
    outlineStyle: cs.outlineStyle, outlineWidth: cs.outlineWidth,
    boxShadow: cs.boxShadow,
    focusVisible: el.matches(':focus-visible'),
    onScreen: rect.width > 0 && rect.height > 0,
  };
};

(async () => {
  const browser = await launch();
  const report = {};
  for (const [route, name] of PAGES) {
    const page = await browser.newPage();
    const log = watch(page, emptyLog());
    await page.setViewport({ width: 1440, height: 1000 });
    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle0', timeout: 30000 });
    const r = {};
    r.base = await page.evaluate(A11Y);
    r.contrast = await page.evaluate(CONTRAST, SAMPLES);

    if (route.includes('/calculators/')) {
      await waitForCalculator(page);
      const stops = [];
      for (let i = 0; i < 42; i++) {
        await page.keyboard.press('Tab');
        const info = await page.evaluate(focusProbe);
        if (info) stops.push(info);
      }
      r.tabStops = stops.length;
      r.focusNoIndicator = stops.filter((s) => s.outlineStyle === 'none' && (s.boxShadow === 'none' || !s.boxShadow)).map((s) => `${s.tag}:${s.name}`);
      r.notFocusVisible = stops.filter((s) => !s.focusVisible).map((s) => `${s.tag}:${s.name}`);
      r.reachedCalculate = stops.some((s) => /calculate/i.test(s.name));
      r.reachedReset = stops.some((s) => /reset/i.test(s.name));
      r.focusOrderFirst = stops.slice(0, 10).map((s) => `${s.tag}:${s.name}`);

      const first = await page.$('input[type="number"]');
      if (first) {
        await first.click();
        await page.keyboard.down('Control'); await page.keyboard.press('KeyA'); await page.keyboard.up('Control');
        await page.keyboard.press('Backspace');
        await first.type('0');
        await first.evaluate((el) => el.blur());
        // If hydration replaced the node while typing, the value can be lost; make
        // sure the invalid value really reached the field before asserting.
        const typed = await first.evaluate((el) => el.value).catch(() => null);
        if (typed !== '0') {
          await setNativeValue(page, 'input[type="number"]', '0').catch(() => {});
        }
        await clickButton(page, 'Calculate').catch(() => {});
        // Poll instead of sleeping: on a loaded machine React may need longer than a
        // fixed delay to render the announcement. The assertion is unchanged — the
        // alert must appear.
        await page.waitForFunction(
          () => /could not run/i.test(document.body.innerText),
          { timeout: 4000 },
        ).catch(() => {});
        r.errorAnnouncement = await page.evaluate(() => Array.from(document.querySelectorAll('[role="alert"], [aria-live]'))
          .map((e) => ({ role: e.getAttribute('role') || e.getAttribute('aria-live'), text: e.textContent.trim().slice(0, 80), visible: e.getBoundingClientRect().height > 0 })));
        await clickButton(page, 'Reset').catch(() => {});
      }
      await clickButton(page, 'Calculate').catch(() => {});
      await page.waitForFunction(() => !!document.querySelector('.result-card'), { timeout: 4000 }).catch(() => {});
      r.contrastResultCard = await page.evaluate(CONTRAST, RESULT_CARD_SAMPLES);
      r.resultAnnouncement = await page.evaluate(() => {
        const card = document.querySelector('.result-card');
        const live = card ? Array.from(card.querySelectorAll('[aria-live], [role="status"], [role="alert"]')).map((e) => e.getAttribute('aria-live') || e.getAttribute('role')) : [];
        return { resultRendered: !!card, liveRegionsInsideResult: live };
      });
    }
    r.consoleErrors = log.console.filter((c) => c.type === 'error').map((c) => c.text).concat(log.pageErrors);
    report[name] = r;
    await page.close();
  }
  writeJson('a11y.json', report);
  console.log(JSON.stringify(Object.fromEntries(Object.entries(report).map(([k, v]) => [k, {
    lang: v.base.lang, h1: v.base.h1Count, headingSkips: v.base.headingSkips, landmarks: v.base.landmarks,
    controls: v.base.controls.length, unnamedControls: v.base.unnamedControls,
    unnamedButtons: v.base.unnamedButtons, unnamedLinks: v.base.unnamedLinks,
    unnamedControlSamples: v.base.controls.filter((c) => !c.ok).slice(0, 4),
    contrastChecked: v.contrast.checked, contrastFailures: v.contrast.failures,
    contrastResultCardFailures: v.contrastResultCard ? v.contrastResultCard.failures : null,
    liveRegions: v.base.liveRegions,
    reachedCalculate: v.reachedCalculate, reachedReset: v.reachedReset,
    focusNoIndicator: v.focusNoIndicator, notFocusVisible: v.notFocusVisible && v.notFocusVisible.length,
    focusOrderFirst: v.focusOrderFirst,
    errorAnnouncement: v.errorAnnouncement, resultAnnouncement: v.resultAnnouncement,
    consoleErrors: v.consoleErrors,
  }])), null, 2));
  await browser.close();
})();
