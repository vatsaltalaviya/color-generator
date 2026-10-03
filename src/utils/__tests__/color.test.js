import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  rgbToCmyk,
  cmykToRgb,
  rgbToHex,
  hexToRgb,
  normalizeRgb,
  normalizeCmyk,
  normalizeHex,
  isValidHex,
  isValidRgb,
  formatCmyk,
  formatCmykValues,
  rgbToHsv,
  hsvToRgb,
} from '../color/index.js';

describe('RGB to CMYK conversion (PRD Section 3 / 19 requirements)', () => {
  it('converts Pure White RGB(255, 255, 255) to CMYK(0, 0, 0, 0)', () => {
    const cmyk = rgbToCmyk({ r: 255, g: 255, b: 255 });
    assert.deepEqual(cmyk, { c: 0, m: 0, y: 0, k: 0 });
  });

  it('converts Pure Black RGB(0, 0, 0) to CMYK(0, 0, 0, 100)', () => {
    const cmyk = rgbToCmyk({ r: 0, g: 0, b: 0 });
    assert.deepEqual(cmyk, { c: 0, m: 0, y: 0, k: 100 });
  });

  it('converts Pure Red RGB(255, 0, 0) to CMYK(0, 100, 100, 0)', () => {
    const cmyk = rgbToCmyk({ r: 255, g: 0, b: 0 });
    assert.deepEqual(cmyk, { c: 0, m: 100, y: 100, k: 0 });
  });

  it('converts Pure Green RGB(0, 255, 0) to CMYK(100, 0, 100, 0)', () => {
    const cmyk = rgbToCmyk({ r: 0, g: 255, b: 0 });
    assert.deepEqual(cmyk, { c: 100, m: 0, y: 100, k: 0 });
  });

  it('converts Pure Blue RGB(0, 0, 255) to CMYK(100, 100, 0, 0)', () => {
    const cmyk = rgbToCmyk({ r: 0, g: 0, b: 255 });
    assert.deepEqual(cmyk, { c: 100, m: 100, y: 0, k: 0 });
  });

  it('converts Pure Yellow RGB(255, 255, 0) to CMYK(0, 0, 100, 0)', () => {
    const cmyk = rgbToCmyk({ r: 255, g: 255, b: 0 });
    assert.deepEqual(cmyk, { c: 0, m: 0, y: 100, k: 0 });
  });

  it('converts Pure Cyan RGB(0, 255, 255) to CMYK(100, 0, 0, 0)', () => {
    const cmyk = rgbToCmyk({ r: 0, g: 255, b: 255 });
    assert.deepEqual(cmyk, { c: 100, m: 0, y: 0, k: 0 });
  });

  it('converts Pure Magenta RGB(255, 0, 255) to CMYK(0, 100, 0, 0)', () => {
    const cmyk = rgbToCmyk({ r: 255, g: 0, b: 255 });
    assert.deepEqual(cmyk, { c: 0, m: 100, y: 0, k: 0 });
  });

  it('converts Grayscale RGB(128, 128, 128) correctly', () => {
    const cmyk = rgbToCmyk({ r: 128, g: 128, b: 128 });
    // In CMYK, neutral gray has C=0, M=0, Y=0, and K around 49.8% (1 - 128/255)
    assert.equal(cmyk.c, 0);
    assert.equal(cmyk.m, 0);
    assert.equal(cmyk.y, 0);
    assert.ok(Math.abs(cmyk.k - 49.8) < 0.2);
  });

  it('handles near-boundaries: RGB(1, 1, 1) and RGB(254, 254, 254)', () => {
    const nearBlack = rgbToCmyk({ r: 1, g: 1, b: 1 });
    assert.ok(nearBlack.k > 99 && nearBlack.k < 100);
    assert.equal(nearBlack.c, 0);
    assert.equal(nearBlack.m, 0);
    assert.equal(nearBlack.y, 0);

    const nearWhite = rgbToCmyk({ r: 254, g: 254, b: 254 });
    assert.ok(nearWhite.k > 0 && nearWhite.k < 1);
    assert.equal(nearWhite.c, 0);
    assert.equal(nearWhite.m, 0);
    assert.equal(nearWhite.y, 0);
  });

  it('converts specification example RGB(4, 174, 218) accurately', () => {
    const cmyk = rgbToCmyk({ r: 4, g: 174, b: 218 });
    // K = 1 - 218/255 = ~0.145098 (14.51%)
    // C = (1 - 4/255 - K) / (1 - K) = (214/255)/(218/255) = 214/218 = ~98.17%
    // M = (1 - 174/255 - K) / (1 - K) = (44/255)/(218/255) = 44/218 = ~20.18%
    // Y = 0%
    const formatted = formatCmykValues(cmyk);
    assert.equal(formatted.c, '98.17%');
    assert.equal(formatted.m, '20.18%');
    assert.equal(formatted.y, '0%');
    assert.equal(formatted.k, '14.51%');
  });
});

