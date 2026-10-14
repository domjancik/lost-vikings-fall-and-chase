import {createState,step} from '../../src/core/engine.js';
import {motionProfiles} from '../../src/core/movement.js';
export function runRefractionRoute(hz=120,onTick=()=>{}){
 const s=createState(1,'cycle'),dt=1/hz,stages=[];
 const tick=(input={},n=1)=>{for(let k=0;k<n;k++){step(s,k===0?input:{...input,jump:false,sword:false,action:false,interact:false},dt);onTick(s);if(s.failed)throw Error('Died '+JSON.stringify(s.heroes));}};
 const until=(condition,input=()=>({}),limit=40)=>{for(let n=0;n<limit*hz;n++){if(condition())return;tick(input());}throw Error('Timeout '+JSON.stringify({heroes:s.heroes,m:s.machine}));};
 const move=(id,x)=>{s.active=id;const p=motionProfiles[id];until(()=>s.won||Math.abs(s.heroes[id].x-x)<3&&Math.abs(s.heroes[id].vx)<12,()=>{const h=s.heroes[id],d=x-h.x-h.vx*Math.abs(h.vx)/(2*(h.ground?p.brake:p.air*1.5));return Math.abs(d)<2?{}:d>0?{right:true}:{left:true};});tick({},Math.ceil(.12*hz));};
 move(1,420);tick({action:true});until(()=>s.machine.draft);stages.push('catch');
 move(2,640);tick({jump:true});until(()=>s.heroes[2].y+44<330);move(2,850);until(()=>s.heroes[2].ground&&s.heroes[2].y+44===390);tick({interact:true});until(()=>s.machine.poses[1]===1);stages.push('upper');
 tick({action:true});move(2,1100);until(()=>s.heroes[2].ground&&s.heroes[2].y+44===900);move(2,1280);tick({jump:true});
 move(0,1244);tick({jump:true,right:true});until(()=>s.heroes[0].support===2,()=>({right:s.heroes[0].x<1280}),3);move(0,1280);tick({jump:true});until(()=>s.heroes[0].ground&&s.heroes[0].y+44===700,()=>({right:s.heroes[0].x<1320}),3);move(0,1360);tick({interact:true});until(()=>s.power);stages.push('receiver');
 // Walk off the shelf; the reunion lift is permanently available.
 move(0,1540);until(()=>s.heroes[0].ground&&s.heroes[0].y+44===900);
 s.active=2;tick({action:true});
 for(const id of [0,1,2]){move(id,2040);until(()=>s.machine.carrier.y===900&&s.machine.carrier.pause>2);move(id,2110);until(()=>s.machine.carrier.y===460&&s.machine.carrier.pause>2&&s.heroes[id].y+44===460);move(id,2600);}
 if(!s.won)throw Error('Incomplete '+JSON.stringify(s.heroes));stages.push('reunion');return{s,stages};
}
