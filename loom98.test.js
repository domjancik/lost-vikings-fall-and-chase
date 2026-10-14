import test from 'node:test';
import assert from 'node:assert/strict';
import {createState} from './engine.js';
import {threadSweep} from './loom-campaign96.js';
import {LOOM_GUIDE} from './loom-guide98.js';
test('threading accepts a broad jump arc but still requires the entire bobbin to clear real metal',()=>{
 assert.equal(LOOM_GUIDE.threadTolerance,24);
 for(const offset of [-24,-18,18,24]){
  const s=createState(6,'cycle');s.machine.owner=0;
  threadSweep(s,{x:1610,y:720+offset},{x:1670,y:720+offset});assert.equal(s.machine.guides,1);
 }
 for(const offset of [-25,25,80]){
  const s=createState(6,'cycle');s.machine.owner=0;
  threadSweep(s,{x:1610,y:720+offset},{x:1670,y:720+offset});assert.equal(s.machine.guides,0);
  assert.equal(s.machine.threadAttempt.accepted,false);assert.ok(s.feedback.message.includes('eyelet'));
 }
});
test('a missed thread can retry normally without losing bobbin or previous guide progress',()=>{
 const s=createState(6,'cycle');s.machine.owner=0;
 threadSweep(s,{x:1610,y:800},{x:1670,y:800});
 threadSweep(s,{x:1670,y:720},{x:1610,y:720});assert.equal(s.machine.guides,0);
 threadSweep(s,{x:1610,y:735},{x:1670,y:735});assert.equal(s.machine.guides,1);
 threadSweep(s,{x:2180,y:800},{x:2240,y:800});assert.equal(s.machine.guides,1);
 threadSweep(s,{x:2180,y:738},{x:2240,y:738});assert.equal(s.machine.guides,2);
 assert.equal(s.machine.owner,0);
});
