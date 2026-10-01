/**
 * Shared bridge between calculator form state and the calculation engine.
 *
 * The engine under src/lib/calculations remains the single source of truth. This module
 * only converts form strings into typed engine inputs and derives the input/result
 * summaries the UI displays, so calculator pages and Project Mode cannot drift apart.
 */
import { calculateBulk, calculateDriveway, calculateConcrete, calculatePavers, calculatePaverPatio, calculateFence, calculateFenceCost, calculateFencePosts, calculateDeckMaterials, type Shape } from '@/index';
import { DEFAULT_CURRENCY, formatCurrency } from '@/lib/currency';
import { getCalculator, type CalculatorSlug } from './registry';
import type { CalculatorFormState } from './CalculatorForm';
import type { ShapeForm } from './FormParts';
export function numberValue(value: string): number { return value.trim() === '' ? Number.NaN : Number(value); }
export function optionalNumber(value: string | undefined): number | undefined { return value === undefined || value.trim() === '' ? undefined : Number(value); }
export function shapeFromForm(s: CalculatorFormState['areas'][number]): Shape {
  if (s.kind === 'rectangle') return {kind:'rectangle',length:numberValue(s.length),width:numberValue(s.width)};
  if (s.kind === 'circle') return {kind:'circle',diameter:numberValue(s.diameter)};
  if (s.kind === 'triangle') return {kind:'triangle',base:numberValue(s.base),height:numberValue(s.height)};
  return {kind:'area',sqFt:numberValue(s.sqFt)};
}
export function runCalculator(slug: CalculatorSlug, state: CalculatorFormState): unknown {
  const f = state.fields;
  const areas = state.areas.map(shapeFromForm);
  const waste = numberValue(f.waste);
  switch(slug) {
    case 'gravel-calculator':
    case 'mulch-calculator':
    case 'topsoil-calculator':
    case 'soil-calculator':
    case 'sand-calculator':
    case 'pea-gravel-calculator':
    case 'landscape-rock-calculator': {
      const material = getCalculator(slug)?.material;
      if (!material) throw new Error('Material definition missing.');
      const result = calculateBulk({material,areas,depthIn:numberValue(f.depth),wastePercent:waste,densityTonsPerCuYd:optionalNumber(f.density),useCase:f.useCase || undefined,pricing:optionalNumber(f.price) !== undefined ? {perCuYd:numberValue(f.price)} : undefined,truckCapacityTons:optionalNumber(f.truck)});
      return result;
    }
    case 'paver-base-calculator': {
      return calculateBulk({material:'paver-base',areas,depthIn:numberValue(f.depth),wastePercent:waste,compactionFactor:optionalNumber(f.compaction) ?? 1.1,densityTonsPerCuYd:optionalNumber(f.density),useCase:f.useCase || undefined,pricing:optionalNumber(f.price) !== undefined ? {perCuYd:numberValue(f.price)} : undefined});
    }
    case 'driveway-gravel-calculator': {
      return calculateDriveway({sections:areas,wastePercent:waste,layers:state.layers.map(l=>({name:l.name,depthIn:numberValue(l.depth),material:l.material as 'gravel'|'paver-base'|'sand',compactionFactor:numberValue(l.compaction),pricePerCuYd:optionalNumber(l.price)})),truckCapacityTons:optionalNumber(f.truck),deliveryFeePerLoad:optionalNumber(f.deliveryFee)});
    }
    case 'concrete-calculator': {
      return calculateConcrete({wastePercent:waste,concreteLbPerCuFt:optionalNumber(f.density),parts:state.concreteParts.map(p=>p.kind==='slab'?{kind:'slab',label:p.label,lengthFt:numberValue(p.length),widthFt:numberValue(p.width),thicknessIn:numberValue(p.thickness)}:p.kind==='footing'?{kind:'footing',label:p.label,lengthFt:numberValue(p.length),widthIn:numberValue(p.widthIn),depthIn:numberValue(p.depth)}:{kind:'post-hole',label:p.label,diameterIn:numberValue(p.diameter),depthIn:numberValue(p.depth),count:numberValue(p.count)})});
    }
    case 'paver-calculator':
    case 'paver-patio-calculator': {
      const pricing = (optionalNumber(f.price) !== undefined || optionalNumber(f.basePrice) !== undefined || optionalNumber(f.sandPrice) !== undefined || optionalNumber(f.laborFlat) !== undefined) ? {perPaver:optionalNumber(f.price),base:optionalNumber(f.basePrice) !== undefined ? {perCuYd:numberValue(f.basePrice)} : undefined,beddingSand:optionalNumber(f.sandPrice) !== undefined ? {perCuYd:numberValue(f.sandPrice)} : undefined,edgingPerLinearFt:optionalNumber(f.laborFlat)} : undefined;
      const input = {areas,paverLengthIn:numberValue(f.paverLength),paverWidthIn:numberValue(f.paverWidth),jointWidthIn:numberValue(f.joint),wastePercent:waste,baseDepthIn:numberValue(f.baseDepth),beddingSandDepthIn:numberValue(f.sandDepth),edgeLinearFt:optionalNumber(f.edge),pricing};
      return slug==='paver-patio-calculator' ? calculatePaverPatio({...input,patioName:f.patioName}) : calculatePavers(input);
    }
    case 'fence-calculator':
    case 'fence-cost-calculator': {
      const base = {fenceLengthFt:numberValue(f.fenceLength),heightFt:numberValue(f.fenceHeight),fenceType:(f.fenceType || 'wood-picket') as 'wood-picket'|'privacy-panel'|'vinyl-panel'|'chain-link'|'composite-panel'|'custom',postSpacingFt:numberValue(f.postSpacing),cornerCount:numberValue(f.corners),endCount:numberValue(f.ends),gateCount:numberValue(f.gates),gateWidthFt:numberValue(f.gateWidth),wastePercent:waste,picketWidthIn:numberValue(f.picketWidth),picketSpacingIn:numberValue(f.picketSpacing),panelWidthFt:numberValue(f.panelWidth),railsPerSection:numberValue(f.rails),railStockLengthFt:numberValue(f.railLength),postHoleDiameterIn:numberValue(f.holeDiameter),postHoleDepthIn:numberValue(f.holeDepth),fastenersPerPicketPerRail:numberValue(f.fastenersPicket),fastenersPerPanel:numberValue(f.fastenersPanel)};
      if (slug==='fence-cost-calculator') return calculateFenceCost({ ...base, pricing:{postPrice:optionalNumber(f.postPrice),railPricePerPiece:optionalNumber(f.railPrice),picketPrice:optionalNumber(f.picketPrice),panelPrice:optionalNumber(f.panelPrice),concretePricePerCuYd:optionalNumber(f.concretePrice),hardwarePricePerUnit:optionalNumber(f.hardwarePrice),gatePrice:optionalNumber(f.gatePrice),chainLinkPricePerLinearFt:optionalNumber(f.chainLinkPrice),laborPerLinearFt:optionalNumber(f.laborPerFt),laborFlat:optionalNumber(f.laborFlat)} });
      return calculateFence(base);
    }
    case 'fence-post-calculator':
      return calculateFencePosts({fenceLengthFt:numberValue(f.fenceLength),postSpacingFt:numberValue(f.postSpacing),cornerCount:numberValue(f.corners),endCount:numberValue(f.ends),gateCount:numberValue(f.gates),gateWidthFt:numberValue(f.gateWidth)});
    case 'deck-material-calculator':
      return calculateDeckMaterials({deckLabel:'Deck Project',deckLengthFt:numberValue(f.length),deckWidthFt:numberValue(f.width),deckingBoardWidthIn:numberValue(f.boardWidth),deckingBoardLengthFt:numberValue(f.boardLength),boardGapIn:numberValue(f.boardGap),boardRunDirection:f.boardRun as 'length'|'width',joistSpacingIn:numberValue(f.joistSpacing),joistWidthIn:numberValue(f.joistWidth),joistDepthIn:numberValue(f.joistDepth),joistStockLengthFt:optionalNumber(f.joistStock),beamCount:numberValue(f.beamCount),beamLengthFt:optionalNumber(f.beamLength),beamStockLengthFt:optionalNumber(f.beamStock),postCount:numberValue(f.postCount),postHeightFt:optionalNumber(f.postHeight),wastePercent:waste,fastenersPerBoardPerJoist:numberValue(f.fasteners),pricing:{deckingPerBoard:optionalNumber(f.deckingPrice),joistPerPiece:optionalNumber(f.joistPrice),beamPerPiece:optionalNumber(f.beamPrice),postPrice:optionalNumber(f.deckPostPrice),fastenerPerEach:optionalNumber(f.fastenerPrice),rimJoistPerLinearFt:optionalNumber(f.rimPrice)}});
  }
}


