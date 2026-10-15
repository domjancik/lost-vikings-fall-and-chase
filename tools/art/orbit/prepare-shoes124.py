"""Independent source subjects normalized once; native geometry stays unwarped."""
from pathlib import Path
from PIL import Image
import json
p=Path('assets/shoes124');raw=Image.open(p/'source-v3.png').convert('RGBA')
def clean(im):
 out=im.convert('RGBA');a=out.load()
 for y in range(out.height):
  for x in range(out.width):
   r,g,b,alpha=a[x,y];a[x,y]=(r,g,b,255) if alpha>=240 else (0,0,0,0)
 return out
scale=160/raw.width
rack=Image.new('RGBA',(128,96));rack.alpha_composite(clean(raw.crop((0,0,1225,971)).resize((round(1225*scale),96),Image.Resampling.NEAREST)))
box=(1236,163,1568,416);source=raw.crop(box);boots=Image.new('RGBA',(32,32));boots.alpha_composite(clean(source.resize((27,21),Image.Resampling.NEAREST)),(2,6))
icon=Image.new('RGBA',(16,16));icon.alpha_composite(clean(source.resize((12,9),Image.Resampling.NEAREST)),(2,4))
for name,im in [('rack',rack),('boots',boots),('icon',icon)]:
 im.save(p/(name+'-native.png'));im.resize((im.width*5,im.height*5),Image.Resampling.NEAREST).save(p/(name+'-native-5x.png'))
sole=rack.getbbox()[3];print('rackbox',rack.getbbox(),'boots',boots.getbbox())
# Broad shelf surface is measured at center to exclude taller separating pegs.
for y in range(40,56):print(y,rack.getpixel((61,y)))
r={'source':'source-v3.png','method':'Each independent subject uniformly normalized once from retained raw original; alpha>=240 material, hiddenRGBzero. No grid detection, no palette flattening.',
 'rack':{'sourceBox':[0,0,1225,971],'native':[128,96],'scale':scale,'materialBox':rack.getbbox(),'sole':sole,'shelfTop':49},
 'boots':{'sourceBox':box,'native':[32,32],'material':[27,21],'paste':[2,6],'sole':27,'worldMaterial':[54,42]},
 'icon':{'sourceBox':box,'native':[16,16],'material':[12,9],'paste':[2,4]}}
(p/'registration.json').write_text(json.dumps(r,indent=2)+'\n',encoding='utf8')
