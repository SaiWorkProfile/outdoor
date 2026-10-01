/**
 * Real-browser currency QA (headless Chrome over the DevTools protocol).
 *
 * Proves the parts that only exist in a browser:
 *   - typing a price shows it in the selected currency and updates the field suffix,
 *   - switching the header selector re-formats what is already on screen, shows the
 *     "amounts are not converted" reminder, and leaves the entered number untouched,
 *   - the choice survives a reload (and the first paint is still the default currency,
 *     which is what keeps hydration deterministic),
 *   - the print stylesheet hides the picker while the printed plan keeps its money.
 *
 * Usage: node qa/tmp/currency-browser.cjs [baseUrl]
 */
const { spawn } = require('node:child_process');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const WebSocket = require('ws');

const BASE = process.argv[2] || 'http://127.0.0.1:3111';
const DEBUG_PORT = 9333;
const CHROME = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
].find((p) => fs.existsSync(p));

let failures = 0;
const check = (label, ok, detail = '') => {
  if (!ok) failures += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  ${detail}` : ''}`);
};

const getJson = (url) => new Promise((resolve, reject) => {
  http.get(url, (res) => {
    let body = '';
    res.on('data', (chunk) => { body += chunk; });
    res.on('end', () => { try { resolve(JSON.parse(body)); } catch (error) { reject(error); } });
  }).on('error', reject);
});

const waitFor = async (fn, label, timeoutMs = 20000) => {
  const started = Date.now();
  for (;;) {
    try { const value = await fn(); if (value) return value; } catch { /* keep polling */ }
    if (Date.now() - started > timeoutMs) throw new Error(`timed out waiting for ${label}`);
    await new Promise((r) => setTimeout(r, 250));
  }
};

/* Minimal CDP client: one browser socket, one flattened session. */
function createClient(ws) {
  const pending = new Map();
  const events = [];
  let nextId = 1;
  ws.on('message', (raw) => {
    const message = JSON.parse(raw.toString());
    if (!message.id) { events.push(message); return; }
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(`${message.error.message}`));
      else resolve(message.result);
    }
  });
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const id = nextId++;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
    setTimeout(() => { if (pending.has(id)) { pending.delete(id); reject(new Error(`${method} timed out`)); } }, 30000);
  });
  return { send, events };
}

