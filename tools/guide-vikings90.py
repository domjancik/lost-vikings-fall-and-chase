"""Front-three-quarter motion guides; render directly at the existing native density.

Whole articulated actors, stable near/far identities, no bitmap component splices.
Only replacement walk/climb cells are sent to imagegen; other88 poses are retained.
"""
from pathlib import Path
import importlib.util,copy,json,math
from PIL import Image,ImageDraw
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'assets/vikings90'
spec=importlib.util.spec_from_file_location('native86',Path(__file__).with_name('native-vikings86.py'));V=importlib.util.module_from_spec(spec);spec.loader.exec_module(V)
G=V.G

def torso(d,f,h):
 if f['hero']!='baleog' or not f['view'].startswith('rear'):
  return V.torso(d,f,h)
 cx=f['chest'][0];sy=sum(p[1]for p in f['shoulders'].values())/2;px,py,_=f['pelvis'];w=9.;waist=6.
 outline=[G.p(cx-3,sy-1),G.p(cx-w,sy),G.p(cx-w-.7,sy+3),G.p(px-waist,py+2),G.p(px+waist,py+2),G.p(cx+w,sy+3),G.p(cx+w-.8,sy),G.p(cx+2,sy-1)]
 V.poly(d,outline,V.EDGE);mid=G.p(cx,(sy+py)/2)
 V.poly(d,[G.lerp(mid,p,.88)for p in outline],'#526674')
 # One connected backplate, not rounded front pectorals beneath two pauldrons.
 V.poly(d,[G.p(cx+2,sy),G.p(cx+w-1,sy+3),G.p(px+waist-1,py),G.p(px+1,py)],'#303d4c')
 d.line([G.xy(G.p(cx-3,sy+2)),G.xy(G.p(px-2,py-2))],fill='#899991',width=1)
 V.poly(d,[G.p(px-waist,py-1.2),G.p(px+waist,py+.2),G.p(px+waist,py+2),G.p(px-waist,py+.6)],'#382c26')
 V.poly(d,[G.p(px-1,py-.4),G.p(px+1.5,py),G.p(px+1.5,py+1.5),G.p(px-1,py+1.1)],'#c09951')

def limb(d,chain,kind,side,h):
 # Preserve the existing articulated geometry; Olaf's trousers are brown,
 # including their highlights. Slate highlights falsely describe a new fabric.
 if kind!='Leg' or h is not G.HEROES['olaf']:
  return V.limb(d,chain,kind,side,h)
 a,b,c=chain['start'],chain['joint'],chain['end'];near=side=='near'
 radii=(3.1,2.35,1.35);base=h['pants']if near else h['farPants']
 for extra,color in[(.65,V.EDGE),(0,base)]:
  G.segment(d,a,b,radii[0]+extra,radii[1]+extra,color)
  G.segment(d,b,c,radii[1]+extra,radii[2]+extra,color)
  G.disc(d,b,radii[1]+extra,color)
 if near:
  G.segment(d,V.offset(a,-.8),V.offset(b,-.8),radii[0]*.48,radii[1]*.43,'#b99360')
  G.segment(d,V.offset(b,.6),V.offset(c,.6),radii[1]*.4,radii[2]*.45,'#433b2f')

