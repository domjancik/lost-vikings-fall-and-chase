async page=>{
 await page.goto('https://united-marsh-6ppd.here.now/?collision=23');await page.setViewportSize({width:390,height:844});await page.locator('#play').click();await page.locator('#rounds').click();await page.locator('button[data-round="0"]').click();await page.waitForTimeout(150);
 const read=()=>page.locator('#game').evaluate(el=>({heroes:JSON.parse(el.dataset.heroes),shots:JSON.parse(el.dataset.shots),puzzle:JSON.parse(el.dataset.puzzle)}));
 const tap=async selector=>{const b=await page.locator(selector).boundingBox();await page.mouse.move(b.x+b.width/2,b.y+b.height/2);await page.mouse.down();await page.waitForTimeout(35);await page.mouse.up();await page.waitForTimeout(35);};
 if(!await page.locator('script[type=module]').getAttribute('src').then(s=>s.includes('story41')))throw Error('Old deployment');
 await page.keyboard.press('2');await tap('[data-key="secondary"]');await page.keyboard.press('3');await tap('[data-key="primary"]');let st=await read();if(!st.heroes[2].shieldUp)throw Error('Touch overhead failed');await tap('[data-key="secondary"]');st=await read();if(st.heroes[2].shieldUp||!st.heroes[2].shield)throw Error('Touch front switch failed');
 await page.waitForTimeout(800);st=await read();if(!st.puzzle.crate||st.shots.length)throw Error('Arrow passed intact crate');
 await page.screenshot({path:'output/playwright/story41-mobile-shield.png'});await page.setViewportSize({width:1440,height:900});
}
