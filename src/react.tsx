import React from 'react';
import { getColorSVG, getMonoSVG, getWhiteSVG } from './logos';
import type { LogoVariant } from './types';

export interface ZooLogoProps {
  variant?: LogoVariant;
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * React component for Zoo logo
 *
 * @example
 * ```tsx
 * import { ZooLogo } from '@zooai/logo';
 *
 * <ZooLogo size={64} />
 * <ZooLogo variant="mono" size="2rem" />
 * <ZooLogo variant="white" className="w-16 h-16" />
 * ```
 */
export const ZooLogo: React.FC<ZooLogoProps> = ({
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
 * Zoo favicon component for <head>
 *
 * @example
 * ```tsx
 * import { ZooFavicon } from '@zooai/logo';
 *
 * // In your app's <head>
 * <ZooFavicon />
 * ```
 */
export const ZooFavicon: React.FC = () => {
  const svg = getColorSVG();
  const dataUrl = `data:image/svg+xml,${encodeURIComponent(svg)}`;

  return (
    <>
      <link rel="icon" type="image/svg+xml" href={dataUrl} />
      <link rel="apple-touch-icon" href={dataUrl} />
    </>
  );
};