/* ---------------------------------------------------------------------------
 * Input and result summaries.
 *
 * Project Mode and the printable plan show what a user entered and what the engine
 * returned. The helpers below only label and format values that already exist in the
 * form state or in an engine result, so they can never change a quantity.
 * ------------------------------------------------------------------------- */

export interface SummaryRow { label: string; value: string; }

interface FieldSpec { key: string; label: string; unit?: string; money?: boolean; }

const BULK_FIELDS: FieldSpec[] = [
  { key: 'useCase', label: 'Use case' },
  { key: 'depth', label: 'Depth', unit: 'in' },
  { key: 'waste', label: 'Waste allowance', unit: '%' },
  { key: 'density', label: 'Density override', unit: 'tons/cu yd' },
  { key: 'price', label: 'Material price', unit: 'per cu yd', money: true },
  { key: 'truck', label: 'Truck capacity', unit: 'tons' },
];

const PAVER_FIELDS: FieldSpec[] = [
  { key: 'patioName', label: 'Patio name' },
  { key: 'paverLength', label: 'Paver length', unit: 'in' },
  { key: 'paverWidth', label: 'Paver width', unit: 'in' },
  { key: 'joint', label: 'Joint width', unit: 'in' },
  { key: 'baseDepth', label: 'Base depth', unit: 'in' },
  { key: 'sandDepth', label: 'Bedding sand depth', unit: 'in' },
  { key: 'edge', label: 'Edge restraint length', unit: 'ft' },
  { key: 'waste', label: 'Waste allowance', unit: '%' },
  { key: 'price', label: 'Paver price', unit: 'per paver', money: true },
  { key: 'basePrice', label: 'Base material price', unit: 'per cu yd', money: true },
  { key: 'sandPrice', label: 'Bedding sand price', unit: 'per cu yd', money: true },
  { key: 'laborFlat', label: 'Edge restraint price', unit: 'per linear ft', money: true },
];

