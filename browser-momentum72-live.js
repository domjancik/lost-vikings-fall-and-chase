async page=>{
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));await page.setViewportSize({width:1440,height:900});await page.goto('https://united-marsh-6ppd.here.now/?release=72&puzzle=momentum');await page.locator('#play-momentum').click();
 await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.cycleArt||'{}').ready);
 const loaded=await page.evaluate(()=>performance.getEntriesByType('resource').some(r=>/assets\/momentum72\/ball\.png/.test(r.name)));if(!loaded)throw Error('New rolling atlas missing');
 await page.screenshot({path:'output/playwright/momentum72-live.png'});await page.setViewportSize({width:390,height:844});await page.waitForTimeout(300);await page.screenshot({path:'output/playwright/momentum72-live-mobile.png'});if(errors.length)throw Error(errors.join('\n'));return{loaded,errors};
}
