<div align="center">
  <img src="dist/zoo-logo.svg" alt="Zoo Logo" width="256" height="256">

  # @zooai/logo

  Official Zoo logo package providing TypeScript/React components and utilities for consistent branding across the Zoo ecosystem.

  [![npm version](https://img.shields.io/npm/v/@zooai/logo)](https://www.npmjs.com/package/@zooai/logo)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
</div>

## Features

- 🎨 **SVG Logo Generation** - Programmatically generate Zoo logos in multiple formats
- ⚛️ **React Components** - Ready-to-use React components with TypeScript support
- 🎯 **Multiple Variants** - Color, monochrome, and menu bar optimized versions
- 📦 **Icon Generation** - Generate icons in all required sizes for web and desktop apps
- 🔧 **TypeScript Native** - Full TypeScript support with proper type definitions

## Installation

```bash
npm install @zooai/logo
# or
yarn add @zooai/logo
# or
pnpm add @zooai/logo
```

## Usage

### React Components

```tsx
import { ZooLogo, ZooFavicon } from '@zooai/logo/react';

// Basic usage
<ZooLogo size={64} />

// Monochrome variant for menu bars
<ZooLogo variant="mono" size={32} />

// White variant for dark backgrounds
<ZooLogo variant="white" className="w-16 h-16" />

// Add favicon to your app
<ZooFavicon />
```

### Raw SVG Strings

```ts
import { zooLogo, zooLogoMono, zooLogoWhite } from '@zooai/logo';

// Use in HTML
document.getElementById('logo').innerHTML = zooLogo;

// Use as CSS background
element.style.backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(zooLogo)}")`;
```

### Data URLs

```ts
import { zooLogoDataUrl, zooLogoMonoDataUrl } from '@zooai/logo';

// Use in img tag
<img src={zooLogoDataUrl} alt="Zoo" />

// Use as favicon
<link rel="icon" href={zooLogoDataUrl} />
```

### Flexible API

```ts
import { getLogo } from '@zooai/logo';

// Get SVG string
const svg = getLogo({ variant: 'color' });

// Get data URL
const dataUrl = getLogo({ variant: 'mono', format: 'dataUrl' });

// Get base64
const base64 = getLogo({ variant: 'white', format: 'base64' });
```

### Generate PNG Icons

```ts
import { generateIcon, generateAllIcons } from '@zooai/logo';

// Generate single icon
await generateIcon(svgString, 'icon.png', 128);

// Generate all standard sizes
await generateAllIcons('dist/icons');
```

## Building Icons

The package includes a build script for generating all icon variations:

```bash
# Using npm scripts
npm run generate

# Using Make
make generate

# Generate and preview
make preview
```

## Development

### Quick Start

```bash
# Install dependencies
make install

# Build TypeScript
make build

# Run tests
make test

# Generate icons
make generate
```

### Available Make Commands

```bash
make help         # Show all available commands
make install      # Install dependencies
make build        # Build TypeScript files
make clean        # Remove build artifacts
make dev          # Development mode with watch
make test         # Run tests
make lint         # Run ESLint
make format       # Format with Prettier
make typecheck    # TypeScript type checking
make generate     # Generate all logo variations
make preview      # Preview generated logos
make publish      # Publish to npm
```

### Project Structure

```
@zooai/logo/
├── src/
│   ├── index.ts       # Main exports
│   ├── logos.ts       # Logo generation logic
│   ├── generator.ts   # Icon generation utilities
│   ├── react.tsx      # React components
│   ├── types.ts       # TypeScript definitions
│   └── build.ts       # CLI build script
├── dist/              # Built JavaScript files
├── Makefile           # Build automation
├── package.json       # Package configuration
└── tsconfig.json      # TypeScript configuration
```

## Logo Specifications

The Zoo logo consists of three overlapping circles forming a Venn diagram pattern:

### Primary Colors
- **Green Circle**: `#00A652` (RGB: 0, 166, 82) - Top
- **Red Circle**: `#ED1C24` (RGB: 237, 28, 36) - Bottom left
- **Blue Circle**: `#2E3192` (RGB: 46, 49, 146) - Bottom right

### Secondary Colors (Overlaps)
- **Yellow**: `#FCF006` (Green + Red)
- **Cyan**: `#01ACF1` (Green + Blue)
- **Magenta**: `#EA018E` (Red + Blue)
- **White**: `#FFFFFF` (All three)

### Dimensions
- **Standard**: 1024×1024px canvas
- **Circle Radius**: 234px
- **Outer Boundary**: 270px radius
- **Menu Bar**: Optimized stroke width for visibility at 16px

## API Reference

### Functions

#### `generateColorSVG(): string`
Generates the full-color Zoo logo as an SVG string.

#### `generateMonoSVG(): string`
Generates a monochrome version suitable for single-color displays.

#### `generateMenuBarSVG(): string`
Generates a tightly-cropped version optimized for menu bars.

#### `generateIcon(svg: string, path: string, size: number, background?: boolean): Promise<void>`
Generates a PNG icon from an SVG string.

### React Components

#### `<ZooLogo />`
Props:
- `size?: number` - Icon size in pixels (default: 128)
- `variant?: 'color' | 'mono' | 'white'` - Logo variant (default: 'color')
- `style?: React.CSSProperties` - Additional styles
- `className?: string` - CSS class name

#### `<ZooFavicon />`
Adds appropriate favicon link tags to the document head.

## License

MIT © Zoo AI

## Contributing

Contributions are welcome! Please ensure:
1. All TypeScript files pass type checking
2. Code is formatted with Prettier
3. New features include appropriate tests
4. Documentation is updated accordingly

## Support

For issues or questions, please visit [GitHub Issues](https://github.com/zooai/logo/issues).