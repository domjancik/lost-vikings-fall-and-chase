import test from 'node:test';import assert from 'node:assert/strict';
import {createState,step} from '../../src/core/engine.js';
import {heroResource} from '../../src/app/hero-resources.js';
import {animationFor} from '../../src/heroes/sprite-render.js';
for(const hz of [60,120])test('a falling water entry retains enough momentum to enter the water at'+hz+'Hz',()=>{
 const s=createState(4,'cycle'),e=s.heroes[0];Object.assign(e,{skin:'imagegen90',x:520,y:350,vy:550,ground:false});
 for(let n=0;n<hz*2;n++)step(s,{},1/hz);
 assert.ok(e.y+4>s.machine.waterY+2,'Entry must not cancel the fall and strand him above the surface');assert.equal(e.swimming,true);assert.equal(animationFor(e).pose,'swim');
 const before=e.y;for(let n=0;n<hz*.5;n++)step(s,{down:true},1/hz);assert.ok(e.y>before+35,'Down swims without another jump');
});
test('air resources appear only while the hero is submerged, for both display layers',()=>{
 const s=createState(4,'cycle'),e=s.heroes[0];assert.equal(heroResource(s,0),null,'Dry dock has no AIR meter');
 Object.assign(e,{x:520,y:750,ground:false});step(s,{},1/120);assert.equal(heroResource(s,0).kind,'air');
 Object.assign(e,{x:940,y:856,ground:true});step(s,{},1/120);assert.equal(e.inAirPocket,true);assert.equal(heroResource(s,0),null,'A breathing pocket is air, not water');
 Object.assign(e,{x:100,y:496,ground:true});step(s,{},1/120);assert.equal(heroResource(s,0),null);
});
