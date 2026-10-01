import Link from 'next/link';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ENGINE_ASSUMPTIONS } from '@/data/assumptions';
import { CONTENT_PAGES } from '@/content';

export const metadata: Metadata = {
  title: 'Methodology',
  description: 'The full calculation methodology: formulas in order, every central default from the assumptions file, cited sources and the documented limits of each estimate.',
  alternates: { canonical: '/methodology' },
};

const TOC = [
  { id: 'principles', label: 'Principles' },
  { id: 'bulk', label: 'Bulk materials' },
  { id: 'pavers', label: 'Pavers' },
  { id: 'fence', label: 'Fence' },
  { id: 'deck', label: 'Deck' },
  { id: 'concrete', label: 'Concrete' },
  { id: 'defaults', label: 'Central defaults' },
  { id: 'sources', label: 'Sources' },
  { id: 'limits', label: 'Limitations' },
];

const SOURCES = (() => {
  const seen = new Set<string>();
  const out: Array<{ label: string; note: string; url: string }> = [];
  for (const page of CONTENT_PAGES) {
    for (const source of page.sources ?? []) {
      if (seen.has(source.url)) continue;
      seen.add(source.url);
      out.push(source);
    }
  }
  return out;
})();

const FENCE = ENGINE_ASSUMPTIONS.fence;
const PAVER = ENGINE_ASSUMPTIONS.paver;

const GENERAL_ROWS: Array<[string, string]> = [
  ['Waste default', `${ENGINE_ASSUMPTIONS.waste.defaultPercent}% of the calculated volume`],
  ['Waste warning / low-margin thresholds', `warns above ${ENGINE_ASSUMPTIONS.waste.warningAbovePercent}%, hints below ${ENGINE_ASSUMPTIONS.waste.lowMarginBelowPercent}%`],
  ['Truck capacity / order granularity', `${ENGINE_ASSUMPTIONS.truck.defaultCapacityTons} tons, ${ENGINE_ASSUMPTIONS.truck.orderGranularityCuYd} yd³ steps`],
  ['Bags vs bulk', `bagged below ${ENGINE_ASSUMPTIONS.bulk.bagsBelowCuYd} yd³, bulk above ${ENGINE_ASSUMPTIONS.bulk.bulkAboveCuYd} yd³`],
  ['Typical waste range shown', `${ENGINE_ASSUMPTIONS.bulk.typicalWasteMinPercent}–${ENGINE_ASSUMPTIONS.bulk.typicalWasteMaxPercent}%`],
  ['Driveway layers (depth × compaction)', ENGINE_ASSUMPTIONS.driveway.layers.map((layer) => `${layer.name}: ${layer.depthIn} in × ${layer.compactionFactor}`).join(' · ')],
  ['Paver base / bedding sand', `base ${PAVER.baseDepthIn} in × ${PAVER.baseCompactionFactor}, bedding ${PAVER.beddingSandDepthIn} in × ${PAVER.beddingSandCompactionFactor}`],
  ['Paver joint width / edge piece', `${PAVER.defaultJointWidthIn} in joints, ${PAVER.edgePieceLengthFt} ft edge pieces`],
  ['Fence spacing / rails', `posts every ${FENCE.defaultPostSpacingFt} ft; ${FENCE.defaultRailsForUpTo6Ft} rails up to 6 ft high, ${FENCE.defaultRailsAbove6Ft} above`],
  ['Fence post hole', `${FENCE.postHoleDiameterIn} in diameter × ${FENCE.postHoleDepthIn} in deep`],
  ['Fence infill defaults', `pickets ${FENCE.defaultPicketWidthIn} in at ${FENCE.defaultPicketSpacingIn} in spacing; panels ${FENCE.defaultPanelWidthFt} ft`],
  ['Deck board / joist spacing', `boards ${ENGINE_ASSUMPTIONS.deck.defaultBoardWidthIn} in wide with ${ENGINE_ASSUMPTIONS.deck.defaultBoardGapIn} in gap, joists every ${ENGINE_ASSUMPTIONS.deck.defaultJoistSpacingIn} in`],
  ['Concrete density / bag yields', `150 lb per ft³; bags ${ENGINE_ASSUMPTIONS.concrete.bags.map((bag) => `${bag.bagLb} lb → ${bag.yieldCuFt} ft³`).join(', ')}`],
];
