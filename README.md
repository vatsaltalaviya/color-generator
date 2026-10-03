# RGB → CMYK Color Converter

A fast, accurate, responsive web application for visual color selection and mathematical conversion between **RGB**, **HEX**, and **CMYK** color models.

## Overview

- **Interactive Color Wheel**: Full circular Hue-Saturation picker with touch, mouse, and keyboard navigation.
- **Brightness / Value Slider**: Seamless 0–100% brightness control with dynamic gradient preview.
- **Synchronized Values**: Instant, real-time conversion across HEX, RGB, and CMYK formats.
- **Dual Swatch Previews**: Side-by-side comparison between the screen color (sRGB) and the mathematically derived CMYK inverse.
- **Channel Controls**: Individual R, G, B channel inputs and sliders with real-time numeric validation (0–255).
- **Derived CMYK Gauges**: Visual percentage meters for Cyan, Magenta, Yellow, and Key/Black.
- **One-Click Copy**: Built-in clipboard actions with temporary visual feedback.
- **Quick Edge-Case Presets**: Instant testing for pure primaries (Red, Green, Blue, Cyan, Magenta, Yellow), pure black, pure white, and grayscale.

---

## Getting Started

### Prerequisites

- Node.js >= 18 (Node 22 recommended)
- npm

### Installation

```bash
npm install
```

### Development Server

Start the local Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

### Running Unit Tests

Run the automated test suite powered by Node's native test runner:

```bash
npm test
```

### Code Quality & Linting

```bash
npm run lint
```

### Production Build

Create an optimized production bundle in `dist/`:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## Color Conversion Method

### Mathematical Model (RGB → CMYK)

Given RGB values $R, G, B \in [0, 255]$:

1. Normalize channels:
   $$r = \frac{R}{255}, \quad g = \frac{G}{255}, \quad b = \frac{B}{255}$$

2. Compute Key (Black) component:
   $$K = 1 - \max(r, g, b)$$

3. When $K = 1$ (pure black or $r = g = b = 0$):
   $$C = 0, \quad M = 0, \quad Y = 0, \quad K = 100\%$$

4. Otherwise ($K < 1$):
   $$C = \frac{1 - r - K}{1 - K}, \quad M = \frac{1 - g - K}{1 - K}, \quad Y = \frac{1 - b - K}{1 - K}$$

5. Express channels as percentages: $C \times 100, M \times 100, Y \times 100, K \times 100$.

All intermediate computations are unrounded and protected from floating-point anomalies (such as `-0` or values exceeding 100%). Values are cleanly formatted for display with up to 2 decimal places.

### Inverse Model (CMYK → RGB)

Given normalized percentages $c, m, y, k \in [0, 1]$:

$$R = \text{round}\big(255 \times (1 - c) \times (1 - k)\big)$$
$$G = \text{round}\big(255 \times (1 - m) \times (1 - k)\big)$$
$$B = \text{round}\big(255 \times (1 - y) \times (1 - k)\big)$$

---

## Color Accuracy & Limitations

- **Browser Display vs. Physical Print**: Web browsers render colors exclusively in RGB (sRGB / Display P3).
- **Mathematical Simulation**: The "CMYK Derived" preview renders the color produced by converting the CMYK values back to RGB using the inverse formula above.
- **Not an ICC Printer Proof**: This application uses standard normalized mathematical conversion. It does not load device-specific ICC profiles (such as SWOP, FOGRA, or GRACoL) and should not be used as a replacement for physical press proofs or RIP hardware color management.

---

## Architecture & Code Organization

```text
src/
├── components/
│   ├── ColorPicker/       # Interactive ColorWheel & ValueSlider
│   ├── ColorPreview/      # Dual Screen vs CMYK swatch comparison
│   ├── ColorValueCard/    # Container for HEX, RGB, and CMYK cards
│   ├── ColorInput/        # HexInput, RgbInput, CmykDisplay
│   ├── CopyButton/        # Reusable clipboard button with feedback
│   ├── Presets/           # Quick preset swatch buttons
│   └── layout/            # Header and Footer
├── constants/
│   └── color.js           # Color system defaults and presets
├── hooks/
│   └── useColorConverter.js # Canonical RGB state & derived properties
├── utils/
│   ├── color/             # Pure, modular conversion utilities
│   └── clipboard/         # Safe clipboard copy utility with fallback
└── __tests__/
    └── color.test.js      # Unit tests (edge cases, round trips, boundaries)
```
