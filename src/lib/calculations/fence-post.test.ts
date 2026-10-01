import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateFencePosts } from './fence-post';
import { CalcInputError } from '../validation';

test('100 ft fence at 8 ft spacing with two ends', () => {
  const r = calculateFencePosts({ fenceLengthFt: 100, postSpacingFt: 8 });
  assert.equal(r.estimatedPostPositions, 14);
  assert.equal(r.linePosts, 12);
  assert.equal(r.endPosts, 2);
  assert.equal(r.totalPosts, 14);
});

test('gates reduce run and add separate gate posts', () => {
  const r = calculateFencePosts({ fenceLengthFt: 100, postSpacingFt: 8, gateCount: 2, gateWidthFt: 4 });
  assert.equal(r.gateOpeningLengthFt, 8);
  assert.equal(r.netFenceRunFt, 92);
  assert.equal(r.gatePosts, 4);
  assert.equal(r.totalPosts, 17);
});

test('gate width arrays are validated', () => {
  assert.throws(() => calculateFencePosts({ fenceLengthFt: 20, postSpacingFt: 8, gateCount: 2, gateWidthsFt: [4] }), CalcInputError);
  assert.throws(() => calculateFencePosts({ fenceLengthFt: 10, postSpacingFt: 8, gateCount: 1, gateWidthFt: 10 }), CalcInputError);
});
