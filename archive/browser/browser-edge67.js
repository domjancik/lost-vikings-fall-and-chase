async page=>{
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));await page.setViewportSize({width:1440,height:900});await page.goto('http://127.0.0.1:3011/?campaign=story');await page.locator('#play-story').click();if(await page.locator('#chapter-dialog').isVisible()){await page.locator('#skip-story').check();await page.locator('#chapter-continue').click();}
 const rows=[];
 for(let n=0;n<8;n++){
  await page.locator('#debug').click();await page.locator('#debug-level').selectOption(String(n));await page.locator('#debug-go').click();await page.waitForFunction(n=>{const e=document.querySelector('#game'),b=JSON.parse(e.dataset.storyBackground||'{}');return Number(e.dataset.round)===n&&b.ready&&b.middle?.ready&&b.middle.source.includes('scale67');},n);
  for(const zoom of ['1\u00d7','2\u00d7']){if(await page.locator('#zoom').textContent()!==zoom)await page.locator('#zoom').click();await page.waitForTimeout(350);const b=await page.locator('#game').evaluate(e=>JSON.parse(e.dataset.storyBackground));if(b.middle.contact!==(n===5?-100:612))throw Error('Ground changed '+n);rows.push({n,zoom,native:b.native,foundation:b.middle.foundation,contact:b.middle.contact});await page.screenshot({path:'output/playwright/edge67-chapter-'+n+'-'+zoom[0]+'x.png'});}
 }
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(400);await page.screenshot({path:'output/playwright/edge67-mobile-pub.png'});
 if(errors.length)throw Error(errors.join('\n'));return{rows,errors};
}
