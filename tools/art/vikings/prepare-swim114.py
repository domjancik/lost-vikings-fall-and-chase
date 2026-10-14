"""Prepare reviewed whole swimming poses once from retained original sources.

Uniform atlas normalization, integer whole-actor helmet registration and alpha
cleanup only. No per-actor resizing, recoloring or body-part compositing.
"""
from pathlib import Path
from PIL import Image
import json
import numpy as np

ROOT=next(p for p in Path(__file__).resolve().parents if (p/'package.json').is_file())
OUT=ROOT/'assets/water114'
gate=json.loads((OUT/'source-gate.json').read_text())
assert gate['verdict']=='accepted', 'Independent source approval required'
choices=['erik-swim-raw-v2.png']*8
choices[2]='erik-swim-raw-v3.png'
normalized={}
for source in set(choices):
    raw=Image.open(OUT/source).convert('RGBA')
    normalized[source]=raw.resize((320,160),Image.Resampling.NEAREST)
    normalized[source].save(OUT/source.replace('-raw-','-source-native-'))

atlas=Image.new('RGBA',(320,160)); compare=Image.new('RGBA',(320,320),'#192c36'); records=[]; loops=[]
for i,source in enumerate(choices):
    assert i in gate['acceptedCells'][source], 'Unreviewed whole pose'
    original=normalized[source].crop((i%4*80,i//4*80,i%4*80+80,i//4*80+80))
    a=np.array(original);a[:,:,3]=np.where(a[:,:,3]>=128,255,0);a[a[:,:,3]==0,:3]=0
    opaque=a[:,:,3]>0;remove=[]
    for y,x in zip(*np.nonzero(opaque)):
        if np.count_nonzero(opaque[max(0,y-1):y+2,max(0,x-1):x+2])==1:remove.append((y,x))
    for y,x in remove:a[y,x]=0
    yy,xx=np.indices((80,80));r,g,b=a[:,:,:3].astype(float).transpose(2,0,1)
    steel=(a[:,:,3]>0)&(xx>=47)&(xx<=62)&(yy>=39)&(yy<=50)&(g>r*.95)&(b>r*.9)&(g>45)
    ys,xs=np.nonzero(steel);assert len(xs), 'Missing helmet landmark'
    anchor=[float((xs.min()+xs.max())/2),float((ys.min()+ys.max())/2)]
    shift=[round(55-anchor[0]),round(45-anchor[1])]
    native=Image.fromarray(a);actor=Image.new('RGBA',(80,80));actor.alpha_composite(native,tuple(shift))
    bounds=actor.getbbox();assert bounds and bounds[3]<=70, 'Swimming material crosses basin floor'
    atlas.paste(actor,(i%4*80,i//4*80))
    compare.alpha_composite(original,(i%4*80,i//4*80));compare.alpha_composite(actor,(i%4*80,i//4*80+160))
    backdrop=Image.new('RGBA',(80,80),'#192c36');backdrop.alpha_composite(actor);loops.append(backdrop.convert('RGB').resize((480,480),Image.Resampling.NEAREST))
    records.append({'frame':i,'source':source,'sourceCell':i,'rawSize':list(Image.open(OUT/source).size),'nativeSheet':[320,160],'helmetAnchor':anchor,'targetHelmet':[55,45],'translation':shift,'bounds':list(bounds),'removedIsolatedAlphaPixels':len(remove),'method':'whole pose integer translation; uniform sheet normalization'})
atlas.save(OUT/'erik-swim-native.png');atlas.resize((1280,640),Image.Resampling.NEAREST).save(OUT/'erik-swim-4x.png')
compare.save(OUT/'source-runtime-native.png');compare.resize((1280,1280),Image.Resampling.NEAREST).save(OUT/'source-runtime-4x.png')
loops[0].save(OUT/'erik-swim-loop.gif',save_all=True,append_images=loops[1:],duration=167,loop=0)
(OUT/'registration.json').write_text(json.dumps({'nativeCell':[80,80],'columns':4,'worldPixel':2,'origin':[40,48],'physicalFootNative':70,'records':records,'sourceGate':'accepted','runtimeGate':'pending'},indent=2)+'\n')
print('Prepared8 whole poses; runtime gate pending')
