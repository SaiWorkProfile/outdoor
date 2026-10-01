'use strict';
/** Summarise raw Lighthouse JSON reports written by qa/lighthouse.cjs. */
const fs = require('node:fs');
const path = require('node:path');
const OUT = path.join(__dirname, 'artifacts');
const files = fs.readdirSync(OUT).filter((f) => /^lh-.*\.json$/.test(f));
const out = {};
for (const f of files) {
  const lhr = JSON.parse(fs.readFileSync(path.join(OUT, f), 'utf8'));
  const a = (id) => lhr.audits[id] || {};
  const numeric = (id) => (typeof a(id).numericValue === 'number' ? a(id).numericValue : null);
  const binaryFails = (cat) => (lhr.categories[cat]?.auditRefs || [])
    .map((r) => lhr.audits[r.id])
    .filter((x) => x && x.score !== null && x.score !== undefined && x.score < 1 && x.scoreDisplayMode === 'binary')
    .map((x) => x.id);
  out[f.replace(/^lh-|\.json$/g, '')] = {
    finalUrl: lhr.finalDisplayedUrl,
    scores: Object.fromEntries(Object.entries(lhr.categories).map(([k, v]) => [k, Math.round((v.score ?? 0) * 100)])),
    metrics: {
      FCP_ms: numeric('first-contentful-paint'),
      LCP_ms: numeric('largest-contentful-paint'),
      TBT_ms: numeric('total-blocking-time'),
      CLS: numeric('cumulative-layout-shift'),
      SI_ms: numeric('speed-index'),
      TTI_ms: numeric('interactive'),
    },
    totalByteWeightKb: Math.round((numeric('total-byte-weight') ?? 0) / 1024),
    unusedJsKb: a('unused-javascript').details ? Math.round((a('unused-javascript').details.overallSavingsBytes ?? 0) / 1024) : null,
    mainThreadMs: numeric('mainthread-work-breakdown'),
    scriptEvalMs: numeric('bootup-time'),
    domNodes: a('dom-size').displayValue,
    renderBlocking: a('render-blocking-resources').displayValue ?? 'none',
    lcpElement: a('largest-contentful-paint-element')?.details?.items?.[0]?.items?.[0]?.node?.snippet ?? null,
    layoutShiftElements: (a('layout-shifts')?.details?.items ?? []).map((i) => i.node?.snippet).slice(0, 3),
    perfBinaryFails: binaryFails('performance'),
    a11yBinaryFails: binaryFails('accessibility'),
    bestPracticeFails: binaryFails('best-practices'),
    seoBinaryFails: binaryFails('seo'),
    a11yScoreDetails: (lhr.categories.accessibility?.auditRefs || []).map((r) => lhr.audits[r.id]).filter((x) => x && x.score !== null && x.score < 1).map((x) => `${x.id} (${x.title})`),
    lhVersion: lhr.lighthouseVersion,
    testedAt: lhr.fetchTime,
  };
}
fs.writeFileSync(path.join(OUT, 'lighthouse-summary.json'), JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
