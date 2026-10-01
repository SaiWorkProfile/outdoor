'use strict';
const { BASE, launch, emptyLog, watch, writeJson } = require('./lib.cjs');
const { ALL_PAGES, statusOf, META_SCRIPT } = require('./seo-lib.cjs');

(async () => {
  const browser = await launch();
  const page = await browser.newPage();
  const report = { pages: [], titles: {}, descriptions: {}, canonicals: {}, linkStatus: {}, errors: [] };
  const allHrefs = new Set();

  for (const route of ALL_PAGES) {
    const log = emptyLog();
    watch(page, log);
    let status = 0;
    try {
      const res = await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle0', timeout: 30000 });
      status = res ? res.status() : 0;
    } catch (e) {
      report.errors.push({ route, error: String(e.message) });
    }
    const meta = await page.evaluate(META_SCRIPT);
    for (const h of meta.hrefs) if (h) allHrefs.add(h.split('#')[0]);
    report.pages.push({ route, status, ...meta, console: JSON.parse(JSON.stringify(log.console)), pageErrors: [...log.pageErrors], requestFailures: [...log.requestFailures] });
    (report.titles[meta.title] = report.titles[meta.title] || []).push(route);
    (report.descriptions[meta.description] = report.descriptions[meta.description] || []).push(route);
    (report.canonicals[meta.canonical] = report.canonicals[meta.canonical] || []).push(route);
  }

  /* 404 behaviour on a separate page so its console output is not mixed into the crawl */
  const nfPage = await browser.newPage();
  const nf = await nfPage.goto(`${BASE}/this-page-does-not-exist`, { waitUntil: 'domcontentloaded' });
  report.notFound = { status: nf ? nf.status() : 0, title: await nfPage.title(), h1: await nfPage.$$eval('h1', (h) => h.map((x) => x.textContent.trim())), robots: await nfPage.$eval('meta[name="robots"]', (m) => m.getAttribute('content')).catch(() => null) };
  await nfPage.close();

  for (const href of [...allHrefs].filter((h) => h && !h.startsWith('#'))) {
    report.linkStatus[href] = await statusOf(href.startsWith('/') ? `${BASE}${href}` : href);
  }

  const sm = await fetch(`${BASE}/sitemap.xml`);
  const smBody = await sm.text();
  const locs = [...smBody.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  report.sitemap = { status: sm.status, contentType: sm.headers.get('content-type'), count: locs.length, locs };
  const rb = await fetch(`${BASE}/robots.txt`);
  report.robots = { status: rb.status, contentType: rb.headers.get('content-type'), body: await rb.text() };
  report.sitemapStatus = {};
  for (const loc of locs) report.sitemapStatus[loc] = await statusOf(loc);

  writeJson('seo.json', report);
  console.log(JSON.stringify({
    pageCount: report.pages.length,
    duplicateTitles: Object.entries(report.titles).filter(([, r]) => r.length > 1),
    duplicateDescriptions: Object.entries(report.descriptions).filter(([, r]) => r.length > 1),
    missingDescription: report.pages.filter((p) => !p.description).map((p) => p.route),
    canonicalUrls: report.canonicals,
    missingCanonical: report.pages.filter((p) => !p.canonical).map((p) => p.route),
    multipleCanonical: report.pages.filter((p) => p.canonicalCount !== 1).map((p) => [p.route, p.canonicalCount]),
    missingOg: report.pages.filter((p) => !p.ogTitle || !p.ogDescription).map((p) => ({ route: p.route, ogTitle: p.ogTitle, ogDescription: p.ogDescription, ogUrl: p.ogUrl })),
    h1Problems: report.pages.filter((p) => p.h1.length !== 1).map((p) => ({ route: p.route, h1: p.h1 })),
    noBreadcrumb: report.pages.filter((p) => !p.breadcrumbNav).map((p) => p.route),
    robotsMeta: report.pages.map((p) => [p.route, p.robotsMeta]),
    consoleProblems: report.pages.filter((p) => p.console.length || p.pageErrors.length).map((p) => ({ route: p.route, console: p.console, pageErrors: p.pageErrors })),
    non200Links: Object.entries(report.linkStatus).filter(([, s]) => s !== 200),
    sitemap: { status: report.sitemap.status, contentType: report.sitemap.contentType, count: report.sitemap.count },
    robots: report.robots,
    non200SitemapUrls: Object.entries(report.sitemapStatus).filter(([, s]) => s !== 200),
    notFound: report.notFound,
    favicon: report.pages.map((p) => [p.route, p.hasIcon, p.iconHref]),
  }, null, 2));

  await browser.close();
})();
