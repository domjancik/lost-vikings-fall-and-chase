import test from 'node:test';import assert from 'node:assert/strict';
import {createState} from './engine.js';
import {step} from './engine.js';
import {simulateLoomRoute} from './loom-route96.js';
const loom=await import('./loom-campaign96.js').catch(()=>null);
function state(){const s=createState();loom.setupLoom(s);return s;}
test('exhaust responds continuously to actual front shield contact, not a ready toggle',()=>{
 assert.ok(loom);const s=state(),o=s.heroes[2];o.x=565;o.face=-1;
 assert.ok(loom.loomExhaust(s).blocked>0);o.shieldUp=true;assert.equal(loom.loomExhaust(s).blocked,0);
 o.shieldUp=false;assert.ok(loom.loomExhaust(s).blocked>0);o.x=1300;assert.equal(loom.loomExhaust(s).blocked,0);
});
test('thread must sweep through a real aperture, proximity and wrong order do not count',()=>{
 assert.ok(loom);const s=state();s.machine.owner=0;
 loom.threadSweep(s,{x:1610,y:800},{x:1670,y:800});assert.equal(s.machine.guides,0);
 loom.threadSweep(s,{x:2180,y:722},{x:2240,y:722});assert.equal(s.machine.guides,0);
 loom.threadSweep(s,{x:1610,y:745},{x:1670,y:745});assert.equal(s.machine.guides,0,'Bobbin body would overlap the taller aperture rim');
 loom.threadSweep(s,{x:1610,y:720},{x:1670,y:720});assert.equal(s.machine.guides,1);
 loom.threadSweep(s,{x:2180,y:722},{x:2240,y:722});assert.equal(s.machine.guides,2);
});
test('pressure and shuttles coast continuously and a completed ratchet permits all crew to leave',()=>{
 assert.ok(loom);const s=state();s.machine.pressure=1;s.machine.released=true;s.machine.owner=0;s.machine.guides=2;s.machine.docked=true;s.machine.bobbin={x:2450,y:852};
 const x=s.machine.shuttle.x;for(let i=0;i<960;i++){const before=s.machine.shuttle.x;loom.loomStep(s,{},1/120);assert.ok(Math.abs(s.machine.shuttle.x-before)<2);}
 assert.notEqual(s.machine.shuttle.x,x);assert.ok(s.machine.exitLatched);
 s.machine.pressure=0;for(let i=0;i<120;i++)loom.loomStep(s,{},1/120);assert.ok(s.machine.exitLatched);assert.equal(s.machine.exitPose,1);
});
test('normal movement, shield, bow and use inputs reunite the entire healthy crew',()=>{
 const route=simulateLoomRoute();assert.ok(route.won);assert.deepEqual(route.hp,[3,3,3]);
 assert.ok(route.time>60&&route.time<100);
 assert.deepEqual(route.milestones.filter(p=>p.name.includes('thread-seated')).map(p=>p.machine.guides),[1,2]);
});
test('a missed jump retains the carried thread on the recovery floor without a reset teleport',()=>{
 const s=createState(6,'cycle'),g=s.machine,h=s.heroes[0];g.released=true;g.owner=0;g.guides=1;h.x=1660;h.y=920;h.ground=false;h.vy=200;g.bobbin=loom.bobbinHand(h);
 for(let n=0;n<180;n++){const before={...g.bobbin};step(s,{},1/120);assert.ok(Math.hypot(g.bobbin.x-before.x,g.bobbin.y-before.y)<=7.51);}
 assert.equal(h.y+44,1120);assert.equal(g.owner,0);assert.equal(g.guides,1);assert.ok(Math.abs(g.bobbin.x-h.x)<25);assert.ok(!s.failed);
});
test('a downward beater causes damage and persistent exposure can kill; retry resets the machine',()=>{
 const s=createState(6,'cycle'),h=s.heroes[0];s.machine.phase=3.3/4.8*Math.PI*2;h.x=1620;h.y=820;h.ground=false;
 step(s,{},1/120);assert.equal(h.hp,2);assert.ok(h.invulnerable>0);
 for(let n=0;n<2;n++){h.invulnerable=0;h.x=1620;h.y=820;step(s,{},1/120);}
 assert.ok(h.dead&&s.failed);const retry=createState(6,'cycle');assert.ok(retry.heroes.every(h=>h.hp===3&&!h.dead));assert.equal(retry.machine.guides,0);
});
test('a piston reverses its actual velocity gradually when pressure falls',()=>{
 const s=createState(6,'cycle'),g=s.machine;g.pressure=220/380*.7;g.lift.y=900;g.lift.v=-110;
 loom.loomStep(s,{},1/120);assert.ok(g.lift.v<0);assert.ok(g.lift.y<900,'Still moving up while its velocity decelerates toward the new downward target');
});
test('a bobbin cannot be taken before its visible retaining pawl finishes retracting',()=>{
 const s=createState(6,'cycle');s.machine.released=true;assert.equal(loom.loomObjects(s)[0].ready,false);
 for(let n=0;n<90;n++)loom.loomStep(s,{},1/120);assert.equal(s.machine.latchPose,1);assert.equal(loom.loomObjects(s)[0].ready,true);
});
test('Erik retains his running bash without changing what releases the bow latch',()=>{
 const s=createState(6,'cycle');for(let n=0;n<30;n++)step(s,{right:true},1/120);step(s,{right:true,action:true},1/120);
 assert.ok(s.heroes[0].bash>0);assert.equal(s.machine.released,false);
 for(let n=0;n<60;n++)step(s,{},1/120);assert.equal(s.heroes[0].bash,0);
});
