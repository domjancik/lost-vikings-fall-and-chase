import test from 'node:test';import assert from 'node:assert/strict';
import * as frames from '../../src/heroes/hero-frames.js';import {animationFor} from '../../src/heroes/sprite-render.js';
import {createState,step} from '../../src/core/engine.js';
import {shieldTransform,SHIELD} from '../../src/heroes/hero-geometry.js';
test('Olaf walks with dedicated braced arms in each actual shield state',()=>{
 assert.ok(frames.heroAnimationCell);for(let f=0;f<8;f++){assert.equal(frames.heroAnimationCell({id:2,shieldUp:false},'run',f).cell,Math.floor(f/2));assert.equal(frames.heroAnimationCell({id:2,shieldUp:true},'run',f).cell,8+Math.floor(f/2));}
});
test('climb uses rear-facing authored frames and keeps the last reached pose when stopped',()=>{
 assert.ok(frames.heroAnimationCell);for(let id=0;id<3;id++){const h={id,climbing:true,climbMoving:true,climbPhase:2.2,ground:true};assert.equal(animationFor(h).frame,2);h.climbMoving=false;assert.equal(animationFor(h).frame,2);assert.equal(frames.heroAnimationCell(h,'climb',2).cell,id===2?22:14);}
});
test('Olaf distinguishes tucked draft, forward glide and air braking with fixed equipment',()=>{
 const h={id:2,shieldUp:true,shieldPose:1,ground:false,animTime:1,vx:150,vy:-100};assert.equal(animationFor(h).frame,0);
 h.vy=100;assert.ok([1,2].includes(animationFor(h).frame));h.vx=0;assert.equal(animationFor(h).frame,3);
});
test('real ladder travel advances animation and stopping preserves its last rung pose',()=>{
 const s=createState(3,'cycle');s.active=2;const h=s.heroes[2];Object.assign(h,{x:420,y:650,ground:false});
 for(let n=0;n<45;n++)step(s,{up:true},1/120);
 assert.ok(h.climbing);assert.ok(Math.abs(h.climbPhase)>1);
 for(let n=0;n<3;n++)step(s,{},1/120);
 const phase=h.climbPhase,pose=animationFor(h);
 for(let n=0;n<120;n++)step(s,{},1/120);
 assert.equal(h.climbPhase,phase);assert.deepEqual(animationFor(h),pose);
 for(let n=0;n<30;n++)step(s,{down:true},1/120);
 assert.ok(h.climbPhase>phase,'downward travel reverses the rung cycle');
});
test('ladder animation keeps a raised shield at its physical rider plane',()=>{
 const t=shieldTransform({id:2,shieldUp:true},'climb',0);assert.equal(t.y,SHIELD.upTop);assert.equal(t.width,SHIELD.width);assert.equal(t.height,SHIELD.height);
});
