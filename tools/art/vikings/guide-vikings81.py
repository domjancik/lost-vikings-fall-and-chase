"""Native81 motion/costume authority. Import configure() for direct material work.

Sibling-only outputs. Preserved78/79/80 supply the accepted articulated rig and
first-game adult builds. This version adds a real Erik run and flowing beard,
and Olaf's oblique shield and low helmet rim.
"""
from pathlib import Path
import importlib.util
import copy
import json
import math
from PIL import Image, ImageDraw, ImageFont

ROOT=next(p for p in Path(__file__).resolve().parents if (p/'package.json').is_file())
spec=importlib.util.spec_from_file_location('preserved_vikings80',Path(__file__).with_name('guide-vikings80.py'))
V=importlib.util.module_from_spec(spec);spec.loader.exec_module(V)
G=V.G
OUT=ROOT/'assets'/'vikings81'
BASE_POSE=G.base_pose
BASE_RENDER=G.render
COSTUME_ENABLED=True
CONFIGURED=False

def dynamic_pose(hero,action,phase):
    f=BASE_POSE(hero,action,phase)
    if hero!='erik' or action!='walk':return f
    h=G.HEROES[hero]
    bob=[.2,.8,-.4,-1.2,.2,.8,-.4,-1.2][phase]
    lean=[3.1,3.5,3.7,3.3,3.1,3.5,3.7,3.3][phase]
    twist=.55*math.sin(phase*math.tau/8)
    hip_y=46+bob;shoulder_y=35.8+bob
    f.update(pelvis=G.p(32,hip_y),chest=G.p(32+lean,shoulder_y+4.4),
             neck=G.p(32+lean+.5,shoulder_y-1.7),bodyLean=lean,
             headAngleDegrees=6.,torsoExpansion=0.,contacts=[],headDuck=0.)
    f['shoulders']={'near':G.p(33.7+lean,shoulder_y+twist),'far':G.p(30.3+lean,shoulder_y-twist,.6)}
    f['hips']={'near':G.p(32.85,hip_y),'far':G.p(31.15,hip_y,.6)}
    # Near-leg contact, compression, propulsion, early-flight fold, recovering
    # fold, passing, knee-drive, extension. Far limb is four phases apart.
    route=[(37.2,-5,0),(33.8,0,0),(27.8,24,0),(28.,35,4.6),
           (28.4,35,6.3),(31.5,10,5.5),(38.3,-15,4.4),(39.4,-7,1.8)]
    families=['contact','compression','toe-off-drive','flight-fold',
              'recovery-fold','passing','knee-drive','flight-extension']
    for side,offset in [('near',0),('far',4)]:
        q=(phase+offset)%8;x,roll,lift=route[q]
        if side=='far':x-=1.7
        ft=G.foot(x,roll,airborne=lift,z=.6 if side=='far' else 0)
        ft['phaseFamily']=families[q];f['feet'][side]=ft
        f['limbs'][side+'Leg']=G.ik(f['hips'][side],ft['ankle'],h['thigh'],h['shin'],G.p(1,0))
        theta=q*math.tau/8
        f['limbs'][side+'Arm']=G.arm_fk(f['shoulders'][side],h['upper'],h['fore'],-45*math.cos(theta),78+8*math.sin(theta))
        if ft['contact']!='airborne':
            f['contacts'].append({'limb':side+'Leg','kind':ft['contact'],'soleExclusive':62})
    flight=all(ft['contact']=='airborne' for ft in f['feet'].values())
    f['motionClass']='run'
    f['dynamicRun']={'phaseFamily':families[phase],'flight':flight,
        'nearFootFamily':families[phase],'farFootFamily':families[(phase+4)%8],
        'bodyCompressionNative':bob,'forwardLeanNative':lean,
        'mappingNote':'Action key remains walk for the existing atlas map; motion is an authored run.'}
    f['notes'].append('True run with double-airborne flight phases3/7, knee drive, folded recovery and strong counter-swing; not a sped-up walk.')
    return f

