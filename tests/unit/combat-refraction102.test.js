import test from 'node:test';import assert from 'node:assert/strict';
import {createState} from '../../src/core/engine.js';
const optics=await import('../../src/levels/warden/combat-refraction.js').catch(()=>null);
const view={x:800,y:400,width:900,height:600},beam={from:{x:1648,y:500},to:{x:1300,y:940}};
function regions(s){assert.ok(optics?.combatRefractionRegions);return optics.combatRefractionRegions(s,view,beam);}
test('pressure optics occur at actual slam and firing events, never on shield-held load',()=>{
 const s=createState(5,'cycle');assert.deepEqual(regions(s),[]);
 s.time=10;s.machine.slamAt=9.8;assert.ok(regions(s).some(r=>r.kind==='slam'));
 s.machine.braced=true;assert.ok(!regions(s).some(r=>r.kind==='slam'));
 s.machine.laser.phase='lock';assert.ok(!regions(s).some(r=>r.kind==='laser'));
 s.machine.laser.phase='fire';s.machine.laserFireAt=10;assert.ok(regions(s).some(r=>r.kind==='laser'));
});
test('distortion regions clip to the camera and stay on the native pixel grid',()=>{
 const s=createState(5,'cycle');s.time=10;s.machine.slamAt=9.8;s.machine.laser.phase='fire';s.machine.laserFireAt=10;
 for(const r of regions(s)){for(const v of [r.x,r.y,r.w,r.h])assert.equal(v%2,0);assert.ok(r.x>=view.x&&r.y>=view.y&&r.x+r.w<=1700&&r.y+r.h<=1000);}
 const before=JSON.stringify(s);regions(s);assert.equal(JSON.stringify(s),before);
});
