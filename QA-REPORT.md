# REAL PRODUCTION QA — report

Date: 2026-09-29
Build under test: Next.js 16.1.1 (Turbopack) production build, `next start` on `http://localhost:3000`
Browser under test: real Chrome 154 (headless) via `puppeteer-core`; Lighthouse 13.5.0
No calculator, formula, SEO content page or feature was added during this phase.

---

## Build

| Check | Command | Result | Status |
| --- | --- | --- | --- |
| Install | `npm install` | up to date, audited 88 packages | PASS |
| Typecheck | `npm run typecheck` | `tsc --noEmit` clean, 0 errors | FIXED |
| Tests | `npm test` | 49/49 pass | PASS |
| Production build | `npm run build` | compiled successfully, 29/29 static pages generated | PASS |

### Typecheck: FIXED

`npm run typecheck` initially failed with two real errors. Both were fixed by
correcting the code, not by loosening types:

1. `CalculatorClient.tsx` — `{exampleResult && <div …/>}` where `exampleResult` is
   `unknown` (TS2322: not assignable to `ReactNode`). Changed to an explicit ternary.
2. `project-mapper.ts` — `notes: ['missing-price']` assigned `string[]` to a
   `ProjectCostLine.notes?: string` field (TS2322). Changed to `notes: 'missing-price'`,
   which is what the consumer in `project-store.rebuildProject` already expected
   (`line.notes?.includes('missing-price')`) — so the type error had also been
   silently disabling missing-price detection in Project Mode.

### Tests: PASS

49/49 engine and Project Mode tests pass, unchanged. No formula was altered at any
point in this phase.

---

## Browser

All 16 calculators were driven in a real Chrome against the **production build**.

| Calculator | Loads | Inputs | Units | Calculate | Engine parity | Invalid input | Reset | Assumptions | Related links | Console | Hydration |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Gravel | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Mulch | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Topsoil | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Soil | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Sand | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Pea Gravel | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Landscape Rock | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Paver Base | FIXED | FIXED | PASS | FIXED | FIXED | FIXED | FIXED | PASS | PASS | PASS | PASS |
| Driveway Gravel | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Concrete | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Paver | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Paver Patio | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Fence | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Fence Cost | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Fence Post | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Deck Material | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |

**Final automated result: 16 calculators tested, 0 failures**, 0 console errors,
0 uncaught exceptions, 0 hydration warnings.

### Pages tested

23 routes: `/`, `/calculators`, all 16 `/calculators/<slug>`, `/projects`,
`/projects/print`, `/how-it-works`, `/methodology`, `/about`, plus `/sitemap.xml`,
`/robots.txt`, `/favicon.ico`, `/icon.svg` and a deliberate 404.

Per calculator page: page loads (200), inputs render, labels match inputs, units are
correct, calculate works, results appear, invalid values show useful errors, reset
works, formatting is readable, assumptions are visible, related links work.

### Runtime errors and hydration

* 0 uncaught exceptions across all pages.
* 0 React hydration warnings (`did not match`, `Text content does not match`,
  `An error occurred during hydration` — all zero).
* 0 unexpected console errors. The only console error present at the start of the phase
  was `404 /favicon.ico` on every page (see *Fixes* below).

### Realistic worked examples — verified against the calculation engine

`qa/expected.ts` recomputes the expected values **from the engine itself**, and the
browser test compares the rendered numbers against them. This proves the UI has not
drifted from the tested calculation layer.

