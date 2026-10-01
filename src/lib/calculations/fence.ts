import { ENGINE_ASSUMPTIONS } from '../../data/assumptions';
import { calculateConcrete } from './concrete';
import { calculateFencePosts, type FencePostInput, type FencePostResult } from './fence-post';
import { ceilSafe, round } from '../units';
import { CalcInputError, requireNonEmptyString, requireNonNegative, requirePercent, requirePositive } from '../validation';

export type FenceType = 'wood-picket' | 'privacy-panel' | 'vinyl-panel' | 'chain-link' | 'composite-panel' | 'custom';

export interface FenceInput extends FencePostInput {
  heightFt: number;
  fenceType: FenceType;
  wastePercent?: number;
  picketWidthIn?: number;
  picketSpacingIn?: number;
  panelWidthFt?: number;
  railsPerSection?: number;
  railStockLengthFt?: number;
  postHoleDiameterIn?: number;
  postHoleDepthIn?: number;
  /** For custom hardware systems. */
  fastenersPerPicketPerRail?: number;
  fastenersPerPanel?: number;
  fenceLabel?: string;
}

export interface FenceShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: 'posts' | 'rails' | 'pickets' | 'panels' | 'linear ft' | 'cubic yards' | 'pieces' | 'sets';
  notes?: string;
}

export interface FenceResult {
  fenceLabel: string;
  fenceType: FenceType;
  fenceLengthFt: number;
  netFenceRunFt: number;
  heightFt: number;
  wastePercent: number;
  posts: FencePostResult;
  railsPerSection: number;
  railLinearFtRequired: number;
  railPiecesRequired: number;
  picketsRequired?: number;
  panelsRequired?: number;
  chainLinkLinearFtRequired?: number;
  concrete: ReturnType<typeof calculateConcrete>;
  hardware: { fastenerCount: number; gateHardwareSets: number; note: string };
  shoppingList: FenceShoppingItem[];
  warnings: string[];
}

export interface FencePricing {
  postPrice?: number;
  railPricePerPiece?: number;
  railPricePerLinearFt?: number;
  picketPrice?: number;
  panelPrice?: number;
  chainLinkPricePerLinearFt?: number;
  concretePricePerCuYd?: number;
  hardwarePricePerUnit?: number;
  gatePrice?: number;
  laborPerLinearFt?: number;
  laborFlat?: number;
}

export interface FenceCostInput extends FenceInput {
  pricing: FencePricing;
}

export interface FenceCostLine {
  component: 'posts' | 'rails' | 'pickets' | 'panels' | 'chain-link' | 'concrete' | 'hardware' | 'gates' | 'labor';
  basis: string;
  unitPrice: number;
  quantity: number;
  cost: number;
}

export interface FenceCostResult {
  fence: FenceResult;
  lines: FenceCostLine[];
  materialCost: number;
  laborCost: number;
  totalCost: number;
  costIsComplete: boolean;
  missingPrices: string[];
}

