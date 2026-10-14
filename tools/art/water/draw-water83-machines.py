"""Native96px environmental atlas; generated study is material inspiration only.
No generated pixels are reduced, detected or incorporated into the sprites.
"""
from PIL import Image, ImageDraw
from pathlib import Path
import math
ROOT=next(p for p in Path(__file__).resolve().parents if (p/'package.json').is_file())/'assets'/'water83'
ROOT.mkdir(parents=True,exist_ok=True)
INK='#14242c'; DARK='#394b4b'; STEEL='#607878'; LIGHT='#a9bdb0'
BRASS='#ae8750'; GOLD='#dbb675'; SHADOW='#674c35'; WOOD='#77583d'; RED='#b7523b'; TEAL='#68d6c1'
def blank():
 im=Image.new('RGBA',(96,96));return im,ImageDraw.Draw(im)
def bevel(d,rect,color=STEEL):
 x,y,w,h=rect;d.rectangle((x,y,x+w-1,y+h-1),fill=INK)
 if w<6 or h<6:
  d.rectangle((x+1,y+1,x+w-2,y+h-2),fill=color);return
 d.rectangle((x+2,y+2,x+w-3,y+h-3),fill=color)
 d.line((x+2,y+2,x+w-4,y+2),fill=LIGHT,width=2);d.line((x+2,y+2,x+2,y+h-4),fill=LIGHT,width=2)
 d.line((x+3,y+h-3,x+w-3,y+h-3),fill=SHADOW,width=2)
def wheel(d,cx,cy,r,angle,color=BRASS):
 d.ellipse((cx-r-2,cy-r-2,cx+r+2,cy+r+2),fill=INK)
 d.ellipse((cx-r,cy-r,cx+r,cy+r),fill=color)
 d.ellipse((cx-r+4,cy-r+4,cx+r-4,cy+r-4),fill=DARK)
 d.arc((cx-r,cy-r,cx+r,cy+r),185,310,fill=GOLD,width=2)
 for k in range(5):
  a=angle+k*math.tau/5;end=(round(cx+math.cos(a)*(r-3)),round(cy+math.sin(a)*(r-3)))
  d.line((cx,cy,*end),fill=SHADOW,width=5);d.line((cx,cy,*end),fill=color,width=3)
 d.ellipse((cx-5,cy-5,cx+5,cy+5),fill=INK);d.ellipse((cx-3,cy-3,cx+3,cy+3),fill=GOLD)
def studs(d,x1,y1,x2,step=12):
 for x in range(x1,x2,step):d.rectangle((x,y1,x+2,y1+2),fill=SHADOW);d.point((x,y1),fill=GOLD)
def lamp(d,x,y,on=True):
 bevel(d,(x,y,8,12),DARK);d.rectangle((x+2,y+3,x+5,y+7),fill=TEAL if on else RED)
def bell(fixed=False):
 im,d=blank()
 # Open cavity stays completely transparent. Rim and skids ground atY88.
 d.polygon([(13,46),(16,28),(26,18),(41,13),(57,13),(72,18),(81,28),(84,46)],fill=INK)
 d.polygon([(16,43),(20,28),(29,21),(43,16),(56,16),(68,21),(77,28),(81,43)],fill=BRASS)
 d.polygon([(19,39),(24,28),(31,23),(43,19),(56,19),(65,23),(75,29),(79,39)],fill=SHADOW)
 d.line((24,27,35,21,58,21),fill=GOLD,width=3)
 bevel(d,(12,40,73,8),BRASS);studs(d,17,43,80,13)
 for x in [14,76]:
  bevel(d,(x,48,8,36),STEEL)
  if fixed:bevel(d,(x-5,83,19,5),BRASS)
  else:
   d.ellipse((x-5,77,x+13,87),fill=INK);d.ellipse((x-2,79,x+10,86),fill=STEEL);d.rectangle((x+2,81,x+5,84),fill=GOLD)
 bevel(d,(42,4,12,13),BRASS);lamp(d,45,5)
 # Air/water line is engine animated within this actual open-bottom housing.
 return im
def valve(closed,angle=None):
 im,d=blank();bevel(d,(41,15,18,67),DARK);bevel(d,(35,78,31,10),BRASS)
 for y in [20,44,74]:bevel(d,(38,y,24,6),BRASS);studs(d,41,y+2,59,9)
 bevel(d,(25,54,39,27),STEEL);wheel(d,44,66,16,(math.pi/3 if closed else 0) if angle is None else angle,TEAL if closed else RED)
 bevel(d,(64,64,18,6),BRASS);lamp(d,71,48,closed);return im
