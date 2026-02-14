import React from 'react';
import { getColorSVG, getMonoSVG, getWhiteSVG, getFaviconSVG } from './logos.js';
import type { LogoVariant } from './types.js';

export interface HanzoLogoProps {
  variant?: LogoVariant;
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
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
  style
}) => {
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

// Export with backwards compatible names
export { HanzoLogo as ZooLogo };
export { HanzoFavicon as ZooFavicon };