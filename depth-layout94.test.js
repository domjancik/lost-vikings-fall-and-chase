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
  assert.deepEqual(p.walls,[],'Decorative rooms must not replace ground infill with brick patches');
  assert.equal(JSON.stringify(s),before,'Decoration planning must not mutate gameplay');
 }
});

test('Warden room walls are non-contact enclosure planes with grounded bottoms',()=>{
 const s=createState(5,'cycle'),before=JSON.stringify(s),plan=module.depthPlan(s);
 assert.equal(plan.rooms.length,4);
 for(const room of plan.rooms){
  assert.equal(room.y+room.h,room.floorY);
  assert.ok([...s.level.floors,...s.level.platforms].some(f=>f.y===room.floorY&&f.x<=room.x&&f.x+f.w>=room.x+room.w));
  assert.ok(!('collision' in room));
 }
 assert.equal(JSON.stringify(s),before);
 assert.ok(plan.rooms.every(r=>r.x+r.w<=920||r.x>=1760||r.y>=1000),'Guardian contact bay stays readable');
});
