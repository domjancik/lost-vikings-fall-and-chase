async page=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const size of [{width:1440,height:900},{width:390,height:844},{width:320,height:568},{width:844,height:390}]){
  await page.setViewportSize(size);await page.goto('http://127.0.0.1:3000/?feel=26');await page.locator('#play').click();await page.waitForTimeout(300);
  const b=await page.locator('#game').boundingBox();if(b.height<size.height-2||b.width<size.width-2)throw Error('Not fullscreen '+JSON.stringify(b));if(!await page.locator('#fullscreen').isVisible())throw Error('Fullscreen hidden');
  if(await page.locator('#toast').isVisible())throw Error('Automatic clue covers playfield');await page.locator('#hint').click();if(!await page.locator('#hint-dialog').isVisible())throw Error('Hint panel failed');if(!(await page.locator('#hint-objective').textContent()).trim())throw Error('Empty hint');
  const before=await page.locator('#game').getAttribute('data-heroes');await page.keyboard.down('ArrowRight');await page.waitForTimeout(200);await page.keyboard.up('ArrowRight');if(await page.locator('#game').getAttribute('data-heroes')!==before)throw Error('Game moves behind hint panel');await page.locator('#resume-hint').click();
  const full=await page.locator('#fullscreen').boundingBox();if(full.x<0||full.x+full.width>size.width)throw Error('Fullscreen off-screen');
  await page.keyboard.press('3');await page.keyboard.press('d');await page.waitForTimeout(200);await page.screenshot({path:'output/playwright/story41-front-'+size.width+'.png'});await page.keyboard.press('Space');await page.waitForTimeout(200);await page.screenshot({path:'output/playwright/story41-up-'+size.width+'.png'});
 }
 if(errors.length)throw Error(errors.join(';'));
}
