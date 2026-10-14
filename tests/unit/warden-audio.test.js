import test from 'node:test';import assert from 'node:assert/strict';import {createState} from '../../src/core/engine.js';import {createWardenSounds} from '../../src/levels/warden/audio.js';
test('warden audio reacts once to contacts, shutter release and lens fracture; restart is silent',()=>{
 const s=createState(5,'cycle'),events=createWardenSounds();assert.deepEqual(events(s),[]);
 s.machine.braced=true;assert.deepEqual(events(s).map(e=>e.name),['shieldHit']);assert.deepEqual(events(s),[]);
 s.machine.exposure=8;assert.deepEqual(events(s).map(e=>e.name),['plunger']);s.machine.disabled=true;assert.deepEqual(events(s).map(e=>e.name),['lens']);assert.deepEqual(events(s),[]);
 assert.deepEqual(events(createState(5,'cycle')),[]);
});
