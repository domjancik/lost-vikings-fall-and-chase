"""Whole-body native three-quarter material revision; no bitmap reduction.

Retains85's eight contact families and cadence, adds authored visible depth.
All geometry rasterizes directly on64x64 native cells,2world per pixel.
Warden86/Clockwork references are material direction, never sampled pixels.
"""
from pathlib import Path
import importlib.util,copy,json,math
from PIL import Image,ImageDraw
ROOT=next(p for p in Path(__file__).resolve().parents if (p/'package.json').is_file());OUT=ROOT/'assets/vikings86-native'
spec=importlib.util.spec_from_file_location('native85',Path(__file__).with_name('native-vikings85-gaits.py'));N=importlib.util.module_from_spec(spec);spec.loader.exec_module(N)
G=N.G;EDGE='#1c1d24';G.EDGE=EDGE
PALETTES={
 'erik':dict(cloth='#75412f',clothDark='#402924',hair='#923523',pants='#4e5364',farPants='#292e3c'),
 'baleog':dict(cloth='#425867',clothDark='#242e40',hair='#c19341',pants='#526474',farPants='#293445'),
 'olaf':dict(cloth='#686b3b',clothDark='#3a422c',hair='#cfa24b',pants='#76603d',farPants='#433b2f')}

def poly(d,points,color):d.polygon([G.xy(q)for q in points],fill=color)
def offset(p,x=0,y=0):return G.add(p,G.p(x,y))

def volume(d,center,rx,ry,colors):
 c=N.project(center);rx*=N.PROJECTION;ry*=N.PROJECTION
 for y in range(max(0,int(c[1]-ry-1)),min(64,int(c[1]+ry+2))):
  for x in range(max(0,int(c[0]-rx-1)),min(64,int(c[0]+rx+2))):
   u=(x+.5-c[0])/rx;v=(y+.5-c[1])/ry;q=u*u+v*v
   if q>1:continue
   light=u*.76+v*.52
   color=EDGE if q>.89 else colors[0]if light<-.53 else colors[1]if light<-.02 else colors[2]if light<.48 else colors[3]
   d.point((x,y),fill=color)

def pose(hero,action,phase):
 f=G.base_pose(hero,action,phase)
 if not f['view'].startswith('rear'):
  # Visible three-quarter hip separation; preserve each phase's y/sole contact
  # and bone lengths while translating an entire leg chain and foot together.
  spread=1.2 if hero=='erik'else 1.7 if hero=='baleog'else 2.0
  for side,sign in [('near',1),('far',-1)]:
   dx=spread*sign;f['hips'][side]=offset(f['hips'][side],dx)
   for key in('start','joint','end'):f['limbs'][side+'Leg'][key]=offset(f['limbs'][side+'Leg'][key],dx)
   f['feet'][side]['ankle']=offset(f['feet'][side]['ankle'],dx);f['feet'][side]['polygon']=[offset(p,dx)for p in f['feet'][side]['polygon']]
 if hero=='olaf'and not f['view'].startswith('rear'):
  shield=next(e for e in f['equipment']if e['type']=='shield')
  for side,dx in [('near',3.),('far',-3.)]:
   f['shoulders'][side]=offset(f['shoulders'][side],dx)
   if side in shield.get('grips',{}):
    f['limbs'][side+'Arm']=G.ik(f['shoulders'][side],shield['grips'][side],G.HEROES[hero]['upper'],G.HEROES[hero]['fore'],G.p(1 if side=='near'else-1,1))
   else:
    for key in('start','joint','end'):f['limbs'][side+'Arm'][key]=offset(f['limbs'][side+'Arm'][key],dx)
 if hero!='olaf'and not f['view'].startswith('rear'):
  # Three-quarter shoulder breadth follows the actual articulated arm chains.
  # Translate an entire free chain, never stretch a limb or change foot contacts.
  for side,sign in [('near',1),('far',-1)]:
   dx=sign*(4.0 if hero=='erik'else 5.4)
   f['shoulders'][side]=offset(f['shoulders'][side],dx)
   for key in('start','joint','end'):f['limbs'][side+'Arm'][key]=offset(f['limbs'][side+'Arm'][key],dx)
  for eq in f['equipment']:
   if eq['type']in('sword','bow'):eq['grip']=f['limbs']['nearArm']['end']
   if eq['type']=='bow':eq['drawHand']=f['limbs']['farArm']['end']
 f['viewArt']='rear-facing-ladder'if f['view'].startswith('rear')else'three-quarter-right'
 return f

