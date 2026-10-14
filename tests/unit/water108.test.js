import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,step} from '../../src/core/engine.js';
function approachStream({hz=120,raised=false,closed=false}={}){
 const s=createState(4,'cycle');s.active=2;
 Object.assign(s.heroes[2],{x:630,y:516,vy:0,vx:0,shieldUp:raised,ground:false});
 if(closed)Object.assign(s.machine,{valveClosed:true,valvePose:1});
 for(let n=0;n<hz*3;n++)step(s,{right:true},1/hz);
 return s;
}
test('the live intake stops a floating Olaf walking into it with his shield in front',()=>{
 for(const hz of [60,120]){
  const s=approachStream({hz});assert.ok(s.heroes[2].x<700,'front shield must not bypass the intake');
  assert.equal(s.heroes[2].shieldUp,false);assert.ok(s.machine.shelter<.01);
 }
});
test('raising the shield lets Olaf enter and shelter the live intake',()=>{
 const s=approachStream({raised:true});assert.ok(s.heroes[2].x>710);
 assert.ok(s.machine.shelter>.1);
});
test('a closed inlet permits a front-shield Olaf to cross normally',()=>{
 assert.ok(approachStream({closed:true}).heroes[2].x>900);
});
