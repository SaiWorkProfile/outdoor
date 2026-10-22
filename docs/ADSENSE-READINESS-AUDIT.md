# MeasureToBuild AdSense Readiness Audit

**Audit date:** October 22, 2026  
**Site:** <https://www.measuretobuild.in>  
**Scope:** repository, generated production build, available public endpoints, and the generic AdSense rejection notice supplied by the site operator.

## Executive summary

The supplied AdSense notice does not state a specific policy violation. It mentions content quality as a common reason, but that is not evidence that content quality was the actual rejection reason. The account's **Sites** details and any policy notice remain the authoritative source for the specific blocker.

The site has a verified production origin, a reachable sitemap and robots file, a validly formatted live `ads.txt`, substantial task-focused content and tested calculators. The audit found and corrected several factual or instructional inconsistencies in guide copy. No prohibited-content issue or technical indexing blocker was established by the checks performed. Content originality was not independently checked against the wider web.

The site is **not ready to resubmit based on this audit alone**: the publisher ID in `ads.txt` cannot be matched to the AdSense account, the account's exact verification/review instructions are unavailable, and the account-specific reason for rejection is unknown. No AdSense tag or live ad placement was added. The source changes in this audit are local and have not been deployed.

## Findings

| Priority | Finding | Evidence and action |
|---|---|---|
| Account-specific / unresolved | Rejection reason is unknown | The notice is generic and names no individual policy. Review **AdSense → Sites → measuretobuild.in** for the exact issue and any verification instructions. |
| Account-specific / unresolved | Publisher ownership is unverified | Live `/ads.txt` returns `google.com, pub-3560476614865435, DIRECT, f08c47fec0942fa0`. This is correctly formatted, but repository and public-web access cannot prove that this publisher ID belongs to the applying account or that AdSense marks it authorized. |
| Account-specific / unresolved | AdSense verification code is absent | No AdSense verification or ad-serving tag was found in the application source or live homepage; the Google tag present is Google Analytics 4. The exact AdSense verification method cannot be inferred from the generic notice, so no guessed code or ID was added. |
| Needs action before ad serving | Consent configuration is not present | No advertising CMP or ad-consent flow was found. The site currently does not load AdSense or serve ads. Before enabling Google advertising, configure the consent approach required for the audience, applicable law, and selected AdSense products. This audit does not assert that a particular CMP is required for the current application review. |
| Corrected locally | Advertising disclosure lacked detail | The live site does not currently serve ads. The local privacy page now explicitly says AdSense is not loaded, explains that ads.txt is not an ad script, and states that advertising disclosures and any needed consent flow must be addressed before ads are enabled. |
| Corrected locally | Content accuracy and instruction issues | Seven guide issues were corrected; details are in the content audit below. The calculator engine and published URLs were not changed. |
| Corrected locally | Sitemap `lastmod` was build-time generated | The sitemap used `new Date()` for every URL, which could advertise a new update date without a page-specific content change. The local sitemap now omits `lastModified` rather than asserting an inaccurate date. |
| Corrected locally | Asset audit looked in the wrong folder | `qa/prelaunch.cjs` counted `src/app/public` instead of the root `public` directory. It now checks the actual folder; the focused performance audit reports two entries. |
| Pass | Production origin, contact, and crawl setup | `npm run qa:site-url` passes for `https://www.measuretobuild.in`. The live About/privacy contact details are present. Live homepage canonical, `/robots.txt`, `/sitemap.xml`, and `/ads.txt` were reachable. |

## Content audit

The registered content library contains 28 project, material, and cost guides. The content QA check reports 28 pages, 49,251 words, no load errors, duplicate titles/descriptions/paths/paragraphs, placeholders, empty sections, or missing worked-example results. The separate calculator-copy audit checked all 16 calculators and found unique titles/descriptions, no duplicate FAQ questions or paragraphs, and no errors or warnings. These checks measure consistency and structure, not editorial quality or AdSense approval.

The following corrections were made without adding filler, changing URLs, or removing useful pages:

1. **Mulch tree rings** — clarified that a circle input measures a full circle and that the unmulched centre must be subtracted or the net ring area entered. Corrected the material guide's six-tree-ring example to match.
2. **Joined paver shapes** — clarified that the calculator adds each shape's perimeter and can count shared edges; the guide now tells readers to enter the actual exposed edge length for edging.
3. **Mulch depth** — removed the contradictory claim that coarse mulch “matures quickly”; depth guidance now points readers to product, plant, and site conditions.
4. **Topsoil source comparison** — clarified that a Penn State compost-volume table cross-checks area/depth arithmetic but does not recommend applying topsoil to lawns.
5. **Fence worked example** — made the 100-foot, one-corner example accurately describe two connected runs and their terminal ends.
6. **Fence excavation safety** — added a step to contact the local utility-locating service and mark underground services before digging.
7. **General cost guides** — distinguished the Project Mode budget workflow from the landscaping cost-category and quote-comparison guide.

