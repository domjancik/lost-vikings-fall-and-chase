"""One uniform normalization, conservative matte removal, component extraction.
No shape stretching or sprite-density detection. Preserve all retained sources.
"""
from pathlib import Path
from PIL import Image
import numpy as np
import json
folder=Path('assets/warden97')
im=Image.open(folder/'parts-raw-v3.png').convert('RGBA').resize((512,512),Image.Resampling.NEAREST)
a=np.array(im); rgb=a[:,:,:3].astype(float)
chroma=((rgb[:,:,1]>rgb[:,:,0]*1.7)&(rgb[:,:,1]>rgb[:,:,2]*1.8))|((rgb[:,:,0]>rgb[:,:,1]*2.5)&(rgb[:,:,0]>rgb[:,:,2]*2.5))
a[(a[:,:,3]<200)|chroma]=0;a[a[:,:,3]>=200,3]=255
im=Image.fromarray(a)
old=Image.open('assets/warden89/parts-native.png').convert('RGBA')
# Small already-reviewed hinge/spoke components retain their authored shapes.
for src,dst in [((343,56,357,80),(0,480)),((440,298,452,302),(16,480))]:im.paste(old.crop(src),dst)
im.save(folder/'parts-native.png')
im.resize((1024,1024),Image.Resampling.NEAREST).save(folder/'parts-native-2x.png')
parts={'body':[0,32,320,124],
 'upper-near':[328,32,40,93],'lower-near':[376,32,40,93],
 'upper-far':[424,32,40,93],'lower-far':[472,32,40,93],
 'joint-near':[333,33,32,32],'joint-far':[427,33,32,32],
 **{n:[i*104,160,104,116] for i,n in enumerate(['head-closed','head-opening','head-open','head-broken'])},
 'foot-near':[416,170,48,48],'foot-far':[464,170,48,48],
 'clamp':[0,480,14,24],'spoke':[16,480,12,4],
 **{n:[i*168,376,168 if i<2 else 176,104] for i,n in enumerate(['cargo-held','cargo-free','cargo-running'])}}
meta=dict(nativeSize=[512,512],worldPixel=2,source='parts-raw-v3.png',normalization='uniform nearest sampling once; alpha threshold200 and chroma matte rejection; component pivots and separate joint caps',parts=parts,
 anchors=dict(bodyDeck=4,linkPivots=[[24,16],[23,16],[22,16],[21,16]],footPivot=[20,15],footSole=39,headEye=[86,58],cargoRim=[9,60,159]))
(folder/'registration.json').write_text(json.dumps(meta,indent=2))
Path('warden-art97.js').write_text('export const WARDEN_ART='+json.dumps(meta)+';\n')
glass=im.crop((312,160,416,276));a=np.array(glass);yy,xx=np.mgrid[:116,:104];a[((xx-86)/18)**2+((yy-58)/36)**2>1]=0;Image.fromarray(a).save(folder/'broken-lens-native.png')
# Reuse accepted91 state frames at native density; only a uniform color grade.
for name in ['plunger','emitter']:
 p=Image.open('assets/warden91/'+name+'-native.png').convert('RGBA');a=np.array(p);r=a[:,:,:3].astype(float);gray=r.mean(axis=2,keepdims=True)
 a[:,:,:3]=np.clip((r*.62+gray*.38)*.92,0,255).astype('uint8');Image.fromarray(a).save(folder/(name+'-native.png'))
