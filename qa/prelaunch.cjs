'use strict';
/**
 * npm run qa:prelaunch — the single Phase 6 pre-launch gate.
 *
 * Runs every check sequentially against a FRESH production build served on its
 * own port, aggregates the findings of the existing QA scripts (most of which
 * exit 0 regardless of results), and exits non-zero when a critical gate fails.
 *
 *   npm run qa:prelaunch                 # everything
 *   npm run qa:prelaunch -- --only=typecheck,tests
 *   npm run qa:prelaunch -- --skip-browser   # static gates only
 *   npm run qa:prelaunch -- --port=3123
 *
 * Design rules:
 *   - never fake a browser result: if Chrome/Edge is missing the browser steps
 *     are reported as NOT RUN (status SKIP/WARN), never PASS;
 *   - never trust a stale server: any listener on the QA port is killed, the
 *     production build runs first, and the served HTML must contain the current
 *     BUILD_ID before browser QA starts;
 *   - combine, do not duplicate: the SEO crawl produces both the SEO audit and
 *     the route/link audit from one pass.
 */
const { spawn, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const net = require('node:net');
const path = require('node:path');
const http = require('node:http');

const ROOT = path.resolve(__dirname, '..');
const ART = path.join(__dirname, 'artifacts');
fs.mkdirSync(ART, { recursive: true });

const argv = process.argv.slice(2);
const flagValue = (name, fallback) => {
  const hit = argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};
const hasFlag = (name) => argv.includes(`--${name}`);

const PORT = Number(flagValue('port', process.env.QA_PORT || 3100));
const BASE = `http://localhost:${PORT}`;
const SKIP_BROWSER = hasFlag('skip-browser');
const ONLY = flagValue('only', '').split(',').map((s) => s.trim()).filter(Boolean);

const results = [];
function record(name, status, details, meta = {}) {
  results.push({ name, status, details, critical: meta.critical !== false, meta });
  const tag = { PASS: '[PASS]', FAIL: '[FAIL]', WARN: '[WARN]', SKIP: '[SKIP]' }[status];
  console.log(`${tag} ${name}${details && status !== 'PASS' ? ` — ${details[0] ?? ''}` : ''}`);
  return status;
}

/* ----------------------------------------------------------------- commands */

function run(cmd, { logFile, env } = {}) {
  const started = Date.now();
  const res = spawnSync(cmd, {
    cwd: ROOT,
    shell: true,
    encoding: 'utf8',
    env: { ...process.env, ...(env || {}) },
    maxBuffer: 32 * 1024 * 1024,
  });
  const output = `$ ${cmd}\n${res.stdout || ''}${res.stderr || ''}`;
  if (logFile) fs.writeFileSync(path.join(ART, logFile), output);
  return { ok: res.status === 0, code: res.status, output, ms: Date.now() - started };
}

/** Start `cmd` in the background, returning the child process. */
function startBackground(cmd, logFile) {
  const out = fs.openSync(path.join(ART, logFile), 'w');
  const child = spawn(cmd, { cwd: ROOT, shell: true, stdio: ['ignore', out, out] });
  return child;
}

function portInUse(port) {
  return new Promise((resolve) => {
    const socket = net.connect({ port, host: '127.0.0.1' });
    socket.once('connect', () => { socket.destroy(); resolve(true); });
    socket.once('error', () => resolve(false));
    socket.setTimeout(1000, () => { socket.destroy(); resolve(false); });
  });
}

function pidsOnPort(port) {
  const res = spawnSync(`netstat -ano | findstr :${port}`, { shell: true, encoding: 'utf8' });
  const pids = new Set();
  for (const line of (res.stdout || '').split(/\r?\n/)) {
    if (!line.includes('LISTENING')) continue;
    const parts = line.trim().split(/\s+/);
    const pid = Number(parts[parts.length - 1]);
    if (Number.isInteger(pid) && pid > 0) pids.add(pid);
  }
  return [...pids];
}

async function freePort(port) {
  const pids = pidsOnPort(port);
  for (const pid of pids) {
    spawnSync(`taskkill /PID ${pid} /T /F`, { shell: true, encoding: 'utf8' });
  }
  // give the OS a moment to release the socket
  for (let i = 0; i < 20 && (await portInUse(port)); i++) {
    await new Promise((r) => setTimeout(r, 250));
  }
  return pids;
}

function get(url, timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, { timeout: timeoutMs }, (res) => {
      let body = '';
      res.on('data', (c) => { body += c; });
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('timeout', () => { req.destroy(new Error('timeout')); });
    req.on('error', reject);
  });
}