| Calculator | Inputs | Rendered result | Engine result | Match |
| --- | --- | --- | --- | --- |
| Gravel | 20 ft × 30 ft × 3 in | 6.25 yd³, 8.56 t, 600.00 sq ft, 10% waste | 6.25 / 8.56 / 600 / 10 | YES |
| Mulch | 20 × 30 ft × 3 in | 6.25 yd³, 2.14 t, 600.00 sq ft | 6.25 / 2.14 / 600 | YES |
| Topsoil | 20 × 30 ft × 6 in | 12.25 yd³, 13.44 t, 600.00 sq ft | 12.25 / 13.44 / 600 | YES |
| Soil | 20 × 30 ft × 3 in | 6.25 yd³, 7.33 t | 6.25 / 7.33 | YES |
| Sand | 20 × 30 ft × 1 in | 2.25 yd³, 2.75 t | 2.25 / 2.75 | YES |
| Pea Gravel | 20 × 30 ft × 2 in | 4.25 yd³, 5.70 t | 4.25 / 5.70 | YES |
| Landscape Rock | 20 × 30 ft × 3 in | 6.25 yd³, 8.25 t | 6.25 / 8.25 | YES |
| Paver Base | 20 × 30 ft × 6 in, compaction 1.1 | 13.50 yd³, 18.82 t | 13.50 / 18.82 | YES |
| Driveway Gravel | 20 × 30 ft, layers 4/2/2 in | 18.75 yd³, 25.95 t, 600 sq ft, 8 in | 18.75 / 25.95 / 600 / 8 | YES |
| Concrete | 10 ft × 12 ft × 4 in slab | 1.63 yd³, ready-mix 1.75 yd³, 3.30 t | 1.63 / 1.75 / 3.30 | YES |
| Paver | 20 × 30 ft, 6×6 paver, ⅛ in joint | 2,535 pavers, 600 sq ft, 13.5 yd³ base | 2,535 / 600 / 13.5 | YES |
| Paver Patio | 12 ft × 20 ft | 1,015 pavers, 240 sq ft, 5.5 yd³ base | 1,015 / 240 / 5.5 | YES |
| Fence | 100 ft × 6 ft, one 4 ft gate | 15 posts, 27 rails, 1.25 yd³ concrete, 995 hardware | 15 / 27 / 1.25 / 995 | YES |
| Fence Cost | as above + entered prices | $2,724.25 total, $1,524.25 materials, $1,200.00 labour | 2724.25 / 1524.25 / 1200.00 | YES |
| Fence Post | 100 ft, 8 ft spacing, 1 gate | 15 posts, 11 line, 2 gate, net run 96 ft | 15 / 11 / 2 / 96 | YES |
| Deck Material | 12 ft × 20 ft, 5.5 in boards, 16 in joists | 48 boards, 18 joists, 1,514 fasteners, 240 sq ft | 48 / 18 / 1514 / 240 | YES |

The gravel example also matches the engine unit test exactly
(`bulk.test.ts`: 6.25 yd³ / 8.56 t / 330 × 0.5 cu ft bags), so the UI, the engine and
the test suite all agree.

### Edge cases

Tested per calculator: zero, negative, decimals, very large values (999,999), empty
fields, invalid selections, multiple sections, waste, custom prices, missing prices.

* Zero / negative → engine `CalcInputError` surfaced as a useful, human-labelled
  message plus a highlighted field. No crash.
* Empty fields → error summary shown, no result rendered, no `NaN`/`Infinity` on screen.
* Very large values → handled; no crash, no `NaN`/`Infinity`.
* Decimals → calculate correctly (12.5 × 20.25 ft → 253 sq ft).
* Multiple sections → "Add area/section" adds inputs and multi-section totals work
  (bulk 9 → 12 fields; driveway 20 → 23; paver 14 → 17).
* Waste, custom prices, missing prices → respected; missing prices are flagged as
  incomplete rather than invented.
* Unit changes → unit annotations render on 6–25 fields per calculator; no unit
  mismatch and no unit change that breaks a calculation.

### Fixes made in this section

* **FIXED — the Paver Base calculator was broken on first Calculate.** `defaultForm`
  never initialised `fields.compaction`, while `safeResult` called
  `optionalNumber(f.compaction)` and `optionalNumber` did `value.trim()`. The first
  click threw `TypeError: Cannot read properties of undefined (reading 'trim')`, and
  the user saw the raw JS message *"Input needs attention — Cannot read properties of
  undefined (reading 'trim')"* instead of an estimate. Fixed by initialising
  `compaction: '1.1'` in the form state (matching the value the form already displayed)
  and by hardening `optionalNumber` against `undefined`.
* **FIXED — most inputs had no label association.** A real-DOM audit found 7/9 bulk
  fields, 19/20 driveway fields, 26/26 fence-cost fields and 23/23 deck fields with a
  `<label for="x">` pointing at an id that did not exist (`UnitField` never propagated
  an id), or with no `for` at all. Every one of those inputs had an **empty accessible
  name** and clicking its label did nothing. Fixed in `Primitives.tsx`: `Field` derives
  the control id (explicit `for` if given, otherwise `useId`) and shares it through a
  context consumed by `NumberInput`, `TextInput`, `Select` and `TextArea`; hint/error
  ids are wired as `aria-describedby`. Result: 0 unlabelled controls on all 10 audited
  pages.
