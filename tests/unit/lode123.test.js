import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,step} from '../../src/core/engine.js';
import {lodeControl,lodeBallastPoint,lodeRequestBridge} from '../../src/levels/lode/campaign.js';
const run=(s,input={},seconds=1)=>{for(let n=0;n<seconds*120;n++)step(s,input,1/120);};

test('second magnetic level has distinct stator, hinged crossing and counterweight lift',()=>{
 const s=createState(9,'cycle');assert.equal(s.level.mechanic,'lode');
 assert.equal(s.machine.plates.length,3);assert.equal(s.machine.plates[0].w,560);
 assert.equal(s.machine.plates[1].angle,Math.PI/2);assert.equal(s.machine.plates[2].y,576);
 assert.ok(!s.level.ladders.some(l=>l.x===1780));
});
test('a real brake cable prevents winding the hinged crossing until cut',()=>{
 const s=createState(9,'cycle');assert.equal(lodeRequestBridge(s),false);run(s,{},1);assert.equal(s.machine.plates[1].angle,Math.PI/2);
 s.machine.brakeCut=true;assert.equal(lodeRequestBridge(s),true);run(s,{},2);assert.ok(s.machine.plates[1].angle>0&&s.machine.plates[1].angle<Math.PI/2);
});
test('ballast belongs to a fixed guarded shaft after banking, opposite to lift motion',()=>{
 const s=createState(9,'cycle');s.machine.banked=true;s.machine.bankPose=1;s.machine.liftWanted=true;
 const before=lodeBallastPoint(s).y;run(s,{},1);assert.ok(s.machine.plates[2].y<576);assert.ok(lodeBallastPoint(s).y>before);
 const control=lodeControl(s,'call');control.run();run(s,{},5);assert.equal(s.machine.plates[2].y,576);
});
import {simulateLodeRoute} from '../routes/lode-route123.js';
import {bottomU,magneticTerrainHit} from '../../src/levels/lode/campaign.js';
import {magneticPoint} from '../../src/levels/orbit/magnetic.js';

test('normal controls complete the whole cooperative machine at60/120 with all three healthy',()=>{
 for(const hz of [60,120]){const r=simulateLodeRoute(hz);assert.equal(r.won,true);assert.deepEqual(r.hp,[3,3,3]);
  assert.ok(r.milestones.find(m=>m.name==='gallery-recovery').machine.recovery);
  assert.ok(r.milestones.find(m=>m.name==='mass-transfer').machine.banked);
  assert.equal(r.milestones.find(m=>m.name==='upper-lift').machine.plates[2].y,340);
 }
});

test('only real inverted Olaf contact moves the ballast; other actors cannot pass through',()=>{
 for(const id of [0,1,2]){const s=createState(9,'cycle'),h=s.heroes[id],p=s.machine.plates[2],start=s.machine.ballastU;s.active=id;
  h.inventory[0]='magneticShoes';Object.assign(h,{boots:true,magnet:{plateId:2,u:start+66,pull:1},magV:0});magneticPoint(h,p);run(s,{left:true},.5);
  assert.equal(s.machine.ballastU<start,id===2);assert.ok(h.magnet.u>=s.machine.ballastU+63);
 }
 const s=createState(9,'cycle');s.active=2;const start=s.machine.ballastU;run(s,{left:true},1);assert.equal(s.machine.ballastU,start);
});

test('bridge carries an attached rider continuously, and can be wound back',()=>{
 const s=createState(9,'cycle'),h=s.heroes[0],p=s.machine.plates[1];s.active=0;s.machine.brakeCut=true;
 h.inventory[0]='magneticShoes';Object.assign(h,{boots:true,magnet:{plateId:1,u:24,pull:1}});magneticPoint(h,p);lodeRequestBridge(s);
 let moved=false;for(let n=0;n<900;n++){const old={x:h.x,y:h.y};step(s,{},1/120);assert.ok(Math.hypot(h.x-old.x,h.y-old.y)<3);if(Math.hypot(h.x-old.x,h.y-old.y)>.1)moved=true;}
 assert.ok(moved);assert.equal(p.angle,0);lodeRequestBridge(s);run(s,{},5);assert.equal(p.angle,Math.PI/2);
});

