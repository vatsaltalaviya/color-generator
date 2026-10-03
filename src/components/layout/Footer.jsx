/**
 * Footer component with mathematical formula overview and technical notes
 */
export function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <div className="footer-card">
          <h4 className="footer-heading">Mathematical Model</h4>
          <p className="footer-text">
            Normalized RGB to CMYK: <code>K = 1 - max(r, g, b)</code>, and for <code>K &lt; 1</code>:{' '}
            <code>C = (1 - r - K) / (1 - K)</code>. Values calculated with full floating-point precision
            and rounded only for display.
          </p>
        </div>
        <div className="footer-card">
          <h4 className="footer-heading">Color Accuracy Notice</h4>
          <p className="footer-text">
            Browser screens render in RGB (sRGB). The CMYK preview uses the exact mathematical inverse
            formula. It does not replace physical print proofs or device-specific ICC press profiles.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
