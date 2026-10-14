import {test} from 'node:test';import assert from 'node:assert/strict';import {createState,step} from '../../src/core/engine.js';import {useItem,transferItem} from '../../src/core/inventory.js';
for(const hz of [60,120])for(const round of [6,7,8])test('inventory round '+round+' clearable with all Vikings alive at '+hz+' Hz',()=>{
 const s=createState(round),g=s.machine;
 const tick=(input={},n=1)=>{for(let i=0;i<Math.round(n*hz/60);i++)step(s,i===0?input:{left:input.left,right:input.right},1/hz);assert.equal(s.failed,false,JSON.stringify(s.heroes));};
 const move=(id,x)=>{s.active=id;for(let i=0;i<hz*15&&!s.won;i++){const h=s.heroes[id],d=x-h.x;if(Math.abs(d)<4&&Math.abs(h.vx)<20)break;const brake=h.ground?[2600,2300,2100][id]:[1250,950,750][id],vstop=h.vx*Math.abs(h.vx)/(2*brake),r=d-vstop;tick(Math.abs(r)<3?{}:r>0?{right:true}:{left:true});}tick({},12);assert.ok(s.won||Math.abs(s.heroes[id].x-x)<10,'blocked '+id+' seeking '+x+' '+JSON.stringify(s.heroes));};
 const face=(id,dir=1)=>{s.active=id;tick(dir===1?{right:true}:{left:true},5);tick({},8);};
 const jump=x=>{s.active=0;tick({jump:true});move(0,x);tick({},75);};
 const use=id=>{s.active=id;tick({interact:true});tick({},5);};
 const item=(id,type)=>{s.active=id;const h=s.heroes[id];h.itemSlot=h.inventory.indexOf(type);assert.ok(h.itemSlot>=0,'missing '+type);tick({item:true});};
 const climb=()=>{move(0,240);jump(320);move(0,380);jump(470);move(0,520);jump(610);};
 tick({},30);
 if(round===6){move(1,300);face(1);tick({sword:true});move(1,350);use(1);assert.ok(s.heroes[1].inventory.includes('flour'));climb();use(0);assert.ok(s.heroes[0].inventory.includes('spice'));move(0,720);tick({},110);move(0,620);move(1,600);assert.ok(transferItem(s,0,1,s.heroes[0].inventory.indexOf('spice')));item(1,'flour');item(1,'spice');assert.ok(s.heroes[1].inventory.includes('dough'));move(2,1040);face(2);move(1,990);item(1,'dough');use(1);tick({},210);assert.ok(g.baked);use(1);item(1,'ticket');assert.equal(s.power,false,'wrong place keeps ticket');move(1,1200);item(1,'ticket');assert.ok(s.power);
 }else if(round===7){move(1,250);face(1);tick({sword:true});move(1,300);use(1);climb();use(0);move(0,680);tick({},110);move(0,630);item(0,'red');move(1,620);item(1,'lamp');use(1);tick();assert.ok(g.sunset);move(1,875);face(1);tick({sword:true});assert.ok(g.motor);move(1,1000);use(1);move(1,630);item(1,'blue');assert.ok(s.heroes[1].inventory.includes('red'),'lens swap returns old lens');use(1);tick();assert.ok(g.ocean&&s.power);
 }else {move(1,520);use(1);move(1,780);face(1);item(1,'bomb');move(1,620);tick({},145);assert.ok(g.gate);move(0,520);use(0);move(0,530);jump(600);move(0,650);jump(740);move(0,940);face(0);item(0,'bomb');move(0,760);tick({},145);assert.ok(g.safe);move(0,970);use(0);assert.ok(s.heroes[0].inventory.includes('key'));move(0,1180);tick({},120);move(0,1260);item(0,'key');assert.ok(s.power);}
 for(const id of [0,1,2])move(id,1340);tick({},30);assert.ok(s.won);assert.ok(s.heroes.every(h=>h.hp>0&&!h.dead));
});
test('bomb blast deals lethal damage and restart replenishes the puzzle',()=>{const s=createState(8);s.bombs.push({x:100,y:588,fuse:.001});step(s,{},.016);assert.ok(s.failed);assert.equal(s.heroes[0].hp,0);const retry=createState(8);assert.equal(retry.failed,false);assert.ok(!retry.machine.safe&&!retry.machine.gate);});
