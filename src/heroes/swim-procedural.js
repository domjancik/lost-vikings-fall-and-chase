import {swimMotion} from './swim-motion.js?v=water114';
import {snapPixel} from '../render/pixel-grid.js?v=water114';
const cache=new Map();
export function proceduralSwimFrame(frame){
 frame=((frame%8)+8)%8;if(cache.has(frame))return cache.get(frame);
 const c=document.createElement('canvas');c.width=c.height=80;const g=c.getContext('2d'),m=swimMotion(frame);
 // The original procedural skin is smaller than the generated skin. Author
 // its swim clusters at that same size, still on the native integer grid.
 const rect=(color,x,y,w,h)=>{g.fillStyle=color;g.fillRect(Math.round(40+(x-40)*.75),Math.round(58+(y-58)*.75),Math.max(1,Math.round(w*.75)),Math.max(1,Math.round(h*.75)));};
 const line=(points,color,width=3)=>{for(let j=1;j<points.length;j++){const a=points[j-1],b=points[j],steps=Math.max(Math.abs(b[0]-a[0]),Math.abs(b[1]-a[1]));for(let i=0;i<=steps;i++){const t=steps?i/steps:0;rect('#192532',a[0]+(b[0]-a[0])*t-width/2,a[1]+(b[1]-a[1])*t-width/2,width+2,width+2);rect(color,a[0]+(b[0]-a[0])*t-width/2+1,a[1]+(b[1]-a[1])*t-width/2+1,width,width);}}};
 const arm=(a,near)=>{line([a.shoulder,a.elbow,a.hand],near?'#d55c31':'#803827',3);rect(near?'#f2bf84':'#b87751',a.hand[0]-1,a.hand[1]-1,3,3);};
 for(const [leg,near]of [[m.farLeg,false],[m.nearLeg,true]]){line([leg.hip,leg.knee,leg.foot],near?'#647782':'#364855',3);rect('#1c2935',leg.foot[0]-4,leg.foot[1]-2,6,4);rect(near?'#ac8050':'#6a513b',leg.foot[0]-3,leg.foot[1]-1,4,2);}
 arm(m.far,false);
 rect('#192532',34,51+m.bob,16,12);rect('#873626',35,52+m.bob,14,10);rect('#cc512d',37,52+m.bob,12,8);rect('#f78342',41,52+m.bob,7,2);rect('#382c29',35,59+m.bob,3,4);rect('#d7ae66',35,60+m.bob,3,2);
 arm(m.near,true);
 // Beard trails behind the face; far limbs remain behind the whole actor.
 for(let x=39;x<56;x++){const y=58+m.bob+Math.round(Math.sin((x-39)/5+frame*Math.PI/4));rect('#873b25',x,y,1,4);rect('#c35b2d',x,y,1,2);if(x%4===0)rect('#e78b46',x,y,1,1);}
 rect('#192532',48,45+m.bob,13,13);rect('#b77951',49,47+m.bob,11,9);rect('#efbc82',52,48+m.bob,9,6);rect('#efbc82',60,51+m.bob,3,3);
 rect('#354956',48,43+m.bob,13,6);rect('#6e8b96',49,43+m.bob,11,3);rect('#b7c7c3',51,43+m.bob,5,2);rect('#dbc897',48,48+m.bob,13,2);rect('#6d593c',55,44+m.bob,2,6);
 for(const x of [48,59]){rect('#192532',x-1,38+m.bob,4,7);rect('#e7dfbd',x,39+m.bob,2,6);rect('#e7dfbd',x-1,39+m.bob,2,2);}
 rect('#252c31',58,50+m.bob,2,2);
 cache.set(frame,c);return c;
}
export function drawProceduralSwim(g,h,x,y,frame,scale=1){
 const sprite=proceduralSwimFrame(frame);g.save();g.translate(scale===1?snapPixel(x):x,scale===1?snapPixel(y):y);g.scale((h.face||1)*scale,scale);g.imageSmoothingEnabled=false;g.drawImage(sprite,-80,-96,160,160);g.restore();
}
