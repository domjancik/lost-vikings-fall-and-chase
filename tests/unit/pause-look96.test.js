import test from 'node:test';
import assert from 'node:assert/strict';
import {createState} from '../../src/core/engine.js';
import {cameraLookDirection} from '../../src/render/view-camera.js';
test('pause keeps the ordinary up/down inspection view and resume follows current controls',()=>{
 const s=createState(6,'cycle');s.heroes[0].x=1620;
 assert.equal(cameraLookDirection(s,{up:true}),-1);
 assert.equal(cameraLookDirection(s,{},true,-1),-1);
 assert.equal(cameraLookDirection(s,{},false,-1),0);
});
