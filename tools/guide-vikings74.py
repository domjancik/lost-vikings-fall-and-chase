from pathlib import Path
from PIL import Image,ImageDraw
import math,json
r=Path('assets/vikings74');r.mkdir(exist_ok=True)
out=Image.new('RGBA',(256,256));meta=[]
colors={'edge':'#151d27','far':'#703b30','body':'#ac4934','skin':'#e2a15c','near':'#b07146','pants':'#374957','steel':'#a7b7ba'}
for n in range(16):
 im=Image.new('RGBA',(64,64));d=ImageDraw.Draw(im)
 walk=n<8;phase=n*math.tau/8;breath=(0,0,-1,0)[(n-8)%4] if 8<=n<12 else 0
 hip=(32,49);shoulder=(32,38+breath);head=(32,29+breath)
 if walk:
  # Same limb identities cross through passing poses; far limb is painted first.
  spread=round(8*math.cos(phase));lift=round(3*max(0,math.sin(phase)))
  feet=[(32-spread,62-round(3*max(0,-math.sin(phase)))),(32+spread,62-lift)]
 else:feet=[(28,62),(37,62)]
 arms=[[(29,shoulder[1]),(26,43),(25,47)],[(35,shoulder[1]),(39,43),(40,47)]]
 if walk:
  swing=round(5*math.cos(phase));arms=[[(29,38),(27-swing,42),(27-swing,46)],[(35,38),(37+swing,42),(37+swing,46)]]
 climb=n>=14
 if climb:
  arms=[[(28,38),(24,33+n%2*4),(25,29+n%2*4)],[(36,38),(40,37-n%2*4),(39,33-n%2*4)]]
  feet=[(28,62-n%2*3),(36,59+n%2*3)]
 def limb(points,color,width=4):
  d.line(points,fill=colors['edge'],width=width+2);d.line(points,fill=color,width=width)
 limb(arms[0],colors['far']);limb([hip,(feet[0][0],55),feet[0]],'#263541',5)
 d.rectangle((feet[0][0]-3,feet[0][1]-2,feet[0][0]+3,feet[0][1]),fill=colors['far'])
 d.polygon([(28,36+breath),(36,36+breath),(37,49),(27,49)],fill=colors['edge'])
 d.polygon([(29,37+breath),(35,37+breath),(35,48),(29,48)],fill=colors['body'])
 limb([hip,(feet[1][0],55),feet[1]],colors['pants'],5)
 d.rectangle((feet[1][0]-3,feet[1][1]-2,feet[1][0]+3,feet[1][1]),fill=colors['near'])
 limb(arms[1],colors['skin'])
 # Head orientation must change rather than just shifting the whole figure.
 hy=head[1];d.rectangle((28,hy-3,36,hy+6),fill=colors['edge']);d.rectangle((29,hy-2,36,hy+4),fill=colors['skin'])
 d.rectangle((27,hy-4,36,hy-1),fill=colors['steel'])
 eyeY=hy+1 if n!=12 else hy-1
 if n==13:eyeY=hy+3
 if not climb:d.point((36,eyeY),fill=colors['edge']);d.rectangle((29,hy+4,34,hy+7),fill='#a25c31')
 else:d.rectangle((29,hy,35,hy+5),fill='#a25c31')
 out.paste(im,(n%4*64,n//4*64));meta.append({'cell':n,'pose':'walk' if walk else 'idle' if n<12 else 'look-up' if n==12 else 'look-down' if n==13 else 'climb','feet':feet,'arms':arms,'head':head,'nearLeg':1,'farLeg':0})
out.save(r/'erik-guide-native.png');out.resize((1024,1024),Image.Resampling.NEAREST).save(r/'erik-guide.png')
(r/'erik-guide.json').write_text(json.dumps({'cell':[64,64],'worldCell':[128,128],'origin':[32,40],'sole':62,'frames':meta},indent=2)+'\n')
