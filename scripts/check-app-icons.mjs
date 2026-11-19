import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import sharp from 'sharp';
import { HANZO_APP_IDS, getHanzoAppIconSVG } from '../dist/app-icons.js';
import { MARK_BLOCKS, MARK_SHADE } from '../dist/logos.js';
for(const app of HANZO_APP_IDS){
  const svg=getHanzoAppIconSVG(app);
  const expected=readFileSync(new URL('../svg/apps/hanzo-'+app+'.svg',import.meta.url),'utf8');
  assert.equal(svg,expected,app+': checked-in SVG must match generator');
  for(const p of [...MARK_BLOCKS,...MARK_SHADE]) assert.ok(svg.includes('d="'+p+'"'),app+': missing canonical H path');
  assert.ok(!svg.includes('url(#metal)'),app+': IDs must be scoped');
  assert.ok(!svg.includes('url(#glyphshadow)'),app+': IDs must be scoped');
  if(app==='app') assert.ok(!svg.includes('translate(745 760)'), 'App cannot have corner badge');
  else assert.ok(svg.includes('translate(745 760) scale(2.31)'),app+': complete borderless corner H missing');
  for(const size of [32,64,128,1024]){
    const {info}=await sharp(Buffer.from(svg)).resize(size,size).png().toBuffer({resolveWithObject:true});
    assert.equal(info.width,size); assert.equal(info.height,size);
  }
}
console.log('Six canonical Hanzo app Dock icons: source parity, 7 paths and multi-size rendering passed');
