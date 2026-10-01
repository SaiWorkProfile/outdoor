# CONTENT-QA-REPORT.md

Content library phase: 28 new indexable pages added to the existing 22, bringing
the launch site to **50 indexable pages**.

The calculation engine and the existing calculator UI were not changed in any way
that affects results. Every number printed on a content page is produced by
calling the same engine functions the calculators call (see
`src/content/shared.ts`), so a worked example cannot disagree with its calculator.

---

## 1. Pages created (28/28)

All 28 required slugs exist, render as static HTML, and are in the sitemap.
Word counts are measured from the rendered content data (prose, tables, worked
examples and FAQs), not from a word-count target.

### Cluster 1 — Project guides (12)

| # | URL | Words | Sections | Worked examples | Tables | Diagrams | FAQs |
|---|-----|------:|---------:|----------------:|-------:|---------:|-----:|
| 23 | `/projects/how-much-gravel-do-i-need` | 2637 | 10 | 2 | 5 | 2 | 5 |
| 24 | `/projects/how-to-calculate-mulch` | 2096 | 9 | 1 | 4 | 1 | 4 |
| 25 | `/projects/how-much-topsoil-do-i-need` | 2277 | 7 | 3 | 5 | 0 | 5 |
| 26 | `/projects/how-to-calculate-landscaping-materials` | 2206 | 7 | 3 | 5 | 1 | 4 |
| 27 | `/projects/how-to-plan-a-gravel-driveway` | 1887 | 8 | 1 | 3 | 1 | 5 |
| 28 | `/projects/how-to-plan-a-fence` | 1798 | 7 | 1 | 2 | 1 | 5 |
| 29 | `/projects/how-to-calculate-fence-materials` | 1878 | 7 | 2 | 4 | 0 | 5 |
| 30 | `/projects/how-to-plan-a-paver-patio` | 1804 | 7 | 1 | 3 | 1 | 5 |
| 31 | `/projects/how-to-calculate-paver-materials` | 1604 | 6 | 1 | 2 | 0 | 5 |
| 32 | `/projects/how-to-calculate-concrete-for-a-slab` | 1840 | 7 | 2 | 1 | 1 | 5 |
| 33 | `/projects/how-to-estimate-deck-materials` | 1664 | 6 | 1 | 1 | 1 | 5 |
| 34 | `/projects/outdoor-project-cost-planning` | 2087 | 8 | 1 | 4 | 0 | 5 |

### Cluster 2 — Material guides (9)

| # | URL | Words | Sections | Worked examples | Tables | Diagrams | FAQs |
|---|-----|------:|---------:|----------------:|-------:|---------:|-----:|
| 35 | `/materials/gravel` | 1915 | 7 | 1 | 7 | 0 | 4 |
| 36 | `/materials/pea-gravel` | 1711 | 6 | 1 | 5 | 0 | 5 |
| 37 | `/materials/mulch` | 1790 | 6 | 1 | 5 | 0 | 5 |
| 38 | `/materials/topsoil` | 1811 | 6 | 1 | 4 | 0 | 5 |
| 39 | `/materials/sand` | 1733 | 6 | 1 | 5 | 0 | 5 |
| 40 | `/materials/paver-base` | 1575 | 5 | 1 | 4 | 1 | 5 |
| 41 | `/materials/concrete` | 1743 | 6 | 2 | 1 | 1 | 5 |
| 42 | `/materials/fence-materials` | 1558 | 5 | 1 | 3 | 0 | 4 |
| 43 | `/materials/decking-materials` | 1497 | 5 | 1 | 3 | 0 | 5 |

### Cluster 3 — Cost guides (7)

