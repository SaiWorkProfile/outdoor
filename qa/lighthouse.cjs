'use strict';
/**
 * Lighthouse/PageSpeed audit for the production build (section 13).
 * Usage: node qa/lighthouse.cjs
 * Lighthouse CLI is invoked as a child process per URL; results are summarised to JSON.
 */
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const BASE = process.env.QA_BASE ?? 'http://localhost:3000';
const URLS = [
  ['homepage', '/'],
  ['gravel-calculator', '/calculators/gravel-calculator'],
  ['fence-calculator', '/calculators/fence-calculator'],
  ['paver-calculator', '/calculators/paver-calculator'],
];
const CLI = path.join(__dirname, '..', 'node_modules', 'lighthouse', 'cli', 'index.js');
const OUT = path.join(__dirname, 'artifacts');
fs.mkdirSync(OUT, { recursive: true });

const summary = {};
for (const [name, route] of URLS) {
  const outPath = path.join(OUT, `lh-${name}.json`);
  const started = Date.now();
  try {
    execFileSync(process.execPath, [
      CLI, `${BASE}${route}`,
      '--output=json', `--output-path=${outPath}`,
      '--chrome-flags=--headless=new --no-sandbox --disable-dev-shm-usage',
      '--only-categories=performance,accessibility,best-practices,seo',
      '--quiet', '--max-wait-for-load=45000',
    ], { stdio: 'ignore', timeout: 180000 });
    const lhr = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    const audit = (id) => lhr.audits[id];
    const failed = Object.values(lhr.audits)
      .filter((a) => a.score !== null && a.score < 1 && a.scoreDisplayMode === 'binary')
      .map((a) => a.id);
    summary[name] = {
      route,
      seconds: Math.round((Date.now() - started) / 1000),
      scores: Object.fromEntries(Object.entries(lhr.categories).map(([k, v]) => [k, Math.round((v.score ?? 0) * 100)])),
      metrics: {
        FCP: audit('first-contentful-paint').displayValue,
        LCP: audit('largest-contentful-paint').displayValue,
        TBT: audit('total-blocking-time').displayValue,
        CLS: audit('cumulative-layout-shift').displayValue,
        SI: audit('speed-index').displayValue,
        TTI: audit('interactive') ? audit('interactive').displayValue : undefined,
      },
      transferKb: Math.round((audit('total-byte-weight').numericValue ?? 0) / 1024),
      jsKb: Math.round(((audit('total-byte-weight').numericValue ?? 0)) / 1024),
      unusedJsKb: audit('unused-javascript') ? Math.round((audit('unused-javascript').details?.overallSavingsBytes ?? 0) / 1024) : null,
      mainThreadMs: audit('mainthread-work-breakdown')?.displayValue,
      bootupMs: audit('bootup-time')?.displayValue,
      domNodes: audit('dom-size')?.displayValue,
      renderBlockingMs: audit('render-blocking-resources')?.displayValue ?? 'none',
      failedBinaryAudits: failed,
      a11yFailingNodes: lhr.categories.accessibility?.auditRefs
        ?.map((r) => lhr.audits[r.id])
        .filter((a) => a && a.score !== null && a.score < 1 && a.scoreDisplayMode === 'binary')
        .map((a) => a.id) ?? [],
    };
    console.log(`${name}: done in ${summary[name].seconds}s`);
  } catch (e) {
    summary[name] = { route, error: String(e.message).slice(0, 300) };
    console.log(`${name}: FAILED ${String(e.message).slice(0, 200)}`);
  }
}
fs.writeFileSync(path.join(OUT, 'lighthouse.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
