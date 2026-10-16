import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,step} from '../../src/core/engine.js';
import {alehallObjects,alehallSurfaces,alehallBerthSteps} from '../../src/levels/pub/campaign.js';
import {ALEHALL_CASK,ALEHALL_DELIVERY_X} from '../../src/levels/pub/layout.js';
const fresh=()=>createState(11,'cycle');
const run=(s,input={},seconds=.1)=>{for(let n=0;n<seconds*120;n++)step(s,input,1/120);};
test('the sled berth has explicitly authored small walkable treads',()=>{
 const s=fresh();s.machine.cart.x=ALEHALL_CASK.park;
 assert.deepEqual(alehallSurfaces(s).filter(p=>p.y>706&&p.y<760),alehallBerthSteps);
 assert.ok(alehallBerthSteps.every(p=>p.y>=720&&p.y<=748&&p.w>0));
 assert.ok(alehallBerthSteps.filter(p=>p.y===748).every(p=>p.w===36),'broad lowest treads allow walking up from the parked pushing position');
});
test('nearby patrons volunteer bow, sword, key and run-bash invitations without USE or hints',()=>{
 for(const [id,x,flags,word]of [[1,900,{},'arrow'],[1,ALEHALL_DELIVERY_X-60,{targetHit:true},'lashing'],[0,940,{cart:{x:ALEHALL_CASK.park,y:706,w:96,parked:true}},'shield'],[0,390,{},'run']]){
  const s=fresh();s.active=id;s.heroes[id].x=x;s.time=8;Object.assign(s.machine,flags);run(s,{},.05);
  assert.match(s.machine.dialogue.text,new RegExp(word,'i'));
 }
});
test('a first-time nearby invitation is not swallowed by the opening greeting',()=>{
 const s=fresh();s.active=1;run(s,{},.05);assert.match(s.machine.dialogue.text,/arrow/i);
});
test('Erik can perform a real running bash on the padded straw butt; standing alt does not count',()=>{
 const s=fresh();s.active=0;const e=s.heroes[0];e.x=235;e.face=-1;run(s,{action:true},.1);assert.equal(s.machine.bashHit,false);
 e.x=360;run(s,{left:true},.4);step(s,{left:true,action:true},1/120);run(s,{left:true},.4);
 assert.equal(s.machine.bashHit,true);assert.equal(s.impact.kind,'bash');assert.ok(s.machine.bashPose>0);
});
test('the pub teaches a telegraphed retryable shield block, without health loss or story flags',()=>{
 const s=fresh(),o=s.heroes[2];s.active=2;o.x=1390;o.face=1;o.shieldUp=false;s.machine.served=true;
 alehallObjects(s).find(x=>x.id==='serve').run();assert.equal(s.machine.defense.phase,'windup');
 run(s,{},.8);assert.equal(s.shots.length,0);run(s,{},.9);
 assert.equal(s.machine.defenseBlocks,1);assert.equal(s.machine.defense.phase,'blocked');assert.deepEqual(s.heroes.map(h=>h.hp),[3,3,3]);
 const missed=fresh();missed.active=2;missed.machine.served=true;missed.heroes[2].x=1390;missed.heroes[2].shieldUp=true;
 alehallObjects(missed).find(x=>x.id==='serve').run();run(missed,{},3);assert.equal(missed.machine.defenseBlocks,0);assert.equal(missed.machine.defense.phase,'missed');
 alehallObjects(missed).find(x=>x.id==='serve').run();assert.equal(missed.machine.defense.phase,'windup');
});
test('serving records the shield position before Olaf walks away',()=>{
 const s=fresh();s.active=2;s.heroes[2].x=1390;s.machine.cups.mode='carried';
 alehallObjects(s).find(x=>x.id==='serve').run();assert.deepEqual(s.machine.cups.from,{x:1390,y:716});
});
test('a previously deflected cup landing cannot mark a new throw as missed',()=>{
 const s=fresh();s.machine.defense={phase:'flight',at:0};
 // Isolate the old landing from a genuine collision with the relocated crew.
 for(const h of s.heroes)h.x=620+h.id*40;
 s.shots=[{kind:'hall-cup',x:1550,y:753,v:90,vy:110,spin:0,life:1,bounced:true},{kind:'hall-cup',x:1460,y:726,v:-240,vy:-35,spin:0,life:3}];
 step(s,{},1/60);assert.equal(s.machine.defense.phase,'flight');
});
