# MeasureToBuild â€” Final Release Report

**Brand:** MeasureToBuild Â· **Tagline:** Measure. Calculate. Plan.
**Release gate:** `npm run qa:prelaunch` â†’ **13 PASS / 1 WARN / 0 FAIL / 0 NOT RUN** (520.5 s)
**Gate verdict:** `READY WITH NON-BLOCKING WARNINGS` (`qa/artifacts/prelaunch-summary.json`)
**Status key:** PASS Â· FIXED Â· NON-BLOCKING Â· BLOCKED

Scope discipline: no calculation formulas or assumptions were changed, no new SEO/content/calculator
pages were created, no existing slug was renamed, no test was weakened, and no price, statistic,
author, credential or contact detail was invented.

---

## 1. Brand â€” PASS (with FIXED items)

| Item | Result |
|---|---|
| Site name | `MeasureToBuild` (`src/lib/seo.ts` â†’ `SITE_NAME`) |
| Tagline | `Measure. Calculate. Plan.` (`SITE_TAGLINE`) |
| Header | Mark + `MeasureToBuild` + tagline; nav order **Calculators â†’ Projects â†’ Guides â†’ How It Works â†’ Methodology â†’ About â†’ Project** (browser-verified) |
| Footer | `MeasureToBuild` + tagline; groups **Calculators / Guides / Resources / Legal**, incl. About, How It Works, Methodology, Contact (`/about#contact`), Privacy, Terms (browser-verified) |
| Homepage | H1 `Measure. Calculate. Plan.` (rendered uppercase via CSS `text-transform`; DOM text stays sentence case for assistive tech â€” browser-verified), supporting copy and both CTAs per spec (`Start with a calculator` â†’ `/calculators`, `Browse project guides` â†’ `/guides`) |
| Page branding | About, How It Works, Methodology, Project Mode, printable plan and homepage eyebrow updated; visual design language (deep-green palette, existing CSS) unchanged |
| Metadata | Title template `%s \| MeasureToBuild`, `applicationName`, OG defaults incl. `siteName` (`src/app/layout.tsx`) |
| Logo system | `public/brand/logo.svg` (horizontal lockup), `public/brand/logo-mark.svg` (tile mark), `public/brand/logo-mono.svg` (single-colour mark), `public/brand/favicon.svg` â€” one coherent mark: abstract geometric **M** + ruler baseline with graduation ticks + subtle construction grid on the existing `#23623d` tile. No clipart, emoji, gradients or stock art. |
| Favicon | `src/app/icon.svg` replaced with the new mark; `src/app/favicon.ico` regenerated from the same geometry (`qa/make-favicon.cjs`, supersampled, **0 asymmetric pixels**, ASCII-render inspected). `/favicon.ico` **200**, `/icon.svg` **200**, `<link rel="icon">` present on all crawled routes (browser-verified). |

FIXED: generic "Outdoor Project Calculator" header/footer/eyebrow/description strings replaced with
the new brand; the favicon now matches the brand mark exactly.

Known limitation (NON-BLOCKING): `public/brand/logo.svg` renders its wordmark with an SVG `<text>`
element using a system font stack (Inter â†’ Segoe UI â†’ system-ui); it is not converted to outlines.

## 2. Build â€” PASS

- `npm run typecheck` â€” PASS (standalone run and gate run).
- `npm run build` â€” PASS: Next.js 16.1.1 (Turbopack), 60/60 static pages; gate build
  `BUILD_ID 7GHGB6dTU9yyAEYP3r1xZ` served for the QA run.
- `npm run qa:prelaunch` performs its own clean rebuild + fresh production server; both PASS.
- Framework versions untouched: `next@16.1.1`, `react@19.2.0`, `react-dom@19.2.0`.

## 3. Tests â€” PASS

- `npm test` â†’ **142 tests / 16 suites / 142 pass / 0 fail** (gate-confirmed).
- `npm run test:content` â†’ PASS: **28 content pages, 49,182 words**, 0 duplicate titles/descriptions,
  0 near-duplicate blocks, no placeholder text.