async function waitForServer(url, timeoutMs = 90000) {
  const deadline = Date.now() + timeoutMs;
  let lastError = '';
  while (Date.now() < deadline) {
    try {
      const res = await get(url, 5000);
      if (res.status === 200) return res;
      lastError = `HTTP ${res.status}`;
    } catch (error) {
      lastError = error.message;
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`server not ready within ${timeoutMs}ms (${lastError})`);
}

function readJson(name) {
  const file = path.join(ART, name);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    return null;
  }
}

function chromeAvailable() {
  try {
    return Boolean(require('./lib.cjs').CHROME);
  } catch (error) {
    return false;
  }
}

/** Detect the browser harness: puppeteer-core must resolve and a Chrome/Edge binary must exist. */
function browserTooling() {
  try {
    require.resolve('puppeteer-core');
  } catch {
    return { ok: false, reason: 'puppeteer-core is not installed — browser QA NOT RUN (npm i -D puppeteer-core)' };
  }
  try {
    if (!require('./lib.cjs').CHROME) {
      return { ok: false, reason: 'no Chrome/Edge executable found — browser QA NOT RUN' };
    }
  } catch (error) {
    return { ok: false, reason: `browser harness unavailable (${error.message}) — browser QA NOT RUN` };
  }
  return { ok: true, reason: null };
}

/* --------------------------------------------------------------- evaluators */

const INDEXABLE_ROUTES = 54;   // 10 static (incl. /projects/print) + 16 calculators + 28 content
const SITEMAP_EXPECTED = 53;   // indexable minus /projects/print (noindex)
const PRINT_ROUTE = '/projects/print';

function duplicates(map) {
  return Object.entries(map || {}).filter(([, routes]) => routes.length > 1);
}

function headingSkips(order) {
  const skips = [];
  for (let i = 1; i < (order || []).length; i++) {
    if (order[i] - order[i - 1] > 1) skips.push(`${order[i - 1]} -> ${order[i]}`);
  }
  return skips;
}

/** Step: SEO production audit (metadata, canonicals, H1, robots, sitemap, 404). */
function evaluateSeo(report) {
  const issues = [];
  if (!report) return ['seo.json missing — the crawl did not run'];
  const pages = report.pages || [];
  if (pages.length !== INDEXABLE_ROUTES) issues.push(`crawled ${pages.length} pages, expected ${INDEXABLE_ROUTES}`);

  for (const p of pages) {
    if (p.status !== 200) issues.push(`${p.route}: HTTP ${p.status}`);
    if (!p.title) issues.push(`${p.route}: missing <title>`);
    if (!p.description) issues.push(`${p.route}: missing meta description`);
    if (!p.canonical) issues.push(`${p.route}: missing canonical`);
    if (p.canonicalCount !== 1) issues.push(`${p.route}: ${p.canonicalCount} canonical tags`);
    if (!p.ogTitle || !p.ogDescription) issues.push(`${p.route}: incomplete Open Graph metadata`);
    if ((p.h1 || []).length !== 1) issues.push(`${p.route}: ${JSON.stringify(p.h1)} H1 tags`);
    const skips = headingSkips(p.headingOrder);
    if (skips.length) issues.push(`${p.route}: heading level skip ${skips.join(', ')}`);
    if (!p.hasIcon) issues.push(`${p.route}: missing favicon link`);
    if (p.pageErrors && p.pageErrors.length) issues.push(`${p.route}: page errors ${p.pageErrors.join(' | ')}`);
    if (p.console && p.console.length) {
      issues.push(`${p.route}: console ${p.console.map((c) => `${c.type}: ${c.text}`).join(' | ')}`);
    }
    if (p.lang !== 'en') issues.push(`${p.route}: html lang is ${JSON.stringify(p.lang)}`);
    // The home page and the browser-only print utility intentionally have no breadcrumbs.
    if (!p.breadcrumbNav && p.route !== '/' && p.route !== PRINT_ROUTE) {
      issues.push(`${p.route}: no breadcrumb navigation`);
    }
  }

  for (const [title, routes] of duplicates(report.titles)) issues.push(`duplicate title "${title}": ${routes.join(', ')}`);
  for (const [, routes] of duplicates(report.descriptions)) issues.push(`duplicate description on ${routes.join(', ')}`);
  for (const [canonical, routes] of duplicates(report.canonicals)) issues.push(`duplicate canonical ${canonical}: ${routes.join(', ')}`);

  for (const p of pages) {
    const robots = p.robotsMeta;
    if (p.route === PRINT_ROUTE) {
      if (robots !== 'noindex, follow') issues.push(`${PRINT_ROUTE}: robots is ${JSON.stringify(robots)}, expected "noindex, follow"`);
    } else if (robots && /noindex/.test(robots)) {
      issues.push(`${p.route}: accidental noindex (${robots})`);
    }
  }

  const sm = report.sitemap;
  if (!sm || sm.status !== 200) issues.push(`sitemap.xml status ${sm && sm.status}`);
  else {
    if (!/xml/.test(sm.contentType || '')) issues.push(`sitemap content-type ${sm.contentType}`);
    if (sm.count !== SITEMAP_EXPECTED) issues.push(`sitemap lists ${sm.count} urls, expected ${SITEMAP_EXPECTED}`);
    if ((sm.locs || []).some((l) => l.includes(PRINT_ROUTE))) issues.push('sitemap must exclude /projects/print');
  }
  for (const [loc, status] of Object.entries(report.sitemapStatus || {})) {
    if (status !== 200) issues.push(`sitemap url not 200: ${loc} (${status})`);
  }

  const rb = report.robots;
  if (!rb || rb.status !== 200) issues.push(`robots.txt status ${rb && rb.status}`);
  else if (!/sitemap:/i.test(rb.body || '')) issues.push('robots.txt does not advertise the sitemap');

  const nf = report.notFound;
  if (!nf || nf.status !== 404) issues.push(`404 page returned ${nf && nf.status}`);
  if (nf && !(nf.h1 || []).length) issues.push('404 page has no H1');

  return issues;
}

