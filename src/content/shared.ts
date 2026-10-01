import { calculateBulk, compareDepths, coverageSqFt, type BulkResult, type Pricing, type PurchaseAdvice } from '@/lib/calculations/bulk';
import { CU_FT_PER_CU_YD } from '@/lib/units';
import { calculateConcrete } from '@/lib/calculations/concrete';
import { calculateDeckMaterials, type DeckPricing } from '@/lib/calculations/deck';
import { calculateDriveway, type DrivewayLayerInput } from '@/lib/calculations/driveway';
import { calculateFence, calculateFenceCost, type FencePricing, type FenceType } from '@/lib/calculations/fence';
import { calculateFencePosts } from '@/lib/calculations/fence-post';
import type { Shape } from '@/lib/calculations/geometry';
import { calculatePavers, type PaverPricing } from '@/lib/calculations/paver';
import { ENGINE_ASSUMPTIONS } from '@/data/assumptions';
import { MATERIALS, type MaterialId } from '@/data/materials';
import { useCasesFor } from '@/data/useCases';
import type { TableSpec, WorkedExample } from './types';
import type { MoneyAmount } from '@/lib/currency/money-value';

/**
 * Shared builders for content pages.
 *
 * Nothing in this file restates a calculator formula. Every number that appears
 * on a content page is produced by calling the same engine functions the
 * calculators call, so a worked example can never disagree with the tool.
 */

/** Format a number with thousands separators and trimmed trailing zeros. */
export function num(value: number, dp = 2): string {
  const fixed = Math.abs(value).toFixed(dp);
  const [whole, fraction] = fixed.split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const trimmed = fraction ? fraction.replace(/0+$/, '') : '';
  const sign = value < 0 ? '-' : '';
  return trimmed ? `${sign}${grouped}.${trimmed}` : `${sign}${grouped}`;
}

export function money(value: number): MoneyAmount {
  return { money: value };
}

export function shapeLabel(shape: Shape): string {
  switch (shape.kind) {
    case 'rectangle':
      return `${num(shape.length)} ft × ${num(shape.width)} ft`;
    case 'circle':
      return `${num(shape.diameter)} ft diameter`;
    case 'triangle':
      return `${num(shape.base)} ft base × ${num(shape.height)} ft height`;
    case 'area':
      return `${num(shape.sqFt)} sq ft measured area`;
    default:
      return 'area';
  }
}

export function areasLabel(areas: Shape[]): string {
  return areas.map(shapeLabel).join(' + ');
}

export const PURCHASE_ADVICE_TEXT: Record<PurchaseAdvice, string> = {
  bags: 'Bags are practical at this volume',
  either: 'Bags or bulk delivery are both reasonable',
  bulk: 'Bulk delivery is usually easier at this volume',
};

function bulkRows(result: BulkResult, options: { includeCosts?: boolean } = {}): WorkedExample['results'] {
  const rows: WorkedExample['results'] = [
    { label: 'Project area', value: `${num(result.areaSqFt)} sq ft`, note: `${num(result.areaSqM)} m²` },
    { label: 'Depth used', value: `${num(result.depthIn)} in` },
    { label: 'Volume before waste', value: `${num(result.baseVolumeCuFt)} cu ft`, note: `${num(result.baseVolumeCuYd)} cu yd` },
    { label: 'Waste allowance', value: `${num(result.wastePercent)}%` },
    { label: 'Volume to order', value: `${num(result.volumeCuFt)} cu ft`, note: `${num(result.volumeCuYd)} cu yd · ${num(result.volumeCuM)} m³` },
    { label: 'Order quantity', value: `${num(result.recommendedOrderCuYd)} cu yd`, note: 'Rounded up to the nearest 0.25 cu yd' },
    {
      label: 'Estimated weight',
      value: `${num(result.tons)} tons`,
      note: `${num(result.tonnes)} tonnes at the ${num(result.densityUsed)} tons/cu yd planning density`,
    },
  ];
  for (const bag of result.bags) {
    rows.push({ label: `${num(bag.bagCuFt)} cu ft bags`, value: `${bag.count} bags` });
  }
  rows.push({ label: 'Bags or bulk?', value: PURCHASE_ADVICE_TEXT[result.purchaseAdvice] });
  if (result.loads !== undefined) rows.push({ label: 'Truckloads', value: `${result.loads} loads` });
  if (options.includeCosts) {
    for (const cost of result.costs) {
      rows.push({
        label: `Cost at the entered ${cost.basis.replace(/-/g, ' ')} price`,
        value: money(cost.materialCost),
        note: cost.deliveryFee !== undefined
          ? [money(cost.unitPrice), ` × ${num(cost.quantity)} plus `, money(cost.deliveryFee), ' delivery']
          : [money(cost.unitPrice), ` × ${num(cost.quantity)}`],
      });
    }
  }
  return rows;
}

