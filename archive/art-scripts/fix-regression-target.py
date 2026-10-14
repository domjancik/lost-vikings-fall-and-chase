from pathlib import Path
q=Path('browser-inventory29-old-campaign.js');s=q.read_text(encoding='utf-8').replace('https://united-marsh-6ppd.here.now/?explore=21','http://127.0.0.1:3000/?inventory=29');q.write_text(s,encoding='utf-8')
