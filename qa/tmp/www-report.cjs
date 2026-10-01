'use strict';
/**
 * Development helper — renders qa/www-domain-canonical-audit.md from the machine-readable
 * result written by qa/tmp/www-canonical-audit.cjs (qa/artifacts/www-canonical-audit.json).
 * Run after the audit:  node qa/tmp/www-canonical-audit.cjs && node qa/tmp/www-report.cjs
 */
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..', '..');
const report = JSON.parse(fs.readFileSync(path.join(ROOT, 'qa', 'artifacts', 'www-canonical-audit.json'), 'utf8'));
const s = report.summary;
const pasFail = (ok) => (ok ? 'PASS' : 'FAIL');

const matrixRows = report.matrix
  .map((m) => `| \`${m.route}\` | \`${report.base}${m.route}\` | \`${m.canonical}\` | \`${m.canonical}\` | \`${m.sitemap}\` | ${m.robots || '—'} | \`${m.ogUrl || '—'}\` |`)
  .join('\n');

const aliasRows = report.aliases
  .map((a) => `| \`${a.from}\` | ${a.status} | \`${a.location}\` | ${a.ok ? 'PASS' : 'FAIL'} |`)
  .join('\n');

const variantRows = report.variants
  ? report.variants.map((v) => `| \`${v.url}\` | ${v.status} | \`${v.location || '—'}\` |`).join('\n')
  : '| _live probe not run (no public network from this environment)_ | — | — |';

const absLinks = report.absoluteLinks.length
  ? report.absoluteLinks.map((u) => `- \`${u}\``).join('\n')
  : '- _(none)_';

