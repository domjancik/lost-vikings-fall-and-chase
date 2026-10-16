import test from 'node:test';
import assert from 'node:assert/strict';
import * as scenery from '../../src/levels/pub/scenery.js';

test('storeroom partition joins the overhead beam to the door lintel without closing the doorway',()=>{
 const p=scenery.alehallRoomPartition();
 assert.equal(p.header.y,480);
 assert.equal(p.header.y+p.header.h,646);
 assert.ok(p.header.x<=1708&&p.header.x+p.header.w>=2400);
 assert.equal(p.doorway.y,646);assert.equal(p.doorway.y+p.doorway.h,760);
 assert.equal(p.doorway.x,1708);assert.equal(p.doorway.w,72);
 assert.equal(p.collision,false);
});

test('storeroom shadow respects the ceiling, doorway and floorboards, with a soft threshold',()=>{
 const amount=scenery.alehallRoomShade;
 assert.equal(amount(2100,600),0,'solid header has its own timber shading');
 assert.equal(amount(1690,720),0,'main room remains lit');
 assert.equal(amount(2100,800),0,'soil beneath floorboards is not a separate room');
 assert.equal(amount(2100,1200),0);
 assert.equal(amount(2100,700),1);
 const edge=[1774,1790,1806,1822,1838].map(x=>amount(x,720));
 assert.equal(edge[0],0);assert.equal(edge.at(-1),1);
 assert.ok(edge.slice(1,-1).every(a=>a>0&&a<1),'doorway penumbra has intermediate brightness');
 assert.ok(edge.every((a,i)=>!i||a>=edge[i-1]));
 assert.ok(amount(2100,774)>0&&amount(2100,774)<1);
 assert.equal(amount(2100,788),0);
});
