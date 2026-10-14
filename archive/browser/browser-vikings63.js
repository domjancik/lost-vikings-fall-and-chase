async page=>{
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.setViewportSize({width:1100,height:900});
 await page.goto('http://127.0.0.1:3008/hero-art-preview.html');
 await page.waitForFunction(()=>window.heroPreviewReady);
 await page.screenshot({path:'output/playwright/vikings63-preview.png'});
 await page.locator('#direction').click();await page.locator('#gray').click();
 await page.screenshot({path:'output/playwright/vikings63-silhouettes.png'});
 await page.goto('http://127.0.0.1:3008/?campaign=cycle&vikings=63');await page.locator('#play-cycle').click();
 await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.heroArt||'{}').ready);
 await page.waitForTimeout(700);await page.screenshot({path:'output/playwright/vikings63-cycle.png'});
 const ready=await page.evaluate(()=>({art:JSON.parse(document.querySelector('#game').dataset.heroArt),portraits:[0,1,2].map(id=>{const c=document.querySelector('#portrait'+id),a=c.getContext('2d').getImageData(0,0,64,64).data;return a.some((v,n)=>n%4===3&&v>0);})}));
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'output/playwright/vikings63-mobile.png'});
 if(!ready.portraits.every(Boolean)||errors.length)throw Error(JSON.stringify({ready,errors}));
 return {ready,errors};
}


