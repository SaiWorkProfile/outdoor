import { MATERIALS, type MaterialId } from '../../data/materials';
import { ENGINE_ASSUMPTIONS } from '../../data/assumptions';
import { getUseCase } from '../../data/useCases';
import {
  ceilSafe,
  ceilTo,
  cuFtToCuM,
  cuFtToCuYd,
  cuYdToCuFt,
  round,
  shortTonsToTonnes,
  sqFtToSqM,
} from '../units';
import {
  CalcInputError,
  requireCalculationFinite,
  requireNonNegative,
  requirePercent,
  requirePositive,
} from '../validation';
import { totalAreaSqFt, type Shape } from './geometry';

export const DEFAULT_WASTE_PERCENT = ENGINE_ASSUMPTIONS.waste.defaultPercent;

export interface Pricing {
  perCuYd?: number;
  perTon?: number;
  perBag?: { bagCuFt: number; price: number };
  /** Flat delivery fee for the whole order, if any. */
  deliveryFee?: number;
}

export interface BulkInput {
  material: MaterialId;
  /** One or more areas, dimensions in feet. */
  areas: Shape[];
  depthIn: number;
  /** Extra material for spillage, uneven ground, etc. Default 10. */
  wastePercent?: number;
  /** >= 1. Use for materials that compact (bases). 1.15 = order 15% more. Default 1. */
  compactionFactor?: number;
  /** Override the material's typical tons-per-cubic-yard. */
  densityTonsPerCuYd?: number;
  /** Optional use-case preset id; only used to produce depth warnings. */
  useCase?: string;
  /** Prices are always supplied by the user. The engine never invents prices. */
  pricing?: Pricing;
  /** Editable bag sizes in cubic feet; defaults come from the centralized assumptions. */
  bagSizesCuFt?: number[];
  /** If set, the result includes how many truckloads the tonnage needs. */
  truckCapacityTons?: number;
}

export interface BagEstimate {
  bagCuFt: number;
  count: number;
}

export interface CostEstimate {
  basis: 'per-cubic-yard' | 'per-ton' | 'per-bag';
  unitPrice: number;
  quantity: number;
  materialCost: number;
  deliveryFee: number;
  total: number;
}

export type PurchaseAdvice = 'bags' | 'either' | 'bulk';

export interface BulkResult {
  material: MaterialId;
  areaSqFt: number;
  areaSqM: number;
  depthIn: number;
  wastePercent: number;
  compactionFactor: number;
  densityUsed: number;

  /** Volume before waste/compaction. */
  baseVolumeCuFt: number;
  baseVolumeCuYd: number;
  /** Volume including compaction and waste (what you should plan to buy). */
  volumeCuFt: number;
  volumeCuYd: number;
  volumeCuM: number;
  /** volumeCuYd rounded UP to the nearest 0.25 for ordering. */
  recommendedOrderCuYd: number;

  tons: number;
  tonnes: number;
  bags: BagEstimate[];
  purchaseAdvice: PurchaseAdvice;
  costs: CostEstimate[];
  loads?: number;
  warnings: string[];
}

/**
 * Heuristic: bags get impractical as volume grows. This is a planning hint, not a rule.
 * < 0.5 cu yd: bags; 0.5–2 cu yd: either; > 2 cu yd: bulk delivery is usually easier.
 */
function purchaseAdviceFor(volumeCuYd: number): PurchaseAdvice {
  if (volumeCuYd < ENGINE_ASSUMPTIONS.bulk.bagsBelowCuYd) return 'bags';
  if (volumeCuYd <= ENGINE_ASSUMPTIONS.bulk.bulkAboveCuYd) return 'either';
  return 'bulk';
}

