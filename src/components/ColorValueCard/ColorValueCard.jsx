import HexInput from '../ColorInput/HexInput.jsx';
import RgbInput from '../ColorInput/RgbInput.jsx';
import CmykDisplay from '../ColorInput/CmykDisplay.jsx';

/**
 * ColorValueCard grouping HEX, RGB, and CMYK cards
 */
export function ColorValueCard({
  hex,
  rgb,
  cmyk,
  rgbString,
  cmykString,
  cmykFormatted,
  onCommitHex,
  onChangeRgbChannel,
}) {
  return (
    <div className="color-values-container" aria-label="Color Values and Controls">
      <HexInput hex={hex} onCommitHex={onCommitHex} />

      <RgbInput
        rgb={rgb}
        rgbString={rgbString}
        onChangeChannel={onChangeRgbChannel}
      />

      <CmykDisplay
        cmyk={cmyk}
        cmykFormatted={cmykFormatted}
        cmykString={cmykString}
      />
    </div>
  );
}

export default ColorValueCard;
