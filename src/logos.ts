import type { LogoSettings, LogoOptions } from './types';

// Final perfect logo settings
export const LOGO_SETTINGS: LogoSettings = {
  color: {
    outerRadius: 270,
    outerX: 512,
    outerY: 511,
    circleRadius: 234,
    greenX: 513,
    greenY: 369,
    redX: 365,
    redY: 595,
    blueX: 643,
    blueY: 595
  },
  mono: {
    outerRadius: 283,
    outerX: 508,
    outerY: 510,
    strokeWidth: 33,
    outerStrokeWidth: 36
  }
};

/**
 * Generate color SVG logo
 */
export function getColorSVG(): string {
  const s = LOGO_SETTINGS.color;
  return `<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="outerCircleColor">
        <circle cx="${s.outerX}" cy="${s.outerY}" r="${s.outerRadius}"/>
      </clipPath>
      <clipPath id="greenClip">
        <circle cx="${s.greenX}" cy="${s.greenY}" r="${s.circleRadius}"/>
      </clipPath>
      <clipPath id="redClip">
        <circle cx="${s.redX}" cy="${s.redY}" r="${s.circleRadius}"/>
      </clipPath>
      <clipPath id="blueClip">
        <circle cx="${s.blueX}" cy="${s.blueY}" r="${s.circleRadius}"/>
      </clipPath>
    </defs>
    <g clip-path="url(#outerCircleColor)">
      <circle cx="${s.greenX}" cy="${s.greenY}" r="${s.circleRadius}" fill="#00A652"/>
      <circle cx="${s.redX}" cy="${s.redY}" r="${s.circleRadius}" fill="#ED1C24"/>
      <circle cx="${s.blueX}" cy="${s.blueY}" r="${s.circleRadius}" fill="#2E3192"/>
      <g clip-path="url(#greenClip)">
        <circle cx="${s.redX}" cy="${s.redY}" r="${s.circleRadius}" fill="#FCF006"/>
      </g>
      <g clip-path="url(#greenClip)">
        <circle cx="${s.blueX}" cy="${s.blueY}" r="${s.circleRadius}" fill="#01ACF1"/>
      </g>
      <g clip-path="url(#redClip)">
        <circle cx="${s.blueX}" cy="${s.blueY}" r="${s.circleRadius}" fill="#EA018E"/>
      </g>
      <g clip-path="url(#greenClip)">
        <g clip-path="url(#redClip)">
          <circle cx="${s.blueX}" cy="${s.blueY}" r="${s.circleRadius}" fill="#FFFFFF"/>
        </g>
      </g>
    </g>
  </svg>`;
}

/**
 * Generate monochrome SVG logo
 */
export function getMonoSVG(): string {
  const c = LOGO_SETTINGS.color;
  const m = LOGO_SETTINGS.mono;
  return `<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="outerCircleMono">
        <circle cx="${m.outerX}" cy="${m.outerY}" r="${m.outerRadius}"></circle>
      </clipPath>
    </defs>
    <g clip-path="url(#outerCircleMono)">
      <circle cx="${c.greenX}" cy="${c.greenY}" r="${c.circleRadius}" fill="none" stroke="black" stroke-width="${m.strokeWidth}"></circle>
      <circle cx="${c.redX}" cy="${c.redY}" r="${c.circleRadius}" fill="none" stroke="black" stroke-width="${m.strokeWidth}"></circle>
      <circle cx="${c.blueX}" cy="${c.blueY}" r="${c.circleRadius}" fill="none" stroke="black" stroke-width="${m.strokeWidth}"></circle>
      <circle cx="${m.outerX}" cy="${m.outerY}" r="${m.outerRadius - m.outerStrokeWidth/2}" fill="none" stroke="black" stroke-width="${m.outerStrokeWidth}"></circle>
    </g>
  </svg>`;
}

/**
 * Generate tightly cropped color SVG logo
 */
