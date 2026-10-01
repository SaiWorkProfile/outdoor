# Calculator SEO Coverage Report

**Site:** MeasureToBuild (outdoor-calc)  
**Scope:** Final SEO optimization pass over the 16 existing calculator pages  
**Date:** 2026-09-30

---

## 1. At a glance

| Metric | Result |
| --- | --- |
| Calculator pages modified | **16 / 16** |
| New URLs / routes created | **0** |
| Duplicate 18+ word paragraphs across calculator pages | **0** |
| Duplicate titles / meta descriptions (whole site) | **0 / 0** |
| Canonical URLs changed | **0** (all unchanged) |
| Sitemap URL count | **53 → 53 (unchanged)** |
| Calculation formulas changed | **0** |
| FAQ entries across the 16 pages | **97** (7 on Gravel, 6 on every other page) |
| Internal links validated from calculator pages | **99**, all resolving to real routes |
| typecheck | **PASS** |
| tests | **PASS — 142/142** |
| build | **PASS** (`next build`, all routes static) |
| pre-launch QA (`npm run qa:prelaunch`) | **See §8** |
| New QA tooling | `qa/calculator-seo-check.ts` (copy audit; no pages, no routes) |

---

## 2. What changed (and what deliberately did not)

### Changed

| File | Change |
| --- | --- |
| `src/components/calculators/copy.ts` (**new**) | Per-calculator page copy: unique `metaTitle`, `metaDescription`, 100–180 word `intro`, `outputs`, `useCases`, `outputNotes`, `planning`, `mistakes`, `faq`. Text only — no logic. |
| `src/components/calculators/registry.ts` | `CalculatorDefinition` is now `CalculatorCopy & { engine-facing fields }`. The 16 entries keep slug/name/H1/family/use cases/method/formula/worked example/assumptions/related links; page copy is merged in from `copy.ts`. **No formula, worked example, assumption or engine value was altered.** |
| `src/app/calculators/[slug]/page.tsx` | Title and description now come from `metaTitle` / `metaDescription` (Open Graph mirrors them). Canonical, breadcrumb JSON-LD, `robots: index, follow` and the URL itself are untouched. |
| `src/components/calculators/CalculatorClient.tsx` | Three copy cards inserted into the existing shared template: *What this calculator calculates*, *Projects this calculator covers*, *Reading the results*. Everything else (form, result cards, Project Mode, print, responsive layout) is unchanged. |
| `src/components/calculators/AddCalculationPanel.tsx`, `src/components/content/ContentPageView.tsx` | Short one-line contexts now use `shortDescription` instead of the (now long) `intro`. |
| `qa/calculator-seo-check.ts` (**new**) | Copy audit: uniqueness, length bands, duplicate paragraphs/FAQ questions, internal link targets. |

### Deliberately not changed

- No new routes, no keyword-variant URLs (`-tons`, `-yards`, `-bags`, etc.).
- No new calculators, no new content pages, no location pages.
- Calculator UI, input behaviour, result cards, Project Mode architecture and visual language.
- Calculation formulas, densities, defaults, worked-example inputs.
- Canonical URLs and the 53-URL sitemap.

---

## 3. Page template as rendered

H1 → intro (100–180 words) → calculator → **What this calculator calculates** → **Projects this calculator covers** → Method → Worked example (engine-derived) → **Reading the results** → Assumptions → Practical planning guidance → Common mistakes → Limitations → FAQ → Planning guides → Related calculators.

The three bolded cards are the additions of this pass; they use the existing `Card` primitive and existing list styles, so the presentation architecture is unchanged. Each page still has exactly one H1 (the calculator name).

---

## 4. Internal query-coverage maps

These are **content targets, not URLs**. Each cluster is served by its one canonical calculator page through the copy written in `copy.ts`.

### Gravel
- Primary: `gravel calculator`
- Secondary: `gravel calculator cubic yards` · `gravel calculator tons` · `gravel calculator bags` · `gravel quantity calculator` · `gravel volume calculator` · `how much gravel do I need` · `gravel cost calculator`
- Use cases: driveway · walkway · patio · landscaping
- Covered by: intro, outputs list, use-case card, output notes (yards vs tons, order vs calculated, bags vs bulk, cost scope), 7 FAQs

### Mulch
- Primary: `mulch calculator`
- Secondary: `mulch coverage calculator` · `how much mulch do I need` · `mulch calculator cubic yards` · `mulch calculator bags` · `mulch depth calculator` · `mulch cost calculator`
- Covered by: depth-comparison output, coverage-versus-volume note, 6 FAQs

