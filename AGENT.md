# AGENT.md — RGB to CMYK Color Converter Implementation Agent

## 1. Mission

You are the implementation agent for the RGB → CMYK Color Converter project.

Your job is to take the requirements defined in `PRD.md`, inspect the existing repository, implement the complete application, install only necessary dependencies, test the result, fix issues, and leave the repository in a runnable state.

When this file is executed or referenced by an agent, the agent must treat `PRD.md` as the product specification and this file as the engineering execution procedure.

Do not merely describe what should be built.

Actually inspect, implement, test, and validate the project.

---

# 2. Source of Truth

Read:

```text
PRD.md
```

before implementing.

The PRD defines:

- Product behavior
- UI requirements
- Color-conversion formulas
- Accuracy requirements
- Component architecture
- Validation
- Accessibility
- Testing
- Definition of Done

If a requirement in the PRD conflicts with an existing implementation, preserve working project conventions where possible while ensuring the final implementation satisfies the PRD.

If a critical ambiguity exists, make the smallest reasonable engineering decision and document it.

Do not invent unrelated product features.

---

# 3. Execution Mode

When instructed to execute this agent:

1. Inspect the repository.
2. Determine the existing framework and package manager.
3. Read the PRD.
4. Inspect existing source code and configuration.
5. Reuse existing project structure where reasonable.
6. Determine missing dependencies.
7. Install only required dependencies.
8. Implement the color engine first.
9. Add automated tests.
10. Implement UI components.
11. Connect state and conversion logic.
12. Implement validation and clipboard behavior.
13. Implement responsive styling.
14. Run tests.
15. Run lint/type checks if available.
16. Run production build.
17. Fix all issues found.
18. Perform final requirement verification.
19. Report what was implemented and any remaining limitations.

Do not stop after creating a partial UI.

---

# 4. Repository Inspection

Before modifying files, inspect:

```text
package.json
package-lock.json
pnpm-lock.yaml
yarn.lock
bun.lockb
tsconfig.json
vite.config.*
next.config.*
src/
app/
pages/
components/
```

depending on what exists.

Determine:

- Framework
- Language
- Package manager
- Existing UI system
- Existing CSS solution
- Existing testing framework
- Existing linting
- Existing formatting
- Existing component conventions

Do not replace the framework unless the project is clearly empty and the PRD requires a new application.

---

# 5. Package Manager Rule

Use the package manager already established by the repository.

Examples:

```text
package-lock.json → npm
pnpm-lock.yaml    → pnpm
yarn.lock         → yarn
bun.lockb         → bun
```

If the repository is empty and `package.json` does not establish a package manager, use npm unless project instructions specify otherwise.

Never install packages with a different package manager just because it is more convenient.

---

# 6. Dependency Policy

Before installing a dependency:

1. Check whether the required capability already exists.
2. Check `package.json`.
3. Check existing source code.
4. Prefer built-in browser APIs where practical.
5. Prefer small, maintained libraries.
6. Avoid duplicate libraries with overlapping responsibilities.
7. Avoid unnecessary UI frameworks.

A color picker library may be installed if the project does not already have a suitable picker.

The library should:

- Be maintained.
- Work with the current framework.
- Support mouse and touch.
- Provide a suitable color-wheel interface.
- Have a permissive license suitable for the project.

Do not add a dependency merely to perform simple RGB/HEX calculations.

---

# 7. Implementation Order

Follow this order.

## Phase 1 — Color Engine

Implement pure utility functions:

```text
rgbToCmyk
cmykToRgb
rgbToHex
hexToRgb
normalizeRgb
normalizeCmyk
normalizeHex
formatCmyk
```

Use explicit types.

Do not place conversion formulas directly inside React components.

---

## Phase 2 — Types

Create a dedicated color type module.

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

Adapt naming to existing project conventions if necessary.

Do not use `any` for color state.

---

# 8. RGB → CMYK Implementation

Use the PRD's exact mathematical formula.

Normalize RGB:

```text
r = R / 255
g = G / 255
b = B / 255
```

Calculate:

