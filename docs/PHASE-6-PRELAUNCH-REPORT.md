# Phase 6 — Pre-Launch Report

Status: **final report of Phase 6 (pre-launch hardening)**
All PASS/WARN/FAIL values below come from `npm run qa:prelaunch` artifacts in `qa/artifacts/`
(`prelaunch-summary.json`, `seo.json`, `calculators.json`, `project.json`, `a11y.json`,
`content-a11y.json`, `responsive.json`, `content.json`, `prelaunch-build.log`).

---

## 1. Files created

| File | Purpose |
|---|---|
| `docs/PHASE-6-PRELAUNCH-AUDIT.md` | Baseline audit written before any Phase 6 change |
| `docs/PHASE-6-PRELAUNCH-REPORT.md` | This report |
| `qa/prelaunch.cjs` | Master `npm run qa:prelaunch` gate (aggregates every check, non-zero exit on FAIL) |
| `qa/content-claims.ts` | Content claim / price / calculator-reference audit tool |
| `src/lib/calculations/accuracy-bulk.test.ts` | Deterministic accuracy matrix for the 8 bulk calculators |
| `src/lib/calculations/accuracy-project.test.ts` | Deterministic accuracy matrix for driveway, concrete, paver(s), fence, fence cost, fence post, deck |
| `src/components/calculators/engine-bridge.test.ts` | UI ↔ engine contract tests for all 16 calculators |

## 2. Files modified

| File | Change | Why |
|---|---|---|
| `package.json` | added `qa:prelaunch` script | Step 2: one repeatable master command |
| `src/components/calculators/CalculatorForm.tsx` | error highlighter now resolves indexed engine keys (`areas[i].prop`, `parts[i].prop`) to the repeater control | Real defect: the driveway (and any area/part) error announced "Area 1 — Length" but highlighted no input (15 of 16 calculators highlighted, driveway did not) |
| `src/app/globals.css` | `.project-grid>*{min-width:0}` + `.project-grid .stack{grid-template-columns:minmax(0,1fr)}` | Real defect found by the mobile gate: `/projects` scrolled horizontally at 320 px (529 > 320) because the 480 px `min-width` table inflated the grid track |
| `src/content/projects/how-to-calculate-paver-materials.ts` | added `/methodology` link to `related` | Content audit: methodology reference missing |
| `src/content/projects/how-to-calculate-landscaping-materials.ts` | added `/methodology` link to `related` | Content audit: methodology reference missing |
| `src/content/costs/landscaping-project-cost.ts` | added `/methodology` link to `related` | Content audit: methodology reference missing |

No formula, no architecture, no design token and no existing page copy was changed.

## 3. Calculators audited (16/16)

gravel, mulch, topsoil, soil, sand, pea gravel, landscape rock, paver base, driveway gravel,
concrete, paver, paver patio, fence, fence cost, fence post, deck material.

Evidence per calculator:

* **Accuracy matrix (unit level)** — normal, small, large, very large, decimal, zero,
  negative/invalid, waste (0 / 10 / 25 / 26 / 100 %), multiple areas/sections,
  unit conversion (sq ft↔sq m, cu yd↔cu m, tons↔tonnes), cost, boundary and impossible cases,
  with hand-computed expectations (the engine never generates its own expectations).
* **UI contract (unit level)** — for every slug: `defaultForm(slug)` → `runCalculator(...)`
  deep-equals a directly constructed engine call; result rows carry the right units/rounding/
  currency; invalid input raises a `CalcInputError` whose `field` points at the input to fix;
  default forms never invent a cost.
* **Browser contract** — `qa/calc.cjs` against the fresh production build: page loads, labels
  match inputs, units present, worked example matches engine output, invalid input → useful
  error, reset, zero/negative/decimal/huge/empty edge cases, related links 200, no console or
  hydration errors.

## 4. Content pages audited (28/28 + indexes)

12 project guides, 9 material guides, 7 cost guides, plus `/`, `/calculators`, `/guides`,
`/projects`, `/how-it-works`, `/methodology`, `/about`, `/privacy`, `/terms`.

