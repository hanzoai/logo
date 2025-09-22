#!/usr/bin/env node

/**
 * Hanzo Logo Build Script
 * Generates all required icons for Hanzo ecosystem
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { getColorSVG, getMonoSVG, getMenuBarSVG } from './logos.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateIcon(svgString: string, outputPath: string, size: number, addBackground = false): Promise<void> {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    if (addBackground) {
        // For dock icons, add rounded square black background
        const logoSize = Math.floor(size * 0.8);
        const padding = Math.floor((size - logoSize) / 2);
        const cornerRadius = Math.floor(size * 0.22); // macOS-style corner radius

        const bgSvg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="${size}" height="${size}" rx="${cornerRadius}" ry="${cornerRadius}" fill="black"/>
        </svg>`;

        // Create background layer
        const bg = await sharp(Buffer.from(bgSvg)).png().toBuffer();

        // Create logo layer
        const logo = await sharp(Buffer.from(svgString))
            .resize(logoSize, logoSize)
            .png()
            .toBuffer();

        // Composite them together
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
    console.log(`✓ ${path.relative(process.cwd(), outputPath)} (${size}×${size})`);
}

interface IconConfig {
    name: string;
    size: number;
    svg?: string;
}

async function buildAll(): Promise<void> {
    console.log('🎨 Hanzo Logo Builder\n');

    const colorSVG = getColorSVG();
    const monoSVG = getMonoSVG();
    const menuBarSVG = getMenuBarSVG();

    // Ensure dist directory exists
    if (!fs.existsSync('dist')) {
        fs.mkdirSync('dist');
    }

    // Save SVG sources
    fs.writeFileSync('dist/hanzo-logo.svg', colorSVG);
    fs.writeFileSync('dist/hanzo-logo-mono.svg', monoSVG);
    fs.writeFileSync('dist/hanzo-logo-menubar.svg', menuBarSVG);
    console.log('✓ Generated SVG sources\n');

    // Reference icons
    if (!fs.existsSync('dist/icons')) {
        fs.mkdirSync('dist/icons', { recursive: true });
    }

    console.log('Generating reference icons in dist/:');
    const distIcons: IconConfig[] = [
        { name: 'dist/icons/16.png', size: 16 },
        { name: 'dist/icons/32.png', size: 32 },
        { name: 'dist/icons/64.png', size: 64 },
        { name: 'dist/icons/128.png', size: 128 },
        { name: 'dist/icons/256.png', size: 256 },
        { name: 'dist/icons/512.png', size: 512 },
        { name: 'dist/icons/1024.png', size: 1024 },
        { name: 'dist/icons/mono-16.png', size: 16, svg: monoSVG },
        { name: 'dist/icons/mono-32.png', size: 32, svg: monoSVG },
        { name: 'dist/icons/mono-64.png', size: 64, svg: monoSVG },
        { name: 'dist/icons/menubar-16.png', size: 16, svg: menuBarSVG },
        { name: 'dist/icons/menubar-32.png', size: 32, svg: menuBarSVG },
    ];

    for (const icon of distIcons) {
        await generateIcon(icon.svg || colorSVG, icon.name, icon.size);
    }

    // Generate macOS dock icon with background
    await generateIcon(colorSVG, 'dist/icons/dock-512.png', 512, true);

    console.log('\n✅ Build complete!');
}

// Run the build
await buildAll().catch(console.error);