```text
K = 1 - max(r, g, b)
```

If K is 1:

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

Return percentages:

```text
C × 100
M × 100
Y × 100
K × 100
```

Do not round intermediate calculations.

Only format/round for display.

Protect against floating-point artifacts such as:

```text
-0
100.00000000001
```

Use a consistent formatting utility.

---

# 9. CMYK → RGB Implementation

If CMYK-to-RGB functionality is implemented, use:

```text
R = 255 × (1 - C) × (1 - K)
G = 255 × (1 - M) × (1 - K)
B = 255 × (1 - Y) × (1 - K)
```

where C/M/Y/K are normalized to 0–1.

Clamp final RGB values to:

```text
0–255
```

Round RGB output to integers.

---

# 10. HEX Implementation

`rgbToHex` must:

- Clamp channels to 0–255.
- Round to integer.
- Convert each channel to exactly two hexadecimal digits.
- Produce six-digit HEX.
- Include `#`.

Example:

```text
RGB(4, 174, 218)
→ #04AEDA
```

`hexToRgb` must support:

```text
#RGB
#RRGGBB
```

Normalize shorthand:

```text
#ABC
→ #AABBCC
```

Invalid HEX must produce a controlled validation result rather than crashing.

---

# 11. Canonical State Architecture

Use RGB as the canonical internal color representation unless there is a strong reason to choose another normalized model.

Recommended data flow:

```text
Color Picker
     ↓
RGB
     ↓
 ┌───┴────┐
 ↓        ↓
HEX     CMYK
 ↓        ↓
UI       UI
```

Do not maintain separate uncontrolled states for RGB, HEX, and CMYK if that can create synchronization bugs.

If manual inputs are supported:

```text
Input
 ↓
Validate
 ↓
Normalize
 ↓
Canonical RGB
 ↓
Derive HEX + CMYK
```

Invalid input must not overwrite the last valid color.

---

# 12. Component Architecture

Keep components small and responsibility-focused.

Recommended:

```text
src/
├── components/
│   ├── ColorPicker/
│   ├── ColorValueCard/
│   ├── ColorPreview/
│   ├── HexInput/
│   ├── RgbInput/
│   ├── CmykDisplay/
│   ├── CopyButton/
│   └── layout/
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
├── types/
│   └── color.ts
├── constants/
│   └── color.ts
└── App/page entry
```

Do not blindly copy this structure if the repository already has a well-established architecture.

The important requirement is separation of concerns.

---

# 13. Color Picker

Implement a prominent color wheel.

The picker must:

- Work with mouse.
- Work with touch.
- Show selected position.
- Update color immediately.
- Work responsively.
- Not break keyboard accessibility.

If the selected library has its own color model, convert its output into the application's canonical RGB model at the boundary.

Do not allow the library's internal color model to leak throughout the application.

---

# 14. UI Implementation

Build a polished production-quality UI.

Required areas:

## Header

Include:

```text
RGB → CMYK Color Converter
```

and a short description such as:

```text
Pick a color and instantly see its HEX, RGB, and CMYK values.
```

Do not overpopulate the header.

## Main workspace

Desktop:

- Color picker on one side.
- Color values/details on the other side.

Mobile:

- Stack vertically.

## Color values

Show:

```text
HEX
#04AEDA
[Copy]

RGB
R 4
G 174
B 218
[Copy]

CMYK
C 98%
M 20%
Y 0%
K 15%
[Copy]
```

Exact layout can vary.

## Previews

Show two prominent cards:

```text
RGB / Screen
[ COLOR ]

CMYK Derived
[ COLOR ]
```

Clearly distinguish the previews.

---

# 15. Preview Accuracy

Do not falsely claim physical CMYK proofing.

The application is a browser application.

For the CMYK preview:

1. Calculate CMYK from RGB.
2. If a visual CMYK-derived swatch is required, convert the CMYK values back to RGB using the documented mathematical inverse.
3. Render that RGB result in the browser.

Label it appropriately if needed:

```text
CMYK Derived Preview
```

Do not label it:

