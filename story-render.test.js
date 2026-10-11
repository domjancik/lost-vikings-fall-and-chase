import test from 'node:test';
import assert from 'node:assert/strict';
import {createState} from './engine.js';
test('canopy reveal retains full-resolution crop sources after scene cache changes',async()=>{
 const previous=globalThis.Image;
 globalThis.Image=class{complete=true;naturalWidth=768;naturalHeight=512;width=768;height=512;};
 try{
  const {drawStoryBackground,drawStoryWorld}=await import('./story-render.js');
  const calls=[],ctx=new Proxy({drawImage(...args){calls.push(args);}},{get:(o,k)=>o[k]||(()=>{})});
  const s=createState(5,'story');
  for(const progress of [0,1])for(const view of [{width:1264,height:790},{width:632,height:395}]){
   s.machine.payloads[0].progress=progress;
   drawStoryBackground(ctx,s,{x:1800,y:-100},view);
   assert.doesNotThrow(()=>drawStoryWorld(ctx,s,()=>{},()=>{}));
  }
  const pub=calls.filter(a=>a[1]===475&&a[2]===10);
  assert.equal(pub.length,4);assert.ok(pub.every(a=>a[0].src.endsWith('scene-5.png?v=native47')));
 }finally{globalThis.Image=previous;}
});
