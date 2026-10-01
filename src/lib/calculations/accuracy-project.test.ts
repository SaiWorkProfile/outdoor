/**
 * Phase 6 calculator accuracy audit — project calculators:
 * driveway, concrete, paver / paver patio, fence, fence cost, fence post, deck.
 *
 * Expected numbers are worked out by hand from the documented formulas in
 * `src/lib/calculations/*`. The engine is never used to generate its own
 * expectations, and no formula is changed to satisfy this suite.
 *
 * Case matrix: normal, small, large, decimal, zero, negative/invalid, waste,
 * multiple sections/areas, unit conversion, cost, boundary, impossible,
 * very large.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { calculateDriveway } from './driveway';
import { calculateConcrete } from './concrete';
import { calculatePavers, calculatePaverPatio } from './paver';
import { calculateFence, calculateFenceCost } from './fence';
import { calculateFencePosts } from './fence-post';
import { calculateDeckMaterials } from './deck';
import { CalcInputError, tryCalculate } from '../validation';

const rect = (length: number, width: number) => ({ kind: 'rectangle' as const, length, width });
const approx = (a: number, b: number, tol = 0.01, note = '') =>
  assert.ok(Math.abs(a - b) <= tol, `${note} ${a} !~ ${b} (tol ${tol})`);

/* ------------------------------------------------------------------ driveway */

describe('driveway calculator', () => {
  const sections = [rect(50, 10)];

  test('normal case: 500 sq ft with the three default layers', () => {
    const r = calculateDriveway({ sections });
    assert.equal(r.areaSqFt, 500);
    assert.equal(r.totalDepthIn, 8);            // 4 + 2 + 2
    assert.equal(r.layers.length, 3);
    // base: 500 * 4/12 = 166.67 cf * 1.15 compaction * 1.10 waste = 210.83 cf = 7.81 cu yd
    approx(r.layers[0]!.result.volumeCuYd, 7.81);
    approx(r.layers[1]!.result.volumeCuYd, 3.9);
    approx(r.layers[2]!.result.volumeCuYd, 3.73);
    approx(r.totalVolumeCuYd, 15.45);
    approx(r.totalTons, 21.63, 0.05);           // 15.4475 cu yd * 1.4 t/cu yd
    assert.equal(r.costIsComplete, false);
    assert.equal(r.totalCost, undefined, 'no price entered means no invented total');
    assert.equal(r.warnings.length, 0);
  });

  test('multiple sections add up (drive + parking pad)', () => {
    const one = calculateDriveway({ sections });
    const two = calculateDriveway({ sections: [...sections, rect(10, 10)] });
    assert.equal(two.areaSqFt, 600);
    approx(two.totalVolumeCuYd / one.totalVolumeCuYd, 1.2, 0.01, '20% more area');
  });

  test('cost: per-ton and per-cubic-yard prices with delivery loads and fees', () => {
    const r = calculateDriveway({
      sections,
      layers: [
        { name: 'Base', depthIn: 4, compactionFactor: 1.15, pricePerTon: 40 },
        { name: 'Surface', depthIn: 3, pricePerCuYd: 60 },
      ],
      truckCapacityTons: 10,
      deliveryFeePerLoad: 100,
    });
    assert.equal(r.costIsComplete, true);
    assert.equal(r.materialCost, 752.28);       // 437.28 + 315.00
    assert.equal(r.delivery!.loads, 2);
    assert.equal(r.delivery!.totalFee, 200);
    assert.equal(r.totalCost, 952.28);
  });

  test('incomplete prices are flagged instead of hidden', () => {
    const r = calculateDriveway({
      sections,
      layers: [{ name: 'Base', depthIn: 6, pricePerTon: 40 }, { name: 'Surface', depthIn: 3 }],
    });
    assert.equal(r.costIsComplete, false);
    assert.ok(r.warnings.some((w) => w.includes('incomplete')));
  });

  test('boundary: exactly 6 in total depth is not "on the light side"', () => {
    const edge = calculateDriveway({ sections, layers: [{ name: 'Only', depthIn: 6 }] });
    assert.equal(edge.totalDepthIn, 6);
    assert.equal(edge.warnings.length, 0);
    const light = calculateDriveway({ sections, layers: [{ name: 'Only', depthIn: 5.9 }] });
    assert.ok(light.warnings.some((w) => w.includes('light side')));
  });

  test('decimal and large sections stay finite', () => {
    const decimal = calculateDriveway({ sections: [rect(10.5, 20.25)] });
    approx(decimal.areaSqFt, 212.63, 0.01, 'decimal area');
    const large = calculateDriveway({ sections: [rect(5000, 100)] });
    assert.equal(large.areaSqFt, 500000);
    assert.ok(Number.isFinite(large.totalTons));
    assert.ok(Number.isFinite(large.totalOrderCuYd));
  });

  test('zero, negative and invalid input name the offending field', () => {
    const zero = tryCalculate(() => calculateDriveway({ sections, layers: [{ name: 'Base', depthIn: 0 }] }));
    assert.equal(zero.ok, false);
    if (!zero.ok) assert.equal(zero.error.field, 'depthIn');

    const negative = tryCalculate(() => calculateDriveway({ sections: [rect(-10, 10)] }));
    assert.equal(negative.ok, false);
    if (!negative.ok) assert.equal(negative.error.field, 'areas[0].length');

    const noSections = tryCalculate(() => calculateDriveway({ sections: [] }));
    assert.equal(noSections.ok, false);
    if (!noSections.ok) assert.equal(noSections.error.field, 'areas');

    const conflict = tryCalculate(() =>
      calculateDriveway({ sections, layers: [{ name: 'x', depthIn: 3, pricePerTon: 1, pricePerCuYd: 1 }] }),
    );
    assert.equal(conflict.ok, false);
    if (!conflict.ok) assert.equal(conflict.error.field, 'layers[0]');

    const feeWithoutTruck = tryCalculate(() => calculateDriveway({ sections, deliveryFeePerLoad: 100 }));
    assert.equal(feeWithoutTruck.ok, false);
    if (!feeWithoutTruck.ok) assert.equal(feeWithoutTruck.error.field, 'deliveryFeePerLoad');

    assert.equal(tryCalculate(() => calculateDriveway({ sections })).ok, true);
  });

  test('impossible input is rejected rather than rounded into a wrong answer', () => {
    const overflow = tryCalculate(() =>
      calculateDriveway({ sections: [rect(Number.MAX_VALUE, 4)], layers: [{ name: 'Base', depthIn: 4 }] }),
    );
    assert.equal(overflow.ok, false);
    if (!overflow.ok) assert.equal(overflow.error.field, 'areas[0].areaSqFt');
  });
});

