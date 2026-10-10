async page=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const frame=()=>page.locator('#game').evaluate(c=>{const data=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let hash=2166136261;for(let i=0;i<data.length;i+=16)hash=Math.imul(hash^data[i],16777619);return hash;});
 for(let round=1;round<=5;round++){await page.locator('#debug').click();await page.locator('#debug-level').selectOption(String(round));await page.locator('#debug-go').click();await page.waitForTimeout(500);const a=await frame();await page.waitForTimeout(180);if(await frame()===a)throw Error('Static environment in round '+round);await page.screenshot({path:'output/playwright/story41-environment-'+round+'.png'});}
 await page.setViewportSize({width:390,height:844});await page.locator('#debug').click();await page.locator('#debug-level').selectOption('2');await page.locator('#debug-go').click();await page.waitForTimeout(250);await page.screenshot({path:'output/playwright/story41-mobile.png'});if(errors.length)throw Error(errors.join('\n'));
}