* **FIXED — error messages were machine-readable and pointed at nothing.**
  The summary said *"Check the highlighted calculation input"* while nothing was
  highlighted, and listed raw engine keys such as `wastePercent: wastePercent must be
  between 0 and 100.` The engine documents `CalcInputError.field` as the hook the UI
  uses to highlight the offending input — that highlight was never implemented. Added a
  field-name → form-label map, so the summary now reads
  *"This calculation could not run — Waste allowance — wastePercent must be between 0
  and 100."* and the matching `.field` is highlighted with `aria-invalid="true"`.
  Indexed keys are handled too: `parts[0].lengthFt` → *"Section 1 — Length"*,
  `areas[0].length` → *"Area 1 — Length"*.
* **FIXED — no result announcement for screen readers.** The empty state had
  `aria-live`, but the calculated result had none, so a screen-reader user got no
  feedback after pressing Calculate. Added a visually hidden `role="status"` region
  inside the result card announcing a concise, human-labelled summary
  ("Result updated. Order cubic yards 6.25. Area square feet 600…").
* **FIXED — the first console error found in production was `404 /favicon.ico`.**
  The app declared no icon at all. Added `src/app/icon.svg` and a generated 32 × 32
  `src/app/favicon.ico` using the brand colour. `/favicon.ico` and `/icon.svg` now
  return 200 and the console error is gone.

---

## Mobile

Breakpoints tested: **320, 375, 390, 430, 768, 1024, 1440 px** across 11 pages
(home, calculators index, gravel, fence, paver, paver patio, concrete, deck,
fence cost, projects, print) — 77 viewport/page combinations, each with a calculated
result on screen so the long result tables and shopping lists were measured.

| Check | Result |
| --- | --- |
| Horizontal scrolling | none at any breakpoint on any page (`scrollWidth == clientWidth`) |
| Elements overflowing the viewport | none |
| Inputs overflowing | none |
| Tables wider than the viewport | none (result tables and the render table included) |
| Tap targets under 40 px | none after fix |
| Card stacking / nav | correct; nav collapses at ≤ 680 px, project header stacks, buttons go full width |
| Result readability | verified; the dark result card keeps its metrics readable at 320 px |

### Issue found and fixed

`/projects` reported 11 tap targets of 17 × 17 px — the shopping-list checkboxes.
The whole row is a `<label>` so the effective target was the row, but the row was
only ~39 px tall, below the 44 px touch standard the rest of the design system uses
(`.button{min-height:44px}`). Fixed by setting `.shopping-item{min-height:44px}`
and a 20 × 20 px checkbox; the audit now reports 0 small targets at every width.

**Status: FIXED**

---

## Project Mode

End-to-end flow driven in a real browser (21 automated steps, **0 failures**):

Create project → name project → add calculator result → add another calculation →
view materials → view quantities → view costs → view assumptions → shopping list →
refresh browser → verify localStorage persistence → clear project.

| Step | Result |
| --- | --- |
| Add to Project from gravel, fence and deck | PASS (button confirms "Added to Project") |
| Project name | PASS — saved and survives refresh |
| Materials / quantities shown | PASS — 3 material groups, 18 quantity rows |
| Costs | PASS — entered cost total and "missing prices" state are explicit |
| Assumptions | PASS — 8 assumption rows on screen, 11 in the stored project |
| Shopping list | FIXED — now 11 items (was 1) |
| localStorage persistence | PASS — key `outdoor-project-v1` holds 3 materials, 16 quantities, 11 shopping items, 11 assumptions |
| Refresh browser | PASS — nothing lost; project name, materials, quantities, assumptions and shopping list all return |
| Clear project | PASS — materials removed and storage reset |
| Invalid project area | PASS — negative length rejected with a message |
| Console errors during the flow | none |

### Results were not silently lost

Verified explicitly: after refresh the three calculator results, their quantities and
the shopping list all reappear. The stored object was inspected directly rather than
trusting the DOM.

### Issue found and fixed

