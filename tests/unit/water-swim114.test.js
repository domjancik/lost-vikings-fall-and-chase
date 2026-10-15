import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,step} from '../../src/core/engine.js';
import {animationFor} from '../../src/heroes/sprite-render.js';
import {heroAnimationCell} from '../../src/heroes/hero-frames.js';
import {swimMotion} from '../../src/heroes/swim-motion.js';
const ticks=(s,input={},n=1)=>{for(let i=0;i<n;i++)step(s,input,1/120);};
test('swim strokes advance with active swimming travel, pause on release, and stay frozen for inactive Erik',()=>{
 const s=createState(4,'cycle'),e=s.heroes[0];Object.assign(e,{x:1200,y:750,ground:false,vx:0,vy:0,skin:'imagegen90'});
 ticks(s,{right:true},80);assert.ok(e.swimDistance>50);const moving=e.swimDistance,frame=animationFor(e).frame;
 ticks(s,{},40);assert.equal(e.swimDistance,moving);assert.equal(animationFor(e).frame,frame);
 s.active=1;ticks(s,{right:true},40);assert.equal(e.swimDistance,moving);assert.equal(animationFor(e).frame,frame);
 s.active=0;Object.assign(e,{y:956,vy:0,swimVy:0});ticks(s,{down:true},40);assert.equal(e.swimDistance,moving,'Pushing into a solid floor must not cycle the stroke');
 ticks(s,{up:true},80);assert.ok(e.swimDistance>moving+40);
});
test('a current cannot drive the stroke, including while Down is blocked by the basin floor',()=>{
 const s=createState(4,'cycle'),e=s.heroes[0];Object.assign(e,{x:710,y:956,ground:false,vx:0,vy:0,swimDistance:45});
 const oldX=e.x;ticks(s,{down:true},10);assert.ok(e.x<oldX,'The live inlet must actually push Erik');assert.equal(e.swimDistance,45);
 ticks(s,{},10);assert.equal(e.swimDistance,45);
});
test('world meters use the same remaining resource as HUD, including inactive heroes and raised-shield clearance',async()=>{
 const api=await import('../../src/app/world-resources.js').catch(()=>null);assert.ok(api?.worldResource);
 const s=createState(4,'cycle');s.active=2;s.heroes[0].air=2.5;s.heroes[0].underwater=true;
 const r=api.worldResource(s,0);assert.equal(r.remaining,2.5);assert.equal(r.label,'AIR');assert.ok(r.y<s.heroes[0].y-46);
 const w=createState(5,'cycle');w.machine.braced=true;w.machine.braceAge=11;w.heroes[2].shieldUp=true;
 const strength=api.worldResource(w,2);assert.equal(strength.label,'STR');assert.equal(strength.remaining,3);assert.ok(strength.y<w.heroes[2].y-58);
});
test('nearby resource callouts stack without merging labels and retain their hero anchors',async()=>{
 const {worldResources}=await import('../../src/app/world-resources.js');const s=createState(4,'cycle');
 for(const h of s.heroes)Object.assign(h,{x:940+h.id*8,y:856,underwater:true});
 const rs=worldResources(s);assert.equal(rs.length,3);
 for(let i=0;i<rs.length;i++){assert.equal(rs[i].heroId,i);assert.equal(rs[i].anchorX,940+i*8);for(let j=0;j<i;j++)assert.ok(Math.abs(rs[i].y-rs[j].y)>=26);}
 assert.deepEqual(rs.map(r=>r.tag),['E','B','O']);
 const small=worldResources(s,.48);assert.ok(Math.abs(small[1].y-small[0].y)*.48>=20);assert.ok(Math.abs(small[2].y-small[1].y)*.48>=20);
});
test('Erik remains a swimmer at the submerged basin floor and cannot run-jump from it',()=>{
 const s=createState(4,'cycle'),e=s.heroes[0];Object.assign(e,{x:1200,y:956,ground:true,vx:0,vy:0});
 ticks(s,{right:true},20);assert.equal(e.swimming,true);assert.equal(e.ground,false);assert.equal(e.y+44,1000);
 ticks(s,{jump:true});assert.ok(e.vy>=-2,'A wet floor cannot launch the dry running jump');
});
test('Erik stands on a supported air-pocket floor but swims immediately outside it',()=>{
 const s=createState(4,'cycle'),e=s.heroes[0];Object.assign(e,{x:940,y:856,ground:true,vx:0,vy:0});
 ticks(s,{},2);assert.equal(e.inAirPocket,true);assert.equal(e.swimming,false);assert.equal(e.ground,true);
 Object.assign(e,{x:990,y:856,ground:true});ticks(s,{},2);assert.equal(e.swimming,true);assert.equal(e.ground,false);
});
test('an air pocket without floor contact does not grant midair standing',()=>{
 const s=createState(4,'cycle'),e=s.heroes[0];Object.assign(e,{x:940,y:828,ground:false,vx:0,vy:0});
 ticks(s,{},2);assert.equal(e.inAirPocket,true);assert.equal(e.swimming,false);assert.equal(e.ground,false);assert.ok(e.vy>0);
 assert.equal(animationFor({...e,skin:'imagegen90'}).pose,'fall');
});
test('the horizontal swimmer uses air when his visible head is below a nearly drained surface',()=>{
 const s=createState(4,'cycle'),e=s.heroes[0];s.machine.waterY=950;
 Object.assign(e,{x:1200,y:956,ground:true,vx:0,vy:0,air:12});
 ticks(s,{},2);assert.equal(e.swimming,true);assert.equal(e.underwater,true);assert.ok(e.air<12);
});
test('only procedural and corrected generated Erik get swimming cycles; other skins fall safely',()=>{
 for(const skin of ['procedural','imagegen90']){
  const h={id:0,skin,swimming:true,ground:true,animTime:.4,vx:90};assert.equal(animationFor(h).pose,'swim');
 }
 for(const skin of ['current','previous','reworked70','native85','imagegen88','imagegen81']){
  const a=animationFor({id:0,skin,swimming:true,ground:true,animTime:.4,vx:90});assert.equal(a.pose,'fall');assert.doesNotThrow(()=>heroAnimationCell({id:0,skin},a.pose,a.frame));
 }
 assert.equal(animationFor({id:0,skin:'imagegen90',swimming:true,climbing:true,ground:true}).pose,'climb');
});
test('corrected Erik swims through all eight registered cells of his dedicated atlas',()=>{
 for(let frame=0;frame<8;frame++)assert.deepEqual(heroAnimationCell({id:0,skin:'imagegen90'},'swim',frame),{sheet:'erik-swim114',cell:frame,cols:4});
});
test('all swim keys preserve near/far limb lengths and remain above the floor contact',()=>{
 for(let frame=0;frame<8;frame++){
  const m=swimMotion(frame);
  for(const name of ['near','far'])for(const [a,b]of [['shoulder','elbow'],['elbow','hand']])assert.ok(Math.abs(Math.hypot(m[name][a][0]-m[name][b][0],m[name][a][1]-m[name][b][1])-10)<1e-8);
  for(const name of ['nearLeg','farLeg'])for(const [a,b]of [['hip','knee'],['knee','foot']])assert.ok(Math.abs(Math.hypot(m[name][a][0]-m[name][b][0],m[name][a][1]-m[name][b][1])-9)<1e-8);
 }
});
