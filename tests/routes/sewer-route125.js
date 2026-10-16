import {createState,step} from '../../src/core/engine.js';
export function simulateSewerRoute(hz=120){
 const s=createState(10,'cycle'),milestones=[],commands=[];let stage='entrance';
 function tick(id,input={}){s.active=id;step(s,input,1/hz);commands.push({id,...input});if(s.failed)throw Error('Crew lost '+stage+' '+JSON.stringify(s.heroes));}
 function until(id,predicate,input={},seconds=20){const end=s.time+seconds;while(!predicate(s)){if(s.won)return;if(s.time>end)throw Error('Timeout '+stage+' '+JSON.stringify({heroes:s.heroes,machine:s.machine,time:s.time}));tick(id,typeof input==='function'?input(s):input);}}
 function move(id,x){until(id,s=>Math.abs(s.heroes[id].x-x)<3&&Math.abs(s.heroes[id].vx)<16,()=>{const h=s.heroes[id],error=x-h.x,stop=h.vx*h.vx/(2*(h.ground?[2600,2300,2100][id]:1875));return Math.abs(error)>stop+2?{[error>0?'right':'left']:true}:{};});}
 function mark(name){stage=name;milestones.push({name,time:s.time,heroes:s.heroes.map(h=>({x:h.x,y:h.y,hp:h.hp,inventory:[...h.inventory]})),machine:JSON.parse(JSON.stringify(s.machine))});if(globalThis.process?.env.SEWER_TRACE)console.log(name,s.time,s.heroes.map(h=>[Math.round(h.x),Math.round(h.y+44),h.hp]),s.machine.lurkers);}
 mark('ceiling-fall');until(0,s=>s.heroes.every(h=>h.ground),{},3);mark('lamphouse');
 for(const x of [390,445,500]){move(0,x);tick(0,{interact:true});}s.heroes[0].itemSlot=2;tick(0,{item:true});s.heroes[0].itemSlot=0;
 move(0,615);mark('unshielded-spray');move(2,885);tick(2,{action:true});mark('shielded-spray');move(0,858);tick(0,{jump:true,right:true});until(0,s=>s.heroes[0].x>950,{right:true},2);until(0,s=>s.heroes[0].ground&&s.heroes[0].y+44===640,{},2);move(0,1050);tick(0,{interact:true});until(0,s=>s.machine.jet.pose===0,{},2);mark('valve-closed');
 move(0,1530);s.heroes[0].itemSlot=1;tick(0,{item:true});s.heroes[0].itemSlot=0;tick(0,{item:true});mark('permanent-refuge');
 move(1,1530);move(2,1530);tick(2,{action:true});move(0,1770);tick(0,{jump:true,right:true});until(0,s=>s.heroes[0].x>1840,{right:true},2);until(0,s=>s.heroes[0].ground&&s.heroes[0].y+44===640,{},2);move(0,1840);tick(0,{interact:true});until(0,s=>s.machine.hatch.pose===1,{},2);mark('inspection-open');
 // Clear the animal with ranged attacks before Erik enters its physical reach.
 move(1,1700);until(1,s=>s.machine.lurkers.every(e=>!e.hp),()=>s.cooldown===0?{action:true}:{},8);
 // Return the portable lamp to the lower hook; leave its focused beam aimed along the rope.
 move(0,2010);until(0,s=>s.heroes[0].ground&&s.heroes[0].y+44===760,{},2);move(0,1850);tick(0,{interact:true});mark('lamp-hooked');move(0,1530);
 move(2,1800);tick(2,{action:true});move(1,1920);tick(1,{right:true});mark('guarded-shot');until(1,s=>s.machine.rope.cut,()=>s.cooldown===0?{action:true}:{},5);until(1,s=>s.machine.gates[0].pose===1,{},3);mark('outlet-open');
 // Light reveals the real moving animal; arrows retain their normal damage rules.
 until(1,s=>s.machine.lurkers.every(e=>!e.hp),()=>s.cooldown===0?{action:true}:{},8);
 for(const id of [0,1,2]){mark('stream-approach-'+id);until(id,s=>s.machine.captured[id],{right:true},15);mark('stream-caught-'+id);until(id,s=>s.machine.escapeTravel[id]>=200,{},3);mark('stream-swept-'+id);}
 until(0,s=>s.won,{},4);mark('swept-away');return{won:s.won,hp:s.heroes.map(h=>h.hp),time:s.time,milestones,commands};
}
