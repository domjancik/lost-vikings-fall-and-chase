async page=>{
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 const url='https://united-marsh-6ppd.here.now/?campaign=cycle&puzzle=clockwork&release=69';
 const open=async(width,height,name)=>{await page.setViewportSize({width,height});await page.goto(url);await page.locator('#play-clockwork').click();await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.cycleArt||'{}').ready);
  const state=await page.locator('#game').evaluate(e=>({round:e.dataset.round,art:JSON.parse(e.dataset.cycleArt),heroes:JSON.parse(e.dataset.heroes)}));if(state.round!=='3'||!state.art.ready||state.heroes.length!==3)throw Error('Clockwork live entry failed');await page.screenshot({path:'output/playwright/clockwork69-live-'+name+'.png'});return state;};
 const desktop=await open(1440,900,'desktop');await page.keyboard.down('ArrowRight');await page.waitForTimeout(500);await page.keyboard.up('ArrowRight');
 const moved=await page.locator('#game').evaluate(e=>JSON.parse(e.dataset.heroes)[0].x);if(moved<=desktop.heroes[0].x+20)throw Error('Live movement stalled');
 const mobile=await open(390,844,'mobile');if(errors.length)throw Error(errors.join('\n'));return{desktopRound:desktop.round,mobileRound:mobile.round,artReady:mobile.art.ready,moved,errors};
}
