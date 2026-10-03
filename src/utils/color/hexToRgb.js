import { normalizeHex } from './normalizeColor.js';

/**
 * Converts a HEX string (#RGB or #RRGGBB, with or without '#') to an RGB object
 * Returns null if the HEX string is invalid.
 *
 * @param {string} hex
 * @returns {{ r: number, g: number, b: number } | null}
 */
export function hexToRgb(hex) {
  const normalized = normalizeHex(hex);
  if (!normalized) {
    return null;
  }

  const clean = normalized.slice(1);
  const r = Number.parseInt(clean.slice(0, 2), 16);
  const g = Number.parseInt(clean.slice(2, 4), 16);
  const b = Number.parseInt(clean.slice(4, 6), 16);

  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    return null;
  }

  return { r, g, b };
}
