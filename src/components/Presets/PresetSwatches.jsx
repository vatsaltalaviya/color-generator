import { COLOR_PRESETS } from '../../constants/color.js';

/**
 * PresetSwatches component providing quick access to edge cases and primary colors
 */
export function PresetSwatches({ currentHex, onSelectRgb }) {
  return (
    <div className="preset-swatches-section" aria-label="Color Presets">
      <div className="presets-header">
        <span className="presets-title">Quick Presets</span>
        <span className="presets-subtitle">Primaries & Edge Cases</span>
      </div>
      <div className="preset-grid" role="list">
        {COLOR_PRESETS.map((preset) => {
          const isSelected = currentHex.toUpperCase() === preset.hex.toUpperCase();
          return (
            <button
              key={preset.name}
              type="button"
              onClick={() => onSelectRgb(preset.rgb)}
              className={`preset-swatch-btn ${isSelected ? 'active' : ''}`}
              title={`${preset.name} (${preset.hex})`}
              aria-label={`Select ${preset.name}, hex ${preset.hex}`}
              aria-pressed={isSelected}
            >
              <span
                className="preset-swatch-color"
                style={{ backgroundColor: preset.hex }}
              />
              <span className="preset-name">{preset.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default PresetSwatches;
