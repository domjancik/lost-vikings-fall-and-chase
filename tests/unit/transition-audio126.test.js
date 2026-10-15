import test from 'node:test';import assert from 'node:assert/strict';
import {createState} from '../../src/core/engine.js';import {createSoundEvents} from '../../src/audio/audio-events.js';
test('water and physical door completion never play a portal suck sound',()=>{
 for(const [campaign,round,cue]of [['cycle',10,'sewerWater'],['story',7,'ambient'],['story',6,'lens']]){const s=createState(round,campaign),observe=createSoundEvents();observe(s);s.won=true;const events=observe(s);assert.ok(events.some(e=>e.name===cue));assert.ok(!events.some(e=>e.name==='portal'));}
});
