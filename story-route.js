import assert from 'node:assert/strict';import {step} from './engine.js';
export function playStoryRoute(s,hz=120){const events=[],dt=1/hz;
 const tick=(input={},seconds=dt)=>{for(let i=0;i<Math.max(1,Math.round(seconds*hz));i++){const cmd=i===0?input:{left:input.left,right:input.right};events.push({id:s.active,input:cmd});step(s,cmd,dt);assert.equal(s.failed,false,'Death in '+s.round+' '+JSON.stringify(s.heroes));}};
 const move=(id,x)=>{s.active=id;let done=false;for(let i=0;i<hz*25;i++){if(s.won){done=true;break;}const h=s.heroes[id],d=x-h.x;if(Math.abs(d)<3&&Math.abs(h.vx)<12){done=true;break;}const brake=h.ground?[2600,2300,2100][id]:[1250,950,750][id],stop=h.vx*Math.abs(h.vx)/(2*brake),r=d-stop;tick(Math.abs(r)<2?{}:r>0?{right:true}:{left:true});}tick({},.15);assert.ok(done,'Blocked '+id+' -> '+x+' '+JSON.stringify(s.heroes));};
 const face=(id,dir=1)=>{s.active=id;tick(dir>0?{right:true}:{left:true},.06);tick({},.1);};
 const use=id=>{s.active=id;tick({interact:true});tick({},.1);};const item=(id,type)=>{s.active=id;const h=s.heroes[id];h.itemSlot=h.inventory.indexOf(type);assert.ok(h.itemSlot>=0,'Missing '+type);tick({item:true});};
 const jump=x=>{s.active=0;tick({jump:true});move(0,x);tick({},.8);};
 const climb=x=>{move(0,x-20);jump(x+60);move(0,x+120);jump(x+220);move(0,x+265);jump(x+370);};
 const sword=()=>{face(1);tick({sword:true});};const bow=(wait=.6)=>{face(1);tick({action:true});tick({},wait);};
 const clearEnemies=(max=Infinity)=>{for(const e of s.enemies.filter(e=>e.hp>0&&e.x<max)){move(1,e.left-490);while(e.hp>0){bow(1.2);assert.ok(s.time<500,'Enemy not reachable');}}};
 const bash=x=>{move(0,x-120);s.active=0;tick({right:true},.32);tick({action:true,right:true},.15);tick({},.3);};
 const board=x=>{move(2,x);tick({},.8);s.active=2;tick({jump:true});move(1,x+10);move(0,x-10);tick({},.1);assert.equal(s.heroes[1].support,2,'Baleog shield boarding');assert.equal(s.heroes[0].support,2,'Erik shield boarding '+JSON.stringify(s.heroes));};
 tick({},.5);
 switch(s.round){
 case 0:climb(360);use(0);assert.ok(s.heroes[0].inventory.includes('serviceKey'));move(0,860);tick({},1.2);item(0,'serviceKey');move(0,600);clearEnemies();move(1,1585);sword();assert.ok(s.machine.cable);break;
 case 1:clearEnemies();climb(930);use(0);assert.ok(s.machine.dispatch);move(1,1700);bow();assert.ok(s.machine.delivery);move(2,1490);face(2);move(2,2330);assert.ok(s.machine.parked);break;
 case 2:bash(550);assert.ok(s.machine.bell);move(2,760);use(2);move(2,1450);face(2,-1);s.active=2;tick({action:true});tick({},3.2);assert.ok(s.machine.mirror);move(1,760);use(1);move(1,1610);sword();assert.ok(s.machine.seal);for(const id of [0,1,2]){if(s.heroes[id].x<900){move(id,760);use(id);}move(id,1730);use(id);}s.active=1;face(1);bow(.8);break;
 case 3:clearEnemies();move(1,1740);sword();move(2,1940);face(2);move(1,1740);for(let i=0;i<3;i++)bash(850);tick({},7);assert.equal(s.machine.heat,3);move(0,2020);use(0);move(0,2520);item(0,'ticket');break;
 case 4:move(2,610);s.active=2;tick({jump:true});move(0,560);jump(610);assert.equal(s.heroes[0].support,2);jump(730);use(0);move(0,890);tick({},1);item(0,'red');move(0,700);clearEnemies(1800);move(1,1370);use(1);move(1,1790);face(1);item(1,'bomb');move(1,1580);tick({},2.3);assert.ok(s.machine.safe);clearEnemies();move(1,1910);use(1);move(1,2520);item(1,'archive');break;
 case 5:move(1,230);sword();board(490);use(2);tick({},3.5);move(2,800);move(1,1000);bow(.6);assert.ok(s.machine.chime);board(1460);use(2);tick({},4.1);move(2,1780);move(0,2190);jump(2330);use(0);assert.ok(s.machine.aligned);break;
 case 6:climb(350);use(0);move(1,985);sword();assert.ok(s.machine.restraint);move(2,1340);s.active=2;tick({jump:true});tick({},2);assert.ok(s.machine.charge>=1);for(const [id,x] of [[0,1700],[1,2040],[2,2370]]){move(id,x);use(id);}assert.ok(s.machine.transferred.every(Boolean));break;
 case 7:clearEnemies();climb(1080);use(0);move(1,1670);sword();assert.ok(s.machine.cord&&s.machine.hatch);break;
 }
 if(s.round!==6){for(const id of [0,1,2])move(id,2720);tick({},.3);}assert.ok(s.won,'Uncleared '+s.round+' '+JSON.stringify(s.machine));assert.ok(s.heroes.every(h=>h.hp>0));return events;
}
