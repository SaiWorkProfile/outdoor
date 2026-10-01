'use strict';
/**
 * npm run qa:analytics — Google Analytics (Google tag) verification.
 *
 * Verifies the MeasureToBuild GA4 install end to end against a running server:
 *   - static source checks (one implementation, correct ID, no GTM, no other G-* IDs);
 *   - rendered-HTML checks on every representative route (exactly one gtag loader, in <head>,
 *     with gtag('config', ID));
 *   - browser checks (network requests, window.dataLayer, window.gtag, client-side navigation,
 *     console errors) when Chrome/Edge is available.
 *
 * Usage:  node qa/google-analytics-audit.cjs [--base=http://localhost:3100]
 * Exit code 1 when any hard FAIL is found. Writes qa/artifacts/google-analytics-audit.json.
 *
 * Live network (googletagmanager.com / google-analytics.com) may be blocked in a sandbox; that
 * is reported as BLOCKED, not FAIL. This script is a development tool, not app code.
 */
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const ART = path.join(ROOT, 'qa', 'artifacts');
fs.mkdirSync(ART, { recursive: true });

const MEASUREMENT_ID = 'G-HK72FDCSWW';
const GTAG_SRC = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const hit = argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};
const BASE_URL = (flag('base', process.env.QA_BASE || 'http://localhost:3000')).replace(/\/+$/, '');

/* The task lists "/project"; the application route is "/projects" (see next.config /app). */
const ROUTES = [
  '/', '/calculators', '/calculators/gravel-calculator', '/calculators/concrete-calculator',
  '/calculators/fence-cost-calculator', '/projects', '/guides', '/about', '/privacy',
  '/terms', '/methodology', '/how-it-works',
];

const errors = [];
const warnings = [];
const notes = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);
const note = (m) => notes.push(m);

const countMatches = (text, re) => (text.match(re) || []).length;
const uniqueGIds = (text) => [...new Set(text.match(/\bG-[A-Z0-9]{9,}\b/g) || [])];

function walk(dir, acc) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (/\.(tsx?|jsx?)$/.test(entry.name)) acc.push(full);
  }
  return acc;
}

/** Static source audit: one implementation, correct ID, no GTM, no other G-* IDs. */
function sourceChecks() {
  const files = walk(path.join(ROOT, 'src'), []);
  const gtagFiles = [];
  const gtmFiles = [];
  const ids = new Set();
  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8');
    if (/googletagmanager\.com\/gtag\/js/.test(src)) gtagFiles.push(path.relative(ROOT, file));
    if (/GTM-[A-Z0-9]+|googletagmanager\.com\/gtm\.js/.test(src)) gtmFiles.push(path.relative(ROOT, file));
    for (const id of uniqueGIds(src)) ids.add(id);
  }

  const gaComponent = path.join(ROOT, 'src', 'components', 'analytics', 'GoogleTag.tsx');
  const componentSource = fs.existsSync(gaComponent) ? fs.readFileSync(gaComponent, 'utf8') : '';

  const envFiles = ['.env.production', '.env.example'].map((f) => path.join(ROOT, f)).filter(fs.existsSync);
  for (const f of envFiles) for (const id of uniqueGIds(fs.readFileSync(f, 'utf8'))) ids.add(id);

  if (gtagFiles.length !== 1) err(`src references the gtag.js loader in ${gtagFiles.length} files (expected 1): ${gtagFiles.join(', ')}`);
  if (!componentSource.includes(MEASUREMENT_ID)) err(`GoogleTag.tsx does not contain the measurement ID ${MEASUREMENT_ID}`);
  if (!/NEXT_PUBLIC_GA_ID/.test(componentSource)) warn('GoogleTag.tsx does not read NEXT_PUBLIC_GA_ID (ID is hardcoded only)');
  if (!/gtag\(\s*'config'/.test(componentSource)) err("GoogleTag.tsx does not call gtag('config', ...)");
  if (!/window\.dataLayer\s*=\s*window\.dataLayer\s*\|\|/.test(componentSource)) err('GoogleTag.tsx does not initialise window.dataLayer');
  if (!/function gtag\(\s*\)/.test(componentSource)) err('GoogleTag.tsx does not define the gtag() function');
  if (!/gtag\(\s*'js'\s*,\s*new Date\(\)\s*\)/.test(componentSource)) err("GoogleTag.tsx is missing gtag('js', new Date())");
  if (/strategy=/.test(componentSource)) note('GoogleTag uses a script strategy attribute');
  if (gtmFiles.length) err(`Google Tag Manager reference in source: ${gtmFiles.join(', ')}`);
  const otherIds = [...ids].filter((id) => id !== MEASUREMENT_ID);
  if (otherIds.length) err(`unexpected G-* IDs in source/config: ${otherIds.join(', ')}`);

  return {
    gtagFiles, gtmFiles,
    measurementIds: [...ids],
    measurementIdCorrect: ids.has(MEASUREMENT_ID) && otherIds.length === 0,
  };
}

