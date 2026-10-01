import { CalcInputError, requireCalculationFinite, requirePositive } from '../validation';

/** All dimensions are in FEET. The UI converts from other units before calling the engine. */
export type Shape =
  | { kind: 'rectangle'; length: number; width: number }
  | { kind: 'circle'; diameter: number }
  | { kind: 'triangle'; base: number; height: number }
  | { kind: 'area'; sqFt: number };

export function shapeAreaSqFt(shape: Shape, label = 'shape'): number {
  switch (shape.kind) {
    case 'rectangle': {
      requirePositive(`${label}.length`, shape.length);
      requirePositive(`${label}.width`, shape.width);
      const area = shape.length * shape.width;
      requireCalculationFinite(`${label}.areaSqFt`, area);
      return area;
    }
    case 'circle': {
      requirePositive(`${label}.diameter`, shape.diameter);
      const area = Math.PI * (shape.diameter / 2) ** 2;
      requireCalculationFinite(`${label}.areaSqFt`, area);
      return area;
    }
    case 'triangle': {
      requirePositive(`${label}.base`, shape.base);
      requirePositive(`${label}.height`, shape.height);
      const area = 0.5 * shape.base * shape.height;
      requireCalculationFinite(`${label}.areaSqFt`, area);
      return area;
    }
    case 'area': {
      requirePositive(`${label}.sqFt`, shape.sqFt);
      requireCalculationFinite(`${label}.areaSqFt`, shape.sqFt);
      return shape.sqFt;
    }
    default:
      throw new CalcInputError(label, 'Unsupported shape.');
  }
}

/** Sum of one or more areas (supports "multiple areas" in a single calculation). */
export function totalAreaSqFt(shapes: Shape[]): number {
  if (!Array.isArray(shapes) || shapes.length === 0) {
    throw new CalcInputError('areas', 'Add at least one area to calculate.');
  }
  const total = shapes.reduce((sum, s, i) => {
    const next = sum + shapeAreaSqFt(s, `areas[${i}]`);
    requireCalculationFinite(`areas[${i}]`, next);
    return next;
  }, 0);
  return total;
}