export function calculateFence(input: FenceInput): FenceResult {
  requirePositive('heightFt', input.heightFt);
  requireNonEmptyString('fenceType', input.fenceType);

  const waste = input.wastePercent ?? ENGINE_ASSUMPTIONS.waste.defaultPercent;
  requirePercent('wastePercent', waste);

  const normalizedPostInput = { ...input, endCount: input.endCount ?? ENGINE_ASSUMPTIONS.fence.defaultEndPosts };
  const posts = calculateFencePosts(normalizedPostInput);
  const railsPerSection = input.railsPerSection ?? (input.heightFt <= 6 ? ENGINE_ASSUMPTIONS.fence.defaultRailsForUpTo6Ft : ENGINE_ASSUMPTIONS.fence.defaultRailsAbove6Ft);
  const railStockLengthFt = input.railStockLengthFt ?? ENGINE_ASSUMPTIONS.fence.defaultRailStockLengthFt;
  requirePositive('railsPerSection', railsPerSection);
  requirePositive('railStockLengthFt', railStockLengthFt);

  const railLinearFtRequired = posts.netFenceRunFt * railsPerSection;
  const railPiecesRequired = ceilSafe((railLinearFtRequired * (1 + waste / 100)) / railStockLengthFt);

  let picketsRequired: number | undefined;
  let panelsRequired: number | undefined;
  let chainLinkLinearFtRequired: number | undefined;

  if (input.fenceType === 'wood-picket') {
    const picketWidthIn = input.picketWidthIn ?? ENGINE_ASSUMPTIONS.fence.defaultPicketWidthIn;
    const picketSpacingIn = input.picketSpacingIn ?? ENGINE_ASSUMPTIONS.fence.defaultPicketSpacingIn;
    requirePositive('picketWidthIn', picketWidthIn);
    requireNonNegative('picketSpacingIn', picketSpacingIn);
    const pitchIn = picketWidthIn + picketSpacingIn;
    picketsRequired = ceilSafe(((posts.netFenceRunFt * 12) / pitchIn) * (1 + waste / 100));
  } else if (input.fenceType === 'privacy-panel' || input.fenceType === 'vinyl-panel' || input.fenceType === 'composite-panel') {
    const panelWidthFt = input.panelWidthFt ?? ENGINE_ASSUMPTIONS.fence.defaultPanelWidthFt;
    requirePositive('panelWidthFt', panelWidthFt);
    panelsRequired = ceilSafe((posts.netFenceRunFt / panelWidthFt) * (1 + waste / 100));
  } else if (input.fenceType === 'chain-link') {
    chainLinkLinearFtRequired = round(posts.netFenceRunFt * (1 + waste / 100), 2);
  }

  const postHoleDiameterIn = input.postHoleDiameterIn ?? ENGINE_ASSUMPTIONS.fence.postHoleDiameterIn;
  const postHoleDepthIn = input.postHoleDepthIn ?? ENGINE_ASSUMPTIONS.fence.postHoleDepthIn;
  const concrete = calculateConcrete({
    wastePercent: waste,
    parts: [{
      kind: 'post-hole',
      label: 'Fence post holes',
      diameterIn: postHoleDiameterIn,
      depthIn: postHoleDepthIn,
      count: posts.totalPosts,
    }],
  });

  const fastenerCount = fenceFastenerCount(input, posts.netFenceRunFt, railsPerSection, picketsRequired, panelsRequired, chainLinkLinearFtRequired, waste);
  const gateHardwareSets = (input.gateCount ?? input.gateWidthsFt?.length ?? 0) * ENGINE_ASSUMPTIONS.fence.gateHardwareSetsPerGate;

  const shoppingList: FenceShoppingItem[] = [
    { id: 'posts', name: 'Fence posts', quantity: posts.totalPosts, unit: 'posts' },
    { id: 'rails', name: 'Rails', quantity: railPiecesRequired, unit: 'rails', notes: `${railStockLengthFt} ft stock length.` },
    { id: 'concrete', name: 'Post-hole concrete', quantity: concrete.recommendedReadyMixCuYd, unit: 'cubic yards' },
    { id: 'hardware', name: 'Fence fasteners', quantity: fastenerCount, unit: 'pieces' },
  ];
  if (picketsRequired !== undefined) shoppingList.push({ id: 'pickets', name: 'Pickets', quantity: picketsRequired, unit: 'pickets' });
  if (panelsRequired !== undefined) shoppingList.push({ id: 'panels', name: 'Fence panels', quantity: panelsRequired, unit: 'panels' });
  if (chainLinkLinearFtRequired !== undefined) shoppingList.push({ id: 'chain-link', name: 'Chain-link mesh', quantity: chainLinkLinearFtRequired, unit: 'linear ft' });
  if (gateHardwareSets > 0) shoppingList.push({ id: 'gate-hardware', name: 'Gate hardware sets', quantity: gateHardwareSets, unit: 'sets' });

  const warnings: string[] = [
    'This is a material-planning estimate, not structural engineering or a substitute for local code requirements.',
    ...posts.notes,
    'Post-hole diameter and depth are editable planning assumptions. Gate posts, corners and soil conditions may require different details.',
  ];
  if (input.fenceType === 'chain-link') warnings.push('Chain-link systems also need system-specific terminal, tension and tie components that are not fully enumerated by this basic planner.');
  if (input.heightFt > ENGINE_ASSUMPTIONS.fence.heightWarningFt) warnings.push(`Fence height above ${ENGINE_ASSUMPTIONS.fence.heightWarningFt} ft may trigger additional engineering, permitting or material requirements. Confirm locally.`);

  return {
    fenceLabel: input.fenceLabel?.trim() || 'Fence Project',
    fenceType: input.fenceType,
    fenceLengthFt: round(input.fenceLengthFt, 2),
    netFenceRunFt: posts.netFenceRunFt,
    heightFt: round(input.heightFt, 2),
    wastePercent: waste,
    posts,
    railsPerSection,
    railLinearFtRequired: round(railLinearFtRequired, 2),
    railPiecesRequired,
    picketsRequired,
    panelsRequired,
    chainLinkLinearFtRequired,
    concrete,
    hardware: {
      fastenerCount,
      gateHardwareSets,
      note: input.fenceType === 'chain-link'
        ? 'Fastener estimate is a planning allowance; confirm tie/tension hardware with the selected system.'
        : 'Fastener estimate is a planning allowance based on the selected fence type.',
    },
    shoppingList,
    warnings,
  };
}

