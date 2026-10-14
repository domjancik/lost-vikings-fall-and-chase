from pathlib import Path
from PIL import Image,ImageDraw
import math,json
r=Path('assets/vikings77');r.mkdir(exist_ok=True)
out=Image.new('RGBA',(512,256));meta=[]
colors={'edge':'#151d27','far':'#703b30','body':'#ac4934','skin':'#e2a15c','near':'#b07146','pants':'#374957','steel':'#a7b7ba'}
for n in range(32):
 im=Image.new('RGBA',(64,64));d=ImageDraw.Draw(im)
 walk=n<8;phase=n*math.tau/8;breath=(0,0,-1,0)[(n-8)%4] if 8<=n<12 else 0
 crouch=(3,1,0)[n-22] if 22<=n<25 else 2 if n==25 else (0,1,2,2,1,0)[n-26] if n>=26 else 0
 lean=(-2,-1,2,3,2,0)[n-26] if n>=26 else -2 if n==25 else 0
 hip=(32,49+crouch);shoulder=(32+lean,38+breath+crouch);head=(32+lean,30+breath+crouch)
 if walk:
  # Same limb identities cross through passing poses; far limb is painted first.
  spread=round(8*math.cos(phase));lift=round(3*max(0,math.sin(phase)))
  feet=[(32-spread,62-round(3*max(0,-math.sin(phase)))),(32+spread,62-lift)]
 else:feet=[(28,62),(37,62)]
 arms=[[(29,shoulder[1]),(26,43),(25,47)],[(35,shoulder[1]),(39,43),(40,47)]]
 if walk:
  swing=round(5*math.cos(phase));arms=[[(29,38),(27-swing,42),(27-swing,46)],[(35,38),(37+swing,42),(37+swing,46)]]
 climb=14<=n<18
 if 18<=n<22:
  f=n-18;feet=[(25+f,55+f*2),(38-f,58+f)];arms=[[(29,38),(25,32+f),(23,28+f*2)],[(35,38),(40,32+f),(42,28+f*2)]]
 if n>=26:
  f=n-26;arms=[[(29+lean,38+crouch),(24+lean,40+crouch),(21+lean,42+crouch)],[(35+lean,38+crouch),(39+lean,39+crouch),(42+lean,40+crouch)]]
  feet=[(26-(f%3),62),(38+(f%3),62)]
 if climb:
  f=n-14;grips=[(28,34),(31,31),(34,28),(31,31)][f]
  arms=[[(28,38),(24,grips[0]+4),(25,grips[0])],[(36,38),(40,grips[1]+4),(39,grips[1])]]
  feet=[(28,62-(0,2,4,2)[f]),(36,62-(4,2,0,2)[f])]
 def limb(points,color,width=4):
  d.line(points,fill=colors['edge'],width=width+2);d.line(points,fill=color,width=width)
 limb(arms[0],colors['far']);limb([hip,(feet[0][0],55),(feet[0][0],feet[0][1]-3)],'#263541',5)
 d.rectangle((feet[0][0]-3,feet[0][1]-2,feet[0][0]+3,feet[0][1]-1),fill=colors['far'])
 d.polygon([(28+lean,36+breath+crouch),(36+lean,36+breath+crouch),(37,49+crouch),(27,49+crouch)],fill=colors['edge'])
 d.polygon([(29+lean,37+breath+crouch),(35+lean,37+breath+crouch),(35,48+crouch),(29,48+crouch)],fill=colors['body'])
 limb([hip,(feet[1][0],55),(feet[1][0],feet[1][1]-3)],colors['pants'],5)
 d.rectangle((feet[1][0]-3,feet[1][1]-2,feet[1][0]+3,feet[1][1]-1),fill=colors['near'])
 limb(arms[1],colors['skin'])
 # Head orientation must change rather than just shifting the whole figure.
 hy=head[1];d.rectangle((28+lean,hy-3,36+lean,hy+6),fill=colors['edge']);d.rectangle((29+lean,hy-2,36+lean,hy+4),fill=colors['skin'])
 d.rectangle((27,hy-4,36,hy-1),fill=colors['steel'])
 d.rectangle((28,hy-4,30,hy-2),fill='#d8dfcf')
 d.rectangle((32,hy-4,33,hy-1),fill='#e8d1a1')
 eyeY=hy+1 if n!=12 else hy-1
 if n==13:eyeY=hy+3
 if not climb:d.point((36,eyeY),fill=colors['edge']);d.rectangle((29,hy+4,34,hy+7),fill='#a25c31')
 else:d.rectangle((29,hy,35,hy+5),fill='#a25c31')
 if n in (12,13):
  head_part=im.crop((26,hy-5,39,hy+8));im.paste((0,0,0,0),(26,hy-5,39,hy+8))
  head_part=head_part.rotate(22 if n==12 else -25,resample=Image.Resampling.NEAREST,expand=False)
  im.alpha_composite(head_part,(26,hy-5))
 out.paste(im,(n%8*64,n//8*64));meta.append({'cell':n,'pose':'walk' if walk else 'idle' if n<12 else 'look-up' if n==12 else 'look-down' if n==13 else 'climb' if climb else 'rise' if n<20 else 'fall' if n<22 else 'land' if n<25 else 'hurt' if n==25 else 'bash','feet':feet,'arms':arms,'head':head,'nearLeg':1,'farLeg':0})
out.save(r/'erik-guide-native.png');out.resize((2048,1024),Image.Resampling.NEAREST).save(r/'erik-guide.png')
(r/'erik-guide.json').write_text(json.dumps({'cell':[64,64],'worldCell':[128,128],'origin':[32,40],'sole':62,'frames':meta},indent=2)+'\n')
