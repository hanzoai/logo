# @zooai/logo

Official Zoo logo package with React components and utilities.

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

## Logo Variants

- **Color** (`color`) - Full color logo with RGB overlaps
- **Monochrome** (`mono`) - Black outlines, thicker strokes for menu bars
- **White** (`white`) - White outlines for dark backgrounds

## Icon Sizes

Standard sizes generated: 16, 32, 64, 128, 256, 512, 1024

macOS @2x versions also available.

## Colors

The Zoo logo uses perfect RGB color overlaps:

- **Primary Colors:**
  - Green: `#00A652`
  - Red: `#ED1C24`
  - Blue: `#2E3192`

- **Secondary Colors (Overlaps):**
  - Yellow (Green + Red): `#FCF006`
  - Cyan (Green + Blue): `#01ACF1`
  - Magenta (Red + Blue): `#EA018E`
  - White (All three): `#FFFFFF`

## License

MIT