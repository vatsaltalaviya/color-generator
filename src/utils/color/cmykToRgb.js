import { normalizeCmyk } from './normalizeColor.js';

/**
 * Converts CMYK percentages (0-100) to RGB (0-255) using the documented
 * inverse mathematical model from PRD Section 6 & AGENT.md Section 9.
 *
 * @param {{ c: number, m: number, y: number, k: number }} cmyk
 * @returns {{ r: number, g: number, b: number }}
 */
export function cmykToRgb(cmyk) {
  const normCmyk = normalizeCmyk(cmyk);
  const c = normCmyk.c / 100;
  const m = normCmyk.m / 100;
  const y = normCmyk.y / 100;
  const k = normCmyk.k / 100;

  const rCalc = 255 * (1 - c) * (1 - k);
  const gCalc = 255 * (1 - m) * (1 - k);
  const bCalc = 255 * (1 - y) * (1 - k);

  const clampAndRound = (val) => {
    const rounded = Math.round(val);
    return Math.max(0, Math.min(255, rounded));
  };

  return {
    r: clampAndRound(rCalc),
    g: clampAndRound(gCalc),
    b: clampAndRound(bCalc),
  };
}
