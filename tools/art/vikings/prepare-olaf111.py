"""Normalize reviewed native-density presentations once; translate whole actors.

Requires independent source approval for every retained raw image. No actor-box
scaling or torso/leg grafting. The unchanged reviewed gait and climb kit survives
byte-for-byte. Review measures source contacts before accepting this candidate.
"""
from pathlib import Path
from PIL import Image,ImageDraw
import json,numpy as np

ROOT=next(p for p in Path(__file__).resolve().parents if (p/'package.json').is_file())
OUT=ROOT/'assets/olaf111'
approval=json.loads((OUT/'source-gate.json').read_text())
assert approval['verdict']=='accepted', 'Independent native source gate required'
old=Image.open(ROOT/'assets/vikings90/olaf-native.png').convert('RGBA')
atlas=old.copy(); records=[]

def cell(im,n):
 return im.crop((n%8*80,n//8*80,n%8*80+80,n//8*80+80))

def steel_core(im,raised=False):
 a=np.array(im);r,g,b=[a[:,:,i].astype(float)for i in range(3)]
 yy,xx=np.indices(a.shape[:2]); m=(a[:,:,3]>=128)&(g>=r*.96)&(b>=r*.9)&(np.maximum.reduce([r,g,b])>32)
 # Opaque steel dome, not the shield boss above it or boot details below it.
 m &= (yy>=35)&(yy<45)&(xx>28)&(xx<50)
 ys,xs=np.nonzero(m)
 assert len(xs), 'Missing recognizable steel dome'
 return [(xs.min()+xs.max()+1)/2,(ys.min()+ys.max()+1)/2]

def disc(im,raised):
 a=np.array(im);r,g,b=[a[:,:,i].astype(float)for i in range(3)]
 yy,xx=np.indices(a.shape[:2]);opaque=a[:,:,3]>=128
 if raised:
  m=opaque&(yy<35)&(r>g*1.08)&(g>b*1.15)
 else:
  m=opaque&(xx>47)&(yy>36)&(yy<65)&(r>g*1.08)&(g>b*1.15)
 ys,xs=np.nonzero(m);assert len(xs),'Missing authored shield face'
 return [(xs.min()+xs.max()+1)/2,(ys.min()+ys.max()+1)/2], [int(xs.min()),int(ys.min()),int(xs.max()+1),int(ys.max()+1)]

packs=[('idle-raw-v2.png',4,2,list(range(8,12))+list(range(34,38))),
 ('raise-raw-v2.png',4,2,list(range(38,45))+[None]),
 ('action-raw-v2.png',4,4,[12,13,18,19,20,21,22,23,24,25,56,57,58,59,None,None])]
for source,cols,rows,destinations in packs:
 assert source in approval['acceptedSources'],f'Source not reviewed: {source}'
 raw=Image.open(OUT/source).convert('RGBA')
 # Uniform scale belongs to the whole canonical atlas, never actor extents.
 normalized=raw.resize((cols*80,rows*80),Image.Resampling.NEAREST)
 normalized.save(OUT/source.replace('-raw-','-source-native-'))
 a=np.array(normalized);a[:,:,3]=np.where(a[:,:,3]>=128,255,0);a[a[:,:,3]==0,:3]=0
 normalized=Image.fromarray(a)
 for n,target in enumerate(destinations):
  if target is None:continue
  native=normalized.crop((n%cols*80,n//cols*80,n%cols*80+80,n//cols*80+80))
  bbox=native.getbbox();assert bbox
  raised=target in list(range(34,38))+[44]+list(range(56,60))
  grounded=target in list(range(8,14))+list(range(22,25))+list(range(34,45))
  if raised:
   anchor,bounds=disc(native,True);shift=[round(40-anchor[0]),round(30-anchor[1])]
   if grounded:shift[1]=70-bbox[3]
  else:
   anchor=steel_core(native);shift=[round(41.5-anchor[0]),70-bbox[3] if grounded else round(40.5-anchor[1])]
   bounds=None
  registered=Image.new('RGBA',(80,80));registered.alpha_composite(native,tuple(shift))
  atlas.paste(registered,(target%8*80,target//8*80))
  records.append({'cell':target,'source':source,'sourceCell':n,'sourceSize':list(raw.size),
   'atlasNativeSize':[cols*80,rows*80],'translation':shift,'sourceBounds':list(bbox),
   'registeredBounds':list(registered.getbbox()),'grounded':grounded,'raised':raised,
   'registration':'wholeactor integer translation; anatomical sole and helmet/disc',
   'sourceAnchor':anchor,'discBounds':bounds})
  if source.startswith('raise'):
   atlas.paste(registered,((target+7)%8*80,(target+7)//8*80))
   records.append({**records[-1],'cell':target+7,'reverseOf':target})

atlas.save(OUT/'olaf-native.png')
(OUT/'registration.json').write_text(json.dumps({'nativeCell':[80,80],'worldPixelSize':2,
 'actorHeightNative':36,'origin':[40,48],'groundSoleExclusive':70,
 'unchangedAtlas':'assets/vikings90/olaf-native.png','records':records,
 'sourceGate':'accepted','runtimeGate':'pending'},indent=2)+'\n')

# Native comparison retains each whole authored pose; enlargement is display only.
order=[8]+list(range(8))+[34]+list(range(26,34))
canvas=Image.new('RGBA',(9*80,2*80),'#192c36')
for n,i in enumerate(order):
 canvas.alpha_composite(cell(atlas,i),(n%9*80,n//9*80))
canvas.save(OUT/'idle-gait-native.png')
canvas.resize((canvas.width*4,canvas.height*4),Image.Resampling.NEAREST).save(OUT/'idle-gait-4x.png')
print(len(records),'wholeactor replacements; runtime gate pending')
