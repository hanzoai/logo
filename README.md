<div align="center">
  <img src="docs/assets/hanzo-logo.svg" alt="Hanzo Logo" width="256" height="256">

  # @hanzo/logo

  Official Hanzo logo package providing TypeScript/React components and utilities for consistent branding across the Hanzo ecosystem.

  [![npm version](https://img.shields.io/npm/v/@hanzo/logo)](https://www.npmjs.com/package/@hanzo/logo)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
</div>

## Features

- 🎨 **SVG Logo Generation** - Programmatically generate Hanzo logos in multiple formats
- ⚛️ **React Components** - Ready-to-use React components with TypeScript support
- 🎯 **Multiple Variants** - Color, monochrome, and menu bar optimized versions
- 📦 **Icon Generation** - Generate icons in all required sizes for web and desktop apps
- 🔧 **TypeScript Native** - Full TypeScript support with proper type definitions

## Installation

```bash
npm install @hanzo/logo
# or
yarn add @hanzo/logo
# or
pnpm add @hanzo/logo
```

## Usage Examples

### 🎨 Standard Color Logo

```tsx
import { HanzoLogo } from '@hanzo/logo/react';
import { getColorSVG, getColorSVGCropped } from '@hanzo/logo';

// React component - auto sizing
<HanzoLogo size={128} />

// Get SVG string
const svg = getColorSVG();

// Use in various sizes
<HanzoLogo size={32} />   // Favicon size
<HanzoLogo size={64} />   // Small icon
<HanzoLogo size={128} />  // Standard icon
<HanzoLogo size={256} />  // Large display
```

### ⚫ Monochrome Variants

```tsx
import { HanzoLogo } from '@hanzo/logo/react';
import { getMonoSVG, getWhiteSVG } from '@hanzo/logo';

// Black outline (for light backgrounds)
<HanzoLogo variant="mono" size={128} />
const monoSVG = getMonoSVG();

// White outline (for dark backgrounds)
<HanzoLogo variant="white" size={128} />
const whiteSVG = getWhiteSVG();
```

### 🌐 Web Favicon

```tsx
import { HanzoFavicon } from '@hanzo/logo/react';
import { hanzoLogoDataUrl } from '@hanzo/logo';

// React component (adds to document head)
<HanzoFavicon />

// Manual favicon
<link rel="icon" href={hanzoLogoDataUrl} />
<link rel="icon" type="image/svg+xml" href="/logo.svg" />
<link rel="apple-touch-icon" href="/logo-180.png" />
```

## License

MIT © Hanzo AI
