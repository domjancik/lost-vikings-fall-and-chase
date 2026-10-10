import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createState,step} from './engine.js';
const settle=s=>{for(let i=0;i<20;i++)step(s,{},1/60);};
test('front shield switches directly from overhead even during weapon cooldown',()=>{
 for(const round of [0,1,2,3,4,5]){const s=createState(round);settle(s);s.active=2;step(s,{jump:true},1/60);assert.equal(s.heroes[2].shieldUp,true);s.cooldown=.3;step(s,{action:true},1/60);assert.equal(s.heroes[2].shieldUp,false);assert.equal(s.heroes[2].shield,true);}
});
test('the intact sword crate stops arcade bolts and arrows from either side',()=>{
 for(const kind of ['bolt','arrow'])for(const dir of [-1,1]){const s=createState();settle(s);s.shots=[{kind,x:dir===1?435:479,y:586,v:dir*580}];step(s,{},.033);assert.equal(s.shots.length,0,kind+' direction '+dir);assert.equal(s.crate,true);}
 const s=createState();settle(s);s.crate=false;s.shots=[{kind:'bolt',x:479,y:586,v:-580}];step(s,{},.033);assert.equal(s.shots.length,1);
});
test('front shield stops arcade shots anywhere and only from the facing side',()=>{
 for(const face of [-1,1]){const s=createState();settle(s);const o=s.heroes[2];o.x=900;o.face=face;o.shield=true;s.shots=[{kind:'bolt',x:o.x+face*38,y:586,v:-face*1000}];step(s,{},.033);assert.equal(s.shots.length,0);assert.equal(o.hp,3);}
 const s=createState();settle(s);const o=s.heroes[2];o.x=900;o.face=1;o.shield=true;s.shots=[{kind:'bolt',x:865,y:586,v:1000}];step(s,{},.033);assert.equal(o.hp,2);
});
test('bank shots and dragon fire reflect away from marked pads',()=>{
 for(const round of [2,5]){const s=createState(round);settle(s);const o=s.heroes[2];o.x=round===2?720:850;o.face=round===2?-1:1;o.shield=true;s.shots=[{kind:round===2?'arrow':'fire',x:o.x+o.face*38,y:586,v:-o.face*1000}];step(s,{},.033);assert.equal(s.shots[0]?.kind,round===2?'bank':'forge-fire');}
});
test('overhead shields intercept falling shots away from floor pads',()=>{
 const s=createState(1);const o=s.heroes[2];o.x=250;o.y=420;o.shield=true;o.shieldUp=true;s.shots=[{kind:'spark',x:230,y:405,v:0,vy:500}];step(s,{},.033);assert.equal(s.shots.length,0);assert.ok(s.machine.charge>0);
});
test('front shields cannot intercept shots above the shield or from behind',()=>{
 const s=createState(2);settle(s);const o=s.heroes[2];o.x=720;o.face=-1;o.shield=true;s.shots=[{kind:'arrow',x:682,y:500,v:1000}];step(s,{},.033);assert.equal(s.shots[0].kind,'arrow');
});
test('slow arcade bolts hit the shield before Olaf’s body across successive frames',()=>{
 const s=createState();settle(s);const o=s.heroes[2];o.x=900;o.face=1;o.shield=true;s.shots=[{kind:'bolt',x:945,y:586,v:-280}];for(let i=0;i<15;i++)step(s,{},1/60);assert.equal(o.hp,3);assert.equal(s.shots.length,0);
});
test('Olaf cannot shield a teammate standing in front of him',()=>{
 const s=createState();settle(s);const o=s.heroes[2],b=s.heroes[1];o.x=900;o.face=1;o.shield=true;b.x=930;s.shots=[{kind:'bolt',x:955,y:586,v:-1800}];step(s,{},.033);assert.equal(b.hp,2);assert.equal(o.hp,3);
});
test('Olaf starts with an active front shield and has exactly two idempotent poses',()=>{
 for(let round=0;round<6;round++){const s=createState(round);assert.equal(s.heroes[2].shield,true);assert.equal(s.heroes[2].shieldUp,false);s.active=2;
  for(const input of [{action:true},{action:true},{jump:true},{jump:true},{action:true},{action:true}]){step(s,input,1/60);assert.equal(s.heroes[2].shield,true);assert.equal(s.heroes[2].shieldUp,!!input.jump);}
 }
});
