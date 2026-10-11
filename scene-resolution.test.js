import test from 'node:test';
import assert from 'node:assert/strict';
import {sceneResolution,prepareScenePixels} from './scene-resolution.js';
test('scene native grids follow the intended display size at both zooms and phone layouts',()=>{
 for(const view of [{width:1264,height:790},{width:632,height:395},{width:365,height:790},{width:183,height:395}]){
  const p=sceneResolution(view),wanted=Math.max(view.width*1.18,view.height*1.5);
  assert.ok(p.width>=wanted);assert.ok(p.width/wanted<1.02);
  assert.equal(p.width/p.nativeWidth,2);assert.equal(p.height/p.nativeHeight,2);
  assert.equal(p.nativeWidth/p.nativeHeight,1.5);assert.notEqual(p.nativeWidth,256);
 }
 assert.equal(sceneResolution({width:1264,height:790}).nativeWidth,747);
 assert.equal(sceneResolution({width:632,height:395}).nativeWidth,375);
 assert.equal(sceneResolution({width:183,height:395}).nativeWidth,297);
});
test('ultrawide scenery retains a complete aspect-correct image on an integer grid',()=>{const p=sceneResolution({width:3600,height:790});assert.ok(p.width>=3600);assert.equal(p.width/p.nativeWidth,p.height/p.nativeHeight);assert.equal(p.width/p.nativeWidth%2,0);});

test('width thresholds never magnify the far scene abruptly',()=>{for(const width of [1301,1302,1920,3600]){const p=sceneResolution({width,height:790}),want=Math.max(width*1.18,790*1.5);assert.ok(p.width/want<1.01);assert.equal(p.width/p.nativeWidth,2);}});

test('display grid preparation preserves source-cell bounds at fractional ratios and solid pixels',()=>{
 const w=31,h=19,data=new Uint8ClampedArray(w*h*4);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4;data.set([40+x*2,50+y*2,60+x+y,255],i);}
 for(const [dw,dh]of [[18,11],[62,38],[31,19]]){
  const out=prepareScenePixels(data,w,h,dw,dh);
  for(let y=0;y<dh;y++)for(let x=0;x<dw;x++){
   const x0=Math.min(w-1,Math.ceil(x*w/dw)),x1=Math.min(w,Math.max(x0+1,Math.ceil((x+1)*w/dw))),y0=Math.min(h-1,Math.ceil(y*h/dh)),y1=Math.min(h,Math.max(y0+1,Math.ceil((y+1)*h/dh)));
   for(let c=0;c<3;c++){const cell=[];for(let sy=y0;sy<y1;sy++)for(let sx=x0;sx<x1;sx++)cell.push(data[(sy*w+sx)*4+c]);assert.ok(out[(y*dw+x)*4+c]>=Math.min(...cell)&&out[(y*dw+x)*4+c]<=Math.max(...cell));}
  }
 }
 assert.deepEqual(prepareScenePixels(data,w,h,w,h),data);
});
