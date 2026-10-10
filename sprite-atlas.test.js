import {test} from 'node:test';import assert from 'node:assert/strict';import {cellBounds} from './sprite-atlas.js';
test('terrain cells crop transparent padding so collision floors match visible pixels',()=>{const a=new Uint8ClampedArray(8*8*4);for(let y=3;y<7;y++)for(let x=1;x<6;x++)a[(y*8+x)*4+3]=255;assert.deepEqual(cellBounds(a,8,8,1,1,0),{x:1,y:3,w:5,h:4});});
test('atlas cropping stays inside its own cell',()=>{const a=new Uint8ClampedArray(16*8*4);a[(4*16+12)*4+3]=255;assert.deepEqual(cellBounds(a,16,8,2,1,1),{x:12,y:4,w:1,h:1});assert.equal(cellBounds(a,16,8,2,1,0),null);});