def oblique_equipment(f,h):
    V.equipment_olaf(f,h)
    eq=next(e for e in f['equipment'] if e['type']=='shield')
    t=eq.get('raiseFraction',0.)
    # Costume horns are physical silhouette, too: a neck duck keeps their tips
    # below the unchanged overhead underside instead of hiding them in the disc.
    f['headDuck']+=3.2*t
    rear_stowed=eq['attachment']=='back-straps'
    yaw=0. if rear_stowed else 45*(1-t)
    roll=0. if rear_stowed else -8*(1-t)
    eq['yawDegrees']=yaw;eq['rollDegrees']=roll
    eq['projectionSize']=[24*math.cos(math.radians(yaw)),eq['projectionSize'][1]]
    eq['physicalDiameterNative']=24
    eq['projectionExplanation']='Same24native disc: front oblique yaw foreshortens width, raising foreshortens depth, physical diameter stays fixed.'
    if not rear_stowed and t<1:
        # The handle is a physical point on the angled face. Transform it into
        # the same yaw/roll projection before interpolating to the overhead rim.
        cx,cy,_=eq['center'];a=math.radians(roll)
        u=-6.5*math.cos(math.radians(yaw));v=-1.5
        face_grip=G.p(cx+u*math.cos(a)-v*math.sin(a),cy+u*math.sin(a)+v*math.cos(a))
        grip=G.lerp(face_grip,G.p(38.5,25),t)
        eq['grips']['near']=grip
        eq['physicalInteriorStrapNative']=[-6.5,-1.5]
        f['limbs']['nearArm']=G.ik(f['shoulders']['near'],grip,h['upper'],h['fore'],G.p(1,1,0))
        for c in f['contacts']:
            if c['limb']=='nearArm' and c['kind']=='shield-interior-strap':c['point']=grip

def shield_image(eq):
    out=Image.new('RGBA',(64,64));pixels=out.load()
    cx,cy,_=eq['center'];w,d=eq['projectionSize'];rx=w/2;ry=d/2
    angle=math.radians(eq.get('rollDegrees',0));co,si=math.cos(angle),math.sin(angle)
    for y in range(64):
        for x in range(64):
            dx=x+.5-cx;dy=y+.5-cy
            u=(dx*co+dy*si)/rx;v=(-dx*si+dy*co)/ry;q=u*u+v*v
            if q>1:continue
            if q>.86:color=G.EDGE
            elif q>.66:color='#d1bb83' if u+v<0 else '#826846'
            else:
                color='#b79051' if u<0 else '#9b793f'
                if abs(u)<.065:color='#745d3e'
            if u*u+v*v<.047:color='#78938f'
            if (u+.055)**2+(v+.055)**2<.019:color='#c4cfc0'
            pixels[x,y]=tuple(bytes.fromhex(color.lstrip('#')))+(255,)
    return out

def costume_head(d,f,h):
    V.stout_head(d,f,h)
    if not COSTUME_ENABLED:return
    hero=f['hero'];rear=f['view'].startswith('rear');phase=f['phase']
    pivot=f['head']['neckPivot'];a=math.radians(f['headAngleDegrees'])
    def pt(x,y):return G.p(pivot[0]+x*math.cos(a)-y*math.sin(a),pivot[1]+x*math.sin(a)+y*math.cos(a))
    # Three deliberately clustered horn pixels above the anatomical helmet.
    horns=[]
    for sign in (-1,1):
        chain=[pt(sign*2.5,-6.5),pt(sign*5,-8),pt(sign*4.7,-11)]
        G.segment(d,chain[0],chain[1],1.1,.8,G.EDGE)
        G.segment(d,chain[1],chain[2],.8,.35,G.EDGE)
        d.line([G.xy(q) for q in chain],fill='#e0d6ac',width=1)
        horns.append(chain)
    f.setdefault('costume',{})['horns']={'chains':horns,'aboveBodyPixels':3,'bodyScaleExcludesHorns':True}
    if hero=='olaf' and not rear:
        # A low helmet rim conceals the eye, while the nose stays forward of it.
        G.poly(d,[pt(-3,-5.2),pt(3,-5.2),pt(3,-3.1),pt(-3,-3.5)],'#91a5a5')
        d.line([G.xy(pt(-3,-3.4)),G.xy(pt(3,-3.1))],fill=G.EDGE,width=1)
        f['costume']['helmet']={'eyeCovered':True,'rimPoints':[pt(-3,-3.4),pt(3,-3.1)],
                                 'coveredEyePoint':pt(2,-4),'noseVisible':True}
    if rear:
        f['secondaryMotion']={'beard':{'visibility':'occluded by rear-facing head/torso','points':[],'lengthNative':9 if hero=='erik' else 6}}
        return
    root=pt(.5,-.1)
    running=hero=='erik' and f.get('motionClass')=='run'
    if running:
        flutter=[0,9,17,10,-2,-11,-17,-8][phase]
        angles=[125+flutter*.2,165+flutter*.6,178+flutter]
        lengths=[3.,3.,3.];mode='run-trailing'
    elif hero=='erik':
        quiet=([0,1,0,-1][phase] if f['action']=='idle' else 0)
        if f['action'] in ('rise','fall','bash'):
            angles=[120,148+phase*2,163+phase*2];mode='air-or-action-follow-through'
        else:angles=[78+quiet,87+quiet,92+quiet];mode='quiet-gravity-hang'
        lengths=[3.,3.,3.]
    else:
        angles=[80,86,90];lengths=[2.,2.,2.];mode='long-native-beard'
    points=[root]
    for angle,length in zip(angles,lengths):
        theta=math.radians(angle)
        points.append(G.add(points[-1],G.p(math.cos(theta)*length,math.sin(theta)*length)))
    color='#dd9553' if hero=='erik' else '#d3b461'
    widths=[1.8,1.55,1.1,.35] if hero=='erik' else [2.1,1.8,1.3,.5]
    for extra,fill in [(.5,G.EDGE),(0,color)]:
        for i in range(3):G.segment(d,points[i],points[i+1],widths[i]+extra,widths[i+1]+extra,fill)
    f['secondaryMotion']={'beard':{'points':points,'segmentLengthsNative':lengths,
        'lengthNative':sum(lengths),'mode':mode,'phase':phase,
        'attachment':'jaw','drivenBy':'authored run phase and relative motion' if running else 'gravity and small pose follow-through'}}

