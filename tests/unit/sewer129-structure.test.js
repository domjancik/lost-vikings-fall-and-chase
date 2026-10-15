import test from 'node:test';
import assert from 'node:assert/strict';
import {createState} from '../../src/core/engine.js';
import {sewerStep} from '../../src/levels/sewer/campaign.js';
import {sewerOccluders,sewerFaceLight} from '../../src/levels/sewer/light.js';
const dt=1/120;
const state=()=>{const s=createState(10,'cycle');s.noHazards=true;s.machine.lurkers=[];s.machine.valveOpened=true;s.machine.valve.pose=1;return s;};
const run=(s,input,n=120)=>{for(let i=0;i<n;i++)sewerStep(s,input,dt);};
test('service slabs block rising heads and side entry instead of only downward landings',()=>{for(const id of [0,1,2]){
 const s=state(),h=s.heroes[id];s.active=id;Object.assign(h,{x:980,y:716,ground:true,vy:-570});for(let i=0;i<30;i++){sewerStep(s,{},dt);assert.ok(h.y-28>=664,'cannot rise through platform underside');}
 Object.assign(h,{x:875,y:640,vx:0,vy:0,ground:false});for(let i=0;i<15;i++){sewerStep(s,{right:true},dt);assert.ok(h.x+16<=900,'slab side is solid');}
}});
test('ceiling masonry blocks lateral entry and shares its full drawn volume with shadows',()=>{const s=state(),h=s.heroes[0];Object.assign(h,{x:120,y:540,vx:0,vy:-150,ground:false});run(s,{left:true},18);assert.ok(h.x-16>=100);const ceiling=sewerOccluders(s).find(a=>a.x===380&&a.w===440);assert.equal(ceiling.y,300);assert.equal(ceiling.y+ceiling.h,580);});
test('raised shutters retain collision and shadows at their actual raised position',()=>{const s=state();s.machine.hatch.pose=1;const gate=sewerOccluders(s).find(a=>a.x===2020);assert.ok(gate);assert.equal(gate.y+gate.h,560);});
test('rear pipes and gates stay fixed to their masonry as the camera moves on both axes',async()=>{globalThis.Image=class{complete=false;naturalWidth=0;};const {drawSewerWorld}=await import('../../src/levels/sewer/render.js');const s=state(),ctx=new Proxy({},{get:(o,k)=>o[k]??(()=>{})});const capture=camera=>drawSewerWorld(ctx,s,camera,{width:720,height:395}).contacts.filter(a=>a.kind==='rear-fixture');const a=capture({x:0,y:300}),b=capture({x:680,y:520});assert.ok(a.length>0);assert.deepEqual(a,b);for(const f of a)assert.equal(f.base,760);});

test('fully raised inspection leaf provides headroom on the adjacent service landing',()=>{const s=state(),h=s.heroes[0];s.machine.hatch.pose=1;s.machine.hatch.open=true;Object.assign(h,{x:1960,y:596,vx:0,vy:0,ground:true});run(s,{right:true},70);assert.ok(h.x>2060,'raised leaf must not trap a Viking at the platform edge');});

test('released service landing leaves full body clearance below and above, and carries riders',()=>{for(const id of [0,1,2]){const s=state(),h=s.heroes[id];s.active=id;s.machine.rope.cut=true;s.machine.rope.pose=1;s.machine.gates[0].pose=1;Object.assign(h,{x:2120,y:716,ground:true,vx:0,vy:0});run(s,{right:true},210);assert.ok(h.x>2360,'each Viking can walk below the raised landing');}
 const s=state(),h=s.heroes[0];Object.assign(h,{x:2240,y:716,ground:true,vx:0,vy:0});s.machine.rope.cut=true;for(let i=0;i<210;i++){sewerStep(s,{},dt);assert.ok(h.y-28>=580,'rider has ceiling clearance');assert.ok(Math.abs(h.y+44-(760-100*s.machine.rope.pose))<.1,'passenger stays on visible landing');}});

test('a foreground shutter receives local light on its face without transmitting through the wall',()=>{const s=state();s.machine.lamp.hookId='inspection';s.machine.lamp.focused=true;const leaf=sewerOccluders(s).find(a=>a.x===2020);assert.ok(sewerFaceLight(s,leaf,720)>0);s.machine.lamp.lit=false;s.machine.lamps.forEach(a=>a.lit=false);s.machine.introTime=4;assert.equal(sewerFaceLight(s,leaf,720),0);});

test('lifting landing remains a single solid face lit by actual adjacent light',()=>{const s=state();s.machine.hatch.pose=1;s.machine.gates[0].pose=1;s.machine.rope.pose=1;s.machine.lamp.hookId='inspection';s.machine.lamp.focused=true;const decks=sewerOccluders(s).filter(a=>a.kind==='landing');assert.equal(decks.length,1);assert.equal(decks[0].w,160);assert.ok(sewerFaceLight(s,decks[0],decks[0].y+10)>.1);});
