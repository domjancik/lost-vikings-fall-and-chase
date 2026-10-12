import {updatePlunger} from './plunger.js?v=arc46';
import {oreReady} from './forge-material.js?v=arc46';
import {startBash,bashImpact} from './bash.js?v=arc46';
import {damage} from './health.js?v=arc46';
import {segmentHit} from './projectile-collision.js?v=arc46';
import {shieldHit} from './projectile-collision.js?v=arc46';
import {ghostLayout} from './ghost-layout.js?v=arc46';
import {prepareMotion,integrateMotion} from './movement.js?v=vikings70';
export function feedback(s,message){s.feedback={sequence:(s.feedback?.sequence||0)+1,message};}
export function campaignStep(s,input,dt){
 const a=s.heroes[s.active],o=s.heroes[2],g=s.machine,m=s.level.mechanic;
 s.time+=dt;s.cooldown=Math.max(0,s.cooldown-dt);s.hurt=Math.max(0,s.hurt-dt);
 for(const h of s.heroes)h.swing=Math.max(0,(h.swing||0)-dt);
 prepareMotion(s,input,dt);
 startBash(s,dt);
 const bash=x=>a.id===0&&a.bash>0&&(x-a.x)*a.face>0&&Math.abs(a.x-x)<50&&a.y>520;
 if(input.sword&&a.id===1&&s.cooldown===0){s.cooldown=.3;a.swing=.24;
  if(m==='portals'&&g.mirror&&!g.seal&&(870-a.x)*a.face>0&&Math.abs(a.x-870)<85){g.seal=true;feedback(s,'Vines severed. Door B now connects to the last chamber.');}
  if(m==='forge'&&!g.ore&&(940-a.x)*a.face>0&&Math.abs(a.x-940)<85&&a.y>520){g.ore=true;g.oreCutAt=s.time;feedback(s,'Release chain cut! The basket is falling and tipping ore into the crucible. Position Olaf before pumping the bellows.');}
 }
 if(input.action&&a.id===1&&s.cooldown===0){s.cooldown=.3;a.bow=.28;s.shots.push({x:a.x+a.face*25,y:a.y+20,v:a.face*580,vy:0,kind:'arrow'});}
 const walls=[];
 if(m==='cargo'){
  const before=g.liftY;
  if(g.liftOn){g.liftPause=Math.max(0,g.liftPause-dt);if(!g.liftPause){g.liftY+=g.liftDir*100*dt;if(g.liftY<=390||g.liftY>=610){g.liftY=Math.max(390,Math.min(610,g.liftY));g.liftDir*=-1;g.liftPause=2;}}}
  for(const h of s.heroes)if(h.support==='lift'&&h.ground&&h.x>485&&h.x<695){h.y+=g.liftY-before;h.prevY+=g.liftY-before;}
  s.power=g.hatch;
  walls.push({x:1200,w:24,top:260,bottom:390,on:!g.hatch});
 }else if(m==='bankshot')s.power=g.score>=3;
 else if(m==='portals'){
  if(bash(290)&&!g.bell){g.bell=true;bashImpact(s,290,566);feedback(s,'The stone bell rings. Door A is awake. Press USE beside it.');}

  
  walls.push({x:480,w:30,top:0,bottom:610,on:true},{x:960,w:30,top:0,bottom:610,on:true},{x:274,w:30,top:530,bottom:610,on:!g.bell});
  s.power=g.seal;
 }else if(m==='tow'){
  if(bash(320)&&!g.brake){g.brake=true;bashImpact(s,320,566);feedback(s,'Speed trap crushed. Conveyor stopped. Rescue the kart and switch the traffic lamp green.');}
  if(!g.brake)for(const h of s.heroes)if(h.ground&&h.x>380&&h.x<1050)h.moveX-=80*dt;
  if(o.shield&&!o.shieldUp&&o.face===1&&o.x>g.cartX-70&&o.x<g.cartX-28&&o.y>520&&o.moveX>0&&!g.parked)g.cartX+=o.moveX;
  if(g.cartX>=1030&&!g.parked){g.cartX=1030;g.parked=true;feedback(s,'Kart delivered to the garage. The rescue crew can leave.');}
  walls.push({x:304,w:30,top:530,bottom:610,on:!g.brake},{x:g.cartX-30,w:60,top:530,bottom:610,on:!g.parked},{x:1190,w:24,top:0,bottom:610,on:!(g.brake&&g.signal&&g.parked)});
  s.power=g.brake&&g.signal&&g.parked;
 }else if(m==='forge'){
  if(bash(520)&&s.time>g.lastPump+.7){bashImpact(s,520,566);g.air=Math.min(3,g.air+1);g.lastPump=s.time;feedback(s,'Bellows pressure '+g.air+'/3. Olaf redirects the dragon fire; each forged flame consumes one charge.');}
  walls.push({x:922,w:36,top:530,bottom:610,on:!g.ore});s.power=g.heat>=3;
 }
 const floors=[...s.level.floors,...s.level.platforms];if(m==='cargo')floors.push({x:500,y:g.liftY,w:180,support:'lift'});
 integrateMotion(s,floors,walls,dt);if(m==='bankshot')updatePlunger(s,dt);
 if(m==='cargo'&&Math.floor((s.time-dt)/.8)!==Math.floor(s.time/.8))s.shots.push({x:230,y:200,v:0,vy:250,kind:'spark'});
 if(m==='portals'&&!g.mirror&&Math.floor((s.time-dt)/1.2)!==Math.floor(s.time/1.2))s.shots.push({x:ghostLayout.sourceX,y:ghostLayout.y,v:240,vy:0,kind:'ghost'});
 if(m==='forge'&&oreReady(s)&&g.air>0&&g.heat<3&&Math.floor((s.time-dt)/2.2)!==Math.floor(s.time/2.2)){g.dragonShotAt=s.time;s.shots.push({x:1230,y:586,v:-330,vy:0,kind:'fire'});}
 for(const p of s.shots){
  const px=p.x,py=p.y;p.prevX=px;p.prevY=py;p.trail??=[];if(!p.trail.length||s.time-(p.trail.at(-1).time||0)>1/60){p.trail.push({x:px,y:py,time:s.time});if(p.trail.length>16)p.trail.shift();}p.x+=p.v*dt;p.y+=(p.vy||0)*dt;
  const shield=shieldHit(o,p,px,py);
  if(['spark','ghost','fire'].includes(p.kind)){
   const body=s.heroes.map(h=>({h,hit:segmentHit(px,py,p.x,p.y,{x:h.x-16,y:h.y,w:32,h:44})})).filter(e=>e.hit).sort((a,b)=>a.hit.t-b.hit.t)[0];
   if(body&&body.hit.t<(shield?.t??Infinity)){damage(s,body.h);p.dead=true;continue;}
  }
  if(m==='cargo'&&p.kind==='arrow'&&p.x>=920&&px<920&&Math.abs(p.y-366)<30){g.hatch=true;p.dead=true;feedback(s,'Upper hatch released. Bring everyone up the elevator to the departure deck.');}
  if(m==='bankshot'){
   if(p.kind==='arrow'&&shield&&!o.shieldUp&&o.face===-1&&o.x<870){
    g.lastReflection={x:shield.x,y:shield.y,time:s.time};p.kind='bank';p.lane=g.lane;p.x=shield.x;p.y=shield.y;p.v=420;p.vy=([440,340,240][g.lane]-p.y)*420/(890-p.x);
   }
   if(p.kind==='bank'&&p.x>=890&&px<890){p.dead=true;if(g.score>=3)continue;const expected=[1,0,2][g.score];g.lastBankHit={lane:p.lane,time:s.time,correct:p.lane===expected};
    if(p.lane===expected){g.score++;feedback(s,g.score===3?'JACKPOT! Return the whole crew to the left-side portal.':'Bell '+g.score+'/3. Next: '+['MIDDLE','LOW','HIGH'][[1,0,2][g.score]]+'.');}
    else{g.score=0;feedback(s,'Wrong bell. Combo reset: MIDDLE → LOW → HIGH. The dial can be changed any time.');}
   }
  }
  if(m==='tow'&&p.kind==='arrow'&&p.x>=1110&&px<1110&&Math.abs(p.y-586)<25){g.signal=true;p.dead=true;feedback(s,'Traffic lamp green. Olaf needs to deliver the kart to the garage.');}
  if(p.kind==='spark'&&shield){p.dead=true;if(m==='cargo'&&o.shieldUp&&!g.charged){g.charge=Math.min(3,g.charge+1.5);if(g.charge===3){g.charged=true;feedback(s,'Reactor charged. Erik can start the cargo elevator at the balcony console.');}}}
  if(p.kind==='ghost'&&p.x>ghostLayout.maxX)p.dead=true;
  if(!p.dead&&p.kind==='ghost'&&shield&&!o.shieldUp){p.v=-280;p.kind='reflected-ghost';}
  if(p.kind==='reflected-ghost'&&p.x<ghostLayout.sourceX&&px>=ghostLayout.sourceX){p.dead=true;if(!g.mirror){g.mirror=true;feedback(s,'Ghost reflected into its own eye. Baleog can now cut the vines.');}}
  if(p.kind==='fire'&&shield&&!o.shieldUp&&o.face===1&&o.x<980){p.kind='forge-fire';p.x=shield.x;p.y=shield.y;p.v=360;p.vy=(490-p.y)*360/(1000-p.x);}
  if(shield&&['arrow','ghost','fire'].includes(p.kind))p.dead=true;
  if(p.kind==='forge-fire'&&p.x>=1000&&px<1000){p.dead=true;if(oreReady(s)&&g.air>0){g.lastForgeHit=s.time;g.air--;g.heat=Math.min(3,g.heat+1);feedback(s,g.heat===3?'The escape key is forged! Bring all three to the crucible portal.':'Forge heat '+g.heat+'/3. Pressure remaining '+g.air+'.');}}
 }
 s.shots=s.shots.filter(p=>!p.dead&&p.x>0&&p.x<1440&&p.y<660&&p.y>0);
 const e=s.level.exit;s.won=!s.failed&&s.power&&s.heroes.every(h=>Math.abs(h.x-e.x)<e.w/2&&Math.abs(h.y-(e.y-44))<30);
}
