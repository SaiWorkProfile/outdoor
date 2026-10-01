'use strict';
/** Project Mode + Printable Project Plan end-to-end QA (sections 6 and 7). */
const fs = require('node:fs');
const path = require('node:path');
const { BASE, launch, emptyLog, watch, waitForCalculator, clickButton, resultSnapshot, writeJson, OUT } = require('./lib.cjs');

const STORAGE_KEY = 'outdoor-project-v1';
const steps = [];
const failures = [];
const PROGRESS = path.join(OUT, 'project-progress.txt');
const progress = (m) => { try { fs.appendFileSync(PROGRESS, new Date().toISOString() + ' ' + m + '\n'); } catch { /* ignore */ } };
const ok = (m) => { steps.push('PASS ' + m); progress('PASS ' + m); };
const fail = (m) => { failures.push('FAIL ' + m); steps.push('FAIL ' + m); progress('FAIL ' + m); };
process.on('unhandledRejection', (e) => { progress('UNHANDLED REJECTION: ' + (e && e.stack ? e.stack : String(e))); });
process.on('uncaughtException', (e) => { progress('UNCAUGHT EXCEPTION: ' + (e && e.stack ? e.stack : String(e))); });

async function addCalculation(page, slug) {
  progress('addCalculation goto ' + slug);
  await page.goto(`${BASE}/calculators/${slug}`, { waitUntil: 'networkidle0' });
  await waitForCalculator(page);
  await clickButton(page, 'Calculate');
  const before = await resultSnapshot(page);
  await clickButton(page, 'Add to Project');
  await page.evaluate(() => new Promise((r) => setTimeout(r, 150)));
  const label = await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('button')).find((x) => /project/i.test(x.textContent));
    return b ? b.textContent.trim() : null;
  });
  progress('addCalculation ' + slug + ' -> ' + label + ' metrics=' + before.metrics.length);
  return { metrics: before.metrics.length, buttonLabel: label };
}

/** Replace an input's value using real keyboard input (Ctrl+A then type), focusing via the DOM. */
async function retype(page, selector, value) {
  await page.evaluate((sel) => { const el = document.querySelector(sel); if (el) el.scrollIntoView({ block: 'center' }); }, selector);
  await page.focus(selector);
  await page.keyboard.down('Control');
  await page.keyboard.press('KeyA');
  await page.keyboard.up('Control');
  await page.keyboard.press('Backspace');
  await page.type(selector, value);
  await page.evaluate(() => new Promise((r) => setTimeout(r, 60)));
}

