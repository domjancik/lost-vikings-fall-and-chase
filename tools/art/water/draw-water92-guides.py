"""Native construction references only; Imagegen authors final material art."""
from pathlib import Path
from PIL import Image,ImageDraw
import numpy as np,math
root=next(p for p in Path(__file__).resolve().parents if (p/'package.json').is_file());out=root/'assets/water92'
out.mkdir(exist_ok=True)
def neutral(path):
 a=np.array(Image.open(path).convert('RGBA'));v=(a[:,:,:3].astype(float)*[.25,.6,.15]).sum(axis=2)
 pal=np.array([[24,32,36],[47,62,66],[81,98,99],[128,144,138],[174,181,155]])
 a[:,:,:3]=pal[np.minimum(4,(v/52).astype(int))];a[a[:,:,3]<128]=0;a[a[:,:,3]>=128,3]=255
 return Image.fromarray(a)
def save(im,name):
 im.save(out/(name+'-guide-native.png'));im.resize((im.width*4,im.height*4),Image.Resampling.NEAREST).save(out/(name+'-guide-4x.png'))
save(neutral(root/'assets/water87/machines-native-v2.png'),'machines')
extras=Image.new('RGBA',(256,128));extras.alpha_composite(neutral(root/'assets/water87/cradle-native.png'))
extras.alpha_composite(neutral(root/'assets/water87/nozzle-native.png'),(144,16));save(extras,'extras')
save(neutral(root/'assets/terrain48/terrain.png'),'terrain')
flora=Image.new('RGBA',(128,96));d=ImageDraw.Draw(flora)
for row in range(2):
 for col in range(4):
  ox=col*32;oy=row*48
  for branch in range(5):
   height=18+((col*7+branch*11)%22);points=[]
   for k in range(height+1):
    t=k/height;x=16+(branch-2)*t*2+math.sin(t*3+branch*.7)*t*4+(row*2-1)*t*2
    points.append((ox+round(x),oy+46-k))
   d.line(points,fill=['#163c35','#2c5140','#4f7352','#345b49'][col],width=2)
   for k in range(4,height,5):
    x,y=points[k];side=(-1)**(k//5+branch);d.line([(x,y),(x+side*3,y-2),(x+side*4,y-4)],fill='#618462',width=2)
  d.ellipse((ox+11,oy+43,ox+21,oy+46),fill='#233f32')
save(flora,'flora')
