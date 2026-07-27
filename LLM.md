# @hanzo/logo

Official Hanzo logo package. Provides SVG logos as inline strings, React components, and a build pipeline for generating favicons, Apple touch icons, dock icons, and menu bar assets. Published as `@hanzo/logo` (v1.0.5) on npm.

## Stack
- TypeScript 5, ESM-only output
- React (optional peer dep >= 16.8)
- sharp (image generation for favicons/icons)
- Exports: `.` (main), `./logos` (raw SVG getters), `./react` (React components)

## Structure
```
src/
  index.ts              # Re-exports logos, types, react
  logos.ts              # SVG string generators: getColorSVG, getMonoSVG, getWhiteSVG, getFaviconSVG
  types.ts              # LogoVariant (color|mono|white|favicon), LogoFormat, LogoOptions
  react.tsx             # HanzoLogo and HanzoFavicon React components
  generator.ts          # Image generation pipeline (PNG/ICO from SVG via sharp)
  build.ts              # CLI build script for generating all icon variants
  generate-showcase.ts  # Generates menu-bar-preview.html showcase
dist/
  *.svg                 # Pre-built SVG files (hanzo-logo.svg, hanzo-favicon.svg, etc.)
  apple/                # Apple touch icons
  dock/                 # macOS dock icons
  favicon/              # Multi-size favicons
  icons/                # General icon set
```

## Commands
```bash
make install        # npm install
make build          # Clean + compile TS + build CLI
make dev            # tsc --watch
make generate       # Build then run icon generator (outputs to dist/)
make preview        # Generate + open menu-bar-preview.html
make test           # typecheck + build
make publish        # clean, install, build, test, npm publish
make clean          # rm -rf dist node_modules package-lock.json
```

## Usage
```tsx
import { HanzoLogo } from '@hanzo/logo/react'
<HanzoLogo variant="color" size={64} />
<HanzoLogo variant="mono" size="2rem" />

import { getColorSVG, getFaviconSVG } from '@hanzo/logo/logos'
const svgString = getColorSVG()
```

## Notes
- Logo is the geometric H mark (white on transparent, 67x67 viewBox)
- Variants: color (white fill), mono (stroke), white (solid white), favicon (simplified)
- `ZooLogo` and `ZooFavicon` are exported as backwards-compatible aliases
- Makefile still has "Zoo Logo Generator" branding in help text -- needs updating
- `CLAUDE.md`, `AGENTS.md`, `QWEN.md`, `GEMINI.md` are all symlinks to this file
