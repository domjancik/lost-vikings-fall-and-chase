import test from 'node:test';
import assert from 'node:assert/strict';
import {ORBIT_ART,plateArtPlacement,hookArtPlacement,orbitPlaneOffsets,orbitSupportPlan,orbitGearPlan,orbitConnectionRoutes} from '../../src/levels/orbit/art-layout.js';
import {connectionPlan} from '../../src/render/connection-layout.js';
import {createState} from '../../src/core/engine.js';
test('magnetic carrier preserves reviewed native geometry and rotation pivot',()=>{
 const p={x:1120,y:674,w:344,h:48,angle:Math.PI/2},r=plateArtPlacement(p);
 assert.deepEqual(ORBIT_ART.plate.native,[192,96]);assert.deepEqual(ORBIT_ART.plate.pivot,[96,48]);
 assert.equal(r.x+r.w/2,p.x);assert.equal(r.y+r.h/2,p.y);assert.equal(r.w,512);
 assert.deepEqual(ORBIT_ART.plate.body,[10,36,182,60]);assert.equal((182-10)*2,p.w);assert.equal((60-36)*2,p.h);
});
test('hook cable and claw are registered to the moving physical mount',()=>{
 const p=hookArtPlacement({x:2540,y:420});
 assert.equal(p.x+32*2,2540);assert.equal(p.y+44*2,420);assert.equal(p.tipY,444);assert.equal(p.stemY,p.y+3*2);
});
test('foreground supports always terminate on a real lower floor',()=>{
 const s=createState(8,'cycle'),supports=orbitSupportPlan(s.level);
 assert.ok(supports.length>=6);for(const p of supports)assert.ok(s.level.floors.some(f=>f.y===p.bottom&&p.x>=f.x&&p.x<=f.x+f.w));
});
test('background machinery shares complete horizontal/vertical depth transforms and meshes',()=>{
 const a=orbitPlaneOffsets({x:200,y:200}),b=orbitPlaneOffsets({x:400,y:600});
 assert.ok(b.far.y>a.far.y);assert.ok(b.middle.y>a.middle.y);
 const plan=orbitGearPlan(10),[first,second,third]=plan;
 assert.equal(second.x-first.x,ORBIT_ART.gear.pitch*4);assert.equal(third.y-second.y,ORBIT_ART.gear.pitch*4);
 assert.equal(first.angle+second.angle,Math.PI/16);assert.equal(second.angle+third.angle,Math.PI/16);
});
test('all machine cable routes remain valid throughout the hook travel range',()=>{
 for(const x of [2100,2540,3040])for(const y of [260,380,600])for(const route of orbitConnectionRoutes({x,y},{y:248}))assert.doesNotThrow(()=>connectionPlan(route));
});
