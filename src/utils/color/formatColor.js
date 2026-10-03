import { normalizeCmyk, normalizeRgb } from './normalizeColor.js';

/**
 * Formats a number to a clean percentage string with max decimal places,
 * stripping trailing zeroes (e.g. 98.00 -> '98%', 98.5 -> '98.5%').
 * @param {number} val
 * @param {number} decimals
 * @returns {string}
 */
export function formatPercentage(val, decimals = 2) {
  if (typeof val !== 'number' || Number.isNaN(val)) return '0%';
  const cleanVal = Object.is(val, -0) ? 0 : Math.max(0, Math.min(100, val));
  const rounded = Number(cleanVal.toFixed(decimals));
  return `${rounded}%`;
}

/**
 * Formats CMYK object into formatted percentage strings per channel
 * @param {{ c: number, m: number, y: number, k: number }} cmyk
 * @param {number} decimals
 * @returns {{ c: string, m: string, y: string, k: string }}
 */
export function formatCmykValues(cmyk, decimals = 2) {
  const norm = normalizeCmyk(cmyk);
  return {
    c: formatPercentage(norm.c, decimals),
    m: formatPercentage(norm.m, decimals),
    y: formatPercentage(norm.y, decimals),
    k: formatPercentage(norm.k, decimals),
  };
}

/**
 * Formats CMYK object into a standard string representation
 * Example: "cmyk(98%, 20%, 0%, 15%)"
 * @param {{ c: number, m: number, y: number, k: number }} cmyk
 * @param {number} decimals
 * @returns {string}
 */
export function formatCmyk(cmyk, decimals = 2) {
  const values = formatCmykValues(cmyk, decimals);
  return `cmyk(${values.c}, ${values.m}, ${values.y}, ${values.k})`;
}

/**
 * Formats RGB object into "rgb(R, G, B)"
 * @param {{ r: number, g: number, b: number }} rgb
 * @returns {string}
 */
export function formatRgb(rgb) {
  const { r, g, b } = normalizeRgb(rgb);
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Formats RGB object into raw comma-separated values "R, G, B"
 * @param {{ r: number, g: number, b: number }} rgb
 * @returns {string}
 */
export function formatRgbChannels(rgb) {
  const { r, g, b } = normalizeRgb(rgb);
  return `${r}, ${g}, ${b}`;
}
