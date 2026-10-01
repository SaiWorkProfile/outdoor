import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateDeckMaterials } from './deck';
import { CalcInputError } from '../validation';

test('20 x 12 deck produces decking, joist and fastener quantities', () => {
  const r = calculateDeckMaterials({
    deckLengthFt: 20,
    deckWidthFt: 12,
    deckingBoardWidthIn: 5.5,
    deckingBoardLengthFt: 20,
    boardGapIn: 0.125,
    joistSpacingIn: 16,
    wastePercent: 10,
    postCount: 6,
  });
  assert.equal(r.areaSqFt, 240);
  assert.ok(r.deckingBoardsRequired > 0);
  assert.ok(r.joistsRequired > 0);
  assert.equal(r.postCount, 6);
  assert.ok(r.fastenersOrdered > r.fastenersRequired);
  assert.ok(r.warnings.some((w) => w.includes('not structural engineering')));
});

test('stock lengths convert framing linear feet into pieces', () => {
  const r = calculateDeckMaterials({
    deckLengthFt: 16,
    deckWidthFt: 8,
    deckingBoardLengthFt: 16,
    joistStockLengthFt: 8,
    beamCount: 2,
    beamLengthFt: 16,
    beamStockLengthFt: 8,
    postCount: 4,
    wastePercent: 0,
  });
  assert.equal(r.joistPiecesOrdered, 14);
  assert.equal(r.beamPiecesOrdered, 4);
});

test('deck prices are optional and never invented', () => {
  const none = calculateDeckMaterials({ deckLengthFt: 10, deckWidthFt: 10 });
  assert.deepEqual(none.costs, []);
  const priced = calculateDeckMaterials({ deckLengthFt: 10, deckWidthFt: 10, pricing: { deckingPerSqFt: 5, postPrice: 30 } });
  assert.ok(priced.costs.some((c) => c.component === 'decking'));
});

test('invalid deck inputs are rejected', () => {
  assert.throws(() => calculateDeckMaterials({ deckLengthFt: -1, deckWidthFt: 10 }), CalcInputError);
  assert.throws(() => calculateDeckMaterials({ deckLengthFt: 10, deckWidthFt: 10, boardGapIn: -1 }), CalcInputError);
  assert.throws(() => calculateDeckMaterials({ deckLengthFt: 10, deckWidthFt: 10, beamCount: 1, beamLengthFt: 0 }), CalcInputError);
});