def torso(d,f,h):
 cx=f['chest'][0];sy=sum(p[1]for p in f['shoulders'].values())/2;px,py,_=f['pelvis'];rear=f['view'].startswith('rear');hero=f['hero']
 if hero=='olaf':
  cx=32.5+f['bodyLean']*.55;w=13.;bottom=py+4.4
  outline=[G.p(cx-3,sy-1),G.p(cx-9,sy),G.p(cx-w,sy+4),G.p(cx-w,py),G.p(cx-10,bottom-1),G.p(cx-3,bottom),G.p(cx+4,bottom),G.p(cx+10,bottom-1),G.p(cx+w,py-1),G.p(cx+11,sy+3),G.p(cx+5,sy-1)]
  poly(d,outline,EDGE);center=G.p(cx,(sy+bottom)/2);poly(d,[G.lerp(center,p,.9)for p in outline],'#665239'if not rear else h['cloth'])
  poly(d,[G.p(cx-8,sy+1),G.p(cx-5,sy+3),G.p(cx-4,py+3),G.p(cx-8,py+2),G.p(cx-9,sy+5)],'#343b2b')
  poly(d,[G.p(cx-6,sy+1),G.p(cx-3,sy),G.p(cx-2,sy+5),G.p(cx-4,py+2)],'#8c8a49')
  if not rear:
   poly(d,[G.p(cx-5,sy+2),G.p(cx+2,sy+1),G.p(cx+8,sy+3),G.p(cx+11,sy+6),G.p(cx+11,py-1),G.p(cx+8,py+2),G.p(cx+2,py+3),G.p(cx-5,py+1),G.p(cx-7,sy+6)],'#a57049')
   poly(d,[G.p(cx-4,sy+3),G.p(cx+2,sy+2),G.p(cx+7,sy+4),G.p(cx+9,sy+7),G.p(cx+8,py-.5),G.p(cx+4,py+1),G.p(cx-1,py),G.p(cx-5,sy+7)],'#d5a26a')
   poly(d,[G.p(cx-2,sy+3),G.p(cx+1,sy+3),G.p(cx+4,sy+5),G.p(cx+3,sy+7),G.p(cx-1,sy+6)],'#e4bb80')
   d.point(G.xy(G.p(cx+5,py-.7)),fill='#7c543d')
   d.line([G.xy(G.p(cx-6,sy)),G.xy(G.p(cx-5,sy+5))],fill='#352a24',width=2)
  d.line([G.xy(G.p(cx-7,py+2)),G.xy(G.p(cx,py+3)),G.xy(G.p(cx+7,py+2))],fill='#302c28',width=2)
  d.rectangle((*G.xy(G.p(cx+1,py+2)),*G.xy(G.p(cx+3,py+4))),fill='#bb914d')
 else:
  w=7.0 if hero=='erik'else 9.;waist=4.6 if hero=='erik'else 6.0
  outline=[G.p(cx-3,sy-1),G.p(cx-w,sy),G.p(cx-w-.7,sy+3),G.p(px-waist,py+2),G.p(px+waist,py+2),G.p(cx+w,sy+3),G.p(cx+w-.8,sy),G.p(cx+2,sy-1)]
  poly(d,outline,EDGE);mid=G.p(cx,(sy+py)/2);poly(d,[G.lerp(mid,p,.88)for p in outline],h['cloth'])
  volume(d,G.p(cx,sy+5.1),w,6.4,['#bd784c','#945037','#603427','#3d2824']if hero=='erik'else['#9da8a1','#667b83','#3b4b5e','#232c3b'])
  poly(d,[G.p(cx-4.5,sy+1),G.p(cx-1.5,sy),G.p(cx+1,sy+3),G.p(px-.5,py),G.p(px-3.5,py),G.p(cx-5,sy+4)],'#b16c41'if hero=='erik'else'#778b91')
  poly(d,[G.p(cx+2,sy+1),G.p(cx+w-1,sy+3),G.p(px+waist-1,py),G.p(px+1,py),G.p(cx+1,sy+5)],h['clothDark'])
  if hero=='baleog':
   poly(d,[G.p(cx-2,sy+2),G.p(cx+.5,sy+2),G.p(cx+1,sy+4),G.p(cx-1,sy+6),G.p(cx-3,sy+4)],'#b5b7a6')
   d.line([G.xy(G.p(cx-4,sy+6)),G.xy(G.p(cx+1,sy+7)),G.xy(G.p(cx+3,sy+6))],fill='#29313b',width=1)
  elif not rear:
   # Oblique leather diagonal and fur neckline make the running silhouette his.
   d.line([G.xy(G.p(cx-3,sy)),G.xy(G.p(px+2,py))],fill='#463026',width=2)
   d.line([G.xy(G.p(cx-2,sy+1)),G.xy(G.p(px+3,py))],fill='#d4a16a',width=1)
  if rear:
   # Broad jacket back/yoke with diagonal shoulder strap; no central beard wedge.
   poly(d,[G.p(cx-4,sy+1),G.p(cx+4,sy+1),G.p(cx+3,sy+4),G.p(cx-3,sy+4)],'#9b6142'if hero=='erik'else'#6d818a')
   d.line([G.xy(G.p(cx-3,sy+2)),G.xy(G.p(px+2,py-2))],fill='#3b2b26',width=2)
  poly(d,[G.p(px-waist,py-1.2),G.p(px+waist,py+.2),G.p(px+waist,py+2),G.p(px-waist,py+.6)],'#382c26')
  poly(d,[G.p(px-1,py-.4),G.p(px+1.5,py),G.p(px+1.5,py+1.5),G.p(px-1,py+1.1)],'#c09951')

