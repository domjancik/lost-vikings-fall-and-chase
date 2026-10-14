import test from 'node:test';import assert from 'node:assert/strict';
import {heroAnimationCell,heroCell} from '../../src/heroes/hero-frames.js';
import {readSkin,saveSkin,skinOptions} from '../../src/heroes/hero-skins.js';
test('original procedural Vikings are selectable and persist independently of image skins',()=>{
 for(const id of ['current','imagegen88','native85','imagegen81','previous','procedural'])assert(skinOptions.some(s=>s.id===id));
 const data=new Map(),storage={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)};
 assert.equal(saveSkin(storage,'procedural'),'procedural');assert.equal(readSkin(storage),'procedural');
});
test('imagegen trial uses all eight generated gait phases and safe action fallbacks',()=>{
 for(const id of [0,1,2]){
  for(let frame=0;frame<8;frame++)assert.deepEqual(heroAnimationCell({id,skin:'imagegen81'},'run',frame),{sheet:'imagegen81',cell:frame,cols:id===1?8:4});
  for(const pose of ['idle','climb','hurt'])assert.deepEqual(heroAnimationCell({id,skin:'imagegen81'},pose,3),heroAnimationCell({id,skin:'current'},pose,3));
 }
 assert.deepEqual(heroAnimationCell({id:2,skin:'imagegen81',shieldUp:true},'run',3),heroAnimationCell({id:2,skin:'current',shieldUp:true},'run',3));
 const data=new Map(),storage={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)};
 assert.equal(saveSkin(storage,'imagegen81'),'imagegen81');assert.equal(readSkin(storage),'imagegen81');
});
test('previous skin uses its original pose sheet while current retains reworked locomotion',()=>{
 for(const id of [0,1,2])for(const pose of ['run','idle','climb']){
 const old=heroAnimationCell({id,skin:'previous'},pose,3);assert.equal(old.sheet,'legacy');assert.equal(old.cell,heroCell(id,pose,3));
 assert.equal(heroAnimationCell({id,skin:'current'},pose,3).sheet,'locomotion');}
});
test('skin preference persists and invalid values fall back without affecting state',()=>{
 const data=new Map(),storage={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)};
 assert.equal(readSkin(storage),'current');assert.equal(saveSkin(storage,'previous'),'previous');assert.equal(readSkin(storage),'previous');assert.equal(saveSkin(storage,'unknown'),'current');
 assert.equal(readSkin({getItem(){throw Error('unavailable');}}),'current');
});
