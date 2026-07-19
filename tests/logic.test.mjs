import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const {roundToHalf, computeStartWeight, getWeekReps, est1RM, plateBreakdown, shouldRestAlert, isoWeekNumber, tipLeft} = require('../logic.js');

test('roundToHalf rounds to nearest 0.5', () => {
  assert.equal(roundToHalf(61.2), 61);
  assert.equal(roundToHalf(61.3), 61.5);
  assert.equal(roundToHalf(102.5), 102.5);
});

test('computeStartWeight: no previous weight → empty string', () => {
  assert.equal(computeStartWeight(null, {}), '');
  assert.equal(computeStartWeight(0, {bump: true}), '');
});

test('computeStartWeight: deload week takes priority (60%)', () => {
  assert.equal(computeStartWeight(100, {deload: true, failStreak: 3, bump: true}), '60');
});

test('computeStartWeight: two fails → 10% deload', () => {
  assert.equal(computeStartWeight(100, {failStreak: 2}), '90');
  assert.equal(computeStartWeight(100, {failStreak: 1}), '100');
});

test('computeStartWeight: bump adds progression pct, rounded to 0.5', () => {
  assert.equal(computeStartWeight(100, {bump: true, pct: 2.5}), '102.5');
  assert.equal(computeStartWeight(80, {bump: true, pct: 2.5}), '82');
  assert.equal(computeStartWeight(100, {bump: true, pct: 5}), '105');
});

test('computeStartWeight: plain carry-over', () => {
  assert.equal(computeStartWeight(72.5, {}), '72.5');
});

test('getWeekReps: hypertrophy cycle for 8-12 range', () => {
  assert.equal(getWeekReps([8, 12], 1, 'hypertrophy'), 12);
  assert.equal(getWeekReps([8, 12], 2, 'hypertrophy'), 14);
  assert.equal(getWeekReps([8, 12], 3, 'hypertrophy'), 8);
  assert.equal(getWeekReps([8, 12], 4, 'hypertrophy'), 17); // deload high-rep
});

test('getWeekReps: strength cycle for 5-8 range', () => {
  assert.equal(getWeekReps([5, 8], 1, 'strength'), 7);
  assert.equal(getWeekReps([5, 8], 2, 'strength'), 6);
  assert.equal(getWeekReps([5, 8], 3, 'strength'), 5);
  assert.equal(getWeekReps([5, 8], 4, 'strength'), 8);
});

test('getWeekReps: unknown goal falls back to hypertrophy, never below 1', () => {
  assert.equal(getWeekReps([8, 12], 1, 'nonsense'), 12);
  assert.ok(getWeekReps([1, 2], 3, 'strength') >= 1);
});

test('est1RM uses Epley formula', () => {
  assert.equal(est1RM(100, 10), 133);
  assert.equal(est1RM(60, 1), 62);
});

test('plateBreakdown: 100kg on 20kg bar → 25+15 per side', () => {
  const r = plateBreakdown(100, 20);
  assert.equal(r.perSide, 40);
  assert.deepEqual(r.plates, [25, 15]);
  assert.equal(r.remainder, 0);
});

test('plateBreakdown: bar only and sub-bar weights', () => {
  assert.deepEqual(plateBreakdown(20, 20).plates, []);
  assert.equal(plateBreakdown(15, 20), null);
});

test('plateBreakdown: leftover when weight not plate-divisible', () => {
  const r = plateBreakdown(21.4, 20);
  assert.deepEqual(r.plates, [0.5]);
  assert.ok(r.remainder > 0 && r.remainder < 0.5);
});

test('shouldRestAlert: fires on fresh expiry and on late notice after page suspend', () => {
  assert.equal(shouldRestAlert(0), true);
  assert.equal(shouldRestAlert(4000), true);
  assert.equal(shouldRestAlert(120000), true);
});

test('shouldRestAlert: skips negative overdue and absurdly stale (>10 min)', () => {
  assert.equal(shouldRestAlert(-100), false);
  assert.equal(shouldRestAlert(600000), false);
  assert.equal(shouldRestAlert(3600000), false);
});

test('isoWeekNumber: mid-year date', () => {
  assert.equal(isoWeekNumber(new Date(2026, 6, 19)), 29);
});

test('isoWeekNumber: ISO week 1 spans New Year', () => {
  assert.equal(isoWeekNumber(new Date(2026, 0, 1)), 1);
  assert.equal(isoWeekNumber(new Date(2024, 11, 30)), 1);
});

test('isoWeekNumber: early January can belong to week 52/53 of previous year', () => {
  assert.equal(isoWeekNumber(new Date(2023, 0, 1)), 52);
  assert.equal(isoWeekNumber(new Date(2027, 0, 1)), 53);
});

test('tipLeft: centers the tip on the cell when it fits', () => {
  assert.equal(tipLeft(150, 100, 300), 100);
});

test('tipLeft: clamps at container edges', () => {
  assert.equal(tipLeft(10, 100, 300), 4);
  assert.equal(tipLeft(290, 100, 300), 196);
});