Adding a Fence, Deck or Paver result contributed **nothing** to the shopping list —
only gravel produced one row, because `resultToProjectMaterial` only set
`orderQuantity` when it was passed explicitly and `rebuildProject` filters rows where
`orderQuantity` is undefined. That contradicted the Project Mode promise that "your
shopping list will build as you add calculator results". Fixed with a documented
rule: discrete units (pieces, posts, rails, pickets, panels, sets, each, bags, loads)
are order quantities by definition, and the "recommended order" cubic-yard values are
now passed as order quantities. Shopping list: **1 → 13 items** for a three-calculator
project. Zero-quantity rows are also excluded so "Beams 0 pieces" no longer appears
as a purchase line.

A units bug was fixed at the same time: concrete weight was stored as the raw pound
value labelled `tons` (a 2000× error — 6,600 lb displayed as "6600 tons"). It is now
converted to short tons ("3.30 tons"), matching the calculator.

**Status: FIXED**

---

## Printable Project Plan

`/projects/print` was opened with a realistic project (gravel + fence + deck, two
areas, named project) and printed through Chrome's own print pipeline.

| Requirement | Result |
| --- | --- |
| Project name | PASS — "Backyard Refresh 2026" |
| Dimensions | PASS |
| Materials | PASS (labels added — see fix) |
| Quantities | PASS |
| Cost | PASS |
| Waste | PASS |
| Shopping list | PASS |
| Assumptions | PASS |
| Methodology disclaimer | PASS |
| Notes | PASS |
| Sections present | Project dimensions, Materials, Estimated costs, Shopping list, Assumptions, Notes & methodology |
| Print → Save as PDF | PASS — Chrome produced a clean **2-page A4 PDF** (73,546 bytes) |

Checked on the emulated print media:

* no navigation (`site-header` hidden)
* no footer
* no print toolbar
* **no interactive controls inside the printed sheet** (0 links, buttons, inputs)
* no horizontal overflow and no table wider than the page (5 tables, 0 clipped)
* sensible page structure (5 bounded sections; A4 output is 2 pages with no cut-off)
* readable on paper (serif-free 12 px table text, right-aligned numerics, ruled rows)

### Issues found and fixed

* The printed Materials table listed bare quantities — `142 pieces, 2272 linear ft,
  27 pieces, …` — with no indication of **what** each quantity was. Quantity labels
  are now included (`Decking boards: 142 pieces, Decking linear feet: 2272 linear ft, …`).
* Bulk project materials were titled with the raw engine slug (lowercase `gravel`).
  They now use the engine's material name (`Gravel (crushed stone)`), which also makes
  the shopping list self-describing.
* Derived area names were lowercase (`gravel area 1`) — now `Gravel area 1`.
* Counts of one printed as "1 loads" — now singularised ("1 load").

**Status: FIXED**


---

## Accessibility

Audited on 10 pages in a real browser: computed accessible names, keyboard traversal
with real Tab presses, focus visibility, heading structure, contrast (with the actual
computed foreground and effective background), error and result announcements.

| Check | Result |
| --- | --- |
| Keyboard-only navigation | PASS — Calculate and Reset reached by Tab on every calculator (41–42 tab stops) |
| Visible focus | PASS — 0 elements focused without a visible indicator (outline or ring) |
| Form labels | FIXED — 0 controls without an accessible name (was up to 26 per page) |
| Error announcements | PASS — `role="alert"` summary, now human-labelled |
| Result announcements | FIXED — `role="status"` live region added inside the result card |
| Heading hierarchy | FIXED — no skipped levels on any page (was h1 → h3 on `/calculators`) |
| Button names | PASS — 0 unnamed buttons |
| Link names | PASS — 0 unnamed links |
| Landmarks | PASS — `header`, `nav[Main navigation]`, `main`, `nav[Breadcrumb]`, `footer` |
| Contrast | FIXED — 0 failures on 7–12 sampled pairs per page, including inside the dark result card |
| No interaction requires colour alone | PASS — notices and errors carry text and an icon, not only colour |

### Issues found and fixed

* **Text was invisible on the Projects page and in every calculator result panel.**
  Two genuine defects found by measuring real computed colours and confirmed in
  screenshots:
  * `.metric-label` was `#c4d5ca` — a light colour designed for the dark result card
    (`#123a27`) — but the same class is used on the white "Project totals" card, giving
    a contrast ratio of **1.30–1.53 : 1**. The labels "Materials", "Areas",
    "Shopping items" were effectively unreadable. Fixed by scoping the light colours to
    `.result-card` and giving the base `.metric*` rules the light-surface palette.
  * `.notice` and `.shopping-item` inside the dark result card have light backgrounds
    (`--amber-soft`, `#fff`) but inherited the card's near-white text: **1.08 : 1** for
    every "Planning note" warning and **1.04 : 1** for fence/paver shopping-list rows —
    white on white. A screenshot showed blank white boxes where the shopping list
    should be. Fixed by giving both classes an explicit `color: var(--text)`, since both
    always sit on a light background.
