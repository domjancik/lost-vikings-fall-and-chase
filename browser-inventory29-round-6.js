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
 
 await page.setViewportSize({width:1440,height:900});await page.goto('http://127.0.0.1:3000/?inventory=29');await page.locator('#rounds').click();await page.locator('button[data-round="6"]').click();await wait(300);
 const bagItem=async(id,type,close=true)=>{await select(id);await page.locator('#bag').click();const h=(await state()).heroes[id],slot=h.inventory.indexOf(type);if(slot<0)throw Error('Missing '+type+' '+JSON.stringify(h));await page.locator('[data-slot="'+slot+'"]').click();if(close)await page.locator('#use-item').click();};
 const climb=async()=>{await move(0,240);await jump(320);await move(0,380);await jump(470);await move(0,520);await jump(610);};
await move(1,300);await faceRight();await press('Space');await move(1,350);await use(1);await climb();await use(0);await move(0,720);await wait(1600);await move(0,620);await move(1,600);
await bagItem(0,'spice',false);await page.locator('#give-target').selectOption('1');await page.locator('#give-item').click();await page.locator('#close-inventory').click();
await bagItem(1,'flour');await bagItem(1,'spice');await move(2,1040);await faceRight();await move(1,990);await bagItem(1,'dough');await use(1);await waitFor(st=>st.puzzle.machine.baked,'baked ticket');await use(1);await move(1,1200);await bagItem(1,'ticket');await requireFlag('power');
 for(const id of [0,1,2])await move(id,1340);await wait(500);const final=await state();if(!final.won||final.failed||final.heroes.some(h=>h.hp<=0))throw Error('Not cleared '+JSON.stringify(final));console.log('CLEARED '+JSON.stringify(final));await page.screenshot({path:'output/playwright/story41-round-6.png'});
}