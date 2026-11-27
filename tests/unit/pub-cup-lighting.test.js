import test from 'node:test';
import assert from 'node:assert/strict';
import {createState} from '../../src/core/engine.js';
import {cupFactoryScene} from '../../src/levels/pub/cup-factory.js';
import {ALEHALL_ROOM_LIGHTING,alehallRoomLights,alehallRoomShade} from '../../src/levels/pub/scenery.js';

function visibility(x,y){
 let darkness=ALEHALL_ROOM_LIGHTING.ambient*alehallRoomShade(x,y);
 for(const light of alehallRoomLights(706)){
  const strength=light.light*Math.max(0,1-Math.hypot(x-light.x,y-light.y)/light.r);
  darkness*=1-strength;
 }
 return 1-darkness;
}
test('discarded cups catch faint globe spill while the upper storeroom stays dark',()=>{
 const s=createState(11,'cycle');s.machine.factory.pile=32;
 for(const cup of cupFactoryScene(s).pile){
  const brightness=visibility(cup.x,cup.bottom-cup.height/2);
  assert.ok(brightness>=.10,'cup silhouette must remain faintly visible');
  assert.ok(brightness<.3,'corner should retain the storeroom darkness');
 }
 assert.ok(visibility(2390,650)<.12,'upper far corner stays dark');
});
