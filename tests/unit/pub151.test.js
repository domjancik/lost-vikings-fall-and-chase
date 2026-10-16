import test from 'node:test';
import assert from 'node:assert/strict';
import * as text from '../../src/render/text-render.js';
import {PUB_PEOPLE,dialogueLayout} from '../../src/levels/pub/dialogue.js';
import {createState} from '../../src/core/engine.js';
import {invitePractice} from '../../src/levels/pub/tutorial.js';
import {alehallObjects,say} from '../../src/levels/pub/campaign.js';
import {createAlehallSounds} from '../../src/levels/pub/audio.js';

test('the lute player stays in the dry hall; the yard spectator wears his travelling cloak',()=>{
 const musicians=Object.values(PUB_PEOPLE).filter(p=>p.row===3);
 assert.equal(musicians.length,1);assert.ok(musicians[0].x>560&&musicians[0].x<1680);
 assert.equal(PUB_PEOPLE.TORSTEN.row,1);
});
test('lute sound comes from the actual sheltered musician',()=>{
 const s=createState(11,'cycle'),sounds=createAlehallSounds();sounds(s);s.time=1;
 const note=sounds(s).find(a=>a.name==='hallLyre');assert.equal(note.x,Object.values(PUB_PEOPLE).find(p=>p.row===3).x);
});
test('dialogue requests one coherent text-and-background label',()=>{
 const s=createState(11,'cycle');say(s,'RUNA','We hauled it up in the net.',1620);
 const d=dialogueLayout(s,{x:1200,y:400},{width:600,height:400,mobile:true});
 assert.equal(d.kind,'speech');assert.equal(d.text,'RUNA: We hauled it up in the net.');assert.deepEqual(d.anchor,{x:1620,y:686});
});
test('measured speech panels enclose all glyphs and stay on screen at every gameplay scale',()=>{
 for(const scale of [.35,.586,1,1.5,2,3])for(const width of [430,844,1440]){
  const label={t:'ASTRID: Select Olaf’s portrait, raise his shield, and bring the cups to our usual table.',x:1550,y:684,size:10,maxWidth:270,insetTop:42};
  const p=text.speechLabelLayout(label,1400,scale,{width,height:780},(t,f)=>t.length*f*.63,400);
  assert.ok(p.fontSize>=11);assert.ok(p.x>=8);assert.ok(p.x+p.w<=width-8);assert.ok(p.y>=8&&p.y+p.h<=772);
  for(const line of p.lines){assert.ok(line.x>=p.x+p.padding-.001);assert.ok(line.x+line.width<=p.x+p.w-p.padding+.001);assert.ok(line.y>p.y&&line.y<p.y+p.h);}
 }
});
test('a short remark gets a fitted panel rather than an empty full-width box',()=>{
 const p=text.speechLabelLayout({t:'OLAF: Oh.',x:200,y:220,size:10},0,1,{width:430,height:780},(t,f)=>t.length*f*.6);
 assert.ok(p.w<120);assert.equal(p.lines.length,1);
});
test('the approved fishers find and net story remain, without a party-count command',()=>{
 const s=createState(11,'cycle'),h=s.heroes[0];h.x=1700;h.y=716;h.inventory[0]='hallKey';s.itemAction('hallKey',h,0);
 assert.match(s.machine.dialogue.text,/The fishers left their find in the back\./);assert.doesNotMatch(s.machine.dialogue.text,/all three|all 3|all of you|should see it/i);
 alehallObjects(s).find(o=>o.id==='fisher').run();assert.equal(s.machine.dialogue.text,'We hauled it up in the net. Those little arms kept working all the way ashore.');
});
test('repeated story invitations remain human dialogue instead of movement instructions',()=>{
 const s=createState(11,'cycle');s.machine.door.open=true;s.active=0;s.heroes[0].x=1620;s.machine.dialogue=null;
 const lines=[];for(const time of [10,25,40]){s.time=time;invitePractice(s,(_s,_name,line)=>lines.push(line));}
 assert.equal(lines.length,3);assert.equal(new Set(lines).size,3);
 for(const line of lines)assert.doesNotMatch(line,/all three|all 3|walk each|each viking|through the open door|should look/i);
});
