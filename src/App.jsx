import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import ColorWheel from './components/ColorPicker/ColorWheel.jsx';
import ColorValueCard from './components/ColorValueCard/ColorValueCard.jsx';
import ColorPreview from './components/ColorPreview/ColorPreview.jsx';
import PresetSwatches from './components/Presets/PresetSwatches.jsx';
import { useColorConverter } from './hooks/useColorConverter.js';
import './App.css';

export function App() {
  const {
    rgb,
    hex,
    cmyk,
    cmykDerivedRgb,
    hsv,
    cmykFormatted,
    cmykString,
    rgbString,
    setColorRgb,
    setColorRgbChannel,
    setColorHsv,
    setColorHex,
    resetToDefault,
  } = useColorConverter();

  return (
    <div className="app-container">
      <Header />

      <main className="main-content" id="main-content">
        <div className="workspace-container">
          {/* Left Column: Visual Color Picker & Presets */}
          <div className="workspace-left">
            <section className="card picker-card" aria-label="Visual Color Picker">
              <ColorWheel
                hsv={hsv}
                rgb={rgb}
                onChangeHsv={setColorHsv}
                onSelectRgb={setColorRgb}
              />
            </section>

            <PresetSwatches
              currentHex={hex}
              onSelectRgb={setColorRgb}
            />
          </div>

          {/* Right Column: Values & Manual Controls */}
          <div className="workspace-right">
            <div className="workspace-right-header">
              <h2 className="workspace-heading">Color Channels & Values</h2>
              <button
                type="button"
                onClick={resetToDefault}
                className="reset-btn"
                title="Reset to default cyan (#04AEDA)"
                aria-label="Reset color to default"
              >
                Reset Default
              </button>
            </div>

            <ColorValueCard
              hex={hex}
              rgb={rgb}
              cmyk={cmyk}
              rgbString={rgbString}
              cmykString={cmykString}
              cmykFormatted={cmykFormatted}
              onCommitHex={setColorHex}
              onChangeRgbChannel={setColorRgbChannel}
            />
          </div>
        </div>

        {/* Previews Section */}
        <ColorPreview
          rgb={rgb}
          cmykDerivedRgb={cmykDerivedRgb}
          hex={hex}
          cmyk={cmyk}
          cmykFormatted={cmykFormatted}
          cmykString={cmykString}
          rgbString={rgbString}
        />
      </main>

      <Footer />
    </div>
  );
}

export default App;