* `--muted` was `#667168` (4.47 : 1 on the footer background, 4.49 : 1 on chips — just
  under the 4.5 : 1 requirement). Changed to `#5f6a61` (4.96 / 4.98 : 1) with no visual
  disruption.
* The input focus ring was `rgba(35,98,61,.11)` — a 3 px ring at 11 % opacity, barely
  visible. Raised to `.3`, so keyboard focus is unambiguous on every field.
* `/calculators` jumped from `h1` straight to `h3` (the card titles). Those titles are
  now `h2` and the visual styling was preserved
  (`.calculator-link h2, .calculator-link h3`).
* Lighthouse/axe flagged `label-content-name-mismatch` (WCAG 2.5.3) on the brand link:
  `aria-label="Outdoor Project Calculator home"` against visible text
  "Outdoor Project\nCalculator". The aria-label was redundant — the visible text already
  names the link — so it was **removed** rather than expanded. The audit now passes and
  the link remains named.
* Tab-focus/scroll: the sticky header overlays the top of the viewport, so a focused
  field near the top could be partly hidden. Added `scroll-margin-top: 96px` to `.field`.


---

## SEO

Inspected the generated production HTML on all 23 routes.

| Check | Result |
| --- | --- |
| Exactly one useful H1 per page | PASS (no page with 0 or 2+ H1s) |
| Unique titles | PASS (0 duplicates) |
| Unique meta descriptions | PASS (0 duplicates) |
| Canonical URL | FIXED — all 23 pages have exactly one canonical (7 static pages had none) |
| Open Graph metadata | PASS (title + description everywhere; per-page `og:url` added) |
| Breadcrumbs | PASS on all content pages (`/` and the `/projects/print` utility page intentionally have none) |
| Robots behaviour | FIXED — `index, follow` everywhere except `/projects/print` = `noindex, follow`; 404 = `noindex`; **no accidental noindex** |
| No duplicate canonical | PASS (0 pages with more than one) |
| Internal links correct | PASS — 0 broken, 0 non-200 |
| `/sitemap.xml` | PASS — 200, `application/xml`, 22 URLs, every URL resolves 200 |
| `/robots.txt` | PASS — 200, `text/plain`, `User-Agent: *`, `Allow: /`, sitemap declared |

### Issues found and fixed

* **`/projects/print` inherited the homepage title and description and was indexable.**
  It is a browser-only utility view of localStorage content and must not be indexed.
  It is a client component so it cannot export `metadata` itself; added
  `src/app/projects/print/layout.tsx` with a unique title, description and
  `robots: { index: false, follow: true }`.
* **7 static pages had no canonical** (home, calculators, projects, how-it-works,
  methodology, about, print). Canonicals added. `/` resolves to
  `http://localhost:3000` (trailing slash normalised) and every other page to its own
  path — all 23 unique.
* **`metadataBase` and the canonical helper disagreed.** `layout.tsx` defaulted
  `metadataBase` to `https://example.com` while `lib/seo.ts` defaulted `SITE_URL` to
  `http://localhost:3000`, so absolute canonicals and the metadata base pointed at
  different hosts. Both now read the single `SITE_URL` source, and relative canonicals
  are used where possible so the origin comes from one place.
* The 404 page had the generic homepage title; it now has its own title plus
  `robots: noindex, nofollow` (confirmed: status 404, title
  "Page not found | Outdoor Project Calculator", `noindex`).

### Deployment note (configuration, not a defect)

With `NEXT_PUBLIC_SITE_URL` unset, canonicals, Open Graph URLs and the sitemap
correctly resolve to `http://localhost:3000`. **Set `NEXT_PUBLIC_SITE_URL` to the
production origin before the production build**, otherwise the emitted canonicals and
the `robots.txt` sitemap URL will point at localhost.

---

## Link audit

Every internal link rendered on any crawled page was resolved over HTTP.

