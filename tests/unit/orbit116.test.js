import {simulateOrbitRoute} from '../routes/orbit-route113.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,step} from '../../src/core/engine.js';
import {magneticMotion,magneticPoint} from '../../src/levels/orbit/magnetic.js';
const fresh=()=>createState(8,'cycle');
const ticks=(s,input={},n=1)=>{for(let i=0;i<n;i++)step(s,input,1/120);};
test('magnet attachment clears ladder animation and its movement state',()=>{
 const s=fresh(),h=s.heroes[0];Object.assign(h,{x:700,y:956,climbing:true,climbMoving:true,boots:true});h.inventory[0]='magneticShoes';magneticMotion(s,{},1/120);assert.ok(h.magnet);assert.equal(h.climbing,false);assert.equal(h.climbMoving,false);
});
test('empty clamp attempts animate and have a generous physical capture radius',()=>{
 const s=fresh(),g=s.machine;g.panelOpen=true;g.operator=0;Object.assign(s.heroes[0],{x:1730,y:606,ground:true});ticks(s,{action:true});assert.ok(g.hook.grab>0);assert.equal(g.hook.plateId,null);
 Object.assign(g.plates[1],{x:2540,y:444,angle:0,phase:'float'});Object.assign(g.hook,{x:2558,y:420});ticks(s,{action:true});assert.equal(g.hook.plateId,1);
});
test('receiver pulls a nearby clamped carrier into its socket without pixel-perfect alignment',()=>{
 const s=fresh(),g=s.machine,p=g.plates[1];g.panelOpen=true;g.operator=0;Object.assign(s.heroes[0],{x:1730,y:606,ground:true});Object.assign(p,{x:2870,y:345,phase:'hooked'});Object.assign(g.hook,{x:2870,y:321,plateId:1,offset:{x:0,y:24}});ticks(s,{},180);assert.equal(g.hookDocked,true);assert.equal(p.phase,'parked');assert.equal(p.x,2900);assert.equal(p.y,324);
});
test('ceiling service rails pull equipped heroes gradually upward and release safely',()=>{
 const s=fresh(),h=s.heroes[1];Object.assign(h,{x:1870,y:606,boots:true,ground:true});h.inventory[0]='magneticShoes';let y=h.y;for(let i=0;i<100;i++){ticks(s);assert.ok(Math.abs(h.y-y)<6);y=h.y;}assert.ok(h.magnet);assert.ok(h.rotation>3);assert.equal(h.climbing,false);h.boots=false;ticks(s,{},100);assert.equal(h.magnet,null);assert.ok(h.y>=606);
});
test('scrap keeps circling its gravity center without resting at one endpoint',()=>{
 const s=fresh();s.machine.safety=true;let stopped=0;for(let n=0;n<1200;n++){const d=s.machine.debris[0],x=d.x,y=d.y;ticks(s);if(Math.hypot(d.x-x,d.y-y)<.01)stopped++;}assert.equal(stopped,0);
});
test('Olaf only pushes while his front shield is in physical contact with the frame',()=>{
 const s=fresh(),o=s.heroes[2],p=s.machine.plates[0];s.active=2;Object.assign(o,{x:550,y:956,ground:true});ticks(s,{right:true});assert.equal(p.x,780);Object.assign(o,{x:584,y:956,vx:0});ticks(s,{right:true},40);assert.ok(p.x>780);assert.ok(Math.abs(o.x+32-(p.x-p.w/2))<4);
});

test('three surrounding restraints must be cut in order within the circuit window',()=>{
 const s=fresh(),g=s.machine,p=g.plates[0];Object.assign(p,{x:1120,y:674,phase:'orbit',angle:0});
 const shoot=(x,y)=>{g.ropeAperture.fill(1);s.shots=[{kind:'arrow',x:x-3,y,vx:580,vy:0,life:2}];ticks(s);};
 shoot(1360,626);assert.equal(g.sequence,1);assert.equal(p.phase,'orbit');p.angle=Math.PI/2;shoot(1168,914);assert.equal(g.sequence,2);p.angle=Math.PI;shoot(880,722);assert.equal(g.sequence,3);assert.equal(p.phase,'dock');
});
test('a failed timed circuit can be retried without losing the carrier or crew',()=>{
 const s=fresh(),g=s.machine,p=g.plates[0];Object.assign(p,{x:1120,y:674,phase:'orbit',angle:0});g.ropeAperture.fill(1);s.shots=[{kind:'arrow',x:1357,y:626,vx:580,vy:0,life:2}];ticks(s);assert.equal(g.sequence,1);g.safety=true;ticks(s,{},2520);assert.equal(g.sequence,1);assert.equal(g.ropeCut[0],true);assert.ok(g.sequenceRecoverUntil>s.time);assert.equal(p.phase,'orbit');ticks(s,{},480);assert.equal(g.sequence,1);assert.equal(g.ropeCut[0],true);assert.ok(s.time>g.sequenceRecoverUntil);
});

for(const hz of [60,120])test('normal-input circuit recovery remains clearable with permanent released pawls at '+hz+'Hz',()=>{const r=simulateOrbitRoute(hz,{retry:true});assert.equal(r.won,true);assert.deepEqual(r.hp,[3,3,3]);});
