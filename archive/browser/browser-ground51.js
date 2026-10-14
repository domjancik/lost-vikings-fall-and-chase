async page=>{
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));await page.setViewportSize({width:1440,height:900});await page.goto('http://127.0.0.1:3000/?campaign=story&ground=51');await page.bringToFront();await page.evaluate(()=>localStorage.setItem('last-call-story-cards','off'));const results=[];
 for(let round=0;round<8;round++){
  await page.locator('#rounds').click();await page.locator('button[data-round="'+round+'"]').click();
  for(const zoom of [1,2]){
   if(await page.locator('#zoom').innerText()!==zoom+'×')await page.locator('#zoom').click();
   await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.storyBackground).ready && JSON.parse(document.querySelector('#game').dataset.storyBackground).middle.ready);await page.waitForTimeout(100);
   const bg=await page.locator('#game').evaluate(el=>JSON.parse(el.dataset.storyBackground));if(bg.size/bg.native[0]!==2||bg.height/bg.native[1]!==2)throw Error('Fractional scene resampling');results.push({round,zoom,native:bg.native});await page.screenshot({path:'output/playwright/sprite51-'+round+'-'+zoom+'.png'});
  }
 }
 await page.setViewportSize({width:390,height:844});await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.storyBackground).ready && JSON.parse(document.querySelector('#game').dataset.storyBackground).middle.ready);await page.screenshot({path:'output/playwright/sprite51-mobile.png'});if(errors.length)throw Error(errors.join(';'));return {results,errors};
}

