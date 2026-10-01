import type { CalculatorSlug } from './registry';
import type { ProjectAssumptionSnapshot, ProjectArea, ProjectCalculationFormState, ProjectCostLine, ProjectInputRow, ProjectMaterial, ProjectQuantity } from '@/lib/project-mode';
import type { Shape } from '@/lib/calculations/geometry';
import type { MaterialId } from '@/data/materials';
import { MATERIALS } from '@/data/materials';
import { projectQuantity } from '@/lib/project-store';
import { resolveCurrencyCode } from '@/lib/currency';
import { calculatorLabel } from './engine-bridge';

type AnyRecord = Record<string, unknown>;
const n = (v: unknown): number | undefined => typeof v === 'number' && Number.isFinite(v) ? v : undefined;

/** Project Mode should show the engine's material name, not the raw slug. */
function materialDisplayName(id: unknown, fallback: string): string {
  if (typeof id !== 'string') return fallback;
  const spec = MATERIALS[id as MaterialId];
  return spec ? spec.name : fallback;
}

/**
 * Units that are always bought as whole units. These are order quantities by definition,
 * so they must reach the Project Mode shopping list without the user re-entering anything.
 */
const DISCRETE_UNITS = new Set<string>(['pieces', 'posts', 'rails', 'pickets', 'panels', 'sets', 'each', 'bags', 'loads']);

export interface ProjectMaterialExtras {
  /** What the user entered, shown in Project Mode and on the printable plan. */
  inputs?: ProjectInputRow[];
  /** The important engine outputs, captured at add time so nothing is recalculated later. */
  results?: ProjectInputRow[];
  /** The calculator form state, so a stored calculation can be reopened and edited. */
  formState?: ProjectCalculationFormState;
  /**
   * Currency the visitor was displaying when the calculation was added. Recorded with the
   * cost lines for reference; it is never used to convert an amount.
   */
  currencyCode?: string;
}

