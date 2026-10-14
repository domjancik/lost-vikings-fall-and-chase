"""Native material authorship from reviewed81 anatomy; no imagegen pixel inputs.

Imagegen85 studies inform material direction only. Every output pixel is drawn
directly on its intended64x64 cell. This is neither a downsampled image nor a
fixed-body/independent-leg splice. The entire character is rendered per pose.
"""
from pathlib import Path
import importlib.util, copy, json, math
from PIL import Image, ImageDraw, ImageChops

ROOT=next(p for p in Path(__file__).resolve().parents if (p/'package.json').is_file())
OUT=ROOT/'assets'/'vikings85-native'
module_spec=importlib.util.spec_from_file_location('guide81',Path(__file__).with_name('guide-vikings81.py'))
M=importlib.util.module_from_spec(module_spec);module_spec.loader.exec_module(M)
G=M.configure()
EDGE='#17212c'
HERO_COLORS={
 'erik':dict(cloth='#a64d32',clothDark='#62302b',hair='#b86c32',pants='#687f8d',farPants='#344756'),
 'baleog':dict(cloth='#3c6b7a',clothDark='#264553',hair='#c69a46',pants='#748896',farPants='#3b5062'),
 'olaf':dict(cloth='#747543',clothDark='#454b32',hair='#c39545',pants='#826645',farPants='#493d30')}
ALIASES={'#172630':EDGE,'#97adae':'#687e8b','#cbd4c3':'#b7c8c3',
 '#d5d9bf':'#c8d5ca','#91a5a5':'#91a9ae','#e3ad7d':'#d8a16b',
 '#c89e72':'#d1a06a','#dfb281':'#dcad75','#997757':'#93664d',
 '#956f58':'#95684c','#b57b55':'#ad7954'}
G.EDGE=EDGE
ORIGINAL_XY=G.xy
ORIGINAL_LIMB=G.limb
ORIGINAL_RENDER=G.render
ORIGINAL_HEAD=G.head
ORIGINAL_SHIELD=G.shield_image
ORIGINAL_TORSO=G.torso
ORIGINAL_EQUIPMENT=G.equipment_olaf
PROJECTION=.925

def project(point):
 return G.p(32+(point[0]-32)*PROJECTION,62+(point[1]-62)*PROJECTION,point[2]if len(point)>2 else 0)

def native_xy(point):
 # Author vertices on the new native grid. Never resize a rendered bitmap.
 q=project(point);return round(q[0]),round(q[1])

def registered_equipment(f,h):
 ORIGINAL_EQUIPMENT(f,h)
 eq=next(e for e in f['equipment']if e['type']=='shield')
 t=eq.get('raiseFraction',0.)
 # Riders stand at the disc's middle plane, not its top edge: world -36
 # is native y22. The flattened 6px shield is centered exactly on that plane.
 correction=(22-(62+(22-62)*PROJECTION))*t/PROJECTION
 eq['center']=G.add(eq['center'],G.p(0,correction))
 for side in ('near','far'):
  f['shoulders'][side]=G.add(f['shoulders'][side],G.p(0,correction*.82))
 for side,grip in eq.get('grips',{}).items():
  grip=G.add(grip,G.p(0,correction));eq['grips'][side]=grip
  f['limbs'][side+'Arm']=G.ik(f['shoulders'][side],grip,h['upper'],h['fore'],G.p(1,1))

def shield_native(eq):
 projected=copy.deepcopy(eq);projected['center']=project(eq['center'])
 # Equipment diameter is physical: preserve the same24-native round shield.
 out=Image.new('RGBA',(64,64));pixels=out.load()
 cx,cy,_=projected['center'];w,h=eq['projectionSize']
 a=math.radians(eq.get('rollDegrees',0));co,si=math.cos(a),math.sin(a)
 for y in range(64):
  for x in range(64):
   dx=x+.5-cx;dy=y+.5-cy;u=(dx*co+dy*si)/(w/2);v=(-dx*si+dy*co)/(h/2);q=u*u+v*v
   if q>1:continue
   if q>.90:c=EDGE
   elif q>.71:c='#e1ca84'if u+v<-.35 else'#b28b49'if u+v<.7 else'#65482f'
   else:
    plank=int((u+1)*2.5);c=['#a6753b','#bd9252','#ae8043','#906337','#a8793c'][min(4,plank)]
    if abs((u+1)*2.5-round((u+1)*2.5))<.055:c='#684a32'
    if v>.45:c='#785332'
   if q<.10:c='#283e4a'if u+v>.15 else'#758f99'
   if (u+.12)**2+(v+.10)**2<.029:c='#ced5be'
   if .76<q<.84 and abs(u)<.09:c='#f0dca0'if v<0 else'#513b2c'
   pixels[x,y]=color_tuple(c)+(255,)
 return out

