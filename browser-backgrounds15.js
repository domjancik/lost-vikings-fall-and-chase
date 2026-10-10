async page=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.setViewportSize({width:1440,height:900});await page.goto('https://united-marsh-6ppd.here.now/?backgrounds=15');await page.locator('#play').click();
 for(const size of [{width:1440,height:900},{width:390,height:844},{width:844,height:390}]){
  await page.setViewportSize(size);
  for(let level=1;level<=5;level++){
   await page.locator('#debug').click();await page.locator('#debug-level').selectOption(String(level));await page.locator('#debug-go').click();
   await page.waitForFunction(n=>{const c=document.querySelector('#game');return c.dataset.background&&JSON.parse(c.dataset.background).round===n;},level);
   const result=await page.locator('#game').evaluate(c=>{const b=JSON.parse(c.dataset.background);return {b,scaleX:c.clientWidth/c.width,scaleY:c.clientHeight/c.height};});
   if(Math.abs(result.scaleX-result.scaleY)>.001)throw Error('Canvas stretching at level '+level);
   if(Math.abs(result.b.crop.sw/result.b.crop.sh-result.b.width/result.b.height)>.00001)throw Error('Background stretching at level '+level);
   if(!result.b.source.endsWith('arcade-background-'+level+'.png'))throw Error('Wrong background');
   await page.screenshot({path:'output/playwright/story41-'+level+'-'+size.width+'.png'});
  }
 }
 if(errors.length)throw Error(errors.join('\n'));
 await page.setViewportSize({width:390,height:844});await page.locator('#debug').click();await page.locator('#debug-level').selectOption('1');await page.locator('#debug-go').click();
}