def limb(d,chain,kind,side,h):
 a,b,c=chain['start'],chain['joint'],chain['end'];near=side=='near';hero=next(k for k,v in G.HEROES.items()if v is h)
 if kind=='Leg':
  radii=(2.5,1.95,1.15)if hero!='olaf'else(3.1,2.35,1.35);base=h['pants']if near else h['farPants'];light='#869089'if hero=='baleog'else'#777b7e';dark='#2b2d39'
 else:radii=(2.0,1.45,.9)if hero!='olaf'else(2.65,2.0,1.15);base='#b78356'if near else'#7a513c';light='#ddb07b';dark='#7a513c'
 for extra,color in[(.65,EDGE),(0,base)]:
  G.segment(d,a,b,radii[0]+extra,radii[1]+extra,color);G.segment(d,b,c,radii[1]+extra,radii[2]+extra,color);G.disc(d,b,radii[1]+extra,color)
 if near:
  G.segment(d,offset(a,-.8),offset(b,-.8),radii[0]*.48,radii[1]*.43,light)
  G.segment(d,offset(b,.6),offset(c,.6),radii[1]*.4,radii[2]*.45,dark)
 if kind=='Arm':
  sleeve=G.lerp(a,b,.16 if hero=='olaf'else .28);G.segment(d,a,sleeve,radii[0]+.2,radii[0],h['cloth']if near else h['clothDark'])
  G.disc(d,c,.9,base)
  if hero=='baleog':
   x,y=G.xy(a);r=4 if near else 3
   d.polygon([(x-r,y),(x-r+1,y-3),(x,y-4),(x+r,y-2),(x+r,y+2),(x+1,y+3),(x-r+1,y+2)],fill=EDGE)
   d.polygon([(x-r+1,y),(x-r+2,y-2),(x,y-3),(x+r-1,y-1),(x+r-1,y+1),(x,y+2),(x-r+2,y+1)],fill='#657880'if near else'#35434f')
   if near:d.polygon([(x-2,y-1),(x,y-2),(x+1,y-1),(x,y),(x-2,y+1)],fill='#afada0')
   volume(d,offset(a,0,-.5),4.4,3.4,['#a8afa1','#687b82','#3f4c59','#242d39']if near else['#6d7b7d','#485961','#303d4c','#232b36'])
   d.line([(x-3,y+2),(x,y+3),(x+3,y+2)],fill='#b19155'if near else'#67553d',width=1)

