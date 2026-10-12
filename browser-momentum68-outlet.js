async page=>{
 await page.setViewportSize({width:1440,height:900});if(await page.locator('#zoom').textContent()!=='2×')await page.locator('#zoom').click();
 const rows=[];
 for(const phase of ['charge','live']){
  await page.waitForFunction(phase=>JSON.parse(document.querySelector('#game').dataset.cycleArt).laser===phase,phase);
  await page.locator('#pause').click();await page.waitForFunction(()=>document.querySelector('#game').dataset.paused==='true');
  const actual=await page.locator('#game').evaluate(e=>JSON.parse(e.dataset.cycleArt).laser);if(actual!==phase)throw Error('Missed phase '+actual);
  await page.screenshot({path:'output/playwright/momentum68-laser-'+phase+'.png'});await page.locator('#zoom').click();await page.waitForTimeout(200);await page.screenshot({path:'output/playwright/momentum68-laser-'+phase+'-1x.png'});await page.locator('#zoom').click();await page.locator('#pause').click();rows.push(actual);
 }
 return{rows};
}
