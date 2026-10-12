import test from 'node:test';
import assert from 'node:assert/strict';
import {shieldHit} from './projectile-collision.js';
import {imagegen88ShieldPose} from './imagegen88-registration.js';
test('guided Imagegen shield uses its registered round silhouette and stowed state',()=>{
 const o={id:2,x:100,y:100,prevX:100,prevY:100,face:1,shield:true,skin:'imagegen88',shieldArtPose:imagegen88ShieldPose({id:2,face:1},'idle',0)};
 const center=100+o.shieldArtPose.y;
 assert.ok(shieldHit(o,{x:100,y:center},180,center));
 assert.equal(shieldHit(o,{x:100,y:138},180,138),null);
 o.shieldArtPose.mode='back';
 assert.equal(shieldHit(o,{x:100,y:center},180,center),null);
});
