import {prepareMotion,integrateMotion} from '../../core/movement.js?v=freight109';
import {segmentHit,shieldHit} from '../../core/projectile-collision.js?v=freight109';
import {damage} from '../../core/health.js?v=freight109';
import {ladderAtHero} from '../../core/ladder-context.js?v=freight109';
import {startBash,bashImpact} from '../../core/bash.js?v=freight109';
import {pickupItem,useItem,message} from '../../core/inventory.js?v=alehall135';
const approach=(a,b,d)=>a+Math.sign(b-a)*Math.min(Math.abs(b-a),d);
const floor=(x,y,w)=>({x,y,w});
export const freightLevel={name:'THE EMBER FREIGHT',subtitle:'Carry the pressure. Quiet the furnace.',
 story:['The weather loom sends rejected storms to a furnace freight depot. Its inspectors still defend the delivery route.','A service cell can wake the second riser. Above it, a cracked exhaust has sealed the furnace shut.'],
 hint:'Running bashes clear cracked refractory masonry. The watchtower reaches Olaf’s shield. Cut tied return ladders from the galleries. Protect the freight trolley; fit the inspector’s cell into its receiver. Reach the high exhaust ledge from Olaf and clear its blockage.',
 mechanic:'freight',worldWidth:3240,worldTop:80,worldBottom:1140,deathY:1180,
 floors:[floor(0,1080,3240),floor(0,940,550),floor(550,640,490),floor(1340,640,460),floor(1740,360,1500)],
 platforms:[floor(300,860,126),floor(620,840,100),floor(760,740,104),floor(1740,560,100),floor(1800,460,100),floor(2060,200,320)],
 ladders:[{x:340,top:860,bottom:1080},{x:1760,top:560,bottom:640}],exit:{x:3120,y:360,w:160}};
export function setupFreight(s){
 s.campaign='cycle';s.round=7;s.level=freightLevel;s.crate=false;s.turret=false;s.items=[];s.shots=[];
 for(const h of s.heroes)Object.assign(h,{x:100+h.id*55,y:896,vx:0,vy:0,ground:true,support:null});
 s.machine={ventOpen:false,ventPose:0,exhaustOpen:false,exhaustPose:0,cellInstalled:false,insertion:null,secondDraft:0,purge:0,shutter:0,
  rescue:[false,false],rescuePose:[0,0],blocks:0,heatClock:0,safety:false,
  cart:{x:840,y:640,w:256,v:0,direction:1,pause:1.5,support:'freight-cart'},
  inspectors:[{id:0,x:1450,floor:640,left:1370,right:1580,direction:-1,hp:3,age:0,walk:0,phase:'walk',hit:0,deathAge:0},
   {id:1,x:2130,floor:360,left:2060,right:2260,direction:-1,hp:3,age:0,walk:0,phase:'walk',hit:0,deathAge:0}]};
 s.enemies=s.machine.inspectors;s.itemAction=(type,h,slot)=>type==='pressureCell'&&installCell(s,h,slot);
}
function installCell(s,h,slot){const g=s.machine;
 if(g.cellInstalled||g.insertion||Math.abs(h.x-1580)>70||Math.abs(h.y+44-640)>16)return false;
 h.inventory[slot]=null;g.insertion={age:0,from:{x:h.x+h.face*20,y:h.y+14},to:{x:1580,y:600}};message(s,'The pressure cell slides into the service receiver.');return true;
}
export function freightObjects(s){const g=s.machine;return[{id:'freight-receiver',x:1580,y:596,radius:70,title:'SERVICE CELL RECEIVER',reason:'Fit the rectangular pressure cell into this matching socket.',ready:!g.cellInstalled&&!g.insertion&&s.heroes[s.active].inventory.includes('pressureCell'),done:g.cellInstalled,
 run:()=>{const h=s.heroes[s.active],slot=h.inventory.indexOf('pressureCell');if(slot>=0&&installCell(s,h,slot))return s.feedback.message;return 'An inspector’s rectangular pressure cell fits this socket.';}}];}
export const freightSurfaces=s=>[...s.level.floors,...s.level.platforms,s.machine.cart];
function advanceCart(s,dt){const g=s.machine,c=g.cart;if(!g.ventOpen)return;if(c.pause>0){c.pause=Math.max(0,c.pause-dt);return;}
 const before=c.x,target=c.direction>0?1340:840,d=target-c.x;c.v=approach(c.v,Math.sign(d)*Math.min(130,Math.sqrt(360*Math.abs(d))),180*dt);
 const travel=c.v*dt;if(d*travel>=0&&Math.abs(travel)>=Math.abs(d)){c.x=target;c.v=0;c.direction*=-1;c.pause=1.5;}else c.x+=travel;
 for(const h of s.heroes)if(h.support===c.support&&h.ground&&!h.climbing)h.x+=c.x-before;
 for(const i of s.items)if(i.support===c.support)i.x+=c.x-before;
}
function hitInspector(s,e){if(e.hp<=0||e.hit>0)return;e.hp--;e.hit=.16;if(!e.hp){e.phase='wreck';e.deathAge=0;
 if(e.id===0)s.items.push({id:'inspector-pressure-cell',type:'pressureCell',x:e.x,y:e.floor-32,vy:-110,vx:-15,locked:true});}}
