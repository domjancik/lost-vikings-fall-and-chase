async page=>{
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.setViewportSize({width:1440,height:900});
 const target=page.url().includes('united-marsh-6ppd.here.now')?'https://united-marsh-6ppd.here.now/?release=82':'http://127.0.0.1:3022/';
 await page.goto(target);
 await page.locator('#play-clockwork').click();
 await page.locator('#help').click();
 await page.locator('#hero-skin').selectOption('imagegen81');
 await page.locator('#close-help').click();
 await page.waitForFunction(()=>performance.getEntriesByType('resource').filter(r=>/vikings81\/.+raw.png|vikings80\/baleog-imagegen-raw.png/.test(r.name)).length===3);
 for(const id of [0,1,2]){
  await page.keyboard.press(String(id+1));await page.keyboard.down('ArrowLeft');await page.waitForTimeout(350);
  await page.screenshot({path:'output/playwright/trial82-run-'+id+'.png'});await page.keyboard.up('ArrowLeft');
 }
 await page.locator('#zoom').click();await page.keyboard.press('1');await page.keyboard.down('ArrowRight');await page.waitForTimeout(180);
 await page.screenshot({path:'output/playwright/trial82-overview.png'});await page.keyboard.up('ArrowRight');await page.locator('#zoom').click();await page.keyboard.press('3');
 await page.keyboard.press('Space');await page.keyboard.down('ArrowLeft');await page.waitForTimeout(180);
 await page.screenshot({path:'output/playwright/trial82-raised-fallback.png'});await page.keyboard.up('ArrowLeft');
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(200);
 await page.screenshot({path:'output/playwright/trial82-mobile.png'});
 await page.reload();await page.locator('#help').click();
 const persisted=await page.locator('#hero-skin').inputValue();if(persisted!=='imagegen81')throw Error('Skin did not persist');
 await page.locator('#hero-skin').selectOption('procedural');await page.locator('#close-help').click();
 if(errors.length)throw Error(errors.join(';'));
 return{persisted,rawAssets:3,errors};
}
