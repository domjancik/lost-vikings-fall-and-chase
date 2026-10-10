async page=>{
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.goto('http://127.0.0.1:3000/?campaign=story');await page.evaluate(()=>localStorage.setItem('last-call-story-cards','off'));
 await page.locator('#play-story').click();const reports=[];
 for(let round=2;round<3;round++){
  await page.setViewportSize(round===5?{width:390,height:844}:{width:1440,height:900});await page.locator('#rounds').click();await page.locator('button[data-round="'+round+'"]').click();
  const result=await page.evaluate(async round=>{
   const read=()=>{const el=document.querySelector('#game');return {heroes:JSON.parse(el.dataset.heroes),enemies:JSON.parse(el.dataset.enemies),machine:JSON.parse(el.dataset.puzzle).machine,won:el.dataset.won==='true',failed:el.dataset.failed==='true'};};
   let active=0;const held=new Set();
   const pulse=key=>{const code=key===' '?'Space':key==='['?'BracketLeft':key===']'?'BracketRight':/^\d$/.test(key)?'Digit'+key:key.length===1?'Key'+key.toUpperCase():key;for(const type of ['keydown','keyup'])window.dispatchEvent(new KeyboardEvent(type,{key,code,bubbles:true}));};
   const select=id=>{if(active!==id){pulse(String(id+1));active=id;}};
   const input=v=>{for(const [key,on] of [['ArrowLeft',!!v.left],['ArrowRight',!!v.right]]){if(on&&!held.has(key)){held.add(key);window.dispatchEvent(new KeyboardEvent('keydown',{key,code:key,bubbles:true}));}if(!on&&held.has(key)){held.delete(key);window.dispatchEvent(new KeyboardEvent('keyup',{key,code:key,bubbles:true}));}}if(v.jump||v.sword)pulse(' ');if(v.action)pulse('d');if(v.interact)pulse('e');if(v.item)pulse('q');};
   const tick=async(v={},seconds=.03)=>{input(v);await new Promise(r=>setTimeout(r,seconds*1000));if(read().failed)throw Error('Death chapter '+round+' '+JSON.stringify(read()));};
   const move=async(id,x)=>{select(id);let done=false,start=performance.now();while(performance.now()-start<25000){const state=read(),h=state.heroes[id],d=x-h.x;if(state.won||Math.abs(d)<3&&Math.abs(h.vx)<12){done=true;break;}const brake=h.ground?[2600,2300,2100][id]:[1250,950,750][id],r=d-h.vx*Math.abs(h.vx)/(2*brake);input(Math.abs(r)<2?{}:r>0?{right:true}:{left:true});await new Promise(r=>requestAnimationFrame(r));if(read().failed)throw Error('Death moving '+id+' chapter '+round+' '+JSON.stringify(read()));}await tick({},.15);if(!done)throw Error('Blocked '+id+' target '+x+' chapter '+round+' '+JSON.stringify(read()));};
   const face=async(id,dir=1)=>{select(id);await tick(dir>0?{right:true}:{left:true},.06);await tick({},.1);};
   const use=async id=>{select(id);await tick({interact:true},.1);};
   const item=async(id,type)=>{select(id);const h=read().heroes[id],slot=h.inventory.indexOf(type);if(slot<0)throw Error('Missing '+type);for(let i=0;i<(slot-h.itemSlot+4)%4;i++)pulse(']');await tick({item:true});};
   const jump=async x=>{select(0);await tick({jump:true});await move(0,x);await tick({},.8);};
   const climb=async x=>{await move(0,x-20);await jump(x+60);await move(0,x+120);await jump(x+220);await move(0,x+265);await jump(x+370);};
   const sword=async()=>{await face(1);await tick({sword:true});};const bow=async(wait=.6)=>{await face(1);await tick({action:true});await tick({},wait);};
   const clearEnemies=async(max=Infinity)=>{const ids=read().enemies.map((e,i)=>e.hp>0&&e.x<max?i:-1).filter(i=>i>=0);for(const i of ids){await move(1,read().enemies[i].left-490);let shots=0;while(read().enemies[i].hp>0){await bow(1.2);if(++shots>30)throw Error('Enemy unreachable '+i+' chapter '+round);}}};
   const bash=async x=>{await move(0,x-120);select(0);await tick({right:true},.32);await tick({action:true,right:true},.15);await tick({},.3);};
   const board=async x=>{await move(2,x);await tick({},.8);select(2);await tick({jump:true});await move(1,x+10);await move(0,x-10);await tick({},.1);if(!read().heroes.slice(0,2).every(h=>h.support===2))throw Error('Boarding '+JSON.stringify(read()));};
   const check=(key,value=true)=>{if(read().machine[key]!==value)throw Error(key+' missing '+JSON.stringify(read()));};
   await tick({},.5);
   switch(round){
    case 0:await climb(360);await use(0);await move(0,860);await tick({},1.2);await item(0,'serviceKey');await move(0,600);await clearEnemies();await move(1,1585);await sword();check('cable');break;
    case 1:await clearEnemies();await climb(930);await use(0);check('dispatch');await move(1,1700);await bow();check('delivery');await move(2,1490);await face(2);await move(2,2330);check('parked');break;
    case 2:await bash(550);check('bell');await move(2,760);await use(2);await move(2,1450);await face(2,-1);select(2);await tick({action:true});await tick({},3.2);check('mirror');await move(1,760);await use(1);await move(1,1610);await sword();check('seal');for(const id of [0,1,2]){if(read().heroes[id].x<900){await move(id,760);await use(id);}await move(id,1730);await use(id);}select(1);await face(1);await bow(.8);break;
    case 3:await clearEnemies();await move(1,1740);await sword();await move(2,1940);await face(2);await move(1,1740);for(let i=0;i<3;i++)await bash(850);await tick({},7);check('heat',3);await move(0,2020);await use(0);await move(0,2520);await item(0,'ticket');break;
    case 4:await move(2,610);select(2);await tick({jump:true});await move(0,560);await jump(610);await jump(730);await use(0);await move(0,890);await tick({},1);await item(0,'red');await move(0,700);await clearEnemies(1800);await move(1,1370);await use(1);await move(1,1790);await face(1);await item(1,'bomb');await move(1,1580);await tick({},2.3);check('safe');await clearEnemies();await move(1,1910);await use(1);await move(1,2520);await item(1,'archive');break;
    case 5:await move(1,230);await sword();await board(490);await use(2);await tick({},3.5);await move(2,800);await move(1,1000);await bow(.6);check('chime');await board(1460);await use(2);await tick({},4.1);await move(2,1780);await move(0,2190);await jump(2330);await use(0);check('aligned');break;
    case 6:await climb(350);await use(0);await move(1,985);await sword();check('restraint');await move(2,1340);select(2);await tick({jump:true});await tick({},2);for(const [id,x] of [[0,1700],[1,2040],[2,2370]]){await move(id,x);await use(id);}if(!read().machine.transferred.every(Boolean))throw Error('Transfers missing');break;
    case 7:await clearEnemies();await climb(1080);await use(0);await move(1,1670);await sword();check('cord');check('hatch');break;
   }
   if(round!==6){for(const id of [0,1,2])await move(id,2720);await tick({},.3);}input({});const end=read();if(!end.won)throw Error('Incomplete '+round+' '+JSON.stringify(end));return {chapter:round+1,won:end.won,health:end.heroes.map(h=>h.hp),enemiesDefeated:end.enemies.filter(e=>!e.hp).length};
  },round);
  reports.push(result);console.log(JSON.stringify(result));await page.screenshot({path:'output/playwright/story41-chapter-'+(round+1)+'-clear.png'});
 }
 if(errors.length)throw Error(errors.join(';'));return {reports,errors};
}
