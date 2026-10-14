import test from 'node:test';
import assert from 'node:assert/strict';
import {waterRefractionBands,waterFlowPhase} from '../../src/levels/water/optics.js';

test('stream highlights travel down rather than up', () => {
  assert.equal(waterFlowPhase(600,0),waterFlowPhase(604,1/24));
  assert.notEqual(waterFlowPhase(600,0),waterFlowPhase(596,1/24));
});
test('refraction samples only submerged scene pixels, excluding air pockets', () => {
  const pocket={x:900,y:800,w:80,h:60};
  const bands=waterRefractionBands(540,[pocket],1,{x:800,y:760,width:400,height:180});
  assert.ok(bands.some(b=>b.x!==b.sourceX));
  for(const b of bands){
    for(const x of [b.x,b.sourceX]) {
      assert.ok(x>=800 && x+b.w<=1200);
      assert.ok(!(b.y<pocket.y+pocket.h&&b.y+b.h>pocket.y&&x<pocket.x+pocket.w&&x+b.w>pocket.x));
    }
    assert.ok(b.y>=760&&b.y+b.h<=940);
    for(const v of [b.x,b.sourceX,b.y,b.w,b.h])assert.equal(v%2,0);
  }
  assert.deepEqual(waterRefractionBands(950,[],1,{x:0,y:0,width:400,height:500}),[]);
});
