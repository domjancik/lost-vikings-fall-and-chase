from pathlib import Path
from PIL import Image
import ast,json,re
base=Path('C:/Users/magne/.codex/generated_images/01a11dbd-7cba-7623-810b-89ce1687aed7')
targets=re.findall(r"'(assets/pixel/[^']+)'",Path('publish-update.mjs').read_text())
manifest={t:{'target':t,'size':list(Image.open(t).size),'source':'assets/'+Path(t).name} for t in targets}
def generated(target,uuid):manifest['assets/pixel/'+target+'.png']['source']='generated/exec-'+uuid+'.png'
def ids(file):
 tree=ast.parse(Path(file).read_text(encoding='utf-8-sig'))
 return next(ast.literal_eval(n.value) for n in tree.body if isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id=='files' for t in n.targets))
for i,id in enumerate(ids('normalize-depth.py')):generated('depth-far-'+str(i),id)
for i,id in enumerate(ids('normalize-cutouts37.py')):generated('depth-near-'+str(i),id)
for i,id in [(3,'f85cfbbb-c6bb-4495-a3d4-07f40f6f028c'),(5,'5a60799c-c42a-4364-948f-ad43283b3183'),(6,'a9becb87-2a9e-4271-8f99-c85874876ab0')]:generated('depth-near-'+str(i),id)
for name,id in [('depth-near-9','75818ceb-0d4f-464a-9be5-2ecef814af3f'),('depth-far-9','006443f2-b73b-495e-b068-9df71b7ed77d'),('depth-far-10','38e65d68-9e7f-4027-a262-d5fe906e9eac'),('depth-near-10','38973054-74b9-49fc-ab33-876c2ffaa2ae'),('vertical-props','ae6ea3ae-2dce-4238-a984-011dfb295e0c'),('background-fx','226b3b77-20fd-425a-bf66-fed19c538b4d'),('machine-states','b294503f-cd0d-46bd-b31f-3cf1494dbeab'),('story-far','10435759-0761-438c-a32b-739d04c8d1dd'),('story-near','f1f0010c-2de2-4f71-9675-2b16eda3b9f4'),('story-enemies','2ea621b5-ef7b-4d81-86e3-48ab40524f3a'),('story-doors','a7e1b778-3d77-451f-837f-768135294ca5')]:generated(name,id)
bg=Image.open('assets/inventory-backgrounds.png');edges=[0,480,970,bg.height]
for i in range(3):manifest[f'assets/pixel/inventory-background-{i+1}.png'].update(source='assets/inventory-backgrounds.png',crop=[0,edges[i],bg.width,edges[i+1]])
sprites=Image.open('assets/inventory-sprites.png');edges=[0,315,620,915,sprites.height];pieces=[]
for n in range(16):
 row,col=divmod(n,4);pieces.append({'crop':[round(col*sprites.width/4),edges[row],round((col+1)*sprites.width/4),edges[row+1]],'size':[80,80],'at':[col*80,row*80]})
manifest['assets/pixel/inventory-sprites.png']['pieces']=pieces
for item in manifest.values():
 source=item['source'];path=base/source.removeprefix('generated/') if source.startswith('generated/') else Path(source)
 assert path.exists(),path
Path('tools/pixel-assets.json').write_text(json.dumps(list(manifest.values()),indent=2),encoding='utf-8');print('Manifest:',len(manifest),'published assets, all original sources found')