export interface BulkExampleSpec {
  id: string;
  title: string;
  scenario: string;
  conclusion: string;
  material: MaterialId;
  areas: Shape[];
  depthIn: number;
  wastePercent?: number;
  compactionFactor?: number;
  useCase?: string;
  pricing?: Pricing;
  truckCapacityTons?: number;
  /** Extra depth values to compare side by side, e.g. [2, 3, 4]. */
  compare?: number[];
}

export function bulkExample(spec: BulkExampleSpec): WorkedExample {
  const waste = spec.wastePercent ?? ENGINE_ASSUMPTIONS.waste.defaultPercent;
  const baseInput = {
    material: spec.material,
    areas: spec.areas,
    wastePercent: waste,
    compactionFactor: spec.compactionFactor,
    useCase: spec.useCase,
    pricing: spec.pricing,
    truckCapacityTons: spec.truckCapacityTons,
  };
  const result = calculateBulk({ ...baseInput, depthIn: spec.depthIn });

  const inputs: WorkedExample['inputs'] = [
    { label: 'Material', value: MATERIALS[spec.material].name },
    { label: 'Area', value: areasLabel(spec.areas) },
    { label: 'Depth', value: `${num(spec.depthIn)} in` },
    { label: 'Waste', value: `${num(waste)}%` },
  ];
  if (spec.compactionFactor !== undefined) inputs.push({ label: 'Compaction allowance', value: `×${num(spec.compactionFactor)}` });

  const tables: TableSpec[] = [];
  if (spec.compare && spec.compare.length > 1) {
    const rows = compareDepths(baseInput, spec.compare).map((entry) => [
      `${num(entry.depthIn)} in`,
      `${num(entry.result.volumeCuYd)} cu yd`,
      `${num(entry.result.recommendedOrderCuYd)} cu yd`,
      `${num(entry.result.tons)} tons`,
      entry.result.bags[0] ? `${entry.result.bags[0].count} bags` : '—',
    ]);
    tables.push({
      caption: `Same area at different depths (engine output, ${num(waste)}% waste)`,
      head: ['Depth', 'Volume to order', 'Order quantity', 'Estimated weight', 'Smallest bag size'],
      rows,
      note: 'Every column comes from the same calculation engine used by the calculator.',
    });
  }

  return {
    id: spec.id,
    title: spec.title,
    scenario: spec.scenario,
    inputs,
    results: bulkRows(result, { includeCosts: Boolean(spec.pricing) }),
    tables: tables.length ? tables : undefined,
    conclusion: spec.conclusion,
  };
}


/** Per-use-case planning depth ranges, read straight from the calculator's use-case data. */
export function depthRangeTable(material: MaterialId, caption?: string): TableSpec {
  const spec = MATERIALS[material];
  return {
    caption: caption ?? `${spec.name}: the planning depth ranges behind the calculator's presets`,
    head: ['Use case', 'Planning range', 'Default', 'Note'],
    rows: useCasesFor(material).map((useCase) => [
      useCase.label,
      `${num(useCase.minDepthIn)}–${num(useCase.maxDepthIn)} in`,
      `${num(useCase.defaultDepthIn)} in`,
      useCase.note,
    ]),
    note: 'Planning ranges, not site-specific specifications. Your soil, drainage and use can justify a different depth.',
  };
}

