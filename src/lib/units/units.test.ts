import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ceilSafe, ceilTo, cuFtToCuM, cuFtToCuYd, round, toFeet, toInches } from './index';

const approx = (a: number, b: number, tol = 1e-6) => assert.ok(Math.abs(a - b) <= tol, `${a} !~ ${b}`);

test('length conversions', () => {
  approx(toFeet(1, 'm'), 3.280839895);
  approx(toFeet(12, 'in'), 1);
  approx(toFeet(2, 'yd'), 6);
  approx(toInches(30.48, 'cm'), 12);
  approx(toInches(1, 'ft'), 12);
});

test('volume conversions', () => {
  approx(cuFtToCuYd(27), 1);
  approx(cuFtToCuM(35.3146667), 1, 1e-4);
});

test('ceilTo rounds up to steps and ignores float noise', () => {
  assert.equal(ceilTo(6.11, 0.25), 6.25);
  assert.equal(ceilTo(6.25, 0.25), 6.25);
  assert.equal(ceilTo(6.2500000001, 0.25), 6.25);
  assert.equal(ceilSafe(61.00000000001), 61);
  assert.equal(ceilSafe(61.1), 62);
});

test('round', () => {
  assert.equal(round(1.005, 2), 1.01);
  assert.equal(round(2.4444, 2), 2.44);
});