Checks run: `npm run test:content` (duplicate paragraphs/titles/descriptions/paths, placeholders,
empty sections, examples without results, meta length, section-id collisions, word counts) and
`qa/content-claims.ts` (calculator name/slug references, dollar figures and their framing,
unsupported-claim phrases, limitations present, methodology references, unit-terminology variants).

Findings acted on: 3 pages lacked a methodology reference (fixed). Prices in cost guides are
explicitly labelled illustrative ("replace them with your own supplier figures"); the only
"guaranteed" hits are negations ("rather than a guaranteed figure"); no placeholder text, no
fabricated statistics, no fabricated sources, no fake-expertise language.

## 5. SEO results — PASS

Single crawl of all 54 routes (`qa/seo.cjs` → `qa/artifacts/seo.json`), evaluated by the gate:

| Check | Result |
|---|---|
| Pages crawled / HTTP 200 | 54 / 54 |
| Unique titles | 54 (0 duplicates) |
| Unique meta descriptions | 54 (0 duplicates) |
| Canonicals | 54 unique, exactly 1 per page, no duplicates |
| Open Graph title + description | present on all 54 |
| H1 | exactly 1 on every page (404 page included) |
| Heading hierarchy | 0 level skips across all pages |
| `html lang` | `en` on all pages |
| Breadcrumbs | present everywhere except `/` and `/projects/print` (intentional) |
| Favicon link | present on all pages |
| Console / page errors during crawl | 0 / 0 |
| `/projects/print` robots | `noindex, follow` (unchanged) |
| Accidental `noindex` elsewhere | none |
| Sitemap | 200, `application/xml`, **53** URLs (indexable set minus `/projects/print`), every URL 200 |
| robots.txt | 200, `User-Agent: * / Allow: /`, advertises the sitemap |
| 404 behaviour | unknown route → 404 with an H1 |

## 6. Accessibility results — PASS

* **Core audit** (`qa/a11y.cjs`, 10 pages: home, calculators index, gravel/fence/paver/concrete/
  deck/paver-base calculators, `/projects`, `/projects/print`): 78 form controls, 20 buttons,
  392 links — **0** without an accessible name; **0** heading skips; **0** contrast failures
  across 96 sampled elements plus 0 inside the result card; keyboard tab order reaches
  Calculate and Reset on every calculator; every focus stop shows a visible indicator;
  invalid input announced with `role="alert"`; result updates inside an `aria-live` region;
  **0** console errors.
* **Content library audit** (`qa/content-a11y.cjs`, 28 pages × desktop + 380 px mobile):
  non-200 **0**, H1 problems **0**, heading skips **0**, JSON-LD problems **0**, breadcrumb
  problems **0**, uncaptioned tables **0**, unlabelled diagrams **0**, broken TOC links **0**,
  duplicate ids **0**, mobile overflow **0**, console problems **0**.
* Fixed during Phase 6: the error highlighter did not resolve indexed engine keys
  (`areas[i].prop`, `parts[i].prop`), so a driveway/part error was announced but never
  highlighted (`aria-invalid` + `.field-invalid` missing). Message text and `role="alert"`
  announcement were already correct; the missing highlight was the gap.
* Harness hardening (not a product change): `qa/a11y.cjs` now polls for the announcement /
  result card (4 s) and re-seats the invalid value if hydration replaced the input mid-typing,
  instead of assuming React rendered within a fixed 120 ms. A sandbox timing flake produced
  one false FAIL for the deck page before this change; a manual re-test of the same flow
  passed (alert: "Deck length — deckLengthFt must be greater than zero").

## 7. Mobile results — PASS

11 pages × 7 widths (320, 375, 390, 430, 768, 1024, 1440) = 77 measurements:

| Check | Result |
|---|---|
| Horizontal page scrolling | 0 occurrences |
| Inputs outside the viewport | 0 |
| Tap targets under 40 px | 0 |
| Header overflow | 0 |
| Tables overflowing the page without a scroll wrapper | 0 |
| Console messages | 0 |

Two real defects were found by this audit and fixed:

