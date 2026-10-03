# PRD — RGB to CMYK Color Converter

## 1. Product Overview

Build a polished, accurate, responsive web application that allows a user to select a color visually and immediately see the equivalent color values in:

- RGB
- HEX
- CMYK

The primary interaction is a color wheel/color picker. When the user selects or changes a color, all color values and previews update immediately.

The application must be designed as a reusable, maintainable codebase rather than a single large component.

### Core flow

1. User opens the color converter.
2. User selects a color using the color wheel/picker.
3. The selected color is rendered in a large preview.
4. The application displays:
   - HEX
   - RGB
   - CMYK
5. A CMYK preview is displayed beside the original RGB/screen-color preview.
6. Changing the color updates every value and preview instantly.
7. User can copy any value.
8. User can manually edit supported color values and see the rest of the application synchronize where technically appropriate.

---

# 2. Goals

## Primary Goals

- Provide an intuitive visual color-selection experience.
- Convert RGB to CMYK accurately and deterministically.
- Display HEX, RGB, and CMYK values clearly.
- Show side-by-side color previews.
- Make conversion behavior transparent and reliable.
- Use modular architecture so individual features can be maintained independently.
- Make the UI responsive for desktop, tablet, and mobile.
- Keep the implementation suitable for future expansion.

## Secondary Goals

- Provide copy-to-clipboard actions.
- Provide validation for manually entered values.
- Handle edge cases such as pure black, pure white, and grayscale colors correctly.
- Keep conversion logic independent from React/UI code.
- Make the color engine easy to unit test.

## Non-Goals

The initial version does NOT need:

- Full ICC color-management workflows.
- Printer-specific CMYK profiles.
- Pantone matching.
- Physical print simulation.
- Advanced image editing.
- Color history persistence.
- User accounts.
- Backend services.

---

# 3. Important Color Accuracy Requirement

The application must distinguish between mathematical RGB-to-CMYK conversion and physical print-color simulation.

For the default converter, use the standard normalized RGB-to-CMYK mathematical conversion.

Given:

- R, G, B in the range 0–255

Normalize:

```text
r = R / 255
g = G / 255
b = B / 255
```

Calculate:

```text
K = 1 - max(r, g, b)
```

If:

```text
K = 1
```

then:

```text
C = 0
M = 0
Y = 0
K = 1
```

Otherwise:

```text
C = (1 - r - K) / (1 - K)
M = (1 - g - K) / (1 - K)
Y = (1 - b - K) / (1 - K)
```

Convert each channel to percentage:

```text
C% = C × 100
M% = M × 100
Y% = Y × 100
K% = K × 100
```

Round only for display, not during intermediate calculations.

Recommended display precision:

- RGB: integer values
- HEX: 6-digit uppercase or lowercase consistently
- CMYK: 0–100%, preferably up to 2 decimal places

### Accuracy examples

The implementation should satisfy these known values:

```text
RGB(255, 255, 255)
HEX #FFFFFF
CMYK(0%, 0%, 0%, 0%)

RGB(0, 0, 0)
HEX #000000
CMYK(0%, 0%, 0%, 100%)

RGB(255, 0, 0)
HEX #FF0000
CMYK(0%, 100%, 100%, 0%)

RGB(0, 255, 0)
HEX #00FF00
CMYK(100%, 0%, 100%, 0%)

RGB(0, 0, 255)
HEX #0000FF
CMYK(100%, 100%, 0%, 0%)

RGB(255, 255, 0)
HEX #FFFF00
CMYK(0%, 0%, 100%, 0%)

RGB(0, 255, 255)
HEX #00FFFF
CMYK(100%, 0%, 0%, 0%)

RGB(255, 0, 255)
HEX #FF00FF
CMYK(0%, 100%, 0%, 0%)
```

Important: CMYK percentages are mathematical conversion values. The browser's RGB display cannot reproduce the physical behavior of every printer or CMYK profile. Do not claim that the preview is an ICC-accurate proof unless an actual color-management/profile system is implemented.

---

# 4. Target Users

Primary users:

- Web designers
- UI/UX designers
- Graphic designers
- Developers
- Students learning color systems
- Digital marketers
- Anyone needing RGB/HEX/CMYK conversions

---

# 5. User Stories

## Color Selection

- As a user, I want to select a color from a color wheel so that I can visually choose a color.
- As a user, I want to adjust saturation/value/lightness controls if supported by the selected picker library.
- As a user, I want the selected color to update immediately.

