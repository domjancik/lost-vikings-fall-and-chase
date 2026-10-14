async page=>{
 for(const size of [{width:1440,height:900},{width:390,height:844}]){
  await page.setViewportSize(size);await page.goto('https://united-marsh-6ppd.here.now/?shield=28');await page.locator('#play').click();await page.keyboard.press('3');
  const check=async up=>{await page.waitForTimeout(80);const h=await page.locator('#game').evaluate(el=>JSON.parse(el.dataset.heroes)[2]);if(!h.shield||h.shieldUp!==up)throw Error('Wrong shield pose '+JSON.stringify(h));};
  await check(false);for(let i=0;i<3;i++){await page.keyboard.press('d');await check(false);}for(let i=0;i<3;i++){await page.keyboard.press('Space');await check(true);}await page.keyboard.press('d');await check(false);
  const tap=async key=>{const b=await page.locator('[data-key="'+key+'"]').boundingBox();await page.mouse.move(b.x+b.width/2,b.y+b.height/2);await page.mouse.down();await page.waitForTimeout(30);await page.mouse.up();};
  for(let i=0;i<3;i++){await tap('primary');await check(true);}for(let i=0;i<3;i++){await tap('secondary');await check(false);}
 }
 await page.setViewportSize({width:1440,height:900});
}
