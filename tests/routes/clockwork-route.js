import {createState,step} from '../../src/core/engine.js';
export function runClockworkRoute(hz=120,onState=()=>{},options={}){
 const s=createState(3,'cycle'),dt=1/hz,stages=[];
 const tick=(input={})=>{step(s,input,dt);onState(s);if(s.failed)throw Error('Death '+JSON.stringify(s.heroes));};
 const wait=(condition,input={},limit=30,label='')=>{for(let n=0;n<limit*hz;n++){if(condition())return;tick(typeof input==='function'?input():input);}throw Error('Timeout '+label+' '+JSON.stringify({heroes:s.heroes,machine:s.machine,time:s.time}));};
 const move=(id,x)=>{s.active=id;wait(()=>s.won||Math.abs(s.heroes[id].x-x)<3,()=>s.heroes[id].x<x?{right:true}:{left:true},30,'move'+id+':'+x);for(let n=0;n<20;n++)tick();};
 const climb=(id,x,feet)=>{move(id,x);wait(()=>Math.abs(s.heroes[id].y+44-feet)<2,()=>({up:s.heroes[id].y+44>feet,down:s.heroes[id].y+44<feet}),30,'climb'+id+':'+feet);};
 assertRoom();function assertRoom(){if(s.level.mechanic!=='clockwork')throw Error('Missing room');}
 const board=()=>{move(0,430);tick({jump:true,right:true});wait(()=>s.heroes[0].x>555,{right:true},3,'cup jump');wait(()=>s.heroes[0].ground,{},3,'cup land');};
 if(!options.lateBoard)board();stages.push('board-cup');
 climb(2,420,380);climb(2,450,300);tick({interact:true});wait(()=>s.machine.catchWound,{},3,'wind regulator');climb(2,450,380);tick({right:true});for(let n=0;n<20;n++)tick();tick({overhead:true});
 climb(1,420,380);climb(1,450,300);tick({right:true});wait(()=>s.heroes[1].support===2,{},3,'shield board');
 s.active=2;wait(()=>s.heroes[2].x>990&&s.heroes[2].ground,{right:true},12,'glide');stages.push('glide');
 move(2,1250);climb(1,1320,400);move(1,1220);tick({left:true});tick({action:true});wait(()=>s.machine.half.mode==='shelf',{},4,'chain fall');stages.push('chain');
 s.active=2;tick({action:true});wait(()=>s.machine.half.mode!=='shelf',{left:true},8,'push half');
 if(options.lateBoard){wait(()=>s.machine.half.mode==='waiting',{},8,'empty catch');board();}
 wait(()=>s.machine.joined,{},8,'join');stages.push('join');
 if(options.reopen){s.active=0;tick({interact:true});wait(()=>s.machine.wheel.mode==='cup',{},2,'reopen');tick({jump:true,left:true});wait(()=>s.heroes[0].x<430,{left:true},3,'leave cradle');wait(()=>s.heroes[0].ground,{},3,'land outside');board();wait(()=>s.machine.joined,{},3,'reboard');}
 move(2,1400);tick({overhead:true});climb(1,1320,650);climb(1,1400,570);tick({right:true});wait(()=>s.heroes[1].support===2,{},3,'second shield board');
 s.active=2;wait(()=>s.heroes[2].x>1710,{right:true},6,'second glide');wait(()=>s.heroes[2].ground,{},6,'carriage landing');move(2,1690);move(1,1770);stages.push('crew-board');
 s.active=0;wait(()=>s.machine.wheel.mode==='docked',{right:true},15,'launch dock');stages.push('dock');
 if(options.reverse){
  wait(()=>s.machine.carrier.x>1930,{right:true},12,'reverse test outbound stop');for(let n=0;n<hz;n++)tick();wait(()=>s.machine.steamClock%5<.1,{},6,'outbound steam pause');wait(()=>s.machine.drive>.75,{right:true},30,'return check outward');
  wait(()=>s.machine.carrier.x<2190,{left:true},20,'reverse test inbound stop');for(let n=0;n<hz;n++)tick();wait(()=>s.machine.steamClock%5<.1,{},6,'inbound steam pause');wait(()=>s.machine.drive<.04,{left:true},30,'return check inward');
 }
 // Brake before the charged steam mouth; wait until it is safe to pass.
 wait(()=>s.machine.carrier.x>1930,{right:true},12,'carriage approach');for(let n=0;n<hz;n++)tick();
 wait(()=>s.machine.steamClock%5<.5,{},6,'steam pause');
 wait(()=>s.machine.exitLatched,{right:true},30,'upper ratchet');stages.push('ratchet');
 move(1,2790);tick({right:true});tick({sword:true});wait(()=>s.machine.collapse===1,{},3,'pin collapse');stages.push('release');
 move(1,3090);move(2,3090);s.active=0;tick({jump:true,right:true});wait(()=>s.heroes[0].x>2560,{right:true},3,'leave open cup');climb(0,2900,530);move(0,3090);wait(()=>s.won,{},2,'exit');stages.push('exit');return{s,stages};
}