test('ballast body clears the boarding floor, fixed shaft stays above the return floor',()=>{
 const s=createState(9,'cycle'),g=s.machine;assert.equal(lodeBallastPoint(s).y+92,692);assert.ok(692<700);
 g.banked=true;g.bankPose=1;g.plates[2].y=340;assert.ok(lodeBallastPoint(s).y+92<1260);
});

test('missed lift is recallable, remains boardable, and cabin can raise it again',()=>{
 const s=createState(9,'cycle'),g=s.machine;g.banked=true;g.bankPose=1;g.liftWanted=true;run(s,{},6);assert.equal(g.plates[2].y,340);
 lodeControl(s,'call').run();run(s,{},6);assert.equal(g.plates[2].y,576);
 lodeControl(s,'cabin').run();run(s,{},6);assert.equal(g.plates[2].y,340);
});

test('bullets hit actual terrain/steel and a front shield; arrows cut the visible brake',()=>{
 const s=createState(9,'cycle');s.machine.sentry.hp=0;s.shots=[{kind:'bolt',x:1100,y:690,vx:0,vy:200,life:3}];run(s,{},.2);assert.equal(s.shots.length,0);
 s.shots=[{kind:'bolt',x:700,y:980,vx:280,vy:0,life:3}];run(s,{},.2);assert.equal(s.shots.length,0);
 const o=s.heroes[2];Object.assign(o,{x:2450,y:656,face:1,shield:true,shieldUp:false});s.shots=[{kind:'bolt',x:2520,y:676,vx:-280,vy:0,life:3}];run(s,{},.4);assert.equal(o.hp,3);assert.ok(s.machine.blocks>0);
 s.shots=[{kind:'arrow',x:1950,y:676,vx:580,vy:0,life:3}];run(s,{},.2);assert.ok(s.machine.brakeCut);
});

test('magnetized feet cannot phase upward through a gallery at an obstructed cap',()=>{
 const s=createState(9,'cycle'),h=s.heroes[0],p=s.machine.plates[2];p.y=340;h.inventory[0]='magneticShoes';Object.assign(h,{boots:true,magnet:{plateId:2,u:bottomU(p,2705),pull:1}});magneticPoint(h,p);
 assert.ok(magneticTerrainHit(h,s.level.floors));
});


test('ordinary missed-lift route recalls the loaded lift, boards Baleog and completes',()=>{
 for(const hz of [60,120]){const r=simulateLodeRoute(hz,{recall:true});assert.equal(r.won,true);assert.deepEqual(r.hp,[3,3,3]);assert.ok(r.milestones.find(m=>m.name==='recovered-crew'));}
});

test('a fall beyond the counterweight can return below the shaft and climb the deployed ladder',()=>{
 const s=createState(9,'cycle'),h=s.heroes[2];s.active=2;s.machine.recovery=true;s.machine.recoveryPose=1;s.machine.banked=true;s.machine.bankPose=1;s.machine.plates[2].y=340;s.machine.liftWanted=true;s.machine.sentry.hp=0;
 Object.assign(h,{x:3340,y:1216,vx:0,vy:0,ground:true});
 for(let n=0;n<1600&&h.x>1782;n++)step(s,{left:true},1/120);run(s,{},.2);
 assert.ok(h.x<1784);for(let n=0;n<600;n++)step(s,{up:true},1/120);
 assert.equal(h.y+44,700);assert.equal(h.hp,3);assert.ok(!s.failed);
});

test('sentry bolts originate at the native muzzle registered from its sole',()=>{
 const s=createState(9,'cycle'),e=s.machine.sentry;Object.assign(s.heroes[2],{x:2450,y:656,ground:true,face:1});e.targetId=2;e.fireAt=0;
 step(s,{},1/120);const bolt=s.shots.find(p=>p.kind==='bolt');assert.ok(bolt);assert.equal(bolt.y,656);assert.ok(bolt.x<e.x-59);
});
