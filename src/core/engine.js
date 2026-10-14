import {setupCycle,cycleStep} from '../campaigns/machines/cycle-campaign.js?v=momentum72';
import {storyLevels,setupStory,storyStep} from '../campaigns/story/story-campaign.js?v=vikings70';
import {setupVerticalLevel,verticalStep} from '../campaigns/arcade/vertical-campaign.js?v=vikings70';
import {startBash,bashImpact} from './bash.js?v=arc46';
import {shieldControls,shieldHit,segmentHit} from './projectile-collision.js?v=arc46';
import {useInteraction} from './interactions.js?v=momentum68';
import {prepareMotion,integrateMotion} from './movement.js?v=vikings70';
import {levels} from '../campaigns/arcade/levels.js?v=arc46';
import {campaignStep} from '../campaigns/arcade/campaign.js?v=vikings70';
import {damage} from './health.js?v=arc46';
import {pickupItem,useItem} from './inventory.js?v=arc46';
import {inventoryStep,setupInventoryLevel} from '../campaigns/arcade/inventory-campaign.js?v=vikings70';
export const W=1440,H=650;
export function createState(round=0,campaign='arcade'){const state={campaign,round,level:levels[round]||levels[0],key:false,relay:false,heroes:[{id:0,x:100,y:560,vx:0,vy:0,face:1,ground:false,hp:3},{id:1,x:155,y:560,vx:0,vy:0,face:1,ground:false,hp:3},{id:2,x:210,y:560,vx:0,vy:0,face:1,ground:false,hp:3,shield:true,shieldUp:false,shieldPose:.4}],active:0,crate:round===0,fuse:false,power:false,latch:false,turret:true,bridge:false,won:false,time:0,machine:{charge:0,charged:false,liftY:610,liftDir:-1,liftPause:2,liftOn:false,hatch:false,lane:0,score:0,bell:false,mirrorTime:0,mirror:false,seal:false,brake:false,cartX:620,parked:false,signal:false,ore:false,air:0,heat:0,lastPump:-1},shots:[],cooldown:0,hurt:0,failed:false,items:[],bombs:[],itemSerial:0};for(const h of state.heroes){h.inventory=[null,null,null,null];h.itemSlot=0;h.invulnerable=0;}if(campaign==='cycle'){setupCycle(state);return state;}if(campaign==='story'){setupStory(state);return state;}if(round<9)setupInventoryLevel(state);else setupVerticalLevel(state);if(round<6)state.items.push({id:'apple',type:'apple',x:180,y:566},{id:'meat',type:'meat',x:1080,y:566});return state;}
export const platforms=[{x:245,y:490,w:130},{x:390,y:390,w:125},{x:535,y:290,w:125},{x:590,y:190,w:170}];
export function step(s,input,dt){
 if(s.won||s.failed)return; dt=Math.min(dt,.033);for(const h of s.heroes){h.invulnerable=Math.max(0,(h.invulnerable||0)-dt);h.hurt=Math.max(0,(h.hurt||0)-dt);}
 if(s.active===2)shieldControls(s.heroes[2],input);if(s.campaign==='cycle'){cycleStep(s,input,dt);return;}if(s.campaign==='story'){storyStep(s,input,dt);return;}if(s.round>=9){verticalStep(s,input,dt);return;}if(s.round>=6){inventoryStep(s,input,dt);return;}if(input.item)useItem(s);if(input.interact&&pickupItem(s))input={...input,interact:false};
 const overhead=s.heroes[2];if(s.active===2)shieldControls(overhead,input);
 if(s.round>0){campaignStep(s,input,dt);if(input.interact)useInteraction(s);return;}s.time+=dt;s.cooldown=Math.max(0,s.cooldown-dt);s.hurt=Math.max(0,s.hurt-dt);
 for(const h of s.heroes)h.swing=Math.max(0,(h.swing||0)-dt);
 prepareMotion(s,input,dt);const a=s.heroes[s.active];
 const melee=(targetX,targetY)=> (targetX-a.x)*a.face>0&&Math.abs(targetX-a.x)<85&&Math.abs(targetY-a.y)<60;
 startBash(s,dt);
 if(a.id===0&&a.bash>0&&s.crate&&(455-a.x)*a.face>0&&Math.abs(a.x-455)<60&&a.y>500){s.crate=false;bashImpact(s,455,566);}
 if(input.sword&&a.id===1&&s.cooldown===0){s.cooldown=.3;a.swing=.24;if(s.crate&&melee(455,566))s.crate=false;const o=s.heroes[2];if(s.turret&&melee(1200,566)&&o.shield&&!o.shieldUp&&o.face===1&&o.x<1180&&Math.abs(o.y+20-586)<26)s.turret=false;}
 if(input.action&&a.id===1&&s.cooldown===0){s.cooldown=.35;if(a.id===1){if(s.crate&&melee(455,566)){s.crate=false;a.swing=.24;}a.bow=.28;s.shots.push({x:a.x+a.face*25,y:a.y+20,v:a.face*580,kind:'arrow'});}}
 if(!s.fuse&&a.id===0&&Math.abs(a.x-675)<45&&Math.abs(a.y-148)<55)s.fuse=true;
 if(input.interact)useInteraction(s);
 s.bridge=false;
 const floors=[{x:0,y:610,w:1440},...platforms];
 integrateMotion(s,floors,[{x:440,w:34,on:s.crate},{x:650,w:22,on:!s.power}],dt,true);
 if(s.turret&&s.power&&Math.floor((s.time-dt)/1.6)!==Math.floor(s.time/1.6))s.shots.push({x:1190,y:588,v:-280,kind:'bolt'});
 const olaf=s.heroes[2];s.grounded=olaf.shield&&!olaf.shieldUp&&olaf.face===1&&olaf.x<1180&&Math.abs(olaf.y+20-586)<26;
 for(const p of s.shots){
  const px=p.x,py=p.y;p.x+=p.v*dt;p.y+=(p.vy||0)*dt;
  const solids=[...(s.crate?[{x:440,y:510,w:34,h:100}]:[]),...(!s.power?[{x:650,y:510,w:22,h:100}]:[])];
  const solid=solids.map(box=>segmentHit(px,py,p.x,p.y,box)).filter(Boolean).sort((a,b)=>a.t-b.t)[0];
  const shield=['bolt','drop','arrow'].includes(p.kind)?shieldHit(olaf,p,px,py):null;
  const body=p.kind==='bolt'?s.heroes.map(h=>({h,hit:segmentHit(px,py,p.x,p.y,{x:h.x-16,y:h.y,w:32,h:44})})).filter(e=>e.hit).sort((a,b)=>a.hit.t-b.hit.t)[0]:null;
  const obstacleTime=Math.min(solid?.t??Infinity,shield?.t??Infinity);
  if(body&&body.hit.t<obstacleTime){const h=body.h;p.dead=true;if(damage(s,h,1))h.x=Math.max(20,h.x-35);continue;}
  if(solid||shield){p.dead=true;continue;}
  if(p.kind==='arrow'&&s.turret&&segmentHit(px,py,p.x,p.y,{x:1180,y:550,w:40,h:60})){if(s.grounded)s.turret=false;p.dead=true;}

 }
 s.shots=s.shots.filter(p=>!p.dead&&p.x>0&&p.x<W&&p.y<655);
 s.won=!s.failed&&s.power&&!s.turret&&s.heroes.every(h=>h.x>1290&&h.y>490&&h.y<610);
}
