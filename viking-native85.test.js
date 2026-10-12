import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {heroAnimationCell} from './hero-frames.js';
import {native85ShieldPose} from './native85-registration.js';

test('native85 uses eight actual gait cells and an entire consistent action kit',()=>{
 for(const id of [0,1,2]){
  for(let phase=0;phase<8;phase++)assert.deepEqual(heroAnimationCell({id,skin:'native85'},'run',phase),{sheet:'native85',cell:phase,cols:8});
  assert.equal(heroAnimationCell({id,skin:'native85'},'climb',3).cell,17);
  assert.equal(heroAnimationCell({id,skin:'native85'},'idle',3).cell,11);
 }
 assert.equal(heroAnimationCell({id:1,skin:'native85'},'sword',5).cell,31);
 assert.equal(heroAnimationCell({id:1,skin:'native85'},'bow',5).cell,37);
 assert.equal(heroAnimationCell({id:2,skin:'native85',shieldUp:true},'run',7).cell,33);
 assert.equal(heroAnimationCell({id:2,skin:'native85'},'shield-raise',6).cell,44);
 assert.equal(heroAnimationCell({id:2,skin:'native85'},'shield-lower',6).cell,45);
});

test('native sources contain eight distinct authored gaits and adult-scale floor anchors',()=>{
 for(const [id,name]of ['erik','baleog','olaf'].entries()){
  const data=JSON.parse(fs.readFileSync(`assets/vikings85-native/${name}-frames.json`));
  assert.equal(data.frames.length,[32,38,60][id]);
  const gaits=data.frames.slice(0,8);
  assert.equal(new Set(gaits.map(f=>JSON.stringify(f.feet))).size,8);
  assert.deepEqual(data.origin,[32,40]);
  for(const frame of gaits)assert.ok(frame.opaqueBoundsNative[3]<=62);
 }
});

test('round raised shield retains the engine walking plane and arm grip after registration',()=>{
 const data=JSON.parse(fs.readFileSync('assets/vikings85-native/olaf-frames.json'));
 for(const f of data.frames.filter(f=>['overhead-walk','overhead-idle','overhead-climb','float'].includes(f.action))){
  const eq=f.equipment.find(e=>e.type==='shield');
  assert.equal(eq.physicalDiameterNative,24);
  const y=62+(eq.center[1]-62)*.925;
  assert.ok(Math.abs(y-22)<1e-8);
  assert.equal(Math.round(y-eq.projectionSize[1]/2),19);
  for(const [side,grip]of Object.entries(eq.grips)){
   assert.deepEqual(f.limbs[side+'Arm'].end,grip);
  }
 }
});

test('pure shield ellipse metadata matches actual native source geometry and mirror direction',()=>{
 const data=JSON.parse(fs.readFileSync('assets/vikings85-native/olaf-frames.json'));
 for(const pose of ['run','idle','rise','fall','climb','shield-raise','shield-lower','overhead','float'])for(const up of [false,true])for(let n=0;n<7;n++){
  const h={id:2,skin:'native85',shieldUp:up,face:1};
  const q=native85ShieldPose(h,pose,n),eq=data.frames[q.cell].equipment.find(e=>e.type==='shield');
  assert.ok(Math.abs(q.x-(eq.center[0]-32)*.925*2)<1e-8);
  assert.ok(Math.abs(q.y-(62+(eq.center[1]-62)*.925-40)*2)<1e-8);
  assert.equal(q.rx,eq.projectionSize[0]);assert.equal(q.ry,eq.projectionSize[1]);
  const mirror=native85ShieldPose({...h,face:-1},pose,n);
  assert.equal(mirror.x,-q.x);assert.equal(mirror.roll,-q.roll);
 }
 assert.equal(native85ShieldPose({id:0},'run',0),null);
 assert.equal(native85ShieldPose({id:2,shieldUp:true},'idle',0).y,-36);
 assert.equal(native85ShieldPose({id:2},'climb',0).mode,'back');
});
