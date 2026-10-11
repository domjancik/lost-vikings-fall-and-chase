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
test('pub furniture keeps authored world scale across viewport and zoom changes',async()=>{
 const previous=globalThis.Image;
 globalThis.Image=class{complete=true;naturalWidth=768;naturalHeight=512;};
 try{
  const {drawStoryBackground}=await import('./story-render.js');
  const ctx=new Proxy({},{get:()=>()=>{}}),s=createState(7,'story');
  for(const view of [{width:1264,height:790},{width:632,height:395},{width:2000,height:1000}]){
   const bg=drawStoryBackground(ctx,s,{x:713.7,y:140},view);
   assert.equal(bg.size,384);assert.equal(bg.height,256);
   assert.deepEqual(bg.native,[192,128]);assert.ok(bg.source.includes('scale50/pub-far.png'));
   assert.ok(bg.middle.pieces.every(p=>p.w===576&&p.h===384&&p.y+p.h===612));
   assert.ok(bg.tiles.every(x=>Math.abs(x%2)===0));
  }
 }finally{globalThis.Image=previous;}
});
