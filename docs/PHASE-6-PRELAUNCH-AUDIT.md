# Phase 6 — Pre-Launch Audit (documented before any Phase 6 code was written)

Status of this document: **baseline inspection of the repository as inherited at the start of Phase 6.**
Nothing in this file describes work done in Phase 6; it records what already exists so the
hardening work can be scoped, and so files that must not be touched are explicit.

---

## 1. Current architecture

### 1.1 Runtime / stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js **16.1.1** (App Router) | `next.config.ts`: `reactStrictMode`, `poweredByHeader: false`, `compress: true` |
| UI | React **19.2.0** | `jsx: react-jsx` |
| Language | TypeScript **5.8.3** (`strict`) | typecheck: `tsc --noEmit -p tsconfig.json` |
| Tests | Node built-in test runner via **tsx** | `tsx --test "src/**/*.test.ts"` |
| Browser QA | **puppeteer-core** + local Chrome/Edge | `qa/lib.cjs` resolves the executable |
| Perf QA | **lighthouse** (installed) | historical runs in `qa/artifacts/lh-*.json` |
| Contrast/axe | **axe-core** (installed) | used by `qa/contrast-probe.cjs` |
| Backend / DB / auth | **none** | static + client-side only |

### 1.2 Source layout

```
src/
  app/                     # App Router routes (server components by default)
    layout.tsx             # metadataBase, default OG, robots index:true
    sitemap.ts             # static + calculators + content pages (excludes /projects/print)
    robots.ts              # allow all + sitemap pointer
    not-found.tsx          # 404
    page.tsx, calculators/, guides/, how-it-works/, methodology/, about/, privacy/, terms/
    projects/, projects/print (noindex, follow), projects/[slug]
    materials/[slug], costs/[slug], calculators/[slug]
  components/
    calculators/
      registry.ts          # 16 calculator definitions (slug, copy, related links)
      CalculatorForm.tsx   # client form + defaultForm(slug) defaults
      CalculatorClient.tsx # client shell: calculate / reset / errors / results
      engine-bridge.ts     # form state -> engine inputs -> display rows (NO formulas)
      project-mapper.ts    # engine result -> Project Mode entry
      ProjectModeClient.tsx, AddCalculationPanel.tsx, groups.ts, FormParts.tsx
    content/               # content page renderer, tables, diagrams
    layout/                # Header, Footer, Breadcrumbs
    ui/                    # Primitives, icons
  content/                 # 28 content pages: projects(12) + materials(9) + costs(7)
    index.ts, guides.ts, shared.ts, types.ts, route-helper.ts
  data/                    # assumptions.ts (single numeric source), materials.ts, useCases.ts
  lib/
    calculations/          # ENGINE (single source of truth) + 49 unit tests
      geometry, units, bulk, concrete, driveway, fence, fence-post, paver, deck
    units/                 # unit conversions + tests
    validation/            # CalcInputError(field, message) + guards
    project-mode/          # project store model + tests
    project-store/         # localStorage persistence
    seo.ts                 # SITE_NAME / SITE_URL / absoluteUrl
  index.ts                 # public engine barrel
```

### 1.3 The single-source-of-truth rule (as implemented)

* All formulas live in `src/lib/calculations/*` (plus `src/lib/units`).
* `src/components/calculators/engine-bridge.ts` converts form strings → typed engine inputs and
  engine results → display rows. It contains **no** arithmetic of its own beyond formatting.
* `qa/expected.ts` recomputes expected browser values from the engine (UI ↔ engine parity harness).
* Pricing is always user-entered; the engine never invents prices.

### 1.4 Routes

* 16 calculators: gravel, mulch, topsoil, soil, sand, pea-gravel, landscape-rock, paver-base,
  driveway-gravel, concrete, paver, paver-patio, fence, fence-cost, fence-post, deck-material.

---

## 2. Existing scripts (package.json)

| Script | Command | Purpose |
|---|---|---|
| `dev` | `next dev` | development server |
| `build` | `next build` | production build |
| `start` | `next start` | production server (port 3000) |
| `test` | `tsx --test "src/**/*.test.ts"` | 49 calculation-engine / units / project tests |
| `typecheck` | `tsc --noEmit -p tsconfig.json` | typecheck (test files excluded by tsconfig) |
| `test:content` | `tsx qa/content-check.ts` | 28-page content library audit |
| `verify` | typecheck && test && test:content | older combined gate |
| `qa:content` | `node qa/content-a11y.cjs` | content page a11y/layout vs running server |

**Gap:** there is no single pre-launch command. Browser QA scripts exist but are run manually,
one at a time, against an ad-hoc server (and previously against a possibly stale port 3000).

---

## 3. Existing QA coverage (qa/)

