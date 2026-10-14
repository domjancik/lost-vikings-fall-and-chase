import test from 'node:test';import assert from 'node:assert/strict';
import {createState} from '../../src/core/engine.js';
import {createWardenSounds} from '../../src/levels/warden/audio.js';
import {effects} from '../../src/audio/sound-effects.js';
test('laser charge and discharge have dedicated sounds emitted once on physical onset',()=>{
 const s=createState(5,'cycle'),events=createWardenSounds();events(s);
 s.machine.laserWarnAt=1;assert.ok(events(s).some(e=>e.name==='wardenCharge'));assert.deepEqual(events(s),[]);
 s.machine.laserFireAt=2;assert.ok(events(s).some(e=>e.name==='wardenLaser'));assert.deepEqual(events(s),[]);
});
test('falling foot has an approach whoosh and grounded slam; held shield has no floor slam',()=>{
 const s=createState(5,'cycle'),events=createWardenSounds();events(s);s.machine.cycle=4.6;
 assert.ok(events(s).some(e=>e.name==='wardenDrop'));assert.deepEqual(events(s),[]);
 s.machine.slamAt=1;assert.ok(events(s).some(e=>e.name==='wardenStomp'));
 s.machine.braced=true;s.machine.slamAt=2;assert.ok(!events(s).some(e=>e.name==='wardenStomp'));
});
test('stomp has weight, metal and long room decay; laser has noisy air displacement',()=>{
 assert.ok(effects.wardenStomp,'Missing heavyweight stomp recipe');
 assert.ok(effects.wardenStomp.some(v=>v.type==='noise'&&v.duration>.6));
 assert.ok(effects.wardenStomp.some(v=>v.frequency<90&&v.duration>.5));
 assert.ok(effects.wardenLaser.some(v=>v.type==='noise'&&v.duration>=.35));
 assert.ok(effects.wardenCharge.some(v=>v.duration>=1.4));
});
