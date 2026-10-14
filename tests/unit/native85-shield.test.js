import test from 'node:test';
import assert from 'node:assert/strict';
import {shieldHit} from '../../src/core/projectile-collision.js';
import {native85ShieldPose} from '../../src/heroes/native85-registration.js';
const olaf=(face=1,pose='idle')=>({id:2,x:100,y:100,prevX:100,prevY:100,face,shield:true,skin:'native85',shieldArtPose:native85ShieldPose({id:2,face,shield:true},pose,0)});
test('native round shield blocks its face but leaves the space below clear',()=>{
 const o=olaf();assert.ok(shieldHit(o,{x:100,y:109},170,109));
 assert.equal(shieldHit(o,{x:100,y:138},170,138),null);
 assert.ok(shieldHit({...o,skin:'current70'},{x:100,y:138},170,138));
});
test('native shield is mirrored and does not guard from behind',()=>{
 assert.ok(shieldHit(olaf(-1),{x:100,y:109},30,109));
 assert.equal(shieldHit(olaf(),{x:170,y:109},100,109),null);
});
test('stowed ladder shield does not leave an invisible front guard',()=>{
 const o=olaf();o.shieldArtPose={...o.shieldArtPose,mode:'back'};
 assert.equal(shieldHit(o,{x:100,y:109},170,109),null);
});
test('overhead native shield blocks at the actual top and only incoming descent',()=>{
 const o=olaf();o.shieldUp=true;o.shieldArtPose={x:0,y:-36,rx:24,ry:6,roll:0,mode:'overhead'};
 const hit=shieldHit(o,{x:100,y:90},100,40);assert.ok(hit);assert.equal(hit.y,58);
 assert.equal(shieldHit(o,{x:100,y:40},100,90),null);
});
test('moving native shield sweeps into stationary projectiles at their world position',()=>{
 const o=olaf();o.prevX=70;const hit=shieldHit(o,{x:120,y:109},120,109);
 assert.ok(hit);assert.equal(hit.x,120);assert.equal(hit.y,109);
});
