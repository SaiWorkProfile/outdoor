'use strict';
const { setByLabel, clickButton, resultSnapshot, setFirstNumberInput, clearAllNumberInputs } = require('./lib.cjs');

/** Invalid value, reset, empty, huge, negative, decimal, multi-section edge cases. */
async function edgeCases(page, slug, r, fail, ok) {
  /* --- invalid: zero primary dimension + negative waste --- */
  await setFirstNumberInput(page, '0');
  await setByLabel(page, 'Waste allowance', '-5').catch(() => {});
  await setByLabel(page, 'Waste', '-5').catch(() => {});
  await clickButton(page, 'Calculate');
  const invalid = await page.evaluate(() => ({
    summary: Array.from(document.querySelectorAll('.notice[role="alert"]')).map((e) => e.textContent.trim()).filter((t) => /could not run/.test(t)),
    highlighted: Array.from(document.querySelectorAll('.field-invalid')).map((e) => ((e.querySelector('label') || {}).textContent) || '?'),
    ariaInvalid: document.querySelectorAll('[aria-invalid="true"]').length,
    alerts: Array.from(document.querySelectorAll('[role="alert"]')).map((e) => e.textContent.trim()),
  }));
  r.invalid = { summary: invalid.summary.slice(0, 2), highlighted: invalid.highlighted, ariaInvalid: invalid.ariaInvalid };
  if (!invalid.summary.length) fail('zero/negative input produced no error summary'); else ok('invalid input shows a useful error');
  const leaked = /Cannot read propert|is not a function|undefined \(reading/i.test(invalid.alerts.join(' | '));
  if (leaked) fail(`raw JS error leaked to the user: ${JSON.stringify(r.invalid)}`);
  else ok('no raw JS errors surfaced');

  /* --- reset --- */
  await clickButton(page, 'Reset');
  const reset = await page.evaluate(() => ({
    hasResultCard: !!document.querySelector('.result-card'),
    errors: document.querySelectorAll('.field-error').length,
    highlighted: document.querySelectorAll('.field-invalid').length,
  }));
  r.afterReset = reset;
  if (reset.hasResultCard) fail('Reset did not clear the result');
  if (reset.errors > 0 || reset.highlighted > 0) fail('Reset did not clear error state');
  if (!reset.hasResultCard && !reset.errors && !reset.highlighted) ok('Reset clears result and errors');


  /* --- empty fields (React-compatible clearing) --- */
  await clearAllNumberInputs(page);
  await clickButton(page, 'Calculate');
  r.emptyFields = await page.evaluate(() => ({
    summary: Array.from(document.querySelectorAll('.notice[role="alert"]')).map((e) => e.textContent.trim()).filter((t) => /could not run/.test(t)).slice(0, 1),
    highlighted: Array.from(document.querySelectorAll('.field-invalid')).map((e) => ((e.querySelector('label') || {}).textContent) || '?'),
    hasResult: !!document.querySelector('.result-card'),
    bodyHasNaN: /NaN|Infinity/.test(document.body.innerText),
  }));
  if (!r.emptyFields.summary.length) fail('empty fields produced no error feedback'); else ok('empty fields report a useful error');
  if (r.emptyFields.hasResult) fail('empty fields still produced a result');
  if (r.emptyFields.bodyHasNaN) fail('empty fields rendered NaN/Infinity');
  await clickButton(page, 'Reset');

  /* --- very large values --- */
  for (const [label, value] of [['Length', '999999'], ['Width', '999999'], ['Fence length', '999999'], ['Deck length', '999999']]) {
    await setByLabel(page, label, value).catch(() => {});
  }
  await clickButton(page, 'Calculate');
  const huge = await page.evaluate(() => ({ body: document.body.innerText }));
  r.huge = { crashed: /Cannot read propert/i.test(huge.body), hasNaN: /NaN|Infinity/.test(huge.body) };
  if (r.huge.crashed) fail('very large values crashed the calculator');
  else if (r.huge.hasNaN) fail('very large values render NaN/Infinity');
  else ok('very large values handled without crash or NaN');
  await clickButton(page, 'Reset');

  /* --- decimals --- */
  for (const [label, value] of [['Length', '12.5'], ['Width', '20.25'], ['Fence length', '37.5'], ['Deck length', '12.5']]) {
    await setByLabel(page, label, value).catch(() => {});
  }
  await clickButton(page, 'Calculate');
  const dec = await resultSnapshot(page);
  r.decimalMetrics = dec.metrics.map((m) => `${m.label}=${m.value}`).slice(0, 3);
  if (!dec.metrics.length) {
    r.decimalError = await page.evaluate(() => Array.from(document.querySelectorAll('.notice[role="alert"]')).map((e) => e.textContent.trim()).slice(0, 1));
    fail(`decimal inputs produced no result: ${JSON.stringify(r.decimalError)}`);
  } else ok('decimal inputs calculate');

  /* --- multi-section (wait for React to re-render before counting) --- */
  await clickButton(page, 'Reset');
  const clickedAdd = await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('button')).find((x) => /add (area|section)/i.test(x.textContent));
    if (!b) return false;
    b.click();
    return true;
  });
  if (!clickedAdd) r.multiSection = 'not-supported';
  else {
    await page.evaluate(() => new Promise((res) => setTimeout(res, 150)));
    const counts = await page.evaluate(() => ({ fields: document.querySelectorAll('.field').length, subCards: document.querySelectorAll('.card .card').length }));
    r.multiSection = counts;
    if (counts.fields <= 9) fail(`Add area/section did not add inputs (now ${counts.fields} fields)`);
    else ok(`multi-section adds inputs (${counts.fields} fields, ${counts.subCards} sub-cards)`);
    await clickButton(page, 'Calculate');
    const multi = await resultSnapshot(page);
    if (!multi.metrics.length) fail('multi-section calculate produced no result'); else ok('multi-section calculate works');
  }
  return r;
}

module.exports = { edgeCases };
