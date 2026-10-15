import test from 'node:test';
import assert from 'node:assert/strict';
import {heroAnimationCell} from '../../src/heroes/hero-frames.js';
import {syncShieldArtPose} from '../../src/heroes/hero-shield-registration.js';
test('default Olaf uses eight whole-actor stride poses with integrated equipment',()=>{
 for(const shieldUp of [false,true]){
  const cells=Array.from({length:8},(_,frame)=>heroAnimationCell({id:2,skin:'current',shieldUp},'run',frame));
  assert.equal(new Set(cells.map(c=>c.cell)).size,8);
  assert.ok(cells.every(c=>c.sheet==='imagegen90'));
 }
 for(const pose of ['idle','climb','float','shield-raise','shield-lower','look-up','look-down']){
  assert.deepEqual(heroAnimationCell({id:2,skin:'current'},pose,2),heroAnimationCell({id:2,skin:'imagegen90'},pose,2));
 }
});
test('default Olaf shield collision uses the same reviewed equipment as his complete pose',()=>{
 for(const shieldUp of [false,true]){
  const current={id:2,face:1,shieldUp},generated={...current};
  syncShieldArtPose(current,'current',{pose:'run',frame:5});
  syncShieldArtPose(generated,'imagegen90',{pose:'run',frame:5});
  assert.equal(current.skin,'imagegen90');assert.deepEqual(current.shieldArtPose,generated.shieldArtPose);
 }
});
test('the current Erik and Baleog use their latest corrected art bindings',()=>{
 for(const id of [0,1])assert.equal(heroAnimationCell({id,skin:'current'},'run',4).sheet,'imagegen90');
});
