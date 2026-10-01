import type { MaterialId } from '../../data/materials';
import { ENGINE_ASSUMPTIONS } from '../../data/assumptions';
import { ceilSafe, round } from '../units';
import { CalcInputError, requireCalculationFinite, requireNonEmptyString, requireNonNegative, requirePositive } from '../validation';
import { calculateBulk, DEFAULT_WASTE_PERCENT, type BulkResult } from './bulk';
import { totalAreaSqFt, type Shape } from './geometry';

export interface DrivewayLayerInput {
  name: string;
  depthIn: number;
  material?: MaterialId; // default 'gravel'
  /** Compaction allowance, >= 1. */
  compactionFactor?: number;
  densityTonsPerCuYd?: number;
  /** Supply at most one of these to price this layer. */
  pricePerTon?: number;
  pricePerCuYd?: number;
}

export interface DrivewayInput {
  /** One or more sections (dimensions in feet). Supports L-shapes, turnarounds, parking pads. */
  sections: Shape[];
  /** Defaults to base / middle / surface. */
  layers?: DrivewayLayerInput[];
  wastePercent?: number;
  truckCapacityTons?: number;
  deliveryFeePerLoad?: number;
}

/**
 * Starting point only. Required depth depends on soil, drainage, climate and traffic,
 * so the UI must let users edit every layer.
 */
export const DEFAULT_DRIVEWAY_LAYERS: DrivewayLayerInput[] = ENGINE_ASSUMPTIONS.driveway.layers.map((layer) => ({ ...layer }));

export interface DrivewayLayerResult {
  name: string;
  depthIn: number;
  result: BulkResult;
  materialCost?: number;
}

export interface DrivewayResult {
  areaSqFt: number;
  totalDepthIn: number;
  layers: DrivewayLayerResult[];
  totalVolumeCuYd: number;
  /** Sum of each layer's order quantity rounded up to 0.25 cu yd. */
  totalOrderCuYd: number;
  totalTons: number;
  delivery?: { loads: number; truckCapacityTons: number; feePerLoad: number; totalFee: number };
  /** Sum of priced layers only; see costIsComplete. */
  materialCost?: number;
  totalCost?: number;
  costIsComplete: boolean;
  warnings: string[];
}

export function calculateDriveway(input: DrivewayInput): DrivewayResult {
  const areaSqFt = totalAreaSqFt(input.sections);
  const layers = input.layers ?? DEFAULT_DRIVEWAY_LAYERS;
  if (layers.length === 0) {
    throw new CalcInputError('layers', 'Add at least one layer.');
  }
  const waste = input.wastePercent ?? DEFAULT_WASTE_PERCENT;

  const layerResults: DrivewayLayerResult[] = layers.map((layer, i) => {
    requireNonEmptyString(`layers[${i}].name`, layer.name);
    if (layer.pricePerTon !== undefined && layer.pricePerCuYd !== undefined) {
      throw new CalcInputError(`layers[${i}]`, 'Give a price per ton or per cubic yard for a layer, not both.');
    }
    const result = calculateBulk({
      material: layer.material ?? 'gravel',
      areas: input.sections,
      depthIn: layer.depthIn,
      wastePercent: waste,
      compactionFactor: layer.compactionFactor,
      densityTonsPerCuYd: layer.densityTonsPerCuYd,
      pricing:
        layer.pricePerTon !== undefined
          ? { perTon: layer.pricePerTon }
          : layer.pricePerCuYd !== undefined
            ? { perCuYd: layer.pricePerCuYd }
            : undefined,
    });
    return { name: layer.name, depthIn: layer.depthIn, result, materialCost: result.costs[0]?.materialCost };
  });

  const totalDepthIn = layers.reduce((s, l) => s + l.depthIn, 0);
  requireCalculationFinite('totalDepthIn', totalDepthIn);
  const totalVolumeCuYd = layerResults.reduce((s, l) => s + l.result.volumeCuYd, 0);
  const totalOrderCuYd = layerResults.reduce((s, l) => s + l.result.recommendedOrderCuYd, 0);
  const totalTons = layerResults.reduce((s, l) => s + l.result.tons, 0);
  requireCalculationFinite('totalVolumeCuYd', totalVolumeCuYd);
  requireCalculationFinite('totalOrderCuYd', totalOrderCuYd);
  requireCalculationFinite('totalTons', totalTons);

  const priced = layerResults.filter((l) => l.materialCost !== undefined);
  const costIsComplete = priced.length === layerResults.length;
  let materialCost: number | undefined = priced.length
    ? priced.reduce((s, l) => s + (l.materialCost ?? 0), 0)
    : undefined;

  let delivery: DrivewayResult['delivery'];
  if (input.deliveryFeePerLoad !== undefined && input.truckCapacityTons === undefined) {
    throw new CalcInputError('deliveryFeePerLoad', 'Provide truckCapacityTons when using a per-load delivery fee.');
  }

  if (input.truckCapacityTons !== undefined) {
    requirePositive('truckCapacityTons', input.truckCapacityTons);
    const feePerLoad = input.deliveryFeePerLoad ?? 0;
    requireNonNegative('deliveryFeePerLoad', feePerLoad);
    const loads = ceilSafe(totalTons / input.truckCapacityTons);
    delivery = {
      loads,
      truckCapacityTons: input.truckCapacityTons,
      feePerLoad,
      totalFee: round(loads * feePerLoad, 2),
    };
  }

  const totalCost =
    materialCost !== undefined ? round(materialCost + (delivery?.totalFee ?? 0), 2) : undefined;
  if (materialCost !== undefined) materialCost = round(materialCost, 2);

  const warnings: string[] = [];
  if (totalDepthIn < 6) {
    warnings.push(
      `A total depth of ${totalDepthIn} in is on the light side for regular vehicle traffic. ` +
      'Soil, drainage and climate can call for more. Ask a local contractor if you are unsure.',
    );
  }
  warnings.push(...layerResults.flatMap((l) => l.result.warnings.map((w) => `${l.name}: ${w}`)));
  if (priced.length > 0 && !costIsComplete) {
    warnings.push('Some layers have no price entered, so the cost shown is incomplete.');
  }

  return {
    areaSqFt: round(areaSqFt, 2),
    totalDepthIn: round(totalDepthIn, 2),
    layers: layerResults,
    totalVolumeCuYd: round(totalVolumeCuYd, 2),
    totalOrderCuYd,
    totalTons: round(totalTons, 2),
    delivery,
    materialCost,
    totalCost,
    costIsComplete,
    warnings,
  };
}
