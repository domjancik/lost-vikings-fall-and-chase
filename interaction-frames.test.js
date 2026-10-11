import test from 'node:test';
import assert from 'node:assert/strict';
import {interactionFrame} from './interaction-frames.js';
test('generated control sequences use distinct rows and stable terminal frames',()=>{
 for(const [kind,row] of [['lever',0],['wafer',1],['lift',2],['archive',3]]){
  assert.equal(interactionFrame(kind,0),row*8);assert.equal(interactionFrame(kind,1),row*8+7);
  assert.deepEqual(Array.from({length:8},(_,i)=>interactionFrame(kind,i/7)),Array.from({length:8},(_,i)=>row*8+i));
  assert.equal(interactionFrame(kind,10),row*8+7);assert.equal(interactionFrame(kind,-2),row*8);
 }
});
test('lift frame sequence reverses continuously when the command returns down',()=>{
 const down=Array.from({length:8},(_,i)=>interactionFrame('lift',1-i/7));
 assert.deepEqual(down,[23,22,21,20,19,18,17,16]);
});
