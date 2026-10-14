import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,step} from '../../src/core/engine.js';
import {wardenLevel} from '../../src/levels/warden/campaign.js';
const cache=await import('../../src/levels/warden/render-cache.js').catch(()=>null);
test('rotated machinery uses tight buffers that contain all pivot-transformed corners',()=>{
 assert.ok(cache?.rotationBounds,'Missing tight rotation planner');
 const r=[0,32,320,124],anchor=[0,4];
 const b=cache.rotationBounds(r,anchor,0);
 assert.ok(b.w*b.h<50000,'Body should not use its old 695px square');
 for(const angle of [0,.06,Math.PI/2,-Math.PI/3]){
  const box=cache.rotationBounds(r,anchor,angle);
  for(const [x,y]of [[0,0],[320,0],[0,124],[320,124]]){
   const dx=x-anchor[0],dy=y-anchor[1],xx=dx*Math.cos(angle)-dy*Math.sin(angle),yy=dx*Math.sin(angle)+dy*Math.cos(angle);
   assert.ok(xx>=box.x&&xx<=box.x+box.w&&yy>=box.y&&yy<=box.y+box.h);
  }
 }
});
test('rotation cache remains bounded and keeps recently used machinery',()=>{
 assert.ok(cache?.createRenderCache);
 const c=cache.createRenderCache(3);c.set('a',1);c.set('b',2);c.set('c',3);assert.equal(c.get('a'),1);c.set('d',4);
 assert.equal(c.size,3);assert.equal(c.get('b'),undefined);assert.equal(c.get('a'),1);
});
test('fixed scenery requests only viewport-intersecting native chunks',()=>{
 assert.ok(cache?.visibleChunks);
 const chunks=cache.visibleChunks({x:1100,y:700,width:420,height:194},{worldWidth:3000,worldTop:100,worldBottom:1200});
 assert.ok(chunks.length<=4);
 for(const p of chunks){assert.ok(p.x<1520&&p.x+p.w>1100&&p.y<894&&p.y+p.h>700);assert.equal(p.x%2,0);}
});
test('released cradle boarding ladder is dynamic while fixed service ladders remain cached',()=>{
 assert.ok(cache?.partitionLadders);
 const s=createState(5,'cycle');s.machine.disabled=true;s.machine.release=1;step(s,{},1/120);
 const layers=cache.partitionLadders(s.level.ladders,wardenLevel.ladders);
 assert.equal(layers.static.length,4);assert.equal(layers.dynamic.length,1);assert.equal(layers.dynamic[0].x,s.machine.cargo.x+20);
 s.machine.cargo.distance=100;step(s,{},1/120);assert.deepEqual(cache.partitionLadders(s.level.ladders,wardenLevel.ladders).dynamic,[]);
});
