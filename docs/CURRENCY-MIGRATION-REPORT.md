# MeasureToBuild — Currency Migration Report

**Scope:** replace every hardcoded `$`/USD money string with one dynamic, visitor-selectable
currency system that formats through `Intl.NumberFormat`, across all 16 calculators, Project
Mode, the printable plan, the calculator/guide content pages and the header.

**Status key:** PASS · FIXED · NON-BLOCKING

Scope discipline: no calculation formula, assumption, rounding rule, project-storage key or
page slug was changed. Nothing converts between currencies: switching the header control only
changes how an amount is written, never the number, and no market price is ever invented.

---

## 1. What changed

| Area | Before | After |
|---|---|---|
| Money formatting | hand-written `$` strings in components (`'$' + value.toFixed(2)`, `$${...}` templates) | `formatCurrency()` / `<CurrencyText>` from one currency core |
| Currency choice | none — USD implied | header selector with 20 ISO 4217 currencies, remembered per browser |
| Price-field suffix | literal `$` | live currency symbol from the selected currency |
| Content pages (worked examples, cost tables) | pre-formatted money strings in page data | numbers in page data, formatted at render time |
| Project records | cost totals with an implied USD | each project stores the `currencyCode` its prices were entered in |
| Printed plan | USD totals | totals in the selected currency plus a note naming the currency the prices were recorded in |

## 2. Currency core — PASS

`src/lib/currency/index.ts` (registry + formatting) and `src/lib/currency/money-value.ts`
(structured money for data modules):

- **20 currencies:** `USD, INR, EUR, GBP, CAD, AUD, NZD, SGD, AED, SAR, ZAR, JPY, CNY, CHF, SEK, NOK, DKK, PLN, BRL, MXN`.
  Each entry carries its ISO 4217 code, English name and minor units.
- **Symbols and decimals come from `Intl`**, never from a table of hand-typed symbols, so
  `CA$`/`MX$` disambiguation and JPY's zero minor units are correct by construction.
- **`CURRENCY_DISPLAY_LOCALE = 'en-US'`** is pinned: grouping and decimal separators read the
  same in every context, while the currency unit (symbol, code, decimal places) follows the
  selected ISO code.
- **`DEFAULT_CURRENCY = 'USD'`** and **`resolveCurrencyCode()`** fall back to USD for empty,
  unknown or malformed input — a bad stored value can never render a broken amount.
- **Display-only by contract:** `formatCurrency(amount, code)` formats; it never converts,
  scales or rounds an entered number.
- **Unknown amounts render as an em dash placeholder**, never as `NaN` or `undefined`.

## 3. Display preference — PASS

`src/components/currency/CurrencyProvider.tsx` + `CurrencySelector.tsx`:

- The provider is mounted once in `src/app/layout.tsx`, so a calculator, Project Mode and the
  printed plan always agree.
- The stored choice is read **after mount** (`useEffect`), so the first render is always the
  default currency and the server HTML matches the client — hydration stays deterministic while
  the visitor's choice is restored immediately.
- The preference lives under its own key, **`measure-to-build-currency`**, and is deliberately
  separate from project data: a project remembers the currency its prices were entered in even
  if the visitor later displays another one.
- A `storage` event listener keeps two open tabs in sync.
- Changing currency shows a dismissible, politely announced reminder that says the truth:
  *"Currency changed to EUR. Review your price inputs — amounts are not converted."* It
  auto-clears after 9 seconds and the reminder component (`CurrencyChangeToast`) is exported
  for testing.
- The header control stacks on its own row below 681 px, has a visually hidden label under
  1101 px, and is hidden by the print stylesheet (`.currency-picker{display:none!important}`)
  so a printed plan never carries a control that cannot be used on paper.

## 4. Where the formatting now lives — PASS (FIXED)

Every surface below previously wrote currency itself; all of them now go through the core
(17 `<CurrencyText>` call sites, 4 `<CurrencyRichText>` call sites and 9 `useCurrency()` readers
across `src/`).

