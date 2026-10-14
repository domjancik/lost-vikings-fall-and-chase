import test from 'node:test';import assert from 'node:assert/strict';
import {cellFoot,groundedPlacement} from '../../src/render/sprite-atlas.js';
const pixels=(w,h,rows)=>{const a=new Uint8ClampedArray(w*h*4);for(const [y,xs] of rows)for(const x of xs)a[(y*w+x)*4+3]=255;return a;};
test('bottom detection ignores isolated alpha noise beneath a broad base',()=>{const a=pixels(16,16,[[11,[3,4,5,6,7,8,9,10]],[14,[7]]]);assert.deepEqual(cellFoot(a,16,16,1,1,0),{bottom:12,cellHeight:16});});
test('grounded entity aligns visible bottom to the nearest supporting platform without resizing',()=>{const rect={x:1296,y:812,w:128,h:128},foot={bottom:60,cellHeight:64};const p=groundedPlacement(rect,foot,[{x:0,y:1120,w:2800},{x:1280,y:940,w:160},{x:1000,y:850,w:180}]);assert.equal(p.y,820);assert.equal(p.visibleBottom,940);assert.equal(p.surface.y,940);assert.equal(p.w,128);assert.equal(p.h,128);});
test('missing support is explicit, and translated support updates the anchor',()=>{const r={x:100,y:100,w:64,h:64},f={bottom:28,cellHeight:32};assert.equal(groundedPlacement(r,f,[{x:0,y:200,w:50}]),null);assert.equal(groundedPlacement(r,f,[{x:90,y:240,w:100}]).visibleBottom,240);});
