async page=>{
 await page.setViewportSize({width:1440,height:900});await page.goto('https://united-marsh-6ppd.here.now/?feel=26');await page.locator('#play').click();await page.locator('#rounds').click();await page.locator('button[data-round="0"]').click();await page.waitForTimeout(500);
 const read=()=>page.locator('#game').evaluate(el=>({heroes:JSON.parse(el.dataset.heroes),animations:JSON.parse(el.dataset.animations),impact:JSON.parse(el.dataset.impact),puzzle:JSON.parse(el.dataset.puzzle)}));
 const frames=(await read()).animations.map(h=>h.frame);if(new Set(frames).size===1)throw Error('Idle animations synchronized');
 await page.keyboard.press('1');await page.keyboard.down('ArrowRight');for(let i=0;i<80;i++){const s=await read();if(s.heroes[0].x>=330)break;await page.waitForTimeout(20);}await page.keyboard.press('d');
 let hit=false;for(let i=0;i<35;i++){if((await read()).impact){hit=true;break;}await page.waitForTimeout(10);}await page.keyboard.up('ArrowRight');if(!hit|| (await read()).puzzle.crate)throw Error('Bash missed crate');await page.screenshot({path:'output/playwright/story41-bash.png'});
 for(let round=0;round<6;round++){await page.locator('#rounds').click();await page.locator('button[data-round="'+round+'"]').click();await page.waitForTimeout(250);await page.screenshot({path:'output/playwright/story41-parallax-'+round+'.png'});}
}

