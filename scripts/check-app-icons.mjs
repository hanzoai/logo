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
  if(app!=='app'){
    const {data,info}=await sharp(Buffer.from(svg)).removeAlpha().raw().toBuffer({resolveWithObject:true});
    let left=Infinity,right=-Infinity,count=0;
    for(let y=232;y<735;y++)for(let x=95;x<925;x++){
      const idx=(y*info.width+x)*info.channels;
      if(data[idx]>160 && data[idx+1]>160 && data[idx+2]>160){
        left=Math.min(left,x);right=Math.max(right,x);count++;
      }
    }
    assert.ok(count>6000,app+': main glyph is not visibly present');
    assert.ok(right-left>=640 && right-left<=755,app+': central icon footprint drifted');
    assert.ok(Math.abs((left+right)/2-512)<=20,app+': main glyph is off-center');
  }
  for(const size of [32,64,128,1024]){
    const {info}=await sharp(Buffer.from(svg)).resize(size,size).png().toBuffer({resolveWithObject:true});
    assert.equal(info.width,size); assert.equal(info.height,size);
  }
}
console.log('Six canonical Hanzo app Dock icons: source parity, 7 paths and multi-size rendering passed');