export function getColorSVGCropped(): string {
  const s = LOGO_SETTINGS.color;

  // Calculate tight bounds (matching the outer circle)
  const padding = 20; // Small padding for visual comfort
  const minX = s.outerX - s.outerRadius - padding;
  const minY = s.outerY - s.outerRadius - padding;
  const size = (s.outerRadius + padding) * 2;

  return `<svg width="${size}" height="${size}" viewBox="${minX} ${minY} ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="outerCircleColor">
        <circle cx="${s.outerX}" cy="${s.outerY}" r="${s.outerRadius}"/>
      </clipPath>
      <clipPath id="greenClip">
        <circle cx="${s.greenX}" cy="${s.greenY}" r="${s.circleRadius}"/>
      </clipPath>
      <clipPath id="redClip">
        <circle cx="${s.redX}" cy="${s.redY}" r="${s.circleRadius}"/>
      </clipPath>
      <clipPath id="blueClip">
        <circle cx="${s.blueX}" cy="${s.blueY}" r="${s.circleRadius}"/>
      </clipPath>
    </defs>
    <g clip-path="url(#outerCircleColor)">
      <circle cx="${s.greenX}" cy="${s.greenY}" r="${s.circleRadius}" fill="#00A652"/>
      <circle cx="${s.redX}" cy="${s.redY}" r="${s.circleRadius}" fill="#ED1C24"/>
      <circle cx="${s.blueX}" cy="${s.blueY}" r="${s.circleRadius}" fill="#2E3192"/>
      <g clip-path="url(#greenClip)">
        <circle cx="${s.redX}" cy="${s.redY}" r="${s.circleRadius}" fill="#FCF006"/>
      </g>
      <g clip-path="url(#greenClip)">
        <circle cx="${s.blueX}" cy="${s.blueY}" r="${s.circleRadius}" fill="#01ACF1"/>
      </g>
      <g clip-path="url(#redClip)">
        <circle cx="${s.blueX}" cy="${s.blueY}" r="${s.circleRadius}" fill="#EA018E"/>
      </g>
      <g clip-path="url(#greenClip)">
        <g clip-path="url(#redClip)">
          <circle cx="${s.blueX}" cy="${s.blueY}" r="${s.circleRadius}" fill="#FFFFFF"/>
        </g>
      </g>
    </g>
  </svg>`;
}

/**
 * Generate white SVG logo (for dark backgrounds)
 */
export function getWhiteSVG(): string {
  const c = LOGO_SETTINGS.color;
  const m = LOGO_SETTINGS.mono;
  return getMonoSVG().replace(/stroke="black"/g, 'stroke="white"');
}

/**
 * Generate monochrome SVG for menu bar (tightly cropped)
 */
export function getMenuBarSVG(): string {
  const c = LOGO_SETTINGS.color;
  const m = LOGO_SETTINGS.mono;

  // Calculate tight bounding box around the circles
  const minX = Math.min(c.redX, c.greenX, c.blueX) - c.circleRadius - m.strokeWidth;
  const maxX = Math.max(c.redX, c.greenX, c.blueX) + c.circleRadius + m.strokeWidth;
  const minY = Math.min(c.greenY, c.redY, c.blueY) - c.circleRadius - m.strokeWidth;
  const maxY = Math.max(c.greenY, c.redY, c.blueY) + c.circleRadius + m.strokeWidth;

  const width = maxX - minX;
  const height = maxY - minY;

  return `<svg viewBox="${minX} ${minY} ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="outerCircleMenu">
        <circle cx="${m.outerX}" cy="${m.outerY}" r="${m.outerRadius}"></circle>
      </clipPath>
    </defs>
    <g clip-path="url(#outerCircleMenu)">
      <circle cx="${c.greenX}" cy="${c.greenY}" r="${c.circleRadius}" fill="none" stroke="black" stroke-width="${m.strokeWidth}"></circle>
      <circle cx="${c.redX}" cy="${c.redY}" r="${c.circleRadius}" fill="none" stroke="black" stroke-width="${m.strokeWidth}"></circle>
      <circle cx="${c.blueX}" cy="${c.blueY}" r="${c.circleRadius}" fill="none" stroke="black" stroke-width="${m.strokeWidth}"></circle>
      <circle cx="${m.outerX}" cy="${m.outerY}" r="${m.outerRadius - m.outerStrokeWidth/2}" fill="none" stroke="black" stroke-width="${m.outerStrokeWidth}"></circle>
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
        default:
          return getColorSVG();
      }
  }
}

// Export pre-generated versions for convenience
export const zooLogo = getColorSVG();
export const zooLogoMono = getMonoSVG();
export const zooLogoWhite = getWhiteSVG();
export const zooLogoDataUrl = getLogoDataUrl();
export const zooLogoMonoDataUrl = getLogoDataUrl({ variant: 'mono' });
export const zooLogoWhiteDataUrl = getLogoDataUrl({ variant: 'white' });