import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,step} from '../../src/core/engine.js';
import {BALL_RADIUS,momentumLevel,railPoint,spherePose,sphereCrown,laserPhase,requestReturn,momentumSurfaces,momentumLiftPlacement} from '../../src/levels/momentum/campaign.js';
import {refractionArt} from '../../src/levels/refraction/art-layout.js';
import {runMomentumRoute} from '../routes/momentum-route.js';
test('momentum is a separate third lab room with safe recovery',()=>{
 const s=createState(2,'cycle');assert.equal(s.level.mechanic,'momentum');assert.equal(s.level.floors[0].y,1120);
});
test('crew lift mounts its actual authored walking rim at the physical support plane',()=>{
 for(const y of [508,792,1120]){const c={x:2910,y,w:180},p=momentumLiftPlacement(c);assert.equal(p.y+refractionArt.liftRim*2,y);assert.equal(p.w,180);}
});
test('entire sphere sweep clears both branches and every solid gallery',()=>{
 for(const branch of ['upper','lower'])for(let p=480;p<=(branch==='upper'?1800:1500);p+=.5){const b=spherePose(p,branch);
  for(const f of momentumLevel.platforms){const x=Math.max(f.x,Math.min(b.x,f.x+f.w)),y=Math.max(f.y,Math.min(b.y,f.y+24));assert.ok(Math.hypot(b.x-x,b.y-y)>=BALL_RADIUS-1e-6,`circle/deck intersection ${branch} ${p} deck${f.x}`);}}
});
for(const hz of [60,120])test('normal-input push/sword/board/balance/platforming/crew reunion at '+hz+'Hz',()=>{
 let ridden=0,cracked=0;const {s,stages}=runMomentumRoute(hz,s=>{const b=s.machine.ball;for(const h of s.heroes)if(h.support==='momentum-ball'){assert.ok(Math.abs(h.y+44-sphereCrown(b,h.x))<1e-6);ridden++;}if(s.machine.tiles.some(t=>t.t>0))cracked++;});
 assert.ok(s.won);assert.deepEqual(s.heroes.map(h=>h.hp),[3,3,3]);assert.deepEqual(stages,['push','steer','board','high','safety','reunion']);assert.ok(ridden>hz&&cracked>0);
});
test('spent ceramic supports recover automatically after a failed attempt',()=>{
 const s=createState(2,'cycle'),t=s.machine.tiles[0];t.t=.95;
 for(let n=0;n<120;n++)step(s,{},1/120);assert.ok(t.drop>0);assert.ok(!momentumSurfaces(s).some(p=>p.support==='tile-2020'));
 for(let n=0;n<1200;n++)step(s,{},1/120);assert.equal(t.t,0);assert.equal(t.drop,0);assert.ok(momentumSurfaces(s).some(p=>p.support==='tile-2020'));
});
test('occupied ball defers reset without moving its passenger',()=>{
 const s=createState(2,'cycle'),h=s.heroes[0],b=s.machine.ball;b.mode='caught';Object.assign(h,{x:b.x,y:b.y-BALL_RADIUS-44,ground:true,support:'momentum-ball'});
 assert.equal(requestReturn(s),false);assert.equal(b.mode,'caught');assert.ok(s.machine.returnPending);step(s,{},1/120);assert.equal(h.support,'momentum-ball');
});
test('a failed ball route can be reset from the left without jumping over the ball',()=>{
 const s=createState(2,'cycle');s.active=2;Object.assign(s.machine.ball,{p:1500,...spherePose(1500,'lower'),branch:'lower',mode:'caught'});Object.assign(s.heroes[2],{x:1350,y:1076,ground:true});step(s,{interact:true},1/120);assert.equal(s.machine.ball.mode,'return');
});
test('the recovery ladder keeps every climbing body clear of the parked sphere',()=>{
 const s=createState(2,'cycle');s.machine.highReached=true;Object.assign(s.machine.ball,{p:1800,...spherePose(1800,'upper'),mode:'caught'});step(s,{},1/120);const l=s.level.ladders.at(-1);
 assert.ok(l.x>s.machine.ball.x+BALL_RADIUS+24,'ladder must be outside sphere and hero widths');
});
test('the furnace housing is solid and its top supports a landing',()=>{
 const s=createState(2,'cycle');Object.assign(s.heroes[0],{x:2380,y:464,ground:true});
 for(let n=0;n<90;n++)step(s,{right:true},1/120);assert.ok(s.heroes[0].x<=2404);
 Object.assign(s.heroes[0],{x:2450,y:340,vy:100,ground:false});for(let n=0;n<35;n++)step(s,{},1/120);assert.equal(s.heroes[0].y+44,414);
});
test('Erik can rebound from the padded wall by pressing jump at its right face',()=>{
 const s=createState(2,'cycle');Object.assign(s.heroes[0],{x:2036,y:450,vy:100,ground:false});
 step(s,{jump:true,left:true},1/120);assert.ok(s.heroes[0].vy< -500);assert.ok(s.heroes[0].vx>0);assert.ok(s.machine.bumperAt>0);
});
test('front shield and elastic bumper handle ordinary fireballs anywhere',()=>{
 for(const shield of [false,true]){const s=createState(2,'cycle');Object.assign(s.heroes[2],{x:2100,y:464,face:1,ground:true});s.shots=[{kind:'fire',x:2148,y:484,v:-220,age:0}];if(!shield)s.heroes[2].shield=false;
  for(let n=0;n<36;n++)step(s,{},1/120);assert.equal(s.heroes[2].hp,shield?3:2);}
 const s=createState(2,'cycle');s.shots=[{kind:'fire',x:2028,y:472,v:-220,age:0}];step(s,{},1/120);step(s,{},1/120);assert.equal(s.shots[0].v,220);assert.ok(s.machine.bumperAt>0);
});
test('live laser damages, harmless charge does not, and repeated hits cause death',()=>{
 for(const time of [2.7,3.3]){const s=createState(2,'cycle');s.machine.highReached=true;s.machine.clock=time;Object.assign(s.heroes[0],{x:2160,y:464,ground:true});step(s,{},1/120);assert.equal(s.heroes[0].hp,time<3.2?3:2);}
 const s=createState(2,'cycle');s.machine.highReached=true;s.machine.clock=3.3;Object.assign(s.heroes[0],{x:2160,y:464,ground:true,hp:1});step(s,{},1/120);assert.ok(s.failed);assert.ok(s.heroes[0].dead);
});
test('sphere touches rail along its normal and fork is continuous',()=>{
 for(const branch of ['upper','lower'])for(let p=520;p<1500;p+=7){const rail=railPoint(p,branch),b=spherePose(p,branch);assert.ok(Math.abs(Math.hypot(b.x-p,b.y-rail.y)-BALL_RADIUS)<1e-8);}
 const a=spherePose(1000,'upper'),b=spherePose(1000,'lower');assert.deepEqual(a,b);
});
test('laser warning is harmless and live interval is bounded',()=>{
 assert.equal(laserPhase(2.9),'charge');assert.equal(laserPhase(3.5),'live');assert.equal(laserPhase(4.1),'off');
});
test('Olaf physical front shield pushes; an elevated or reversed shield does not',()=>{
 for(const valid of [true,false]){const s=createState(2,'cycle');s.active=2;Object.assign(s.heroes[2],{x:385,y:676,ground:true,face:1,shieldUp:!valid});for(let n=0;n<120;n++)step(s,{right:true},1/120);assert.equal(s.machine.pushStarted,valid);}
});
test('return is continuous, repeatable and does not relocate heroes',()=>{
 const s=createState(2,'cycle');s.machine.ball.p=1500;s.machine.ball.branch='lower';s.machine.ball.mode='caught';Object.assign(s.machine.ball,spherePose(1500,'lower'));const h=s.heroes.map(h=>[h.x,h.y]);requestReturn(s);let old={...s.machine.ball};
 for(let n=0;n<2400;n++){step(s,{},1/120);const b=s.machine.ball;assert.ok(Math.hypot(b.x-old.x,b.y-old.y)<3);old={...b};}
 assert.equal(s.machine.ball.mode,'cradle');assert.deepEqual(s.heroes.map(h=>[h.x,h.y]),h);
});
