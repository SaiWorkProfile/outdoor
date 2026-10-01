'use strict';
/**
 * TEMPORARY QA SCRIPT — not imported by the application.
 *
 * www domain + canonical consistency audit for MeasureToBuild.
 *
 * Crawls an already-running server (default http://localhost:3100) whose production
 * build was made with NEXT_PUBLIC_SITE_URL=https://www.measuretobuild.in, then proves
 * for every indexable route that:
 *
 *   final HTTP URL  ==  canonical  ==  sitemap URL  ==  https://www.measuretobuild.in/PATH
 *
 * and that no canonical/OG URL uses localhost, http://, the apex host or a Vercel host.
 * It also checks the 4 short calculator aliases resolve (308) to their canonical page,
 * that /projects/print stays noindex and out of the sitemap, and that a query-parameter
 * request does not leak the parameter into the canonical.
 *
 * Usage:
 *   node qa/tmp/www-canonical-audit.cjs [--base=http://localhost:3100]
 *                                       [--origin=https://www.measuretobuild.in]
 *                                       [--variants]   # also probe the live domain variants
 *
 * Exit code 1 when any hard error is found, 0 otherwise. Writes
 * qa/artifacts/www-canonical-audit.json.
 */
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..', '..');
const ART = path.join(ROOT, 'qa', 'artifacts');
fs.mkdirSync(ART, { recursive: true });

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const hit = argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};
const has = (name) => argv.includes(`--${name}`);

const BASE = (flag('base', process.env.QA_BASE || 'http://localhost:3100')).replace(/\/+$/, '');
const ORIGIN = (flag('origin', process.env.EXPECT_ORIGIN || 'https://www.measuretobuild.in')).replace(/\/+$/, '');
const CANONICAL_HOST = new URL(ORIGIN).host; // www.measuretobuild.in
const APEX_HOST = 'measuretobuild.in';

const PRINT_ROUTE = '/projects/print';
const ALIASES = [
  ['/calculators/gravel', '/calculators/gravel-calculator'],
  ['/calculators/fence', '/calculators/fence-calculator'],
  ['/calculators/paver', '/calculators/paver-calculator'],
  ['/calculators/concrete', '/calculators/concrete-calculator'],
];

const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

const normPath = (value) => {
  let p = value || '/';
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  return p;
};

/* The canonical origin root is emitted without a trailing slash (the app's convention
   for every canonical), so the expected URL for '/' is the bare origin. */
const expectedUrl = (p) => (normPath(p) === '/' ? ORIGIN : `${ORIGIN}${normPath(p)}`);

/** Pull the value of one attribute out of an HTML tag string. */
const attr = (tag, name) => {
  const m = tag.match(new RegExp(`${name}\\s*=\\s*"([^"]*)"`, 'i'));
  return m ? m[1] : null;
};

const allTags = (html, re) => html.match(re) || [];

