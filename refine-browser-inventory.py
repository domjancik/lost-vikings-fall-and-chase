from pathlib import Path
for q in Path('.').glob('browser-inventory29-*.js'):
 s=q.read_text(encoding='utf-8').replace("locator('[data-round=", "locator('button[data-round=");q.write_text(s,encoding='utf-8')
