'use strict';
/** Drill into specific Lighthouse audit details. Usage: node qa/lh-detail.cjs <report> <auditId|--mainthread> */
const fs = require('node:fs');
const path = require('node:path');
const report = path.join(__dirname, 'artifacts', `lh-${process.argv[2]}.json`);
const lhr = JSON.parse(fs.readFileSync(report, 'utf8'));
const arg = process.argv[3] || '--mainthread';

if (arg === '--mainthread') {
  for (const id of ['mainthread-work-breakdown', 'bootup-time', 'unused-javascript', 'total-byte-weight', 'third-party-summary', 'network-requests']) {
    const a = lhr.audits[id];
    if (!a || !a.details || !a.details.items) continue;
    console.log(`\n=== ${id} (${a.displayValue ?? ''}) ===`);
    const items = a.details.items.slice(0, 10);
    for (const it of items) {
      console.log('  ' + JSON.stringify(Object.fromEntries(Object.entries(it).map(([k, v]) => [k, typeof v === 'object' && v !== null ? (v.url || v.type || JSON.stringify(v).slice(0, 40)) : v]))).slice(0, 260));
    }
  }
} else {
  const a = lhr.audits[arg];
  console.log(`${arg}: score=${a.score} mode=${a.scoreDisplayMode} ${a.displayValue ?? ''}`);
  console.log(JSON.stringify(a.details, null, 1).slice(0, 3500));
}
