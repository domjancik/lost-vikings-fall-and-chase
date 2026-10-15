import test from 'node:test';
import assert from 'node:assert/strict';
import {createState} from '../../src/core/engine.js';
import {setupOrbit,orbitStep,orbitSurfaces,orbitRope} from '../../src/levels/orbit/campaign.js';
import {railContact,railLength,nearestRail,magneticPoint,detachMagnet} from '../../src/levels/orbit/magnetic.js';
import {transferItem} from '../../src/core/inventory.js';
import {simulateOrbitRoute} from '../routes/orbit-route113.js';
const fresh=()=>{const s=createState(0,'cycle');setupOrbit(s);return s;};
const tick=(s,input={},hz=120)=>{for(const h of s.heroes)h.invulnerable=Math.max(0,h.invulnerable-1/hz);orbitStep(s,input,1/hz);};
test('rounded magnetic rail has continuous sole and tangent at every seam',()=>{
 const p={x:0,y:0,angle:0,w:320,h:40};
 for(let u=0;u<railLength(p);u+=.25){const a=railContact(p,u),b=railContact(p,u+.25);assert.ok(Math.hypot(a.x-b.x,a.y-b.y)<.251);assert.ok(Math.abs(a.tx*b.tx+a.ty*b.ty-1)<.0001);}
});
test('approved carrier artwork owns the actual ellipse-ended physical rail and source contacts',()=>{
 const s=fresh(),p=s.machine.plates[0];assert.deepEqual([p.w,p.h,p.capRx,p.x,p.y],[344,48,16,780,1024]);const cap=(railLength(p)-624)/2,top=railContact(p,0),tip=railContact(p,312+cap/2);assert.ok(Math.abs(top.x-624)<.001);assert.equal(top.y,1000);assert.ok(Math.abs(tip.x-952)<.001);assert.ok(Math.abs(tip.y-1024)<.001);const deck=orbitSurfaces(s).find(p=>p.support==='orbit-0');assert.deepEqual([deck.x,deck.y,deck.w],[624,1000,312]);
 for(let u=0;u<railLength(p);u+=.25){const a=railContact(p,u),b=railContact(p,u+.25),near=nearestRail(p,a.x,a.y);assert.ok(Math.hypot(a.x-b.x,a.y-b.y)<.251);assert.ok(Math.abs(a.tx*b.tx+a.ty*b.ty-1)<.0005);assert.ok(near.distance<.001);}
});
test('magnetic equipment places all heroes using the same sole and local basis',()=>{
 for(const id of [0,1,2]){const h={id,magnet:{plateId:0,u:390},face:1},p={x:100,y:400,angle:.7,w:320,h:40};magneticPoint(h,p);const c=railContact(p,390);assert.ok(Math.hypot(h.magnetSole.x-c.x,h.magnetSole.y-c.y)<1e-6);assert.ok(Math.abs(h.rotation-Math.atan2(c.ty,c.tx))<1e-6);}
});
test('first corner adhesion turns the body gradually while its sole seats on the rail',()=>{
 const s=fresh(),h=s.heroes[0];Object.assign(h,{x:624,y:956,ground:true,boots:true});h.inventory[0]='magneticShoes';const old={x:h.x,y:h.y};tick(s);assert.ok(h.magnet);assert.ok(Math.abs(h.rotation)<=.051);assert.ok(Math.hypot(h.x-old.x,h.y-old.y)<7);const q=railContact(s.machine.plates[0],h.magnet.u);assert.ok(Math.hypot(h.magnetSole.x-q.x,h.magnetSole.y-q.y)<.001);
});
test('capture lift and rotation carry an inactive booted rider without height snaps',()=>{
 const s=fresh(),p=s.machine.plates[0],h=s.heroes[1];p.x=1120;p.phase='charge';h.inventory[0]='magneticShoes';h.boots=true;h.magnet={plateId:0,u:180};s.active=2;magneticPoint(h,p);
 for(let n=0;n<120*6;n++){const old={x:h.x,y:h.y};tick(s);assert.ok(Math.hypot(h.x-old.x,h.y-old.y)<5);}
 assert.equal(p.phase,'orbit');assert.ok(p.angle>0);assert.equal(h.support,'orbit-0');
});
test('magnetic gait counts local foot travel once and never advances from passive carrier motion',()=>{
 const s=fresh(),p=s.machine.plates[0],h=s.heroes[1],o=s.heroes[2];h.inventory[0]='magneticShoes';h.boots=true;h.magnet={plateId:0,u:180};magneticPoint(h,p);h.walk=10;Object.assign(o,{x:p.x-p.w/2-20,y:956,ground:true});s.active=2;tick(s,{right:true});assert.equal(h.walk,10);
 s.active=1;const u=h.magnet.u,walk=h.walk;tick(s,{right:true});assert.ok(Math.abs(h.walk-walk-Math.abs(h.magnet.u-u)/9)<1e-8);
});
test('hook clamp preserves actual carrier position and release does not teleport',()=>{
 const s=fresh(),g=s.machine,p=g.plates[1];g.panelOpen=true;g.ropeCut[4]=true;g.brakePose=1;g.operator=0;s.active=0;Object.assign(s.heroes[0],{x:1730,y:606,ground:true});Object.assign(p,{x:2540,y:444,phase:'float'});Object.assign(g.hook,{x:2540,y:420});
 tick(s,{action:true});assert.equal(g.hook.plateId,1);const old=p.x;tick(s,{right:true});assert.ok(p.x>old&&p.x-old<2);const before={x:p.x,y:p.y};tick(s,{sword:true});assert.equal(g.hook.plateId,null);assert.ok(Math.hypot(p.x-before.x,p.y-before.y)<2);
});
test('orbiting debris damages exposed bodies along its continuous ellipse',()=>{
 const s=fresh(),d=s.machine.debris[0],h=s.heroes[0];s.machine.safety=false;s.time=3;d.clock=3;d.angle=3*Math.PI*2/7.8;const a=(3+1/120)*Math.PI*2/7.8;Object.assign(h,{x:d.cx+Math.cos(a)*d.rx,y:d.cy+Math.sin(a)*d.ry-22,ground:false});tick(s);assert.ok(h.hp<3);assert.ok(s.machine.debris.every(q=>q.phase==='warning'||q.phase==='active'||q.phase==='rest'));
});
test('transferring the physical shoes removes the former wearer’s adhesion',()=>{
 const s=fresh(),h=s.heroes[0],b=s.heroes[1],p=s.machine.plates[0];h.inventory[0]='magneticShoes';h.boots=true;h.magnet={plateId:0,u:100};magneticPoint(h,p);Object.assign(b,{x:h.x+30,y:h.y});assert.equal(transferItem(s,0,1,0),true);tick(s);assert.equal(h.magnet,null);assert.equal(h.boots,false);assert.ok(b.inventory.includes('magneticShoes'));assert.equal(b.boots,false);
});
test('releasing a ceiling contact rotates into free flight without an instantaneous body flip',()=>{
 const s=fresh(),h=s.heroes[0],p=s.machine.plates[0];Object.assign(p,{x:1120,y:674,phase:'orbit'});h.inventory[0]='magneticShoes';h.boots=true;h.magnet={plateId:0,u:420};magneticPoint(h,p);const angle=h.rotation;detachMagnet(h,p);h.boots=false;assert.equal(h.rotation,angle);let old=h.rotation;for(let n=0;n<120;n++){tick(s);assert.ok(Math.abs(Math.atan2(Math.sin(h.rotation-old),Math.cos(h.rotation-old)))<.08);old=h.rotation;}assert.equal(h.rotation,0);
});
test('a turned bow shoots along its actual local tangent and shutter blocks closed rope',()=>{
 const s=fresh(),p=s.machine.plates[0],b=s.heroes[1];s.active=1;Object.assign(p,{x:1120,y:674,angle:Math.PI/2,phase:'orbit'});b.inventory[0]='magneticShoes';b.boots=true;b.magnet={plateId:0,u:240};magneticPoint(b,p);tick(s,{action:true});assert.ok(Math.abs(s.shots[0].vx)<.001);assert.ok(s.shots[0].vy>579);
 s.shots=[{kind:'arrow',x:1345,y:626,vx:580,vy:0,life:2}];p.angle=Math.PI;tick(s);assert.equal(s.machine.ropeCut[0],false);assert.equal(s.shots.length,0);
 s.shots=[{kind:'arrow',x:1345,y:626,vx:580,vy:0,life:2}];p.angle=0;s.machine.ropeAperture[0]=1;tick(s);assert.equal(s.machine.ropeCut[0],true);
});
test('ordinary rope also responds to a sword when the exposed material is physically within reach',()=>{
 const s=fresh(),p=s.machine.plates[0],b=s.heroes[1];s.active=1;Object.assign(p,{x:1120,y:674,angle:0,phase:'orbit'});s.machine.ropeAperture[0]=1;Object.assign(b,{x:1290,y:606,face:1,ground:true});tick(s,{sword:true});assert.ok(b.swing>0);assert.equal(s.machine.ropeCut[0],true);
});
test('the timed shutter travels continuously before exposing rope, then reverses on closing',()=>{
 const s=fresh(),p=s.machine.plates[0];Object.assign(p,{x:1120,y:674,phase:'orbit'});for(let n=0;n<8;n++)tick(s);assert.ok(orbitRope(s,0).aperture>0&&orbitRope(s,0).aperture<1);assert.equal(orbitRope(s,0).open,false);for(let n=0;n<24;n++)tick(s);assert.equal(orbitRope(s,0).aperture,1);assert.equal(orbitRope(s,0).open,true);p.angle=Math.PI;tick(s);assert.ok(orbitRope(s,0).aperture>0&&orbitRope(s,0).aperture<1);assert.equal(orbitRope(s,0).open,false);for(let n=0;n<24;n++)tick(s);assert.equal(orbitRope(s,0).aperture,0);
});
test('hook operation ends when switching heroes or when its operator is hurt',()=>{
 const s=fresh(),g=s.machine;g.panelOpen=true;g.ropeCut[4]=true;g.brakePose=1;g.operator=0;Object.assign(s.heroes[0],{x:1730,y:606,ground:true});s.active=1;tick(s);assert.equal(g.operator,null);g.operator=0;s.active=0;s.heroes[0].hurt=.3;tick(s);assert.equal(g.operator,null);
});
test('a lethal hazard during crane operation releases camera ownership in that same step',()=>{
 const s=fresh(),g=s.machine,h=s.heroes[0],d=g.debris[0];g.operator=0;s.active=0;Object.assign(h,{x:1730,y:606,ground:true,hp:1});Object.assign(d,{cx:1500,cy:628,clock:-1/120,angle:-Math.PI*2/7.8/120});tick(s);assert.equal(s.failed,true);assert.equal(h.dead,true);assert.equal(g.operator,null);
});
test('debris warning and active sweeps have continuous endpoints',()=>{
 const s=fresh();s.machine.safety=true;let old=s.machine.debris[0];let x=old.x,y=old.y;for(let n=0;n<120*9;n++){tick(s);old=s.machine.debris[0];assert.ok(Math.hypot(old.x-x,old.y-y)<4);x=old.x;y=old.y;}
});
for(const hz of [60,120])test('normal-input Scrap Orbit route clears healthy at '+hz+'Hz',()=>{const result=simulateOrbitRoute(hz);assert.equal(result.won,true);assert.deepEqual(result.hp,[3,3,3]);assert.ok(result.milestones.some(m=>m.name==='teach-ceiling-walk'));});
for(const hz of [60,120])test('mistiming the real second carrier lift exposes its rider to scrap at '+hz+'Hz',()=>{const result=simulateOrbitRoute(hz,{danger:true});assert.equal(result.damaged,true);assert.deepEqual(result.hp,[3,2,3]);});
