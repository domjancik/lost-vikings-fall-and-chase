import {snapPixel as q} from '../../render/pixel-grid.js';
export const PUB_PEOPLE={
 ASTRID:{x:1040,y:684,row:0,phase:.1},
 EINAR:{x:1350,y:684,row:1,phase:1.7},
 HAKON:{x:1460,y:684,row:1,phase:3.2},
 RUNA:{x:1620,y:686,row:2,phase:2.3},
 TORSTEN:{x:440,y:684,row:3,phase:4.4}
};
export function speakerAnchor(s,name){
 const id=['ERIK','BALEOG','OLAF'].indexOf(name);
 if(id>=0){const h=s.heroes[id];return {x:q(h.x),y:q(h.y-42)};}
 const p=PUB_PEOPLE[name];return p?{x:p.x,y:p.y}:null;
}
export function formatDialogue(text,mobile=false){
 const keys=mobile?{primary:'ACTION',alt:'ALT',use:'USE',left:'LEFT',right:'RIGHT',olaf:'Olaf’s portrait'}:{primary:'Space / F',alt:'D',use:'E',left:'Left arrow',right:'Right arrow',olaf:'3 (Olaf)'};
 return text.replace(/\{(\w+)\}/g,(_,key)=>keys[key]||key);
}
export function dialogueLayout(s,camera,view){
 const d=s.machine.dialogue;if(!d||s.time>=d.until)return null;
 const anchor=speakerAnchor(s,d.speaker);if(!anchor||anchor.x<camera.x-20||anchor.x>camera.x+view.width+20)return null;
 const w=q(Math.min(270,view.width-24)),chars=Math.floor((w-16)/6),lines=[''];
 for(const word of (d.speaker+': '+formatDialogue(d.text,!!view.mobile)).split(' ')){
  if(lines.at(-1).length+word.length+1>chars&&lines.at(-1))lines.push(word);else lines[lines.length-1]+=(lines.at(-1)?' ':'')+word;
 }
 const h=lines.length*16+12,x=q(Math.max(camera.x+w/2+10,Math.min(camera.x+view.width-w/2-10,anchor.x))),y=q(Math.max(camera.y+42,anchor.y-h-16));
 return {anchor,x,y,w,h,lines};
}