/** Step: route + internal link audit (same crawl, different questions). */
function evaluateLinks(report) {
  const issues = [];
  if (!report) return ['seo.json missing — the crawl did not run'];

  for (const [href, status] of Object.entries(report.linkStatus || {})) {
    // Only internal targets are gated; mailto:/tel:/third-party URLs are out of scope here.
    const internal = href.startsWith('/') || href.startsWith(`http://localhost:${PORT}`);
    if (!internal) continue;
    if (status !== 200) issues.push(`broken internal link ${href} -> ${status}`);
  }

  const normalise = (href) => {
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return null;
    let value = href.split('#')[0];
    if (!value) return null;
    if (/^https?:\/\//.test(value)) {
      try {
        const url = new URL(value);
        if (url.host !== `localhost:${PORT}`) return null;
        value = url.pathname;
      } catch {
        return null;
      }
    }
    if (!value.startsWith('/')) return null;
    if (value.length > 1 && value.endsWith('/')) value = value.slice(0, -1);
    return value;
  };

  const inbound = new Map();
  for (const page of report.pages || []) {
    for (const href of page.hrefs || []) {
      const target = normalise(href);
      if (target && target !== page.route) inbound.set(target, (inbound.get(target) || 0) + 1);
    }
  }
  for (const page of report.pages || []) {
    if (page.route !== '/' && !inbound.has(page.route)) {
      issues.push(`orphan page (no internal inbound links): ${page.route}`);
    }
  }

  // Intended architecture: calculator -> project guide, material, cost, related calculator, Project Mode.
  const calculators = (report.pages || []).filter((p) => /^\/calculators\/.+/.test(p.route));
  if (calculators.length !== 16) issues.push(`found ${calculators.length} calculator pages, expected 16`);
  for (const page of calculators) {
    const hrefs = new Set((page.hrefs || []).map((h) => (h || '').split('#')[0]));
    const any = (prefix) => [...hrefs].some((h) => h === prefix || h.startsWith(prefix));
    if (!any('/projects/')) issues.push(`${page.route}: missing project guide link`);
    if (!any('/materials/')) issues.push(`${page.route}: missing material guide link`);
    if (!any('/costs/')) issues.push(`${page.route}: missing cost guide link`);
    if (![...hrefs].some((h) => h.startsWith('/calculators/') && h !== page.route)) {
      issues.push(`${page.route}: missing related calculator link`);
    }
    if (!hrefs.has('/projects')) issues.push(`${page.route}: missing Project Mode link`);
  }
  return issues;
}

/** Step: calculator contract audit in a real browser. */
function evaluateCalculators(report) {
  const issues = [];
  if (!report) return ['calculators.json missing — the browser calculator audit did not run'];
  const entries = Object.entries(report);
  if (entries.length !== 16) issues.push(`audited ${entries.length} calculators, expected 16`);
  for (const [slug, r] of entries) {
    if (r.status !== 200) issues.push(`${slug}: HTTP ${r.status}`);
    for (const failure of r.failures || []) issues.push(`${slug}: ${failure}`);
    for (const err of r.pageErrors || []) issues.push(`${slug}: uncaught ${err}`);
    for (const c of r.hydrationWarnings || []) issues.push(`${slug}: hydration ${c.text}`);
    for (const c of r.console || []) issues.push(`${slug}: console ${c.type}: ${c.text}`);
    for (const m of r.mismatches || []) issues.push(`${slug}: engine/UI mismatch ${JSON.stringify(m)}`);
    const related = Array.isArray(r.relatedStatus)
      ? r.relatedStatus
      : Object.entries(r.relatedStatus || {});
    for (const [href, status] of related) {
      if (status !== 200) issues.push(`${slug}: related link ${href} -> ${status}`);
    }
    if (!(r.relatedStatus && (Array.isArray(r.relatedStatus) ? r.relatedStatus.length : Object.keys(r.relatedStatus).length))) {
      issues.push(`${slug}: no related-calculator links checked`);
    }
    const empty = r.emptyFields || {};
    if (!Array.isArray(empty.summary) || !empty.summary.length) issues.push(`${slug}: empty input produced no field message`);
    if (empty.hasResult) issues.push(`${slug}: empty input still produced a result`);
    if (empty.bodyHasNaN) issues.push(`${slug}: page shows NaN for empty input`);
    if (!Array.isArray(empty.highlighted) || !empty.highlighted.length) {
      issues.push(`${slug}: empty input did not highlight the offending field`);
    }
    if (r.huge && r.huge.bodyHasNaN) issues.push(`${slug}: very large input produced NaN`);
    if (r.afterReset && r.afterReset.hasResult) issues.push(`${slug}: Reset left a stale result`);
  }
  return issues;
}

