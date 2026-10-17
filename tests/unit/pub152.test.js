import test from 'node:test';
import assert from 'node:assert/strict';
import {alehallCoastPlacement,alehallSkyPlacement,alehallSkyPixels,drawAlehallSky} from '../../src/levels/pub/scenery.js';
test('sky never caches undecoded image pixels while image dimensions are already known',()=>{
 assert.doesNotThrow(()=>drawAlehallSky({}, {naturalWidth:384,complete:false},{x:0,y:0},{width:800,height:600}));
});
test('pub sky reaches the viewport top and overlaps the retained coast without changing its scale',()=>{
 for(const x of [0,650,1800])for(const y of [-900,-200,0,300,600])for(const width of [430,1440,2400]){
  const camera={x,y},far=alehallCoastPlacement(camera),sky=alehallSkyPlacement(camera,{width,height:900});
  assert.ok(sky.x<=x&&sky.x+sky.w>=x+width);assert.ok(sky.y<=y);assert.equal(sky.y+sky.h,far.y+2);assert.equal(sky.pixel,2);
 }
});
test('sky continuation meets original top pixels exactly, then fades into a quiet storm sky',()=>{
 const edge=new Uint8ClampedArray([80,90,100,255,100,110,120,255]),pixels=alehallSkyPixels(edge,2,64);
 assert.deepEqual([...pixels.slice(-8)],[...edge]);
 assert.deepEqual([...pixels.slice(0,4)],[...pixels.slice(4,8)]);
 assert.ok(pixels.every((v,i)=>i%4!==3||v===255));
});
test('cloud continuation diffuses contrast horizontally rather than stretching edge pixels into columns',()=>{
 const edge=new Uint8ClampedArray(64*4);for(let x=0;x<64;x++)edge.set([x%2?200:40,100,120,255],x*4);
 const pixels=alehallSkyPixels(edge,64),row=pixels.slice(32*64*4,33*64*4),reds=Array.from({length:64},(_,x)=>row[x*4]);
 assert.ok(Math.max(...reds)-Math.min(...reds)<12);assert.deepEqual([...pixels.slice(-256)],[...edge]);
});
