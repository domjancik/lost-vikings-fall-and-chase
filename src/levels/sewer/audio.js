import {segmentHit} from '../../core/projectile-collision.js';
import {sewerOccluders} from './light.js?v=sewer136';

// The same physical walls that hide a source also damp its sound. No camera-space
// or guessed enemy position: every cue retains its actual world source.
export function sewerAcoustics(s,x,y=716){
 const h=s.heroes[s.active],distance=Math.hypot(x-h.x,y-(h.y+20));
 const walls=sewerOccluders(s).filter(a=>{const hit=segmentHit(h.x,h.y+20,x,y,a);return hit&&hit.t>.001&&hit.t<.999;}).length;
 return {volume:Math.max(0,1-distance/1200)*(.34**Math.min(walls,2)),pitch:walls?.64:1};
}
export function createSewerSounds(){
 let previous=null,lastDrip=0,lastFlow=0,lastJet=0,lastMotor=0,lastCrawl=new Map();
 const names={ignite:'sewerIgnite',pour:'sewerPour',valve:'sewerValve',chain:'sewerChain',splash:'sewerSplash',steam:'sewerHiss',click:'sewerLamp',globeBounce:'hallWood',globeWake:'hallGlobe',globeFeet:'sewerLamp'};
 return s=>{
  if(s.level.mechanic!=='sewer'){previous=null;return [];}
  const g=s.machine,out=[];
  const cue=(name,x,y=716,id=0,gain=1)=>{const acoustic=sewerAcoustics(s,x,y);if(acoustic.volume>.015)out.push({name,x,y,id,volume:acoustic.volume*gain,pitch:acoustic.pitch});};
  if(!previous||previous.machine!==g){
   previous={machine:g,serial:g.eventSerial,landed:g.landed,phases:g.lurkers.map(e=>e.phase)};
   lastDrip=lastFlow=lastJet=lastMotor=s.time;lastCrawl=new Map(g.lurkers.map(e=>[e.id,s.time]));
   if(g.introTime<.3)cue('sewerWood',230,500,'entry',.9);
   return out;
  }
  for(const e of g.events)if(e.id>=previous.serial)cue(names[e.name]||e.name,e.x,e.y??716,e.id,e.volume??1);
  if(g.landed&&!previous.landed)cue('sewerLand',230,760,'land',.85);
  if(s.time-lastDrip>3.7){
   const h=s.heroes[s.active],x=Math.max(440,Math.min(2540,Math.round(h.x/360)*360+70));
   cue('sewerDrip',x,750,'drip',.45);lastDrip=s.time;
  }
  if(s.time-lastFlow>1.35){cue('sewerWater',2880,760,'outlet',.55);lastFlow=s.time;}
  if(g.jet.pose>.1&&s.time-lastJet>1.1){cue('sewerHiss',940,716,'spray',g.jet.pose*.42);lastJet=s.time;}
  const movingValve=g.valve.pose>0&&g.valve.pose<1,movingHatch=g.hatch.pose>0&&g.hatch.pose<1&&!g.hatch.blocked,movingGate=g.gates.some(a=>a.pose>0&&a.pose<1);
  if((movingValve||movingHatch||movingGate)&&s.time-lastMotor>.48){cue(movingValve?'sewerValve':'sewerChain',movingValve?1180:movingHatch?2020:2300,650,'motor',.5);lastMotor=s.time;}
  for(const e of g.lurkers){
   if(!e.hp)continue;
   if(e.phase==='warning'&&previous.phases[e.id]!=='warning')cue('sewerClaw',e.x,e.y-20,e.id,.7);
   if(['stalk','patrol','retreat'].includes(e.phase)&&s.time-(lastCrawl.get(e.id)??0)>2.7){cue('sewerCrawl',e.x,e.y-10,e.id,.38);lastCrawl.set(e.id,s.time);}
  }
  previous={machine:g,serial:g.eventSerial,landed:g.landed,phases:g.lurkers.map(e=>e.phase)};
  return out;
 };
}