- Named Â§18 examples are asserted by name and all pass:
  - Gravel 20 Ã— 30 ft Ã— 3 in â€” `accuracy-bulk.test.ts` "gravel: 20 x 30 ft at 3 in with 10% waste"
  - Fence 100 ft Ã— 6 ft + one 4 ft gate â€” `accuracy-project.test.ts` "normal case: 100 ft picket fence with one 4 ft gate"
  - Paver patio 12 Ã— 20 ft â€” `paver.test.ts` "12 x 20 paver patio calculates pavers, base, sand and edging"
  - Concrete 10 Ã— 12 ft Ã— 4 in â€” `accuracy-project.test.ts` "normal case: 10 x 12 ft slab at 4 in with 10% waste"
  - Deck 12 Ã— 20 ft â€” `accuracy-project.test.ts` "normal case: 12 x 20 ft deck with 5.5 in boards and 16 in joist spacing"

No formula, assumption or rounding behaviour was modified; results match the engine/test expectations.

## 4. QA — PASS

`npm run qa:prelaunch` (gate, real Chrome/Edge + axe-core + Lighthouse):

| Step | Status |
|---|---|
| typecheck / unit tests / content tests | PASS |
| production build / production server | PASS |
| seo (54 crawled routes) | PASS |
| route and link audit (0 broken internal links) | PASS |
| calculator contract audit (16/16 calculators vs engine) | PASS |
| project mode and printable plan (end-to-end) | PASS |
| accessibility / content accessibility | PASS |
| mobile layout | PASS |
| performance (INFO only) | PASS |
| production environment | **WARN** (see §5) |

Additional release checks written for this phase (all green, `qa/tmp/rel-browser.cjs`):
33/33 checks — hero/CTA/nav/footer assertions, print empty state, alias redirects, mobile header,
no console/page/hydration errors on home, print and Project Mode routes.
HTTP smoke of every §17 route: 200 with correct title/H1/canonical.

## 5. Production URL configuration — BLOCKED

- `NEXT_PUBLIC_SITE_URL` is **not set** in this environment (checked process + shell env; no `.env*` files exist).
- Per the release rules, **no domain was invented** and production-origin verification cannot be completed.
- Mechanism verified: the gate builds with `NEXT_PUBLIC_SITE_URL=http://localhost:3100`, and the emitted
  **canonicals, Open Graph URLs, sitemap `<loc>` and robots.txt sitemap pointer all switched to that origin**
  (they show `localhost:3100`, not the code fallback `localhost:3000`). The variable therefore drives all four
  outputs; setting it to the real production HTTPS origin before `npm run build` is the single required action.
- The single gate WARN is exactly this placeholder origin. The remaining WARN lines (contact email, optional
  manifest) are the same class of unset-configuration notices.
- `NEXT_PUBLIC_CONTACT_EMAIL` also unset ? `/about`, `/privacy`, `/terms` correctly render the neutral
  fallback copy; no email address was fabricated. PASS (fallback behaviour verified in page source).

**To unblock:** set `NEXT_PUBLIC_SITE_URL=https://<real-domain>` (and optionally `NEXT_PUBLIC_CONTACT_EMAIL`),
re-run `npm run build`, then re-run `npm run qa:prelaunch` and confirm the origin checks on the generated output.

## 6. SEO — PASS

- 54/54 crawled routes: HTTP 200, unique `<title>`, unique meta description, exactly one canonical,
  complete Open Graph metadata, exactly one H1, `lang="en"`, favicon link present, **0 console errors,
  0 page errors, 0 hydration errors**.
- **0 duplicate titles, 0 duplicate descriptions, 0 duplicate canonicals** across all 54 routes.
- Homepage title exactly `MeasureToBuild | Outdoor Project Calculators & Planning Tools`; homepage
  description exactly per spec. All other pages keep their unique titles/descriptions/search intent —
  only the brand suffix changed via the single title template (no mass metadata replacement).
