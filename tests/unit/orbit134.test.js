import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,step} from '../../src/core/engine.js';
const dt=1/120;
function crane(){const s=createState(8,'cycle'),g=s.machine;g.panelOpen=true;g.ropeCut[4]=true;g.brakePose=1;g.safety=true;return s;}

test('using the crane while running into the panel parks the operator immediately',()=>{
 const s=crane(),h=s.heroes[0],g=s.machine;Object.assign(h,{x:1799,y:606,ground:true,vx:230});
 step(s,{interact:true,right:true},dt);const x=h.x;
 for(let n=0;n<120;n++)step(s,{right:true},dt);
 assert.equal(g.operator,0);assert.equal(h.x,x);assert.equal(h.vx,0);assert.ok(g.hook.x>2600);
 step(s,{interact:true},dt);assert.equal(g.operator,null);
 step(s,{left:true},dt);assert.ok(h.vx<0,'normal walking resumes after USE');
});

test('a running bash does not carry the operator away after panel engagement',()=>{
 const s=crane(),h=s.heroes[0];Object.assign(h,{x:1795,y:606,ground:true,vx:320,bash:.2,bashFace:1});
 step(s,{interact:true,right:true},dt);for(let n=0;n<120;n++)step(s,{right:true},dt);
 assert.equal(s.machine.operator,0);assert.ok(h.x<1802);assert.equal(h.bash,0);
});

test('carrier lift accelerates and brakes without changing total lift time or endpoints',()=>{
 const s=crane(),p=s.machine.plates[0];Object.assign(p,{x:1120,phase:'lift'});
 const speeds=[];for(let n=0;n<350/120/dt;n++){const y=p.y;step(s,{},dt);speeds.push((y-p.y)/dt);}
 assert.equal(p.y,674);assert.equal(p.phase,'orbit');
 assert.ok(speeds[0]<10,'no full-speed first frame');assert.ok(Math.max(...speeds)>150);
 assert.ok(speeds.at(-1)<10,'braking before arrival');assert.ok(speeds.every(v=>v>=0));
});

test('carrier docking eases its translation and settles exactly in the receiver',()=>{
 const s=crane(),p=s.machine.plates[0];Object.assign(p,{x:1120,y:674,angle:0,phase:'dock'});
 const speeds=[];for(let n=0;n<500;n++){const x=p.x;step(s,{},dt);if(p.x!==x)speeds.push((p.x-x)/dt);}
 assert.equal(p.x,1610);assert.equal(p.phase,'parked');assert.ok(speeds[0]<10);assert.ok(speeds.at(-1)<10);assert.ok(Math.max(...speeds)>180);
});

test('orbit drive builds angular momentum rather than starting at full rotation rate',()=>{
 const s=crane(),p=s.machine.plates[0];Object.assign(p,{x:1120,y:674,phase:'orbit'});
 step(s,{},dt);assert.ok(p.angle>0&&p.angle<Math.PI/8*dt/4);
 for(let n=0;n<120;n++)step(s,{},dt);const angle=p.angle;step(s,{},dt);
 assert.ok(Math.abs((p.angle-angle)/dt-Math.PI/8)<1e-8);
});


test('magnetic rail momentum is parked while a booted Viking operates the crane',()=>{
 const s=crane(),h=s.heroes[1],p=s.machine.plates[0];s.active=1;
 Object.assign(p,{x:1610,y:674,angle:0,phase:'parked'});
 Object.assign(h,{x:1754,y:606,ground:true,vx:175,magV:175,boots:true,magnet:{plateId:0,u:300}});h.inventory[0]='magneticShoes';
 step(s,{interact:true,right:true},dt);const u=h.magnet.u;
 for(let n=0;n<120;n++)step(s,{right:true},dt);
 assert.equal(s.machine.operator,1);assert.equal(h.magnet.u,u);assert.equal(h.magV,0);assert.ok(s.machine.hook.x>2600);
});
