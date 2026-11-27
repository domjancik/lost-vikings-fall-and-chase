import test from 'node:test';
import assert from 'node:assert/strict';

test('water foliage and machinery wait for complete images before baking reusable frames',async()=>{
 const oldImage=globalThis.Image,oldDocument=globalThis.document,images=[],copies=[];
 globalThis.Image=class extends EventTarget{
  complete=false;naturalWidth=128;naturalHeight=96;
  constructor(){super();images.push(this);}
 };
 globalThis.document={createElement:()=>({getContext:()=>new Proxy({drawImage:image=>copies.push(image.complete)},{get:(object,key)=>object[key]||(()=>{})})})};
 try{
  const {drawWaterPlants}=await import('../../src/levels/water/effects.js?loading-regression');
  const {drawWater92Valve}=await import('../../src/levels/water/art.js?loading-regression');
  const draws=[],ctx={drawImage:(...args)=>draws.push(args),fillRect(){}};
  const state={time:2,machine:{waterY:540}};
  drawWaterPlants(ctx,state);
  drawWater92Valve(ctx,1100,900,0);
  assert.equal(draws.length,0,'metadata dimensions alone cannot authorize a cached sprite');
  for(const image of images){image.complete=true;image.dispatchEvent(new Event('load'));}
  drawWaterPlants(ctx,state);
  drawWater92Valve(ctx,1100,900,0);
  assert.equal(draws.length,12);
  assert.ok(copies.length>0&&copies.every(Boolean),'only fully loaded pixels enter reusable foliage frames');
 }finally{globalThis.Image=oldImage;globalThis.document=oldDocument;}
});
