import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateConcrete } from './concrete';
import { CalcInputError } from '../validation';

const approx = (a: number, b: number, tol = 0.01) => assert.ok(Math.abs(a - b) <= tol, `${a} !~ ${b}`);

test('10 x 10 ft slab at 4 in', () => {
  const r = calculateConcrete({ parts: [{ kind: 'slab', lengthFt: 10, widthFt: 10, thicknessIn: 4 }] });
  assert.equal(r.volumeCuFt, 33.33);
  assert.equal(r.orderCuFt, 36.67); // +10% waste
  assert.equal(r.orderCuYd, 1.36);
  assert.equal(r.recommendedReadyMixCuYd, 1.5);
  assert.equal(r.bags.find((b) => b.bagLb === 80)!.count, 62); // 36.67 / 0.60 = 61.1
  assert.equal(r.bags.find((b) => b.bagLb === 60)!.count, 82);
  assert.equal(r.approxWeightLb, 5500);
  assert.equal(r.purchaseAdvice, 'either');
  assert.equal(r.warnings.length, 0);
});

test('post holes, footings and multiple parts', () => {
  const r = calculateConcrete({
    wastePercent: 0,
    parts: [
      { kind: 'post-hole', diameterIn: 12, depthIn: 36, count: 4 },
      { kind: 'footing', lengthFt: 20, widthIn: 12, depthIn: 12 },
    ],
  });
  approx(r.parts[0]!.volumeCuFt, Math.PI * 0.25 * 3 * 4); // 9.42
  assert.equal(r.parts[1]!.volumeCuFt, 20);
  approx(r.volumeCuFt, 9.42 + 20);
});

test('exact bag yields are not rounded up by float noise', () => {
  const r = calculateConcrete({
    wastePercent: 0,
    parts: [{ kind: 'slab', lengthFt: 1, widthFt: 1, thicknessIn: 7.2 }], // 0.6 cu ft
  });
  assert.equal(r.bags.find((b) => b.bagLb === 80)!.count, 1);
});

test('thin slab and tiny waste produce warnings', () => {
  const r = calculateConcrete({ wastePercent: 2, parts: [{ kind: 'slab', lengthFt: 5, widthFt: 5, thicknessIn: 3 }] });
  assert.equal(r.warnings.length, 2);
  assert.equal(r.purchaseAdvice, 'bags');
});

test('invalid input', () => {
  assert.throws(() => calculateConcrete({ parts: [] }), CalcInputError);
  assert.throws(
    () => calculateConcrete({ parts: [{ kind: 'post-hole', diameterIn: 10, depthIn: 30, count: 0 }] }),
    CalcInputError,
  );
  assert.throws(
    () => calculateConcrete({ parts: [{ kind: 'slab', lengthFt: -1, widthFt: 4, thicknessIn: 4 }] }),
    CalcInputError,
  );
});


test('concrete density, bag yield and ready-mix increment are editable', () => {
  const r = calculateConcrete({
    wastePercent: 0,
    concreteLbPerCuFt: 145,
    readyMixIncrementCuYd: 0.1,
    bagSpecs: [{ bagLb: 70, yieldCuFt: 0.5 }],
    parts: [{ kind: 'slab', lengthFt: 10, widthFt: 10, thicknessIn: 3.6 }],
  });
  assert.equal(r.bags[0]!.bagLb, 70);
  assert.equal(r.bags[0]!.count, 60);
  assert.equal(r.recommendedReadyMixCuYd, 1.2);
  assert.equal(r.approxWeightLb, Math.round(r.orderCuFt * 145));
});
