async page=>{
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));await page.setViewportSize({width:1440,height:900});await page.goto('http://127.0.0.1:3017/?puzzle=clockwork');await page.locator('#play-clockwork').click();await page.waitForTimeout(400);
 const x=id=>page.evaluate(id=>JSON.parse(document.querySelector('#game').dataset.heroes)[id].x,id);
 const move=async(id,target)=>{await page.keyboard.press(String(id+1));const key=(await x(id))<target?'ArrowRight':'ArrowLeft';await page.keyboard.down(key);while(Math.abs(await x(id)-target)>4)await page.waitForTimeout(15);await page.keyboard.up(key);await page.waitForTimeout(150);};
 if((await page.locator('#zoom').textContent()).startsWith('1'))await page.locator('#zoom').click();await page.waitForTimeout(250);
 await move(0,400);
 for(const [id,key]of [[0,'ArrowLeft'],[1,'ArrowLeft'],[2,'ArrowRight']]){
  await page.keyboard.press(String(id+1));await page.keyboard.down(key);
  for(let n=0;n<4;n++){await page.waitForTimeout(90);await page.screenshot({path:`output/playwright/vikings70-gait-${id}-${n}-2x.png`});}
  await page.keyboard.up(key);await page.locator('#pause').click();await page.locator('#zoom').click();await page.waitForTimeout(300);await page.screenshot({path:`output/playwright/vikings70-gait-${id}-1x.png`});await page.locator('#zoom').click();await page.locator('#pause').click();
 }
 return{errors};
}
