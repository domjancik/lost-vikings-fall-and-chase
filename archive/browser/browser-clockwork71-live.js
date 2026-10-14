async page=>{
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.setViewportSize({width:1440,height:900});await page.goto('https://united-marsh-6ppd.here.now/?release=71&puzzle=clockwork');await page.locator('#play-clockwork').click();
 await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.cycleArt||'{}').ready);
 await page.waitForTimeout(500);
 const loaded=await page.evaluate(()=>performance.getEntriesByType('resource').filter(r=>/assets\/clockwork71\/tower\.png/.test(r.name)).length);
 const state=await page.locator('#game').evaluate(e=>JSON.parse(e.dataset.puzzle));
 if(!loaded||state.machine.catchWound!==false)throw Error('Reviewed winding station missing');
 await page.screenshot({path:'output/playwright/clockwork71-live-desktop.png'});await page.setViewportSize({width:390,height:844});await page.waitForTimeout(300);await page.screenshot({path:'output/playwright/clockwork71-live-mobile.png'});
 if(errors.length)throw Error(errors.join('\n'));
 return{towerLoaded:loaded,catchWound:state.machine.catchWound,errors};
}
