import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,step} from '../../src/core/engine.js';

test('the globe falls ahead of the crew and hits the floor before any Viking lands',()=>{
 const s=createState(10,'cycle');assert.ok(s.machine.globe,'sewer receives the Creation Globe');
 assert.ok(s.machine.globe.y>Math.max(...s.heroes.map(h=>h.y+44)));
 let impact=null,crew=null;
 for(let n=0;n<240;n++){step(s,{},1/120);if(s.machine.globe.bounces&&!impact)impact=s.time;if(s.heroes.some(h=>h.ground)&&!crew)crew=s.time;}
 assert.ok(impact<crew);assert.equal(s.heroes.every(h=>h.hp===3),true);
});

test('the globe bounces right, settles, hops on its own, unfolds six legs and runs into darkness continuously',()=>{
 const s=createState(10,'cycle');assert.ok(s.machine.globe);
 const phases=new Set(),samples=[];let largest=0,previous={...s.machine.globe};
 for(let n=0;n<1200;n++){step(s,{},1/120);const g=s.machine.globe;phases.add(g.phase);samples.push({...g});largest=Math.max(largest,Math.hypot(g.x-previous.x,g.y-previous.y));previous={...g};}
 for(const p of ['fall','bounce','settle','hop','run','gone'])assert.ok(phases.has(p),p);
 const settled=samples.find(g=>g.phase==='settle'),hop=samples.find(g=>g.phase==='hop'),run=samples.find(g=>g.phase==='run');
 assert.ok(settled.bounces>=2);assert.ok(settled.x>235&&settled.x<390);assert.ok(hop.vy<0);assert.equal(run.legs,1);assert.equal(run.legCount,6);assert.equal(run.y+44,760);
 assert.ok(s.machine.globe.x>650);assert.ok(largest<8,'bounded by physical falling speed, no position teleport');
 const reset=createState(10,'cycle');assert.equal(reset.machine.globe.phase,'fall');assert.equal(reset.machine.globe.legs,0);
});