## Color Information

- As a user, I want to see the HEX value.
- As a user, I want to see the RGB value.
- As a user, I want to see the CMYK value.
- As a user, I want values to remain synchronized.

## Preview

- As a user, I want to see a large preview of my selected RGB/screen color.
- As a user, I want to see a separate CMYK preview.
- As a user, I want to visually compare both previews.

## Copy

- As a user, I want to copy HEX with one click.
- As a user, I want to copy RGB with one click.
- As a user, I want to copy CMYK with one click.
- I want clear feedback after copying.

## Manual Input

- As a user, I want to enter a HEX color manually.
- As a user, I want to edit RGB channels.
- As a user, I want invalid values to be rejected or corrected clearly.
- As a user, I want the color picker to update after manual input.

---

# 6. Functional Requirements

## FR-01 — Color Picker

Provide a prominent color wheel or equivalent visual color picker.

Requirements:

- Must support mouse interaction.
- Must support touch interaction.
- Must provide a visible selection indicator.
- Must update continuously or immediately while dragging.
- Must expose the resulting RGB/HEX value.
- Must remain usable on mobile screens.

If a third-party color picker library is used, choose a maintained library with a permissive license and good React support.

Do not unnecessarily reinvent a complex color wheel if a reliable library can provide it.

---

## FR-02 — HEX Display

Display:

```text
HEX
#04AEDA
```

Requirements:

- Always display a valid 6-digit hexadecimal value.
- Use a consistent casing.
- Include `#`.
- Provide a copy button.
- Manual HEX input should validate:
  - `#RGB`
  - `#RRGGBB`
- Normalize shorthand HEX into 6-digit HEX internally.

---

## FR-03 — RGB Display

Display:

```text
RGB
4, 174, 218
```

or clearly separated channels:

```text
R  4
G  174
B  218
```

Requirements:

- Values must be integers from 0 to 255.
- Provide copy functionality.
- Inputs must validate numeric ranges.
- Updating RGB must update HEX and CMYK.

---

## FR-04 — CMYK Display

Display:

```text
CMYK
98%, 20%, 0%, 15%
```

Prefer separate fields:

```text
C   98%
M   20%
Y   0%
K   15%
```

Requirements:

- Values range from 0 to 100.
- Display up to 2 decimal places where required.
- Remove unnecessary trailing zeros.
- Provide copy functionality.
- CMYK is derived from RGB by the documented mathematical conversion.

### CMYK-to-RGB input

CMYK editing is optional for v1.

If implemented, use the inverse mathematical model:

```text
R = 255 × (1 - C) × (1 - K)
G = 255 × (1 - M) × (1 - K)
B = 255 × (1 - Y) × (1 - K)
```

where C/M/Y/K are normalized 0–1 values.

If CMYK is display-only in v1, clearly make it read-only rather than presenting misleading editable controls.

---

# 7. Preview Requirements

The application must include two visually distinct preview panels.

## Preview A — RGB / Screen Preview

Show the selected RGB color as a large swatch.

Include:

- Color sample
- HEX label
- RGB label
- Optional contrast-aware foreground text

## Preview B — CMYK Preview

Show a separate preview labeled:

```text
CMYK Preview
```

This preview should be generated from the converted CMYK values.

Important implementation note:

Because browsers fundamentally render display colors through RGB/color-managed display pipelines, a mathematical CMYK value cannot be physically previewed as CMYK without a color-management/profile workflow.

For v1, convert the CMYK values back through the defined mathematical model to obtain an RGB swatch. Clearly label this as a CMYK-derived preview if necessary.

Do not imply printer-proof accuracy.

---

# 8. UI / UX Requirements

## Visual Direction

The interface should feel:

- Modern
- Minimal
- Professional
- Design-tool inspired
- Clean
- Responsive
- Fast

Avoid:

- Excessive gradients
- Unnecessary animations
- Clutter
- Tiny controls
- Large empty spaces without purpose

## Suggested Layout

Desktop:

```text
----------------------------------------------------
|                  RGB → CMYK                       |
|      Select a color and convert instantly        |
----------------------------------------------------

|                 |                                 |
|   Color Wheel   |       Selected Color            |
|                 |       #04AEDA                    |
|                 |       RGB(...)                  |
|                 |       CMYK(...)                 |
|                 |                                 |
----------------------------------------------------

|              PREVIEWS                             |
|                                                  |
|  RGB / SCREEN             CMYK DERIVED            |
|  [ large swatch ]         [ large swatch ]        |
|                                                  |
----------------------------------------------------
```