const FENCE_FIELDS: FieldSpec[] = [
  { key: 'fenceLength', label: 'Fence length', unit: 'ft' },
  { key: 'fenceHeight', label: 'Fence height', unit: 'ft' },
  { key: 'fenceType', label: 'Fence type' },
  { key: 'postSpacing', label: 'Post spacing', unit: 'ft' },
  { key: 'corners', label: 'Corners' },
  { key: 'ends', label: 'End posts' },
  { key: 'gates', label: 'Gates' },
  { key: 'gateWidth', label: 'Gate width', unit: 'ft' },
  { key: 'waste', label: 'Waste allowance', unit: '%' },
  { key: 'picketWidth', label: 'Picket width', unit: 'in' },
  { key: 'picketSpacing', label: 'Picket spacing', unit: 'in' },
  { key: 'panelWidth', label: 'Panel width', unit: 'ft' },
  { key: 'rails', label: 'Rails per section' },
  { key: 'railLength', label: 'Rail stock length', unit: 'ft' },
  { key: 'holeDiameter', label: 'Post-hole diameter', unit: 'in' },
  { key: 'holeDepth', label: 'Post-hole depth', unit: 'in' },
  { key: 'fastenersPicket', label: 'Fasteners per picket per rail' },
  { key: 'fastenersPanel', label: 'Fasteners per panel' },
];

