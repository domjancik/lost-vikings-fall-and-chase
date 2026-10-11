import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,step} from './engine.js';

for(const hz of [60,120])for(const direction of ['right','left']){
 test(`shield passengers inherit platform movement ${direction} at ${hz}Hz`,()=>{
  const s=createState(0,'cycle');s.active=2;s.machine.released=true;
  const c=s.machine.carrier,o=s.heroes[2];
  Object.assign(c,{x:direction==='right'?900:2000,y:direction==='right'?500:940,segment:direction==='right'?1:3,high:500,pause:0});
  Object.assign(o,{x:c.x+70,y:c.y-44,ground:true,vy:0,support:'cycle-carrier',shieldUp:true,shield:true});
  for(const h of s.heroes.slice(0,2))Object.assign(h,{x:o.x+(h.id?12:-12),y:o.y-80,ground:true,vy:0,support:2});
  const offsets=s.heroes.slice(0,2).map(h=>h.x-o.x),start=o.x;
  for(let n=0;n<hz*4;n++){
   step(s,{},1/hz);
   assert.equal(o.support,'cycle-carrier');
   for(const [i,h]of s.heroes.slice(0,2).entries()){
    assert.equal(h.support,2,'passenger slipped off shield');
    assert.ok(Math.abs((h.x-o.x)-offsets[i])<1e-8,'horizontal contact drift');
    assert.equal(h.y,o.y-80);assert.equal(h.hp,3);
   }
  }
  assert.ok(Math.abs(o.x-start)>300);
 });
}

test('jumping off a carried shield detaches instead of inheriting its motion',()=>{
 const s=createState(0,'cycle');s.active=0;s.machine.released=true;
 const c=s.machine.carrier,o=s.heroes[2],e=s.heroes[0];
 Object.assign(c,{x:900,y:500,segment:1,high:500,pause:0,v:180});
 Object.assign(o,{x:970,y:456,ground:true,support:'cycle-carrier',shieldUp:true,shield:true});
 Object.assign(e,{x:970,y:376,ground:true,support:2});
 step(s,{jump:true},1/60);
 assert.equal(e.support,null);assert.ok(e.vy<0);assert.equal(e.x,970);
 assert.ok(o.x>970);
});

test('two shield riders remain attached through a full carrier circuit and corners',()=>{
 const s=createState(0,'cycle');s.active=2;s.machine.released=true;
 const c=s.machine.carrier,o=s.heroes[2];
 Object.assign(o,{x:920,y:896,ground:true,support:'cycle-carrier',shieldUp:true,shield:true});
 for(const h of s.heroes.slice(0,2))Object.assign(h,{x:o.x+(h.id?12:-12),y:o.y-80,ground:true,support:2});
 for(let n=0;n<9000&&c.laps<1;n++){
  step(s,{},1/120);assert.equal(o.support,'cycle-carrier');
  for(const h of s.heroes.slice(0,2)){
   assert.equal(h.support,2);assert.ok(Math.abs(h.x-o.x-(h.id?12:-12))<1e-8);
   assert.equal(h.y,o.y-80);assert.equal(h.hp,3);
  }
 }
 assert.equal(c.laps,1);
});
