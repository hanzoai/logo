# Hanzo Dock SVG visual parity

Reference: user-approved November 19, 2026 glossy six-icon mockup.
Method: hanzoai/dev .agents/skills/ui (visual parity by measurement).

- Shared 1024x1024 macOS tile geometry, monochrome chrome, metallic glyphs and optical centering.
- App is only the full seven-path canonical H.
- Bot capsule has no antenna; Command has a larger controller; Dev chevrons are expanded; IDE and Team graphics are centered.
- Other five apps have the *complete* borderless seven-path H in the lower-right.
- Source SVGs come from getHanzoAppIconSVG, preserving a single implementation.
- pnpm test checks exact source parity, all seven H paths, badge policy and 32/64/128/1024 Sharp rendering.

These vectors approximate the image-generated mockup; lighting/reflections are not pixel-identical.
