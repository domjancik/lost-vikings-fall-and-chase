"""One normalization from independently accepted source only."""
from pathlib import Path
from PIL import Image
import json
p=Path('assets/orbit113')
allowed={'far':('far-raw-v1.png',(768,512)),'middle':('middle-raw-v1.png',(768,512)),'plate':('plate-raw-v3.png',(192,96)),'parts':('parts-raw-v2.png',(256,128)),'gear':('gear-raw-v2.png',(256,256))}
gate=json.loads((p/'source-gates.json').read_text(encoding='utf-8'))
assert all(source in gate['acceptedSources'] for source,_ in allowed.values()),'Native-density approval required before normalization'
for name,(source,size) in allowed.items():
 im=Image.open(p/source).convert('RGBA').resize(size,Image.Resampling.NEAREST)
 if name!='far':
  px=im.load()
  for y in range(im.height):
   for x in range(im.width):
    r,g,b,a=px[x,y]
    if a<200:px[x,y]=(0,0,0,0)
    else:px[x,y]=(r,g,b,255)
 im.save(p/(name+'-native.png'));im.resize((im.width*4,im.height*4),Image.Resampling.NEAREST).save(p/(name+'-native-4x.png'))
 if name=='parts':
  print('parts anchors',[(n,im.crop((n%4*64,n//4*64,n%4*64+64,n//4*64+64)).getbbox())for n in range(8)])
 if name=='plate':
  rows=[(y,min([x for x in range(im.width)if im.getpixel((x,y))[3]],default=192),max([x for x in range(im.width)if im.getpixel((x,y))[3]],default=-1))for y in range(im.height)]
  print('plate bbox',im.getbbox(),'broad rows',[r for r in rows if r[2]-r[1]>150])
print('Accepted source normalized once; raw originals retained.')
