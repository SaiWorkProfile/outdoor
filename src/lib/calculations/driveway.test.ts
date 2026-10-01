import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateDriveway } from './driveway';
import { CalcInputError } from '../validation';

const approx = (a: number, b: number, tol = 0.05) => assert.ok(Math.abs(a - b) <= tol, `${a} !~ ${b}`);
const sections = [{ kind: 'rectangle' as const, length: 50, width: 10 }];

test('default 3-layer driveway: 10 x 50 ft', () => {
  const r = calculateDriveway({ sections });
  assert.equal(r.areaSqFt, 500);
  assert.equal(r.totalDepthIn, 8);
  assert.equal(r.layers.length, 3);
  // base: 500*4/12 = 166.67 cf * 1.15 compaction * 1.10 waste = 210.83 cf = 7.81 cy
  approx(r.layers[0]!.result.volumeCuYd, 7.81);
  approx(r.layers[1]!.result.volumeCuYd, 3.9);
  approx(r.layers[2]!.result.volumeCuYd, 3.73);
  approx(r.totalVolumeCuYd, 15.44);
  approx(r.totalTons, 15.4475 * 1.4, 0.1);
  assert.equal(r.costIsComplete, false);
  assert.equal(r.totalCost, undefined);
  assert.equal(r.warnings.length, 0);
});

test('delivery loads and fees', () => {
  const r = calculateDriveway({ sections, truckCapacityTons: 10, deliveryFeePerLoad: 150 });
  assert.equal(r.delivery!.loads, 3);
  assert.equal(r.delivery!.totalFee, 450);
});

test('pricing per layer produces a complete total', () => {
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
  // Base: 7.8086 cu yd * 1.4 t/cu yd = 10.93 t * $40 = $437.28
  // Surface: 5.0926 cu yd -> orders 5.25 cu yd * $60 = $315.00
  assert.equal(r.materialCost, 752.28);
  // 10.93 + 7.13 = 18.06 t -> 2 loads at $100
  assert.equal(r.delivery!.loads, 2);
  assert.equal(r.totalCost, 952.28);
});

test('partial pricing is flagged', () => {
  const r = calculateDriveway({
    sections,
    layers: [
      { name: 'Base', depthIn: 6, pricePerTon: 40 },
      { name: 'Surface', depthIn: 3 },
    ],
  });
  assert.equal(r.costIsComplete, false);
  assert.ok(r.warnings.some((w) => w.includes('incomplete')));
});

test('thin driveway warns; conflicting prices and empty layers throw', () => {
  const thin = calculateDriveway({ sections, layers: [{ name: 'Only', depthIn: 3 }] });
  assert.ok(thin.warnings.some((w) => w.includes('light side')));
  assert.throws(
    () => calculateDriveway({ sections, layers: [{ name: 'x', depthIn: 3, pricePerTon: 1, pricePerCuYd: 1 }] }),
    CalcInputError,
  );
  assert.throws(() => calculateDriveway({ sections, layers: [] }), CalcInputError);
});

test('multiple sections (main drive + parking pad) add up', () => {
  const one = calculateDriveway({ sections });
  const two = calculateDriveway({
    sections: [...sections, { kind: 'rectangle', length: 10, width: 10 }],
  });
  assert.equal(two.areaSqFt, 600);
  approx(two.totalVolumeCuYd / one.totalVolumeCuYd, 1.2, 0.01);
});
