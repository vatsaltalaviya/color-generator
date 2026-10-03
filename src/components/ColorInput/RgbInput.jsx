import CopyButton from '../CopyButton/CopyButton.jsx';
import { normalizeRgbChannel } from '../../utils/color/index.js';

/**
 * RgbInput component with interactive channel inputs and sliders
 */
export function RgbInput({ rgb, rgbString, onChangeChannel }) {
  const channels = [
    { key: 'r', label: 'R', name: 'Red', colorClass: 'channel-red' },
    { key: 'g', label: 'G', name: 'Green', colorClass: 'channel-green' },
    { key: 'b', label: 'B', name: 'Blue', colorClass: 'channel-blue' },
  ];

  const handleInputChange = (key, rawValue) => {
    if (rawValue === '') {
      onChangeChannel(key, 0);
      return;
    }
    const val = Number.parseInt(rawValue, 10);
    if (!Number.isNaN(val)) {
      onChangeChannel(key, normalizeRgbChannel(val));
    }
  };

  return (
    <div className="color-field-card" id="rgb-field-card">
      <div className="field-card-header">
        <div className="field-title-group">
          <span className="field-label">RGB</span>
          <span className="field-format">0 - 255 Integers</span>
        </div>
        <CopyButton
          textToCopy={rgbString}
          label="Copy"
          ariaLabel="Copy RGB value string"
        />
      </div>

      <div className="rgb-channels-grid">
        {channels.map(({ key, label, name, colorClass }) => (
          <div key={key} className={`rgb-channel-item ${colorClass}`}>
            <div className="channel-top">
              <label htmlFor={`rgb-input-${key}`} className="channel-badge">
                {label}
              </label>
              <input
                id={`rgb-input-${key}`}
                type="number"
                min="0"
                max="255"
                value={rgb[key]}
                onChange={(e) => handleInputChange(key, e.target.value)}
                className="rgb-number-input"
                aria-label={`${name} channel value (0 to 255)`}
              />
            </div>
            <input
              type="range"
              min="0"
              max="255"
              value={rgb[key]}
              onChange={(e) => handleInputChange(key, e.target.value)}
              className={`rgb-slider-input ${colorClass}-slider`}
              aria-label={`${name} channel slider`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default RgbInput;
