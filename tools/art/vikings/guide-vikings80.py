"""First-game proportion guides: lean Erik, muscular Baleog, stout Olaf.

Preserves78/79 and reuses their fixed-length rig and round-shield geometry.
Olaf's large soft-tissue silhouette is authored natively around that rig.
"""
from pathlib import Path
import importlib.util
import copy
import json
import math
from PIL import Image, ImageDraw, ImageFont

ROOT=next(p for p in Path(__file__).resolve().parents if (p/'package.json').is_file())
spec=importlib.util.spec_from_file_location('preserved_vikings79',Path(__file__).with_name('guide-vikings79.py'))
U=importlib.util.module_from_spec(spec);spec.loader.exec_module(U)
G=U.G
OUT=ROOT/'assets'/'vikings80';OUT.mkdir(parents=True,exist_ok=True)
G.OUT=OUT
ORIGINAL_TORSO=G.torso
ORIGINAL_HEAD=G.head
ORIGINAL_LIMB=G.limb
ORIGINAL_EQUIPMENT=U.equipment_olaf
ORIGINAL_OLAF=copy.deepcopy(G.HEROES['olaf'])

def equipment_olaf(f,h):
    rear=f['view'].startswith('rear')
    if not rear:
        # Broad shoulder girdle: shift whole arm chains, preserving all lengths.
        for side,dx in [('near',1.5),('far',-2.3)]:
            shift=G.p(dx,0,0)
            f['shoulders'][side]=G.add(f['shoulders'][side],shift)
            for key in ('start','joint','end'):
                f['limbs'][side+'Arm'][key]=G.add(f['limbs'][side+'Arm'][key],shift)
    ORIGINAL_EQUIPMENT(f,h)
    eq=next(e for e in f['equipment'] if e['type']=='shield')
    t=eq.get('raiseFraction',0)
    if eq['attachment']=='back-straps':return
    # Hold the face forward of the new full belly, not across its entire mass.
    # Relocate the plate and its concealed strap together, then solve the arm.
    dx=3.5*(1-t)
    eq['center']=G.add(eq['center'],G.p(dx,0))
    if t<1:
        grip=G.add(eq['grips']['near'],G.p(dx,0))
        eq['grips']['near']=grip
        f['limbs']['nearArm']=G.ik(f['shoulders']['near'],grip,h['upper'],h['fore'],G.p(1,1,0))
        for contact in f['contacts']:
            if contact['limb']=='nearArm' and contact['kind']=='shield-interior-strap':contact['point']=grip
    eq['heldForwardShiftNative']=dx

def stout_torso(d,f,h):
    if f['hero']!='olaf':return ORIGINAL_TORSO(d,f,h)
    cy=sum(q[1] for q in f['shoulders'].values())/2
    py=f['pelvis'][1];cx=32.5+f['bodyLean']*.55
    breath=f['torsoExpansion']*.5
    rear=f['view'].startswith('rear')
    # One complete barrel: broad back and upper ribs continue into a convex
    # abdomen, then a low rounded hem. This is not a widened belt on a thin body.
    pts=[G.p(cx-2.3,cy-1.8),G.p(cx-5.8,cy-.8),G.p(cx-7.8,cy+1.8),
         G.p(cx-8.5-breath,cy+6.4),G.p(cx-8.1-breath,py+.8),
         G.p(cx-6.4,py+3.5),G.p(cx-2.9,py+4.4),G.p(cx+3.6,py+4.4),
         G.p(cx+7.0,py+2.5),G.p(cx+8.5+breath,py-.7),
         G.p(cx+8.0+breath,cy+5.2),G.p(cx+6.5,cy+1.2),
         G.p(cx+3.1,cy-1.3)]
    G.poly(d,pts,G.EDGE)
    mid=G.p(cx,(cy+py+2)/2)
    inner=[G.lerp(mid,q,.88) for q in pts]
    G.poly(d,inner,h['cloth'])
    G.poly(d,[G.p(cx-5.8,cy+.3),G.p(cx-7.1,cy+3),G.p(cx-7.3,py),
              G.p(cx-5.5,py+2.8),G.p(cx-2,py+3.3),G.p(cx-3.2,cy+3)],h['clothDark'])
    if not rear:
        # Original SNES reference: open green clothing around a large belly.
        G.poly(d,[G.p(cx+.4,cy+1.8),G.p(cx+4.5,cy+2),G.p(cx+6.7,cy+4.4),
                  G.p(cx+7.2,py-.7),G.p(cx+6,py+1.6),G.p(cx+2.8,py+2.5),
                  G.p(cx+.4,py+1.6),G.p(cx-.2,cy+5)],'#c89e72')
        d.line([G.xy(G.p(cx-5.8,py+2.2)),G.xy(G.p(cx-.5,py+3.2)),G.xy(G.p(cx+5.5,py+2.1))],fill='#62543c',width=1)
    else:
        d.line([G.xy(G.p(cx-5.8,py+2.2)),G.xy(G.p(cx,py+3.2)),G.xy(G.p(cx+5.8,py+2.2))],fill='#62543c',width=1)
    f['softTissue']={'build':'very-stout','bellyWidthTargetNative':18,
        'shoulderWidthTargetNative':14,'fullTorsoOutline':pts,
        'bellyCenter':[cx,(cy+py)/2+2],
        'limbMassScale':h['mass'],'neckWidthNative':4}

def stout_head(d,f,h):
    if f['hero']=='olaf':
        # A stout neck joins the head into elevated trapezius/chest mass.
        start=f['neck'];end=G.add(start,G.p(0,2.3))
        G.segment(d,start,end,2.1,2.5,G.EDGE)
        G.segment(d,start,end,1.3,1.7,'#c89e72')
    ORIGINAL_HEAD(d,f,h)