/* ------------------------------------------------------------------- concrete */

describe('concrete calculator', () => {
  test('normal case: 10 x 12 ft slab at 4 in with 10% waste', () => {
    const r = calculateConcrete({ parts: [{ kind: 'slab', lengthFt: 10, widthFt: 12, thicknessIn: 4 }] });
    assert.equal(r.volumeCuFt, 40);             // 10 * 12 * 4/12
    assert.equal(r.orderCuFt, 44);              // +10% waste
    assert.equal(r.orderCuYd, 1.63);            // 44 / 27
    assert.equal(r.recommendedReadyMixCuYd, 1.75); // rounded up to the 0.25 order step
    assert.deepEqual(r.bags.map((b) => [b.bagLb, b.count]), [[40, 147], [50, 118], [60, 98], [80, 74]]);
    assert.equal(r.approxWeightLb, 6600);       // 44 cu ft * 150 lb/cu ft
    assert.equal(r.purchaseAdvice, 'bulk');
    assert.equal(r.warnings.length, 0);
    assert.equal(r.wastePercent, 10);
  });

  test('small case: 1 x 1 ft pad at 1 in needs the quarter-yard minimum', () => {
    const r = calculateConcrete({ wastePercent: 0, parts: [{ kind: 'slab', lengthFt: 1, widthFt: 1, thicknessIn: 1 }] });
    assert.equal(r.volumeCuFt, 0.08);           // 0.0833 cu ft
    assert.equal(r.orderCuYd, 0);               // 0.0031 cu yd rounds to 0 for display
    assert.equal(r.recommendedReadyMixCuYd, 0.25);
    assert.equal(r.purchaseAdvice, 'bags');
    assert.equal(r.approxWeightLb, 13);         // 12.5 lb
    assert.equal(r.bags.find((b) => b.bagLb === 40)!.count, 1);
  });

  test('large case: 100 x 200 ft slab at 8 in', () => {
    const r = calculateConcrete({ parts: [{ kind: 'slab', lengthFt: 100, widthFt: 200, thicknessIn: 8 }] });
    assert.equal(r.volumeCuFt, 13333.33);
    assert.equal(r.orderCuFt, 14666.67);
    assert.equal(r.orderCuYd, 543.21);
    assert.equal(r.recommendedReadyMixCuYd, 543.25);
    approx(r.approxWeightLb, 2200000, 1, 'weight');
    assert.ok(Number.isFinite(r.orderCuM));
  });

  test('decimal case: 8.5 x 4.25 ft at 3.5 in with 5% waste', () => {
    const r = calculateConcrete({ wastePercent: 5, parts: [{ kind: 'slab', lengthFt: 8.5, widthFt: 4.25, thicknessIn: 3.5 }] });
    approx(r.volumeCuFt, 10.54, 0.01, 'volume');  // 36.125 * 3.5/12
    approx(r.orderCuFt, 11.06, 0.01, 'order');    // * 1.05
    assert.equal(r.orderCuYd, 0.41);
    assert.equal(r.recommendedReadyMixCuYd, 0.5);
  });

  test('footings and post holes mix with slabs in one estimate', () => {
    const r = calculateConcrete({
      wastePercent: 0,
      parts: [
        { kind: 'slab', label: 'Slab', lengthFt: 10, widthFt: 10, thicknessIn: 4 },
        { kind: 'footing', label: 'Footing', lengthFt: 20, widthIn: 12, depthIn: 12 },
        { kind: 'post-hole', label: 'Holes', diameterIn: 12, depthIn: 30, count: 4 },
      ],
    });
    assert.equal(r.parts.length, 3);
    assert.equal(r.parts[0]!.volumeCuFt, 33.33);
    assert.equal(r.parts[1]!.volumeCuFt, 20);    // 20 ft * 1 ft * 1 ft
    approx(r.parts[2]!.volumeCuFt, Math.PI * 0.25 * 2.5 * 4, 0.01, 'holes');
    approx(r.volumeCuFt, 61.19, 0.02, 'total');
    approx(r.orderCuFt, 61.19, 0.05, 'order with waste');
  });

  test('zero and 100% waste are valid boundaries', () => {
    const none = calculateConcrete({ wastePercent: 0, parts: [{ kind: 'slab', lengthFt: 10, widthFt: 10, thicknessIn: 4 }] });
    assert.equal(none.orderCuFt, 33.33);
    const full = calculateConcrete({ wastePercent: 100, parts: [{ kind: 'slab', lengthFt: 10, widthFt: 10, thicknessIn: 4 }] });
    assert.equal(full.orderCuFt, 66.67);
    assert.equal(full.recommendedReadyMixCuYd, 2.5);
    assert.equal(full.warnings.length, 0, 'concrete caps waste at 100% without a high-waste warning');
  });

  test('zero, negative and invalid input name the offending field', () => {
    const cases: Array<[Parameters<typeof calculateConcrete>[0], string]> = [
      [{ parts: [] }, 'parts'],
      [{ parts: [{ kind: 'slab', lengthFt: 10, widthFt: 10, thicknessIn: 0 }] }, 'parts[0].thicknessIn'],
      [{ parts: [{ kind: 'slab', lengthFt: -1, widthFt: 10, thicknessIn: 4 }] }, 'parts[0].lengthFt'],
      [{ parts: [{ kind: 'footing', lengthFt: 10, widthIn: 0, depthIn: 12 }] }, 'parts[0].widthIn'],
      [{ parts: [{ kind: 'post-hole', diameterIn: 10, depthIn: 30, count: 0 }] }, 'parts[0].count'],
      [{ parts: [{ kind: 'post-hole', diameterIn: 10, depthIn: -1, count: 2 }] }, 'parts[0].depthIn'],
      [{ parts: [{ kind: 'slab', lengthFt: 10, widthFt: 10, thicknessIn: 4 }], wastePercent: -1 }, 'wastePercent'],
      [{ parts: [{ kind: 'slab', lengthFt: 10, widthFt: 10, thicknessIn: 4 }], wastePercent: 101 }, 'wastePercent'],
      [{ parts: [{ kind: 'slab', lengthFt: 10, widthFt: 10, thicknessIn: 4 }], concreteLbPerCuFt: 0 }, 'concreteLbPerCuFt'],
      [{ parts: [{ kind: 'slab', lengthFt: 10, widthFt: 10, thicknessIn: 4 }], readyMixIncrementCuYd: -1 }, 'readyMixIncrementCuYd'],
    ];
    for (const [input, field] of cases) {
      const r = tryCalculate(() => calculateConcrete(input));
      assert.equal(r.ok, false, field);
      if (!r.ok) assert.equal(r.error.field, field);
    }
  });

  test('thin slabs and tiny waste warn; very large and impossible cases behave', () => {
    const thin = calculateConcrete({ wastePercent: 2, parts: [{ kind: 'slab', lengthFt: 5, widthFt: 5, thicknessIn: 3 }] });
    assert.equal(thin.warnings.length, 2);
    assert.equal(thin.purchaseAdvice, 'bags');

    const huge = calculateConcrete({ wastePercent: 0, parts: [{ kind: 'slab', lengthFt: 500, widthFt: 500, thicknessIn: 12 }] });
    assert.equal(huge.volumeCuFt, 250000);
    assert.equal(huge.orderCuYd, 9259.26);
    assert.ok(Number.isFinite(huge.approxWeightLb));

    const impossible = tryCalculate(() =>
      calculateConcrete({ parts: [{ kind: 'slab', lengthFt: Number.MAX_VALUE, widthFt: 2, thicknessIn: 3 }] }),
    );
    assert.equal(impossible.ok, false);
  });
});

