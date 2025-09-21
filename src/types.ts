export interface LogoSettings {
  color: {
    outerRadius: number;
    outerX: number;
    outerY: number;
    circleRadius: number;
    greenX: number;
    greenY: number;
    redX: number;
    redY: number;
    blueX: number;
    blueY: number;
  };
  mono: {
    outerRadius: number;
    outerX: number;
    outerY: number;
    strokeWidth: number;
    outerStrokeWidth: number;
  };
}

export type LogoVariant = 'color' | 'mono' | 'white';
export type LogoFormat = 'svg' | 'dataUrl' | 'base64';

export interface LogoOptions {
  variant?: LogoVariant;
  format?: LogoFormat;
  size?: number;
}