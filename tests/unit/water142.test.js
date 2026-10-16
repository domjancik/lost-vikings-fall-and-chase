import test from 'node:test';
import assert from 'node:assert/strict';

test('each water plant keeps its authored leaves throughout a complete sway cycle',async()=>{
 const previousImage=globalThis.Image,previousDocument=globalThis.document;
 globalThis.Image=class{naturalWidth=128;};
 globalThis.document={createElement:()=>{
  const rows=[];
  return{rows,getContext:()=>({drawImage:(_image,_sx,sy)=>rows.push(sy)})};
 }};
 try{
  const {drawWaterPlants}=await import('../../src/levels/water/effects.js');
  const poses=[];
  const c={drawImage:(frame,x,y,w,h)=>poses.push({frame,x,y,w,h}),fillRect:()=>{}};
  const sourceRows=Array.from({length:10},()=>new Set());
  for(let phase=0;phase<12;phase++){
   poses.length=0;
   drawWaterPlants(c,{time:4+(phase+.1-376*.015)/3,machine:{waterY:550}});
   assert.equal(poses.length,10,'all plants remain present');
   const p=poses[0];assert.deepEqual([p.x,p.y,p.w,p.h],[336,908,80,96]);
   poses.forEach((p,i)=>sourceRows[i].add(Math.floor(p.frame.rows[0]/48)));
  }
  for(const rows of sourceRows)assert.equal(rows.size,1,'sway must not swap in a differently drawn set of leaves');
  assert.equal(new Set(sourceRows.map(rows=>[...rows][0])).size,2,'both authored variants remain in the environment');
  for(const waterY of [550,890,950]){
   poses.length=0;drawWaterPlants(c,{time:7,machine:{waterY}});
   poses.forEach((p,i)=>assert.ok(sourceRows[i].has(Math.floor(p.frame.rows[0]/48)),'draining cannot replace a plant'));
  }
 }finally{globalThis.Image=previousImage;globalThis.document=previousDocument;}
});
