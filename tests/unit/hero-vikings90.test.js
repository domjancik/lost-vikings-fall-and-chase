import test from 'node:test';
import assert from 'node:assert/strict';
import {heroAnimationCell} from '../../src/heroes/hero-frames.js';
import {normalizeSkin,saveSkin,readSkin,skinOptions} from '../../src/heroes/hero-skins.js';

test('corrected movement skin persists while all earlier selectable art remains available',()=>{
 assert.equal(normalizeSkin('imagegen90'),'imagegen90');
 for(const id of ['current','imagegen88','native85','imagegen81','previous','procedural'])assert(skinOptions.some(s=>s.id===id));
 const values=new Map(),storage={getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)};
 assert.equal(saveSkin(storage,'imagegen90'),'imagegen90');assert.equal(readSkin(storage),'imagegen90');
});
test('corrected art keeps full eight-step gait and four climbing grips in both shield states',()=>{
 for(const id of [0,1,2])for(const shieldUp of [false,true]){
  const h={id,shieldUp,skin:'imagegen90'},up=id===2&&shieldUp;
  for(let n=0;n<16;n++)assert.deepEqual(heroAnimationCell(h,'run',n),{sheet:'imagegen90',cell:(up?26:0)+n%8,cols:8});
  for(let n=0;n<8;n++)assert.deepEqual(heroAnimationCell(h,'climb',n),{sheet:'imagegen90',cell:(up?52:14)+n%4,cols:8});
 }
});
test('corrected locomotion preserves unrelated action cells and reversible shield sequence',()=>{
 for(const id of [0,1,2])for(const [pose,max]of [['idle',3],['look-up',0],['look-down',0],['rise',1],['fall',1],['land',2],['hurt',0]]){
  const old=heroAnimationCell({id,skin:'imagegen88'},pose,max),fresh=heroAnimationCell({id,skin:'imagegen90'},pose,max);
  assert.deepEqual({...fresh,sheet:'imagegen88'},old);
 }
 assert.equal(heroAnimationCell({id:0,skin:'imagegen90'},'bash',5).cell,31);
 assert.equal(heroAnimationCell({id:1,skin:'imagegen90'},'bow',3).cell,37);
 const h={id:2,skin:'imagegen90'};
 assert.deepEqual(Array.from({length:7},(_,n)=>heroAnimationCell(h,'shield-raise',n).cell),[38,39,40,41,42,43,44]);
 assert.deepEqual(Array.from({length:7},(_,n)=>heroAnimationCell(h,'shield-lower',n).cell),[51,50,49,48,47,46,45]);
});
