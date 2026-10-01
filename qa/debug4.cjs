'use strict';
const { launch } = require('./lib.cjs');
const { checkCalculator } = require('./calc-part1.cjs');
const { edgeCases } = require('./calc-part2.cjs');

(async () => {
  const browser = await launch();
  for (const slug of ['fence-calculator', 'fence-cost-calculator', 'fence-post-calculator']) {
    console.log(`\n=== ${slug} ===`);
    const { page, r, log, fail, ok } = await checkCalculator(browser, slug);
    page.on('framenavigated', (f) => { if (f === page.mainFrame()) console.log('  >>> NAVIGATED', f.url()); });
    console.log('  after checkCalculator url =', await page.evaluate(() => location.pathname));
    try {
      await edgeCases(page, slug, r, fail, ok);
      console.log('  after edgeCases url =', await page.evaluate(() => location.pathname));
    } catch (e) {
      console.log('  EDGE ERROR:', e.message.slice(0, 200));
    }
    console.log('  failures:', JSON.stringify(r.failures));
    console.log('  console:', JSON.stringify(log.console.slice(0, 2)), 'pageErrors:', JSON.stringify(log.pageErrors));
    await page.close();
  }
  await browser.close();
})();
