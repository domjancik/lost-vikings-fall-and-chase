from pathlib import Path
from PIL import Image
import numpy as np,json
from scipy import ndimage
r=Path('assets/clockwork71');src=Image.open(r/'tower-source.png').convert('RGBA');out=Image.new('RGBA',(128,192));records=[]
for n in range(4):
 c=src.crop((n%2*512,n//2*768,n%2*512+512,n//2*768+768)).resize((64,96),Image.Resampling.NEAREST)
 a=np.array(c);a[:,:,3]=np.where(a[:,:,3]>=220,255,0);a[a[:,:,3]==0,:3]=0
 labels,count=ndimage.label(a[:,:,3]>0,structure=np.ones((3,3)));sizes=np.bincount(labels.ravel());sizes[0]=0;a[labels!=sizes.argmax()]=0
 y,x=np.where(a[:,:,3]>0);dy=94-int(y.max());fixed=Image.new('RGBA',(64,96));fixed.paste(Image.fromarray(a),(0,dy));out.paste(fixed,(n%2*64,n//2*96));records.append({'frame':n,'scale':.125,'translation':[0,dy],'sole':94})
out.save(r/'tower.png');out.resize((512,768),Image.Resampling.NEAREST).save(r/'tower-native-review.png')
(r/'tower-registration.json').write_text(json.dumps({'nativeCell':[64,96],'worldCell':[128,192],'worldFooting':380,'frames':records},indent=2)+'\n')
print('4 native64x96 tower frames, one1/8scale from original enlarged clusters, registered footing94.')
