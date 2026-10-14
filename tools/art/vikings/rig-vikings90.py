"""Prototype whole-actor material rig, rasterized on the accepted native skeleton.

Imagegen provides retained material surfaces. All limbs, torso, neck/head and
beard are rebound every frame; no stationary body strip or independently pasted
gait. Exposed surfaces use the same material palette and native joint volumes.
This prototype is evidence only until both visual gates approve it.
"""
from pathlib import Path
import importlib.util, json, math, copy
from PIL import Image, ImageDraw
import numpy as np

ROOT=next(p for p in Path(__file__).resolve().parents if (p/'package.json').is_file())
OUT=ROOT/'assets/vikings90'
spec=importlib.util.spec_from_file_location('guide90',Path(__file__).with_name('guide-vikings90.py'))
M=importlib.util.module_from_spec(spec);spec.loader.exec_module(M)
V=M.V;G=M.G;N=V.N

def configure():
 G.xy=N.native_xy;G.poly=V.poly;G.torso=V.torso;G.limb=V.limb;G.head=V.head;G.shield_image=N.shield_native;G.equipment_olaf=N.registered_equipment;G.equipment=V.equipment
 for hero in G.HEROES:G.HEROES[hero].update(V.PALETTES[hero])

def draw_part(f,part):
 im=Image.new('RGBA',(64,64));d=ImageDraw.Draw(im);h=G.HEROES[f['hero']]
 if part=='torso':V.torso(d,f,h)
 elif part=='head':V.head(d,f,h)
 elif part=='beard':V.beard(d,f,h)
 elif part.endswith(('Arm','Leg')):V.limb(d,f['limbs'][part],part[-3:],part[:-3],h)
 elif part.endswith('Foot'):
  side=part[:-4];ff=copy.deepcopy(f);ff['feet']={side:f['feet'][side]};ff['limbs']={side+'Leg':f['limbs'][side+'Leg']}
  # Render each shaft/cuff and articulated foot without an opposing foot.
  original=f['limbs'][side+'Leg'];calf=G.lerp(original['joint'],original['end'],.57)
  G.segment(d,calf,original['end'],1.65,1.35,V.EDGE)
  G.segment(d,calf,original['end'],1.,.8,'#976a3e')
  points=[G.xy(p)for p in f['feet'][side]['polygon']];d.polygon(points,fill=V.EDGE)
  cx=sum(p[0]for p in points)/len(points);cy=sum(p[1]for p in points)/len(points)
  d.polygon([(round(cx+(x-cx)*.72),round(cy+(y-cy)*.7))for x,y in points],fill='#966c42')
 return im

def xy(p):return np.array(N.project(p)[:2],dtype=float)
def chain_uv(point,points):
 # Coordinates follow the authored bone rather than an independent bounding box.
 choices=[]
 for i,(a,b)in enumerate(zip(points,points[1:])):
  a=xy(a);b=xy(b);v=b-a;length=np.linalg.norm(v);t=float(np.dot(point-a,v)/max(length*length,.01));q=a+max(0,min(1,t))*v
  offset=point-a;choices.append((np.linalg.norm(point-q),i,t,float((v[0]*offset[1]-v[1]*offset[0])/max(length,.01))))
 _,i,t,n=min(choices);return i,t,n
def chain_point(uv,points):
 i,t,n=uv;a=xy(points[i]);b=xy(points[i+1]);v=b-a;length=np.linalg.norm(v)
 return a+t*v+np.array([-v[1],v[0]])*n/max(length,.01)

def bind_point(point,f,reference,part):
 if part.endswith(('Arm','Leg')):
  target=f['limbs'][part];source=reference['limbs'][part]
  return chain_point(chain_uv(point,[target[k]for k in ('start','joint','end')]),[source[k]for k in ('start','joint','end')])
 if part.endswith('Foot'):
  side=part[:-4];target=f['feet'][side];source=reference['feet'][side]
  # Foot roll is measured from its own top edge, not a changing alpha box.
  def angle(ft):
   p=ft['polygon'];return math.atan2(p[1][1]-p[0][1],p[1][0]-p[0][0])
  a=angle(source)-angle(target);v=point-xy(target['ankle']);co,si=math.cos(a),math.sin(a)
  return xy(source['ankle'])+np.array([co*v[0]-si*v[1],si*v[0]+co*v[1]])
 if part=='beard':
  tp=f['secondaryMotion']['beard']['points'];sp=reference['secondaryMotion']['beard']['points']
  return chain_point(chain_uv(point,tp),sp)
 if part=='head':
  a=math.radians(reference['headAngleDegrees']-f['headAngleDegrees']);v=point-xy(f['head']['neckPivot']);co,si=math.cos(a),math.sin(a)
  return xy(reference['head']['neckPivot'])+np.array([co*v[0]-si*v[1],si*v[0]+co*v[1]])
 def torso_coords(frame,p):
  shoulders=sum(xy(q)for q in frame['shoulders'].values())/2;pelvis=xy(frame['pelvis']);v=(p[1]-shoulders[1])/max(1,pelvis[1]-shoulders[1]);center=shoulders*(1-v)+pelvis*v
  return p[0]-center[0],v,shoulders,pelvis
 u,v,_,_=torso_coords(f,point);_,_,s,p=torso_coords(reference,point)
 return s*(1-v)+p*v+np.array([u,0])