def render(f):
    global COSTUME_ENABLED
    bare=copy.deepcopy(f);bare['equipment']=[]
    COSTUME_ENABLED=False
    body=BASE_RENDER(bare)
    COSTUME_ENABLED=True
    im=BASE_RENDER(f)
    f['bodyOpaqueBoundsWithoutEquipmentOrCostume']=list(body.getbbox())
    f['bodyHeightTargetExcludesCostume']=G.HEROES[f['hero']]['height']
    return im

def configure():
    """Return configured native module without generating any output assets.

    API: G.base_pose(hero, action, phase)->dict; G.render(dict)->RGBA64x64.
    Fixed-limb geometry, softTissue outline, equipment contacts and secondary
    costume paths are available on the resulting frame dictionary.
    """
    global CONFIGURED
    if CONFIGURED:return G
    G.OUT=OUT
    G.HEROES['olaf'].update(shoulder=14.,waist=18.,pelvis=12.,mass=1.7,
        cloth='#4c934e',clothDark='#2d623c',hair='#d5b967',pants='#8b805f',farPants='#575844')
    G.HEROES['baleog'].update(shoulder=11.6,waist=7.3,pelvis=8.3,mass=1.28)
    G.torso=V.stout_torso;G.head=costume_head;G.limb=V.stout_limb
    G.equipment_olaf=oblique_equipment;G.shield_image=shield_image
    G.base_pose=dynamic_pose;G.render=render
    CONFIGURED=True
    return G

def save_inputs(hero):
    path=OUT/f'{hero}-guide.json';data=json.loads(path.read_text())
    data['schema']='vikings81.dynamic-motion-costume-guide.v1'
    data['sourceRigs']=['tools/art/vikings/guide-vikings78.py','tools/art/vikings/guide-vikings79.py','tools/art/vikings/guide-vikings80.py']
    data['bodyScaleExcludesCostumeHorns']=True
    data['referenceAuthority']='Original first-game SNES Olaf sheet8335, retained with caption; not sequel or Heroes of the Storm.'
    for f in data['frames']:
        for eq in f['equipment']:
            if eq['type']=='shield':
                box=shield_image(eq).getbbox();eq['opaqueBoundsNative']=list(box)
                eq['actualBottomExclusiveNative']=box[3];eq['actualGroundClearanceNative']=62-box[3]
    path.write_text(json.dumps(data,indent=2)+'\n')
    atlas=Image.open(OUT/f'{hero}-guide-native.png').convert('RGBA')
    atlas.save(OUT/f'{hero}-full-input-native.png')
    atlas.resize((atlas.width*2,atlas.height*2),Image.Resampling.NEAREST).save(OUT/f'{hero}-full-input-2x.png')
    packet=Image.new('RGBA',(256,128))
    for n in range(8):packet.alpha_composite(atlas.crop((n*64,0,(n+1)*64,64)),(n%4*64,n//4*64))
    packet.save(OUT/f'{hero}-walk-input-native.png')
    packet.resize((1024,512),Image.Resampling.NEAREST).save(OUT/f'{hero}-walk-input-4x.png')
    return data

def motion_review(records):
    frames=records['erik']['frames'][:8]
    images=[]
    for f in frames:images.append(G.render(copy.deepcopy(f)))
    G.label_sheet('erik RUN +9px flowing beard',frames,images).save(OUT/'erik-run-review.png')
    # A side/down vs overhead/raised-climb hand/eye reference, native-derived.
    chosen=[8,0,2,26,38,41,44,52]
    fs=[records['olaf']['frames'][n] for n in chosen]
    ims=[G.render(copy.deepcopy(f)) for f in fs]
    G.label_sheet('olaf OBLIQUE SHIELD / LOW HELMET',fs,ims).save(OUT/'olaf-shield-helmet-review.png')

def main():
    configure();OUT.mkdir(parents=True,exist_ok=True)
    records={}
    for hero in ('erik','baleog','olaf'):
        G.save_hero(hero);records[hero]=save_inputs(hero)
    motion_review(records)

if __name__=='__main__':main()