(async () => {
  const browser = await launch();
  const page = await browser.newPage();
  const log = emptyLog();
  watch(page, log);
  await page.setViewport({ width: 1440, height: 1000 });

  /* start clean */
  await page.goto(`${BASE}/projects`, { waitUntil: 'networkidle0' });
  await page.evaluate((key) => window.localStorage.removeItem(key), STORAGE_KEY);
  await page.reload({ waitUntil: 'networkidle0' });

  /* --- create project, add three calculations --- */
  const g = await addCalculation(page, 'gravel-calculator');
  const f = await addCalculation(page, 'fence-calculator');
  const d = await addCalculation(page, 'deck-material-calculator');
  if ([g, f, d].every((x) => /added/i.test(String(x.buttonLabel)))) ok('all three calculations added to the project');
  else fail('Add to Project did not confirm: ' + JSON.stringify([g.buttonLabel, f.buttonLabel, d.buttonLabel]));

  /* --- name the project + add an area --- */
  await page.goto(`${BASE}/projects`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('#project-name', { timeout: 15000 });
  await retype(page, '#project-name', 'Backyard Refresh 2026');
  await retype(page, '#area-length', '12');
  await retype(page, '#area-width', '20');
  await clickButton(page, 'Add area');

  await retype(page, '#area-length', '-4');
  await clickButton(page, 'Add area');
  const areaError = await page.evaluate(() => Array.from(document.querySelectorAll('.field-error')).map((e) => e.textContent.trim()));
  if (!areaError.length) fail('negative project area accepted without error'); else ok('invalid project area rejected with a message');
  progress('project named + area added');


  const projectView = await page.evaluate(() => ({
    heading: document.querySelector('h1') ? document.querySelector('h1').textContent.trim() : null,
    projectName: (document.querySelector('#project-name') || {}).value,
    materialHeadings: Array.from(document.querySelectorAll('.project-material-header h3')).map((h) => h.textContent.trim()),
    qtyRows: Array.from(document.querySelectorAll('.qty-row')).map((r) => r.textContent.trim()).slice(0, 24),
    assumptionRows: Array.from(document.querySelectorAll('.assumption-row')).map((r) => r.textContent.trim()).slice(0, 8),
    shoppingItems: Array.from(document.querySelectorAll('.shopping-item')).map((i) => i.textContent.trim()),
    totals: Array.from(document.querySelectorAll('.total-box strong')).map((e) => e.textContent.trim()),
    metrics: Array.from(document.querySelectorAll('.metric')).map((m) => ((m.querySelector('.metric-label') || {}).textContent || '').trim() + '=' + ((m.querySelector('.metric-value') || {}).textContent || '').trim()),
    printLinks: document.querySelectorAll('a[href="/projects/print"]').length,
  }));
  if (projectView.projectName !== 'Backyard Refresh 2026') fail('project name not saved: ' + projectView.projectName);
  else ok('project name saved');
  if (projectView.materialHeadings.length !== 3) fail('expected 3 materials, got ' + projectView.materialHeadings.length + ': ' + projectView.materialHeadings.join(', '));
  else ok('3 material result groups listed');
  if (!projectView.qtyRows.length) fail('no quantities shown'); else ok(projectView.qtyRows.length + ' quantity rows shown');
  if (!projectView.shoppingItems.length) fail('shopping list empty'); else ok(projectView.shoppingItems.length + ' shopping list items');
  if (!projectView.assumptionRows.length) fail('no assumptions shown in project mode'); else ok(projectView.assumptionRows.length + ' assumption rows shown');

  /* --- localStorage persistence --- */
  const stored = await page.evaluate((key) => window.localStorage.getItem(key), STORAGE_KEY);
  let parsed = null;
  try { parsed = JSON.parse(stored); } catch { /* ignore */ }
  const storedSummary = parsed ? {
    name: parsed.name, materials: (parsed.materials || []).length, areas: (parsed.areas || []).length,
    shopping: (parsed.shoppingList || []).length, assumptions: (parsed.assumptions || []).length,
    quantities: (parsed.materials || []).reduce((s, m) => s + (m.quantities || []).length, 0),
    costs: parsed.costs ? { total: parsed.costs.totalEnteredCost, complete: parsed.costs.isComplete, missing: parsed.costs.missingPrices } : null,
  } : null;
  if (!parsed) fail('nothing persisted to localStorage');
  else if (storedSummary.materials !== 3) fail('localStorage material count ' + storedSummary.materials + ' != 3');
  else ok('localStorage holds ' + storedSummary.materials + ' materials, ' + storedSummary.quantities + ' quantities, ' + storedSummary.shopping + ' shopping items');

  /* --- refresh: results must not be silently lost --- */
  await page.reload({ waitUntil: 'networkidle0' });
  await page.waitForSelector('#project-name', { timeout: 15000 });
  const afterReload = await page.evaluate(() => ({
    projectName: (document.querySelector('#project-name') || {}).value,
    materialHeadings: Array.from(document.querySelectorAll('.project-material-header h3')).map((h) => h.textContent.trim()),
    shoppingItems: document.querySelectorAll('.shopping-item').length,
    assumptions: document.querySelectorAll('.assumption-row').length,
    qtyRows: document.querySelectorAll('.qty-row').length,
  }));
  if (afterReload.materialHeadings.length !== 3) fail('calculations lost after refresh: ' + afterReload.materialHeadings.length + ' materials');
  else ok('calculator results survive a browser refresh');
  if (afterReload.projectName !== 'Backyard Refresh 2026') fail('project name lost after refresh'); else ok('project name survives refresh');
  progress('persistence verified');



  /* --- printable project plan --- */
  progress('opening print view');
  await page.goto(`${BASE}/projects/print`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('.print-sheet h1', { timeout: 15000 });
  const printView = await page.evaluate(() => ({
    h1: (document.querySelector('.print-sheet h1') || {}).textContent,
    meta: (document.querySelector('.print-meta') || {}).textContent,
    sections: Array.from(document.querySelectorAll('.print-section h2')).map((h) => h.textContent.trim()),
    tableCount: document.querySelectorAll('.print-table').length,
    rowCounts: Array.from(document.querySelectorAll('.print-table')).map((t) => t.querySelectorAll('tr').length),
    disclaimer: /planning estimate/i.test(document.body.innerText),
    title: document.title,
    robots: (document.querySelector('meta[name="robots"]') || {}).content || null,
    sampleShopping: Array.from(document.querySelectorAll('.print-table tr')).map((r) => r.textContent.replace(/\s+/g, ' ').trim()).filter((t) => t.startsWith('\u25a1')).slice(0, 4),
  }));
  if (printView.h1 !== 'Backyard Refresh 2026') fail('print plan title wrong: ' + printView.h1);
  else ok('print plan shows the project name');
  const required = ['Project dimensions', 'Materials', 'Estimated costs', 'Shopping list', 'Assumptions'];
  const missing = required.filter((s) => !printView.sections.includes(s));
  if (missing.length) fail('print plan missing sections: ' + missing.join(', '));
  else ok('print plan sections: ' + printView.sections.join(' | '));
  if (!printView.disclaimer) fail('print plan missing methodology disclaimer'); else ok('print plan includes the methodology disclaimer');
  if (!/noindex/.test(String(printView.robots))) fail('print page robots not noindex: ' + printView.robots); else ok('print utility page is noindex');
  if (!/Printable Project Plan/.test(printView.title)) fail('print page title not unique: ' + printView.title); else ok('print page has a unique title: ' + printView.title);

  /* --- printed output (print media emulation) --- */
  await page.emulateMediaType('print');
  const printed = await page.evaluate(() => {
    const de = document.documentElement;
    const visible = (sel) => Array.from(document.querySelectorAll(sel)).filter((e) => e.getBoundingClientRect().height > 0).length;
    return {
      navVisible: visible('.site-header'), footerVisible: visible('.site-footer'), toolbarVisible: visible('.print-toolbar'),
      interactiveInSheet: Array.from(document.querySelectorAll('.print-sheet a, .print-sheet button, .print-sheet input, .print-sheet select')).filter((e) => e.getBoundingClientRect().height > 0).length,
      wideTables: Array.from(document.querySelectorAll('table')).filter((t) => t.scrollWidth > de.clientWidth + 1).length,
      overflowing: Array.from(document.querySelectorAll('body *')).filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.right > de.clientWidth + 1; }).length,
      scrollWidth: de.scrollWidth, clientWidth: de.clientWidth,
      tableCount: document.querySelectorAll('table').length,
    };
  });
  await page.screenshot({ path: path.join(OUT, 'print-media.png'), fullPage: false });
  await page.emulateMediaType(null);
  if (printed.navVisible || printed.footerVisible || printed.toolbarVisible) fail('printed output still shows site chrome');
  else ok('printed output hides navigation, footer and print toolbar');
  if (printed.interactiveInSheet) fail(printed.interactiveInSheet + ' interactive controls remain in the printed sheet');
  else ok('no interactive controls inside the printed sheet');
  if (printed.overflowing) fail(printed.overflowing + ' elements overflow the printed page width');
  if (printed.wideTables) fail(printed.wideTables + ' tables are wider than the printed page');
  if (!printed.overflowing && !printed.wideTables) ok('no horizontal overflow or clipped tables in the print layout');

  /* --- real PDF via Chrome print-to-PDF --- */
  const pdfBytes = await page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: false });
  fs.writeFileSync(path.join(OUT, 'project-plan.pdf'), pdfBytes);
  const pdfText = Buffer.from(pdfBytes).toString('latin1');
  const pageCount = (pdfText.match(/\/Type\s*\/Page[^s]/g) || []).length;
  ok('Chrome printed a ' + pageCount + '-page PDF (' + pdfBytes.length + ' bytes)');

  /* --- clear project --- */
  await page.goto(`${BASE}/projects`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('#project-name', { timeout: 15000 });
  await clickButton(page, 'Clear project');
  await page.evaluate(() => new Promise((r) => setTimeout(r, 250)));
  const cleared = await page.evaluate((key) => ({
    materials: document.querySelectorAll('.project-material-header h3').length,
    shopping: document.querySelectorAll('.shopping-item').length,
    stored: window.localStorage.getItem(key),
  }), STORAGE_KEY);
  if (cleared.materials !== 0) fail('Clear project left materials behind'); else ok('Clear project removes materials');
  let clearedOk = false;
  try { clearedOk = !!cleared.stored && JSON.parse(cleared.stored).materials.length === 0; } catch { clearedOk = false; }
  if (!clearedOk) fail('Clear project did not reset storage: ' + String(cleared.stored).slice(0, 120)); else ok('Clear project resets storage');

  const out = { steps, failures, projectView, storedSummary, afterReload, printView, printed, pageCount, pdfBytes: pdfBytes.length, consoleErrors: log.console.filter((c) => c.type === 'error'), pageErrors: log.pageErrors };
  writeJson('project.json', out);
  progress('DONE failures=' + failures.length);
  console.log(JSON.stringify(out, null, 2));
  await browser.close();
  process.exit(failures.length ? 1 : 0);
})();
