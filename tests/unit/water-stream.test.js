import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,step} from '../../src/core/engine.js';

function shelteredAt(x,hz=60,ticks=90){
 const s=createState(4,'cycle');
 Object.assign(s.heroes[2],{x,y:516,vy:0,shieldUp:true,ground:false});
 for(let n=0;n<ticks;n++)step(s,{},1/hz);
 return s;
}
test('entering the inlet shield overlap produces partial shelter, rather than a location switch',()=>{
 const outside=shelteredAt(650),edge=shelteredAt(680),inside=shelteredAt(700),center=shelteredAt(710);
 assert.equal(outside.machine.shelter,0);
 assert.ok(edge.machine.shelter>.1&&edge.machine.shelter<.7);
 assert.ok(inside.machine.shelter>edge.machine.shelter&&inside.machine.shelter<center.machine.shelter);
 assert.ok(center.machine.shelter>.99);
});
test('shield entry and exit attenuate stream force continuously at60/120Hz',()=>{
 for(const hz of [60,120]){
  const s=createState(4,'cycle'),o=s.heroes[2];Object.assign(o,{x:710,y:516,shieldUp:true,ground:false});
  let previous=0;
  for(let n=0;n<hz;n++){
   step(s,{},1/hz);assert.ok(Number.isFinite(s.machine.shelter));
   assert.ok(s.machine.shelter>=previous&&s.machine.shelter-previous<=6/hz+.0001);previous=s.machine.shelter;
  }
  o.shieldUp=false;step(s,{},1/hz);
  assert.ok(s.machine.shelter>0&&s.machine.shelter<previous);
  assert.ok(previous-s.machine.shelter<=6/hz+.0001);
 }
});
test('partially intercepted current applies an intermediate downstream force',()=>{
 const positions=[];
 for(const x of [650,680,710]){
  const s=shelteredAt(x),e=s.heroes[0];Object.assign(e,{x:710,y:880,vx:0,vy:0,ground:false});
  const before=e.x;step(s,{},1/60);positions.push(before-e.x);
 }
 assert.ok(positions[0]>positions[1]&&positions[1]>positions[2]+.1);
});
