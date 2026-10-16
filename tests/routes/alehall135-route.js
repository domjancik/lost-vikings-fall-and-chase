import {createState,step} from '../../src/core/engine.js';
export function simulateAlehallRoute(hz=120){const s=createState(11,'cycle'),commands=[],milestones=[];let stage='start';
 function tick(id,input={}){s.active=id;step(s,input,1/hz);commands.push({id,...input});if(s.failed)throw Error('Crew lost '+stage);}
 function until(id,predicate,input={},seconds=20){const end=s.time+seconds;while(!predicate(s)){if(s.won)return;if(s.time>end)throw Error('Timeout '+stage+' '+JSON.stringify({heroes:s.heroes,machine:s.machine}));tick(id,typeof input==='function'?input(s):input);}}
 function move(id,x){until(id,s=>Math.abs(s.heroes[id].x-x)<3&&Math.abs(s.heroes[id].vx)<15,()=>{const h=s.heroes[id],error=x-h.x,stop=h.vx*h.vx/(2*[2600,2300,2100][id]);return Math.abs(error)>stop+2?{[error>0?'right':'left']:true}:{};});}
 function mark(name){stage=name;milestones.push({name,time:s.time,heroes:s.heroes.map(h=>({...h})),machine:JSON.parse(JSON.stringify(s.machine))});}
 mark('push-sledge');until(2,s=>s.machine.cart.parked,{left:true},6);
 mark('carry-ale');move(2,1040);tick(2,{jump:true});tick(2,{interact:true});until(2,s=>s.machine.cups.mode==='carried',{},2);move(2,1390);tick(2,{interact:true});until(2,s=>s.machine.served,{},2);tick(2,{action:true});
 mark('straw-practice');move(1,350);tick(1,{left:true});tick(1,{action:true});until(1,s=>s.machine.targetHit,{},2);
 mark('cut-delivery');move(1,1165);tick(1,{right:true});tick(1,{sword:true});until(1,s=>s.machine.wrapCut,{},1);
 mark('loft-key');move(0,850);tick(0,{jump:true,left:true});until(0,s=>s.heroes[0].ground&&s.heroes[0].y+44===610,()=>s.heroes[0].x>750?{left:true}:{},2);move(0,730);tick(0,{interact:true});until(0,s=>s.heroes[0].inventory.includes('hallKey'),{},1);
 move(0,1000);until(0,s=>s.heroes[0].ground&&Math.abs(s.heroes[0].y+44-760)<2,{},2);move(0,1680);tick(0,{interact:true});until(0,s=>s.machine.door.pose===1,{},2);
 mark('room-entry');for(const id of [0,1])move(id,1850+id*40);until(2,s=>s.machine.phase!=='play',{right:true},8);
 until(2,s=>s.machine.phase!=='play',{},1);mark('inspection');until(2,s=>s.won,{},20);mark('fall');
 const compact=[];for(const c of commands){const key=JSON.stringify(c),last=compact.at(-1);if(last?.key===key)last.frames++;else compact.push({key,frames:1});}
 return{won:s.won,hp:s.heroes.map(h=>h.hp),time:s.time,milestones,commands:compact.map(c=>({...JSON.parse(c.key),frames:c.frames}))};}
