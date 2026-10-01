import { CONCRETE_BAGS, CONCRETE_LB_PER_CU_FT } from '../../data/materials';
import { ENGINE_ASSUMPTIONS } from '../../data/assumptions';
import { ceilSafe, ceilTo, cuFtToCuM, cuFtToCuYd, round } from '../units';
import { CalcInputError, requireCalculationFinite, requireInteger, requirePercent, requirePositive } from '../validation';
import { DEFAULT_WASTE_PERCENT, type PurchaseAdvice } from './bulk';

export type ConcretePart =
  | { kind: 'slab'; label?: string; lengthFt: number; widthFt: number; thicknessIn: number }
  /** Continuous footing / grade beam. */
  | { kind: 'footing'; label?: string; lengthFt: number; widthIn: number; depthIn: number }
  /** Cylindrical holes, e.g. for fence or deck posts. */
  | { kind: 'post-hole'; label?: string; diameterIn: number; depthIn: number; count: number };

export interface ConcreteInput {
  parts: ConcretePart[];
  wastePercent?: number; // default 10
  /** Editable normal-weight concrete planning density. */
  concreteLbPerCuFt?: number;
  /** Editable ready-mix ordering increment. */
  readyMixIncrementCuYd?: number;
  /** Editable bag yields; verify against the actual product label. */
  bagSpecs?: readonly ConcreteBagSpec[];
}

export interface ConcretePartResult {
  label: string;
  kind: ConcretePart['kind'];
  volumeCuFt: number;
}

export interface ConcreteBagSpec {
  bagLb: number;
  yieldCuFt: number;
}

export interface ConcreteBagEstimate extends ConcreteBagSpec {
  count: number;
}

export interface ConcreteResult {
  parts: ConcretePartResult[];
  wastePercent: number;
  volumeCuFt: number; // before waste
  orderCuFt: number; // with waste
  orderCuYd: number;
  orderCuM: number;
  /** orderCuYd rounded UP to 0.25 for ready-mix ordering. */
  recommendedReadyMixCuYd: number;
  bags: ConcreteBagEstimate[];
  approxWeightLb: number;
  purchaseAdvice: PurchaseAdvice;
  warnings: string[];
}

function partVolumeCuFt(part: ConcretePart, label: string): number {
  switch (part.kind) {
    case 'slab': {
      requirePositive(`${label}.lengthFt`, part.lengthFt);
      requirePositive(`${label}.widthFt`, part.widthFt);
      requirePositive(`${label}.thicknessIn`, part.thicknessIn);
      const volume = part.lengthFt * part.widthFt * (part.thicknessIn / 12);
      requireCalculationFinite(`${label}.volumeCuFt`, volume);
      return volume;
    }
    case 'footing': {
      requirePositive(`${label}.lengthFt`, part.lengthFt);
      requirePositive(`${label}.widthIn`, part.widthIn);
      requirePositive(`${label}.depthIn`, part.depthIn);
      const volume = part.lengthFt * (part.widthIn / 12) * (part.depthIn / 12);
      requireCalculationFinite(`${label}.volumeCuFt`, volume);
      return volume;
    }
    case 'post-hole': {
      requirePositive(`${label}.diameterIn`, part.diameterIn);
      requirePositive(`${label}.depthIn`, part.depthIn);
      requireInteger(`${label}.count`, part.count, 1);
      const r = part.diameterIn / 2 / 12;
      const volume = Math.PI * r * r * (part.depthIn / 12) * part.count;
      requireCalculationFinite(`${label}.volumeCuFt`, volume);
      return volume;
    }
    default:
      throw new CalcInputError(label, 'Unsupported concrete part.');
  }
}

/**
 * Ready-mix vs bags: a planning heuristic, not a rule. Short-load fees and minimums vary by supplier.
 * < 0.5 cu yd: bags; 0.5–1.5: either; > 1.5: ready-mix is usually easier.
 */
function concreteAdvice(cuYd: number): PurchaseAdvice {
  if (cuYd < ENGINE_ASSUMPTIONS.concrete.bagsAdviceBelowCuYd) return 'bags';
  if (cuYd <= ENGINE_ASSUMPTIONS.concrete.bagsAdviceAboveCuYd) return 'either';
  return 'bulk';
}

export function calculateConcrete(input: ConcreteInput): ConcreteResult {
  if (!Array.isArray(input.parts) || input.parts.length === 0) {
    throw new CalcInputError('parts', 'Add at least one section to calculate.');
  }
  const waste = input.wastePercent ?? DEFAULT_WASTE_PERCENT;
  requirePercent('wastePercent', waste);

  const parts: ConcretePartResult[] = input.parts.map((p, i) => {
    const label = p.label ?? `${p.kind} ${i + 1}`;
    return { label, kind: p.kind, volumeCuFt: partVolumeCuFt(p, `parts[${i}]`) };
  });

  const volumeCuFt = parts.reduce((s, p) => {
    const next = s + p.volumeCuFt;
    requireCalculationFinite('volumeCuFt', next);
    return next;
  }, 0);
  const orderCuFt = volumeCuFt * (1 + waste / 100);
  requireCalculationFinite('orderCuFt', orderCuFt);
  const orderCuYd = cuFtToCuYd(orderCuFt);

  const warnings: string[] = [];
  input.parts.forEach((p, i) => {
    if (p.kind === 'slab' && p.thicknessIn < ENGINE_ASSUMPTIONS.concrete.slabThicknessWarningBelowIn) {
      warnings.push(
        `Slab ${i + 1} is ${p.thicknessIn} in thick, which is thinner than the 4 in commonly used for patios and walkways.`,
      );
    }
  });
  if (waste < ENGINE_ASSUMPTIONS.waste.lowMarginBelowPercent) {
    warnings.push('A waste allowance under 5% leaves little margin for uneven subgrade or spillage.');
  }

  const concreteLbPerCuFt = input.concreteLbPerCuFt ?? CONCRETE_LB_PER_CU_FT;
  requirePositive('concreteLbPerCuFt', concreteLbPerCuFt);
  const readyMixIncrementCuYd = input.readyMixIncrementCuYd ?? ENGINE_ASSUMPTIONS.concrete.readyMixIncrementCuYd;
  requirePositive('readyMixIncrementCuYd', readyMixIncrementCuYd);
  const bagSpecs = input.bagSpecs ?? CONCRETE_BAGS;
  if (!Array.isArray(bagSpecs) || bagSpecs.length === 0) throw new CalcInputError('bagSpecs', 'Provide at least one concrete bag specification.');
  bagSpecs.forEach((b, i) => {
    requirePositive(`bagSpecs[${i}].bagLb`, b.bagLb);
    requirePositive(`bagSpecs[${i}].yieldCuFt`, b.yieldCuFt);
  });

  return {
    parts: parts.map((p) => ({ ...p, volumeCuFt: round(p.volumeCuFt, 2) })),
    wastePercent: waste,
    volumeCuFt: round(volumeCuFt, 2),
    orderCuFt: round(orderCuFt, 2),
    orderCuYd: round(orderCuYd, 2),
    orderCuM: round(cuFtToCuM(orderCuFt), 2),
    recommendedReadyMixCuYd: ceilTo(orderCuYd, readyMixIncrementCuYd),
    bags: bagSpecs.map((b) => ({
      bagLb: b.bagLb,
      yieldCuFt: b.yieldCuFt,
      count: ceilSafe(orderCuFt / b.yieldCuFt),
    })),
    approxWeightLb: Math.round(orderCuFt * concreteLbPerCuFt),
    purchaseAdvice: concreteAdvice(orderCuYd),
    warnings,
  };
}
