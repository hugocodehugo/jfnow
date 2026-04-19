'use strict';

const { strict: assert } = require('assert');
const { test } = require('node:test');
const { jfnow, jfnowFormatted } = require('./index');

test('jfnow returns a Date object', () => {
  const before = Date.now();
  const result = jfnow();
  const after = Date.now();

  assert.ok(result instanceof Date, 'result should be a Date');
  assert.ok(result.getTime() >= before, 'result should be >= before');
  assert.ok(result.getTime() <= after, 'result should be <= after');
});

test('jfnow returns a date close to now', () => {
  const result = jfnow();
  const diff = Math.abs(Date.now() - result.getTime());
  assert.ok(diff < 1000, 'result should be within 1 second of now');
});

test('jfnowFormatted returns a non-empty string', () => {
  const result = jfnowFormatted();
  assert.equal(typeof result, 'string');
  assert.ok(result.length > 0, 'formatted result should be non-empty');
});

test('jfnowFormatted accepts custom options', () => {
  const result = jfnowFormatted({ dateStyle: 'short', timeStyle: 'short' });
  assert.equal(typeof result, 'string');
  assert.ok(result.length > 0, 'formatted result with custom options should be non-empty');
});