/** Density and packaging assumptions for a material, read from the engine data. */
export function materialAssumptionTable(material: MaterialId): TableSpec {
  const spec = MATERIALS[material];
  return {
    caption: `${spec.name}: planning assumptions used by the calculator`,
    head: ['Assumption', 'Planning value'],
    rows: [
      ['Typical density', `${num(spec.density.typical)} tons/cu yd`],
      ['Density range seen in practice', `${num(spec.density.min)}–${num(spec.density.max)} tons/cu yd`],
      ['Bag sizes used for bag estimates', spec.bagSizesCuFt.map((bag) => `${num(bag)} cu ft`).join(', ')],
      ['Default waste allowance', `${num(ENGINE_ASSUMPTIONS.waste.defaultPercent)}%`],
      ['Order rounding', `Nearest ${num(ENGINE_ASSUMPTIONS.truck.orderGranularityCuYd)} cu yd`],
    ],
    note: spec.note,
  };
}

export function fencePostExample(spec: {
  id: string;
  title: string;
  scenario: string;
  conclusion: string;
  fenceLengthFt: number;
  postSpacingFt?: number;
  cornerCount?: number;
  endCount?: number;
  gateCount?: number;
  gateWidthFt?: number;
}): WorkedExample {
  const result = calculateFencePosts({
    fenceLengthFt: spec.fenceLengthFt,
    postSpacingFt: spec.postSpacingFt,
    cornerCount: spec.cornerCount,
    endCount: spec.endCount,
    gateCount: spec.gateCount,
    gateWidthFt: spec.gateWidthFt,
  });
  return {
    id: spec.id,
    title: spec.title,
    scenario: spec.scenario,
    inputs: [
      { label: 'Fence length', value: `${num(spec.fenceLengthFt)} ft` },
      { label: 'Post spacing', value: `${num(spec.postSpacingFt ?? ENGINE_ASSUMPTIONS.fence.defaultPostSpacingFt)} ft` },
      { label: 'Corners', value: `${spec.cornerCount ?? 0}` },
      { label: 'Ends', value: `${spec.endCount ?? ENGINE_ASSUMPTIONS.fence.defaultEndPosts}` },
      { label: 'Gates', value: `${spec.gateCount ?? 0}${spec.gateWidthFt ? ` at ${num(spec.gateWidthFt)} ft` : ''}` },
    ],
    results: [
      { label: 'Gate opening', value: `${num(result.gateOpeningLengthFt)} ft` },
      { label: 'Net fence run', value: `${num(result.netFenceRunFt)} ft` },
      { label: 'Estimated post positions', value: `${result.estimatedPostPositions}` },
      { label: 'Line posts', value: `${result.linePosts}` },
      { label: 'Corner posts', value: `${result.cornerPosts}` },
      { label: 'End posts', value: `${result.endPosts}` },
      { label: 'Gate posts', value: `${result.gatePosts}` },
      { label: 'Total posts', value: `${result.totalPosts}` },
    ],
    conclusion: spec.conclusion,
  };
}


export interface FenceExampleSpec {
  id: string;
  title: string;
  scenario: string;
  conclusion: string;
  fenceLengthFt: number;
  heightFt: number;
  fenceType: FenceType;
  postSpacingFt?: number;
  cornerCount?: number;
  endCount?: number;
  gateCount?: number;
  gateWidthFt?: number;
  wastePercent?: number;
}

