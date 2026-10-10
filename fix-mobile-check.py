from pathlib import Path
p=Path('browser-collision23-mobile.js');s=p.read_text(encoding='utf-8').replace("await page.locator('#play').click();","await page.locator('#play').click();await page.locator('#rounds').click();await page.locator('button[data-round=\"0\"]').click();await page.waitForTimeout(150);");p.write_text(s,encoding='utf-8')
