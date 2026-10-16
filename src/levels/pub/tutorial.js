import {startBash,bashImpact} from '../../core/bash.js';
import {segmentHit,shieldHit} from '../../core/projectile-collision.js';

export function invitePractice(s,say){
 const g=s.machine,h=s.heroes[s.active];
 // A first invitation belongs to the hero entering its area. Do not lose it
 // behind an unrelated greeting while that hero walks past the opportunity.
 const offers=[
  ['loft',h.id===0&&g.cart.parked&&h.x>650&&h.x<1100,'ASTRID','Erik, fetch my loft key. Jump onto Olaf’s raised shield, then up to the loft.',Math.min(h.x,1040)],
  ['dash',h.id===0&&h.x<480&&!g.bashHit,'HAKON','Erik! Take a run at the straw butt. Let us see that head-bash again!',390],
  ['blade',h.id===1&&h.x>1090&&h.x<1320&&!g.wrapCut,'ASTRID','Baleog, cut the rope lashing on that delivery with your sword, will you?',1230],
  ['bow',h.id===1&&h.x>320&&h.x<1100&&!g.targetHit,'TORSTEN','Baleog! Still land an arrow in the straw? The practice butt is outside.',Math.min(960,h.x+100)],
  ['defense',h.id===2&&g.served&&h.x>1250&&h.x<1500&&!g.defenseBlocks,'HAKON','One empty cup, Olaf! Face me with your shield forward. Ask when you’re ready.',1460]
 ];
 for(const [id,ready,speaker,text,x] of offers)if(ready&&!g.invitations[id]){g.invitations[id]=true;say(s,speaker,text,x,5);return;}
}
export function startCupPractice(s,say,emit){
 const g=s.machine;if(['windup','flight'].includes(g.defense.phase))return;
 g.defense={phase:'windup',at:s.time};emit(s,'cupReady',1460);
 say(s,'HAKON','Shield towards me, Olaf. Here it comes!',1460,2.5);
}
export function bashPractice(s,dt,say,emit){
 const g=s.machine,h=s.heroes[0];startBash(s,dt);
 if(s.active===0&&h.bash>0&&h.face===-1&&h.ground&&segmentHit(h.x-28,h.y+14,h.x-28+h.moveX,h.y+14,{x:144,y:700,w:52,h:50})){
  h.x=Math.max(224,h.x);h.moveX=0;h.vx=0;h.bash=0;g.bashHit=true;g.bashAt=s.time;
  bashImpact(s,190,730);emit(s,'target',164);say(s,'HAKON','Still harder than a ship’s prow! Glad that was only straw.',390,4);
 }
 const age=s.time-g.bashAt,t=Math.max(0,Math.min(1,age<.16?age/.16:1-(age-.16)/.85));g.bashPose=t*t*(3-2*t);
}
export function cupPracticeStep(s,dt,say,emit){
 const g=s.machine,d=g.defense;
 if(d.phase==='windup'&&s.time-d.at>=1.2){d.phase='flight';d.at=s.time;s.shots.push({kind:'hall-cup',x:1460,y:726,v:-240,vy:-35,spin:0,life:3});emit(s,'cupThrow',1460);}
 for(const p of s.shots){if(p.kind!=='hall-cup'||p.dead)continue;
  const px=p.x,py=p.y;p.prevX=px;p.prevY=py;p.vy+=180*dt;p.x+=p.v*dt;p.y+=p.vy*dt;p.spin+=dt*8;p.life-=dt;
  if(!p.bounced){
   const shield=shieldHit(s.heroes[2],p,px,py);
   const body=s.heroes.map(h=>({h,hit:segmentHit(px,py,p.x,p.y,{x:h.x-16,y:h.y,w:32,h:44})})).filter(x=>x.hit).sort((a,b)=>a.hit.t-b.hit.t)[0];
   if(shield&&shield.t<=(body?.hit.t??Infinity)){
    p.x=shield.x;p.y=shield.y;p.v=90;p.vy=-115;p.bounced=true;d.phase='blocked';d.at=s.time;g.defenseBlocks++;emit(s,'cupBlock',p.x);
    say(s,'HAKON','Not a drop on you! That shield still earns its keep.',1460,4);
   }else if(body){p.bounced=true;p.v*=.2;p.vy=-60;body.h.hurt=.2;d.phase='missed';say(s,'HAKON','Only an empty cup. Face me and try your front shield. Ready for another?',1460,4);}
  }
  if(p.y>=754){p.y=754;p.dead=true;if(d.phase==='flight'&&!p.bounced){d.phase='missed';say(s,'HAKON','Gone past! Ask me for another when your shield is ready.',1460,4);}emit(s,'cupLand',p.x);}
 }
}
