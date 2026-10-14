import {createState,step} from '../../src/core/engine.js';
import {motionProfiles} from '../../src/core/movement.js';
export function runCycleRoute(hz=120,onTick=()=>{}){
 const s=createState(0,'cycle'),dt=1/hz,stages=[];
 const tick=(input={},n=1)=>{for(let k=0;k<n;k++){step(s,k===0?input:{...input,jump:false,sword:false,action:false,interact:false},dt);onTick(s);if(s.failed)throw Error('Died '+JSON.stringify(s.heroes));}};
 const until=(condition,input=()=>({}),limit=100)=>{for(let n=0;n<limit*hz;n++){if(condition())return;tick(input());}throw Error('Timeout '+JSON.stringify({heroes:s.heroes,m:s.machine}));};
 const move=(id,x)=>{s.active=id;const p=motionProfiles[id];until(()=>s.won||Math.abs(s.heroes[id].x-x)<3&&Math.abs(s.heroes[id].vx)<12,()=>{const h=s.heroes[id],d=x-h.x-h.vx*Math.abs(h.vx)/(2*(h.ground?p.brake:p.air*1.5));return Math.abs(d)<2?{}:d>0?{right:true}:{left:true};});tick({},Math.ceil(.15*hz));};
 const climb=(id,feet)=>{move(id,650);until(()=>Math.abs(s.heroes[id].y+44-feet)<1,()=>({up:feet<s.heroes[id].y+44,down:feet>s.heroes[id].y+44}));tick({},3);};
 move(1,400);tick({sword:true});stages.push('restraint');
 climb(0,500);move(0,820);until(()=>s.machine.carrier.x===850&&s.machine.carrier.y===500&&s.machine.carrier.pause>.8);move(0,895);tick({jump:true,right:true});until(()=>s.heroes[0].ground&&s.heroes[0].y+44===390,()=>({right:true}),3);move(0,1070);tick({interact:true});stages.push('brake');
 climb(1,500);move(1,820);tick({action:true});until(()=>s.machine.damper===1);move(1,700);stages.push('damper');
 move(2,820);until(()=>s.machine.carrier.x===850&&s.machine.carrier.y===940&&s.machine.carrier.pause>.8);move(2,880);until(()=>s.heroes[2].x>=1300&&s.heroes[2].x<=1410&&s.heroes[2].y+44===500);
 tick({jump:true});until(()=>s.heroes[2].y+44<240);move(2,1560);until(()=>s.heroes[2].ground&&s.heroes[2].y+44===260);tick({interact:true});stages.push('upper-selector');
 tick({action:true});move(2,1668);until(()=>{const c=s.machine.carrier;return c.high===260&&c.segment===1&&c.x>1560&&c.x<1610;});until(()=>s.heroes[2].support==='cycle-carrier',()=>({right:true}),3);tick({});
 until(()=>s.machine.carrier.x===2050&&s.machine.carrier.y===260&&s.machine.carrier.pause>.8&&s.heroes[2].y+44===260);move(2,2600);if(s.heroes[2].y!==216)throw Error('Olaf missed dock '+JSON.stringify({h:s.heroes[2],carrier:s.machine.carrier}));stages.push('olaf-rejoined');
 for(const id of [0,1]){climb(id,940);move(id,820);until(()=>s.machine.carrier.x===850&&s.machine.carrier.y===940&&s.machine.carrier.pause>.8);move(id,880);
  until(()=>s.machine.carrier.x===2050&&s.machine.carrier.y===260&&s.machine.carrier.pause>.8&&s.heroes[id].y+44===260);move(id,2600);
 }
 tick({},30);if(!s.won)throw Error('Incomplete '+JSON.stringify(s.heroes));return {s,stages};
}
