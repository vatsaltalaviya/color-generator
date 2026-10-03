import { useMemo } from 'react';
import { rgbToHex, getContrastColor } from '../../utils/color/index.js';

/**
 * Side-by-side color preview panels for Screen RGB vs CMYK Derived colors
 */
export function ColorPreview({ rgb, cmykDerivedRgb, hex, cmykString }) {
  const derivedHex = useMemo(() => rgbToHex(cmykDerivedRgb), [cmykDerivedRgb]);

  const rgbContrastColor = useMemo(() => getContrastColor(rgb), [rgb]);
  const cmykContrastColor = useMemo(() => getContrastColor(cmykDerivedRgb), [cmykDerivedRgb]);

  // Check if mathematical roundtrip yields exact match
  const isExactMatch =
    rgb.r === cmykDerivedRgb.r &&
    rgb.g === cmykDerivedRgb.g &&
    rgb.b === cmykDerivedRgb.b;

  return (
    <section className="previews-section" aria-label="Color Previews">
      <div className="section-title-row">
        <h3 className="section-title">Color Previews</h3>
        <span className="section-badge">
          {isExactMatch ? 'Exact Mathematical Match' : 'Simulated Comparison'}
        </span>
      </div>

      <div className="preview-cards-grid">
        {/* Preview A: RGB / Screen Preview */}
        <div className="preview-card" id="rgb-preview-card">
          <div className="preview-card-header">
            <div className="preview-tag-group">
              <span className="preview-badge screen">RGB / Screen</span>
              <span className="color-model-tag">Additive Model (Light)</span>
            </div>
          </div>

          <div
            className="swatch-box"
            style={{ backgroundColor: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` }}
            aria-label={`RGB Screen Preview swatch for ${hex}`}
          >
            <div className="swatch-content" style={{ color: rgbContrastColor }}>
              <span className="swatch-sample-text">Screen Color</span>
              <span className="swatch-hex">{hex}</span>
              <span className="swatch-rgb">{`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}</span>
            </div>
          </div>

          <div className="preview-footer">
            <span className="preview-footer-label">Rendered via Browser Display</span>
            <span className="preview-footer-sub">sRGB Color Space</span>
          </div>
        </div>

        {/* Preview B: CMYK Derived Preview */}
        <div className="preview-card" id="cmyk-preview-card">
          <div className="preview-card-header">
            <div className="preview-tag-group">
              <span className="preview-badge cmyk">CMYK Derived</span>
              <span className="color-model-tag">Subtractive Model (Ink)</span>
            </div>
          </div>

          <div
            className="swatch-box"
            style={{
              backgroundColor: `rgb(${cmykDerivedRgb.r}, ${cmykDerivedRgb.g}, ${cmykDerivedRgb.b})`,
            }}
            aria-label={`CMYK Derived Preview swatch for ${cmykString}`}
          >
            <div className="swatch-content" style={{ color: cmykContrastColor }}>
              <span className="swatch-sample-text">CMYK Inverse</span>
              <span className="swatch-hex">{derivedHex}</span>
              <span className="swatch-rgb">{`rgb(${cmykDerivedRgb.r}, ${cmykDerivedRgb.g}, ${cmykDerivedRgb.b})`}</span>
            </div>
          </div>

          <div className="preview-footer">
            <span className="preview-footer-label">Mathematically Derived Preview</span>
            <span className="preview-footer-sub">
              Calculated via standard CMYK inverse. Not an ICC print proof.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ColorPreview;
