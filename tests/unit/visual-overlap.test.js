import test from 'node:test';import assert from 'node:assert/strict';
import {createState,step} from '../../src/core/engine.js';import {interactionObjects} from '../../src/core/interactions.js';
import {portalBounds,ghostEyeBounds,ghostShotBounds,intersects} from '../../src/render/ghost-layout.js';
const doors=s=>interactionObjects(s).filter(o=>o.kind==='portal').map(portalBounds);
test('ghost source and its animated glow have clearance from every portal',()=>{const s=createState(3);for(let i=0;i<145;i++)step(s,{},1/120);const p=s.shots.find(p=>p.kind==='ghost');assert.ok(p);const source=ghostEyeBounds();assert.ok(doors(s).every(d=>!intersects(source,{...d,x:d.x-8,w:d.w+16})));});
test('unreflected ghosts and trails never cross a portal sprite',()=>{const s=createState(3);for(let i=0;i<900;i++){step(s,{},1/120);for(const p of s.shots.filter(p=>p.kind.includes('ghost'))){const bounds=ghostShotBounds(p);assert.ok(doors(s).every(d=>!intersects(bounds,d)),'Ghost crossed a door at x='+p.x);}}});
test('a reflected ghost still reaches the relocated source and unlocks the curse',()=>{const s=createState(3),o=s.heroes[2];o.x=720;o.y=456;o.ground=true;o.shield=true;o.face=-1;for(let i=0;i<400;i++)step(s,{},1/120);assert.equal(s.machine.mirror,true);});

test('every haunted door has distinct visual space in locked and unlocked states',()=>{for(const unlocked of [false,true]){const s=createState(3);s.machine.bell=unlocked;s.machine.seal=unlocked;const bounds=doors(s);for(let i=0;i<bounds.length;i++)for(let j=i+1;j<bounds.length;j++)assert.equal(intersects(bounds[i],bounds[j]),false);}});