def stout_limb(d,chain,kind,side,h):
    if h is not G.HEROES['olaf']:return ORIGINAL_LIMB(d,chain,kind,side,h)
    a,b,c=chain['start'],chain['joint'],chain['end'];near=side=='near'
    if kind=='Leg':
        # Broad thighs/calves taper into the boot. A uniformly inflated ankle
        # would project through the sole during a compressed landing pose.
        radii=(3.0,2.35,1.35)
        main=h['pants'] if near else h['farPants'];end='#aa8c5c' if near else '#655b40'
    else:
        radii=(2.45,1.75,1.3)
        main='#dfb281' if near else '#997757';end=main
    for extra,c1,c2 in [(.7,G.EDGE,G.EDGE),(0,main,end)]:
        G.segment(d,a,b,radii[0]+extra,radii[1]+extra,c1)
        G.segment(d,b,c,radii[1]+extra,radii[2]+extra,c2)
        G.disc(d,b,radii[1]+extra,c1)
    if kind=='Arm':
        sleeve=G.lerp(a,b,.38)
        G.segment(d,a,sleeve,radii[0],radii[0]*.85,h['cloth'] if near else h['clothDark'])
        G.disc(d,c,1.3,end)

def update_meta(hero):
    path=OUT/f'{hero}-guide.json';data=json.loads(path.read_text())
    data['schema']='vikings80.first-game-build-guide.v1'
    data['sourceRigs']=['tools/art/vikings/guide-vikings78.py','tools/art/vikings/guide-vikings79.py']
    data['buildIntent']={'erik':'lean athletic adult','baleog':'broad muscular adult','olaf':'very stout adult with full round belly and broad back'}[hero]
    data['referenceAuthority']='Original first-game SNES Olaf sheet8335; not LostVikings2 or Heroes of the Storm.'
    for f in data['frames']:
        for eq in f['equipment']:
            if eq['type']!='shield':continue
            box=U.shield_image(eq).getbbox()
            eq['opaqueBoundsNative']=list(box);eq['actualBottomExclusiveNative']=box[3]
            eq['actualGroundClearanceNative']=62-box[3]
    path.write_text(json.dumps(data,indent=2)+'\n')
    atlas=Image.open(OUT/f'{hero}-guide-native.png').convert('RGBA')
    atlas.save(OUT/f'{hero}-full-input-native.png')
    atlas.resize((atlas.width*2,atlas.height*2),Image.Resampling.NEAREST).save(OUT/f'{hero}-full-input-2x.png')
    walk=Image.new('RGBA',(256,128))
    for i in range(8):walk.alpha_composite(atlas.crop((i*64,0,(i+1)*64,64)),(i%4*64,i//4*64))
    walk.save(OUT/f'{hero}-walk-input-native.png')
    walk.resize((1024,512),Image.Resampling.NEAREST).save(OUT/f'{hero}-walk-input-4x.png')
    return data

def silhouette_review(data):
    # Side-by-side body-only evidence prevents equipment from hiding the change.
    selected=[8,0,2,26,14]
    board=Image.new('RGB',(5*256,2*288+44),G.BACK);d=ImageDraw.Draw(board)
    font=ImageFont.truetype('C:/Windows/Fonts/consola.ttf',15)
    d.text((8,8),'OLAF80 / upper: complete pose / lower: same pose, shield hidden for mass review',font=font,fill=G.EDGE)
    for col,index in enumerate(selected):
        f=copy.deepcopy(data['frames'][index])
        for row in range(2):
            if row:f['equipment']=[]
            im=G.render(f).resize((256,256),Image.Resampling.NEAREST)
            x=col*256;y=44+row*288;board.paste(im,(x,y),im)
            d.text((x+5,y+257),f'{index:02} {f["action"]} '+('BODY ONLY' if row else ''),font=font,fill=G.EDGE)
    board.save(OUT/'olaf-stout-body-review.png')
    # All three builds at exactly the same cell scale, without weapons/shields.
    builds=Image.new('RGB',(3*256,300),G.BACK);bd=ImageDraw.Draw(builds)
    native_builds=Image.new('RGBA',(192,64))
    for i,hero in enumerate(('erik','baleog','olaf')):
        f=G.base_pose(hero,'idle',0);f['equipment']=[]
        raw=G.render(f);native_builds.alpha_composite(raw,(i*64,0))
        im=raw.resize((256,256),Image.Resampling.NEAREST)
        builds.paste(im,(i*256,0),im)
        bd.text((i*256+15,265),hero.upper()+' / '+str(G.HEROES[hero]['height'])+' native high',font=font,fill=G.EDGE)
    builds.save(OUT/'three-builds-body-only.png')
    native_builds.save(OUT/'three-builds-body-only-native.png')
    bare=[]
    for record in data['frames']:
        f=copy.deepcopy(record);f['equipment']=[];bare.append(G.render(f))
    G.sheet(data['frames'],bare).save(OUT/'olaf-body-only-native.png')

def main():
    G.HEROES['olaf'].update(shoulder=14.0,waist=18.0,pelvis=12.0,mass=1.7,
                          cloth='#4c934e',clothDark='#2d623c',hair='#d5b967',
                          pants='#8b805f',farPants='#575844')
    G.HEROES['baleog'].update(shoulder=11.6,waist=7.3,pelvis=8.3,mass=1.28)
    G.equipment_olaf=equipment_olaf;G.shield_image=U.shield_image
    G.torso=stout_torso;G.head=stout_head;G.limb=stout_limb
    records={}
    for hero in ('erik','baleog','olaf'):
        G.save_hero(hero);records[hero]=update_meta(hero)
    silhouette_review(records['olaf'])

if __name__=='__main__':main()
