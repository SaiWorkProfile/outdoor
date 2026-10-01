'use strict';
const { launch, writeJson, isHydration } = require('./lib.cjs');
const { CALCS } = require('./calc-helpers.cjs');
const { checkCalculator } = require('./calc-part1.cjs');
const { edgeCases } = require('./calc-part2.cjs');

(async () => {
  const browser = await launch();
  const report = {};
  for (const slug of CALCS) {
    const { page, r, log, fail, ok } = await checkCalculator(browser, slug);
    try {
      if (r.status === 200 && !r.failures.some((f) => f.startsWith('HARNESS ERROR'))) {
        await edgeCases(page, slug, r, fail, ok);
      }
      r.console = log.console;
      r.pageErrors = log.pageErrors;
      r.requestFailures = log.requestFailures;
      r.hydrationWarnings = log.console.filter((c) => isHydration(c.text));
      if (r.hydrationWarnings.length) fail(`hydration warning: ${r.hydrationWarnings.map((h) => h.text).join(' | ')}`); else ok('no hydration warnings');
      if (log.pageErrors.length) fail(`uncaught exception: ${log.pageErrors.join(' | ')}`); else ok('no uncaught exceptions');
      r.faviconNoise = log.console.filter((c) => /favicon/.test(c.url || ''));
      const real = log.console.filter((c) => !/favicon/.test(c.url || ''));
      if (real.length) fail(`console output: ${real.map((c) => `${c.type}: ${c.text}`).join(' | ')}`);
    } catch (e) {
      fail('EDGE HARNESS ERROR: ' + e.message);
    }
    report[slug] = r;
    await page.close();
  }
  writeJson('calculators.json', report);
  console.log(JSON.stringify(Object.values(report).map((r) => ({
    slug: r.slug, status: r.status, fields: r.fieldCount, units: r.unitCount,
    misassociatedLabels: r.misassociated ? r.misassociated.length : null,
    metrics: r.actualMetrics, mismatches: r.mismatches,
    reset: r.afterReset, huge: r.huge, empty: r.emptyFields,
    multiSection: r.multiSection, decimal: r.decimalMetrics,
    hydration: r.hydrationWarnings ? r.hydrationWarnings.length : null,
    pageErrors: r.pageErrors, faviconNoise: r.faviconNoise ? r.faviconNoise.length : null,
    related: r.relatedStatus,
    failures: r.failures,
  })), null, 2));
  await browser.close();
})();
