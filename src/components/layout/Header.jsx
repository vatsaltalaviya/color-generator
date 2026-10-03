/**
 * Header component matching AGENT.md & PRD requirements
 */
export function Header() {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="header-logo-badge">
          <span className="logo-dot dot-r" />
          <span className="logo-dot dot-g" />
          <span className="logo-dot dot-b" />
          <span className="logo-arrow">→</span>
          <span className="logo-dot dot-c" />
          <span className="logo-dot dot-m" />
          <span className="logo-dot dot-y" />
          <span className="logo-dot dot-k" />
        </div>
        <h1 className="header-title">RGB → CMYK Color Converter</h1>
        <p className="header-subtitle">
          Pick a color and instantly see its HEX, RGB, and CMYK values.
        </p>
      </div>
    </header>
  );
}

export default Header;
