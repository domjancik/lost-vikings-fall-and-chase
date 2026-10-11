async page=>{
 await page.setViewportSize({width:1440,height:900});
 await page.locator('#rounds').click();await page.locator('button[data-round="7"]').click();
 await page.waitForFunction(()=>{const b=JSON.parse(document.querySelector('#game').dataset.storyBackground);return b.ready&&b.middle.ready&&b.source.includes('scale50/pub-far.png');});
 const results=[];
 for(const zoom of [1,2]){
  if(await page.locator('#zoom').innerText()!==zoom+'×')await page.locator('#zoom').click();
  await page.waitForTimeout(100);
  const b=await page.locator('#game').evaluate(el=>JSON.parse(el.dataset.storyBackground));
  if(b.size!==384||b.height!==256||b.middle.pieces.some(p=>p.w!==576||p.h!==384))throw Error('Pub scale grew with zoom');
  results.push({zoom,far:[b.size,b.height],middle:[b.middle.pieces[0].w,b.middle.pieces[0].h]});
 }
 await page.screenshot({path:'output/playwright/scale50-live-pub.png'});return results;
}
