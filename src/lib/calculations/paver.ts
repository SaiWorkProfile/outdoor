import { ENGINE_ASSUMPTIONS } from '../../data/assumptions';
import { calculateBulk, DEFAULT_WASTE_PERCENT, type Pricing as BulkPricing } from './bulk';
import { shapeAreaSqFt, totalAreaSqFt, type Shape } from './geometry';
import { ceilSafe, round, sqFtToSqM } from '../units';
import {
  CalcInputError,
  requireCalculationFinite,
  requireNonNegative,
  requirePercent,
  requirePositive,
} from '../validation';

export interface PaverPricing {
  perPaver?: number;
  perSqFt?: number;
  base?: BulkPricing;
  beddingSand?: BulkPricing;
  edgingPerLinearFt?: number;
  edgingPerPiece?: number;
  edgePieceLengthFt?: number;
}

export interface PaverInput {
  areas: Shape[];
  paverLengthIn: number;
  paverWidthIn: number;
  jointWidthIn?: number;
  wastePercent?: number;
  baseDepthIn?: number;
  beddingSandDepthIn?: number;
  baseCompactionFactor?: number;
  beddingSandCompactionFactor?: number;
  /** Optional total edge length. If omitted, it is derived where the shape has a known perimeter. */
  edgeLinearFt?: number;
  pricing?: PaverPricing;
}

export interface PaverCostLine {
  component: 'pavers' | 'base' | 'bedding-sand' | 'edging';
  basis: string;
  unitPrice: number;
  quantity: number;
  materialCost: number;
}

export interface PaverShoppingItem {
  id: 'pavers' | 'paver-base' | 'bedding-sand' | 'edge-restraint-linear' | 'edge-restraint-pieces';
  name: string;
  quantity: number;
  unit: 'pavers' | 'sq ft' | 'cubic yards' | 'tons' | 'linear ft' | 'pieces';
  notes?: string;
}

export interface PaverResult {
  areaSqFt: number;
  areaSqM: number;
  paverAreaSqIn: number;
  paverModuleSqIn: number;
  paverCountBeforeWaste: number;
  paversRequired: number;
  paverSurfaceSqFtOrdered: number;
  wastePercent: number;
  paverLengthIn: number;
  paverWidthIn: number;
  jointWidthIn: number;
  baseDepthIn: number;
  beddingSandDepthIn: number;
  base: ReturnType<typeof calculateBulk>;
  beddingSand: ReturnType<typeof calculateBulk>;
  edgeLinearFt: number;
  edgeOrderLinearFt: number;
  edgePieces?: number;
  costs: PaverCostLine[];
  shoppingList: PaverShoppingItem[];
  warnings: string[];
}

