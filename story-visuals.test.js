import test from 'node:test';
import assert from 'node:assert/strict';
import {platformSupports,foundationOffset,deviceDone,advanceDeviceVisuals} from './story-visuals.js';
import {storyLevels,makeStoryMachines} from './story-layout.js';
test('each platform post connects its deck to a real lower surface',()=>{
 for(const level of storyLevels)for(const p of level.platforms){
  const supports=platformSupports(level,p);assert.ok(supports.length);
  for(const r of supports){assert.equal(r.y,p.y+62);assert.ok(r.h>0);assert.ok([...level.floors,...level.platforms].some(f=>r.x>=f.x&&r.x+r.w<=f.x+f.w&&r.y+r.h===f.y+2));}
 }
});
test('foundation anchor uses substantial base, ignoring isolated bottom pixels',()=>{
 const pixels=new Uint8ClampedArray(10*8*4);
 for(let x=0;x<10;x++)pixels[(5*10+x)*4+3]=255;
 pixels[(7*10)*4+3]=255;
 assert.equal(foundationOffset(pixels,10,8),4);
});
test('ratchet and wafer retain visible completion and ease through intermediate poses',()=>{
 const g=makeStoryMachines(0);assert.equal(deviceDone(g,'ratchet-sluice'),false);
 advanceDeviceVisuals(g,.01);g.gates[0].secured=true;g.flags.wafer=true;
 assert.equal(deviceDone(g,'ratchet-sluice'),true);
 advanceDeviceVisuals(g,.1);assert.ok(g.visuals['ratchet-sluice']>0&&g.visuals['ratchet-sluice']<1);assert.ok(g.visuals.wafer>0&&g.visuals.wafer<1);
 advanceDeviceVisuals(g,1);assert.equal(g.visuals['ratchet-sluice'],1);assert.equal(g.visuals.wafer,1);
});
test('every persistent lever reflects its authoritative mechanism flag',()=>{
 const g=makeStoryMachines(7);
 for(const [id,key]of [['route','route'],['isolate','isolated'],['escape','hatch'],['confirm','resetting']]){
  assert.equal(deviceDone(g,id),false);if(key==='resetting')g.resetting=true;else g.flags[key]=true;assert.equal(deviceDone(g,id),true);
 }
});
test('working station handle follows the actual stroke before completion',()=>{
 const g=makeStoryMachines(2);g.work=.5;
 advanceDeviceVisuals(g,1);assert.equal(g.visuals.work,.5);
 assert.equal(deviceDone(g,'work'),false);
 g.work=1;advanceDeviceVisuals(g,1);assert.equal(g.visuals.work,1);
 assert.equal(deviceDone(g,'work'),true);
});
