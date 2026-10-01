export const SITE_NAME = 'MeasureToBuild';
export const SITE_TAGLINE = 'Measure. Calculate. Plan.';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
export const SITE_DESCRIPTION = 'Plan outdoor projects with material calculators for gravel, mulch, soil, pavers, fencing, concrete and decks. Calculate quantities, review assumptions and build a project shopping list.';
export const HOME_TITLE = `${SITE_NAME} | Outdoor Project Calculators & Planning Tools`;

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}
