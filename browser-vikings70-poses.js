async page=>{
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.setViewportSize({width:1440,height:900});await page.goto('http://127.0.0.1:3017/?campaign=cycle&puzzle=clockwork');await page.locator('#play-clockwork').click();
 await page.waitForTimeout(500);
 const read=()=>page.evaluate(()=>JSON.parse(document.querySelector('#game').dataset.heroes));
 const shot=async name=>{await page.screenshot({path:'output/playwright/vikings70-pose-'+name+'.png'});};
 for(let id=0;id<3;id++){
  await page.keyboard.press(String(id+1));await page.waitForTimeout(400);await shot('idle-'+id);
  await page.keyboard.down('ArrowRight');for(let n=0;n<4;n++){await page.waitForTimeout(100);await shot('walk-'+id+'-'+n);}await page.keyboard.up('ArrowRight');
  await page.keyboard.down('ArrowLeft');await page.waitForTimeout(300);await shot('mirror-'+id);await page.keyboard.up('ArrowLeft');
 }
 await page.keyboard.press('3');await page.keyboard.press('Space');await page.waitForTimeout(250);
 await page.keyboard.down('ArrowRight');for(let n=0;n<4;n++){await page.waitForTimeout(100);await shot('overhead-walk-'+n);}await page.keyboard.up('ArrowRight');
 await page.keyboard.press('d');await page.waitForTimeout(200);await shot('front-grip');
 // Approach and climb the real watchtower ladder using only ordinary keys.
 await page.keyboard.down('ArrowRight');while((await read())[2].x<418)await page.waitForTimeout(20);await page.keyboard.up('ArrowRight');await page.waitForTimeout(200);
 await page.keyboard.down('ArrowUp');for(let n=0;n<4;n++){await page.waitForTimeout(130);await shot('climb-'+n);}await page.keyboard.up('ArrowUp');await page.waitForTimeout(200);await shot('climb-stopped');
 const phase=await read();await page.waitForTimeout(700);await shot('climb-still');const after=await read();
 await page.keyboard.press('Space');await page.keyboard.down('ArrowUp');await page.waitForTimeout(120);await page.keyboard.up('ArrowUp');await page.waitForTimeout(300);await shot('climb-overhead');
 const raisedClimb=await read();if(!raisedClimb[2].climbing||!raisedClimb[2].shieldUp)throw Error('Raised ladder pose was not applied');
 await page.locator('#pause').click();await page.locator('#zoom').click();await page.waitForTimeout(350);await shot('climb-1x');
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(350);await shot('climb-mobile');
 return{phase:phase[2].climbPhase,stoppedPhase:after[2].climbPhase,errors};
}
