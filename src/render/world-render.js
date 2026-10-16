import {drawTerrain} from './terrain-render.js?v=depth146';
import {drawMachine} from './machine-render.js?v=arc46';
import {machinePose} from './machine-animation.js?v=arc46';
import {drawVerticalWorld} from './vertical-render.js?v=transitions126';
import {drawPlunger} from '../core/plunger.js?v=arc46';
import {drawForgeMaterial} from '../core/forge-material.js?v=arc46';
import {drawPortal} from './portal-effects.js?v=transitions126';
import {drawInventoryWorld} from './inventory-render.js?v=alehall135';
import {ghostLayout} from './ghost-layout.js?v=arc46';
import {snapPixel,snapAngle,animationTime,spritePose} from './pixel-grid.js?v=arc46';
import {environmentPose} from './environment-animation.js?v=arc46';
import {interactionObjects,nearbyInteraction} from '../core/interactions.js?v=sewer149';
function sheet(src,cols,rows){
 const img=new Image(),cells=[];img.src=src;
 img.onload=()=>{const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(img,0,0);const data=g.getImageData(0,0,c.width,c.height).data;
 for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){const x0=Math.floor(col*c.width/cols),y0=Math.floor(row*c.height/rows),x1=Math.floor((col+1)*c.width/cols),y1=Math.floor((row+1)*c.height/rows);let left=x1,right=x0,top=y1,bottom=y0;for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)if(data[(y*c.width+x)*4+3]>30){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}cells[row*cols+col]={x:left,y:top,w:right-left+1,h:bottom-top+1};}};
 return {draw(ctx,row,col,x,y,w,h){const p=cells[row*cols+col];if(!p||p.w<1)return;ctx.drawImage(img,p.x,p.y,p.w,p.h,snapPixel(x),snapPixel(y),snapPixel(w),snapPixel(h));},part(ctx,row,col,u,v,uw,vh,x,y,w,h){const p=cells[row*cols+col];if(!p||p.w<1)return;ctx.drawImage(img,p.x+p.w*u,p.y+p.h*v,p.w*uw,p.h*vh,snapPixel(x),snapPixel(y),snapPixel(w),snapPixel(h));},get ready(){return cells.length===cols*rows;}};
}
const terrain=sheet('assets/pixel/foreground-tiles.png?v=pipeline44',8,6),objects=sheet('assets/pixel/world-objects.png?v=pipeline44',4,6);
const puzzles=sheet('assets/pixel/puzzle-machines.png?v=pipeline44',5,2);
export function drawWorld(ctx,s,platforms,text,box){
 const status=text.status||text,clue=text.clue||text;
 const row=s.round<6?s.round:[0,3,2,1,3][s.round-6],c=s.level.accent||'#d5ef83',m=s.level.mechanic;
 box('#0c142028',0,0,1440,790);status(s.level.name,720,43,c,18);
 function tile(col,x,y,w,h){terrain.draw(ctx,row,col,x,y,w,h);}
 function deck(x,y,w,ground=false){
  drawTerrain(ctx,s,x,y,w,ground?(s.level.worldBottom??790)-y:40);
 }
 if(s.round>=9){drawVerticalWorld(ctx,s,text,box,deck);return;}
 if(s.round>=6){for(const f of s.level.floors)deck(f.x,f.y,f.w,true);for(const f of s.level.platforms)deck(f.x,f.y,f.w);drawInventoryWorld(ctx,s,text,box);drawPortal(ctx,s.level.exit.x,s.level.exit.y-58,48,84,s.time,c,s.power);return;}
 if(s.round){
  const g=s.machine,v=environmentPose(s),time=animationTime(s.time),pulse=Math.round((Math.sin(v.phase)+1)*4)/8;
  const prop=(n,x,y,w,h)=>{let angle=0,dy=0;if(n===3)angle=v.mirrorAngle-snapAngle(Math.atan2(340-586,255));if(n===2)angle=Math.sin(v.phase*7)*v.hitStrength*.055;if(n===4){dy=Math.sin(v.phase*.7)*2;}if(n===5&&!g.parked)dy=snapPixel(Math.sin(v.phase*2)*2);if(n===7)dy=snapPixel(Math.sin(v.phase*.5)*2);if(n===8)dy=-snapPixel(pulse*2);if(n===9)dy=snapPixel(Math.sin(v.phase*.6)*2);
   ctx.save();const pose=spritePose(x+w/2,y+h+dy,w,h,angle);ctx.translate(pose.x,pose.y);ctx.rotate(pose.angle);puzzles.draw(ctx,Math.floor(n/5),n%5,-w/2,-h,w,h);ctx.restore();};
  const halo=(x,y,r,color,opacity=.4)=>{ctx.save();ctx.globalAlpha=opacity;ctx.strokeStyle=color;ctx.lineWidth=2;ctx.beginPath();ctx.arc(snapPixel(x),snapPixel(y),snapPixel(r),0,Math.PI*2);ctx.stroke();ctx.restore();};

  for(const f of s.level.floors)deck(f.x,f.y,f.w,true);
  for(const p of s.level.platforms)deck(p.x,p.y,p.w);
  const mark=(x,label,on=false,floor=610)=>{tile(6,x-28,floor-11,56,11);text(label,x,floor+30,on?'#fff3ac':c,10);};
  const meter=(x,y,value,max,label)=>{box('#111b26',x-42,y,84,9);box(c,x-40,y+2,80*Math.min(value/max,1),5);status(label,x,y-8,c,10);};
  if(m==='cargo'){
   prop(0,170,220,120,260);for(let i=0;i<4;i++){const yy=435-((time*75+i*51)%210);halo(230,yy,3+(i%2),'#79f4ff',.3+pulse*.4);}mark(230,'CHARGE · SHIELD ↑',g.charged);meter(230,520,g.charge,3,'REACTOR '+Math.floor(g.charge/3*100)+'%');
   prop(1,500,g.liftY-155,180,170);deck(500,g.liftY,180);text(g.liftOn?'LIFT · BOARD WHEN LOW':'CARGO LIFT',590,g.liftY+47,c,10);
   if(!g.hatch){objects.draw(ctx,row,3,899,340,42,50);text('BOW · HATCH LOCK',920,324,c,10);for(let y=260;y<390;y+=40)tile(3,1200,y,24,40);}
   text('UPPER DECK →',1120,425,c,13);
  }
  if(m==='bankshot'){
   drawPlunger(ctx,s,tile,box,text);mark(650,'MIRROR · SHIELD ←',s.heroes[2].shield&&s.heroes[2].face===-1);
   const ready=s.heroes[2].shield&&!s.heroes[2].shieldUp&&s.heroes[2].face===-1&&s.heroes[2].x<870;
   const targetY=[440,340,240][g.lane];ctx.save();ctx.setLineDash([7,8]);ctx.lineDashOffset=-time*25;ctx.strokeStyle=ready?'#ff91e0':'#ff91e044';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(ready?snapPixel(s.heroes[2].x-42):635,ready?snapPixel(s.heroes[2].y+20):586);ctx.lineTo(890,targetY);ctx.stroke();ctx.restore();
   prop(3,610,490,80,100);prop(2,1010,230,200,210);
   text(ready?'MIRROR READY':'OLAF: FACE ← + ALT',650,468,ready?'#cfff95':c,11);
   if(g.lastReflection){const age=animationTime(s.time-g.lastReflection.time);if(age<.35)halo(g.lastReflection.x,g.lastReflection.y,8+age*65,'#fff9b6',1-age/.35);}
   for(let i=0;i<3;i++){const y=[440,340,240][i],hit=g.lastBankHit?.lane===i?v.hitStrength:0;const dx=Math.sin(v.phase*12)*hit*4;objects.draw(ctx,row,3,869+dx,y-22,42,44);if(i===g.lane)halo(890,y,27,'#ff91e0',.55+pulse*.25);if(text.enabled!==false&&g.score<3&&i===v.nextLane)halo(890,y,34+pulse*2,'#ffe18b',.7);if(hit)halo(890,y,26+(1-hit)*30,g.lastBankHit.correct?'#b7ff93':'#ff726e',hit);
    status(['LOW','MIDDLE','HIGH'][i],890,y-42,g.lane===i?'#fff8a8':c,11);if(g.score<3&&i===v.nextLane)text('NEXT',951,y+4,'#ffe18b',10);}
   clue('COMBO: '+['MIDDLE','LOW','HIGH'].map((name,i)=>(i<g.score?'✓ ':'')+name).join(' → '),1020,140,c,14);meter(1030,472,g.score,3,'JACKPOT '+g.score+'/3');
   text('← RETURN TO THE LEFT EXIT',260,715,c,12);
  }
  if(m==='portals'){
   for(const x of [480,960])for(let y=0;y<610;y+=52)tile(3,x,y,30,52);
   status('I · BELL CHAMBER',220,240,c,15);status('II · MIRROR CHAMBER',740,220,c,15);status('III · DEPARTURE',1210,230,c,15);
   if(!g.bell){objects.draw(ctx,row,2,274,553,30,57);text('RUN → BASH',260,534,c,11);}
   mark(720,'MIRROR · SHIELD ←',g.mirror,500);objects.draw(ctx,row,3,ghostLayout.sourceX-17,445+Math.sin(v.phase)*2,34,55);if(!g.mirror)halo(ghostLayout.sourceX,ghostLayout.y,21+pulse*4,'#91efba',.35);status(g.mirror?'EYE SILENCED':'GHOST EYE',ghostLayout.sourceX,430,c,10);
   if(!g.seal){objects.draw(ctx,row,2,854,438,32,62);text(g.mirror?'Z · CUT VINES':'CURSED VINES',870,418,c,10);}
  }
  if(m==='tow'){
   prop(5,g.cartX-48,540,96,70);text(g.parked?'PARKED':'OLAF · SHIELD → + WALK',g.cartX,518,c,10);
   if(!g.brake){prop(6,295,552,50,58);text('ERIK · RUN → BASH',320,530,c,10);}
   for(let x=390;x<1040;x+=80)status(g.brake?'·':'←',x-(g.brake?0:(time*45)%80),645,c,14);
   status('UNDERPASS',600,474,c,12);mark(1030,'GARAGE',g.parked);
   objects.draw(ctx,row,3,1085,550,50,60);text(g.signal?'TRAFFIC GREEN':'BOW · TRAFFIC LAMP',1110,530,g.signal?'#b6ffa2':'#ff9a83',11);
   if(!s.power)for(let y=390;y<610;y+=44)tile(3,1190,y,24,44);
  }
  if(m==='forge'){
   if(!drawMachine(ctx,s,'dragon',1300,720,280,280))prop(9,1160,366,280,244);
   
   prop(8,930,453,140,157);for(let i=0;i<5;i++){const y=492-((time*30+i*15)%65);halo(1000+Math.sin(i*2+time)*14,y,2,'#ffbe64',.25+pulse*.35);}meter(1000,420,g.heat,3,'FORGE '+g.heat+'/3');drawForgeMaterial(ctx,s,(n,u,v,uw,vh,x,y,w,h)=>puzzles.part(ctx,Math.floor(n/5),n%5,u,v,uw,vh,x,y,w,h),box,text);
   const compression=machinePose(s).bellowsCompression;tile(3,495,553+compression,50,57-compression);tile(6,500,547+compression,40,14);for(let k=0;k<4;k++)box('#a77143',498,566+compression+k*(8-compression/4),44,2);text('RUN → BASH · BELLOWS',520,533,c,10);meter(520,510,g.air,3,'PRESSURE '+g.air+'/3');
   mark(940,'SHIELD → · CREW STAY LEFT',s.heroes[2].shield&&s.heroes[2].face===1);
   text('BORROW THE DRAGON’S FIRE',1020,205,c,15);
  }
  for(const o of interactionObjects(s)){
   if(o.kind==='portal'){ctx.globalAlpha=o.ready?1:.38;prop(4,o.x-34,o.y-56,68,100);ctx.globalAlpha=1;drawPortal(ctx,o.x,o.y-2,36,62,s.time,c,o.ready);}
   else if(o.id!=='garage-info'&&o.id!=='forge-info'){tile(o.done?5:4,o.x-22,o.y+2,44,42);if(o.id==='angle-dial'){ctx.save();ctx.translate(snapPixel(o.x),snapPixel(o.y+31));ctx.rotate(snapAngle((g.lane-1)*.5));ctx.fillStyle='#ffe9a5';ctx.fillRect(-2,-26,4,25);ctx.fillRect(-5,-30,10,7);ctx.restore();}else{ctx.fillStyle=o.done?'#baff90':'#76eaff';ctx.globalAlpha=.35+pulse*.6;ctx.fillRect(o.x+8,o.y+25,5,4);ctx.globalAlpha=1;}}
   (o.id==='angle-dial'?status:text)(o.title,o.x,o.y-14,o.done?'#fff4b2':c,10);
  }
  const near=nearbyInteraction(s);if(near)status(near.kind==='portal'?'USE / E · TRAVEL':near.done?'✓ ACTIVE':'USE / E',near.x,near.y-36,'#fff5c6',12);
  const e=s.level.exit;
  if(s.power||m!=='forge'){objects.draw(ctx,row,s.power?1:0,e.x-40,e.y-120,80,120);drawPortal(ctx,e.x,e.y-58,44,78,s.time,c,s.power);status(s.power?'EXIT · ALL THREE':'EXIT LOCKED',e.x,e.y-134,c,12);}
  return;
 }

 for(const p of s.round? s.level.platforms:platforms)deck(p.x,p.y,p.w);
 deck(0,610,1440,true);
 function plate(x,on,label){tile(6,x-27,599,54,11);if(on){ctx.fillStyle=c;ctx.globalAlpha=.25;ctx.fillRect(x-30,590,60,20);ctx.globalAlpha=1;}text(label,x,643,on?'#f9f5ce':c,10);}

 if(s.crate){objects.draw(ctx,row,2,438,553,36,57);text('Z · SWORD',456,540,c,10);}
 const collected=s.round?s.key:s.fuse,k=s.round?s.level.core:{x:675,y:148};
 if(!collected){tile(7,k.x-15,k.y+Math.sin(animationTime(s.time)*3)*3,30,28);status(s.round?'CORE':'FUSE',k.x,s.level.mechanic==='runes'?k.y-50:k.y-12,c,10);}
 if(!s.round&&!s.power){for(let yy=505;yy<610;yy+=35)tile(3,650,yy,22,35);status('POWER GATE',661,490,c,10);}
 if(m==='shield-step'){plate(310,s.heroes[2].shieldUp&&Math.abs(s.heroes[2].x-310)<30,'BOOST · SHIELD ↑');text('↑',310,491,c,24);}
 if(m==='bumper'){tile(6,303,588,64,22);text('JUMP BOOST',335,643,c,10);}

 if(m==='runes'){plate(330,s.runeA,'RUNE I');plate(540,s.runeB,'RUNE II');}
 if(m==='altar')for(let i=0;i<3;i++)plate(1030+i*80,s.altar?.[i],['I','II','III'][i]);
 for(const o of interactionObjects(s)){
  if(o.kind==='target')objects.draw(ctx,row,3,o.x-25,551,50,59);
  else tile(o.done?5:4,o.x-22,o.y+2,44,42);
  text(o.done?'✓ '+o.title:o.title,o.x,o.y-14,o.done?'#f7efb2':c,10);
 }
 const near=nearbyInteraction(s);
 if(near){const label=near.kind==='target'?(near.done?'TARGET HIT':'BOW TARGET · X'):(near.done?'✓ ACTIVE':near.ready?'USE / E':'USE / E · CHECK');status(label,near.x,near.y-34,'#fff6cc',12);}
 objects.draw(ctx,row,s.power&&!s.turret?1:0,1310,484,92,126);drawPortal(ctx,1356,550,50,80,s.time,c,s.power&&!s.turret);status(s.power&&!s.turret?'EXIT · ALL THREE':'ARCADE LOCKED',1356,470,s.power?'#edffc4':c,12);
 if(!s.round){if(s.turret){objects.draw(ctx,0,3,1180,554,48,56);status(s.grounded?'ARMOR OPEN!':'ARCADE SENTRY',1204,540,c,10);plate(1135,s.grounded,'SHIELD →');}else status('HIGH SCORE!',1205,553,c,11);}
}