| Script | Needs | Writes | Exit code today |
|---|---|---|---|
| `content-check.ts` | – | `artifacts/content.json` | non-zero on failure |
| `seo.cjs` | server + Chrome | `artifacts/seo.json` | **always 0** (prints JSON) |
| `calc.cjs` (+ `calc-part1/2`, `calc-helpers`) | server + Chrome + `expected.json` | `artifacts/calculators.json` | **always 0** |
| `project.cjs` | server + Chrome | `artifacts/project.json` | non-zero on failures |
| `a11y.cjs` | server + Chrome | `artifacts/a11y.json` | **always 0** |
| `content-a11y.cjs` | server + Chrome | `artifacts/content-a11y.json` | **always 0** |
| `responsive.cjs` | server + Chrome | `artifacts/responsive.json` | **always 0** |
| `expected.ts` | – | `artifacts/expected.json` | generator |
| `lighthouse.cjs` | server + Chrome + lighthouse | `artifacts/lh-*.json` | manual |
| `summary.cjs` | artifacts | – | formatter |
| `debug1..5`, `probe`, `screens`, `content-shots`, `overflow-probe`, `contrast-probe` | ad-hoc | various | dev scratch |

Known QA results inherited (from `QA-REPORT.md`, `CONTENT-QA-REPORT.md`, `PHASE-REPORT.md`):
SEO QA 54 pages clean; Project Mode 21/21; accessibility clean; content QA 49,167 words clean.

**Gap:** most browser scripts exit 0 regardless of findings, so a wrapper must read the
artifacts and decide pass/fail itself.

---

## 4. Test coverage today (49 tests)

`bulk.test.ts` (12), `audit.test.ts` (4), `concrete.test.ts` (6), `driveway.test.ts` (6),
`fence.test.ts` (5), `fence-post.test.ts` (3), `paver.test.ts` (5), `deck.test.ts` (4),
`units.test.ts` (3), `project.test.ts` (1) ≈ 49.

Covered: normal worked examples, invalid input → `CalcInputError.field`, pricing honesty,
compaction/waste behaviour, overflow rejection.

**Gap:** no systematic per-calculator accuracy matrix (small / large / decimal / zero /
boundary / very large), and no automated check that *form state → engine function → rendered row*
is wired correctly for all 16 calculators (that is only covered by manual browser runs).

* 28 content pages: `/projects/*` (12), `/materials/*` (9), `/costs/*` (7).
* 10 static: `/`, `/calculators`, `/guides`, `/projects`, `/projects/print`, `/how-it-works`,
  `/methodology`, `/about`, `/privacy`, `/terms`.
* Total indexable: **54** pages (55 routes incl. `/projects/print`).

---

## 5. Known gaps to close in Phase 6

1. No `npm run qa:prelaunch` master gate (Step 2).
2. Browser QA scripts do not fail the process on findings (Step 2 must aggregate).
3. No deterministic calculator accuracy matrix for all 16 calculators (Step 3).
4. No automated UI↔engine wiring test for all 16 calculators at unit level (Step 3).
5. Sitemap/robots/`noindex` behaviour is verified only manually (Steps 2 and 7).
6. Internal-link/orphan-page audit is inside `seo.cjs` output but not gated (Step 6).
7. Production environment values (`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CONTACT_EMAIL`) are
   unset — must be **documented, not invented** (Step 11).
8. Performance review is historical (Lighthouse artifacts) and not part of any gate (Step 10).
9. A stale `next start` on port 3000 exists; QA must use a verified fresh server (Step 12).

---

## 6. Files that must NOT be modified unless a concrete defect is found

Do not touch these for style, "improvement" or score-chasing reasons:

* `src/lib/calculations/*.ts` — formulas are frozen; only fix a proven defect.
* `src/lib/calculations/*.test.ts` — existing 49 tests are the regression baseline.
* `src/lib/units/*`, `src/lib/validation/*` — frozen helpers.
* `src/data/assumptions.ts` — single numeric source; changing it changes every result.
* `src/content/**` (28 pages) — only edit where a concrete content defect is proven.
* `src/app/**` page copy for `/how-it-works`, `/methodology`, `/about`, `/privacy`, `/terms`.
* `src/components/calculators/registry.ts` — slugs and related links are settled.
* `src/components/calculators/engine-bridge.ts` — no formulas may be added here.
* Design tokens in `src/app/globals.css` / `content.css` — no restyling.
* `src/app/projects/print/page.tsx` — must keep `noindex, follow`.

Additive work only: new test files, new QA scripts, `package.json` script entries, `docs/*`.

---

## 7. Environment constraints observed at inspection time

* Platform: Windows (`win32`), Node via npm scripts, VS Code.
* Chrome available at `C:\Program Files\Google\Chrome\Application\chrome.exe` (Edge also present),
  so browser QA **can** run — but the master command must still detect and report absence.
* `puppeteer-core`, `lighthouse`, `axe-core` are installed in `node_modules` but are **not**
  declared in `package.json` dependencies (dev-time only tooling; document, do not "fix" by
  adding runtime deps).
* A `next start` process is already listening on port 3000 (stale, from a previous session).