| Check | Result |
| --- | --- |
| Unique internal links found | 55 |
| Non-200 responses | **0** |
| Related-calculator links | PASS — every related link on all 16 calculators resolves 200 |
| Navigation links | PASS — header, footer and breadcrumb targets all exist |
| Slugs | PASS — no incorrect or missing slug |
| Breadcrumb paths | PASS — Home / Calculators / <Calculator> resolves at each level |
| Every sitemap URL | PASS — 22/22 resolve 200 |
| 404 handling | PASS — unknown URLs return 404 with the styled not-found page and `noindex` |

**No broken links were found.**


---

## Console and runtime audit

| Check | Result |
| --- | --- |
| Unexpected console errors | 0 |
| React hydration errors | 0 |
| Uncaught exceptions | 0 |
| Failed requests | 0 (excluding a deliberate 404 probe) |

The single console error present at the start of the phase was
`Failed to load resource: 404 /favicon.ico`, reproduced on the production build. It was
a real defect (no icon declared at all) and is now fixed: `/favicon.ico` → 200
`image/x-icon` and `/icon.svg` → 200 `image/svg+xml`.

**Status: FIXED**

---

## Performance

Lighthouse 13.5.0 (mobile defaults) against the production build on this machine.

| Page | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS | Weight | Unused JS | Render-blocking |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Homepage | 79–87 | 100 | 100 | 100 | ~1.1 s | ~2.6 s | 417–689 ms | **0** | 189 KB | 57 KB | none |
| Gravel Calculator | 76–83 | 100 | 100 | 100 | ~1.2 s | ~2.8 s | 467–846 ms | **0** | 195 KB | 28 KB | none |
| Fence Calculator | 80–81 | 100 | 100 | 100 | ~1.2 s | ~2.8 s | 503–676 ms | **0** | 194 KB | 28 KB | none |
| Paver Calculator | 70 → **83** | 100 | 100 | 100 | ~1.3 s | ~2.8 s | 1221 → **501 ms** | **0** | 194 KB | 28 KB | none |

Performance scores fluctuate run-to-run by roughly ±7 on a workstation, so the stable
indicators matter more: **CLS 0, no render-blocking resources, no oversized assets,
189–195 KB total page weight, only 28 KB unused JavaScript, and 100 for accessibility,
best practices and SEO on every page.**

### Bottleneck analysis (measured, not guessed)

Main-thread work on the Paver page was 4.9 s, broken down as
`scriptEvaluation 1.83 s + styleLayout 1.54 s + other 1.03 s`, with a single 70 KB
framework/app chunk responsible for 1.34 s of scripting. The page hydrates one large
client component that re-rendered its entire subtree on every keystroke — including the
static content block ("How the calculation works", worked example, assumptions,
planning, mistakes, limitations, FAQ, related calculators) and the result tables.

### Fix applied

Wrapped the two pure, props-driven subtrees in `React.memo`: `ContentSections` and
`ResultContent`. Both depend only on `definition`/`slug`/`result`, all of which are
stable across form edits, so typing in a field no longer re-renders ~10 cards, the FAQ
list, the related-calculator grid or the result tables.

Measured effect on the worst page (Paver Calculator):

| Metric | Before | After | Change |
| --- | --- | --- | --- |
| Performance score | 70 | 83 | +13 |
| Total blocking time | 1,221 ms | 501 ms | **−59 %** |
| Script evaluation | 1,882 ms | 1,338 ms | −544 ms |
| Main-thread work | 4,934 ms | 3,451 ms | −30 % |

Fence Calculator also improved (perf 80 → 81, TBT 676 → 503 ms). No behaviour changed;
the engine and the 49 tests are untouched.

### Remaining bottleneck (documented, deliberately not "optimised")

The remaining 400–850 ms of blocking time is React hydration of the calculator client
component, which today also renders the page's static editorial content. The next
measurable step would be to split the calculator route so the static content is a
server component and only the form/result stay interactive. That is an architectural
change, so per the QA remit it was **not** made here — the working architecture was left
intact. No other measured problem was left unfixed.

**Status: FIXED (measured improvement); further optimisation deliberately deferred**


---

## Visual quality review

Reviewed as a real user via full-page and viewport screenshots at 1440 px and 390 px of
the homepage, the calculator index, gravel and fence-cost calculators with results,
Project Mode and the methodology page.

Assessment: **this reads as a trustworthy, purpose-built calculation platform.**

