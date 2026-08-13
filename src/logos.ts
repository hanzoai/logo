import type { LogoSettings, LogoOptions } from './types.js';
import { ANIMATED_SVG } from './animated.js';

// Hanzo logo settings
export const LOGO_SETTINGS: LogoSettings = {
  color: {
    viewBox: '0 0 67 67',
    width: 67,
    height: 67
  },
  mono: {
    strokeWidth: 2
  }
};

/** Mark viewBox — the block-H's native coordinate space. */
export const MARK_VIEWBOX = '0 0 67 67';

/**
 * Raw block-H path geometry — the single source of the Hanzo mark.
 * The canonical mark is SEVEN paths: five fill-less body blocks (callers set
 * their own `fill` — e.g. `@hanzo/brand` card generators, og images) plus the
 * two `class="shade"` accent slivers that give the H its shaded depth
 * (#DDDDDD in every shipped variant; restyle via `.shade` if needed).
 * Use this instead of re-typing the path data anywhere.
 */
export const MARK_PATHS =
  '<path d="M22.21 67V44.6369H0V67H22.21Z"/>' +
  '<path class="shade" fill="#DDDDDD" d="M0 44.6369L22.21 46.8285V44.6369H0Z"/>' +
  '<path d="M66.7038 22.3184H22.2534L0.0878906 44.6367H44.4634L66.7038 22.3184Z"/>' +
  '<path d="M22.21 0H0V22.3184H22.21V0Z"/>' +
  '<path d="M66.7198 0H44.5098V22.3184H66.7198V0Z"/>' +
  '<path class="shade" fill="#DDDDDD" d="M66.6753 22.3185L44.5098 20.0822V22.3185H66.6753Z"/>' +
  '<path d="M66.7198 67V44.6369H44.5098V67H66.7198Z"/>';

/** House ensō viewBox — the 24-unit space the ensō is drawn in. */
export const HOUSE_MARK_VIEWBOX = '0 0 24 24';

/**
 * Enso — the single source for every surface that draws it. A `currentColor`
 * brush ring on a 24-unit viewBox, stroke 2.64 with round caps, so it carries
 * the optical weight of a lab's mark sitting beside it in a list.
 *
 * The ring is CLOSED, and that is the whole point: Enso is the router that
 * completes the circle by picking the right model. An ensō (円相) left OPEN is
 * a different glyph saying a different thing, never a variant of this one.
 * Geometry is a ×0.24 reduction of the 100-unit drawing (r 37→8.88, stroke
 * 11→2.64) — a scale, not a redrawing. Draw this; never re-type the ring or
 * thin it to a hairline.
 *
 * This package carries Hanzo's marks. Another maker's mark is theirs, and
 * belongs in the consuming app's mark table beside the other labs it draws.
 */
export const ENSO_MARK =
  '<circle cx="12" cy="12" r="8.88" fill="none" stroke="currentColor" stroke-width="2.64" stroke-linecap="round"/>';

/** Family slug → house mark. `hanzo` is the block-H (`MARK_PATHS`, its own 67 viewBox). */
export const HOUSE_MARKS: Record<string, string> = {
  enso: ENSO_MARK,
};

/** A house mark as a complete `<svg>`, `currentColor`-inheriting. */
export function getHouseMarkSVG(slug: 'enso'): string {
  return `<svg viewBox="${HOUSE_MARK_VIEWBOX}" xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true">${HOUSE_MARKS[slug]}</svg>`;
}

/**
 * Generate Hanzo color SVG logo
 */
export function getColorSVG(): string {
  return `<svg viewBox="0 0 67 67" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.21 67V44.6369H0V67H22.21Z" fill="#ffffff"/>
    <path d="M0 44.6369L22.21 46.8285V44.6369H0Z" fill="#DDDDDD"/>
    <path d="M66.7038 22.3184H22.2534L0.0878906 44.6367H44.4634L66.7038 22.3184Z" fill="#ffffff"/>
    <path d="M22.21 0H0V22.3184H22.21V0Z" fill="#ffffff"/>
    <path d="M66.7198 0H44.5098V22.3184H66.7198V0Z" fill="#ffffff"/>
    <path d="M66.6753 22.3185L44.5098 20.0822V22.3185H66.6753Z" fill="#DDDDDD"/>
    <path d="M66.7198 67V44.6369H44.5098V67H66.7198Z" fill="#ffffff"/>
  </svg>`;
}