export function fenceExample(spec: FenceExampleSpec): WorkedExample {
  const waste = spec.wastePercent ?? ENGINE_ASSUMPTIONS.waste.defaultPercent;
  const result = calculateFence({
    fenceLengthFt: spec.fenceLengthFt,
    heightFt: spec.heightFt,
    fenceType: spec.fenceType,
    postSpacingFt: spec.postSpacingFt,
    cornerCount: spec.cornerCount,
    endCount: spec.endCount,
    gateCount: spec.gateCount,
    gateWidthFt: spec.gateWidthFt,
    wastePercent: waste,
  });

  const results: WorkedExample['results'] = [
    { label: 'Fence length', value: `${num(result.fenceLengthFt)} ft at ${num(result.heightFt)} ft high` },
    {
      label: 'Net fence run',
      value: `${num(result.netFenceRunFt)} ft`,
      note: `${num(result.posts.gateOpeningLengthFt)} ft of gate openings removed`,
    },
    {
      label: 'Total posts',
      value: `${result.posts.totalPosts}`,
      note: `${result.posts.linePosts} line · ${result.posts.cornerPosts} corner · ${result.posts.endPosts} end · ${result.posts.gatePosts} gate`,
    },
    { label: 'Rails per section', value: `${num(result.railsPerSection)}` },
    {
      label: 'Rail material',
      value: `${num(result.railLinearFtRequired)} linear ft`,
      note: `${result.railPiecesRequired} pieces at ${num(ENGINE_ASSUMPTIONS.fence.defaultRailStockLengthFt)} ft stock length, waste included`,
    },
  ];
  if (result.picketsRequired !== undefined) results.push({ label: 'Pickets', value: `${result.picketsRequired}` });
  if (result.panelsRequired !== undefined) results.push({ label: 'Panels', value: `${result.panelsRequired}` });
  if (result.chainLinkLinearFtRequired !== undefined) {
    results.push({ label: 'Chain-link mesh', value: `${num(result.chainLinkLinearFtRequired)} linear ft` });
  }
  results.push({
    label: 'Post-hole concrete',
    value: `${num(result.concrete.recommendedReadyMixCuYd)} cu yd`,
    note: `${num(result.concrete.volumeCuFt)} cu ft of hole volume at ${num(ENGINE_ASSUMPTIONS.fence.postHoleDiameterIn)} in × ${num(ENGINE_ASSUMPTIONS.fence.postHoleDepthIn)} in per hole`,
  });
  results.push({ label: 'Fasteners', value: `${result.hardware.fastenerCount} pieces`, note: result.hardware.note });
  if (result.hardware.gateHardwareSets > 0) results.push({ label: 'Gate hardware sets', value: `${result.hardware.gateHardwareSets}` });

  return {
    id: spec.id,
    title: spec.title,
    scenario: spec.scenario,
    inputs: [
      { label: 'Fence length', value: `${num(spec.fenceLengthFt)} ft` },
      { label: 'Height', value: `${num(spec.heightFt)} ft` },
      { label: 'Type', value: spec.fenceType.replace(/-/g, ' ') },
      { label: 'Post spacing', value: `${num(spec.postSpacingFt ?? ENGINE_ASSUMPTIONS.fence.defaultPostSpacingFt)} ft` },
      { label: 'Gates', value: `${spec.gateCount ?? 0}${spec.gateWidthFt ? ` at ${num(spec.gateWidthFt)} ft` : ''}` },
      { label: 'Waste', value: `${num(waste)}%` },
    ],
    results,
    tables: [
      {
        caption: 'Shopping list produced by the fence calculator for these inputs',
        head: ['Item', 'Quantity', 'Unit', 'Note'],
        rows: result.shoppingList.map((item) => [item.name, num(item.quantity), item.unit, item.notes ?? '—']),
      },
    ],
    conclusion: spec.conclusion,
  };
}


export interface PaverExampleSpec {
  id: string;
  title: string;
  scenario: string;
  conclusion: string;
  areas: Shape[];
  paverLengthIn: number;
  paverWidthIn: number;
  jointWidthIn?: number;
  wastePercent?: number;
  baseDepthIn?: number;
  beddingSandDepthIn?: number;
  /** Prices are always supplied by the reader; the engine never invents them. */
  pricing?: PaverPricing;
}

