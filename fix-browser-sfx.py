from pathlib import Path
p=Path('browser-sfx34.js');s=p.read_text(encoding='utf-8-sig');a=s.index("await page.locator('[data-key=\"primary\"]').dispatchEvent('pointerdown'");b=s.index('await page.waitForTimeout(1100);const mobile',a);s=s[:a]+"await page.locator('[data-key=\"primary\"]').click();"+s[b:];p.write_text(s,encoding='utf-8')
