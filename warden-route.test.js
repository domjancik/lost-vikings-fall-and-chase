import test from 'node:test';
import assert from 'node:assert/strict';
import {runWardenRoute} from './warden-route.js';
for(const hz of [60,120])test(`Warden full ordinary-input route at ${hz}Hz`,()=>{
 const {s,stages}=runWardenRoute(hz);assert.equal(s.won,true);assert.equal(s.failed,false);assert.deepEqual(s.heroes.map(h=>h.hp),[3,3,3]);assert.deepEqual(stages,['brace','marksman','spine','plunger','lens','lift','exit']);
});
for(const hz of [60,120])test(`Warden ordinary-input recovery and both landing calls at ${hz}Hz`,()=>{
 const {s,recovery}=runWardenRoute(hz,()=>{},true);
 assert.equal(s.won,true);assert.deepEqual(s.heroes.map(h=>h.hp),[3,3,3]);
 assert.deepEqual(recovery,['shield-unload','missed-window','lower-call','upper-call']);
});
