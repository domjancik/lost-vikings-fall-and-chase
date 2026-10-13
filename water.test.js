import test from 'node:test';import assert from 'node:assert/strict';
import {createState,step} from './engine.js';
import {waterLevel,waterSheltered,waterAirPockets} from './water-campaign.js';
import {WATER_DOCK_DECK,WATER_CRADLE_SEAT} from './water-pontoon-geometry.js';
const fresh=()=>createState(4,'cycle');
function tick(s,input={},n=1,hz=60){for(let k=0;k<n;k++)step(s,input,1/hz);}
test('water lab starts with distinct reachable docks and permanent escape ladder',()=>{
 const s=fresh();assert.deepEqual(s.level,waterLevel);assert.equal(s.machine.waterY,540);assert.equal(s.level.ladders.at(-1).bottom,1000);
 assert.ok(s.heroes.every(h=>h.air===12&&h.hp===3));
});
test('Olaf floats, Erik swims in both axes and armored Baleog sinks',()=>{
 const s=fresh();for(const h of s.heroes)Object.assign(h,{x:380,y:620,vy:0,ground:false});
 tick(s,{right:true,down:true},60);assert.ok(s.heroes[0].x>500);assert.ok(s.heroes[0].y>680);
 assert.ok(s.heroes[2].y<620&&s.heroes[2].y>516);assert.ok(s.heroes[1].y>700);
});
test('falling intake shelter depends on actual raised-shield overlap, not a global shield flag',()=>{
 const s=fresh(),o=s.heroes[2];o.x=500;o.shieldUp=true;assert.equal(waterSheltered(s),false);
 o.x=710;o.y=516;assert.equal(waterSheltered(s),true);o.shieldUp=false;assert.equal(waterSheltered(s),false);
});
test('strong inlet pushes swimmers back until sheltered; bulkhead forbids a surface bypass',()=>{
 const s=fresh(),e=s.heroes[0],o=s.heroes[2];Object.assign(e,{x:650,y:870,ground:false});
 tick(s,{right:true},100);assert.ok(e.x<685);
 Object.assign(o,{x:710,shieldUp:true});tick(s,{right:true},100);assert.ok(e.x>780);
 Object.assign(e,{x:740,y:540,vx:0,vy:0});tick(s,{right:true},60);assert.ok(e.x<=744);
});
test('inactive submerged heroes use air, receive actual suffocation damage, and refuge refills air',()=>{
 const s=fresh(),b=s.heroes[1];Object.assign(b,{x:1150,y:956,ground:true,air:.2});tick(s,{},90);assert.ok(b.hp<3);
 const pocket=waterAirPockets(s)[0];Object.assign(b,{x:(pocket.x+pocket.w/2),y:856,vy:0,air:1});tick(s,{},90);assert.equal(b.air,12);
});
test('surface float requires directional front-shield contact and can be pushed both ways',()=>{
 const s=fresh(),o=s.heroes[2],f=s.machine.float;s.active=2;
 Object.assign(o,{x:f.x-f.w/2-42,y:516,shieldUp:false,ground:true});const start=f.x;tick(s,{right:true},120);assert.ok(f.x>start+100);
 assert.ok(Math.abs(o.x+42-(f.x-f.w/2))<.01);
 Object.assign(o,{x:f.x+f.w/2+42,face:-1,vx:0});const right=f.x;tick(s,{left:true},90);assert.ok(f.x<right-30);
 assert.ok(Math.abs(o.x-42-(f.x+f.w/2))<.01);
});
test('deep side entry rises continuously with bounded speed, then settles at the surface',()=>{
 for(const hz of [60,120]){const s=fresh(),o=s.heroes[2];Object.assign(o,{x:340,y:850,vy:0,ground:false});
  let previous=o.y;for(let k=0;k<5*hz;k++){tick(s,{},1,hz);assert.ok(Math.abs(o.y-previous)<=180/hz+.001);previous=o.y;}
  assert.ok(Math.abs(o.y-516)<2);assert.ok(Math.abs(o.vy)<5);
 }
});
test('the visible basin banks stop submerged movement while the wet-face exit ladder remains accessible',()=>{
 const s=fresh(),e=s.heroes[0];Object.assign(e,{x:345,y:700,ground:false});tick(s,{left:true},60);assert.ok(e.x>=336);
 Object.assign(e,{x:2080,y:700,vx:0,swimVy:0});tick(s,{right:true},60);assert.ok(e.x<=2084);
 e.x=2080;tick(s,{up:true},130);assert.equal(e.y+44,540);tick(s,{right:true},60);assert.ok(e.x>2100);
});
test('chain must be cut before winding; sluice/water animate continuously and no hero teleports',()=>{
 const s=fresh(),b=s.heroes[1];s.active=1;Object.assign(b,{x:1660,y:956,ground:true});s.machine.float.x=1660;
 tick(s,{interact:true});assert.equal(s.machine.operator,null);tick(s,{sword:true});assert.equal(s.machine.chainCut,true);
 tick(s,{interact:true});assert.equal(s.machine.operator,1);tick(s,{right:true},605);assert.equal(s.machine.wound,1);
 const o=s.heroes[2];Object.assign(o,{x:1500,y:516,vy:0,ground:false});
 let previous=s.machine.waterY,previousOlaf=o.y;for(let k=0;k<700;k++){tick(s);assert.ok(s.machine.waterY>=previous);assert.ok(s.machine.waterY-previous<=40/60+.001);assert.ok(Math.abs(o.y-previousOlaf)<=3.001);previous=s.machine.waterY;previousOlaf=o.y;}
 assert.equal(s.machine.waterY,950);assert.equal(s.power,true);
});
test('Baleog retains his bow and underwater arrows move with drag and hit the solid bulkhead',()=>{
 const s=fresh();s.active=1;Object.assign(s.heroes[1],{x:690,y:760,face:1,ground:false});
 tick(s,{action:true});assert.equal(s.shots.length,1);const x=s.shots[0].x;tick(s,{},3);assert.ok(s.shots[0].x>x);assert.ok(s.shots[0].x-x<25);
 tick(s,{},30);assert.equal(s.shots.length,0);
});
test('partial crank travel holds on release and reverses continuously when unwound',()=>{
 const s=fresh(),b=s.heroes[1];s.active=1;s.machine.chainCut=true;s.machine.float.x=1660;
 Object.assign(b,{x:1660,y:956,ground:true});tick(s,{interact:true});tick(s,{right:true},300);
 assert.ok(Math.abs(s.machine.wound-.5)<.002);tick(s,{interact:true});const held=s.machine.wound;tick(s,{},60);
 assert.equal(s.machine.wound,held);assert.equal(s.machine.drainPose,0);tick(s,{interact:true});
 let last=s.machine.wound;for(let k=0;k<120;k++){tick(s,{left:true});assert.ok(s.machine.wound<=last&&last-s.machine.wound<=1/600+.000001);last=s.machine.wound;}
 assert.ok(Math.abs(s.machine.wound-.3)<.002);assert.equal(b.hp,3);
});
test('air exists only inside the generated bell cavities, not through opaque side walls',()=>{
 const s=fresh(),b=s.heroes[1],p=waterAirPockets(s)[1];
 Object.assign(b,{x:s.machine.float.x,y:956,air:1,ground:true});tick(s,{},30);assert.ok(b.air>4);
 b.x=p.x-4;const before=b.air;tick(s,{},30);assert.ok(b.air<before);assert.equal(b.inAirPocket,false);
});
test('descending compressor berths above the machine, carrying its rider on the same physical deck',()=>{
 const s=fresh(),g=s.machine,e=s.heroes[0];s.active=1;g.chainCut=true;g.wound=1;
 Object.assign(e,{x:g.float.x,y:g.float.y-44,ground:true,support:'water-pontoon'});
 let previous=g.float.y;
 for(let k=0;k<800;k++){tick(s);assert.ok(g.float.y-previous<=40/60+.001);assert.ok(g.float.y<=WATER_DOCK_DECK);assert.ok(Math.abs(e.y+44-g.float.y)<.001);previous=g.float.y;}
 assert.equal(g.float.y,WATER_DOCK_DECK);assert.equal(g.float.y+48,WATER_CRADLE_SEAT);assert.ok(WATER_CRADLE_SEAT<816);
 assert.equal(e.hp,3);
});
