async page=>{
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));await page.setViewportSize({width:1440,height:900});
 const results=[];
 for(const [campaign,level] of [['story','0'],['story','5'],['arcade','9'],['cycle','0'],['cycle','1']]){
  await page.goto('http://127.0.0.1:3009/?campaign='+campaign);await page.locator(campaign==='story'?'#play-story':campaign==='cycle'?'#play-cycle':'#play').click();if(await page.locator('#chapter-dialog').isVisible())await page.locator('#chapter-continue').click();await page.locator('#debug').click();await page.locator('#debug-level').selectOption(level);await page.locator('#debug-go').click();if(await page.locator('#chapter-dialog').isVisible())await page.locator('#chapter-continue').click();if(await page.locator('#zoom').textContent()!=='2\u00d7')await page.locator('#zoom').click();await page.waitForTimeout(600);
  const read=()=>page.locator('#game').evaluate(e=>({camera:JSON.parse(e.dataset.camera),background:e.dataset.storyBackground?JSON.parse(e.dataset.storyBackground):e.dataset.cycleArt?JSON.parse(e.dataset.cycleArt).background:JSON.parse(e.dataset.parallax||'[]')[0]}));
  const before=await read();await page.screenshot({path:'output/playwright/vertical65-'+campaign+level+'-before.png'});await page.keyboard.down('ArrowUp');await page.waitForTimeout(900);const after=await read();await page.screenshot({path:'output/playwright/vertical65-'+campaign+level+'-up.png'});await page.keyboard.up('ArrowUp');
  const dy=after.camera.y-before.camera.y;if(Math.abs(dy)<30)throw Error('No camera pan '+campaign+level);
  if(after.background){const a=before.background.y-(campaign==='arcade'?0:before.camera.y),b=after.background.y-(campaign==='arcade'?0:after.camera.y);if(Math.abs(b-a)<2||Math.abs(b-a)>=Math.abs(dy))throw Error('Incorrect vertical depth '+campaign+level+' '+JSON.stringify({before,after}));}
  results.push({campaign,level,dy,before,after});
 }
 if(errors.length)throw Error(errors.join('\n'));return{results,errors};
}
