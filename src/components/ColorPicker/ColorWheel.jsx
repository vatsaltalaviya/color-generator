import { useRef, useCallback, useState } from 'react';
import ValueSlider from './ValueSlider.jsx';
import { rgbToHex, hexToRgb } from '../../utils/color/index.js';

/**
 * Interactive Hue-Saturation Color Wheel with Brightness Slider and Touch/Mouse support
 */
export function ColorWheel({ hsv, rgb, onChangeHsv, onSelectRgb }) {
  const wheelRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // Calculate handle position in percentages (0% to 100%)
  const angleRad = (hsv.h * Math.PI) / 180;
  // Radius percentage: center is 50%, edge is 50% * (s / 100)
  const radiusPct = (hsv.s / 100) * 50;
  const handleX = 50 + radiusPct * Math.cos(angleRad);
  const handleY = 50 + radiusPct * Math.sin(angleRad);

  const updateFromPointer = useCallback(
    (clientX, clientY) => {
      if (!wheelRef.current) return;
      const rect = wheelRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const radius = rect.width / 2;

      const dx = clientX - centerX;
      const dy = clientY - centerY;

      // Distance from center
      const dist = Math.sqrt(dx * dx + dy * dy);
      const sat = Math.min(100, Math.round((dist / radius) * 100));

      // Angle: 0 rad is at 3 o'clock (+X, dy=0), clockwise
      let angle = Math.atan2(dy, dx) * (180 / Math.PI);
      if (angle < 0) angle += 360;
      const hue = Math.round(angle) % 360;

      onChangeHsv({
        h: hue,
        s: sat,
        v: hsv.v,
      });
    },
    [hsv.v, onChangeHsv]
  );

  const handlePointerDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromPointer(e.clientX, e.clientY);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    updateFromPointer(e.clientX, e.clientY);
  };

  const handlePointerUp = (e) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Safe fallback
      }
    }
  };

  // Keyboard navigation for accessibility
  const handleKeyDown = (e) => {
    const step = e.shiftKey ? 10 : 2;
    let newH = hsv.h;
    let newS = hsv.s;
    let handled = false;

    switch (e.key) {
      case 'ArrowLeft':
        newH = (newH - step + 360) % 360;
        handled = true;
        break;
      case 'ArrowRight':
        newH = (newH + step) % 360;
        handled = true;
        break;
      case 'ArrowUp':
        newS = Math.min(100, newS + step);
        handled = true;
        break;
      case 'ArrowDown':
        newS = Math.max(0, newS - step);
        handled = true;
        break;
      case 'Home':
        newS = 100;
        handled = true;
        break;
      case 'End':
        newS = 0;
        handled = true;
        break;
      default:
        break;
    }

    if (handled) {
      e.preventDefault();
      onChangeHsv({ h: newH, s: newS, v: hsv.v });
    }
  };

  // Handle native color picker change for quick system picker
  const handleNativeColorChange = (e) => {
    const parsed = hexToRgb(e.target.value);
    if (parsed && onSelectRgb) {
      onSelectRgb(parsed);
    }
  };

  const currentHex = rgbToHex(rgb);

  return (
    <div className="color-wheel-wrapper">
      <div className="wheel-top-bar">
        <h3 className="wheel-heading">Color Wheel</h3>
        <label className="native-picker-badge" title="Open system color picker">
          <input
            type="color"
            value={currentHex}
            onChange={handleNativeColorChange}
            className="native-color-input"
            aria-label="System color picker"
          />
          <span className="native-picker-swatch" style={{ backgroundColor: currentHex }} />
          <span className="native-picker-text">Eyedropper</span>
        </label>
      </div>

      <div
        ref={wheelRef}
        className={`color-wheel-container ${isDragging ? 'dragging' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="slider"
        aria-label="Color wheel. Use Arrow keys to adjust hue and saturation."
        aria-valuemin="0"
        aria-valuemax="360"
        aria-valuenow={hsv.h}
        aria-valuetext={`Hue: ${hsv.h} degrees, Saturation: ${hsv.s} percent, Brightness: ${hsv.v} percent`}
      >
        {/* Conic Hue spectrum */}
        <div className="wheel-spectrum" />

        {/* Radial saturation gradient overlay (white center fading to transparent rim) */}
        <div className="wheel-saturation-overlay" />

        {/* Brightness dimming layer reflecting current Value */}
        <div
          className="wheel-value-overlay"
          style={{
            opacity: 1 - hsv.v / 100,
          }}
        />

        {/* Selection indicator handle */}
        <div
          className="wheel-handle"
          style={{
            left: `${handleX}%`,
            top: `${handleY}%`,
            backgroundColor: currentHex,
          }}
          aria-hidden="true"
        >
          <span className="handle-ring" />
        </div>
      </div>

      {/* Brightness / Value slider */}
      <ValueSlider hsv={hsv} onChange={onChangeHsv} />
    </div>
  );
}

export default ColorWheel;