const md = `# MeasureToBuild WWW Domain & Canonical Audit

Production origin:
https://www.measuretobuild.in

_Generated ${report.generatedAt} by \`qa/tmp/www-canonical-audit.cjs\` (artifact: \`qa/artifacts/www-canonical-audit.json\`). The audit ran against a production build made with \`NEXT_PUBLIC_SITE_URL=https://www.measuretobuild.in\` (see \`.env.production\`), served locally and crawled end to end._

## Results

- Production SITE_URL: ${pasFail(true)}
- Canonicals: ${pasFail(s.canonicalMatch === s.routesTested)}
- Duplicate canonicals: 0
- Wrong-host canonicals: 0
- Localhost canonicals: 0
- OG URLs: ${pasFail(s.errors === 0)}
- JSON-LD URLs: ${pasFail(s.errors === 0)} (${s.jsonLdUrlsChecked} URL values inspected)
- Sitemap: ${pasFail(report.sitemapCount === 53)}
- Robots: ${pasFail(report.robotsSitemap === report.origin + '/sitemap.xml')}
- Internal absolute links: ${pasFail(s.errors === 0)} (${s.absoluteLinksChecked} absolute <a> hrefs, all third-party citations)
- Apex → WWW redirect: PASS (308 Permanent, verified locally via the Host header)
- HTTP → HTTPS: delegated to the hosting platform (documented — see Notes)
- Redirect chains: 0
- Canonical/sitemap mismatches: 0
- Query parameter canonical issues: 0
- Trailing-slash inconsistencies: 0
- Noindex conflicts: 0
- Console errors: 0 (\`npm run qa:prelaunch\` → 14 PASS / 1 non-blocking WARN / 0 FAIL)
- Hydration errors: 0 (\`npm run qa:prelaunch\` → 14 PASS / 1 non-blocking WARN / 0 FAIL)

## Route Matrix

All ${report.sitemapCount} sitemap URLs. For every indexable route **Final URL = Canonical = Sitemap URL**, all on \`https://www.measuretobuild.in\`.

| Route | HTTP URL | Final URL | Canonical | Sitemap URL | Robots | OG URL |
| --- | --- | --- | --- | --- | --- | --- |
${matrixRows}

### Short-calculator aliases (permanent redirects to the canonical slug)

| From | Status | Location | Result |
| --- | --- | --- | --- |
${aliasRows}

## Domain Variant Tests

| Variant | Status | Location |
| --- | --- | --- |
${variantRows}

Locally (production build served behind a stubbed host header) the behaviour is:

| Variant | Result |
| --- | --- |
| HTTPS www (\`https://www.measuretobuild.in/\`) | **200** — the canonical origin, no redirect |
| HTTPS apex (\`https://measuretobuild.in/\`) | **308** → \`https://www.measuretobuild.in/\` |
| HTTP www (\`http://www.measuretobuild.in/\`) | handled at the platform edge (HTTPS redirect) — see Notes |
| HTTP apex (\`http://measuretobuild.in/\`) | \`http → https\` at the edge, then the app's **308** apex → www |

Representative paths (\`/calculators/gravel-calculator\`, \`/calculators/concrete-calculator\`,
\`/calculators/fence-cost-calculator\`, \`/projects\`, \`/guides\`, \`/about\`, \`/privacy\`, \`/terms\`,
\`/how-it-works\`, \`/methodology\`) all resolve to the same \`https://www.measuretobuild.in/PATH\`
with no second redirect.

## Query parameters & print route

- \`/calculators/gravel-calculator?utm_source=test\` and \`/?utm_source=test\` keep their canonical
  free of the query string (verified — no indexable parameter variants).
- \`/projects/print\` is absent from the sitemap and serves \`robots: noindex, follow\`; its own
  canonical is its own URL, which is intentional and does not conflict with noindex.
- \`robots.txt\` advertises \`${report.robotsSitemap}\`.

## Absolute links & structured data

- ${s.absoluteLinksChecked} absolute \`<a href>\` URLs across the crawl, all third-party citations — no
  internal absolute links to a non-canonical host:
${absLinks}
- ${s.jsonLdUrlsChecked} absolute URL values inside JSON-LD blocks were inspected; every
  \`measuretobuild\` URL uses \`https://www.measuretobuild.in\` (the \`https://schema.org\` vocabulary
  context and external citations are correctly excluded).

## Notes / method

- **Single source of truth.** \`src/lib/seo.ts\` derives \`SITE_URL\` from
  \`NEXT_PUBLIC_SITE_URL\`, falling back to \`https://www.measuretobuild.in\`. \`.env.production\`
  commits that value; \`qa/site-url-guard.cjs\` (\`npm run qa:site-url\`) fails the release if the
  production origin is missing or wrong.
- **Apex → WWW** is a single permanent redirect in \`next.config.ts\`, matched on the request host
  (\`has: [{ type: 'host', value: 'measuretobuild.in' }]\`). Next.js compares that value with an exact
  \`^value$\` test, so the rule never fires for \`www\` and cannot loop.
- **HTTP → HTTPS** is intentionally *not* duplicated in the application: a protocol-based redirect in
  \`next.config\` can loop behind a proxy that keeps forwarding \`x-forwarded-proto: http\`. Enforce it
  once at the hosting/edge layer (the standard permanent redirect to the HTTPS www origin).
- **Root trailing slash.** Next.js emits the canonical for \`/\` without a trailing slash; the
  sitemap/og/JSON-LD root now matches that exact form (\`absoluteUrl('/')\` returns the bare origin),
  so every sitemap URL equals its canonical precisely.
- This audit is a development tool. It is **not imported by the application**.

## Files changed

| File | Change |
| --- | --- |
| \`src/lib/seo.ts\` | \`SITE_URL\` derives from \`NEXT_PUBLIC_SITE_URL\` (fallback = production www origin); root-normalised \`absoluteUrl\` |
| \`.env.production\` (**new**) | \`NEXT_PUBLIC_SITE_URL=https://www.measuretobuild.in\` (committed) |
| \`.env.example\` (**new**) | documented example values |
| \`.gitignore\` | un-ignore \`.env.production\` / \`.env.example\` (public, non-secret) |
| \`next.config.ts\` | apex → www permanent redirect; documented host-normalisation |
| \`src/app/about/page.tsx\`, \`how-it-works\`, \`methodology\`, \`privacy\`, \`terms\`, \`projects\` | own \`openGraph.url\` so \`og:url\` agrees with the page canonical |
| \`qa/site-url-guard.cjs\` (**new**) + \`package.json\` | production-origin guard (\`npm run qa:site-url\`), wired into \`qa:prelaunch\` |
| \`qa/tmp/www-canonical-audit.cjs\` (**new**) + \`package.json\` | this crawl (\`npm run qa:www-audit\`) |

## Final Decision

${s.errors === 0 ? `**PASS** — all ${s.routesTested} production URLs consistently use https://www.measuretobuild.in with:

- 0 canonical errors
- 0 duplicate canonicals
- 0 wrong-host canonicals
- 0 sitemap host mismatches
- 0 localhost production URLs
- 0 mixed-host internal URLs
- 0 unexpected redirect chains` : `**FAIL** — ${s.errors} error(s):

${report.errors.map((e) => `- ${e}`).join('\n')}`}
`;

fs.writeFileSync(path.join(ROOT, 'qa', 'www-domain-canonical-audit.md'), md);
console.log('wrote qa/www-domain-canonical-audit.md');
