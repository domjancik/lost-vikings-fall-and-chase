async page => {
 const state=async()=>page.locator('#game').evaluate(el=>({heroes:JSON.parse(el.dataset.heroes),puzzle:JSON.parse(el.dataset.puzzle),won:el.dataset.won==='true',round:+el.dataset.round}));
 const wait=ms=>page.waitForTimeout(ms);
 const select=async id=>{await page.keyboard.press(String(id+1));await wait(30);};
 const move=async(id,target)=>{
  await select(id);let held=null;const deadline=Date.now()+10000;
  while(Date.now()<deadline){const st=await state();if(st.won)break;const h=st.heroes[id],d=target-h.x;
   const brake=h.ground?[2600,2300,2100][id]:[1250,950,750][id],stop=h.vx*Math.abs(h.vx)/(2*brake),remaining=d-stop;
   let direction=Math.abs(d)<4&&Math.abs(h.vx)<20?null:Math.abs(remaining)<3?null:remaining>0?'ArrowRight':'ArrowLeft';
   if(direction!==held){if(held)await page.keyboard.up(held);if(direction)await page.keyboard.down(direction);held=direction;}
   if(Math.abs(d)<5&&Math.abs(h.vx)<20)break;await wait(25);
  }
  if(held)await page.keyboard.up(held);await wait(90);const st=await state();if(!st.won&&Math.abs(st.heroes[id].x-target)>12)throw Error('Cannot move hero '+id+' to '+target+': '+JSON.stringify(st));
 };
 const faceRight=async()=>{await page.keyboard.down('ArrowRight');await wait(70);await page.keyboard.up('ArrowRight');await wait(50);};
 const jump=async x=>{await select(0);await page.keyboard.press('Space');await wait(60);await move(0,x);await wait(1000);};
 const press=async key=>{await page.keyboard.press(key);await wait(180);};
 const requireFlag=async key=>{const s=await state();if(!s.puzzle[key])throw Error(key+' missing '+JSON.stringify(s));console.log(key+' verified');};
 const machine=async()=>(await state()).puzzle.machine;
 const waitFor=async(check,label)=>{const until=Date.now()+20000;while(Date.now()<until){if(check(await state()))return;await wait(40);}throw Error(label+' '+JSON.stringify(await state()));};
 const faceLeft=async()=>{await page.keyboard.down('ArrowLeft');await wait(70);await page.keyboard.up('ArrowLeft');await wait(50);};
 const use=async id=>{await select(id);await press('e');};
 const shoot=async()=>{await select(1);await faceRight();await press('x');await wait(1400);};
 const bash=async x=>{await move(0,x-120);await page.keyboard.down('ArrowRight');await wait(335);await press('x');await page.keyboard.up('ArrowRight');await wait(300);};
 const check=async(key,value=true)=>{const g=await machine();if(g[key]!==value)throw Error(key+' expected '+value+' got '+JSON.stringify(g));};
 await page.setViewportSize({width:1440,height:900});await page.goto('https://united-marsh-6ppd.here.now/?forge=31');await page.locator('#rounds').click();await page.locator('button[data-round="5"]').click();await wait(350);
await move(1,890);await faceRight();await page.screenshot({path:'output/playwright/story41-hanging.png'});await page.keyboard.press('z');await wait(30);const cut=JSON.parse(await page.locator('#game').getAttribute('data-forge-material'));if(cut.stage!=='cut')throw Error('No cut stage '+JSON.stringify(cut));await page.screenshot({path:'output/playwright/story41-cut.png'});await wait(300);const fall=JSON.parse(await page.locator('#game').getAttribute('data-forge-material'));if(fall.stage!=='fall')throw Error('No falling stage '+JSON.stringify(fall));await page.screenshot({path:'output/playwright/story41-fall.png'});await wait(360);const pour=JSON.parse(await page.locator('#game').getAttribute('data-forge-material'));if(pour.stage!=='pour')throw Error('No pour stage '+JSON.stringify(pour));await page.screenshot({path:'output/playwright/story41-pour.png'});await wait(700);const loaded=JSON.parse(await page.locator('#game').getAttribute('data-forge-material'));if(loaded.stage!=='loaded')throw Error('Ore did not arrive');await page.screenshot({path:'output/playwright/story41-loaded.png'});await check('ore');await move(2,940);await faceRight();await press('d');await move(1,800);for(let i=0;i<3;i++)await bash(520);await waitFor(st=>st.puzzle.machine.heat===3,'dragon forge heat');
await page.screenshot({path:'output/playwright/creative/dragon-forge.png'});
for(const id of [0,1,2])await move(id,1000);

 await wait(200);if(!(await state()).won)throw Error('Exit failed '+JSON.stringify(await state()));await page.screenshot({path:'output/playwright/creative/round-5-clear.png'});
return {cut,fall,pour,loaded,cleared:(await state()).won,health:(await state()).heroes.map(h=>h.hp)};
}