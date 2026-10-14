from pathlib import Path
import re
old=Path('archive/browser/browser-story41-routes.js').read_text(encoding='utf-8')
base=old[old.index('   const read='):old.index('   const jump=')]
base=base.replace('JSON.parse(el.dataset.enemies)','JSON.parse(el.dataset.enemies)').replace('25000','30000')
base=base.replace("won:el.dataset.won==='true'","paused:el.dataset.paused==='true',time:Number(el.dataset.simTime),won:el.dataset.won==='true'")
start=base.index('   const tick=');end=base.index('   const move=')
base=base[:start]+"""   const resume=()=>{if(read().paused){pulse('Escape');held.clear();}};
   const tick=async(v={},seconds=.03)=>{resume();input(v);const start=read().time;let first=true;while(read().time-start<seconds&&!read().won){resume();input(first?v:{left:v.left,right:v.right});first=false;await new Promise(r=>requestAnimationFrame(r));if(read().failed)throw Error('Death '+JSON.stringify(read()));}};
"""+base[end:]
base=base.replace('const state=read(),h=', 'resume();const state=read(),h=')
route=Path('tests/routes/story-route.js').read_text(encoding='utf-8')
helpers=route[route.index(' const jump='):route.index(' tick({},.5);')]
helpers=helpers.replace("assert.equal(s.heroes[0].support,2,'Shield boarding');","if(read().heroes[0].support!==2)throw Error('Shield boarding');")
helpers=helpers.replace("assert.equal(s.heroes[0].y,366,'Shelf landing');","if(read().heroes[0].y!==366)throw Error('Shelf landing');")
helpers=helpers.replace("assert.equal(e.hp,0,'Defeat '+e.x);","if(read().enemies[0].hp>0)throw Error('Enemy not defeated');")
helpers=helpers.replace("while(e.hp>0&&n++<12)","while(read().enemies[0].hp>0&&n++<12)")
helpers=helpers.replace("assert.ok(Math.abs(l.y-l.target)<.1,'Lift arrival');", "if(Math.abs(read().machine.lifts[index].y-read().machine.lifts[index].target)>.1)throw Error('Lift arrival');")
helpers=helpers.replace("assert.ok(Math.abs(s.heroes[id].y+44-l.y)<.1,'Rider '+id);", "if(Math.abs(read().heroes[id].y+44-read().machine.lifts[index].y)>.1)throw Error('Lift rider '+id);")
body=route[route.index(' tick({},.5);'):route.index("assert.ok(s.won,'Uncleared")]
body=body.replace("assert.equal(s.machine.work,1,'Protected stroke');","if(read().machine.work!==1)throw Error('Protected stroke');").replace("assert.ok(s.heroes[0].inventory.includes('archive'));","if(!read().heroes[0].inventory.includes('archive'))throw Error('Archive return');").replace("assert.equal(s.heroes[2].y,766,'Float lower landing');","if(read().heroes[2].y!==766)throw Error('Float landing');")
code=helpers+body
code=code.replace('move(0,2280);',"move(0,2280);await capture('canopy-reveal');")
code=code.replace("const sword=x=>{move(1,x-55);face(1);tick({sword:true});tick({},2.2);}","const sword=x=>{move(1,x-55);face(1);await capture('restraint-before');tick({sword:true});tick({},2.2);await capture('restraint-after');}")
code=code.replace('let n=0;while(read().enemies[0].hp', "await capture('enemy-grounded');let n=0;while(read().enemies[0].hp")
code=code.replace('use(ids[ids.length-1]);tick({},5);',"use(ids[ids.length-1]);tick({},1.5);await capture('lift-travel');tick({},3.5);")
code=re.sub(r's\.active=(\d);',r'select(\1);',code)
names=['tick','move','face','use','item','jump','boost','sword','bow','clear','secure','ride']
for name in names:code=re.sub(r'\b'+name+r'\(', 'await '+name+'(',code)
code=re.sub(r'(const \w+=)(\([^\n]*?\)|\w+)=>',r'\1async \2=>',code)
split=code.index(' if(s.round!==6)')
finish=code[split:]
code=code[:split]+"input({});window.finishCampaignRoute=async()=>{"+finish+"const end=read();if(!end.won)throw Error('Incomplete '+JSON.stringify(end));return {chapter:round+1,won:end.won,health:end.heroes.map(h=>h.hp)};};return {staged:true};"
# Current state is read through getters; no injected flags/positions/items.
prefix="const s={get round(){return round},get heroes(){return read().heroes},get machine(){return read().machine},get enemies(){return read().enemies}};const capture=async label=>{resume();input({});await window['campaignCapture'+round](label);resume();held.clear();};\n"
for round in range(8):
 script="async page=>{const errors=[];page.on('pageerror',e=>errors.push(String(e)));await page.setViewportSize({width:1440,height:900});await page.goto('http://127.0.0.1:3000/?campaign=story&arc=46');await page.exposeBinding('campaignCapture%d',async(_source,label)=>{await page.bringToFront();if(await page.locator('#game').getAttribute('data-paused')==='true')await page.locator('#pause').click();await page.waitForTimeout(60);await page.screenshot({path:'output/playwright/campaign46-%d-'+label+'.png'});}).catch(e=>{if(!String(e).includes('already'))throw e;});await page.evaluate(()=>localStorage.setItem('last-call-story-cards','off'));await page.locator('#rounds').click();await page.locator('button[data-round=\"%d\"]').click();await page.evaluate(async round=>{\n"%(round,round+1,round)+base+prefix+code+"},%d);await page.screenshot({path:'output/playwright/campaign46-chapter-%d-machinery.png'});const result=await page.evaluate(()=>window.finishCampaignRoute());await page.screenshot({path:'output/playwright/campaign46-chapter-%d-clear.png'});if(errors.length)throw Error(errors.join(';'));return result;}"%(round,round+1,round+1)
 Path('browser-campaign46-%d.js'%round).write_text(script,encoding='utf-8')
print('Created eight adaptive browser playthroughs using production key events.')