| # | URL | Words | Sections | Worked examples | Tables | Diagrams | FAQs |
|---|-----|------:|---------:|----------------:|-------:|---------:|-----:|
| 44 | `/costs/gravel-cost` | 1454 | 5 | 1 | 2 | 0 | 5 |
| 45 | `/costs/mulch-cost` | 1270 | 4 | 1 | 3 | 0 | 5 |
| 46 | `/costs/fence-cost` | 1308 | 4 | 1 | 2 | 0 | 5 |
| 47 | `/costs/paver-patio-cost` | 1449 | 5 | 1 | 2 | 0 | 5 |
| 48 | `/costs/gravel-driveway-cost` | 1450 | 5 | 1 | 2 | 0 | 5 |
| 49 | `/costs/deck-cost` | 1494 | 5 | 1 | 1 | 0 | 5 |
| 50 | `/costs/landscaping-project-cost` | 1631 | 6 | 1 | 2 | 0 | 5 |

**Total new content: 49,167 words across 28 pages.** Range 1,270–2,637 words.
Project pages sit at the top of the range because they carry more worked
examples and tables; cost pages are shorter because their topic is narrower and
padding them would have added nothing. Every page has at least one engine-derived
worked example, at least one table, a checklist or steps list, a limitations
section and internal links.


---

## 2. Total indexable pages = 50

| Group | Count | Notes |
|-------|------:|-------|
| Homepage, calculators index, projects (Project Mode), how it works, methodology, about | 6 | Pre-existing |
| Calculator pages | 16 | Pre-existing |
| New project guides | 12 | This phase |
| New material guides | 9 | This phase |
| New cost guides | 7 | This phase |
| **Indexable total** | **50** | Sitemap footprint confirmed at 50 URLs |
| `/projects/print` | — | Deliberately `noindex, follow`, excluded from the sitemap |

No hub pages were added for `/materials` or `/costs`: those clusters are
connected by contextual cross-links. That is why material and cost pages have a
two-level breadcrumb (`Home / <Page>`) while project guides have three
(`Home / Projects / <Page>`).

---

## 3. Architecture plan as executed

Each page was defined before writing: primary intent, which calculator owns the
interactive intent, which material page owns "what is this material", which cost
page owns "what moves the price", and the value the page adds beyond those.

Cannibalisation was managed by keeping four intents apart:

* **interactive calculation** → the calculator pages (unchanged);
* **real-world planning process** → project guides;
* **the material itself** → material guides;

### Project guides

| URL | Primary intent | Calculator | Material page | Cost page | Cannibalisation risk | Unique value |
|-----|----------------|-----------|---------------|-----------|----------------------|--------------|
| how-much-gravel-do-i-need | "How much gravel?" measurement and conversion | gravel-calculator | /materials/gravel | /costs/gravel-cost | Low — the calculator is interactive only | Measure-at-subgrade guidance, mistake-to-consequence table, supplier call checklist, depth comparison |
| how-to-calculate-mulch | Bed mulch quantity | mulch-calculator | /materials/mulch | /costs/mulch-cost | Low — the material page covers products | Bag-versus-yard comparison, settling explanation, concordance with published extension depth guidance |
| how-much-topsoil-do-i-need | Soil volume by use case | topsoil-calculator | /materials/topsoil | /costs/landscaping-project-cost | Low — use-case driven | Original cross-check of the engine against a published extension table, raised-bed inside-dimension guidance |
| how-to-calculate-landscaping-materials | Pillar: one workflow for every material | gravel-calculator | all material guides | all cost guides | Deliberate pillar — differentiated by process, not material | Five-step workflow, material to role/depth/unit map |
| how-to-plan-a-gravel-driveway | Driveway layer planning | driveway-gravel-calculator | /materials/gravel | /costs/gravel-driveway-cost | Medium vs gravel guide — separated by the layer model | Layer table built from engine assumptions, drainage list, per-layer rounding explanation |
| how-to-plan-a-fence | Fence layout sequence | fence-calculator, fence-post-calculator | /materials/fence-materials | /costs/fence-cost | Medium vs the take-off — separated by sequence vs components | Planning order, corner/end/gate post explanation, stepping versus racking |
| how-to-calculate-fence-materials | Complete component take-off | fence-calculator | /materials/fence-materials | /costs/fence-cost | High vs plan-a-fence — resolved: this page is purely a take-off | Two full engine take-offs (picket and panel) with a per-component waste table |
| how-to-plan-a-paver-patio | Patio build-up planning | paver-patio-calculator | /materials/paver-base | /costs/paver-patio-cost | Medium vs the paver materials page | Joint-width module table, edge restraint as a quantity, L-shaped two-area example |
| how-to-calculate-paver-materials | Paver take-off | paver-calculator, paver-patio-calculator | /materials/paver-base, /materials/sand | /costs/paver-patio-cost | High vs patio plan — resolved: this is the arithmetic page | Build-order steps, three hand cross-checks, shopping-list interpretation |
| how-to-calculate-concrete-for-a-slab | Concrete volume and ordering | concrete-calculator | /materials/concrete | /costs/landscaping-project-cost | Low | Bag-yield table from engine data, slab and post-hole examples, running-short discussion |
| how-to-estimate-deck-materials | Deck material quantities | deck-material-calculator | /materials/decking-materials | /costs/deck-cost | Low | Board-count construction table, rim joist reminder, deck-specific waste behaviour |
| outdoor-project-cost-planning | Commercial pillar: budgeting method | fence-cost-calculator | — | /costs/landscaping-project-cost | Low — owns budgeting method; cost guides own per-material variables | Cost-category table, price-to-total mechanics, scale-versus-mix table |


