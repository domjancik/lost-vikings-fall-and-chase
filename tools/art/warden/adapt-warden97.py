from pathlib import Path
p=Path('tests/browser/runners/browser-warden97.mjs')
s=Path('tests/browser/runners/browser-warden91.mjs').read_text().replace('WARDEN91_LIVE','WARDEN97_LIVE').replace('release-warden91','release-warden97').replace('output/warden91','output/warden97').replace('release=91','release=warden97')
s=s.replace("await page.locator('#play-warden').click({timeout:120000});",'''await page.evaluate(()=>localStorage.setItem('last-call-story-cards','off'));await page.locator('#start-picker [data-campaign-option="cycle"]').click();await page.locator('#start-picker .level-card[data-round="5"]').click();''')
s=s.replace("document.querySelector('#game').dataset.round==='0'","document.querySelector('#game').dataset.round==='6'")
s=s.replace("[{width:844,height:390},'mobile']", "[{width:844,height:390},'mobile'],[{width:430,height:780},'portrait']")
p.write_text(s)
