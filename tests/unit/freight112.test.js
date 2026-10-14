import test from 'node:test';
import assert from 'node:assert/strict';
import {rotorFrameIndex,rotateNativeRaster} from '../../src/levels/freight/rotor.js';
import {freightWindRegions} from '../../src/levels/freight/wind-refraction.js';
import {fanPlacement,burnerPlacement,FREIGHT_HARDWARE,freightFanFeedRoute,freightBurnerFeedRoute} from '../../src/levels/freight/hardware-layout.js';
import {createState} from '../../src/core/engine.js';
import {connectionPlan} from '../../src/render/connection-layout.js';

test('fan rotation has one consistent direction and quantized phases',()=>{
 const phases=Array.from({length:60},(_,n)=>rotorFrameIndex(n/60,1));
 for(let n=1;n<phases.length;n++)assert.ok((phases[n]-phases[n-1]+72)%72<=2);
 assert.equal(rotorFrameIndex(10,0),0);
 assert.equal(rotorFrameIndex(1,1),rotorFrameIndex(1,1));
});
test('rotor rotation preserves canvas, pivot, pixel colors and transparent exterior',()=>{
 const data=new Uint8ClampedArray(9*9*4);for(const [x,y]of [[4,4],[4,2],[6,4]]){data[(y*9+x)*4]=180;data[(y*9+x)*4+3]=255;}
 const out=rotateNativeRaster(data,9,9,4,4,18);
 assert.equal(out.length,data.length);assert.deepEqual([...out.slice((4*9+4)*4,(4*9+4)*4+4)],[180,0,0,255]);
 assert.equal(out[(4*9+6)*4],180);assert.equal(out[3],0);
 assert.ok([...out].every(v=>v===0||v===180||v===255));
});
test('wind regions copy only active native-grid viewport intersections',()=>{
 const s={machine:{ventPose:1,secondDraft:.5}};
 const all=freightWindRegions(s,{x:0,y:0,width:3240,height:1140});
 assert.equal(all.length,2);assert.ok(all.reduce((a,r)=>a+r.w*r.h,0)<100000);
 for(const r of all)for(const k of ['x','y','w','h'])assert.equal(r[k]%2,0);
 assert.deepEqual(freightWindRegions(s,{x:2200,y:0,width:640,height:360}),[]);
 assert.deepEqual(freightWindRegions({machine:{ventPose:0,secondDraft:0}},{x:0,y:0,width:3240,height:1140}),[]);
 const clipped=freightWindRegions(s,{x:470,y:700,width:60,height:60});
 assert.equal(clipped.length,1);assert.ok(clipped[0].w<=60&&clipped[0].h<=60);
});
test('fan bases and compact furnace ports are registered to real floor geometry',()=>{
 for(const [x,floor]of [[480,940],[1660,640]]){const p=fanPlacement(x,floor);assert.equal(p.y+FREIGHT_HARDWARE.fan.base*2,floor);assert.equal(p.x+FREIGHT_HARDWARE.fan.seat[0]*2,x);assert.equal(p.w/FREIGHT_HARDWARE.fan.native[0],2);}
 const first=burnerPlacement(2440,360),second=burnerPlacement(2530,360);
 for(const [p,x]of [[first,2440],[second,2530]]){assert.equal(p.y+FREIGHT_HARDWARE.burner.base*2,360);assert.deepEqual(p.port,[x,336]);assert.equal(p.w/FREIGHT_HARDWARE.burner.native[0],2);}
 // Transparent padding can overlap; the two authored44-native-wide bodies fit.
 assert.ok(first.x+47*2<=second.x+2*2);
});
test('second draft has a fully supported fan foot and a separate climbable access bay',()=>{
 const s=createState(7,'cycle'),p=fanPlacement(1660,640);
 // The accepted base occupies native x4..60; both broad ends need real support.
 const floor=s.level.floors.find(f=>f.y===640&&f.x<=p.x+8&&f.x+f.w>=p.x+120);
 assert.ok(floor,'Full visible fan base must be on the receiving deck');
 const ladder=s.level.ladders.find(l=>l.top===560&&l.bottom===640);
 assert.ok(ladder);assert.ok(ladder.x-24>=p.x+128,'Access rails must clear the turning rotor/housing');
 assert.ok(s.level.platforms.some(f=>f.y===560&&ladder.x>=f.x&&ladder.x<=f.x+f.w));
});
test('the new grounded fan inlet has a renderable connection with no short bends',()=>{
 const route=freightFanFeedRoute();assert.deepEqual(route.at(-1),fanPlacement(1660,640).feed);
 assert.doesNotThrow(()=>connectionPlan(route,'pipe'));
});
test('furnace manifold enters supply pipes above the projectile mouths',()=>{
 const route=freightBurnerFeedRoute();assert.doesNotThrow(()=>connectionPlan(route,'pipe'));
 assert.deepEqual(route.at(-1),burnerPlacement(2530,360).feed);
 for(const x of [2440,2530])assert.ok(burnerPlacement(x,360).feed[1]<burnerPlacement(x,360).port[1]-20);
});
