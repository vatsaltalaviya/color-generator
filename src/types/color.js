/**
 * @typedef {Object} RGBColor
 * @property {number} r - Red channel (0 - 255)
 * @property {number} g - Green channel (0 - 255)
 * @property {number} b - Blue channel (0 - 255)
 */

/**
 * @typedef {Object} CMYKColor
 * @property {number} c - Cyan channel (0 - 100 percentage)
 * @property {number} m - Magenta channel (0 - 100 percentage)
 * @property {number} y - Yellow channel (0 - 100 percentage)
 * @property {number} k - Key / Black channel (0 - 100 percentage)
 */

/**
 * @typedef {Object} HSVColor
 * @property {number} h - Hue (0 - 360 degrees)
 * @property {number} s - Saturation (0 - 100 percentage)
 * @property {number} v - Value / Brightness (0 - 100 percentage)
 */

/**
 * @typedef {Object} ColorState
 * @property {RGBColor} rgb - Canonical RGB representation
 * @property {string} hex - 6-digit hex string with #
 * @property {CMYKColor} cmyk - Derived mathematical CMYK representation
 * @property {RGBColor} cmykDerivedRgb - RGB derived from CMYK for browser preview
 * @property {HSVColor} hsv - Derived HSV representation for picker
 */

export {};