export function calculatePavers(input: PaverInput): PaverResult {
  if (!Array.isArray(input.areas) || input.areas.length === 0) {
    throw new CalcInputError('areas', 'Add at least one paver area to calculate.');
  }
  requirePositive('paverLengthIn', input.paverLengthIn);
  requirePositive('paverWidthIn', input.paverWidthIn);

  const jointWidthIn = input.jointWidthIn ?? ENGINE_ASSUMPTIONS.paver.defaultJointWidthIn;
  requireNonNegative('jointWidthIn', jointWidthIn);
  requirePercent('wastePercent', input.wastePercent ?? DEFAULT_WASTE_PERCENT);
  const waste = input.wastePercent ?? DEFAULT_WASTE_PERCENT;

  const baseDepthIn = input.baseDepthIn ?? ENGINE_ASSUMPTIONS.paver.baseDepthIn;
  const beddingSandDepthIn = input.beddingSandDepthIn ?? ENGINE_ASSUMPTIONS.paver.beddingSandDepthIn;
  const baseCompaction = input.baseCompactionFactor ?? ENGINE_ASSUMPTIONS.paver.baseCompactionFactor;
  const beddingCompaction = input.beddingSandCompactionFactor ?? ENGINE_ASSUMPTIONS.paver.beddingSandCompactionFactor;
  requirePositive('baseDepthIn', baseDepthIn);
  requirePositive('beddingSandDepthIn', beddingSandDepthIn);
  requirePositive('baseCompactionFactor', baseCompaction);
  requirePositive('beddingSandCompactionFactor', beddingCompaction);

  const areaSqFt = totalAreaSqFt(input.areas);
  const areaSqIn = areaSqFt * 144;
  const paverAreaSqIn = input.paverLengthIn * input.paverWidthIn;
  const paverModuleSqIn = (input.paverLengthIn + jointWidthIn) * (input.paverWidthIn + jointWidthIn);
  requireCalculationFinite('paverAreaSqIn', paverAreaSqIn);
  requireCalculationFinite('paverModuleSqIn', paverModuleSqIn);

  const paverCountBeforeWaste = ceilSafe(areaSqIn / paverModuleSqIn);
  const paversRequired = ceilSafe(paverCountBeforeWaste * (1 + waste / 100));
  const paverSurfaceSqFtOrdered = round((areaSqFt * (1 + waste / 100)), 2);

  const base = calculateBulk({
    material: 'paver-base',
    areas: input.areas,
    depthIn: baseDepthIn,
    wastePercent: waste,
    compactionFactor: baseCompaction,
    pricing: input.pricing?.base,
  });

  const beddingSand = calculateBulk({
    material: 'sand',
    areas: input.areas,
    depthIn: beddingSandDepthIn,
    wastePercent: waste,
    compactionFactor: beddingCompaction,
    pricing: input.pricing?.beddingSand,
  });

  const edgeLinearFt = input.edgeLinearFt ?? deriveEdgeLinearFt(input.areas);
  requireNonNegative('edgeLinearFt', edgeLinearFt);
  const edgeOrderLinearFt = round(edgeLinearFt * (1 + waste / 100), 2);

  const edgePieceLengthFt = input.pricing?.edgePieceLengthFt ?? ENGINE_ASSUMPTIONS.paver.edgePieceLengthFt;
  requirePositive('pricing.edgePieceLengthFt', edgePieceLengthFt);
  const edgePieces = edgeOrderLinearFt > 0 ? ceilSafe(edgeOrderLinearFt / edgePieceLengthFt) : undefined;

  const costs: PaverCostLine[] = [];
  const pricing = input.pricing;
  if (pricing?.perPaver !== undefined) {
    requireNonNegative('pricing.perPaver', pricing.perPaver);
    costs.push({ component: 'pavers', basis: 'per-paver', unitPrice: pricing.perPaver, quantity: paversRequired, materialCost: round(pricing.perPaver * paversRequired, 2) });
  }
  if (pricing?.perSqFt !== undefined) {
    requireNonNegative('pricing.perSqFt', pricing.perSqFt);
    costs.push({ component: 'pavers', basis: 'per-square-foot', unitPrice: pricing.perSqFt, quantity: paverSurfaceSqFtOrdered, materialCost: round(pricing.perSqFt * paverSurfaceSqFtOrdered, 2) });
  }

  const addBulkCosts = (component: 'base' | 'bedding-sand', result: ReturnType<typeof calculateBulk>) => {
    for (const c of result.costs) {
      costs.push({ component, basis: c.basis, unitPrice: c.unitPrice, quantity: c.quantity, materialCost: c.materialCost });
    }
  };
  addBulkCosts('base', base);
  addBulkCosts('bedding-sand', beddingSand);

  if (pricing?.edgingPerLinearFt !== undefined) {
    requireNonNegative('pricing.edgingPerLinearFt', pricing.edgingPerLinearFt);
    costs.push({ component: 'edging', basis: 'per-linear-foot', unitPrice: pricing.edgingPerLinearFt, quantity: edgeOrderLinearFt, materialCost: round(pricing.edgingPerLinearFt * edgeOrderLinearFt, 2) });
  }
  if (pricing?.edgingPerPiece !== undefined && edgePieces !== undefined) {
    requireNonNegative('pricing.edgingPerPiece', pricing.edgingPerPiece);
    costs.push({ component: 'edging', basis: 'per-piece', unitPrice: pricing.edgingPerPiece, quantity: edgePieces, materialCost: round(pricing.edgingPerPiece * edgePieces, 2) });
  }

  const warnings: string[] = [];
  if (waste > ENGINE_ASSUMPTIONS.waste.warningAbovePercent) {
    warnings.push(`A waste allowance of ${waste}% is unusually high. Confirm the reason for the allowance.`);
  }
  if (jointWidthIn > 0.25) {
    warnings.push('A joint width above 1/4 in changes the layout substantially; confirm it matches the paver installation system.');
  }
  if (input.edgeLinearFt === undefined) {
    for (const [i, shape] of input.areas.entries()) {
      if (shape.kind === 'triangle' || shape.kind === 'area') {
        warnings.push(`Edge length for areas[${i}] could not be derived from the supplied shape. Enter edgeLinearFt if that section needs edging.`);
      }
    }
  }
  warnings.push(...base.warnings.map((w) => `Base: ${w}`));
  warnings.push(...beddingSand.warnings.map((w) => `Bedding sand: ${w}`));

  const shoppingList: PaverShoppingItem[] = [
    { id: 'pavers', name: 'Pavers', quantity: paversRequired, unit: 'pavers', notes: `${round(areaSqFt, 2)} sq ft net area with ${waste}% waste.` },
    { id: 'paver-base', name: 'Paver base', quantity: base.recommendedOrderCuYd, unit: 'cubic yards', notes: `${baseDepthIn} in depth with ${(baseCompaction - 1) * 100}% compaction allowance.` },
    { id: 'bedding-sand', name: 'Bedding sand', quantity: beddingSand.recommendedOrderCuYd, unit: 'cubic yards', notes: `${beddingSandDepthIn} in bedding layer.` },
  ];
  if (edgeOrderLinearFt > 0) {
    shoppingList.push({ id: 'edge-restraint-linear', name: 'Edge restraint', quantity: edgeOrderLinearFt, unit: 'linear ft' });
    if (edgePieces !== undefined) shoppingList.push({ id: 'edge-restraint-pieces', name: 'Edge restraint pieces', quantity: edgePieces, unit: 'pieces', notes: `${edgePieceLengthFt} ft stock length.` });
  }

  return {
    areaSqFt: round(areaSqFt, 2),
    areaSqM: round(sqFtToSqM(areaSqFt), 2),
    paverAreaSqIn: round(paverAreaSqIn, 2),
    paverModuleSqIn: round(paverModuleSqIn, 4),
    paverCountBeforeWaste,
    paversRequired,
    paverSurfaceSqFtOrdered,
    wastePercent: waste,
    paverLengthIn: input.paverLengthIn,
    paverWidthIn: input.paverWidthIn,
    jointWidthIn,
    baseDepthIn,
    beddingSandDepthIn,
    base,
    beddingSand,
    edgeLinearFt: round(edgeLinearFt, 2),
    edgeOrderLinearFt,
    edgePieces,
    costs,
    shoppingList,
    warnings,
  };
}

export interface PaverPatioInput extends Omit<PaverInput, 'baseDepthIn' | 'beddingSandDepthIn'> {
  patioName?: string;
  baseDepthIn?: number;
  beddingSandDepthIn?: number;
}

export interface PaverPatioResult extends PaverResult {
  projectType: 'paver-patio';
  patioName: string;
  printableQuantities: PaverShoppingItem[];
}

export function calculatePaverPatio(input: PaverPatioInput): PaverPatioResult {
  const result = calculatePavers(input);
  return {
    ...result,
    projectType: 'paver-patio',
    patioName: input.patioName?.trim() || 'Paver Patio Project',
    printableQuantities: result.shoppingList.map((item) => ({ ...item })),
  };
}

function deriveEdgeLinearFt(shapes: Shape[]): number {
  let total = 0;
  for (const shape of shapes) {
    if (shape.kind === 'rectangle') total += 2 * (shape.length + shape.width);
    else if (shape.kind === 'circle') total += Math.PI * shape.diameter;
    else if (shape.kind === 'triangle') {
      // A base + height alone is not enough to infer a generic triangle perimeter.
      continue;
    } else {
      continue;
    }
  }
  return total;
}
