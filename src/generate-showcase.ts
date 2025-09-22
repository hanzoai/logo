#!/usr/bin/env node

/**
 * Generate showcase images for README
 */

import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import { getColorSVGCropped, getMonoSVG, getMenuBarSVG } from './logos';

async function generateShowcaseImages() {
    console.log('🎨 Generating showcase images for README...\n');

    // Ensure docs/assets directory exists
    const docsDir = path.join(process.cwd(), 'docs', 'assets');
    if (!fs.existsSync(docsDir)) {
        fs.mkdirSync(docsDir, { recursive: true });
    }

    // Generate cropped color logo
    const colorSVG = getColorSVGCropped();
    fs.writeFileSync(path.join(docsDir, 'zoo-logo-cropped.svg'), colorSVG);
    console.log('✓ Generated cropped color SVG');

    // Generate various sizes of the color logo
    const sizes = [32, 64, 128, 256, 512];
    for (const size of sizes) {
        await sharp(Buffer.from(colorSVG))
            .resize(size, size)
            .png()
            .toFile(path.join(docsDir, `logo-${size}.png`));
        console.log(`✓ Generated ${size}×${size} color logo`);
    }

    // Generate monochrome version
    const monoSVG = getMonoSVG();
    fs.writeFileSync(path.join(docsDir, 'zoo-logo-mono.svg'), monoSVG);
    await sharp(Buffer.from(monoSVG))
        .resize(128, 128)
        .png()
        .toFile(path.join(docsDir, 'logo-mono-128.png'));
    console.log('✓ Generated monochrome logo');

    // Generate menu bar icon
    const menuBarSVG = getMenuBarSVG();
    fs.writeFileSync(path.join(docsDir, 'zoo-logo-menubar.svg'), menuBarSVG);
    await sharp(Buffer.from(menuBarSVG))
        .resize(32, 32)
        .png()
        .toFile(path.join(docsDir, 'logo-menubar-32.png'));
    console.log('✓ Generated menu bar icon');

    // Generate macOS dock icon with black rounded background
    const dockSize = 512;
    const logoSize = Math.floor(dockSize * 0.8);
    const padding = Math.floor((dockSize - logoSize) / 2);
    const cornerRadius = Math.floor(dockSize * 0.22);

    const bgSvg = `<svg width="${dockSize}" height="${dockSize}" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="${dockSize}" height="${dockSize}" rx="${cornerRadius}" ry="${cornerRadius}" fill="black"/>
    </svg>`;

    const bg = await sharp(Buffer.from(bgSvg)).png().toBuffer();
    const logo = await sharp(Buffer.from(colorSVG))
        .resize(logoSize, logoSize)
        .png()
        .toBuffer();

    await sharp(bg)
        .composite([{
            input: logo,
            top: padding,
            left: padding
        }])
        .toFile(path.join(docsDir, 'logo-macos-dock.png'));
    console.log('✓ Generated macOS dock icon');

    console.log('\n✅ All showcase images generated!');
}

// Run if called directly
if (require.main === module) {
    generateShowcaseImages().catch(console.error);
}

export { generateShowcaseImages };