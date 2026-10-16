import test from 'node:test';import assert from 'node:assert/strict';
import {nativeSceneCrop,createNativeSceneCache} from '../../src/render/native-scene-cache.js';
test('native crop clips camera coverage without scaling or fractional source pixels',()=>{
 assert.deepEqual(nativeSceneCrop({x:900,y:450},{width:844,height:390},2800,1200),{sx:450,sy:225,sw:422,sh:195,x:900,y:450,w:844,h:390});
 assert.deepEqual(nativeSceneCrop({x:2600,y:1100},{width:844,height:390},2800,1200),{sx:1300,sy:550,sw:100,sh:50,x:2600,y:1100,w:200,h:100});
 assert.equal(nativeSceneCrop({x:3000,y:0},{width:844,height:390},2800,1200),null);
});
test('native scene layers build once, do not freeze unloaded art, and evict bounded entries',()=>{
 const built=[],draws=[],canvases=[];const createCanvas=()=>{const c={width:0,height:0,getContext:()=>({setTransform(...a){c.transform=a;},imageSmoothingEnabled:true})};canvases.push(c);return c;};
 const cache=createNativeSceneCache({width:2800,height:1200,limit:2,createCanvas});const ctx={drawImage(...a){draws.push(a);}},camera={x:0,y:0},view={width:844,height:390};
 const paint=(key,ready=true)=>cache.draw(ctx,key,camera,view,ready,()=>{built.push(key);return key;});
 assert.equal(paint('back',false),'back');assert.equal(cache.size,0);paint('back');paint('back');assert.deepEqual(built,['back','back']);assert.deepEqual(canvases[0].transform,[.5,0,0,.5,0,0]);assert.equal(canvases[0].width,1400);assert.equal(canvases[0].height,600);
 paint('front');paint('high');assert.equal(cache.size,2);paint('back');assert.deepEqual(built,['back','back','front','high','back']);assert.equal(draws.length,5);
});