export function calculateBulk(input: BulkInput): BulkResult {
  const spec = MATERIALS[input.material];
  if (!spec) throw new CalcInputError('material', `Unknown material "${input.material}".`);

  requirePositive('depthIn', input.depthIn);
  const waste = input.wastePercent ?? DEFAULT_WASTE_PERCENT;
  requirePercent('wastePercent', waste);

  const compaction = input.compactionFactor ?? ENGINE_ASSUMPTIONS.bulk.defaultCompactionFactor;
  requirePositive('compactionFactor', compaction);
  if (compaction < 1) {
    throw new CalcInputError('compactionFactor', 'compactionFactor must be 1 or greater.');
  }

  const density = input.densityTonsPerCuYd ?? spec.density.typical;
  requirePositive('densityTonsPerCuYd', density);

  const areaSqFt = totalAreaSqFt(input.areas);
  const baseVolumeCuFt = (areaSqFt * input.depthIn) / 12;
  requireCalculationFinite('baseVolumeCuFt', baseVolumeCuFt);
  const volumeCuFt = baseVolumeCuFt * compaction * (1 + waste / 100);
  requireCalculationFinite('volumeCuFt', volumeCuFt);
  const volumeCuYd = cuFtToCuYd(volumeCuFt);
  const recommendedOrderCuYd = ceilTo(volumeCuYd, ENGINE_ASSUMPTIONS.truck.orderGranularityCuYd);
  const tons = volumeCuYd * density;

  const warnings: string[] = [];
  if (waste > ENGINE_ASSUMPTIONS.waste.warningAbovePercent) {
    warnings.push(`A waste allowance of ${waste}% is unusually high. ${ENGINE_ASSUMPTIONS.bulk.typicalWasteMinPercent}–${ENGINE_ASSUMPTIONS.bulk.typicalWasteMaxPercent}% is a common planning range for many projects.`);
  }
  if (input.densityTonsPerCuYd !== undefined &&
      (density < spec.density.min || density > spec.density.max)) {
    warnings.push(
      `The density you entered (${density} tons/cu yd) is outside the typical range for ${spec.name.toLowerCase()} ` +
      `(${spec.density.min}–${spec.density.max}). Confirm it with your supplier.`,
    );
  }
  if (input.useCase !== undefined) {
    const uc = getUseCase(input.material, input.useCase);
    if (!uc) {
      throw new CalcInputError('useCase', `Unknown use case "${input.useCase}" for ${spec.name}.`);
    }
    if (input.depthIn < uc.minDepthIn || input.depthIn > uc.maxDepthIn) {
      warnings.push(
        `A depth of ${input.depthIn} in is outside the typical ${uc.minDepthIn}–${uc.maxDepthIn} in range for ` +
        `"${uc.label.toLowerCase()}". That can be right for your site, but double-check it.`,
      );
    }
  }

  const bagSizes = input.bagSizesCuFt ?? spec.bagSizesCuFt;
  if (!Array.isArray(bagSizes) || bagSizes.length === 0) {
    throw new CalcInputError('bagSizesCuFt', 'Provide at least one bag size.');
  }
  bagSizes.forEach((bagCuFt, i) => requirePositive(`bagSizesCuFt[${i}]`, bagCuFt));
  const bags: BagEstimate[] = bagSizes.map((bagCuFt) => ({
    bagCuFt,
    count: ceilSafe(volumeCuFt / bagCuFt),
  }));

  const costs = buildCosts(input.pricing, { volumeCuFt, recommendedOrderCuYd, tons });

  let loads: number | undefined;
  if (input.truckCapacityTons !== undefined) {
    requirePositive('truckCapacityTons', input.truckCapacityTons);
    loads = ceilSafe(tons / input.truckCapacityTons);
  }

  return {
    material: input.material,
    areaSqFt: round(areaSqFt, 2),
    areaSqM: round(sqFtToSqM(areaSqFt), 2),
    depthIn: input.depthIn,
    wastePercent: waste,
    compactionFactor: compaction,
    densityUsed: density,
    baseVolumeCuFt: round(baseVolumeCuFt, 2),
    baseVolumeCuYd: round(cuFtToCuYd(baseVolumeCuFt), 2),
    volumeCuFt: round(volumeCuFt, 2),
    volumeCuYd: round(volumeCuYd, 2),
    volumeCuM: round(cuFtToCuM(volumeCuFt), 2),
    recommendedOrderCuYd,
    tons: round(tons, 2),
    tonnes: round(shortTonsToTonnes(tons), 2),
    bags,
    purchaseAdvice: purchaseAdviceFor(volumeCuYd),
    costs,
    loads,
    warnings,
  };
}

function buildCosts(
  pricing: Pricing | undefined,
  q: { volumeCuFt: number; recommendedOrderCuYd: number; tons: number },
): CostEstimate[] {
  if (!pricing) return [];
  const fee = pricing.deliveryFee ?? 0;
  requireNonNegative('pricing.deliveryFee', fee);
  const out: CostEstimate[] = [];

  const push = (basis: CostEstimate['basis'], unitPrice: number, quantity: number) => {
    const materialCost = unitPrice * quantity;
    out.push({
      basis,
      unitPrice,
      quantity: round(quantity, 2),
      materialCost: round(materialCost, 2),
      deliveryFee: round(fee, 2),
      total: round(materialCost + fee, 2),
    });
  };

  if (pricing.perCuYd !== undefined) {
    requireNonNegative('pricing.perCuYd', pricing.perCuYd);
    push('per-cubic-yard', pricing.perCuYd, q.recommendedOrderCuYd);
  }
  if (pricing.perTon !== undefined) {
    requireNonNegative('pricing.perTon', pricing.perTon);
    push('per-ton', pricing.perTon, q.tons);
  }
  if (pricing.perBag !== undefined) {
    requirePositive('pricing.perBag.bagCuFt', pricing.perBag.bagCuFt);
    requireNonNegative('pricing.perBag.price', pricing.perBag.price);
    push('per-bag', pricing.perBag.price, ceilSafe(q.volumeCuFt / pricing.perBag.bagCuFt));
  }
  return out;
}

/** Compare several depths side by side (e.g. mulch at 2", 3" and 4"). */
export function compareDepths(
  input: Omit<BulkInput, 'depthIn'>,
  depthsIn: number[] = [2, 3, 4],
): { depthIn: number; result: BulkResult }[] {
  return depthsIn.map((depthIn) => ({ depthIn, result: calculateBulk({ ...input, depthIn }) }));
}

/** How many square feet a given volume will cover at a given depth (for "coverage" answers). */
export function coverageSqFt(volumeCuYd: number, depthIn: number): number {
  requirePositive('volumeCuYd', volumeCuYd);
  requirePositive('depthIn', depthIn);
  return round((cuYdToCuFt(volumeCuYd) * 12) / depthIn, 1);
}
