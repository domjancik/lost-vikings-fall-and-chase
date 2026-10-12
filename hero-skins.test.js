import test from 'node:test';import assert from 'node:assert/strict';
import {heroAnimationCell,heroCell} from './hero-frames.js';
import {readSkin,saveSkin,skinOptions} from './hero-skins.js';
test('original procedural Vikings are selectable and persist independently of image skins',()=>{
 assert.deepEqual(skinOptions.map(s=>s.id),['current','previous','procedural']);
 const data=new Map(),storage={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)};
 assert.equal(saveSkin(storage,'procedural'),'procedural');assert.equal(readSkin(storage),'procedural');
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
