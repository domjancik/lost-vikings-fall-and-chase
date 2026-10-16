import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,step} from '../../src/core/engine.js';

function scene(hz=120){
 const s=createState(10,'cycle');s.time=10;s.machine.introTime=10;s.machine.lamp.lit=false;
 for(const l of s.machine.lamps)l.lit=false;
 s.machine.hatch.open=true;s.machine.hatch.pose=1;
 s.machine.captured=[false,true,true];
 Object.assign(s.heroes[0],{x:2050,y:716,ground:true});
 const e=s.machine.lurkers[0];Object.assign(e,{x:2150,y:760,dir:-1});
 return {s,e,run(t){for(let n=0;n<t*hz;n++)step(s,{},1/hz);}};
}
test('telegraphed bite damages at its visible reach without requiring body contact',()=>{
 for(const hz of [60,120]){const {s,e,run}=scene(hz);run(.4);assert.equal(s.heroes[0].hp,3);run(.5);assert.equal(s.heroes[0].hp,2);assert.ok(Math.abs(e.x-s.heroes[0].x)>42,'bite, not body overlap');}
});
test('walking out of a committed bite avoids damage, and disabled hazards remain harmless',()=>{
 for(const mode of ['dodge','disabled']){const {s,e,run}=scene();run(.35);if(mode==='dodge')s.heroes[0].x=1900;else s.noHazards=true;run(.6);assert.equal(s.heroes[0].hp,3);assert.ok(e.attackCount>=1);}
});
test('the active bite window damages a Viking in reach even after the windup frame',()=>{
 const {s,e,run}=scene();Object.assign(e,{phase:'attack',attack:.18,attackDir:-1,warning:0});
 run(.1);assert.equal(s.heroes[0].hp,2);run(.1);assert.equal(s.heroes[0].hp,2);
});
test('patrol beyond the old turn threshold keeps walking away instead of reversing every frame',()=>{
 const {s,e,run}=scene();s.heroes[0].x=1000;Object.assign(e,{x:2205,dir:1});
 const dirs=[];for(let n=0;n<120;n++){run(1/120);dirs.push(e.dir);}
 assert.ok(e.x<2200);assert.ok(dirs.slice(1).every(d=>d===dirs[0]));
});
test('closed inspection shutter is climbed, crossed and descended continuously',()=>{
 for(const hz of [60,120]){const {s,e,run}=scene(hz);s.level={...s.level,platforms:[]};s.heroes[0].x=1000;s.machine.hatch.open=false;s.machine.hatch.pose=0;Object.assign(e,{x:2090,dir:-1});
  let climbed=false,crossed=false,previous={x:e.x,y:e.y};
  for(let n=0;n<12*hz;n++){run(1/hz);if(e.y<700)climbed=true;if(e.x<1995&&e.y===760)crossed=true;
   assert.ok(Math.hypot(e.x-previous.x,e.y-previous.y)<4,'no corner teleport');previous={x:e.x,y:e.y};}
  assert.ok(climbed);assert.ok(crossed);assert.ok(Number.isFinite(e.rotation));
 }
});
test('a service platform beside the shutter prevents descent through that platform',()=>{
 const {s,e,run}=scene();s.heroes[0].x=1000;s.machine.hatch.open=false;s.machine.hatch.pose=0;Object.assign(e,{x:2090,dir:-1});
 let returned=false;for(let n=0;n<1200;n++){run(1/120);assert.ok(!(e.x<=2020&&e.y>600&&e.y<760),'no descent through the adjacent deck');returned ||= e.x>2085&&e.y===760&&e.dir===1;}
 assert.ok(returned);
});
test('opening a shutter during climbing releases the creature with gravity, not a floor teleport',()=>{
 const {s,e,run}=scene();s.heroes[0].x=1000;s.machine.hatch.open=false;s.machine.hatch.pose=0;Object.assign(e,{x:2090,dir:-1});
 run(2);assert.ok(e.y<750);const y=e.y;s.machine.hatch.open=true;run(1/120);assert.ok(Math.abs(e.y-y)<4);run(3);assert.equal(e.y,760);
});
test('a wall-climbing creature killed by an arrow falls away instead of leaving a floating corpse',()=>{
 const {s,e,run}=scene();s.heroes[0].x=1000;s.machine.hatch.open=false;s.machine.hatch.pose=0;
 Object.assign(e,{x:2060,y:680,hp:1,rotation:Math.PI/2,crawl:{wallX:2020,top:600,dir:-1,stage:1}});
 s.shots=[{kind:'arrow',x:2120,y:680,vx:-580,life:2}];run(.2);assert.equal(e.hp,0);const y=e.y;run(.2);assert.ok(e.y>y);run(1);assert.equal(e.y,760);assert.ok(e.x>2060);
});
test('climbing contact is tested from the body in exposed air, not the solid wall anchor',()=>{
 const {s,e,run}=scene();s.machine.hatch.open=false;s.machine.hatch.pose=0;
 Object.assign(e,{x:2060,y:700,rotation:Math.PI/2,crawl:{wallX:2020,top:600,dir:-1,stage:1}});
 Object.assign(s.heroes[0],{x:2080,y:656,ground:false,vy:0});run(1/120);assert.equal(s.heroes[0].hp,2);
});
