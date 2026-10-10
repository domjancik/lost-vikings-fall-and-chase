from pathlib import Path
p=Path('.')
def write(f,s):(p/f).write_text(s,encoding='utf-8')
def edit(f,a,b):
 q=p/f;s=q.read_text(encoding='utf-8-sig');assert a in s,(f,a);q.write_text(s.replace(a,b),encoding='utf-8')
write('forge-material.js', '''import {snapPixel,snapAngle,animationTime} from './pixel-grid.js?v=portal30';
export const ORE_LOAD_TIME=1.3;
const clamp=v=>Math.max(0,Math.min(1,v));
export function oreReady(s){const g=s.machine;return g.ore&&(g.oreCutAt===undefined||s.time-g.oreCutAt>=ORE_LOAD_TIME);}
export function forgeMaterialPose(s){const g=s.machine;if(!g.ore)return {stage:'hanging',age:0,x:940,y:420,angle:0};const age=animationTime(Math.max(0,s.time-(g.oreCutAt??(s.time-2)))),fall=clamp((age-.18)/.5),pour=clamp((age-.68)/.62);return {stage:age<.18?'cut':age<.68?'fall':age<ORE_LOAD_TIME?'pour':'loaded',age,x:snapPixel(940+28*fall),y:snapPixel(420+24*fall*fall),angle:snapAngle(pour*.7),pour};}
export function drawForgeMaterial(ctx,s,part,box,text){const g=s.machine,p=forgeMaterialPose(s),t=animationTime(s.time);
 // Keep the hoist, basket, release chain and ore as separate pieces from the original sprite cell.
 const chain=(x,y,h)=>{for(let yy=y;yy<y+h;yy+=12)part(7,.43,0,.16,.38,x-4,yy,8,12);};
 chain(940,335,p.stage==='hanging'?54:Math.max(16,54-p.age*65));
 if(p.stage==='hanging'){chain(940,472,104);part(7,0,.4,1,.6,906,389,68,84);text('Z · CUT RELEASE CHAIN',940,316,s.level.accent,11);}
 else if(p.stage!=='loaded'){
  ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle);part(7,0,p.stage==='pour'?.68:.4,1,p.stage==='pour'?.32:.6,-34,-31,68,p.stage==='pour'?44:84);ctx.restore();
  const cut=1-Math.min(p.age/.45,1);if(cut>0){chain(snapPixel(940+p.age*20),snapPixel(552+p.age*80),16);ctx.strokeStyle='#fff1b4';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(922,586-p.age*45);ctx.lineTo(958,552+p.age*45);ctx.stroke();for(let i=0;i<8;i++){const a=i*Math.PI/4;box(i%2?'#ffbc70':'#fff6c2',940+Math.cos(a)*p.age*100,566+Math.sin(a)*p.age*100,4,4);}}
  if(p.age>=.68){for(let i=0;i<6;i++){const k=clamp((p.age-.68-i*.035)/.34);if(k>=1)continue;const x=snapPixel(984+(1000-984)*k+(i%2)*2),y=snapPixel(440+48*k-Math.sin(k*Math.PI)*12);part(7,.25,.4,.48,.23,x-7,y-7,14,14);}}
  text(p.stage==='cut'?'CHAIN CUT!':p.stage==='fall'?'ORE RELEASED':'POURING INTO CRUCIBLE',1000,395,'#ffe3a0',11);
 }
 if(oreReady(s)){
  // Material stays visible in the forge and responds to each redirected flame.
  const hit=Math.max(0,1-(s.time-(g.lastForgeHit??-10))/.55);for(let i=0;i<4;i++){part(7,.25,.4,.48,.23,976+i*11,478-(i%2)*4,18,14);if(g.heat){box(['#bc72de','#db8187','#ffb358','#ffe5a0'][g.heat],978+i*11,480-(i%2)*4,12,6);}}
  if(hit){ctx.strokeStyle='#fff1b5';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(1000,488,snapPixel(15+(1-hit)*35),snapPixel(6+(1-hit)*12),0,0,Math.PI*2);ctx.stroke();for(let i=0;i<7;i++)box('#ffd282',1000+Math.cos(i*2.4)*(1-hit)*45,480-Math.sin(i*2.4)*(1-hit)*30-(1-hit)*20,4,4);}
  if(g.heat<3)text('ORE LOADED · '+g.heat+'/3 HEAT',1000,395,'#ffd695',11);
 }
}
''')
edit('campaign.js',"import {startBash", "import {oreReady} from './forge-material.js?v=portal30';\nimport {startBash")
edit('campaign.js',"g.ore=true;feedback(s,'Ore released into the crucible. Fill the bellows and deflect dragon fire.');", "g.ore=true;g.oreCutAt=s.time;feedback(s,'Release chain cut! The basket is falling and tipping ore into the crucible. Position Olaf before pumping the bellows.');")
edit('campaign.js',"if(m==='forge'&&g.ore&&g.air>0", "if(m==='forge'&&oreReady(s)&&g.air>0")
edit('campaign.js',"if(g.ore&&g.air>0){g.air--;", "if(oreReady(s)&&g.air>0){g.lastForgeHit=s.time;g.air--;")
edit('world-render.js',"import {drawPortal}", "import {drawForgeMaterial} from './forge-material.js?v=portal30';\nimport {drawPortal}")
edit('world-render.js','get ready(){return cells.length===cols*rows;}', '''part(ctx,row,col,u,v,uw,vh,x,y,w,h){const p=cells[row*cols+col];if(!p||p.w<1)return;ctx.drawImage(img,p.x+p.w*u,p.y+p.h*v,p.w*uw,p.h*vh,snapPixel(x),snapPixel(y),snapPixel(w),snapPixel(h));},get ready(){return cells.length===cols*rows;}''')
edit('world-render.js',"if(!g.ore){prop(7,915,335,55,265);text('Z · CUT ORE CHAIN',940,316,c,11);}", "")
edit('world-render.js',"meter(1000,420,g.heat,3,'FORGE '+g.heat+'/3');", "meter(1000,420,g.heat,3,'FORGE '+g.heat+'/3');drawForgeMaterial(ctx,s,(n,u,v,uw,vh,x,y,w,h)=>puzzles.part(ctx,Math.floor(n/5),n%5,u,v,uw,vh,x,y,w,h),box,text);")
edit('game.js',"import {TRANSIT_DURATION", "import {forgeMaterialPose} from './forge-material.js?v=portal30';\nimport {TRANSIT_DURATION")
edit('game.js','canvas.dataset.environment=JSON.stringify', "canvas.dataset.forgeMaterial=s.round===5?JSON.stringify(forgeMaterialPose(s)):'';canvas.dataset.environment=JSON.stringify")
for f in ['build.mjs','publish-update.mjs']:edit(f,"'engine.js',","'engine.js','forge-material.js',")
for q in list(p.glob('*.js'))+[p/'index.html']:
 s=q.read_text(encoding='utf-8-sig');q.write_text(s.replace('portal30','forge31'),encoding='utf-8')
