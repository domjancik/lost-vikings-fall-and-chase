import test from 'node:test';
import assert from 'node:assert/strict';
import * as outlet from '../../src/levels/sewer/outlet.js';
import {createState,step} from '../../src/core/engine.js';
import {drawHeroFeedback} from '../../src/app/hero-feedback.js';

test('the visible current ends inside the measured native pipe opening',()=>{
 const end=outlet.sewerOutletPoint(1),mouth=outlet.SEWER_OUTLET.mouth;
 assert.equal(end.x,mouth.x);assert.equal(end.y,mouth.y);
 assert.ok(end.radius<mouth.radius);
 for(let n=1;n<=100;n++){const a=outlet.sewerOutletPoint((n-1)/100),b=outlet.sewerOutletPoint(n/100);assert.ok(b.x>a.x);assert.ok(b.y>=a.y);}
});
test('each Viking follows the current into the mouth and recedes before disappearing',()=>{
 for(const hz of [60,120])for(const id of [0,1,2]){
  const s=createState(10,'cycle');s.machine.lurkers=[];Object.assign(s.heroes[id],{x:2790,y:716,ground:true});s.active=id;
  let depthSeen=false,smallSeen=false,previous={x:2790,y:716};
  for(let n=0;n<4*hz&&!s.heroes[id].sweptAway;n++){
   step(s,{},1/hz);const h=s.heroes[id];assert.ok(Math.hypot(h.x-previous.x,h.y-previous.y)<10,'continuous travel, no frame cover or teleport');previous={x:h.x,y:h.y};
   if(h.escapePose?.depth>0){depthSeen=true;smallSeen ||= h.escapePose.scale<.4;const m=outlet.SEWER_OUTLET.mouth;assert.ok(Math.hypot(h.escapePose.center.x-m.x,h.escapePose.center.y-m.y)<m.radius);}
  }
  assert.ok(depthSeen&&smallSeen);assert.ok(s.heroes[id].sweptAway);assert.ok(s.machine.escapeTravel[id]>=440);assert.equal(s.heroes[id].hp,3);
 }
});
test('capture starts at the current Viking position and all three reach the same throat',()=>{
 const s=createState(10,'cycle');s.machine.lurkers=[];
 for(const h of s.heroes)Object.assign(h,{x:2790+h.id*4,y:716,ground:true});
 for(let n=0;n<400&&!s.won;n++)step(s,{},1/120);
 assert.ok(s.won);for(const h of s.heroes){assert.equal(h.escapePose.depth,1);assert.equal(h.escapePose.scale,0);assert.deepEqual(h.escapePose.center,outlet.SEWER_OUTLET.throat);}
});
test('jumping above the visible current does not capture a Viking until actual water contact',()=>{
 const s=createState(10,'cycle');s.machine.lurkers=[];const h=s.heroes[0];Object.assign(h,{x:2790,y:680,vy:0,ground:false});
 for(let n=0;n<6;n++)step(s,{},1/120);assert.equal(s.machine.captured[0],false);
 assert.ok(h.y+44<outlet.sewerOutletSurface(h.x));
 for(let n=0;n<120&&!s.machine.captured[0];n++)step(s,{},1/120);
 assert.ok(s.machine.captured[0]);assert.ok(h.escapeOrigin.y+44>=outlet.sewerOutletSurface(h.escapeOrigin.x));
});
test('late entries preserve their origin and settle into the mouth before depth recession',()=>{
 for(const x of [3090,3120,3140,3152]){
  const origin={x,y:820},first=outlet.sewerOutletJourney(origin,0);
  assert.ok(Math.abs(first.center.x-x)<.001);assert.ok(Math.abs(first.sole.y-(origin.y+44))<.001);assert.equal(first.scale,1);
  let previous=first;
  for(let d=2;d<first.total;d+=2){const p=outlet.sewerOutletJourney(origin,d);assert.ok(Math.hypot(p.sole.x-previous.sole.x,p.sole.y-previous.sole.y)<10);if(p.depth>0)assert.ok(Math.hypot(p.center.x-outlet.SEWER_OUTLET.mouth.x,p.center.y-outlet.SEWER_OUTLET.mouth.y)<outlet.SEWER_OUTLET.mouth.radius);previous=p;}
 }
});
test('noninteractive swept Vikings have no oversized world markers outside the pipe',()=>{
 const marks=[];drawHeroFeedback({level:{mechanic:'sewer'},machine:{captured:[true,false,false]},active:0,heroes:[{id:0,x:3152,y:820,hp:3}]},(...a)=>marks.push(a),(...a)=>marks.push(a));assert.deepEqual(marks,[]);
});
test('actors beside or below the visible current are not pulled back into it',()=>{
 for(const position of [{x:3190,y:820},{x:2800,y:900}]){
  const s=createState(10,'cycle');s.machine.lurkers=[];Object.assign(s.heroes[0],{...position,ground:false,vy:0});step(s,{},1/120);assert.equal(s.machine.captured[0],false);
 }
});