- **0 accidental noindex** on indexable routes; `/projects/print` is `noindex, follow`.
- FIXED: `/calculators/gravel`, `/calculators/fence`, `/calculators/paver`, `/calculators/concrete`
  (the §17/§20 shorthand forms) returned 404 because the canonical slugs are `...-calculator`. Added
  **permanent redirects** for exactly those four paths in `next.config.ts`; canonical/indexable slugs are
  unchanged, no new pages were created, and all four now resolve 200 -> canonical URL (browser-verified).
- 404 behaviour verified (`/this-page-does-not-exist` -> 404 with H1).

## 7. Sitemap — PASS (host depends on §5)

- `/sitemap.xml` -> 200, XML, **53 URLs** (10 static + 16 calculators + 28 content pages).
- `/projects/print` **excluded**.
- Every listed URL returns 200 (gate `sitemapStatus` check).
- All six non-calculator §20 priority URLs are present; the four calculator priority URLs are present in
  their canonical `...-calculator` form (shorthand forms redirect there).
- URL host is the placeholder origin until `NEXT_PUBLIC_SITE_URL` is set (§5).

## 8. Robots — PASS (host depends on §5)

- `/robots.txt` -> 200, `User-Agent: *` + `Allow: /` (crawling allowed).
- Advertises `Sitemap: <site-url>/sitemap.xml` using the same origin as §5.
- Print page excluded from the sitemap and `noindex` in meta (belt and braces).

## 9. Project Mode — PASS

Gate step *project mode and printable plan* (real browser, end to end):
create project -> rename -> add areas -> add Gravel, Fence and Paver calculations -> materials + quantities
render -> shopping list populated -> **localStorage persistence verified** -> **refresh keeps all three
calculations and the project name** -> printable plan opens with the actual data -> clear project -> empty
state appears. No architecture changes were made; only release verification was run.

## 10. Print — PASS

- `/projects/print` -> 200, `robots: noindex, follow`, excluded from sitemap (verified in crawl output).
- With a saved project: project name, dates, dimensions, calculations, materials, costs, shopping list,
  assumptions and the methodology disclaimer all render (gate project step, real browser) -> PASS.
- With no project: empty state shows **"No project is ready to print yet."** with **"Open Project Mode"**
  and **no giant empty report** (`.print-sheet` absent) — browser-verified.
- Save-PDF works through the browser print dialog (`window.print()`); no PDF library is claimed.

## 11. Accessibility — PASS

- axe-core audit: **10 app pages (home, calculator index, gravel, fence, paver, concrete, deck,
  paver-base, projects, print) -> 0 violations**; **28 content pages -> 0 violations** (gate steps
  *accessibility* + *content accessibility*).
- New brand markup keeps existing patterns: real links, `aria-label` nav, decorative SVGs `aria-hidden`,
  hero H1 in sentence case in the DOM (uppercase is presentational only).
- Breadcrumbs, heading order and 404 H1 verified by the gate.

## 12. Mobile — PASS

- Gate *mobile layout* step PASS (multi-viewport crawl, 0 overflow findings).
- Additional browser checks at 375 x 780: nav collapses (existing responsive behaviour retained),
  brand visible, **no horizontal overflow**, mobile hero 834 px (stacked card, not a full-screen hero);
  desktop 1440 x 900 hero 419 px.

## 13. Dependency audit — NON-BLOCKING

- `puppeteer-core`, `lighthouse` and `axe-core` (required by the existing QA scripts) were present in the
  environment but missing from `package.json`. Added as devDependencies **pinned to the exact installed
  versions** (`puppeteer-core@25.12.0`, `lighthouse@13.5.0`, `axe-core@4.13.0`) via
  `npm install --package-lock-only`, so `node_modules` and runtime behaviour are untouched.
  Runtime dependencies (`next`, `react`, `react-dom`) unchanged.
