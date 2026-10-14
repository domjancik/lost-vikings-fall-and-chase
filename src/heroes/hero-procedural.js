// Original procedural artwork restored from d2c551a; current pose and shield geometry retained.
import {SHIELD,shieldTransform} from './hero-geometry.js?v=vikings70';
import {snapPixel} from '../render/pixel-grid.js?v=arc46';
import {drawProceduralSwim} from './swim-procedural.js?v=water114';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const palettes=[
 {cloth:'#ca512d',light:'#f78342',dark:'#803425',hair:'#b44421',gold:'#efd293',skin:'#f2b77e',shadow:'#b87751'},
 {cloth:'#477f94',light:'#85c6cf',dark:'#294451',hair:'#c79645',gold:'#f2d39b',skin:'#ecc69a',shadow:'#a8785b'},
 {cloth:'#877444',light:'#c4ac61',dark:'#4f4431',hair:'#d7a943',gold:'#ffe4a4',skin:'#f3c995',shadow:'#b38256'}
];
const cache=new Map();
const runLegs=[[-7,7,0,2],[-10,10,3,0],[-6,7,7,0],[0,1,4,0],[7,-7,2,0],[10,-10,0,3],[7,-6,0,7],[1,0,0,4]];
function raster(h,pose,frame){
 const canvas=document.createElement('canvas');canvas.width=112;canvas.height=136;const g=canvas.getContext('2d');g.imageSmoothingEnabled=false;g.translate(46,58);
 const p=h.brass?{cloth:['#b67c38','#92723e','#ad8c47'][h.id],light:'#f0d290',dark:'#634923',hair:'#9c7136',gold:'#ffe8b3',skin:'#d8af67',shadow:'#85632f'}:palettes[h.id],outline='#1b2029',wide=h.id===2?18:h.id===1?14:12;
 const rect=(c,x,y,w,z)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(z));};
 const poly=(c,points)=>{g.fillStyle=c;g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(Math.round(x),Math.round(y)):g.moveTo(Math.round(x),Math.round(y)));g.closePath();g.fill();};
 const segment=(x,y,x2,y2,width,dark,light)=>{const n=Math.ceil(Math.max(Math.abs(x2-x),Math.abs(y2-y)));for(let i=0;i<=n;i++){const t=n?i/n:0;rect(outline,x+(x2-x)*t-width/2-1,y+(y2-y)*t-width/2-1,width+2,width+2);rect(dark,x+(x2-x)*t-width/2,y+(y2-y)*t-width/2,width,width);rect(light,x+(x2-x)*t-width/2,y+(y2-y)*t-width/2,Math.max(1,width/3),width-1);}};
 const running=pose==='run'||pose==='turn',climbing=pose==='climb',air=pose==='rise'||pose==='fall'||pose==='float';
 const shieldTransition=pose==='shield-raise'||pose==='shield-lower';const shieldRise=shieldTransition?clamp((frame/6-.4)/.6,0,1):h.shieldUp?1:0;
 const leg=pose==='bash'?runLegs[(frame*2)%8]:climbing?[[0,0,10,0],[0,0,6,4],[0,0,0,10],[0,0,4,6]][frame]:running?runLegs[frame]:pose==='rise'?(frame?[-8,7,12,5]:[-6,6,9,3]):pose==='fall'?(frame?[-2,3,2,0]:[-4,5,4,1]):air?[-5,5,6,3]:[0,0,0,0];const crouch=pose==='bash'?[2,4,7,6,3,0][frame]:pose==='land'?[4,2,0][frame]:0;
 const bob=running?[0,-1,-2,-1,0,-1,-2,-1][frame]:pose==='idle'&&frame===2?-1:0;
 const lean=pose==='bash'?[-3,3,14,16,9,3][frame]:pose==='turn'?-3:running?2:0;
 // Ground shadows are drawn by the world renderer, never attached to the body.
 // Feet and layered leather boots have independent contact/lift frames.
 for(let i=0;i<2;i++){
  const hip=i?-7:7,offset=leg[i],lift=leg[i+2];const kneeX=hip+offset*.55;
  segment(hip,30+crouch,kneeX,35-lift,6,p.dark,p.cloth);segment(kneeX,35-lift,hip+offset,41-lift,5,'#634736','#a1754b');
  poly(outline,[[hip+offset-4,38-lift],[hip+offset+3,38-lift],[hip+offset+8,42-lift],[hip+offset+8,45-lift],[hip+offset-4,45-lift]]);
  rect('#684531',hip+offset-3,39-lift,7,5);rect('#b57e4b',hip+offset-2,39-lift,3,2);rect('#92734c',hip+offset+3,42-lift,4,2);rect('#2b2b2d',hip+offset-3,44-lift,10,1);
 }
 g.save();g.translate(lean,bob+crouch);
 if(pose==='bash'&&frame>=1&&frame<=4)poly('#a34329',[[-12,18],[-44,12],[-36,20],[-46,25],[-12,30]]);
 // Tunic silhouette, seams, mail and shoulder pads.
 poly(outline,[[-wide+2,16],[-wide-2,22],[-wide,34],[wide,34],[wide+2,22],[wide-3,16]]);
 rect(p.dark,-wide,20,wide*2,14);rect(p.cloth,-wide+2,18,wide*2-4,13);rect(p.light,-wide+3,20,4,10);rect(p.dark,wide-4,19,3,14);
 if(h.id===0){poly('#762e26',[[-12,19],[-19,22],[-17,31],[-12,33]]);rect('#ec9b55',-7,20,2,10);}
 if(h.id===1){rect('#bccac0',-15,17,10,6);rect('#e7ead1',-13,17,6,2);rect('#637d83',5,17,10,6);rect('#a9bbad',7,17,6,2);for(let y=24;y<32;y+=4){rect('#a2b6ae',-3,y,2,2);rect('#b8ccc0',2,y+1,2,2);}}
 g.restore();
 if(h.id===2){for(let y=22;y<32;y+=3)for(let x=-12;x<12;x+=4)rect((x+y)%3?'#b9aa70':'#dcc99a',x+(y%2),y,2,1);}
 rect('#2a2827',-wide,32,wide*2,4);rect('#7d5533',-wide+1,33,wide*2-2,2);rect('#f2d99b',-3,31,7,6);rect('#907041',-1,33,3,2);
 // Rear arm swings opposite the leading foot.
 let rearX=-wide-3-(running?leg[0]*.7:0),rearY=climbing?[6,12,20,12][frame]:28+(pose==='rise'?-16:pose==='fall'?-4:air?-8:0);
 if(shieldRise>0){rearX=rearX*(1-shieldRise)-20*shieldRise;rearY=rearY*(1-shieldRise)+(SHIELD.upTop+SHIELD.width/2)*shieldRise;}
 segment(-wide+1,20,rearX,rearY,6,p.dark,p.light);rect(p.shadow,rearX-3,rearY,6,5);rect(p.skin,rearX-3,rearY,4,3);
 // Head, shaded nose and brows.
 poly(outline,[[-11,2],[-12,12],[-8,20],[10,20],[14,11],[10,2]]);rect(p.shadow,-10,4,22,14);rect(p.skin,-9,4,17,12);rect('#ffe0b0',-7,6,8,4);rect('#ebaa72',9,10,7,5);rect('#ffd4a1',10,10,5,2);
 rect('#70452d',2,8,7,2);if(frame===3&&pose==='idle'){rect('#614737',3,11,6,1);}else{rect('#fff0c9',3,10,6,4);rect('#172127',6,10,3,3);}rect('#613a28',5,16,8,2);
 // Beard strands, moustache and separate braids.
 poly(outline,[[-11,14],[-7,22],[-5,29],[3,31],[10,26],[12,16]]);poly(p.hair,[[-10,15],[-7,23],[-4,28],[3,29],[9,25],[11,17]]);
 for(let n=0;n<5;n++)rect(n%2?p.gold:p.shadow,-7+n*3,18+(n%2)*2,2,8-(n%2));rect(p.gold,-8,16,8,3);rect(p.hair,0,16,10,3);
 g.restore();
 if(h.id===2){for(const x of [-13,11]){rect(outline,x-1,10,6,21);rect(p.hair,x,11,4,17);rect(p.gold,x,11,2,14);rect('#eff0c5',x,27,4,3);}}
 // Metal helmet, stepped horns, rivets and light reflecting off the dome.
 poly(outline,[[-14,1],[-11,-5],[-5,-8],[6,-8],[13,-4],[15,3],[13,8],[-13,8]]);
 poly('#647a81',[[-13,0],[-9,-5],[-4,-6],[6,-6],[12,-2],[14,5],[-13,5]]);rect('#b8c7c1',-9,-4,8,4);rect('#e8ead4',-7,-4,5,2);rect('#7d9292',4,-4,6,5);
 rect('#ddd2aa',-14,3,28,4);rect('#8e8e73',-13,6,26,2);for(const x of [-11,-6,6,11])rect('#f5efd1',x,4,2,2);rect('#ceb57a',-2,-7,5,15);rect('#f7dfa0',-2,-6,2,13);
 for(const sign of [-1,1]){poly(outline,[[sign*12,-2],[sign*18,-3],[sign*22,-9],[sign*19,-14],[sign*17,-13],[sign*17,-7],[sign*12,-6]]);poly('#eee5c8',[[sign*13,-3],[sign*18,-4],[sign*20,-9],[sign*18,-12],[sign*18,-7],[sign*13,-5]]);rect('#b6b899',sign<0?-19:17,-5,3,3);}
 // Forearm and weapon poses: anticipation, extension and recovery.
 let handX=wide+3+(running?leg[0]*.65:0),handY=climbing?[20,12,6,12][frame]:28+(pose==='rise'?-16:pose==='fall'?-4:air?-8:0);
 if(pose==='bow'){handX=26;handY=18;}
 if(pose==='sword'){handX=[13,15,22,27,24,18][frame];handY=[11,6,11,20,29,27][frame];}
 if(shieldRise>0){handX=handX*(1-shieldRise)+20*shieldRise;handY=handY*(1-shieldRise)+(SHIELD.upTop+SHIELD.width/2)*shieldRise;}
 segment(wide-1,20,handX,handY,6,p.dark,p.light);rect(p.shadow,handX-3,handY,6,5);rect(p.skin,handX-2,handY,4,3);
 if(h.id===1){
  if(pose==='sword'){
   const angle=[-1.6,-1.25,-.65,0,.55,.9][frame];const tipX=handX+Math.cos(angle)*40,tipY=handY+Math.sin(angle)*40;
   segment(handX,handY,tipX,tipY,4,'#799ca1','#e7f4e5');rect('#f7e7a1',handX-4,handY-3,8,3);rect('#aa713d',handX-1,handY+1,3,8);
   if(frame===2||frame===3){rect('#f3ffdc99',tipX-7,tipY-7,11,2);rect('#b6e8d177',tipX-4,tipY+5,8,2);}
  }else if(pose==='bow'){
   poly('#65442c',[[30,5],[38,10],[42,20],[38,31],[30,35],[33,29],[37,20],[33,11]]);poly('#e0b271',[[31,7],[36,11],[39,20],[36,29],[31,33],[35,29],[38,20],[35,11]]);
   segment(31,6,frame<2?22:31,20,1,'#e3dcc0','#e3dcc0');segment(frame<2?22:31,20,31,34,1,'#e3dcc0','#e3dcc0');if(frame<2){rect('#e9dcb9',19,19,35,2);poly('#b9d6d0',[[54,16],[61,20],[54,23]]);}
  }else{rect('#674630',handX-2,handY-2,4,12);rect('#cbd8ce',handX-2,handY-20,4,18);rect('#f4f4d9',handX-2,handY-20,1,17);rect('#e5bd70',handX-7,handY-3,13,3);}
 }
 g.restore();
 if(h.id===2){
  const shield=shieldTransform(h,pose,frame),cos=Math.cos(shield.angle),sin=Math.sin(shield.angle);
  // Inverse-sample a single fixed-size shield onto the integer sprite grid.
  // Rotation changes orientation, never its physical dimensions or material.
  for(let yy=-36;yy<=36;yy+=2)for(let xx=-36;xx<=36;xx+=2){
   const u=Math.round(cos*xx+sin*yy+shield.width/2),v=Math.round(-sin*xx+cos*yy+shield.height/2);
   if(u<0||u>=shield.width||v<0||v>=shield.height)continue;
   let color=u<2||u>=26||v<2||v>=46?outline:u<5||v<5?'#efce79':u>23?'#79522c':'#b88a45';
   if(u>=11&&u<=16&&v>=3&&v<45)color=u<13?'#f4eccb':'#9eafa0';
   if(Math.abs(u-14)<5&&Math.abs(v-24)<5)color='#d7dfca';
   if(Math.abs(u-14)<3&&Math.abs(v-24)<3)color='#728d88';
   if((u===6||u===22)&&(v===8||v===40))color='#fff1c4';
   rect(color,shield.x+xx,shield.y+yy,2,2);
  }
 }
 return canvas;
}
export function drawProceduralHeroArt(g,h,x,y,pose,frame,scale=1){
 if(h.id===0&&pose==='swim'){drawProceduralSwim(g,h,x,y,frame,scale);return;}
 const shield=!!h.shield,up=!!h.shieldUp;const key=`${h.id}:${pose}:${frame}:${shield}:${up}:${!!h.brass}:${shieldTransform(h,pose,frame).angle}`;let sprite=cache.get(key);if(!sprite){sprite=raster(h,pose,frame);cache.set(key,sprite);}
 g.save();g.translate(scale===1?snapPixel(x):x,scale===1?snapPixel(y):y);g.scale((h.face||1)*scale,scale);g.imageSmoothingEnabled=false;g.drawImage(sprite,-46,-59);g.restore();
}
