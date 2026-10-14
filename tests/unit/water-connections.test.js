import test from 'node:test';import assert from 'node:assert/strict';
import {waterCompressorHose} from '../../src/levels/water/connections.js';
import {connectionPlan} from '../../src/render/connection-layout.js';
test('compressor hose has legal bends throughout descent past the bell crown',()=>{
 for(let waterY=540;waterY<=950;waterY+=.5){
  const outlet={x:1748,y:Math.round((waterY-54)/2)*2},crown={x:1660,y:824};
  const route=waterCompressorHose(outlet,crown);assert.doesNotThrow(()=>connectionPlan(route,'cable'));
  assert.deepEqual(route[0],[outlet.x,outlet.y]);assert.deepEqual(route.at(-1),[crown.x,crown.y]);
 }
});