| File | Role after the migration |
|---|---|
| `src/lib/currency/index.ts` | registry, `formatCurrency`, symbol/name/option helpers, `resolveCurrencyCode` |
| `src/lib/currency/money-value.ts` | `moneyAmount`, `isMoneyAmount`, `flattenCurrencyText` for data modules and QA tools |
| `src/components/currency/CurrencyProvider.tsx` | selection state, storage, hydration-safe first render |
| `src/components/currency/CurrencyText.tsx` | `CurrencyText` (one amount) and `CurrencyRichText` (text interleaved with money) |
| `src/components/currency/CurrencySelector.tsx` | the header control and the change reminder |
| `src/components/layout/Header.tsx` | mounts the picker in the shared header (every page, incl. print and Project Mode) |
| `src/app/layout.tsx` | wraps the app in the provider |
| `src/components/calculators/FormParts.tsx` | price-field suffix uses `symbol` instead of a literal `$` |
| `src/components/calculators/CalculatorClient.tsx` | result totals (e.g. fence cost) render through `CurrencyText`; saved materials record `currencyCode` |
| `src/components/calculators/CalculatorForm.tsx` | section copy states that prices follow the header currency |
| `src/components/calculators/engine-bridge.ts` | input/result summaries format money through the currency core |
| `src/components/calculators/project-mapper.ts` | cost lines keep the currency the prices were entered in |
| `src/components/calculators/ProjectModeClient.tsx`, `AddCalculationPanel.tsx` | Project Mode totals and edits render through `CurrencyText` |
| `src/lib/project-store/index.ts` | project cost summary carries `currencyCode` (default USD) |
| `src/app/projects/print/page.tsx` | printed totals, plus a note naming the display currency and the currency the prices were recorded in |
| `src/components/content/ContentTable.tsx`, `src/content/shared.ts`, `src/content/types.ts` | content tables/examples accept structured money and format it at render time |

## 5. Content layer — PASS (FIXED)

Content pages are data, not markup, so a worked example now stores an amount as a number
(`money()` → `{ money: n }`) and the renderer decides how it reads:

- `src/content/types.ts` — a cell or example value is `string | MoneyAmount | nested list`.
- `src/content/shared.ts` — the example builders (`bulkExample`, `fenceExample`, `paverExample`,
  `concreteExample`, `deckExample`, `drivewayExample`, `fenceCostExample`) build money rows from
  engine output; the seven cost/material pages (`costs/gravel-cost`, `costs/gravel-driveway-cost`,
  `costs/landscaping-project-cost`, `materials/concrete`,
  `projects/how-to-calculate-concrete-for-a-slab`,
  `projects/how-to-calculate-landscaping-materials`,
  `projects/outdoor-project-cost-planning`) pass numbers instead of `$` strings.
- `ContentTable.tsx` / `CurrencyRichText` format those parts in the selected currency.
- `qa/expected.ts` derives the expected strings with the *same* `formatCurrency` the UI uses, so
  the QA harness cannot drift from the product.

## 6. Verification — PASS

| Command | Result |
|---|---|
| `npm run typecheck` | PASS (exit 0; standalone and inside the gate) |
| `npm test` | **171 tests / 23 suites / 171 pass / 0 fail** — includes 10 new rendered-markup tests in `src/components/currency/currency-render.test.ts` and the extended currency assertions in `engine-bridge.test.ts` |
| `npm run test:content` | PASS — 28 content pages, **49,259 words**, 0 duplicate titles/descriptions/paths/paragraphs, 0 placeholder pages, 0 empty sections, 0 worked examples missing results |
| `npx tsx qa/content-claims.ts` | `pagesWithPrices: []` and `handwrittenCurrencyInConclusions: []` across all 28 pages — no literal currency left in page copy |
| `npm run build` | PASS — Next.js 16.1.1 (Turbopack), 60/60 static pages |
| `npm run qa:prelaunch` | **13 PASS / 1 WARN / 0 FAIL / 0 NOT RUN (984.4 s)** → `READY WITH NON-BLOCKING WARNINGS`, identical to the pre-currency baseline. Build `RiC2VcxVAXKbx6-ovpTr0`; typecheck, unit tests, content tests, build, server, seo, route/link audit, calculator contract audit, Project Mode + printable plan, accessibility, content accessibility, mobile layout and performance all PASS. |
| `node qa/tmp/currency-smoke.cjs <url>` | **71 checks PASS / 0 FAIL** over 12 routes: the picker and all 20 options render, cost pages print formatted amounts (`$94.11`, `$2,131.50`, `$1,800.00`, …), quantity-only calculators invent no price, and no page shows `NaN`, `undefined` or a raw currency-code amount |
| `node qa/tmp/currency-browser.cjs <url>` | **21 checks PASS / 0 FAIL** in headless Chrome (DevTools protocol) |

What the browser run actually observed (`qa/tmp/currency-browser.log`):

