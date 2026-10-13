import {createState,step} from './engine.js';
export function runWardenRoute(hz=120,onState=()=>{},recover=false){
 const s=createState(5,'cycle'),dt=1/hz,stages=[],recovery=[];
 const tick=(input={})=>{step(s,input,dt);onState(s);if(s.failed)throw Error('Death '+JSON.stringify(s.heroes));};
 const wait=(condition,input={},limit=30,label='')=>{for(let n=0;n<limit*hz;n++){if(condition())return;tick(typeof input==='function'?input():input);}throw Error('Timeout '+label+' '+JSON.stringify({heroes:s.heroes,machine:s.machine,time:s.time}));};
 const move=(id,x)=>{s.active=id;wait(()=>s.won||Math.abs(s.heroes[id].x-x)<3,()=>id===2&&s.machine.waves.some(w=>w.dir<0&&w.x>s.heroes[2].x&&w.x-s.heroes[2].x<100)?{right:true,action:true}:s.heroes[id].x<x?{right:true}:{left:true},30,'move'+id+':'+x);for(let n=0;n<20;n++)tick();};
 const climb=(id,x,feet)=>{move(id,x);wait(()=>Math.abs(s.heroes[id].y+44-feet)<2,()=>({up:s.heroes[id].y+44>feet,down:s.heroes[id].y+44<feet}),30,'climb'+id+':'+feet);tick({right:true});};
 climb(1,400,1120);move(1,2180);climb(1,2180,940);climb(1,1940,760);tick({up:true});stages.push('marksman');
 climb(0,650,760);move(0,880);
 const brace=()=>{ move(2,870);wait(()=>s.machine.activeLeg===0&&s.machine.cycle%6.5>=5.3&&s.machine.cycle%6.5<5.4,{},30,'approach window');move(2,1410);tick({action:true});wait(()=>s.machine.activeLeg===3&&s.machine.cycle%6.5>=2&&s.machine.cycle%6.5<4.5,{},8,'raised step');tick({overhead:true});move(2,1490);wait(()=>s.machine.kneel===1,{},8,'brace');};brace();stages.push('brace');
 s.active=0;tick({jump:true,right:true});wait(()=>s.heroes[0].support==='warden-spine',{right:true},3,'spine jump');stages.push('spine');
 if(recover){
  s.active=2;tick({action:true});move(2,870);
  let previous=s.heroes[0].y;
  wait(()=>s.machine.kneel===0,()=>{const h=s.heroes[0];if(!h.ground||h.support!=='warden-spine'||Math.abs(h.y-previous)>2)throw Error('Spine rider popped during unload');previous=h.y;return {};},3,'unload');
  brace();s.active=0;recovery.push('shield-unload');
 }
 wait(()=>s.machine.laser.phase==='cooldown'&&s.machine.laser.age<.1,()=>({jump:s.machine.laser.phase==='lock'&&s.machine.laser.age>.35}),7,'beam dodge');
 wait(()=>s.machine.exposure>0,()=>['lock','fire'].includes(s.machine.laser.phase)?{jump:true}:{right:true,action:true},6,'plunger');stages.push('plunger');
 if(recover){s.active=2;tick({action:true});move(2,870);wait(()=>s.machine.exposure===0&&s.machine.shutter===0,{},10,'missed window closes');brace();s.active=0;wait(()=>s.machine.laser.phase==='cooldown'&&s.machine.laser.age<.1,()=>({jump:s.machine.laser.phase==='lock'&&s.machine.laser.age>.35}),7,'retry beam dodge');move(0,1280);wait(()=>s.machine.exposure>0,()=>['lock','fire'].includes(s.machine.laser.phase)?{jump:true}:{right:true,action:true},6,'retrigger plunger');recovery.push('missed-window');}
 wait(()=>s.machine.shutter===1,()=>({jump:s.machine.laser.phase==='lock'}),1,'shutters');climb(1,1940,700);tick({left:true});s.active=1;tick({action:true});wait(()=>s.machine.disabled,{},3,'eye');stages.push('lens');
 wait(()=>s.machine.release===1,{},3,'cradle');
 // Released spine stays down; everyone can recover to the service floor.
 move(0,1700);wait(()=>s.heroes[0].ground&&Math.abs(s.heroes[0].y+44-940)<2,{},6,'Erik descent');
 s.active=1;wait(()=>s.heroes[1].y+44>930,{left:true},6,'Baleog descent');wait(()=>s.heroes[1].ground,{},3,'Baleog floor');
 s.active=2;tick({overhead:true});
 if(recover){
  climb(0,1760,870);move(0,1850);tick({interact:true});wait(()=>s.machine.cargo.distance===710,{},15,'alone upper');
  move(2,1720);tick({interact:true});if(s.machine.cargo.target!==0)throw Error('Lower call not physically reachable');wait(()=>s.machine.cargo.distance===0,{},15,'lower recall');recovery.push('lower-call');
 }
 for(const id of [0,1,2]){climb(id,1760,870);move(id,1850+id*35);}
 s.active=0;tick({interact:true});wait(()=>s.machine.cargo.distance===710,{},15,'lift');stages.push('lift');
 if(recover){move(2,2310);s.active=0;tick({interact:true});wait(()=>s.machine.cargo.distance<550,{},5,'return from upper');s.active=2;tick({interact:true});if(s.machine.cargo.target!==710)throw Error('Upper call not physically reachable');wait(()=>s.machine.cargo.distance===710,{},15,'upper recall');recovery.push('upper-call');}
 for(const id of [0,1,2])move(id,2800);
 wait(()=>s.won,{},2,'portal');stages.push('exit');return{s,stages,recovery};
}
