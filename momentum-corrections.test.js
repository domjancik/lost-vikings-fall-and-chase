import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,step} from './engine.js';
test('Olaf advances continuously while his front shield pushes the cradle ball',()=>{
 const s=createState(2,'cycle');s.active=2;const h=s.heroes[2];Object.assign(h,{x:382,y:676,ground:true,face:1,shieldUp:false});
 let x=h.x;for(let n=0;n<200;n++){step(s,{right:true},1/120);assert.ok(h.x>=x-1e-6,'push contact must not knock Olaf backwards');x=h.x;}
 assert.equal(s.machine.ball.mode,'rolling');
});
test('safety stops new fireballs while existing shots continue their physical path',()=>{
 const s=createState(2,'cycle');s.machine.safety=true;s.machine.highReached=true;s.shots=[{kind:'fire',x:2300,y:454,v:-220,age:1}];
 step(s,{},1/120);assert.equal(s.shots.length,1);assert.ok(s.shots[0].x<2300);assert.ok(s.shots[0].age>1);
});
test('safety does not repair or immobilize fragile ground',()=>{
 const s=createState(2,'cycle');s.machine.safety=true;const t=s.machine.tiles[0];t.t=1;t.drop=30;t.vy=100;
 step(s,{},1/120);assert.ok(t.drop>30);assert.ok(t.t>1);
 const u=s.machine.tiles[1];Object.assign(s.heroes[0],{x:u.x+40,y:u.y-44,ground:true});step(s,{},1/120);assert.ok(u.t>0);
});