const FENCE_PRICE_FIELDS: FieldSpec[] = [
  { key: 'postPrice', label: 'Post price', unit: 'each', money: true },
  { key: 'railPrice', label: 'Rail price', unit: 'per piece', money: true },
  { key: 'picketPrice', label: 'Picket price', unit: 'each', money: true },
  { key: 'panelPrice', label: 'Panel price', unit: 'each', money: true },
  { key: 'concretePrice', label: 'Concrete price', unit: 'per cu yd', money: true },
  { key: 'hardwarePrice', label: 'Hardware price', unit: 'per unit', money: true },
  { key: 'gatePrice', label: 'Gate price', unit: 'each', money: true },
  { key: 'chainLinkPrice', label: 'Chain-link price', unit: 'per linear ft', money: true },
  { key: 'laborPerFt', label: 'Labour rate', unit: 'per linear ft', money: true },
  { key: 'laborFlat', label: 'Labour flat charge', unit: 'total', money: true },
];


const DECK_FIELDS: FieldSpec[] = [
  { key: 'length', label: 'Deck length', unit: 'ft' },
  { key: 'width', label: 'Deck width', unit: 'ft' },
  { key: 'boardWidth', label: 'Decking board width', unit: 'in' },
  { key: 'boardLength', label: 'Decking stock length', unit: 'ft' },
  { key: 'boardGap', label: 'Board gap', unit: 'in' },
  { key: 'boardRun', label: 'Board run direction' },
  { key: 'joistSpacing', label: 'Joist spacing', unit: 'in' },
  { key: 'joistWidth', label: 'Joist width', unit: 'in' },
  { key: 'joistDepth', label: 'Joist depth', unit: 'in' },
  { key: 'joistStock', label: 'Joist stock length', unit: 'ft' },
  { key: 'beamCount', label: 'Beam count' },
  { key: 'beamLength', label: 'Beam length', unit: 'ft' },
  { key: 'beamStock', label: 'Beam stock length', unit: 'ft' },
  { key: 'postCount', label: 'Post count' },
  { key: 'postHeight', label: 'Post height', unit: 'ft' },
  { key: 'waste', label: 'Waste allowance', unit: '%' },
  { key: 'fasteners', label: 'Fasteners per board per joist' },
  { key: 'deckingPrice', label: 'Decking price', unit: 'per board', money: true },
  { key: 'joistPrice', label: 'Joist price', unit: 'per piece', money: true },
  { key: 'beamPrice', label: 'Beam price', unit: 'per piece', money: true },
  { key: 'deckPostPrice', label: 'Post price', unit: 'each', money: true },
  { key: 'fastenerPrice', label: 'Fastener price', unit: 'each', money: true },
  { key: 'rimPrice', label: 'Rim joist price', unit: 'per linear ft', money: true },
];

const PAVER_BASE_FIELDS: FieldSpec[] = [
  { key: 'useCase', label: 'Use case' },
  { key: 'depth', label: 'Base depth', unit: 'in' },
  { key: 'compaction', label: 'Compaction factor', unit: 'x' },
  { key: 'density', label: 'Density override', unit: 'tons/cu yd' },
  { key: 'waste', label: 'Waste allowance', unit: '%' },
  { key: 'price', label: 'Material price', unit: 'per cu yd', money: true },
];