def color_tuple(color):
 return tuple(int(color.lstrip('#')[n:n+2],16)for n in(0,2,4))

def planes(color):
 c=color_tuple(color)
 return tuple(round(v*.70)for v in c),tuple(min(255,round(v*.82+a))for v,a in zip(c,(51,46,32)))

def material_poly(d,points,fill):
 fill=ALIASES.get(fill,fill);vertices=[G.xy(p)for p in points]
 d.polygon(vertices,fill=fill)
 if fill==EDGE or len(vertices)<3:return
 xs,ys=zip(*vertices);left,right,top,bottom=min(xs),max(xs),min(ys),max(ys)
 if right-left<3 or bottom-top<3:return
 shadow,light=planes(fill)
 mask=Image.new('L',(64,64));ImageDraw.Draw(mask).polygon(vertices,fill=255)
 layer=Image.new('RGBA',(64,64));paint=ImageDraw.Draw(layer)
 # A few deliberate contiguous native clusters describe volume; no gradients.
 paint.polygon([(left,top),(left+max(2,(right-left)//2),top),(left+max(2,(right-left)//2),top+max(2,(bottom-top)//3)),(left+1,top+max(2,(bottom-top)*2//3))],fill=light+(255,))
 paint.polygon([(right-1,top+1),(right,bottom),(left+2,bottom),(right-2,bottom-2)],fill=shadow+(255,))
 layer.putalpha(ImageChops.multiply(layer.getchannel('A'),mask));d._image.alpha_composite(layer)

def material_torso(d,f,h):
 if f['hero']!='baleog':return ORIGINAL_TORSO(d,f,h)
 cx=f['chest'][0];sy=sum(p[1]for p in f['shoulders'].values())/2;px,py,_=f['pelvis']
 def p(x,y):return G.p(x,y)
 material_poly(d,[p(cx-3,sy-1),p(cx-6,sy),p(cx-6.5,sy+3),p(px-4.5,py+2),p(px+4.8,py+2),p(cx+6,sy+3),p(cx+5,sy),p(cx+2,sy-1)],EDGE)
 material_poly(d,[p(cx-4.8,sy+1),p(cx-2,sy),p(cx+3,sy+.5),p(cx+4.7,sy+3),p(px+3.5,py),p(px-3.5,py),p(cx-5,sy+3)],'#67828d')
 material_poly(d,[p(cx-3.5,sy+1),p(cx+.5,sy+1),p(cx+1.8,sy+4),p(cx-2,sy+6),p(cx-4.5,sy+4)],'#a4b8b4')
 material_poly(d,[p(cx+2,sy+2),p(cx+4.6,sy+3),p(px+3.4,py),p(px+.5,py),p(cx+.5,sy+6)],'#354e60')
 material_poly(d,[p(px-4,py-2),p(px+4,py-2),p(px+3.5,py+.8),p(px-3.5,py+.8)],'#665034')
 d.rectangle((*G.xy(p(px+.3,py-1.5)),*G.xy(p(px+2.3,py+.2))),fill='#d3b56d')

def material_limb(d,chain,kind,side,h):
 ORIGINAL_LIMB(d,chain,kind,side,h)
 if kind=='Arm' and h is G.HEROES['baleog']:
  x,y=G.xy(chain['start']);front=side=='near'
  # A joint-mounted pauldron follows each shoulder, rather than a frozen row.
  d.polygon([(x-4,y),(x-3,y-3),(x,y-4),(x+3,y-2),(x+4,y+1),(x+2,y+3),(x-2,y+3)],fill=EDGE)
  d.polygon([(x-3,y),(x-2,y-2),(x,y-3),(x+2,y-1),(x+3,y+1),(x+1,y+2),(x-2,y+2)],fill='#718794'if front else'#3c5262')
  if front:
   d.polygon([(x-2,y-1),(x,y-2),(x+1,y-1),(x,y+1),(x-2,y+1)],fill='#bdc9b8')
   d.line([(x-2,y+2),(x+1,y+2),(x+2,y+1)],fill='#34495a',width=1)

def material_head(d,f,h):
 ORIGINAL_HEAD(d,f,h)
 pivot=f['head']['neckPivot'];angle=math.radians(f['headAngleDegrees'])
 def pt(x,y):return G.p(pivot[0]+x*math.cos(angle)-y*math.sin(angle),pivot[1]+x*math.sin(angle)+y*math.cos(angle))
 if f['view'].startswith('rear'):
  # The original anatomical guide used hair-colored rear head mass. In the
  # material sprite it must be a rear steel helmet, never an exposed jaw beard.
  material_poly(d,[pt(-4,-6),pt(-2,-8),pt(2,-8),pt(4,-6),pt(4,-1),pt(2,1),pt(-2,1),pt(-4,-1)],EDGE)
  material_poly(d,[pt(-3,-6),pt(-2,-7),pt(1,-7),pt(3,-5),pt(3,-1),pt(1,0),pt(-2,0),pt(-3,-2)],'#647d89')
  material_poly(d,[pt(-2,-6),pt(0,-7),pt(1,-5),pt(0,-2),pt(-2,-1)],'#b2c4bd')
  d.line([G.xy(pt(-3,-1)),G.xy(pt(3,-1))],fill='#354b58',width=1)
  return
 # Authored dome planes enlarge the readable helmet width, not the body height.
 material_poly(d,[pt(-4,-5),pt(-4,-6),pt(-2,-8),pt(1,-8),pt(3,-7),pt(4,-5),pt(4,-3),pt(-4,-3)],EDGE)
 material_poly(d,[pt(-3,-5),pt(-2,-7),pt(1,-7),pt(3,-5),pt(3,-4),pt(-3,-4)],'#6c8390')
 material_poly(d,[pt(-3,-5),pt(-2,-7),pt(0,-7),pt(1,-5),pt(0,-4),pt(-3,-4)],'#b8c9c1')
 d.line([G.xy(pt(2,-5)),G.xy(pt(3,-4))],fill='#344b5b',width=1)
 d.line([G.xy(pt(-4,-3)),G.xy(pt(4,-3))],fill=EDGE,width=1)
 if f['hero']=='olaf':
  d.line([G.xy(pt(-3,-4)),G.xy(pt(3,-4))],fill='#94abb1',width=1)
 else:d.point(G.xy(pt(3,-2)),fill=EDGE)
 material_poly(d,[pt(2,-2),pt(4,-2),pt(5,-1),pt(3,0),pt(2,0)],'#d8a16b')
 paint_beard(d,f,h)

def paint_beard(d,f,h):
 if f['view'].startswith('rear'):return
 points=f.get('secondaryMotion',{}).get('beard',{}).get('points',[])
 if points:
  radii=[2.3,2.0,1.3,.45]if f['hero']=='erik'else[2.5,2.2,1.4,.5]
  for n in range(3):G.segment(d,points[n],points[n+1],radii[n]+.7,radii[n+1]+.7,EDGE)
  for n in range(3):G.segment(d,points[n],points[n+1],radii[n],radii[n+1],h['hair'])
  # One connected strand highlight follows the beard's authored bend, not noise.
  light='#e3b365'if f['hero']=='erik'else'#ecd08a'
  q=[G.xy(G.add(p,G.p(-.6,-.5)))for p in points[:3]]
  d.line(q,fill=light,width=1)

def boots(im,f):
 d=ImageDraw.Draw(im)
 for side in('far','near'):
  chain=f['limbs'][side+'Leg'];calf=G.lerp(chain['joint'],chain['end'],.57)
  # Thick leather cuff and boot shaft follow the actual calf, including folds.
  near=side=='near';base='#976a3e'if near else'#564335'
  G.segment(d,calf,chain['end'],1.65,1.35,EDGE)
  G.segment(d,calf,chain['end'],1.0,.8,base)
  a=G.xy(calf);b=G.xy(chain['end'])
  d.line([(a[0]-1,a[1]),(b[0]-1,b[1]-1)],fill='#c39359'if near else'#7a6249',width=1)
  points=[G.xy(p)for p in f['feet'][side]['polygon']]
  cx=sum(x for x,y in points)/len(points);cy=sum(y for x,y in points)/len(points)
  d.polygon(points,fill=EDGE)
  inner=[(round(cx+(x-cx)*.72),round(cy+(y-cy)*.70))for x,y in points]
  d.polygon(inner,fill='#966c42'if side=='near'else'#574936')
  # Sole is part of the articulated foot polygon, never a fixed floor line.
  edge=sorted(points,key=lambda p:p[1],reverse=True)[:2]
  d.line(edge,fill='#49382c',width=1)
  x,y=G.xy(f['feet'][side]['ankle'])
  d.point((x,y),fill='#c39456'if side=='near'else'#806844')

def main():
 OUT.mkdir(parents=True,exist_ok=True)
 G.xy=native_xy;G.poly=material_poly;G.limb=material_limb;G.head=material_head;G.shield_image=shield_native;G.torso=material_torso;G.equipment_olaf=registered_equipment
 for hero in('erik','baleog','olaf'):
  G.HEROES[hero].update(HERO_COLORS[hero]);images=[];frames=[]
  for phase in range(8):
   f=G.base_pose(hero,'walk',phase);im=ORIGINAL_RENDER(f)
   # The hanging beard is physically outside the breastplate/near pauldron.
   # Paint its current articulated chain over the armor, never paste a body row.
   paint_beard(ImageDraw.Draw(im),f,G.HEROES[hero])
   boots(im,f);f['cell']=phase;f['opaqueBoundsNative']=list(im.getbbox())
   assert set(im.getchannel('A').get_flattened_data())<={0,255}
   frames.append(f);images.append(im)
  atlas=G.sheet(frames,images);atlas.save(OUT/(hero+'-gait-native.png'))
  atlas.resize((atlas.width*4,atlas.height*4),Image.Resampling.NEAREST).save(OUT/(hero+'-gait-4x.png'))
  G.label_sheet(hero,frames,images).save(OUT/(hero+'-gait-frame-key.png'))
  G.OUT=OUT;G.animation(hero,frames,images,'walk')
  (OUT/(hero+'-gait.json')).write_text(json.dumps({'source':'native authored material pixels',
   'referenceRig':'tools/art/vikings/guide-vikings81.py','materialDirection':'imagegen85 studies, not sampled artwork',
   'cell':[64,64],'nativePixelWorldSize':2,'origin':[32,40],'soleExclusive':62,
   'guideBodyHeightExcludesCostume':G.HEROES[hero]['height'],
   'nativeGeometryProjection':PROJECTION,'targetWholeSilhouetteWorldHeight':76 if hero=='baleog' else 72,
   'projectionPurpose':'Author body geometry for the established horn-inclusive display budget; no bitmap scaling',
   'frames':frames},indent=2)+'\n')
  print(hero,'8 native authored gait phases',atlas.size)
  full_frames=[];full_images=[]
  for action,count in G.actions_for(hero):
   for phase in range(count):
    f=G.base_pose(hero,action,phase);im=ORIGINAL_RENDER(f)
    paint_beard(ImageDraw.Draw(im),f,G.HEROES[hero]);boots(im,f)
    f['cell']=len(full_frames);f['opaqueBoundsNative']=list(im.getbbox())
    assert set(im.getchannel('A').get_flattened_data())<={0,255}
    full_frames.append(f);full_images.append(im)
  full=G.sheet(full_frames,full_images);full.save(OUT/(hero+'-native.png'))
  full.resize((full.width*4,full.height*4),Image.Resampling.NEAREST).save(OUT/(hero+'-full-4x.png'))
  G.label_sheet(hero,full_frames,full_images).save(OUT/(hero+'-full-frame-key.png'))
  (OUT/(hero+'-frames.json')).write_text(json.dumps({'source':'direct native geometry and material authorship','cell':[64,64],'origin':[32,40],'nativePixelWorldSize':2,'frames':full_frames},indent=2)+'\n')
  for action in ('idle','climb','overhead-walk','shield-raise','float','sword','bash'):
   G.animation(hero,full_frames,full_images,action)
  if hero=='olaf':
   ellipses=[]
   for f in full_frames:
    eq=next(e for e in f['equipment']if e['type']=='shield');c=project(eq['center'])
    ellipses.append(dict(x=(c[0]-32)*2,y=(c[1]-40)*2,
      rx=eq['projectionSize'][0],ry=eq['projectionSize'][1],
      roll=eq.get('rollDegrees',0)*math.pi/180,
      mode='back'if eq['attachment']=='back-straps'else'overhead'if eq.get('raiseFraction',0)>=1 else'front'))
   helper="import {heroAnimationCell} from './hero-frames.js?v=native85';\n\n"
   helper+='// Generated from the same native equipment geometry used to author every cell.\n'
   helper+='const shieldCells='+json.dumps(ellipses,separators=(',',':'))+';\n'
   helper+='export function native85ShieldPose(h,pose,frame=0){\n if(h.id!==2)return null;\n const {cell}=heroAnimationCell({...h,skin:"native85"},pose,frame);\n const q=shieldCells[cell],face=h.face||1;\n return {...q,x:q.x*face,roll:q.roll*face,cell};\n}\n'
   (ROOT/'src/heroes/native85-registration.js').write_text(helper)
  print(hero,'full native frames',len(full_frames))

if __name__=='__main__':main()
