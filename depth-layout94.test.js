import test from 'node:test';
import assert from 'node:assert/strict';
import {createState} from './engine.js';
const module=await import('./depth-layout94.js').catch(()=>null);
test('all six machine rooms have restrained decorative placements with real supports',()=>{
 assert.ok(module?.depthPlan);
 for(let round=0;round<6;round++){
  const s=createState(round,'cycle'),before=JSON.stringify(s),p=module.depthPlan(s);
  assert.ok(p.props.length>=6&&p.props.length<=10);
  for(const item of p.props){
   assert.equal(item.floorY,item.support.y);
   assert.ok(item.x-64>=item.support.x&&item.x+64<=item.support.x+item.support.w);
   assert.equal(item.x%2,0);assert.equal(item.floorY%2,0);
  }
  assert.ok(p.walls.length);
  for(const wall of p.walls){assert.ok(wall.y>=wall.support.y+24);assert.ok(wall.y+wall.h<=wall.support.y+wall.support.depth-8);}
  assert.equal(JSON.stringify(s),before,'Decoration planning must not mutate gameplay');
 }
});
