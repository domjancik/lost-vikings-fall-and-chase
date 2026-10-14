import test from 'node:test';import assert from 'node:assert/strict';
import {runWaterRoute} from '../routes/water-route.js';
for(const hz of [60,120])test('water puzzle clears with ordinary controls and full crew health at'+hz+'Hz',()=>{
 let maxWaterStep=0,last=540;const {s,stages}=runWaterRoute(hz,state=>{maxWaterStep=Math.max(maxWaterStep,state.machine.waterY-last);last=state.machine.waterY;});
 assert.equal(s.won,true);assert.deepEqual(s.heroes.map(h=>h.hp),[3,3,3]);assert.ok(maxWaterStep<=40/hz+.001);
 assert.deepEqual(stages,['local-jet-shelter','inlet-closed','air-towed-to-crank','chain-and-crank','shallow-recovery']);
});