/** Step: Project Mode + printable plan browser audit. */
function evaluateProject(report) {
  const issues = [];
  if (!report) return ['project.json missing — the Project Mode audit did not run'];
  for (const failure of report.failures || []) issues.push(failure);
  for (const err of report.consoleErrors || []) issues.push(`console ${err.type}: ${err.text}`);
  for (const err of report.pageErrors || []) issues.push(`uncaught ${err}`);
  if (!report.printView || !report.printView.sections) issues.push('printable plan did not render its sections');
  if (!report.pageCount || report.pageCount < 1) issues.push('print-to-PDF produced no pages');
  if (!report.pdfBytes || report.pdfBytes < 1000) issues.push('print-to-PDF output is empty');
  if (report.printed && (report.printed.navVisible || report.printed.footerVisible || report.printed.toolbarVisible)) {
    issues.push('print output still shows site chrome');
  }
  if (report.printed && report.printed.overflowing) issues.push('print output overflows the page width');
  if (report.printed && report.printed.interactiveInSheet) issues.push('interactive controls remain in the printed sheet');
  const reload = report.afterReload || {};
  if (!(reload.materialHeadings || []).length) issues.push('persistence after reload lost the saved calculations');
  if (!reload.projectName) issues.push('persistence after reload lost the project name');
  return issues;
}

/** Step: accessibility audit (names, headings, focus, announcements, contrast). */
function evaluateA11y(report) {
  const issues = [];
  if (!report) return ['a11y.json missing — the accessibility audit did not run'];
  for (const [name, v] of Object.entries(report)) {
    const where = `(${name})`;
    if (v.base) {
      if (v.base.h1Count !== 1) issues.push(`${where} h1 count ${v.base.h1Count}`);
      if ((v.base.headingSkips || []).length) issues.push(`${where} heading skips ${v.base.headingSkips.join(', ')}`);
      if (v.base.unnamedControls) issues.push(`${where} ${v.base.unnamedControls} unlabelled form control(s)`);
      if (v.base.unnamedButtons) issues.push(`${where} ${v.base.unnamedButtons} button(s) without an accessible name`);
      if (v.base.unnamedLinks) issues.push(`${where} ${v.base.unnamedLinks} link(s) without an accessible name`);
      if (v.base.lang !== 'en') issues.push(`${where} html lang ${v.base.lang}`);
    }
    if (v.contrast && (v.contrast.failures || []).length) {
      issues.push(`${where} contrast ${v.contrast.failures.map((f) => `${f.sel}=${f.ratio}`).join(', ')}`);
    }
    if (v.contrastResultCard && (v.contrastResultCard.failures || []).length) {
      issues.push(`${where} result-card contrast ${v.contrastResultCard.failures.map((f) => `${f.sel}=${f.ratio}`).join(', ')}`);
    }
    if (v.focusNoIndicator && v.focusNoIndicator.length) {
      issues.push(`${where} focus without a visible indicator: ${v.focusNoIndicator.join(', ')}`);
    }
    if (v.tabStops !== undefined) {
      if (!v.reachedCalculate) issues.push(`${where} Calculate button not reachable by keyboard`);
      if (!v.reachedReset) issues.push(`${where} Reset button not reachable by keyboard`);
      const alerts = (v.errorAnnouncement || []).filter((a) => /could not run/.test(a.text));
      if (!alerts.length) issues.push(`${where} invalid input is not announced`);
      else if (!alerts.some((a) => a.role === 'alert')) issues.push(`${where} error announcement is not role="alert"`);
      if (!v.resultAnnouncement || !v.resultAnnouncement.resultRendered) issues.push(`${where} no result rendered`);
      else if (!(v.resultAnnouncement.liveRegionsInsideResult || []).length) {
        issues.push(`${where} result updates are not announced (no aria-live region)`);
      }
    }
    for (const err of v.consoleErrors || []) issues.push(`${where} console ${err}`);
  }
  return issues;
}

