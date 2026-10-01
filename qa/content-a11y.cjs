'use strict';
/** Content library accessibility and layout QA against the running production server. */
const { BASE, launch, emptyLog, watch, writeJson } = require('./lib.cjs');
const { PAGES, PROBE } = require('./content-a11y-lib.cjs');

(async () => {
  const browser = await launch();
  const page = await browser.newPage();
  const report = { pages: [], errors: [] };

  for (const route of PAGES) {
    const log = emptyLog();
    watch(page, log);
    let status = 0;
    try {
      const res = await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle0', timeout: 30000 });
      status = res ? res.status() : 0;
    } catch (error) {
      report.errors.push({ route, error: String(error.message) });
    }
    const probe = await page.evaluate(PROBE);
    report.pages.push({ route, status, ...probe, console: log.console.length, pageErrors: [...log.pageErrors] });
  }

  /* Mobile re-check for the layout-sensitive parts only. */
  await page.setViewport({ width: 380, height: 800, deviceScaleFactor: 2 });
  const mobile = [];
  for (const route of PAGES) {
    await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    mobile.push({ route, ...(await page.evaluate(PROBE)) });
  }
  await page.close();
  await browser.close();

  const summary = {
    pageCount: report.pages.length,
    non200: report.pages.filter((p) => p.status !== 200).map((p) => [p.route, p.status]),
    h1Problems: report.pages.filter((p) => p.h1Count !== 1).map((p) => [p.route, p.h1Count]),
    headingSkips: report.pages.filter((p) => p.headingSkip).map((p) => [p.route, p.headingSkip]),
    badJsonLd: report.pages.filter((p) => p.jsonLdCount === 0 || !p.jsonLdParses).map((p) => p.route),
    breadcrumbProblems: report.pages.filter((p) => p.breadcrumbItems < 1 || p.currentCrumbCount !== 1).map((p) => [p.route, p.breadcrumbItems, p.currentCrumbCount]),
    mainProblems: report.pages.filter((p) => p.mainCount !== 1).map((p) => [p.route, p.mainCount]),
    uncaptionedTables: report.pages.filter((p) => p.uncaptionedTables > 0).map((p) => [p.route, p.uncaptionedTables]),
    unlabelledDiagrams: report.pages.filter((p) => p.unlabelledDiagrams > 0).map((p) => [p.route, p.unlabelledDiagrams]),
    unlabelledLinks: report.pages.filter((p) => p.unlabelledLinks > 0).map((p) => [p.route, p.unlabelledLinks]),
    brokenTocLinks: report.pages.filter((p) => p.tocBroken > 0).map((p) => [p.route, p.tocBroken]),
    duplicateIds: report.pages.filter((p) => p.duplicateIds.length).map((p) => [p.route, p.duplicateIds]),
    consoleProblems: report.pages.filter((p) => p.console > 0 || p.pageErrors.length).map((p) => p.route),
    mobileOverflow: mobile.filter((p) => p.overflowPx > 0).map((p) => [p.route, p.overflowPx]),
    mobileH1Problems: mobile.filter((p) => p.h1Count !== 1).map((p) => [p.route, p.h1Count]),
    errors: report.errors,
  };
  writeJson('content-a11y.json', { summary, pages: report.pages, mobile });
  console.log(JSON.stringify(summary, null, 2));
})();