1. **`/projects` overflowed at 320 px (scrollWidth 529 vs viewport 320).** The
   `.content-table {min-width:480px}` inflated `.project-grid`'s `1fr` track and the nested
   `.stack` track. Fixed with `.project-grid>*{min-width:0}` plus
   `.project-grid .stack{grid-template-columns:minmax(0,1fr)}`; the table now scrolls inside
   its existing `.table-wrap{overflow-x:auto}` and the page measures exactly 320.
2. **11 shopping-list checkboxes were 20 × 20 px targets and the item name was not tappable.**
   Fixed by wrapping the checkbox and the item name in `<label class="shopping-check-label">`
   with `min-height:40px`, so tapping anywhere on the row toggles it (rows grow ~2 px).

Check refinement (documented rather than silently relaxed): the wide-table rule now only flags
a table whose wrapper cannot scroll — a table inside `overflow-x:auto` is the site's intended
responsive pattern and is what all 28 content pages use. Page-level horizontal scrolling is a
separate, unchanged hard failure.

## 8. Performance findings — PASS (no framework, no new dependency)

* **Client/server split:** 6 `"use client"` modules vs 98 other source modules; client code is
  limited to the interactive islands (calculator form/client, Project Mode, add-calculation
  panel, print page, form parts).
* **Runtime dependencies:** exactly 3 — `next`, `react`, `react-dom`. No analytics, ads,
  trackers or other third-party runtime packages.
* **Third-party scripts:** none in any source file (no external `<script src>`).
* **Emitted payload:** `.next/static` = 21 files, 991 kB total, largest JS/CSS chunk 219 kB.
* **Images:** none shipped (only `src/app/icon.svg` and `favicon.ico`).
* **Rendering:** every route is statically prerendered (○/● in the build output);
  `next.config.ts` keeps `compress: true` and `poweredByHeader: false`.
* **Hydration:** only interactive islands hydrate; 0 hydration warnings in every browser run.
* Lighthouse was **not** re-run in Phase 6 (optional; historical artifacts remain in
  `qa/artifacts/lh-*.json`).

## 9. Project Mode results — PASS

Browser flow (`qa/project.cjs`): **21/21 steps, 0 failures, 0 console errors, 0 page errors** —
three calculations added from different calculators, project named, area added, materials and
shopping list rendered (11 shopping items), state persisted across reload (project name,
materials, assumptions, quantity rows), Clear project empties both the view and
`localStorage`, and Add to Project confirms on every calculator.

## 10. Printable Plan results — PASS

* Print media hides the site header, footer and print toolbar; no interactive controls remain
  in the printed sheet; no element overflows the printed width; no table wider than the page.
* Chrome print-to-PDF produced a **6-page, 130,441-byte** PDF containing all 7 plan sections
  (dimensions, calculations, materials, costs, shopping list, assumptions, method).
* `/projects/print` keeps `noindex, follow` and is excluded from the sitemap (verified in §5).

## 11. Test count / result — PASS

`npm test` → **142 tests / 142 pass, 0 fail, 16 suites** (was 49 before Phase 6; +93 new tests):

| Suite | Tests |
|---|---|
| `accuracy-bulk.test.ts` (new) | 23 — gravel, mulch, topsoil, soil, sand, pea gravel, landscape rock, paver base |
| `accuracy-project.test.ts` (new) | 51 — driveway, concrete, paver, paver patio, fence, fence cost, fence post, deck |
| `engine-bridge.test.ts` (new) | 19 — UI ↔ engine contract for all 16 calculators |
| existing suites (bulk, audit, concrete, driveway, fence, fence-post, paver, deck, units, project) | 49 — unchanged, still green |

`npm run test:content` → **PASS** (28 pages, 49,182 words, 0 duplicates, 0 placeholders,
0 empty sections, 0 meta problems).

## 12. Typecheck result — PASS

`npm run typecheck` (`tsc --noEmit -p tsconfig.json`, strict mode) → **0 errors**.

## 13. Build result — PASS

`npm run build` → production build completed (≈78–88 s), all 55 routes prerendered
(54 indexable pages + 404), `BUILD_ID` written and then **verified against the served HTML**
by the gate before any browser QA ran (this is what proves the QA server was not a stale
process — the pre-existing `next start` on port 3000 was never used).