/* ------------------------------------------------------ paver / paver patio */

describe('paver calculator', () => {
  const base = {
    areas: [rect(12, 20)],
    paverLengthIn: 6,
    paverWidthIn: 6,
    jointWidthIn: 0.125,
    wastePercent: 10,
    baseDepthIn: 6,
    beddingSandDepthIn: 1,
  };

  test('normal case: 240 sq ft patio with 6 x 6 pavers', () => {
    const r = calculatePavers(base);
    assert.equal(r.areaSqFt, 240);
    assert.equal(r.paverAreaSqIn, 36);              // 6 * 6
    assert.equal(r.paverModuleSqIn, 37.5156);       // (6 + 0.125) * (6 + 0.125)
    assert.equal(r.paverCountBeforeWaste, 922);     // ceil(34560 sq in / 37.5156)
    assert.equal(r.paversRequired, 1015);           // ceil(922 * 1.10)
    assert.equal(r.paverSurfaceSqFtOrdered, 264);   // 240 * 1.10
    // base: 120 cf * 1.10 compaction * 1.10 waste = 145.2 cf
    assert.equal(r.base.volumeCuFt, 145.2);
    assert.equal(r.base.volumeCuYd, 5.38);
    assert.equal(r.base.recommendedOrderCuYd, 5.5);
    assert.equal(r.base.tons, 7.53);                // 5.3778 * 1.4
    // bedding sand: 20 cf * 1.10 waste = 22 cf
    assert.equal(r.beddingSand.volumeCuFt, 22);
    assert.equal(r.beddingSand.volumeCuYd, 0.81);
    assert.equal(r.beddingSand.recommendedOrderCuYd, 1);
    assert.equal(r.beddingSand.tons, 1.1);          // 0.8148 * 1.35
    // edge restraint derived from the rectangle perimeter
    assert.equal(r.edgeLinearFt, 64);               // 2 * (12 + 20)
    assert.equal(r.edgeOrderLinearFt, 70.4);        // 64 * 1.10
    assert.equal(r.edgePieces, 9);                  // ceil(70.4 / 8 ft stock)
    assert.equal(r.wastePercent, 10);
  });

  test('cost: entered prices only, applied to the order quantities', () => {
    const r = calculatePavers({
      ...base,
      pricing: { perPaver: 1.75, base: { perCuYd: 50 }, beddingSand: { perCuYd: 40 }, edgingPerLinearFt: 2 },
    });
    const byComponent = Object.fromEntries(r.costs.map((c) => [c.component, c]));
    assert.equal(byComponent['pavers']!.materialCost, 1776.25); // 1015 * 1.75
    assert.equal(byComponent['base']!.quantity, 5.5);
    assert.equal(byComponent['base']!.materialCost, 275);
    assert.equal(byComponent['bedding-sand']!.quantity, 1);
    assert.equal(byComponent['bedding-sand']!.materialCost, 40);
    assert.equal(byComponent['edging']!.quantity, 70.4);
    assert.equal(byComponent['edging']!.materialCost, 140.8);
    const total = r.costs.reduce((sum, c) => sum + c.materialCost, 0);
    assert.equal(Number(total.toFixed(2)), 2232.05);
    assert.deepEqual(calculatePavers({ ...base, wastePercent: 0 }).costs, [], 'no price = no invented cost');
  });

  test('zero joint width and zero waste boundaries', () => {
    const noJoint = calculatePavers({ ...base, jointWidthIn: 0, wastePercent: 0 });
    assert.equal(noJoint.paverModuleSqIn, 36);        // 6 * 6 exactly
    assert.equal(noJoint.paverCountBeforeWaste, 960); // 34560 / 36
    assert.equal(noJoint.paversRequired, 960);        // no waste to add
    assert.equal(noJoint.warnings.filter((w) => w.includes('unusually high')).length, 0);
  });

  test('waste boundary: 25% is accepted, 26% is flagged', () => {
    const ok = calculatePavers({ ...base, wastePercent: 25 });
    assert.equal(ok.warnings.filter((w) => w.includes('unusually high')).length, 0);
    assert.equal(ok.paversRequired, Math.ceil(ok.paverCountBeforeWaste * 1.25));
    const high = calculatePavers({ ...base, wastePercent: 26 });
    assert.ok(high.warnings.some((w) => w.includes('unusually high')));
  });

  test('joint width above 1/4 in warns but still calculates', () => {
    const r = calculatePavers({ ...base, jointWidthIn: 0.5 });
    assert.ok(r.warnings.some((w) => w.includes('joint width above')));
    assert.ok(r.paversRequired > 0);
  });

  test('multiple areas and a manual edge length are honoured', () => {
    const r = calculatePavers({
      areas: [rect(10, 10), { kind: 'circle', diameter: 10 }, { kind: 'triangle', base: 10, height: 10 }],
      paverLengthIn: 6,
      paverWidthIn: 6,
      edgeLinearFt: 150,
      wastePercent: 0,
    });
    approx(r.areaSqFt, 100 + Math.PI * 25 + 50, 0.01, 'total area');
    assert.equal(r.edgeLinearFt, 150);
    assert.equal(r.edgeOrderLinearFt, 150);           // no waste to add
  });

  test('triangle-only projects warn that edge length cannot be derived', () => {
    const r = calculatePavers({ areas: [{ kind: 'triangle', base: 10, height: 10 }], paverLengthIn: 6, paverWidthIn: 6 });
    assert.ok(r.warnings.some((w) => w.includes('Edge length')));
  });

  test('zero, negative and invalid input name the offending field', () => {
    const cases: Array<[Parameters<typeof calculatePavers>[0], string]> = [
      [{ areas: [], paverLengthIn: 6, paverWidthIn: 6 }, 'areas'],
      [{ areas: [rect(10, 10)], paverLengthIn: 0, paverWidthIn: 6 }, 'paverLengthIn'],
      [{ areas: [rect(10, 10)], paverLengthIn: 6, paverWidthIn: -1 }, 'paverWidthIn'],
      [{ areas: [rect(10, 10)], paverLengthIn: 6, paverWidthIn: 6, jointWidthIn: -0.1 }, 'jointWidthIn'],
      [{ areas: [rect(10, 10)], paverLengthIn: 6, paverWidthIn: 6, wastePercent: -1 }, 'wastePercent'],
      [{ areas: [rect(10, 10)], paverLengthIn: 6, paverWidthIn: 6, baseDepthIn: 0 }, 'baseDepthIn'],
      [{ areas: [rect(10, 10)], paverLengthIn: 6, paverWidthIn: 6, beddingSandDepthIn: -1 }, 'beddingSandDepthIn'],
      [{ areas: [rect(10, 10)], paverLengthIn: 6, paverWidthIn: 6, edgeLinearFt: -5 }, 'edgeLinearFt'],
      [{ areas: [rect(10, 10)], paverLengthIn: 6, paverWidthIn: 6, pricing: { perPaver: -1 } }, 'pricing.perPaver'],
      [{ areas: [rect(0, 10)], paverLengthIn: 6, paverWidthIn: 6 }, 'areas[0].length'],
    ];
    for (const [input, field] of cases) {
      const r = tryCalculate(() => calculatePavers(input));
      assert.equal(r.ok, false, field);
      if (!r.ok) assert.equal(r.error.field, field);
    }
  });

  test('large project stays finite and keeps the waste relationship', () => {
    const r = calculatePavers({
      areas: [rect(200, 200)], paverLengthIn: 4, paverWidthIn: 4, jointWidthIn: 0.125, wastePercent: 10,
    });
    assert.equal(r.areaSqFt, 40000);
    // 40000 sq ft = 5,760,000 sq in; module = 4.125^2 = 17.015625 sq in
    approx(r.paverCountBeforeWaste, 338513, 2, 'large paver count');
    assert.equal(r.paversRequired, Math.ceil(r.paverCountBeforeWaste * 1.1));
    assert.ok(Number.isFinite(r.base.recommendedOrderCuYd));
    assert.ok(Number.isFinite(r.beddingSand.tons));
  });
});

