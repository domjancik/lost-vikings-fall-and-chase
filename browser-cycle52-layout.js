async page=>{
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.setViewportSize({width:1440,height:900});await page.goto('http://127.0.0.1:3000/?campaign=cycle&v=52');await page.locator('#play-cycle').click();await page.locator('#zoom').click();
 await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.cycleArt||'{}').ready);
 await page.screenshot({path:'output/playwright/cycle52-overview.png'});
 await page.locator('#zoom').click();await page.setViewportSize({width:844,height:390});
 // Reach the real ladder with ordinary movement, then use the touch button.
 await page.evaluate(async()=>{
  const read=()=>JSON.parse(document.querySelector('#game').dataset.heroes)[0];let held='';
  const input=key=>{if(key===held)return;if(held)window.dispatchEvent(new KeyboardEvent('keyup',{key:held,bubbles:true}));held=key;if(key)window.dispatchEvent(new KeyboardEvent('keydown',{key,bubbles:true}));};
  const start=performance.now();while(performance.now()-start<12000){const h=read(),d=650-h.x-h.vx*Math.abs(h.vx)/(2*2600);if(Math.abs(h.x-650)<3&&Math.abs(h.vx)<12)break;input(Math.abs(d)<2?'':d>0?'ArrowRight':'ArrowLeft');await new Promise(r=>requestAnimationFrame(r));}input('');
 });
 const before=await page.locator('#game').getAttribute('data-heroes');
 const up=page.locator('[data-key="up"]');const bounds=await up.boundingBox();await page.mouse.move(bounds.x+bounds.width/2,bounds.y+bounds.height/2);await page.mouse.down();await page.waitForFunction(before=>JSON.parse(document.querySelector('#game').dataset.heroes)[0].y<JSON.parse(before)[0].y-100,before);await page.mouse.up();
 await page.screenshot({path:'output/playwright/cycle52-mobile-ladder.png'});
 const result=await page.evaluate(()=>{const e=document.querySelector('#game'),buttons=[...document.querySelectorAll('.mobile-controls button')].map(b=>({key:b.dataset.key,r:b.getBoundingClientRect().toJSON()}));return {art:JSON.parse(e.dataset.cycleArt),hero:JSON.parse(e.dataset.heroes)[0],buttons};});
 if(!result.hero.climbing)throw Error('Touch ladder did not climb');
 for(const a of result.buttons){if(a.r.left<0||a.r.right>844||a.r.bottom>390)throw Error('Touch control outside viewport '+a.key);for(const b of result.buttons)if(a.key!==b.key&&Math.min(a.r.right,b.r.right)>Math.max(a.r.left,b.r.left)&&Math.min(a.r.bottom,b.r.bottom)>Math.max(a.r.top,b.r.top))throw Error('Overlapping '+a.key+' '+b.key);}
 if(errors.length)throw Error(errors.join(';'));return {nativeScene:result.art.nativeScene,climbing:result.hero.climbing,controls:result.buttons.map(b=>b.key),errors};
}
