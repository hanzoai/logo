# @hanzo/logo

Official Hanzo logo package. Provides SVG logos as inline strings, React components, a pure-CSS brand motion layer, and a build pipeline for generating favicons, Apple touch icons, dock icons, and menu bar assets. Published as `@hanzo/logo` on npm (bump `version` on `main` → CI publishes).

## Canon
The Hanzo mark is the **7-path shaded H** (67x67 viewBox): five body blocks
(`MARK_BLOCKS`) + two `class="shade"` accent slivers (`MARK_SHADE`, #DDDDDD).
Those two arrays in `src/logos.ts` are the one source of the geometry — every
variant renders them, and `MARK_PATHS` is the pre-baked string built from them
for a caller that wants the markup whole. The flat 5-path H is only for tiny
favicons (`getFaviconSVG`).

**The unqualified answer inherits.** `getLogo({})`, `getLogoDataUrl()`,
`getLogoBase64()` and `<HanzoLogo>` with no variant all give the currentColor
mark, so a caller who names nothing gets one that is legible on any ground.
`color` is a named variant rather than the fall-through; it is white, and it
used to be what you got by naming nothing — invisible on a white page.

**A FILE is a different problem from the same mark inline.** An `<img>` gives an
SVG no parent to inherit from, so `currentColor` there resolves to the initial
colour — measured in Chromium under both schemes, black both times. So
`dist/logo.svg` is `getAdaptiveSVG()`: black, white under
`prefers-color-scheme: dark`, carried in a `<style>` block the SVG document
honours itself. Four shipped files, four distinct artifacts, no duplicate —
`logo.svg` adapts, `logo-white.svg` is white, `logo-mono.svg` is black,
`logo-light.svg` carries its own white ground. `logo.svg` and `logo-white.svg`
were byte-identical until this was fixed.

**The wordmarks are OUTLINES, one per product.** `src/wordmarks.ts` holds 16
(Hanzo, Hanzo AI, Hanzo ID, … plus Lux, Pars, Zoo), cut from Zen at wght 606 and
shaped through HarfBuzz so pair spacing is the font's own GPOS kerning.
`getWordmarkSVG(name)` returns **null** for a name with no outline rather than
falling back to `<text>` — a silent fallback is how a page ends up setting the
brand in Arial. Adding a name is one line in `scripts/wordmarks.py` plus a
re-run; the generator is deliberately not in `build`, because outlines are
static data and making every build need Python to reproduce unchanging bytes is
a cost with no payer.

## How this ships

One way, and it runs on our own stack:

    push  ->  github.com/hanzoai/logo          where code lands
      ->  git.hanzo.ai/hanzoai/logo             pull mirror; runs the CI
              .hanzo/workflows/publish.yml      publishes @hanzo/logo to npm
              .hanzo/workflows/deploy.yml       ships logo.hanzo.ai (Sites plane)

**Push to GitHub. The forge is a READ-ONLY pull mirror** — `git push` to it is
refused with `Mirror Repository hanzoai/logo is read-only`, so the `native`
remote is for reading the mirror's state, never for writing. GitHub holds the
code; the forge holds the CI, because `.github/workflows/` is empty and every
build, check and publish lives under `.hanzo/workflows/`, which only the forge
reads. Both use GitHub Actions syntax, so a workflow moves between them by
changing directory and nothing else.

The consequence worth remembering: a push is not a deploy. Nothing runs until
the mirror pulls, and that lag is the forge's, not yours.

`publish.yml` is the SOLE publisher of `@hanzo/logo`. It fires on every push to
`main`, skips a version already on the registry, and runs `pnpm test` first —
typecheck, then build. The rendered images under `dist/` are tracked but the
compiled `dist/*.js` and `dist/*.d.ts` are gitignored, so publishing without that
build ships every icon and no entry point.

It reads `NPM_TOKEN` from **KMS** at run time, not from a forge secret. The forge
secret never existed — on this repo or the hanzoai org — and an absent secret
interpolates to the empty string rather than failing, so the job authenticated as
nobody and npmjs answered `ENEEDAUTH` with the tarball already built. That is why
1.0.18 built clean and shipped nothing. `@hanzo/ui` reads the token from the same
place; there is one way to reach npm, not two.

### The site

`index.html` is the whole page: one self-contained file, inline CSS, no local
subresources. It is a SITE, not an App — nothing here executes — so it ships on
the Sites plane and there is no image, no CR and no pod:

    assemble out/  ->  POST /v1/projects/logo/deploy      202 + an upload grant
                   ->  POST each file under the grant     bytes skip the API
                   ->  POST …/deployments/<id>/complete   {status, keys}

This repo holds NO S3 credential. The grant is confined to this site's prefix and
expires in 30 minutes; deletion rides the `keys` manifest, because a write-only
grant cannot remove a file. The one secret is `HANZO_DEPLOY_TOKEN`, set ON THE
FORGE — GitHub's secret store is not in this path at all.

No GitHub Pages and no Cloudflare Pages: the repo used to push this page to a
`gh-pages` branch, Pages was never configured for it, and `logo.hanzo.ai` has
answered 404 from our own ingress ever since.

`out/` is ASSEMBLED, not built — `index.html` plus `hz.js`, the script-tag form of
`@hanzo/event`, copied out of `node_modules` at build time. That is the whole
reason `@hanzo/event` is a devDependency here: the lockfile decides which version
of the telemetry client ships, and the only script this page loads stays
same-origin instead of coming off a public CDN. `hz.js` posts to the same
`api.hanzo.ai/v1/event` as every bundled Hanzo surface.

**Known gap, upstream:** `hz.js` (through 0.3.11) cannot authenticate. It sends
no `Authorization` header and no `?ingest_key=` query, while `/v1/event` answers
`401 ingest_key_required` to an unattributed batch — so every event this page
sends is currently refused. The npm client supports `ingestKey` on both the fetch
and the beacon; the script form was never given the same. The fix belongs in
`hanzoai/ui` `pkgs/event/hz.js` (read `data-ingest-key`, ride it the way
`core.ts` already does), NOT in a bespoke script here — a second telemetry client
is exactly what `hz.js` exists to prevent.

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
  types.ts    # LogoVariant (current|color|light|mono|white|favicon|animated),
              # LogoFormat, LogoOptions. `current` is the default.
  wordmarks.ts # 16 outlined per-product wordmarks + getWordmarkSVG
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
- Variants: current (currentColor — THE DEFAULT), color (white fill + shade),
  mono (black fill + shade), white, light (white ground + black H), favicon
  (simplified 5-path for 16-64px), animated (interactive). `getMenuBarSVG` is
  what `current` renders; the name is a place rather than the value, so prefer
  the variant.
- Release: bump the patch in `package.json`, merge to `main`. There is no tag.
- `CLAUDE.md`, `AGENTS.md`, `QWEN.md`, `GEMINI.md` are all symlinks to this file