### Material guides

| URL | Primary intent | Calculator | Project guide | Cost page | Cannibalisation risk | Unique value |
|-----|----------------|-----------|---------------|-----------|----------------------|--------------|
| gravel | What gravel is and how it is planned | gravel-calculator | how-much-gravel-do-i-need | gravel-cost | Low | Open-graded versus dense-graded table, use/gradation/depth matrix |
| pea-gravel | Rounded stone behaviour | pea-gravel-calculator | how-much-gravel-do-i-need | gravel-cost | Medium vs gravel — separated by shape behaviour | Helps-versus-hurts table, free-draining is not well-drained |
| mulch | Mulch categories | mulch-calculator | how-to-calculate-mulch | mulch-cost | Low | Category characteristics table, colour-versus-structure note, topping-up guidance |
| topsoil | Topsoil vs garden soil vs compost | topsoil-calculator, soil-calculator | how-much-topsoil-do-i-need | landscaping-project-cost | Medium vs the project page — separated by terminology | Product-role table, supplier question checklist, screened is not sterile |
| sand | Sand product uses | sand-calculator | how-to-calculate-paver-materials | paver-patio-cost | Low | Application-to-product table, "describe the job, not the material" |
| paver-base | Compactable base layer | paver-base-calculator | how-to-plan-a-paver-patio | paver-patio-cost | Low | Compaction-allowance explanation, order-larger-than-design-depth |
| concrete | Ready-mix versus bagged | concrete-calculator | how-to-calculate-concrete-for-a-slab | landscaping-project-cost | Low | Two-routes comparison table, volume shapes, allowance discussion |
| fence-materials | Material comparison without a winner | fence-calculator | how-to-plan-a-fence | fence-cost | Low | Five-material planning table, component-by-material table, decision framework |
| decking-materials | Decking comparison without a winner | deck-material-calculator | how-to-estimate-deck-materials | deck-cost | Low | Board-width to coverage table, deck waste behaviour, cost-factor table with no prices |

### Cost guides

