/** Thrown for invalid calculator input. `field` lets the UI highlight the offending input. */
export class CalcInputError extends Error {
  field: string;
  constructor(field: string, message: string) {
    super(message);
    this.name = 'CalcInputError';
    this.field = field;
  }
}

export type CalcResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: { field: string; message: string } };

/** UI-friendly wrapper: converts CalcInputError into a result object. Other errors still throw. */
export function tryCalculate<T>(fn: () => T): CalcResult<T> {
  try {
    return { ok: true, value: fn() };
  } catch (e) {
    if (e instanceof CalcInputError) {
      return { ok: false, error: { field: e.field, message: e.message } };
    }
    throw e;
  }
}

export function requireFinite(field: string, v: number): void {
  if (typeof v !== 'number' || !Number.isFinite(v)) {
    throw new CalcInputError(field, `${field} must be a valid number.`);
  }
}

export function requireNonEmptyString(field: string, v: string): void {
  if (typeof v !== 'string' || v.trim().length === 0) {
    throw new CalcInputError(field, `${field} cannot be empty.`);
  }
}

export function requirePositive(field: string, v: number): void {
  requireFinite(field, v);
  if (v <= 0) throw new CalcInputError(field, `${field} must be greater than zero.`);
}

export function requireNonNegative(field: string, v: number): void {
  requireFinite(field, v);
  if (v < 0) throw new CalcInputError(field, `${field} cannot be negative.`);
}

export function requirePercent(field: string, v: number): void {
  requireFinite(field, v);
  if (v < 0 || v > 100) throw new CalcInputError(field, `${field} must be between 0 and 100.`);
}

export function requireInteger(field: string, v: number, min = 0): void {
  requireFinite(field, v);
  if (!Number.isInteger(v) || v < min) {
    throw new CalcInputError(field, `${field} must be a whole number of at least ${min}.`);
  }
}

/** Reject overflowed intermediate results while preserving very large but finite projects. */
export function requireCalculationFinite(field: string, v: number): void {
  if (!Number.isFinite(v)) {
    throw new CalcInputError(field, 'The calculation is too large for safe numeric processing. Reduce the project size or split it into sections.');
  }
}
