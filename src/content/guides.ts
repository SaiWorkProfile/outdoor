import type { CalculatorSlug } from '@/components/calculators/registry';

/**
 * Which content pages belong next to each calculator.
 *
 * This file is intentionally free of content imports: the calculator pages are
 * client components, so anything imported here ends up in the browser bundle.
 * Only hrefs and labels live here, never page bodies.
 */
export interface CalculatorGuideLinks {
  project: { href: string; label: string };
  material?: { href: string; label: string };
  cost?: { href: string; label: string };
  extra?: { href: string; label: string };
}

export const CALCULATOR_GUIDES: Record<CalculatorSlug, CalculatorGuideLinks> = {
  'gravel-calculator': {
    project: { href: '/projects/how-much-gravel-do-i-need', label: 'How much gravel do I need?' },
    material: { href: '/materials/gravel', label: 'Gravel: what it is and how to plan quantities' },
    cost: { href: '/costs/gravel-cost', label: 'What changes the price of gravel' },
    extra: { href: '/projects/how-to-calculate-landscaping-materials', label: 'Planning landscaping materials in one workflow' },
  },
  'pea-gravel-calculator': {
    project: { href: '/projects/how-much-gravel-do-i-need', label: 'How much gravel do I need?' },
    material: { href: '/materials/pea-gravel', label: 'Pea gravel: uses, depth and coverage' },
    cost: { href: '/costs/gravel-cost', label: 'What changes the price of gravel' },
  },
  'mulch-calculator': {
    project: { href: '/projects/how-to-calculate-mulch', label: 'How to calculate mulch for beds' },
    material: { href: '/materials/mulch', label: 'Mulch: types, depth and coverage' },
    cost: { href: '/costs/mulch-cost', label: 'Bagged versus bulk mulch pricing' },
    extra: { href: '/projects/outdoor-project-cost-planning', label: 'Planning a whole outdoor project budget' },
  },
  'topsoil-calculator': {
    project: { href: '/projects/how-much-topsoil-do-i-need', label: 'How much topsoil do I need?' },
    material: { href: '/materials/topsoil', label: 'Topsoil, garden soil and compost compared' },
    cost: { href: '/costs/landscaping-project-cost', label: 'What drives landscaping project cost' },
  },
  'soil-calculator': {
    project: { href: '/projects/how-much-topsoil-do-i-need', label: 'How much topsoil do I need?' },
    material: { href: '/materials/topsoil', label: 'Topsoil, garden soil and compost compared' },
    cost: { href: '/costs/landscaping-project-cost', label: 'What drives landscaping project cost' },
  },
  'sand-calculator': {
    project: { href: '/projects/how-to-calculate-paver-materials', label: 'How to calculate paver materials' },
    material: { href: '/materials/sand', label: 'Sand products and what they are used for' },
    cost: { href: '/costs/paver-patio-cost', label: 'What drives paver patio cost' },
  },
  'landscape-rock-calculator': {
    project: { href: '/projects/how-to-calculate-landscaping-materials', label: 'Landscaping material planning workflow' },
    material: { href: '/materials/gravel', label: 'Gravel and rock: sizing, uses and quantity planning' },
    cost: { href: '/costs/gravel-cost', label: 'What changes the price of gravel' },
  },
  'paver-base-calculator': {
    project: { href: '/projects/how-to-plan-a-paver-patio', label: 'How to plan a paver patio' },
    material: { href: '/materials/paver-base', label: 'Paver base: purpose, depth and compaction' },
    cost: { href: '/costs/paver-patio-cost', label: 'What drives paver patio cost' },
  },
  'driveway-gravel-calculator': {
    project: { href: '/projects/how-to-plan-a-gravel-driveway', label: 'How to plan a gravel driveway' },
    material: { href: '/materials/gravel', label: 'Gravel and rock: sizing, uses and quantity planning' },
    cost: { href: '/costs/gravel-driveway-cost', label: 'What drives gravel driveway cost' },
  },
  'concrete-calculator': {
    project: { href: '/projects/how-to-calculate-concrete-for-a-slab', label: 'How to calculate concrete for a slab' },
    material: { href: '/materials/concrete', label: 'Ready-mix and bagged concrete' },
    cost: { href: '/costs/landscaping-project-cost', label: 'What drives landscaping project cost' },
  },
  'paver-calculator': {
    project: { href: '/projects/how-to-calculate-paver-materials', label: 'How to calculate paver materials' },
    material: { href: '/materials/paver-base', label: 'Paver base: purpose, depth and compaction' },
    cost: { href: '/costs/paver-patio-cost', label: 'What drives paver patio cost' },
  },
  'paver-patio-calculator': {
    project: { href: '/projects/how-to-plan-a-paver-patio', label: 'How to plan a paver patio' },
    material: { href: '/materials/paver-base', label: 'Paver base: purpose, depth and compaction' },
    cost: { href: '/costs/paver-patio-cost', label: 'What drives paver patio cost' },
  },
  'fence-calculator': {
    project: { href: '/projects/how-to-plan-a-fence', label: 'How to plan a fence' },
    material: { href: '/materials/fence-materials', label: 'Fence materials compared for planning' },
    cost: { href: '/costs/fence-cost', label: 'What a fence estimate is made of' },
    extra: { href: '/projects/how-to-calculate-fence-materials', label: 'A complete 100 ft fence take-off' },
  },
  'fence-cost-calculator': {
    project: { href: '/projects/how-to-calculate-fence-materials', label: 'A complete 100 ft fence take-off' },
    material: { href: '/materials/fence-materials', label: 'Fence materials compared for planning' },
    cost: { href: '/costs/fence-cost', label: 'What a fence estimate is made of' },
  },
  'fence-post-calculator': {
    project: { href: '/projects/how-to-plan-a-fence', label: 'How to plan a fence' },
    material: { href: '/materials/fence-materials', label: 'Fence materials compared for planning' },
    cost: { href: '/costs/fence-cost', label: 'What a fence estimate is made of' },
  },
  'deck-material-calculator': {
    project: { href: '/projects/how-to-estimate-deck-materials', label: 'How to estimate deck materials' },
    material: { href: '/materials/decking-materials', label: 'Decking materials compared for planning' },
    cost: { href: '/costs/deck-cost', label: 'What drives deck cost' },
  },
};
