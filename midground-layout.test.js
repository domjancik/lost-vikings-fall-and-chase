import test from 'node:test';
import assert from 'node:assert/strict';
import {middleLayout} from './midground-layout.js';
test('middle architecture retains aspect, support anchors and integer pixel motion',()=>{
 for(let round=0;round<8;round++)for(const x of [0,713.7,2568])for(const width of [632,1264]){
  const layout=middleLayout(round,{x,y:-100},{width,height:395});
  assert.ok(layout.length>=1);
  for(const p of layout){assert.equal(p.w/p.h,1.5);for(const v of [p.x,p.y,p.w,p.h])assert.equal(Math.abs(v%2),0);assert.equal(round===5?p.y:p.y+p.h,round===5?-100:610);}
  assert.ok(layout[0].x<=x);assert.ok(layout.at(-1).x+768>=x+width);
 }
});

