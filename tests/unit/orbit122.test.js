import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,step} from '../../src/core/engine.js';
import {simulateOrbitRoute} from '../routes/orbit-route113.js';

test('the overhead rail spans a real service gap with a lower recovery route',()=>{
 const s=createState(8,'cycle'),floors=s.level.floors;
 assert.ok(!floors.some(f=>f.y===650&&1920>=f.x&&1920<=f.x+f.w),'gallery must not bypass ceiling traversal');
 assert.ok(floors.some(f=>f.y===1180&&1920>=f.x&&1920<=f.x+f.w));
 assert.ok(s.level.ladders.some(l=>l.top===650&&l.bottom===1180));
 const roof=s.machine.roofs[0];assert.ok(roof.x-roof.w/2<1800&&roof.x+roof.w/2>2060);
});

test('Baleog cannot walk across the gap with magnets off, and can recover below',()=>{
 const s=createState(8,'cycle'),h=s.heroes[1];s.active=1;s.machine.safety=true;
 Object.assign(h,{x:1860,y:606,vx:0,vy:0,ground:true});
 for(let n=0;n<120;n++)step(s,{right:true},1/120);
 assert.ok(h.y+44>750,'walking alone must drop into the service gap');
 assert.ok(!h.dead);
 for(let n=0;n<240;n++)step(s,{},1/120);
 assert.equal(h.y+44,1180);
 for(let n=0;n<360&&h.x>1780;n++)step(s,{left:true},1/120);
 for(let n=0;n<30;n++)step(s,{},1/120);
 for(let n=0;n<480;n++)step(s,{up:true},1/120);
 assert.equal(h.y+44,650,'the existing ladder must return a fallen Viking to the left landing');
 assert.ok(!s.failed);
});

test('normal controls use the ceiling crossing to bring both non-jumping Vikings to the second carrier',()=>{
 for(const hz of [60,120]){
  const r=simulateOrbitRoute(hz);
  assert.equal(r.won,true);assert.deepEqual(r.hp,[3,3,3]);
  const cross=r.milestones.find(m=>m.name==='ceiling-crossing');
  assert.ok(cross,'route must record the actual service-gap crossing');
  for(const id of [1,2])assert.ok(cross.heroes[id].x>=2060&&Math.abs(cross.heroes[id].y+44-650)<2);
 }
});