```text
Printer Accurate Preview
```

unless an actual ICC profile/color-management implementation exists.

---

# 16. Copy Button

Create a reusable `CopyButton`.

Behavior:

```text
Default:
Copy

After success:
Copied!
```

Feedback should automatically return to normal after a short interval.

Use:

```js
navigator.clipboard.writeText(...)
```

where supported.

Handle errors without crashing.

Use accessible labels such as:

```text
Copy HEX value
Copy RGB value
Copy CMYK value
```

---

# 17. Manual Inputs

If the repository/design allows manual editing, implement:

### HEX

```text
#04AEDA
```

### RGB

```text
R [4]
G [174]
B [218]
```

The user should be able to change RGB and immediately update:

- HEX
- CMYK
- Previews
- Picker position

Do not implement CMYK editing unless it can be synchronized reliably.

If CMYK is read-only, style it clearly as a derived value.

---

# 18. Validation Rules

RGB:

```text
0 <= channel <= 255
```

CMYK:

```text
0 <= channel <= 100
```

HEX:

```text
#RGB
#RRGGBB
```

Invalid values must:

- Show a useful error state.
- Not crash.
- Not corrupt the canonical color.
- Not create NaN values.

Always clamp values when appropriate at the utility boundary, but do not hide obvious invalid user input where validation feedback is expected.

---

# 19. Testing

Add tests before final validation.

At minimum test:

```text
RGB(255,255,255) → CMYK(0,0,0,0)
RGB(0,0,0)       → CMYK(0,0,0,100)
RGB(255,0,0)     → CMYK(0,100,100,0)
RGB(0,255,0)     → CMYK(100,0,100,0)
RGB(0,0,255)     → CMYK(100,100,0,0)
RGB(255,255,0)   → CMYK(0,0,100,0)
RGB(0,255,255)   → CMYK(100,0,0,0)
RGB(255,0,255)   → CMYK(0,100,0,0)
```

Also test:

```text
RGB → HEX
HEX → RGB
CMYK → RGB
```

Test grayscale:

```text
RGB(128,128,128)
```

Test near-boundaries:

```text
RGB(1,1,1)
RGB(254,254,254)
```

Test HEX:

```text
#ABC
#AABBCC
```

Test invalid values.

For round trips, use a documented tolerance because floating-point and percentage rounding are expected.

---

# 20. Testing Commands

Inspect `package.json` first.

Use the repository's existing commands.

Typical examples:

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

Do not assume all commands exist.

Run only commands supported by the repository.

If no test framework exists and the project is expected to have tests, install a lightweight appropriate testing setup only when necessary.

---

# 21. Build Validation

Before finishing, ensure:

```text
No TypeScript errors
No build errors
No obvious runtime errors
No broken imports
No unused critical dependencies
```

Run the production build.

If the build fails:

1. Read the actual error.
2. Fix the underlying issue.
3. Re-run the build.
4. Repeat until successful.

Do not hide errors by weakening TypeScript configuration.

Do not disable lint rules globally merely to make the project pass.

---

# 22. Responsive QA

Check at least conceptually against:

```text
Desktop: 1440px
Laptop: 1024px
Tablet: 768px
Mobile: 390px
Small mobile: 320px
```

Ensure:

- No horizontal overflow.
- Color wheel remains usable.
- Inputs remain accessible.
- Preview cards fit the viewport.
- Buttons are tappable.
- Text does not overlap.
- No important content disappears.

---

# 23. Accessibility QA

Verify:

- Inputs have labels.
- Buttons have accessible names.
- Keyboard focus is visible.
- Interactive controls can be reached with Tab.
- Copy buttons are keyboard accessible.
- Color picker has an alternative accessible input/control.
- Error messages are understandable.
- Color is not the only method of communicating state.

Do not rely exclusively on visual color indicators.

---

# 24. Code Quality Rules

Write maintainable code.

Prefer:

```text
small components
pure functions
explicit types
single responsibility
clear naming
```

Avoid:

```text
giant components
duplicate conversion formulas
any
magic numbers scattered through UI code
business logic in JSX
unnecessary global state
unnecessary abstractions
```