/**
 * Generate monochrome SVG logo (filled, for dark backgrounds)
 */
export function getMonoSVG(): string {
  return `<svg viewBox="0 0 67 67" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.21 67V44.6369H0V67H22.21Z" fill="#000000"/>
    <path d="M0 44.6369L22.21 46.8285V44.6369H0Z" fill="#222222"/>
    <path d="M66.7038 22.3184H22.2534L0.0878906 44.6367H44.4634L66.7038 22.3184Z" fill="#000000"/>
    <path d="M22.21 0H0V22.3184H22.21V0Z" fill="#000000"/>
    <path d="M66.7198 0H44.5098V22.3184H66.7198V0Z" fill="#000000"/>
    <path d="M66.6753 22.3185L44.5098 20.0822V22.3185H66.6753Z" fill="#222222"/>
    <path d="M66.7198 67V44.6369H44.5098V67H66.7198Z" fill="#000000"/>
  </svg>`;
}

/**
 * Generate tightly cropped color SVG logo
 */
export function getColorSVGCropped(): string {
  // Hanzo logo is already minimal, return as-is
  return getColorSVG();
}

/**
 * Generate white SVG logo (for dark backgrounds)
 */
export function getWhiteSVG(): string {
  return `<svg viewBox="0 0 67 67" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.21 67V44.6369H0V67H22.21Z" fill="#ffffff"/>
    <path d="M0 44.6369L22.21 46.8285V44.6369H0Z" fill="#DDDDDD"/>
    <path d="M66.7038 22.3184H22.2534L0.0878906 44.6367H44.4634L66.7038 22.3184Z" fill="#ffffff"/>
    <path d="M22.21 0H0V22.3184H22.21V0Z" fill="#ffffff"/>
    <path d="M66.7198 0H44.5098V22.3184H66.7198V0Z" fill="#ffffff"/>
    <path d="M66.6753 22.3185L44.5098 20.0822V22.3185H66.6753Z" fill="#DDDDDD"/>
    <path d="M66.7198 67V44.6369H44.5098V67H66.7198Z" fill="#ffffff"/>
  </svg>`;
}

/**
 * Generate monochrome SVG for menu bar (filled, tightly cropped)
 */
export function getMenuBarSVG(): string {
  // For menu bar, we want a solid filled version for better visibility at small sizes
  return `<svg viewBox="0 0 67 67" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.21 67V44.6369H0V67H22.21Z" fill="currentColor"/>
    <path d="M0 44.6369L22.21 46.8285V44.6369H0Z" fill="currentColor"/>
    <path d="M66.7038 22.3184H22.2534L0.0878906 44.6367H44.4634L66.7038 22.3184Z" fill="currentColor"/>
    <path d="M22.21 0H0V22.3184H22.21V0Z" fill="currentColor"/>
    <path d="M66.7198 0H44.5098V22.3184H66.7198V0Z" fill="currentColor"/>
    <path d="M66.6753 22.3185L44.5098 20.0822V22.3185H66.6753Z" fill="currentColor"/>
    <path d="M66.7198 67V44.6369H44.5098V67H66.7198Z" fill="currentColor"/>
  </svg>`;
}

/**
 * Generate favicon SVG (simplified black H on white background)
 * Optimized for small sizes (16px-64px) - no 3D accents
 */
