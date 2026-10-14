"""Source-contour articulated surfaces; single hero/rest reconstruction pilot.

Each named source material has a retained native mask and explicit rest bones.
The target is rasterized by inverse skinning on the native grid. Torso, neck,
head, feet and beard move with the limbs; there is no frozen torso strip.
"""
from pathlib import Path
import importlib.util,json,math,copy
from PIL import Image,ImageDraw
import numpy as np

ROOT=next(p for p in Path(__file__).resolve().parents if (p/'package.json').is_file());OUT=ROOT/'assets/vikings90'
spec=importlib.util.spec_from_file_location('material90',Path(__file__).with_name('rig-vikings90.py'));R=importlib.util.module_from_spec(spec);spec.loader.exec_module(R)
M=R.M;V=R.V;G=R.G;N=R.N

SURFACES={
 'head':[(28,26),(34,26),(34,29),(40,29),(40,27),(42,27),(44,31),(43,36),(41,37),(34,38),(29,35)],
 'beard':[(33,37),(36,36),(39,37),(42,39),(41,44),(39,47),(35,45),(34,41)],
 'torso':[(29,38),(33,37),(39,39),(39,48),(38,51),(29,51),(28,44)],
 'nearArm':[(28,38),(31,38),(32,41),(30,44),(31,46),(30,48),(27,47),(27,43),(27,40)],
 'farArm':[(40,38),(42,39),(43,41),(42,43),(41,47),(39,47),(39,43)],
 'nearLeg':[(32,50),(35,50),(37,53),(36,55),(32,56),(29,55),(29,53),(33,53)],
 'farLeg':[(36,50),(39,51),(41,53),(41,58),(39,60),(37,60),(35,57),(36,54)],
 'nearFoot':[(28,53),(31,53),(33,54),(33,56),(30,56),(28,55),(27,55),(27,54)],
 'farFoot':[(36,58),(39,58),(39,60),(41,61),(41,63),(36,63),(36,61)],
}
REST={'nearArm':[[29,39],[29,43],[29,46]],'farArm':[[41,40],[41,43],[40,46]],
 'nearLeg':[[34,50],[35,54],[30,54]],'farLeg':[[37,50],[39,54],[38,60]],
 'nearFoot':[[30,54],[32,54]],'farFoot':[[38,60],[40,60]],
 'beard':[[36,38],[38,40],[38,43],[38,46]],'head':[36,37],
 'torso':{'shoulder':[34,39],'pelvis':[34,50]}}
MATERIAL={'head':'helmet/face/horns','beard':'red chin hair','torso':'brown leather','nearArm':'skin/leather sleeve','farArm':'skin/leather sleeve','nearLeg':'slate trousers','farLeg':'slate trousers','nearFoot':'brown boot','farFoot':'brown boot'}

def chain_uv(point,points):
 choices=[]
 for i,(a,b)in enumerate(zip(points,points[1:])):
  a,b=np.array(a),np.array(b);v=b-a;ll=max(.01,np.dot(v,v));t=np.dot(point-a,v)/ll;n=(v[0]*(point-a)[1]-v[1]*(point-a)[0])/math.sqrt(ll)
  choices.append((np.linalg.norm(point-(a+max(0,min(1,t))*v)),i,t,n))
 _,i,t,n=min(choices);return i,t,n
def point_uv(uv,points):
 i,t,n=uv;a,b=np.array(points[i]),np.array(points[i+1]);v=b-a;ll=max(.01,np.linalg.norm(v))
 return a+t*v+np.array([-v[1],v[0]])*n/ll

def targets(f):
 result={}
 for name,c in f['limbs'].items():result[name]=[list(R.xy(c[k]))for k in ('start','joint','end')]
 for side in ('near','far'):
  ft=f['feet'][side];a=R.xy(ft['ankle']);p=ft['polygon'];v=R.xy(p[1])-R.xy(p[0]);v=v/max(.01,np.linalg.norm(v))*2
  result[side+'Foot']=[list(a),list(a+v)]
 result['head']=list(R.xy(f['head']['neckPivot']))
 result['beard']=[list(R.xy(q))for q in f['secondaryMotion']['beard']['points']]
 result['torso']={'shoulder':list(sum(R.xy(q)for q in f['shoulders'].values())/2),'pelvis':list(R.xy(f['pelvis']))}
 return result

