import { useMemo } from 'react';
import { hsvToRgb, rgbToHex } from '../../utils/color/index.js';

/**
 * Value / Brightness Slider component
 */
export function ValueSlider({ hsv, onChange }) {
  // Compute color at 100% brightness for gradient background
  const fullBrightnessHex = useMemo(() => {
    const fullRgb = hsvToRgb({ h: hsv.h, s: hsv.s, v: 100 });
    return rgbToHex(fullRgb);
  }, [hsv.h, hsv.s]);

  const handleChange = (e) => {
    const v = Number.parseInt(e.target.value, 10);
    onChange({ ...hsv, v });
  };

  return (
    <div className="value-slider-container">
      <div className="slider-header">
        <label htmlFor="brightness-slider" className="slider-label">
          Brightness (Value)
        </label>
        <span className="slider-value">{hsv.v}%</span>
      </div>
      <div className="slider-track-wrapper">
        <div
          className="slider-track-gradient"
          style={{
            background: `linear-gradient(to right, #000000, ${fullBrightnessHex})`,
          }}
        />
        <input
          id="brightness-slider"
          type="range"
          min="0"
          max="100"
          value={hsv.v}
          onChange={handleChange}
          className="value-range-input"
          aria-label="Adjust color brightness"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={hsv.v}
        />
      </div>
    </div>
  );
}

export default ValueSlider;