function extractMeta(html) {
  const canonicals = [];
  for (const tag of allTags(html, /<link\b[^>]*>/gi)) {
    if (/\brel\s*=\s*"canonical"/i.test(tag) || /\brel\s*=\s*'canonical'/i.test(tag)) {
      canonicals.push(attr(tag, 'href'));
    }
  }
  let ogUrl = null;
  let robotsMeta = null;
  for (const tag of allTags(html, /<meta\b[^>]*>/gi)) {
    const property = attr(tag, 'property');
    const name = attr(tag, 'name');
    if (property && property.toLowerCase() === 'og:url') ogUrl = attr(tag, 'content');
    if (name && name.toLowerCase() === 'robots') robotsMeta = attr(tag, 'content');
  }
  const title = (html.match(/<title>([^<]*)<\/title>/i) || [])[1] || null;

  /* JSON-LD blocks and any absolute <a href> values, so the audit can prove the
     structured-data URLs and internal links use the canonical host too. */
  const jsonLdText = allTags(html, /<script[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi).join('\n');
  const absLinks = [];
  for (const tag of allTags(html, /<a\b[^>]*>/gi)) {
    const href = attr(tag, 'href');
    if (href && /^https?:\/\//i.test(href)) absLinks.push(href);
  }

  return { canonicals, canonical: canonicals[0] ?? null, ogUrl, robotsMeta, title, jsonLdText, absLinks };
}

async function fetchOnce(url, redirect) {
  try {
    const res = await fetch(url, { redirect: redirect || 'follow' });
    return { status: res.status, location: res.headers.get('location'), finalUrl: res.url, res };
  } catch (e) {
    return { status: `ERR:${e.message}`, location: null, finalUrl: null, res: null };
  }
}

function hostOf(url) {
  try { return new URL(url).host; } catch { return '(unparseable)'; }
}

async function main() {
  console.log(`=== www canonical audit ===\nbase:   ${BASE}\norigin: ${ORIGIN}\n`);

  /* ---- sitemap ---- */
  const smRes = await fetchOnce(`${BASE}/sitemap.xml`);
  if (smRes.status !== 200 || !smRes.res) {
    err(`sitemap.xml returned ${smRes.status}`);
    return finish();
  }
  const smBody = await smRes.res.text();
  const locs = [...smBody.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const sitemapRows = locs.map((loc) => ({ loc, path: normPath(new URL(loc).pathname), host: hostOf(loc) }));

  /* ---- robots.txt ---- */
  const rbRes = await fetchOnce(`${BASE}/robots.txt`);
  const rbBody = rbRes.res ? await rbRes.res.text() : '';
  const robotsSitemap = (rbBody.match(/Sitemap:\s*(\S+)/i) || [])[1] || null;

  /* ---- crawl every sitemap URL ---- */
  const matrix = [];
  const canonicalSeen = new Map();
  let jsonLdUrlTotal = 0;
  let absLinkTotal = 0;
  const absLinkSet = new Set();

  for (const row of sitemapRows) {
    if (row.host !== CANONICAL_HOST) err(`sitemap host is not ${CANONICAL_HOST}: ${row.loc}`);
    if (!/^https:\/\//.test(row.loc)) err(`sitemap URL is not https: ${row.loc}`);
    if (row.loc.includes(PRINT_ROUTE)) err(`sitemap contains the noindex print route: ${row.loc}`);

    // Canonical URLs must serve 200 directly (no redirect).
    const direct = await fetchOnce(`${BASE}${row.path}`, 'manual');
    const directStatus = direct.status;
    if (directStatus !== 200) {
      err(`${row.path}: expected 200 on the canonical URL, got ${directStatus}${direct.location ? ` -> ${direct.location}` : ''}`);
    }
    if (direct.location) err(`${row.path}: canonical URL redirects to ${direct.location}`);

    if (!direct.res) { matrix.push({ route: row.path, status: directStatus, canonical: null, ogUrl: null, robots: null, sitemap: row.loc, ok: false }); continue; }
    const html = await direct.res.text();
    const meta = extractMeta(html);

    const expectedCanonical = expectedUrl(row.path);
    const expectedOg = expectedCanonical;

    if (meta.canonicals.length !== 1) {
      err(`${row.path}: ${meta.canonicals.length} canonical tags (expected exactly 1)`);
    }
    if (meta.canonical !== expectedCanonical) {
      err(`${row.path}: canonical ${meta.canonical} != expected ${expectedCanonical}`);
    }
    const canHost = meta.canonical ? hostOf(meta.canonical) : null;
    if (meta.canonical && canHost !== CANONICAL_HOST) err(`${row.path}: canonical host is ${canHost}, not ${CANONICAL_HOST}`);
    if (meta.canonical && /^http:\/\//.test(meta.canonical)) err(`${row.path}: canonical is not https`);
    if (meta.canonical && /localhost|127\.0\.0\.1|\.vercel\.app|example\.com/i.test(meta.canonical)) err(`${row.path}: canonical references a non-production host (${meta.canonical})`);
    if (meta.canonical && hostOf(meta.canonical) === APEX_HOST) err(`${row.path}: canonical uses the apex host`);

    if (meta.ogUrl && meta.ogUrl !== expectedOg) err(`${row.path}: og:url ${meta.ogUrl} != canonical ${expectedOg}`);
    if (meta.ogUrl && hostOf(meta.ogUrl) !== CANONICAL_HOST) err(`${row.path}: og:url host is ${hostOf(meta.ogUrl)}`);

    /* JSON-LD URLs and absolute internal links must use the canonical host. The
       `https://schema.org` vocabulary context and any third-party citations are not
       site URLs, so only measuretobuild hosts (and banned host names) are gated. */
    const jsonLdUrls = (meta.jsonLdText.match(/https?:\/\/[^"'\s\\]+/g) || []);
    for (const u of jsonLdUrls) {
      if (/measuretobuild\.in/i.test(u) && hostOf(u) !== CANONICAL_HOST) err(`${row.path}: JSON-LD URL uses a non-canonical host (${u})`);
      if (/localhost|127\.0\.0\.1|\.vercel\.app|example\.com/i.test(u)) err(`${row.path}: JSON-LD URL references a non-production host (${u})`);
    }
    jsonLdUrlTotal += jsonLdUrls.length;
    for (const href of meta.absLinks) {
      if (/measuretobuild\.in/i.test(href) && hostOf(href) !== CANONICAL_HOST) {
        err(`${row.path}: absolute internal link uses a non-canonical host (${href})`);
      }
      if (/localhost|127\.0\.0\.1|\.vercel\.app|example\.com/i.test(href)) {
        err(`${row.path}: absolute internal link references a non-production host (${href})`);
      }
    }
    absLinkTotal += meta.absLinks.length;
    for (const href of meta.absLinks) absLinkSet.add(href);

    const isPrint = row.path === PRINT_ROUTE;
    if (isPrint) {
      if (!/noindex/i.test(meta.robotsMeta || '')) err(`${PRINT_ROUTE}: robots is ${JSON.stringify(meta.robotsMeta)}, expected noindex`);
    } else if (/noindex/i.test(meta.robotsMeta || '')) {
      err(`${row.path}: accidental noindex (${meta.robotsMeta})`);
    }

    if (meta.canonical) {
      canonicalSeen.set(meta.canonical, [...(canonicalSeen.get(meta.canonical) || []), row.path]);
    }

    matrix.push({
      route: row.path,
      status: directStatus,
      canonical: meta.canonical,
      ogUrl: meta.ogUrl,
      robots: meta.robotsMeta,
      sitemap: row.loc,
      ok: meta.canonical === expectedCanonical && meta.canonicals.length === 1 && directStatus === 200 && !direct.location,
    });
  }

  /* ---- duplicate canonicals ---- */
  for (const [canonical, routes] of canonicalSeen) {
    if (routes.length > 1) err(`duplicate canonical ${canonical}: ${routes.join(', ')}`);
  }

  /* ---- print route explicitly excluded + noindex ---- */
  if (sitemapRows.some((r) => r.path === PRINT_ROUTE)) err('sitemap must exclude /projects/print');
  const printRes = await fetchOnce(`${BASE}${PRINT_ROUTE}`, 'manual');
  if (printRes.status !== 200) warn(`${PRINT_ROUTE}: HTTP ${printRes.status}`);
  else {
    const printHtml = await printRes.res.text();
    const printMeta = extractMeta(printHtml);
    if (!/noindex/i.test(printMeta.robotsMeta || '')) err(`${PRINT_ROUTE}: expected noindex, got ${printMeta.robotsMeta}`);
  }

  /* ---- short aliases -> canonical page (permanent redirect) ---- */
  const aliasResults = [];
  for (const [from, to] of ALIASES) {
    const res = await fetchOnce(`${BASE}${from}`, 'manual');
    const location = res.location || '';
    const ok = [301, 308].includes(res.status) && normPath(location) === to;
    if (!ok) err(`${from}: expected a permanent redirect (301/308) to ${to}, got ${res.status} -> ${location}`);
    aliasResults.push({ from, status: res.status, location, ok });
  }

  /* ---- query parameters must not leak into the canonical ---- */
  const queryCheck = [];
  for (const p of ['/calculators/gravel-calculator', '/']) {
    const res = await fetchOnce(`${BASE}${p}?utm_source=test&utm_medium=qa`);
    if (res.status !== 200 || !res.res) { warn(`${p}?utm_source=test: HTTP ${res.status}`); continue; }
    const meta = extractMeta(await res.res.text());
    const ok = meta.canonical === expectedUrl(p) && !meta.canonical.includes('?');
    if (!ok) err(`${p}?utm_source=test: canonical leaked the query (${meta.canonical})`);
    queryCheck.push({ path: p, canonical: meta.canonical, ok });
  }

  /* ---- robots.txt pointer ---- */
  if (!robotsSitemap) err('robots.txt does not advertise a sitemap');
  else if (robotsSitemap !== `${ORIGIN}/sitemap.xml`) err(`robots.txt sitemap is ${robotsSitemap}, expected ${ORIGIN}/sitemap.xml`);
  if (/localhost|127\.0\.0\.1|\.vercel\.app/i.test(rbBody)) err('robots.txt references a non-production host');

  /* ---- optional live domain variant probe (requires public network) ---- */
  let variants = null;
  if (has('variants')) {
    variants = [];
    const targets = [
      'https://www.measuretobuild.in/',
      'https://measuretobuild.in/',
      'http://www.measuretobuild.in/',
      'http://measuretobuild.in/',
    ];
    for (const url of targets) {
      const res = await fetchOnce(url, 'manual');
      variants.push({ url, status: res.status, location: res.location });
    }
  }

  /* ---- report ---- */
  const report = {
    generatedAt: new Date().toISOString(),
    base: BASE,
    origin: ORIGIN,
    sitemapCount: locs.length,
    robotsSitemap,
    matrix,
    aliases: aliasResults,
    queryCheck,
    variants,
    absoluteLinks: [...absLinkSet],
    summary: {
      routesTested: matrix.length,
      canonicalMatch: matrix.filter((m) => m.ok).length,
      jsonLdUrlsChecked: jsonLdUrlTotal,
      absoluteLinksChecked: absLinkTotal,
      errors: errors.length,
      warnings: warnings.length,
    },
    errors,
    warnings,
  };
  fs.writeFileSync(path.join(ART, 'www-canonical-audit.json'), JSON.stringify(report, null, 2));
  return finish();
}

function finish() {
  const reportPath = path.join(ART, 'www-canonical-audit.json');
  if (fs.existsSync(reportPath)) {
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    console.log(`sitemap URLs: ${report.sitemapCount}`);
    console.log('\n=== route matrix (status | route | canonical | og:url | robots) ===');
    for (const row of report.matrix) {
      console.log(`${row.ok ? 'OK ' : 'BAD'} ${row.status} ${row.route} | ${row.canonical} | ${row.ogUrl} | ${row.robots}`);
    }
    console.log('\n=== errors ===');
    if (!report.errors.length) console.log('(none)');
    for (const e of report.errors) console.log(`FAIL: ${e}`);
    console.log('\n=== warnings ===');
    if (!report.warnings.length) console.log('(none)');
    for (const w of report.warnings) console.log(`WARN: ${w}`);
    console.log(`\nSUMMARY routes=${report.summary.routesTested} canonical-match=${report.summary.canonicalMatch} jsonld-urls=${report.summary.jsonLdUrlsChecked} abs-links=${report.summary.absoluteLinksChecked} errors=${report.summary.errors} warnings=${report.summary.warnings}`);
    console.log(`artifact: ${path.relative(ROOT, reportPath)}`);
    console.log(errors.length ? '\nRESULT: FAIL' : '\nRESULT: PASS');
  }
  process.exitCode = errors.length ? 1 : 0;
}

main().catch((e) => { console.error('audit crashed:', e); process.exitCode = 1; });
