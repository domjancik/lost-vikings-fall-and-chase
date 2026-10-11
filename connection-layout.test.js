import test from 'node:test';
import assert from 'node:assert/strict';
import {connectionPlan,connectionFrame} from './connection-layout.js';
test('orthogonal route endpoints and clips remain on the world pixel grid',()=>{
 const p=connectionPlan([[1080,370],[1200,370],[1200,850],[1296,850]],'cable');
 assert.deepEqual(p.anchors,[[1080,370],[1200,370],[1200,850],[1296,850]]);
 assert.equal(p.corners.length,2);
 for(const t of p.tiles)for(const k of ['x','y','w','h'])assert.equal(t[k]%2,0);
 assert.ok(p.tiles.some(t=>t.clip));
});
test('each cable animation retains identical attachment coordinates',()=>{
 const points=[[0,0],[128,0],[128,128]],plans=[];
 for(let frame=0;frame<4;frame++)plans.push(connectionPlan(points,'cable',{frame}));
 const geometry=p=>p.tiles.map(({cell,...g})=>g);
 for(const p of plans)assert.deepEqual(geometry(p),geometry(plans[0]));
 assert.equal(new Set(plans.map(p=>p.tiles[0].cell)).size,4);
});
test('diagonal or too-short corner spans are rejected',()=>{
 assert.throws(()=>connectionPlan([[0,0],[32,32]],'pipe'),/orthogonal/);
 assert.throws(()=>connectionPlan([[0,0],[10,0],[10,64]],'pipe'),/short/);
});
test('cable frames are discrete, independently phased; pipes and rails stay rigid',()=>{
 assert.equal(connectionFrame(.01,0),connectionFrame(.04,0));
 assert.notEqual(connectionFrame(.01,0),connectionFrame(.01,1));
 assert.equal(connectionPlan([[0,0],[128,0]],'pipe',{frame:3}).tiles[0].cell,0);
 assert.equal(connectionPlan([[0,0],[128,0]],'rail',{frame:3}).tiles[0].cell,24);
});