describe('paver patio calculator', () => {
  test('patio result keeps printable quantities and its project type', () => {
    const r = calculatePaverPatio({
      areas: [rect(12, 20)],
      paverLengthIn: 12,
      paverWidthIn: 12,
      jointWidthIn: 0.125,
      wastePercent: 5,
      baseDepthIn: 6,
      beddingSandDepthIn: 1,
      patioName: 'Backyard Patio',
    });
    assert.equal(r.projectType, 'paver-patio');
    assert.equal(r.patioName, 'Backyard Patio');
    assert.equal(r.areaSqFt, 240);
    approx(r.base.volumeCuYd, 5.13, 0.01, 'base with 5% waste'); // 120 * 1.1 * 1.05 / 27
    approx(r.beddingSand.volumeCuYd, 0.78, 0.01, 'sand');         // 20 * 1.05 / 27
    assert.equal(r.edgeLinearFt, 64);
    assert.equal(r.printableQuantities.length, r.shoppingList.length);
    assert.ok(r.printableQuantities.every((q) => q.quantity > 0));
  });

  test('blank patio name falls back to the default project name', () => {
    const r = calculatePaverPatio({
      areas: [rect(10, 10)], paverLengthIn: 6, paverWidthIn: 6, patioName: '   ',
    });
    assert.equal(r.patioName, 'Paver Patio Project');
  });
});

