import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,step} from '../../src/core/engine.js';
import {createCupFactory,stepCupFactory,cupFactoryScene,cupFactoryFrame} from '../../src/levels/pub/cup-factory.js';
import {drawLabels} from '../../src/render/text-render.js';
test('the orb makes a cup, throws it continuously, bounces and adds it to a grounded pile',()=>{
 const factory=createCupFactory(),s={time:0,machine:{phase:'play',factory}},phases=new Set();let previous=null,maxStep=0;
 for(let n=0;n<450;n++){
  stepCupFactory(s,1/120);const scene=cupFactoryScene(s);scene.flying.forEach(p=>phases.add(p.phase));
  const p=scene.flying[0];if(p&&previous?.id===p.id)maxStep=Math.max(maxStep,Math.hypot(p.x-previous.x,p.y-previous.y));previous=p;
 }
 assert.ok(phases.has('throw')&&phases.has('bounce'));assert.ok(factory.pile>8);assert.ok(maxStep<5);
 assert.ok(cupFactoryScene(s).pile.every(p=>p.bottom<=760));
});
test('cup creation uses simulation time, keeps bounded storage, and stops spawning when the floor breaks',()=>{
 const s={machine:{phase:'play',factory:createCupFactory()}};
 stepCupFactory(s,1200);assert.ok(s.machine.factory.flying.length<=2);assert.ok(s.machine.factory.pile<=32);
 s.machine.phase='crack';const made=s.machine.factory.made;for(let n=0;n<600;n++)stepCupFactory(s,1/120);assert.equal(s.machine.factory.made,made);assert.equal(s.machine.factory.flying.length,0);
});
test('the actual tavern simulation advances its cup factory in play and inspection',()=>{
 const s=createState(11,'cycle');for(let n=0;n<400;n++)step(s,{},1/120);assert.ok(s.machine.factory.made>0);
});
test('every throw is preceded by a visible finished cup and synchronized arm release',()=>{
 for(let id=0;id<8;id++){
  const s={machine:{phase:'play',factory:createCupFactory()}};stepCupFactory(s,1.1+id*3.2-.1);
  assert.equal(cupFactoryFrame(s),2);stepCupFactory(s,.11);assert.equal(cupFactoryFrame(s),3);assert.equal(cupFactoryScene(s).flying[0].phase,'throw');
 }
});
test('dialogue draws after health/resource labels regardless of queue order',()=>{
 const rendered=[],g=new Proxy({measureText:t=>({width:t.length*5}),fillText:t=>rendered.push(t)},{get:(o,k)=>o[k]??(()=>{})});
 const canvas={clientWidth:400,clientHeight:300,width:400,height:300,dataset:{},getContext:()=>g};
 const labels=[{t:'DIALOGUE',x:100,y:100,size:10,c:'#fff',priority:100},{t:'HEALTH',x:100,y:100,size:10,c:'#fff'}];
 drawLabels(canvas,labels,0,1);assert.deepEqual(rendered,['HEALTH','DIALOGUE']);assert.equal(labels[0].t,'DIALOGUE');
});
