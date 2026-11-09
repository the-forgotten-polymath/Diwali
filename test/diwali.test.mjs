import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as esmModule from '../dist/index.js';

describe('diwali-animations package tests', () => {
  it('exports all 8 signature Diwali effects and interactive triggers', () => {
    const requiredExports = [
      'diyas',
      'rockets',
      'chakri',
      'anar',
      'phuljhadi',
      'ladi',
      'lanterns',
      'flowerShower',
      'celebrate',
      'enableMouseRockets',
      'enableMouseSparkler',
      'enableMouseChakkar',
      'enableClickToSpawn',
      'stopAll',
      'DiwaliEngine',
    ];

    for (const exp of requiredExports) {
      assert.ok(exp in esmModule, `Expected export '${exp}' to exist in module.`);
      assert.strictEqual(typeof esmModule[exp], 'function', `Expected '${exp}' to be a function.`);
    }
  });

  it('verifies CJS and ESM compatibility', async () => {
    const cjsModule = await import('../dist/index.cjs');
    assert.strictEqual(typeof cjsModule.celebrate, 'function');
    assert.strictEqual(typeof cjsModule.enableMouseChakkar, 'function');
    assert.strictEqual(typeof cjsModule.diyas, 'function');
    assert.strictEqual(typeof cjsModule.lanterns, 'function');
  });
});
