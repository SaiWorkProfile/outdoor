import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateBulk } from './bulk';
import { calculateConcrete } from './concrete';
import { calculateDriveway } from './driveway';
import { CalcInputError } from '../validation';

test('existing bulk engine rejects non-finite or overflow-sized projects', () => {
  assert.throws(() => calculateBulk({ material: 'gravel', areas: [{ kind: 'rectangle', length: Number.MAX_VALUE, width: 2 }], depthIn: 3 }), CalcInputError);
  assert.throws(() => calculateBulk({ material: 'gravel', areas: [{ kind: 'rectangle', length: 1, width: 1 }], depthIn: Number.POSITIVE_INFINITY }), CalcInputError);
});

test('existing driveway rejects per-load delivery fee without capacity', () => {
  assert.throws(() => calculateDriveway({ sections: [{ kind: 'rectangle', length: 20, width: 10 }], deliveryFeePerLoad: 100 }), CalcInputError);
});

test('existing concrete catches huge intermediate overflow', () => {
  assert.throws(() => calculateConcrete({ parts: [{ kind: 'slab', lengthFt: Number.MAX_VALUE, widthFt: 2, thicknessIn: 3 }] }), CalcInputError);
});

test('zero waste and decimal inputs remain valid in shared calculators', () => {
  const bulk = calculateBulk({ material: 'mulch', areas: [{ kind: 'rectangle', length: 12.5, width: 7.25 }], depthIn: 2.5, wastePercent: 0 });
  assert.equal(bulk.wastePercent, 0);
  assert.ok(bulk.volumeCuYd > 0);
  const concrete = calculateConcrete({ wastePercent: 0, parts: [{ kind: 'slab', lengthFt: 8.5, widthFt: 4.25, thicknessIn: 4.5 }] });
  assert.equal(concrete.wastePercent, 0);
});
