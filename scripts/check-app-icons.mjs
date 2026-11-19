import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { HANZO_APP_IDS, getHanzoAppIconSVG } from '../dist/app-icons.js';
import { MARK_BLOCKS, MARK_SHADE } from '../dist/logos.js';
for (const app of HANZO_APP_IDS) {
  const content = getHanzoAppIconSVG(app);
  const expected = readFileSync(new URL('../svg/apps/hanzo-' + app + '.svg', import.meta.url), 'utf8');
  assert.equal(content, expected, app + ': source/generator mismatch');
  for (const d of [...MARK_BLOCKS, ...MARK_SHADE]) assert.ok(content.includes('d="' + d + '"'), app + ': missing H path');
  assert.equal((content.match(/transform="translate\(/g) || []).length, 1);
  assert.ok(!content.includes('url(#shadow)'));
}
console.log('Six canonical app Dock SVGs validated');