export function resultToProjectMaterial(slug: CalculatorSlug, result: unknown, extras: ProjectMaterialExtras = {}): ProjectMaterial {
  const r = result as AnyRecord;
  const quantities: ProjectQuantity[] = [];
  let name = 'Calculation';
  let materialId: string | undefined;
  let role: ProjectMaterial['role'] = 'other';
  let wastePercent: number | undefined;
  const add = (label: string, q: unknown, unit: ProjectQuantity['unit'], orderQ?: unknown, orderUnit?: ProjectQuantity['orderUnit'], notes?: string) => {
    const value = n(q);
    if (value === undefined) return;
    const discrete = DISCRETE_UNITS.has(unit);
    const resolvedOrder = n(orderQ) ?? (discrete ? value : undefined);
    const resolvedOrderUnit = n(orderQ) !== undefined ? orderUnit : (discrete ? orderUnit ?? unit : orderUnit);
    quantities.push(projectQuantity(label, value, unit, resolvedOrder, resolvedOrderUnit, value, notes));
  };

  if (slug.includes('gravel') || slug === 'mulch-calculator' || slug === 'topsoil-calculator' || slug === 'soil-calculator' || slug === 'sand-calculator' || slug === 'landscape-rock-calculator' || slug === 'paver-base-calculator') {
    name = materialDisplayName(r.material, 'Bulk material'); materialId = typeof r.material === 'string' ? r.material : undefined; role = 'surface'; wastePercent = n(r.wastePercent);
    add('Area', r.areaSqFt, 'sq ft'); add('Cubic yards', r.volumeCuYd, 'cubic yards', r.recommendedOrderCuYd, 'cubic yards'); add('Tons', r.tons, 'tons');
    const bags = Array.isArray(r.bags) ? r.bags as AnyRecord[] : []; if (bags[0]) add(`${bags[0].bagCuFt} cu ft bags`, bags[0].count, 'bags');
    if (n(r.loads)) add('Truckloads', r.loads, 'loads');
  } else if (slug === 'driveway-gravel-calculator') {
    name = 'Driveway gravel'; materialId = 'gravel'; role = 'surface'; wastePercent = n(r.totalWastePercent) ?? 10;
    add('Area', r.areaSqFt, 'sq ft'); add('Total cubic yards', r.totalOrderCuYd, 'cubic yards', r.totalOrderCuYd, 'cubic yards'); add('Total tons', r.totalTons, 'tons');
    const layers = Array.isArray(r.layers) ? r.layers as AnyRecord[] : [];
    for (const layer of layers) { const result = layer.result as AnyRecord | undefined; if (!result) continue; add(String(layer.name), result.recommendedOrderCuYd, 'cubic yards', result.recommendedOrderCuYd, 'cubic yards'); }
  } else if (slug === 'concrete-calculator') {
    name = 'Concrete'; materialId = 'concrete'; role = 'concrete'; wastePercent = n(r.wastePercent);
    add('Order volume', r.orderCuYd, 'cubic yards', r.recommendedReadyMixCuYd ?? r.orderCuYd, 'cubic yards');
    add('Order weight', n(r.approxWeightLb) === undefined ? undefined : Number(r.approxWeightLb) / 2000, 'tons');
    const bags = Array.isArray(r.bags) ? r.bags as AnyRecord[] : []; if (bags[0]) add(`${bags[0].bagLb} lb bags`, bags[0].count, 'bags');
  } else if (slug === 'paver-calculator' || slug === 'paver-patio-calculator') {
    name = slug === 'paver-patio-calculator' ? String(r.patioName ?? 'Paver patio') : 'Pavers'; role = 'surface'; wastePercent = n(r.wastePercent);
    const baseOrder = (r.base as AnyRecord | undefined)?.recommendedOrderCuYd;
    const sandOrder = (r.beddingSand as AnyRecord | undefined)?.recommendedOrderCuYd;
    add('Pavers', r.paversRequired, 'pieces'); add('Base', baseOrder, 'cubic yards', baseOrder, 'cubic yards'); add('Bedding sand', sandOrder, 'cubic yards', sandOrder, 'cubic yards'); add('Edge restraint', r.edgeOrderLinearFt, 'linear ft');
  } else if (slug === 'fence-calculator' || slug === 'fence-cost-calculator') {
    const fenceRecord = (r.fence as AnyRecord | undefined) ?? r;
    name = String(fenceRecord.fenceLabel ?? 'Fence'); role = 'other'; const f = fenceRecord; wastePercent = n(f.wastePercent);
    const posts = f.posts as AnyRecord | undefined; add('Total posts', posts?.totalPosts, 'posts'); add('Rails', f.railPiecesRequired, 'rails'); add('Pickets', f.picketsRequired, 'pickets'); add('Panels', f.panelsRequired, 'panels'); add('Chain-link', f.chainLinkLinearFtRequired, 'linear ft');
    const concreteOrder = (f.concrete as AnyRecord | undefined)?.recommendedReadyMixCuYd;
    add('Post-hole concrete', concreteOrder, 'cubic yards', concreteOrder, 'cubic yards');
    add('Hardware', (f.hardware as AnyRecord | undefined)?.fastenerCount, 'each');
  } else if (slug === 'fence-post-calculator') {
    name = 'Fence posts'; role = 'framing'; add('Total posts', r.totalPosts, 'posts'); add('Line posts', r.linePosts, 'posts'); add('Corner posts', r.cornerPosts, 'posts'); add('End posts', r.endPosts, 'posts'); add('Gate posts', r.gatePosts, 'posts');
  } else if (slug === 'deck-material-calculator') {
    name = String(r.deckLabel ?? 'Deck'); role = 'framing'; wastePercent = n(r.wastePercent);
    add('Decking boards', r.deckingBoardsRequired, 'pieces'); add('Decking linear feet', r.deckingLinearFtOrdered, 'linear ft'); add('Joists', r.joistsOrdered, 'pieces', r.joistPiecesOrdered, 'pieces'); add('Beams', r.beamCount, 'pieces', r.beamPiecesOrdered, 'pieces'); add('Posts', r.postCount, 'posts'); add('Fasteners', r.fastenersOrdered, 'each');
  }

  const id = `${slug}-${Date.now()}`;
  const recordedCurrency = resolveCurrencyCode(extras.currencyCode);
  const fenceForCosts = r.fence as AnyRecord | undefined;
  const rawCosts = Array.isArray(r.costs) ? r.costs as AnyRecord[]
    : Array.isArray(r.lines) ? r.lines as AnyRecord[]
    : Array.isArray(fenceForCosts?.costs) ? fenceForCosts.costs as AnyRecord[]
    : [];
  const costs: ProjectCostLine[] = rawCosts.flatMap((c) => {
    const amount = n(c.amount ?? c.materialCost ?? c.cost);
    if (amount === undefined) return [];
    const component = String(c.component ?? '');
    const label = component || String(c.basis ?? 'Material cost');
    return [{
      label: label.charAt(0).toUpperCase() + label.slice(1),
      amount,
      basis: String(c.basis ?? 'material'),
      category: component === 'labor' ? 'labor' as const : component === 'delivery' ? 'other' as const : 'material' as const,
      enteredPrice: n(c.unitPrice ?? c.price),
      quantity: n(c.quantity),
      currencyCode: recordedCurrency,
    }];
  });
  if (slug === 'driveway-gravel-calculator' && n(r.materialCost) !== undefined) costs.push({ label: 'Driveway materials', amount: n(r.materialCost)!, basis: 'material', category: 'material', currencyCode: recordedCurrency });
  const deliveryFee = n((r.delivery as AnyRecord | undefined)?.totalFee);
  if (slug === 'driveway-gravel-calculator' && deliveryFee !== undefined && deliveryFee > 0) costs.push({ label: 'Delivery', amount: deliveryFee, basis: 'delivery', category: 'other', currencyCode: recordedCurrency });
  if (slug === 'fence-cost-calculator' && n(r.totalCost) !== undefined && costs.length === 0) costs.push({ label: 'Fence estimate', amount: n(r.totalCost)!, basis: 'material', category: 'material', currencyCode: recordedCurrency });
  const missingPrices = Array.isArray(r.missingPrices) ? (r.missingPrices as unknown[]).filter((x): x is string => typeof x === 'string') : [];
  const assumptions: ProjectAssumptionSnapshot[] = [];
  const addAssumption = (key: string, label: string, value: unknown, unit?: string, source: ProjectAssumptionSnapshot['source'] = 'calculation') => {
    if (typeof value === 'number' && Number.isFinite(value) || typeof value === 'string' || typeof value === 'boolean') assumptions.push({ key: `${id}-${key}`, label, value: value as number | string | boolean, unit, editable: false, source });
  };
  if (slug === 'driveway-gravel-calculator') {
    const layers = Array.isArray(r.layers) ? r.layers as AnyRecord[] : [];
    for (const layer of layers) {
      const lr = layer.result as AnyRecord | undefined;
      if (!lr) continue;
      addAssumption(`layer-${String(layer.name)}-waste`, `${String(layer.name)} waste`, lr.wastePercent, '%');
      addAssumption(`layer-${String(layer.name)}-compaction`, `${String(layer.name)} compaction`, lr.compactionFactor, '×');
      addAssumption(`layer-${String(layer.name)}-density`, `${String(layer.name)} density`, lr.densityUsed, 'tons/cu yd');
    }
  } else if (slug.includes('gravel') || ['mulch-calculator','topsoil-calculator','soil-calculator','sand-calculator','landscape-rock-calculator','paver-base-calculator'].includes(slug)) {
    addAssumption('waste', 'Waste allowance', r.wastePercent, '%');
    addAssumption('compaction', 'Compaction factor', r.compactionFactor, '×');
    addAssumption('density', 'Density used', r.densityUsed, 'tons/cu yd');
  } else if (slug === 'paver-calculator' || slug === 'paver-patio-calculator') {
    addAssumption('waste', 'Waste allowance', r.wastePercent, '%');
    addAssumption('joint', 'Joint width', r.jointWidthIn, 'in');
    addAssumption('base-depth', 'Base depth', r.baseDepthIn, 'in');
    addAssumption('bedding-depth', 'Bedding sand depth', r.beddingSandDepthIn, 'in');
    addAssumption('base-compaction', 'Base compaction', (r.base as AnyRecord | undefined)?.compactionFactor, '×');
    addAssumption('sand-compaction', 'Bedding sand compaction', (r.beddingSand as AnyRecord | undefined)?.compactionFactor, '×');
  } else if (slug === 'concrete-calculator') {
    addAssumption('waste', 'Waste allowance', r.wastePercent, '%');
    addAssumption('bag-order', 'Ready-mix order rounding', '0.25', 'cu yd', 'engine-default');
  } else if (slug === 'fence-calculator' || slug === 'fence-cost-calculator') {
    const f = (r.fence as AnyRecord | undefined) ?? r;
    addAssumption('waste', 'Waste allowance', f.wastePercent, '%');
    addAssumption('rails', 'Rails per section', f.railsPerSection);
    addAssumption('rail-feet', 'Required rail length', f.railLinearFtRequired, 'ft');
  } else if (slug === 'fence-post-calculator') {
    addAssumption('estimated-positions', 'Estimated post positions', r.estimatedPostPositions, 'posts');
  } else if (slug === 'deck-material-calculator') {
    addAssumption('waste', 'Waste allowance', r.wastePercent, '%');
    addAssumption('board-width', 'Decking board width', r.deckingBoardWidthIn, 'in');
    addAssumption('board-length', 'Decking stock length', r.deckingBoardLengthFt, 'ft');
    addAssumption('gap', 'Board gap', r.boardGapIn, 'in');
    addAssumption('joist-spacing', 'Joist spacing', r.joistSpacingIn, 'in');
  }
  for (const missing of missingPrices) costs.push({ label: `Missing price: ${missing}`, amount: 0, basis: 'missing-price', category: 'material', notes: 'missing-price', currencyCode: recordedCurrency });
  return {
    id, name, materialId, calculator: slug, calculatorName: calculatorLabel(slug), role, wastePercent,
    quantities,
    costs,
    sourceCalculationId: id,
    notes: [`Added from ${slug}.`, 'Verify product specifications and supplier quantities before purchase.'],
    assumptions,
    inputs: extras.inputs,
    results: extras.results,
    formState: extras.formState,
  };
}

export function resultToProjectAreas(slug: CalculatorSlug, result: unknown, shapes: Shape[]): ProjectArea[] {
  if (!['gravel-calculator','mulch-calculator','topsoil-calculator','soil-calculator','sand-calculator','pea-gravel-calculator','landscape-rock-calculator','paver-base-calculator','driveway-gravel-calculator','paver-calculator','paver-patio-calculator'].includes(slug)) return [];
  const label = slug.replaceAll('-calculator', '').replaceAll('-', ' ');
  const title = label.charAt(0).toUpperCase() + label.slice(1);
  return shapes.filter(Boolean).map((shape, index) => ({ id: `${slug}-area-${index}-${Date.now()}`, name: `${title} area ${index+1}`, shape, role: slug.includes('base') ? 'base' : slug.includes('sand') ? 'bedding' : 'surface' }));
}