describe('CMYK to RGB inverse conversion', () => {
  it('converts CMYK(0, 0, 0, 0) to RGB(255, 255, 255)', () => {
    const rgb = cmykToRgb({ c: 0, m: 0, y: 0, k: 0 });
    assert.deepEqual(rgb, { r: 255, g: 255, b: 255 });
  });

  it('converts CMYK(0, 0, 0, 100) to RGB(0, 0, 0)', () => {
    const rgb = cmykToRgb({ c: 0, m: 0, y: 0, k: 100 });
    assert.deepEqual(rgb, { r: 0, g: 0, b: 0 });
  });

  it('converts CMYK(0, 100, 100, 0) to RGB(255, 0, 0)', () => {
    const rgb = cmykToRgb({ c: 0, m: 100, y: 100, k: 0 });
    assert.deepEqual(rgb, { r: 255, g: 0, b: 0 });
  });

  it('converts CMYK(100, 0, 100, 0) to RGB(0, 255, 0)', () => {
    const rgb = cmykToRgb({ c: 100, m: 0, y: 100, k: 0 });
    assert.deepEqual(rgb, { r: 0, g: 255, b: 0 });
  });

  it('converts CMYK(100, 100, 0, 0) to RGB(0, 0, 255)', () => {
    const rgb = cmykToRgb({ c: 100, m: 100, y: 0, k: 0 });
    assert.deepEqual(rgb, { r: 0, g: 0, b: 255 });
  });
});

describe('Round trip RGB -> CMYK -> RGB', () => {
  const testColors = [
    { r: 255, g: 255, b: 255 },
    { r: 0, g: 0, b: 0 },
    { r: 255, g: 0, b: 0 },
    { r: 0, g: 255, b: 0 },
    { r: 0, g: 0, b: 255 },
    { r: 4, g: 174, b: 218 },
    { r: 128, g: 128, b: 128 },
    { r: 64, g: 192, b: 32 },
    { r: 200, g: 50, b: 150 },
  ];

  for (const original of testColors) {
    it(`round trips RGB(${original.r}, ${original.g}, ${original.b}) within 1 unit tolerance`, () => {
      const cmyk = rgbToCmyk(original);
      const reconstructed = cmykToRgb(cmyk);
      assert.ok(Math.abs(reconstructed.r - original.r) <= 1, `R channel difference > 1: orig ${original.r} got ${reconstructed.r}`);
      assert.ok(Math.abs(reconstructed.g - original.g) <= 1, `G channel difference > 1: orig ${original.g} got ${reconstructed.g}`);
      assert.ok(Math.abs(reconstructed.b - original.b) <= 1, `B channel difference > 1: orig ${original.b} got ${reconstructed.b}`);
    });
  }
});

