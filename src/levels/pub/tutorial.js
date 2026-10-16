import {startBash,bashImpact} from '../../core/bash.js';
import {segmentHit,shieldHit} from '../../core/projectile-collision.js';
import {ALEHALL_DELIVERY_X} from './layout.js?v=pub147';

export function invitePractice(s,say){
 const g=s.machine,h=s.heroes[s.active],key=s.heroes.some(a=>a.inventory.includes('hallKey'))||g.door.open||!s.items.some(a=>a.id==='hall-key');
 const offers=[
 ['push',h.id===2&&!g.cart.parked&&h.x>650&&h.x<1200,'ASTRID',1040,[
  'Olaf, push that cask left, beneath the loft. The aisle needs clearing.',
  'Keep your shield in front and lean into the cask, Olaf.',
  'Olaf: {alt} lowers your shield. Hold {left} against the cask to push it.']],
 ['ale',h.id===2&&g.cart.parked&&!g.served&&!['loading','carried','serving'].includes(g.cups.mode)&&Math.abs(h.x-1040)<240,'ASTRID',1040,[
  'Raise your shield, Olaf. These three ales go to your usual table.',
  'Hold the shield above your head, then ask me for the ale.',
  'Press {primary} for shield up, then {use} beside me to load the cups. Keep it raised.']],
 ['serve',h.id===2&&g.cups.mode==='carried'&&!g.served,'HAKON',1460,[
  'Over here, Olaf. Our usual table is still waiting for its ale.',
  'Bring those cups to the table between us.',
  'Carry the cups to our table, then press {use} to serve them.']],
 ['loft',h.id===0&&g.cart.parked&&!key&&h.x>650&&h.x<1100,'ASTRID',1040,[
  'Erik, fetch my loft key. Jump onto Olaf’s raised shield, then up to the loft.',
  'Ask Olaf to stand beside the loft with his shield overhead. Use it as a step.',
  'Select {olaf}, press {primary} to raise his shield. Select Erik, jump with {primary} onto it, then to the loft. {use} takes the key.']],
 ['dash',h.id===0&&h.x<620&&!g.bashHit,'TORSTEN',440,[
  'Erik! Take a run at the straw butt. Let us see that head-bash again!',
  'Get a little speed first, then charge the straw head-first.',
  'Run left towards the straw and press {alt} while moving to head-bash it.']],
 ['blade',h.id===1&&Math.abs(h.x-ALEHALL_DELIVERY_X)<140&&!g.wrapCut,'ASTRID',1040,[
  'Baleog, cut the rope lashing on that delivery with your sword, will you?',
  'The cups on that stand need to dry by the hearth. Cut their lashing.',
  'Face the lashed packing stand beside the hearth. Press {primary} to swing your sword.']],
 ['bow',h.id===1&&h.x>260&&h.x<800&&!g.targetHit,'TORSTEN',440,[
  'Baleog! Still land an arrow in the straw? The practice butt is outside.',
  'Face the straw target to your left. Show us a clean bow shot.',
  'Face left towards the straw. Press {alt} to shoot your bow.']],
 ['defense',h.id===2&&g.served&&h.x>1250&&h.x<1500&&!g.defenseBlocks,'HAKON',1460,[
  'One empty cup, Olaf! Face me with your shield forward. Ask when you’re ready.',
  'I will toss an empty cup. Keep your shield between us, Olaf.',
  'Face right. Press {alt} for shield forward, then {use} at our table to ask for a throw.']],
 ['door',key&&!g.door.open&&h.inventory.includes('hallKey')&&h.x>1420,'RUNA',1620,[
  'That key fits Astrid’s storeroom. The find is inside.',
  'Try the key at the door beyond me.',
  'Stand beside the storeroom door and press {use} to unlock it.']],
 ['find',g.door.open&&h.x>1420,'RUNA',1620,[
  'I left it on the stool. I couldn’t bring myself to throw it back.',
  'It kept making cups, even under a cloth.',
  'Ask the others what they make of it. I’ve run out of guesses.']]
 ];
 for(const [id,ready,speaker,x,lines]of offers){
  if(!ready||Math.abs(h.x-x)>360)continue;
  const old=g.invitations[id],count=old?.count||0,last=old?.last??-100;
  if(s.time-last<14)continue;
  if(g.dialogue?.kind==='reaction'&&s.time<g.dialogue.until)continue;
  g.invitations[id]={count:count+1,last:s.time};say(s,speaker,lines[Math.min(count,2)],x,6,'invitation');return;
 }
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
  bashImpact(s,190,730);emit(s,'target',164);say(s,'TORSTEN','Still harder than a ship’s prow! Glad that was only straw.',390,4);
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
