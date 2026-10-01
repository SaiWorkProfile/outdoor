export const SITE_NAME = 'MeasureToBuild';
export const SITE_TAGLINE = 'Measure. Calculate. Plan.';

/**
 * The canonical production origin — the single source of truth for every absolute
 * URL this app emits: canonical tags, Open Graph / Twitter URLs, sitemap <loc>,
 * the robots.txt sitemap pointer and every JSON-LD `url` / `item` / `@id` value.
 *
 * The value comes from NEXT_PUBLIC_SITE_URL at build time (set to
 * https://www.measuretobuild.in in .env.production for releases). The fallback is
 * that same production origin so a build that forgets the variable still points at
 * the canonical host instead of localhost; `qa/site-url-guard.cjs`
 * (`npm run qa:site-url`) reports the missing/faulty production configuration as a
 * release failure so it is never substituted silently in a shipped build.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.measuretobuild.in').replace(/\/+$/, '');
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'measuretobuild@gmail.com';
export const SITE_DESCRIPTION = 'Plan outdoor projects with material calculators for gravel, mulch, soil, pavers, fencing, concrete and decks. Calculate quantities, review assumptions and build a project shopping list.';
export const HOME_TITLE = `${SITE_NAME} | Outdoor Project Calculators & Planning Tools`;

export function absoluteUrl(path: string): string {
  const url = new URL(path, SITE_URL).toString();
  /* `new URL('/')` renders the origin root as "https://host/", but Next.js emits the
     canonical tag for "/" without the trailing slash. Collapse the root to that same
     form so the sitemap <loc>, Open Graph URLs and JSON-LD match the canonical exactly. */
  return url === `${SITE_URL}/` ? SITE_URL : url;
}
