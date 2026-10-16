import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,step} from '../../src/core/engine.js';
import {ALEHALL_CASK,ALEHALL_DELIVERY_X} from '../../src/levels/pub/layout.js';

test('reversing the cask stops before the visible delivery crate',()=>{
 const s=createState(11,'cycle'),o=s.heroes[2];s.active=2;o.x=ALEHALL_CASK.start-80;o.face=1;
 for(let n=0;n<360;n++)step(s,{right:true},1/120);
 assert.equal(s.machine.cart.x,ALEHALL_CASK.max);
 assert.ok(s.machine.cart.x+48<ALEHALL_DELIVERY_X-32,'native cask and crate material must not overlap at the far stop');
});

for(const hz of [60,120]){
 test('Erik cannot take the loft key by jumping through its solid underside at '+hz+'Hz',()=>{
  const s=createState(11,'cycle'),h=s.heroes[0];s.active=0;h.x=730;
  for(let n=0;n<hz*2;n++){
   step(s,{jump:n===0,interact:true},1/hz);
   assert.ok(h.y-34>=634,'the latest Erik helmet must stay below the visible timber underside');
  }
  assert.ok(!h.inventory.includes('hallKey'),'wood between Erik and key must block reach');
 });
 test('parked cask cannot replace Olaf in the loft route at '+hz+'Hz',()=>{
  const s=createState(11,'cycle'),h=s.heroes[0];s.active=2;
  for(let n=0;n<hz*5&&!s.machine.cart.parked;n++)step(s,{left:true},1/hz);
  assert.ok(s.machine.cart.parked);
  s.active=0;Object.assign(h,{x:s.machine.cart.x,y:s.machine.cart.y-44,ground:true,vx:0,vy:0,support:'hall-cart'});
  let landedLoft=false;
  for(let n=0;n<hz*2;n++){
   step(s,{jump:n===0,left:h.x>730,interact:true},1/hz);
   landedLoft ||= h.ground&&h.y+44===s.level.platforms[0].y;
  }
  assert.ok(!landedLoft,'barrel must not provide a solo step onto the loft');
  assert.ok(!h.inventory.includes('hallKey'));
 });
 test('running edge/coyote jumps with every sampled dash timing cannot bypass Olaf at '+hz+'Hz',()=>{
  let actualDashes=0;
  for(const edgeOffset of [-18,-12,-6,0,6,12,18])for(const bashOffset of [-1,0,8,16,24,32,40,48,56,64]){
   const s=createState(11,'cycle'),h=s.heroes[0];s.active=0;s.machine.cart.x=ALEHALL_CASK.park;s.machine.cart.parked=true;
   Object.assign(h,{x:ALEHALL_CASK.park+30,y:ALEHALL_CASK.top-44,vx:-230,vy:0,ground:true,support:'hall-cart'});
   let jumped=-1,bashRequested=false,dashed=false;
   for(let n=0;n<hz*2;n++){
    const jump=jumped<0&&h.x<=ALEHALL_CASK.park-ALEHALL_CASK.w/2-15+edgeOffset;
    if(jump)jumped=n;
    const action=!bashRequested&&bashOffset>=0&&h.x<=ALEHALL_CASK.park-ALEHALL_CASK.w/2+bashOffset;
    if(action)bashRequested=true;
    step(s,{left:true,jump,action,interact:true},1/hz);dashed ||= h.bash>0;
    assert.ok(!(h.ground&&h.y+44===s.level.platforms[0].y),'solo loft landing '+JSON.stringify({hz,edgeOffset,bashOffset}));
    assert.ok(!h.inventory.includes('hallKey'),'solo midair pickup '+JSON.stringify({hz,edgeOffset,bashOffset}));
   }
   if(dashed)actualDashes++;
  }
  assert.ok(actualDashes>0,'the sweep must exercise actual grounded running bashes before jumping');
 });
}
