# Hanzo desktop Dock icon visual parity

Reference: user-approved 2026-11-19 six-icon glossy monochrome macOS mockup.
Method: Hanzo UI-port skill from `hanzoai/dev/.agents/skills/ui/SKILL.md`.
The reference is a visual contract; all icon geometry and shell dimensions are shared.

## Design contract

- 1024×1024 canvas, 1008×1008 rounded tile; all icons use the same upper rim,
  gloss, and monochrome silver-metal ink.
- Primary glyphs are centered around x=512, independent of the brand mini-H.
- App: only the complete seven-path H (five body blocks and two shade slivers).
- Bot: wide visor with two properly proportioned, aligned eye slots; no antenna.
- Command: smoothly curved controller traced from the reference silhouette.
- Dev: equal, heavier chevrons, symmetrically laid out.
- IDE: thicker, visible frame, two text strokes, three header dots.
- Team: symmetric side heads with broader connected central body and curved shoulders.
- Every non-App tile has the unframed seven-path H in the lower-right corner;
  do not simplify it to five paths, omit its lower-right leg or add a badge border.

## Verification

`pnpm test` checks: canonical paths, exact generator ↔ checked-in SVG parity,
SVG filter/gradient namespacing, 32/64/128/256/512/1024 PNG rendering,
main glyph weight and centered footprint. Re-render and visually compare
all six against the reference before merging.

SVG geometry is intentionally vectorized and approximates the generative source.
The lighting/glow is not byte-for-byte identical to the raster reference.

## Team identity explorations (not selected)
Four previewable exported Team SVG variants share the same shell and complete H:
- `human-ai`: large human silhouette + smaller agent visor; two co-workers, visually distinct
- `connected-pair`: person + agent integrated into one continuous team base
- `nine-apps`: dense 3×3 launcher grid for the connected business suite
- `four-apps`: simpler 2×2 suite launcher with bigger, equal-weight tiles; clearer at small Dock sizes

`getHanzoTeamOptionSVG(option)` from `@hanzo/logo/apps` provides the exact source.
The build writes candidate SVGs/PNGs to `dist/apps/candidates` rather than replacing the
existing `hanzo-team.svg`, pending design selection.

## Bot eye spacing
The two horizontal visor openings are each 156 × 84 units. Their inside gap is
exactly 156 units, preserving equal one-eye spacing on the 1024px source canvas.
