import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {animationFor} from '../../src/heroes/sprite-render.js';
import {heroAnimationCell} from '../../src/heroes/hero-frames.js';

test('coherent Olaf idle/action artwork retains full gait, native alpha and actual contacts',()=>{
 assert.doesNotThrow(()=>execFileSync('tools/pixel-fixer-venv/Scripts/python.exe',
  ['tools/art/vikings/check-olaf111.py'],{encoding:'utf8',stdio:'pipe'}));
});

test('generated shield lowering follows its actual high-to-low physical pose',()=>{
 const cells=[.94,.82,.70,.58,.48].map(shieldPose=>{
  const h={id:2,skin:'imagegen90',ground:true,shieldUp:false,shield:true,shieldPose};
  const a=animationFor(h);assert.equal(a.pose,'shield-lower');
  return heroAnimationCell(h,a.pose,a.frame).cell;
 });
 for(let n=1;n<cells.length;n++)assert.ok(cells[n]<cells[n-1],`Lowering raised the artwork instead: ${cells}`);
 assert.ok(cells[0]>=49&&cells.at(-1)<=46);
});

test('held front-shield looking selects authored neck poses without changing raised support',()=>{
 const h={id:2,skin:'imagegen90',ground:true,shield:true,shieldUp:false,shieldPose:.4};
 for(const [lookDirection,pose,cell]of [[-1,'look-up',12],[1,'look-down',13]]){
  const a=animationFor({...h,lookDirection});assert.deepEqual(a,{pose,frame:0});
  assert.equal(heroAnimationCell(h,a.pose,a.frame).cell,cell);
  assert.equal(animationFor({...h,shieldUp:true,shieldPose:1,lookDirection}).pose,'overhead');
 }
 assert.equal(animationFor({...h,lookDirection:-1,climbing:true}).pose,'climb');
 assert.equal(animationFor({...h,lookDirection:-1,hurt:.2}).pose,'hurt');
 assert.equal(animationFor({...h,lookDirection:-1,vx:30}).pose,'run');
 for(const id of [0,1]){
  const earlier={id,skin:'current',ground:true,lookDirection:-1};
  const a=animationFor(earlier);assert.equal(a.pose,'idle');
  assert.doesNotThrow(()=>heroAnimationCell(earlier,a.pose,a.frame));
 }
 for(const skin of ['previous','reworked70','procedural','imagegen81'])assert.equal(animationFor({...h,skin,lookDirection:-1}).pose,'idle');
});