def source_native():
 # V4 was explicitly authored as36 native blocks in a64 cell. This is one
 # normalization of that retained original; no grid detection or repaint rescue.
 raw=Image.open(OUT/'erik-walk-4-raw-v4.png').convert('RGBA')
 return raw.resize((64,64),Image.Resampling.NEAREST)

def color_family(rgb):
 r,g,b=map(int,rgb)
 if max(rgb)-min(rgb)<17 and max(rgb)<58:return 'edge'
 if b>=r*.96 and b>=g*.96:return 'steel'
 if r>g*1.45 and r>b*1.9:return 'hair'
 if r>g*1.15 and g>b*1.1:return 'warm'
 return 'other'

class MaterialRig:
 def __init__(self,hero):
  self.hero=hero;self.reference=M.pose(hero,'walk',4)
  # Rendering establishes the articulated head/beard pivots used by the rig.
  V.render(self.reference)
  self.source=source_native();self.src=np.array(self.source)
  self.materials={}
  for family in ('edge','steel','hair','warm','other'):
   colors=[tuple(map(int,p[:3]))for row in self.src for p in row if p[3]>128 and color_family(p[:3])==family]
   self.materials[family]=sorted(set(colors),key=lambda c:sum(c))
  # Material regions are named surfaces. Red chin hair is never sampled as a
  # back jacket simply because both happen to contain warm RGB values.
  regions={'leather':(28,38,34,46),'bone':(28,26,33,31),'skin':(28,42,31,46),'pants':(33,50,39,56),'boots':(35,57,40,62)}
  for family,(x0,y0,x1,y1)in regions.items():
   colors=[tuple(map(int,p[:3]))for row in self.src[y0:y1,x0:x1]for p in row if p[3]>128 and color_family(p[:3])!='edge']
   if family=='leather':colors=[c for c in colors if c[0]<130 or c[0]<c[1]*1.65]
   if family=='pants':colors=[c for c in colors if color_family(c)=='steel']
   self.materials[family]=sorted(set(colors),key=lambda c:sum(c))
 def paint(self,f,part):
  target=draw_part(f,part);pixels=np.array(target)
  # Rear surfaces intentionally use authored helmet/back cloth, not chin art.
  rear=f['view'].startswith('rear')
  for y,x in np.argwhere(pixels[:,:,3]>128):
   original=pixels[y,x,:3];family=color_family(original)
   if family!='edge':
    if part=='beard':family='hair'
    elif part.endswith('Leg'):family='pants'
    elif part.endswith('Foot'):family='boots'
    elif part=='torso':family='leather'
    elif part.endswith('Arm'):family='leather'if tuple(original)in (tuple(N.color_tuple(G.HEROES[self.hero]['cloth'])),tuple(N.color_tuple(G.HEROES[self.hero]['clothDark'])))else'skin'
    elif part=='head'and family!='steel':family='bone'if original[1]>120 else'skin'
   expected=self.materials.get(family)or self.materials['warm']
   q=bind_point(np.array([x+.5,y+.5]),f,self.reference,part);sx,sy=np.floor(q).astype(int)
   sample=self.src[sy,sx]if 0<=sx<64 and 0<=sy<64 else np.zeros(4)
   # Newly exposed/back surfaces are fully filled from the identical palette;
   # they never borrow an unrelated arm, beard, transparent fringe or background.
   if not rear and sample[3]>128 and (color_family(sample[:3])==family or tuple(map(int,sample[:3]))in expected):color=sample[:3]
   else:
    l=float(np.dot(original,[.3,.6,.1]));index=min(len(expected)-1,max(0,round(l/240*(len(expected)-1))));color=expected[index]
   pixels[y,x,:3]=color;pixels[y,x,3]=255
  return Image.fromarray(pixels)
 def render(self,f):
  V.render(f);out=Image.new('RGBA',(64,64))
  for part in ('farLeg','farFoot','nearLeg','nearFoot','farArm','torso','head','nearArm'):
   out.alpha_composite(self.paint(f,part))
  if f['view'].startswith('rear'):out.alpha_composite(self.paint(f,'farArm'))
  else:out.alpha_composite(self.paint(f,'beard'))
  f['materialBinding']={'source':'erik-walk-4-raw-v4.png','allBodyPartsRebound':True,'headRoot':list(xy(f['head']['neckPivot'])),'pelvisRoot':list(xy(f['pelvis']))}
  return out

def main():
 configure();rig=MaterialRig('erik');frames=[];images=[]
 for action,count in [('walk',8),('climb',4)]:
  for phase in range(count):
   f=M.pose('erik',action,phase);im=rig.render(f);frames.append(f);images.append(im)
 atlas=G.sheet(frames,images);atlas.save(OUT/'erik-material-rig-native.png');atlas.resize((atlas.width*4,atlas.height*4),Image.Resampling.NEAREST).save(OUT/'erik-material-rig-4x.png')
 rig.source.save(OUT/'erik-v4-source-native.png')
 G.OUT=OUT
 for action in ('walk','climb'):G.animation('erik-material-rig',frames,images,action)
 (OUT/'erik-material-rig.json').write_text(json.dumps({'source':'whole-actor anatomical UV/material rig','frames':frames},indent=2)+'\n')
 print('Whole actor prototype: eight strides, four rear reaches; no publication approval.')
if __name__=='__main__':main()
