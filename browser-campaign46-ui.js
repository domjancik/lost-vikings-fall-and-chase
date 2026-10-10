async page=>{
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.bringToFront();await page.waitForTimeout(2300);await page.keyboard.press('Enter');await page.waitForTimeout(300);
 const continuation=await page.locator('#game').evaluate(el=>({round:Number(el.dataset.round),heroes:JSON.parse(el.dataset.heroes)}));
 if(continuation.round!==6||continuation.heroes.flatMap(h=>h.inventory).filter(x=>x==='archive').length!==1)throw Error('Enter/custody continuation failed '+JSON.stringify(continuation));
 for(let round=0;round<8;round++){
  await page.setViewportSize({width:1440,height:900});await page.locator('#rounds').click();await page.locator('button[data-round="'+round+'"]').click();
  for(const zoom of [1,2]){if(await page.locator('#zoom').innerText()!==zoom+'×')await page.locator('#zoom').click();await page.waitForTimeout(150);await page.screenshot({path:'output/playwright/campaign46-zoom-'+round+'-'+zoom+'.png'});}
 }
 if(errors.length)throw Error(errors.join(';'));return {continuation:continuation.round+1,archiveCount:1,zoomScreenshots:16,errors};
}
