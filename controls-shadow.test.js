import test from 'node:test';
import assert from 'node:assert/strict';
import {createControls,keyAction} from './controls.js';
import {groundShadow} from './ground-shadow.js';
import {createState,platforms} from './engine.js';
test('movement survives jump and release of another input source',()=>{const c=createControls();c.press('right','touch:1');c.press('primary','touch:2');assert.deepEqual(c.consume(0),{left:false,right:true,jump:true,sword:false,action:false,interact:false,item:false});c.release('touch:2');c.press('right','keyboard');c.release('touch:1');assert.equal(c.consume(0).right,true);c.release('keyboard');assert.equal(c.consume(0).right,false);});
test('original primary and alternate abilities have independent keys',()=>{assert.equal(keyAction('d'),'secondary');assert.equal(keyAction(' '),'primary');const c=createControls();c.press('primary','key');assert.equal(c.consume(1).sword,true);c.release('key');c.press('secondary','key');const i=c.consume(1);assert.equal(i.action,true);assert.equal(i.right,false);});
test('jump shadow stays on floor and projects to nearest platform below',()=>{const s=createState();assert.equal(groundShadow(s,{x:100,y:566},platforms).y,610);assert.equal(groundShadow(s,{x:100,y:350},platforms).y,610);assert.equal(groundShadow(s,{x:280,y:420},platforms).y,490);assert.equal(groundShadow(s,{x:280,y:500},platforms).y,610);});
test('shadows follow moving lift and never project across empty gaps',()=>{const s=createState(1);s.machine.liftY=450;assert.equal(groundShadow(s,{x:600,y:350},platforms).y,450);const p=createState(3);assert.equal(groundShadow(p,{x:495,y:400},platforms),null);});
