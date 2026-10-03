import CopyButton from '../CopyButton/CopyButton.jsx';

/**
 * CmykDisplay component showing derived CMYK channels with progress indicators
 */
export function CmykDisplay({ cmyk, cmykFormatted, cmykString }) {
  const channels = [
    { key: 'c', label: 'C', name: 'Cyan', colorClass: 'cmyk-cyan' },
    { key: 'm', label: 'M', name: 'Magenta', colorClass: 'cmyk-magenta' },
    { key: 'y', label: 'Y', name: 'Yellow', colorClass: 'cmyk-yellow' },
    { key: 'k', label: 'K', name: 'Key / Black', colorClass: 'cmyk-black' },
  ];

  return (
    <div className="color-field-card cmyk-card" id="cmyk-field-card">
      <div className="field-card-header">
        <div className="field-title-group">
          <span className="field-label">CMYK</span>
          <span className="field-format">Derived Mathematical Percentages</span>
        </div>
        <CopyButton
          textToCopy={cmykString}
          label="Copy"
          ariaLabel="Copy CMYK value string"
        />
      </div>

      <div className="cmyk-channels-grid">
        {channels.map(({ key, label, name, colorClass }) => {
          const percentVal = Math.max(0, Math.min(100, cmyk[key] || 0));
          const formattedStr = cmykFormatted[key];

          return (
            <div key={key} className={`cmyk-channel-item ${colorClass}`}>
              <div className="cmyk-channel-info">
                <div className="cmyk-label-wrap">
                  <span className="cmyk-channel-badge">{label}</span>
                  <span className="cmyk-channel-name">{name}</span>
                </div>
                <span className="cmyk-channel-val">{formattedStr}</span>
              </div>
              <div
                className="cmyk-gauge-track"
                role="progressbar"
                aria-valuenow={Math.round(percentVal)}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label={`${name} percentage`}
              >
                <div
                  className={`cmyk-gauge-fill ${colorClass}-fill`}
                  style={{ width: `${percentVal}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="cmyk-card-footer">
        <span className="cmyk-note-icon" aria-hidden="true">ℹ</span>
        <span>
          Subtractive ink model calculated from RGB. Intermediate math unrounded.
        </span>
      </div>
    </div>
  );
}

export default CmykDisplay;
