from pathlib import Path
from PIL import Image
import numpy as np,math,json
r=Path('assets/momentum72');r.mkdir(exist_ok=True)
src=Image.open(r/'ball-source.png').convert('RGBA')
# Single uniform source normalization; no per-frame fitting or grid detection.
native=Image.new('RGBA',(64,64));native.paste(src.resize((61,61),Image.Resampling.NEAREST),(1,1))
a=np.array(native);a[:,:,3]=np.where(a[:,:,3]>=180,255,0);a[a[:,:,3]==0,:3]=0
native=Image.fromarray(a);native.save(r/'ball-native.png')
out=Image.new('RGBA',(512,512));records=[]
for n in range(64):
 angle=n*math.tau/64;c=math.cos(angle);s=math.sin(angle);frame=Image.new('RGBA',(64,64))
 for y in range(64):
  for x in range(64):
   dx=x-31.5;dy=y-31.5
   if dx*dx+dy*dy>28*28:continue
   sx=round(31.5+c*dx+s*dy);sy=round(31.5-s*dx+c*dy)
   frame.putpixel((x,y),native.getpixel((sx,sy)))
 out.paste(frame,(n%8*64,n//8*64));records.append({'frame':n,'clockwiseDegrees':n*360/64,'pivot':[32,32]})
out.save(r/'ball.png');out.resize((1024,1024),Image.Resampling.NEAREST).save(r/'ball-review.png')
native.resize((512,512),Image.Resampling.NEAREST).save(r/'ball-native-review.png')
(r/'ball-registration.json').write_text(json.dumps({'nativeCell':[64,64],'worldCell':[128,128],'physicalRadius':56,'singleSourceScale':61/src.width,'frames':records},indent=2)+'\n')
