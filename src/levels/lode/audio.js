export function createLodeSounds(){let previous=null,lastMotor=0,lastSteps=[0,0,0];return s=>{
 if(s.level.mechanic!=='lode'){previous=null;return[];}const g=s.machine,events=[];
 if(!previous||previous.machine!==g){previous={machine:g,serial:g.eventSerial,boots:s.heroes.map(h=>h.boots),attached:s.heroes.map(h=>h.magnet?.plateId)};lastMotor=s.time;return[];}
 for(const e of g.events)if(e.id>=previous.serial)events.push({name:e.name,x:e.x,id:e.id});
 for(const h of s.heroes){if(h.boots!==previous.boots[h.id])events.push({name:h.boots?'magnetOn':'magnetOff',x:h.x,id:h.id});if(h.magnet?.plateId!==previous.attached[h.id]&&h.magnet)events.push({name:'magnetGrab',x:h.x,id:h.id});if(h.magnet&&Math.abs(h.magV)>40&&s.time-lastSteps[h.id]>(h.id===2?.32:.23)){events.push({name:'step',x:h.x,id:h.id});lastSteps[h.id]=s.time;}}
 if((Math.abs(g.bridgeSpeed)>.01||Math.abs(g.liftSpeed)>2||g.pushContact)&&s.time-lastMotor>.55){events.push({name:'cart',x:g.pushContact?3160:g.plates[2].x,id:0});lastMotor=s.time;}
 previous={machine:g,serial:g.eventSerial,boots:s.heroes.map(h=>h.boots),attached:s.heroes.map(h=>h.magnet?.plateId)};return events;
};}
