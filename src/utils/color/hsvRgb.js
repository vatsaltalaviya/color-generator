import { clamp, normalizeRgb } from './normalizeColor.js';

/**
 * Converts RGB to HSV
 * @param {{ r: number, g: number, b: number }} rgb
 * @returns {{ h: number, s: number, v: number }} h in [0, 360], s in [0, 100], v in [0, 100]
 */
export function rgbToHsv(rgb) {
  const norm = normalizeRgb(rgb);
  const r = norm.r / 255;
  const g = norm.g / 255;
  const b = norm.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) {
      h = ((g - b) / delta) % 6;
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  const s = max === 0 ? 0 : (delta / max) * 100;
  const v = max * 100;

  return {
    h: Math.round(h),
    s: Math.round(s),
    v: Math.round(v),
  };
}

/**
 * Converts HSV to RGB
 * @param {{ h: number, s: number, v: number }} hsv
 * @returns {{ r: number, g: number, b: number }}
 */
export function hsvToRgb(hsv) {
  const h = (clamp(hsv?.h ?? 0, 0, 360) % 360) / 60;
  const s = clamp(hsv?.s ?? 0, 0, 100) / 100;
  const v = clamp(hsv?.v ?? 0, 0, 100) / 100;

  const c = v * s;
  const x = c * (1 - Math.abs((h % 2) - 1));
  const m = v - c;

  let r1;
  let g1;
  let b1;

  if (h >= 0 && h < 1) {
    r1 = c;
    g1 = x;
    b1 = 0;
  } else if (h >= 1 && h < 2) {
    r1 = x;
    g1 = c;
    b1 = 0;
  } else if (h >= 2 && h < 3) {
    r1 = 0;
    g1 = c;
    b1 = x;
  } else if (h >= 3 && h < 4) {
    r1 = 0;
    g1 = x;
    b1 = c;
  } else if (h >= 4 && h < 5) {
    r1 = x;
    g1 = 0;
    b1 = c;
  } else {
    r1 = c;
    g1 = 0;
    b1 = x;
  }

  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}
