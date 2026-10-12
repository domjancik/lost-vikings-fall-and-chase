from PIL import Image
from pathlib import Path
r=Path('assets/clockwork69')
expected={'parts.png':(384,192),'machine.png':(384,208),'dock.png':(640,224),'pin.png':(128,56),'catch.png':(192,80),'scene.png':(768,512)}
for name,size in expected.items():
    im=Image.open(r/name).convert('RGBA');assert im.size==size,(name,im.size)
    if name!='scene.png':assert set(im.getchannel('A').tobytes())<={0,255},name
p=Image.open(r/'parts.png').convert('RGBA');a=p.getchannel('A')
assert a.getpixel((48,48))==0,'wheel interior obstructed'
for x,y in [(48,25),(28,48),(68,48),(48,68)]:assert a.getpixel((x,y))==0,(x,y)
for n in range(4,8):
    c=p.crop((n%4*96,96,n%4*96+96,192));assert c.getbbox()[3]==96,('spring base',n,c.getbbox())
d=Image.open(r/'dock.png').convert('RGBA')
for n in range(4):
    c=d.crop((n*160,0,n*160+160,224));assert c.getbbox()[3]==193,('dock base',n)
    assert c.getpixel((80,112))[3]==0,('filled dock',n)
pin=Image.open(r/'pin.png').convert('RGBA')
for n in range(4):assert pin.crop((n*32,0,n*32+32,56)).getbbox()[3]==56,('pin base',n)
print('Native cell sizes, binary alpha, clear wheel/dock and registered spring/dock/pin bases verified.')
