import {createState,step} from '../../src/core/engine.js';
import {railLength} from '../../src/levels/orbit/magnetic.js';
export function simulateLodeRoute(hz=120,options={}){
 const s=createState(9,'cycle'),milestones=[],commands=[];let stage='start';
 function read(){return s;}
 function tick(id,input={}){s.active=id;step(s,input,1/hz);commands.push({id,...input});if(s.failed)throw Error('Crew lost '+stage+' '+JSON.stringify(s.heroes));}
 function until(id,predicate,input={},seconds=20){const end=s.time+seconds;while(!predicate(s)){if(s.won)return;if(s.time>end)throw Error('Timeout '+stage+' '+JSON.stringify({heroes:s.heroes,machine:s.machine,time:s.time}));tick(id,typeof input==='function'?input(s):input);}}
 function move(id,x){until(id,s=>Math.abs(s.heroes[id].x-x)<3&&Math.abs(s.heroes[id].vx)<16,()=>{const h=s.heroes[id],error=x-h.x,stop=h.vx*h.vx/(2*(h.ground?[2600,2300,2100][id]:1875));return Math.abs(error)>stop+2?{[error>0?'right':'left']:true}:{};});}
 function railMove(id,u){until(id,s=>s.heroes[id].magnet&&Math.abs(s.heroes[id].magnet.u-u)<3&&Math.abs(s.heroes[id].magV)<16,()=>{const h=s.heroes[id],error=u-(h.magnet?.u??0),stop=(h.magV||0)**2/(2*[2600,2300,2100][id]);return Math.abs(error)>stop+2?{[error>0?'right':'left']:true}:{};},25);}
 function mark(name){stage=name;milestones.push({name,time:s.time,heroes:s.heroes.map(h=>({x:h.x,y:h.y,hp:h.hp,magnet:h.magnet?{...h.magnet}:null})),machine:JSON.parse(JSON.stringify(s.machine))});if(globalThis.process?.env.LODE_TRACE)console.log(name,s.time,s.heroes.map(h=>[Math.round(h.x),Math.round(h.y+44),h.magnet?.u,h.hp]));}
 mark('service-shoes');for(const id of [0,1,2]){move(id,120+id*55);tick(id,{interact:true});until(id,s=>s.heroes[id].inventory.includes('magneticShoes'),{},1);}
 for(const id of [0,1,2]){
  mark('stator-climb-'+id);move(id,750);tick(id,{item:true});until(id,s=>s.heroes[id].magnet?.plateId===0&&s.heroes[id].magnet.pull===1,{},2);
  railMove(id,railLength(s.machine.plates[0]));tick(id,{item:true});until(id,s=>!s.heroes[id].magnet&&s.heroes[id].ground&&Math.abs(s.heroes[id].rotation)<.01,{},2);move(id,1200+id*80);
 }
 mark('gallery-recovery');until(0,s=>s.machine.recoveryPose===1,{},2);
 mark('brake-release');move(1,1810);mark('brake-aim');until(1,s=>s.machine.brakeCut,()=>s.cooldown===0?{action:true}:{},4);mark('brake-freed');
 move(2,1840);mark('athletic-transfer');move(0,1840);tick(0,{item:true});until(0,s=>s.heroes[0].x>1865,{right:true},1);tick(0,{right:true,jump:true});until(0,s=>s.heroes[0].magnet?.plateId===1,{right:true},3);until(0,s=>s.heroes[0].magnet.pull===1,{},2);
 railMove(0,railLength(s.machine.plates[1])+24);mark('winding-wheel');tick(0,{interact:true});until(0,s=>s.machine.plates[1].angle===0,{},8);mark('hinged-crossing');tick(0,{item:true});until(0,s=>!s.heroes[0].magnet&&s.heroes[0].ground,{},2);
 move(0,1720);mark('sentry-gallery');move(1,1810);until(1,s=>s.machine.sentry.hp===0,()=>s.cooldown===0?{action:true}:{},8);
 for(const id of [0,1,2])move(id,2760+id*4);
 mark('lift-boarding');for(const id of [0,1,2]){if(options.recall&&id===1)continue;tick(id,{item:true});until(id,s=>s.heroes[id].magnet?.plateId===2&&s.heroes[id].magnet.pull===1,{},2);}
 mark('inverted-ballast');until(2,s=>s.machine.ballastTravel>120,{left:true},4);mark('sustained-ballast-push');until(2,s=>s.machine.banked,{left:true},8);mark('mass-transfer');until(2,s=>s.machine.plates[2].y===340,{},8);mark('upper-lift');
 if(options.recall){mark('missed-lift-call');move(1,2660);tick(1,{interact:true});until(1,s=>s.machine.plates[2].y===576,{},8);move(1,2764);tick(1,{item:true});until(1,s=>s.heroes[1].magnet?.plateId===2&&s.heroes[1].magnet.pull===1,{},2);tick(1,{interact:true});until(1,s=>s.machine.plates[2].y===340,{},8);mark('recovered-crew');}

 const p=s.machine.plates[2],end=p.w-2*p.capRx+(railLength(p)-2*(p.w-2*p.capRx))/4;
 for(const id of [0,1,2]){railMove(id,end);mark('free-cap-'+id);railMove(id,0);tick(id,{item:true});until(id,s=>!s.heroes[id].magnet&&s.heroes[id].ground&&Math.abs(s.heroes[id].rotation)<.01,{},2);move(id,2480+id*8);}
 until(0,s=>s.won,{},2);mark('won');return{won:s.won,hp:s.heroes.map(h=>h.hp),time:s.time,milestones,commands};
}
