# @hanzo/logo

Official Hanzo logo package. Provides SVG logos as inline strings, React components, a pure-CSS brand motion layer, and a build pipeline for generating favicons, Apple touch icons, dock icons, and menu bar assets. Published as `@hanzo/logo` on npm (patch-tag `vX.Y.Z` → CI publishes).

## Canon
The Hanzo mark is the **7-path shaded H** (67x67 viewBox): five body blocks + two
`class="shade"` accent slivers (#DDDDDD). `MARK_PATHS` in `src/logos.ts` is the one
source of the geometry — every variant (color/mono/white/menubar/animated/motion)
renders it. The flat 5-path H is only for tiny favicons (`getFaviconSVG`).

## Stack
- TypeScript 5, ESM-only output
- React (optional peer dep >= 16.8)
- sharp (image generation for favicons/icons)
- Exports: `.` (main), `./logos` (raw SVG getters), `./motion` (CSS motion layer), `./react` (React components)

## Structure
```
src/
  index.ts    # Re-exports logos, motion, types, react
  logos.ts    # MARK_PATHS + SVG generators: getColorSVG, getMonoSVG, getWhiteSVG,
              # getMenuBarSVG (currentColor), getFaviconSVG, getAnimatedSVG
  motion.ts   # MOTION_CSS + getMotionHTML/getMotionMarkup — intro flip + idle
              # breathing + wordmark collapse, pure CSS, reduced-motion-safe.
              # Framework-free strings for Svelte/Tamagui/plain HTML.
  animated.ts # ANIMATED_SVG — self-contained interactive mark (fold-in → hover
              # turn → press squash)
  types.ts    # LogoVariant (color|mono|white|favicon|animated), LogoFormat, LogoOptions
  react.tsx   # HanzoLogo (variant + `animated` motion-shell prop), HanzoFavicon
  build.ts    # CLI build script for generating all icon variants (brand-neutral,
              # reads package.json `brand`)
dist/         # Rendered assets (tracked): svg/, favicon/, apple/, dock/, icons/,
              # menubar/, slack/, showcase.html
```

## Commands
```bash
make install / build / dev / generate / test / publish / clean   # npm wrappers
npm run typecheck   # tsc --noEmit
npm run build       # clean + compile + build CLI + generate assets
```

## Usage
```tsx
import { HanzoLogo } from '@hanzo/logo/react'
<HanzoLogo size={64} />
<HanzoLogo animated />               // motion shell: flip + breathe + wordmark
<HanzoLogo animated wordmark="Lux" /> // white-label

import { getColorSVG, getAnimatedSVG } from '@hanzo/logo/logos'
import { MOTION_CSS, getMotionHTML } from '@hanzo/logo/motion' // Svelte/Tamagui
```

## Notes
- Variants: color (white fill + shade), mono (black fill + shade), white, menubar
  (currentColor), favicon (simplified 5-path for 16-64px), animated (interactive)
- Release: bump patch in package.json (+ lockfile via `npm install`), tag `vX.Y.Z`,
  push — `.github/workflows/publish-on-tag.yml` runs build + `npm publish`
- `CLAUDE.md`, `AGENTS.md`, `QWEN.md`, `GEMINI.md` are all symlinks to this file
