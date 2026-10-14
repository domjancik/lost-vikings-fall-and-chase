import test from 'node:test';
import assert from 'node:assert/strict';
import {terrainPlan,terrainMaterial} from '../../src/render/terrain-layout.js';
test('terrain uses one top boundary, side edges, quiet interior and a bottom edge',()=>{
 const p=terrainPlan(100,610,310,430);
 assert.ok(p.tiles.filter(t=>t.role==='top').every(t=>t.y===610));
 assert.ok(p.tiles.filter(t=>t.role==='infill').every(t=>[4,5].includes(t.column)&&t.y>=642));
 assert.ok(p.tiles.some(t=>t.role==='left')&&p.tiles.some(t=>t.role==='right')&&p.tiles.some(t=>t.role==='bottom'));
 assert.deepEqual(p.clip,{x:100,y:610,w:310,h:430});
 for(const t of p.tiles){assert.equal(t.w/t.sw,2);assert.equal(t.h/t.sh,2);}
});
test('short and partial platforms keep their authored collision bounds and grid scale',()=>{
 for(const w of [30,64,94,128,290]){const p=terrainPlan(62,250,w,64);assert.equal(p.clip.w,w);assert.ok(p.tiles.length);assert.ok(p.tiles.every(t=>t.y>=250));assert.ok(p.tiles.filter(t=>t.role==='top').every(t=>t.column<3));}
});
test('infill selection is deterministic and never includes ornamented top tiles',()=>{assert.deepEqual(terrainPlan(0,610,1440,430),terrainPlan(0,610,1440,430));for(let r=0;r<11;r++)assert.ok(terrainMaterial(r,'arcade')>=0&&terrainMaterial(r,'arcade')<8);});
test('moving platform draw positions remain on the two-unit pixel grid',()=>{const p=terrainPlan(10.7,250.37,63.7,39.6);for(const n of Object.values(p.clip))assert.equal(n%2,0);for(const t of p.tiles)for(const key of ['x','y','w','h'])assert.equal(t[key]%2,0);assert.ok(Math.abs(p.clip.y-250.37)<=1);});
