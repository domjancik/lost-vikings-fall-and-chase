"""Prepare accepted V3 once at authored density; measure retained contact art."""
from pathlib import Path
from PIL import Image
import numpy as np
import json

folder=Path('assets/warden102')
source=Image.open(folder/'parts-raw-v3.png').convert('RGBA')
image=source.resize((512,512),Image.Resampling.NEAREST)
a=np.array(image)
r,g,b=a[:,:,0].astype(int),a[:,:,1].astype(int),a[:,:,2].astype(int)
# Reject only saturated exterior generation fringe, not brown corrosion/bronze.
fringe=((r>200)&(g<90)&(b<90))|((r>120)&(g>120)&(b<20)&(np.abs(r-g)<50))
a[(a[:,:,3]<200)|fringe]=0
a[a[:,:,3]>=200,3]=255
image=Image.fromarray(a)
original=Image.open('assets/warden97/parts-native.png').convert('RGBA')
meta=json.loads(Path('assets/warden97/registration.json').read_text(encoding='utf-8'))
# Retain complete contact components; measure the feet below instead of trusting
# their previous sole metadata. Deck registration has separate reviewed evidence.
inherited=['foot-near','foot-far','clamp','spoke','cargo-held','cargo-free','cargo-running']
for name in inherited:
 x,y,w,h=meta['parts'][name]
 image.paste(original.crop((x,y,x+w,y+h)),(x,y))
allowed=np.zeros((512,512),dtype=bool)
for x,y,w,h in meta['parts'].values():allowed[y:y+h,x:x+w]=True
z=np.array(image);z[~allowed]=0;image=Image.fromarray(z)
image.save(folder/'parts-native.png')
image.resize((1024,1024),Image.Resampling.NEAREST).save(folder/'parts-native-2x.png')
meta.update(source='parts-raw-v3.png',normalization='Accepted native-density V3; one uniform nearest presentation normalization; alpha200/extreme exterior fringe removal; complete inherited contact components unchanged',inheritedComponents=inherited)
# The contact is the exclusive bottom of a broad opaque material row.
# Row39 was inside both boots and buried them below their physical floor.
soles={}
for name in ['foot-near','foot-far']:
 x,y,w,h=meta['parts'][name]
 alpha=np.array(image.crop((x,y,x+w,y+h)))[:,:,3]
 rows=np.flatnonzero((alpha>=200).sum(axis=1)>=max(2,int(np.ceil(w*.08))))
 if not len(rows):raise ValueError('Missing visible sole: '+name)
 soles[name]=int(rows[-1])+1
meta['anchors'].pop('footSole',None)
meta['anchors']['footSoles']=soles
(folder/'registration.json').write_text(json.dumps(meta,indent=2),encoding='utf-8')
Path('src/levels/warden/art.js').write_text('export const WARDEN_ART='+json.dumps(meta)+';\n',encoding='utf-8')
glass=image.crop((312,160,416,276));z=np.array(glass);yy,xx=np.mgrid[:116,:104]
z[((xx-86)/18)**2+((yy-58)/36)**2>1]=0
Image.fromarray(z).save(folder/'broken-lens-native.png')
