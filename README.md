# Zoo Logo Generator

Generates all required icons for the Zoo ecosystem.

## Build

```bash
npm install
npm run build
```

This will generate:
- All icons for the Tauri desktop app
- Web favicons
- Menu bar icons (monochrome)
- Reference icons in `dist/`

## Logo Settings

The logo uses perfect RGB color overlaps:
- **Green**: #00A652
- **Red**: #ED1C24
- **Blue**: #2E3192
- **Yellow** (Green + Red): #FCF006
- **Cyan** (Green + Blue): #01ACF1
- **Magenta** (Red + Blue): #EA018E
- **White** (All three): #FFFFFF

Monochrome menu bar icons use thicker strokes (33/36) for better visibility.