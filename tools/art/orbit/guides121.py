"""Native authored construction/light guides. No high-resolution image input."""
from pathlib import Path
import math
from PIL import Image,ImageDraw
out=Path(__file__).resolve().parents[3]/'assets/orbit121'
def mix(a,b,t):return tuple(round(x+(y-x)*max(0,min(1,t))) for x,y in zip(a,b))
def bolt(d,x,y,r=2):
 for yy in range(y-r,y+r+1):
  for xx in range(x-r,x+r+1):
   dx=(xx-x)/r;dy=(yy-y)/r
   if dx*dx+dy*dy<=1:
    z=math.sqrt(max(0,1-dx*dx-dy*dy));v=max(0,(-dx-dy+z*1.5)/2.6);d.point((xx,yy),fill=mix((67,45,28),(245,206,133),v)+(255,))
def signed(x,y):
 r=math.hypot(x,y);a=math.atan2(y,x);ring=min(r-91,111-r);hub=44-r
 spoke=-100
 for n in range(8):
  q=a-n*math.pi/4;u=r*math.cos(q);v=r*math.sin(q);spoke=max(spoke,min(u-32,105-u,7-abs(v)))
 tooth=-100
 for n in range(16):
  q=a-n*math.pi/8;u=r*math.cos(q);v=r*math.sin(q);tooth=max(tooth,min(u-105,123-u,7-abs(v)))
 return max(ring,hub,spoke,tooth)
im=Image.new('RGBA',(256,256))
for y in range(256):
 for x in range(256):
  px=x-128;py=y-128;sd=signed(px,py)
  if sd<0:
   if signed(px-2,py-3)>=0:im.putpixel((x,y),(24,27,32,255))
   continue
  z=lambda xx,yy:min(3,max(0,signed(xx,yy)))
  nx=(z(px-1,py)-z(px+1,py))/2;ny=(z(px,py-1)-z(px,py+1))/2
  light=max(.08,min(1,.48+(-nx-ny)*.13-py/650))
  r=math.hypot(px,py);bevel=sd<2.3
  color=mix((34,39,47),(130,139,145),light)
  if bevel:color=mix((71,44,27),(231,175,91),light)
  wear=math.sin(x*.19)+math.sin(y*.13)+math.sin((x+y)*.083)
  if wear>1.8 and not bevel:color=mix(color,(139,86,47),min(.6,(wear-1.8)*.5))
  if 33<r<39:color=mix((71,47,27),(203,149,72),light)
  if r<15:color=mix((65,42,27),(211,164,91),max(.1,min(1,.6-px/35-py/45)))
  im.putpixel((x,y),color+(255,))
d=ImageDraw.Draw(im)
for rad,count in [(76,8),(34,8),(103,16)]:
 for n in range(count):
  a=n*math.pi*2/count;bolt(d,round(128+math.cos(a)*rad),round(128+math.sin(a)*rad),2)
im.save(out/'gear-guide-native.png');im.resize((1024,1024),Image.Resampling.NEAREST).save(out/'gear-guide4x.png')
im=Image.new('RGBA',(192,96));d=ImageDraw.Draw(im)
for y in range(36,60):
 for x in range(10,182):
  dx=max(0,18-x,x-173);dy=(y-47.5)/12
  if (dx/8)**2+dy*dy>1:continue
  v=(y-36)/23
  col=mix((37,47,59),(78,99,114),.7-math.sin(v*math.pi)*.25)
  if y<39:col=mix((91,60,33),(241,197,123),1-(y-36)/3)
  if y>56:col=mix((127,89,45),(39,29,24),(y-56)/3)
  if x<18 or x>173:col=mix((62,47,31),(192,141,75),max(.1,.8-(y-36)/35-dx/20))
  im.putpixel((x,y),col+(255,))
for left in [27,117]:
 d.rectangle((left-2,42,left+48,52),fill='#121e28');d.line((left-2,42,left+48,42),fill='#a1a4a0');d.line((left-1,43,left+47,43),fill='#425765')
 for x in range(left+1,left+46):
  for y in range(45,50):d.point((x,y),fill=mix((25,100,121),(170,244,235),max(.1,1-abs(y-47)/3))+(255,))
 for x in range(left+2,left+46,5):d.line((x,45,x,49),fill='#276a7c')
 d.rectangle((left-10,44,left-4,50),fill='#26323c');bolt(d,left-7,46,1)
for x in [21,80,112,170]:bolt(d,x,40,2);bolt(d,x,54,1)
for x in [85,104]:
 d.rectangle((x,43,x+2,53),fill='#724527');d.line((x,43,x,52),fill='#d8994c')
for y in range(39,58):
 for x in range(87,106):
  r=math.hypot(x-96,y-48)
  if r<9:
   if r>6:col=mix((70,42,26),(240,194,106),max(.08,.65-(x-96)/20-(y-48)/22))
   else:col=mix((25,37,48),(101,123,133),max(.1,.65-(x-96)/17-(y-48)/18))
   d.point((x,y),fill=col+(255,))
bolt(d,96,48,2)
im.save(out/'plate-guide-native.png');im.resize((768,384),Image.Resampling.NEAREST).save(out/'plate-guide4x.png')
