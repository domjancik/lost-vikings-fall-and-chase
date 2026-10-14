import {prepareMotion,integrateMotion} from '../../core/movement.js?v=vikings70';
import {shieldHit,segmentHit} from '../../core/projectile-collision.js?v=arc46';
import {startBash} from '../../core/bash.js?v=arc46';
import {damage} from '../../core/health.js?v=arc46';
import {giveItem,pickupItem,useItem,message} from '../../core/inventory.js?v=orbit113';
export function setupInventoryLevel(s){if(s.round<6)return;const g=s.machine;Object.assign(g,{ingredients:[],ovenMode:0,cook:0,oven:false,baked:false,ticket:false,lamp:false,lens:null,angle:0,sunset:false,ocean:false,motor:false,gate:false,safe:false});
 const item=(id,type,x,y,locked=false)=>({id,type,x,y,locked});
 s.items=s.round===6?[item('flour','flour',350,566,true),item('spice','spice',610,236),item('apple','apple',160,566)]:s.round===7?[item('lamp','lamp',300,566,true),item('red','red',600,236),item('blue','blue',1000,566),item('meat','meat',820,566)]:[item('apple','apple',250,566)];
 s.itemAction=(type,h,slot)=>useQuestItem(s,type,h,slot);
}
const near=(h,x,y=566)=>Math.abs(h.x-x)<76&&Math.abs(h.y-y)<62;
export function inventoryObjects(s){const g=s.machine,base={kind:'machine',radius:70,ready:true,done:false};
 if(s.round===6)return [{...base,id:'bowl',x:620,y:566,title:'MIX Â· FLOUR + SPICE',run:()=>g.ingredients.length===2?'Dough prepared. Load it into the oven with BAG / Q.':'Select FLOUR or SPICE in BAG, then USE ITEM / Q beside this bowl.'}, {...base,id:'oven',x:1000,y:566,title:'OVEN Â· '+['OFF','WARM','HOT'][g.ovenMode],run:()=>{if(g.baked){if(!giveItem(s.heroes[s.active],'ticket'))return 'Bag full. Make room for the ticket.';g.baked=false;g.ticket=true;g.ovenDoorAt=s.time;return 'Bronze ticket collected. Use it at the turnstile.';}g.ovenMode=(g.ovenMode+1)%3;return 'Oven '+['OFF','WARM','HOT'][g.ovenMode]+'. Dough needs WARM heat for three seconds.';}},{...base,id:'turnstile',x:1200,y:566,title:s.power?'TICKET ACCEPTED':'BRONZE TICKET SLOT',run:()=> 'Select the bronze ticket and USE ITEM / Q here.'}];
 if(s.round===7)return [{...base,id:'projector',x:630,y:566,title:'PROJECTOR Â· '+(g.lens||'NO LENS').toUpperCase()+' / '+(g.angle?'HIGH':'LOW'),run:()=>{g.angle=1-g.angle;return 'Beam aimed '+(g.angle?'HIGH':'LOW')+'. Sunset above; ocean below.';}}];
 return [{...base,id:'dispenser',x:520,y:566,title:'BOMB DISPENSER',run:()=>giveItem(s.heroes[s.active],'bomb')?'Bomb issued. Use BAG / Q to place it. Retreat before the two-second fuse ends.':'Bag full. Give or drop an item.'},{...base,id:'keylock',x:1260,y:566,title:s.power?'VAULT UNLOCKED':'NEON KEY SLOT',run:()=> 'Select the neon key and USE ITEM / Q here.'}];
}
function useQuestItem(s,type,h,slot){const g=s.machine,consume=()=>h.inventory[slot]=null;
 if(s.round===6){if(['flour','spice'].includes(type)&&near(h,620)&&!g.ingredients.includes(type)){g.ingredients.push(type);g.mixedAt=s.time;consume();if(g.ingredients.length===2){giveItem(h,'dough');message(s,'Spiced dough mixed! Load the oven.');}else message(s,'Ingredient added. Bowl needs '+(type==='flour'?'spice':'flour')+'.');return true;}
 if(type==='dough'&&near(h,1000)&&!g.oven&&!g.baked&&!g.ticket){g.oven=true;g.cook=0;g.ovenDoorAt=s.time;consume();message(s,'Dough loaded. USE oven to select WARM. Olaf can block the exhaust.');return true;}
 if(type==='ticket'&&near(h,1200)){consume();s.power=true;message(s,'Turnstile unlocked. Bring all three to the exit.');return true;}}
 if(s.round===7&&near(h,630)){if(type==='lamp'&&!g.lamp){g.lamp=true;consume();message(s,'UV lamp installed. Insert a colored lens.');return true;}if(['red','blue'].includes(type)){const old=g.lens;g.lens=type;h.inventory[slot]=old;message(s,'Lens '+type+'. Previous lens returned to the same slot. USE projector to change aim.');return true;}}
 if(s.round===8&&type==='key'&&near(h,1260)){consume();s.power=true;message(s,'Vault exit unlocked. Bring the whole crew.');return true;}return false;
}
export function inventoryStep(s,input,dt){s.time+=dt;s.cooldown=Math.max(0,s.cooldown-dt);const a=s.heroes[s.active],g=s.machine,o=s.heroes[2];for(const h of s.heroes)h.swing=Math.max(0,(h.swing||0)-dt);prepareMotion(s,input,dt);startBash(s,dt);
 if(input.sword&&a.id===1&&s.cooldown===0){a.swing=.24;s.cooldown=.3;for(const item of s.items)if(item.locked&&(item.x-a.x)*a.face>0&&Math.abs(item.x-a.x)<85&&Math.abs(item.y-a.y)<60){item.locked=false;message(s,'Container opened. USE to collect the item.');}if(s.round===7&&near(a,930)){g.motor=true;message(s,'Pendulum drive severed. Passage safe.');}}
 if(input.action&&a.id===1&&s.cooldown===0){s.cooldown=.35;a.bow=.28;s.shots.push({kind:'arrow',x:a.x+a.face*25,y:a.y+20,v:a.face*580});}
 if(input.interact&&!pickupItem(s)){const obj=inventoryObjects(s).filter(obj=>near(a,obj.x,obj.y)).sort((a1,b)=>Math.abs(a.x-a1.x)-Math.abs(a.x-b.x))[0];message(s,obj?obj.run():'No nearby object. Use beside an item or machine.');}
 if(input.item)useItem(s);
 const walls=s.round===6?[{x:1240,w:24,top:0,on:!s.power}]:s.round===7?[{x:700,w:24,top:0,on:!g.sunset},{x:1100,w:24,top:0,on:!g.ocean}]:[{x:820,w:28,top:450,on:!g.gate}];
 integrateMotion(s,[...s.level.floors,...s.level.platforms],walls,dt);
 if(s.round===6&&g.oven&&g.ovenMode){if(g.ovenMode===1){g.cook+=dt;if(g.cook>=3){g.oven=false;g.baked=true;message(s,'Ding! Ticket baked. USE oven to collect it.');}}else{g.cook=0;g.ovenMode=0;message(s,'Too hot! Oven shut off. Dough saved: select WARM to retry.');}
 if(Math.floor((s.time-dt)/1.4)!==Math.floor(s.time/1.4))s.shots.push({kind:'fire',x:1080,y:586,v:-260});}
 if(s.round===7){if(g.lamp&&g.lens==='red'&&g.angle)g.sunset=true;if(g.sunset&&g.lamp&&g.lens==='blue'&&!g.angle)g.ocean=true;s.power=g.sunset&&g.ocean;
 // The moving blade is a real contact hazard. Its motor can be cut with Baleog's sword.
 g.bladeX=870+Math.sin(s.time*1.4)*80;g.bladeY=520+Math.cos(s.time*1.4)*65;
 if(!g.motor)for(const h of s.heroes)if(Math.abs(h.x-g.bladeX)<27&&Math.abs(h.y+22-g.bladeY)<35)damage(s,h);
 }
 for(const b of s.bombs){b.fuse-=dt;const floor=[...s.level.floors,...s.level.platforms].filter(f=>b.x>=f.x&&b.x<=f.x+f.w&&f.y>=b.y).sort((a,b1)=>a.y-b1.y)[0];if(floor)b.y=Math.min(floor.y-12,b.y+240*dt);if(b.fuse<=0){b.dead=true;s.blast={x:b.x,y:b.y,time:s.time};
  if(s.round===8&&Math.hypot(b.x-834,b.y-580)<105){g.gate=true;message(s,'Armored gate blasted open. The upper safe holds the exit key.');}
  if(s.round===8&&!g.safe&&Math.hypot(b.x-970,b.y-360)<105){g.safe=true;g.safeOpenAt=s.time;s.items.push({id:'key',type:'key',x:970,y:346});message(s,'Safe opened. Erik can collect the neon key.');}
  for(const h of s.heroes){if(Math.hypot(h.x-b.x,h.y+22-b.y)>105)continue;const block=shieldHit(o,{x:h.x,y:h.y+22,v:h.x-b.x},b.x,b.y);if(!block)damage(s,h,3);}
 }}s.bombs=s.bombs.filter(b=>!b.dead);
 for(const p of s.shots){const px=p.x,py=p.y;p.prevX=px;p.prevY=py;p.x+=p.v*dt;const shield=shieldHit(o,p,px,py);const solid=walls.filter(w=>w.on).map(w=>segmentHit(px,py,p.x,p.y,{x:w.x,y:w.top||0,w:w.w,h:610-(w.top||0)})).filter(Boolean).sort((a,b)=>a.t-b.t)[0];
 const body=p.kind==='fire'?s.heroes.map(h=>({h,hit:segmentHit(px,py,p.x,p.y,{x:h.x-16,y:h.y,w:32,h:44})})).filter(b=>b.hit).sort((a,b)=>a.hit.t-b.hit.t)[0]:null;
 if(body&&body.hit.t<Math.min(shield?.t??Infinity,solid?.t??Infinity)){damage(s,body.h);p.dead=true;}else if(shield||solid)p.dead=true;
 }s.shots=s.shots.filter(p=>!p.dead&&p.x>0&&p.x<1440);
 // Dropped items fall onto platforms so recovery never requires catching them in midair.
 for(const i of s.items)if(i.id.startsWith('drop-')){const floors=[...s.level.floors,...s.level.platforms].filter(f=>i.x>=f.x&&i.x<=f.x+f.w&&f.y>=i.y+44).sort((a,b)=>a.y-b.y);if(floors[0])i.y=Math.min(floors[0].y-44,i.y+240*dt);}
 const e=s.level.exit;s.won=!s.failed&&s.power&&s.heroes.every(h=>Math.abs(h.x-e.x)<e.w/2&&Math.abs(h.y-(e.y-44))<30);
}