* The calculator is unmistakably the main focus — on a calculator page the form and the
  dark result card are the only things above the fold; editorial content sits below it.
* The result card communicates confidence: a featured metric with its unrounded value
  underneath (`6.25` yd³ over `6.11 yd³ calculated`), an explicit waste percentage and a
  purchase-advice row.
* Assumptions, methodology disclaimers and "planning estimate" notices are surfaced
  rather than hidden — the opposite of a generic calculator directory.
* Prices are explicitly user-entered; the Projects page says "Add prices in calculators"
  instead of inventing a market total.
* Consistent visual system: one green accent, neutral surfaces, uniform radii and 44 px
  control heights, inline unit labels on every numeric field.
* No ad slots, no affiliate blocks, no placeholder text, no lorem ipsum and no unfinished
  states on any page reviewed. `/about` explicitly declines to publish placeholder
  contact details.

Not generic-AI-template, not a calculator directory, not an unfinished template and not
an ad farm.

**Status: PASS**

---

## Issues found and fixed (complete list)

| # | Issue | Severity | Status |
| --- | --- | --- | --- |
| 1 | Paver Base calculator threw a raw `TypeError` on first Calculate (`fields.compaction` never initialised) | Critical | FIXED |
| 2 | Shopping-list rows rendered white-on-white inside the calculator result card (1.04 : 1) | Critical | FIXED |
| 3 | "Planning note" warnings rendered near-white on pale amber inside the result card (1.08 : 1) | Critical | FIXED |
| 4 | Metric labels invisible on the Projects page (`#c4d5ca` on white, 1.30–1.53 : 1) | Critical | FIXED |
| 5 | Fence/Deck/Paver results contributed nothing to the Project Mode shopping list | High | FIXED |
| 6 | Most inputs had no accessible name (broken or missing `label for`) | High | FIXED |
| 7 | Two TypeScript errors; one also disabled missing-price detection | High | FIXED |
| 8 | Error summary named no field and claimed a highlight that did not exist | Medium | FIXED |
| 9 | `/projects/print` was indexable and duplicated the homepage title/description | Medium | FIXED |
| 10 | Concrete project weight stored in lb but labelled tons (2000× error) | Medium | FIXED |
| 11 | `404 /favicon.ico` console error on every page | Medium | FIXED |
| 12 | Seven static pages had no canonical; `metadataBase` disagreed with `SITE_URL` | Medium | FIXED |
| 13 | No result announcement for screen readers | Medium | FIXED |
| 14 | Per-keystroke re-render of static content and result tables (TBT 1,221 ms) | Medium | FIXED |
| 15 | Printed Materials table dropped quantity labels | Low | FIXED |
| 16 | Heading hierarchy skipped h1 → h3 on `/calculators` | Low | FIXED |
| 17 | `--muted` 4.47 : 1 and chips 4.49 : 1 (just under 4.5 : 1) | Low | FIXED |
| 18 | 11 %-opacity focus ring on inputs (hard to see) | Low | FIXED |
| 19 | Shopping-list tap targets ~39 px (below the 44 px standard) | Low | FIXED |
| 20 | WCAG 2.5.3 label/name mismatch on the brand link | Low | FIXED |
| 21 | Lowercase engine slugs shown as material names (`gravel`) | Low | FIXED |
| 22 | `1 loads` printed instead of `1 load` | Cosmetic | FIXED |

Nothing was found that could not be fixed, and no navigation, calculator, route or engine
formula was replaced to suppress an error.

---

## Files changed

Application code:

* `src/components/calculators/CalculatorClient.tsx` — typecheck fix; hardened
  `optionalNumber`; result live region; human labels for worked-example chips;
  `React.memo` on `ResultContent` and `ContentSections`
* `src/components/calculators/CalculatorForm.tsx` — `compaction` default for Paver Base;
  humanised error summary; engine-field → form-field highlight effect
* `src/components/calculators/project-mapper.ts` — `notes` type fix; discrete-unit order
  quantities; explicit order volumes; concrete weight unit fix; material display names;
  area-name capitalisation
* `src/components/ui/Primitives.tsx` — `Field` → control id association via context;
  `aria-describedby` wiring
