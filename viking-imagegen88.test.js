import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {heroAnimationCell} from './hero-frames.js';
import {normalizeSkin,saveSkin,readSkin} from './hero-skins.js';
import {imagegen88ShieldPose} from './imagegen88-registration.js';

test('guided imagegen full kit uses accepted motion guides for all eight phases',()=>{
 assert.equal(normalizeSkin('imagegen88'),'imagegen88');
 for(const id of [0,1,2])for(let frame=0;frame<8;frame++){
  const q=heroAnimationCell({id,skin:'imagegen88'},'run',frame);
  assert.deepEqual(q,{sheet:'imagegen88',cell:frame,cols:8});
 }
 const poses=['idle','look-up','look-down','climb','rise','fall','land','hurt'];
 for(const id of [0,1,2])for(const pose of poses)for(let n=0;n<7;n++){
  const old=heroAnimationCell({id,skin:'native85'},pose,n);
  assert.deepEqual(heroAnimationCell({id,skin:'imagegen88'},pose,n),{...old,sheet:'imagegen88'});
 }
 assert.equal(heroAnimationCell({id:1,skin:'imagegen88'},'bow',5).cell,37);
 assert.equal(heroAnimationCell({id:2,skin:'imagegen88',shieldUp:true},'run',7).cell,33);
});
test('generated skin persists without removing original procedural choice',()=>{
 const data=new Map(),storage={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)};
 assert.equal(saveSkin(storage,'imagegen88'),'imagegen88');assert.equal(readSkin(storage),'imagegen88');
 assert.equal(saveSkin(storage,'procedural'),'procedural');
});
test('generated shield physics metadata follows exact reviewed86 guide equipment',()=>{
 const data=JSON.parse(fs.readFileSync('assets/vikings86-native/olaf-frames.json'));
 for(const pose of ['run','idle','climb','shield-raise','shield-lower','overhead','float'])for(const up of [false,true])for(let frame=0;frame<7;frame++){
  const h={id:2,skin:'imagegen88',shieldUp:up,face:1},q=imagegen88ShieldPose(h,pose,frame);
  const eq=data.frames[q.cell].equipment.find(e=>e.type==='shield');
  assert.ok(Math.abs(q.x-(eq.center[0]-32)*data.geometryProjection*2)<1e-8);
  assert.ok(Math.abs(q.y-(62+(eq.center[1]-62)*data.geometryProjection-40)*2)<1e-8);
  assert.equal(q.rx,eq.projectionSize[0]);assert.equal(q.ry,eq.projectionSize[1]);
  assert.equal(imagegen88ShieldPose({...h,face:-1},pose,frame).x,-q.x);
 }
 assert.equal(imagegen88ShieldPose({id:2,shieldUp:true},'idle').y,-36);
 assert.equal(imagegen88ShieldPose({id:2},'climb').mode,'back');
});
