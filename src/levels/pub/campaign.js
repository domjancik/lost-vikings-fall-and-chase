import {createCupFactory,stepCupFactory} from './cup-factory.js?v=pub139';
import {invitePractice,startCupPractice,bashPractice,cupPracticeStep} from './tutorial.js?v=pub138';
import {prepareMotion,integrateMotion} from '../../core/movement.js';
import {pickupItem,useItem,message} from '../../core/inventory.js?v=alehall135';
import {segmentHit} from '../../core/projectile-collision.js';
const approach=(a,b,d)=>a+Math.sign(b-a)*Math.min(Math.abs(b-a),d);
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
const floor=(x,y,w)=>({x,y,w});
export const alehallBerthSteps=[floor(720,748,24),floor(744,734,24),floor(768,720,24),floor(888,720,24),floor(912,734,24),floor(936,748,24)];
export const alehallLevel={name:'THE FAMILIAR HEARTH',subtitle:'A place at the table. Something in the back room.',mechanic:'alehall',worldWidth:2400,worldTop:250,worldBottom:1250,deathY:4000,
 story:['Astrid has kept their places by the hearth. Rain has brought the fishing boats home early.','One of the crews brought something ashore that nobody remembers making.'],
 hint:'Olaf can push the cask sledge with his shield forward. Erik can jump from Olaf’s raised shield to the loft key. The key opens Astrid’s back room. Raise Olaf’s shield to carry ale; Baleog can practise in the yard or cut the delivery lashing. Bring everyone into the dim room to inspect the globe.',
 floors:[floor(0,760,2400)],platforms:[floor(640,610,260)],ladders:[],exit:{x:2120,y:760,w:240}};
const emit=(s,name,x)=>{const g=s.machine;g.events.push({name,x,id:g.eventSerial++});if(g.events.length>24)g.events.shift();};
export function say(s,speaker,text,x,seconds=4){s.machine.dialogue={speaker,text,x,until:s.time+seconds};}
export function setupAlehall(s){
 s.campaign='cycle';s.round=11;s.level=alehallLevel;s.crate=false;s.turret=false;s.enemies=[];s.shots=[];s.items=[{id:'hall-key',type:'hallKey',x:730,y:566}];
 for(const h of s.heroes)Object.assign(h,{x:[620,690,1100][h.id],y:716,ground:true,vx:0,vy:0,support:null,rotation:0,boots:false,magnet:null});
 Object.assign(s.heroes[2],{face:-1,shield:true,shieldUp:false});
 s.machine={phase:'play',factory:createCupFactory(),invitations:{},bashHit:false,bashAt:-10,bashPose:0,defense:{phase:'idle',at:0},defenseBlocks:0,cart:{x:1020,y:706,w:96,parked:false},door:{open:false,pose:0},cups:{mode:'empty',at:0},served:false,targetHit:false,targetPose:0,wrapCut:false,wrapPose:0,inspectClock:0,crackTime:0,fallTime:0,bend:0,events:[],eventSerial:0,dialogue:{speaker:'ASTRID',text:'You know where the cask belongs, Olaf. Your places are still warm.',x:1040,until:6}};
 s.itemAction=(type,h,slot)=>{if(type!=='hallKey'||Math.abs(h.x-1730)>85||Math.abs(h.y-716)>50)return false;s.machine.door.open=true;h.inventory[slot]=null;emit(s,'door',1730);say(s,'ASTRID','The fishers left their find in the back. All three of you should see it.',1730,5);return true;};
}
export function alehallObjects(s){const g=s.machine;return[
 {id:'ale',x:1040,y:716,radius:65,title:'ASTRID / ALE',ready:true,run:()=>{const o=s.heroes[s.active];if(o.id===2&&o.shieldUp&&!['loading','carried','serving'].includes(g.cups.mode)&&!g.served){g.cups={mode:'loading',at:s.time};emit(s,'pour',1040);say(s,'ASTRID','Steady now. Three cups for the usual table.',1040);}else say(s,'ASTRID',g.served?'They were asking after you. Sit with them a while.':'Raise your shield, Olaf. I will put the cups on it.',1040);return 'Astrid looks up from the ale jug.';}},
 {id:'serve',x:1390,y:716,radius:70,title:g.served?'HAKON / SHIELD PRACTICE':'THE USUAL TABLE',ready:true,run:()=>{if(s.active===2&&g.cups.mode==='carried'){g.cups={mode:'serving',at:s.time,from:{x:s.heroes[2].x,y:s.heroes[2].y}};emit(s,'pour',1390);say(s,'HAKON','There you are. We thought the rain had washed you away.',1390);}else if(s.active===2&&g.served)startCupPractice(s,say,emit);else say(s,'HAKON','Same seats. Same rain. Better company tonight.',1390);return 'A place has been kept for you.';}},
 {id:'hall-door',x:1730,y:716,radius:75,title:'ASTRID’S STOREROOM',ready:!g.door.open,done:g.door.open,run:()=>{const h=s.heroes[s.active],slot=h.inventory.indexOf('hallKey');if(slot>=0)s.itemAction('hallKey',h,slot);else say(s,'ASTRID','My iron key is up on the loft, above the bedding.',1730);return g.door.open?'The old door swings inward.':'Astrid’s storeroom is locked.';}},
 {id:'fisher',x:1620,y:716,radius:60,title:'RUNA / THE FIND',ready:true,run:()=>{say(s,'RUNA','We hauled it up in the net. Those little arms kept working all the way ashore.',1620,6);return 'Runa lowers her voice.';}},
 {id:'yard',x:390,y:716,radius:55,title:'PRACTICE YARD',ready:true,run:()=>{say(s,'HAKON',g.targetHit?'Still a steady hand, Baleog.':'The yard is clear, Baleog. Put one into the straw.',390);return 'A familiar challenge.';}},
 {id:'delivery',x:1230,y:716,radius:60,title:'LASHED DELIVERY',ready:true,done:g.wrapCut,run:()=>{say(s,'ASTRID',g.wrapCut?'I will put the clean cups away.':'Cut that lashing for me, Baleog. It is tied hard against the packing board.',1230);return 'A close binding, backed by solid wood.';}}
 ];}
