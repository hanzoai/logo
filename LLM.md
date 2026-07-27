# @hanzo/logo

Official Hanzo logo package. Provides SVG logos as inline strings, React components, and a build pipeline for generating favicons, Apple touch icons, dock icons, and menu bar assets. Published as `@hanzo/logo` (v1.0.5) on npm.

## How this ships

One way, and it runs on our own stack:

    push  ->  github.com/hanzoai/logo          (a mirror)
              .github/workflows/sync.yml        carries refs onward
      ->  git.hanzo.ai/hanzoai/logo             CANONICAL
              .hanzo/workflows/publish.yml      publishes @hanzo/logo to npm
              .hanzo/workflows/deploy.yml       builds ghcr.io/hanzoai/logo
      ->  hanzoai/universe crs/logo.yaml        names the tag that is live
      ->  hanzoai/operator                      reconciles the App
      ->  hanzoai/static behind hanzoai/ingress serves logo.hanzo.ai

**git.hanzo.ai is canonical; GitHub is a mirror.** `.github/workflows/` holds
exactly one file, `sync.yml`, and its only job is getting refs to the forge. Every
build, check and publish is a workflow under `.hanzo/workflows/`, which the forge
reads. `.hanzo/workflows` uses GitHub Actions syntax, so a workflow moves between
the two by changing directory and nothing else.

`publish.yml` is the SOLE publisher of `@hanzo/logo`. A `v*` tag triggers it, a
version already on the registry is skipped, and it needs `NPM_TOKEN` as a forge
secret — one name, the same one every other Hanzo repo uses. Two loose ends it
inherited and still has:

- its `test` job carries `continue-on-error: true` over `npm test` (typecheck +
  build), so a type error does not stop the publish. Hardening that gate belongs
  in its own change: flipping it here would let a pre-existing type error block
  every release the moment it lands.
- it dropped a `softprops/action-gh-release` step on the way over. That step wrote
  GitHub Releases, which the forge does not serve, and it ran AFTER a successful
  publish — so on the forge it would have turned a shipped package red.

### The site

`index.html` is the whole site: one self-contained page, inline CSS, no scripts
and no subresources. `Dockerfile` copies it into `ghcr.io/hanzoai/static` — no
build stage, because there is nothing to build. No GitHub Pages and no Cloudflare
Pages: the repo used to push this page to a `gh-pages` branch, Pages was never
configured for it, and `logo.hanzo.ai` has answered 404 from our own ingress ever
since.

A build never deploys itself. `deploy.yml` publishes
`ghcr.io/hanzoai/logo:<sha>`; a human then sets `spec.image.tag` in
`hanzoai/universe` `infra/k8s/operator/crs/logo.yaml` and adds `- logo.yaml` to
that directory's `kustomization.yaml`. The CR is inert until both are done, which
is deliberate: an App promoted with an empty tag takes the host down instead of
leaving it alone.

Order: publish an image -> set the tag -> add the line -> confirm the pod is
Running.

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
