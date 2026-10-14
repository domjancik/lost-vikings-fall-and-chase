from PIL import Image, ImageDraw
from pathlib import Path
p=Path('assets/orbit113');p.mkdir(parents=True,exist_ok=True)
im=Image.new('RGBA',(192,96));d=ImageDraw.Draw(im)
d.rounded_rectangle((16,38,175,57),radius=10,fill='#263f50',outline='#101c29',width=1)
d.rounded_rectangle((17,39,174,56),radius=9,outline='#a57745',width=2)
d.line((27,38,165,38),fill='#c5a66b')
for x in (40,136):
 d.rectangle((x-16,44,x+16,51),fill='#0c202e')
 d.line((x-14,46,x+14,46),fill='#559cae',width=2)
for x in range(30,165,22):d.rectangle((x,40,x+1,41),fill='#c5a66b')
d.ellipse((88,40,104,56),fill='#372a27',outline='#c19b5e')
d.ellipse((92,44,100,52),fill='#263f50',outline='#886e48')
im.save(p/'plate-guide-native.png');im.resize((1536,768),Image.Resampling.NEAREST).save(p/'plate-guide8x.png')
sheet=Image.new('RGBA',(256,128))
for n in range(8):
 c=Image.new('RGBA',(64,64));g=ImageDraw.Draw(c)
 if n in (0,1):
  g.rectangle((28,3,35,27),fill='#263f50',outline='#c5a66b');g.ellipse((22,21,41,39),fill='#886e48',outline='#c5a66b')
  g.ellipse((29,28,34,33),fill='#172637')
  pts=([(23,33),(19,42),(20,52),(27,57),(21,48),(24,40)] if n==0 else [(23,33),(25,44),(29,52),(31,54),(28,43),(27,35)])
  g.polygon(pts,fill='#a57745',outline='#263f50');g.polygon([(63-x,y)for x,y in pts],fill='#a57745',outline='#263f50')
 elif n==2:
  g.rectangle((14,55,49,59),fill='#886e48',outline='#c5a66b');g.rectangle((18,20,45,54),fill='#263f50',outline='#a57745')
  g.rectangle((38,26,41,36),fill='#559cae');g.rectangle((22,38,34,48),fill='#172637',outline='#886e48')
  for x in (23,32):g.rectangle((x,9,x+3,29),fill='#a57745',outline='#c5a66b')
 elif n in (3,4):
  g.rectangle((4,9,59,56),fill='#263f50',outline='#c5a66b',width=2);g.rectangle((11,16,52,49),fill='#0c1825')
  g.line((31,14,31,49),fill='#c5a66b',width=4)
  for y in range(17,49,6):g.line((30,y,33,y+3),fill='#886e48',width=2)
  for y in range(18,49,8):
   g.rectangle((12,y,28 if n==3 else 18,y+5),fill='#886e48',outline='#a57745');g.rectangle((35 if n==3 else 45,y,51,y+5),fill='#886e48',outline='#a57745')
  for x in (7,56):
   for y in (13,52):g.rectangle((x,y,x+1,y+1),fill='#c5a66b')
 elif n==5:
  for x in (22,34):g.rectangle((x,25,x+6,39),fill='#263f50',outline='#a57745');g.rectangle((x-2,37,x+8,42),fill='#886e48',outline='#c5a66b');g.line((x-1,42,x+7,42),fill='#559cae')
 elif n==6:
  g.polygon([(22,20),(38,18),(45,30),(37,41),(19,37),(16,29)],fill='#263f50',outline='#a57745');g.line((22,22,36,21),fill='#c5a66b',width=2);g.rectangle((25,26,31,31),fill='#172637',outline='#886e48')
 else:
  g.ellipse((16,16,47,47),fill='#886e48',outline='#c5a66b');g.ellipse((22,22,41,41),fill='#172637',outline='#263f50')
  for x,y in [(29,12),(29,46),(12,29),(46,29)]:g.rectangle((x,y,x+5,y+5),fill='#a57745')
 sheet.alpha_composite(c,(n%4*64,n//4*64))
sheet.save(p/'parts-guide-native.png');sheet.resize((2048,1024),Image.Resampling.NEAREST).save(p/'parts-guide8x.png')
import math
im=Image.new('RGBA',(256,256));d=ImageDraw.Draw(im)
for n in range(16):
 a=n*math.pi/8;pts=[]
 for r,offset in [(107,-.06),(121,-.06),(121,.06),(107,.06)]:pts.append((round(128+math.cos(a+offset)*r),round(128+math.sin(a+offset)*r)))
 d.polygon(pts,fill='#a57745',outline='#c5a66b')
d.ellipse((18,18,238,238),fill='#263f50',outline='#c5a66b',width=3)
d.ellipse((39,39,217,217),fill=(0,0,0,0),outline='#886e48',width=3)
for n in range(8):
 a=n*math.pi/4;tx,ty=math.cos(a),math.sin(a);nx,ny=-ty,tx
 pts=[(round(128+tx*r+nx*w),round(128+ty*r+ny*w))for r,w in [(25,-6),(93,-8),(93,8),(25,6)]]
 d.polygon(pts,fill='#263f50',outline='#886e48');d.line([pts[0],pts[1]],fill='#c5a66b',width=2)
d.ellipse((94,94,162,162),fill='#886e48',outline='#c5a66b',width=2);d.ellipse((104,104,152,152),fill='#263f50',outline='#a57745',width=3)
d.ellipse((117,117,139,139),fill='#172637',outline='#c5a66b')
im.save(p/'gear-guide-native.png');im.resize((2048,2048),Image.Resampling.NEAREST).save(p/'gear-guide8x.png')
