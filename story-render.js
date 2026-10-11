import {drawTerrain} from './terrain-render.js?v=terrain48';
import {drawInteractionArt} from './interaction-art.js?v=ground51';
import {platformSupports} from './story-visuals.js?v=ground51';
import {drawMiddleScenery} from './midground-render.js?v=ground51';
import {sceneResolution,prepareScenePixels} from './scene-resolution.js?v=native47';
import {createAtlas} from './sprite-atlas.js?v=arc46';
import {storyObjects,storyWalls} from './story-campaign.js?v=support57';
import {snapPixel,animationTime} from './pixel-grid.js?v=arc46';
import {drawPortal} from './portal-effects.js?v=arc46';
import {ease,gateFrameRects} from './story-mechanisms.js?v=arc46';
const art=createAtlas('assets/campaign46/machines.png?v=arc46',8,4,true);
const frames=createAtlas('assets/campaign46/machines.png?v=arc46',8,4);
const scenes=new Map(),preparedScenes=new Map(),sourcePixels=new Map();
function sceneImage(round){if(!scenes.has(round)){const im=new Image();im.src=round===7?'assets/scale50/pub-far.png?v=scale50':'assets/campaign46/scene-'+round+'.png?v=native47';scenes.set(round,im);}return scenes.get(round);}
function displayScene(round,width,height){
 const image=sceneImage(round);if(!image.complete||!image.naturalWidth)return null;
 if(typeof document==='undefined')return image;
 const key=round+':'+width+':'+height;if(preparedScenes.has(key))return preparedScenes.get(key);
 if(!sourcePixels.has(round)){const c=document.createElement('canvas');c.width=image.naturalWidth;c.height=image.naturalHeight;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(image,0,0);sourcePixels.set(round,g.getImageData(0,0,c.width,c.height).data);}
 const c=document.createElement('canvas');c.width=width;c.height=height;const g=c.getContext('2d'),pixels=g.createImageData(width,height);pixels.data.set(prepareScenePixels(sourcePixels.get(round),image.naturalWidth,image.naturalHeight,width,height));g.putImageData(pixels,0,0);
 if(preparedScenes.size>=12)preparedScenes.delete(preparedScenes.keys().next().value);preparedScenes.set(key,c);return c;
}
const palettes=['#2b241a','#152331','#18252b','#24352b','#30232f','#13282f','#202425','#292821'];
export function drawStoryItem(ctx,type,x,bottom,w,h){if(!art.image.complete||!art.image.naturalWidth)return false;art.draw(ctx,type==='archive'?16:14,x-w/2,bottom-h,w,h);return true;}
export function drawStoryBackground(ctx,s,camera,view){
 if(s.round===7){
  // Pub bays have authored human references. Resizing the viewport must never
  // enlarge their furniture; their farther plane is smaller than middle bays.
  const w=384,h=256,im=displayScene(7,192,128),shift=snapPixel(camera.x*.78),y=418,tiles=[];
  ctx.fillStyle=palettes[7];ctx.fillRect(camera.x,camera.y,view.width,view.height);
  for(let n=Math.floor((camera.x-shift)/w);n<=Math.floor((camera.x+view.width-shift)/w);n++){const x=n*w+shift;tiles.push(x);if(im)ctx.drawImage(im,x,y,w,h);}
  const middle=drawMiddleScenery(ctx,7,camera,view);
  return {x:tiles[0],y,size:w,height:h,tiles,native:[192,128],ready:!!im,source:sceneImage(7).src,ground:610,middle};
 }
 const resolution=sceneResolution(view),im=displayScene(s.round,resolution.nativeWidth,resolution.nativeHeight),w=resolution.width,h=resolution.height,travel=Math.max(1,3200-view.width),fraction=Math.min(1,Math.max(0,camera.x/travel));
 const x=snapPixel(camera.x-(w-view.width)*fraction),y=snapPixel(camera.y-(h-view.height)*.35);
 ctx.fillStyle=palettes[s.round];ctx.fillRect(camera.x,camera.y,view.width,view.height);if(im)ctx.drawImage(im,x,y,w,h);
 // Complete architecture layers retain their own support planes. No isolated
 // transparent building cutouts: the bases and pillars share one transform.
 const base=s.round===5?810:610;ctx.fillStyle=palettes[s.round];ctx.fillRect(camera.x,base,view.width,s.level.worldBottom-base);
 const middle=drawMiddleScenery(ctx,s.round,camera,view);
 return {x,y,size:w,height:h,tiles:[x],native:[resolution.nativeWidth,resolution.nativeHeight],ready:!!im,source:sceneImage(s.round).src,ground:base,middle};
}
export function drawStoryWorld(ctx,s,text,box){const g=s.machine,t=animationTime(s.time),c=s.level.accent,status=text.status||text;
 const sprite=(n,x,bottom,w=60,h=60)=>art.draw(ctx,n,x-w/2,bottom-h,w,h);
 // Posts are behind every deck and extend into their actual lower footing.
 for(const p of s.level.platforms)for(const r of platformSupports(s.level,p)){box(palettes[s.round],r.x,r.y,r.w,r.h);box(c+'66',r.x,r.y,4,r.h);box('#756955',r.x-4,r.floor-6,r.w+8,8);}
 const wire=(x,y,toX,toY,on)=>{const yy=Math.min(y,toY)-120;ctx.strokeStyle=on?c:'#625846';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(snapPixel(x),snapPixel(y));ctx.lineTo(snapPixel(x),snapPixel(yy));ctx.lineTo(snapPixel(toX),snapPixel(yy));ctx.lineTo(snapPixel(toX),snapPixel(toY));ctx.stroke();if(on){const span=Math.abs(toX-x),p=snapPixel(x+Math.sign(toX-x)*(Math.floor(t*100)%Math.max(1,span)));box('#f7efd3',p,yy-2,8,4);}};
 for(const p of [...s.level.floors,...s.level.platforms]){
  drawTerrain(ctx,s,p.x,p.y,p.w,s.level.platforms.includes(p)?64:s.level.worldBottom-p.y);

 }
 for(const l of g.lifts){box('#121b20',l.x+6,l.high-20,8,l.low-l.high+40);box('#121b20',l.x+l.w-14,l.high-20,8,l.low-l.high+40);box(c+'66',l.x+8,l.high-20,2,l.low-l.high+40);box(c+'66',l.x+l.w-12,l.high-20,2,l.low-l.high+40);sprite(12,l.x+l.w/2,l.y+24,l.w,26);box('#f8e7bc',l.x,l.y,l.w,4);for(const y of [l.low,l.high]){box('#172126',l.x-28,y,28,24);box('#172126',l.x+l.w,y,28,24);} }
 for(const d of g.gates){const w=storyWalls(s).find(v=>v.id===d.id);for(const r of gateFrameRects(d))box('#191c22',r.x,r.y,r.w,r.h);ctx.save();ctx.beginPath();ctx.rect(d.x-12,d.y-d.h,56,d.h);ctx.clip();sprite(8,d.x+16,w.bottom,32,d.h);ctx.restore();box(c,d.x-8,d.y-d.h-12,48,6);if(d.secured)sprite(10,d.x+15,d.y-d.h-20,24,30);}
 for(const p of g.treads){sprite(9,p.x,p.y+8,64,p.held?10:16);const d=g.gates.find(v=>v.id===p.gate);wire(p.x,p.y-12,d.x+16,d.y-16,p.held||d.secured);}
 for(const obj of storyObjects(s)){const isLift=obj.id.startsWith('lift-');if(obj.id.startsWith('body'))sprite(23,obj.x,obj.y+44,50,56);else drawInteractionArt(ctx,isLift?'lift':'lever',ease(g.visuals?.[obj.id]||0),obj.x-(isLift?54:0),obj.y+44);if(Math.abs(s.heroes[s.active].x-obj.x)<70&&Math.abs(s.heroes[s.active].y-obj.y)<60)status(obj.done?'SECURED':obj.title,obj.x,obj.y-22,obj.done?'#b6d4a4':obj.ready?c:'#d78d8a',10);}
 for(const v of g.targets){sprite(13,v.x,v.y+18,38,38);const base=[...s.level.floors,...s.level.platforms].find(p=>v.x>=p.x&&v.x<=p.x+p.w&&p.y>=v.y);if(base)box('#52666d',v.x-3,v.y+18,6,base.y-v.y-18);if(v.hit){box('#111c24',v.x-9,v.y-9,18,18);const fall=Math.min(24,(s.time-(v.hitAt??s.time))*80);for(let i=0;i<4;i++)box('#fdccab',v.x-15+i*8,v.y+14+fall+i%2*4,4,4);}else{for(let n=0;n<4;n++)box('#edf1df',v.x-8+n*4,v.y-10+n*4,2,4);if(Math.floor(t*3)%2)box('#ffe3bf',v.x-5,v.y-5,4,4);}if(Math.abs(s.heroes[s.active].x-v.x)<100)status('GLASS DIAPHRAGM',v.x,v.y-36,c,10);}
 for(const cut of g.cuts){const p=cut.payload,anchor=cut.x,top=Math.min(p.fromY,p.toY)-100;sprite(11,anchor,610,40,56);box('#28343a',anchor-46,top,12,610-top);box('#475961',anchor-46,top,p.fromX-anchor+92,12);sprite(9,anchor,top+20,24,20);const released=cut.cut,age=released?Math.min(1,(s.time-cut.cutAt)/.35):0;ctx.strokeStyle='#f6e2b1';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(anchor,556);if(!released){ctx.lineTo(anchor,top+12);ctx.lineTo(p.x,top+12);ctx.lineTo(p.x,p.y-30);}else ctx.lineTo(snapPixel(anchor+20),snapPixel(556-age*24));ctx.stroke();if(released)for(let i=0;i<5;i++)box('#e8c48f',anchor+20+i*4,552-age*24+i%2*4,2,4);}
 for(const p of g.payloads){const n={weight:18,packet:20,reed:20,stamp:19,gill:21}[p.kind];if(p.fromY!==p.toY){box('#171d23',p.x-48,Math.min(p.fromY,p.toY)-80,6,Math.abs(p.toY-p.fromY)+100);box('#171d23',p.x+42,Math.min(p.fromY,p.toY)-80,6,Math.abs(p.toY-p.fromY)+100);}else{box('#182127',p.fromX-40,p.y+16,p.toX-p.fromX+80,14);for(let x=p.fromX-30;x<p.toX+30;x+=48)sprite(9,x,p.y+42,24,20);}sprite(n,p.x,p.y+16,80,80);if(p.arrived)box(c,p.x-24,p.y-30,48,4);}
 const output=g.payloads[0],outputGate=s.round===0?'weight':s.round===2?'residents':s.round===3?'stamp':null;if(outputGate){const d=g.gates.find(v=>v.id===outputGate);wire(output.toX,output.toY,d.x+16,d.y-30,output.arrived);}
 for(const i of s.items){sprite(i.type==='archive'?16:14,i.x,i.y+44,32,36);if(Math.abs(i.x-s.heroes[s.active].x)<90)status('USE Â· PICK UP',i.x,i.y-10,c,10);}
 if(s.round===0){drawInteractionArt(ctx,'wafer',ease(g.visuals?.wafer||0),1500,610);wire(1500,550,1750,550,g.flags.wafer);}
 if(s.round===1){wire(700,552,1100,566,g.flags.route);wire(1660,580,1922,590,g.payloads[0].arrived);}
 if(s.round===2){sprite(24,1800,610,76,78);box('#172023',1460,510,80,16);box(c,1464,514,72*g.work,8);wire(690,385,1500,536,g.flags.isolated);sprite(20,1562,608,84,42);box(c,1532,580,60*ease(g.workPose||0),6);}
 if(s.round===4){sprite(17,1200,610,72,64);sprite(20,1400,610,110,106);wire(1200,574,1400,580,g.copying||g.flags.copied);if(g.copying){const p=g.copy<.5?ease(g.copy*2):1-ease((g.copy-.5)*2);sprite(16,snapPixel(1200+p*200),592,36,40);}if(g.flags.copied)box('#fff1bd',1360,545,80,6);}
 if(s.round===5){
  box('#25424b',2578,320,12,490);box('#547e88',2492,320,98,18);sprite(13,2530,350,34,34);if(s.time%1.2>.85)box('#f2b6af',2524,344,12,8);
  // The canopy opens onto the physical pub and its three waiting bodies.
  // Its rails, shutters and viewing window stay at their authored coordinates.
  const p=ease(g.payloads[0].progress),x=2130,y=-120;box('#0d1921',x-12,y-12,344,230);box('#7db4bd',x-10,y-10,340,6);box('#7db4bd',x-10,y+206,340,6);box('#4f7781',x+12,y+212,10,38);box('#4f7781',x+298,y+212,10,38);
  const outside=sceneImage(5),bodies=sceneImage(0);if(outside.complete&&outside.naturalWidth)ctx.drawImage(outside,475,10,255,150,x,y,320,200);if(bodies.complete&&bodies.naturalWidth)ctx.drawImage(bodies,380,80,190,90,x+56,y+110,208,76);
  ctx.save();ctx.beginPath();ctx.rect(x,y,320,200);ctx.clip();for(const [n,dir]of [[0,-1],[1,1]]){const xx=snapPixel(x+n*160+dir*p*164);for(let yy=y;yy<y+200;yy+=40)art.draw(ctx,21,xx,yy,160,40);}ctx.restore();wire(1310,480,x+160,y+200,g.payloads[0].released);if(p===1)status('THREE BODIES Â· BEYOND THE GLASS',x+160,y-28,c,11);
 }
 if(s.round===7&&g.payloads[0].arrived){
  // Water follows the lowered gutter into its supported side drain.
  box('#789196',2080,568,170,10);box('#526970',2240,572,12,38);for(let n=0;n<7;n++){const xx=snapPixel(2110+(Math.floor(t*80)+n*17)%130);box('#b9d5df',xx,564,6,4);}for(let n=0;n<5;n++)box('#91b5c7',2244,578+(Math.floor(t*95)+n*7)%26,2,6);
 }
 if(s.round===6){drawInteractionArt(ctx,'archive',ease(g.visuals?.archive||0),950,610);for(const [i,x]of [[0,1050],[1,1140],[2,1230]]){sprite(22,x,480,60,130);box('#a8dfe0',x-12,466-72*(1-g.reset),24,72*(1-g.reset));wire(x,490,1500,550,g.resetting);}for(let n=0;n<3;n++){wire(1500,554,2000+n*300,500,g.reset>=1);if(g.transferred[n]){sprite(16,2000+n*300,522,24,28);box(c,1980+n*300,550,40,4);}}}
 for(const e of s.enemies){if(e.hp<=0&&s.time-e.deadAt>1)continue;const frame=Math.floor(t*8+e.phase)%4,index=(s.round===2?24:28)+frame;ctx.save();ctx.translate(snapPixel(e.x),snapPixel(e.y+44));if(e.face<0)ctx.scale(-1,1);if(e.hp<=0){ctx.globalAlpha=Math.max(0,1-(s.time-e.deadAt));ctx.rotate(Math.PI/2);}frames.draw(ctx,index,-34,-80,68,80);ctx.restore();if(e.hp>0&&s.time>e.shotAt-.45&&s.time<e.shotAt)status('!',e.x,e.y-24,'#ffba90',16);}
 if(s.round!==6){const e=s.level.exit;sprite(8,e.x-55,e.y,28,130);sprite(8,e.x+55,e.y,28,130);box(c,e.x-70,e.y-140,140,10);if(s.power){if(s.round!==7)drawPortal(ctx,e.x,e.y-60,42,90,s.time,c,true);else{box('#c5dadd',e.x-44,e.y-128,88,128);for(let n=0;n<9;n++)box('#789cb2',e.x-34+n*9,e.y-126+(Math.floor(t*120)+n*17)%116,2,8);}}status(s.round===7?'OUTSIDE':s.power?'ALL THREE':'OUTPUT SEALED',e.x,e.y-153,c,11);}
}
