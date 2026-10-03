import { normalizeRgb } from './normalizeColor.js';

/**
 * Converts an RGB color object to a standard 6-character uppercase HEX string with #
 * Example: RGB(4, 174, 218) -> #04AEDA
 *
 * @param {{ r: number, g: number, b: number }} rgb
 * @returns {string} HEX color string (e.g. #04AEDA)
 */
export function rgbToHex(rgb) {
  const { r, g, b } = normalizeRgb(rgb);
  const toHex = (c) => c.toString(16).padStart(2, '0').toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
