import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculatePaverPatio, calculatePavers } from './paver';
import { CalcInputError, tryCalculate } from '../validation';

const rect = (length: number, width: number) => ({ kind: 'rectangle' as const, length, width });

function approx(a: number, b: number, tol = 0.02) {
  assert.ok(Math.abs(a - b) <= tol, `${a} !~ ${b}`);
}

test('12 x 20 paver patio calculates pavers, base, sand and edging', () => {
  const r = calculatePaverPatio({
    areas: [rect(12, 20)],
    paverLengthIn: 12,
    paverWidthIn: 12,
    jointWidthIn: 0.125,
    wastePercent: 5,
    baseDepthIn: 6,
    beddingSandDepthIn: 1,
  });
  assert.equal(r.areaSqFt, 240);
  assert.ok(r.paversRequired > 240);
  approx(r.base.volumeCuYd, 240 * 6 / 12 / 27 * 1.1 * 1.05);
  approx(r.beddingSand.volumeCuYd, 240 * 1 / 12 / 27 * 1.05);
  approx(r.edgeLinearFt, 64);
  assert.equal(r.projectType, 'paver-patio');
  assert.ok(r.printableQuantities.length >= 3);
});

test('multiple shapes and manual edge length work', () => {
  const r = calculatePavers({
    areas: [rect(10, 10), { kind: 'circle', diameter: 10 }, { kind: 'triangle', base: 10, height: 10 }],
    paverLengthIn: 6,
    paverWidthIn: 6,
    edgeLinearFt: 150,
    wastePercent: 0,
  });
  assert.ok(r.areaSqFt > 225);
  assert.equal(r.edgeLinearFt, 150);
  assert.equal(r.warnings.filter((w) => w.includes('Edge length')).length, 0);
});

test('paver pricing is user-entered only', () => {
  const noPrices = calculatePavers({ areas: [rect(10, 10)], paverLengthIn: 12, paverWidthIn: 12 }).costs;
  assert.deepEqual(noPrices, []);
  const priced = calculatePavers({
    areas: [rect(10, 10)], paverLengthIn: 12, paverWidthIn: 12, wastePercent: 0,
    pricing: { perPaver: 2, perSqFt: 3, edgingPerLinearFt: 1.5 },
  });
  assert.ok(priced.costs.some((c) => c.component === 'pavers' && c.basis === 'per-paver'));
  assert.ok(priced.costs.some((c) => c.component === 'edging'));
});

test('paver input validation highlights the field', () => {
  const r = tryCalculate(() => calculatePavers({ areas: [rect(10, 10)], paverLengthIn: 0, paverWidthIn: 6 }));
  assert.equal(r.ok, false);
  if (!r.ok) assert.equal(r.error.field, 'paverLengthIn');
  assert.throws(() => calculatePavers({ areas: [], paverLengthIn: 6, paverWidthIn: 6 }), CalcInputError);
});
