from pathlib import Path
base=Path('browser-collision22-round-1.js').read_text(encoding='utf-8-sig');base=base[:base.index('await page.locator',base.index('const check='))] if 'await page.locator' in base[base.index('const check='):] else base
print(base[-1300:])