function inspectors(s,dt){const g=s.machine;
 for(const e of g.inspectors){e.hit=Math.max(0,e.hit-dt);if(e.hp<=0){e.deathAge+=dt;continue;}e.age+=dt;
  const target=s.heroes.filter(h=>!h.dead&&Math.abs(h.y+44-e.floor)<85&&Math.abs(h.x-e.x)<560).sort((a,b)=>Math.abs(a.x-e.x)-Math.abs(b.x-e.x))[0];
  const dangerous=target&&g.purge<.95&&!g.safety,old=e.phase;
  if(dangerous){e.combatClock=e.hadTarget?(e.combatClock+dt)%2.4:0;}else e.combatClock=0;
  e.hadTarget=!!dangerous;const phase=dangerous?e.combatClock:1.8;
  e.phase=phase<.55?'aim':phase<.7?'fire':phase<1.1?'recover':'walk';
  if(dangerous&&e.phase!=='walk')e.direction=target.x<e.x?-1:1;
  if(e.phase==='walk'){const before=e.x;e.x+=e.direction*45*dt;if(e.x<=e.left||e.x>=e.right){e.x=Math.max(e.left,Math.min(e.right,e.x));e.direction*=-1;}e.walk+=Math.abs(e.x-before);}
  if(e.phase==='fire'&&old!=='fire')s.shots.push({x:e.x+e.direction*28,y:e.floor-24,v:e.direction*280,enemy:true,kind:'fire',life:4});
 }
}
function items(s,dt){for(const i of s.items)if(i.type==='pressureCell'){
 const prev=i.y;i.vy=(i.vy||0)+600*dt;i.y+=i.vy*dt;i.x=Math.max(20,Math.min(3220,i.x+(i.vx||0)*dt));
 for(const p of freightSurfaces(s))if(i.x+8>p.x&&i.x-8<p.x+p.w&&prev+12<=p.y+2&&i.y+12>=p.y&&i.vy>=0){i.y=p.y-12;i.vy=0;i.vx=0;i.locked=false;i.support=p.support||null;}
}}
function shots(s,dt){const g=s.machine,o=s.heroes[2];
 for(const p of s.shots){const before=p.x;p.x+=p.v*dt;p.life=(p.life??4)-dt;
  if(!p.enemy){for(const e of g.inspectors)if(e.hp>0&&segmentHit(before,p.y,p.x,p.y,{x:e.x-24,y:e.floor-44,w:48,h:36})){p.dead=true;hitInspector(s,e);break;}}
  else{const block=shieldHit(o,p,before,p.y),body=s.heroes.map(h=>({h,hit:h.dead?null:segmentHit(before,p.y,p.x,p.y,{x:h.x-16,y:h.y,w:32,h:44})})).filter(x=>x.hit).sort((a,b)=>a.hit.t-b.hit.t)[0];
   if(block&&(!body||block.t<=body.hit.t)){p.dead=true;g.blocks++;g.blockAt=s.time;}
   else if(body){p.dead=true;if(!g.safety&&damage(s,body.h,1))body.h.vy=-70;}
  }
  if(g.shutter<1&&segmentHit(before,p.y,p.x,p.y,{x:2658,y:264,w:64,h:96-g.shutter*100}))p.dead=true;
 }
 s.shots=s.shots.filter(p=>!p.dead&&p.life>0&&p.x>0&&p.x<3240);
}
function fireSources(s,dt){const g=s.machine;if(!g.cellInstalled)return;const before=g.heatClock;g.heatClock+=dt;if(g.purge>.95||g.safety)return;
 for(const [n,x]of [2440,2530].entries()){const phase=(g.heatClock+n*1.2)%5.8,old=(before+n*1.2)%5.8;
  for(const at of [.55,.8,1.05])if(phase>=at&&old<at)s.shots.push({x:x-24,y:336,v:-240,enemy:true,kind:'fire',life:5});
 }
}
export function freightStep(s,input,dt){const g=s.machine,a=s.heroes[s.active];s.time+=dt;s.cooldown=Math.max(0,s.cooldown-dt);
 for(const h of s.heroes){h.swing=Math.max(0,(h.swing||0)-dt);h.bow=Math.max(0,(h.bow||0)-dt);}
 prepareMotion(s,input,dt);startBash(s,dt);
 if(a.id===0&&a.bash>.12)for(const [x,y,key]of [[480,940,'ventOpen'],[2300,200,'exhaustOpen']])if(!g[key]&&(x-a.x)*a.face>=-8&&Math.abs(a.x-x)<70&&Math.abs(a.y+44-y)<10){g[key]=true;bashImpact(s,x,y-35);message(s,key==='ventOpen'?'Steam reaches the service riser.':'The cracked exhaust opens. The furnace begins to purge.');}
 if(a.id===1&&input.sword&&s.cooldown===0){a.swing=.24;s.cooldown=.3;
  for(const e of g.inspectors)if((e.x-a.x)*a.face>=0&&Math.abs(e.x-a.x)<85&&Math.abs(a.y+44-e.floor)<40)hitInspector(s,e);
  for(const [n,x,y]of [[0,620,640],[1,1840,360]])if(!g.rescue[n]&&(x-a.x)*a.face>=-8&&Math.abs(a.x-x)<80&&Math.abs(a.y+44-y)<25){g.rescue[n]=true;message(s,'The tied return ladder unrolls into the recovery gallery.');}
 }
 if(a.id===1&&input.action&&s.cooldown===0){a.bow=.28;s.cooldown=.35;s.shots.push({kind:'arrow',x:a.x+a.face*25,y:a.y+20,v:a.face*580,life:4});}
 if(input.interact&&!pickupItem(s)){const object=freightObjects(s).find(o=>Math.abs(a.x-o.x)<o.radius&&Math.abs(a.y-o.y)<60);if(object)message(s,object.run());}
 if(input.item)useItem(s);
 g.ventPose=approach(g.ventPose,g.ventOpen?1:0,dt/.5);g.exhaustPose=approach(g.exhaustPose,g.exhaustOpen?1:0,dt/.5);
 if(g.insertion){g.insertion.age=Math.min(.6,g.insertion.age+dt);if(g.insertion.age===.6)g.cellInstalled=true;}
 g.secondDraft=approach(g.secondDraft,g.cellInstalled?1:0,dt);g.purge=approach(g.purge,g.exhaustOpen?1:0,dt/2);g.shutter=approach(g.shutter,g.purge>.95?1:0,dt/.8);
 for(let n=0;n<2;n++)g.rescuePose[n]=approach(g.rescuePose[n],g.rescue[n]?1:0,dt/.9);
 s.level={...freightLevel,ladders:[...freightLevel.ladders,...g.rescuePose.flatMap((p,n)=>p>0?[{x:[900,1880][n],top:[640,360][n],bottom:[640,360][n]+(1080-[640,360][n])*p}]:[])]};
 advanceCart(s,dt);const climbs=[];
 for(const h of s.heroes){const ladder=ladderAtHero(s.level,h),active=h.id===s.active;
  if(active){if((input.up||input.down)&&ladder)h.climbing=true;if(input.left||input.right||input.jump)h.climbing=false;}
  if(h.climbing&&ladder){const dir=active?Number(!!input.down)-Number(!!input.up):0;climbs.push({h,x:ladder.x,y:Math.max(ladder.top-44,Math.min(ladder.bottom-44,h.y+dir*150*dt))});h.moveX=0;h.vy=-1250*dt;continue;}
  if(h.id===2&&h.shieldUp)for(const [x,target,enabled,bottom]of [[480,490,g.ventPose,940],[1660,215,g.secondDraft,640]])if(enabled>.05&&Math.abs(h.x-x)<48&&h.y+44>target&&h.y-36<bottom){
   const accel=Math.max(-800,Math.min(800,16*(target-h.y)-7*h.vy));h.vy=Math.max(-145,Math.min(145,h.vy+accel*enabled*dt))-1250*dt;h.ground=false;
  }
 }
 integrateMotion(s,freightSurfaces(s),[{x:464,w:32,top:860,bottom:940,on:!g.ventOpen},{x:2284,w:32,top:120,bottom:200,on:!g.exhaustOpen},{x:2658,w:64,top:264,bottom:360-g.shutter*100,on:g.shutter<1}],dt);
 for(const {h,x,y}of climbs){h.x=x;h.y=y;h.vy=0;h.ground=true;h.support='ladder';h.climbMoving=h.id===s.active&&(input.up||input.down);}
 inspectors(s,dt);fireSources(s,dt);shots(s,dt);items(s,dt);
 for(const e of g.inspectors)if(e.hp>0&&g.purge<.95&&!g.safety)for(const h of s.heroes)if(Math.abs(h.x-e.x)<32&&Math.abs(h.y+44-e.floor)<40){
  if(h.id===2&&!h.shieldUp&&(e.x-h.x)*h.face>=0)e.x=Math.max(e.left,Math.min(e.right,e.x+h.face*30*dt));
  else if(damage(s,h,1))h.vy=-100;
 }
 s.power=g.shutter===1;s.won=!s.failed&&s.power&&s.heroes.every(h=>Math.abs(h.x-3120)<75&&Math.abs(h.y+44-360)<4);
}