export function paverExample(spec: PaverExampleSpec): WorkedExample {
  const waste = spec.wastePercent ?? ENGINE_ASSUMPTIONS.waste.defaultPercent;
  const result = calculatePavers({
    areas: spec.areas,
    paverLengthIn: spec.paverLengthIn,
    paverWidthIn: spec.paverWidthIn,
    jointWidthIn: spec.jointWidthIn,
    wastePercent: waste,
    baseDepthIn: spec.baseDepthIn,
    beddingSandDepthIn: spec.beddingSandDepthIn,
    pricing: spec.pricing,
  });
  return {
    id: spec.id,
    title: spec.title,
    scenario: spec.scenario,
    inputs: [
      { label: 'Patio area', value: areasLabel(spec.areas) },
      { label: 'Paver size', value: `${num(spec.paverLengthIn)} in × ${num(spec.paverWidthIn)} in` },
      { label: 'Joint width', value: `${num(spec.jointWidthIn ?? ENGINE_ASSUMPTIONS.paver.defaultJointWidthIn, 3)} in` },
      { label: 'Base depth', value: `${num(result.baseDepthIn)} in` },
      { label: 'Bedding sand depth', value: `${num(result.beddingSandDepthIn)} in` },
      { label: 'Waste', value: `${num(waste)}%` },
    ],
    results: [
      { label: 'Area', value: `${num(result.areaSqFt)} sq ft`, note: `${num(result.areaSqM)} m²` },
      { label: 'Paver module size', value: `${num(result.paverModuleSqIn, 3)} sq in`, note: 'Paver size plus the joint, which is what the count is based on' },
      { label: 'Pavers before waste', value: `${result.paverCountBeforeWaste}` },
      { label: 'Pavers to order', value: `${result.paversRequired}` },
      { label: 'Paver surface area ordered', value: `${num(result.paverSurfaceSqFtOrdered)} sq ft` },
      {
        label: 'Base material',
        value: `${num(result.base.recommendedOrderCuYd)} cu yd`,
        note: `${num(result.base.volumeCuYd)} cu yd after the compaction allowance · ${num(result.base.tons)} tons`,
      },
      {
        label: 'Bedding sand',
        value: `${num(result.beddingSand.recommendedOrderCuYd)} cu yd`,
        note: `${num(result.beddingSand.tons)} tons at the sand planning density`,
      },
      {
        label: 'Edge restraint',
        value: `${num(result.edgeOrderLinearFt)} linear ft`,
        note: result.edgePieces !== undefined ? `${result.edgePieces} pieces at ${num(ENGINE_ASSUMPTIONS.paver.edgePieceLengthFt)} ft stock length` : 'No stock length supplied',
      },
      ...result.costs.map((cost) => ({
        label: `${cost.component.replace(/-/g, ' ')} cost at the entered price`,
        value: money(cost.materialCost),
        note: [money(cost.unitPrice), ` × ${num(cost.quantity)} (${cost.basis.replace(/-/g, ' ')})`],
      })),
    ],
    tables: [
      {
        caption: 'Shopping list produced by the paver calculator for these inputs',
        head: ['Item', 'Quantity', 'Unit', 'Note'],
        rows: result.shoppingList.map((item) => [item.name, num(item.quantity), item.unit, item.notes ?? '—']),
      },
    ],
    conclusion: spec.conclusion,
  };
}

export interface ConcreteExampleSpec {
  id: string;
  title: string;
  scenario: string;
  conclusion: string;
  parts: Parameters<typeof calculateConcrete>[0]['parts'];
  wastePercent?: number;
}

export function concreteExample(spec: ConcreteExampleSpec): WorkedExample {
  const waste = spec.wastePercent ?? ENGINE_ASSUMPTIONS.waste.defaultPercent;
  const result = calculateConcrete({ parts: spec.parts, wastePercent: waste });
  return {
    id: spec.id,
    title: spec.title,
    scenario: spec.scenario,
    inputs: [
      ...spec.parts.map((part) => ({
        label: part.label ?? part.kind,
        value:
          part.kind === 'slab'
            ? `${num(part.lengthFt)} ft × ${num(part.widthFt)} ft × ${num(part.thicknessIn)} in thick`
            : part.kind === 'footing'
              ? `${num(part.lengthFt)} ft long × ${num(part.widthIn)} in wide × ${num(part.depthIn)} in deep`
              : `${part.count} holes at ${num(part.diameterIn)} in diameter × ${num(part.depthIn)} in deep`,
      })),
      { label: 'Waste allowance', value: `${num(waste)}%` },
    ],
    results: [
      ...result.parts.map((part) => ({ label: `${part.label} volume`, value: `${num(part.volumeCuFt)} cu ft` })),
      { label: 'Total volume', value: `${num(result.volumeCuFt)} cu ft`, note: 'Before the waste allowance' },
      { label: 'Volume to order', value: `${num(result.orderCuFt)} cu ft`, note: `${num(result.orderCuYd)} cu yd · ${num(result.orderCuM)} m³` },
      {
        label: 'Ready-mix order quantity',
        value: `${num(result.recommendedReadyMixCuYd)} cu yd`,
        note: `Rounded up to the nearest ${num(ENGINE_ASSUMPTIONS.concrete.readyMixIncrementCuYd)} cu yd`,
      },
      ...result.bags.map((bag) => ({ label: `${bag.bagLb} lb bags`, value: `${bag.count} bags`, note: `${num(bag.yieldCuFt)} cu ft yield per bag` })),
      { label: 'Approximate weight', value: `${num(result.approxWeightLb, 0)} lb`, note: `At ${num(ENGINE_ASSUMPTIONS.concrete.lbPerCuFt)} lb per cu ft` },
      { label: 'Bags or ready-mix?', value: PURCHASE_ADVICE_TEXT[result.purchaseAdvice] },
    ],
    conclusion: spec.conclusion,
  };
}