/** Step: content-library accessibility and layout audit. */
function evaluateContentA11y(report) {
  const issues = [];
  if (!report || !report.summary) return ['content-a11y.json missing — the content audit did not run'];
  const s = report.summary;
  const map = {
    non200: 'non-200 pages', h1Problems: 'H1 problems', headingSkips: 'heading skips',
    badJsonLd: 'missing/invalid JSON-LD', breadcrumbProblems: 'breadcrumb problems',
    mainProblems: 'main landmark problems', uncaptionedTables: 'uncaptioned tables',
    unlabelledDiagrams: 'unlabelled diagrams', unlabelledLinks: 'unlabelled links',
    brokenTocLinks: 'broken table-of-contents links', duplicateIds: 'duplicate ids',
    consoleProblems: 'pages with console errors', mobileOverflow: 'mobile overflow',
    mobileH1Problems: 'mobile H1 problems', errors: 'crawl errors',
  };
  for (const [key, label] of Object.entries(map)) {
    const value = s[key];
    if (Array.isArray(value) && value.length) issues.push(`${label}: ${JSON.stringify(value)}`);
  }
  return issues;
}

/** Step: mobile / responsive audit across 320 -> 1440 px. */
function evaluateResponsive(report) {
  const issues = [];
  if (!report) return ['responsive.json missing — the mobile audit did not run'];
  for (const [name, page] of Object.entries(report)) {
    for (const [width, m] of Object.entries(page.widths || {})) {
      const label = `${name}@${width}px`;
      if (m.horizontalScroll) issues.push(`${label}: horizontal scroll (${m.scrollWidth} > ${m.viewportWidth})`);
      if ((m.inputsOffscreen || []).length) issues.push(`${label}: ${m.inputsOffscreen.length} input(s) outside the viewport`);
      if (m.smallTargetCount) issues.push(`${label}: ${m.smallTargetCount} tap target(s) under 40px`);
      if (m.headerOverflow) issues.push(`${label}: header overflow`);
      // A table wider than the viewport only breaks the layout when its wrapper
      // cannot scroll; `.table-wrap{overflow-x:auto}` is the intended pattern for
      // wide tables and is what the content library uses everywhere.
      const wideTables = (m.tableOverflow || []).filter(
        (t) => t.scrollWidth > m.viewportWidth && !/auto|scroll/.test(t.parentOverflowX || ''),
      );
      if (wideTables.length) issues.push(`${label}: ${wideTables.length} table(s) overflow the page with no scroll wrapper`);
      if (m.console) issues.push(`${label}: ${m.console} console message(s)`);
    }
  }
  return issues;
}

