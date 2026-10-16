import test from 'node:test';
import assert from 'node:assert/strict';
globalThis.Image??=class{complete=false;naturalWidth=0;};
const {alehallCupPoses,drawAlehallBerth}=await import('../../src/levels/pub/render.js');
const {alehallBerthSteps}=await import('../../src/levels/pub/campaign.js');
const state=(mode,time=0,from={x:1390,y:716})=>({time,heroes:[{},{},{x:1390,y:716}],machine:{cups:{mode,at:0,from}}});

test('served ale belongs behind the heroes and remains anchored to its table',()=>{
 const s=state('served'),a=alehallCupPoses(s);s.heroes[2].x+=300;s.heroes[2].y-=100;
 assert.deepEqual(alehallCupPoses(s),a);
 assert.deepEqual(a.map(p=>[p.x,p.y,p.pass]),[[1374,722,'world'],[1390,722,'world'],[1406,722,'world']]);
});

test('the serving arc retains its departure point when Olaf walks away',()=>{
 const s=state('serving',.15),a=alehallCupPoses(s);s.heroes[2].x+=200;s.heroes[2].y-=50;
 assert.deepEqual(alehallCupPoses(s),a);assert.ok(a.every(p=>p.pass==='overlay'));
});

test('each cup switches behind the heroes as soon as it lands, before serving completes',()=>{
 const s=state('serving',.5),poses=alehallCupPoses(s);
 assert.equal(poses[0].pass,'world');assert.equal(poses[0].y,722);
 assert.equal(poses[1].pass,'overlay');assert.equal(poses[2].pass,'overlay');
 s.time=.7;assert.ok(alehallCupPoses(s).every(p=>p.pass==='world'));
});

test('empty cups produce no visible carried or tabletop copies',()=>{
 assert.deepEqual(alehallCupPoses(state('empty')),[]);
});

test('every physical loading tread has a fully opaque body to the ground',()=>{
 const fills=[],c=new Proxy({fillRect:(x,y,w,h)=>fills.push({x,y,w,h})},{get:(o,k)=>o[k]??(()=>{})});
 const treads=drawAlehallBerth(c);assert.equal(treads.length,6);
 assert.deepEqual(treads.map(({x,y,w})=>({x,y,w})),alehallBerthSteps);
 for(const tread of treads){assert.equal(tread.bottom,760);assert.equal(tread.opaque,true);for(const n of [tread.x,tread.y,tread.w,tread.bottom])assert.equal(n%2,0);assert.ok(fills.some(p=>p.x===tread.x&&p.y===tread.y&&p.w===tread.w&&p.h===760-tread.y),'entire climbable block must have opaque backing');}
});
