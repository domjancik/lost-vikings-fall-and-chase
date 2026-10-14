import assert from 'node:assert/strict';
import {step} from '../../src/core/engine.js';
export function playVerticalRoute(s,hz=120){const events=[];let tickNumber=0;const tick=(input={},count=1)=>{for(let i=0;i<count;i++){const cmd=i===0?input:{left:input.left,right:input.right};events.push({id:s.active,input:cmd});step(s,cmd,1/hz);tickNumber++;assert.equal(s.failed,false,'fall at tick '+tickNumber+' '+JSON.stringify(s.heroes));}};
 const move=(id,x)=>{s.active=id;let done=false;for(let i=0;i<hz*15;i++){if(s.won){done=true;break;}const h=s.heroes[id],d=x-h.x;if(Math.abs(d)<3&&Math.abs(h.vx)<12){done=true;break;}const brake=h.ground?[2600,2300,2100][id]:[1250,950,750][id],stop=h.vx*Math.abs(h.vx)/(2*brake),r=d-stop;tick(Math.abs(r)<2?{}:r>0?{right:true}:{left:true});}tick({},Math.round(hz*.15));assert.ok(done,'blocked '+id+' target '+x+' '+JSON.stringify(s.heroes));};
 const wait=seconds=>tick({},Math.round(hz*seconds));const use=id=>{s.active=id;tick({interact:true});wait(.1);};const face=(id,dir)=>{s.active=id;tick(dir>0?{right:true}:{left:true},Math.round(hz*.06));wait(.12);};
 const board=x=>{move(2,x);wait(1);s.active=2;tick({jump:true});move(1,x+18);move(0,x-18);wait(.1);assert.equal(s.heroes[1].support,2,'Baleog aboard');assert.equal(s.heroes[0].support,2,'Erik aboard');};
 wait(.5);
 if(s.round===9){move(1,230);face(1,1);tick({sword:true});assert.ok(s.machine.screen);board(430);use(2);wait(3);assert.ok(s.heroes[2].y<250);move(2,600);wait(.2);move(1,600);face(1,1);tick({action:true});wait(.4);assert.ok(s.machine.chime);board(825);use(2);wait(3.1);assert.ok(s.heroes[2].y<-250);move(2,980);wait(.2);move(0,1030);s.active=0;tick({jump:true});move(0,1120);wait(.6);use(0);assert.ok(s.machine.aligned);for(const id of [1,0,2])move(id,1330);wait(.4);
 }else{board(430);move(2,980);wait(1);move(1,900);wait(.6);move(1,930);face(1,1);tick({sword:true});assert.ok(s.machine.reed);move(0,1030);s.active=0;tick({jump:true});move(0,1120);wait(.6);use(0);assert.ok(s.machine.resonance);move(0,1000);wait(.5);board(815);move(2,300);wait(2);move(1,200);wait(.6);face(1,1);tick({sword:true});assert.ok(s.machine.bass);s.active=2;tick({action:true});wait(.6);move(1,260);move(0,260);wait(.7);move(2,260);wait(.4);}
 assert.ok(s.machine.riders>=2,'both teammates used shield');assert.ok(s.won,'exit '+JSON.stringify(s.heroes));assert.ok(s.heroes.every(h=>h.hp===3));return events;
}


