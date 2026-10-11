async page=>{
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.setViewportSize({width:390,height:844});await page.goto('https://united-marsh-6ppd.here.now/?campaign=cycle&release=52');await page.locator('#play-cycle').click();
 await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.cycleArt||'{}').ready);
 const result=await page.evaluate(()=>{const e=document.querySelector('#game');return {campaign:e.dataset.campaign,art:JSON.parse(e.dataset.cycleArt),health:JSON.parse(e.dataset.heroes).map(h=>h.hp),upVisible:getComputedStyle(document.querySelector('.ladder-controls')).display!=='none',bodyWidth:document.body.scrollWidth,viewport:innerWidth};});
 if(result.campaign!=='cycle'||!result.upVisible||!result.art.ready||result.bodyWidth>result.viewport)throw Error(JSON.stringify(result));
 await page.screenshot({path:'output/playwright/cycle52-live-mobile.png'});
 if(errors.length)throw Error(errors.join(';'));return {...result,errors};
}
