async page=>{
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.setViewportSize({width:1440,height:900});await page.goto('https://united-marsh-6ppd.here.now/?vikings=70&release=70&puzzle=clockwork');await page.locator('#play-clockwork').click();
 await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.cycleArt||'{}').ready);
 const loaded=await page.evaluate(()=>performance.getEntriesByType('resource').filter(r=>/assets\/vikings70\/(erik|baleog|olaf)\.png/.test(r.name)).map(r=>r.name));
 if(loaded.length!==3)throw Error('New locomotion assets missing');
 await page.keyboard.press('3');await page.keyboard.down('ArrowRight');await page.waitForTimeout(400);await page.keyboard.up('ArrowRight');await page.keyboard.press('Space');await page.waitForTimeout(300);
 const heroes=await page.locator('#game').evaluate(e=>JSON.parse(e.dataset.heroes));if(!heroes[2].shieldUp)throw Error('Raised shield input failed');
 await page.screenshot({path:'output/playwright/vikings70-live-desktop.png'});await page.setViewportSize({width:390,height:844});await page.waitForTimeout(300);await page.screenshot({path:'output/playwright/vikings70-live-mobile.png'});
 return{locomotionAssets:loaded.length,shieldUp:heroes[2].shieldUp,errors};
}