def chain(d,cut):
 for side in [-1,1]:
  points=[(47,35),(47+side*14,40),(47+side*28,52),(47+side*35,72),(47+side*35,82)]
  for k,(a,b) in enumerate(zip(points,points[1:])):
   if cut and k==0:continue
   dx,dy=b[0]-a[0],b[1]-a[1];n=max(1,int(math.hypot(dx,dy)/5))
   for j in range(n):
    x=round(a[0]+dx*j/n);y=round(a[1]+dy*j/n)
    d.rectangle((x-2,y-2,x+2,y+3),fill=INK);d.rectangle((x-1,y-1,x+1,y+2),outline=SHADOW)
    d.point((x,y-1),fill=BRASS)
def crank(state,angle=None):
 im,d=blank();bevel(d,(20,48,59,34),STEEL);bevel(d,(13,81,74,7),BRASS)
 bevel(d,(57,52,30,11),BRASS);wheel(d,43,64,21,[0,0,.7,1.4][state] if angle is None else angle)
 bevel(d,(79,57,14,7),GOLD);lamp(d,69,40,state==3)
 if state<2:chain(d,state==1)
 else:bevel(d,(83,57,9,29),STEEL)
 studs(d,19,84,86);return im
def pontoon(angle=0):
 im,d=blank()
 for x in [9,33,57,77]:
  d.ellipse((x,59,x+17,85),fill=INK);d.ellipse((x+2,61,x+15,83),fill=SHADOW)
  d.line((x+5,64,x+5,79),fill=BRASS,width=3);bevel(d,(x-1,71,20,4),STEEL)
 bevel(d,(5,52,87,11),WOOD);studs(d,9,58,91,11)
 for x in [6,87]:bevel(d,(x,45,4,17),BRASS)
 bevel(d,(25,25,20,27),STEEL);bevel(d,(29,13,12,17),BRASS)
 for y in [21,29,37]:bevel(d,(23,y,24,5),BRASS)
 bevel(d,(46,43,30,9),STEEL);wheel(d,61,34,14,angle)
 d.line((35,12,35,6,46,6),fill=INK,width=6);d.line((35,12,35,6,46,6),fill=BRASS,width=3)
 lamp(d,74,33);return im
def panel():
 im,d=blank();bevel(d,(39,4,18,84),STEEL)
 for y in range(8,84,12):bevel(d,(40,y,16,5),BRASS);studs(d,43,y+2,55,9)
 return im
def sluice(opened,progress=None):
 im,d=blank();d.polygon([(12,68),(84,68),(93,87),(3,87)],fill=INK)
 d.polygon([(14,71),(82,71),(88,84),(8,84)],fill=BRASS)
 d.polygon([(20,73),(76,73),(81,82),(15,82)],fill=INK if opened else DARK)
 if opened:
  for x in range(22,78,10):d.line((x,74,x-2,81),fill=STEEL,width=2)
 else:d.line((22,75,72,75),fill=LIGHT,width=2)
 if progress is not None and progress<1:
  shift=round(progress*58);bevel(d,(20+shift,73,max(2,58-shift),10),DARK)
 studs(d,12,83,88,12);return im
cells=[pontoon(),bell(),bell(True),valve(False),valve(True),crank(0),crank(1),crank(2),crank(3),panel(),sluice(False),sluice(True)]
atlas=Image.new('RGBA',(384,288))
for i,im in enumerate(cells):atlas.paste(im,(i%4*96,i//4*96))
atlas.save(ROOT/'machines-native.png');atlas.resize((1536,1152),Image.Resampling.NEAREST).save(ROOT/'machines-native-4x.png')
assert set(atlas.getchannel('A').get_flattened_data())<={0,255}
print('12 directly authored96×96 machine cells; fixed native baseline88, binary alpha.')

frames=Image.new("RGBA",(768,384))
for n in range(8):
 frames.paste(pontoon(n*math.tau/8),(n*96,0))
 frames.paste(crank(2,n*math.tau/8),(n*96,96))
for n in range(8):
 frames.paste(valve(n==7,n*math.pi/21),(n*96,192))
 frames.paste(sluice(True,n/7),(n*96,288))
frames.save(ROOT/"motion-native.png")

nozzle=Image.new("RGBA",(48,48));d=ImageDraw.Draw(nozzle)
bevel(d,(18,0,12,18),STEEL);bevel(d,(7,14,34,10),BRASS);studs(d,11,17,38,8)
bevel(d,(10,23,28,7),DARK);d.rectangle((12,26,35,29),fill=INK)
nozzle.save(ROOT/"nozzle-native.png")