- `npm audit` -> **3 vulnerabilities (1 critical, 2 high)**, all in the `next` -> `postcss`/`sharp` tree
  (Next.js advisories; installed `next@16.1.1` falls inside the affected range 9.3.4-canary - 16.3.2).
  The only offered fix is `next@16.3.7`, which requires `npm audit fix --force` and a framework upgrade.
  **`npm audit fix --force` was NOT run** (forbidden this release). Treat as a separate maintenance task
  with full re-QA. The site serves static/SSG output with no image-optimizer endpoint in use, which limits
  practical exposure, but the advisories are recorded here rather than dismissed.

## 14. Remaining warnings — NON-BLOCKING

1. `NEXT_PUBLIC_SITE_URL` unset -> placeholder origin in canonicals/OG/sitemap/robots (BLOCKED item, §5).
2. `NEXT_PUBLIC_CONTACT_EMAIL` unset -> neutral fallback contact copy on `/about`, `/privacy`, `/terms`.
3. No web app manifest (`/manifest.*`) — optional, intentionally not added this release.
4. `qa:prelaunch` INFO line `0 file(s) in public/` reads `src/app/public` (a QA-script path quirk);
   the real `public/brand/` contains all four logo assets, served and verified at `/brand/*.svg`.
5. `public/brand/logo.svg` wordmark uses SVG `<text>` with a system font stack (not outlined paths).
6. `npm audit` findings — see §13; no fix applied without a framework upgrade.
7. No domain, email, phone, address, price, statistic, author or credential was invented anywhere.

## 15. Search Console checklist — preparation PASS (manual execution after deployment)

Deployment prerequisites (BLOCKED until a domain exists, §5):
- [ ] Set `NEXT_PUBLIC_SITE_URL=https://<production-domain>` and rebuild.
- [ ] Re-run `npm run qa:prelaunch` and confirm 0 warnings on origin checks.
- [ ] Deploy; confirm HTTPS + apex/www handling, then re-check `/sitemap.xml` and `/robots.txt` live.

Google Search Console (manual — no automation attempted; no integration exists):
- [ ] Verify domain/property (DNS or HTML-file/meta method).
- [ ] Submit sitemap: `https://<production-domain>/sitemap.xml` (53 URLs).
- [ ] Inspect priority URLs and request indexing for the first wave:

| Priority URL (submit canonical form) | Pre-flight status |
|---|---|
| `/` | 200, unique title/description, verified |
| `/calculators` | 200, verified |
| `/calculators/gravel-calculator` (shorthand `/calculators/gravel` -> 308) | 200, verified |
| `/calculators/fence-calculator` (shorthand `/calculators/fence` -> 308) | 200, verified |
| `/calculators/paver-calculator` (shorthand `/calculators/paver` -> 308) | 200, verified |
| `/calculators/concrete-calculator` (shorthand `/calculators/concrete` -> 308) | 200, verified |
| `/projects/how-much-gravel-do-i-need` | 200, in sitemap, verified |
| `/projects/how-to-plan-a-fence` | 200, in sitemap, verified |
| `/projects/how-to-plan-a-paver-patio` | 200, in sitemap, verified |
| `/projects/how-to-calculate-landscaping-materials` | 200, in sitemap, verified |
| `/costs/landscaping-project-cost` | 200, in sitemap, verified |
| `/methodology` | 200, in sitemap, verified |

- [ ] After indexing: observe impressions, queries and page indexation.
- [ ] First expansion decision must come from Search Console evidence (post-launch phase).

---

**Release verdict:** build, tests and the full pre-launch gate pass with zero failures.
The only blocker to *production-origin verification* is the unset `NEXT_PUBLIC_SITE_URL` (§5) —
deliberately not substituted with an invented domain. Next phase:
**PRODUCTION -> SEARCH CONSOLE -> SUBMIT SITEMAP -> INDEXING -> OBSERVE -> DATA-DRIVEN EXPANSION.**
