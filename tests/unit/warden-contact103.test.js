import test from 'node:test';
import assert from 'node:assert/strict';
import {WARDEN_ART as A} from '../../src/levels/warden/art.js';
import {wardenGeometry} from '../../src/levels/warden/campaign.js';
import {createState} from '../../src/core/engine.js';

test('both authored feet register their exclusive material bottom, not an interior sole row',()=>{
 assert.deepEqual(A.anchors.footSoles,{'foot-near':43,'foot-far':42});
 const s=createState(5,'cycle');
 const offsets={near:(A.anchors.footSoles['foot-near']-A.anchors.footPivot[1])*A.worldPixel,far:(A.anchors.footSoles['foot-far']-A.anchors.footPivot[1])*A.worldPixel};
 for(const leg of wardenGeometry(s,offsets).legs){
  const name=leg.far?'foot-far':'foot-near',top=leg.foot.y-A.anchors.footSoles[name]*A.worldPixel;
  assert.equal(top+A.anchors.footSoles[name]*A.worldPixel,leg.foot.y);
  assert.equal(top+A.anchors.footPivot[1]*A.worldPixel,leg.ankle.y,'Ankle must still meet the translated mounting pivot');
  assert.ok(Math.abs(Math.hypot(leg.knee.x-leg.ankle.x,leg.knee.y-leg.ankle.y)-148)<.01);
 }
});