export function getFaviconSVG(): string {
  // No 3D accents: they turn to mush at 16px, which is the size that matters.
  //
  // Black mark on white, not white on black. A tab strip is light in every
  // default theme, so a dark ground reads as a blob with a hole in it, and the
  // transparent variant disappears entirely — insights was serving a favicon
  // whose 32x32 was 100% white pixels, and three other surfaces were serving one
  // whose 48x48 was 100% black. Both were "correct" by checksum and invisible in
  // a browser. White ground keeps the mark legible on light and dark chrome
  // alike, because the tile itself supplies the contrast.
  return `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <rect width="64" height="64" rx="8" fill="#ffffff"/>
  <g transform="translate(8, 8) scale(0.716)">
    <path d="M22.21 67V44.6369H0V67H22.21Z" fill="#000000"/>
    <path d="M66.7038 22.3184H22.2534L0.0878906 44.6367H44.4634L66.7038 22.3184Z" fill="#000000"/>
    <path d="M22.21 0H0V22.3184H22.21V0Z" fill="#000000"/>
    <path d="M66.7198 0H44.5098V22.3184H66.7198V0Z" fill="#000000"/>
    <path d="M66.7198 67V44.6369H44.5098V67H66.7198Z" fill="#000000"/>
  </g>
</svg>`;
}

/**
 * Get logo as data URL
 */
export function getLogoDataUrl(options: LogoOptions = {}): string {
  const { variant = 'color' } = options;
  let svg = '';

  switch (variant) {
    case 'mono':
      svg = getMonoSVG();
      break;
    case 'white':
      svg = getWhiteSVG();
      break;
    case 'favicon':
      svg = getFaviconSVG();
      break;
    default:
      svg = getColorSVG();
  }

  const base64 = btoa(unescape(encodeURIComponent(svg)));
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Get logo as base64 string
 */
export function getLogoBase64(options: LogoOptions = {}): string {
  const { variant = 'color' } = options;
  let svg = '';

  switch (variant) {
    case 'mono':
      svg = getMonoSVG();
      break;
    case 'white':
      svg = getWhiteSVG();
      break;
    case 'favicon':
      svg = getFaviconSVG();
      break;
    default:
      svg = getColorSVG();
  }

  return btoa(unescape(encodeURIComponent(svg)));
}

/**
 * Get logo in requested format
 */
export function getLogo(options: LogoOptions = {}): string {
  const { variant = 'color', format = 'svg' } = options;
  if (variant === 'animated') {
    if (format === 'dataUrl') return getAnimatedDataUrl();
    if (format === 'base64') return btoa(unescape(encodeURIComponent(getAnimatedSVG())));
    return getAnimatedSVG();
  }

  switch (format) {
    case 'dataUrl':
      return getLogoDataUrl({ variant });
    case 'base64':
      return getLogoBase64({ variant });
    default:
      switch (variant) {
        case 'mono':
          return getMonoSVG();
        case 'white':
          return getWhiteSVG();
        case 'favicon':
          return getFaviconSVG();
        default:
          return getColorSVG();
      }
  }
}

// Export pre-generated versions for convenience
export const hanzoLogo = getColorSVG();
export const hanzoLogoMono = getMonoSVG();
export const hanzoLogoWhite = getWhiteSVG();
export const hanzoFavicon = getFaviconSVG();
export const hanzoLogoDataUrl = getLogoDataUrl();
export const hanzoLogoMonoDataUrl = getLogoDataUrl({ variant: 'mono' });
export const hanzoLogoWhiteDataUrl = getLogoDataUrl({ variant: 'white' });
export const hanzoFaviconDataUrl = getLogoDataUrl({ variant: 'favicon' });
/**
 * Interactive animated mark — load (assemble) → hover (one graceful turn,
 * returns to rest) → press (squash). Pure CSS, no JS. Inline this SVG into
 * the DOM (not <img>) for the hover/press interactions to fire.
 */
export function getAnimatedSVG(): string {
  return ANIMATED_SVG;
}

/** Animated mark as a data: URL (load animation runs even in <img>). */
export function getAnimatedDataUrl(): string {
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(ANIMATED_SVG)));
}

export const hanzoLogoAnimated = ANIMATED_SVG;
export const hanzoLogoAnimatedDataUrl = getAnimatedDataUrl();