def beard(d,f,h):
 if f['view'].startswith('rear'):return
 pts=f.get('secondaryMotion',{}).get('beard',{}).get('points',[])
 if not pts:return
 widths=[4.1,3.1,1.9,.65]if f['hero']=='erik'else[4.3,3.5,2.5,.8]
 for extra,col in[(.6,EDGE),(0,h['hair'])]:
  for i in range(3):G.segment(d,pts[i],pts[i+1],widths[i]+extra,widths[i+1]+extra,col)
 for i in range(2):G.segment(d,offset(pts[i],-1.1),offset(pts[i+1],-1.),widths[i]*.45,widths[i+1]*.45,'#c75f2e'if f['hero']=='erik'else'#e2bd69')
 d.line([G.xy(offset(p,1))for p in pts],fill='#6d3d26'if f['hero']=='erik'else'#88622f',width=1)

def head(d,f,h):
 # Calculate the retained costume/motion rig without painting the old box cap.
 scratch=Image.new('RGBA',(64,64));N.ORIGINAL_HEAD(ImageDraw.Draw(scratch),f,h);pivot=f['head']['neckPivot'];a=math.radians(f['headAngleDegrees']);rear=f['view'].startswith('rear')
 def p(x,y):return G.p(pivot[0]+x*math.cos(a)-y*math.sin(a),pivot[1]+x*math.sin(a)+y*math.cos(a))
 # Curved unequal horns, rounded dome and thick oblique brow replace the profile cap.
 for sign in(-1,1):
  horn=[p(sign*4,-5),p(sign*6.3,-6.3),p(sign*6.8,-8.7),p(sign*5,-11.1)]
  for i in range(3):G.segment(d,horn[i],horn[i+1],[1.45,1.3,.85][i],[1.3,.85,.3][i],EDGE)
  for i in range(3):G.segment(d,horn[i],horn[i+1],[1.,.85,.55][i],[.85,.55,.1][i],'#dcc692'if sign==-1 else'#a48d62')
 volume(d,p(0,-4.3),6.5,4.0,['#aeb5a7','#6a777b','#3d4b57','#252e3a'])
 poly(d,[p(-5,-2),p(-1,-2.5),p(5,-1.8),p(6,-.5),p(2,0),p(-5,-.6)],'#31353c')
 d.line([G.xy(p(-4,-1.8)),G.xy(p(1,-1.5)),G.xy(p(4,-1))],fill='#929b94',width=1)
 if rear:return
 poly(d,[p(-3,-1),p(-1,-2),p(2,-2),p(4,-1),p(4,1),p(2,2),p(-2,1)],'#ac744e')
 poly(d,[p(-2,-1),p(0,-1),p(1,1),p(-1,1)],'#d1a26d')
 poly(d,[p(2,-1),p(4,-1),p(5,0),p(4,1),p(2,1)],'#deb480')
 if f['hero']=='olaf':
  poly(d,[p(-4,-3),p(4,-3),p(4,-1),p(1,-1),p(-4,-2)],'#647579');d.line([G.xy(p(-3,-2)),G.xy(p(4,-1))],fill=EDGE,width=1)
 else:d.line([G.xy(p(0,-1)),G.xy(p(2,-1))],fill='#211e23',width=1)
 # Broader three-quarter jaw rooted below the brow; translate the articulated
 # chain intact so Erik's9native trailing curve remains connected to his face.
 pts=f.get('secondaryMotion',{}).get('beard',{}).get('points',[])
 if pts:
  root=p(.5,1.8);delta=G.sub(root,pts[0]);f['secondaryMotion']['beard']['points']=[G.add(q,delta)for q in pts]
 beard(d,f,h)

def equipment(d,f,im):
 for eq in f['equipment']:
  if eq['type']=='shield':im.alpha_composite(N.shield_native(eq));continue
  if eq['type']!='bow':
   grip=eq['grip'];a=math.radians(eq['angle']);tip=G.add(grip,G.p(math.cos(a)*eq['length'],math.sin(a)*eq['length']));d.line([G.xy(grip),G.xy(tip)],fill=EDGE,width=3);d.line([G.xy(grip),G.xy(tip)],fill='#9babaa'if eq['type']=='sword'else'#725942',width=1)
   if eq['type']=='sword':
    guard=G.add(grip,G.p(math.cos(a)*2,math.sin(a)*2));perp=G.p(-math.sin(a)*2,math.cos(a)*2);d.line([G.xy(G.add(guard,perp)),G.xy(G.sub(guard,perp))],fill='#bd984f',width=2)
  else:
   p=eq['grip'];bow=[offset(p,-1,-9),offset(p,3,-6),offset(p,5),offset(p,3,6),offset(p,-1,9)];d.line([G.xy(q)for q in bow],fill=EDGE,width=3);d.line([G.xy(q)for q in bow],fill='#b38246',width=1);d.line([G.xy(bow[0]),G.xy(eq['drawHand']),G.xy(bow[-1])],fill='#c3b98b',width=1)
   if not eq['release']:d.line([G.xy(eq['drawHand']),G.xy(offset(p,11))],fill='#a5b5b4',width=1)

