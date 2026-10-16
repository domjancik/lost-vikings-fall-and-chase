import test from 'node:test';
import assert from 'node:assert/strict';
import {sewerWheelMount} from '../../src/levels/sewer/wheel.js';
import {rotateNativeRaster} from '../../src/levels/freight/rotor.js';

test('sewer wheels register their actual axle to the grounded source housing',()=>{
 for(const [kind,axis,origin] of [['valve',[1050,580],[986,512]],['winch',[1820,572],[1776,512]]]){
  const m=sewerWheelMount(kind);
  assert.deepEqual(m.axis,axis);
  assert.deepEqual(m.origin,origin);
  assert.equal(m.origin[1]+64*2,640);
  assert.deepEqual(m.pivot.map((v,i)=>m.origin[i]+v*2),axis);
 }
});

test('native wheel axle never orbits as the mechanism turns',()=>{
 const size=80,pixels=new Uint8ClampedArray(size*size*4),center=(40*size+40)*4;
 pixels.set([231,174,85,255],center);
 for(let phase=0;phase<72;phase++)assert.deepEqual([...rotateNativeRaster(pixels,size,size,40,40,phase).slice(center,center+4)],[231,174,85,255]);
});
