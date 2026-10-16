import test from 'node:test';import assert from 'node:assert/strict';
import {createState,step} from '../../src/core/engine.js';import {alehallSurfaces} from '../../src/levels/pub/campaign.js';import {ALEHALL_CASK} from '../../src/levels/pub/layout.js';
for(const hz of [60,120]){
 test('Vikings walk through the moving and parked barrel area on the room floor at '+hz+'Hz',()=>{
  for(const id of [0,1,2])for(const parked of [false,true])for(const dir of [-1,1]){
   const s=createState(11,'cycle'),h=s.heroes[id];s.active=id;const x=parked?ALEHALL_CASK.park:ALEHALL_CASK.start;s.machine.cart.x=x;s.machine.cart.parked=parked;
   Object.assign(h,{x:x-dir*170,y:716,ground:true,face:dir,shieldUp:id===2});
   for(let n=0;n<hz*2.5;n++){step(s,dir>0?{right:true}:{left:true},1/hz);assert.equal(h.y+44,760,'no stair climb or barrel landing');assert.notEqual(h.support,'hall-cart');}
   assert.ok((h.x-x)*dir>120,'can walk all the way past');assert.equal(s.machine.cart.x,x,'walking does not move the barrel');
  }
 });
 test('jumping over the barrel lands on the floor, never a hidden barrel surface at '+hz+'Hz',()=>{
  const s=createState(11,'cycle'),h=s.heroes[0];s.active=0;h.x=s.machine.cart.x;
  for(let n=0;n<hz*2;n++)step(s,{jump:n===0},1/hz);
  assert.equal(h.y+44,760);assert.equal(h.support,null);
 });
 test('only Olaf with shield forward pushes, and another Viking does not block him at '+hz+'Hz',()=>{
  for(const id of [0,1,2])for(const raised of [false,true]){
   const s=createState(11,'cycle'),h=s.heroes[id];s.active=id;Object.assign(h,{x:ALEHALL_CASK.start+80,y:716,face:-1,shieldUp:raised});s.heroes[(id+1)%3].x=ALEHALL_CASK.start-20;
   for(let n=0;n<hz*3;n++)step(s,{left:true},1/hz);
   const pushes=id===2&&!raised;assert.equal(s.machine.cart.x,pushes?ALEHALL_CASK.park:ALEHALL_CASK.start);assert.equal(s.machine.cart.parked,pushes);
  }
 });
}
test('the pub exposes only real architecture as walking surfaces',()=>{
 const s=createState(11,'cycle');assert.deepEqual(alehallSurfaces(s),[...s.level.floors,...s.level.platforms]);
});
test('Olaf cannot push a floor barrel while airborne',()=>{
 const s=createState(11,'cycle');s.active=2;Object.assign(s.heroes[2],{x:ALEHALL_CASK.start+80,y:690,ground:false,face:-1,shieldUp:false});step(s,{left:true},1/60);assert.equal(s.machine.cart.x,ALEHALL_CASK.start);
});
