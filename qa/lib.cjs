'use strict';
/** Shared QA helpers. Drives the locally installed Chrome via puppeteer-core. */
const fs = require('node:fs');
const path = require('node:path');
const puppeteer = require('puppeteer-core');

const CHROME = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
].find((p) => fs.existsSync(p));

const BASE = process.env.QA_BASE ?? 'http://localhost:3000';
const OUT = path.join(__dirname, 'artifacts');
fs.mkdirSync(OUT, { recursive: true });

async function launch() {
  if (!CHROME) throw new Error('No Chrome/Edge executable found.');
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none'],
  });
  return browser;
}

/** Attach console/pageerror/requestfailed listeners and return the collected log. */
function watch(page, log) {
  page.on('console', (msg) => {
    const type = msg.type();
    if (type === 'error' || type === 'warning') {
      log.console.push({ type, text: msg.text(), url: msg.location()?.url ?? '' });
    }
  });
  page.on('pageerror', (err) => log.pageErrors.push(String(err && err.message ? err.message : err)));
  page.on('requestfailed', (req) => {
    const err = req.failure();
    if (err && err.errorText === 'net::ERR_ABORTED') return;
    log.requestFailures.push({ url: req.url(), error: err ? err.errorText : 'unknown' });
  });
  return log;
}

const emptyLog = () => ({ console: [], pageErrors: [], requestFailures: [] });

/** Hydration / React mismatch text matchers. */
const HYDRATION = [
  /hydrat/i,
  /did not match/i,
  /server rendered HTML/i,
  /Text content does not match/i,
  /An error occurred during hydration/i,
  /Warning: .*Server/i,
];
const isHydration = (text) => HYDRATION.some((re) => re.test(text));

/** Wait until the calculator client component has hydrated (Calculate button wired up). */
async function waitForCalculator(page) {
  await page.waitForSelector('.card', { timeout: 20000 });
  await page.waitForFunction(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.some((b) => /calculate/i.test(b.textContent || ''));
  }, { timeout: 20000 });
  // Give React one paint to attach the click handler via a no-op interaction probe.
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
}

/**
 * Set a React-controlled input value using real keyboard events.
 * Focus is applied via the DOM (not a coordinate click) because the sticky site header
 * overlays the top of the viewport and can intercept synthetic clicks.
 */
async function typeValue(page, selector, value) {
  const handle = await page.$(selector);
  if (!handle) throw new Error(`input not found: ${selector}`);
  await handle.evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await handle.focus();
  await page.keyboard.down('Control');
  await page.keyboard.press('KeyA');
  await page.keyboard.up('Control');
  await page.keyboard.press('Backspace');
  if (value !== '') await handle.type(String(value), { delay: 2 });
  await handle.evaluate((el) => el.blur());
}

/** Find the UnitField input whose label text matches (exact, case-insensitive). */
async function labelSelector(page, labelText, occurrence = 0) {
  const selectors = await page.$$eval('.field', (fields, wanted) => {
    const out = [];
    for (const f of fields) {
      const label = f.querySelector('label');
      if (!label) continue;
      const text = (label.textContent || '').trim().toLowerCase();
      if (text !== wanted) continue;
      const ctl = f.querySelector('input, select, textarea');
      if (!ctl) continue;
      if (!ctl.dataset.qaId) ctl.dataset.qaId = 'qa-' + Math.random().toString(36).slice(2, 10);
      out.push(`[data-qa-id="${ctl.dataset.qaId}"]`);
    }
    return out;
  }, labelText.trim().toLowerCase());
  if (!selectors[occurrence]) throw new Error(`no field labelled "${labelText}" (#${occurrence})`);
  return selectors[occurrence];
}

async function setByLabel(page, labelText, value, occurrence = 0) {
  const sel = await labelSelector(page, labelText, occurrence);
  await typeValue(page, sel, value);
}

async function selectByLabel(page, labelText, value, occurrence = 0) {
  const sel = await labelSelector(page, labelText, occurrence);
  await page.select(sel, value);
}

async function clickButton(page, text) {
  const wanted = text.toLowerCase();
  let clicked = false;
  for (let attempt = 0; attempt < 10 && !clicked; attempt++) {
    clicked = await page.evaluate((w) => {
      const b = Array.from(document.querySelectorAll('button')).find((x) => (x.textContent || '').trim().toLowerCase().includes(w));
      if (!b) return false;
      b.click();
      return true;
    }, wanted);
    if (!clicked) await page.evaluate(() => new Promise((r) => setTimeout(r, 100)));
  }
  if (!clicked) {
    const diag = await page.evaluate(() => ({
      url: location.pathname,
      buttons: Array.from(document.querySelectorAll('button')).map((b) => (b.textContent || '').trim().slice(0, 30)),
      fields: document.querySelectorAll('.field').length,
      text: document.body.innerText.slice(0, 200),
    }));
    throw new Error(`button not found: ${text} :: ${JSON.stringify(diag)}`);
  }
  await page.evaluate(() => new Promise((r) => setTimeout(r, 60)));
}

/** Snapshot of visible result text (metrics + tables + notices). */
async function resultSnapshot(page) {
  return page.evaluate(() => {
    const box = document.querySelector('.result-body, .result-card, #results, .calc-result');
    const scope = box || document;
    const metrics = Array.from(scope.querySelectorAll('.metric')).map((m) => ({
      label: (m.querySelector('.metric-label')?.textContent || '').trim(),
      value: (m.querySelector('.metric-value')?.textContent || '').trim(),
      detail: (m.querySelector('.metric-detail')?.textContent || '').trim(),
    }));
    const rows = Array.from(scope.querySelectorAll('.result-table tr')).map((tr) =>
      Array.from(tr.children).map((td) => (td.textContent || '').trim()));
    const notices = Array.from(document.querySelectorAll('.notice')).map((n) => (n.textContent || '').trim());
    const text = (scope.textContent || '').replace(/\s+/g, ' ').trim();
    return { metrics, rows, notices, text };
  });
}

function writeJson(name, data) {
  fs.writeFileSync(path.join(OUT, name), JSON.stringify(data, null, 2));
  return name;
}

/** React-compatible value set. Direct `el.value = x` is swallowed by React's value tracker. */
async function setNativeValue(page, selector, value) {
  const done = await page.evaluate((sel, val) => {
    const el = document.querySelector(sel);
    if (!el) return false;
    const proto = el.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : el.tagName === 'SELECT' ? window.HTMLSelectElement.prototype : window.HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
    setter.call(el, val);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }, selector, value);
  if (!done) throw new Error(`input not found: ${selector}`);
}

async function setFirstNumberInput(page, value) {
  await page.evaluate((val) => {
    const el = document.querySelector('input[type="number"]');
    if (!el) return;
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(el, val);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, value);
}

async function clearAllNumberInputs(page) {
  await page.evaluate(() => {
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    for (const el of document.querySelectorAll('input[type="number"]')) {
      setter.call(el, '');
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
}

module.exports = {
  BASE, OUT, CHROME, launch, watch, emptyLog, isHydration,
  waitForCalculator, typeValue, setByLabel, selectByLabel, labelSelector, clickButton,
  resultSnapshot, writeJson, setNativeValue, setFirstNumberInput, clearAllNumberInputs,
};
