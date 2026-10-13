import test from 'node:test';
import assert from 'node:assert/strict';
import {createState} from './engine.js';
import {advanceWarden,wardenGeometry} from './warden-campaign.js';
import {stepWardenCombat,laserTrace} from './warden-combat.js';
test('the guardian alternates feet and releases a fatigued brace',()=>{
 const s=createState(5,'cycle'),g=s.machine,o=s.heroes[2];
 const ids=new Set();for(let n=0;n<1200;n++){advanceWarden(s,1/60);ids.add(g.activeLeg);}assert.equal(ids.size,4);
 Object.assign(o,{x:1490,y:896,ground:true,shield:true,shieldUp:true});Object.assign(g,{activeLeg:3,braced:true,braceAge:13.99,footX:1490,footY:860});
 advanceWarden(s,.05);assert.equal(g.braced,false);assert.ok(g.fatigue>0);assert.ok(g.kneel<1);
});
test('shockwaves sweep fast movement, hurt grounded heroes and stop at a front shield',()=>{
 const s=createState(5,'cycle'),g=s.machine;Object.assign(s.heroes[0],{x:1200,y:896});
 g.waves=[{x:1100,dir:1,age:0}];stepWardenCombat(s,.5);assert.equal(s.heroes[0].hp,2);
 const q=createState(5,'cycle');Object.assign(q.heroes[2],{x:1200,y:896,face:-1,shield:true,shieldUp:false});q.heroes[0].x=1300;
 q.machine.waves=[{x:1100,dir:1,age:0}];stepWardenCombat(q,.5);assert.equal(q.heroes[2].hp,3);assert.equal(q.heroes[0].hp,3);assert.equal(q.machine.waves.length,0);
});
test('laser warning locks before firing and a platform occludes the beam',()=>{
 const s=createState(5,'cycle'),g=s.machine;s.heroes[0].x=1300;
 stepWardenCombat(s,.01);assert.equal(g.laser.phase,'track');assert.equal(s.heroes[0].hp,3);
 for(let i=0;i<90;i++)stepWardenCombat(s,1/60);
 const target={...g.laser.target};s.heroes[0].x=1600;stepWardenCombat(s,.1);assert.deepEqual(g.laser.target,target);
 const eye=wardenGeometry(s).eye;s.level={...s.level,platforms:[{x:1400,y:800,w:300}]};
 const trace=laserTrace(s,eye,{x:1600,y:930});assert.equal(trace.kind,'terrain');assert.ok(trace.y<=820);
});
test('firing damages an exposed intruder but an overhead shield intercepts a descending beam',()=>{
 const s=createState(5,'cycle');const h=s.heroes[0];Object.assign(h,{x:1500,y:896});
 Object.assign(s.machine,{engaged:true,laser:{phase:'fire',age:0,target:{x:1500,y:918}}});
 stepWardenCombat(s,1/60);assert.equal(h.hp,2);
 const q=createState(5,'cycle');Object.assign(q.heroes[2],{x:1500,y:896,shield:true,shieldUp:true});
 const hit=laserTrace(q,{x:1500,y:600},{x:1500,y:920});assert.equal(hit.kind,'shield');assert.ok(hit.y>800&&hit.y<900,'Shield contact remains in world coordinates');
});
test('shutdown stops new laser attacks but existing waves dissipate naturally',()=>{
 const s=createState(5,'cycle');s.machine.disabled=true;s.machine.waves=[{x:1200,dir:1,age:0}];
 s.machine.laser={phase:'fire',age:0,target:{x:1500,y:918}};stepWardenCombat(s,.1);
 assert.equal(s.machine.laser.phase,'cooldown');assert.equal(s.machine.waves.length,1);
 stepWardenCombat(s,3);assert.equal(s.machine.waves.length,0);
});
test('the defence emitter is separate from the protected service lens',()=>{
 const s=createState(5,'cycle');s.machine.laser.phase='track';advanceWarden(s,.2);
 assert.equal(s.machine.shutter,0,'Warning must not reveal an arrow-sized slit in the weak lens');
 const parts=wardenGeometry(s);assert.ok(parts.eye.y-parts.emitter.y>80);
});
