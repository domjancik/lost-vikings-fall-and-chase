from PIL import Image
import math
im=Image.open('assets/momentum72/ball.png').convert('RGBA');assert im.size==(512,512)
native=Image.open('assets/momentum72/ball-native.png').convert('RGBA')
for n in range(64):
 f=im.crop((n%8*64,n//8*64,n%8*64+64,n//8*64+64));a=n*math.tau/64;c=math.cos(a);s=math.sin(a)
 for y in range(64):
  for x in range(64):
   p=f.getpixel((x,y));assert p[3] in (0,255)
   dx=x-31.5;dy=y-31.5
   if dx*dx+dy*dy>784:assert p[3]==0
   else:assert p==native.getpixel((round(31.5+c*dx+s*dy),round(31.5-s*dx+c*dy)))
assert im.crop((256,128,320,192)).tobytes()!=im.crop((0,0,64,64)).tobytes()
print('64 registered rigid rotations match one native source; fixed circular bounds and binary alpha verified.')
