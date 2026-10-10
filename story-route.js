import assert from 'node:assert/strict';import {step} from './engine.js';
export function playStoryRoute(s,hz=120){const events=[],dt=1/hz;
 const tick=(input={},seconds=dt)=>{for(let i=0;i<Math.max(1,Math.round(seconds*hz));i++){const cmd=i===0?input:{left:input.left,right:input.right};events.push({id:s.active,input:cmd});step(s,cmd,dt);assert.equal(s.failed,false,'Death '+s.round+' '+JSON.stringify(s.heroes));}};
 const move=(id,x)=>{s.active=id;let done=false;for(let i=0;i<hz*28;i++){if(s.won){done=true;break;}const h=s.heroes[id],d=x-h.x;if(Math.abs(d)<3&&Math.abs(h.vx)<12){done=true;break;}const brake=h.ground?[2600,2300,2100][id]:[1250,950,750][id],stop=h.vx*Math.abs(h.vx)/(2*brake),r=d-stop;tick(Math.abs(r)<2?{}:r>0?{right:true}:{left:true});}tick({},.15);assert.ok(done,'Blocked '+s.round+' '+id+' → '+x+' '+JSON.stringify(s.heroes));};
 const face=(id,dir=1)=>{s.active=id;tick(dir>0?{right:true}:{left:true},.06);tick({},.1);};
 const use=id=>{s.active=id;tick({interact:true});tick({},.1);};
 const item=(id,type)=>{s.active=id;s.heroes[id].itemSlot=s.heroes[id].inventory.indexOf(type);assert.ok(s.heroes[id].itemSlot>=0,'Missing '+type);tick({item:true});};
 const jump=x=>{s.active=0;tick({jump:true});move(0,x);tick({},.7);};
 const boost=(ox,shelf)=>{move(2,ox);s.active=2;tick({jump:true});move(0,ox-55);jump(ox);assert.equal(s.heroes[0].support,2,'Shield boarding');jump(shelf);assert.equal(s.heroes[0].y,366,'Shelf landing');};
 const sword=x=>{move(1,x-55);face(1);tick({sword:true});tick({},2.2);};
 const bow=(x,wait=1)=>{move(1,x);face(1);tick({action:true});tick({},wait);};
 const clear=(from)=>{for(const e of s.enemies.filter(e=>e.hp>0)){const firing=from??e.left-450;face(2);tick({action:true});move(2,firing+60);move(1,firing);face(1);let n=0;while(e.hp>0&&n++<12){tick({action:true});tick({},.7);}assert.equal(e.hp,0,'Defeat '+e.x);tick({},1);}};
 const secure=(holder,pad,runner,latch)=>{move(holder,pad);tick({},1.3);move(runner,latch);use(runner);tick({},.3);};
 const ride=(index,ids=[0,1,2])=>{const l=s.machine.lifts[index];for(const [n,id]of ids.entries())move(id,l.x+30+n*40);use(ids[ids.length-1]);tick({},5);assert.ok(Math.abs(l.y-l.target)<.1,'Lift arrival');for(const id of ids)assert.ok(Math.abs(s.heroes[id].y+44-l.y)<.1,'Rider '+id);};
 tick({},.5);
 switch(s.round){
 case 0:secure(2,500,0,950);boost(1190,1300);move(0,1320);use(0);move(0,1500);tick({},1);item(0,'serviceKey');tick({},1.3);clear(1810);sword(2350);break;
 case 1:move(0,700);use(0);bow(950);tick({},4.5);ride(0);clear(2020);break;
 case 2:boost(550,660);move(0,690);use(0);move(0,1000);tick({},1);move(2,1600);face(2);s.active=2;tick({action:true});move(1,1500);use(1);tick({},4.5);assert.equal(s.machine.work,1,'Protected stroke');sword(2050);tick({},3);break;
 case 3:sword(850);tick({},1.3);ride(0);clear(2110);bow(2300);tick({},1.3);break;
 case 4:boost(690,790);move(0,830);use(0);move(0,1200);tick({},1);item(0,'archive');tick({},3.2);use(0);assert.ok(s.heroes[0].inventory.includes('archive'));secure(2,1800,1,2240);move(1,1900);clear(2220);break;
 case 5:sword(1250);bow(1380);ride(0);clear(2040);move(0,2280);s.active=2;tick({jump:true});move(2,2470);move(2,2530);tick({},7);assert.equal(s.heroes[2].y,766,'Float lower landing');
  // Other crew return down the reusable first lift, then traverse the lower route.
  for(const id of [0,1])move(id,1920);use(1);tick({},5);for(const id of [0,1])move(id,2770);use(1);tick({},6);move(1,2950);use(1);move(0,3100);move(1,3100);move(2,2770);use(2);tick({},6);use(2);tick({},6);break;
 case 6:move(2,950);item(2,'archive');move(0,1300);use(0);tick({},5.3);for(const [id,x]of [[0,2000],[1,2300],[2,2600]]){move(id,x);use(id);}break;
 case 7:move(2,1550);face(2);ride(0,[0]);move(0,1200);use(0);move(0,1450);tick({},1.5);move(0,1300);move(0,1070);use(0);tick({},4);for(const id of [0,1])move(id,1400);tick({},1.3);clear(1620);sword(2050);tick({},2);move(0,2400);move(2,2500);tick({},1.3);move(1,2820);use(1);break;
 }
 if(s.round!==6){for(const id of [0,1,2])move(id,3100);tick({},.3);}assert.ok(s.won,'Uncleared '+s.round+' '+JSON.stringify(s.machine));assert.ok(s.heroes.every(h=>h.hp>0));return events;
}