export function alehallSag(s,x){return s.machine.bend*Math.max(0,Math.sin((x-1990)/270*Math.PI));}
export function alehallSurfaces(s){const g=s.machine;if(g.phase==='fall')return [floor(0,760,1990),floor(2260,760,140),...s.level.platforms];
 if(g.phase==='crack')return [floor(0,760,1990),...Array.from({length:9},(_,i)=>floor(1990+i*30,760+alehallSag(s,2005+i*30),30)),floor(2260,760,140),...s.level.platforms];
 return [...s.level.floors,...s.level.platforms,...alehallBerthSteps,{...g.cart,x:g.cart.x-48,support:'hall-cart'}];}
function pushCart(s,dt){const g=s.machine,o=s.heroes[2],p=g.cart,dir=Math.sign(o.moveX),old=p.x;
 if(s.active===2&&dir&&o.shield&&!o.shieldUp&&o.face===dir&&Math.abs(o.y-716)<45){const edge=p.x-dir*p.w/2,gap=(edge-o.x-dir*32)*dir;
  if(gap>=-5&&gap<=Math.abs(o.moveX)+3){let next=Math.max(840,Math.min(1080,p.x+o.moveX));const blocked=s.heroes.some(h=>h!==o&&h.support!=='hall-cart'&&Math.abs(h.y-716)<10&&h.x+16>next-48&&h.x-16<next+48);if(!blocked)p.x=next;o.x=p.x-dir*(48+32);o.moveX=0;g.pushing=p.x!==old;}}
 for(const h of s.heroes)if(h.support==='hall-cart')h.x+=p.x-old;
 if(p.x===840&&!p.parked){p.parked=true;emit(s,'park',p.x);say(s,'ASTRID','That clears the aisle. Thank you.',1040);}
}
function cups(s){const g=s.machine,c=g.cups,o=s.heroes[2];
 if(['loading','carried'].includes(c.mode)&&!o.shieldUp){g.cups={mode:'spilled',at:s.time};emit(s,'spill',o.x);say(s,'ASTRID','Only ale. Come back and I will fill them again.',1040);}
 else if(c.mode==='loading'&&s.time-c.at>=.9)g.cups={mode:'carried',at:s.time};
 else if(c.mode==='serving'&&s.time-c.at>=.8){g.cups={mode:'served',at:s.time};g.served=true;emit(s,'served',1390);}
}
function scriptWalk(h,target,dt){const error=target-h.x,dir=Math.abs(error)>2?Math.sign(error):0,before=h.vx;h.vx=approach(before,dir*Math.min(105,Math.sqrt(2*900*Math.abs(error))),900*dt);h.moveX=(before+h.vx)*.5*dt;if(dir)h.face=dir;h.swing=0;h.bow=0;}
function cinematic(s,dt){const g=s.machine,velocities=s.heroes.map(h=>h.vx);prepareMotion(s,{},dt);if(g.phase==='inspect')for(const h of s.heroes)h.vx=velocities[h.id];
 if(g.phase==='inspect'){
  const ready=[0,1].every(id=>Math.abs(s.heroes[id].x-[2048,2186][id])<5);
  if(ready)g.inspectClock+=dt;
  scriptWalk(s.heroes[0],2048,dt);scriptWalk(s.heroes[1],2186,dt);scriptWalk(s.heroes[2],g.inspectClock>3?2114:1880,dt);
  for(const h of s.heroes)if(Math.abs(h.vx)<5&&h.x>2000)h.face=h.x<2120?1:-1;
  if(ready&&g.inspectClock<1.7)say(s,'ERIK','It made another one.',2120,.1);
  else if(ready&&g.inspectClock<3.3)say(s,'BALEOG','There is no seam in the glass.',2120,.1);
  else if(g.inspectClock>3.3)say(s,'OLAF','Let me see.',2120,.1);
  if(g.inspectClock>3&&s.heroes[2].x>2080){g.phase='crack';g.crackTime=0;emit(s,'creak',2120);say(s,'RUNA','Back! The boards—',2120,3);}
 }else if(g.phase==='crack'){g.crackTime+=dt;g.bend=smooth(g.crackTime/1.7)*18;scriptWalk(s.heroes[2],2114,dt);if(g.crackTime>=1.7){g.phase='fall';g.fallTime=0;emit(s,'collapse',2120);for(const h of s.heroes){h.ground=false;h.vy=40;h.moveX=0;}}}
 else g.fallTime+=dt;
 integrateMotion(s,alehallSurfaces(s),[],dt);s.won=g.phase==='fall'&&s.heroes.every(h=>h.y+44>1070);
}
export function alehallCamera(s,fallback){if(s.level.mechanic!=='alehall'||s.machine.phase==='play')return fallback;return {x:2120,y:s.heroes.reduce((n,h)=>n+h.y,0)/3,vx:0,vy:0};}
export function alehallStep(s,input,dt){const g=s.machine,a=s.heroes[s.active];s.time+=dt;s.cooldown=Math.max(0,s.cooldown-dt);
 if(stepCupFactory(s,dt))emit(s,'cupLand',2324);
 if(g.phase!=='play'){cinematic(s,dt);return;}
 for(const h of s.heroes)h.swing=Math.max(0,(h.swing||0)-dt);
 prepareMotion(s,input,dt);bashPractice(s,dt,say,emit);g.pushing=false;pushCart(s,dt);
 if(input.item)useItem(s);
 if(input.interact&&!pickupItem(s)){const obj=alehallObjects(s).find(o=>Math.abs(a.x-o.x)<o.radius&&Math.abs(a.y-o.y)<60);if(obj)message(s,obj.run());}
 if(a.id===1&&input.sword&&s.cooldown===0){a.swing=.25;s.cooldown=.32;if(!g.wrapCut&&(1230-a.x)*a.face>=0&&Math.abs(a.x-1230)<85&&Math.abs(a.y-716)<20){g.wrapCut=true;emit(s,'cut',1230);say(s,'ASTRID','Good. The clean cups can dry by the hearth.',1230);}}
 if(a.id===1&&input.action&&s.cooldown===0){a.bow=.28;s.cooldown=.35;s.shots.push({kind:'arrow',x:a.x+a.face*25,y:a.y+20,v:a.face*580,life:3});}
 for(const p of s.shots){if(p.kind!=='arrow')continue;const old=p.x;p.x+=p.v*dt;p.life-=dt;if(segmentHit(old,p.y,p.x,p.y,{x:144,y:700,w:40,h:50})){p.dead=true;g.targetHit=true;g.targetPose=1;emit(s,'target',164);say(s,'HAKON','A steady hand. Some things have not changed.',390);}if(p.x<120||p.x>1700)p.dead=true;}s.shots=s.shots.filter(p=>!p.dead&&p.life>0);
 g.targetPose=Math.max(0,g.targetPose-dt*2);g.wrapPose=approach(g.wrapPose,g.wrapCut?1:0,dt/.8);g.door.pose=approach(g.door.pose,g.door.open?1:0,dt/.9);cups(s);
 // The solid loading berth has small physical treads, also visible in render.
 for(const h of s.heroes)if(h.ground&&h.moveX){const next=h.x+h.moveX,steps=alehallSurfaces(s).filter(p=>next+17>p.x&&next-17<p.x+p.w&&h.y+44>p.y&&h.y+44-p.y<=16).sort((a,b)=>a.y-b.y);if(steps[0]){h.y=steps[0].y-44;h.moveX=Math.sign(h.moveX)*Math.max(1.1,Math.abs(h.moveX));}}
 integrateMotion(s,alehallSurfaces(s),[{x:g.cart.x-48,w:96,on:true,top:g.cart.y,bottom:760},{x:1708,w:72,on:g.door.pose<1,top:662,bottom:760}],dt);
 cupPracticeStep(s,dt,say,emit);invitePractice(s,say);
 for(const item of s.items){const support=alehallSurfaces(s).filter(p=>item.x>=p.x&&item.x<=p.x+p.w&&p.y>=item.y+44-1).sort((a,b)=>a.y-b.y)[0];item.vy=(item.vy||0)+1250*dt;item.y+=item.vy*dt;if(support&&item.y+44>=support.y){item.y=support.y-44;item.vy=0;}}
 if(g.door.pose===1&&s.heroes.every(h=>h.x>1820&&h.y+44>735&&h.y+44<775)){g.phase='inspect';g.inspectClock=0;Object.assign(s.heroes[2],{shieldUp:false,shield:true});if(['carried','loading'].includes(g.cups.mode))g.cups={mode:'spilled',at:s.time};emit(s,'inspect',2120);}
}

export function alehallViewport(s,view){if(s.level.mechanic!=='alehall'||s.machine.phase==='play'||view.width>=560)return view;return {...view,width:560,height:Math.round(view.height*560/view.width)};}
