async page=>{
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.setViewportSize({width:1440,height:900});
 await page.goto('http://127.0.0.1:3008/?campaign=arcade&vikings=63');await page.locator('#play').click();
 await page.locator('#debug').click();await page.locator('#debug-level').selectOption('0');await page.locator('#debug-go').click();
 await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.heroArt||'{}').ready);
 await page.waitForTimeout(600);
 if(await page.locator('#zoom').innerText()==='2×')await page.locator('#zoom').click();
 await page.waitForTimeout(500);await page.screenshot({path:'output/playwright/vikings63-pub-1x.png'});
 await page.locator('#zoom').click();await page.waitForTimeout(500);await page.screenshot({path:'output/playwright/vikings63-pub-2x.png'});
 const contact=await page.evaluate(async()=>{
  const read=()=>JSON.parse(document.querySelector('#game').dataset.heroes),frame=()=>new Promise(r=>requestAnimationFrame(r));
  const pulse=key=>{for(const type of ['keydown','keyup'])window.dispatchEvent(new KeyboardEvent(type,{key,bubbles:true}));};
  const held=new Set();const right=value=>{if(value&&!held.has('ArrowRight')){held.add('ArrowRight');window.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));}if(!value&&held.has('ArrowRight')){held.delete('ArrowRight');window.dispatchEvent(new KeyboardEvent('keyup',{key:'ArrowRight',bubbles:true}));}};
  pulse('3');pulse(' ');for(let n=0;n<20;n++)await frame();pulse('1');pulse(' ');
  const start=performance.now();while(performance.now()-start<5000){const h=read()[0],o=read()[2];if(h.support===2&&h.ground){right(false);return {rider:h,olaf:o,feet:h.y+44,shieldTop:o.y-36};}const stop=h.vx*Math.abs(h.vx)/(2*1250);right(h.x+stop<o.x);await frame();}
  right(false);throw Error('Shield contact failed '+JSON.stringify(read()));
 });
 await page.waitForTimeout(350);await page.screenshot({path:'output/playwright/vikings63-shield-passenger.png'});
 if(contact.feet!==contact.shieldTop||errors.length)throw Error(JSON.stringify({contact,errors}));return {contact,errors};
}
