"""Normalize reviewer-accepted compact burnerV4 once and retain native contacts."""
from pathlib import Path
from PIL import Image
import numpy as np,json
out=Path('assets/freight112')
raw=Image.open(out/'burner-raw-v4.png').convert('RGBA')
image=raw.resize((96,64),Image.Resampling.NEAREST)
a=np.array(image)
# Deliberately supplied magenta exterior matte, never opaque iron/copper material.
matte=(a[:,:,0]>90)&(a[:,:,2]>90)&(a[:,:,1]<80)
a[matte]=0;a[~matte,3]=255
image=Image.fromarray(a);body=image.crop((0,0,48,64));hot=image.crop((48,0,96,64))
body.save(out/'burner-body-native.png');hot.save(out/'burner-hot-source-native.png')
b=np.array(body);h=np.array(hot)
# Only the generated hot interior is revealed through the cold body's own hole.
# Stable original iron body, bolts, feet, bezel and gauge stay pixel-for-pixel.
rect=(4,39,14,50);window=Image.new('RGBA',(10,11));w=np.array(window)
for y in range(39,50):
 for x in range(4,14):
  r,g,blue,alpha=b[y,x].astype(int)
  if alpha and r<65 and blue>r+4 and g<90:w[y-39,x-4]=h[y,x]
window=Image.fromarray(w);window.save(out/'burner-mouth-native.png')
def broad_bottom(image):
 a=np.array(image)[:,:,3]>0
 return int(np.flatnonzero(np.count_nonzero(a,axis=1)>=max(2,image.width*.08))[-1])+1
result={'source':'assets/freight112/burner-raw-v4.png','sourceSize':raw.size,'worldPixel':2,'nativeCell':[48,64],'bodyBounds':body.getbbox(),'baseExclusive':broad_bottom(body),'mouth':[8,44],'hotRect':[4,39,10,11],'coldMouthRGBA':body.getpixel((8,44)),'hotMouthRGBA':hot.getpixel((8,44)),'sourceGate':'ACCEPT by freight109_review for burnerV4 2026-10-15','normalization':'single nearest presentation normalization; exterior key removal only; cold stablebody and hotauthoredinterior'}
(out/'burner-registration.json').write_text(json.dumps(result,indent=2))
for name,i in [('burner-body',body),('burner-mouth',window)]:i.resize((i.width*4,i.height*4),Image.Resampling.NEAREST).save(out/(name+'-native-4x.png'))
print(json.dumps(result))
