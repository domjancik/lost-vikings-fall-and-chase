import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,step} from './engine.js';
import {runCycleRoute} from './cycle-route.js';
import {advanceCycleCarrier} from './cycle-campaign.js';
test('routing gallery is above a shield-assisted jump from the low circuit',()=>{
 const s=createState(0,'cycle'),gallery=s.level.platforms.find(p=>p.x===1460);
 assert.ok(500-gallery.y>212);
});
test('a passing carrier does not collect heroes standing on a static deck',()=>{
 const s=createState(0,'cycle');s.machine.released=true;
 Object.assign(s.machine.carrier,{x:1500,y:s.level.platforms[2].y,segment:1,high:s.level.platforms[2].y,pause:0});
 Object.assign(s.heroes[2],{x:1560,y:s.machine.carrier.y-44,vy:0,support:null});
 advanceCycleCarrier(s,1/60);assert.equal(s.heroes[2].x,1560);
 step(s,{},1/60);assert.equal(s.heroes[2].x,1560);assert.equal(s.heroes[2].support,null);
});
test('three passengers share continuous carrier displacement through every corner',()=>{
 const s=createState(0,'cycle');s.machine.released=true;
 for(const h of s.heroes)Object.assign(h,{x:880+h.id*35,y:896,vy:0,support:'cycle-carrier'});
 let corners=0,segment=s.machine.carrier.segment;
 for(let n=0;n<5500;n++){
  const c=s.machine.carrier,old={x:c.x,y:c.y},positions=s.heroes.map(h=>({x:h.x,y:h.y}));
  advanceCycleCarrier(s,1/120);assert.ok(Math.hypot(c.x-old.x,c.y-old.y)<=1.501);
  for(const [i,h] of s.heroes.entries()){assert.ok(Math.abs(h.x-positions[i].x-(c.x-old.x))<1e-8);assert.ok(Math.abs(h.y-positions[i].y-(c.y-old.y))<1e-8);}
  if(segment!==c.segment){corners++;segment=c.segment;}
 }
 assert.ok(corners>=4);
});
test('three passengers remain aboard through a high circuit with full world physics',()=>{
 const s=createState(0,'cycle');s.machine.released=true;s.machine.selector=true;
 for(const h of s.heroes)Object.assign(h,{x:880+h.id*35,y:896,vy:0,ground:true,support:'cycle-carrier'});
 for(let n=0;n<5000&&s.machine.carrier.laps<1;n++){
  step(s,{},1/120);
  for(const h of s.heroes){assert.equal(h.support,'cycle-carrier');assert.ok(Math.abs(h.y+44-s.machine.carrier.y)<.01);assert.equal(h.hp,3);}
 }
 assert.equal(s.machine.carrier.laps,1);
});
test('selector reversal is queued until the next bottom-left dock',()=>{
 const s=createState(0,'cycle'),c=s.machine.carrier;s.machine.released=true;
 Object.assign(c,{x:1000,y:260,high:260,segment:1,pause:0});s.machine.selector=false;
 for(let n=0;n<1000;n++)advanceCycleCarrier(s,1/120);assert.equal(c.high,260);
 while(!(c.segment===0&&c.y===940&&c.pause===0))advanceCycleCarrier(s,1/120);
 advanceCycleCarrier(s,1/120);assert.equal(c.high,500);
});
test('a missed boarding drops to the recovery floor and every hero can climb back',()=>{
 for(const id of [0,1,2]){
  const s=createState(0,'cycle');s.active=id;Object.assign(s.heroes[id],{x:1000,y:1000,vy:0});
  for(let n=0;n<90;n++)step(s,{},1/120);assert.equal(s.heroes[id].y+44,1120);assert.equal(s.heroes[id].hp,3);
  while(s.heroes[id].x>665)step(s,{left:true},1/120);
  for(let n=0;n<540;n++)step(s,{up:true},1/120);assert.equal(s.heroes[id].y+44,500);
  step(s,{right:true},1/120);assert.equal(s.heroes[id].climbing,false);
 }
});
test('brake moves through intermediate poses after using its pin',()=>{
 const s=createState(0,'cycle');s.active=0;Object.assign(s.heroes[0],{x:1070,y:346});
 step(s,{interact:true},1/120);assert.ok(s.machine.brakePose>0&&s.machine.brakePose<1);
});
test('opening damper first cannot create airflow before brake withdrawal finishes',()=>{
 const s=createState(0,'cycle');s.active=0;s.machine.damper=1;s.machine.damperReleased=true;
 Object.assign(s.heroes[0],{x:1070,y:346});Object.assign(s.heroes[2],{x:1360,y:896,shieldUp:true});
 step(s,{interact:true},1/120);
 for(let n=0;n<30;n++)step(s,{},1/120);assert.equal(s.heroes[2].y,896);assert.ok(s.machine.brakePose<1);
 for(let n=0;n<90;n++)step(s,{},1/120);assert.ok(s.heroes[2].y<896);
});
test('cycle puzzle is an independent campaign with a real ladder and grounded docks',()=>{
 const s=createState(0,'cycle');assert.equal(s.level.mechanic,'cycle');
 assert.equal(s.level.worldWidth,2800);assert.ok(s.level.ladders.length);
 assert.equal(s.machine.carrier.x,850);assert.equal(s.machine.carrier.y,940);
});
for(const hz of [60,120])test('cycle full ordinary-control route, everyone alive at '+hz+' Hz',()=>{
 const {s,stages}=runCycleRoute(hz);assert.ok(s.won);assert.ok(s.heroes.every(h=>h.hp===3));assert.equal(stages.length,5);
});
test('any Viking can climb the maintenance ladder using directional controls',()=>{
 for(const id of [0,1,2]){
  const s=createState(0,'cycle');s.active=id;s.heroes[id].x=650;s.heroes[id].y=896;
  for(let n=0;n<420;n++)step(s,{up:true},1/120);
  assert.ok(s.heroes[id].y<600);assert.ok(!s.failed);
 }
});
test('draft raises an overhead shield continuously but not a front shield',()=>{
 for(const up of [false,true]){
  const s=createState(0,'cycle');s.active=2;s.machine.brake=true;s.machine.brakePose=1;s.machine.damper=1;s.machine.damperReleased=true;
  Object.assign(s.heroes[2],{x:1360,y:896,shieldUp:up});
  for(let n=0;n<240;n++)step(s,{},1/120);
  assert.equal(s.heroes[2].y<800,up);assert.ok(!s.failed);
 }
});
