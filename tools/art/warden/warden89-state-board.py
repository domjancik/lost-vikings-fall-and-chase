from pathlib import Path
from PIL import Image,ImageDraw
import json
root=next(p for p in Path(__file__).resolve().parents if (p/'package.json').is_file());out=root/'output/warden89';data=json.loads((out/'browser-route.json').read_text())['evidence']
def crop(name,kind):
 s=data[name];cam=s['camera'];r=s['canvasRect'];a=s['art'][kind];im=Image.open(out/(name+'.png'));scale=r['width']/cam['width']
 width,height=(224,240)if kind=='eye' else (210,160);left=a['x']-width*.75 if kind=='eye' else 1250;top=a['y']-height*.55
 box=[round(r['x']+(left-cam['x'])*scale),round(r['y']+(top-cam['y'])*scale),round(r['x']+(left+width-cam['x'])*scale),round(r['y']+(top+height-cam['y'])*scale)]
 return im.crop(box)
names=['cap-before','cap-start','cap-middle','cap-full','lens-open','shutdown-complete'];board=Image.new('RGB',(6*290,570),'#16222c');d=ImageDraw.Draw(board)
for i,name in enumerate(names):
 for row,kind in enumerate(['eye','plunger']):
  if kind=='plunger' and i>=4:continue
  im=crop(name,kind);board.paste(im,(i*290,row*280+25));d.text((i*290+4,row*280+6),f'{name} | {kind}',fill='#e7c678')
board.save(out/'registered-state-board.png')
