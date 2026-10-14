import test from 'node:test';
import assert from 'node:assert/strict';
import {heroCell,heroPlacement} from '../../src/heroes/hero-frames.js';

test('action extremes stay in their hero-authored cells',()=>{
 assert.equal(heroCell(0,'bash',5),29);
 assert.equal(heroCell(1,'sword',5),27);
 assert.equal(heroCell(1,'bow',3),31);
 assert.equal(heroCell(2,'float',3),31);
 assert.equal(heroCell(2,'overhead',2),30);
 assert.throws(()=>heroCell(0,'sword',0),/unsupported/);
 assert.throws(()=>heroCell(1,'unknown',0),/unsupported/);
});
test('climbing freezes its contact pose and turns share a run cycle',()=>{
 assert.equal(heroCell(1,'climb',0),16);
 for(let n=0;n<8;n++)assert.equal(heroCell(0,'turn',n),heroCell(0,'run',n));
});
test('shield raising uses every intermediate authored body pose',()=>{
 assert.deepEqual(Array.from({length:7},(_,n)=>heroCell(2,'shield-raise',n)),[24,25,26,27,28,29,30]);
 assert.deepEqual(Array.from({length:7},(_,n)=>heroCell(2,'shield-lower',6-n)),[30,29,28,27,26,25,24]);
});
test('authored sole registration meets existing physical floor in both directions',()=>{
 for(const face of [-1,1]){
  const p=heroPlacement({x:101.3,y:555.2,face});
  assert.equal(p.y+p.sole*2,600);
  assert.equal(p.x%2,0);assert.equal(p.y%2,0);
  assert.equal(p.facing,face);
 }
});
