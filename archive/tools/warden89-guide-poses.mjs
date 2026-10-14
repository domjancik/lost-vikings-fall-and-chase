import fs from 'node:fs';
import {createState} from '../engine.js';
import {setupWarden,wardenGeometry,advanceWarden} from '../warden-campaign.js';
const poses=[];
for(const [name,kneel,footY,footX] of [['upright',0,940,1490],['warning-lift',0,760,1490],['shield-brace',1,860,1490],['shutdown',1,940,1570]]){
 const s=createState(0,'cycle');setupWarden(s);Object.assign(s.machine,{kneel,footY,footX});poses.push({name,...wardenGeometry(s)});
}
fs.mkdirSync('output/warden89',{recursive:true});fs.writeFileSync('output/warden89/guide-poses.json',JSON.stringify(poses,null,2));
const s=createState(5,'cycle'),motion=[];Object.assign(s.heroes[2],{x:1490,shieldUp:true});
for(let i=0;i<720;i++){s.time+=1/60;advanceWarden(s,1/60);if(i===420){s.machine.disabled=true;s.machine.disabledAt=s.time;}if(i%6===0)motion.push({name:`motion ${s.time.toFixed(1)}`,brace:s.machine.braced,...wardenGeometry(s)});}
fs.writeFileSync('output/warden89/guide-motion.json',JSON.stringify(motion));