| URL | Primary intent | Calculator | Material page | Project guide | Unique value |
|-----|----------------|-----------|---------------|---------------|--------------|
| gravel-cost | What moves a gravel price | gravel-calculator | /materials/gravel | how-much-gravel-do-i-need | Variables ranked by effect, per-ton worked pricing, quote-normalising steps |
| mulch-cost | Bagged versus bulk economics | mulch-calculator | /materials/mulch | how-to-calculate-mulch | Cost-per-cubic-foot method, crossover explanation, comparison checklist |
| fence-cost | Fence estimate structure | fence-cost-calculator | /materials/fence-materials | how-to-calculate-fence-materials | Engine-priced line-by-line example, scope-difference checklist |
| paver-patio-cost | Patio price components | paver-patio-calculator | /materials/paver-base | how-to-plan-a-paver-patio | Cost lines in three different units, why-quotes-differ list |
| gravel-driveway-cost | Driveway price components | driveway-gravel-calculator | /materials/gravel | how-to-plan-a-gravel-driveway | Per-layer priced example, spoil and drainage omission discussion |
| deck-cost | Deck price components | deck-material-calculator | /materials/decking-materials | how-to-estimate-deck-materials | Engine-priced material lines, explicit "what is not in this total" |
| landscaping-project-cost | Cost pillar | topsoil-calculator | /materials/topsoil | outdoor-project-cost-planning | Full category table, complexity as a cost category, scale table |


---

## 4. Content duplication check

Measured by `qa/content-check.ts`, which loads every page, extracts all
user-visible strings and compares normalised paragraphs of 18 words or more
across the whole library.

| Check | Result |
|-------|--------|
| Duplicate paragraphs across pages (18+ words) | **0** |
| Duplicate meta titles | **0** |
| Duplicate meta descriptions | **0** |
| Duplicate paths | **0** |
| Placeholder text (lorem, TODO, coming soon, TBD) | **0** |
| Empty sections | **0** |
| Pages with no worked example | **0** |
| Pages with fewer than 4 related links | **0** |
| Section id collisions (reserved ids and example anchors included) | **0** |
| Total words across the library | 49,167 |

An earlier pass flagged one repeated sentence: the default footnote on the shared
coverage table appeared on six pages. It was resolved by making the note a
parameter and writing a page-specific note for each of the six, rather than by
loosening the check.

---

## 5. Technical SEO checks

Crawl: `qa/seo.cjs` against the production build (51 routes = 6 static + 16
calculators + 28 content + `/projects/print`), plus `qa/content-a11y.cjs` for the
28 new pages at desktop and 380 px mobile widths.

| Check | Result |
|-------|--------|
| New URLs returning 200 | **28/28** |
| Duplicate titles across the whole site | **0** |
| Duplicate meta descriptions | **0** |
| Missing meta description | **0** |
| Exactly one canonical per page | **51/51** |
| Multiple canonicals | **0** |
| Missing Open Graph title or description | **0** |
| Exactly one `<h1>` per page | **51/51** |
| Heading level skips | **0** |
| Breadcrumb navigation present | All pages except `/` and `/projects/print` |
| Exactly one `aria-current="page"` breadcrumb item | **28/28** |
| BreadcrumbList JSON-LD present and parseable | **28/28** |
| Exactly one `<main>` landmark | **28/28** |
| Tables with a caption | **100%** |
| Diagrams with `role="img"` and an accessible name | **100%** |
| Links without an accessible name | **0** |
| Table-of-contents anchors resolving to real ids | **100%** |
| Duplicate element ids (including SVG marker ids) | **0** |
| Console errors or hydration errors | **0** |
| Horizontal overflow at 380 px width | **0** |
| Sitemap | 200, `application/xml`, **50 URLs**, every URL resolves 200 |
| `/projects/print` | `noindex, follow`, absent from the sitemap |
| Unknown URL | 404 with the styled not-found page and `noindex` |
| Broken or non-200 internal links | **0** |
| Broken or non-200 external links (source references) | **0** |

### Robustness notes

* Every one of the 28 pages is the result of a real navigation, not a synthetic
  request: the crawl loads each page in Chromium with `networkidle0`.
* Structured data is limited to `BreadcrumbList`. No rating, review, price,
  organisation or author markup was added, because the pages do not carry that
  data.


---

## 6. Internal link coverage

Measured from the crawl: for each new page, how many links point to it from other
crawled pages (link instances, not unique sources), and how many unique internal
and external destinations each page links out to (including header, footer and
calculator links).