- the picker defaults to USD, lists 20 options and stores nothing before a choice;
- typing `45` into *Post / each* and pressing **Calculate** produced `$675.00`;
- switching the header to EUR changed those amounts to `€675.00`, flipped the price-field suffix
  to `€`, showed the reminder *"Currency changed to EUR. … amounts are not converted"*, and left
  the typed number untouched at `45`;
- the number itself never moved: `switching converts nothing 0.00,675.00 vs 0.00,675.00`;
- the choice persisted under `measure-to-build-currency` and was restored after a reload, with
  **no hydration warnings** logged;
- `/costs/gravel-cost` re-rendered in EUR and then in JPY with **no minor units** (`¥94`, `¥55`);
- on `/projects/print` the print stylesheet computed `.currency-picker { display: none }`, and
  emulating the print media left the plan itself intact.

**Regression found and fixed during verification.** The first version of the header picker was
36 px tall. The gate's mobile step (`qa/responsive.cjs`, every page at 320–768 px) correctly
failed it as a sub-40 px tap target — 1 tap target under 40 px on all 11 audited routes. The
control is now `min-height:44px`, and `npm run qa:prelaunch -- --only=build,mobile` reports
**3 PASS / 0 WARN / 0 FAIL**. The full gate was then re-run from scratch, with the result above.

## 7. Known limitations (NON-BLOCKING)

- **Display only, by design.** There are no exchange rates anywhere in the product, so a project
  whose prices were entered in USD shows EUR symbols after a switch without changing any number.
  The printed plan therefore names *both* currencies: "Amounts print in EUR Euro, the currency
  selected in the header. Prices were entered and recorded in USD; nothing here converts between
  currencies." A reader who only looks at the totals table will see re-formatted numbers, not
  converted ones — the note is what makes that unambiguous.
- **The preference is per browser.** It lives in `localStorage` under
  `measure-to-build-currency`; there are no accounts, so it does not follow the visitor between
  devices, and a cleared browser cache resets it to USD.
- **First render is always USD.** Deliberate: reading storage during render would make the server
  HTML and the first client render disagree (a hydration mismatch). The stored choice applies on
  mount.
- **Currency is not addressable.** It is not part of any URL or query string, so a shared link
  never carries a currency choice and search engines are unaffected.
- **The picker is hidden when printing** (a paper plan cannot be switched), which is why the plan
  states its currency in text instead of relying on the header control.
- The earlier full-gate run failed the mobile step on a 36 px tap target introduced by the first
  version of the picker; the control is now 44 px tall and the mobile step passes.

## 8. Keeping it this way — how to change things

- **Add or remove a currency:** append/remove the code in `CURRENCY_CODES` and its entry in the
  `CURRENCIES` registry (`src/lib/currency/index.ts`), then update the two lists that assert the
  set: `src/lib/currency/currency.test.ts` (sorted code list) and the currency-code alternation in
  `priceRe` inside `qa/content-claims.ts`. Nothing else needs to change — symbols, names, minor
  units and the selector options all derive from the registry.
- **Change the default currency:** set `DEFAULT_CURRENCY` in `src/lib/currency/index.ts`. The
  provider fallback, `resolveCurrencyCode`, `flattenCurrencyText` and the QA expectations all read
  that constant, so they follow automatically.
- **Change the display locale/separators:** `CURRENCY_DISPLAY_LOCALE`. Because it is pinned, the
  printed plan and the on-screen tables always read the same way; changing it changes every
  surface at once.
- **Never write a currency literal again:** in components use `<CurrencyText amount={n}/>` (or
  `CurrencyRichText` for content values); in data modules use `money(n)` from
  `src/content/shared.ts`. `qa/content-claims.ts` reports `pagesWithPrices` — literal currency
  found in page copy — and `handwrittenCurrencyInConclusions` — a `$`-style amount left in a
  worked-example conclusion; both are currently empty, and both are the guardrails to keep them
  that way.
- **Money in user-facing tests:** derive expected strings with `formatCurrency(...)` (as
  `qa/expected.ts` does) instead of typing them, so a currency change cannot silently break a
  test's meaning.
- **QA for the currency system specifically:** `npx tsx --test src/components/currency/currency-render.test.ts`
  (rendered markup), `node qa/tmp/currency-smoke.cjs <url>` (served HTML per route) and
  `node qa/tmp/currency-browser.cjs <url>` (real Chrome: typed price, live switch, reload
  persistence, printing).

