import test from 'node:test';
import assert from 'node:assert/strict';
import {farSceneY,backdropY} from '../../src/render/vertical-parallax.js';

test('far scene scrolls vertically at a slower rate without uncovering viewport edges',()=>{
 for(const [height,imageHeight,top,bottom] of [[395,600,0,1200],[790,1188,-300,1800],[395,800,0,1020]]){
  const max=bottom-height,a=farSceneY(top,height,imageHeight,top,bottom),b=farSceneY(max,height,imageHeight,top,bottom);
  assert.ok(b.y-max<a.y-top,'distant scene must move on screen');
  assert.ok(Math.abs((b.y-max)-(a.y-top))<max-top);
  for(let camera=top;camera<=max;camera+=20){const l=farSceneY(camera,height,imageHeight,top,bottom);assert.ok(l.y<=camera);assert.ok(l.y+imageHeight>=camera+height);assert.equal(Math.abs(l.y%2),0);}
 }
});
test('native puzzle scenery keeps its scale and foundation below the real floor',()=>{
 const a=backdropY(0,74),b=backdropY(600,74);
 assert.ok(b-600<a);assert.ok(b>74);assert.equal(Math.abs(b%2),0);
 assert.ok(b+826>=900,'far foundation must not float above foreground ground');
});
