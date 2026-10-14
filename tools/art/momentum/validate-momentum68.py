from pathlib import Path
from PIL import Image
import json
r=Path('assets/momentum68');meta=json.loads((r/'registration.json').read_text())
sizes={'relay':(256,256),'hazards':(256,256),'tiles':(160,32),'arm':(96,64),'furnace':(288,72),'bumper':(320,64),'scene':(768,512)}
for name,size in sizes.items():
 im=Image.open(r/(name+'.png'));assert im.size==size,(name,im.size)
 if im.mode=='RGBA':assert set(im.getchannel('A').get_flattened_data())<={0,255},name+' fractional alpha'
relay=Image.open(r/'relay.png')
for n in range(8):
 im=relay.crop((n%4*64,n//4*64,n%4*64+64,n//4*64+64));box=im.getbbox();assert box[3]-box[1]==meta['sphereRadius']==56,(n,box)
furnace=Image.open(r/'furnace.png');feet=[]
for n in range(4):
 im=furnace.crop((n*72,0,n*72+72,72));box=im.getbbox();assert 0<box[0]<box[2]<72,(n,box)
 foot={x for x in range(72) if im.getpixel((x,71))[3]};assert len(foot)>=35,(n,foot);feet.append(foot)
assert all(min(foot)==min(feet[0]) and abs(max(foot)-max(feet[0]))<=1 for foot in feet),'furnace bases drift'
hazards=Image.open(r/'hazards.png')
for n in range(8,12):
 im=hazards.crop((n%4*64,128,n%4*64+64,192));box=im.getbbox();assert box[1]==0 and box[3]<=35,(n,box)
 assert sum(im.getpixel((x,0))[3]>0 for x in range(64))>=40,(n,'flange not mounted')
bumper=Image.open(r/'bumper.png');base=[]
for n in range(4):base.append({x for x in range(80) if bumper.getpixel((n*80+x,63))[3]})
# A one-pixel bevel variation is authored; the mounting edge cannot move.
assert all(min(p)==min(base[0]) and abs(max(p)-max(base[0]))<=1 for p in base),'bumper base slides when extending'
assert meta['laserOutlet']==[36,35] and meta['furnaceMouth']==[18,45]
print('Native cells, binary alpha, sphere radius, stable furnace/bumper bases and laser flange/outlet validated.')
