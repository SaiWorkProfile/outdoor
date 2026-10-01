/**
 * QA harness: recompute the *expected* values for the realistic browser test cases
 * directly from the calculation engine, so browser results can be compared against
 * engine output (UI <-> engine parity).
 *
 * Run: npx tsx qa/expected.ts
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import {
  calculateBulk, calculateDriveway, calculateConcrete, calculatePavers,
  calculatePaverPatio, calculateFence, calculateFenceCost, calculateFencePosts,
  calculateDeckMaterials,
} from '../src/index';
import { formatCurrency } from '../src/lib/currency';

const rect = (length: number, width: number) => ({ kind: 'rectangle' as const, length, width });
const round = (v: number, d = 2) => Number(v.toFixed(d));
const out: Record<string, unknown> = {};

/* ---------- bulk material family (UI default form: rect 20 x 30 ft) ---------- */
const defaults: Record<string, { depth: number; useCase: string; compaction?: number }> = {
  'gravel-calculator': { depth: 3, useCase: 'walkway' },
  'mulch-calculator': { depth: 3, useCase: 'garden-bed' },
  'topsoil-calculator': { depth: 6, useCase: 'garden-bed' },
  'soil-calculator': { depth: 3, useCase: 'general' },
  'sand-calculator': { depth: 1, useCase: 'paver-bedding' },
  'pea-gravel-calculator': { depth: 2, useCase: 'walkway' },
  'landscape-rock-calculator': { depth: 3, useCase: 'decorative' },
  'paver-base-calculator': { depth: 6, useCase: 'patio', compaction: 1.1 },
};

for (const [slug, cfg] of Object.entries(defaults)) {
  const material = slug === 'paver-base-calculator' ? 'paver-base' : slug.replace('-calculator', '');
  const r = calculateBulk({
    material: material as never,
    areas: [rect(20, 30)],
    depthIn: cfg.depth,
    wastePercent: 10,
    compactionFactor: cfg.compaction,
    useCase: cfg.useCase,
    truckCapacityTons: 10,
  });
  out[slug] = {
    metrics: { 'Cubic yards': r.recommendedOrderCuYd, Tons: round(r.tons), 'Square feet': round(r.areaSqFt), Waste: r.wastePercent },
    engine: {
      areaSqFt: r.areaSqFt, volumeCuFt: r.volumeCuFt, volumeCuYd: r.volumeCuYd,
      recommendedOrderCuYd: r.recommendedOrderCuYd, tons: r.tons, tonnes: r.tonnes,
      bag0: r.bags[0] ? { size: r.bags[0].bagCuFt, count: r.bags[0].count } : null,
      purchaseAdvice: r.purchaseAdvice, warnings: r.warnings,
    },
  };
}

/* ---------- driveway: default sections + 3 editable layers ---------- */
{
  const r = calculateDriveway({
    sections: [rect(20, 30)],
    wastePercent: 10,
    layers: [
      { name: 'Base layer', depthIn: 4, material: 'gravel', compactionFactor: 1.15 },
      { name: 'Middle layer', depthIn: 2, material: 'gravel', compactionFactor: 1.15 },
      { name: 'Surface layer', depthIn: 2, material: 'gravel', compactionFactor: 1.1 },
    ],
    truckCapacityTons: 10,
  });
  out['driveway-gravel-calculator'] = {
    metrics: {
      'Order volume': `${r.totalOrderCuYd} yd³`, Tons: round(r.totalTons),
      Area: `${Math.round(r.areaSqFt)} sq ft`, Depth: `${r.totalDepthIn} in`,
    },
    engine: {
      areaSqFt: r.areaSqFt, totalOrderCuYd: r.totalOrderCuYd, totalTons: r.totalTons, totalDepthIn: r.totalDepthIn,
      layers: r.layers.map((l) => ({ name: l.name, order: l.result.recommendedOrderCuYd, tons: round(l.result.tons) })),
    },
  };
}

/* ---------- concrete slab 10 x 12 ft x 4 in ---------- */
{
  const r = calculateConcrete({ wastePercent: 10, parts: [{ kind: 'slab', label: 'Slab 1', lengthFt: 10, widthFt: 12, thicknessIn: 4 }] });
  out['concrete-calculator'] = {
    metrics: { 'Order volume': `${r.orderCuYd} yd³`, 'Ready-mix order': `${r.recommendedReadyMixCuYd} yd³`, Waste: r.wastePercent, 'Approx. weight': `${(r.approxWeightLb / 2000).toFixed(2)} tons` },
    engine: { orderCuFt: r.orderCuFt, orderCuYd: r.orderCuYd, recommendedReadyMixCuYd: r.recommendedReadyMixCuYd, approxWeightLb: r.approxWeightLb, bags: r.bags },
  };
}

/* ---------- pavers ---------- */
{
  const input = { paverLengthIn: 6, paverWidthIn: 6, jointWidthIn: 0.125, wastePercent: 10, baseDepthIn: 6, beddingSandDepthIn: 1 };
  const a = calculatePavers({ ...input, areas: [rect(20, 30)] });
  out['paver-calculator'] = {
    metrics: { Pavers: a.paversRequired, Area: `${Math.round(a.areaSqFt)} sq ft`, Base: `${a.base.recommendedOrderCuYd} yd³`, 'Bedding sand': `${a.beddingSand.recommendedOrderCuYd} yd³` },
    engine: { areaSqFt: a.areaSqFt, paversRequired: a.paversRequired, baseCuYd: a.base.recommendedOrderCuYd, sandCuYd: a.beddingSand.recommendedOrderCuYd, edgeOrderLinearFt: a.edgeOrderLinearFt },
  };
  const p = calculatePaverPatio({ ...input, areas: [rect(12, 20)], patioName: 'My Paver Patio' });
  out['paver-patio-calculator'] = {
    metrics: { Pavers: p.paversRequired, Area: `${Math.round(p.areaSqFt)} sq ft`, Base: `${p.base.recommendedOrderCuYd} yd³`, 'Bedding sand': `${p.beddingSand.recommendedOrderCuYd} yd³` },
    engine: { areaSqFt: p.areaSqFt, paversRequired: p.paversRequired, baseCuYd: p.base.recommendedOrderCuYd, sandCuYd: p.beddingSand.recommendedOrderCuYd, patioName: p.patioName },
  };
}

