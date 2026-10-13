import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,step} from './engine.js';
import {wardenLevel,setupWarden,wardenGeometry,advanceWarden,wardenArrow,wardenObjects} from './warden-campaign.js';
const state=()=>{const s=createState(0,'cycle');setupWarden(s);return s;};
test('warden lowers the spine into the original jump envelope and has exactly four grounded load paths',()=>{
 const s=state(),before=wardenGeometry(s);assert.equal(s.level,wardenLevel);
 assert.equal(before.legs.length,4);assert.ok(760-before.spine[0].y>130);
 s.machine.braced=true;s.machine.kneel=1;s.machine.footY=860;
 const after=wardenGeometry(s);assert.ok(760-after.spine[0].y<=130);assert.ok(after.spine[0].y>before.spine[0].y);
 assert.equal(after.legs.filter(l=>l.foot.y===940).length,3);
});
test('shield bracing requires descending fork contact, not a remotely raised shield',()=>{
 const s=state(),o=s.heroes[2];o.shieldUp=true;o.shield=true;o.x=300;s.machine.cycle=4.6;
 advanceWarden(s,1/60);assert.equal(s.machine.braced,false);
 o.x=1490;o.y=896;o.ground=true;s.machine.cycle=4.6;
 for(let n=0;n<60&&!s.machine.braced;n++)advanceWarden(s,1/60);
 assert.equal(s.machine.braced,true);s.active=1;
 for(let n=0;n<90;n++)advanceWarden(s,1/60);assert.equal(s.machine.kneel,1);
 o.shieldUp=false;advanceWarden(s,1/60);assert.equal(s.machine.braced,false);assert.ok(s.machine.kneel<1);
});
test('closed shutters block a correct arrow, an exposed lens permanently releases the gondola',()=>{
 const s=state();s.machine.kneel=1;const eye=wardenGeometry(s).eye;
 assert.equal(wardenArrow(s,{x:1900,y:eye.y,v:-580},1800,1700),'armor');assert.equal(s.machine.disabled,false);
 s.machine.shutter=1;s.machine.exposure=8;
 assert.equal(wardenArrow(s,{x:1800,y:eye.y+80,v:-580},1800,1700),'armor');assert.equal(s.machine.disabled,false);
 assert.equal(wardenArrow(s,{x:1800,y:eye.y,v:-580},1800,1700),'lens');assert.equal(s.machine.disabled,true);
 for(let n=0;n<180;n++)advanceWarden(s,1/60);
 assert.equal(s.machine.cargo.y,870);assert.equal(s.machine.kneel,1);assert.equal(s.machine.release,1);
});
test('disabled warden lift can be recalled at either landing without abandoning heroes',()=>{
 const s=state();s.machine.disabled=true;s.machine.release=1;s.machine.kneel=1;s.machine.cargo.y=870;
 const control=wardenObjects(s).find(o=>o.id==='warden-lift-wheel');control.run();
 for(let n=0;n<900;n++)advanceWarden(s,1/60);
 assert.equal(s.machine.cargo.y,500);assert.equal(s.machine.cargo.x,2080);
 const lower=wardenObjects(s).find(o=>o.id==='warden-lower-call');lower.run();
 for(let n=0;n<900;n++)advanceWarden(s,1/60);
 assert.equal(s.machine.cargo.y,870);assert.equal(s.machine.cargo.x,1740);
 const upper=wardenObjects(s).find(o=>o.id==='warden-upper-call');upper.run();
 for(let n=0;n<900;n++)advanceWarden(s,1/60);
 assert.equal(s.machine.cargo.y,500);
});
test('unshielded stomp causes real damage and eventual death; remote shield cannot cancel it',()=>{
 const s=createState(5,'cycle');s.heroes[0].x=1490;s.heroes[2].shieldUp=true;
 for(let n=0;n<16*120&&!s.failed;n++)step(s,{},1/120);
 assert.equal(s.heroes[0].hp,0);assert.equal(s.failed,true);assert.equal(s.machine.braced,false);
});
test('four rigid load paths remain connected through brace and shutdown without crossing the floor',()=>{
 const s=createState(5,'cycle');Object.assign(s.heroes[2],{x:1490,shieldUp:true});
 for(let n=0;n<2600;n++){
  if(n===2000)s.machine.disabled=true;advanceWarden(s,1/60);
  for(const leg of wardenGeometry(s).legs){assert.ok(Math.abs(Math.hypot(leg.hip.x-leg.knee.x,leg.hip.y-leg.knee.y)-148)<.01);assert.ok(Math.abs(Math.hypot(leg.knee.x-leg.ankle.x,leg.knee.y-leg.ankle.y)-148)<.01);assert.ok(leg.knee.y+22<=940,`Joint buries below floor: ${leg.id} ${leg.knee.y}`);}
 }
});