### Topsoil
- Primary: `topsoil calculator`
- Secondary: `how much topsoil do I need` · `topsoil cubic yards` · `topsoil calculator for garden` · `topsoil calculator for lawn` · `raised bed soil calculation`
- Covered by: use-case presets (garden, new lawn, raised bed, top-dressing), depth-to-add note, 6 FAQs

### Soil
- Primary: `soil calculator`
- Secondary: `soil volume calculator` · `garden soil calculator` · `soil cubic yards` · `how much soil do I need`
- Covered by: general-purpose intro, density note, fill-dirt FAQ, 6 FAQs

### Sand
- Primary: `sand calculator`
- Secondary: `sand volume calculator` · `sand cubic yards` · `how much sand do I need` · `sand calculator for pavers` · `sand quantity calculator`
- Covered by: bedding-versus-base note, use cases (bedding, leveling, sandbox, trench), 6 FAQs

### Pea gravel
- Primary: `pea gravel calculator`
- Secondary: `pea gravel coverage calculator` · `how much pea gravel do I need` · `pea gravel cubic yards` · `pea gravel tons`
- Covered by: coverage note, migration/edging guidance, 6 FAQs

### Landscape rock
- Primary: `landscape rock calculator`
- Secondary: `landscape rock coverage calculator` · `rock calculator landscaping` · `how much rock do I need` · `landscape stone quantity`
- Covered by: stone-size/void-space note, xeriscape use cases, 6 FAQs

### Paver base
- Primary: `paver base calculator`
- Secondary: `paver base material calculator` · `how much paver base do I need` · `paver base cubic yards` · `paver base depth calculation`
- Covered by: net-versus-order volume note, compaction as an input, 6 FAQs

### Driveway gravel
- Primary: `driveway gravel calculator`
- Secondary: `gravel driveway calculator` · `driveway stone calculator` · `driveway gravel tons` · `how much gravel for driveway` · `driveway gravel depth calculation`
- Covered by: layered outputs, per-layer compaction and truck loads, 6 FAQs

### Concrete
- Primary: `concrete calculator`
- Secondary: `concrete slab calculator` · `concrete volume calculator` · `how much concrete do I need` · `concrete calculator cubic yards` · `concrete bags calculator` · `ready mix concrete calculator`
- Covered by: bag-yield and ready-mix outputs, running-short note, 6 FAQs

### Paver
- Primary: `paver calculator`
- Secondary: `paver quantity calculator` · `how many pavers do I need` · `paver square footage calculator` · `paver waste calculator` · `paver material calculator`
- Covered by: joint-aware module note, pieces-versus-coverage, 6 FAQs

### Paver patio
- Primary: `paver patio calculator`
- Secondary: `patio paver calculator` · `paver patio material calculator` · `how many pavers for a patio` · `patio base calculator` · `patio sand calculator`
- Covered by: shopping-list outputs, multi-section FAQ, 6 FAQs

### Fence
- Primary: `fence calculator`
- Secondary: `fence material calculator` · `fence board calculator` · `fence picket calculator` · `fence panel calculator` · `how many fence posts do I need` · `fence gate calculation`
- Covered by: component outputs, fence-type use cases, whole take-off FAQ, 6 FAQs

### Fence cost
- Primary: `fence cost calculator`
- Secondary: `fence price calculator` · `fence material cost calculator` · `fence estimate calculator` · `fence cost estimator` · `fence project cost`
- Covered by: completeness flag, material vs labour vs total note, 6 FAQs

### Fence post
- Primary: `fence post calculator`
- Secondary: `fence post spacing calculator` · `how many fence posts do I need` · `fence post quantity` · `gate post calculator` · `line post calculator`
- Covered by: category breakdown outputs, gate-openings note, 6 FAQs

### Deck
- Primary: `deck material calculator`
- Secondary: `deck board calculator` · `decking calculator` · `how many deck boards do I need` · `deck material estimator` · `deck board quantity` · `deck fastener calculator`
- Covered by: rows/stock/joist/fastener outputs, coverage-width note, 6 FAQs

---

## 5. Page-by-page coverage table

Canonical values are path-only: the origin comes from `NEXT_PUBLIC_SITE_URL` at build time (unchanged behaviour).