/* ------------------------------------------------- fence / fence cost / fence post */

const FENCE = {
  fenceLengthFt: 100,
  heightFt: 6,
  fenceType: 'wood-picket' as const,
  postSpacingFt: 8,
  cornerCount: 0,
  endCount: 2,
  gateCount: 1,
  gateWidthFt: 4,
  wastePercent: 10,
  picketWidthIn: 5.5,
  picketSpacingIn: 0.125,
  panelWidthFt: 8,
  railsPerSection: 2,
  railStockLengthFt: 8,
  postHoleDiameterIn: 12,
  postHoleDepthIn: 30,
  fastenersPerPicketPerRail: 2,
  fastenersPerPanel: 8,
};

describe('fence calculator', () => {
  test('normal case: 100 ft picket fence with one 4 ft gate', () => {
    const r = calculateFence(FENCE);
    assert.equal(r.fenceLengthFt, 100);
    assert.equal(r.netFenceRunFt, 96);                // 100 - 4 ft gate opening
    assert.equal(r.posts.estimatedPostPositions, 13); // ceil(96 / 8) + 1
    assert.equal(r.posts.linePosts, 11);              // 13 - 0 corners - 2 ends
    assert.equal(r.posts.gatePosts, 2);
    assert.equal(r.posts.totalPosts, 15);             // 11 + 0 + 2 + 2
    assert.equal(r.railLinearFtRequired, 192);        // 96 * 2 rails
    assert.equal(r.railPiecesRequired, 27);           // ceil(211.2 / 8 ft stock)
    assert.equal(r.picketsRequired, 226);             // ceil(1152 in / 5.625 in pitch * 1.10)
    assert.equal(r.concrete.recommendedReadyMixCuYd, 1.25); // 15 holes, rounded up 0.25
    assert.equal(r.hardware.fastenerCount, 995);      // ceil(226 * 2 rails * 2 * 1.10)
    assert.equal(r.hardware.gateHardwareSets, 1);
    assert.equal(r.wastePercent, 10);
    assert.equal(r.shoppingList.length, 6); // posts, rails, concrete, hardware, pickets, gate hardware
    assert.ok(r.shoppingList.some((x) => x.id === 'pickets'));
    assert.ok(r.warnings.some((w) => w.includes('not structural engineering')));
  });

  test('fence types change which quantities are produced', () => {
    const panel = calculateFence({ ...FENCE, fenceType: 'privacy-panel' });
    assert.equal(panel.picketsRequired, undefined);
    assert.equal(panel.panelsRequired, 14);              // ceil(96 / 8 ft * 1.10)

    const chain = calculateFence({ ...FENCE, fenceType: 'chain-link' });
    assert.equal(chain.chainLinkLinearFtRequired, 105.6); // 96 * 1.10
    assert.equal(chain.picketsRequired, undefined);
    assert.equal(chain.panelsRequired, undefined);
  });

  test('corners, multiple gates and spacing change the post count', () => {
    const corners = calculateFence({ ...FENCE, cornerCount: 3, gateCount: 0 });
    assert.equal(corners.netFenceRunFt, 100);
    assert.equal(corners.posts.estimatedPostPositions, 14); // ceil(100/8) + 1
    assert.equal(corners.posts.linePosts, 9);               // 14 - 3 - 2
    assert.equal(corners.posts.totalPosts, 14);

    const twoGates = calculateFence({ ...FENCE, gateCount: 2, gateWidthFt: 4 });
    assert.equal(twoGates.netFenceRunFt, 92);
    assert.equal(twoGates.posts.gatePosts, 4);
    assert.equal(twoGates.posts.totalPosts, 17);
  });

  test('height boundary drives the default rail count and warnings', () => {
    const six = calculateFence({ ...FENCE, railsPerSection: undefined });
    assert.equal(six.railsPerSection, 2);            // 6 ft or less -> 2 rails
    const tall = calculateFence({ ...FENCE, heightFt: 7, railsPerSection: undefined });
    assert.equal(tall.railsPerSection, 3);           // above 6 ft -> 3 rails
    const eightFt = calculateFence({ ...FENCE, heightFt: 8 });
    assert.equal(eightFt.warnings.some((w) => w.includes('above 8 ft')), false);
    const nineFt = calculateFence({ ...FENCE, heightFt: 9 });
    assert.ok(nineFt.warnings.some((w) => w.includes('above 8 ft')));
  });

  test('zero, negative and invalid input name the offending field', () => {
    const cases: Array<[Parameters<typeof calculateFence>[0], string]> = [
      [{ ...FENCE, fenceLengthFt: 0 }, 'fenceLengthFt'],
      [{ ...FENCE, heightFt: -1 }, 'heightFt'],
      [{ ...FENCE, postSpacingFt: 0 }, 'postSpacingFt'],
      [{ ...FENCE, wastePercent: 101 }, 'wastePercent'],
      [{ ...FENCE, railStockLengthFt: 0 }, 'railStockLengthFt'],
      [{ ...FENCE, picketWidthIn: -1 }, 'picketWidthIn'],
      [{ ...FENCE, fenceType: 'privacy-panel', panelWidthFt: 0 }, 'panelWidthFt'],
      [{ ...FENCE, gateWidthFt: 100 }, 'gateWidthFt'],
    ];
    for (const [input, field] of cases) {
      const r = tryCalculate(() => calculateFence(input));
      assert.equal(r.ok, false, field);
      if (!r.ok) assert.equal(r.error.field, field);
    }
  });

  test('large fence stays finite', () => {
    const r = calculateFence({ ...FENCE, fenceLengthFt: 5000, gateCount: 0 });
    assert.equal(r.netFenceRunFt, 5000);
    assert.equal(r.posts.estimatedPostPositions, 626); // ceil(5000/8) + 1
    assert.ok(Number.isFinite(r.concrete.recommendedReadyMixCuYd));
    assert.ok(r.hardware.fastenerCount > 0);
  });
});

