import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,step} from '../../src/core/engine.js';
const clock=await import('../../src/levels/clockwork/campaign.js').catch(()=>null);
const {runClockworkRoute}=await import('../routes/clockwork-route.js');
test('clockwork is a fourth lab room with a real height advantage for Olaf',()=>{
 const s=createState(3,'cycle');assert.equal(s.level.mechanic,'clockwork');
 assert.ok(s.level.platforms.some(p=>p.y===380));assert.ok(s.level.platforms.some(p=>p.x>=920&&p.y===650));
});
test('wheel follows a continuous U rail and meets launch/dock at the same height',()=>{
 assert.ok(clock?.clockRail,'wheel physics module exists');
 let last=clock.clockWheelPose(560);for(let x=562;x<=1640;x+=2){const p=clock.clockWheelPose(x);assert.ok(Math.hypot(p.x-last.x,p.y-last.y)<5);last=p;}
 assert.equal(clock.clockRail(560).y,800);assert.equal(clock.clockRail(1100).y,1120);assert.equal(last.y,840);
});
test('arrow chain releases a physical half with no immediate relocation',()=>{
 const s=createState(3,'cycle');assert.equal(s.level.mechanic,'clockwork');s.active=1;
 Object.assign(s.heroes[1],{x:1220,y:356,ground:true,face:-1});const before={...s.machine.half};
 step(s,{action:true},1/120);for(let i=0;i<50&&!s.machine.chainCut;i++)step(s,{},1/120);
 assert.ok(s.machine.chainCut);assert.ok(Math.abs(s.machine.half.x-before.x)<2);assert.ok(s.machine.half.y>=before.y);
});
test('latched portal is necessary before a sword can release captive Erik',()=>{
 const s=createState(3,'cycle');assert.equal(s.level.mechanic,'clockwork');s.active=1;
 Object.assign(s.heroes[1],{x:2790,y:486,ground:true,face:1});s.machine.wheel.mode='docked';
 step(s,{sword:true},1/120);assert.equal(s.machine.pinBroken,false);
 s.machine.exitLatched=true;s.cooldown=0;step(s,{sword:true},1/120);assert.equal(s.machine.pinBroken,true);assert.equal(s.machine.wheel.mode,'docked');
});
test('driven carriage stops when Erik input releases and remains when another hero selected',()=>{
 const s=createState(3,'cycle');assert.equal(s.level.mechanic,'clockwork');s.machine.wheel.mode='docked';s.machine.wheel.occupied=true;s.active=0;
 for(let i=0;i<120;i++)step(s,{right:true},1/120);assert.ok(s.machine.drive>0);
 for(let i=0;i<120;i++)step(s,{},1/120);const p=s.machine.drive;s.active=2;
 for(let i=0;i<120;i++)step(s,{},1/120);assert.equal(s.machine.drive,p);
});
for(const hz of [60,120])test('ordinary controls solve the assembled wheel and reunite everyone at '+hz+'Hz',()=>{
 const {s,stages}=runClockworkRoute(hz);assert.ok(s.won);assert.deepEqual(s.heroes.map(h=>h.hp),[3,3,3]);assert.equal(stages.at(-1),'exit');
});
test('cup weight can seat either passenger and USE releases the prelaunch catch for a retry',()=>{
 const s=createState(3,'cycle');Object.assign(s.machine.half,{mode:'waiting',x:560,y:640});Object.assign(s.heroes[1],{x:560,y:720+clock.clockCupFloor(0)-44,ground:true,support:'clock-cup'});s.active=1;
 for(let n=0;n<180;n++)step(s,{},1/120);assert.equal(s.machine.wheel.occupant,1);assert.ok(s.machine.wheel.occupied);
 step(s,{interact:true},1/120);for(let n=0;n<180;n++)step(s,{},1/120);assert.equal(s.machine.wheel.occupied,false);assert.equal(s.machine.wheel.mode,'cup');
});
test('return chute descends from its shelf toward a safe assembly catch',()=>{
 const s=createState(3,'cycle');Object.assign(s.machine.half,{mode:'chute',x:920,y:640,vx:-100});let last=640;
 for(let n=0;n<180&&s.machine.half.mode==='chute';n++){step(s,{},1/120);assert.ok(s.machine.half.y>=last);last=s.machine.half.y;}
});
test('ceiling steam is harmless during windup and shield geometry protects Olaf',()=>{
 const s=createState(3,'cycle');s.machine.wheel.mode='docked';s.machine.wheel.occupied=true;Object.assign(s.heroes[2],{x:2140,y:876,ground:true,shieldUp:true});s.active=2;s.machine.steamClock=4.2;step(s,{},1/120);assert.equal(s.heroes[2].hp,3);
 s.heroes[2].shieldUp=false;step(s,{},1/120);assert.equal(s.heroes[2].hp,2);
});
test('the whole wheel clears every gallery and staging deck along the U course',()=>{
 for(let p=560;p<=1640;p+=.5){const b=clock.clockWheelPose(p);for(const f of clock.clockworkLevel.platforms){const x=Math.max(f.x,Math.min(b.x,f.x+f.w)),y=Math.max(f.y,Math.min(b.y,f.y+24));assert.ok(Math.hypot(b.x-x,b.y-y)>=clock.CLOCK_RADIUS-1e-6,`wheel intersects deck${f.x} at${p}`);}}
});
test('an empty carriage can be brought back after reaching the exit ratchet',()=>{
 const s=createState(3,'cycle');s.machine.wheel.mode='docked';s.machine.wheel.occupied=true;s.machine.drive=1;s.machine.exitLatched=true;
 for(let n=0;n<120;n++)step(s,{left:true},1/120);assert.ok(s.machine.drive<1);assert.ok(s.machine.exitLatched);
});
test('a nonjumping passenger can climb out of the reopened starting cup',()=>{
 const s=createState(3,'cycle');s.machine.entryHold=true;Object.assign(s.machine.half,{mode:'waiting',x:560,y:640});Object.assign(s.heroes[1],{x:520,y:720+clock.clockCupFloor(40)-44,ground:true,support:'clock-cup'});s.active=1;
 for(let n=0;n<120;n++)step(s,{up:true},1/120);assert.equal(s.heroes[1].y+44,720);
});
test('the final released maintenance ladder reaches the recovery floor',()=>{
 const s=createState(3,'cycle');s.machine.exitLatched=true;s.machine.pinBroken=true;
 for(let n=0;n<360;n++)step(s,{},1/120);assert.ok(s.level.ladders.some(l=>l.release&&l.bottom===1260));
});
test('service deck keeps only its short boarding ladder after landing',()=>{
 const s=createState(3,'cycle');assert.ok(!s.level.ladders.some(l=>l.x===1450));
 Object.assign(s.heroes[2],{x:990,y:606,ground:true});for(let n=0;n<300;n++)step(s,{},1/120);
 assert.equal(s.level.ladders.find(l=>l.x===1400).bottom,650);
});
test('released Erik stands inside the open cup and jumps over its real rim',()=>{
 const s=createState(3,'cycle'),b=s.machine.wheel;Object.assign(b,{x:2460,y:840,mode:'released',occupied:false});Object.assign(s.heroes[0],{x:2460,y:840+clock.clockCupFloor(0)-44,ground:true,support:'clock-cup'});s.machine.pinBroken=true;s.machine.exitLatched=true;s.machine.collapse=1;
 for(let n=0;n<120;n++)step(s,{right:true},1/120);assert.ok(s.heroes[0].x<=2500);assert.ok(Math.abs(s.heroes[0].y+44-(840+clock.clockCupFloor(40)))<.001);
 step(s,{jump:true,right:true},1/120);for(let n=0;n<90;n++)step(s,{right:true},1/120);assert.ok(s.heroes[0].x>2540);
});
test('late boarding, catch reopening and reverse machinery still complete with ordinary controls',()=>{
 const {s}=runClockworkRoute(120,()=>{},{lateBoard:true,reopen:true,reverse:true});assert.ok(s.won);assert.deepEqual(s.heroes.map(h=>h.hp),[3,3,3]);
});
test('the visible catch follows the arch with an actual hook and fixed lower mounting base',()=>{
 assert.ok(clock.clockCatchPose);for(const y of [690,674,640]){const p=clock.clockCatchPose({half:{mode:'catch',y}});assert.equal(p.hook,y+10);assert.equal(p.base,778);assert.ok(p.stroke>=0&&p.stroke<=25);}
});
