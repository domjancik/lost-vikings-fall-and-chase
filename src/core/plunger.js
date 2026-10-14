import {snapPixel,animationTime} from '../render/pixel-grid.js?v=arc46';
export const onPlunger=h=>h.ground&&h.support!==2&&Math.abs(h.x-335)<48&&Math.abs(h.y+44-610)<2;
export function updatePlunger(s,dt){const target=s.heroes.some(onPlunger)?1:0,g=s.machine,value=g.plungerCompression||0;g.plungerCompression=value<target?Math.min(target,value+dt*10):Math.max(target,value-dt*7);}
export function plungerPose(s){const age=s.machine.plungerAt===undefined?Infinity:animationTime(Math.max(0,s.time-s.machine.plungerAt)),pressed=s.heroes.some(onPlunger);const compression=s.machine.plungerCompression||0;let capY=594+16*compression,stage=pressed?(compression<.98?'compressing':'compressed'):'idle';
 if(age<.12){stage='release';capY=610-24*Math.min(age/.1,1);}else if(age<.65){stage='settle';capY=594-Math.sin((age-.12)*28)*6*(1-(age-.12)/.53);}
 return {stage,age:Number.isFinite(age)?age:null,capY:snapPixel(capY),springBottom:626,pressed};}
export function drawPlunger(ctx,s,tile,box,text){const p=plungerPose(s);tile(6,303,610,64,22);box('#26182d',311,590,48,36);box('#b64f90',307,588,4,38);box('#b64f90',359,588,4,38);box('#efc77e',307,586,4,4);box('#efc77e',359,586,4,4);
 const top=p.capY+8,bottom=p.springBottom;ctx.strokeStyle='#efcf8e';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(335,snapPixel(top));for(let i=1;i<=8;i++)ctx.lineTo(i===8?335:i%2?319:351,snapPixel(top+(bottom-top)*i/8));ctx.stroke();tile(6,309,p.capY,52,8);
 if(p.age!==null&&p.age<.45){for(let i=0;i<8;i++){const a=i*Math.PI/4,r=12+p.age*70;box(i%2?'#ffb9e9':'#fff1b0',335+Math.cos(a)*r,602+Math.sin(a)*r*.5,4,4);}(text.status||text)('BOING!',335,558-Math.round(p.age*25),'#fff0b0',13);}
 text('JUMP Â· PLUNGER',335,653,s.level.accent,10);}
