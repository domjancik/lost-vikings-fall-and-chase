async page=>{
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.setViewportSize({width:3400,height:900});await page.goto('http://127.0.0.1:3007/?campaign=cycle&puzzle=refraction');await page.locator('#play-refraction').click();
 await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.cycleArt||'{}').ready);
 const capture=async name=>{await page.waitForTimeout(450);await page.screenshot({path:'output/playwright/refraction62-layout-'+name+'.png'});const art=await page.locator('#game').evaluate(e=>JSON.parse(e.dataset.cycleArt));for(const c of art.contacts)if(c.gap!==0)throw Error('Floating '+c.name);return art;};
 if(await page.locator('#zoom').textContent()!=='1×')await page.locator('#zoom').click();const off=await capture('initial-1x');
 await page.locator('#zoom').click();await capture('initial-2x');
 await page.setViewportSize({width:844,height:390});await capture('mobile-initial-2x');await page.locator('#zoom').click();await capture('mobile-initial-1x');
 // Real pointer movement and active-hero selection, no state injection.
 await page.locator('.hero-card').nth(1).click();const control=page.locator('[data-key=right]'),bounds=await control.boundingBox();await page.mouse.move(bounds.x+bounds.width/2,bounds.y+bounds.height/2);await page.mouse.down();await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.heroes)[1].x>410);await page.mouse.up();
 await page.locator('[data-key=secondary]').click();await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.puzzle).machine.draft);await capture('mobile-draft-1x');
 await page.setViewportSize({width:3400,height:900});await capture('draft-1x');await page.locator('#zoom').click();await capture('draft-2x');
 if(errors.length)throw Error(errors.join('\n'));return{contacts:off.contacts,mobileBowReleasesDraft:true,errors};
}