export interface DeckExampleSpec {
  id: string;
  title: string;
  scenario: string;
  conclusion: string;
  deckLengthFt: number;
  deckWidthFt: number;
  deckingBoardWidthIn?: number;
  deckingBoardLengthFt?: number;
  joistSpacingIn?: number;
  joistStockLengthFt?: number;
  wastePercent?: number;
  beamCount?: number;
  beamLengthFt?: number;
  postCount?: number;
  /** Prices are always supplied by the reader; the engine never invents them. */
  pricing?: DeckPricing;
}

export function deckExample(spec: DeckExampleSpec): WorkedExample {
  const waste = spec.wastePercent ?? ENGINE_ASSUMPTIONS.waste.defaultPercent;
  const result = calculateDeckMaterials({
    deckLengthFt: spec.deckLengthFt,
    deckWidthFt: spec.deckWidthFt,
    deckingBoardWidthIn: spec.deckingBoardWidthIn,
    deckingBoardLengthFt: spec.deckingBoardLengthFt,
    joistSpacingIn: spec.joistSpacingIn,
    joistStockLengthFt: spec.joistStockLengthFt,
    wastePercent: waste,
    beamCount: spec.beamCount,
    beamLengthFt: spec.beamLengthFt,
    postCount: spec.postCount,
    pricing: spec.pricing,
  });
  return {
    id: spec.id,
    title: spec.title,
    scenario: spec.scenario,
    inputs: [
      { label: 'Deck size', value: `${num(spec.deckLengthFt)} ft × ${num(spec.deckWidthFt)} ft` },
      { label: 'Board width', value: `${num(result.deckingBoardWidthIn)} in` },
      { label: 'Board stock length', value: `${num(result.deckingBoardLengthFt)} ft` },
      { label: 'Board gap', value: `${num(result.boardGapIn, 3)} in` },
      { label: 'Joist spacing', value: `${num(result.joistSpacingIn)} in` },
      { label: 'Waste', value: `${num(waste)}%` },
    ],
    results: [
      { label: 'Deck area', value: `${num(result.areaSqFt)} sq ft` },
      { label: 'Board coverage width', value: `${num(result.boardCoverageWidthFt, 3)} ft`, note: `Board width plus the ${num(result.boardGapIn, 3)} in gap` },
      { label: 'Board run', value: `${num(result.boardRunLengthFt)} ft`, note: `Boards running ${result.boardRunDirection === 'length' ? 'along the length' : 'across the width'}` },
      { label: 'Rows required', value: `${result.deckingRowsRequired}`, note: `${result.deckingRowsOrdered} rows after the waste allowance` },
      { label: 'Boards per row', value: `${result.boardsPerRowRequired}` },
      { label: 'Decking boards to order', value: `${result.deckingBoardsRequired}`, note: `${num(result.deckingLinearFtOrdered)} linear ft of decking material` },
      { label: 'Joists required', value: `${result.joistsRequired}`, note: `${result.joistsOrdered} after waste at ${num(result.joistSpacingIn)} in spacing` },
      {
        label: 'Joist stock pieces',
        value: result.joistPiecesOrdered !== undefined ? `${result.joistPiecesOrdered}` : 'Not calculated',
        note: `${num(result.joistLinearFtOrdered)} linear ft of joist material`,
      },
      { label: 'Rim joist material', value: `${num(result.rimJoistLinearFtOrdered)} linear ft`, note: `${num(result.perimeterLinearFtRequired)} ft perimeter with waste` },
      { label: 'Fasteners', value: `${result.fastenersOrdered} pieces`, note: 'Two per board-to-joist intersection, waste included' },
      {
        label: 'Posts entered',
        value: `${result.postCount}`,
        note: result.postCount === 0 ? 'The estimator does not invent a structural post layout' : 'Counted from your own framing plan',
      },
      ...result.costs.map((cost) => ({
        label: `${cost.component.replace(/-/g, ' ')} cost at the entered price`,
        value: money(cost.cost),
        note: [money(cost.unitPrice), ` × ${num(cost.quantity)}`],
      })),
    ],
    conclusion: spec.conclusion,
  };
}