| Calculator | Primary intent | Secondary intents | Major use cases | Unique content additions | FAQ | Internal links | Title (renders as `… | MeasureToBuild`) | Meta description | Canonical | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Gravel | gravel calculator | cubic yards · tons · bags · quantity · volume · how much do I need · cost | driveway surface, walkway, gravel patio, landscaping fill | 134-word intro; 6 outputs; 4 use cases; 4 output notes (yards/tons, order vs calculated, bags vs bulk, cost scope); 5 guidance items; 5 mistakes; surface-vs-layered split | 7 | 8 | Gravel Calculator — Cubic Yards, Tons & Cost | Calculate gravel in cubic feet, cubic yards and tons for driveways, walkways, patios and paths, with bag counts, waste and cost from your own price. | `/calculators/gravel-calculator` | Optimized |
| Mulch | mulch calculator | coverage · how much do I need · cubic yards · bags · depth · cost | garden beds, tree rings, playground/path surfacing, top-ups | 151-word intro; depth-comparison output; coverage-versus-volume and settling notes; trunk-gap guidance; bag-fill checks | 6 | 7 | Mulch Calculator — Cubic Yards, Bags & Cost | Work out how much mulch you need for garden beds, tree rings and borders: coverage by depth, cubic yards, bag counts and cost from your own price. | `/calculators/mulch-calculator` | Optimized |
| Topsoil | topsoil calculator | how much do I need · cubic yards · for garden · for lawn · raised bed | garden beds, new lawn, raised bed fill, lawn top-dressing | 153-word intro; preset explanation; depth-to-add vs depth-present note; inside-dimension guidance; settling note | 6 | 6 | Topsoil Calculator — Garden, Lawn & Raised Bed Yards | Estimate topsoil for garden beds, new lawns, raised beds and lawn top-dressing: cubic yards, bags, waste and cost from the price you enter. | `/calculators/topsoil-calculator` | Optimized |
| Soil | soil calculator | soil volume · garden soil · cubic yards · how much do I need | planting beds, bulk fill, planters, landscaping rebuilds | 155-word intro; density-changes-weight note; soil-vs-topsoil separation; screened/unscreened guidance; fill-dirt FAQ | 6 | 6 | Soil Calculator — Garden Soil Volume in Cubic Yards | A general soil volume calculator for garden, fill and landscaping areas: area, cubic feet, cubic yards, tons and bag counts from your dimensions. | `/calculators/soil-calculator` | Optimized |
| Sand | sand calculator | volume · cubic yards · how much do I need · for pavers · quantity | paver bedding, leveling, sandbox, pipe bedding | 165-word intro; bedding-is-not-base note; per-use depth ranges; sand-type checklist; bags-for-thin-layers note | 6 | 6 | Sand Calculator — Cubic Yards, Tons & Paver Bedding | Estimate sand for paver bedding, leveling, sandboxes and play areas: cubic feet, cubic yards, tons, bag counts and cost from your own price. | `/calculators/sand-calculator` | Optimized |
| Pea gravel | pea gravel calculator | coverage · how much do I need · cubic yards · tons | walkways, planting beds, gravel patio, play areas | 164-word intro; coverage-varies-with-depth note; non-compacting guidance; edging/migration advice; density reminder | 6 | 6 | Pea Gravel Calculator — Coverage, Cubic Yards & Tons | Calculate pea gravel for walkways, garden beds and patios: coverage by depth, cubic yards, tons, bag counts and cost using your own measurements. | `/calculators/pea-gravel-calculator` | Optimized |
| Landscape rock | landscape rock calculator | coverage · rock calculator landscaping · how much rock · stone quantity | rock beds, xeriscape areas, feature edging, tree rings | 174-word intro; stone-size/void-space note; one-batch ordering advice; decorative-vs-load-bearing distinction | 6 | 6 | Landscape Rock Calculator — Coverage, Tons & Yards | Plan landscape rock and decorative stone by area and depth: cubic yards, tons, coverage, bag counts and cost for beds, borders and yard features. | `/calculators/landscape-rock-calculator` | Optimized |
| Paver base | paver base calculator | base material · how much do I need · cubic yards · depth calculation | patio base, walkway base, driveway base, step pads | 166-word intro; net-vs-order volume note; compaction-as-input explanation; base-vs-bedding distinction; lift guidance | 6 | 6 | Paver Base Calculator — Yards, Tons & Compaction | Calculate paver base for patios, walkways and drives: compactable aggregate by area and depth, with compaction allowance, cubic yards, tons and cost. | `/calculators/paver-base-calculator` | Optimized |
| Driveway gravel | driveway gravel calculator | gravel driveway calculator · driveway stone · driveway gravel tons · how much for a driveway · depth calculation | new driveway, resurfacing, apron/turnaround, car parks | 158-word intro; per-layer outputs; compaction-per-layer note; load-count planning note; cost-completeness explanation | 6 | 5 | Driveway Gravel Calculator — Layers, Yards & Tons | Plan a gravel driveway in layers: footprint area, base, middle and surface depths, compaction and waste, with cubic yards, tons, loads and cost. | `/calculators/driveway-gravel-calculator` | Optimized |
| Concrete | concrete calculator | slab · volume · how much do I need · cubic yards · bags · ready mix | slabs/pads, footings, post holes, combined pours | 158-word intro; bag-yield note; ready-mix rounding explanation; running-short risk note; cylinder-vs-slab guidance | 6 | 6 | Concrete Calculator — Cubic Yards, Bags & Ready-Mix | Calculate concrete for slabs, footings and post holes: cubic feet, cubic yards, ready-mix order size, bag counts at 40–80 lb yields and waste. | `/calculators/concrete-calculator` | Optimized |
| Paver | paver calculator | quantity · how many pavers · square footage · waste · material | patios, walkways, steps, drives | 159-word intro; joint-aware module explanation; pieces-vs-coverage note; pattern-cut guidance; base/sand separation | 6 | 6 | Paver Calculator — Pavers, Base, Sand & Waste | Calculate pavers for patios and paths: piece count with joints and waste, plus base aggregate, bedding sand, edging and cost from your own prices. | `/calculators/paver-calculator` | Optimized |
| Paver patio | paver patio calculator | patio paver · material · how many pavers for a patio · patio base · patio sand | rectangular patio, multi-section, patio+path+steps, relaying | 162-word intro; shopping-list framing; suppliers-separately note; batch/colour-lot guidance; excavation-vs-material distinction | 6 | 6 | Paver Patio Calculator — Pavers, Base, Sand & Edging | Plan a whole paver patio: piece count with joints and waste, compactable base, bedding sand, edge restraint, shopping list and print-ready quantities. | `/calculators/paver-patio-calculator` | Optimized |
| Fence | fence calculator | material · board · picket · panel · how many posts · gate calculation | privacy fence, picket/panel fence, gated runs, corners | 145-word intro; component outputs; fence-type unit note; rails-follow-height explanation; hole and hardware reminders | 6 | 7 | Fence Calculator — Posts, Panels, Rails & Concrete | Calculate a fence from length, height and gates: posts by spacing, rails, pickets or panels, concrete for holes, hardware and a shopping list. | `/calculators/fence-calculator` | Optimized |
| Fence cost | fence cost calculator | price · material cost · estimate · estimator · project cost | comparing quotes, DIY replacement, gate budgeting, tendering | 152-word intro; completeness flag explanation; material/labour/total split; price-basis note; exclusions list | 6 | 6 | Fence Cost Calculator — Materials, Labor & Total | Build a fence cost estimate from your own prices: posts, rails, pickets or panels, concrete, hardware, gates and labor, with missing prices flagged. | `/calculators/fence-cost-calculator` | Optimized |
| Fence post | fence post calculator | spacing · how many posts · quantity · gate post · line post | straight runs, gated runs, corners, spacing comparisons | 147-word intro; category breakdown outputs; gate-opening subtraction note; shared-post explanation; quantity-not-structure note | 6 | 6 | Fence Post Calculator — Spacing, Posts & Gates | Work out how many fence posts you need: post spacing, line, corner, end and gate posts, net run after gate openings and a layout estimate. | `/calculators/fence-post-calculator` | Optimized |
| Deck material | deck material calculator | deck board · decking · how many boards · estimator · board quantity · fastener | rectangular deck, multi-level, direction changes, re-decking | 160-word intro; rows/stock outputs; coverage-width note; stock-length note; span-input disclaimer; fastener guidance | 6 | 6 | Deck Material Calculator — Boards, Joists & Fasteners | Estimate deck materials from your dimensions: decking boards, joists, beams, posts, rim joist and fasteners, with waste and optional prices. | `/calculators/deck-material-calculator` | Optimized |

