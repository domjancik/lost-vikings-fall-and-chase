import test from 'node:test';
import assert from 'node:assert/strict';
const hearth=await import('../../src/levels/pub/hearth.js').catch(()=>null);

test('hearth flames stay inside the native fire pit rather than climbing its stone walls',()=>{
 assert.ok(hearth,'hearth renderer exists');
 for(let t=0;t<8;t+=1/60){
  const {opening,flames}=hearth.alehallHearthGeometry(t);
  assert.deepEqual(opening,{x:1140,y:706,w:54,h:10});
  assert.ok(flames.length>=6);
  for(const f of flames){
   for(const v of [f.x,f.y,f.w,f.h])assert.equal(v%2,0);
   assert.ok(f.x>=opening.x&&f.y>=opening.y&&f.x+f.w<=opening.x+opening.w&&f.y+f.h<=opening.y+opening.h);
  }
 }
});

test('rising heat clips to the camera, changes with simulation time and freezes when paused',()=>{
 assert.ok(hearth);
 const view={x:1160,y:650,width:32,height:42},a=hearth.alehallHearthGeometry(1,view),b=hearth.alehallHearthGeometry(1.2,view);
 assert.deepEqual(a,hearth.alehallHearthGeometry(1,view));
 assert.notDeepEqual(a.heat.strips,b.heat.strips);
 for(const g of [a,b]){const r=g.heat.region;for(const v of [r.x,r.y,r.w,r.h])assert.equal(v%2,0);assert.ok(r.x>=view.x&&r.y>=view.y&&r.x+r.w<=1192&&r.y+r.h<=692);}
 assert.equal(hearth.alehallHearthGeometry(2,{x:0,y:0,width:400,height:400}).heat,null);
});

test('hearth refraction uses a small native buffer without readbacks and honors the canvas transform',()=>{
 assert.ok(hearth);
 const copies=[],draws=[],clips=[];
 const bufferContext={clearRect(){},drawImage(...args){copies.push(args);}};
 globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>bufferContext})};
 const c={canvas:{width:800,height:600},getTransform:()=>({a:2,d:2,e:-2200,f:-1200}),save(){},restore(){},beginPath(){},rect(...args){clips.push(args);},clip(){},fillRect(){},drawImage(...args){draws.push(args);}};
 const result=hearth.drawAlehallHearth(c,{time:1},{x:0,y:0},{width:100,height:100});
 assert.equal(copies.length,1);assert.ok(result.heat.copiedPixels<=58*82/4);assert.ok(draws.length>0);assert.equal(result.readbacks,0);
 assert.deepEqual(clips[0],[1140,706,54,10]);
 assert.equal(copies[0][1],(result.heat.region.x-1100)*2);
 assert.equal(copies[0][2],(result.heat.region.y-600)*2);
 delete globalThis.document;
});
