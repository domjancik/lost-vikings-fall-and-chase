import {createState,step} from '../../src/core/engine.js';
export function runWaterRoute(hz=120,onTick=()=>{}){
 const s=createState(4,'cycle'),dt=1/hz,stages=[];
 const tick=(input={},n=1)=>{for(let k=0;k<n;k++){step(s,k===0?input:{...input,interact:false,jump:false,action:false,sword:false},dt);onTick(s);if(s.failed)throw Error('Water route death '+JSON.stringify({heroes:s.heroes,m:s.machine}));}};
 const until=(condition,input=()=>({}),limit=40)=>{for(let k=0;k<limit*hz;k++){if(condition())return;tick(input());}throw Error('Water route timeout '+JSON.stringify({heroes:s.heroes,m:s.machine}));};
 const move=(id,x)=>{s.active=id;until(()=>s.won||Math.abs(s.heroes[id].x-x)<3&&Math.abs(s.heroes[id].vx)<12,()=>{
  const h=s.heroes[id],d=x-h.x-h.vx*Math.abs(h.vx)/(2*1500);return Math.abs(d)<2?{}:d>0?{right:true}:{left:true};});tick({},Math.ceil(.15*hz));};
 const swim=(x,y)=>{s.active=0;until(()=>Math.abs(s.heroes[0].x-x)<4&&Math.abs(s.heroes[0].y-y)<4&&Math.abs(s.heroes[0].vx)<15&&Math.abs(s.heroes[0].swimVy||0)<15,()=>{
  const h=s.heroes[0],dx=x-h.x-h.vx*Math.abs(h.vx)/(2*650),v=h.swimVy||0,dy=y-h.y-v*Math.abs(v)/(2*600);
  return{left:dx<-2,right:dx>2,up:dy<-2,down:dy>2};});};
 const climb=(id,x,feet)=>{move(id,x);until(()=>Math.abs(s.heroes[id].y+44-feet)<1,()=>({up:feet<s.heroes[id].y+44,down:feet>s.heroes[id].y+44}));tick({},3);};
 s.active=2;tick({jump:true});move(2,710);stages.push('local-jet-shelter');
 swim(640,880);swim(820,880);swim(940,856);swim(1100,856);tick({interact:true});until(()=>s.machine.valvePose===1);swim(940,856);stages.push('inlet-closed');
 s.active=2;tick({action:true});move(2,1522);until(()=>Math.abs(s.machine.float.vx)<1);stages.push('air-towed-to-crank');
 move(1,950);climb(1,950,900);tick({},Math.ceil(2*hz));climb(1,950,1000);move(1,1660);
 tick({sword:true});tick({},Math.ceil(.3*hz));tick({interact:true});until(()=>s.machine.wound===1,()=>({right:true}),12);tick({interact:true});stages.push('chain-and-crank');
 until(()=>s.machine.waterY===950,()=>({}),15);stages.push('shallow-recovery');
 s.active=2;tick({jump:true});move(2,2080);climb(2,2080,540);move(2,2300);
 move(1,2080);climb(1,2080,540);move(1,2300);
 climb(0,950,1000);move(0,2080);climb(0,2080,540);move(0,2300);
 tick({},5);if(!s.won)throw Error('Water route did not clear');
 return{s,stages};
}



