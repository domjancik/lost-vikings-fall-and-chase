import test from 'node:test';
import assert from 'node:assert/strict';
import {orbitScrapDepthPlan,orbitSceneryColor} from '../../src/levels/orbit/art-layout.js';

test('floating scenery occupies smaller native cells and separate depth planes',()=>{
 const plan=orbitScrapDepthPlan(0,{x:0,y:0});
 assert.equal(plan.middle.length,8);assert.equal(plan.far.length,12);
 for(const p of plan.middle){assert.equal(p.native,32);assert.equal(p.size,64);assert.equal(p.layer,'behind-middle');}
 for(const p of plan.far){assert.equal(p.native,24);assert.equal(p.size,48);assert.equal(p.layer,'behind-middle-and-scrap');}
 for(const p of [...plan.middle,...plan.far]){assert.equal(p.x%2,0);assert.equal(p.y%2,0);}
});
test('distant fragments respond to both camera axes and drift continuously on the pixel grid',()=>{
 const a=orbitScrapDepthPlan(10,{x:0,y:0}),b=orbitScrapDepthPlan(10,{x:200,y:200}),later=orbitScrapDepthPlan(11,{x:0,y:0});
 for(const layer of ['middle','far'])for(let n=0;n<a[layer].length;n++){
  assert.ok(b[layer][n].x>a[layer][n].x);assert.ok(b[layer][n].y>a[layer][n].y);
  assert.ok(Math.hypot(later[layer][n].x-a[layer][n].x,later[layer][n].y-a[layer][n].y)<20);
 }
 assert.ok(b.far[0].x-a.far[0].x>b.middle[0].x-a.middle[0].x);
});
test('background material has a restricted cool palette without bright hazard highlights',()=>{
 for(const input of [[0,0,0],[255,255,255],[220,140,40],[40,180,240]]){
  const color=orbitSceneryColor(...input);
  assert.ok(Math.max(...color)<=70);assert.ok(color[2]>color[0]);
 }
 const dark=orbitSceneryColor(0,0,0),light=orbitSceneryColor(255,255,255);
 assert.ok(light[2]-dark[2]<=22);
});
