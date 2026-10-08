import { useState, useMemo } from 'react';
import {
  getContrastColor,
  rgbToCmyk,
  formatCmyk,
  formatCmykValues,
  formatRgb,
} from '../../utils/color/index.js';
import CopyButton from '../CopyButton/CopyButton.jsx';

/**
 * Side-by-side color preview panels clearly distinguishing
 * Digital Screen (RGB light) from Physical Print Proof (CMYK ink).
 */
export function ColorPreview({
  rgb,
  cmykDerivedRgb,
  hex,
  cmyk,
  cmykFormatted,
  cmykString,
  rgbString,
}) {
  const [paperStock, setPaperStock] = useState('coated');

  const effectiveRgb = useMemo(() => rgb || { r: 4, g: 174, b: 218 }, [rgb]);
  const effectiveCmykRgb = useMemo(() => cmykDerivedRgb || effectiveRgb, [cmykDerivedRgb, effectiveRgb]);

  const safeCmyk = useMemo(() => cmyk || rgbToCmyk(effectiveRgb), [cmyk, effectiveRgb]);
  const safeCmykFormatted = useMemo(
    () => cmykFormatted || formatCmykValues(safeCmyk),
    [cmykFormatted, safeCmyk]
  );
  const safeCmykString = useMemo(
    () => cmykString || formatCmyk(safeCmyk),
    [cmykString, safeCmyk]
  );
  const safeRgbString = useMemo(
    () => rgbString || formatRgb(effectiveRgb),
    [rgbString, effectiveRgb]
  );

  const rgbContrastColor = useMemo(() => getContrastColor(effectiveRgb), [effectiveRgb]);
  const cmykContrastColor = useMemo(() => getContrastColor(effectiveCmykRgb), [effectiveCmykRgb]);

  return (
    <section className="previews-section" aria-label="Color Previews">
      <div className="section-title-row">
        <div className="section-heading-group">
          <h3 className="section-title">Color Previews</h3>
          <span className="section-subtitle">Digital Screen vs Commercial Print Simulation</span>
        </div>
        <span className="section-badge">
          Light (RGB) ⇄ Ink (CMYK)
        </span>
      </div>

      <div className="preview-cards-grid">
        {/* Preview A: RGB / Screen Preview */}
        <div className="preview-card screen-preview-card" id="rgb-preview-card">
          <div className="preview-card-header">
            <div className="preview-tag-group">
              <div className="preview-icon-badge screen">
                <svg
                  className="preview-badge-icon"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                <span>Digital Screen</span>
              </div>
              <span className="color-model-tag">sRGB (Additive Light)</span>
            </div>
            <CopyButton
              textToCopy={hex}
              label="Copy HEX"
              ariaLabel="Copy HEX color code"
            />
          </div>

          <div
            className="swatch-box screen-swatch"
            style={{ backgroundColor: `rgb(${effectiveRgb.r}, ${effectiveRgb.g}, ${effectiveRgb.b})` }}
            aria-label={`RGB Screen Preview swatch for ${hex}`}
          >
            <div className="screen-glare-overlay" aria-hidden="true" />
            <div className="swatch-content" style={{ color: rgbContrastColor }}>
              <span className="swatch-category-tag">DIGITAL DISPLAY</span>
              <span className="swatch-hex">{hex}</span>
              <span className="swatch-secondary-val">{safeRgbString}</span>

              <div
                className="screen-sample-badge"
                style={{
                  borderColor:
                    rgbContrastColor === '#ffffff'
                      ? 'rgba(255, 255, 255, 0.3)'
                      : 'rgba(0, 0, 0, 0.3)',
                }}
              >
                <span>Aa 123 • Contrast Sample</span>
              </div>
            </div>
          </div>

          <div className="preview-footer">
            <div className="footer-spec-row">
              <span className="preview-footer-label">Browser Display Output</span>
              <span className="footer-spec-badge screen-badge">Emissive Gamut</span>
            </div>
            <span className="preview-footer-sub">
              Rendered via monitor pixels. Colors are created by emitting Red, Green, and Blue light.
            </span>
          </div>
        </div>

        {/* Preview B: CMYK Print Simulation Preview */}
        <div className="preview-card print-preview-card" id="cmyk-preview-card">
          <div className="preview-card-header">
            <div className="preview-tag-group">
              <div className="preview-icon-badge print">
                <svg
                  className="preview-badge-icon"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                </svg>
                <span>Print Proof</span>
              </div>
              <span className="color-model-tag">CMYK (Subtractive Ink)</span>
            </div>

            <div className="print-controls-group">
              <div
                className="paper-stock-toggle"
                role="group"
                aria-label="Paper stock finish selection"
              >
                <button
                  type="button"
                  className={`paper-stock-btn ${paperStock === 'coated' ? 'active' : ''}`}
                  onClick={() => setPaperStock('coated')}
                  id="paper-stock-coated-btn"
                  title="Coated glossy stock (vibrant ink holdout)"
                >
                  Coated
                </button>
                <button
                  type="button"
                  className={`paper-stock-btn ${paperStock === 'uncoated' ? 'active' : ''}`}
                  onClick={() => setPaperStock('uncoated')}
                  id="paper-stock-uncoated-btn"
                  title="Uncoated matte stock (simulates paper absorption)"
                >
                  Uncoated
                </button>
              </div>

              <CopyButton
                textToCopy={safeCmykString}
                label="Copy CMYK"
                ariaLabel="Copy CMYK color string"
              />
            </div>
          </div>

          <div
            className={`swatch-box print-swatch ${paperStock === 'uncoated' ? 'uncoated-finish' : ''}`}
            style={{
              backgroundColor: `rgb(${effectiveCmykRgb.r}, ${effectiveCmykRgb.g}, ${effectiveCmykRgb.b})`,
            }}
            aria-label={`CMYK Print Preview swatch for ${safeCmykString} on ${paperStock} paper`}
          >
            {/* Press sheet registration crosshairs */}
            <span className="print-reg-mark top-left" aria-hidden="true" style={{ color: cmykContrastColor }}>⌖</span>
            <span className="print-reg-mark top-right" aria-hidden="true" style={{ color: cmykContrastColor }}>⌖</span>
            <span className="print-reg-mark bottom-left" aria-hidden="true" style={{ color: cmykContrastColor }}>⌖</span>
            <span className="print-reg-mark bottom-right" aria-hidden="true" style={{ color: cmykContrastColor }}>⌖</span>

            <div className="swatch-content" style={{ color: cmykContrastColor }}>
              <span className="swatch-category-tag">PROCESS INK OUTPUT</span>
              <span className="swatch-cmyk-main">{safeCmykString}</span>

              {/* 4 distinct CMYK ink plates */}
              <div className="preview-ink-chips" aria-label="CMYK Ink Plates Breakdown">
                <span className="ink-chip c-chip" title="Cyan ink percentage">
                  <span className="ink-dot c-dot" />
                  <span>C {safeCmykFormatted.c}</span>
                </span>
                <span className="ink-chip m-chip" title="Magenta ink percentage">
                  <span className="ink-dot m-dot" />
                  <span>M {safeCmykFormatted.m}</span>
                </span>
                <span className="ink-chip y-chip" title="Yellow ink percentage">
                  <span className="ink-dot y-dot" />
                  <span>Y {safeCmykFormatted.y}</span>
                </span>
                <span className="ink-chip k-chip" title="Key / Black ink percentage">
                  <span className="ink-dot k-dot" />
                  <span>K {safeCmykFormatted.k}</span>
                </span>
              </div>

              <span className="print-equiv-note">
                Equiv. RGB: {`rgb(${effectiveCmykRgb.r}, ${effectiveCmykRgb.g}, ${effectiveCmykRgb.b})`}
              </span>
            </div>
          </div>

          <div className="preview-footer">
            <div className="footer-spec-row">
              <span className="preview-footer-label">
                {paperStock === 'coated' ? 'Coated Paper Press Simulation' : 'Uncoated (Matte) Simulation'}
              </span>
              <span className="footer-spec-badge print-badge">
                {paperStock === 'coated' ? 'Glossy Stock' : 'Matte Stock (Absorbent)'}
              </span>
            </div>
            <span className="preview-footer-sub">
              {paperStock === 'coated'
                ? 'Standard four-color process inks. Mathematical CMYK conversion.'
                : 'Simulates ink absorbing into porous paper fibers, softening saturation.'}
            </span>
          </div>
        </div>
      </div>

      {/* Educational Banner */}
      <div className="preview-comparison-banner" id="preview-comparison-banner">
        <div className="comparison-banner-icon" aria-hidden="true">💡</div>
        <div className="comparison-banner-content">
          <span className="comparison-banner-title">Why do Digital Screen and Physical Print differ?</span>
          <p className="comparison-banner-text">
            <strong>Screens</strong> emit light directly to your eyes using Red, Green, and Blue pixels (additive color).
            In contrast, <strong>commercial printing presses</strong> layer Cyan, Magenta, Yellow, and Black inks on paper (subtractive color) which absorb ambient light.
            Use the <em>Coated / Uncoated</em> toggle above to preview how porous paper stock softens ink saturation.
          </p>
        </div>
      </div>
    </section>
  );
}

export default ColorPreview;