const FIELD_SPECS: Record<CalculatorSlug, FieldSpec[]> = {
  'gravel-calculator': BULK_FIELDS,
  'mulch-calculator': BULK_FIELDS,
  'topsoil-calculator': BULK_FIELDS,
  'soil-calculator': BULK_FIELDS,
  'sand-calculator': BULK_FIELDS,
  'pea-gravel-calculator': BULK_FIELDS,
  'landscape-rock-calculator': BULK_FIELDS,
  'paver-base-calculator': PAVER_BASE_FIELDS,
  'driveway-gravel-calculator': [
    { key: 'waste', label: 'Waste allowance', unit: '%' },
    { key: 'truck', label: 'Truck capacity', unit: 'tons' },
    { key: 'deliveryFee', label: 'Delivery fee', unit: 'per load', money: true },
  ],
  'concrete-calculator': [
    { key: 'waste', label: 'Waste allowance', unit: '%' },
    { key: 'density', label: 'Concrete density', unit: 'lb/cu ft' },
  ],
  'paver-calculator': PAVER_FIELDS,
  'paver-patio-calculator': PAVER_FIELDS,
  'fence-calculator': FENCE_FIELDS,
  'fence-cost-calculator': [...FENCE_FIELDS, ...FENCE_PRICE_FIELDS],
  'fence-post-calculator': [
    { key: 'fenceLength', label: 'Fence length', unit: 'ft' },
    { key: 'postSpacing', label: 'Post spacing', unit: 'ft' },
    { key: 'corners', label: 'Corners' },
    { key: 'ends', label: 'End posts' },
    { key: 'gates', label: 'Gates' },
    { key: 'gateWidth', label: 'Gate width', unit: 'ft' },
  ],
  'deck-material-calculator': DECK_FIELDS,
};

const AREA_SLUGS = new Set<CalculatorSlug>([
  'gravel-calculator', 'mulch-calculator', 'topsoil-calculator', 'soil-calculator', 'sand-calculator',
  'pea-gravel-calculator', 'landscape-rock-calculator', 'paver-base-calculator',
  'driveway-gravel-calculator', 'paver-calculator', 'paver-patio-calculator',
]);

const ZERO_VALUES = new Set(['', '0']);


function formatNumber(raw: string, digits = 2): string {
  const value = Number(raw);
  if (!Number.isFinite(value)) return raw.trim();
  return String(Number(value.toFixed(digits)));
}

export function formatShapeForm(shape: ShapeForm): string {
  switch (shape.kind) {
    case 'circle': return `${formatNumber(shape.diameter)} ft diameter`;
    case 'triangle': return `${formatNumber(shape.base)} x ${formatNumber(shape.height)} ft triangle`;
    case 'area': return `${formatNumber(shape.sqFt)} sq ft`;
    default: return `${formatNumber(shape.length)} x ${formatNumber(shape.width)} ft`;
  }
}

function concretePartLabel(part: CalculatorFormState['concreteParts'][number]): string {
  if (part.kind === 'footing') return `${formatNumber(part.length)} ft long, ${formatNumber(part.widthIn)} in wide, ${formatNumber(part.depth)} in deep`;
  if (part.kind === 'post-hole') return `${formatNumber(part.diameter)} in diameter, ${formatNumber(part.depth)} in deep, ${formatNumber(part.count, 0)} off`;
  return `${formatNumber(part.length)} x ${formatNumber(part.width)} ft, ${formatNumber(part.thickness)} in thick`;
}

function specValue(spec: FieldSpec, raw: string, currency: string): string {
  const trimmed = raw.trim();
  return spec.money ? echoMoney(trimmed, currency) : spec.unit ? `${formatNumber(trimmed)} ${spec.unit}` : trimmed;
}

/**
 * Echo a price the visitor typed, in the selected currency: the same value and the
 * same number of decimals they entered, never a converted or invented amount.
 */
function echoMoney(raw: string, currency: string): string {
  const normalised = formatNumber(raw);
  const numeric = Number(normalised);
  if (!Number.isFinite(numeric)) return normalised;
  const decimals = normalised.includes('.') ? normalised.split('.')[1].length : 0;
  return formatCurrency(numeric, currency, { digits: decimals });
}

/**
 * Everything the user entered for one calculation, as display rows.
 * Areas, driveway layers and concrete sections are listed before the shared fields.
 */
