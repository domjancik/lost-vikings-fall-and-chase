import test from 'node:test';
import assert from 'node:assert/strict';
import {createState} from '../../src/core/engine.js';
import {orbitStep,orbitRope,orbitSurfaces} from '../../src/levels/orbit/campaign.js';
import {magneticMotion,resolveSteelCollisions,railContact} from '../../src/levels/orbit/magnetic.js';
import {magneticRefractionBands} from '../../src/levels/orbit/field-optics.js';
import {createOrbitSounds} from '../../src/levels/orbit/audio.js';
import {effects} from '../../src/audio/sound-effects.js';
import {craneWheelAngle} from '../../src/levels/orbit/art-layout.js';
const tick=(s,input={})=>orbitStep(s,input,1/120);
test('every matching steel rail supplies ordinary solid footing including the ceiling rail',()=>{
 const s=createState(8,'cycle');for(const p of [...s.machine.plates,...s.machine.roofs])assert.ok(orbitSurfaces(s).some(f=>f.support==='orbit-'+p.id));
});
test('all steel rails attract smoothly from the same distance on either side',()=>{
 for(const which of [0,1,2])for(const side of [-1,1]){
  const s=createState(8,'cycle'),p=[...s.machine.plates,...s.machine.roofs][which],h=s.heroes[0];
  Object.assign(h,{x:p.x,y:p.y+side*90-44,vy:0,boots:true});h.inventory[0]='magneticShoes';
  const y=h.y;magneticMotion(s,{},1/120);assert.equal(h.magnet?.plateId,p.id);assert.ok(h.magnet.pull>0&&h.magnet.pull<1);assert.ok(Math.abs(h.y-y)<2);
 }
});
test('normal actors collide with steel undersides and rotated decks',()=>{
 const s=createState(8,'cycle'),h=s.heroes[0],p=s.machine.roofs[0];
 Object.assign(h,{x:p.x,y:p.y+18,prevX:p.x,prevY:p.y+26,vy:-100,ground:false});resolveSteelCollisions(s);assert.ok(h.y>=p.y+24-.01);assert.ok(h.vy>=0);
 p.angle=.4;const q=railContact(p,150);Object.assign(h,{x:q.x,y:q.y-42,prevX:q.x,prevY:q.y-46,vy:100,ground:false});resolveSteelCollisions(s);assert.ok(h.ground);assert.equal(h.support,'orbit-'+p.id);
});
test('both magnetic wells distort while waiting to be commissioned',()=>{
 const s=createState(8,'cycle');for(const [x,y]of [[1120,674],[2540,444]])assert.ok(magneticRefractionBands(s,{x:x-260,y:y-200,width:520,height:400}).length>30);
});
test('three impact switches reset together after one actual revolution from the first hit',()=>{
 const s=createState(8,'cycle'),g=s.machine,p=g.plates[0];Object.assign(p,{x:1120,y:674,phase:'orbit',angle:0});g.ropeAperture.fill(1);s.shots=[{kind:'arrow',x:1357,y:626,vx:580,vy:0,life:2}];tick(s);
 assert.equal(g.sequence,1);assert.equal(g.sequenceStartAngle,p.angle);p.angle+=Math.PI*2+.01;tick(s);assert.equal(g.sequence,0);assert.deepEqual([g.ropeCut[0],g.ropeCut[2],g.ropeCut[3]],[false,false,false]);
});
test('ceiling brake is a short real rope that floor-level arrows miss',()=>{
 const s=createState(8,'cycle'),g=s.machine,r=orbitRope(s,4);assert.equal(r.kind,'brake-rope');assert.ok(r.h<=24);assert.equal(r.y,600);
 g.ropeAperture[4]=1;s.shots=[{kind:'arrow',x:r.x-2,y:626,vx:580,vy:0,life:2}];tick(s);assert.equal(g.ropeCut[4],false);
 s.shots=[{kind:'arrow',x:r.x-2,y:600,vx:580,vy:0,life:2}];tick(s);assert.equal(g.ropeCut[4],true);assert.ok(g.brakePose<1);
});
test('crane wheel angular displacement corresponds to horizontal rail travel',()=>{
 const a=craneWheelAngle({x:2540}),b=craneWheelAngle({x:2556});assert.equal(b-a,1);assert.equal(craneWheelAngle({x:2540,y:300}),a);
});
test('revolution deadline depends on angular travel and a valid set may start at any target',()=>{
 const s=createState(8,'cycle'),g=s.machine,p=g.plates[0];Object.assign(p,{x:1120,y:674,phase:'orbit',angle:Math.PI/2});g.ropeAperture.fill(1);
 s.shots=[{kind:'arrow',x:1165,y:914,vx:580,vy:0,life:2}];tick(s);assert.equal(g.sequence,1);assert.equal(g.ropeCut[2],true);
 s.time+=100;tick(s);assert.equal(g.sequence,1,'wall time does not replace the physical revolution');
 p.angle=Math.PI;g.ropeAperture.fill(1);s.shots=[{kind:'arrow',x:877,y:722,vx:580,vy:0,life:2}];tick(s);assert.equal(g.sequence,2);
 p.angle=Math.PI*2;g.ropeAperture.fill(1);s.shots=[{kind:'arrow',x:1357,y:626,vx:580,vy:0,life:2}];tick(s);assert.equal(g.sequence,3);assert.equal(p.phase,'release');assert.equal(g.releasePose,0);
 const x=p.x;for(let n=0;n<60;n++)tick(s);assert.equal(p.x,x);assert.ok(g.releasePose>0&&g.releasePose<1);
});
test('the crane stays physically braked until the cut cable has opened its shoes',()=>{
 const s=createState(8,'cycle'),g=s.machine;g.panelOpen=true;g.operator=0;Object.assign(s.heroes[0],{x:1730,y:606,ground:true});const x=g.hook.x;
 tick(s,{right:true});assert.equal(g.hook.x,x);g.ropeCut[4]=true;for(let n=0;n<40;n++)tick(s,{right:true});assert.equal(g.hook.x,x);assert.ok(g.brakePose>0&&g.brakePose<1);
 for(let n=0;n<60;n++)tick(s,{right:true});assert.ok(g.hook.x>x);
});

test('switch/reset/disassembly each emit their distinct weighted sound once',()=>{
 const s=createState(8,'cycle'),sounds=createOrbitSounds();sounds(s);s.machine.sequence=1;s.machine.lastSwitch=2;
 const hit=sounds(s);assert.ok(hit.some(e=>e.name==='orbitLatch'&&e.x===1168));assert.ok(!hit.some(e=>e.name==='chain'));assert.deepEqual(sounds(s),[]);
 s.machine.sequence=0;s.machine.resetAt=1;assert.ok(sounds(s).some(e=>e.name==='orbitReset'));assert.deepEqual(sounds(s),[]);
 s.machine.sequence=3;s.machine.releaseAt=2;assert.ok(sounds(s).some(e=>e.name==='orbitRelease'));assert.deepEqual(sounds(s),[]);
 assert.ok(effects.orbitRelease.some(v=>v.frequency<100&&v.duration>=.7));assert.ok(effects.orbitRelease.some(v=>v.type==='noise'&&v.delay>=.2));
});
