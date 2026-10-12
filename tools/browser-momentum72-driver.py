from pathlib import Path
p=Path('browser-momentum68.js').read_text(encoding='utf-8').replace('3015','3019').replace('momentum68','momentum72').replace("['start','rider'","['start','rolling','upper-rail','rider'")
p=p.replace("await page.waitForFunction(()=>JSON.parse", "if((await page.locator('#zoom').textContent()).startsWith('1'))await page.locator('#zoom').click();await page.waitForFunction(()=>JSON.parse",1)
Path('browser-momentum72.js').write_text(p,encoding='utf-8')
