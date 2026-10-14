from PIL import Image,ImageDraw
from pathlib import Path
import json,math
root=next(p for p in Path(__file__).resolve().parents if (p/'package.json').is_file());poses=json.loads((root/'output/warden89/guide-poses.json').read_text())
board=Image.new('RGBA',(640,320*4),'#182431')
for row,g in enumerate(poses):
 im=Image.new('RGBA',(640,320),'#182431');d=ImageDraw.Draw(im)
 def point(p):return((p['x']-880)/2,(p['y']-400)/2)
 d.line((0,270,640,270),fill='#8babb8',width=3)
 # Opaque far links followed by nearer links; exactly four whole load paths.
 def limb(leg):
  hip,knee,ankle,foot=[point(leg[n])for n in ['hip','knee','ankle','foot']];c='#566f80'if leg['far']else'#ad7936'
  d.line((hip,knee,ankle),fill=c,width=16)
  for p in [hip,knee,ankle]:d.ellipse((p[0]-8,p[1]-8,p[0]+8,p[1]+8),fill='#273745',outline=c,width=3)
  d.polygon([(foot[0]-20,foot[1]-10),(foot[0]+20,foot[1]-10),(foot[0]+21,foot[1]),(foot[0]+10,foot[1]),(foot[0]+8,foot[1]-5),(foot[0]-8,foot[1]-5),(foot[0]-10,foot[1]),(foot[0]-21,foot[1])],fill=c)
 for leg in g['legs']:
  if leg['far']:limb(leg)
 left=point(g['body']);right=point({'x':1560,'y':g['body']['y']+math.tan(g['body']['angle'])*640})
 d.polygon([(left[0],left[1]),(right[0],right[1]),(right[0],right[1]+70),(left[0],left[1]+70)],fill='#956633',outline='#d1a44e')
 d.line((left,right),fill='#93a7b0',width=4)
 ey=point(g['eye']);d.ellipse((ey[0]-82,ey[1]-44,ey[0]+6,ey[1]+44),fill='#b78942',outline='#354957',width=5)
 d.ellipse((ey[0]-14,ey[1]-24,ey[0]+6,ey[1]+24),fill='#60cfcd')
 for leg in g['legs']:
  if not leg['far']:limb(leg)
 for leg in g['legs']:
  for name in ['hip','knee','ankle']:
   p=point(leg[name]);d.ellipse((p[0]-2,p[1]-2,p[0]+2,p[1]+2),fill='#ef6372')
 if row==2:
  source=Image.open(root/'assets/vikings86-native/olaf-native.png');i=34;c=source.crop((i%8*64,i//8*64,i%8*64+64,i//8*64+64));im.alpha_composite(c,(int((1490-880)/2-32),int((896-400)/2-40)))
 d.text((8,8),g['name']+' | four legs | 2 world units / native pixel',fill='#f7e4b7')
 board.alpha_composite(im,(0,row*320))
board.save(root/'output/warden89/articulation-guide-native.png');board.resize((1280,2560),Image.Resampling.NEAREST).save(root/'output/warden89/articulation-guide-2x.png')
