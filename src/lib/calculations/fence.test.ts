import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateFence, calculateFenceCost } from './fence';
import { CalcInputError } from '../validation';

const base = {
  fenceLengthFt: 100,
  heightFt: 6,
  postSpacingFt: 8,
  fenceType: 'wood-picket' as const,
  gateCount: 1,
  gateWidthFt: 4,
  wastePercent: 10,
};

test('picket fence returns posts, rails, pickets, concrete and shopping list', () => {
  const r = calculateFence(base);
  assert.equal(r.posts.gatePosts, 2);
  assert.ok(r.railPiecesRequired > 0);
  assert.ok(r.picketsRequired! > 0);
  assert.ok(r.concrete.bags.length === 4);
  assert.ok(r.hardware.fastenerCount > 0);
  assert.ok(r.shoppingList.some((x) => x.id === 'pickets'));
});

test('panel and chain-link modes use different quantity outputs', () => {
  const panel = calculateFence({ ...base, fenceType: 'privacy-panel' });
  assert.equal(panel.picketsRequired, undefined);
  assert.ok(panel.panelsRequired! > 0);
  const mesh = calculateFence({ ...base, fenceType: 'chain-link' });
  assert.ok(mesh.chainLinkLinearFtRequired! > 0);
  assert.equal(mesh.panelsRequired, undefined);
});

test('fence cost uses only entered prices', () => {
  const r = calculateFenceCost({
    ...base,
    pricing: {
      postPrice: 20,
      railPricePerPiece: 8,
      picketPrice: 4,
      concretePricePerCuYd: 140,
      hardwarePricePerUnit: 0.2,
      gatePrice: 250,
      laborPerLinearFt: 25,
    },
  });
  assert.ok(r.materialCost > 0);
  assert.ok(r.laborCost > 0);
  assert.equal(r.costIsComplete, true);
});

test('missing fence prices do not fabricate a total-complete result', () => {
  const r = calculateFenceCost({ ...base, pricing: {} });
  assert.equal(r.costIsComplete, false);
  assert.ok(r.missingPrices.length > 0);
  assert.equal(r.materialCost, 0);
  assert.equal(r.laborCost, 0);
});

test('invalid fence values are rejected', () => {
  assert.throws(() => calculateFence({ ...base, postSpacingFt: 0 }), CalcInputError);
  assert.throws(() => calculateFence({ ...base, wastePercent: 101 }), CalcInputError);
});
