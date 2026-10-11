import {prepareMotion,integrateMotion} from './movement.js?v=support57';
import {segmentHit} from './projectile-collision.js?v=arc46';
import {refractionArt} from './refraction-art-layout.js?v=refraction62';
const approach=(a,b,d)=>a+Math.sign(b-a)*Math.min(Math.abs(b-a),d);
export const refractionLevel={
 name:'THE REFRACTION GATE',subtitle:'One light. Three angles. A way upward.',
 story:['In the crystal vault, the machines no longer carry messages. They carry light.','A broken hinge, two patient turns, and the room remembers its way upward.'],
 hint:'Break the glass hinge catch. Catch the released draft with an overhead shield. Turn the upper and lower mirror wheels; the lower shelf is a shield-assisted jump above the floor.',
 mechanic:'refraction',worldWidth:2800,worldTop:0,worldBottom:1020,deathY:1040,
 floors:[{x:0,y:900,w:2800}],platforms:[{x:780,y:390,w:220},{x:1200,y:700,w:300},{x:2200,y:460,w:600},{x:2160,y:700,w:160}],ladders:[],exit:{x:2600,y:460,w:170}
};
export function setupRefraction(s){
 s.level=refractionLevel;s.crate=false;s.turret=false;s.enemies=[];
 for(const h of s.heroes){h.y=856;h.ground=true;}
 s.machine={catchBroken:false,cutAt:-1,targets:[false,false,false],poses:[0,0,0],draft:false,charge:0,
  carrier:{x:2080,y:900,w:160,v:0,dir:-1,pause:3,support:'refraction-lift'}};
}
const feedback=(s,message)=>{s.feedback={message,sequence:(s.feedback?.sequence||0)+1};};
export function refractionObjects(s){return [
 {id:'upper-mirror',x:860,y:346,radius:65,title:'UPPER MIRROR WHEEL',ready:true,done:s.machine.targets[1],run:()=>{s.machine.targets[1]=true;s.machine.upperSet=true;feedback(s,'Upper mirror turning into its detent.');return s.feedback.message;}},
 {id:'lower-mirror',x:1360,y:656,radius:65,title:'LOWER MIRROR WHEEL',ready:true,done:s.machine.targets[2],run:()=>{s.machine.targets[2]=true;s.machine.lowerSet=true;feedback(s,'Lower mirror turning toward the receiver.');return s.feedback.message;}}
];}
export function refractionBeam(g){
 const rise=(64-refractionArt.basePivot[1])*2;
 const source={x:300,y:900-128+refractionArt.emitterLens[1]*2},a={x:600,y:900-rise},b={x:600,y:390+rise},c={x:1400,y:700-rise},receiver={x:2240,y:700-rise};
 const segments=[{from:source,to:a,settled:true}],angleTo=(from,to)=>Math.atan2(to.y-from.y,to.x-from.x);
 const outgoing=(from,to,pose,initial,incoming)=>{const end=angleTo(from,to),angle=initial+(end-initial)*pose,dx=Math.cos(angle),dy=Math.sin(angle);
  const distances=[dx>0?(2800-from.x)/dx:dx<0?-from.x/dx:Infinity,dy>0?(1020-from.y)/dy:dy<0?-from.y/dy:Infinity];
  const projection=(to.x-from.x)*dx+(to.y-from.y)*dy,miss=Math.abs((to.x-from.x)*dy-(to.y-from.y)*dx);
  // Cast through the room throughout rotation. The optic's receiving aperture
  // intercepts the ray before its detent, avoiding a length snap at pose===1.
  const distance=projection>0&&miss<16?Math.min(projection,...distances):Math.min(...distances);
  segments.push({from,to:{x:from.x+dx*distance,y:from.y+dy*distance},plane:(incoming+angle)/2,settled:pose===1});};
 outgoing(a,b,g.poses[0],-.15,angleTo(source,a));if(g.poses[0]!==1)return segments;
 outgoing(b,c,g.poses[1],Math.PI*.75,-Math.PI/2);if(g.poses[1]!==1)return segments;
 outgoing(c,receiver,g.poses[2],-Math.PI*.35,angleTo(b,c));return segments;
}
export function advanceRefractionLift(s,dt){
 const c=s.machine.carrier;if(!s.power)return;
 if(c.pause>0){c.pause=Math.max(0,c.pause-dt);return;}
 const target=c.dir<0?460:900,d=target-c.y,old=c.y;
 c.v=approach(c.v,Math.min(150,Math.sqrt(2*240*Math.abs(d))),240*dt);
 c.y+=Math.sign(d)*Math.min(Math.abs(d),c.v*dt);
 for(const h of s.heroes)if(h.support===c.support&&h.x+14>c.x&&h.x-14<c.x+c.w&&Math.abs(h.y+44-old)<3&&h.vy>=0){h.y+=c.y-old;h.vy=0;}
 if(c.y===target){c.dir*=-1;c.v=0;c.pause=3;}
}
export function refractionStep(s,input,dt){
 s.time+=dt;s.cooldown=Math.max(0,s.cooldown-dt);const g=s.machine,a=s.heroes[s.active];
 for(const h of s.heroes)h.swing=Math.max(0,(h.swing||0)-dt);
 prepareMotion(s,input,dt);
 const release=()=>{if(g.catchBroken)return;g.catchBroken=true;g.targets[0]=true;g.cutAt=s.time;feedback(s,'Glass catch shattered. The mirror and vent damper are swinging free.');};
 if(input.interact){const o=refractionObjects(s).find(o=>Math.abs(a.x-o.x)<o.radius&&Math.abs(a.y-o.y)<60);if(o)o.run();}
 if(a.id===1&&input.sword&&s.cooldown===0){a.swing=.24;s.cooldown=.3;if((600-a.x)*a.face>=0&&Math.abs(600-a.x)<75&&Math.abs(a.y+20-876)<35)release();}
 if(a.id===1&&input.action&&s.cooldown===0){a.bow=.28;s.cooldown=.35;s.shots.push({kind:'arrow',x:a.x+a.face*25,y:a.y+20,v:a.face*580});}
 for(const p of s.shots){const old=p.x;p.x+=p.v*dt;if(!g.catchBroken&&segmentHit(old,p.y,p.x,p.y,{x:588,y:864,w:24,h:24})){release();p.dead=true;}}
 s.shots=s.shots.filter(p=>!p.dead&&p.x>0&&p.x<2800);
 g.poses=g.poses.map((v,i)=>approach(v,g.targets[i]?1:0,dt/.8));g.draft=g.poses[0]===1;
 const connected=g.poses.every(v=>v===1);g.charge=connected?Math.min(1,g.charge+dt/1.2):0;s.power=g.charge===1;
 const riders=s.heroes.filter(h=>h.support==='refraction-lift');advanceRefractionLift(s,dt);
 const o=s.heroes[2];if(g.draft&&o.shieldUp&&o.x>=560&&o.x<=720&&o.y+44>310&&o.y+44<=920){o.vy=Math.max(-210,o.vy-2200*dt);o.ground=false;}
 integrateMotion(s,[g.carrier,...s.level.floors,...s.level.platforms],[],dt);
 const c=g.carrier;for(const h of riders)if(h.ground&&Math.abs(h.y+44-c.y)<2&&h.x+15>c.x&&h.x-15<c.x+c.w)h.support='refraction-lift';
 s.won=!s.failed&&s.power&&s.heroes.every(h=>Math.abs(h.x-2600)<85&&Math.abs(h.y+44-460)<4);
}
