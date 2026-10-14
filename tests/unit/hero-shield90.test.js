import test from 'node:test';
import assert from 'node:assert/strict';
import {shieldHit} from '../../src/core/projectile-collision.js';
import {syncShieldArtPose} from '../../src/heroes/hero-shield-registration.js';
test('the runtime skin binding supplies registered art geometry for imagegen90',()=>{
 const previous={id:2,face:1,shield:true},corrected={...previous};
 syncShieldArtPose(previous,'imagegen88',{pose:'idle',frame:0});
 syncShieldArtPose(corrected,'imagegen90',{pose:'idle',frame:0});
 assert.deepEqual(corrected.shieldArtPose,previous.shieldArtPose);
 assert.equal(corrected.skin,'imagegen90');
 syncShieldArtPose(corrected,'procedural',{pose:'idle',frame:0});
 assert.equal(corrected.shieldArtPose,undefined);
});
test('imagegen90 projectiles use the actual registered tilted shield, like skin88',()=>{
 const hero={x:100,y:100,face:1,shield:true,shieldUp:false,shieldArtPose:{mode:'front',x:50,y:0,rx:10,ry:20,roll:0}};
 const bullet={x:100,y:100};
 const previous=shieldHit({...hero,skin:'imagegen88'},bullet,170,100);
 const corrected=shieldHit({...hero,skin:'imagegen90'},bullet,170,100);
 assert.deepEqual(corrected,previous);
 assert.equal(corrected.x,160);
});
