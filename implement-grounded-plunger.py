from pathlib import Path
p=Path('.')
def write(f,s): (p/f).write_text(s,encoding='utf-8')
def edit(f,a,b):
 q=p/f;s=q.read_text(encoding='utf-8-sig');assert a in s,(f,a);q.write_text(s.replace(a,b),encoding='utf-8')
write('parallax-render.js','''import {drawBackground} from './background-render.js?v=forge31';
import {parallaxOffsets} from './view-camera.js?v=forge31';
import {snapPixel} from './pixel-grid.js?v=forge31';
// Native atlas alpha bounds: trim the transparent bottom margin before floor anchoring.
const atlasBottom=[211,211,211,210,211,211];
export function groundedLayer(camera,size,visibleFraction,ground=610){const height=snapPixel(size*visibleFraction),y=snapPixel(ground-camera.y-height);return {y,height,bottom:y+height,ground};}
export function drawParallax(ctx,image,atlas,round,camera,view){
 const layers=parallaxOffsets(camera);ctx.save();ctx.translate(camera.x,camera.y);
 const width=Math.max(1440,view.width),height=790;const crop=drawBackground(ctx,image,layers[0].x,layers[0].y,width,height);
 if(round<6&&atlas.complete&&atlas.naturalWidth){const cellW=atlas.naturalWidth/3,cellH=atlas.naturalHeight/2,col=round%3,row=Math.floor(round/3),fraction=atlasBottom[round]/240;
  for(let i=1;i<3;i++){const layer=layers[i],size=i===1?480:640,layout=groundedLayer(camera,size,fraction);layers[i]={...layer,...layout};ctx.globalAlpha=1;for(let x=layer.x-size;x<view.width+size;x+=size){ctx.drawImage(atlas,col*cellW,row*cellH,cellW,cellH*fraction,x,layout.y,size,layout.height);}}
 }
 ctx.restore();return {crop,layers,width,height};
}
''')
write('plunger.js','''import {snapPixel,animationTime} from './pixel-grid.js?v=forge31';
export const onPlunger=h=>h.ground&&h.support!==2&&Math.abs(h.x-335)<48&&Math.abs(h.y+44-610)<2;
export function plungerPose(s){const age=s.machine.plungerAt===undefined?Infinity:animationTime(Math.max(0,s.time-s.machine.plungerAt)),pressed=s.heroes.some(onPlunger);let capY=pressed?610:594,stage=pressed?'compressed':'idle';
 if(age<.12){stage='release';capY=610-24*Math.min(age/.1,1);}else if(age<.65){stage='settle';capY=594-Math.sin((age-.12)*28)*6*(1-(age-.12)/.53);}
 return {stage,age:Number.isFinite(age)?age:null,capY:snapPixel(capY),springBottom:626,pressed};}
export function drawPlunger(ctx,s,tile,box,text){const p=plungerPose(s);tile(6,303,610,64,22);box('#26182d',311,590,48,36);box('#b64f90',307,588,4,38);box('#b64f90',359,588,4,38);box('#efc77e',307,586,4,4);box('#efc77e',359,586,4,4);
 const top=p.capY+8,bottom=p.springBottom;ctx.strokeStyle='#efcf8e';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(335,snapPixel(top));for(let i=1;i<=8;i++)ctx.lineTo(i===8?335:i%2?319:351,snapPixel(top+(bottom-top)*i/8));ctx.stroke();tile(6,309,p.capY,52,8);
 if(p.age!==null&&p.age<.45){for(let i=0;i<8;i++){const a=i*Math.PI/4,r=12+p.age*70;box(i%2?'#ffb9e9':'#fff1b0',335+Math.cos(a)*r,602+Math.sin(a)*r*.5,4,4);}text('BOING!',335,558-Math.round(p.age*25),'#fff0b0',13);}
 text('JUMP · PLUNGER',335,653,s.level.accent,10);}
''')
edit('movement.js',"import {damage}","import {onPlunger} from './plunger.js?v=forge31';\nimport {damage}")
edit('movement.js',"h.vy=s.level?.mechanic==='bankshot'&&Math.abs(h.x-335)<48?-800:-570;", "const boosted=s.level?.mechanic==='bankshot'&&onPlunger(h);if(boosted)s.machine.plungerAt=s.time;h.vy=boosted?-800:-570;")
edit('world-render.js',"import {drawForgeMaterial}","import {drawPlunger} from './plunger.js?v=forge31';\nimport {drawForgeMaterial}")
edit('world-render.js',"tile(6,303,588,64,22);text('JUMP · PLUNGER',335,638,c,10);", "drawPlunger(ctx,s,tile,box,text);")
edit('game.js',"import {forgeMaterialPose}","import {plungerPose} from './plunger.js?v=forge31';\nimport {forgeMaterialPose}")
edit('game.js','canvas.dataset.forgeMaterial=', "canvas.dataset.plunger=s.round===2?JSON.stringify(plungerPose(s)):'';canvas.dataset.forgeMaterial=")
for f in ['build.mjs','publish-update.mjs']:edit(f,"'engine.js',","'engine.js','plunger.js',")
for q in list(p.glob('*.js'))+[p/'index.html']:
 s=q.read_text(encoding='utf-8-sig');q.write_text(s.replace('forge31','ground32'),encoding='utf-8')