/** Step: static performance inspection (no scoring framework, no new dependencies). */
function evaluatePerformance(buildLog) {
  const findings = [];

  const sourceFiles = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(tsx?|jsx?)$/.test(entry.name)) sourceFiles.push(full);
    }
  };
  walk(path.join(ROOT, 'src'));
  const clientComponents = sourceFiles.filter((f) => /^['"]use client['"];?/m.test(fs.readFileSync(f, 'utf8')));
  const serverCount = sourceFiles.length - clientComponents.length;
  findings.push(`INFO:${clientComponents.length} "use client" modules vs ${serverCount} server modules`);

  const withExternalScripts = sourceFiles.filter((f) => /<script[^>]+src=["']https?:\/\//i.test(fs.readFileSync(f, 'utf8')));
  if (withExternalScripts.length) {
    findings.push(`FAIL:third-party script tags in ${withExternalScripts.map((f) => path.relative(ROOT, f)).join(', ')}`);
  }

  const packageJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  const runtimeDeps = Object.keys(packageJson.dependencies || {});
  if (runtimeDeps.length > 6) findings.push(`INFO:${runtimeDeps.length} runtime dependencies`);
  for (const dep of runtimeDeps) {
    if (/analytics|adsbygoogle|gtag|hotjar|intercom/i.test(dep)) findings.push(`FAIL:third-party runtime dependency ${dep}`);
  }

  const nextConfig = fs.readFileSync(path.join(ROOT, 'next.config.ts'), 'utf8');
  if (!/compress:\s*true/.test(nextConfig)) findings.push('WARN:next.config.ts does not enable compression');

  // Next 16 does not print "First Load JS" rows, so measure the emitted static
  // payload directly instead of assuming a size table exists.
  const staticDir = path.join(ROOT, '.next', 'static');
  if (fs.existsSync(staticDir)) {
    let total = 0;
    let largest = 0;
    let count = 0;
    const walkSize = (dir) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walkSize(full);
        else {
          const bytes = fs.statSync(full).size;
          total += bytes;
          count += 1;
          if (/\.(js|mjs|css)$/.test(entry.name)) largest = Math.max(largest, bytes);
        }
      }
    };
    walkSize(staticDir);
    findings.push(`INFO:.next/static holds ${count} files, ${(total / 1024).toFixed(0)} kB total, largest JS/CSS chunk ${(largest / 1024).toFixed(0)} kB`);
    if (largest > 300 * 1024) findings.push(`WARN:largest static chunk is ${(largest / 1024).toFixed(0)} kB`);
  } else {
    findings.push('WARN:.next/static not found while measuring the emitted payload');
  }

  const publicDir = path.join(ROOT, 'src', 'app', 'public');
  const images = fs.existsSync(publicDir) ? fs.readdirSync(publicDir).length : 0;
  findings.push(`INFO:${images} file(s) in public/`);
  return findings;
}

/**
 * Step: production environment audit. Missing values are documented, never
 * invented, so they surface as WARN rather than FAIL.
 */
function evaluateEnvironment(seoReport, siteUrlUsed) {
  const findings = [];
  const siteUrl = siteUrlUsed || process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    findings.push('WARN:NEXT_PUBLIC_SITE_URL is unset — canonicals, Open Graph URLs, sitemap and robots.txt fall back to the seo.ts default. Set it before the production build.');
  } else if (/^http:\/\/localhost/.test(siteUrl)) {
    findings.push(`WARN:the tested build was made with the placeholder origin ${siteUrl} — a release build must set NEXT_PUBLIC_SITE_URL to the production https origin.`);
  } else if (!/^https:\/\//.test(siteUrl)) {
    findings.push(`WARN:NEXT_PUBLIC_SITE_URL is ${siteUrl} — production should use an https origin.`);
  }
  if (!process.env.NEXT_PUBLIC_CONTACT_EMAIL) {
    findings.push('WARN:NEXT_PUBLIC_CONTACT_EMAIL is unset — /about, /privacy and /terms render their fallback contact copy.');
  }

  const hasIcon = fs.existsSync(path.join(ROOT, 'src', 'app', 'icon.svg'))
    || fs.existsSync(path.join(ROOT, 'src', 'app', 'favicon.ico'));
  if (!hasIcon) findings.push('FAIL:no favicon source found in src/app');
  if (!fs.existsSync(path.join(ROOT, 'src', 'app', 'manifest.ts'))) {
    findings.push('WARN:no web app manifest present (optional).');
  }

  if (seoReport) {
    const home = (seoReport.pages || []).find((p) => p.route === '/');
    if (home && !home.ogUrl) findings.push('FAIL:home page has no og:url');
    if (seoReport.sitemap && (seoReport.sitemap.locs || []).some((l) => /localhost/.test(l))) {
      findings.push('WARN:sitemap urls point at localhost in this build (see NEXT_PUBLIC_SITE_URL).');
    }
    if (seoReport.robots && /localhost/.test(seoReport.robots.body || '')) {
      findings.push('WARN:robots.txt sitemap url points at localhost in this build.');
    }
    if (home && home.canonical && /localhost/.test(home.canonical)) {
      findings.push('WARN:canonical urls point at localhost in this build.');
    }
  }
  return findings;
}

/* -------------------------------------------------------------------- steps */

/** Record findings produced by an evaluator. `FAIL:`/`WARN:`/`INFO:` prefixes are honoured. */
function applyFindings(name, findings) {
  const fails = findings.filter((f) => f.startsWith('FAIL:') || (!/^(WARN|INFO):/.test(f)));
  const warns = findings.filter((f) => f.startsWith('WARN:'));
  const infos = findings.filter((f) => f.startsWith('INFO:'));
  if (fails.length) return record(name, 'FAIL', fails, { warns, infos });
  if (warns.length) return record(name, 'WARN', warns, { infos });
  return record(name, 'PASS', infos, { infos });
}

function stepExit(name, cmd, { logFile, env, countPattern } = {}) {
  const res = run(cmd, { logFile, env });
  if (!res.ok) {
    const tail = res.output.split(/\r?\n/).filter(Boolean).slice(-12);
    return record(name, 'FAIL', tail, { ms: res.ms });
  }
  const meta = { ms: res.ms };
  if (countPattern) {
    const match = res.output.match(countPattern);
    if (match) meta.counts = match[0].replace(/\s+/g, ' ').trim();
  }
  return record(name, 'PASS', [meta.counts || `ok in ${res.ms}ms`], meta);
}

function stepTypecheck() {
  return stepExit('typecheck', 'npm run typecheck', { logFile: 'prelaunch-typecheck.log' });
}

function stepUnitTests() {
  const res = stepExit('unit tests', 'npm test', {
    logFile: 'prelaunch-unit-tests.log',
    countPattern: /ℹ tests \d+[\s\S]{0,80}?ℹ fail \d+/,
  });
  return res;
}

