import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateBulk, compareDepths, coverageSqFt } from './bulk';
import { CalcInputError, tryCalculate } from '../validation';

const rect = (length: number, width: number) => ({ kind: 'rectangle' as const, length, width });
const approx = (a: number, b: number, tol = 0.01) => assert.ok(Math.abs(a - b) <= tol, `${a} !~ ${b}`);

test('gravel worked example: 20x30 ft at 3 in, no waste', () => {
  const r = calculateBulk({ material: 'gravel', areas: [rect(20, 30)], depthIn: 3, wastePercent: 0 });
  assert.equal(r.areaSqFt, 600);
  assert.equal(r.baseVolumeCuFt, 150);
  assert.equal(r.volumeCuFt, 150);
  assert.equal(r.volumeCuYd, 5.56);
  assert.equal(r.tons, 7.78); // 5.5556 * 1.4
  assert.equal(r.recommendedOrderCuYd, 5.75);
});

test('default 10% waste is applied', () => {
  const r = calculateBulk({ material: 'gravel', areas: [rect(20, 30)], depthIn: 3 });
  assert.equal(r.wastePercent, 10);
  assert.equal(r.volumeCuFt, 165);
  assert.equal(r.volumeCuYd, 6.11);
  assert.equal(r.tons, 8.56);
  assert.equal(r.recommendedOrderCuYd, 6.25);
  assert.equal(r.bags[0]!.count, 330); // 165 / 0.5
});

test('compaction factor increases order volume', () => {
  const r = calculateBulk({
    material: 'paver-base', areas: [rect(20, 30)], depthIn: 3, wastePercent: 0, compactionFactor: 1.15,
  });
  assert.equal(r.volumeCuFt, 172.5);
});

test('multiple areas and circles are summed', () => {
  const r = calculateBulk({
    material: 'mulch',
    areas: [rect(10, 10), { kind: 'circle', diameter: 10 }, { kind: 'triangle', base: 10, height: 10 }, { kind: 'area', sqFt: 25 }],
    depthIn: 3,
    wastePercent: 0,
  });
  approx(r.areaSqFt, 100 + Math.PI * 25 + 50 + 25, 0.01);
});

test('density override changes tons and warns when out of range', () => {
  const r = calculateBulk({
    material: 'gravel', areas: [rect(10, 10)], depthIn: 3, wastePercent: 0, densityTonsPerCuYd: 2.5,
  });
  approx(r.tons, (100 * 0.25) / 27 * 2.5);
  assert.ok(r.warnings.some((w) => w.includes('outside the typical range')));
});

test('costs come only from user-supplied prices', () => {
  const none = calculateBulk({ material: 'gravel', areas: [rect(20, 30)], depthIn: 3, wastePercent: 0 });
  assert.deepEqual(none.costs, []);

  const r = calculateBulk({
    material: 'gravel', areas: [rect(20, 30)], depthIn: 3, wastePercent: 0,
    pricing: { perTon: 45, perCuYd: 50, perBag: { bagCuFt: 0.5, price: 6 }, deliveryFee: 60 },
  });
  const byBasis = Object.fromEntries(r.costs.map((c) => [c.basis, c]));
  assert.equal(byBasis['per-ton']!.materialCost, 350); // 7.7778 t * $45
  assert.equal(byBasis['per-ton']!.total, 410);
  assert.equal(byBasis['per-cubic-yard']!.materialCost, 287.5); // 5.75 yd * $50
  assert.equal(byBasis['per-bag']!.materialCost, 1800); // 300 bags * $6
});

test('truckloads', () => {
  const base = { material: 'gravel' as const, areas: [rect(20, 30)], depthIn: 3, wastePercent: 0 };
  assert.equal(calculateBulk({ ...base, truckCapacityTons: 10 }).loads, 1);
  assert.equal(calculateBulk({ ...base, truckCapacityTons: 3 }).loads, 3);
  assert.equal(calculateBulk(base).loads, undefined);
});

test('purchase advice thresholds', () => {
  const a = (l: number) => calculateBulk({ material: 'mulch', areas: [rect(l, 10)], depthIn: 3 }).purchaseAdvice;
  assert.equal(a(3), 'bags'); // 30 sq ft @ 3 in + waste = 0.31 cu yd
  assert.equal(a(10), 'either'); // 100 sq ft @ 3 in + waste = 1.02 cu yd
  assert.equal(a(400), 'bulk');
});

test('mulch depth comparison and coverage', () => {
  const rows = compareDepths({ material: 'mulch', areas: [rect(20, 10)], wastePercent: 0 });
  assert.deepEqual(rows.map((r) => r.result.volumeCuYd), [1.23, 1.85, 2.47]);
  assert.equal(coverageSqFt(1, 3), 108);
});

test('use-case warnings', () => {
  const ok = calculateBulk({ material: 'mulch', areas: [rect(10, 10)], depthIn: 3, useCase: 'garden-bed' });
  assert.equal(ok.warnings.length, 0);
  const deep = calculateBulk({ material: 'mulch', areas: [rect(10, 10)], depthIn: 8, useCase: 'garden-bed' });
  assert.ok(deep.warnings.some((w) => w.includes('typical 2–4 in')));
  const waste = calculateBulk({ material: 'mulch', areas: [rect(10, 10)], depthIn: 3, wastePercent: 40 });
  assert.ok(waste.warnings.some((w) => w.includes('unusually high')));
  assert.throws(() => calculateBulk({ material: 'mulch', areas: [rect(10, 10)], depthIn: 3, useCase: 'nope' }), CalcInputError);
});

test('invalid input is rejected with the offending field', () => {
  const bad = (over: object) =>
    tryCalculate(() => calculateBulk({ material: 'gravel', areas: [rect(10, 10)], depthIn: 3, ...over }));

  for (const [over, field] of [
    [{ depthIn: 0 }, 'depthIn'],
    [{ depthIn: -2 }, 'depthIn'],
    [{ depthIn: NaN }, 'depthIn'],
    [{ wastePercent: -1 }, 'wastePercent'],
    [{ wastePercent: 101 }, 'wastePercent'],
    [{ compactionFactor: 0.9 }, 'compactionFactor'],
    [{ densityTonsPerCuYd: 0 }, 'densityTonsPerCuYd'],
    [{ areas: [] }, 'areas'],
    [{ areas: [rect(0, 10)] }, 'areas[0].length'],
    [{ areas: [rect(10, -1)] }, 'areas[0].width'],
  ] as [object, string][]) {
    const r = bad(over);
    assert.equal(r.ok, false, JSON.stringify(over));
    if (!r.ok) assert.equal(r.error.field, field);
  }
  assert.equal(bad({}).ok, true);
});


test('editable bag size assumption is used in bag counts', () => {
  const r = calculateBulk({
    material: 'mulch',
    areas: [rect(10, 10)],
    depthIn: 3,
    wastePercent: 0,
    bagSizesCuFt: [1],
  });
  assert.deepEqual(r.bags, [{ bagCuFt: 1, count: 25 }]);
});
