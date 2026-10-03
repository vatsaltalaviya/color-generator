/**
 * Copies a string of text to the system clipboard
 * @param {string} text
 * @returns {Promise<boolean>} Resolves to true if copy succeeded, false otherwise
 */
export async function copyToClipboard(text) {
  if (typeof text !== 'string') {
    text = String(text ?? '');
  }

  // Modern navigator.clipboard API
  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to fallback
    }
  }

  // Fallback for older browsers or restricted iframe environments
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '-9999px';
    textArea.setAttribute('aria-hidden', 'true');
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch {
    return false;
  }
}
