import { requireCalculationFinite, requireFinite } from '../validation';

export type UnitSystem = 'us' | 'metric';
export type LengthUnit = 'in' | 'ft' | 'yd' | 'mm' | 'cm' | 'm';

export const CU_FT_PER_CU_YD = 27;
export const CU_M_PER_CU_FT = 0.3048 ** 3;
export const SQ_M_PER_SQ_FT = 0.3048 ** 2;
export const LB_PER_SHORT_TON = 2000;
export const KG_PER_LB = 0.45359237;
export const TONNES_PER_SHORT_TON = 0.90718474;

const FEET_PER_UNIT: Record<LengthUnit, number> = {
  in: 1 / 12,
  ft: 1,
  yd: 3,
  mm: 0.001 / 0.3048,
  cm: 0.01 / 0.3048,
  m: 1 / 0.3048,
};

/** Convert any supported length to feet (the engine's internal unit). */
export function toFeet(value: number, unit: LengthUnit): number {
  requireFinite('value', value);
  const factor = FEET_PER_UNIT[unit];
  if (factor === undefined) throw new Error(`Unsupported length unit: ${unit}`);
  const result = value * factor;
  requireCalculationFinite('length', result);
  return result;
}

/** Convert any supported length to inches (used for depths/thicknesses). */
export function toInches(value: number, unit: LengthUnit): number {
  const result = toFeet(value, unit) * 12;
  requireCalculationFinite('length', result);
  return result;
}

export const cuFtToCuYd = (cf: number): number => {
  requireFinite('cubicFeet', cf);
  const result = cf / CU_FT_PER_CU_YD;
  requireCalculationFinite('cubicYards', result);
  return result;
};

export const cuYdToCuFt = (cy: number): number => {
  requireFinite('cubicYards', cy);
  const result = cy * CU_FT_PER_CU_YD;
  requireCalculationFinite('cubicFeet', result);
  return result;
};

export const cuFtToCuM = (cf: number): number => {
  requireFinite('cubicFeet', cf);
  const result = cf * CU_M_PER_CU_FT;
  requireCalculationFinite('cubicMeters', result);
  return result;
};

export const sqFtToSqM = (sf: number): number => {
  requireFinite('squareFeet', sf);
  const result = sf * SQ_M_PER_SQ_FT;
  requireCalculationFinite('squareMeters', result);
  return result;
};

export const shortTonsToTonnes = (t: number): number => {
  requireFinite('shortTons', t);
  const result = t * TONNES_PER_SHORT_TON;
  requireCalculationFinite('tonnes', result);
  return result;
};

/** Round for display. Never round intermediate values. */
export function round(n: number, dp = 2): number {
  requireFinite('number', n);
  requireFinite('decimalPlaces', dp);
  if (!Number.isInteger(dp) || dp < 0 || dp > 12) throw new Error('decimalPlaces must be an integer from 0 to 12.');
  const f = 10 ** dp;
  return Math.round((n + Number.EPSILON) * f) / f;
}

/** Ceiling that tolerates floating-point noise (e.g. 61.00000000001 -> 61). */
export function ceilSafe(n: number): number {
  requireFinite('number', n);
  return Math.ceil(n - 1e-9);
}

/** Round UP to the nearest step (e.g. 0.25 cubic yards). */
export function ceilTo(n: number, step: number): number {
  requireFinite('number', n);
  requirePositiveStep(step);
  return round(ceilSafe(n / step) * step, 12);
}

function requirePositiveStep(step: number): void {
  if (!Number.isFinite(step) || step <= 0) throw new Error('step must be a finite value greater than zero.');
}
