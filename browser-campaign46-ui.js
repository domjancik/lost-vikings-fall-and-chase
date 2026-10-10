async page=>{
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.bringToFront();await page.waitForTimeout(2300);await page.keyboard.press('Enter');await page.waitForTimeout(300);
 const continuation=await page.locator('#game').evaluate(el=>({round:Number(el.dataset.round),heroes:JSON.parse(el.dataset.heroes)}));
 if(continuation.round!==6||continuation.heroes.flatMap(h=>h.inventory).filter(x=>x==='archive').length!==1)throw Error('Enter/custody continuation failed '+JSON.stringify(continuation));
 for(let round=0;round<8;round++){
  await page.setViewportSize({width:1440,height:900});await page.locator('#rounds').click();await page.locator('button[data-round="'+round+'"]').click();
  for(const zoom of [1,2]){if(await page.locator('#zoom').innerText()!==zoom+'×')await page.locator('#zoom').click();await page.waitForTimeout(150);await page.screenshot({path:'output/playwright/campaign46-zoom-'+round+'-'+zoom+'.png'});}
 }
 await page.setViewportSize({width:390,height:844});await page.locator('#rounds').click();await page.locator('button[data-round="0"]').click();
 if(await page.locator('#game').getAttribute('data-paused')==='true')await page.locator('#pause').click();
 const before=await page.locator('#game').evaluate(el=>JSON.parse(el.dataset.heroes)[0].x);
 const right=await page.locator('[data-key="right"]').boundingBox();await page.mouse.move(right.x+right.width/2,right.y+right.height/2);await page.mouse.down();await page.waitForTimeout(600);await page.mouse.up();
 const after=await page.locator('#game').evaluate(el=>JSON.parse(el.dataset.heroes)[0].x);
 if(after-before<30)throw Error('Mobile pointer did not move');
 const primary=await page.locator('[data-key="primary"]').boundingBox();await page.mouse.move(primary.x+primary.width/2,primary.y+primary.height/2);await page.mouse.down();await page.waitForTimeout(100);await page.mouse.up();
 const jumping=await page.locator('#game').evaluate(el=>JSON.parse(el.dataset.heroes)[0].y<560);if(!jumping)throw Error('Mobile action did not jump');
 const canvas=await page.locator('#game').boundingBox();if(canvas.width<389||canvas.height<843)throw Error('Canvas not fullscreen '+JSON.stringify(canvas));
 await page.screenshot({path:'output/playwright/campaign46-mobile-controls.png'});if(errors.length)throw Error(errors.join(';'));
 return {continuation:continuation.round+1,archiveCount:1,zoomScreenshots:16,mobileMovement:after-before,mobileJump:jumping,canvas,errors};
}
