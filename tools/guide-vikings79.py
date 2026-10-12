"""Olaf79: held, bobbing round shield. Reuses the preserved78 anatomical rig.

No production files are imported or changed. All pixels are authored at64x64;
imagegen input is only an exact nearest-neighbor enlargement of those pixels.
"""
from pathlib import Path
import importlib.util
import json
import math
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('preserved_vikings78_rig',Path(__file__).with_name('guide-vikings78.py'))
G=importlib.util.module_from_spec(spec)
spec.loader.exec_module(G)
OUT=ROOT/'assets'/'vikings79'
OUT.mkdir(parents=True,exist_ok=True)
G.OUT=OUT

def equipment_olaf(f,h):
    action=f['action'];phase=f['phase']
    up=action.startswith('overhead') or action=='float'
    t=1. if up else phase/6 if action=='shield-raise' else 1-phase/6 if action=='shield-lower' else 0.
    rear=f['view'].startswith('rear')
    mean_shoulder_y=sum(q[1] for q in f['shoulders'].values())/2
    body_bob=mean_shoulder_y-35.8
    if rear and not up:
        center=G.p(32,44+body_bob)
        f['equipment'].append({'type':'shield','shape':'round','center':center,
            'angleDegrees':0,'nativeSize':[24,24],'worldSize':[48,48],
            'physicalDiameterNative':24,'overheadProjectionDepthNative':6,
            'projectionSize':[24,24],'tiltDegrees':0,
            'attachment':'back-straps','paintOrder':'over-torso-before-arms',
            'bodyDrivenBobNative':body_bob,'groundClearanceNative':62-(center[1]+12)})
        return

    # The held face follows the torso's actual vertical motion. Its interior
    # strap and palm are transformed together, and IK solves the arm to that
    # moving grip; the shield is never independently offset after posing.
    front=G.p(44+.2*f['bodyLean'],43+body_bob)
    center=G.lerp(front,G.p(32,22),t)
    theta=math.pi/2*t
    # Stylized camera projection of one circular plate tipping away from the
    # image plane. Diameter stays24; the visible face foreshortens toward6.
    # Six is apparent face depth, NOT a six-pixel-thick physical shield.
    depth=6+18*math.cos(theta)
    grips={}
    if t==1:
        grips={'near':G.p(38.5,25),'far':G.p(25.5,25,.6)}
    else:
        interior=G.add(front,G.p(-4.5,-1.5))
        grips['near']=G.lerp(interior,G.p(38.5,25),t)
        if t>0:
            grips['far']=G.lerp(f['limbs']['farArm']['end'],G.p(25.5,25,.6),t)

    # Shoulder elevation, not a stretched humerus, brings palms to the new
    # round plate's underside. Keep helmet below y25 using normal neck posture.
    f['headAngleDegrees']-=12*t
    f['headDuck']=1.4*t
    f['neck']=G.add(f['neck'],G.p(0,-1.5*t))
    for side in grips:
        f['shoulders'][side]=G.add(f['shoulders'][side],G.p(0,-2.7*t))

    if action=='overhead-climb':
        reach_side='far' if phase<2 else 'near'
        del grips[reach_side]
        sign=-1 if reach_side=='far' else 1
        ladder_grip=G.p(32+sign*6.4,29.0+2.0*(phase%2),2.4)
        f['limbs'][reach_side+'Arm']=G.ik(f['shoulders'][reach_side],ladder_grip,h['upper'],h['fore'],G.p(sign,0,-.4))
        f['contacts'].append({'limb':reach_side+'Arm','kind':'ladder-grip','point':ladder_grip})
        f['notes'].append('One hand supports the round plate at its underside; the opposite hand reaches/pulls the ladder.')

    for side,grip in grips.items():
        bend=G.p(-1 if side=='far' else 1,1,0)
        f['limbs'][side+'Arm']=G.ik(f['shoulders'][side],grip,h['upper'],h['fore'],bend)
        f['contacts'].append({'limb':side+'Arm','kind':'shield-underside' if t==1 else 'shield-interior-strap','point':grip})

    f['equipment'].append({'type':'shield','shape':'round','center':center,
        'angleDegrees':0,'tiltDegrees':90*t,'nativeSize':[24,24],
        'worldSize':[48,48],'physicalDiameterNative':24,'overheadProjectionDepthNative':6,
        'projectionSize':[24,depth],'grips':grips,
        'walkingPlaneNativeY':22 if t==1 else None,
        'walkingPlaneWorldYRelativeOrigin':-36 if t==1 else None,
        'undersideNativeY':25 if t==1 else center[1]+depth/2,
        'attachment':'palms-under-rim' if t==1 else 'interior-strap',
        'paintOrder':'after-arms-hides-gripping-palm','raiseFraction':t,
        'bodyDrivenBobNative':body_bob if t==0 else body_bob*(1-t),
        'groundClearanceNative':62-(center[1]+depth/2)})

def shield_image(eq):
    out=Image.new('RGBA',(64,64));pixels=out.load()
    cx,cy,_=eq['center'];width,depth=eq['projectionSize']
    rx=width/2;ry=depth/2
    for y in range(64):
        for x in range(64):
            u=(x+.5-cx)/rx;v=(y+.5-cy)/ry;q=u*u+v*v
            if q>1:continue
            if q>.86:color=G.EDGE
            elif q>.66:color='#d1bb83' if u+v<0 else '#826846'
            else:
                color='#b79051' if u<0 else '#9b793f'
                if abs(u)<.065:color='#745d3e'
            # Broad metal boss, authored at native density with no tiny texture.
            if u*u+v*v<.047:color='#78938f'
            if (u+.055)**2+(v+.055)**2<.019:color='#c4cfc0'
            pixels[x,y]=tuple(bytes.fromhex(color.lstrip('#')))+(255,)
    return out

def main():
    G.equipment_olaf=equipment_olaf
    G.shield_image=shield_image
    G.save_hero('olaf')
    meta_path=OUT/'olaf-guide.json'
    data=json.loads(meta_path.read_text())
    data['schema']='vikings79.round-shield-guide.v1'
    data['sourceRig']='tools/guide-vikings78.py (preserved unchanged)'
    data['roundShield']={'diameterNative':24,'diameterWorld':48,
        'frontProjectionNative':[24,24],'overheadProjectionNative':[24,6],
        'riderPlaneNativeY':22,'overheadUndersideNativeY':25,
        'minimumFrontClearanceNative':4}
    for f in data['frames']:
        eq=next(e for e in f['equipment'] if e['type']=='shield')
        mask=shield_image(eq)
        box=mask.getbbox()
        eq['opaqueBoundsNative']=list(box)
        eq['actualBottomExclusiveNative']=box[3]
        eq['actualGroundClearanceNative']=62-box[3]
    meta_path.write_text(json.dumps(data,indent=2)+'\n')
    atlas=Image.open(OUT/'olaf-guide-native.png').convert('RGBA')
    packet=Image.new('RGBA',(256,128))
    for i in range(8):
        cell=atlas.crop((i*64,0,(i+1)*64,64))
        packet.alpha_composite(cell,(i%4*64,i//4*64))
    packet.save(OUT/'olaf-walk-input-native.png')
    packet.resize((1024,512),Image.Resampling.NEAREST).save(OUT/'olaf-walk-input-4x.png')
    print('Imagegen guide: assets/vikings79/olaf-walk-input-4x.png (1024x512 transparent; exact4x).')

if __name__=='__main__':main()
