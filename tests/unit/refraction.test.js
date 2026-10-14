import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,step} from '../../src/core/engine.js';
import {refractionBeam,advanceRefractionLift} from '../../src/levels/refraction/campaign.js';
import {runRefractionRoute} from '../routes/refraction-route.js';
import {refractionConnections} from '../../src/levels/refraction/connections.js';
import {connectionPlan} from '../../src/render/connection-layout.js';

test('second laboratory room is the independently authored Refraction Gate',()=>{
 const s=createState(1,'cycle');assert.equal(s.level.mechanic,'refraction');
 assert.equal(s.level.worldWidth,2800);assert.equal(s.level.floors[0].w,2800);
 assert.equal(s.machine.carrier.y,900);
});
test('a settling ray does not suddenly grow hundreds of world units',()=>{
 for(const id of [0,1,2]){
  const s=createState(1,'cycle');s.machine.poses=[1,1,1];s.machine.poses[id]=.999;
  const before=refractionBeam(s.machine)[id+1];s.machine.poses[id]=1;
  const after=refractionBeam(s.machine)[id+1];
  assert.ok(Math.hypot(before.to.x-after.to.x,before.to.y-after.to.y)<4,'continuous arrival at optic '+id);
 }
});
test('every authored mechanical connection can render without stopping gameplay',()=>{
 for(const c of refractionConnections)assert.doesNotThrow(()=>connectionPlan(c.points,c.style));
});
test('three inactive passengers retain contact during full lift ascent and return',()=>{
 const s=createState(1,'cycle');s.power=true;s.machine.carrier.pause=0;
 for(const h of s.heroes)Object.assign(h,{x:2110+h.id*38,y:856,ground:true,vy:0,support:'refraction-lift'});
 for(let n=0;n<1800;n++){
  const c=s.machine.carrier,oldY=c.y,old=s.heroes.map(h=>h.y);advanceRefractionLift(s,1/120);
  assert.ok(Math.abs(c.y-oldY)<=1.251);
  s.heroes.forEach((h,i)=>{assert.ok(Math.abs(h.y-old[i]-(c.y-oldY))<1e-8);assert.equal(h.y+44,c.y);});
 }
});
test('front shield is not lifted by the draft and a missed landing remains recoverable',()=>{
 for(const up of [false,true]){
  const s=createState(1,'cycle');s.active=2;s.machine.targets[0]=true;s.machine.poses[0]=1;
  Object.assign(s.heroes[2],{x:640,y:856,shieldUp:up});for(let n=0;n<120;n++)step(s,{},1/120);
  assert.equal(s.heroes[2].y<800,up);
  s.heroes[2].shieldUp=false;for(let n=0;n<360;n++)step(s,{},1/120);
  assert.equal(s.heroes[2].y+44,900);assert.equal(s.heroes[2].hp,3);
 }
});
for(const hz of [60,120])test('full refraction route with draft, shield jump and separate reunion trips at '+hz+' Hz',()=>{
 const {s,stages}=runRefractionRoute(hz);assert.ok(s.won);assert.deepEqual(s.heroes.map(h=>h.hp),[3,3,3]);assert.equal(stages.length,4);
});
test('mirror ray follows the displayed reflecting plane during its entire sweep',()=>{
 const s=createState(1,'cycle');s.machine.poses=[.5,0,0];
 const ray=refractionBeam(s.machine)[1];
 assert.ok(Number.isFinite(ray.plane),'ray declares visual mirror plane');
 const outgoing=Math.atan2(ray.to.y-ray.from.y,ray.to.x-ray.from.x);
 const first=refractionBeam(s.machine)[0],incoming=Math.atan2(first.to.y-first.from.y,first.to.x-first.from.x);
 assert.ok(Math.abs(outgoing-(2*ray.plane-incoming))<1e-8);
});
test('prealigning the last wheel before the upper wheel is valid',()=>{
 const s=createState(1,'cycle');s.active=0;Object.assign(s.heroes[0],{x:1360,y:656});
 step(s,{interact:true},1/120);assert.equal(s.machine.targets[2],true);
 s.machine.targets[0]=true;s.machine.catchBroken=true;
 s.active=2;Object.assign(s.heroes[2],{x:860,y:346});step(s,{interact:true},1/120);
 for(let n=0;n<400;n++)step(s,{},1/120);assert.equal(s.power,true);
});
test('a glass catch releases its mirror smoothly and draft awaits settled angle',()=>{
 const s=createState(1,'cycle');s.active=1;Object.assign(s.heroes[1],{x:545,y:856});
 step(s,{sword:true},1/120);assert.equal(s.machine.catchBroken,true);
 assert.ok(s.machine.poses[0]>0&&s.machine.poses[0]<1);assert.equal(s.machine.draft,false);
 for(let n=0;n<120;n++)step(s,{},1/120);
 assert.equal(s.machine.poses[0],1);assert.equal(s.machine.draft,true);
});
test('unlit mirror controls do not power receiver out of sequence',()=>{
 const s=createState(1,'cycle');s.machine.targets=[false,true,true];
 for(let n=0;n<480;n++)step(s,{},1/120);
 assert.equal(s.power,false);assert.equal(s.machine.charge,0);
});
