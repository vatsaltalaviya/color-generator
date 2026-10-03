import { useState } from 'react';
import CopyButton from '../CopyButton/CopyButton.jsx';
import { isValidHex } from '../../utils/color/index.js';

/**
 * HexInput with manual editing, validation, and copy functionality
 */
export function HexInput({ hex, onCommitHex }) {
  const [inputValue, setInputValue] = useState(hex);
  const [error, setError] = useState('');
  const [prevHex, setPrevHex] = useState(hex);

  // Synchronize input value with external hex changes during render
  if (prevHex !== hex) {
    setPrevHex(hex);
    setInputValue(hex);
    setError('');
  }

  const handleChange = (e) => {
    const val = e.target.value;
    setInputValue(val);

    if (val.trim() === '') {
      setError('HEX value cannot be empty');
      return;
    }

    if (isValidHex(val)) {
      setError('');
      onCommitHex(val);
    } else {
      setError('Use 3 or 6 hex characters (e.g. #04AEDA or #ABC)');
    }
  };

  const handleBlur = () => {
    // If invalid on blur, revert to current canonical hex
    if (!isValidHex(inputValue)) {
      setInputValue(hex);
      setError('');
    }
  };

  return (
    <div className="color-field-card" id="hex-field-card">
      <div className="field-card-header">
        <div className="field-title-group">
          <span className="field-label">HEX</span>
          <span className="field-format">Hexadecimal Code</span>
        </div>
        <CopyButton
          textToCopy={hex}
          label="Copy"
          ariaLabel="Copy HEX color code"
        />
      </div>

      <div className="hex-input-row">
        <div className={`input-affix-wrapper ${error ? 'has-error' : ''}`}>
          <span className="input-prefix">#</span>
          <input
            id="hex-input-field"
            type="text"
            value={inputValue.replace(/^#/, '')}
            onChange={(e) => handleChange({ target: { value: `#${e.target.value}` } })}
            onBlur={handleBlur}
            maxLength={7}
            className="hex-text-input"
            aria-label="Hex color value"
            aria-invalid={!!error}
            aria-describedby={error ? 'hex-error-msg' : undefined}
            spellCheck={false}
          />
        </div>
      </div>

      {error && (
        <p id="hex-error-msg" className="field-error-text" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default HexInput;
