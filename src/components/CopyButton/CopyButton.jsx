import { useState, useCallback, useEffect } from 'react';
import { copyToClipboard } from '../../utils/clipboard/copyToClipboard.js';

/**
 * Reusable CopyButton component with visual feedback and accessibility
 */
export function CopyButton({ textToCopy, label = 'Copy', ariaLabel, className = '' }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => {
      setCopied(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = useCallback(
    async (e) => {
      e.stopPropagation();
      const success = await copyToClipboard(textToCopy);
      if (success) {
        setCopied(true);
      }
    },
    [textToCopy]
  );

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`copy-button ${copied ? 'copied' : ''} ${className}`}
      aria-label={ariaLabel || label}
      title={copied ? 'Copied to clipboard!' : label}
    >
      {copied ? (
        <>
          <svg
            className="copy-icon"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Copied!</span>
        </>
      ) : (
        <>
          <svg
            className="copy-icon"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

export default CopyButton;