## 14. Browser QA result — PASS

Final run: `npm run qa:prelaunch` → **13 PASS / 1 WARN / 0 FAIL / 0 NOT RUN**, exit code **0**,
596.1 s, against `BUILD_ID 5gQrEddPCqhSM4qCx6KpJ` served on `http://localhost:3100`
(real Chrome via `puppeteer-core`; every gate step green; full record in
`qa/artifacts/prelaunch-summary.json`, log in `qa/artifacts/prelaunch-run6.log`):

| Gate step | Result |
|---|---|
| typecheck | PASS (0 errors) |
| unit tests | PASS (142/142) |
| content tests | PASS (28 pages) |
| production build | PASS (fresh BUILD_ID) |
| production server | PASS (BUILD_ID verified in served HTML — no stale server) |
| seo | PASS (54 pages) |
| route and link audit | PASS (0 broken links, 0 orphans, architecture links intact) |
| calculator contract audit | PASS (16/16, expected values regenerated from the engine) |
| project mode and printable plan | PASS (21/21, PDF 6 pages) |
| accessibility | PASS |
| content accessibility | PASS (28 pages × desktop + mobile) |
| mobile layout | PASS (11 pages × 7 widths: 0 issues, 0 off-screen inputs, 0 console messages) |
| performance | PASS (informational metrics) |
| production environment | **WARN** (placeholder origin — see §16/§18) |

Repeatable commands:

```
npm run qa:prelaunch                       # full gate (exits non-zero on any FAIL)
npm run qa:prelaunch -- --only=typecheck,tests
npm run qa:prelaunch -- --skip-browser     # static gates only
```

Anti-stale-procedure: the gate kills any listener on its own port (3100), builds first,
starts `next start -p 3100`, waits for HTTP 200 **and** requires the current `BUILD_ID` to
appear in the served HTML before any browser audit runs. Port 3000 (a leftover process from a
previous session) is never used.

## 15. Critical issues — none open

Three real defects were found by the Phase 6 audits and all were fixed and re-verified:

| # | Severity | Issue | Status |
|---|---|---|---|
| 1 | Medium | Indexed engine errors (`areas[i].prop`, `parts[i].prop`) announced correctly but never highlighted the offending input (driveway + concrete parts) | **FIXED** — `CalculatorForm.tsx` targets the repeater control; `aria-invalid` + `.field-invalid` now applied; browser audit re-run green |
| 2 | High | `/projects` scrolled horizontally at 320 px (529 > 320) because the 480 px table min-width inflated the grid tracks | **FIXED** — `.project-grid>*{min-width:0}` + nested `minmax(0,1fr)`; page measures exactly 320 |
| 3 | Medium | 11 shopping-list checkboxes were 20 × 20 px targets and the item name was not tappable | **FIXED** — checkbox + name wrapped in a `<label>` with `min-height:40px`; whole row toggles |

One QA-harness flake (deck announcement read after a fixed 120 ms) was also fixed by polling;
it was a test-timing problem, not a product defect (manual re-test of the same flow passed).

## 16. Non-critical issues

1. **`NEXT_PUBLIC_SITE_URL` is not set.** The tested build therefore used the placeholder
   origin `http://localhost:3100` (the gate sets it so canonicals/sitemap/robots point at the
   QA server rather than the stale port-3000 process). *Action: set it to the production
   https origin before the release build.* — **WARN, reported by the gate.**
2. **`NEXT_PUBLIC_CONTACT_EMAIL` is not set** — `/about`, `/privacy` and `/terms` render their
   fallback contact copy. *Optional: set it before the release build.*
3. **No web app manifest** (`src/app/manifest.ts`) — optional; only matters for "install to
   home screen".
