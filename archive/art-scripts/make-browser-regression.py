from pathlib import Path
q=Path('browser-collision22-round-5.js');s=q.read_text(encoding='utf-8-sig');start=s.index('await select(2);await press(\'Space\');await move(1,890)');end=s.index("await page.screenshot({path:'output/playwright/creative/dragon-forge.png'});",start);s=s[:start]+"await move(1,890);await faceRight();await press('z');await check('ore');await move(2,940);await faceRight();await press('d');await move(1,800);for(let i=0;i<3;i++)await bash(520);await waitFor(st=>st.puzzle.machine.heat===3,'dragon forge heat');\n"+s[end:];q.write_text(s,encoding='utf-8')
files=['browser-explore21-route.js','browser-collision22-round-1.js','browser-collision22-round-2.js','output/playwright/creative/round-3.js','output/playwright/creative/round-4.js','browser-collision22-round-5.js']
combined="async page=>{await page.setViewportSize({width:1440,height:900});await page.goto('http://127.0.0.1:3000/?inventory=29');const results=[];\n"
for i,f in enumerate(files):
 s=Path(f).read_text(encoding='utf-8-sig');s=s.replace("locator('[data-round=","locator('button[data-round=")
 s=s.replace("won:el.dataset.won==='true',", "won:el.dataset.won==='true',failed:el.dataset.failed==='true',")
 s=s.replace('if(st.won)break;',"if(st.failed)throw Error('Viking died '+JSON.stringify(st));if(st.won)break;")
 # Return authoritative final read-only state.
 at=s.rfind('}');s=s[:at]+"return await state();\n"+s[at:]
 combined+='results.push(await ('+s+')(page));\n'
combined+='return results.map(s=>({round:s.round,won:s.won,failed:s.failed,health:s.heroes.map(h=>h.hp)}));}'
Path('browser-inventory29-old-campaign.js').write_text(combined,encoding='utf-8')
