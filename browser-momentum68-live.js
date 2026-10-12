async page=>{
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.setViewportSize({width:1440,height:900});
 await page.goto('https://united-marsh-6ppd.here.now/?campaign=cycle&puzzle=momentum&release=68');
 await page.locator('#play-momentum').click();
 await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.cycleArt||'{}').ready);
 const read=()=>page.locator('#game').evaluate(e=>({round:e.dataset.round,art:JSON.parse(e.dataset.cycleArt),heroes:JSON.parse(e.dataset.heroes)}));
 const desktop=await read();await page.screenshot({path:'output/playwright/momentum68-live-desktop.png'});
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(300);
 const mobile=await read();await page.screenshot({path:'output/playwright/momentum68-live-mobile.png'});
 if(errors.length)throw Error(errors.join('\n'));
 if(desktop.round!=='2'||!desktop.art.ready||!mobile.art.ready||desktop.heroes.length!==3)throw Error('Live level not ready');
 return{desktop,mobile,errors};
}
