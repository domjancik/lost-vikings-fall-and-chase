import test from 'node:test';
import assert from 'node:assert/strict';
import {cameraTarget,cameraLookDirection} from './view-camera.js';
import {createState,step} from './engine.js';

test('held Up/Down shifts the camera, and release restores normal framing',()=>{
 const h={x:600,y:600},v={width:600,height:300},level={worldWidth:1600,worldBottom:1500};
 const normal=cameraTarget(h,v,level),up=cameraTarget(h,v,level,-1),down=cameraTarget(h,v,level,1);
 assert.ok(up.y<normal.y-100);assert.ok(down.y>normal.y+100);
 assert.equal(up.x,normal.x);assert.deepEqual(cameraTarget(h,v,level,0),normal);
 assert.equal(cameraTarget({...h,y:0},v,level,-1).y,0);
 assert.equal(cameraTarget({...h,y:1490},v,level,1).y,1200);
});

test('look-around yields to ladders and cancels opposing directions',()=>{
 const s=createState(0,'cycle');
 assert.equal(cameraLookDirection(s,{up:true}),-1);
 assert.equal(cameraLookDirection(s,{down:true}),1);
 assert.equal(cameraLookDirection(s,{up:true,down:true}),0);
 const h=s.heroes[0];Object.assign(h,{x:650,y:896});
 assert.equal(cameraLookDirection(s,{up:true}),0);
 assert.equal(cameraLookDirection(s,{down:true}),0);
 step(s,{up:true},1/120);assert.ok(h.climbing);assert.equal(cameraLookDirection(s,{down:true}),0);
 Object.assign(h,{x:620,climbing:false});assert.equal(cameraLookDirection(s,{up:true}),-1);
});
