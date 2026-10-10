from pathlib import Path
scripts=[]
for r in [1,2,3,4,5]:
 p=Path(f'browser-collision22-round-{r}.js') if r in [1,2,5] else Path(f'output/playwright/creative/round-{r}.js')
 scripts.append('await ('+p.read_text(encoding='utf-8-sig').strip()+')(page);')
Path('browser-feel26-campaign.js').write_text('async page=>{\n'+'\n'.join(scripts)+'\n}',encoding='utf-8')
