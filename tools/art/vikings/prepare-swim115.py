"""User-requested native size correction from retained original whole poses."""
from pathlib import Path
from PIL import Image
import json
import numpy as np
ROOT=next(p for p in Path(__file__).resolve().parents if (p/'package.json').is_file())
OUT=ROOT/'assets/water115';SOURCE=ROOT/'assets/water114'
assert json.loads((OUT/'source-gate.json').read_text())['verdict']=='accepted'
old=json.loads((SOURCE/'source-gate.json').read_text());assert old['verdict']=='accepted'
choices=['erik-swim-raw-v2.png']*8;choices[2]='erik-swim-raw-v3.png'
normalized={s:Image.open(SOURCE/s).convert('RGBA').resize((256,128),Image.Resampling.NEAREST) for s in set(choices)}
atlas=Image.new('RGBA',(320,160));records=[]
for i,source in enumerate(choices):
 assert i in old['acceptedCells'][source]
 original=normalized[source].crop((i%4*64,i//4*64,i%4*64+64,i//4*64+64));a=np.array(original)
 a[:,:,3]=np.where(a[:,:,3]>=128,255,0);a[a[:,:,3]==0,:3]=0
 yy,xx=np.indices((64,64));r,g,b=a[:,:,:3].astype(float).transpose(2,0,1)
 mask=(a[:,:,3]>0)&(xx>=37)&(xx<=50)&(yy>=31)&(yy<=40)&(g>r*.95)&(b>r*.9)&(g>45)
 ys,xs=np.nonzero(mask);assert len(xs)
 anchor=[float((xs.min()+xs.max())/2),float((ys.min()+ys.max())/2)];shift=[round(52-anchor[0]),round(48-anchor[1])]
 actor=Image.new('RGBA',(80,80));actor.alpha_composite(Image.fromarray(a),tuple(shift));bounds=actor.getbbox();assert bounds[3]<=70
 atlas.paste(actor,(i%4*80,i//4*80));area=int((np.array(actor)[:,:,3]>0).sum());assert 330<=area<=615
 records.append({'frame':i,'source':'assets/water114/'+source,'sourceCell':i,'authoringCell':64,'nativeCell':80,'helmetAnchor':anchor,'translation':shift,'bounds':list(bounds),'opaqueArea':area})
atlas.save(OUT/'erik-swim-native.png');atlas.resize((1280,640),Image.Resampling.NEAREST).save(OUT/'erik-swim-4x.png')
(OUT/'registration.json').write_text(json.dumps({'origin':[40,48],'nativeCell':[80,80],'authoringCell':[64,64],'columns':4,'worldPixel':2,'targetHelmet':[52,48],'standingArea':510,'records':records,'sourceGate':'accepted','runtimeGate':'pending'},indent=2)+'\n')
print('8 whole poses corrected at native64 authoring scale; runtime gate pending')
