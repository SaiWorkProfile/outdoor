/**
 * Calculator grouping for the directory page and the Project Mode chooser.
 *
 * The registry stays the single source of truth for a calculator's name, form and
 * formula. This file only adds the curated, page-facing description of what each
 * calculator is for, so no calculator has to be described by the same sentence twice.
 */
import type { CalculatorSlug } from './registry';

export interface CalculatorGroupItem {
  slug: CalculatorSlug;
  /** Unique, task-focused description used when the calculator is listed in its group. */
  description: string;
}

export interface CalculatorGroup {
  id: 'popular' | 'landscaping-materials' | 'driveways-hardscape' | 'fence-deck';
  title: string;
  blurb: string;
  items: CalculatorGroupItem[];
}

export const CALCULATOR_GROUPS: CalculatorGroup[] = [
  {
    id: 'popular',
    title: 'Popular calculators',
    blurb: 'The four calculators most outdoor projects start with.',
    items: [
      { slug: 'gravel-calculator', description: 'Volume, weight and bag counts for driveways, walkways and drainage stone you can order with confidence.' },
      { slug: 'fence-calculator', description: 'Turns fence length, corners and gates into posts, rails, pickets, panels and concrete.' },
      { slug: 'paver-calculator', description: 'Paver count plus the base, bedding sand and edge restraint the paving sits on.' },
      { slug: 'concrete-calculator', description: 'Slab, footing and post-hole volumes with ready-mix rounding and bag yields.' },
    ],
  },
  {
    id: 'landscaping-materials',
    title: 'Landscaping materials',
    blurb: 'Bulk materials sold by the cubic yard, tonne or bag, planned from your measured area.',
    items: [
      { slug: 'gravel-calculator', description: 'Order gravel by cubic yard, tonne or bag after allowing for waste and compaction.' },
      { slug: 'mulch-calculator', description: 'Cover beds at the depth you choose and see how many bags or cubic yards that takes.' },
      { slug: 'topsoil-calculator', description: 'Plan topsoil for new beds, raised beds, lawn prep and thin top-dressing.' },
      { slug: 'soil-calculator', description: 'Estimate garden soil and fill volumes when the depth differs across an area.' },
      { slug: 'sand-calculator', description: 'Plan bedding sand, leveling sand or fill sand by volume before you order.' },
      { slug: 'pea-gravel-calculator', description: 'Check pea gravel coverage for paths, play areas and decorative beds.' },
      { slug: 'landscape-rock-calculator', description: 'Size decorative rock and rip-rap quantities from the area you are covering.' },
      { slug: 'paver-base-calculator', description: 'Work out compacted base material for pavers, with the compaction factor included.' },
    ],
  },
  {
    id: 'driveways-hardscape',
    title: 'Driveways and hardscape',
    blurb: 'Layered builds where each layer, material and depth is priced and ordered separately.',
    items: [
      { slug: 'driveway-gravel-calculator', description: 'Plan base, middle and surface layers of a gravel driveway as one order.' },
      { slug: 'paver-calculator', description: 'Pavers, base, bedding sand and edge restraint for any paved surface.' },
      { slug: 'paver-patio-calculator', description: 'A named patio take-off you can add straight to a project plan.' },
      { slug: 'concrete-calculator', description: 'Concrete for slabs, footings and post holes, including bag count comparisons.' },
    ],
  },
  {
    id: 'fence-deck',
    title: 'Fence, deck and cost planners',
    blurb: 'Component-level planning for fences and decks, and cost planners that only use prices you enter.',
    items: [
      { slug: 'fence-calculator', description: 'Post spacing, rails, pickets, panels, concrete and hardware for your fence run.' },
      { slug: 'fence-cost-calculator', description: 'Add your own unit prices and see which fence components are still unpriced.' },
      { slug: 'fence-post-calculator', description: 'Focus only on post layout: line, corner, end and gate posts.' },
      { slug: 'deck-material-calculator', description: 'Decking boards, joists, rim material, beams and fasteners from your own plan.' },
    ],
  },
];

/** Slugs highlighted on the homepage and in the directory's popular row. */
export const POPULAR_SLUGS: CalculatorSlug[] = CALCULATOR_GROUPS[0]!.items.map((item) => item.slug);
