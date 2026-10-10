async page=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.setViewportSize({width:1440,height:900});await page.goto('https://united-marsh-6ppd.here.now/?pixel=17');await page.locator('#play').click();
 for(const size of [{width:1440,height:900},{width:390,height:844},{width:844,height:390}]){await page.setViewportSize(size);for(let round=0;round<6;round++){
 await page.locator('#debug').click();await page.locator('#debug-level').selectOption(String(round));await page.locator('#debug-go').click();await page.waitForTimeout(400);
 const result=await page.locator('#game').evaluate(c=>{const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let bad=0,count=0;for(let y=0;y+1<c.height;y+=2)for(let x=0;x+1<c.width;x+=2){const at=(y*c.width+x)*4;for(const offset of [4,c.width*4,c.width*4+4])for(let k=0;k<4;k++)if(d[at+k]!==d[at+offset+k])bad++;count++;}return {bad,count,grid:c.dataset.pixelGrid,source:JSON.parse(c.dataset.background).source};});
 if(result.bad||result.grid!=='2'||!result.source.includes('/assets/pixel/'))throw Error('Inconsistent pixel grid '+JSON.stringify(result));await page.screenshot({path:'output/playwright/story41-round-'+round+'-'+size.width+'.png'});
 }}if(errors.length)throw Error(errors.join('\n'));
}
