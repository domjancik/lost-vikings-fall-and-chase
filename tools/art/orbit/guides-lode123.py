from pathlib import Path
from PIL import Image, ImageDraw
import math
p=Path('assets/lode123');p.mkdir(exist_ok=True)
im=Image.new('RGBA',(300,300));d=ImageDraw.Draw(im)
for inset,color in [(10,'#101d2c'),(12,'#9a663d'),(15,'#d0ab69'),(18,'#536471'),(24,'#23333f'),(28,'#101d2b')]:
 d.ellipse((inset,inset,299-inset,299-inset),fill=color)
for n in range(8):
 a=n*math.pi/4;x=150+math.cos(a)*106;y=150+math.sin(a)*106
 d.line((150,150,x,y),fill='#142230',width=14);d.line((148,147,x-2,y-3),fill='#71838b',width=8)
 x=150+math.cos(a)*126;y=150+math.sin(a)*126
 d.ellipse((x-3,y-3,x+3,y+3),fill='#d1a565')
d.ellipse((106,106,194,194),fill='#986735');d.ellipse((112,112,188,188),fill='#2c3a47');d.ellipse((128,128,172,172),fill='#b6864c')
im.save(p/'stator-guide-native.png');im.resize((1200,1200),Image.Resampling.NEAREST).save(p/'stator-guide4x.png')
kit=Image.new('RGBA',(256,192))
for n in range(12):
 c=Image.new('RGBA',(64,64));d=ImageDraw.Draw(c)
 if n==0:
  d.rectangle((8,18,55,55),fill='#50606b');d.rectangle((12,22,51,51),fill='#29343d')
  for x in [18,46]:d.ellipse((x-7,1,x+7,15),fill='#b08b50');d.ellipse((x-3,5,x+3,11),fill='#26343e')
  d.rectangle((24,14,39,20),fill='#a87b45');d.rectangle((12,30,51,35),fill='#9b764b')
 elif n==1:
  d.rectangle((49,7,58,57),fill='#73818a');d.rectangle((8,7,58,14),fill='#be9a62');d.rectangle((8,50,58,57),fill='#be9a62');d.rectangle((43,23,53,42),fill='#425d65')
 elif n==2:
  d.rectangle((18,8,46,59),fill='#384954');d.ellipse((8,8,56,56),fill='#b1874e');d.ellipse((13,13,51,51),fill='#1a2a37');d.line((32,14,32,50),fill='#b6a57d',width=5);d.line((14,32,50,32),fill='#b6a57d',width=5);d.ellipse((26,26,38,38),fill='#d0b582')
 elif n in [3,4]:
  d.rectangle((13,29,51,59),fill='#3c4e5a');d.rectangle((17,34,47,55),fill='#172731');d.line((32,46,45 if n==3 else 19,16),fill='#b5b5a5',width=5);d.ellipse(((40 if n==3 else 14),11,(50 if n==3 else 24),21),fill='#c09354')
 elif n in [5,6,7]:
  if n==7:
   d.polygon([(11,53),(18,33),(43,30),(55,54)],fill='#56636b');d.rectangle((7,51,58,55),fill='#262d35')
  else:
   legs=[(19,42,12,54),(43,42,51,54)] if n==5 else [(19,42,29,54),(43,42,34,54)]
   for x,y,xx,yy in legs:d.line((x,y,xx,yy),fill='#8d795a',width=5);d.rectangle((xx-5,yy-2,xx+5,yy),fill='#31424e')
   d.rectangle((11,18,49,43),fill='#4c5e69');d.rectangle((15,21,45,28),fill='#1b2c3b');d.rectangle((18,23,41,25),fill='#79c4bd');d.rectangle((46,39,59,43),fill='#a18e69');d.ellipse((22,32,38,47),fill='#b1884e')
 elif n in [8,9]:
  y=43 if n==8 else 49;d.rectangle((7,53,57,59),fill='#374a54');d.rectangle((12,y,52,y+5),fill='#ae8a55')
  for x in [18,44]:d.line((x,y+5,x,53),fill='#83969d',width=3)
 else:
  d.rectangle((12,5,52,16),fill='#5f707b');d.rectangle((20,43,44,59),fill='#4a5e69')
  if n==10:d.line((32,16,32,45),fill='#ad8b60',width=4)
  else:d.line((32,16,29,28),fill='#ad8b60',width=4);d.line((35,37,32,45),fill='#ad8b60',width=4)
 kit.alpha_composite(c,(n%4*64,n//4*64))
kit.save(p/'kit-guide-native.png');kit.resize((1536,1152),Image.Resampling.NEAREST).save(p/'kit-guide6x.png')
