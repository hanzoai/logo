# @hanzo/logo

Official Hanzo logo package. Provides SVG logos as inline strings, React components, a pure-CSS brand motion layer, and a build pipeline for generating favicons, Apple touch icons, dock icons, and menu bar assets. Published as `@hanzo/logo` on npm (patch-tag `vX.Y.Z` → CI publishes).

## Canon
The Hanzo mark is the **7-path shaded H** (67x67 viewBox): five body blocks + two
`class="shade"` accent slivers (#DDDDDD). `MARK_PATHS` in `src/logos.ts` is the one
source of the geometry — every variant (color/mono/white/menubar/animated/motion)
renders it. The flat 5-path H is only for tiny favicons (`getFaviconSVG`).

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