function stepContentTests() {
  const res = run('npm run test:content', { logFile: 'prelaunch-content-tests.log' });
  if (!res.ok) {
    return record('content tests', 'FAIL', res.output.split(/\r?\n/).filter(Boolean).slice(-12));
  }
  let counts = 'ok';
  try {
    const json = JSON.parse(fs.readFileSync(path.join(ART, 'content.json'), 'utf8')).summary;
    const problems = [];
    for (const key of ['loadErrors', 'duplicateTitles', 'duplicateDescriptions', 'duplicatePaths',
      'duplicateParagraphs', 'pagesWithPlaceholders', 'pagesWithEmptySections',
      'examplesMissingResults', 'shortMetaTitles', 'longMetaDescriptions', 'sectionIdCollisions']) {
      const value = json[key];
      if (Array.isArray(value) && value.length) problems.push(`${key}: ${JSON.stringify(value).slice(0, 300)}`);
    }
    counts = `${json.pageCount} content pages, ${json.totalWords} words`;
    if (json.pageCount !== 28) problems.push(`expected 28 content pages, found ${json.pageCount}`);
    if (problems.length) return record('content tests', 'FAIL', problems);
  } catch (error) {
    return record('content tests', 'WARN', [`content summary unreadable: ${error.message}`]);
  }
  return record('content tests', 'PASS', [counts]);
}

function stepBuild() {
  // Build with an explicit site origin so canonicals, Open Graph URLs, the sitemap and
  // robots.txt all point at the server this run starts (instead of the seo.ts fallback
  // of http://localhost:3000, which may be a stale process). A real release sets
  // NEXT_PUBLIC_SITE_URL to the production origin; the environment audit reports that.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `http://localhost:${PORT}`;
  const res = run('npm run build', { logFile: 'prelaunch-build.log', env: { NEXT_PUBLIC_SITE_URL: siteUrl } });
  if (!res.ok) {
    return record('production build', 'FAIL', res.output.split(/\r?\n/).filter(Boolean).slice(-15));
  }
  const buildId = fs.existsSync(path.join(ROOT, '.next', 'BUILD_ID'))
    ? fs.readFileSync(path.join(ROOT, '.next', 'BUILD_ID'), 'utf8').trim()
    : '';
  return record('production build', 'PASS', [`BUILD_ID ${buildId} in ${res.ms}ms (site url ${siteUrl})`], { buildId, siteUrl, ms: res.ms });
}

/* ------------------------------------------------------- production server */

let serverChild = null;

async function stepServer() {
  const stale = await freePort(PORT);
  if (stale.length) console.log(`  released port ${PORT} from pid(s) ${stale.join(', ')}`);
  serverChild = startBackground(`npx next start -p ${PORT}`, 'prelaunch-server.log');
  const res = await waitForServer(`${BASE}/`);
  const buildId = fs.readFileSync(path.join(ROOT, '.next', 'BUILD_ID'), 'utf8').trim();
  if (!res.body.includes(buildId)) {
    throw new Error(`server on port ${PORT} is not serving the current build (${buildId} missing from the HTML)`);
  }
  record('production server', 'PASS', [`fresh build ${buildId} serving on ${BASE}`]);
  return true;
}

async function stopServer() {
  if (serverChild) {
    try { serverChild.kill(); } catch { /* already gone */ }
    serverChild = null;
  }
  await freePort(PORT);
}

/* ------------------------------------------------------------ browser steps */

function browserScript(name, cmd, { evaluator, artifact } = {}) {
  const res = run(cmd, { logFile: `prelaunch-${name.replace(/\s+/g, '-')}.log`, env: { QA_BASE: BASE } });
  const report = artifact ? readJson(artifact) : null;
  if (artifact && !report) {
    return record(name, 'FAIL', [`${artifact} was not written — the script did not complete`, ...res.output.split(/\r?\n/).filter(Boolean).slice(-6)]);
  }
  if (artifact === 'project.json' && !res.ok) {
    // project.cjs exits non-zero on its own failures; the evaluator reports them in detail
    return applyFindings(name, evaluator(report));
  }
  return applyFindings(name, evaluator(report));
}

/* --------------------------------------------------------------------- main */

