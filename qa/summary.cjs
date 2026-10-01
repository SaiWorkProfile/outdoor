'use strict';
/** Summarise QA artifact JSON files. Usage: node qa/summary.cjs a11y */
const fs = require('node:fs');
const path = require('node:path');
const which = process.argv[2] || 'a11y';
const file = path.join(__dirname, 'artifacts', `${which}.json`);
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

if (which === 'a11y') {
  for (const [name, v] of Object.entries(data)) {
    console.log(`--- ${name} ---`);
    console.log(`  lang=${v.base.lang} h1=${v.base.h1Count} headingSkips=${JSON.stringify(v.base.headingSkips)}`);
    console.log(`  landmarks=${v.base.landmarks.join(', ')}`);
    console.log(`  controls=${v.base.controls.length} unnamedControls=${v.base.unnamedControls} unnamedButtons=${v.base.unnamedButtons} unnamedLinks=${v.base.unnamedLinks}`);
    console.log(`  contrastChecked=${v.contrast.checked} baseFailures=${v.contrast.failures.length} ${JSON.stringify(v.contrast.failures.map((f) => `${f.sel}=${f.ratio}`))}`);
    if (v.contrastResultCard) console.log(`  resultCardFailures=${v.contrastResultCard.failures.length} ${JSON.stringify(v.contrastResultCard.failures.map((f) => `${f.sel}=${f.ratio}`))}`);
    if (v.tabStops !== undefined) {
      console.log(`  tabStops=${v.tabStops} reachCalculate=${v.reachedCalculate} reachReset=${v.reachedReset} noIndicator=${JSON.stringify(v.focusNoIndicator)} notFocusVisible=${v.notFocusVisible}`);
      console.log(`  errorAnnouncement=${JSON.stringify((v.errorAnnouncement || []).filter((a) => /could not run/.test(a.text)).map((a) => `${a.role}:${a.text.slice(0, 70)}`))}`);
      console.log(`  resultLive=${JSON.stringify(v.resultAnnouncement)}`);
    }
    console.log(`  consoleErrors=${JSON.stringify(v.consoleErrors)}`);
  }
} else if (which === 'responsive') {
  for (const [name, v] of Object.entries(data)) {
    console.log(`--- ${name} (${v.route}) ---`);
    if (!v.issues.length) console.log('  no issues');
    for (const i of v.issues) console.log('  ' + i);
  }
} else if (which === 'project') {
  console.log('failures:', JSON.stringify(data.failures, null, 1));
  console.log('steps:'); for (const s of data.steps) console.log('  ' + s);
  console.log('printView.sections:', JSON.stringify(data.printView.sections));
  console.log('printView.tableCount:', data.printView.tableCount, 'rows:', JSON.stringify(data.printView.rowCounts));
  console.log('printed:', JSON.stringify(data.printed));
  console.log('pageCount:', data.pageCount, 'pdfBytes:', data.pdfBytes);
  console.log('storedSummary:', JSON.stringify(data.storedSummary));
  console.log('afterReload:', JSON.stringify(data.afterReload));
  console.log('consoleErrors:', JSON.stringify(data.consoleErrors), 'pageErrors:', JSON.stringify(data.pageErrors));
} else {
  console.log(JSON.stringify(data, null, 2).slice(0, 6000));
}
