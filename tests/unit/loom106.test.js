import test from 'node:test';
import assert from 'node:assert/strict';
import {weaveReveal,THREAD} from '../../src/levels/loom/weave.js';
test('cloth reveal grows continuously without retreating and finishes with every native row',()=>{
 let previous=0;
 for(let n=0;n<=1000;n++){
  const p=weaveReveal(n/1000),area=p.completeRows*36+p.width*p.bandHeight;
  assert.ok(area>=previous);assert.ok(area<=36*72);previous=area;
  assert.ok(Number.isInteger(p.x)&&Number.isInteger(p.y)&&Number.isInteger(p.width));
 }
 assert.equal(previous,2592);assert.equal(weaveReveal(0).completeRows,0);
 assert.equal(weaveReveal(1).completeRows,72);
});
test('successive weft passes reverse at their common edge while advancing toward the beam',()=>{
 const a=weaveReveal(.5/18),b=weaveReveal(1.5/18);
 assert.equal(a.direction,1);assert.equal(b.direction,-1);
 assert.equal(a.width,18);assert.equal(b.width,18);assert.equal(a.x,6);assert.equal(b.x,24);
 assert.equal(a.y,76);assert.equal(b.y,72);
 const end=weaveReveal(1/18-.000001),start=weaveReveal(1/18);
 assert.ok(Math.abs(end.needleX-start.needleX)<=1);
 for(let n=1;n<18;n++){
  const before=weaveReveal(n/18-.000001),after=weaveReveal(n/18);
  assert.ok(Math.abs(before.needleY-after.needleY)<.001,'shuttle must not jump upward between passes');
 }
 assert.equal(THREAD.base,'#b49b62');assert.equal(THREAD.light,'#ead7a0');
});
