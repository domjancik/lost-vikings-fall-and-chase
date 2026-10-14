import {test} from 'node:test';
import assert from 'node:assert/strict';
import {machinePose} from '../../src/render/machine-animation.js';
import {createState,step} from '../../src/core/engine.js';
const pose=(time,machine)=>machinePose({time,machine});
test('oven is unlit when off and animates only working or opening states',()=>{
 assert.equal(pose(20,{ovenMode:0}).ovenFrame,0);
 assert.equal(pose(20,{ovenMode:1}).ovenFrame,1);
 assert.equal(pose(20,{baked:true}).ovenFrame,3);
 assert.equal(pose(20,{ovenMode:0,ovenDoorAt:19.9}).ovenFrame,2);
 assert.equal(pose(21,{ovenMode:0,ovenDoorAt:19.9}).ovenFrame,0);
});
test('mixing follows ingredient event, then settles instead of stirring forever',()=>{
 assert.equal(pose(4,{ingredients:[]}).bowlFrame,0);
 assert.equal(pose(4,{ingredients:['flour']}).bowlFrame,1);
 const frames=new Set(Array.from({length:12},(_,i)=>pose(4+i/12,{ingredients:['flour','spice'],mixedAt:4}).bowlFrame));
 assert.deepEqual([...frames].sort(),[2,3]);
 assert.equal(pose(8,{ingredients:['flour','spice'],mixedAt:4}).bowlFrame,1);
});
test('dragon telegraphs shots, breathes at shot time, and rests when forge complete',()=>{
 assert.equal(pose(2,{ore:true,oreCutAt:0,air:1,heat:0}).dragonFrame,1);
 assert.equal(pose(2.3,{dragonShotAt:2.2,air:1,heat:0}).dragonFrame,2);
 assert.equal(pose(2.7,{dragonShotAt:2.2,air:1,heat:0}).dragonFrame,3);
 assert.equal(pose(8,{dragonShotAt:2.2,air:1,heat:3}).dragonFrame,0);
 assert.equal(pose(2,{air:0,heat:0}).dragonFrame,0);
});
test('mechanical movement is quantized and remains stable within each animation frame',()=>{
 const g={lastPump:1,ingredients:['flour','spice'],mixedAt:1,ovenMode:1};
 for(let t=1;t<2;t+=.013)assert.equal(pose(t,g).bellowsCompression%2,0);
 assert.deepEqual(pose(1.11,g),pose(1.12,g));
 assert.equal(pose(4,g).bellowsCompression,0);
});
test('real ingredient and oven interactions trigger their visual timelines',()=>{
 const s=createState(6),h=s.heroes[1];s.active=1;h.x=620;h.y=566;
 h.inventory[0]='flour';h.itemSlot=0;step(s,{item:true},1/60);
 assert.equal(s.machine.mixedAt,s.time);assert.ok(machinePose(s).bowlFrame>=2);
 h.inventory[0]='spice';step(s,{item:true},1/60);
 h.x=1000;h.inventory[0]='dough';step(s,{item:true},1/60);
 assert.equal(s.machine.ovenDoorAt,s.time);assert.equal(machinePose(s).ovenFrame,2);
 step(s,{interact:true},1/60);for(let i=0;i<190;i++)step(s,{},1/60);
 assert.equal(s.machine.baked,true);assert.equal(machinePose(s).ovenFrame,3);
 step(s,{interact:true},1/60);assert.equal(machinePose(s).ovenFrame,2);
});
