'use strict';
const {
  BASE, launch, emptyLog, watch, waitForCalculator, setByLabel, clickButton,
  resultSnapshot, writeJson, isHydration,
} = require('./lib.cjs');
const { CALCS, num, fieldsOf, associated, REALISTIC } = require('./calc-helpers.cjs');
const expected = require('./artifacts/expected.json');

async function checkCalculator(browser, slug) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });
  const log = emptyLog();
  watch(page, log);
  const r = { slug, steps: [], failures: [] };
  const fail = (m) => r.failures.push(m);
  const ok = (m) => r.steps.push('PASS ' + m);

  try {
    const res = await page.goto(`${BASE}/calculators/${slug}`, { waitUntil: 'networkidle0', timeout: 30000 });
    r.status = res ? res.status() : 0;
    if (r.status !== 200) fail(`HTTP ${r.status}`); else ok('page loads 200');
    await waitForCalculator(page);

    /* --- inputs render, labels match inputs, units present --- */
    const fields = await fieldsOf(page);
    r.fieldCount = fields.length;
    r.misassociated = fields.filter((f) => !associated(f));
    r.unlabelled = fields.filter((f) => !f.label).length;
    if (!fields.length) fail('no fields rendered'); else ok(`${fields.length} labelled fields rendered`);
    r.unitCount = fields.filter((f) => f.unit).length;
    if (!r.unitCount) fail('no unit annotations rendered');

    /* --- realistic worked example --- */
    for (const [label, value] of REALISTIC[slug] || []) await setByLabel(page, label, value);
    const before = await resultSnapshot(page);
    await clickButton(page, 'Calculate');
    await page.waitForFunction(() => !!document.querySelector('.result-card'), { timeout: 8000 }).catch(() => {});
    const after = await resultSnapshot(page);
    r.resultChanged = before.text !== after.text;
    if (!after.metrics.length) fail('no metrics after Calculate'); else ok(`Calculate produced ${after.metrics.length} metrics`);
    if (!r.resultChanged) fail('result panel did not change after Calculate'); else ok('result panel updated');

    /* --- formatting readability --- */
    const values = after.metrics.map((m) => m.value);
    const bad = values.filter((v) => /NaN|Infinity|undefined|null|\[object/i.test(v));
    if (bad.length) fail(`unreadable values: ${JSON.stringify(bad)}`); else ok('result values readable');
    const decimals = values.filter((v) => /\d\.\d{4,}/.test(v));
    if (decimals.length) fail(`excessive decimals: ${JSON.stringify(decimals)}`);

    /* --- engine parity --- */
    r.expected = expected[slug].metrics;
    r.actualMetrics = after.metrics.map((m) => `${m.label} = ${m.value}`);
    r.mismatches = [];
    for (const [label, want] of Object.entries(expected[slug].metrics)) {
      const got = after.metrics.find((m) => m.label.toLowerCase() === label.toLowerCase());
      if (!got) { r.mismatches.push(`metric "${label}" not rendered`); continue; }
      if (typeof want === 'number') {
        if (!(Math.abs(num(got.value) - want) <= 0.011)) r.mismatches.push(`${label}: UI ${got.value} vs engine ${want}`);
      } else if (String(got.value).trim() !== String(want).trim()) {
        r.mismatches.push(`${label}: UI "${got.value}" vs engine "${want}"`);
      }
    }
    if (r.mismatches.length) fail(`engine mismatch: ${r.mismatches.join(' | ')}`); else ok('rendered metrics match calculation engine');

    /* --- assumptions + related links --- */
    r.assumptions = await page.evaluate(() => ({ list: !!document.querySelector('.assumption-list'), mentioned: /assumption/i.test(document.body.innerText) }));
    if (!r.assumptions.list) fail('no assumption list rendered'); else ok('assumptions visible');
    r.relatedLinks = await page.evaluate(() => Array.from(document.querySelectorAll('a.tool-card-link')).map((a) => a.getAttribute('href')));
    if (!r.relatedLinks.length) fail('no related calculator links');
    else {
      r.relatedStatus = [];
      for (const href of r.relatedLinks) r.relatedStatus.push([href, (await fetch(`${BASE}${href}`)).status]);
      const broken = r.relatedStatus.filter(([, s]) => s !== 200);
      if (broken.length) fail(`broken related links: ${JSON.stringify(broken)}`); else ok(`${r.relatedStatus.length} related links resolve 200`);
    }
    return { page, r, log, fail, ok };
  } catch (e) {
    fail('HARNESS ERROR: ' + e.message);
    return { page, r, log, fail, ok };
  }
}

module.exports = { checkCalculator };
