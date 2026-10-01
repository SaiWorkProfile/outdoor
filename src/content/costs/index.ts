import type { ContentPage } from '../types';
import { page as gravelCost } from './gravel-cost';
import { page as mulchCost } from './mulch-cost';
import { page as fenceCost } from './fence-cost';
import { page as paverPatioCost } from './paver-patio-cost';
import { page as gravelDrivewayCost } from './gravel-driveway-cost';
import { page as deckCost } from './deck-cost';
import { page as landscapingProjectCost } from './landscaping-project-cost';

/** Cost guides: the variables that move a price, with no invented figures. */
export const COST_PAGES: ContentPage[] = [
  gravelCost,
  mulchCost,
  fenceCost,
  paverPatioCost,
  gravelDrivewayCost,
  deckCost,
  landscapingProjectCost,
];