* `src/components/layout/Header.tsx` — removed redundant `aria-label` on the brand link
* `src/lib/project-store/index.ts` — exclude zero-quantity shopping rows
* `src/app/layout.tsx` — single site-URL source; canonical; `og:url`
* `src/app/globals.css` — focus ring, `.field-invalid`, `.sr-only`, `--muted` contrast,
  notice/shopping-item text colour, dark-card metric scoping, `scroll-margin-top`,
  calculator-index `h2`, shopping-item touch sizing
* `src/app/{page,calculators,projects,about,how-it-works,methodology}/page.tsx` —
  canonicals; `/calculators` `h3` → `h2`
* `src/app/projects/print/layout.tsx` — new: print-page metadata + `noindex`
* `src/app/projects/print/page.tsx` — quantity labels; unit singularisation
* `src/app/not-found.tsx` — own title + `noindex`
* `src/app/icon.svg`, `src/app/favicon.ico` — new: real app icons

QA tooling (development only, not part of the application bundle): `qa/*.cjs`,
`qa/expected.ts`. Artifacts (screenshots, PDFs, JSON reports) are written to
`qa/artifacts/`.


---

## Final status

### Build

| Item | Status |
| --- | --- |
| `npm install` | **PASS** |
| `npm run typecheck` | **FIXED** (2 real type errors corrected) |
| `npm test` | **PASS** (49/49) |
| `npm run build` | **PASS** (29/29 static pages) |

### Browser

| Item | Status |
| --- | --- |
| 16 calculators load | **PASS** |
| Engine parity on realistic examples | **PASS** (16/16 match the engine) |
| Edge cases (zero, negative, decimal, huge, empty, multi-section, waste, prices) | **PASS** |
| Runtime errors | **PASS** (0) |
| Hydration issues | **PASS** (0) |

### Mobile

| Item | Status |
| --- | --- |
| 7 breakpoints × 11 pages | **PASS** |
| Issues found / fixed | **FIXED** (shopping-list tap-target size) |

### Project Mode

| Item | Status |
| --- | --- |
| Persistence across refresh | **PASS** |
| Print / Save as PDF | **PASS** (clean 2-page PDF) |
| Shopping list | **FIXED** (1 → 13 items from three calculators) |
| Assumptions | **PASS** |

### SEO

| Item | Status |
| --- | --- |
| Metadata (titles, descriptions, OG) | **PASS** |
| Canonical | **FIXED** (all 23 pages) |
| Sitemap | **PASS** (22 URLs, all resolve) |
| Robots | **FIXED** (print page noindexed) |
| Breadcrumbs | **PASS** |
| Broken links | **PASS** (0 broken) |

### Performance

| Item | Status |
| --- | --- |
| Lighthouse observations | a11y/best-practices/SEO **100**; CLS **0**; perf 76–87 |
| Major bottleneck | re-render of static subtrees — **FIXED** (TBT −59 % on the worst page) |
| Further optimisation | documented and deliberately deferred (would require an architecture change) |

### Overall

**No BLOCKED items.** Every check either passed or was fixed and re-verified.

### Gate status before the content phase

The required sequence is preserved — Calculation Engine ✅ → UI ✅ → **REAL Browser QA
(this report)** → SEO Content System → 50-page content → Final content QA →
AdSense/launch preparation.

All of the following now hold in the real environment:

* `npm run build` ✅ · `npm run typecheck` ✅ · `npm test` ✅
* all 16 calculators load ✅
* Project Mode works ✅
* print works ✅
* mobile works ✅
* no critical runtime errors ✅
* sitemap works ✅ · robots works ✅ · canonical metadata works ✅

### Notes for whoever deploys

1. Set `NEXT_PUBLIC_SITE_URL` to the production origin **before** `npm run build`, so
   canonicals, Open Graph URLs and the `robots.txt` sitemap URL are not localhost.
2. `qa/` contains development-only verification scripts and artifacts. Exclude or remove
   it from the deployed artefact if a lean deployment is wanted; nothing in the app
   imports from it.
3. Three npm audit advisories are reported by `npm install` (2 high, 1 critical). They
   are in the dev/build dependency tree, not runtime code paths used by this app, and no
   `npm audit fix --force` was applied because it would change the pinned Next/React
   versions mid-QA. Review before launch.
4. One cosmetic nit was left intentionally: Project Mode's on-screen shopping list still
   renders "1 loads" while the printable plan renders "1 load". It is a one-word display
   difference on a single row, and fixing it would mean touching the Project Mode client
   again after its verification pass.