def pose(hero,action,phase):
 f=V.pose(hero,action,phase)
 if not f['view'].startswith('rear'):
  original=copy.deepcopy(f)
  # Facing right and toward the viewer: camera-near attachments project LEFT
  # of camera-far attachments, rather than presenting a back-facing torso.
  for side in ('near','far'):
   for kind,anchors,center in [('Leg','hips',f['pelvis'][0]),('Arm','shoulders',f['chest'][0])]:
    dx=2*(center-f[anchors][side][0]);f[anchors][side]=V.offset(f[anchors][side],dx)
    for key in ('start','joint','end'):f['limbs'][side+kind][key]=V.offset(f['limbs'][side+kind][key],dx)
    if kind=='Leg':
     ft=f['feet'][side];ft['ankle']=V.offset(ft['ankle'],dx);ft['polygon']=[V.offset(p,dx)for p in ft['polygon']]
  for eq in f['equipment']:
   if eq['type']=='shield':
    grips=eq.get('grips',{});eq['grips']={('far'if side=='near'else'near'):grip for side,grip in grips.items()}
    for side,grip in eq.get('grips',{}).items():
     h=G.HEROES[hero];f['limbs'][side+'Arm']=G.ik(f['shoulders'][side],grip,h['upper'],h['fore'],G.p(1,1))
    if 'near'not in eq['grips']:
     chain=copy.deepcopy(original['limbs']['farArm']);delta=G.sub(f['shoulders']['near'],chain['start'])
     for key in ('start','joint','end'):chain[key]=G.add(chain[key],delta)
     f['limbs']['nearArm']=chain
   elif eq['type'] in ('sword','bow'):eq['grip']=f['limbs']['nearArm']['end']
   if eq['type']=='bow':eq['drawHand']=f['limbs']['farArm']['end']
 f['viewArt']='rear-facing-ladder'if f['view'].startswith('rear')else'front-three-quarter-right'
 if action in ('walk','overhead-walk'):
  # Both feet must cross the BODY root, not trace disjoint paths centered on
  # overly separated hips. Preserve the authored roll/lift and solve real IK.
  h=G.HEROES[hero];feet={};compression=0
  route=[37.2,33.8,27.8,28.,28.4,31.5,38.3,39.4]if hero=='erik'else[36.6,34.7,32.,29.2,27.5,28.7,31.5,35.]
  for side,off in [('near',0),('far',4)]:
   f['hips'][side]=G.p(32+(-.8 if side=='near'else .8),f['hips'][side][1],f['hips'][side][2]);ft=f['feet'][side];dx=route[(phase+off)%8]-ft['ankle'][0]
   ft['ankle']=V.offset(ft['ankle'],dx);ft['polygon']=[V.offset(p,dx)for p in ft['polygon']];feet[side]=ft
   hip=f['hips'][side];ankle=ft['ankle'];available=(h['thigh']+h['shin']-.10)**2-(hip[0]-ankle[0])**2-(hip[2]-ankle[2])**2
   compression=max(compression,ankle[1]-math.sqrt(available)-hip[1])
  if compression>0:
   for key in ('pelvis','chest','neck'):f[key]=V.offset(f[key],0,compression)
   for side in ('near','far'):
    f['hips'][side]=V.offset(f['hips'][side],0,compression);f['shoulders'][side]=V.offset(f['shoulders'][side],0,compression)
    for key in ('start','joint','end'):f['limbs'][side+'Arm'][key]=V.offset(f['limbs'][side+'Arm'][key],0,compression)
  for side in ('near','far'):f['limbs'][side+'Leg']=G.ik(f['hips'][side],feet[side]['ankle'],h['thigh'],h['shin'],G.p(1,0))
  for eq in f['equipment']:
   if eq['type']=='shield':
    if eq.get('raiseFraction',0)<1:
     eq['center']=V.offset(eq['center'],0,compression);eq['grips']={side:V.offset(p,0,compression)for side,p in eq['grips'].items()}
    for side,grip in eq['grips'].items():f['limbs'][side+'Arm']=G.ik(f['shoulders'][side],grip,h['upper'],h['fore'],G.p(1,1))
   elif eq['type']in('sword','bow'):eq['grip']=f['limbs']['nearArm']['end']
   if eq['type']=='bow':eq['drawHand']=f['limbs']['farArm']['end']
  f['rootCompression']=compression
 f['limbIdentity']={'near':'camera-near, light material, left attachment in front view','far':'camera-far, same material shaded, right attachment in front view'}
 return f

def main():
 OUT.mkdir(parents=True,exist_ok=True)
 G.xy=V.N.native_xy;G.poly=V.poly;G.torso=torso;G.limb=limb;G.head=V.head;G.shield_image=V.N.shield_native;G.equipment_olaf=V.N.registered_equipment;G.equipment=V.equipment
 for hero in ('erik','baleog','olaf'):
  G.HEROES[hero].update(V.PALETTES[hero])
  original=json.loads((ROOT/f'assets/vikings86-native/{hero}-frames.json').read_text());allframes=[]
  for old in original['frames']:
   f=pose(hero,old['action'],old['phase']);f['cell']=old['cell'];allframes.append(f)
  selected=[f for f in allframes if f['action'] in ('walk','climb','overhead-walk','overhead-climb')]
  cols=8;rows=math.ceil(len(selected)/cols);sheet=Image.new('RGBA',(cols*64,rows*64));joints=sheet.copy()
  groups={}
  for i,f in enumerate(selected):
   im=V.render(f);f['opaqueBoundsNative']=list(im.getbbox());sheet.alpha_composite(im,(i%8*64,i//8*64));joint=im.copy();d=ImageDraw.Draw(joint)
   for name,chain in f['limbs'].items():
    color='#ffcc52'if name.startswith('near')else'#61bbef';points=[G.xy(chain[k])for k in ('start','joint','end')];d.line(points,fill=color,width=1)
    for x,y in points:d.rectangle((x-1,y-1,x+1,y+1),fill=color)
   joints.alpha_composite(joint,(i%8*64,i//8*64));groups.setdefault(f['action'],[]).append(im)
  sheet.save(OUT/f'{hero}-guide-native.png');sheet.resize((sheet.width*2,sheet.height*2),Image.Resampling.NEAREST).save(OUT/f'{hero}-guide-2x.png')
  joints.resize((joints.width*4,joints.height*4),Image.Resampling.NEAREST).save(OUT/f'{hero}-joints-4x.png')
  for action,images in groups.items():
   motion=[]
   for im in images*3:
    bg=Image.new('RGBA',(64,64),'#1e2630');bg.alpha_composite(im);d=ImageDraw.Draw(bg);d.line((32,0,32,63),fill='#53606b');motion.append(bg.resize((384,384),Image.Resampling.NEAREST))
   motion[0].save(OUT/f'{hero}-guide-{action}.gif',save_all=True,append_images=motion[1:],duration=110 if 'walk'in action else 240,loop=0,disposal=2)
  (OUT/f'{hero}-guide.json').write_text(json.dumps({'cell':[64,64],'nativePixelWorldSize':2,'geometryProjection':V.N.PROJECTION,'replacementCells':[f['cell']for f in selected],'frames':selected,'allFrames':allframes},indent=2)+'\n')
  print(hero,len(selected),'replacement guides')
if __name__=='__main__':main()