def render(f):
 im=N.ORIGINAL_RENDER(f);beard(ImageDraw.Draw(im),f,G.HEROES[f['hero']]);N.boots(im,f)
 # Foreground disc must occlude hands/legs, while rear ladder straps stay under arms.
 for eq in f['equipment']:
  if eq['type']=='shield'and eq['attachment']!='back-straps':im.alpha_composite(N.shield_native(eq))
 return im

def main():
 OUT.mkdir(parents=True,exist_ok=True);G.xy=N.native_xy;G.poly=poly;G.torso=torso;G.limb=limb;G.head=head;G.shield_image=N.shield_native;G.equipment_olaf=N.registered_equipment;G.equipment=equipment
 boards=[]
 for hero in('erik','baleog','olaf'):
  G.HEROES[hero].update(PALETTES[hero]);frames=[];images=[]
  for action,count in G.actions_for(hero):
   for phase in range(count):
    f=pose(hero,action,phase);im=render(f);f['cell']=len(frames);f['opaqueBoundsNative']=list(im.getbbox());assert set(im.getchannel('A').get_flattened_data())<={0,255};frames.append(f);images.append(im)
  atlas=G.sheet(frames,images);atlas.save(OUT/(hero+'-native.png'));atlas.resize((atlas.width*4,atlas.height*4),Image.Resampling.NEAREST).save(OUT/(hero+'-full-4x.png'));G.label_sheet(hero,frames,images).save(OUT/(hero+'-full-frame-key.png'))
  (OUT/(hero+'-frames.json')).write_text(json.dumps(dict(source='direct native3/4 authored geometry/materials',cell=[64,64],origin=[32,40],nativePixelWorldSize=2,geometryProjection=N.PROJECTION,frames=frames),indent=2)+'\n')
  G.OUT=OUT
  for action in('walk','idle','climb','overhead-walk','shield-raise','float','sword','bash'):G.animation(hero,frames,images,action)
  boards.append((hero,frames,images));print(hero,len(frames),'native3/4frames')
  if hero=='olaf':
   images[8].save(OUT/'olaf-idle-guide-native.png')
   images[8].resize((512,512),Image.Resampling.NEAREST).save(OUT/'olaf-idle-guide-8x.png')
   bare=copy.deepcopy(frames[8]);bare['equipment']=[];bareim=render(bare)
   bareim.save(OUT/'olaf-idle-anatomy-unoccluded-native.png');bareim.resize((512,512),Image.Resampling.NEAREST).save(OUT/'olaf-idle-anatomy-unoccluded-8x.png')
 board=Image.new('RGBA',(64*8,64*3))
 for row,(hero,frames,images)in enumerate(boards):
  for col,i in enumerate([8,0,2,4,6,12,13,14]):board.alpha_composite(images[i],(col*64,row*64))
 board.save(OUT/'contactboard-native.png');board.resize((2048,768),Image.Resampling.NEAREST).save(OUT/'contactboard-4x.png')
 # Anatomy evidence uses the same projected geometry as the actual raster;
 # it is a guide-only review, not approval of final material art.
 jointboard=board.copy();d=ImageDraw.Draw(jointboard)
 for row,(hero,frames,images)in enumerate(boards):
  for col,i in enumerate([8,0,2,4,6,12,13,14]):
   f=frames[i]
   for name,chain in f['limbs'].items():
    points=[(G.xy(chain[k])[0]+col*64,G.xy(chain[k])[1]+row*64)for k in('start','joint','end')]
    color='#ffca50'if name.startswith('near')else'#58badc';d.line(points,fill=color,width=1)
    for x,y in points:d.rectangle((x-1,y-1,x+1,y+1),fill=color)
 jointboard.save(OUT/'anatomy-contactboard-native.png');jointboard.resize((2048,768),Image.Resampling.NEAREST).save(OUT/'anatomy-contactboard-4x.png')

if __name__=='__main__':main()
