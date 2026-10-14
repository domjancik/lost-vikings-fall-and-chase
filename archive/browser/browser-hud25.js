async page=>{
 const overlap=(a,b)=>a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y;
 for(const size of [{width:1440,height:900},{width:390,height:844},{width:844,height:390}]){
  await page.setViewportSize(size);await page.goto('https://united-marsh-6ppd.here.now/?hud=25');await page.locator('#play').click();await page.waitForTimeout(200);
  const game=await page.locator('#game').boundingBox();const mission=await page.locator('.game-bottom').boundingBox();if(overlap(game,mission))throw Error('Mission overlaps playable canvas at '+size.width+'x'+size.height);
  await page.locator('#hint').click();const toast=await page.locator('#toast').boundingBox();if(overlap(game,toast))throw Error('Hint overlaps gameplay at '+size.width+'x'+size.height);
  const text=await page.locator('#toast').textContent();if(!text.trim())throw Error('Missing hint');
  for(const selector of ['.game-top','.crew','.mobile-controls']){const b=await page.locator(selector).boundingBox();if(b.x<0||b.y<0||b.x+b.width>size.width+1||b.y+b.height>size.height+1)throw Error('HUD off screen '+selector);}
  await page.screenshot({path:'output/playwright/story41-'+size.width+'.png'});
 }
}