async function main() {
  const startedAt = Date.now();
  const wanted = (name) => ONLY.length === 0 || ONLY.includes(name);
  console.log('=== npm run qa:prelaunch ===');
  console.log(`root: ${ROOT}\n`);

  /* static gates — no server needed */
  if (wanted('typecheck')) stepTypecheck();
  if (wanted('tests')) stepUnitTests();
  if (wanted('content')) stepContentTests();
  if (wanted('build')) stepBuild();

  const buildLog = fs.existsSync(path.join(ART, 'prelaunch-build.log'))
    ? fs.readFileSync(path.join(ART, 'prelaunch-build.log'), 'utf8')
    : '';
  const buildResult = results.find((r) => r.name === 'production build');
  const buildId = buildResult && buildResult.meta.buildId;

  /* browser gates */
  const BROWSER_STEPS = ['seo', 'links', 'calculators', 'project', 'a11y', 'content-a11y', 'mobile'];
  const needBrowser = BROWSER_STEPS.some((name) => wanted(name));
  let browserSkipReason = null;
  let serverOk = false;

  if (needBrowser) {
    const tooling = browserTooling();
    if (SKIP_BROWSER) browserSkipReason = 'browser checks skipped by --skip-browser';
    else if (!tooling.ok) browserSkipReason = tooling.reason;
    else if (!buildId) browserSkipReason = 'no successful production build to serve';
    else {
      try {
        serverOk = await stepServer();
      } catch (error) {
        record('production server', 'FAIL', [error.message]);
      }
    }
  }

  if (serverOk) {
    if (wanted('seo')) browserScript('seo', 'node qa/seo.cjs', { evaluator: evaluateSeo, artifact: 'seo.json' });
    const seoReport = readJson('seo.json');
    if (wanted('links')) applyFindings('route and link audit', evaluateLinks(seoReport));
    if (wanted('calculators')) {
      const regen = run('npx tsx qa/expected.ts', { logFile: 'prelaunch-expected.log' });
      if (!regen.ok) {
        record('calculator contract audit', 'FAIL', ['expected.json regeneration failed', ...regen.output.split(/\r?\n/).filter(Boolean).slice(-6)]);
      } else {
        browserScript('calculator contract audit', 'node qa/calc.cjs', { evaluator: evaluateCalculators, artifact: 'calculators.json' });
      }
    }
    if (wanted('project')) browserScript('project mode and printable plan', 'node qa/project.cjs', { evaluator: evaluateProject, artifact: 'project.json' });
    if (wanted('a11y')) browserScript('accessibility', 'node qa/a11y.cjs', { evaluator: evaluateA11y, artifact: 'a11y.json' });
    if (wanted('content-a11y')) browserScript('content accessibility', 'node qa/content-a11y.cjs', { evaluator: evaluateContentA11y, artifact: 'content-a11y.json' });
    if (wanted('mobile')) browserScript('mobile layout', 'node qa/responsive.cjs', { evaluator: evaluateResponsive, artifact: 'responsive.json' });
  } else if (needBrowser) {
    for (const name of BROWSER_STEPS) {
      if (wanted(name) && !results.some((r) => r.name === name)) {
        record(name, 'SKIP', [browserSkipReason || 'server unavailable']);
      }
    }
  }

  if (serverOk) await stopServer();

  /* static audits */
  if (wanted('performance')) applyFindings('performance', evaluatePerformance(buildLog));
  if (wanted('environment')) {
    applyFindings('production environment', evaluateEnvironment(readJson('seo.json'), buildResult && buildResult.meta.siteUrl));
  }

  /* summary */
  const failed = results.filter((r) => r.status === 'FAIL');
  const warned = results.filter((r) => r.status === 'WARN');
  const skipped = results.filter((r) => r.status === 'SKIP');
  const passed = results.filter((r) => r.status === 'PASS');
  const seconds = ((Date.now() - startedAt) / 1000).toFixed(1);

  console.log('\n=== pre-launch summary ===');
  for (const r of results) {
    const detail = r.details && r.details.length ? ` — ${typeof r.details[0] === 'string' ? r.details[0] : JSON.stringify(r.details[0])}` : '';
    console.log(`${r.status.padEnd(4)} ${r.name}${detail}`);
  }
  console.log(`\n${passed.length} PASS / ${warned.length} WARN / ${failed.length} FAIL / ${skipped.length} NOT RUN  (${seconds}s)`);

  const summary = {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE,
    buildId: buildId || null,
    only: ONLY,
    seconds: Number(seconds),
    results,
    verdict: failed.length
      ? 'NOT READY'
      : (warned.length || skipped.length ? 'READY WITH NON-BLOCKING WARNINGS' : 'READY FOR PRODUCTION'),
  };
  // A partial run (--only=...) must never overwrite the record of a full gate run.
  const summaryFile = ONLY.length ? 'prelaunch-summary-partial.json' : 'prelaunch-summary.json';
  fs.writeFileSync(path.join(ART, summaryFile), JSON.stringify(summary, null, 2));
  console.log(`verdict: ${summary.verdict}`);
  console.log(`summary: ${path.relative(ROOT, path.join(ART, summaryFile))}`);

  process.exitCode = failed.length ? 1 : 0;
}

if (require.main === module) {
  main().catch(async (error) => {
    console.error('qa:prelaunch crashed:', error);
    await stopServer().catch(() => {});
    process.exitCode = 1;
  });
}

module.exports = {
  evaluateSeo, evaluateLinks, evaluateCalculators, evaluateProject,
  evaluateA11y, evaluateContentA11y, evaluateResponsive, evaluatePerformance,
  evaluateEnvironment,
};







