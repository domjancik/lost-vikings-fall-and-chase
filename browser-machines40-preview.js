async page=>{
 await page.goto('http://127.0.0.1:3000/?machines=40');
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.evaluate(async()=>{
  const {drawMachine}=await import('./machine-render.js?v=story42');
  await new Promise(r=>setTimeout(r,700));
  const c=document.createElement('canvas');c.width=1120;c.height=720;c.id='machine-preview';c.style='position:fixed;inset:0;width:100vw;height:100vh;z-index:99999;object-fit:contain;background:#141620';document.body.append(c);
  const ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.fillStyle='#141620';ctx.fillRect(0,0,c.width,c.height);
  const states=[{ovenMode:0,ingredients:[],heat:0},{ovenMode:1,ingredients:['flour'],ore:true,oreCutAt:0,air:1,heat:0},{ovenDoorAt:2,ingredients:['flour','spice'],mixedAt:2,dragonShotAt:2,heat:0},{baked:true,ingredients:['flour','spice'],mixedAt:2.1,dragonShotAt:1.7,heat:0}];
  for(let row=0;row<3;row++)for(let col=0;col<4;col++){
   const kind=['oven','bowl','dragon'][row],x=col*280+140,bottom=row*240+220;
   ctx.fillStyle='#9baac1';ctx.fillRect(col*280+12,bottom,256,2);
   const time=col===1?2.05:2.2;
   ctx.save();if(kind==='dragon'){ctx.translate(x-1300,bottom-610);drawMachine(ctx,{time,machine:states[col]},kind,1300,720,280,280);}else drawMachine(ctx,{time,machine:states[col]},kind,x,bottom+ (kind==='bowl'?14:2),kind==='bowl'?170:200,kind==='bowl'?170:200);ctx.restore();
   ctx.fillStyle='#dfe9fa';ctx.font='16px monospace';ctx.fillText(kind+' '+col,col*280+14,row*240+20);
  }
 });
 await page.screenshot({path:'output/playwright/story41-states.png'});
 return {errors};
}
