import test from 'node:test';import assert from 'node:assert/strict';import {createState} from '../../src/core/engine.js';
const view=await import('../../src/levels/clockwork/view.js').catch(()=>null);
test('remote views appear only while captive Erik drives docked machinery',()=>{
 assert.ok(view?.clockworkView);const s=createState(3,'cycle'),viewport={width:640,height:395};
 assert.equal(view.clockworkView(s,viewport).split,false);s.machine.wheel.mode='docked';s.machine.wheel.occupied=true;
 assert.equal(view.clockworkView(s,viewport).split,true);s.active=2;assert.equal(view.clockworkView(s,viewport).split,false);
 s.active=0;s.machine.pinBroken=true;assert.equal(view.clockworkView(s,viewport).split,false);
});
test('mobile runner inset leaves the crew view and bottom touch controls clear',()=>{
 assert.ok(view?.clockworkView);const s=createState(3,'cycle');s.machine.wheel.mode='docked';s.machine.wheel.occupied=true;
 s.heroes[1].x=1690;s.heroes[2].x=1770;const v=view.clockworkView(s,{width:184,height:395});assert.ok(v.inset.w<=184*.42);assert.ok(v.inset.y+v.inset.h<395*.6);assert.equal(v.focus.x,1730);
});

test('mobile captive and release views stay left of the right-hand character picker at either zoom',()=>{
 const s=createState(3,'cycle');s.machine.wheel.mode='docked';s.machine.wheel.occupied=true;
 for(const uiScale of [390/395,390/790,844/395]){
  const v=view.clockworkView(s,{width:640,height:395,mobile:true,uiScale});
  assert.equal(v.inset.x,6);assert.ok(v.inset.y*uiScale>=46);
  s.active=1;s.machine.pinBroken=true;s.machine.pinAt=s.time;
  const release=view.clockworkView(s,{width:640,height:395,mobile:true,uiScale});
  assert.equal(release.inset.x,6);
  s.active=0;s.machine.pinBroken=false;
 }
 assert.equal(view.clockworkView(s,{width:640,height:395,mobile:true,uiScale:1,insetTop:96}).inset.y,96);
 const desktop=view.clockworkView(s,{width:640,height:395,mobile:false});
 assert.equal(desktop.inset.x,514);
});
