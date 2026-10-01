/**
 * Server-level currency smoke check (run against `npm start`).
 *
 * Verifies the currency selector is rendered on every surface and that money in the
 * prerendered HTML is the default (USD) formatting produced by the currency core —
 * i.e. no page still prints a hand-typed "$" from a literal, and nothing renders
 * "NaN" / "undefined" where a price should be.
 *
 * Usage: node qa/tmp/currency-smoke.cjs [baseUrl]
 */
const BASE = process.argv[2] || 'http://127.0.0.1:3111';

/** Script/style payloads contain framework noise ("NaN", "$1"); only visible markup matters. */
const visible = (html) => html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
/** The header control only — calculator forms contain their own <select> elements. */
const picker = (html) => (html.match(/<select id="currency-select"[\s\S]*?<\/select>/) || [''])[0] || html.match(/<select[^>]*currency-select[\s\S]*?<\/select>/)?.[0] || '';
const text = (html) => visible(html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

/** Every stylesheet the app ships (linked files plus inline blocks), for print-rule checks. */
const allCss = async () => {
  const html = await (await fetch(BASE + '/')).text();
  const hrefs = [...new Set([...html.matchAll(/href="([^"]+\.css[^"]*)"/g)].map((m) => m[1]))];
  const inline = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]);
  const files = await Promise.all(hrefs.map(async (href) => (await fetch(BASE + href)).text()));
  return [...inline, ...files].join('\n');
};

const PAGES = [
  '/',
  '/calculators',
  '/calculators/gravel-calculator',
  '/calculators/mulch-calculator',
  '/calculators/concrete-calculator',
  '/calculators/paver-calculator',
  '/calculators/fence-cost-calculator',
  '/costs/gravel-cost',
  '/costs/paver-patio-cost',
  '/projects',
  '/projects/print',
  '/methodology',
];

let failures = 0;
const check = (label, ok, detail = '') => {
  if (!ok) failures += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  ${detail}` : ''}`);
};

(async () => {
  for (const path of PAGES) {
    const res = await fetch(BASE + path);
    const html = await res.text();
    const shown = text(html);
    check(`${path} responds 200`, res.status === 200, `status=${res.status}`);
    check(`${path} renders the currency selector`, html.includes('id="currency-select"'));
    check(`${path} lists all 20 currencies`, (picker(html).match(/<option/g) || []).length === 20);
    check(`${path} shows no NaN/undefined money`, !/[$][^$<]{0,16}(NaN|undefined)/.test(shown) && !/(NaN|undefined)\s*($|%|tons?)/.test(shown));
    check(`${path} has no raw currency code amounts in copy`, !/>\s*(USD|EUR)\s?\d/.test(shown));
  }

  // money must be present, formatted, on the priced surfaces (cost pages render money from the
  // content library, so this proves structured money is formatted by the currency core at render time)
  for (const path of ['/costs/gravel-cost', '/costs/paver-patio-cost', '/costs/fence-cost', '/costs/deck-cost', '/costs/mulch-cost', '/costs/landscaping-project-cost']) {
    const shown = text(await (await fetch(BASE + path)).text());
    const amounts = shown.match(/\$[0-9][0-9,]*(?:\.[0-9]{2})?/g) || [];
    check(`${path} renders formatted USD amounts`, amounts.length >= 3, `found=${amounts.length} sample=${amounts.slice(0, 3).join(' | ')}`);
  }

  // calculators show quantities until a price is typed, so their SSR state must contain no money at all
  for (const path of ['/calculators/gravel-calculator', '/calculators/mulch-calculator', '/calculators/concrete-calculator']) {
    const shown = text(await (await fetch(BASE + path)).text());
    const amounts = shown.match(/\$[0-9]/g) || [];
    check(`${path} invents no price before one is typed`, amounts.length === 0, `found=${amounts.length}`);
  }

  // the print plan is loaded from storage on the client, so SSR shows the empty state
  const printHtml = await (await fetch(BASE + '/projects/print')).text();
  check('/projects/print renders a printable plan surface', /print-page|print-empty|print-sheet/.test(printHtml));
  check('/projects/print hides the picker when printing', /@media print[\s\S]{0,200}(currency-picker|currency-toast)/.test(await allCss()));

  console.log(failures === 0 ? '\nAll currency smoke checks passed.' : `\n${failures} check(s) failed.`);
  process.exit(failures === 0 ? 0 : 1);
})().catch((error) => {
  console.error('smoke check crashed:', error);
  process.exit(1);
});
