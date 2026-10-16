export function createAlehallSounds(){let state=null,serial=0,lastFire=0,lastString=0,lastGlobe=0,lastCart=0;
 return s=>{if(s.level.mechanic!=='alehall'){state=null;return [];}const g=s.machine,out=[];
  if(state!==g){state=g;serial=g.eventSerial;lastFire=lastString=lastGlobe=lastCart=s.time;return out;}
  const names={door:'hallDoor',pour:'sewerPour',spill:'hallCups',served:'hallCups',cut:'hallRope',park:'hallWood',cupReady:'hallCups',cupThrow:'hallCups',cupBlock:'hallWood',cupLand:'hallCups',target:'hallWood',creak:'hallCreak',collapse:'hallCollapse',inspect:'hallGlobe'};
  for(const e of g.events)if(e.id>=serial)out.push({name:names[e.name],x:e.x,id:e.id});serial=g.eventSerial;
  if(s.time-lastFire>1.8){out.push({name:'hallHearth',x:1170,volume:.6});lastFire=s.time;}
  if(g.phase==='play'&&s.time-lastString>.8){out.push({name:'hallLyre',x:960,volume:.4,pitch:[1,1.125,1.333,1.5][Math.floor(s.time/.8)%4]});lastString=s.time;}
  if(s.time-lastGlobe>.8){out.push({name:'hallGlobe',x:2120,volume:.3});lastGlobe=s.time;}
  if(g.pushing&&s.time-lastCart>.32){out.push({name:'hallWood',x:g.cart.x,volume:.4});lastCart=s.time;}
  return out;
 };
}
