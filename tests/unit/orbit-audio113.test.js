import test from 'node:test';
import assert from 'node:assert/strict';
import {createState} from '../../src/core/engine.js';
import {createOrbitSounds} from '../../src/levels/orbit/audio.js';
import {orbitCameraFocus} from '../../src/levels/orbit/view.js';
import {orbitHeroIndicator} from '../../src/levels/orbit/hero-indicator.js';
test('magnetic selection marker stays by the actual head and points back through the local basis',()=>{
 const h={id:0,magnetSole:{x:100,y:400},rotation:Math.PI},p=orbitHeroIndicator(h);
 assert.ok(Math.abs(p.x-100)<1e-6);assert.equal(p.y,486);assert.equal(p.angle,Math.PI);
 assert.equal(orbitHeroIndicator({id:0,x:100,y:400}),null);
});
test('magnetic crane sounds follow actual changes once and reset silently',()=>{
 const sounds=createOrbitSounds(),s=createState(8,'cycle');assert.deepEqual(sounds(s),[]);
 s.heroes[0].boots=true;s.machine.hook.plateId=1;
 assert.deepEqual(sounds(s).map(e=>e.name),['lever','shieldHit']);assert.deepEqual(sounds(s),[]);
 assert.deepEqual(sounds(createState(8,'cycle')),[]);
});
test('hook camera restores the hero on use exit and character switch',()=>{
 const s=createState(8,'cycle'),hero=s.heroes[0];s.machine.operator=0;
 assert.equal(orbitCameraFocus(s,hero).x,s.machine.hook.x);
 s.active=1;assert.equal(orbitCameraFocus(s,hero),hero);
 s.active=0;s.machine.operator=null;assert.equal(orbitCameraFocus(s,hero),hero);
});
