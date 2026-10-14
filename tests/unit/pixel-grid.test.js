import test from 'node:test';import assert from 'node:assert/strict';
import {WORLD_PIXEL,rasterSize,snapPixel} from '../../src/render/pixel-grid.js';
test('all game artwork shares an integer world pixel grid',()=>{assert.equal(WORLD_PIXEL,2);for(const width of [365,1440,1710]){const r=rasterSize(width,790);assert.equal(r.height*WORLD_PIXEL,790);assert.ok(r.width*WORLD_PIXEL>=width&&r.width*WORLD_PIXEL-width<WORLD_PIXEL);}assert.equal(snapPixel(635.7),636);assert.equal(snapPixel(-1.4),-2);});