export interface DrivewayExampleSpec {
  id: string;
  title: string;
  scenario: string;
  conclusion: string;
  sections: Shape[];
  wastePercent?: number;
  truckCapacityTons?: number;
  deliveryFeePerLoad?: number;
  /** Optional layers with their own depths and user-entered prices. */
  layers?: DrivewayLayerInput[];
}

export function drivewayExample(spec: DrivewayExampleSpec): WorkedExample {
  const waste = spec.wastePercent ?? ENGINE_ASSUMPTIONS.waste.defaultPercent;
  const result = calculateDriveway({
    sections: spec.sections,
    wastePercent: waste,
    layers: spec.layers,
    truckCapacityTons: spec.truckCapacityTons,
    deliveryFeePerLoad: spec.deliveryFeePerLoad,
  });
  return {
    id: spec.id,
    title: spec.title,
    scenario: spec.scenario,
    inputs: [
      { label: 'Footprint', value: areasLabel(spec.sections) },
      { label: 'Total area', value: `${num(result.areaSqFt)} sq ft` },
      { label: 'Layers', value: result.layers.map((layer) => `${layer.name} ${num(layer.depthIn)} in`).join(' · ') },
      { label: 'Waste', value: `${num(waste)}%` },
    ],
    results: [
      { label: 'Total planned depth', value: `${num(result.totalDepthIn)} in` },
      { label: 'Total volume', value: `${num(result.totalVolumeCuYd)} cu yd` },
      { label: 'Total order quantity', value: `${num(result.totalOrderCuYd)} cu yd`, note: 'Each layer is rounded up to 0.25 cu yd before summing' },
      { label: 'Total estimated weight', value: `${num(result.totalTons)} tons` },
      ...(result.materialCost !== undefined
        ? [
            { label: 'Material cost at the entered layer prices', value: money(result.materialCost) },
            {
              label: 'Delivered total for priced layers',
              value: money(result.totalCost ?? 0),
              note: result.costIsComplete ? 'Every layer was priced' : 'Some layers had no price, so this total is incomplete',
            },
          ]
        : []),
      ...(result.delivery
        ? [
            {
              label: 'Delivery',
              value: `${result.delivery.loads} loads`,
              note: [`${num(result.delivery.truckCapacityTons)} ton trucks at `, money(result.delivery.feePerLoad), ' per load'],
            },
          ]
        : []),
    ],
    tables: [
      {
        caption: 'Per-layer output from the driveway calculator',
        head: ['Layer', 'Depth', 'Volume', 'Order quantity', 'Estimated weight'],
        rows: result.layers.map((layer) => [
          layer.name,
          `${num(layer.depthIn)} in`,
          `${num(layer.result.volumeCuYd)} cu yd`,
          `${num(layer.result.recommendedOrderCuYd)} cu yd`,
          `${num(layer.result.tons)} tons`,
        ]),
      },
    ],
    conclusion: spec.conclusion,
  };
}

/**
 * Coverage table: how far one cubic yard (and one bag) goes at several depths.
 *
 * Coverage is derived from the engine's own coverage function, so a "how much
 * does a bag cover" answer on a content page always matches the calculator.
 */
