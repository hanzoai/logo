# @hanzo/logo

Official Hanzo logo package. Provides SVG logos as inline strings, React components, a pure-CSS brand motion layer, and a build pipeline for generating favicons, Apple touch icons, dock icons, and menu bar assets. Published as `@hanzo/logo` on npm (bump `version` on `main` → CI publishes).

## Canon
The Hanzo mark is the **7-path shaded H** (67x67 viewBox): five body blocks + two
`class="shade"` accent slivers (#DDDDDD). `MARK_PATHS` in `src/logos.ts` is the one
source of the geometry — every variant (color/mono/white/menubar/animated/motion)
renders it. The flat 5-path H is only for tiny favicons (`getFaviconSVG`).

## How this ships

One way, and it runs on our own stack:

    push  ->  github.com/hanzoai/logo          (a mirror)
      ->  git.hanzo.ai/hanzoai/logo             CANONICAL
              .hanzo/workflows/sync-from-github.yml  pulls the mirror, every 10m
              .hanzo/workflows/publish.yml      publishes @hanzo/logo to npm
              .hanzo/workflows/deploy.yml       builds ghcr.io/hanzoai/logo
      ->  hanzoai/universe crs/logo.yaml        names the tag that is live
      ->  hanzoai/operator                      reconciles the App
      ->  hanzoai/static behind hanzoai/ingress serves logo.hanzo.ai

**git.hanzo.ai is canonical; GitHub is a mirror.** `.github/workflows/` is empty.
Every build, check, publish and the sync itself lives under `.hanzo/workflows/`,
which the forge reads. It uses GitHub Actions syntax, so a workflow moves between
the two by changing directory and nothing else.

The sync is a PULL: the forge runner reaches both ends, so nothing needs a
credential aimed into the forge, and a public repo needs none at all. It
fast-forwards only — a divergence fails loudly instead of force-pushing a side.

`publish.yml` is the SOLE publisher of `@hanzo/logo`. It fires when `version` in
`package.json` changes on `main`, skips a version already on the registry, and
runs `pnpm test` first — typecheck, then build. The rendered images under `dist/`
are tracked but the compiled `dist/*.js` and `dist/*.d.ts` are gitignored, so
publishing without that build ships every icon and no entry point. Needs
`NPM_TOKEN` as a forge secret.

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
pnpm install        # install dev deps
pnpm typecheck      # tsc --noEmit
pnpm build          # clean + compile + build CLI + generate assets
pnpm test           # typecheck + build (the release gate)
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
- Release: bump the patch in `package.json`, merge to `main`. There is no tag.
- `CLAUDE.md`, `AGENTS.md`, `QWEN.md`, `GEMINI.md` are all symlinks to this file