A compact color information card can sit beside or below the picker depending on viewport width.

## Responsive Behavior

Desktop:

- Two-column main workspace.
- Preview cards displayed side-by-side.

Tablet:

- Main workspace may remain two-column if width allows.
- Previews can stack.

Mobile:

- Single-column layout.
- Picker should fit viewport width.
- Preview cards stack vertically.
- Copy buttons must remain easy to tap.

Minimum touch target recommendation:

```text
44 × 44 px
```

---

# 9. Component Architecture

Use modular components.

Suggested structure:

```text
src/
├── components/
│   ├── ColorPicker/
│   │   ├── ColorPicker.tsx
│   │   └── index.ts
│   ├── ColorValueCard/
│   │   ├── ColorValueCard.tsx
│   │   └── index.ts
│   ├── ColorInput/
│   │   ├── HexInput.tsx
│   │   ├── RgbInput.tsx
│   │   └── CmykDisplay.tsx
│   ├── ColorPreview/
│   │   ├── ColorPreview.tsx
│   │   └── index.ts
│   ├── CopyButton/
│   │   ├── CopyButton.tsx
│   │   └── index.ts
│   └── layout/
│       └── ...
├── hooks/
│   └── useColorConverter.ts
├── utils/
│   ├── color/
│   │   ├── rgbToCmyk.ts
│   │   ├── cmykToRgb.ts
│   │   ├── rgbToHex.ts
│   │   ├── hexToRgb.ts
│   │   ├── normalizeColor.ts
│   │   └── formatColor.ts
│   └── clipboard/
│       └── copyToClipboard.ts
├── types/
│   └── color.ts
├── constants/
│   └── color.ts
├── pages/
│   └── ColorConverterPage.tsx
└── App.tsx
```

The exact structure may be adapted to the chosen framework, but responsibilities must remain separated.

---

# 10. Data Model

Use explicit types.

Example:

```ts
export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface CMYKColor {
  c: number;
  m: number;
  y: number;
  k: number;
}

export interface ColorState {
  rgb: RGBColor;
  hex: string;
  cmyk: CMYKColor;
}
```

Do not use loosely typed objects such as:

```ts
any
```

for color state.

---

# 11. Color Utility Requirements

All conversion utilities must be pure functions.

Example:

```ts
rgbToCmyk(rgb: RGBColor): CMYKColor
```

should:

- Have no side effects.
- Not access React state.
- Not access the DOM.
- Not access browser APIs.
- Be independently testable.

Likewise:

```ts
rgbToHex(rgb)
hexToRgb(hex)
cmykToRgb(cmyk)
```

should remain independent utilities.

---

# 12. State Management

For a small application, local React state is preferred.

Avoid Redux or another global state library unless there is a real requirement.

Recommended source of truth:

```text
RGB
 ↓
HEX
CMYK
```

or use a normalized color state where RGB is the canonical internal representation.

Avoid storing multiple independently mutable representations unless synchronization is deliberately designed.

The preferred approach is:

```text
User input
   ↓
Normalize / validate
   ↓
Canonical RGB
   ↓
Derived HEX + CMYK
   ↓
UI
```

This avoids inconsistent values.

---

# 13. Copy to Clipboard

Each major value should have a copy action.

Examples:

```text
Copy HEX
Copy RGB
Copy CMYK
```

Use the browser Clipboard API where available.

After copying, provide short feedback:

```text
Copied!
```

Do not use intrusive alerts.

Handle clipboard failure gracefully.

---

# 14. Validation

## RGB

Allowed:

```text
0–255
```

Reject:

- NaN
- empty values where not allowed
- negative values
- values greater than 255

## CMYK

Allowed:

```text
0–100
```

## HEX

Accept:

```text
#RGB
#RRGGBB
```

Optionally accept values without `#`, then normalize them.

Invalid input should not corrupt the current valid color.

---

# 15. Accessibility

The application must meet practical WCAG accessibility expectations.

Requirements:

- Semantic HTML.
- Keyboard-accessible controls.
- Visible focus states.
- Labels for all inputs.
- Accessible names for icon-only buttons.
- Sufficient text contrast.
- Do not communicate state using color alone.
- Color picker must have an accessible fallback/input mechanism.
- Copy feedback should be accessible to screen readers where appropriate.

---

# 16. Performance

Requirements:

