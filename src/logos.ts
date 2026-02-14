import type { LogoSettings, LogoOptions } from './types.js';

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
 * Generate favicon SVG (simplified white H on black background)
 * Optimized for small sizes (16px-64px) - no 3D accents
 */
export function getFaviconSVG(): string {
  // Simplified version without 3D accents for better scaling at small sizes
  // Uses the core Hanzo "H" shape with padding for favicon context
  return `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <rect width="64" height="64" rx="8" fill="#000000"/>
  <g transform="translate(8, 8) scale(0.716)">
    <path d="M22.21 67V44.6369H0V67H22.21Z" fill="#ffffff"/>
    <path d="M66.7038 22.3184H22.2534L0.0878906 44.6367H44.4634L66.7038 22.3184Z" fill="#ffffff"/>
    <path d="M22.21 0H0V22.3184H22.21V0Z" fill="#ffffff"/>
    <path d="M66.7198 0H44.5098V22.3184H66.7198V0Z" fill="#ffffff"/>
    <path d="M66.7198 67V44.6369H44.5098V67H66.7198Z" fill="#ffffff"/>
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