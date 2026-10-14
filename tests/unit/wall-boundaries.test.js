import test from 'node:test';
import assert from 'node:assert/strict';
import {createState} from '../../src/core/engine.js';
import {depthPlan} from '../../src/render/depth-layout94.js';
const borders=await import('../../src/render/wall-boundaries.js').catch(()=>null);
const room={x:100,y:100,w:200,h:200,floorY:300};
const level={worldWidth:600,worldTop:0,worldBottom:600,floors:[],platforms:[]};
const plan=(r=room,l=level,rooms=[r])=>{
 assert.ok(borders?.wallBorderPlan,'Missing exposed masonry border planner');
 return borders.wallBorderPlan(r,l,rooms);
};
test('free-standing decorative walls get four sides and four corner tiles',()=>{
 const p=plan();assert.deepEqual(new Set(p.edges.map(e=>e.side)),new Set(['top','bottom','left','right']));
 assert.equal(p.corners.length,4);
});
test('a supporting collision floor hides only its covered portion of the bottom edge',()=>{
 const p=plan(room,{...level,floors:[{x:100,y:300,w:120}]});
 assert.deepEqual(p.edges.filter(e=>e.side==='bottom').map(e=>[e.start,e.end]),[[220,300]]);
 assert.ok(!p.corners.some(c=>c.kind==='bottom-left'));
 assert.ok(p.corners.some(c=>c.kind==='bottom-right'));
});
test('joined rooms do not draw borders across their shared opening',()=>{
 const neighbour={x:300,y:180,w:100,h:120};
 const p=plan(room,level,[room,neighbour]);
 assert.deepEqual(p.edges.filter(e=>e.side==='right').map(e=>[e.start,e.end]),[[100,180]]);
 assert.ok(!p.corners.some(c=>c.kind==='bottom-right'));
});
test('a device backing inside a continuous wall does not become a framed brick patch',()=>{
 const backing={x:160,y:220,w:108,h:80,floorY:300};
 const p=plan(backing,{...level,floors:[{x:100,y:300,w:200}]},[room]);
 assert.deepEqual(p.edges,[]);assert.deepEqual(p.corners,[]);
});
test('solid side walls suppress caps while disabled barriers leave exposed edges',()=>{
 const wall={x:300,w:20,top:100,bottom:300,on:true};
 assert.ok(!plan(room,{...level,walls:[wall]}).edges.some(e=>e.side==='right'));
 assert.ok(plan(room,{...level,walls:[{...wall,on:false}]}).edges.some(e=>e.side==='right'));
});
test('actual Warden rooms retain ground contacts, quiet shared edges and unchanged physics',()=>{
 const s=createState(5,'cycle'),before=JSON.stringify(s),p=depthPlan(s);
 for(const r of p.rooms){
  const edge=plan(r,s.level,p.rooms);
  assert.ok(!edge.edges.some(e=>e.side==='bottom'),'Masonry should meet its real floor');
  for(const e of edge.edges){assert.equal(e.start%2,0);assert.equal(e.end%2,0);}
 }
 assert.equal(JSON.stringify(s),before);
});