| New page | Inbound links | Unique internal out | External sources |
|----------|--------------:|--------------------:|-----------------:|
| `/projects/how-much-gravel-do-i-need` | 63 | 17 | 0 |
| `/projects/how-to-calculate-mulch` | 8 | 17 | 1 |
| `/projects/how-much-topsoil-do-i-need` | 7 | 16 | 1 |
| `/projects/how-to-calculate-landscaping-materials` | 64 | 30 | 0 |
| `/projects/how-to-plan-a-gravel-driveway` | 8 | 16 | 0 |
| `/projects/how-to-plan-a-fence` | 10 | 17 | 0 |
| `/projects/how-to-calculate-fence-materials` | 12 | 17 | 0 |
| `/projects/how-to-plan-a-paver-patio` | 11 | 17 | 0 |
| `/projects/how-to-calculate-paver-materials` | 10 | 18 | 0 |
| `/projects/how-to-calculate-concrete-for-a-slab` | 4 | 16 | 1 |
| `/projects/how-to-estimate-deck-materials` | 6 | 16 | 0 |
| `/projects/outdoor-project-cost-planning` | 62 | 23 | 0 |
| `/materials/gravel` | 15 | 19 | 0 |
| `/materials/pea-gravel` | 4 | 16 | 0 |
| `/materials/mulch` | 8 | 17 | 1 |
| `/materials/topsoil` | 8 | 17 | 1 |
| `/materials/sand` | 9 | 18 | 0 |
| `/materials/paver-base` | 14 | 20 | 0 |
| `/materials/concrete` | 4 | 16 | 1 |
| `/materials/fence-materials` | 11 | 17 | 0 |
| `/materials/decking-materials` | 6 | 17 | 0 |
| `/costs/gravel-cost` | 16 | 16 | 0 |
| `/costs/mulch-cost` | 8 | 17 | 0 |
| `/costs/fence-cost` | 12 | 17 | 0 |
| `/costs/paver-patio-cost` | 15 | 18 | 0 |
| `/costs/gravel-driveway-cost` | 8 | 17 | 0 |
| `/costs/deck-cost` | 8 | 16 | 0 |
| `/costs/landscaping-project-cost` | 70 | 20 | 0 |

**No orphans.** The minimum is 4 inbound links (concrete and pea gravel, both of
which are also linked from the landscaping pillar and their calculator pages).
The four pages with the highest inbound counts are the three pillars plus the
gravel guide, which the footer and the homepage link to deliberately.

Inbound links come from four deliberate sources:

1. **Calculator pages** — every one of the 16 calculators renders a "Planning
   guides" card linking its project guide, material reference and cost guide
   (plus a second project guide where the calculator supports one).
2. **Content pages** — each page carries 4–6 contextual "related" links plus a
   "Keep going" link list pointing at its calculator, related material, related
   cost guide and 2–4 sibling project pages.
3. **Homepage** — a "Plan the job, not just the material" section with 9 guide
   entries.
4. **Footer** — a "Guides" column with four entry points (materials workflow,
   project budgeting, cost breakdown, gravel quantities). Deliberately short:
   this is a navigation aid, not an all-pages index.

---

## 7. E-E-A-T and content-quality signals

The site is a planning aid, not an authority publication, so the signals were
kept honest rather than manufactured.

| Signal | How it is present |
|--------|-------------------|
| First-hand task knowledge | Each guide is written around doing the task: measuring at subgrade, calling the supplier, checking the delivery slip, comparing quotes line by line. Steps describe the order of operations and what to check before the next step. |
| Explanation of failure modes | Mistake-to-consequence tables and "why quotes differ" lists explain what goes wrong and what it costs, rather than restating common knowledge. |
| Transparent method | Every worked example states its inputs and shows which engine function produced the output. The methodology page is linked from every page footer area. |
| Explicit limitations | Every page ends with a limitations block stating that the figures are planning aids, that local soil, code and product conditions override them, and that structural, drainage and permit decisions need a local professional. |
| Sources where claims are checkable | Only two kinds of external claims appear: published extension depth guidance for mulch and topsoil, and material property definitions. Both link to the originating extension page, and the pages state where the site's value differs (for example compaction allowance). |
| No manufactured authority | No author bylines, no fake review counts, no star ratings, no "medically reviewed"-style claims, no organisation schema. |
| No invented prices | Cost guides never state a price per unit as fact. They either price a worked example using the site's own default prices and label them as defaults, or they describe variables and normalise quotes against the quantity the calculator produces. |

