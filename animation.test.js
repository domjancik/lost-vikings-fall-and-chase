import {test} from 'node:test';import assert from 'node:assert/strict';import {animationFor} from './sprite-render.js';import {createState,step} from './engine.js';
import {damage} from './health.js';
test('real hazard damage displays the authored recoil pose',()=>{const s=createState();const h=s.heroes[1];h.ground=true;damage(s,h);assert.equal(animationFor(h).pose,'hurt');});
test('shield transition body frames span its actual front-to-overhead range',()=>{
 assert.equal(animationFor({id:2,ground:true,shield:true,shieldUp:true,shieldPose:.4}).frame,0);
 assert.equal(animationFor({id:2,ground:true,shield:true,shieldUp:true,shieldPose:.7}).frame,3);
});
test('running animation advances with distance, and stops when the Viking stops',()=>{const s=createState();for(let i=0;i<30;i++)step(s,{},1/60);const frames=new Set();for(let i=0;i<30;i++){step(s,{right:true},1/60);const pose=animationFor(s.heroes[0]);if(pose.pose==='run')frames.add(pose.frame);}assert.ok(frames.size>=6);for(let i=0;i<20;i++)step(s,{},1/60);assert.equal(animationFor(s.heroes[0]).pose,'idle');});
test('jumping, falling, and landing have separate poses',()=>{assert.equal(animationFor({id:0,ground:false,vy:-200}).pose,'rise');assert.equal(animationFor({id:0,ground:false,vy:200}).pose,'fall');assert.equal(animationFor({id:0,ground:true,land:.1}).pose,'land');});
test('Baleog sword and bow each use an attack animation',()=>{assert.equal(animationFor({id:1,ground:true,swing:.2}).pose,'sword');assert.equal(animationFor({id:1,ground:true,bow:.2}).pose,'bow');});
test('Olaf floats with a distinct overhead shield pose',()=>{assert.equal(animationFor({id:2,ground:false,vy:100,shieldUp:true}).pose,'float');assert.equal(animationFor({id:2,ground:true,shieldUp:true}).pose,'overhead');});
test('Erik can bash a barricade after a running start',()=>{const s=createState();for(let i=0;i<30;i++)step(s,{},1/60);s.heroes[0].x=325;for(let i=0;i<24;i++)step(s,{right:true,action:i===20},1/60);assert.equal(s.crate,false);});
test('raising and lowering the shield each have intermediate frames',()=>{assert.equal(animationFor({id:2,ground:true,shieldUp:true,shieldPose:.5}).pose,'shield-raise');assert.equal(animationFor({id:2,ground:true,shield:true,shieldUp:false,shieldPose:.8}).pose,'shield-lower');});