Do not create abstractions that have no practical value.

---

# 25. Security / Browser Safety

Do not use:

- `eval`
- dynamic code execution
- unsafe HTML injection
- unnecessary third-party scripts

User-entered color values must be validated before use.

Do not generate CSS using unsanitized arbitrary strings.

---

# 26. Performance Rules

During color-wheel dragging:

- Avoid expensive computations.
- Avoid unnecessary component-wide state updates.
- Keep conversion functions synchronous and lightweight.
- Avoid rendering large component trees unnecessarily.

Do not prematurely optimize with complex state libraries.

Measure only if a real performance issue exists.

---

# 27. Documentation

If the repository lacks useful documentation, add or update a README with:

```text
Project overview
Installation
Development command
Test command
Build command
Color conversion method
Known limitation regarding physical CMYK/ICC proofing
```

Keep documentation concise and accurate.

---

# 28. Final Verification Checklist

Before declaring completion, verify every item:

## Product

- [ ] Color picker exists.
- [ ] User can select a color.
- [ ] HEX is displayed.
- [ ] RGB is displayed.
- [ ] CMYK is displayed.
- [ ] RGB preview exists.
- [ ] CMYK-derived preview exists.
- [ ] All values synchronize.
- [ ] Copy actions work.

## Accuracy

- [ ] RGB → CMYK formula matches PRD.
- [ ] No intermediate rounding.
- [ ] Black edge case works.
- [ ] White edge case works.
- [ ] Primary colors match expected results.
- [ ] HEX conversion is correct.
- [ ] CMYK values are correctly formatted.

## Engineering

- [ ] Conversion logic is modular.
- [ ] Conversion utilities are pure.
- [ ] Types are explicit.
- [ ] UI is componentized.
- [ ] No unnecessary dependencies.
- [ ] Existing project conventions are respected.

## UX

- [ ] Responsive.
- [ ] Mobile-friendly.
- [ ] Keyboard accessible.
- [ ] Copy feedback works.
- [ ] Validation is clear.
- [ ] No horizontal overflow.

## Quality

- [ ] Unit tests pass.
- [ ] Lint passes if configured.
- [ ] Type check passes if configured.
- [ ] Production build passes.
- [ ] No known runtime errors.

---

# 29. Failure Handling

If a requirement cannot be implemented exactly because of browser limitations or a third-party library limitation:

1. Do not fake the behavior.
2. Implement the closest technically correct behavior.
3. Document the limitation.
4. Keep the architecture ready for future improvement.

Example:

Physical CMYK preview cannot be accurately represented in a normal browser without color profiles.

Correct response:

```text
Use mathematical CMYK conversion and an explicitly labeled CMYK-derived RGB preview.
```

Incorrect response:

```text
Claim the browser preview is printer-proof accurate.
```

---

# 30. Final Output

When implementation is complete, provide a concise final report containing:

```text
Implementation complete.

Implemented:
- ...
- ...
- ...

Dependencies added:
- ...

Tests:
- ...

Build:
- Passed / Failed

Notes:
- ...
```

If something remains incomplete, state exactly what remains and why.

Do not claim success if the build or tests are failing.

---

# 31. Agent Command Principle

When the user tells the agent to execute `AGENT.md`, the agent should treat the command as an instruction to perform the complete workflow:

```text
Read AGENT.md
    ↓
Read PRD.md
    ↓
Inspect repository
    ↓
Install required dependencies
    ↓
Implement color engine
    ↓
Implement modular UI
    ↓
Implement validation/copy/accessibility
    ↓
Write tests
    ↓
Run tests
    ↓
Run lint/typecheck
    ↓
Run production build
    ↓
Fix failures
    ↓
Verify Definition of Done
    ↓
Report completion
```

Do not stop after planning.

Do not ask for confirmation for routine dependency installation or implementation decisions unless the repository is blocked by a genuinely ambiguous or destructive choice.

Do not overwrite unrelated project functionality.

Protect existing working features while implementing the PRD.