### Voice and consistency

* Terminology is reused from the calculators: "subgrade", "compaction
  allowance", "waste factor", "take-off", "inside dimensions".
* Every unit appears in the same format used by the calculators (`ft`, `in`,
  `yd³`, `tons`, `bags`).
* No page promises a result the calculator cannot produce, and no page describes
  a feature the site does not have.
* Em-dash and sentence-case style is consistent with the pre-existing pages.

---

## 8. UX and UI checks (new pages)

* **Reading layout** — sticky table-of-contents aside on desktop, collapsing to a
  plain list above the article on mobile; single `h1`; body copy at the same
  measure as existing pages.
* **Mobile at 380 px** — no horizontal overflow on any of the 28 pages. This
  required two fixes: `minmax(0, 1fr)` on `.content-page-grid` and `min-width: 0`
  on `.content-body`, because a wide table was forcing the whole grid wider than
  the viewport.
* **Tables** — every table has a `<caption>`, a `<thead>` and scoped headers. On
  narrow screens the table scrolls inside its own container instead of widening
  the page.
* **Diagrams** — inline SVG with `role="img"` and an accessible name. Duplicate
  element ids were removed by replacing shared `<marker>` arrowheads with
  polygon-drawn arrowheads, because two diagrams on one page were registering the
  same `id` twice.
* **Interactivity** — content pages add no client components beyond the existing
  disclosure behaviour; nothing blocks first paint and no page depends on
  JavaScript to show its answer.
* **Anchor behaviour** — table-of-contents links jump to real ids and update
  focus correctly. Reserved ids (`main`, `content`, `top`) and example anchors
  were renamed to avoid collisions with site chrome.

---

## 9. Regression checks on existing functionality

| Area | Check | Result |
|------|-------|--------|
| Calculation engine | No file under `src/lib/calculations/` was modified | **Unchanged** |
| Calculation engine | Existing engine test suite | **Passing** |
| Calculators | All 16 calculator pages build and render, inputs recompute, results unchanged | **Pass** |
| Calculators | Added "Planning guides" card renders only when the page has related guides; no layout shift at any tested width | **Pass** |
| Project Mode | `/projects` and `/projects/print` unaffected; print stylesheet still applies | **Pass** |
| Static pages | Homepage, `/calculators`, `/how-it-works`, `/methodology`, `/about` render and pass SEO checks | **Pass** |
| Homepage | New guide-card section added below existing sections; no change to existing hero, calculator grid or FAQ content | **Pass** |
| Footer | New "Guides" column added; existing columns and widths unchanged at desktop and mobile | **Pass** |
| TypeScript | `npm run typecheck` (`tsc --noEmit`) clean | **Pass** |
| Engine tests | `npm test` — 49 tests, 0 failures | **Pass** |
| Content audit | `npm run test:content` — exit 0, every finding list empty | **Pass** |
| Lint | The project has no ESLint configuration, so no lint step was run or added | **N/A** |
| Production build | `next build` succeeds, all routes generated as static | **Pass** |
| Sitemap | Previously indexable URLs unchanged; only additions | **Pass** |
| CSS | `content.css` is scoped to content classes; `min-width: 0` change is scoped to `.content-body` | **Pass** |
| Diagrams | Shared `Diagrams.tsx` id change does not alter geometry, only how arrowheads are drawn | **Pass** |

No engine value, default, unit conversion, rounding rule or validation message
was altered to make a content page work. Where a page needed a number the engine
did not expose, the page shows the number the engine does expose and explains the
difference instead of changing the engine.