/** Rendered-HTML audit: one loader in <head> + config call on every representative route. */
async function htmlChecks() {
  const rows = [];
  for (const route of ROUTES) {
    let res;
    try {
      res = await fetch(`${BASE_URL}${route}`);
    } catch (e) {
      err(`${route}: fetch failed (${e.message})`);
      rows.push({ route, error: e.message, ok: false });
      continue;
    }
    const html = await res.text();
    const headEnd = html.indexOf('</head>');
    const headHtml = headEnd > 0 ? html.slice(0, headEnd) : '';
    const loaderMatches = [...html.matchAll(/<script[^>]*\bsrc=["']https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-HK72FDCSWW["'][^>]*>/g)];
    const loaders = loaderMatches.length;
    const inHead = loaders === 1 && headEnd > 0 && loaderMatches[0].index < headEnd;
    const gtm = countMatches(html, /googletagmanager\.com\/gtm\.js/gi) + countMatches(html, /\bGTM-[A-Z0-9]{4,}\b/g);
    /* configCalls counts the executable call plus the escaped copy inside the RSC payload;
       configInHead is the executable one that actually runs. */
    const configCalls = countMatches(html, /gtag\(\s*'config'\s*,\s*'G-HK72FDCSWW'\s*\)/g);
    const configInHead = countMatches(headHtml, /gtag\(\s*'config'\s*,\s*'G-HK72FDCSWW'\s*\)/g);
    const otherG = uniqueGIds(html).filter((id) => id !== MEASUREMENT_ID);
    const hasSrc = html.includes(GTAG_SRC);
    const ok = res.status === 200 && loaders === 1 && inHead && configInHead === 1 && gtm === 0 && otherG.length === 0;

    if (res.status !== 200) err(`${route}: HTTP ${res.status}`);
    if (loaders === 0) err(`${route}: no gtag.js loader script found`);
    else if (loaders > 1) err(`${route}: ${loaders} gtag.js loader scripts (duplicate Google tag)`);
    if (loaders === 1 && !inHead) err(`${route}: gtag loader is not inside <head>`);
    if (!hasSrc) err(`${route}: expected gtag.js URL ${GTAG_SRC} not found`);
    if (configInHead !== 1) err(`${route}: ${configInHead} executable gtag('config', '${MEASUREMENT_ID}') call(s) in <head>, expected 1`);
    if (gtm) err(`${route}: Google Tag Manager reference detected in rendered HTML`);
    if (otherG.length) err(`${route}: unexpected G-* ID(s) in rendered HTML: ${otherG.join(', ')}`);

    rows.push({ route, status: res.status, loaders, inHead, hasSrc, configCalls, configInHead, gtm, otherG, ok });
  }
  return rows;
}

/** Browser audit: network requests, dataLayer/gtag, client-side navigation, console errors. */
async function browserChecks() {
  let lib;
  try { lib = require('./lib.cjs'); } catch (e) { note(`BLOCKED: browser tooling unavailable (${e.message})`); return null; }
  if (!lib.CHROME) { note('BLOCKED BY SANDBOX: no Chrome/Edge executable — browser verification NOT RUN'); return null; }

  const browser = await lib.launch();
  const page = await browser.newPage();
  const net = [];
  const consoleErrors = [];
  const pageErrors = [];
  const relevant = /googletagmanager\.com|google-analytics\.com|analytics\.google\.com/;

  page.on('request', (r) => { if (relevant.test(r.url())) net.push({ url: r.url(), kind: 'request' }); });
  page.on('requestfailed', (r) => { if (relevant.test(r.url())) net.push({ url: r.url(), kind: 'requestfailed', error: (r.failure() || {}).errorText || 'unknown' }); });
  page.on('response', (r) => { if (relevant.test(r.url())) net.push({ url: r.url(), kind: 'response', status: r.status() }); });
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push({ text: m.text(), url: (m.location() || {}).url || '' }); });
  page.on('pageerror', (e) => pageErrors.push(String(e && e.message ? e.message : e)));

  await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
  await new Promise((r) => setTimeout(r, 2500));

  const state = await page.evaluate(() => ({
    dataLayerIsArray: Array.isArray(window.dataLayer),
    dataLayerLength: Array.isArray(window.dataLayer) ? window.dataLayer.length : -1,
    gtagType: typeof window.gtag,
    domLoaders: document.querySelectorAll('script[src*="googletagmanager.com/gtag/js"]').length,
  }));

  const gtagReqs = net.filter((n) => /googletagmanager\.com\/gtag\/js/.test(n.url));
  const beacons = net.filter((n) => /google-analytics\.com|analytics\.google\.com/.test(n.url));
  const gtagHasId = gtagReqs.some((n) => n.url.includes(MEASUREMENT_ID));
  const gtagWrongId = gtagReqs.length > 0 && !gtagHasId;
  const gtagResponded = gtagReqs.some((n) => n.kind === 'response');
  const beaconResponded = beacons.some((n) => n.kind === 'response');
  const blocked = gtagReqs.length > 0 && !gtagResponded && gtagReqs.every((n) => n.kind !== 'response');

  let gtagStatus;
  if (gtagWrongId) gtagStatus = 'FAIL';
  else if (gtagHasId && gtagResponded) gtagStatus = 'PASS';
  else if (blocked) gtagStatus = 'BLOCKED BY SANDBOX NETWORK';
  else gtagStatus = 'NOT RUN';
  let beaconStatus = beaconResponded ? 'PASS' : (blocked ? 'BLOCKED BY SANDBOX NETWORK' : 'NOT RUN');

  const nav = [];
  for (const target of ['/calculators/gravel-calculator', '/projects', '/guides', '/about']) {
    const clicked = await page.evaluate((href) => {
      const a = Array.from(document.querySelectorAll('a[href]')).find((el) => el.getAttribute('href') === href);
      if (a) { a.click(); return true; }
      return false;
    }, target);
    if (clicked) {
      try { await page.waitForFunction((href) => location.pathname === href, { timeout: 12000 }, target); } catch { /* fall through */ }
    } else {
      await page.goto(`${BASE_URL}${target}`, { waitUntil: 'domcontentloaded' }).catch(() => {});
    }
    await new Promise((r) => setTimeout(r, 500));
    const after = await page.evaluate(() => ({
      path: location.pathname,
      domLoaders: document.querySelectorAll('script[src*="googletagmanager.com/gtag/js"]').length,
      dataLayerLength: Array.isArray(window.dataLayer) ? window.dataLayer.length : -1,
    }));
    const analyticsConsole = consoleErrors.filter((c) => /gtag|analytics|dataLayer|googletagmanager/i.test(c.text));
    nav.push({ target, clientSide: clicked, ...after, analyticsConsoleErrors: analyticsConsole.length });
    if (after.domLoaders !== 1) err(`navigation ${target}: ${after.domLoaders} gtag loaders in the DOM (expected 1)`);
    if (analyticsConsole.length) err(`navigation ${target}: ${analyticsConsole.length} analytics console error(s)`);
  }

  await browser.close();

  if (state.domLoaders !== 1) err(`browser DOM has ${state.domLoaders} gtag loader script(s), expected 1`);
  if (!state.dataLayerIsArray) err('window.dataLayer is not an array');
  if (state.gtagType !== 'function') err(`typeof window.gtag is ${state.gtagType}, expected 'function'`);
  if (gtagWrongId) err(`gtag.js requested without the expected ID: ${gtagReqs.map((n) => n.url).join(', ')}`);
  const analyticsConsole = consoleErrors.filter((c) => /gtag|analytics|dataLayer|googletagmanager/i.test(c.text));
  if (analyticsConsole.length) err(`analytics-related console error(s): ${analyticsConsole.map((c) => c.text).join(' | ')}`);
  if (pageErrors.length) err(`page error(s): ${pageErrors.join(' | ')}`);

  return {
    gtagStatus, beaconStatus,
    domLoaders: state.domLoaders,
    dataLayerIsArray: state.dataLayerIsArray,
    dataLayerLength: state.dataLayerLength,
    gtagType: state.gtagType,
    network: net,
    nav,
    consoleErrors,
    pageErrors,
  };
}

async function main() {
  console.log(`=== Google Analytics audit ===\nbase: ${BASE_URL}\nid:   ${MEASUREMENT_ID}\n`);

  const source = sourceChecks();
  note('/project is not an application route; the task list was satisfied with /projects (the real route).');
  console.log('--- source ---');
  console.log(`gtag.js loader referenced in: ${source.gtagFiles.join(', ') || '(none)'}`);
  console.log(`measurement IDs found: ${source.measurementIds.join(', ') || '(none)'}`);
  console.log(`GTM references: ${source.gtmFiles.length ? source.gtmFiles.join(', ') : 'none'}`);

  const html = await htmlChecks();
  console.log('\n--- rendered HTML (route | status | loaders | inHead | configInHead) ---');
  for (const r of html) console.log(`${r.ok ? 'OK ' : 'BAD'} ${r.status} ${r.route} | loaders=${r.loaders} inHead=${r.inHead} configInHead=${r.configInHead}`);

  let browser = null;
  try { browser = await browserChecks(); } catch (e) { warn(`browser verification error: ${e.message}`); }
  if (browser) {
    console.log('\n--- browser ---');
    console.log(`gtag.js request: ${browser.gtagStatus}`);
    console.log(`analytics beacons: ${browser.beaconStatus}`);
    console.log(`DOM gtag loaders: ${browser.domLoaders}`);
    console.log(`window.dataLayer: array=${browser.dataLayerIsArray} length=${browser.dataLayerLength}`);
    console.log(`typeof window.gtag: ${browser.gtagType}`);
    console.log(`console errors: ${browser.consoleErrors.length}, page errors: ${browser.pageErrors.length}`);
    console.log('--- client-side navigation ---');
    for (const n of browser.nav) console.log(`${n.clientSide ? 'click' : 'goto'} -> ${n.path} | loaders=${n.domLoaders} dataLayer=${n.dataLayerLength} analyticsErrors=${n.analyticsConsoleErrors}`);
    if (browser.network.length) {
      console.log('--- googletagmanager / google-analytics network ---');
      for (const n of browser.network) console.log(`${n.kind} ${n.status || n.error || ''} ${n.url}`);
    }
  } else {
    console.log('\n--- browser --- (not run)');
  }

  for (const n of notes) console.log(`NOTE: ${n}`);
  for (const w of warnings) console.log(`WARN: ${w}`);
  for (const e of errors) console.log(`FAIL: ${e}`);

  const report = {
    generatedAt: new Date().toISOString(),
    base: BASE_URL,
    measurementId: MEASUREMENT_ID,
    source,
    html,
    browser,
    notes,
    warnings,
    errors,
    summary: {
      routesChecked: html.length,
      routesPass: html.filter((r) => r.ok).length,
      errors: errors.length,
      warnings: warnings.length,
    },
  };
  fs.writeFileSync(path.join(ART, 'google-analytics-audit.json'), JSON.stringify(report, null, 2));
  console.log(`\nSUMMARY routes=${report.summary.routesChecked} pass=${report.summary.routesPass} errors=${errors.length} warnings=${warnings.length}`);
  console.log('artifact: qa/artifacts/google-analytics-audit.json');
  console.log(errors.length ? '\nRESULT: FAIL' : '\nRESULT: PASS');
  process.exitCode = errors.length ? 1 : 0;
}

main().catch((e) => { console.error('audit crashed:', e); process.exitCode = 1; });
