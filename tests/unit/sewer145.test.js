import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,step} from '../../src/core/engine.js';
import {lurkerWalkPose} from '../../src/levels/sewer/lurker-art.js';

function contact(hz=120){
 const s=createState(10,'cycle');s.machine.hatch.open=true;s.machine.hatch.pose=1;
 s.machine.lamp.hookId='inspection';s.machine.lamp.focused=true;
 const e=s.machine.lurkers[0];Object.assign(e,{x:1930,y:760});
 Object.assign(s.heroes[0],{x:1932,y:716,ground:true});
 return {s,e,run(seconds){for(let n=0;n<seconds*hz;n++)step(s,{},1/hz);}};
}
test('touching the lit retreating cockroach hurts at60/120Hz, with normal immunity',()=>{
 for(const hz of [60,120]){const {s,e,run}=contact(hz);run(.1);assert.equal(e.phase,'retreat');assert.equal(s.heroes[0].hp,2);run(.15);assert.equal(s.heroes[0].hp,2);}
});
test('contact respects disabled hazards and a dead creature is harmless',()=>{
 for(const mode of ['disabled','dead']){const {s,e,run}=contact();if(mode==='disabled')s.noHazards=true;else e.hp=0;run(.2);assert.equal(s.heroes[0].hp,3);}
});
test('a cockroach gait advances by actual travel in retreat and freezes when dead',()=>{
 const {s,e,run}=contact();s.noHazards=true;const x=e.x;run(.2);assert.ok(e.x>x);assert.ok(e.travel>=Math.abs(e.x-x)-.01);const phase=e.travel;e.hp=0;run(.3);assert.equal(e.travel,phase);
});
test('front shield blocks contact, its back does not, and nearby Olaf cannot protect Erik remotely',()=>{
 for(const [face,target,hp]of [[1,2,3],[-1,2,2],[1,0,2]]){const {s,e,run}=contact();s.machine.lamp.lit=false;Object.assign(s.heroes[2],{x:1900,y:716,ground:true,face});Object.assign(s.heroes[target],{x:1900,y:716,ground:true});e.x=1930;run(.03);assert.equal(s.heroes[target].hp,hp);}
});
test('tripod stance contacts stay planted as the left-facing animal travels',()=>{
 const a=lurkerWalkPose({travel:2}),b=lurkerWalkPose({travel:6});
 const stance=a.map((l,i)=>({l,i})).filter(({l})=>l.footY===0);assert.equal(stance.length,3);
 for(const {l,i}of stance){assert.equal(b[i].footY,0);assert.ok(Math.abs((100+l.footX)-(96+b[i].footX))<.001);}
 assert.deepEqual(lurkerWalkPose({travel:0}),lurkerWalkPose({travel:48}));
});
test('recoil gait reverses its planted feet and contact can eventually kill',()=>{
 for(const dir of [-1,1]){const {s,e}=contact();e.dir=dir;e.recoil=-dir*150;const x=e.x;step(s,{},1/120);assert.ok(e.gaitTravel<0);assert.equal(Math.sign(e.x-x),-dir);}
 const {s,e}=contact();for(let n=0;n<300&&!s.failed;n++){s.heroes[0].x=e.x;s.heroes[0].y=716;step(s,{},1/120);}assert.equal(s.heroes[0].hp,0);assert.equal(s.heroes[0].dead,true);assert.equal(s.failed,true);
});
test('stance feet remain planted in both facing and travel directions',()=>{
 for(const dir of [-1,1])for(const dx of [-4,4]){
  const a=lurkerWalkPose({gaitTravel:8}),b=lurkerWalkPose({gaitTravel:8+dx*dir});
  for(let i=0;i<6;i++)if(a[i].footY===0&&b[i].footY===0)assert.ok(Math.abs(100-a[i].footX*dir-(100+dx-b[i].footX*dir))<.0001);
 }
});
