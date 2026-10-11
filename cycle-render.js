import {createAtlas} from './sprite-atlas.js?v=arc46';
import {drawTerrain} from './terrain-render.js?v=terrain48';
import {snapPixel} from './pixel-grid.js?v=arc46';
import {drawConnection,drawConnectionTile,connectionsReady} from './connection-render.js?v=connections53';
const atlas=createAtlas('assets/cycle52/machines.png',4,4),fan=createAtlas('assets/cycle52/fan.png',4,1);
const load=name=>{const i=new Image();i.src='assets/cycle52/'+name+'.png';return i;};
const scene=load('scene'),ladder=load('ladder'),carrier=load('carrier');
export function drawCycleWorld(ctx,s,camera,viewport){
 const g=s.machine,c=g.carrier,box=(color,x,y,w,h)=>{ctx.fillStyle=color;ctx.fillRect(snapPixel(x),snapPixel(y),snapPixel(w),snapPixel(h));};
 box('#172f3a',camera.x,camera.y,viewport.width,viewport.height);
 if(scene.complete&&scene.naturalWidth){const w=scene.naturalWidth*2,h=scene.naturalHeight*2,offset=snapPixel(camera.x*.75);for(let x=offset-w;x<camera.x+viewport.width;x+=w)ctx.drawImage(scene,x,1120-h,w,h);}
 // Structural piers meet a lower deck or the recovery floor, never thin air.
 for(const p of s.level.platforms){const base=s.level.floors.filter(f=>f.y>p.y&&p.x+20>=f.x&&p.x+20<=f.x+f.w).sort((a,b)=>a.y-b.y)[0]?.y??1120;for(const x of [p.x+16,p.x+p.w-32]){box('#263f48',x,p.y+24,16,base-p.y-24);box('#77938c',x,p.y+24,4,base-p.y-24);}}
 // Authored structural rails form a physical loop, with explicit junctions.
 drawConnection(ctx,[[850,302],[2210,302],[2210,982],[850,982],[850,302]],'rail');
 drawConnection(ctx,[[850,542],[2210,542]],'rail');
 drawConnectionTile(ctx,28,850,542,3);drawConnectionTile(ctx,28,2210,542,1);
 for(const p of s.level.floors)drawTerrain(ctx,{round:5,campaign:'story'},p.x,p.y,p.w,p.y===1120?80:64);
 for(const p of s.level.platforms)drawTerrain(ctx,{round:5,campaign:'story'},p.x,p.y,p.w,28);
 if(ladder.complete&&ladder.naturalWidth)for(let y=500;y<1120;y+=80){const h=Math.min(80,1120-y);ctx.drawImage(ladder,0,0,16,h/2,634,y,32,h);}
 atlas.draw(ctx,g.released?11:10,418,876,64,64);
 if(g.cutAt>=0&&s.time-g.cutAt<.4){const t=s.time-g.cutAt;box('#d7b37a',450-t*100,894+t*40,12,4);box('#d7b37a',450+t*100,894+t*40,12,4);}
 atlas.draw(ctx,12+Math.min(2,Math.floor(g.brakePose*2.99)),1038,326,64,64);
 // Flanged air duct and flexible brake control terminate on actual housings.
 const duct=drawConnection(ctx,[[1300,518],[1300,770],[1360,770],[1360,820]],'pipe');
 const brakeCable=drawConnection(ctx,[[1094,364],[1200,364],[1200,850],[1300,850]],'cable',{time:s.time,phase:0});
 const selectorCable=drawConnection(ctx,[[1632,232],[1744,232],[1744,128],[816,128],[816,542],[850,542]],'cable',{time:s.time,phase:2});
 // The selector operates the actual low/high branch, not a random track point.
 drawConnectionTile(ctx,c.high===260?31:30,850,542,1);
 drawConnectionTile(ctx,g.brakePose<.5?30:31,1134,364);
 // The hinge lens stays exposed at the actual projectile collision position.
 atlas.draw(ctx,4+Math.min(3,Math.floor(g.damper*3.99)),1268,456,64,64);
 fan.draw(ctx,g.released?Math.floor(s.time*9)%4:0,1296,812,128,128);
 const draft=g.brakePose===1&&g.damper===1;
 if(draft)for(let n=0;n<18;n++){const y=940-((s.time*180+n*43)%680),x=1298+(n*26)%128;box('#a0e5e5',x,y,2,12);}
 atlas.draw(ctx,12+Math.min(2,Math.floor(g.selectorPose*2.99)),1568,196,64,64);
 box(g.selector?'#9ddfcb':'#866348',1554,260,8,12);
 // Native row2 is the rear railing; row8 is the actual walking deck.
 if(carrier.complete&&carrier.naturalWidth)ctx.drawImage(carrier,snapPixel(c.x),snapPixel(c.y)-16,160,64);
 atlas.draw(ctx,15,2536,132,128,128);
 return {ready:connectionsReady()&&[scene,ladder,carrier,atlas.image,fan.image].every(i=>i.complete&&i.naturalWidth),nativeScene:[scene.naturalWidth,scene.naturalHeight],carrier:{x:snapPixel(c.x),y:snapPixel(c.y)},draft,connections:{ready:connectionsReady(),frame:Math.floor(s.time*5)%4,brake:brakeCable.anchors,duct:duct.anchors,selector:selectorCable.anchors}};
}