export function coverageTable(depths: number[], bagSizesCuFt: number[] = [], note?: string): TableSpec {
  const bagCoverage = (bagCuFt: number, depthIn: number) => coverageSqFt(bagCuFt / CU_FT_PER_CU_YD, depthIn);
  return {
    caption: 'Coverage by depth, calculated with the engine\'s coverage function',
    head: ['Depth', 'One cubic yard covers', ...bagSizesCuFt.map((bag) => `One ${num(bag)} cu ft bag covers`)],
    rows: depths.map((depthIn) => [
      `${num(depthIn)} in`,
      `${num(coverageSqFt(1, depthIn), 1)} sq ft`,
      ...bagSizesCuFt.map((bag) => `${num(bagCoverage(bag, depthIn), 1)} sq ft`),
    ]),
    note: note ?? 'Coverage assumes a level surface and a uniform depth.',
  };
}

/** Turn engine warnings into a plain bullet list a reader can act on. */
export function warningList(warnings: string[]): string[] {
  return warnings.map((warning) => warning.replace(/\s+/g, ' ').trim());
}


/**
 * Just the volume in cubic yards for a simple area and depth.
 *
 * Used where a page needs to cross-check a published table against the engine
 * without printing a full worked example.
 */
export function bulkVolumeCuYd(material: MaterialId, areaSqFt: number, depthIn: number, wastePercent = 0): number {
  const result = calculateBulk({
    material,
    areas: [{ kind: 'area', sqFt: areaSqFt }],
    depthIn,
    wastePercent,
  });
  return result.volumeCuYd;
}


/**
 * Fence cost example.
 *
 * Prices in a fence cost example are always labelled as user-entered figures:
 * the engine multiplies whatever it is given and flags anything left blank.
 */
export function fenceCostExample(spec: FenceExampleSpec & { pricing: Parameters<typeof calculateFenceCost>[0]['pricing'] }): WorkedExample {
  const waste = spec.wastePercent ?? ENGINE_ASSUMPTIONS.waste.defaultPercent;
  const result = calculateFenceCost({
    fenceLengthFt: spec.fenceLengthFt,
    heightFt: spec.heightFt,
    fenceType: spec.fenceType,
    postSpacingFt: spec.postSpacingFt,
    cornerCount: spec.cornerCount,
    endCount: spec.endCount,
    gateCount: spec.gateCount,
    gateWidthFt: spec.gateWidthFt,
    wastePercent: waste,
    pricing: spec.pricing,
  });
  const rows: WorkedExample['results'] = [
    { label: 'Material cost at the entered prices', value: money(result.materialCost) },
    { label: 'Labour cost at the entered rate', value: money(result.laborCost) },
    { label: 'Total for the entered prices', value: money(result.totalCost) },
    {
      label: 'Quote completeness',
      value: result.costIsComplete ? 'Every component was priced' : `${result.missingPrices.length} component(s) had no price`,
      note: result.costIsComplete ? 'A total only means something when every line has a price.' : `Not priced: ${result.missingPrices.join(', ')}`,
    },
    { label: 'Fence length used for labour', value: `${num(result.fence.fenceLengthFt)} ft` },
  ];
  return {
    id: spec.id,
    title: spec.title,
    scenario: spec.scenario,
    inputs: [
      { label: 'Fence length', value: `${num(spec.fenceLengthFt)} ft at ${num(spec.heightFt)} ft high` },
      { label: 'Type', value: spec.fenceType.replace(/-/g, ' ') },
      { label: 'Gates', value: `${spec.gateCount ?? 0}${spec.gateWidthFt ? ` at ${num(spec.gateWidthFt)} ft` : ''}` },
      { label: 'Prices', value: 'Entered by the reader, never supplied by the calculator' },
    ],
    results: rows,
    tables: [
      {
        caption: 'Cost lines produced from the entered prices',
        head: ['Component', 'Basis', 'Unit price', 'Quantity', 'Cost'],
        rows: result.lines.map((line) => [
          line.component,
          line.basis,
          money(line.unitPrice),
          num(line.quantity),
          money(line.cost),
        ]),
        note: 'Unit prices here are illustrative entries, not market quotes. Replace them with your own supplier and installer figures.',
      },
    ],
    conclusion: spec.conclusion,
  };
}

