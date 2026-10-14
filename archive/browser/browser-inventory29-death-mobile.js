async page => {
 const state=async()=>page.locator('#game').evaluate(el=>({heroes:JSON.parse(el.dataset.heroes),puzzle:JSON.parse(el.dataset.puzzle),won:el.dataset.won==='true',failed:el.dataset.failed==='true',items:JSON.parse(el.dataset.items),round:+el.dataset.round}));
 const wait=ms=>page.waitForTimeout(ms);
 const select=async id=>{await page.keyboard.press(String(id+1));await wait(30);};
 const move=async(id,target)=>{
  await select(id);let held=null;const deadline=Date.now()+10000;
  while(Date.now()<deadline){const st=await state();if(st.failed)throw Error('Viking died '+JSON.stringify(st));if(st.won)break;const h=st.heroes[id],d=target-h.x;
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
 
 await page.setViewportSize({width:1440,height:900});await page.goto('http://127.0.0.1:3000/?inventory=29');await page.locator('#rounds').click();await page.locator('button[data-round="8"]').click();await wait(300);
 const bagItem=async(id,type,close=true)=>{await select(id);await page.locator('#bag').click();const h=(await state()).heroes[id],slot=h.inventory.indexOf(type);if(slot<0)throw Error('Missing '+type+' '+JSON.stringify(h));await page.locator('[data-slot="'+slot+'"]').click();if(close)await page.locator('#use-item').click();};
 const climb=async()=>{await move(0,240);await jump(320);await move(0,380);await jump(470);await move(0,520);await jump(610);};
await move(0,520);await use(0);await bagItem(0,'bomb');await wait(2600);const dead=await state();if(!dead.failed||dead.heroes[0].hp!==0)throw Error('Missing lethal bomb damage');if(!await page.locator('#death').isVisible())throw Error('Death overlay hidden');await page.screenshot({path:'output/playwright/story41-death.png'});await page.locator('#retry-death').click();await wait(300);if((await state()).failed||(await state()).heroes.some(h=>h.hp!==3))throw Error('Retry did not reset health');
await page.setViewportSize({width:390,height:844});await page.locator('#bag').click();await wait(200);let bounds=await page.locator('#inventory-dialog').boundingBox();if(bounds.x<0||bounds.x+bounds.width>391)throw Error('Bag overflows portrait');if(await page.locator('[data-slot]').count()!==4)throw Error('Missing slots');await page.screenshot({path:'output/playwright/story41-mobile-bag.png'});await page.locator('#close-inventory').click();await page.locator('#fullscreen').click({trial:true});await page.setViewportSize({width:320,height:568});await page.locator('#bag').click();await wait(200);bounds=await page.locator('#inventory-dialog').boundingBox();if(bounds.x<0||bounds.x+bounds.width>321)throw Error('Bag overflows small phone');await page.locator('#use-item').click({trial:true}).catch(()=>{});await page.screenshot({path:'output/playwright/story41-small-bag.png'});await page.locator('#close-inventory').click();await page.setViewportSize({width:844,height:390});await page.locator('#bag').click();await wait(200);await page.screenshot({path:'output/playwright/story41-landscape-bag.png'});await page.locator('#close-inventory').click();return {death:dead.heroes.map(h=>h.hp),retry:'healthy',mobile:'390x844,320x568,844x390'};
}