describe('HEX conversions & validation', () => {
  it('converts RGB(4, 174, 218) to #04AEDA', () => {
    assert.equal(rgbToHex({ r: 4, g: 174, b: 218 }), '#04AEDA');
  });

  it('converts RGB(0, 0, 0) to #000000', () => {
    assert.equal(rgbToHex({ r: 0, g: 0, b: 0 }), '#000000');
  });

  it('converts RGB(255, 255, 255) to #FFFFFF', () => {
    assert.equal(rgbToHex({ r: 255, g: 255, b: 255 }), '#FFFFFF');
  });

  it('converts valid 6-char HEX to RGB', () => {
    assert.deepEqual(hexToRgb('#04AEDA'), { r: 4, g: 174, b: 218 });
    assert.deepEqual(hexToRgb('04aeda'), { r: 4, g: 174, b: 218 });
  });

  it('converts shorthand 3-char HEX #ABC to #AABBCC RGB(170, 187, 204)', () => {
    assert.equal(normalizeHex('#ABC'), '#AABBCC');
    assert.deepEqual(hexToRgb('#ABC'), { r: 170, g: 187, b: 204 });
  });

  it('handles invalid HEX safely without crashing', () => {
    assert.equal(isValidHex('xyz'), false);
    assert.equal(isValidHex('#12345'), false);
    assert.equal(isValidHex('#1234567'), false);
    assert.equal(hexToRgb('invalid'), null);
    assert.equal(normalizeHex('invalid'), null);
  });
});

describe('RGB and CMYK normalization & validation', () => {
  it('clamps out-of-range values in normalizeRgb', () => {
    assert.deepEqual(normalizeRgb({ r: -10, g: 300, b: 128 }), { r: 0, g: 255, b: 128 });
  });

  it('handles NaN gracefully', () => {
    assert.deepEqual(normalizeRgb({ r: NaN, g: 100, b: 200 }), { r: 0, g: 100, b: 200 });
  });

  it('validates RGB correctly', () => {
    assert.equal(isValidRgb({ r: 0, g: 128, b: 255 }), true);
    assert.equal(isValidRgb({ r: -1, g: 128, b: 255 }), false);
    assert.equal(isValidRgb({ r: 0, g: 256, b: 255 }), false);
    assert.equal(isValidRgb({ r: NaN, g: 100, b: 100 }), false);
  });

  it('clamps out-of-range values in normalizeCmyk', () => {
    assert.deepEqual(normalizeCmyk({ c: -10, m: 150, y: 50, k: NaN }), { c: 0, m: 100, y: 50, k: 0 });
  });
});

describe('Formatting utilities', () => {
  it('formats CMYK string cleanly', () => {
    const cmyk = { c: 98.172, m: 20.184, y: 0, k: 14.51 };
    assert.equal(formatCmyk(cmyk), 'cmyk(98.17%, 20.18%, 0%, 14.51%)');
  });

  it('removes unnecessary trailing zeros', () => {
    const cmyk = { c: 50.00, m: 0.00, y: 100.00, k: 0.00 };
    assert.equal(formatCmyk(cmyk), 'cmyk(50%, 0%, 100%, 0%)');
  });
});

describe('HSV and RGB conversions for color wheel', () => {
  it('converts Pure Red RGB to HSV(0, 100, 100) and back', () => {
    const hsv = rgbToHsv({ r: 255, g: 0, b: 0 });
    assert.deepEqual(hsv, { h: 0, s: 100, v: 100 });
    const rgb = hsvToRgb(hsv);
    assert.deepEqual(rgb, { r: 255, g: 0, b: 0 });
  });

  it('converts Pure Blue RGB to HSV(240, 100, 100) and back', () => {
    const hsv = rgbToHsv({ r: 0, g: 0, b: 255 });
    assert.deepEqual(hsv, { h: 240, s: 100, v: 100 });
    const rgb = hsvToRgb(hsv);
    assert.deepEqual(rgb, { r: 0, g: 0, b: 255 });
  });
});
