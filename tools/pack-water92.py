"""Once-only native sampling of approved source; no per-object stretching."""
from pathlib import Path
from PIL import Image
from scipy.ndimage import label
import numpy as np,json
root=Path(__file__).resolve().parents[1];out=root/'assets/water92'
raw=Image.open(out/'machines-raw-v2.png').convert('RGBA');a=np.array(raw)
components,n=label(a[:,:,3]>=128);scale=raw.width/384
ids=[(3,),(1,),(2,),(4,),(7,),(5,),(6,),(8,),(12,),(13,),(9,),(10,11)]
names=['pontoon','mobile-bell','fixed-bell','crank-housing','crank-wheel','threaded-rod','valve-housing','valve-wheel','sluice-rim','sluice-cover','service-gate','retaining-chain']
atlas=Image.new('RGBA',(384,288));records=[]
for cell,(group,name) in enumerate(zip(ids,names)):
 mask=np.isin(components,group);ys,xs=np.nonzero(mask)
 box=[int(xs.min()),int(ys.min()),int(xs.max()+1),int(ys.max()+1)]
 source=a.copy();source[:,:,3]=np.where(mask,255,0);source[~mask,:3]=0
 cx=(box[0]+box[2])/2;tx=cx-48*scale;ty=box[3]-92*scale
 native=Image.fromarray(source).transform((96,96),Image.Transform.AFFINE,(scale,0,tx,0,scale,ty),Image.Resampling.NEAREST)
 native.save(out/(name+'-native.png'));atlas.alpha_composite(native,(cell%4*96,cell//4*96))
 records.append({'cell':cell,'name':name,'sourceComponents':group,'sourceBounds':box,'sourceTransform':[scale,0,tx,0,scale,ty],'nativeBounds':native.getbbox(),'nativeCell':[96,96]})
atlas.save(out/'machines-native.png');atlas.resize((1536,1152),Image.Resampling.NEAREST).save(out/'machines-native-4x.png')
(out/'registration.json').write_text(json.dumps({'source':'machines-raw-v2.png','sourceGate':'accepted WATER92-REVIEW.md','runtimeGate':'see visual-gates.json','scaleUniform':scale,'pixelWorld':2,'records':records,'pontoonContact':{'nativeVisibleSoleExclusive': 88, 'nativeOpaqueUndersideExclusive': 92, 'deckNative': 64, 'cradleSeatWorld': 800, 'dockedDeckWorld': 752, 'reason': 'Broad visible buoy feet meet seat; four narrowing dark under-outline rows overlap beam'}},indent=2)+'\n')
print([(r['name'],r['nativeBounds'])for r in records])

# Independent square guide sources each normalized once at their authored native basis.
for name,size,base in [('cradle',128,112),('nozzle',96,92)]:
 raw=Image.open(out/(name+'-raw-v3.png')).convert('RGBA');a=np.array(raw);ids,n=label(a[:,:,3]>=128)
 counts=np.bincount(ids.ravel());counts[0]=0;mask=ids==counts.argmax();ys,xs=np.nonzero(mask)
 scale=raw.width/size;cx=(xs.min()+xs.max()+1)/2;tx=cx-size/2*scale;ty=ys.max()+1-base*scale
 src=a.copy();src[:,:,3]=np.where(mask,255,0);src[~mask,:3]=0
 im=Image.fromarray(src).transform((size,size),Image.Transform.AFFINE,(scale,0,tx,0,scale,ty),Image.Resampling.NEAREST)
 im.save(out/(name+'-native.png'));im.resize((size*4,size*4),Image.Resampling.NEAREST).save(out/(name+'-native-4x.png'))
 (out/(name+'-registration.json')).write_text(json.dumps({'raw':name+'-raw-v3.png','nativeCell':[size,size],'uniformSourcePixelsPerNative':scale,'sourceTransform':[scale,0,tx,0,scale,ty],'nativeBounds':im.getbbox(),'baselineExclusive':base,'sourceGate':'accepted WATER92-REVIEW.md','mouth':'opaque dark recessed pipe, matching pressure nozzle construction' if name=='nozzle' else None},indent=2)+'\n')
 print(name,im.getbbox(),np.flatnonzero(np.array(im)[:,size//2,3]>0).tolist())

# Botanical rows use one source scale and independently translated fixed roots.
raw=Image.open(out/'flora-raw-v2.png').convert('RGBA');a=np.array(raw);ids,n=label(a[:,:,3]>=128);scale=raw.width/128
atlas=Image.new('RGBA',(128,96));records=[]
for cell,component in enumerate([4,2,3,1,8,6,7,5]):
 mask=ids==component;ys,xs=np.nonzero(mask);bottom=int(ys.max()+1)
 root=mask&(np.indices(mask.shape)[0]>=bottom-2*scale);rx=float(np.nonzero(root)[1].mean())
 src=a.copy();src[:,:,3]=np.where(mask,255,0);src[~mask,:3]=0;tx=rx-16*scale;ty=bottom-47*scale
 im=Image.fromarray(src).transform((32,48),Image.Transform.AFFINE,(scale,0,tx,0,scale,ty),Image.Resampling.NEAREST)
 atlas.alpha_composite(im,(cell%4*32,cell//4*48));records.append({'cell':cell,'root':[16,46],'sourceComponent':component,'sourceTransform':[scale,0,tx,0,scale,ty],'nativeBounds':im.getbbox()})
atlas.save(out/'flora-native.png');atlas.resize((512,384),Image.Resampling.NEAREST).save(out/'flora-native-4x.png')
(out/'flora-registration.json').write_text(json.dumps({'raw':'flora-raw-v2.png','uniformSourcePixelsPerNative':scale,'records':records},indent=2)+'\n')
for name,version,size in [('scene',2,(960,640)),('terrain',2,(256,256))]:
 Image.open(out/(name+'-raw-v'+str(version)+'.png')).resize(size,Image.Resampling.NEAREST).convert('RGBA').save(out/(name+'-native.png'))
