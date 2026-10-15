import test from 'node:test';
import assert from 'node:assert/strict';
import {createState} from '../../src/core/engine.js';
import {combatRefractionRegions} from '../../src/levels/warden/combat-refraction.js';
const hud=await import('../../src/app/hero-resources.js').catch(()=>null);
const sweat=await import('../../src/levels/warden/strain-effects.js').catch(()=>null);
const combat=await import('../../src/levels/warden/combat.js');

test('traveling wave refraction remains readable and dissipates continuously at end of life',()=>{
 assert.ok(combat.wardenWaveOpacity,'Missing shared wave dissipation');
 const s=createState(5,'cycle'),view={x:800,y:800,width:1000,height:160};
 for(const age of [.2,1.8,2.2,2.5,2.75]){
  s.machine.waves=[{x:1300+age*40,dir:1,age}];
  const region=combatRefractionRegions(s,view,null).find(r=>r.kind==='wave');
  assert.ok(region);assert.equal(region.power,combat.wardenWaveOpacity(age));
  assert.ok(region.w>=72,'Pressure should surround the moving crest');
 }
 assert.equal(combat.wardenWaveOpacity(1),1);
 assert.ok(combat.wardenWaveOpacity(2.2)>combat.wardenWaveOpacity(2.5));
 assert.ok(combat.wardenWaveOpacity(2.799)<.00001);
 assert.equal(combat.wardenWaveOpacity(2.8),0);
 s.machine.waves=[{x:1400,dir:-1,age:2.8}];assert.deepEqual(combatRefractionRegions(s,view,null),[]);
});

test('crew resources follow every hero independently of selection, including replenishment and recovery',()=>{
 assert.ok(hud?.heroResource);
 const s=createState(4,'cycle');s.active=2;s.heroes[0].air=2.25;s.heroes[0].underwater=true;
 const a=hud.heroResource(s,0);assert.equal(a.kind,'air');assert.equal(a.remaining,2.25);assert.equal(a.max,12);assert.ok(a.critical);
 s.active=0;assert.deepEqual(hud.heroResource(s,0),a);
 s.heroes[0].air=8;s.heroes[0].inAirPocket=true;s.heroes[0].underwater=false;assert.equal(hud.heroResource(s,0),null);
 const w=createState(5,'cycle');w.active=0;w.machine.braced=true;w.machine.braceAge=11;
 assert.equal(hud.heroResource(w,2).remaining,3);assert.ok(hud.heroResource(w,2).critical);assert.equal(hud.heroResource(w,0),null);
 w.machine.braced=false;w.machine.fatigue=1;assert.equal(hud.heroResource(w,2).kind,'recover');
 w.heroes[2].dead=true;assert.equal(hud.heroResource(w,2),null);
 assert.equal(hud.heroResource(createState(0,'arcade'),0),null);
});

test('timer paint refreshes at second boundaries even inside the same fractional cache bucket',()=>{
 assert.ok(hud?.resourcePaintKey);
 const r={kind:'strength',remaining:13.01,ratio:13.01/14,critical:false};
 const next={...r,remaining:12.99,ratio:12.99/14};
 assert.notEqual(hud.resourcePaintKey(r),hud.resourcePaintKey(next));
});

test('brace sweat follows Olaf, grows under strain, freezes while paused and stops when released',()=>{
 assert.ok(sweat?.braceSweat);
 const s=createState(5,'cycle');assert.deepEqual(sweat.braceSweat(s),[]);
 s.machine.braced=true;s.machine.braceAge=2;s.time=10;
 const early=sweat.braceSweat(s);assert.ok(early.length>0);assert.deepEqual(sweat.braceSweat(s),early);
 s.machine.braceAge=12;const late=sweat.braceSweat(s);assert.ok(late.length>early.length);
 assert.ok(late.every(p=>p.y>=s.heroes[2].y-12),'Sweat must stay below the overhead shield and come from the face');
 assert.ok(late.some(p=>p.y<s.heroes[2].y),'Drops must emerge near the temples before falling down the body');
 for(const p of late){assert.equal(p.x%2,0);assert.equal(p.y%2,0);assert.ok(p.alpha>=0&&p.alpha<=1);}
 s.heroes[2].x+=100;const moved=sweat.braceSweat(s);assert.equal(moved[0].x-late[0].x,100);
 s.machine.braced=false;assert.deepEqual(sweat.braceSweat(s),[]);
});
