import React from 'react';
import { getColorSVG, getMonoSVG, getWhiteSVG,
  getLightSVG, getFaviconSVG, getAnimatedSVG, getMenuBarSVG } from './logos.js';
import { MOTION_CSS } from './motion.js';
import type { LogoVariant } from './types.js';

export interface HanzoLogoProps {
  variant?: LogoVariant;
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
  /**
   * Render the brand motion shell: intro flip + idle breathing + a wordmark
   * that slides in, holds, then collapses (returns on hover). Pure CSS,
   * reduced-motion-safe. The mark inherits `currentColor`.
   */
  animated?: boolean;
  /** Wordmark text for the animated shell (white-label). Default "Hanzo". */
  wordmark?: string;
}

/**
 * React component for Hanzo logo
 *
 * @example
 * ```tsx
 * import { HanzoLogo } from '@hanzo/logo';
 *
 * <HanzoLogo size={64} />
 * <HanzoLogo variant="mono" size="2rem" />
 * <HanzoLogo variant="white" className="w-16 h-16" />
 * ```
 */
export const HanzoLogo: React.FC<HanzoLogoProps> = ({
  variant = 'color',
  size = 64,
  className,
  style,
  animated = false,
  wordmark = 'Hanzo'
}) => {
  if (animated) {
    return (
      <span className={className} style={style}>
        <style dangerouslySetInnerHTML={{ __html: MOTION_CSS }} />
        <span className="hanzo-motion">
          <span
            className="hanzo-mark"
            style={{ width: size, height: size }}
            dangerouslySetInnerHTML={{ __html: getMenuBarSVG() }}
          />
          <span className="hanzo-word">
            <span>{wordmark}</span>
          </span>
        </span>
      </span>
    );
  }

  let svg = '';

  switch (variant) {
    case 'mono':
      svg = getMonoSVG();
      break;
    case 'white':
      svg = getWhiteSVG();
      break;
    case 'light':
      svg = getLightSVG();
      break;
    case 'current':
      // Inherits the surrounding text colour, so an inline mark needs no filter
      // and no second asset per theme.
      svg = getMenuBarSVG();
      break;
    case 'favicon':
      svg = getFaviconSVG();
      break;
    case 'animated':
      svg = getAnimatedSVG();
      break;
    default:
      svg = getColorSVG();
  }

  const sizeStyle = typeof size === 'number'
    ? { width: size, height: size }
    : { width: size, height: size };

  return (
    <div
      className={className}
      style={{ ...sizeStyle, ...style }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

/**
 * Hanzo favicon component for <head>
 *
 * @example
 * ```tsx
 * import { HanzoFavicon } from '@hanzo/logo';
 *
 * // In your app's <head>
 * <HanzoFavicon />
 * ```
 */
export const HanzoFavicon: React.FC = () => {
  const svg = getFaviconSVG();
  const dataUrl = `data:image/svg+xml,${encodeURIComponent(svg)}`;

  return (
    <>
      <link rel="icon" type="image/svg+xml" href={dataUrl} />
      <link rel="apple-touch-icon" href={dataUrl} />
    </>
  );
};