import {storyFarLayout} from './story-background.js?v=far45';
import {createAtlas as atlas} from './sprite-atlas.js?v=far45';
import {storyDoors,storyObjects,storyWalls} from './story-campaign.js?v=far45';
import {drawItemSprite} from './inventory-render.js?v=far45';
import {itemTypes} from './inventory.js?v=far45';
import {drawMachine} from './machine-render.js?v=far45';
import {drawPortal} from './portal-effects.js?v=far45';
import {snapPixel,animationTime,snapAngle} from './pixel-grid.js?v=far45';
const doors=atlas('assets/pixel/story-doors.png?v=pipeline44',4,2);
const far=atlas('assets/pixel/story-far.png?v=pipeline44',4,2),near=atlas('assets/pixel/story-near.png?v=pipeline44',4,2),enemyArt=atlas('assets/pixel/story-enemies.png?v=pipeline44',4,4),terrain=atlas('assets/pixel/foreground-tiles.png?v=pipeline44',8,6,true),objects=atlas('assets/pixel/world-objects.png?v=pipeline44',4,6,true),puzzles=atlas('assets/pixel/puzzle-machines.png?v=pipeline44',5,2,true),fx=atlas('assets/pixel/background-fx.png?v=pipeline44',8,4);
export function drawStoryBackground(ctx,s,camera,view){const index=s.level.scene,t=animationTime(s.time),layout=storyFarLayout(camera,view);ctx.fillStyle='#141b26';ctx.fillRect(camera.x,camera.y,view.width,view.height);
 for(const x of layout.tiles)far.draw(ctx,index,x,layout.y,layout.size,layout.size);
 const shift=snapPixel(camera.x*.25);for(const [i,x] of [180,1100,2080].entries()){const width=s.round===7?720:630;near.draw(ctx,index,x+shift,snapPixel(610-width*.96),width,width);}
 // Authored emitters and weather use independent, discrete clocks.
 if(s.round===3)for(const x of [560,1250,2200]){fx.draw(ctx,8+Math.floor(t*12+x/73)%8,x,370,48,64);fx.draw(ctx,Math.floor(t*12+x/29)%8,x+120,520,38,74);}
 if([0,7].includes(s.round))for(let i=0;i<45;i++){const x=snapPixel(camera.x+(i*79+Math.floor(t*40))%(view.width+40)),y=snapPixel(camera.y+(i*83+Math.floor(t*240))%(view.height+40));ctx.fillStyle='#a3b6c4';ctx.fillRect(x,y,2,8);}
 return layout;
}
export function drawStoryWorld(ctx,s,text,box){const g=s.machine,c=s.level.accent,t=animationTime(s.time),status=text.status||text,row=[0,1,3,5,3,1,3,0][s.round];
 const tile=(n,x,y,w,h)=>terrain.draw(ctx,row*8+n,x,y,w,h);
 const deck=p=>{for(let x=p.x;x<p.x+p.w;x+=48)tile(1,x,p.y,Math.min(48,p.x+p.w-x),30);tile(0,p.x,p.y,24,30);tile(2,p.x+p.w-24,p.y,24,30);if(s.level.floors.includes(p)&&p.y>=610)for(let y=p.y+30;y<s.level.worldBottom;y+=64)for(let x=p.x;x<p.x+p.w;x+=64)tile(3,x,y,Math.min(64,p.x+p.w-x),64);else for(let x=p.x+12;x<p.x+p.w;x+=160)tile(3,x,p.y+30,12,48);};
 for(const p of [...s.level.floors,...s.level.platforms])deck(p);
 const prop=(n,x,bottom,w=64,h=74)=>objects.draw(ctx,row*4+n,x-w/2,bottom-h,w,h);
 const gate=(x,top,bottom,open)=>{const width=28;if(!open)for(let y=top;y<bottom;y+=48)tile(3,x,y,width,Math.min(48,bottom-y));box(open?'#81d9a9':'#cc9d69',x-4,bottom-104,width+8,6);};
 for(const w of storyWalls(s))if(w.on)gate(w.x,Math.max(w.top,300),w.bottom,false);
 for(const d of storyDoors(s)){const ready=!d.lock||g[d.lock];doors.draw(ctx,(s.round===2?4:s.round===0||s.round===7?0:s.round===6?6:2)+(ready?1:0),d.x-54,d.y-120,108,126);if(ready&&s.round===2)drawPortal(ctx,d.x,d.y-54,30,62,s.time,c,true);status(d.id.toUpperCase(),d.x,d.y-123,ready?c:'#99899c',10);if(Math.abs(s.heroes[s.active].x-d.x)<52&&Math.abs(s.heroes[s.active].y+44-d.y)<62)status(ready?'USE · ENTER':'SEALED',d.x,d.y-144,ready?'#fff0ad':'#df9286',10);}
 for(const i of s.items){drawItemSprite(ctx,itemTypes[i.type].icon,i.x,i.y+44,30,30);status(itemTypes[i.type].name.toUpperCase(),i.x,i.y-12,c,10);}
 for(const b of s.bombs){drawItemSprite(ctx,10,b.x,b.y+14,28,28);status(b.fuse.toFixed(1),b.x,b.y-26,'#ffd192',11);}
 if(s.blast&&s.time-s.blast.time<.45){const age=animationTime(s.time-s.blast.time);for(let i=0;i<12;i++)box(i%2?'#ffe59b':'#ef985f',s.blast.x+Math.cos(i)*age*160,s.blast.y+Math.sin(i)*age*160,6,6);}
 const machine=(x,y,label,on=false)=>{tile(on?5:4,x-24,y+44-38,48,38);status(label,x,y-16,on?'#caffab':c,11);};
 for(const obj of storyObjects(s).filter(o=>o.kind!=='story-door'))machine(obj.x,obj.y,obj.title,obj.id==='dispatch'?g.dispatch:obj.id==='telescope'?g.aligned:obj.id==='interlock'?g.interlock:obj.id.startsWith('transfer')?g.transferred[+obj.id.slice(-1)]:obj.id.startsWith('draft')?g.drafts[+obj.id.slice(-1)]:false);
 if(s.round===0){drawItemSprite(ctx,11,880,600,34,52);if(!g.cable){prop(2,1640,610,42,64);status('CABINET TETHER',1640,525,c,11);}status('LAST SERVICE · STAFF ONLY',890,330,c,12);}
 if(s.round===1){puzzles.draw(ctx,5,g.cartX-60,530,120,80);status(g.parked?'DELIVERED':'UNOPENED PARCEL',g.cartX,500,c,11);prop(3,1790,610,42,56);status(g.delivery?'BERTH READY':'DELIVERY LOCK',1790,535,c,11);box('#7b879d',2380,604,130,6);}
 if(s.round===2){if(!g.bell){prop(2,550,610,40,64);status('STONE BELL',550,520,c,11);}prop(3,1320,540,38,60);status(g.mirror?'EYE RELEASED':'RETURNING EYE',1320,470,c,11);if(!g.seal){prop(2,1670,610,42,70);status('BOUND DOOR',1670,522,c,11);}}
 if(s.round===3){ctx.save();ctx.translate(990,0);drawMachine(ctx,s,'dragon',1300,720,280,280);ctx.restore();puzzles.draw(ctx,8,1950,440,140,170);if(!g.ore)puzzles.draw(ctx,7,1740,315,110,200);else{const age=animationTime(s.time-g.oreCutAt),progress=Math.min(1,age/1.33),x=snapPixel(1800+220*progress);if(progress<1){puzzles.draw(ctx,7,x-40,470+progress*60,80,110);for(let i=0;i<6;i++)box('#c5a0e7',x-10+i*5,540+progress*45+i%2*8,4,4);}else for(let i=0;i<6;i++)box(g.heat?'#ffa658':'#a183c8',1990+i*10,484+i%2*6,8,6);}status('FORGE '+g.heat+'/3',2020,417,c,12);const press=snapPixel(Math.sin(Math.min(Math.max(0,s.time-g.lastPump)/.5,1)*Math.PI)*18);tile(3,825,553+press,50,57-press);tile(6,830,547+press,40,14);status('PRESSURE '+g.air+'/3',850,515,c,11);drawMachine(ctx,s,'oven',2410,612,132,132);status(g.baked?'TICKET READY':'DEPARTURE OVEN',2410,448,c,11);}
 if(s.round===4){drawItemSprite(ctx,9,900,610,82,82);status(g.gallery?'RED PROJECTION':'PROJECTOR',900,500,c,11);if(g.gallery){box('#d86f9b',900,551,100,4);drawItemSprite(ctx,7,922,565,26,26);}drawItemSprite(ctx,15,1850,610,100,86);if(g.safe)box('#161926',1828,553,42,44);status(g.safe?'VAULT OPEN':'ARCHIVE VAULT',1850,501,c,11);drawItemSprite(ctx,6,2520,610,36,60);}
 if(s.round===5){for(const [i,x,bottom] of [[0,490,690],[1,1460,370]]){puzzles.draw(ctx,6,x-45,bottom-70,90,70);if(g.drafts[i]){for(let n=0;n<32;n++){const yy=bottom-(Math.floor(t*165)+n*29)%520;box('#9bdde3',x-50+(n*23)%100,yy,2,8);}ctx.save();ctx.translate(snapPixel(x),bottom-38);ctx.rotate(snapAngle(t*5));box('#9bcbd3',-30,-3,60,6);box('#9bcbd3',-3,-30,6,60);ctx.restore();}}if(!g.screen)prop(2,290,610,44,66);prop(3,1170,280,36,55);status(g.chime?'CHIME RINGING':'HIGH CHIME',1170,194,c,11);}
 if(s.round===6){for(const [i,x] of [[0,1700],[1,2040],[2,2370]]){puzzles.draw(ctx,0,x-34,460,68,150);status(g.transferred[i]?'BODY MOVING OUTSIDE':'CHANNEL '+(i+1),x,430,c,11);}if(!g.restraint)prop(2,1040,610,44,60);box('#24282b',1298,450,84,8);box('#9cdfc4',1300,452,80*g.charge,4);status('ORGAN PRESSURE',1340,430,c,11);}
 if(s.round===7){if(!g.cord)prop(2,1730,610,44,64);status(g.hatch?'OPEN TO THE RAIN':'SERVICE HATCH',1440,203,c,11);}
 for(const e of s.enemies){const row=e.hp<=0||e.hurt>0?3:e.kind==='wraith'?1:e.kind==='crawler'?2:0,frame=e.hurt>0&&e.hp>0?0:e.hp<=0?Math.min(3,Math.floor((s.time-e.deadAt)*8)):Math.floor(t*8+e.phase)%4;ctx.save();ctx.translate(snapPixel(e.x),snapPixel(e.y+44+8));if(e.face>0)ctx.scale(-1,1);enemyArt.draw(ctx,row*4+frame,-40,-80,80,80);ctx.restore();if(e.hp>0){if(e.hurt>0)box('#fff4bd',e.x-8,e.y+12,16,6);if(s.time>e.shotAt-.45&&s.time<e.shotAt)status('!',e.x,e.y-24,'#ffac6a',18);}}
 if(s.round!==6){const e=s.level.exit;doors.draw(ctx,(s.round===7?6:2)+(s.power?1:0),e.x-58,e.y-138,116,146);if(s.power&&s.round!==7)drawPortal(ctx,e.x,e.y-62,40,80,s.time,c,true);status(s.round===7?'OUTSIDE':s.power?'DEPARTURE · ALL THREE':'DEPARTURE SEALED',e.x,e.y-145,c,12);}
}
