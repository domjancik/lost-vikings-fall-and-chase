async page=>{
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));await page.setViewportSize({width:390,height:844});await page.bringToFront();
 if(await page.locator('#game').getAttribute('data-paused')==='true'){await page.locator('#pause').click();await page.waitForTimeout(100);}
 const read=()=>page.locator('#game').evaluate(el=>({heroes:JSON.parse(el.dataset.heroes),paused:el.dataset.paused,time:Number(el.dataset.simTime)}));
 await page.locator('#game').focus();await page.waitForTimeout(300);const before=await read();
 const right=await page.locator('[data-key="right"]').boundingBox();await page.mouse.move(right.x+right.width/2,right.y+right.height/2);await page.mouse.down();
 const deadline=Date.now()+6000;while((await read()).time-before.time<.6){await page.waitForTimeout(50);if((await read()).paused==='true'){await page.mouse.up();await page.locator('#pause').click();await page.mouse.move(right.x+right.width/2,right.y+right.height/2);await page.mouse.down();}if(Date.now()>deadline)throw Error('Paused driver '+JSON.stringify(await read()));}
 await page.mouse.up();const after=await read();
 if(after.heroes[0].x-before.heroes[0].x<30)throw Error('Pointer movement '+JSON.stringify({before,after}));
 const primary=await page.locator('[data-key="primary"]').boundingBox();await page.mouse.move(primary.x+primary.width/2,primary.y+primary.height/2);await page.mouse.down();await page.waitForTimeout(100);await page.mouse.up();const jump=await read();if(jump.heroes[0].y>=560)throw Error('Pointer jump '+JSON.stringify(jump));
 const canvas=await page.locator('#game').boundingBox();if(canvas.width<389||canvas.height<843)throw Error('Viewport fill');await page.screenshot({path:'output/playwright/campaign46-mobile-controls.png'});if(errors.length)throw Error(errors.join(';'));return {movement:after.heroes[0].x-before.heroes[0].x,jumpY:jump.heroes[0].y,canvas,errors};
}
