from pathlib import Path
from PIL import Image,ImageDraw
root=Path(__file__).resolve().parents[1]/'assets/level96';root.mkdir(parents=True,exist_ok=True)
sheet=Image.new('RGBA',(480,288));
for n in range(15):
 im=Image.new('RGBA',(96,96));d=ImageDraw.Draw(im);metal=(65,79,86,255);edge=(157,130,82,255);dark=(22,31,39,255)
 if n==0:
  d.rectangle((10,91,85,93),fill=edge);d.rectangle((16,43,79,90),fill=metal);d.rectangle((25,30,69,42),fill=edge);d.rectangle((28,48,67,79),fill=dark);d.rectangle((36,56,60,74),fill=edge)
 elif n==1:
  d.ellipse((22,22,74,74),fill=metal,outline=edge,width=4);d.ellipse((36,36,60,60),fill=dark);d.rectangle((45,12,51,84),fill=edge);d.rectangle((12,45,84,51),fill=edge)
 elif n==2:
  d.rectangle((10,35,66,61),fill=metal);d.rectangle((67,29,78,67),fill=edge);d.rectangle((72,34,83,62),fill=dark)
 elif n==3:
  d.ellipse((20,20,76,76),fill=edge);d.ellipse((26,26,70,70),fill=dark);d.rectangle((46,30,49,52),fill=(220,195,130,255))
 elif n in [4,5]:
  d.rectangle((6,40,89,44),fill=edge);d.rectangle((10,45,85,62),fill=metal);d.rectangle((29,63,66,69),fill=dark);d.ellipse((30,48,64,60),fill=dark)
 elif n==6:
  d.rectangle((36,48,60,78),fill=metal);d.ellipse((32,16,64,48),fill=edge);d.ellipse((40,23,56,41),fill=(0,0,0,0));d.rectangle((29,79,67,83),fill=edge)
 elif n==7:
  d.rectangle((37,38,59,62),fill=edge);d.rectangle((40,42,56,58),fill=(103,157,175,255));d.rectangle((34,37,62,40),fill=edge);d.rectangle((34,60,62,63),fill=edge)
 elif n==8:
  d.ellipse((24,24,72,72),fill=edge);d.ellipse((30,30,66,66),fill=dark);d.ellipse((39,39,57,57),fill=(149,81,54,255));d.ellipse((44,44,52,52),fill=edge)
 elif n==9:
  d.rectangle((14,12,82,15),fill=edge);d.rectangle((14,86,82,89),fill=edge)
  for x in range(18,82,12):d.rectangle((x,16,x+3,85),fill=metal)
 elif n==10:
  d.rectangle((6,12,89,27),fill=metal);d.rectangle((6,12,89,15),fill=edge)
  for x in [6,83]:d.rectangle((x,28,x+6,93),fill=metal)
 elif n==11:
  d.rectangle((10,91,85,93),fill=edge);d.rectangle((16,80,79,90),fill=metal);d.ellipse((20,26,76,82),fill=edge);d.ellipse((28,34,68,74),fill=dark);d.rectangle((44,24,52,84),fill=metal)
 elif n==12:
  d.rectangle((22,22,74,66),fill=metal);d.rectangle((18,67,78,75),fill=edge);d.rectangle((42,0,54,21),fill=edge);d.rectangle((30,29,66,58),fill=dark)
 elif n==13:
  d.rectangle((42,0,53,95),fill=metal)
  for y in [10,42,74]:d.rectangle((39,y,56,y+4),fill=edge)
 elif n==14:
  d.rectangle((14,91,81,93),fill=edge);d.rectangle((23,70,72,90),fill=metal);d.rectangle((27,63,68,69),fill=edge);d.rectangle((32,72,64,86),fill=dark)
 sheet.alpha_composite(im,((n%5)*96,(n//5)*96))
sheet.save(root/'parts-guide-native.png');sheet.resize((1440,864),Image.Resampling.NEAREST).save(root/'parts-guide-3x.png')
terrain=Image.new('RGBA',(96,96));d=ImageDraw.Draw(terrain)
for y in range(3):
 for x in range(3):
  ox=x*32;oy=y*32;d.rectangle((ox,oy,ox+31,oy+31),fill=(34,43,51,255))
  if y==0:d.rectangle((ox,oy,ox+31,oy+3),fill=(126,133,129,255));d.rectangle((ox,oy+4,ox+31,oy+6),fill=(62,76,81,255))
  elif y==1:
   d.line((ox,oy+16,ox+31,oy+16),fill=(19,27,33,255),width=2);d.line((ox+14,oy,ox+14,oy+15),fill=(19,27,33,255),width=2)
  else:d.rectangle((ox+4,oy+5,ox+19,oy+18),fill=(38,47,54,255))
terrain.save(root/'terrain-guide-native.png');terrain.resize((576,576),Image.Resampling.NEAREST).save(root/'terrain-guide-6x.png')
print('Native parts480x288 (15x96-squarecells), terrain96x96 (9x32cells).')
