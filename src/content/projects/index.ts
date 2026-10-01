import type { ContentPage } from '../types';
import { page as howMuchGravelDoINeed } from './how-much-gravel-do-i-need';
import { page as howToCalculateMulch } from './how-to-calculate-mulch';
import { page as howMuchTopsoilDoINeed } from './how-much-topsoil-do-i-need';
import { page as howToCalculateLandscapingMaterials } from './how-to-calculate-landscaping-materials';
import { page as howToPlanAGravelDriveway } from './how-to-plan-a-gravel-driveway';
import { page as howToPlanAFence } from './how-to-plan-a-fence';
import { page as howToCalculateFenceMaterials } from './how-to-calculate-fence-materials';
import { page as howToPlanAPaverPatio } from './how-to-plan-a-paver-patio';
import { page as howToCalculatePaverMaterials } from './how-to-calculate-paver-materials';
import { page as howToCalculateConcreteForASlab } from './how-to-calculate-concrete-for-a-slab';
import { page as howToEstimateDeckMaterials } from './how-to-estimate-deck-materials';
import { page as outdoorProjectCostPlanning } from './outdoor-project-cost-planning';

/** Project guides: the real-world planning process behind each calculator. */
export const PROJECT_PAGES: ContentPage[] = [
  howMuchGravelDoINeed,
  howToCalculateMulch,
  howMuchTopsoilDoINeed,
  howToCalculateLandscapingMaterials,
  howToPlanAGravelDriveway,
  howToPlanAFence,
  howToCalculateFenceMaterials,
  howToPlanAPaverPatio,
  howToCalculatePaverMaterials,
  howToCalculateConcreteForASlab,
  howToEstimateDeckMaterials,
  outdoorProjectCostPlanning,
];
