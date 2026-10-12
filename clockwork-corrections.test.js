import test from 'node:test';import assert from 'node:assert/strict';
import {createState,step} from './engine.js';import * as clock from './clockwork-campaign.js';import {clockworkView} from './clockwork-view.js';
import {connectionPlan} from './connection-layout.js';
test('wheel center never folds backward and tangents remain continuous at rail joins',()=>{
 for(let p=560;p<1640;p+=.2)assert.ok(clock.clockWheelPose(p+.1).x>clock.clockWheelPose(p).x,'backward center at'+p);
 for(const p of [680,1050,1250,1640]){const a=clock.clockWheelPose(p-.01),b=clock.clockWheelPose(p),c=clock.clockWheelPose(p+.01);assert.ok(Math.abs(Math.hypot(b.x-a.x,b.y-a.y)-Math.hypot(c.x-b.x,c.y-b.y))<.0001,'speed jump at'+p);}
});
test('arc travel gives the same center distance on flat rail, descent and ascent',()=>{
 assert.equal(typeof clock.clockWheelAdvance,'function');
 for(const start of [600,750,1000,1200,1400]){let p=start,distance=0;for(let n=0;n<200;n++){const next=clock.clockWheelAdvance(p,.1),a=clock.clockWheelPose(p),b=clock.clockWheelPose(next);distance+=Math.hypot(a.x-b.x,a.y-b.y);p=next;}assert.ok(Math.abs(distance-20)<.02,'arc distance '+start+':'+distance);}
});
test('toothed train neighbors meet at pitch circles and clear unrelated platforms',()=>{
 assert.ok(clock.clockGearCenters);const centers=[{x:2460,y:840},...clock.clockGearCenters];
 for(let n=1;n<centers.length;n++){const a=centers[n-1],b=centers[n];assert.equal(Math.hypot(a.x-b.x,a.y-b.y),152);assert.ok(152<2*clock.CLOCK_RADIUS);}
});
test('the actual pitch-meshed transmission has renderable native connection segments',()=>{
 assert.ok(clock.clockGearPath);assert.doesNotThrow(()=>connectionPlan(clock.clockGearPath,'rail'));
});
test('remote pin breaking shows the captive and released Erik even with Baleog selected',()=>{
 const s=createState(3,'cycle');s.active=1;s.machine.wheel.occupied=true;s.machine.wheel.mode='docked';s.machine.pinBroken=true;s.machine.pinAt=s.time;s.machine.collapse=.3;
 assert.equal(clockworkView(s,{width:640,height:395}).split,true);
 s.time+=1.8;s.machine.collapse=1;s.machine.wheel.occupied=false;s.machine.wheel.mode='released';assert.equal(clockworkView(s,{width:640,height:395}).split,true);
 s.time+=3;assert.equal(clockworkView(s,{width:640,height:395}).split,false);
});
test('bottom staging cannot deploy an ascent ladder onto the upper-half service shelf',()=>{
 const s=createState(3,'cycle');Object.assign(s.heroes[2],{x:990,y:606,ground:true});for(let n=0;n<300;n++)step(s,{},1/120);
 assert.ok(!s.level.ladders.some(l=>l.x>=920&&l.x<=1460&&l.bottom>900));
});
test('open cup floor supports smooth walking to both inner edges and remains escapable',()=>{
 for(const direction of [-1,1]){const s=createState(3,'cycle'),h=s.heroes[0],b=s.machine.wheel;Object.assign(h,{x:b.x,y:b.y+clock.clockCupFloor(0)-44,ground:true,support:'clock-cup'});let previous=h.y;
  for(let n=0;n<80;n++){step(s,direction<0?{left:true}:{right:true},1/120);assert.equal(h.support,'clock-cup','lost floor at'+h.x);assert.ok(Math.abs(h.y-previous)<3,'cup floor snap '+n+':'+(h.y-previous)+' dx'+(h.x-b.x));previous=h.y;}
  assert.ok(Math.abs(h.x-b.x)>35);assert.ok(h.y<b.y+12,'floor rises to the rim');
  step(s,{jump:true,...(direction<0?{left:true}:{right:true})},1/120);for(let n=0;n<60;n++)step(s,direction<0?{left:true}:{right:true},1/120);assert.ok(Math.abs(h.x-b.x)>80,'cannot jump out');
 }
});
test('the short tower ladder reaches a real winding action which arms the arch catch gradually',()=>{
 const s=createState(3,'cycle');s.active=2;const o=s.heroes[2];Object.assign(o,{x:450,y:336,ground:true});step(s,{interact:true},1/120);assert.ok(!s.machine.catchWound);
 Object.assign(o,{x:450,y:256,ground:true,climbing:true});step(s,{interact:true},1/120);assert.ok(s.machine.winding);assert.ok(!s.machine.catchWound);
 for(let n=0;n<180;n++)step(s,{},1/120);assert.ok(s.machine.catchWound);
});
