async page=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const size of [{width:1440,height:900},{width:390,height:844},{width:320,height:568},{width:844,height:390}]){
  await page.setViewportSize(size);await page.goto('https://united-marsh-6ppd.here.now/?hud=25');await page.locator('#play').click();
  for(let round=0;round<6;round++){
   await page.locator('#rounds').click();await page.locator('button[data-round="'+round+'"]').click();await page.waitForTimeout(80);
   const rects=await page.locator('.game-bottom').evaluate(el=>({bottom:el.getBoundingClientRect().bottom,children:[...el.querySelectorAll('#toast,#mission')].filter(e=>getComputedStyle(e).display!=='none').map(e=>({top:e.getBoundingClientRect().top,bottom:e.getBoundingClientRect().bottom}))}));
   const top=await page.locator('.game-bottom').evaluate(el=>el.getBoundingClientRect().top);if(rects.children.some(e=>e.top<top+2||e.bottom>rects.bottom-2))throw Error('Message clipped in round '+round+' at '+size.width);
  }
  await page.locator('#help').click();if(!await page.locator('#help-dialog').isVisible())throw Error('Help failed');await page.locator('#close-help').click();
  await page.locator('#debug').click();await page.locator('#debug-level').selectOption('0');await page.locator('#debug-go').click();await page.keyboard.press('2');
  const tap=async key=>{const b=await page.locator('[data-key="'+key+'"]').boundingBox();await page.mouse.move(b.x+b.width/2,b.y+b.height/2);await page.mouse.down();await page.waitForTimeout(70);await page.mouse.up();await page.waitForTimeout(70);};
  await tap('primary');const pose=await page.locator('#game').getAttribute('data-pose');if(pose!=='sword')throw Error('Touch sword failed '+pose);
  const before=await page.locator('#game').evaluate(el=>JSON.parse(el.dataset.heroes)[1].x);const b=await page.locator('[data-key="right"]').boundingBox();await page.mouse.move(b.x+b.width/2,b.y+b.height/2);await page.mouse.down();await page.waitForTimeout(400);await page.mouse.up();const after=await page.locator('#game').evaluate(el=>JSON.parse(el.dataset.heroes)[1].x);if(after<before+20)throw Error('Touch movement failed');
 }
 if(errors.length)throw Error(errors.join('; '));
}