/* ---------- fence: 100 ft, 6 ft, one 4 ft gate (UI default form) ---------- */
const fenceBase = {
  fenceLengthFt: 100, heightFt: 6, fenceType: 'wood-picket' as const, postSpacingFt: 8,
  cornerCount: 0, endCount: 2, gateCount: 1, gateWidthFt: 4, wastePercent: 10,
  picketWidthIn: 5.5, picketSpacingIn: 0.125, panelWidthFt: 8, railsPerSection: 2, railStockLengthFt: 8,
  postHoleDiameterIn: 12, postHoleDepthIn: 30, fastenersPerPicketPerRail: 2, fastenersPerPanel: 8,
};
{
  const r = calculateFence(fenceBase);
  out['fence-calculator'] = {
    metrics: { 'Total posts': r.posts.totalPosts, Rails: r.railPiecesRequired, Concrete: `${r.concrete.recommendedReadyMixCuYd} yd³`, Hardware: r.hardware.fastenerCount },
    engine: {
      totalPosts: r.posts.totalPosts, linePosts: r.posts.linePosts, cornerPosts: r.posts.cornerPosts,
      endPosts: r.posts.endPosts, gatePosts: r.posts.gatePosts, netFenceRunFt: r.netFenceRunFt,
      railPiecesRequired: r.railPiecesRequired, railLinearFtRequired: r.railLinearFtRequired,
      picketsRequired: r.picketsRequired, concreteCuYd: r.concrete.recommendedReadyMixCuYd,
      fastenerCount: r.hardware.fastenerCount, warnings: r.warnings, shoppingList: r.shoppingList,
    },
  };
  const c = calculateFenceCost({
    ...fenceBase,
    pricing: { postPrice: 20, railPricePerPiece: 8, picketPrice: 2, concretePricePerCuYd: 150, hardwarePricePerUnit: 0.25, gatePrice: 120, laborPerLinearFt: 12 },
  });
  out['fence-cost-calculator'] = {
    /* The result panel formats money with the shared formatter, so the expected value is built the same way. */
    metrics: { 'Total estimate': formatCurrency(c.totalCost), Materials: formatCurrency(c.materialCost), Labor: formatCurrency(c.laborCost), Complete: c.costIsComplete ? 'Yes' : 'No' },
    engine: { totalCost: c.totalCost, materialCost: c.materialCost, laborCost: c.laborCost, costIsComplete: c.costIsComplete, lines: c.lines },
  };
  const p = calculateFencePosts({ fenceLengthFt: 100, postSpacingFt: 8, cornerCount: 0, endCount: 2, gateCount: 1, gateWidthFt: 4 });
  out['fence-post-calculator'] = {
    metrics: { 'Total posts': p.totalPosts, 'Line posts': p.linePosts, 'Gate posts': p.gatePosts, 'Net run': `${p.netFenceRunFt} ft` },
    engine: { totalPosts: p.totalPosts, linePosts: p.linePosts, cornerPosts: p.cornerPosts, endPosts: p.endPosts, gatePosts: p.gatePosts, netFenceRunFt: p.netFenceRunFt, gateOpeningLengthFt: p.gateOpeningLengthFt },
  };
}

/* ---------- deck: 12 x 20 ft, UI default framing form ---------- */
{
  const r = calculateDeckMaterials({
    deckLabel: 'Deck Project', deckLengthFt: 12, deckWidthFt: 20, deckingBoardWidthIn: 5.5,
    deckingBoardLengthFt: 16, boardGapIn: 0.125, boardRunDirection: 'length', joistSpacingIn: 16,
    joistWidthIn: 1.5, joistDepthIn: 7.25, beamCount: 0, postCount: 0, wastePercent: 10,
    fastenersPerBoardPerJoist: 2, pricing: {},
  });
  out['deck-material-calculator'] = {
    metrics: { 'Decking boards': r.deckingBoardsRequired, Joists: r.joistsOrdered, Fasteners: r.fastenersOrdered, Area: `${Math.round(r.areaSqFt)} sq ft` },
    engine: {
      areaSqFt: r.areaSqFt, deckingBoardsRequired: r.deckingBoardsRequired, deckingLinearFtOrdered: r.deckingLinearFtOrdered,
      joistsOrdered: r.joistsOrdered, joistPiecesOrdered: r.joistPiecesOrdered, joistLinearFtOrdered: r.joistLinearFtOrdered,
      fastenersOrdered: r.fastenersOrdered, postCount: r.postCount, warnings: r.warnings,
    },
  };
}

mkdirSync(join(__dirname, 'artifacts'), { recursive: true });
writeFileSync(join(__dirname, 'artifacts', 'expected.json'), JSON.stringify(out, null, 2));
console.log(`expected.json written for ${Object.keys(out).length} calculators`);
export {};
