import fs from 'node:fs';
let t=fs.readFileSync('engine.test.js','utf8');
t=t.replace(/test\('the bridge needs power.*?\}\);/,"test('the pub floor is continuous and does not depend on a bridge or latch',()=>{const s=createState();s.crate=false;s.power=true;s.active=0;for(let i=0;i<200;i++)step(s,{right:true},1/60);assert.ok(s.heroes[0].x>820);assert.equal(s.heroes[0].y,566);});");
t=t.replace("move(2,745);tick({},10);assert.equal(s.bridge,true);move(1,1028);tick({interact:true});assert.equal(s.latch,true);","");
t=t.replace("test('reaching the powered exit completes the level even if the arcade is still alive'","test('the pub exit explains that the rogue arcade must be shut down first'").replace("step(s,{},1/60);assert.equal(s.won,true);});\ntest('Baleog","step(s,{},1/60);assert.equal(s.won,false);});\ntest('Baleog");
fs.writeFileSync('engine.test.js',t);
let it=fs.readFileSync('interactions.test.js','utf8');
const a=it.indexOf("test('pub latch"),b=it.indexOf("test('pinball",a);it=it.slice(0,a)+"test('no level includes a bridge latch interaction',()=>{for(let r=0;r<6;r++)assert.ok(!interactionObjects(createState(r)).some(o=>o.id==='latch'));});\n"+it.slice(b);it=it.replace("import {createState,step}","import {interactionObjects} from './interactions.js';import {createState,step}");
fs.writeFileSync('interactions.test.js',it);
