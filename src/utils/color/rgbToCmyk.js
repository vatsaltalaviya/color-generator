import { normalizeRgb } from './normalizeColor.js';

/**
 * Converts an RGB color to CMYK using the standard normalized mathematical model
 * defined in PRD Section 3.
 *
 * @param {{ r: number, g: number, b: number }} rgb
 * @returns {{ c: number, m: number, y: number, k: number }} CMYK channels in percentage (0 - 100)
 */
export function rgbToCmyk(rgb) {
  const normRgb = normalizeRgb(rgb);
  const r = normRgb.r / 255;
  const g = normRgb.g / 255;
  const b = normRgb.b / 255;

  const maxVal = Math.max(r, g, b);
  const K = 1 - maxVal;

  // Pure black or near-zero edge case where K = 1
  if (K >= 1 || (r === 0 && g === 0 && b === 0)) {
    return {
      c: 0,
      m: 0,
      y: 0,
      k: 100,
    };
  }

  const denominator = 1 - K;
  let C = (1 - r - K) / denominator;
  let M = (1 - g - K) / denominator;
  let Y = (1 - b - K) / denominator;

  // Clamp to [0, 1] to avoid floating-point drift
  C = Math.max(0, Math.min(1, C));
  M = Math.max(0, Math.min(1, M));
  Y = Math.max(0, Math.min(1, Y));
  const cleanK = Math.max(0, Math.min(1, K));

  // Convert to 0-100 percentage, eliminating -0
  const cleanZero = (val) => (Object.is(val, -0) || Math.abs(val) < 1e-12 ? 0 : val);

  return {
    c: cleanZero(C * 100),
    m: cleanZero(M * 100),
    y: cleanZero(Y * 100),
    k: cleanZero(cleanK * 100),
  };
}