export function formInputSummary(slug: CalculatorSlug, state: CalculatorFormState, currency: string = DEFAULT_CURRENCY): SummaryRow[] {
  const rows: SummaryRow[] = [];
  if (AREA_SLUGS.has(slug)) {
    state.areas.filter(Boolean).forEach((area, index) => rows.push({ label: `Area ${index + 1} (${area.kind})`, value: formatShapeForm(area) }));
  }
  if (slug === 'driveway-gravel-calculator') {
    state.layers.forEach((layer) => rows.push({ label: `Layer: ${layer.name}`, value: `${formatNumber(layer.depth)} in of ${layer.material}, compaction ${formatNumber(layer.compaction)}x` }));
  }
  if (slug === 'concrete-calculator') {
    state.concreteParts.forEach((part, index) => rows.push({ label: `Section ${index + 1}: ${part.label}`, value: concretePartLabel(part) }));
  }
  for (const spec of FIELD_SPECS[slug] ?? []) {
    const raw = state.fields[spec.key];
    if (raw === undefined || ZERO_VALUES.has(raw.trim())) continue;
    rows.push({ label: spec.label, value: specValue(spec, raw, currency) });
  }
  return rows;
}

interface ResultSpec { path: string; label: string; unit?: string; digits?: number; money?: boolean; }

const BULK_RESULTS: ResultSpec[] = [
  { path: 'areaSqFt', label: 'Area', unit: 'sq ft', digits: 1 },
  { path: 'volumeCuYd', label: 'Volume incl. waste', unit: 'cu yd' },
  { path: 'recommendedOrderCuYd', label: 'Recommended order', unit: 'cu yd' },
  { path: 'tons', label: 'Estimated weight', unit: 'tons' },
];

const FENCE_RESULTS: ResultSpec[] = [
  { path: 'netFenceRunFt', label: 'Net fence run', unit: 'ft' },
  { path: 'posts.totalPosts', label: 'Posts', unit: 'posts', digits: 0 },
  { path: 'railPiecesRequired', label: 'Rails', unit: 'pieces', digits: 0 },
  { path: 'picketsRequired', label: 'Pickets', unit: 'pickets', digits: 0 },
  { path: 'panelsRequired', label: 'Panels', unit: 'panels', digits: 0 },
  { path: 'chainLinkLinearFtRequired', label: 'Chain-link', unit: 'linear ft' },
  { path: 'concrete.recommendedReadyMixCuYd', label: 'Post-hole concrete', unit: 'cu yd' },
  { path: 'hardware.fastenerCount', label: 'Fasteners', unit: 'each', digits: 0 },
];


const RESULT_SPECS: Partial<Record<CalculatorSlug, ResultSpec[]>> = {
  'driveway-gravel-calculator': [
    { path: 'areaSqFt', label: 'Area', unit: 'sq ft', digits: 1 },
    { path: 'totalDepthIn', label: 'Total layer depth', unit: 'in' },
    { path: 'totalVolumeCuYd', label: 'Volume', unit: 'cu yd' },
    { path: 'totalOrderCuYd', label: 'Recommended order', unit: 'cu yd' },
    { path: 'totalTons', label: 'Estimated weight', unit: 'tons' },
    { path: 'delivery.loads', label: 'Truckloads', unit: 'loads' },
    { path: 'totalCost', label: 'Entered total cost', money: true },
  ],
  'concrete-calculator': [
    { path: 'volumeCuFt', label: 'Volume', unit: 'cu ft' },
    { path: 'orderCuYd', label: 'Volume incl. waste', unit: 'cu yd' },
    { path: 'recommendedReadyMixCuYd', label: 'Ready-mix order', unit: 'cu yd' },
    { path: 'approxWeightLb', label: 'Approximate weight', unit: 'lb', digits: 0 },
  ],
  'paver-calculator': [
    { path: 'areaSqFt', label: 'Area', unit: 'sq ft', digits: 1 },
    { path: 'paversRequired', label: 'Pavers incl. waste', unit: 'pieces', digits: 0 },
    { path: 'base.recommendedOrderCuYd', label: 'Base order', unit: 'cu yd' },
    { path: 'beddingSand.recommendedOrderCuYd', label: 'Bedding sand order', unit: 'cu yd' },
    { path: 'edgeOrderLinearFt', label: 'Edge restraint', unit: 'linear ft' },
  ],
  'fence-calculator': FENCE_RESULTS,
  'fence-cost-calculator': [
    ...FENCE_RESULTS,
    { path: 'materialCost', label: 'Entered material cost', money: true },
    { path: 'laborCost', label: 'Entered labour cost', money: true },
    { path: 'totalCost', label: 'Entered total cost', money: true },
  ],
  'fence-post-calculator': [
    { path: 'netFenceRunFt', label: 'Net fence run', unit: 'ft' },
    { path: 'linePosts', label: 'Line posts', unit: 'posts', digits: 0 },
    { path: 'cornerPosts', label: 'Corner posts', unit: 'posts', digits: 0 },
    { path: 'endPosts', label: 'End posts', unit: 'posts', digits: 0 },
    { path: 'gatePosts', label: 'Gate posts', unit: 'posts', digits: 0 },
    { path: 'totalPosts', label: 'Total posts', unit: 'posts', digits: 0 },
  ],
  'deck-material-calculator': [
    { path: 'areaSqFt', label: 'Area', unit: 'sq ft', digits: 1 },
    { path: 'deckingBoardsRequired', label: 'Decking boards', unit: 'pieces', digits: 0 },
    { path: 'deckingLinearFtOrdered', label: 'Decking linear ft', unit: 'linear ft' },
    { path: 'joistsOrdered', label: 'Joists', unit: 'pieces', digits: 0 },
    { path: 'joistPiecesOrdered', label: 'Joist stock pieces', unit: 'pieces', digits: 0 },
    { path: 'fastenersOrdered', label: 'Fasteners', unit: 'each', digits: 0 },
  ],
};

