import {test} from 'node:test';import assert from 'node:assert/strict';import {createState,step} from '../../src/core/engine.js';
for(const hz of [60,120])for(let round=1;round<=5;round++)test('redesigned round '+round+' complete normal-control route at '+hz+' Hz',()=>{
 const s=createState(round),g=s.machine;
 const tick=(input={},n=1)=>{for(let i=0;i<Math.round(n*hz/60);i++)step(s,i===0?input:{left:input.left,right:input.right},1/hz);};
 const move=(id,x)=>{s.active=id;for(let i=0;i<hz*15&&!s.won;i++){const h=s.heroes[id],d=x-h.x;if(Math.abs(d)<4&&Math.abs(h.vx)<20)break;const brake=h.ground?[2600,2300,2100][id]:[1250,950,750][id],vstop=h.vx*Math.abs(h.vx)/(2*brake),r=d-vstop;tick(Math.abs(r)<3?{}:r>0?{right:true}:{left:true});}tick({},12);assert.ok(s.won||Math.abs(s.heroes[id].x-x)<10,round+': blocked hero '+id+' at '+s.heroes[id].x+' seeking '+x);};
 const face=(id,dir=1)=>{s.active=id;tick(dir===1?{right:true}:{left:true},5);tick({},8);};
 const jump=x=>{s.active=0;tick({jump:true});move(0,x);tick({},75);};
 const waitFor=(check,label)=>{for(let i=0;i<hz*20&&!check();i++)tick();assert.ok(check(),label+' '+JSON.stringify(g));};
 const use=id=>{s.active=id;tick({interact:true});tick({},5);};
 const bash=x=>{move(0,x-120);tick({right:true},20);tick({right:true,action:true},10);tick({},45);};
 const shot=()=>{face(1);tick({action:true});tick({},120);};
 tick({},30);
 if(round===1){
  move(2,230);tick({overhead:true});tick({},200);assert.ok(g.charged);
  move(0,260);jump(350);move(0,380);jump(470);use(0);assert.ok(g.liftOn);move(0,520);jump(740);
  for(const id of [1,2]){move(id,475);waitFor(()=>g.liftY>=609,'lift bottom');move(id,580);waitFor(()=>s.heroes[id].y<350&&s.heroes[id].ground,'lift rider');move(id,760);if(id===1){move(1,850);shot();assert.ok(g.hatch);}}
  for(const id of [0,1,2])move(id,1340);
 }else if(round===2){
  move(2,650);face(2,-1);tick({action:true});move(0,335);jump(550);use(0);assert.equal(g.lane,1);move(1,420);shot();assert.equal(g.score,1);
  use(0);use(0);shot();assert.equal(g.score,2);use(0);use(0);shot();assert.equal(g.score,3);
  for(const id of [0,1,2]){move(id,100);tick({},80);}
 }else if(round===3){
  bash(290);assert.ok(g.bell);move(0,340);use(0);assert.equal(s.heroes[0].x,630);
  move(2,340);use(2);move(2,720);face(2,-1);tick({action:true});waitFor(()=>g.mirror,'reflected eye');assert.ok(g.mirror);
  move(1,340);use(1);move(1,810);face(1);tick({sword:true});assert.ok(g.seal);
  for(const id of [1,2,0]){move(id,830);use(id);move(id,1340);}
 }else if(round===4){
  bash(320);assert.ok(g.brake);move(1,420);shot();assert.ok(g.signal);move(2,575);face(2);tick({action:true});move(2,1060);assert.ok(g.parked);for(const id of [0,1,2])move(id,1340);
 }else{
  s.active=2;tick({jump:true}); // Keep the shield overhead while pressure is prepared.
  move(1,890);face(1);tick({sword:true});assert.ok(g.ore);move(2,940);face(2);tick({action:true});move(1,800);for(let i=0;i<3;i++)bash(520);waitFor(()=>g.heat===3,'forge heating');for(const id of [0,1,2])move(id,1000);
 }
 tick({},30);assert.equal(s.won,true,round+' failed exit: '+JSON.stringify(s.heroes.map(h=>({x:h.x,y:h.y}))));
});

