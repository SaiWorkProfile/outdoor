/**
 * Phase 6 calculator accuracy audit — bulk-material family.
 *
 * Covers the eight calculators that share `calculateBulk`:
 *   gravel, mulch, topsoil, soil, sand, pea gravel, landscape rock, paver base.
 *
 * Every expected number below is worked out by hand from the documented formula
 * (area x depth / 12 = cu ft; cu ft / 27 = cu yd; cu yd x density = tons;
 * waste and compaction multiply the order volume; order rounds up to 0.25 cu yd).
 * The engine is never used to generate its own expectations.
 *
 * Case matrix: normal, small, large, very large, decimal, zero, negative/invalid,
 * waste, multiple areas, unit conversion, cost, boundary, impossible.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { calculateBulk, compareDepths } from './bulk';
import { tryCalculate } from '../validation';

const rect = (length: number, width: number) => ({ kind: 'rectangle' as const, length, width });
const approx = (a: number, b: number, tol = 0.01, note = '') =>
  assert.ok(Math.abs(a - b) <= tol, `${note} ${a} !~ ${b} (tol ${tol})`);

describe('bulk calculators — normal case', () => {
  test('gravel: 20 x 30 ft at 3 in with 10% waste', () => {
    const r = calculateBulk({
      material: 'gravel', areas: [rect(20, 30)], depthIn: 3, wastePercent: 10, truckCapacityTons: 10,
    });
    assert.equal(r.areaSqFt, 600);
    assert.equal(r.baseVolumeCuFt, 150);        // 600 * 3 / 12
    assert.equal(r.volumeCuFt, 165);            // 150 * 1.10
    assert.equal(r.volumeCuYd, 6.11);           // 165 / 27 = 6.1111
    assert.equal(r.recommendedOrderCuYd, 6.25); // rounded up to the 0.25 order step
    assert.equal(r.tons, 8.56);                 // 6.1111 * 1.4 t/cu yd
    assert.equal(r.wastePercent, 10);
    assert.equal(r.densityUsed, 1.4);
    assert.deepEqual(r.bags, [{ bagCuFt: 0.5, count: 330 }]); // 165 / 0.5
    assert.equal(r.purchaseAdvice, 'bulk');
    assert.equal(r.loads, 1);                   // 10-ton truck supplied by the UI default
  });

  test('mulch: depth comparison stays proportional (2 in / 3 in / 4 in)', () => {
    const rows = compareDepths({ material: 'mulch', areas: [rect(20, 10)], wastePercent: 0 }, [2, 3, 4]);
    // 200 sq ft: 2 in = 33.33 cf, 3 in = 50 cf, 4 in = 66.67 cf
    assert.deepEqual(rows.map((x) => x.result.volumeCuFt), [33.33, 50, 66.67]);
    assert.deepEqual(rows.map((x) => x.result.volumeCuYd), [1.23, 1.85, 2.47]);
    assert.deepEqual(rows.map((x) => x.result.recommendedOrderCuYd), [1.25, 2, 2.5]);
    approx(rows[2]!.result.volumeCuYd / rows[0]!.result.volumeCuYd, 2, 0.02, 'depth ratio');
  });

  test('topsoil: raised-bed depth of 12 in and its own density and bag sizes', () => {
    const r = calculateBulk({ material: 'topsoil', areas: [rect(10, 4)], depthIn: 12, wastePercent: 0 });
    assert.equal(r.areaSqFt, 40);
    assert.equal(r.volumeCuFt, 40);             // 40 * 12 / 12
    assert.equal(r.volumeCuYd, 1.48);           // 40 / 27
    assert.equal(r.recommendedOrderCuYd, 1.5);
    assert.equal(r.tons, 1.63);                 // 1.4815 * 1.1
    assert.deepEqual(r.bags.map((b) => [b.bagCuFt, b.count]), [[0.75, 54], [1, 40], [1.5, 27]]);
  });

  test('soil: fill material uses its own density (1.2 t/cu yd)', () => {
    const r = calculateBulk({ material: 'soil', areas: [rect(20, 20)], depthIn: 6, wastePercent: 0 });
    assert.equal(r.volumeCuFt, 200);
    assert.equal(r.volumeCuYd, 7.41);
    assert.equal(r.tons, 8.89);                 // 7.4074 * 1.2
    assert.equal(r.densityUsed, 1.2);
  });

  test('sand: 1 in paver-bedding depth over 240 sq ft', () => {
    const r = calculateBulk({ material: 'sand', areas: [rect(12, 20)], depthIn: 1, wastePercent: 0 });
    assert.equal(r.areaSqFt, 240);
    assert.equal(r.volumeCuFt, 20);             // 240 * 1 / 12
    assert.equal(r.volumeCuYd, 0.74);           // 20 / 27
    assert.equal(r.recommendedOrderCuYd, 0.75);
    assert.equal(r.tons, 1);                    // 0.7407 * 1.35 = 1.0 exactly
  });

  test('pea gravel: 10 x 16 ft path at 2 in with 10% waste', () => {
    const r = calculateBulk({ material: 'pea-gravel', areas: [rect(10, 16)], depthIn: 2, wastePercent: 10 });
    assert.equal(r.areaSqFt, 160);
    assert.equal(r.volumeCuFt, 29.33);          // 160 * 2/12 = 26.667 * 1.1
    assert.equal(r.volumeCuYd, 1.09);
    assert.equal(r.recommendedOrderCuYd, 1.25);
    assert.equal(r.tons, 1.52);                 // 1.0864 * 1.4
  });

  test('landscape rock: decorative cover at 3 in', () => {
    const r = calculateBulk({ material: 'landscape-rock', areas: [rect(15, 15)], depthIn: 3, wastePercent: 10 });
    assert.equal(r.areaSqFt, 225);
    assert.equal(r.volumeCuFt, 61.88);          // 56.25 * 1.1
    assert.equal(r.volumeCuYd, 2.29);
    assert.equal(r.tons, 3.09);                 // 2.2917 * 1.35
  });

  test('paver base: compaction factor multiplies the order volume', () => {
    const r = calculateBulk({
      material: 'paver-base', areas: [rect(20, 30)], depthIn: 6, wastePercent: 0, compactionFactor: 1.1,
    });
    assert.equal(r.volumeCuFt, 330);            // 300 * 1.1
    assert.equal(r.volumeCuYd, 12.22);
    assert.equal(r.recommendedOrderCuYd, 12.25);
    assert.equal(r.tons, 17.11);                // 12.2222 * 1.4
    assert.equal(r.compactionFactor, 1.1);
  });
});

describe('bulk calculators — small, large, very large and impossible cases', () => {
  test('small case: 2 x 2 ft at 1 in with no waste', () => {
    const r = calculateBulk({ material: 'gravel', areas: [rect(2, 2)], depthIn: 1, wastePercent: 0 });
    assert.equal(r.areaSqFt, 4);
    assert.equal(r.volumeCuFt, 0.33);           // 0.3333 cu ft
    assert.equal(r.volumeCuYd, 0.01);           // 0.0123 cu yd
    assert.equal(r.recommendedOrderCuYd, 0.25); // smallest order step
    assert.equal(r.tons, 0.02);                 // 0.0123 * 1.4
    assert.equal(r.purchaseAdvice, 'bags');
    assert.equal(r.bags[0]!.count, 1);          // ceil(0.3333 / 0.5)
  });

  test('large case: 1000 x 1000 ft at 6 in with 10% waste', () => {
    const r = calculateBulk({ material: 'gravel', areas: [rect(1000, 1000)], depthIn: 6, wastePercent: 10 });
    assert.equal(r.areaSqFt, 1000000);
    assert.equal(r.volumeCuFt, 550000);         // 500000 * 1.1
    assert.equal(r.volumeCuYd, 20370.37);
    assert.equal(r.recommendedOrderCuYd, 20370.5);
    assert.equal(r.tons, 28518.52);             // 20370.3704 * 1.4
    assert.ok(Number.isFinite(r.tons));
  });

  test('very large case stays finite instead of overflowing', () => {
    const r = calculateBulk({ material: 'gravel', areas: [rect(10000, 10000)], depthIn: 12, wastePercent: 0 });
    assert.equal(r.areaSqFt, 100000000);
    assert.equal(r.volumeCuFt, 100000000);
    assert.equal(r.volumeCuYd, 3703703.7);
    assert.equal(r.tons, 5185185.19);           // 3703703.7037 * 1.4
    assert.ok(Number.isFinite(r.recommendedOrderCuYd));
    assert.ok(Number.isFinite(r.bags[0]!.count));
  });

  test('impossible case: overflow dimensions are rejected, not silently wrong', () => {
    const overflow = tryCalculate(() =>
      calculateBulk({ material: 'gravel', areas: [rect(Number.MAX_VALUE, 2)], depthIn: 3 }),
    );
    assert.equal(overflow.ok, false);
    if (!overflow.ok) assert.equal(overflow.error.field, 'areas[0].areaSqFt');

    const infinite = tryCalculate(() =>
      calculateBulk({ material: 'gravel', areas: [rect(10, 10)], depthIn: Number.POSITIVE_INFINITY }),
    );
    assert.equal(infinite.ok, false);
    if (!infinite.ok) assert.equal(infinite.error.field, 'depthIn');
  });
});

describe('bulk calculators — decimal inputs', () => {
  test('decimal dimensions and depth round consistently', () => {
    const r = calculateBulk({ material: 'mulch', areas: [rect(12.5, 7.25)], depthIn: 2.5, wastePercent: 10 });
    approx(r.areaSqFt, 90.625, 0.005, 'area');
    approx(r.baseVolumeCuFt, 18.88, 0.01, 'base volume'); // 90.625 * 2.5 / 12
    approx(r.volumeCuFt, 20.77, 0.01, 'order volume');     // * 1.1
    assert.equal(r.volumeCuYd, 0.77);                      // 0.7692
    assert.equal(r.recommendedOrderCuYd, 1);               // ceilTo(0.7692, 0.25)
    assert.equal(r.tons, 0.27);                            // 0.7692 * 0.35
    assert.deepEqual(r.bags.map((b) => b.count), [11, 7]); // ceil(20.77 / 2), ceil(20.77 / 3)
  });

  test('decimal depth scales linearly', () => {
    const one = calculateBulk({ material: 'gravel', areas: [rect(10, 10)], depthIn: 1, wastePercent: 0 });
    const oneAndHalf = calculateBulk({ material: 'gravel', areas: [rect(10, 10)], depthIn: 1.5, wastePercent: 0 });
    approx(oneAndHalf.volumeCuFt, one.volumeCuFt * 1.5, 0.01, 'linear depth');
  });
});

describe('bulk calculators — zero, negative and invalid input', () => {
  const run = (over: Record<string, unknown>) =>
    tryCalculate(() => calculateBulk({ material: 'gravel', areas: [rect(10, 10)], depthIn: 3, ...over }));

  test('zero and negative values identify the offending field', () => {
    const cases: Array<[Record<string, unknown>, string]> = [
      [{ depthIn: 0 }, 'depthIn'],
      [{ depthIn: -2 }, 'depthIn'],
      [{ depthIn: Number.NaN }, 'depthIn'],
      [{ wastePercent: -0.5 }, 'wastePercent'],
      [{ wastePercent: 100.5 }, 'wastePercent'],
      [{ compactionFactor: 0 }, 'compactionFactor'],
      [{ compactionFactor: 0.99 }, 'compactionFactor'],
      [{ densityTonsPerCuYd: -1 }, 'densityTonsPerCuYd'],
      [{ areas: [] }, 'areas'],
      [{ areas: [rect(0, 5)] }, 'areas[0].length'],
      [{ areas: [rect(5, -5)] }, 'areas[0].width'],
      [{ areas: [{ kind: 'circle', diameter: 0 }] }, 'areas[0].diameter'],
      [{ areas: [{ kind: 'triangle', base: -1, height: 5 }] }, 'areas[0].base'],
      [{ areas: [{ kind: 'area', sqFt: 0 }] }, 'areas[0].sqFt'],
      [{ bagSizesCuFt: [0] }, 'bagSizesCuFt[0]'],
      [{ truckCapacityTons: -1 }, 'truckCapacityTons'],
      [{ pricing: { deliveryFee: -5 } }, 'pricing.deliveryFee'],
      [{ pricing: { perCuYd: -1 } }, 'pricing.perCuYd'],
      [{ useCase: 'does-not-exist' }, 'useCase'],
    ];
    for (const [over, field] of cases) {
      const r = run(over);
      assert.equal(r.ok, false, `expected failure for ${JSON.stringify(over)}`);
      if (!r.ok) {
        assert.equal(r.error.field, field, `field for ${JSON.stringify(over)}`);
        assert.ok(r.error.message.length > 0, 'a message the UI can show');
      }
    }
    assert.equal(run({}).ok, true, 'the clean baseline must still calculate');
  });

  test('zero waste and 100% waste are valid boundaries', () => {
    const none = calculateBulk({ material: 'gravel', areas: [rect(20, 30)], depthIn: 3, wastePercent: 0 });
    assert.equal(none.volumeCuFt, 150);
    assert.equal(none.recommendedOrderCuYd, 5.75);
    assert.equal(none.warnings.length, 0);

    const doubled = calculateBulk({ material: 'gravel', areas: [rect(20, 30)], depthIn: 3, wastePercent: 100 });
    assert.equal(doubled.volumeCuFt, 300);
    assert.equal(doubled.volumeCuYd, 11.11);
    assert.equal(doubled.recommendedOrderCuYd, 11.25);
    assert.equal(doubled.tons, 15.56);          // 11.1111 * 1.4
    assert.ok(doubled.warnings.some((w) => w.includes('unusually high')));
  });

  test('waste outside 0-100 is rejected as impossible input', () => {
    for (const waste of [-1, 101]) {
      const r = run({ wastePercent: waste });
      assert.equal(r.ok, false, `waste ${waste}`);
      if (!r.ok) assert.equal(r.error.field, 'wastePercent');
    }
  });
});

describe('bulk calculators — waste, multiple areas, unit conversion and cost', () => {
  test('waste changes the order volume but never the base volume', () => {
    const base = { material: 'gravel' as const, areas: [rect(20, 30)], depthIn: 3 };
    const w0 = calculateBulk({ ...base, wastePercent: 0 });
    const w10 = calculateBulk({ ...base, wastePercent: 10 });
    assert.equal(w0.baseVolumeCuFt, w10.baseVolumeCuFt);
    assert.equal(w10.volumeCuFt, w0.volumeCuFt * 1.1);
    approx(w10.tons / w0.tons, 1.1, 0.001, 'tons scale with waste');
    assert.equal(w10.recommendedOrderCuYd - w0.recommendedOrderCuYd, 0.5);
  });

  test('multiple areas are summed across every shape kind', () => {
    const r = calculateBulk({
      material: 'gravel',
      areas: [
        rect(10, 10),
        { kind: 'circle', diameter: 10 },
        { kind: 'triangle', base: 10, height: 10 },
        { kind: 'area', sqFt: 250 },
      ],
      depthIn: 3,
      wastePercent: 0,
    });
    approx(r.areaSqFt, 100 + Math.PI * 25 + 50 + 250, 0.01, 'total area');
    assert.equal(r.areaSqFt, 478.54);           // 478.5398 sq ft
  });

  test('metric conversions are reported alongside imperial units', () => {
    const r = calculateBulk({ material: 'gravel', areas: [rect(20, 30)], depthIn: 3, wastePercent: 10 });
    approx(r.areaSqM, 600 * 0.3048 ** 2, 0.005, 'sq m');
    approx(r.volumeCuM, 165 * 0.3048 ** 3, 0.005, 'cu m');
    approx(r.tonnes, 8.5556 * 0.90718474, 0.005, 'tonnes');
    assert.equal(r.areaSqM, 55.74);
    assert.equal(r.volumeCuM, 4.67);
    assert.equal(r.tonnes, 7.76);
  });

  test('cost calculation uses only user-entered prices', () => {
    const none = calculateBulk({ material: 'gravel', areas: [rect(20, 30)], depthIn: 3 });
    assert.deepEqual(none.costs, []);

    const r = calculateBulk({
      material: 'gravel', areas: [rect(20, 30)], depthIn: 3, wastePercent: 10,
      pricing: { perCuYd: 45, perTon: 40, perBag: { bagCuFt: 0.5, price: 6 }, deliveryFee: 75 },
    });
    const byBasis = Object.fromEntries(r.costs.map((c) => [c.basis, c]));
    // per cubic yard: charged on the recommended order quantity (6.25 cu yd)
    assert.equal(byBasis['per-cubic-yard']!.quantity, 6.25);
    assert.equal(byBasis['per-cubic-yard']!.materialCost, 281.25);
    assert.equal(byBasis['per-cubic-yard']!.deliveryFee, 75);
    assert.equal(byBasis['per-cubic-yard']!.total, 356.25);
    // per ton: quantity is displayed rounded, cost uses the exact tonnage
    assert.equal(byBasis['per-ton']!.quantity, 8.56);
    assert.equal(byBasis['per-ton']!.materialCost, 342.22);   // 8.5556 * 40
    // per bag: the same bag count the bag estimate reports
    assert.equal(byBasis['per-bag']!.quantity, 330);
    assert.equal(byBasis['per-bag']!.materialCost, 1980);
  });

  test('density override changes tons and warns outside the typical range', () => {
    const inRange = calculateBulk({
      material: 'gravel', areas: [rect(10, 10)], depthIn: 3, wastePercent: 0, densityTonsPerCuYd: 1.5,
    });
    assert.equal(inRange.tons, 1.39);           // 0.9259 cu yd * 1.5
    assert.equal(inRange.warnings.length, 0);

    const outOfRange = calculateBulk({
      material: 'gravel', areas: [rect(10, 10)], depthIn: 3, wastePercent: 0, densityTonsPerCuYd: 4,
    });
    assert.equal(outOfRange.tons, 3.7);         // 0.9259 * 4
    assert.ok(outOfRange.warnings.some((w) => w.includes('outside the typical range')));
  });

  test('use-case depth guidance warns but never blocks a valid result', () => {
    const inRange = calculateBulk({ material: 'mulch', areas: [rect(10, 10)], depthIn: 3, useCase: 'garden-bed' });
    assert.equal(inRange.warnings.length, 0);
    const tooDeep = calculateBulk({ material: 'mulch', areas: [rect(10, 10)], depthIn: 9, useCase: 'garden-bed' });
    assert.ok(tooDeep.warnings.some((w) => w.includes('outside the typical')));
    assert.ok(tooDeep.volumeCuYd > 0, 'a warning must not stop a valid result');
  });
});