function pickNumber(source: Record<string, unknown>, path: string): number | undefined {
  let current: unknown = source;
  for (const key of path.split('.')) {
    if (!current || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === 'number' && Number.isFinite(current) ? current : undefined;
}

/** The important engine outputs for one result, as display rows. */
export function resultHighlights(slug: CalculatorSlug, result: unknown, currency: string = DEFAULT_CURRENCY): SummaryRow[] {
  const record = (result ?? {}) as Record<string, unknown>;
  const specs = slug === 'paver-patio-calculator' ? RESULT_SPECS['paver-calculator'] : RESULT_SPECS[slug];
  const rows: SummaryRow[] = [];
  for (const spec of specs ?? BULK_RESULTS) {
    const value = pickNumber(record, spec.path);
    if (value === undefined) continue;
    const body = value.toFixed(spec.money ? 2 : spec.digits ?? 2);
    rows.push({ label: spec.label, value: spec.money ? formatCurrency(value, currency) : spec.unit ? `${body} ${spec.unit}` : body });
  }
  const bags = Array.isArray(record.bags) ? (record.bags as Array<Record<string, unknown>>) : [];
  const bag = bags[0];
  if (bag && typeof bag.count === 'number') {
    const size = typeof bag.bagLb === 'number' ? `${bag.bagLb} lb bags` : typeof bag.bagCuFt === 'number' ? `${bag.bagCuFt} cu ft bags` : 'Bags';
    rows.push({ label: size, value: `${bag.count} bags` });
  }
  if (typeof record.loads === 'number' && !(specs ?? []).some((spec) => spec.path === 'delivery.loads')) {
    rows.push({ label: 'Truckloads', value: `${record.loads} loads` });
  }
  return rows.slice(0, 8);
}

export function runCalculatorSummary(slug: CalculatorSlug, state: CalculatorFormState, result: unknown, currency: string = DEFAULT_CURRENCY): { inputs: SummaryRow[]; results: SummaryRow[] } {
  return { inputs: formInputSummary(slug, state, currency), results: resultHighlights(slug, result, currency) };
}

/** Normalise the engine's CalcInputError into a field + message pair for form highlighting. */
export function parseEngineError(error: unknown): { field: string; message: string } | undefined {
  const candidate = error as { field?: string; message?: string };
  if (candidate?.field && candidate?.message) return { field: candidate.field, message: candidate.message };
  return undefined;
}

/** Material names shown in Project Mode and the printable plan. */
export function calculatorLabel(slug: string): string {
  return getCalculator(slug)?.name ?? slug;
}
