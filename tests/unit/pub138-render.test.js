import test from 'node:test';
import assert from 'node:assert/strict';
globalThis.Image??=class{complete=false;naturalWidth=0;};
const {alehallCupPoses}=await import('../../src/levels/pub/render.js');
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