export function calculateFenceCost(input: FenceCostInput): FenceCostResult {
  const fence = calculateFence(input);
  const p = input.pricing;
  const lines: FenceCostLine[] = [];
  const missingPrices: string[] = [];

  const add = (component: FenceCostLine['component'], basis: string, unitPrice: number | undefined, quantity: number, missingLabel: string) => {
    if (quantity <= 0) return;
    if (unitPrice === undefined) { missingPrices.push(missingLabel); return; }
    requireNonNegative(`pricing.${missingLabel}`, unitPrice);
    lines.push({ component, basis, unitPrice, quantity: round(quantity, 2), cost: round(unitPrice * quantity, 2) });
  };

  add('posts', 'per post', p.postPrice, fence.posts.totalPosts, 'postPrice');
  if (p.railPricePerPiece !== undefined) add('rails', 'per rail', p.railPricePerPiece, fence.railPiecesRequired, 'railPricePerPiece');
  else add('rails', 'per linear foot', p.railPricePerLinearFt, fence.railLinearFtRequired * (1 + fence.wastePercent / 100), 'railPricePerLinearFt');

  if (fence.picketsRequired !== undefined) add('pickets', 'per picket', p.picketPrice, fence.picketsRequired, 'picketPrice');
  if (fence.panelsRequired !== undefined) add('panels', 'per panel', p.panelPrice, fence.panelsRequired, 'panelPrice');
  if (fence.chainLinkLinearFtRequired !== undefined) add('chain-link', 'per linear foot', p.chainLinkPricePerLinearFt, fence.chainLinkLinearFtRequired, 'chainLinkPricePerLinearFt');

  add('concrete', 'per cubic yard', p.concretePricePerCuYd, fence.concrete.recommendedReadyMixCuYd, 'concretePricePerCuYd');
  add('hardware', 'per hardware unit', p.hardwarePricePerUnit, fence.hardware.fastenerCount, 'hardwarePricePerUnit');
  add('gates', 'per gate', p.gatePrice, fence.posts.gatePosts / 2, 'gatePrice');

  const laborQuantity = fence.fenceLengthFt;
  let laborCost = 0;
  if (p.laborPerLinearFt !== undefined) {
    requireNonNegative('pricing.laborPerLinearFt', p.laborPerLinearFt);
    laborCost += p.laborPerLinearFt * laborQuantity;
    lines.push({ component: 'labor', basis: 'per linear foot', unitPrice: p.laborPerLinearFt, quantity: round(laborQuantity, 2), cost: round(p.laborPerLinearFt * laborQuantity, 2) });
  }
  if (p.laborFlat !== undefined) {
    requireNonNegative('pricing.laborFlat', p.laborFlat);
    laborCost += p.laborFlat;
    lines.push({ component: 'labor', basis: 'flat', unitPrice: p.laborFlat, quantity: 1, cost: round(p.laborFlat, 2) });
  }
  if (p.laborPerLinearFt === undefined && p.laborFlat === undefined) missingPrices.push('laborPerLinearFt or laborFlat');

  const materialCost = round(lines.filter((l) => l.component !== 'labor').reduce((sum, l) => sum + l.cost, 0), 2);
  laborCost = round(laborCost, 2);
  const costIsComplete = missingPrices.length === 0;

  return {
    fence,
    lines,
    materialCost,
    laborCost,
    totalCost: round(materialCost + laborCost, 2),
    costIsComplete,
    missingPrices: [...new Set(missingPrices)],
  };
}

function fenceFastenerCount(
  input: FenceInput,
  netRunFt: number,
  railsPerSection: number,
  picketsRequired: number | undefined,
  panelsRequired: number | undefined,
  chainLinkLinearFtRequired: number | undefined,
  wastePercent: number,
): number {
  if (picketsRequired !== undefined) {
    const per = input.fastenersPerPicketPerRail ?? ENGINE_ASSUMPTIONS.fence.screwsPerPicketPerRail;
    requirePositive('fastenersPerPicketPerRail', per);
    return ceilSafe(picketsRequired * railsPerSection * per * (1 + wastePercent / 100));
  }
  if (panelsRequired !== undefined) {
    const per = input.fastenersPerPanel ?? ENGINE_ASSUMPTIONS.fence.fastenersPerPanel;
    requirePositive('fastenersPerPanel', per);
    return ceilSafe(panelsRequired * per * (1 + wastePercent / 100));
  }
  if (chainLinkLinearFtRequired !== undefined) {
    return ceilSafe(chainLinkLinearFtRequired * ENGINE_ASSUMPTIONS.fence.chainLinkFastenersPerLinearFt);
  }
  return ceilSafe(netRunFt * railsPerSection * 2 * (1 + wastePercent / 100));
}

export function fencePostInputFromFence(input: FenceInput): FencePostInput {
  return {
    fenceLengthFt: input.fenceLengthFt,
    postSpacingFt: input.postSpacingFt,
    cornerCount: input.cornerCount,
    endCount: input.endCount,
    gateCount: input.gateCount,
    gateWidthFt: input.gateWidthFt,
    gateWidthsFt: input.gateWidthsFt,
  };
}
