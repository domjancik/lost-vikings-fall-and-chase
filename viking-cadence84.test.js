import test from 'node:test';
import assert from 'node:assert/strict';
import {animationFor} from './sprite-render.js';
import {imagegen81} from './imagegen81-registration.js';

test('running cycles take a full human stride rather than alternating every nine units',()=>{
 for(const [id,distance] of [[0,128],[1,112],[2,104]]){
  const h={id,ground:true,vx:150,walk:0};
  const phases=[];
  for(let n=0;n<8;n++){h.walk=n*distance/8/9;phases.push(animationFor(h).frame);}
  assert.deepEqual(phases,[0,1,2,3,4,5,6,7]);
  h.walk=distance/9;assert.equal(animationFor(h).frame,0);
 }
});
test('trial artwork keeps its whole silhouette inside the previous walking size budget',()=>{
 for(const [id,height] of [[0,72],[1,76],[2,72]])assert.equal(imagegen81[id].worldHeight,height);
});
test('at normal 60 Hz movement every stride phase can be displayed without skipping',()=>{
 for(const [id,speed,distance]of [[0,230,128],[1,175,112],[2,150,104]]){
  const phases=new Set();let previous=0;
  for(let travel=0;travel<distance*2;travel+=speed/60){
   const frame=animationFor({id,ground:true,vx:speed,walk:travel/9}).frame;
   assert.ok((frame-previous+8)%8<=1);phases.add(frame);previous=frame;
  }
  assert.equal(phases.size,8);
 }
});
