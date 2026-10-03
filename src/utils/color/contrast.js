import { normalizeRgb } from './normalizeColor.js';

/**
 * Calculates WCAG relative luminance of an RGB color
 * @param {{ r: number, g: number, b: number }} rgb
 * @returns {number} 0 to 1
 */
export function getLuminance(rgb) {
  const { r, g, b } = normalizeRgb(rgb);
  const a = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

/**
 * Returns an accessible contrast color (#FFFFFF or #000000) for a given background RGB
 * @param {{ r: number, g: number, b: number }} rgb
 * @returns {'#FFFFFF' | '#000000'}
 */
export function getContrastColor(rgb) {
  const lum = getLuminance(rgb);
  // Using 0.179 threshold for optimal contrast
  return lum > 0.179 ? '#000000' : '#FFFFFF';
}
