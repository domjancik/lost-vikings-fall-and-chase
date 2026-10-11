async page=>{
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.goto('http://127.0.0.1:3008/?campaign=cycle&puzzle=refraction');await page.locator('#play-refraction').click();
 for(const viewport of [{width:390,height:844},{width:844,height:390},{width:320,height:568}]){
  await page.setViewportSize(viewport);await page.waitForTimeout(300);
  const layout=await page.evaluate(()=>{const rect=e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height};};return{left:rect(document.querySelector('[data-key=left]')),right:rect(document.querySelector('[data-key=right]')),heroes:[...document.querySelectorAll('.hero-card')].map(rect),buttons:[...document.querySelectorAll('.mobile-controls button,.hero-card,#hint')].map(e=>({label:e.getAttribute('data-key')||e.getAttribute('aria-label')||e.id,...rect(e)})),world:rect(document.querySelector('.viewport'))};});
  if(Math.abs(layout.left.y-layout.right.y)>1)throw Error('Left/right have unequal height '+JSON.stringify(layout));
  if(layout.left.y+layout.left.h<viewport.height-24)throw Error('Movement is not at bottom');
  for(const r of layout.heroes)if(r.x+r.w/2<viewport.width*.65||r.y<viewport.height*.18||r.h<44)throw Error('Hero selector is not thumb reachable '+JSON.stringify(r));
  for(const r of layout.buttons)if(r.x<0||r.y<0||r.x+r.w>viewport.width+1||r.y+r.h>viewport.height+1)throw Error('Offscreen '+r.label);
  for(let i=0;i<layout.buttons.length;i++)for(let j=i+1;j<layout.buttons.length;j++){const a=layout.buttons[i],b=layout.buttons[j];if(a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y)throw Error('Overlap '+a.label+' / '+b.label);}
  if(layout.world.w!==viewport.width||layout.world.h!==viewport.height)throw Error('Gameplay no longer fullscreen');
  await page.locator('.hero-card').nth(2).click();await page.waitForFunction(()=>document.querySelector('#game').dataset.activeHero==='2');
  await page.screenshot({path:'output/playwright/controls64-'+viewport.width+'x'+viewport.height+'.png'});
 }
 if(errors.length)throw Error(errors.join('\n'));return{aligned:true,thumbSelection:true,overlaps:0,errors};
}
