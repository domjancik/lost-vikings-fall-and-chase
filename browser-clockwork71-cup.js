async page=>{
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));await page.setViewportSize({width:1440,height:900});await page.goto('http://127.0.0.1:3018/?puzzle=clockwork');await page.locator('#play-clockwork').click();if((await page.locator('#zoom').textContent()).startsWith('1'))await page.locator('#zoom').click();await page.waitForTimeout(400);
 const read=()=>page.locator('#game').evaluate(e=>({hero:JSON.parse(e.dataset.heroes)[0],wheel:JSON.parse(e.dataset.puzzle).machine.wheel}));
 const drive=async(key,condition,limit=6000)=>{await page.keyboard.down(key);const t=Date.now();while(!condition(await read())){if(Date.now()-t>limit)throw Error('movement timeout');await page.waitForTimeout(20);}await page.keyboard.up(key);};
 await drive('ArrowRight',s=>s.hero.x>428);await page.waitForTimeout(150);await page.keyboard.press('Space');await drive('ArrowRight',s=>s.hero.x>555);await page.waitForTimeout(650);
 const positions=[];
 for(const [name,key]of [['left','ArrowLeft'],['right','ArrowRight']]){
  await drive(key,s=>name==='left'?s.hero.x-s.wheel.x<=-39.5:s.hero.x-s.wheel.x>=39.5);await page.waitForTimeout(220);
  const s=await read();if(!s.hero.ground||s.hero.support!=='clock-cup'||s.hero.vx!==0)throw Error('edge not settled '+JSON.stringify(s));positions.push({name,dx:s.hero.x-s.wheel.x,footY:s.hero.y+44,ground:s.hero.ground,support:s.hero.support});
  await page.locator('#pause').click();await page.waitForTimeout(300);await page.screenshot({path:'output/playwright/clockwork71-cup-settled-'+name+'.png'});await page.locator('#zoom').click();await page.waitForTimeout(300);await page.screenshot({path:'output/playwright/clockwork71-cup-settled-'+name+'-1x.png'});await page.setViewportSize({width:390,height:844});await page.waitForTimeout(300);await page.screenshot({path:'output/playwright/clockwork71-cup-settled-'+name+'-mobile.png'});await page.locator('#zoom').click();await page.setViewportSize({width:1440,height:900});await page.waitForTimeout(300);await page.locator('#pause').click();
 }
 return{positions,errors};
}
