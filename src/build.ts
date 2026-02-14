#!/usr/bin/env node

/**
 * Hanzo Logo Build Script
 * Generates all required icons for Hanzo ecosystem
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { getColorSVG, getMonoSVG, getMenuBarSVG, getFaviconSVG, getWhiteSVG } from './logos.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface IconConfig {
    name: string;
    size: number;
    svg?: string;
    addBackground?: boolean;
    bgColor?: string;
    cornerRadius?: number;
    aspectRatio?: { width: number; height: number };
}

async function generateIcon(
    svgString: string, 
    outputPath: string, 
    size: number, 
    options: {
        addBackground?: boolean;
        bgColor?: string;
        cornerRadius?: number;
        aspectRatio?: { width: number; height: number };
    } = {}
): Promise<void> {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const { addBackground = false, bgColor = 'black', cornerRadius, aspectRatio } = options;

    if (aspectRatio) {
        // For non-square images like OG graph
        const { width, height } = aspectRatio;
        const logoSize = Math.min(width, height) * 0.4;
        const logoX = Math.floor((width - logoSize) / 2);
        const logoY = Math.floor((height - logoSize) / 2);
        const radius = cornerRadius ?? 0;

        const bgSvg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="${bgColor}"/>
        </svg>`;

        const bg = await sharp(Buffer.from(bgSvg)).png().toBuffer();
        const logo = await sharp(Buffer.from(svgString))
            .resize(Math.floor(logoSize), Math.floor(logoSize))
            .png()
            .toBuffer();

        await sharp(bg)
            .composite([{
                input: logo,
                top: logoY,
                left: logoX
            }])
            .toFile(outputPath);
    } else if (addBackground) {
        // For dock icons, add rounded square background with padding
        const logoSize = Math.floor(size * 0.65);
        const padding = Math.floor((size - logoSize) / 2);
        const radius = cornerRadius ?? Math.floor(size * 0.22);

        const bgSvg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="${bgColor}"/>
        </svg>`;

        const bg = await sharp(Buffer.from(bgSvg)).png().toBuffer();
        const logo = await sharp(Buffer.from(svgString))
            .resize(logoSize, logoSize)
            .png()
            .toBuffer();

        await sharp(bg)
            .composite([{
                input: logo,
                top: padding,
                left: padding
            }])
            .toFile(outputPath);
    } else {
        await sharp(Buffer.from(svgString))
            .resize(size, size)
            .png()
            .toFile(outputPath);
    }
    console.log(`✓ ${path.relative(process.cwd(), outputPath)} (${options.aspectRatio ? `${options.aspectRatio.width}×${options.aspectRatio.height}` : `${size}×${size}`})`);
}

async function buildAll(): Promise<void> {
    console.log('🎨 Hanzo Logo Builder\n');

    const colorSVG = getColorSVG();
    const monoSVG = getMonoSVG();
    const menuBarSVG = getMenuBarSVG();
    const faviconSVG = getFaviconSVG();
    const whiteSVG = getWhiteSVG();

    // Ensure dist directories exist
    const dirs = ['dist', 'dist/icons', 'dist/favicon', 'dist/og', 'dist/apple', 'dist/dock', 'dist/menubar'];
    for (const dir of dirs) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }

    // Save SVG sources
    console.log('📁 SVG Sources:');
    fs.writeFileSync('dist/hanzo-logo.svg', colorSVG);
    fs.writeFileSync('dist/hanzo-logo-mono.svg', monoSVG);
    fs.writeFileSync('dist/hanzo-logo-white.svg', whiteSVG);
    fs.writeFileSync('dist/hanzo-logo-menubar.svg', menuBarSVG);
    fs.writeFileSync('dist/hanzo-favicon.svg', faviconSVG);
    console.log('✓ Generated 5 SVG sources\n');

    // === STANDARD ICONS ===
    console.log('📁 Standard Icons (dist/icons/):');
    const standardSizes = [16, 32, 64, 128, 256, 512, 1024];
    for (const size of standardSizes) {
        await generateIcon(colorSVG, `dist/icons/logo-${size}.png`, size);
    }
    for (const size of [16, 32, 64, 128]) {
        await generateIcon(monoSVG, `dist/icons/logo-mono-${size}.png`, size);
    }

    // === FAVICONS ===
    console.log('\n📁 Favicons (dist/favicon/):');
    const faviconSizes = [16, 32, 48, 64, 96, 128, 192, 256, 512];
    for (const size of faviconSizes) {
        await generateIcon(faviconSVG, `dist/favicon/favicon-${size}.png`, size);
    }
    // Also generate with black background versions
    for (const size of [16, 32, 48]) {
        await generateIcon(whiteSVG, `dist/favicon/favicon-bg-${size}.png`, size, { 
            addBackground: true, 
            bgColor: '#000000',
            cornerRadius: 0 
        });
    }

    // === APPLE TOUCH ICONS ===
    console.log('\n📁 Apple Touch Icons (dist/apple/):');
    const appleSizes = [57, 60, 72, 76, 114, 120, 144, 152, 167, 180];
    for (const size of appleSizes) {
        await generateIcon(colorSVG, `dist/apple/apple-touch-icon-${size}.png`, size, {
            addBackground: true,
            bgColor: '#000000',
            cornerRadius: Math.floor(size * 0.156) // iOS corner radius
        });
    }

    // === OG GRAPH IMAGES ===
    console.log('\n📁 Open Graph Images (dist/og/):');
    // Standard OG (1200x630)
    await generateIcon(whiteSVG, 'dist/og/og-image.png', 1200, {
        aspectRatio: { width: 1200, height: 630 },
        bgColor: '#000000'
    });
    // Twitter card (1200x600)
    await generateIcon(whiteSVG, 'dist/og/twitter-card.png', 1200, {
        aspectRatio: { width: 1200, height: 600 },
        bgColor: '#000000'
    });
    // Square OG (1200x1200)
    await generateIcon(whiteSVG, 'dist/og/og-square.png', 1200, {
        aspectRatio: { width: 1200, height: 1200 },
        bgColor: '#000000'
    });

    // === DOCK ICONS (macOS) ===
    console.log('\n📁 Dock Icons (dist/dock/):');
    const dockSizes = [64, 128, 256, 512, 1024];
    for (const size of dockSizes) {
        await generateIcon(whiteSVG, `dist/dock/dock-${size}.png`, size, {
            addBackground: true,
            bgColor: '#000000'
        });
    }
    // @2x versions for Retina
    for (const base of [128, 256, 512]) {
        await generateIcon(whiteSVG, `dist/dock/dock-${base}@2x.png`, base * 2, {
            addBackground: true,
            bgColor: '#000000'
        });
    }

    // === MENU BAR ICONS ===
    console.log('\n📁 Menu Bar Icons (dist/menubar/):');
    // Black icons for light menu bar
    await generateIcon(monoSVG, 'dist/menubar/menubar-16.png', 16);
    await generateIcon(monoSVG, 'dist/menubar/menubar-16@2x.png', 32);
    await generateIcon(monoSVG, 'dist/menubar/menubar-16@3x.png', 48);
    await generateIcon(monoSVG, 'dist/menubar/menubar-22.png', 22);
    await generateIcon(monoSVG, 'dist/menubar/menubar-22@2x.png', 44);
    
    // Template icons (for macOS dark/light mode adaptation)
    await generateIcon(menuBarSVG, 'dist/menubar/iconTemplate.png', 16);
    await generateIcon(menuBarSVG, 'dist/menubar/iconTemplate@2x.png', 32);
    await generateIcon(menuBarSVG, 'dist/menubar/iconTemplate@3x.png', 48);

    // === GENERATE SHOWCASE HTML ===
    console.log('\n📄 Generating showcase...');
    generateShowcase();

    console.log('\n✅ Build complete!');
    console.log('   Open dist/showcase.html in browser to verify all assets\n');
}

function generateShowcase(): void {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hanzo Logo Assets Showcase</title>
    <style>
        :root {
            --bg-dark: #111;
            --bg-light: #f5f5f5;
            --grid-bg: repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 50% / 20px 20px;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #1a1a1a;
            color: #fff;
            padding: 40px;
            line-height: 1.6;
        }
        h1 { margin-bottom: 10px; font-size: 2rem; }
        .subtitle { color: #888; margin-bottom: 40px; }
        h2 { 
            margin: 40px 0 20px; 
            padding-bottom: 10px; 
            border-bottom: 1px solid #333;
            color: #fff;
        }
        .section { margin-bottom: 60px; }
        .grid {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            align-items: flex-end;
        }
        .icon-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
        }
        .icon-box {
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--grid-bg);
            border-radius: 8px;
            padding: 10px;
        }
        .icon-box.dark {
            background: var(--bg-dark);
        }
        .icon-box.light {
            background: var(--bg-light);
        }
        .icon-box img {
            display: block;
            max-width: 100%;
            height: auto;
        }
        .label {
            font-size: 12px;
            color: #888;
            text-align: center;
        }
        .og-preview {
            max-width: 600px;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }
        .og-preview img {
            width: 100%;
            height: auto;
            display: block;
        }
        .menubar-demo {
            background: linear-gradient(to bottom, #d4d4d4, #c8c8c8);
            padding: 4px 12px;
            border-radius: 6px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        .menubar-demo.dark {
            background: linear-gradient(to bottom, #3a3a3a, #2a2a2a);
        }
        .dock-demo {
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(20px);
            padding: 8px;
            border-radius: 20px;
            display: inline-flex;
            gap: 8px;
            align-items: flex-end;
        }
        .dock-demo img {
            border-radius: 22%;
        }
        .timestamp {
            position: fixed;
            bottom: 20px;
            right: 20px;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <h1>🎨 Hanzo Logo Assets</h1>
    <p class="subtitle">Generated: ${new Date().toISOString()}</p>

    <section class="section">
        <h2>📁 SVG Sources</h2>
        <div class="grid">
            <div class="icon-item">
                <div class="icon-box dark" style="width:120px;height:120px;">
                    <img src="hanzo-logo.svg" alt="Color Logo" style="width:100px;height:100px;">
                </div>
                <span class="label">hanzo-logo.svg</span>
            </div>
            <div class="icon-item">
                <div class="icon-box light" style="width:120px;height:120px;">
                    <img src="hanzo-logo-mono.svg" alt="Mono Logo" style="width:100px;height:100px;">
                </div>
                <span class="label">hanzo-logo-mono.svg</span>
            </div>
            <div class="icon-item">
                <div class="icon-box dark" style="width:120px;height:120px;">
                    <img src="hanzo-logo-white.svg" alt="White Logo" style="width:100px;height:100px;">
                </div>
                <span class="label">hanzo-logo-white.svg</span>
            </div>
            <div class="icon-item">
                <div class="icon-box" style="width:120px;height:120px;">
                    <img src="hanzo-favicon.svg" alt="Favicon" style="width:100px;height:100px;">
                </div>
                <span class="label">hanzo-favicon.svg</span>
            </div>
        </div>
    </section>

    <section class="section">
        <h2>🖼️ Standard Icons (PNG)</h2>
        <div class="grid">
            <div class="icon-item">
                <div class="icon-box dark"><img src="icons/logo-32.png" alt="32px"></div>
                <span class="label">32px</span>
            </div>
            <div class="icon-item">
                <div class="icon-box dark"><img src="icons/logo-64.png" alt="64px"></div>
                <span class="label">64px</span>
            </div>
            <div class="icon-item">
                <div class="icon-box dark"><img src="icons/logo-128.png" alt="128px"></div>
                <span class="label">128px</span>
            </div>
            <div class="icon-item">
                <div class="icon-box dark"><img src="icons/logo-256.png" alt="256px"></div>
                <span class="label">256px</span>
            </div>
        </div>
    </section>

    <section class="section">
        <h2>⭐ Favicons</h2>
        <div class="grid">
            <div class="icon-item">
                <div class="icon-box"><img src="favicon/favicon-16.png" alt="16px"></div>
                <span class="label">16px</span>
            </div>
            <div class="icon-item">
                <div class="icon-box"><img src="favicon/favicon-32.png" alt="32px"></div>
                <span class="label">32px</span>
            </div>
            <div class="icon-item">
                <div class="icon-box"><img src="favicon/favicon-48.png" alt="48px"></div>
                <span class="label">48px</span>
            </div>
            <div class="icon-item">
                <div class="icon-box"><img src="favicon/favicon-64.png" alt="64px"></div>
                <span class="label">64px</span>
            </div>
            <div class="icon-item">
                <div class="icon-box"><img src="favicon/favicon-192.png" alt="192px"></div>
                <span class="label">192px (Android)</span>
            </div>
            <div class="icon-item">
                <div class="icon-box"><img src="favicon/favicon-512.png" alt="512px"></div>
                <span class="label">512px (PWA)</span>
            </div>
        </div>
    </section>

    <section class="section">
        <h2>🍎 Apple Touch Icons</h2>
        <div class="grid">
            <div class="icon-item">
                <div class="icon-box"><img src="apple/apple-touch-icon-60.png" alt="60px"></div>
                <span class="label">60px</span>
            </div>
            <div class="icon-item">
                <div class="icon-box"><img src="apple/apple-touch-icon-120.png" alt="120px"></div>
                <span class="label">120px</span>
            </div>
            <div class="icon-item">
                <div class="icon-box"><img src="apple/apple-touch-icon-152.png" alt="152px"></div>
                <span class="label">152px</span>
            </div>
            <div class="icon-item">
                <div class="icon-box"><img src="apple/apple-touch-icon-180.png" alt="180px"></div>
                <span class="label">180px</span>
            </div>
        </div>
    </section>

    <section class="section">
        <h2>🖥️ Dock Icons (macOS)</h2>
        <div class="dock-demo">
            <img src="dock/dock-64.png" alt="Dock 64" style="width:48px;height:48px;">
            <img src="dock/dock-128.png" alt="Dock 128" style="width:64px;height:64px;">
        </div>
        <div class="grid" style="margin-top: 20px;">
            <div class="icon-item">
                <div class="icon-box"><img src="dock/dock-128.png" alt="128px"></div>
                <span class="label">128px</span>
            </div>
            <div class="icon-item">
                <div class="icon-box"><img src="dock/dock-256.png" alt="256px"></div>
                <span class="label">256px</span>
            </div>
            <div class="icon-item">
                <div class="icon-box"><img src="dock/dock-512.png" alt="512px"></div>
                <span class="label">512px</span>
            </div>
        </div>
    </section>

    <section class="section">
        <h2>📱 Menu Bar Icons</h2>
        <p style="color:#888;margin-bottom:20px;">Template icons adapt to light/dark menu bar</p>
        <div style="display:flex;gap:40px;flex-wrap:wrap;">
            <div>
                <p style="margin-bottom:10px;font-size:14px;">Light Menu Bar</p>
                <div class="menubar-demo">
                    <img src="menubar/menubar-16.png" alt="Menu bar icon" style="width:16px;height:16px;">
                    <span style="font-size:13px;color:#333;">Hanzo</span>
                </div>
            </div>
            <div>
                <p style="margin-bottom:10px;font-size:14px;">Dark Menu Bar</p>
                <div class="menubar-demo dark">
                    <img src="menubar/iconTemplate.png" alt="Menu bar icon" style="width:16px;height:16px;filter:invert(1);">
                    <span style="font-size:13px;color:#fff;">Hanzo</span>
                </div>
            </div>
        </div>
        <div class="grid" style="margin-top:20px;">
            <div class="icon-item">
                <div class="icon-box light"><img src="menubar/menubar-16.png" alt="16px"></div>
                <span class="label">16px</span>
            </div>
            <div class="icon-item">
                <div class="icon-box light"><img src="menubar/menubar-22.png" alt="22px"></div>
                <span class="label">22px</span>
            </div>
            <div class="icon-item">
                <div class="icon-box light"><img src="menubar/menubar-16@2x.png" alt="16@2x" style="width:32px;"></div>
                <span class="label">16@2x (32px)</span>
            </div>
        </div>
    </section>

    <section class="section">
        <h2>📣 Open Graph / Social Images</h2>
        <div style="display:flex;flex-direction:column;gap:30px;">
            <div>
                <p style="margin-bottom:10px;font-size:14px;">OG Image (1200×630)</p>
                <div class="og-preview">
                    <img src="og/og-image.png" alt="OG Image">
                </div>
            </div>
            <div>
                <p style="margin-bottom:10px;font-size:14px;">Twitter Card (1200×600)</p>
                <div class="og-preview">
                    <img src="og/twitter-card.png" alt="Twitter Card">
                </div>
            </div>
            <div>
                <p style="margin-bottom:10px;font-size:14px;">Square (1200×1200)</p>
                <div class="og-preview" style="max-width:400px;">
                    <img src="og/og-square.png" alt="OG Square">
                </div>
            </div>
        </div>
    </section>

    <div class="timestamp">Last generated: ${new Date().toLocaleString()}</div>
</body>
</html>`;

    fs.writeFileSync('dist/showcase.html', html);
    console.log('✓ dist/showcase.html');
}

// Run the build
await buildAll().catch(console.error);
