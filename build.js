#!/usr/bin/env node

/**
 * Zoo Logo Build Script
 * Generates all required icons for Zoo ecosystem
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

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

function generateColorSVG() {
    const s = LOGO_SETTINGS.color;
    return `<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <radialGradient id="blackGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style="stop-color:#2a2a2a;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#1a1a1a;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#000000;stop-opacity:1" />
            </radialGradient>
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
        <rect x="0" y="0" width="1024" height="1024" fill="url(#blackGradient)"/>
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

function generateMonoSVG() {
    const c = LOGO_SETTINGS.color;
    const m = LOGO_SETTINGS.mono;
    return `<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <clipPath id="outerCircleMono">
                <circle cx="${m.outerX}" cy="${m.outerY}" r="${m.outerRadius}"></circle>
            </clipPath>
        </defs>
        <g clip-path="url(#outerCircleMono)">
            <circle cx="${c.greenX}" cy="${c.greenY}" r="${c.circleRadius}" fill="none" stroke="black" stroke-width="${m.strokeWidth}"></circle>
            <circle cx="${c.redX}" cy="${c.redY}" r="${c.circleRadius}" fill="none" stroke="black" stroke-width="${m.strokeWidth}"></circle>
            <circle cx="${c.blueX}" cy="${c.blueY}" r="${c.circleRadius}" fill="none" stroke="black" stroke-width="${m.strokeWidth}"></circle>
            <circle cx="${m.outerX}" cy="${m.outerY}" r="${m.outerRadius - m.outerStrokeWidth/2}" fill="none" stroke="black" stroke-width="${m.outerStrokeWidth}"></circle>
        </g>
    </svg>`;
}

async function generateIcon(svgString, outputPath, size) {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    await sharp(Buffer.from(svgString))
        .resize(size, size)
        .png()
        .toFile(outputPath);
    console.log(`✓ ${path.relative(process.cwd(), outputPath)} (${size}×${size})`);
}

async function buildAll() {
    console.log('🎨 Zoo Logo Builder\n');

    const colorSVG = generateColorSVG();
    const monoSVG = generateMonoSVG();

    // Ensure dist directory exists
    if (!fs.existsSync('dist')) {
        fs.mkdirSync('dist');
    }

    // Save SVG sources
    fs.writeFileSync('dist/zoo-logo.svg', colorSVG);
    fs.writeFileSync('dist/zoo-logo-mono.svg', monoSVG);
    console.log('✓ Generated SVG sources\n');

    // Generate icons for zoo/app
    const appPath = '../app/apps/zoo-desktop/src-tauri/icons';
    if (fs.existsSync(appPath)) {
        console.log('Generating Tauri app icons:');

        // Standard macOS app icons
        const appIcons = [
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
            await generateIcon(colorSVG, path.join(appPath, icon.name), icon.size);
        }

        // Menu bar templates (monochrome)
        const menuIcons = [
            { name: 'iconTemplate.png', size: 16 },
            { name: 'tray-icon-macos.png', size: 16 },
            { name: 'iconTemplate@1.5x.png', size: 24 },
            { name: 'iconTemplate@2x.png', size: 32 },
            { name: 'iconTemplate@3x.png', size: 48 },
        ];

        for (const icon of menuIcons) {
            await generateIcon(monoSVG, path.join(appPath, icon.name), icon.size);
        }

        // Save SVG source
        fs.writeFileSync(path.join(appPath, 'icon.svg'), colorSVG);
        console.log('');
    }

    // Generate icons for zoo/app public directory
    const publicPath = '../app/apps/zoo-desktop/public';
    if (fs.existsSync(publicPath)) {
        console.log('Generating web icons:');
        await generateIcon(colorSVG, path.join(publicPath, 'favicon.png'), 32);
        await generateIcon(colorSVG, path.join(publicPath, 'zoo-logo.png'), 256);
        fs.writeFileSync(path.join(publicPath, 'zoo-logo.svg'), colorSVG);
        console.log('');
    }

    // Generate icons for zoo/app assets
    const assetsPath = '../app/assets';
    if (fs.existsSync(assetsPath)) {
        console.log('Generating app assets:');
        await generateIcon(colorSVG, path.join(assetsPath, 'icon.png'), 512);
        console.log('');
    }

    // Generate main app logo
    const appRoot = '../app';
    if (fs.existsSync(appRoot)) {
        await generateIcon(colorSVG, path.join(appRoot, 'zoo-logo.png'), 256);
    }

    // Generate dist icons for reference
    console.log('Generating reference icons in dist/:');
    const distIcons = [
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
    ];

    for (const icon of distIcons) {
        await generateIcon(icon.svg || colorSVG, icon.name, icon.size);
    }

    console.log('\n✅ Build complete!');
}

// Check if sharp is installed
const checkAndRun = async () => {
    try {
        require.resolve('sharp');
    } catch (e) {
        console.log('Installing sharp...');
        const { execSync } = require('child_process');
        execSync('npm install sharp', { stdio: 'inherit' });
    }

    await buildAll().catch(console.error);
};

checkAndRun();