class SurfaceRig:
 def __init__(self):
  self.source=R.source_native();self.src=np.array(self.source);self.surfaces={}
  self.palette=R.MaterialRig('erik').materials
  for part,polygon in SURFACES.items():
   mask=Image.new('L',(64,64));ImageDraw.Draw(mask).polygon(polygon,fill=255)
   # Head/boots retain their original contour. The underlying leather and joint
   # surfaces include explicit hidden regions, painted with their OWN materials.
   if part in ('head','nearFoot','farFoot'):mask=np.minimum(np.array(mask),self.src[:,:,3]);mask=Image.fromarray(mask)
   img=Image.new('RGBA',(64,64));a=np.array(img);m=np.array(mask)>128
   for y,x in np.argwhere(m):
    color=self.src[y,x].copy();family=R.color_family(color[:3]);valid=color[3]>128
    if part=='torso'and family in ('hair','steel'):valid=False
    if part.endswith('Leg')and family not in ('steel','edge'):valid=False
    if part.endswith('Arm')and family=='steel':valid=False
    if not valid:
     key='pants'if part.endswith('Leg')else'leather';pal=self.palette[key];u=(x-min(p[0]for p in polygon))/max(1,max(p[0]for p in polygon)-min(p[0]for p in polygon));idx=round((.8-u*.6)*(len(pal)-1));color=np.array([*pal[idx],255])
    color[3]=255;a[y,x]=color
   self.surfaces[part]=a
  # Contours/material boundaries are persisted as raw authored binding input.
  (OUT/'erik-surface-binding.json').write_text(json.dumps({'source':'erik-walk-4-raw-v4.png','nativeCell':[64,64],'sourceNativeHeight':36,'rest':REST,'surfaces':SURFACES,'materialOwnership':MATERIAL,'hiddenSurfaces':'leather beneath beard/arms; full slate hip/knee joint caps; rear helmet/back jacket use named materials, never chin hair'},indent=2)+'\n')
  for part,a in self.surfaces.items():Image.fromarray(a).save(OUT/f'erik-surface-{part}.png')
 def sample(self,part,q,rear=False):
  x,y=np.floor(q).astype(int)
  if not (0<=x<64 and 0<=y<64):return None
  c=self.surfaces[part][y,x].copy()
  if c[3]<128:return None
  if rear:
   if part=='head':
    # Explicit rear dome/neck surfaces share steel/horn materials, no face/beard.
    if y>=36:c=np.array([180,116,69,255])
    elif R.color_family(c[:3])not in ('steel','edge')and y>=30:c=np.array([75,88,99,255])
   elif part=='torso':
    pal=self.palette['leather'];u=(x-28)/12;idx=max(0,min(len(pal)-1,round((.78-u*.55)*(len(pal)-1))));c=np.array([*pal[idx],255])
  return tuple(map(int,c))
 def render(self,f,rest=False):
  V.render(f);t=REST if rest else targets(f);rear=f['view'].startswith('rear')and not rest
  parts=['farLeg','farFoot','nearLeg','nearFoot','farArm','torso','head','nearArm']
  if rear:parts.append('farArm')
  else:parts.append('beard')
  out=Image.new('RGBA',(64,64));pixels=out.load()
  for part in parts:
   for y in range(64):
    for x in range(64):
     p=np.array([x+.5,y+.5])
     if part=='head':
      a=0 if rest else math.radians(f['headAngleDegrees']-self.rest_angle);v=p-np.array(t[part]);co,si=math.cos(a),math.sin(a);q=np.array(REST[part])+[co*v[0]+si*v[1],-si*v[0]+co*v[1]]
     elif part=='torso':
      top=np.array(t[part]['shoulder']);bottom=np.array(t[part]['pelvis']);v=(p[1]-top[1])/max(1,bottom[1]-top[1]);u=p[0]-(top*(1-v)+bottom*v)[0];q=np.array(REST[part]['shoulder'])*(1-v)+np.array(REST[part]['pelvis'])*v+[u,0]
     else:q=point_uv(chain_uv(p,t[part]),REST[part])
     c=self.sample(part,q,rear)
     if c:pixels[x,y]=c
  return out
 def setup(self):
  f=M.pose('erik','walk',4);V.render(f);self.rest_angle=f['headAngleDegrees']

def main():
 R.configure();rig=SurfaceRig();rig.setup();frames=[];images=[]
 f=M.pose('erik','walk',4);rest=rig.render(f,True);rest.save(OUT/'erik-surface-rest-native.png')
 board=Image.new('RGBA',(128,64),'#243648');board.alpha_composite(rig.source,(0,0));board.alpha_composite(rest,(64,0));board.resize((768,384),Image.Resampling.NEAREST).save(OUT/'erik-surface-rest-comparison.png')
 for action,count in [('walk',8),('climb',4)]:
  for phase in range(count):
   f=M.pose('erik',action,phase);images.append(rig.render(f));frames.append(f)
 atlas=G.sheet(frames,images);atlas.save(OUT/'erik-surface-rig-native.png');atlas.resize((atlas.width*4,atlas.height*4),Image.Resampling.NEAREST).save(OUT/'erik-surface-rig-4x.png');G.OUT=OUT
 for action in ('walk','climb'):G.animation('erik-surface-rig',frames,images,action)
 print('Source-contour rest comparison and12 animated poses retained for review.')
if __name__=='__main__':main()
