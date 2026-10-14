async page => {
 await page.setViewportSize({width:1440,height:900});await page.goto('https://united-marsh-6ppd.here.now/?ghost=20');await page.locator('#play').click();
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
 const shoot=async()=>{await select(1);await faceRight();await press('d');await wait(1400);};
 const bash=async x=>{await move(0,x-120);await page.keyboard.down('ArrowRight');await wait(335);await press('d');await page.keyboard.up('ArrowRight');await wait(300);};
 const check=async(key,value=true)=>{const g=await machine();if(g[key]!==value)throw Error(key+' expected '+value+' got '+JSON.stringify(g));};
 await page.locator('#rounds').click();await page.locator('button[data-round="3"]').click();await wait(350);
 for(let i=0;i<60;i++){const shots=await page.locator('#game').evaluate(c=>JSON.parse(c.dataset.shots));if(shots.filter(p=>p.kind==='ghost').some(p=>p.x<650||p.x>790))throw Error('Ghost overlaps door corridor');await wait(50);}
 await page.screenshot({path:'output/playwright/story41-clearance.png'});
await bash(290);await check('bell');await move(0,340);await use(0);
await move(2,340);await use(2);await move(2,720);await faceLeft();await press('d');await waitFor(st=>st.puzzle.machine.mirror,'ghost reflected into eye');
await move(1,340);await use(1);await move(1,810);await faceRight();await press('Space');await check('seal');
await page.screenshot({path:'output/playwright/story41-haunted-rooms.png'});
for(const id of [1,2,0]){await move(id,830);await use(id);await move(id,1340);}

 await wait(200);if(!(await state()).won)throw Error('Exit failed '+JSON.stringify(await state()));await page.screenshot({path:'output/playwright/story41-level-clear.png'});
}