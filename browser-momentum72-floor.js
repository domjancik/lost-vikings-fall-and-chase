async page=>{
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 const read=()=>page.locator('#game').evaluate(e=>({hero:JSON.parse(e.dataset.heroes)[0],machine:JSON.parse(e.dataset.puzzle).machine,art:JSON.parse(e.dataset.cycleArt)}));
 if(!(await read()).machine.safety)throw Error('Requires completed ordinary safety prefix');
 await page.waitForTimeout(12500);await page.keyboard.press('Space');await page.keyboard.down('ArrowLeft');
 const start=Date.now();while(true){const s=await read();if(s.hero.x<2330&&s.hero.ground&&s.hero.y+44===508)break;if(Date.now()-start>6000)throw Error('Tile approach timeout');await page.waitForTimeout(15);}await page.keyboard.up('ArrowLeft');
 const photo=async name=>{await page.locator('#pause').click();await page.waitForTimeout(200);await page.screenshot({path:'output/playwright/momentum72-safety-floor-'+name+'.png'});await page.locator('#pause').click();};
 await photo('crack');await page.waitForTimeout(1300);await photo('fall');const falling=(await read()).machine.tiles.map(t=>({t:t.t,drop:t.drop}));
 await page.waitForTimeout(6000);await photo('recovered');const end=await read();if(!falling.some(t=>t.drop>0)||!end.machine.tiles.every(t=>t.t===0&&t.drop===0))throw Error('Fragile lifecycle not retained');if(errors.length)throw Error(errors.join('\n'));return{falling,recovered:true,health:end.hero.hp,errors};
}
