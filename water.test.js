import test from 'node:test';import assert from 'node:assert/strict';
import {createState,step} from './engine.js';
import {waterLevel,waterSheltered,waterAirPockets} from './water-campaign.js';
const fresh=()=>createState(4,'cycle');
function tick(s,input={},n=1,hz=60){for(let k=0;k<n;k++)step(s,input,1/hz);}
test('water lab starts with distinct reachable docks and permanent escape ladder',()=>{
 const s=fresh();assert.deepEqual(s.level,waterLevel);assert.equal(s.machine.waterY,540);assert.equal(s.level.ladders.at(-1).bottom,1000);
 assert.ok(s.heroes.every(h=>h.air===12&&h.hp===3));
});
test('Olaf floats, Erik swims in both axes and armored Baleog sinks',()=>{
 const s=fresh();for(const h of s.heroes)Object.assign(h,{x:380,y:620,vy:0,ground:false});
 tick(s,{right:true,down:true},60);assert.ok(s.heroes[0].x>500);assert.ok(s.heroes[0].y>680);
 assert.equal(s.heroes[2].y,516);assert.ok(s.heroes[1].y>700);
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
 Object.assign(o,{x:f.x-f.w/2-28,y:516,shieldUp:false,ground:true});const start=f.x;tick(s,{right:true},120);assert.ok(f.x>start+100);
 Object.assign(o,{x:f.x+f.w/2+28,face:-1,vx:0});const right=f.x;tick(s,{left:true},90);assert.ok(f.x<right-30);
});
test('chain must be cut before winding; sluice/water animate continuously and no hero teleports',()=>{
 const s=fresh(),b=s.heroes[1];s.active=1;Object.assign(b,{x:1660,y:956,ground:true});s.machine.float.x=1660;
 tick(s,{interact:true});assert.equal(s.machine.operator,null);tick(s,{sword:true});assert.equal(s.machine.chainCut,true);
 tick(s,{interact:true});assert.equal(s.machine.operator,1);tick(s,{right:true},605);assert.equal(s.machine.wound,1);
 let previous=s.machine.waterY;for(let k=0;k<700;k++){tick(s);assert.ok(s.machine.waterY>=previous);assert.ok(s.machine.waterY-previous<=40/60+.001);previous=s.machine.waterY;}
 assert.equal(s.machine.waterY,950);assert.equal(s.power,true);
});
test('Baleog retains his bow and underwater arrows move with drag and hit the solid bulkhead',()=>{
 const s=fresh();s.active=1;Object.assign(s.heroes[1],{x:690,y:760,face:1,ground:false});
 tick(s,{action:true});assert.equal(s.shots.length,1);const x=s.shots[0].x;tick(s,{},3);assert.ok(s.shots[0].x>x);assert.ok(s.shots[0].x-x<25);
 tick(s,{},30);assert.equal(s.shots.length,0);
});
