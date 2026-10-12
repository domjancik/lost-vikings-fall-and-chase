"""Native layout/anatomy guide only; Imagegen supplies final material sprites."""
from PIL import Image,ImageDraw
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1];folder=root/'assets/warden89';folder.mkdir(parents=True,exist_ok=True)
im=Image.new('RGBA',(512,512));d=ImageDraw.Draw(im)
dark='#283440';brass='#ae7735';light='#dcb760';steel='#748996';wood='#78512e';cyan='#49b6c9'
rects={}
def component(name,x,y,w,h,painter):
 cell=Image.new('RGBA',(w,h));p=ImageDraw.Draw(cell);painter(p,w,h);im.alpha_composite(cell,(x,y));rects[name]=[x,y,w,h]
def body(p,w,h):
 p.polygon([(14,22),(36,16),(280,16),(306,30),(310,69),(285,86),(44,89),(12,68)],fill=dark)
 p.rounded_rectangle((18,24,304,80),radius=18,fill=brass)
 p.rectangle((15,16,303,23),fill=steel)
 for x in range(18,302,8):p.line((x,17,x,22),fill=dark,width=2)
 for x in [48,100,160,224,278]:p.rectangle((x,28,x+7,78),fill=light)
 p.rectangle((42,74,278,84),fill=dark)
 for x in [50,100,300,285]:p.ellipse((x-10,55,x+10,75),fill=steel);p.ellipse((x-5,60,x+5,70),fill=dark)
component('body',0,0,320,96,body)
def link(p,w,h,far=False):
 p.polygon([(w//2-10,10),(w//2+10,10),(w//2+8,94),(w//2-8,94)],fill=steel if far else brass)
 p.rectangle((w//2-3,18,w//2+3,86),fill=dark)
 for yy in [12,92]:p.ellipse((w//2-11,yy-10,w//2+11,yy+10),fill=dark);p.ellipse((w//2-7,yy-6,w//2+7,yy+6),fill=steel if far else light)
for name,x,w,far in [('upper-near',328,40,False),('lower-near',376,36,False),('upper-far',424,40,True),('lower-far',472,36,True)]:component(name,x,0,w,104,lambda p,w,h,far=far:link(p,w,h,far))
def head(p,w,h,state):
 p.ellipse((3,4,93,93),fill=dark);p.ellipse((8,10,89,87),fill=brass)
 p.rectangle((5,27,24,70),fill=steel)
 p.ellipse((58,17,94,79),fill=dark);p.ellipse((64,22,92,74),fill=cyan)
 if state<2:
  gap=0 if state==0 else 14;p.polygon([(63,20),(93,20),(93,47-gap),(63,47-gap)],fill=steel);p.polygon([(63,49+gap),(93,49+gap),(93,76),(63,76)],fill=steel)
 if state==3:
  for end in [(64,28),(90,29),(65,68),(89,70)]:p.line((78,48,*end),fill=dark,width=2)
 for yy in [20,74]:p.rectangle((62,yy,94,yy+2),fill=light)
for i,name in enumerate(['head-closed','head-opening','head-open','head-broken']):component(name,i*104,112,96,96,lambda p,w,h,i=i:head(p,w,h,i))
def foot(p,w,h,far):
 p.ellipse((14,3,34,24),fill=steel if far else brass)
 p.polygon([(12,15),(36,15),(43,27),(40,31),(8,31),(5,27)],fill=dark)
 p.rectangle((7,26,17,31),fill=steel if far else light);p.rectangle((31,26,41,31),fill=steel if far else light)
for name,x,far in [('foot-near',416,False),('foot-far',464,True)]:component(name,x,112,48,40,lambda p,w,h,far=far:foot(p,w,h,far))
def plunger(p,w,h,state):
 p.rectangle((28,19,56,55),fill=dark);p.rounded_rectangle((30,24,53,52),radius=5,fill=brass)
 p.rectangle((8+state*3,39,41,47),fill=steel);p.rectangle((6+state*3,31,13+state*3,54),fill=wood)
 p.rectangle((22,53,58,55),fill=steel)
 for x in range(17+state*3,30,3):p.line((x,35,x+2,51),fill=light,width=2)
for i in range(4):component('plunger-'+str(i),i*72,224,64,64,lambda p,w,h,i=i:plunger(p,w,h,i))
def wheel(p,w,h):
 p.ellipse((5,5,59,59),outline=brass,width=5)
 for end in [(32,6),(58,32),(32,58),(6,32)]:p.line((32,32,*end),fill=steel,width=4)
 p.ellipse((25,25,39,39),fill=light)
component('wheel',416,224,64,64,wheel)
def cargo(p,w,h,state):
 p.rectangle((8,42,120,49),fill=steel);p.rectangle((12,49,116,53),fill=dark)
 for x in [12,116]:p.rectangle((x-3,7,x+3,42),fill=brass);p.ellipse((x-4,5,x+4,13),fill=light)
 p.rectangle((12,20,116,23),fill=brass)
 for x in range(28,113,16):p.rectangle((x,23,x+2,42),fill=steel)
 for x in [27,100]:p.ellipse((x-10,44,x+10,63),fill=dark);p.ellipse((x-6,48,x+6,59),fill=brass)
 p.rectangle((13,0,115,4),fill=dark if state==0 else brass)
 for x in [10,114]:p.rectangle((x-4,4,x+4,16 if state==0 else 8),fill=light)
 p.ellipse((60,25,78,43),outline=light,width=2)
for i,name in enumerate(['cargo-held','cargo-free','cargo-running']):component(name,i*136,320,128,80,lambda p,w,h,i=i:cargo(p,w,h,i))
im.save(folder/'parts-guide-native.png');im.resize((1024,1024),Image.Resampling.NEAREST).save(folder/'parts-guide-2x.png')
(folder/'parts-layout.json').write_text(json.dumps({'nativeSize':[512,512],'worldPixel':2,'parts':rects,'bodySpine':16,'linkAnchors':[12,92],'footSole':32,'cargoRim':44,'cargoWheelBottom':64},indent=2)+'\n')
print('Warden89 native component guide and explicit anchors prepared.')