## 6. Search-intent separation maintained

| Intent | Where it lives | Calculator page role |
| --- | --- | --- |
| Interactive calculation | `/calculators/<slug>` | **Calculate it** — form, results, worked example, assumptions |
| Project planning | `/projects/…` | Plan how to do it — linked from *Planning guides* on every calculator |
| Material characteristics | `/materials/…` | Understand the material — linked per calculator |
| Pricing drivers | `/costs/…` | Understand what changes the price — linked per calculator |

Calculator copy stays inside the calculation intent: it explains outputs, units, waste,
ordering and inputs. It does not re-teach the project steps, the material science or the
price drivers that the guides cover; those appear only as descriptive internal links
(3–4 guide links + 2–4 related calculators + Project Mode per page).

## 7. Content differentiation audit

| Check | Result |
| --- | --- |
| Repeated 18+ word paragraphs across the 16 pages | **0** (script-enforced) |
| Repeated intros | **0** — every intro is written independently (134–174 words) |
| Identical FAQ sets | **0** — 97 questions total, no question appears on two calculators |
| Generic (copy-pasted) guidance | **0** — 5 guidance items per page, each job-specific |
| Identical mistake lists | **0** — 5 mistakes per page, each calculator-specific |
| Identical limitations text | Shared safety language only, by design (planning estimate vs professional engineering/surveying/code); no safety certification claims anywhere |
| Irrelevant related links | **0** — every related slug validated against the registry; every guide href validated against the route inventory |
| Keyword stuffing | None: no repeated exact-match phrases, no keyword lists, no hidden text, no footer keyword blocks, headings are plain-language section names |