describe('fence cost calculator', () => {
  test('cost: entered prices only, summed into material, labour and total', () => {
    const r = calculateFenceCost({
      ...FENCE,
      pricing: {
        postPrice: 20, railPricePerPiece: 8, picketPrice: 2, concretePricePerCuYd: 150,
        hardwarePricePerUnit: 0.25, gatePrice: 120, laborPerLinearFt: 12,
      },
    });
    const byComponent = Object.fromEntries(r.lines.map((l) => [l.component, l]));
    assert.equal(byComponent.posts!.cost, 300);       // 15 * 20
    assert.equal(byComponent.rails!.cost, 216);       // 27 * 8
    assert.equal(byComponent.pickets!.cost, 452);     // 226 * 2
    assert.equal(byComponent.concrete!.cost, 187.5);  // 1.25 * 150
    assert.equal(byComponent.hardware!.cost, 248.75); // 995 * 0.25
    assert.equal(byComponent.gates!.cost, 120);       // 1 * 120
    assert.equal(byComponent.labor!.cost, 1200);      // 100 * 12
    assert.equal(r.materialCost, 1524.25);
    assert.equal(r.laborCost, 1200);
    assert.equal(r.totalCost, 2724.25);
    assert.equal(r.costIsComplete, true);
    assert.deepEqual(r.missingPrices, []);
  });

  test('missing prices are listed instead of fabricated', () => {
    const none = calculateFenceCost({ ...FENCE, pricing: {} });
    assert.equal(none.costIsComplete, false);
    assert.equal(none.materialCost, 0);
    assert.equal(none.laborCost, 0);
    assert.equal(none.totalCost, 0);
    assert.ok(none.missingPrices.includes('laborPerLinearFt or laborFlat'));
    assert.ok(none.missingPrices.includes('postPrice'));

    const partial = calculateFenceCost({ ...FENCE, pricing: { postPrice: 20 } });
    assert.equal(partial.costIsComplete, false);
    assert.ok(partial.materialCost > 0, 'entered prices still cost something');
    assert.ok(partial.missingPrices.length > 0);
  });

  test('negative prices are impossible input', () => {
    const r = tryCalculate(() => calculateFenceCost({ ...FENCE, pricing: { postPrice: -1 } }));
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.error.field, 'pricing.postPrice');
  });
});

describe('fence post calculator', () => {
  test('normal case matches the fence calculator post breakdown', () => {
    const r = calculateFencePosts({ fenceLengthFt: 100, postSpacingFt: 8, gateCount: 1, gateWidthFt: 4 });
    assert.equal(r.gateOpeningLengthFt, 4);
    assert.equal(r.netFenceRunFt, 96);
    assert.equal(r.estimatedPostPositions, 13);
    assert.equal(r.linePosts, 11);
    assert.equal(r.endPosts, 2);
    assert.equal(r.cornerPosts, 0);
    assert.equal(r.gatePosts, 2);
    assert.equal(r.totalPosts, 15);
    assert.equal(r.totalPosts, r.linePosts + r.cornerPosts + r.endPosts + r.gatePosts);
  });

  test('boundary: a run exactly one spacing long still needs two end posts', () => {
    const r = calculateFencePosts({ fenceLengthFt: 8, postSpacingFt: 8, endCount: 2 });
    assert.equal(r.netFenceRunFt, 8);
    assert.equal(r.estimatedPostPositions, 2);
    assert.equal(r.linePosts, 0);
    assert.equal(r.totalPosts, 2);
  });

  test('decimal length and spacing are handled with a ceiling', () => {
    const r = calculateFencePosts({ fenceLengthFt: 50.5, postSpacingFt: 6.5, endCount: 2 });
    assert.equal(r.estimatedPostPositions, 9); // ceil(50.5 / 6.5) + 1
    assert.equal(r.linePosts, 7);
    assert.equal(r.totalPosts, 9);
  });

  test('impossible layouts are rejected with the right field', () => {
    const gateTooWide = tryCalculate(() =>
      calculateFencePosts({ fenceLengthFt: 10, postSpacingFt: 8, gateCount: 1, gateWidthFt: 10 }),
    );
    assert.equal(gateTooWide.ok, false);
    if (!gateTooWide.ok) assert.equal(gateTooWide.error.field, 'gateWidthFt');

    const tooManyPosts = tryCalculate(() =>
      calculateFencePosts({ fenceLengthFt: 10, postSpacingFt: 8, cornerCount: 5, endCount: 5 }),
    );
    assert.equal(tooManyPosts.ok, false);
    if (!tooManyPosts.ok) assert.equal(tooManyPosts.error.field, 'cornerCount');

    const badSpacing = tryCalculate(() => calculateFencePosts({ fenceLengthFt: 100, postSpacingFt: 0 }));
    assert.equal(badSpacing.ok, false);
    if (!badSpacing.ok) assert.equal(badSpacing.error.field, 'postSpacingFt');

    const negative = tryCalculate(() => calculateFencePosts({ fenceLengthFt: -5, postSpacingFt: 8 }));
    assert.equal(negative.ok, false);
    if (!negative.ok) assert.equal(negative.error.field, 'fenceLengthFt');

    const missingGateWidth = tryCalculate(() =>
      calculateFencePosts({ fenceLengthFt: 100, postSpacingFt: 8, gateCount: 1 }),
    );
    assert.equal(missingGateWidth.ok, false);
    if (!missingGateWidth.ok) assert.equal(missingGateWidth.error.field, 'gateWidthFt');
  });

  test('layout notes are always shown so counts are not mistaken for a survey', () => {
    const r = calculateFencePosts({ fenceLengthFt: 100, postSpacingFt: 8 });
    assert.equal(r.notes.length, 2);
    assert.ok(r.notes[0]!.includes('spacing'));
  });
});