No page was identified for consolidation or removal based on the evidence reviewed. The calculator directory, guides, methodology, About, privacy and terms pages are linked through site navigation. `/contact` itself returns 404, but the footer directs users to the working `/about#contact` section, so no redundant contact route was added.

### Route and indexing review

The generated sitemap contains 53 canonical URLs; the browser-only `/projects/print` page is excluded and carries `noindex, follow`. The full local prelaunch SEO and link checks passed across the 54 public application routes, with no broken internal links or orphan routes reported. The site allows crawling in `robots.txt` and advertises the sitemap. No indexing or Search Console state can be confirmed without account access.

## Privacy, advertising, and consent

- Google Analytics 4 is loaded on the live site. Its measurement and cookie use are described on the existing privacy page.
- No Google AdSense script, `ca-pub` code, or ad placement was found in source or in the live homepage HTML.
- The live privacy page still reflects the deployed version. The updated privacy copy in this repository is **not live until deployed**.
- The live ads.txt record declares Google as a direct seller for the listed publisher ID. Reachability and formatting do not prove account ownership or an “Authorized” AdSense status.
- Google's consent guidance describes disclosure and consent obligations for users in the EEA, UK, and Switzerland where legally required, and lists Google CMP, third-party CMP, or a publisher-built consent flow as options. The current AdSense account settings and audience regions were not available to determine which configuration applies.
- No ads will be enabled by these changes. In particular, no consent banner was fabricated and no account verification token was guessed.

## Technical and quality checks

| Check | Result |
|---|---|
| `npm run verify` | Pass: TypeScript, 139 unit tests, and content checks |
| `npm run qa:calc-seo` | Pass: 16 calculators, unique titles/descriptions, no duplicate paragraphs or FAQ questions |
| `npm run qa:site-url` | Pass: production HTTPS origin configured |
| `npm run build` | Pass: 60 static/SSG routes generated |
| `npm run qa:prelaunch -- --port=3123` | Pass: 14 checks, 0 failures; one expected warning because the QA build intentionally uses `http://localhost:3123` |
| `npm run qa:prelaunch -- --only=performance` | Pass after correcting the public-assets path; reports two entries in `public/` |
| Live endpoint checks | Homepage, privacy, About, terms, methodology, a representative guide and calculator, `/robots.txt`, `/sitemap.xml`, and `/ads.txt` were reachable when checked |
| Core Web Vitals | Not measured in this audit; no LCP, INP, or CLS claim is made |

The first full prelaunch attempt encountered a transient Next.js worker out-of-memory error. A direct production build then succeeded, and the complete prelaunch gate passed on retry. The focused asset-path check was run after the QA script correction. The final direct production build also passed.

The automated QA measures local build routes. Live inspection was limited to representative pages and the key public endpoints; the repository changes have not been deployed, so no live post-deployment verification is claimed.

## Changes made

- Updated the privacy page with an accurate, current advertising disclosure and update date.
- Removed automatically generated sitemap `lastModified` values.
- Corrected seven content issues listed above.
- Fixed the public-assets directory path used by the prelaunch audit.
- Added current-state corrections to older release reports so their historical AdSense pass and origin warning are not mistaken for current findings.
- Added this audit report.

No calculator formula, publisher ID, verification code, ad placement, or live-ad integration was changed.

## Manual actions required

1. In AdSense, open **Sites → measuretobuild.in** and copy the specific issue or review detail; the supplied generic message is insufficient to identify the cause.
2. Confirm that `pub-3560476614865435` is the publisher ID for the account applying to this site, and check AdSense's reported ads.txt status.
3. Follow the exact site-verification method shown by that account. If it requests code, provide the exact snippet before implementation; do not substitute the ads.txt line for verification.
4. Decide which countries/regions the site serves and configure the appropriate consent mechanism and AdSense account settings before enabling ads. Confirm current Google requirements for the chosen products and regions.
5. Deploy these local changes, then verify the live privacy page, sitemap, and updated content. Only after the account-side issues are resolved should you request another review.

## Final recommendation

**Conditionally ready after manual account checks and deployment.** The code-level fixes are complete and the test suite passes, but the precise rejection reason, publisher-account match, and any required site-verification action cannot be resolved from repository access. This is not a guarantee of approval.

## Official references reviewed

- [AdSense eligibility requirements](https://support.google.com/adsense/answer/9724)
- [AdSense site readiness and content guidance](https://support.google.com/adsense/answer/7299563)
- [AdSense Program policies](https://support.google.com/adsense/answer/48182)
- [Google Publisher Policies](https://support.google.com/publisherpolicies/answer/10502938)
- [AdSense ads.txt guidance](https://support.google.com/adsense/answer/7532444) — redirects to the current ads.txt article
- [Google AdSense consent guidance](https://support.google.com/adsense/answer/7670013)
- [Google Search Essentials](https://developers.google.com/search/docs/essentials)
- [Google Search spam policies](https://developers.google.com/search/docs/essentials/spam-policies)
- [People-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) — Google does not prescribe a preferred word count.

The AdSense verification article linked in the supplied audit prompt was not readable through the available documentation fetch; no requirement was inferred from that inaccessible page.
