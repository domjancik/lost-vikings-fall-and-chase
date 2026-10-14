import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {connectionPlan} from '../../src/render/connection-layout.js';
test('all fixed clockwork connection paths are renderable and use existing native styles',()=>{
 const src=fs.readFileSync('src/levels/clockwork/render.js','utf8');let count=0;
 for(const m of src.matchAll(/drawConnection\(ctx,(\[\[\d[^;]+?\]\]),'([^']+)'\)/g)){const points=JSON.parse(m[1]);assert.doesNotThrow(()=>connectionPlan(points,m[2]));count++;}
 assert.ok(count>=4);
});
test('clockwork exit uses a registered native gate aperture',()=>{
 const src=fs.readFileSync('src/levels/clockwork/render.js','utf8');assert.match(src,/aperture:\{x:3090,y:476,w:40,h:80\}/);assert.match(src,/x:3026,y:402,w:128,h:128/);
});