/* ---------------------------------------------------------------------- deck */

describe('deck material calculator', () => {
  const DECK = {
    deckLengthFt: 20,
    deckWidthFt: 12,
    deckingBoardWidthIn: 5.5,
    deckingBoardLengthFt: 16,
    boardGapIn: 0.125,
    boardRunDirection: 'length' as const,
    joistSpacingIn: 16,
    wastePercent: 10,
    fastenersPerBoardPerJoist: 2,
    postCount: 6,
  };

  test('normal case: 12 x 20 ft deck with 5.5 in boards and 16 in joist spacing', () => {
    const r = calculateDeckMaterials(DECK);
    assert.equal(r.areaSqFt, 240);
    assert.equal(r.boardCoverageWidthFt, 0.4688);  // (5.5 + 0.125) / 12, stored to 4 dp
    assert.equal(r.deckingRowsRequired, 26);        // ceil(12 / 0.46875)
    assert.equal(r.boardsPerRowRequired, 2);        // ceil(20 / 16)
    assert.equal(r.deckingBoardsRequired, 58);      // 29 ordered rows * 2 (waste already included)
    assert.equal(r.deckingRowsOrdered, 29);         // ceil(26 * 1.10)
    assert.equal(r.deckingLinearFtRequired, 520);   // 26 rows * 20 ft
    assert.equal(r.deckingLinearFtOrdered, 928);    // 58 boards * 16 ft stock
    assert.equal(r.joistsRequired, 10);             // ceil(144 in / 16 in) + 1
    assert.equal(r.joistsOrdered, 11);              // ceil(10 * 1.10)
    assert.equal(r.joistLinearFtOrdered, 220);      // 11 * 20 ft
    assert.equal(r.perimeterLinearFtRequired, 64);  // 2 * (20 + 12)
    assert.equal(r.rimJoistLinearFtOrdered, 70.4);  // 64 * 1.10
    assert.equal(r.fastenersRequired, 1040);        // 52 required boards * 10 joists * 2
    assert.equal(r.fastenersOrdered, 1144);         // ceil(1040 * 1.10)
    assert.equal(r.postCount, 6);
    assert.equal(r.wastePercent, 10);
    assert.ok(r.warnings.some((w) => w.includes('not structural engineering')));
  });

  test('small case: 4 x 4 ft landing with no waste', () => {
    const r = calculateDeckMaterials({
      deckLengthFt: 4, deckWidthFt: 4, deckingBoardLengthFt: 16, wastePercent: 0, postCount: 4,
    });
    assert.equal(r.areaSqFt, 16);
    assert.equal(r.deckingRowsRequired, 9);   // ceil(4 / 0.46875)
    assert.equal(r.boardsPerRowRequired, 1);  // ceil(4 / 16)
    assert.equal(r.deckingBoardsRequired, 9);
    assert.equal(r.deckingRowsOrdered, 9);
    assert.equal(r.joistsRequired, 4);        // ceil(48 in / 16 in) + 1
    assert.equal(r.fastenersRequired, 72);    // 9 * 4 * 2
    assert.equal(r.fastenersOrdered, 72);
    assert.equal(r.rimJoistLinearFtOrdered, 16);
  });

  test('large case: 40 x 40 ft deck with 10% waste', () => {
    const r = calculateDeckMaterials({
      deckLengthFt: 40, deckWidthFt: 40, deckingBoardLengthFt: 16, wastePercent: 10, postCount: 8,
    });
    assert.equal(r.areaSqFt, 1600);
    assert.equal(r.deckingRowsRequired, 86);   // ceil(40 / 0.46875)
    assert.equal(r.boardsPerRowRequired, 3);   // ceil(40 / 16)
    assert.equal(r.deckingRowsOrdered, 95);    // ceil(86 * 1.10)
    assert.equal(r.deckingBoardsRequired, 285); // 95 ordered rows * 3
    assert.equal(r.joistsRequired, 31);        // ceil(480 in / 16 in) + 1
    assert.equal(r.joistsOrdered, 35);         // ceil(31 * 1.10)
    assert.equal(r.fastenersRequired, 15996);  // 258 required boards * 31 joists * 2
    assert.equal(r.fastenersOrdered, 17596);   // ceil(15996 * 1.10)
  });

  test('decimal dimensions round the area but keep integer board counts', () => {
    const r = calculateDeckMaterials({
      deckLengthFt: 10.5, deckWidthFt: 7.25, deckingBoardWidthIn: 6, boardGapIn: 0.125,
      wastePercent: 0, postCount: 4,
    });
    approx(r.areaSqFt, 76.13, 0.01, 'area');   // 76.125 sq ft
    assert.equal(r.deckingRowsRequired, 15);   // ceil(7.25 / 0.5104167)
    assert.equal(r.boardsPerRowRequired, 1);   // ceil(10.5 / 16)
    assert.equal(r.deckingBoardsRequired, 15);
  });

  test('board run direction swaps rows and stock pieces', () => {
    const alongLength = calculateDeckMaterials({ ...DECK, wastePercent: 0 });
    const alongWidth = calculateDeckMaterials({ ...DECK, wastePercent: 0, boardRunDirection: 'width' });
    assert.equal(alongLength.boardRunLengthFt, 20);
    assert.equal(alongWidth.boardRunLengthFt, 12);
    assert.equal(alongWidth.deckingRowsRequired, 43); // ceil(20 / 0.46875)
    assert.equal(alongWidth.boardsPerRowRequired, 1); // ceil(12 / 16)
    assert.equal(alongWidth.deckingBoardsRequired, 43);
  });

  test('waste boundary: 0% adds nothing, 100% doubles the ordered rows', () => {
    const none = calculateDeckMaterials({ ...DECK, wastePercent: 0 });
    assert.equal(none.deckingRowsOrdered, none.deckingRowsRequired);
    assert.equal(none.joistsOrdered, none.joistsRequired);
    assert.equal(none.deckingBoardsRequired, 52);
    const double = calculateDeckMaterials({ ...DECK, wastePercent: 100 });
    assert.equal(double.deckingRowsOrdered, 52); // 26 * 2
    assert.equal(double.deckingBoardsRequired, 104);
    assert.ok(double.warnings.some((w) => w.includes('unusually high')));
  });

  test('entered prices produce cost lines on the ordered quantities', () => {
    const r = calculateDeckMaterials({
      ...DECK,
      pricing: { deckingPerBoard: 20, joistPerLinearFt: 1.2, fastenerPerEach: 0.2, postPrice: 25, rimJoistPerLinearFt: 1.5 },
    });
    const byComponent = Object.fromEntries(r.costs.map((c) => [c.component, c]));
    assert.equal(byComponent.decking!.cost, 1160);    // 58 ordered boards * 20
    assert.equal(byComponent.joists!.cost, 264);      // 220 linear ft * 1.2
    assert.equal(byComponent.fasteners!.cost, 228.8); // 1144 * 0.2
    assert.equal(byComponent.posts!.cost, 150);       // 6 * 25
    assert.equal(byComponent['rim-joist']!.cost, 105.6); // 70.4 * 1.5
    assert.deepEqual(calculateDeckMaterials(DECK).costs, [], 'no price = no invented cost');
  });

  test('zero, negative and invalid input name the offending field', () => {
    const cases: Array<[Parameters<typeof calculateDeckMaterials>[0], string]> = [
      [{ deckLengthFt: 0, deckWidthFt: 10 }, 'deckLengthFt'],
      [{ deckLengthFt: 10, deckWidthFt: -1 }, 'deckWidthFt'],
      [{ deckLengthFt: 10, deckWidthFt: 10, deckingBoardWidthIn: 0 }, 'deckingBoardWidthIn'],
      [{ deckLengthFt: 10, deckWidthFt: 10, deckingBoardLengthFt: -1 }, 'deckingBoardLengthFt'],
      [{ deckLengthFt: 10, deckWidthFt: 10, boardGapIn: -1 }, 'boardGapIn'],
      [{ deckLengthFt: 10, deckWidthFt: 10, joistSpacingIn: 0 }, 'joistSpacingIn'],
      [{ deckLengthFt: 10, deckWidthFt: 10, joistWidthIn: -1 }, 'joistWidthIn'],
      [{ deckLengthFt: 10, deckWidthFt: 10, joistDepthIn: -1 }, 'joistDepthIn'],
      [{ deckLengthFt: 10, deckWidthFt: 10, wastePercent: -1 }, 'wastePercent'],
      [{ deckLengthFt: 10, deckWidthFt: 10, wastePercent: 101 }, 'wastePercent'],
      [{ deckLengthFt: 10, deckWidthFt: 10, beamCount: -1 }, 'beamCount'],
      [{ deckLengthFt: 10, deckWidthFt: 10, postCount: 1.5 }, 'postCount'],
      [{ deckLengthFt: 10, deckWidthFt: 10, beamCount: 1, beamLengthFt: 0 }, 'beamLengthFt'],
      [{ deckLengthFt: 10, deckWidthFt: 10, fastenersPerBoardPerJoist: 0 }, 'fastenersPerBoardPerJoist'],
      [{ deckLengthFt: 10, deckWidthFt: 10, pricing: { deckingPerBoard: -1 } }, 'pricing.deckingPerBoard'],
    ];
    for (const [input, field] of cases) {
      const r = tryCalculate(() => calculateDeckMaterials(input));
      assert.equal(r.ok, false, field);
      if (!r.ok) assert.equal(r.error.field, field);
    }
  });

  test('it estimates materials only — never structural design', () => {
    const r = calculateDeckMaterials(DECK);
    assert.ok(r.warnings.some((w) => w.includes('not structural engineering')));
    assert.ok(r.warnings.some((w) => w.includes('local code')));
    assert.equal(r.postCount, 6, 'post count comes from the user, never invented');
    const noPosts = calculateDeckMaterials({ ...DECK, postCount: 0 });
    assert.ok(noPosts.warnings.some((w) => w.includes('No post count')));
  });

  test('very large deck stays finite', () => {
    const r = calculateDeckMaterials({
      deckLengthFt: 1000, deckWidthFt: 1000, deckingBoardLengthFt: 16, wastePercent: 0, postCount: 40,
    });
    assert.equal(r.areaSqFt, 1000000);
    assert.equal(r.deckingRowsRequired, 2134); // ceil(1000 / 0.46875)
    assert.equal(r.boardsPerRowRequired, 63);  // ceil(1000 / 16)
    assert.equal(r.deckingBoardsRequired, 134442);
    assert.equal(r.joistsRequired, 751);       // ceil(12000 in / 16 in) + 1
    assert.ok(Number.isFinite(r.fastenersRequired));
    assert.ok(Number.isFinite(r.rimJoistLinearFtOrdered));
  });
});







