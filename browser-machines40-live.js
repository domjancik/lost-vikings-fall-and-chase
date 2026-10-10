async page=>{
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.goto('https://united-marsh-6ppd.here.now/?machines=40');
 const result=await page.evaluate(async()=>{
  const html=await (await fetch('./index.html')).text();
  const m=await import('./machine-animation.js?v=story42');
  const img=new Image();img.src='./assets/pixel/machine-states.png';await img.decode();
  return {release:html.includes('story41'),atlas:[img.width,img.height],off:m.machinePose({time:20,machine:{ovenMode:0}}).ovenFrame,baked:m.machinePose({time:20,machine:{baked:true}}).ovenFrame};
 });
 await page.locator('#rounds').click();await page.locator('button[data-round="6"]').click();await page.waitForTimeout(500);
 await page.screenshot({path:'output/playwright/story41-live-kitchen.png'});
 return {...result,errors};
}
