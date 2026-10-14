import {coverRect} from './background-render.js?v=arc46';
import {snapPixel} from './pixel-grid.js?v=arc46';
const effect=(kind,x,y,width,height,phase=0,layer='near')=>({kind,x,y,width,height,phase,layer});
const fire=(x,y,width=8,height=12,phase=0)=>effect('fire',x,y,width,height,phase);
const candles=(x,y,phase=0)=>[-5,0,5].map((offset,i)=>fire(x+offset,y+(i===1?-3:0),5,9,phase+i*2));
const water=(x,y,width,height,phase=0,layer='far')=>effect('water',x,y,width,height,phase,layer);
const light=(x,y,phase=0,color='#fff0a5',layer='near')=>({...effect('light',x,y,3,3,phase,layer),color});
export const backgroundEmitters=[
 [fire(35,160,4,7),fire(150,243,4,6,3),fire(704,256,4,6,5),...[64,114,184,297,346,444,495,584].map((x,i)=>light(x,i===4||i===6?127:110,i))],
 [...[138,195,252,388,444,572].map((x,i)=>light(x,20,i,'#8eeeff')),light(296,280,2,'#60d9ff'),light(350,280,5,'#60d9ff'),light(660,262,7,'#60d9ff')],
 [water(148,270,24,66,0),water(601,322,26,68,3),...[266,299,328,359,390,421,451].map((x,i)=>light(x,49-Math.abs(x-359)*.19,i))],
 [...[155,166,178,190,201].map((x,i)=>fire(x,[53,44,40,45,54][i],5,9,i)),...[528,538,548,558,568].map((x,i)=>fire(x,[62,55,51,56,63][i],5,9,i+2)),...candles(59,107,1),...candles(663,106,4),...candles(151,221,3),...candles(289,221,5),...candles(431,221,7),...candles(569,221,2),...candles(41,258,6),...candles(659,290,1),water(483,258,16,60,4),water(611,281,16,59,1)],
 [water(355,405,700,193,2),light(83,141,1,'#fff0b9'),light(691,171,4,'#fff0b9')],
 [fire(155,121,34,24,1),fire(571,140,34,24,5),fire(135,276,38,23,3),fire(84,92,20,30,7),fire(20,344,10,18,2),...[[202,157],[356,158],[363,158],[517,163],[525,163],[607,216],[639,216],[644,67],[534,241]].map(([x,y],i)=>fire(x,y,7,10,i)),...[[89,191,5,77],[198,348,5,26],[238,306,5,26],[318,272,5,42],[329,302,5,28],[390,303,5,57],[468,283,5,48],[257,405,5,30],[306,405,5,30]].map(([x,y,w,h],i)=>effect('lava',x,y,w,h,i)),...[[136,251,5,40],[286,284,5,66],[553,261,5,109],[686,237,5,75],[587,362,5,43]].map(([x,y,w,h],i)=>effect('lava',x,y,w,h,i,'far'))],
 [effect('steam',445,146,48,130,1),effect('steam',628,65,30,85,5),fire(585,239,46,29,0),fire(701,239,38,29,3),fire(585,325,46,29,5),fire(701,325,38,29,7),water(357,360,700,107,4)],
 [...[[61,91],[198,148],[297,147],[478,147],[569,147],[681,91]].map(([x,y],i)=>({...effect('magic',x,y,11,18,i),color:i%2?'#96dfff':'#ff657c'})),water(380,361,82,71,3)],
 [...[[198,80],[238,59],[466,59],[222,148],[506,234],[667,169]].map(([x,y],i)=>light(x,y,i,'#ff6267')) ,water(355,360,700,113,2)],
 [light(110,200,2,'#c3fbff'),light(600,300,6,'#c3fbff'),effect('cascade',132,265,8,70,0,'far'),effect('cascade',620,273,8,64,4,'far')],
 [light(110,200,1,'#99e8df'),light(610,300,5,'#99e8df'),effect('cascade',203,460,15,122,2,'far'),effect('cascade',518,460,15,122,5,'far'),effect('cascade',357,462,12,124,1,'far'),effect('cascade',357,643,18,156,6,'far')]
];
const farHeights=[405,405,405,405,405,405,360,360,360,720,720];
export function backgroundEffectPose(emitter,time,layout={near:{x:0,y:0,width:720},far:{x:0,y:0,width:720,height:405}},round=0){const layer=layout[emitter.layer];let scale=layer.width/720,ox=0,oy=0;if(emitter.layer==='far'){const r=coverRect(720,farHeights[round],layer.width,layer.height);scale=layer.width/r.sw;ox=r.sx;oy=r.sy;}return {kind:emitter.kind,frame:(Math.floor(time*12+1e-8)+emitter.phase)%8,x:snapPixel(layer.x+(emitter.x-ox)*scale),y:snapPixel(layer.y+(emitter.y-oy)*scale),width:Math.max(2,snapPixel(emitter.width*scale)),height:Math.max(2,snapPixel(emitter.height*scale)),sourceX:emitter.x,sourceY:emitter.y};}
const rows={fire:0,steam:1,magic:2,lava:3};
// Stable row crops keep every frame's source anchored to its wick or pipe.
const frameCrops=[[8,2,48,60],[5,2,54,61],[5,1,54,63],[14,0,36,64]];
export function drawBackgroundEffects(ctx,round,layer,time,layout,atlas){const poses=[];const spriteReady=atlas?.complete&&atlas.naturalWidth>0;ctx.save();ctx.globalAlpha=1;
 const pixel=(x,y,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(snapPixel(x),snapPixel(y),Math.max(2,snapPixel(w)),Math.max(2,snapPixel(h)));};
 for(const e of backgroundEmitters[round]){if(e.layer!==layer)continue;const p=backgroundEffectPose(e,time,layout,round);poses.push(p);const x=p.x-p.width/2,y=p.y-p.height;
  if(e.kind in rows&&spriteReady){const sw=atlas.naturalWidth/8,sh=atlas.naturalHeight/4,c=frameCrops[rows[e.kind]],sx=sw/64,sy=sh/64;if(e.kind==='steam')ctx.filter='grayscale(1)';ctx.drawImage(atlas,p.frame*sw+c[0]*sx,(rows[e.kind]*64+c[1])*sy,c[2]*sx,c[3]*sy,snapPixel(x),snapPixel(y),p.width,p.height);ctx.filter='none';}
  else if(e.kind==='steam'){for(let n=0;n<12;n++){const age=((p.frame+n*2)%16)/16,r=4+age*12,cx=p.x-age*p.width*.5+((n%3)-1)*4,cy=p.y-age*p.height;pixel(cx-r,cy-r,r*2,r,'#bfc1bf');pixel(cx-r*.65,cy-r*1.25,r*1.3,r,'#e1dfd6');}}
  else if(e.kind==='fire'||e.kind==='magic'){for(let n=0;n<5;n++){const flame=(3+((p.frame+n*3)%5))/8;pixel(x+n*p.width/5,p.y-p.height*flame,p.width/5,p.height*flame,e.kind==='magic'?'#7bdcfa':'#ff8b27');pixel(x+n*p.width/5,p.y-p.height*flame*.5,p.width/5,p.height*flame*.5,e.kind==='magic'?'#e1f5ff':'#fff1a0');}}
  else if(e.kind==='lava'){for(let n=0;n<9;n++)pixel(x+(n%3)*p.width/5,y+((n*p.height/9+p.frame*4)%p.height),p.width/3,4,'#ffd142');}
  else if(e.kind==='light'){pixel(p.x,p.y,2,p.frame<4?2:4,p.frame<4?(e.color||'#f1d7a1'):'#bc915a');}
  else if(e.kind==='cascade'){for(let n=0;n<12;n++)pixel(x+(n%3)*p.width/4,y+((n*p.height/12+p.frame*5)%Math.max(2,p.height-8)),2,6,n%3?'#88e0e8':'#ddf8ff');}
  else if(e.kind==='water'){for(let n=0;n<20;n++){const px=x+((n*47+p.frame*3)%Math.max(2,p.width)),py=y+(n*19)%Math.max(2,p.height);pixel(px,py,4+(n%4)*2,2,round===2?'#ffc973':round===4||round===6?'#dc7f9d':'#6277c2');}}
 }
 ctx.restore();return poses;
}