4. **Dependency advisories:** `npm audit` reports **3 vulnerabilities (2 high, 1 critical)** for
   the runtime tree: advisories against `next@16.1.1` (Image Optimizer, rewrites smuggling,
   RSC deserialization DoS, Server-Actions CSRF, middleware bypass, cache poisoning, …) and
   transitive `sharp`. `npm audit fix --force` would install `next@16.3.7`, outside the pinned
   `16.1.1` range. This static site uses no image optimizer, no rewrites, no middleware, no
   Server Actions and no CSP nonces, so most advisories do not apply, but a few RSC/DoS items
   apply to any `next start`. **Not upgraded in Phase 6** (it would invalidate the QA baseline
   and needs its own full re-QA). *Recommended as the first maintenance task.*
5. **Browser QA tooling is installed but undeclared:** `puppeteer-core`, `lighthouse` and
   `axe-core` live in `node_modules` without being in `package.json`/`package-lock.json`
   (installed ad hoc). The gate reports `NOT RUN` with a clear reason if they disappear;
   for a clean clone, install them as devDependencies in a tooling pass.
6. **Naming/rounding quirks kept as-is (behaviour is correct):** `DeckResult.deckingBoardsRequired`
   carries the *ordered* (waste-included) count that the UI labels "Decking boards" (what to
   buy); the bulk per-ton cost line multiplies the exact tonnage while the quantity it displays
   is rounded (≤ 2 ¢ visual difference).
7. **Housekeeping:** a stale `next start` from a previous session still occupies port 3000 on
   this machine (never used by the gate); `qa/`, `docs/` and the QA artifacts are development
   files and should be excluded from the deployment artifact.

## 17. Environment limitations

* **Platform:** Windows sandbox, 30 s command ceiling — long gates were run detached and polled.
* **Browser QA:** Chrome is installed, so every browser audit **actually ran** (nothing was
  reported as PASS without running; nothing was faked). If Chrome or `puppeteer-core` is
  missing the gate reports `NOT RUN` explicitly.
* **Production values unavailable:** no production domain and no contact email exist yet, so
  they were **documented, never invented** (§16.1, §16.2).
* **Lighthouse:** not re-run in Phase 6 (optional; historical artifacts remain in
  `qa/artifacts/lh-*.json`).
* **`npm audit`** ran with network access on the day of this audit; results are as reported in §16.4.

## 18. Final launch blockers

**Code / QA blockers: none — 0 FAIL across all 13 gate steps.**

Configuration blockers that must be handled at release-build time:

1. **Set `NEXT_PUBLIC_SITE_URL` to the production https origin before `npm run build`**
   (otherwise canonicals, Open Graph URLs, the sitemap and `robots.txt` emit the localhost
   fallback). This is the single required action.
2. Optionally set `NEXT_PUBLIC_CONTACT_EMAIL` for the contact copy on `/about`, `/privacy`,
   `/terms`.

Recommended (non-blocking) follow-ups: the `next@16.3.7` dependency upgrade (§16.4), declaring
the browser-QA devDependencies (§16.5), and optionally a web app manifest (§16.3).

## 19. Exact next phase

```
CALCULATION ENGINE ✅ → UI ✅ → CONTENT ✅ → PRE-LAUNCH QA ✅ (this phase)
→ PRODUCTION DEPLOYMENT  ← next phase
→ SEARCH CONSOLE (submit sitemap)
→ OBSERVE SEARCH DATA
→ DATA-DRIVEN EXPANSION
```

**Phase 6 stops here.** Do **not**, in any follow-up to this phase: generate new SEO pages,
create blog or location pages, add advertisements or affiliate links, add authentication,
a database or a backend, expand Project Mode features, or change the calculation architecture.

## Final decision

**`READY WITH NON-BLOCKING WARNINGS`**

Basis (evidence, not judgement): `npm run qa:prelaunch` final run = **13 PASS / 1 WARN /
0 FAIL / 0 NOT RUN**, exit code 0; 142/142 unit tests; typecheck clean; 28/28 content pages
clean; 54/54 SEO pages clean; 16/16 calculator contracts green in a real browser; Project Mode
21/21; accessibility and mobile audits clean. The single WARN is the unset production
`NEXT_PUBLIC_SITE_URL` (§18.1), which is a release-build configuration step rather than a
code defect — it is why the verdict is *with warnings* rather than plain
*READY FOR PRODUCTION*.