- No unnecessary re-renders during color dragging.
- Conversion functions should be extremely lightweight.
- Avoid expensive operations inside every pointer event.
- Use memoization only when useful; do not over-engineer.
- No unnecessary dependency additions.
- Application should load quickly.

If the color picker library emits high-frequency updates, keep conversion logic synchronous and lightweight.

---

# 17. Browser Support

Target current versions of:

- Chrome
- Edge
- Firefox
- Safari

Support modern mobile browsers as well.

Do not add legacy-browser polyfills unless required by the chosen stack.

---

# 18. Error Handling

The UI should never crash because of invalid color input.

Examples:

- Invalid HEX → show inline validation.
- Invalid RGB channel → show inline validation.
- Clipboard unavailable → show a non-blocking error.
- Color picker emits unexpected values → normalize before conversion.

Do not silently produce incorrect color values.

---

# 19. Testing Requirements

Write unit tests for color utilities.

Minimum tests:

### RGB → HEX

```text
0,0,0       → #000000
255,255,255 → #FFFFFF
255,0,0     → #FF0000
0,255,0     → #00FF00
0,0,255     → #0000FF
```

### RGB → CMYK

```text
255,255,255 → 0,0,0,0
0,0,0       → 0,0,0,100
255,0,0     → 0,100,100,0
0,255,0     → 100,0,100,0
0,0,255     → 100,100,0,0
```

### Round Trip

For representative RGB colors:

```text
RGB → CMYK → RGB
```

The resulting RGB values should be within an explicitly documented rounding tolerance.

Also test:

- Grayscale colors
- Near-black colors
- Near-white colors
- Random valid RGB values
- HEX shorthand parsing

---

# 20. Visual QA

After implementation, verify:

- Color picker works with mouse.
- Color picker works with touch.
- Values update immediately.
- HEX is correct.
- RGB is correct.
- CMYK is correct.
- Previews update.
- Copy buttons work.
- Mobile layout works.
- Keyboard interaction works.
- Invalid input does not break the application.

Take special care around:

```text
RGB(0,0,0)
RGB(255,255,255)
RGB(128,128,128)
RGB(1,1,1)
RGB(254,254,254)
```

---

# 21. Dependency Requirements

Before adding a package:

1. Check whether the current project already provides the capability.
2. Prefer existing dependencies.
3. If a color picker library is required, choose a mature and maintained library.
4. Avoid adding multiple libraries for overlapping functionality.
5. Install only necessary packages.

Potential categories:

- React color picker
- Utility/type libraries only if genuinely needed
- Testing library already used by the project

Do not add a heavy UI framework if the existing project does not need one.

---

# 22. Design Details

Suggested visual system:

- Background: neutral/light or dark depending on existing project theme.
- Cards: subtle border and radius.
- Typography: clean sans-serif.
- Main heading: strong hierarchy.
- Color values: monospace font can be used for technical values.
- Copy buttons: compact but accessible.
- Color previews: large enough to visually compare.

The selected color itself should remain the visual focus.

Avoid making the UI look like an admin dashboard.

---

# 23. Optional Enhancements

Only implement these if they do not compromise the core requirements:

- Recent colors.
- Color history.
- Random color button.
- Lock individual channels.
- Shareable color URL.
- Download swatch.
- HSL/HSV display.
- CSS variable output.
- Tailwind color output.

Do not let optional features delay or complicate v1.

---

# 24. Definition of Done

The project is complete when:

- [ ] Color wheel/picker is implemented.
- [ ] User can select colors visually.
- [ ] HEX is displayed accurately.
- [ ] RGB is displayed accurately.
- [ ] CMYK is mathematically accurate.
- [ ] RGB preview is shown.
- [ ] CMYK-derived preview is shown.
- [ ] Values update immediately.
- [ ] Copy buttons work.
- [ ] Input validation works.
- [ ] Mobile UI works.
- [ ] Keyboard/accessibility basics work.
- [ ] Color conversion utilities are modular.
- [ ] Color conversion tests pass.
- [ ] No TypeScript errors.
- [ ] No lint errors where linting is configured.
- [ ] Production build succeeds.
- [ ] No unnecessary dependencies were added.
- [ ] README contains setup/run instructions if the repository does not already have suitable documentation.

---

# 25. Final Engineering Principle

The most important architectural rule is:

> Keep color mathematics independent from UI.

The application should make it easy to replace the color-picker UI, redesign the interface, or add HSL/LAB/other color spaces without rewriting the conversion engine.
