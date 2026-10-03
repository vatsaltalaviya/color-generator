import { useState, useMemo, useCallback } from 'react';
import { DEFAULT_COLOR } from '../constants/color.js';
import {
  rgbToCmyk,
  cmykToRgb,
  rgbToHex,
  hexToRgb,
  rgbToHsv,
  hsvToRgb,
  normalizeRgb,
  normalizeRgbChannel,
  formatCmyk,
  formatCmykValues,
  formatRgb,
  formatRgbChannels,
  isValidHex,
} from '../utils/color/index.js';

/**
 * Custom hook providing canonical color state management and synchronization
 * per PRD & AGENT.md specifications.
 * Canonical representation is RGB { r, g, b }.
 */
export function useColorConverter(initialRgb = DEFAULT_COLOR) {
  // Canonical RGB color state
  const [rgb, setRgb] = useState(() => normalizeRgb(initialRgb));

  // HSV representation synced for picker wheel precision (preserves Hue when Saturation/Value is 0)
  const [hsv, setHsv] = useState(() => rgbToHsv(initialRgb));

  // Derived HEX representation
  const hex = useMemo(() => rgbToHex(rgb), [rgb]);

  // Derived CMYK representation
  const cmyk = useMemo(() => rgbToCmyk(rgb), [rgb]);

  // Derived CMYK preview RGB (inverse conversion for browser rendering)
  const cmykDerivedRgb = useMemo(() => cmykToRgb(cmyk), [cmyk]);

  // Formatted representations for UI display
  const cmykFormatted = useMemo(() => formatCmykValues(cmyk), [cmyk]);
  const cmykString = useMemo(() => formatCmyk(cmyk), [cmyk]);
  const rgbString = useMemo(() => formatRgb(rgb), [rgb]);
  const rgbChannelsString = useMemo(() => formatRgbChannels(rgb), [rgb]);

  /**
   * Set color from RGB directly
   */
  const setColorRgb = useCallback((newRgb) => {
    const normalized = normalizeRgb(newRgb);
    setRgb(normalized);
    setHsv(rgbToHsv(normalized));
  }, []);

  /**
   * Set an individual RGB channel
   */
  const setColorRgbChannel = useCallback((channel, value) => {
    setRgb((prev) => {
      const channelVal = normalizeRgbChannel(value);
      const updated = {
        ...prev,
        [channel]: channelVal,
      };
      setHsv(rgbToHsv(updated));
      return updated;
    });
  }, []);

  /**
   * Set color from HSV (used by interactive color wheel and value slider)
   */
  const setColorHsv = useCallback((newHsv) => {
    setHsv(newHsv);
    const convertedRgb = hsvToRgb(newHsv);
    setRgb(convertedRgb);
  }, []);

  /**
   * Set color from HEX with validation
   * @param {string} hexInput
   * @returns {{ success: boolean, error?: string }}
   */
  const setColorHex = useCallback((hexInput) => {
    if (!isValidHex(hexInput)) {
      return { success: false, error: 'Invalid HEX color format. Use #RGB or #RRGGBB.' };
    }
    const parsedRgb = hexToRgb(hexInput);
    if (!parsedRgb) {
      return { success: false, error: 'Could not parse HEX color value.' };
    }
    setRgb(parsedRgb);
    setHsv(rgbToHsv(parsedRgb));
    return { success: true };
  }, []);

  /**
   * Reset to default color
   */
  const resetToDefault = useCallback(() => {
    setColorRgb(DEFAULT_COLOR);
  }, [setColorRgb]);

  return {
    rgb,
    hex,
    cmyk,
    cmykDerivedRgb,
    hsv,
    cmykFormatted,
    cmykString,
    rgbString,
    rgbChannelsString,
    setColorRgb,
    setColorRgbChannel,
    setColorHsv,
    setColorHex,
    resetToDefault,
  };
}
