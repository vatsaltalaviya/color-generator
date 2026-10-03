/**
 * Color normalization and validation utilities
 */

/**
 * Clamps a channel value between min and max, ensuring it's a valid number
 * @param {number} val
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(val, min, max) {
  if (typeof val !== 'number' || Number.isNaN(val)) return min;
  if (val < min) return min;
  if (val > max) return max;
  return val;
}

/**
 * Normalizes a single RGB channel (0-255 integer)
 * @param {number|string} val
 * @returns {number}
 */
export function normalizeRgbChannel(val) {
  const num = typeof val === 'string' ? Number.parseFloat(val) : val;
  const clamped = clamp(num, 0, 255);
  return Math.round(clamped);
}

/**
 * Normalizes an RGB color object
 * @param {{ r: number, g: number, b: number }} rgb
 * @returns {{ r: number, g: number, b: number }}
 */
export function normalizeRgb(rgb) {
  if (!rgb || typeof rgb !== 'object') {
    return { r: 0, g: 0, b: 0 };
  }
  return {
    r: normalizeRgbChannel(rgb.r),
    g: normalizeRgbChannel(rgb.g),
    b: normalizeRgbChannel(rgb.b),
  };
}

/**
 * Normalizes a single CMYK channel (0-100 percentage)
 * @param {number|string} val
 * @returns {number}
 */
export function normalizeCmykChannel(val) {
  const num = typeof val === 'string' ? Number.parseFloat(val) : val;
  return clamp(num, 0, 100);
}

/**
 * Normalizes a CMYK color object
 * @param {{ c: number, m: number, y: number, k: number }} cmyk
 * @returns {{ c: number, m: number, y: number, k: number }}
 */
export function normalizeCmyk(cmyk) {
  if (!cmyk || typeof cmyk !== 'object') {
    return { c: 0, m: 0, y: 0, k: 100 };
  }
  return {
    c: normalizeCmykChannel(cmyk.c),
    m: normalizeCmykChannel(cmyk.m),
    y: normalizeCmykChannel(cmyk.y),
    k: normalizeCmykChannel(cmyk.k),
  };
}

/**
 * Checks if a string is a valid HEX color (#RGB or #RRGGBB, with or without '#')
 * @param {string} hex
 * @returns {boolean}
 */
export function isValidHex(hex) {
  if (typeof hex !== 'string') return false;
  const clean = hex.trim().replace(/^#/, '');
  return /^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(clean);
}

/**
 * Normalizes HEX string to #RRGGBB uppercase format
 * Returns null if invalid
 * @param {string} hex
 * @returns {string|null}
 */
export function normalizeHex(hex) {
  if (!isValidHex(hex)) return null;
  const clean = hex.trim().replace(/^#/, '');
  if (clean.length === 3) {
    const r = clean[0] + clean[0];
    const g = clean[1] + clean[1];
    const b = clean[2] + clean[2];
    return `#${(r + g + b).toUpperCase()}`;
  }
  return `#${clean.toUpperCase()}`;
}

/**
 * Checks if RGB object has valid channels in 0-255 range
 * @param {any} rgb
 * @returns {boolean}
 */
export function isValidRgb(rgb) {
  if (!rgb || typeof rgb !== 'object') return false;
  const { r, g, b } = rgb;
  const isChannelValid = (v) =>
    typeof v === 'number' && !Number.isNaN(v) && v >= 0 && v <= 255;
  return isChannelValid(r) && isChannelValid(g) && isChannelValid(b);
}
