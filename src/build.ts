#!/usr/bin/env node

/**
 * Zoo Logo Build Script
 * Generates all required icons for Zoo ecosystem
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import sharp from 'sharp';

// Final perfect logo settings
const LOGO_SETTINGS = {
    color: {
        outerRadius: 270,
        outerX: 512,
        outerY: 511,
        circleRadius: 234,
        greenX: 513,
        greenY: 369,
        redX: 365,
        redY: 595,
        blueX: 643,
        blueY: 595
    },
    mono: {
        outerRadius: 283,
        outerX: 508,
        outerY: 510,
        strokeWidth: 33,
        outerStrokeWidth: 36
    }
};

function generateColorSVG(): string {
    const s = LOGO_SETTINGS.color;
    return `<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <clipPath id="outerCircleColor">
                <circle cx="${s.outerX}" cy="${s.outerY}" r="${s.outerRadius}"/>
            </clipPath>
            <clipPath id="greenClip">
                <circle cx="${s.greenX}" cy="${s.greenY}" r="${s.circleRadius}"/>
            </clipPath>
            <clipPath id="redClip">
                <circle cx="${s.redX}" cy="${s.redY}" r="${s.circleRadius}"/>
            </clipPath>
            <clipPath id="blueClip">
                <circle cx="${s.blueX}" cy="${s.blueY}" r="${s.circleRadius}"/>
            </clipPath>
        </defs>
        <g clip-path="url(#outerCircleColor)">
            <circle cx="${s.greenX}" cy="${s.greenY}" r="${s.circleRadius}" fill="#00A652"/>
            <circle cx="${s.redX}" cy="${s.redY}" r="${s.circleRadius}" fill="#ED1C24"/>
            <circle cx="${s.blueX}" cy="${s.blueY}" r="${s.circleRadius}" fill="#2E3192"/>
            <g clip-path="url(#greenClip)">
                <circle cx="${s.redX}" cy="${s.redY}" r="${s.circleRadius}" fill="#FCF006"/>
            </g>
            <g clip-path="url(#greenClip)">
                <circle cx="${s.blueX}" cy="${s.blueY}" r="${s.circleRadius}" fill="#01ACF1"/>
            </g>
            <g clip-path="url(#redClip)">
                <circle cx="${s.blueX}" cy="${s.blueY}" r="${s.circleRadius}" fill="#EA018E"/>
            </g>
            <g clip-path="url(#greenClip)">
                <g clip-path="url(#redClip)">
                    <circle cx="${s.blueX}" cy="${s.blueY}" r="${s.circleRadius}" fill="#FFFFFF"/>
                </g>
            </g>
        </g>
    </svg>`;
}

function generateMonoSVG(): string {
    // Thicker strokes for menu bar visibility
    const strokeWidth = 33;
    const outerStrokeWidth = 36;

    return `<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <clipPath id="outerCircleMono">
                <circle cx="508" cy="511" r="270"/>
            </clipPath>
        </defs>
        <g clip-path="url(#outerCircleMono)">
            <circle cx="513" cy="369" r="234" fill="none" stroke="black" stroke-width="${strokeWidth}"/>
            <circle cx="365" cy="595" r="234" fill="none" stroke="black" stroke-width="${strokeWidth}"/>
            <circle cx="643" cy="595" r="234" fill="none" stroke="black" stroke-width="${strokeWidth}"/>
            <circle cx="508" cy="511" r="252" fill="none" stroke="black" stroke-width="${outerStrokeWidth}"/>
        </g>
    </svg>`;
}

function generateMenuBarSVG(): string {
    // Tightly cropped version for menu bar - uses 100% of height
    const strokeWidth = 33;
    const outerStrokeWidth = 36;

    // Calculate tight bounds
    const minX = 365 - 234 - strokeWidth;
    const maxX = 643 + 234 + strokeWidth;
    const minY = 369 - 234 - strokeWidth;
    const maxY = 595 + 234 + strokeWidth;

    const width = maxX - minX;
    const height = maxY - minY;

    return `<svg viewBox="${minX} ${minY} ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <clipPath id="outerCircleMenu">
                <circle cx="508" cy="511" r="270"/>
            </clipPath>
        </defs>
        <g clip-path="url(#outerCircleMenu)">
            <circle cx="513" cy="369" r="234" fill="none" stroke="black" stroke-width="${strokeWidth}"/>
            <circle cx="365" cy="595" r="234" fill="none" stroke="black" stroke-width="${strokeWidth}"/>
            <circle cx="643" cy="595" r="234" fill="none" stroke="black" stroke-width="${strokeWidth}"/>
            <circle cx="508" cy="511" r="252" fill="none" stroke="black" stroke-width="${outerStrokeWidth}"/>
        </g>
    </svg>`;
}

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
    console.log('🎨 Zoo Logo Builder\n');

    const colorSVG = generateColorSVG();
    const monoSVG = generateMonoSVG();
    const menuBarSVG = generateMenuBarSVG();

    // Ensure dist directory exists
    if (!fs.existsSync('dist')) {
        fs.mkdirSync('dist');
    }

    // Save SVG sources
    fs.writeFileSync('dist/zoo-logo.svg', colorSVG);
    fs.writeFileSync('dist/zoo-logo-mono.svg', monoSVG);
    fs.writeFileSync('dist/zoo-logo-menubar.svg', menuBarSVG);
    console.log('✓ Generated SVG sources\n');

    // Generate icons for zoo/app
    const appPath = '../app/apps/zoo-desktop/src-tauri/icons';
    if (fs.existsSync(appPath)) {
        console.log('Generating Tauri app icons:');

        // Standard macOS app icons
        const appIcons: IconConfig[] = [
            { name: 'icon_16x16.png', size: 16 },
            { name: '16x16.png', size: 16 },
            { name: 'icon_16x16@2x.png', size: 32 },
            { name: 'icon_32x32.png', size: 32 },
            { name: '32x32.png', size: 32 },
            { name: 'icon_32x32@2x.png', size: 64 },
            { name: 'icon_128x128.png', size: 128 },
            { name: '128x128.png', size: 128 },
            { name: 'icon_128x128@2x.png', size: 256 },
            { name: '128x128@2x.png', size: 256 },
            { name: 'icon_256x256.png', size: 256 },
            { name: 'icon_256x256@2x.png', size: 512 },
            { name: 'icon_512x512.png', size: 512 },
            { name: 'icon_512x512@2x.png', size: 1024 },
            { name: 'icon_1024x1024.png', size: 1024 },
        ];

        for (const icon of appIcons) {
            // Add black rounded background for dock icons (larger sizes)
            const addBg = icon.size >= 128;
            await generateIcon(colorSVG, path.join(appPath, icon.name), icon.size, addBg);
        }

        // Menu bar templates (monochrome, tightly cropped)
        const menuIcons: IconConfig[] = [
            { name: 'iconTemplate.png', size: 16 },
            { name: 'tray-icon-macos.png', size: 16 },
            { name: 'iconTemplate@1.5x.png', size: 24 },
            { name: 'iconTemplate@2x.png', size: 32 },
            { name: 'iconTemplate@3x.png', size: 48 },
        ];

        for (const icon of menuIcons) {
            await generateIcon(menuBarSVG, path.join(appPath, icon.name), icon.size);
        }
    }

    // Web icons
    const webPath = '../app/apps/zoo-desktop/public';
    if (fs.existsSync(webPath)) {
        console.log('\nGenerating web icons:');
        await generateIcon(colorSVG, path.join(webPath, 'favicon.png'), 32);
        await generateIcon(colorSVG, path.join(webPath, 'zoo-logo.png'), 256);
    }

    // Main app assets
    const appAssetsPath = '../app/assets';
    if (fs.existsSync(appAssetsPath)) {
        console.log('\nGenerating app assets:');
        await generateIcon(colorSVG, path.join(appAssetsPath, 'icon.png'), 512, true);
    }

    // Logo in app root
    await generateIcon(colorSVG, '../app/zoo-logo.png', 256);

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

    console.log('\n✅ Build complete!');
}

// Check if sharp is installed
const checkAndRun = async (): Promise<void> => {
    try {
        await import('sharp');
    } catch (e) {
        console.log('Installing sharp...');
        execSync('npm install sharp', { stdio: 'inherit' });
    }

    await buildAll().catch(console.error);
};

// Run if called directly
if (require.main === module) {
    checkAndRun();
}