(async () => {
  if (!CHROME) { console.log('SKIP: no Chrome/Edge found — browser currency QA not run.'); process.exit(0); }
  const profile = path.join(__dirname, '.chrome-currency-profile');
  fs.rmSync(profile, { recursive: true, force: true });
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${DEBUG_PORT}`, `--user-data-dir=${profile}`,
    '--no-first-run', '--no-default-browser-check', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });

  try {
    const version = await waitFor(() => getJson(`http://127.0.0.1:${DEBUG_PORT}/json/version`), 'chrome debugger');
    const socket = new WebSocket(version.webSocketDebuggerUrl, { maxPayload: 64 * 1024 * 1024 });
    await new Promise((resolve, reject) => { socket.once('open', resolve); socket.once('error', reject); });
    const { send, events } = createClient(socket);
    const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
    const attached = await send('Target.attachToTarget', { targetId, flatten: true });
    const cmd = (method, params) => send(method, params, attached.sessionId);
    await cmd('Page.enable');
    await cmd('Runtime.enable');

    const evaluate = async (expression) => {
      const result = await cmd('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
      if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception ? result.exceptionDetails.exception.description : 'evaluate failed');
      return result.result.value;
    };
    const goto = async (pathname, readySelector) => {
      await cmd('Page.navigate', { url: BASE + pathname });
      await waitFor(() => evaluate("document.readyState === 'complete'"), `load ${pathname}`);
      await waitFor(() => evaluate(`!!document.querySelector(${JSON.stringify(readySelector)})`), `ready ${pathname}`);
    };

    /** Drive a React-controlled control the way a visitor would. */
    const setControl = (selector, value) => evaluate(`(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      if (!el) return null;
      const proto = el.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, ${JSON.stringify(value)});
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      return el.value;
    })()`);

    /** The one price input on the form: its unit suffix is a currency symbol. */
    const PRICE_INPUT = `(() => { const box = [...document.querySelectorAll('.unit-input')].find(u => /^[$€£¥₹]/.test((u.querySelector('.unit') || {}).textContent || '')); return box ? box.querySelector('input') : null; })()`;
    const fillPrice = (value) => evaluate(`(() => {
      const input = ${PRICE_INPUT};
      if (!input) return null;
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, ${JSON.stringify(value)});
      input.dispatchEvent(new Event('input', { bubbles: true }));
      return input.value;
    })()`);
    const priceState = () => evaluate(`(() => { const input = ${PRICE_INPUT}; if (!input) return null; return { value: input.value, suffix: input.closest('.unit-input').querySelector('.unit').textContent.trim() }; })()`);
    const money = async () => (await evaluate('document.body.innerText')).match(/[$€£¥₹][0-9][0-9,]*(?:\.[0-9]+)?/g) || [];
    const amounts = (list) => [...new Set(list.map((s) => s.replace(/[^0-9.,]/g, '')))].sort();
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const consoleProblems = () => events.filter((e) => e.method === 'Runtime.consoleAPICalled'
      && ['error', 'warning'].includes(e.params.type)
      && /hydrat|did not match|Text content does not match|server-rendered/i.test(JSON.stringify(e.params.args)));


    /* --- a calculator: type a price, then switch currency on screen ---
       The fence cost calculator is the priced calculator (the bulk ones deliberately show
       quantities only until the project supplies a price), so it is the one that renders
       a money total next to the typed price. */
    await goto('/calculators/fence-cost-calculator', '#currency-select');
    check('picker defaults to USD', await evaluate("document.querySelector('#currency-select').value") === 'USD');
    check('picker lists all 20 currencies', await evaluate("document.querySelector('#currency-select').options.length") === 20);
    check('nothing stored before any choice', await evaluate("window.localStorage.getItem('measure-to-build-currency')") === null);

    const typed = await fillPrice('45');
    check('price field accepts a typed price', typed === '45', `value=${typed}`);
    const clicked = await evaluate("(() => { const b = [...document.querySelectorAll('button')].find(x => /^Calculate$/.test(x.textContent.trim())); if (!b) return false; b.click(); return true; })()");
    check('Calculate runs the estimate', clicked === true);
    await waitFor(async () => (await money()).length > 0, 'money in the result panel');
    const before = await money();
    check('the result shows USD money', before.length > 0 && before.every((s) => s.startsWith('$')), `sample=${before.slice(0, 4).join(' | ')}`);

    await setControl('#currency-select', 'EUR');
    await sleep(600);
    const after = await money();
    const state = await priceState();
    const toast = await evaluate("(() => { const el = document.querySelector('.currency-toast'); return el ? el.innerText.replace(/\\s+/g, ' ') : ''; })()");
    check('selector switches to EUR', await evaluate("document.querySelector('#currency-select').value") === 'EUR');
    check('reminder appears and says amounts are not converted', /Currency changed to EUR/.test(toast) && /not converted/.test(toast), toast);
    check('price field suffix follows the currency', !!state && state.suffix === '€', JSON.stringify(state));
    check('the typed number is never re-written', !!state && state.value === '45', JSON.stringify(state));
    check('on-screen money re-formats to EUR', after.length > 0 && after.every((s) => s.startsWith('€')), `sample=${after.slice(0, 4).join(' | ')}`);
    check('switching converts nothing', JSON.stringify(amounts(before)) === JSON.stringify(amounts(after)), `${amounts(before).join(',')} vs ${amounts(after).join(',')}`);
    check('choice is stored under the display key', await evaluate("window.localStorage.getItem('measure-to-build-currency')") === 'EUR');

    await cmd('Page.reload');
    await waitFor(() => evaluate("document.readyState === 'complete'"), 'reload');
    await waitFor(() => evaluate("!!document.querySelector('#currency-select') && document.querySelector('#currency-select').value === 'EUR'"), 'restored EUR after reload');
    check('selection survives a reload', true);
    check('no hydration warnings after reload', consoleProblems().length === 0, consoleProblems().map((e) => JSON.stringify(e.params.args)).join(' | ').slice(0, 180));

    /* --- content pages: structured money, then a zero-decimal currency ---
       The stored choice is applied after mount by design, so the page is polled
       for the selection instead of assuming the first paint already used it. */
    await goto('/costs/gravel-cost', '#currency-select');
    await waitFor(() => evaluate("document.querySelector('#currency-select').value === 'EUR'"), 'stored EUR applied on the cost page');
    await waitFor(async () => (await money()).some((s) => s.startsWith('€')), 'EUR money on the cost page');
    const costEur = await money();
    check('cost page renders its money in EUR', costEur.some((s) => s.startsWith('€')), `sample=${costEur.slice(0, 4).join(' | ')}`);
    check('cost page keeps no USD behind', costEur.every((s) => !s.startsWith('$')));

    await setControl('#currency-select', 'JPY');
    await sleep(600);
    const costJpy = await money();
    check('JPY renders without minor units', costJpy.length > 0 && costJpy.every((s) => /^¥[0-9,]+$/.test(s)), `sample=${costJpy.slice(0, 4).join(' | ')}`);

    /* --- Project Mode and the printable plan --- */
    await goto('/projects', '#currency-select');
    check('Project Mode has no USD money left', (await money()).every((s) => !s.startsWith('$')));

    await goto('/projects/print', '#currency-select');
    await cmd('Emulation.setEmulatedMedia', { media: 'print' });
    const printed = await evaluate("getComputedStyle(document.querySelector('.currency-picker')).display");
    check('print stylesheet hides the picker', printed === 'none', `display=${printed}`);
    await cmd('Emulation.setEmulatedMedia', { media: 'screen' });
    check('no hydration warnings across the run', consoleProblems().length === 0, consoleProblems().map((e) => JSON.stringify(e.params.args)).join(' | ').slice(0, 180));

    console.log(failures === 0 ? '\nAll browser currency checks passed.' : `\n${failures} browser check(s) failed.`);
  } finally {
    chrome.kill();
    try { fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 }); } catch { /* Chrome may still hold the profile briefly on Windows */ }
  }
  process.exit(failures === 0 ? 0 : 1);
})().catch((error) => { console.error('browser currency QA crashed:', error); process.exit(1); });

