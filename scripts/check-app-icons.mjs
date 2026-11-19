import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import sharp from 'sharp';
import { HANZO_APP_IDS, getHanzoAppIconSVG, HANZO_TEAM_OPTIONS, getHanzoTeamOptionSVG } from '../dist/app-icons.js';
import { MARK_BLOCKS, MARK_SHADE } from '../dist/logos.js';

for (const app of HANZO_APP_IDS) {
  const svg = getHanzoAppIconSVG(app);
  assert.equal(
    svg, readFileSync(new URL('../svg/apps/hanzo-' + app + '.svg', import.meta.url), 'utf8'),
    app + ': checked-in SVG differs from generated package SVG'
  );
  for (const d of [...MARK_BLOCKS, ...MARK_SHADE]) {
    assert.ok(svg.includes('d="' + d + '"'), app + ': canonical H path missing');
  }
  assert.equal((svg.match(/<svg\b/g) || []).length, 1);
  assert.equal((svg.match(/<\/svg>/g) || []).length, 1);
  assert.ok(!svg.includes('url(#glyphshadow)'), app + ': unscoped filter');
  assert.ok(!svg.includes('url(#metal)'), app + ': unscoped gradient');
  assert.ok(!svg.includes('url(#edgeglow)'), app + ': unscoped rim');
  if (app === 'app') {
    assert.ok(!svg.includes('translate(745 760)'), 'Hanzo App must have no corner badge');
    assert.ok(svg.includes('translate(230 226) scale(9)'), 'Hanzo App missing full H');
  } else {
    assert.ok(svg.includes('translate(745 760) scale(2.31)'), app + ': complete borderless corner H missing');
  }
  for (const size of [32, 64, 128, 256, 512, 1024]) {
    const {info} = await sharp(Buffer.from(svg)).resize(size, size).png().toBuffer({resolveWithObject: true});
    assert.equal(info.width, size); assert.equal(info.height, size);
  }
  if (app !== 'app') {
    const {data, info} = await sharp(Buffer.from(svg)).removeAlpha().raw().toBuffer({resolveWithObject: true});
    let left = Infinity, right = -Infinity, count = 0;
    for (let y = 232; y < 735; y++) for (let x = 95; x < 925; x++) {
      const i = (y * info.width + x) * info.channels;
      if (data[i] > 160 && data[i + 1] > 160 && data[i + 2] > 160) {
        count++; left = Math.min(left, x); right = Math.max(right, x);
      }
    }
    assert.ok(count > 90000, app + ': primary glyph lacks visual weight');
    assert.ok(right - left >= 650 && right - left <= 755, app + ': primary glyph footprint drift');
    assert.ok(Math.abs((left + right) / 2 - 512) <= 20, app + ': primary glyph not centered');
  }
}
console.log('Hanzo app icons: canonical H, source equality, visual heft/centering and 32-1024px raster checks pass');

for (const option of HANZO_TEAM_OPTIONS) {
  const icon = getHanzoTeamOptionSVG(option);
  assert.equal(icon, readFileSync(new URL('../svg/apps/candidates/hanzo-team-'+option+'.svg', import.meta.url),'utf8'), option+': Team candidate SVG drift');
  for (const d of [...MARK_BLOCKS, ...MARK_SHADE]) assert.ok(icon.includes('d="' + d + '"'), option+': H path missing');
  for (const size of [32,64,128,256,512,1024]) {
    const {info} = await sharp(Buffer.from(icon)).resize(size,size).png().toBuffer({resolveWithObject:true});
    assert.equal(info.width,size);
    assert.equal(info.height,size);
  }
}
const bot = getHanzoAppIconSVG('bot');
assert.ok(bot.includes('x="278" y="454" width="156"'), 'Bot left eye dimensions drifted');
assert.ok(bot.includes('x="590" y="454" width="156"'), 'Bot right eye must be one eye width away');
console.log('Team candidates and Bot eye-spacing geometry verified');