The only shared wording across pages is (a) the limitations notice, (b) the assumptions
footnote pointing at the methodology page, and (c) short assumption labels produced by the
shared engine — all genuinely necessary.

## 8. Validation results

Run order and outcomes:

| # | Validation | Result |
| --- | --- | --- |
| 1 | Content duplicate audit (`npx tsx qa/calculator-seo-check.ts`) | **PASS** — 0 duplicate paragraphs, 0 duplicate FAQ questions |
| 2 | Duplicate 18+ word paragraphs | **0** |
| 3 | Metadata uniqueness | **16/16 unique titles, 16/16 unique descriptions** on calculators; site-wide crawl found **0 duplicate titles, 0 duplicate descriptions, 0 duplicate canonicals** |
| 4 | Worked examples still engine-derived | **PASS** — examples are computed at render from the unchanged engine; `engine-bridge` contract tests + pre-launch *calculator contract audit* both PASS (engine/UI value parity) |
| 5 | Internal links return 200 | **PASS** — 99 link targets verified statically; pre-launch *route and link audit* PASS (0 broken, 0 orphan) |
| 6 | New routes created | **0** — no `page.tsx` added or removed; only `copy.ts` and `qa/calculator-seo-check.ts` (non-routes) are new files |
| 7 | Sitemap URL count | **53 → 53, unchanged** (verified against the served `/sitemap.xml`) |
| 8 | `npm run typecheck` | **PASS** |
| 9 | `npm test` | **PASS — 142/142 tests, 16 suites, 0 failures** |
| 10 | `npm run build` | **PASS** — compiled successfully, all routes static/SSG, no warnings |
| 11 | Pre-launch QA (`npm run qa:prelaunch`) | **13 PASS / 1 WARN / 0 FAIL / 0 NOT RUN — verdict: READY WITH NON-BLOCKING WARNINGS** |

Pre-launch detail: typecheck · unit tests · content tests · production build · production
server · seo · route and link audit · calculator contract audit · project mode and
printable plan · accessibility · content accessibility · mobile layout · performance all
PASS. The single WARN is the pre-existing deployment note that the tested build used the
placeholder origin `http://localhost:3100` — a release build must set
`NEXT_PUBLIC_SITE_URL` to the production HTTPS origin (unchanged from earlier releases).

Live page verification (served production build, script `qa/tmp/check-calc-pages.ps1`),
all 16 calculator URLs:

- HTTP **200**, exactly **one H1**, exactly **one canonical** pointing at the unchanged calculator URL
- unique `<title>` (≤ 70 rendered characters incl. `| MeasureToBuild`) and unique meta description (138–150 chars)
- `og:title` + `og:description` present, `robots: index, follow`
- all template sections present: *What this calculator calculates*, *Projects this calculator covers*, *Reading the results*, *Frequently asked questions*, *Planning guides*, *Related calculators*, *Common mistakes*, *Important limitations*
- each page links to a `/projects/…` guide, a `/materials/…` guide, a `/costs/…` guide, at least one other calculator and Project Mode

## 9. Success criteria

| Criterion | Status |
| --- | --- |
| 16 strong calculator pages | ✅ each with unique intro, outputs, use cases, output notes, guidance, mistakes, 6–7 FAQs |
| 1 authoritative URL per calculator | ✅ canonicals untouched, no variant URLs |
| Natural coverage of related queries | ✅ per-page query maps covered through copy (§4) |
| Unique calculator-specific content | ✅ 0 duplicate paragraphs / FAQ questions |
| No keyword stuffing | ✅ |
| No duplicate SEO pages | ✅ 0 new routes, sitemap unchanged at 53 |
| No formula changes | ✅ engine files untouched; contract tests pass |
| No new routes | ✅ 0 |
