import test from 'node:test';import assert from 'node:assert/strict';
import {departureMethod,arrivalMethod,transitionPose,transitionHeroPose,distortionBands,canAdvance} from '../../src/render/level-transition.js';
const state=(campaign,round,mechanic='cycle')=>({campaign,round,level:{mechanic,accent:'#abcdef',exit:{x:1000,y:500}},heroes:[{id:0,x:100,y:456},{id:1,x:160,y:456},{id:2,x:220,y:456}]});
test('travel follows real escape construction and preserves portal color',()=>{
 assert.equal(departureMethod(state('cycle',10,'sewer')).kind,'water');
 assert.deepEqual(departureMethod(state('cycle',0)),{kind:'portal',color:'#67efd3'});
 assert.equal(departureMethod(state('story',6,'descent')).kind,'transfer');
 assert.equal(departureMethod(state('story',7,'descent')).kind,'door');
 assert.equal(departureMethod(state('story',2,'descent')).color,'#abcdef');
});
test('water handoff survives continue, tavern arrival remains an actual fall',()=>{
 assert.equal(arrivalMethod(state('cycle',4,'water'),{kind:'water'}).kind,'water');
 assert.equal(arrivalMethod(state('cycle',10,'sewer'),{kind:'portal'}).kind,'fall');
 assert.equal(arrivalMethod(state('story',7,'descent'),{kind:'transfer'}).kind,'transfer');
 assert.equal(arrivalMethod(state('arcade',0)).kind,'door');
});
test('departure cannot continue early and entry completely settles before control',()=>{
 for(const kind of ['portal','water','fall','door','transfer']){
  assert.equal(transitionPose(kind,'exit',0).done,false);
  assert.equal(canAdvance({phase:'exit',done:false}),false);
  assert.equal(canAdvance({phase:'wait',done:true}),true);
  assert.equal(transitionPose(kind,'entry',3).done,true);
  assert.equal(transitionPose(kind,'entry',3).warp,0);
 }
});
test('entry actors end at their real spawn and water is never a shrinking vortex',()=>{
 const h={id:0,x:120,y:456},a={x:160,y:440};
 assert.equal(transitionHeroPose('fall','entry',.3,h,a),null);
 for(const kind of ['portal','water','door','transfer']){const p=transitionHeroPose(kind,'entry',3,h,a);assert.equal(p.x,h.x);assert.equal(p.y,h.y);assert.equal(p.alpha,1);assert.equal(p.scale,1);}
 const water=transitionHeroPose('water','entry',.2,h,a);assert.equal(water.scale,1);assert.ok(water.x<h.x);
 assert.equal(transitionHeroPose('water','exit',.2,h,a),null);
});
test('distortion stays integer, in bounds, and exhausts cleanly on tiny/mobile/desktop rasters',()=>{
 for(const [width,height]of [[1,1],[107,195],[360,225],[720,450]])for(const kind of ['portal','water','fall','door','transfer'])for(const phase of ['entry','exit']){
  const bands=distortionBands(kind,phase,.35,width,height,{x:width*.65,y:height*.6});
  assert.ok(bands.length<height+1);
  for(const b of bands){for(const v of Object.values(b))assert.ok(Number.isInteger(v));assert.ok(b.w>0&&b.h>0);assert.ok(b.sx>=0&&b.sy>=0&&b.dx>=0&&b.dy>=0);assert.ok(Math.max(b.sx,b.dx)+b.w<=width);assert.ok(Math.max(b.sy,b.dy)+b.h<=height);}
  assert.deepEqual(distortionBands(kind,'entry',3,width,height,{x:0,y:0}),[]);
 }
});

test('held keyboard codes remain quarantined after arrival until real keyup',async()=>{
 const {createTravelKeys}=await import('../../src/render/level-transition.js');const keys=createTravelKeys();
 assert.equal(keys.press('ArrowRight'),false);keys.beginEntry();assert.equal(keys.press('ArrowRight'),true);
 assert.equal(keys.press('Space',true),true);assert.equal(keys.press('ArrowRight'),true);
 keys.release('ArrowRight');assert.equal(keys.press('ArrowRight'),false);
 keys.clear();assert.equal(keys.press('Space'),false);
});

test('walk-in arrivals plant near-floor spawns while real drops retain gravity',async()=>{
 const {arrivalSpawns}=await import('../../src/render/level-transition.js');const s=state('story',0);s.level.floors=[{x:0,y:500,w:1000}];s.heroes[0].y=450;s.heroes[0].ground=false;
 assert.equal(arrivalSpawns(s,'door')[0].y,456);assert.equal(arrivalSpawns(s,'door')[0].ground,true);assert.equal(s.heroes[0].y,450);
 assert.equal(arrivalSpawns(s,'fall')[0].y,450);s.heroes[0].y=300;assert.equal(arrivalSpawns(s,'door')[0].y,300);
});

test('departure anchor matches authored story and machine doorway centers',async()=>{
 const {departureAnchor}=await import('../../src/render/level-transition.js');
 assert.equal(departureAnchor(state('story',1)).y,440);
 assert.equal(departureAnchor(state('cycle',0)).y,446);
 assert.equal(departureAnchor(state('cycle',9,'lode')).y,448);
 assert.deepEqual(departureAnchor(state('arcade',0)),{x:1356,y:550});
});

test('fresh reset-costs entry does not imply an unearned body transfer',()=>{
 assert.equal(arrivalMethod(state('story',6,'descent')).kind,'portal');
 assert.equal(arrivalMethod(state('story',7,'descent'),departureMethod(state('story',6,'descent'))).kind,'transfer');
});

test('local rain chapter entry recalls its earned body transfer, not its outside door exit',()=>{
 assert.equal(arrivalMethod(state('story',7,'descent')).kind,'transfer');
 assert.equal(departureMethod(state('story',7,'descent')).kind,'door');
});
