from pathlib import Path
p=Path('browser-feel26-live.js');s=p.read_text(encoding='utf-8').replace("await page.locator('#play').click();", "await page.locator('#fullscreen').click({trial:true});if(!(await page.locator('script[type=module]').getAttribute('src')).includes('feel27'))throw Error('Old build');await page.locator('#play').click();");p.write_text(s,encoding='utf-8')
