"""Native geometry-only guides; these are not shipped artwork."""
from pathlib import Path
from PIL import Image,ImageDraw
root=Path(__file__).resolve().parents[3]
out=root/'assets/freight109';out.mkdir(parents=True,exist_ok=True)
def save(image,name):
 image.save(out/(name+'-guide-native.png'))
 image.resize((image.width*4,image.height*4),Image.Resampling.NEAREST).save(out/(name+'-guide-4x.png'))
steel='#52636b';edge='#202b33';bronze='#a88650';light='#c3bfa0';stone='#aea99c'
sheet=Image.new('RGBA',(256,256))
for n in range(16):
 im=Image.new('RGBA',(64,64));d=ImageDraw.Draw(im)
 if n<3:
  d.rectangle((16,52,47,59),fill=bronze);d.rounded_rectangle((18,36,45,56),radius=3,fill=steel)
  d.ellipse((22,37,41,54),fill=edge)
  for a,b in ([(24,46),(40,46)],[(32,39),(32,52)]):d.line((a,b),fill=bronze,width=3)
  if n:d.line((24,39,39,52)if n==1 else(24,52,39,39),fill=light,width=3)
 elif n in (3,4):
  d.rectangle((16,12,47,59),fill=edge);d.rectangle((18,14,45,57),fill=steel);d.rectangle((15,56,48,59),fill=bronze)
  d.rectangle((27,33,36,46),fill=edge)
  if n==4:d.rectangle((28,34,35,45),fill='#bf7d46');d.line((29,36,34,36),fill='#e3bc76')
 elif n in (5,6):
  d.rectangle((24,20,39,59),fill=stone);d.line((31,20,28,31,34,42,29,59),fill=edge,width=2 if n==5 else 4)
 elif n==7:
  d.polygon((22,59,24,51,30,53,32,58,36,50,41,54,42,59),fill=stone)
 elif n in (8,9,10):
  d.rectangle((16,50,47,59),fill=bronze);d.rectangle((22,25,45,53),fill=steel)
  d.rectangle((16,35,28,46),fill=edge if n==8 else '#b86e40'if n==9 else '#e5bd78')
  d.ellipse((30,28,43,42),fill=bronze)
 elif n in (11,15):
  d.rectangle((16,50,47,59),fill=steel);d.rectangle((26,26,43,54),fill=edge);d.ellipse((26,28,42,44),fill=bronze)
  d.line((26,39,18,39,18,51),fill='#8e7152',width=3)
  if n==11:d.line((18,51,28,51,30,43),fill='#8e7152',width=3)
  else:d.line((18,46,20,47),fill=light,width=2)
 elif n==12:
  d.rectangle((8,0,55,7),fill=steel);d.rectangle((8,0,15,59),fill=steel);d.rectangle((48,0,55,59),fill=steel)
  d.rectangle((8,55,15,59),fill=bronze);d.rectangle((48,55,55,59),fill=bronze)
 elif n==13:
  d.rectangle((16,12,47,59),fill=steel)
  for y in range(16,60,10):d.line((17,y,46,y),fill=bronze,width=2)
 elif n==14:
  d.rectangle((24,4,39,59),fill=steel);d.rectangle((22,4,41,11),fill=bronze);d.rectangle((22,54,41,59),fill=bronze)
 sheet.alpha_composite(im,(n%4*64,n//4*64))
save(sheet,'machines')
cart=Image.new('RGBA',(192,128));d=ImageDraw.Draw(cart)
d.rectangle((40,64,151,70),fill=bronze);d.rectangle((36,71,155,86),fill=steel)
d.rectangle((58,82,135,90),fill=edge)
for x in (52,140):d.ellipse((x-10,82,x+9,101),fill=edge);d.ellipse((x-6,86,x+5,97),fill=bronze)
d.ellipse((88,73,104,89),fill=bronze)
save(cart,'cart')
enemy=Image.new('RGBA',(192,128))
for n in range(8):
 im=Image.new('RGBA',(48,64));d=ImageDraw.Draw(im)
 near=[18,23,31,27][n%4];far=[31,27,18,23][n%4]
 if n==7:
  d.polygon((10,43,15,24,34,31,39,43),fill=steel);d.rectangle((15,40,36,43),fill=bronze)
 else:
  for x,c in ((far,edge),(near,bronze)):
   lift=3 if x in (23,27)and n<4 else 0
   d.line((25,30,x,36,x,42-lift),fill=c,width=5);d.rectangle((x-3,41-lift,x+3,43-lift),fill=c)
  d.rounded_rectangle((17,16,35,33),radius=3,fill=steel);d.rectangle((20,10,31,18),fill=edge)
  d.rectangle((10,29,23,33),fill=bronze);d.rectangle((20,27,27,35),fill='#b87745')
  if n in (4,5,6):d.rectangle((10 if n!=6 else 12,30,15,32),fill='#e5bd78')
 enemy.alpha_composite(im,(n%4*48,n//4*64))
save(enemy,'inspector')
