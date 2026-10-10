import test from 'node:test';import assert from 'node:assert/strict';
import {labelLayout} from './text-render.js';
test('world labels retain a readable screen size on portrait and landscape',()=>{for(const scale of [.49,1.07,1.14]){const p=labelLayout({x:650,y:468,size:10},600,scale);assert.ok(p.fontSize>=11);assert.equal(p.x,50*scale);assert.equal(p.y,468*scale);}});
