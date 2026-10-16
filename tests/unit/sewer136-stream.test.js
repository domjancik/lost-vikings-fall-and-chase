import test from 'node:test';
import assert from 'node:assert/strict';
import {createState} from '../../src/core/engine.js';
import {sewerStep} from '../../src/levels/sewer/campaign.js';
import {sewerSprayGeometry,sewerSprayTouches} from '../../src/levels/sewer/stream.js';

const state=()=>createState(10,'cycle');
test('crossjet falls continuously from the mouth until its underside meets the floor',()=>{
 const s=state(),g=sewerSprayGeometry(s),p=g.incoming;
 assert.equal(p[0].x,s.machine.jet.outletX);
 assert.equal(p[0].y,s.machine.jet.y+s.machine.jet.h/2);
 assert.equal(p.at(-1).y+p.at(-1).radius,760);
 assert.ok(p.every((a,n)=>!n||a.y>=p[n-1].y));
 assert.equal(g.floor.y,760);
});
test('a front shield intercepts the actual arc wherever Olaf meets it, and deflects locally to the floor',()=>{
 for(const x of [655,740,885]){
  const s=state(),o=s.heroes[2];Object.assign(o,{x,y:716,face:1,shield:true,shieldUp:false});
  const g=sewerSprayGeometry(s),contact=g.incoming.at(-1);
  assert.equal(g.blocker,2);assert.ok(contact.x>o.x);
  assert.deepEqual(g.reflected[0],contact);
  assert.ok(g.reflected.at(-1).x>contact.x);
  assert.equal(g.reflected.at(-1).y+g.reflected.at(-1).radius,760);
  assert.ok(!sewerSprayTouches(g,{x:o.x-50,y:688,w:30,h:72}));
  assert.ok(sewerSprayTouches(g,{x:920,y:710,w:10,h:44}));
 }
});
test('overhead, reversed, elevated or distant shields cannot delete the crossjet',()=>{
 for(const pose of [{shieldUp:true},{face:-1},{y:600},{x:1100}]){
  const s=state();Object.assign(s.heroes[2],{x:800,y:716,face:1,shield:true,shieldUp:false},pose);
  assert.equal(sewerSprayGeometry(s).blocker,null);
 }
});
test('wetting follows the falling arc and clearing the valve resets Olaf interception',()=>{
 const s=state(),o=s.heroes[2];Object.assign(o,{x:800,y:716,face:1,ground:true});
 s.items=[{id:'dry',type:'inspectionLamp',x:720,y:716}];
 sewerStep(s,{},1/120);assert.ok(o.sprayBlock);assert.ok(s.machine.lamp.lit);
 s.machine.valveOpened=true;for(let n=0;n<150;n++)sewerStep(s,{},1/120);
 assert.equal(o.sprayBlock,false);assert.equal(sewerSprayGeometry(s).incoming.length,0);
});
test('moving the pipe registers a fresh continuous trajectory instead of retaining an old special shield zone',()=>{
 const s=state();Object.assign(s.machine.jet,{x:1100,outletX:1400,y:690});
 Object.assign(s.heroes[2],{x:1250,y:700,face:1,shield:true,shieldUp:false});
 const g=sewerSprayGeometry(s);assert.equal(g.incoming[0].x,1400);assert.equal(g.incoming[0].y,703);
 assert.equal(g.blocker,2);assert.equal(g.floor.y,760);assert.ok(g.floor.x>1250);
 s.heroes[2].shieldUp=true;const open=sewerSprayGeometry(s);
 assert.equal(open.incoming.at(-1).x,1100);assert.equal(open.incoming.at(-1).y+open.incoming.at(-1).radius,760);
});
