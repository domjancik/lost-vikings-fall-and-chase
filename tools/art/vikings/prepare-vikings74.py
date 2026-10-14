"""Whole-frame normalization only. Never transplant body rows or refit poses."""
from pathlib import Path
from PIL import Image
import numpy as np,json
r=Path('assets/vikings74');src=Image.open(r/'erik-source.png').convert('RGBA')
assert src.width==src.height,'guide grid must retain square4x4layout'
native=src.resize((256,256),Image.Resampling.NEAREST);a=np.array(native)
a[:,:,3]=np.where(a[:,:,3]>=220,255,0);a[a[:,:,3]==0,:3]=0
native=Image.fromarray(a);native.save(r/'erik-candidate.png')
native.resize((1024,1024),Image.Resampling.NEAREST).save(r/'erik-candidate-review.png')
records=[]
for n in range(16):
 f=native.crop((n%4*64,n//4*64,n%4*64+64,n//4*64+64));records.append({'frame':n,'bounds':f.getbbox(),'translation':[0,0]})
(r/'erik-candidate-registration.json').write_text(json.dumps({'sourceSize':src.size,'nativeCell':[64,64],'worldCell':[128,128],'uniformScale':256/src.width,'frames':records,'status':'UNREVIEWED experiment, not selectable production skin'},indent=2)+'\n')
