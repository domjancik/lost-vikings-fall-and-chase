async page=>{
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.setViewportSize({width:1100,height:800});await page.goto('http://127.0.0.1:3000/connection-kit-preview.html');
 await page.waitForTimeout(300);await page.screenshot({path:'output/playwright/connections53-kit.png'});
 await page.goto('http://127.0.0.1:3000/?campaign=cycle&connections=53');await page.locator('#play-cycle').click();
 await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.cycleArt||'{}').connections?.ready);
 const result=await page.evaluate(()=>JSON.parse(document.querySelector('#game').dataset.cycleArt));
 await page.screenshot({path:'output/playwright/connections53-start.png'});
 if(errors.length)throw Error(errors.join(';'));return {result,errors};
}
