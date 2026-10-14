"""Retain review receipts and representative actual browser frames; no image edits."""
from pathlib import Path
import shutil,json
out=Path('assets/freight109/evidence');out.mkdir(exist_ok=True)
for source,target in [('output/freight109-final/route.json','full-route.json'),('output/freight109-clean-upper2/route.json','final-upper-route.json'),('output/freight109-danger/route.json','death-retry.json'),('output/freight109-touch/touch.json','touch.json')]:
    shutil.copyfile(source,out/target)
frames=[]
for folder,names in [
 ('output/freight109-final',['clear-first-riser-1x','clear-first-riser-2x','draft-rising-2x','winch-unrolling-2x','trolley-crossing-2x','cell-carried-1x','second-riser-powered-2x','purging-1x','shutter-retracting-1x','crew-departure-1x','crew-departure-landscape']),
 ('output/freight109-clean-upper2',['inspector-charge-1x','inspector-charge-2x','inspector-firing-2x','inspector-firing-portrait','inspector-recovered-2x']),
 ('output/freight109-danger',['actual-death','reset-2x']),
 ('output/freight109-touch',['coarse-touch'])]:
    for name in names:
        source=Path(folder)/'captures'/(name+'.png');shutil.copyfile(source,out/source.name)
        frames.append({'file':source.name,'origin':str(source),'kind':'actual production browser screenshot; ordinary controls; no staged simulation state'})
(out/'index.json').write_text(json.dumps({'frames':frames,'note':'Complete baseline progression plus final targeted matte/warning correction views; full route remainedHP3/3/3. Raw source/native sheets retained in parent directory.'},indent=2),encoding='utf-8')
p=Path('config/release-manifest.json');m=json.loads(p.read_text(encoding='utf-8'))
gate='assets/freight109/visual-gates.json'
if gate not in m['assets']:m['assets'].append(gate)
p.write_text(json.dumps(m,indent=2)+'\n',encoding='utf-8')
print('Retained',len(frames),'actual gameplay frames and four receipts; release gate declared.')
