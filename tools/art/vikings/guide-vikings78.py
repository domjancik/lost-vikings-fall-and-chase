"""Native-pixel anatomical animation studies. No production imports or image resampling.

All anatomy is constructed in native 64x64 coordinates. The rig is 3-D so rear
climbing can bend knees toward the ladder instead of splaying them sideways.
Only the final x/y projection is rounded onto the pixel grid.
"""
from pathlib import Path
import json
import math
from PIL import Image, ImageDraw, ImageFont

OUT = next(p for p in Path(__file__).resolve().parents if (p/'package.json').is_file()) / 'assets' / 'vikings78'
OUT.mkdir(parents=True, exist_ok=True)
TAU = math.tau
EDGE = '#172630'
BACK = '#e6e6db'
HEROES = {
    'erik': dict(height=36, shoulder=8.2, waist=5.8, pelvis=7.2,
                 upper=5.6, fore=5.0, thigh=7.45, shin=7.15,
                 cloth='#b9553d', clothDark='#763c36', hair='#b4663e',
                 pants='#6c8793', farPants='#3c5261', mass=1.0),
    'baleog': dict(height=38, shoulder=10.0, waist=6.4, pelvis=7.8,
                   upper=6.0, fore=5.4, thigh=8.2, shin=8.0,
                   cloth='#4f8190', clothDark='#345665', hair='#c49a50',
                   pants='#738696', farPants='#405266', mass=1.12),
    'olaf': dict(height=36, shoulder=11.2, waist=10.8, pelvis=9.0,
                 upper=6.0, fore=5.5, thigh=7.2, shin=7.0,
                 cloth='#a68e4f', clothDark='#6a613e', hair='#cead64',
                 pants='#718278', farPants='#40594f', mass=1.24),
}

def add(a, b): return tuple(x+y for x,y in zip(a,b))
def sub(a, b): return tuple(x-y for x,y in zip(a,b))
def mul(a, k): return tuple(x*k for x in a)
def dot(a,b): return sum(x*y for x,y in zip(a,b))
def norm(a): return math.sqrt(dot(a,a))
def unit(a): return mul(a,1/max(norm(a),1e-9))
def p(x,y,z=0): return (float(x),float(y),float(z))
def xy(a): return (round(a[0]),round(a[1]))
def lerp(a,b,t): return add(mul(a,1-t),mul(b,t))

def ik(start, end, upper, lower, bend):
    """Fixed-length two-link chain; bend is a 3-D anatomical plane hint.

    Side knees bend anterior (+x), side elbows posterior (-x). In a rear
    view the knee bends into the ladder (+z), not toward the screen edge.
    A requested unreachable endpoint is an error, never silently stretched.
    """
    delta=sub(end,start); dist=norm(delta)
    if not abs(upper-lower)+.001 < dist < upper+lower-.001:
        raise ValueError(f'Unreachable joint: {start} -> {end}; distance {dist:.3f}, lengths {upper}/{lower}')
    axis=unit(delta)
    perpendicular=unit(sub(bend,mul(axis,dot(bend,axis))))
    along=(upper*upper-lower*lower+dist*dist)/(2*dist)
    across=math.sqrt(max(0,upper*upper-along*along))
    mid=add(add(start,mul(axis,along)),mul(perpendicular,across))
    flex=180-math.degrees(math.acos(max(-1,min(1,(upper*upper+lower*lower-dist*dist)/(2*upper*lower)))))
    return {'start':start,'joint':mid,'end':end,'lengths':[upper,lower],
            'flexionDegrees':flex, 'bendPlaneHint':bend}

def arm_fk(start, upper, lower, upper_angle, flex):
    # Angles are measured from the down axis: positive angles move anteriorly.
    a=math.radians(upper_angle); b=math.radians(upper_angle+flex)
    elbow=add(start,p(math.sin(a)*upper,math.cos(a)*upper))
    wrist=add(elbow,p(math.sin(b)*lower,math.cos(b)*lower))
    return {'start':start,'joint':elbow,'end':wrist,'lengths':[upper,lower],
            'flexionDegrees':flex,'bendPlaneHint':(-1,0,0)}

BOOT = [(-1.3,-1.5),(1.0,-1.5),(1.7,-.1),(3.5,.45),(3.5,1.3),(-1.5,1.3)]
def foot(x, angle=0, sole=62, airborne=0, rear=False, z=0):
    # Exclusive sole 62 means the last filled row is 61, including rolled boots.
    if rear: shape=[(-1.5,-1.5),(1.5,-1.5),(1.8,1.3),(-1.8,1.3)]
    else: shape=BOOT
    a=math.radians(angle); c=math.cos(a); s=math.sin(a)
    local=[(u*c-v*s,u*s+v*c) for u,v in shape]
    ay=sole-1-max(v for _,v in local)-airborne
    ankle=p(x,ay,z)
    points=[(x+u,ay+v) for u,v in local]
    return {'ankle':ankle,'polygon':points,'rollDegrees':angle,
            'contact':'airborne' if airborne else 'toe' if angle>5 else 'heel' if angle<-5 else 'flat',
            'soleExclusive':sole-airborne,'airbornePixels':airborne}

def base_pose(hero, action, phase):
    h=HEROES[hero]; tall=h['height']-36
    f={'hero':hero,'action':action,'phase':phase,'view':'side-right',
       'registration':{'origin':[32,40],'groundSoleExclusive':62},
       'contacts':[], 'notes':[], 'equipment':[]}
    # Side projection keeps anatomical near/far hips separate, with a full pelvis.
    hip_y=46.0-tall*.85 + (.5 if hero=='olaf' else 0)
    sh_y=35.8-tall*.7
    bob=0.; lean=0.; twist=0.; crouch=0.; head_angle=0.; expand=0.
    if action in ('walk','overhead-walk'):
        bob=[0,.45,-.35,-.5,0,.45,-.35,-.5][phase]
        lean=.5;twist=.45*math.sin(phase*TAU/8)
    elif action in ('idle','overhead-idle'):
        bob=[0,-.3,-.65,-.3][phase];expand=[0,.15,.35,.15][phase]
    elif action=='look-up':head_angle=-22
    elif action=='look-down':head_angle=25
    elif action=='land':crouch=[2.6,1.3,0][phase];lean=[1.2,.5,0][phase]
    elif action=='hurt':crouch=1;lean=-2.0;head_angle=-10
    elif action=='bash':
        crouch=[.4,1.1,1.6,1.4,.7,0][phase]
        lean=[-1.1,-.4,3.0,4.2,2.,.3][phase]
        head_angle=[-5,0,9,12,4,0][phase]
    elif action=='sword':lean=[-.7,-.8,1.2,2.,1.,0][phase];twist=[-.8,-1,.3,.8,.4,0][phase]
    elif action=='bow':lean=[-.3,-.5,-.7,-.5,0,0][phase];twist=-.8
    elif action=='rise':crouch=-.4;lean=[.5,1.0][phase]
    elif action=='fall':crouch=[-.2,.6][phase];lean=[.6,.4][phase]
    elif action=='float':crouch=[-.3,-.6,-.2,.4][phase];lean=[-.4,.3,.9,-.8][phase]
    support=0.
    if hero=='olaf':
        support=1. if action.startswith('overhead') or action=='float' else phase/6 if action=='shield-raise' else 1-phase/6 if action=='shield-lower' else 0.
        # Braced trunk plus neck flexion clears the unchanged underside at y29.
        # Most of the clearance comes from ducking, not an implausibly deep squat.
        crouch+=.5*support;sh_y+=.8*support;head_angle+=12*support
    rear=action in ('climb','overhead-climb')
    if rear:
        f['view']='rear-facing-ladder';bob=[0,-.4,0,-.4][phase]
        twist=[-.35,0,.35,0][phase]
    center=32.
    neutral=action in ('idle','look-up','look-down','overhead-idle','shield-raise','shield-lower') or (action=='land' and phase==2)
    if neutral:
        # Nearly straight standing legs; breathing moves ribcage/neck, not pelvis.
        hip_y=59.7-math.sqrt((h['thigh']+h['shin']-.16)**2-1.15**2)
    hip_y+=(0 if neutral else bob)+crouch; sh_y+=bob+crouch
    pelvis=p(center,hip_y)
    chest=p(center+lean,sh_y+4.4)
    neck=p(center+lean+.5,sh_y-1.7)
    near_sh=p(center+lean+(h['shoulder']*.44 if rear else 1.7),sh_y+twist)
    far_sh=p(center+lean-(h['shoulder']*.44 if rear else 1.7),sh_y-twist,.6)
    near_hip=p(center+(2.4 if rear else .85),hip_y)
    far_hip=p(center-(2.4 if rear else .85),hip_y,.6)
    f.update(pelvis=pelvis,chest=chest,neck=neck,shoulders={'near':near_sh,'far':far_sh},
             hips={'near':near_hip,'far':far_hip},headAngleDegrees=head_angle,
             torsoExpansion=expand,bodyLean=lean,headDuck=2.3*support)
    feet={}
    if action in ('walk','overhead-walk'):
        # Eight distinct, asymmetric foot paths: stance translates backwards;
        # swing folds under the pelvis, then extends without a bicycle circle.
        gait=[(4.6,-7,0),(2.7,0,0),(0,0,0),(-2.8,4,0),
              (-4.5,15,0),(-3.3,5,2.2),(-.5,-4,3.0),(3.0,-9,1.6)]
        for side,off in [('near',0),('far',4)]:
            step=(phase+off)%8;dx,roll,lift=gait[step]
            feet[side]=foot(center+dx,roll,airborne=lift,z=.6 if side=='far' else 0)
            feet[side]['phaseFamily']=['contact','compression','passing-stance','terminal-stance','toe-off','early-swing','passing-swing','late-swing'][step]
    elif rear:
        f['notes'].append('Knees flex toward ladder depth (+z); projected lengths are intentionally shorter than 3-D segment lengths.')
        for side,offset,sgn in [('near',0,1),('far',2,-1)]:
            q=(phase+offset)%4
            feet[side]=foot(center+sgn*3.7,0,airborne=[0,2.0,4.0,2.0][q],rear=True,z=2.4)
            feet[side]['contact']='rung' if q in (0,2) else 'rung-transfer'
    elif action in ('rise','fall','float'):
        lift={'rise':[(5.3,3.0),(6.2,4.5)],'fall':[(3.8,2.),(1.7,.5)],'float':[(3.,4.),(3.5,3.),(2.8,2.),(2.,3.)]}[action][phase]
        feet={'near':foot(34.5,-7,airborne=lift[0]),'far':foot(28.8,10,airborne=lift[1],z=.6)}
    elif action in ('bash','sword','bow'):
        spread=4.4 if action!='bash' else [3.,3.5,5.,5.5,4.,3.][phase]
        feet={'near':foot(center+spread,0),'far':foot(center-spread,10 if action=='bash' and phase in (2,3) else 0,z=.6)}
    else:
        feet={'near':foot(34.0,0),'far':foot(30.0,0,z=.6)}
    limbs={}
    for side,hip in [('near',near_hip),('far',far_hip)]:
        bend=p((.2 if side=='near' else -.2),0,1) if rear else p(1,0,0)
        limbs[side+'Leg']=ik(hip,feet[side]['ankle'],h['thigh'],h['shin'],bend)
    for side,sh,offset in [('near',near_sh,0),('far',far_sh,4)]:
        if action in ('walk','overhead-walk'):
            theta=(phase+offset)*TAU/8
            arm=arm_fk(sh,h['upper'],h['fore'],-22*math.cos(theta),22+4*math.sin(theta))
        elif rear:
            q=(phase+(0 if side=='far' else 2))%4
            sign=1 if side=='near' else -1
            end=p(32+sign*6.4,[27.0,28.7,30.8,29.0][q],2.4)
            arm=ik(sh,end,h['upper'],h['fore'],p(sign,0,-.35))
        else: arm=arm_fk(sh,h['upper'],h['fore'],-5,22)
        limbs[side+'Arm']=arm
    # Complete action chains are posed from the shoulder, never grafted body rows.
    if action in ('rise','fall','land','hurt','bash','sword','bow','float'):
        if action=='rise':angles=[(-65,60),(-80,55)][phase];far_angles=(-45,50)
        elif action=='fall':angles=[(23,45),(30,35)][phase];far_angles=(-30,30)
        elif action=='land':angles=[(28,45),(14,30),(-5,22)][phase];far_angles=(-20,25)
        elif action=='hurt':angles=(-45,90);far_angles=(20,65)
        elif action=='bash':angles=[(-20,60),(-15,80),(25,60),(36,46),(18,50),(-5,24)][phase];far_angles=(-25,55)
        elif action=='sword':angles=[(-20,82),(-90,60),(-45,105),(55,30),(45,15),(0,35)][phase];far_angles=(-22,45)
        elif action=='bow':angles=(65,18);far_angles=(-22,85)
        else:angles=(-80,40);far_angles=(-90,45)
        limbs['nearArm']=arm_fk(near_sh,h['upper'],h['fore'],*angles)
        limbs['farArm']=arm_fk(far_sh,h['upper'],h['fore'],*far_angles)
    f['feet']=feet;f['limbs']=limbs
    for side,ft in feet.items():
        if ft['contact']!='airborne':f['contacts'].append({'limb':side+'Leg','kind':ft['contact'],'soleExclusive':ft['soleExclusive']})
    if hero=='baleog': equipment_baleog(f,h)
    if hero=='olaf': equipment_olaf(f,h)
    return f

def equipment_baleog(f,h):
    a=f['action']; n=f['phase'];limbs=f['limbs']
    if a=='bow':
        # A near arm extends into the bow; the far draw hand returns to the jaw.
        grip=p(43.5,37.0)
        limbs['nearArm']=ik(f['shoulders']['near'],grip,h['upper'],h['fore'],p(0,1,0))
        draw=p([39.5,37.0,35.5,35.5,39.5,41.5][n],36.0,.6)
        limbs['farArm']=ik(f['shoulders']['far'],draw,h['upper'],h['fore'],p(-1,1,0))
        f['equipment'].append({'type':'bow','grip':grip,'drawHand':draw,'height':19,'release':n>=4})
    elif a in ('climb','rise','fall'):
        f['equipment'].append({'type':'sheathed-sword','grip':p(27.5,39.0),'angle':106,'length':14})
    else:
        angle=[-105,-130,-35,20,60,-65][n] if a=='sword' else -70
        f['equipment'].append({'type':'sword','grip':limbs['nearArm']['end'],'angle':angle,'length':15})

def equipment_olaf(f,h):
    a=f['action']; n=f['phase'];up=a.startswith('overhead') or a=='float'
    t=1. if up else n/6 if a=='shield-raise' else 1-n/6 if a=='shield-lower' else 0.
    rear=f['view'].startswith('rear')
    if rear and not up:
        center=p(32,46);angle=0
        f['equipment'].append({'type':'shield','center':center,'angleDegrees':0,'nativeSize':[14,24],
                               'worldSize':[28,48],'attachment':'back-straps','paintOrder':'over-torso-before-arms'})
        return
    # Exact endpoint geometry from hero-geometry.js: world x28/y20 to x0/y-36.
    center=p(32+14*(1-t),40+10-28*t)
    angle=-90*t
    a_rad=math.radians(angle)
    def local(u,v):return add(center,p(u*math.cos(a_rad)-v*math.sin(a_rad),u*math.sin(a_rad)+v*math.cos(a_rad)))
    if t==1:
        # Supporting palms touch physical underside, not the center rider plane.
        grips={'near':p(41,29),'far':p(23,29,.6)}
        if a=='overhead-climb':
            # One hand bears the plate while its partner reaches/pulls on the
            # ladder. Alternate anatomical identities every half cycle.
            reach_side='far' if n<2 else 'near'
            del grips[reach_side]
            sign=-1 if reach_side=='far' else 1
            ladder_grip=p(32+sign*6.4,31.0+2.0*(n%2),2.4)
            f['limbs'][reach_side+'Arm']=ik(f['shoulders'][reach_side],ladder_grip,h['upper'],h['fore'],p(sign,0,-.4))
            f['contacts'].append({'limb':reach_side+'Arm','kind':'ladder-grip','point':ladder_grip})
            f['notes'].append('One palm supports the fixed shield underside; the opposite hand reaches/pulls the ladder. Shield support changes hands after each two-pose pull.')
    else:
        # Front grip is on the inside strap: concealed behind the opaque face.
        # During raising the second hand joins the lower rim continuously.
        front=local(-5.2,-6.2)
        grips={'near':lerp(front,p(41,29),t)}
        if t>0:
            start=f['limbs']['farArm']['end']
            grips['far']=lerp(start,p(23,29,.6),t)
    for side,grip in grips.items():
        sh=f['shoulders'][side]
        # Raising arm lifts shoulder with scapular rotation; neither bone stretches.
        lifted=add(sh,p((-.3 if side=='far' else .3)*t,-.5*t))
        f['shoulders'][side]=lifted
        bend=p(-1 if side=='far' else 1,1,0)
        f['limbs'][side+'Arm']=ik(lifted,grip,h['upper'],h['fore'],bend)
        f['contacts'].append({'limb':side+'Arm','kind':'shield-underside' if t==1 else 'shield-interior-strap','point':grip})
    f['equipment'].append({'type':'shield','center':center,'angleDegrees':angle,
                           'nativeSize':[14,24],'worldSize':[28,48],'grips':grips,
                           'walkingPlaneNativeY':22 if t==1 else None,
                           'walkingPlaneWorldYRelativeOrigin':-36 if t==1 else None,
                           'attachment':'palms-under-rim' if t==1 else 'interior-strap',
                           'paintOrder':'after-arms-hides-gripping-palm','raiseFraction':t})

def poly(d,pts,fill):d.polygon([xy(q) for q in pts],fill=fill)
def disc(d,at,r,fill):
    x,y=xy(at);r=round(r);d.ellipse((x-r,y-r,x+r,y+r),fill=fill)
def segment(d,a,b,ra,rb,fill):
    v=unit(p(b[0]-a[0],b[1]-a[1]));per=p(-v[1],v[0])
    poly(d,[add(a,mul(per,ra)),add(b,mul(per,rb)),sub(b,mul(per,rb)),sub(a,mul(per,ra))],fill)
def limb(d,chain,kind,side,h):
    a,b,c=chain['start'],chain['joint'],chain['end'];near=side=='near'
    if kind=='Leg':
        radii=(1.75*h['mass'],1.45*h['mass'],1.05*h['mass'])
        main=h['pants'] if near else h['farPants']; end='#a17a53' if near else '#655643'
    else:
        radii=(1.45*h['mass'],1.05*h['mass'],.85*h['mass'])
        main='#e3ad7d' if near else '#956f58';end=main
    for extra,col1,col2 in [(.7,EDGE,EDGE),(0,main,end)]:
        segment(d,a,b,radii[0]+extra,radii[1]+extra,col1)
        segment(d,b,c,radii[1]+extra,radii[2]+extra,col2)
        disc(d,b,radii[1]+extra,col1)
    if kind=='Arm':
        sleeve=lerp(a,b,.38)
        segment(d,a,sleeve,radii[0],radii[0]*.85,h['cloth'] if near else h['clothDark'])
        disc(d,c,.8*h['mass'],end)

def torso(d,f,h):
    pel=f['pelvis'];near=f['shoulders']['near'];far=f['shoulders']['far']
    cy=f['chest'][1];cx=f['chest'][0];sy=(near[1]+far[1])/2
    rear=f['view'].startswith('rear');sw=h['shoulder']/2;ww=h['waist']/2;pw=h['pelvis']/2
    if not rear:sw*=.85
    left=cx-sw;right=cx+sw;breath=f['torsoExpansion']
    outline=[p(cx-1.8,sy-1),p(left+.5,sy-.3),p(left-.8,sy+2.5),
             p(cx-ww-breath,cy+2.4),p(pel[0]-pw,pel[1]+1.8),
             p(pel[0]+pw,pel[1]+1.8),p(cx+ww+breath,cy+2.4),
             p(right+.7,sy+2),p(right-.3,sy-.3),p(cx+1.6,sy-1)]
    poly(d,outline,EDGE)
    fill=[p(cx-1.7,sy),p(left+1,sy+.7),p(left+.5,sy+3),
          p(cx-ww+1-breath,cy+2.2),p(pel[0]-pw+1,pel[1]+.7),
          p(pel[0]+pw-1,pel[1]+.7),p(cx+ww-1+breath,cy+2.2),
          p(right-.4,sy+2),p(right-1,sy+.7),p(cx+1.5,sy)]
    poly(d,fill,h['cloth'])
    # One coherent side plane follows ribcage-to-pelvis; no horizontal image seam.
    poly(d,[p(left+1,sy+1),p(cx-1,sy+2),p(pel[0]-.8,pel[1]-.7),
            p(pel[0]-pw+1,pel[1]+.7),p(cx-ww+1,cy+2.2)],h['clothDark'])
    belt_y=pel[1]-1
    d.line([xy(p(pel[0]-pw+.6,belt_y-.2)),xy(p(pel[0]+pw-.6,belt_y+.2))],fill='#584b3f',width=2)
    if not rear:d.point(xy(p(pel[0]+1,belt_y)),fill='#dbc288')

def head(d,f,h):
    neck=f['neck'];rear=f['view'].startswith('rear'); angle=math.radians(f['headAngleDegrees'])
    # Neck is the rotation pivot. Polygon vertices are authored anew each pose.
    # Neutral top is y26 / y24; head is seven native pixels plus neck, not 1/3 body.
    neutral_y=26-(h['height']-36)
    sh_base=35.8-(h['height']-36)*.7
    top=neutral_y+((f['shoulders']['near'][1]+f['shoulders']['far'][1])/2-sh_base)+f['headDuck']
    pivot=p(neck[0],top+8.2)
    def pt(x,y):
        return p(pivot[0]+x*math.cos(angle)-y*math.sin(angle),pivot[1]+x*math.sin(angle)+y*math.cos(angle))
    segment(d,neck,pivot,1.3,1.3,EDGE)
    segment(d,neck,pivot, .6,.7,'#b77d5b')
    if rear:
        poly(d,[pt(-3,-6),pt(-2,-8),pt(2,-8),pt(3,-6),pt(3,-1),pt(1,1),pt(-2,0),pt(-3,-2)],EDGE)
        poly(d,[pt(-2,-6),pt(2,-6),pt(2,-1),pt(0,0),pt(-2,-1)],h['hair'])
        poly(d,[pt(-3,-5),pt(-3,-7),pt(-1,-8),pt(1,-8),pt(3,-7),pt(3,-5)],'#97adae')
        d.line([xy(pt(-2,-6)),xy(pt(2,-6))],fill='#cbd4c3',width=1)
    else:
        poly(d,[pt(-3,-6),pt(-2,-8),pt(2,-8),pt(3,-6),pt(3,-4),pt(4,-3),
                pt(3,-2),pt(3,0),pt(0,1),pt(-2,-1),pt(-3,-3)],EDGE)
        poly(d,[pt(-2,-5),pt(2,-5),pt(2,-3),pt(3,-3),pt(2,-1),pt(0,0),pt(-2,-2)],'#e3ad7d')
        poly(d,[pt(-2,-2),pt(0,-1),pt(2,-1),pt(2,0),pt(0,1),pt(-2,-1)],h['hair'])
        poly(d,[pt(-3,-5),pt(-3,-6),pt(-2,-8),pt(1,-8),pt(3,-6),pt(3,-5)],'#97adae')
        d.line([xy(pt(-2,-6)),xy(pt(2,-6))],fill='#d5d9bf',width=1)
        d.point(xy(pt(2,-4)),fill=EDGE)
        d.point(xy(pt(-1,-3)),fill='#b57b55')
    f['head']={'neckPivot':pivot,'angleDegrees':f['headAngleDegrees'],'view':f['view'],
               'helmetTopNominal':top,'eyeDirection':'rear' if rear else [math.cos(angle),math.sin(angle)]}

def shield_image(eq):
    # One 14x24 native shield, inverse sampled on the same native lattice.
    # No resize or independently fitted frames; rotation leaves physical size fixed.
    out=Image.new('RGBA',(64,64));pix=out.load();cx,cy,_=eq['center'];a=math.radians(eq['angleDegrees'])
    co,si=math.cos(a),math.sin(a)
    for y in range(64):
        for x in range(64):
            dx=x+.5-cx;dy=y+.5-cy
            u=dx*co+dy*si+7;v=-dx*si+dy*co+12
            if 0<=u<14 and 0<=v<24:
                color=EDGE if u<1 or u>=13 or v<1 or v>=23 else '#bb9656'
                if 1<=u<3 and 1<=v<23:color='#dbc183'
                if 6<=u<8 and 1<=v<23:color='#a9b8ac'
                if abs(u-7)<2 and abs(v-12)<2:color='#687f80'
                pix[x,y]=tuple(bytes.fromhex(color.lstrip('#')))+(255,)
    return out

def equipment(d,f,im):
    for e in f['equipment']:
        typ=e['type']
        if typ=='shield':im.alpha_composite(shield_image(e));continue
        grip=e['grip']
        if typ=='bow':
            x,y,_=grip
            d.line([(round(x-1),round(y-9)),(round(x+3),round(y-6)),(round(x+5),round(y)),(round(x+3),round(y+6)),(round(x-1),round(y+9))],fill=EDGE,width=3)
            d.line([(round(x-1),round(y-9)),(round(x+3),round(y-6)),(round(x+5),round(y)),(round(x+3),round(y+6)),(round(x-1),round(y+9))],fill='#cda568',width=1)
            draw=e['drawHand']
            d.line([xy(p(x-1,y-9)),xy(draw),xy(p(x-1,y+9))],fill='#e0d8b4',width=1)
            if not e['release']:d.line([xy(draw),xy(p(x+11,y))],fill='#d0caa3',width=1)
            continue
        a=math.radians(e['angle']);tip=add(grip,p(math.cos(a)*e['length'],math.sin(a)*e['length']))
        d.line([xy(grip),xy(tip)],fill=EDGE,width=3)
        d.line([xy(grip),xy(tip)],fill='#afc8c5' if typ=='sword' else '#6a5c47',width=1)
        perp=p(-math.sin(a),math.cos(a));guard=add(grip,p(math.cos(a)*2,math.sin(a)*2))
        d.line([xy(add(guard,mul(perp,2))),xy(sub(guard,mul(perp,2)))],fill='#d4b36d',width=1)

def render(f):
    im=Image.new('RGBA',(64,64));d=ImageDraw.Draw(im);h=HEROES[f['hero']]
    for side in ('far','near'):
        limb(d,f['limbs'][side+'Leg'],'Leg',side,h)
        poly(d,f['feet'][side]['polygon'],EDGE)
        ankle=f['feet'][side]['ankle'];disc(d,ankle,.7,'#a17a53' if side=='near' else '#655643')
    limb(d,f['limbs']['farArm'],'Arm','far',h)
    torso(d,f,h)
    head(d,f,h)
    # A rear-stowed shield lies over the torso and under ladder-reaching arms.
    for e in f['equipment']:
        if e['type']=='shield' and e['attachment']=='back-straps':im.alpha_composite(shield_image(e))
    limb(d,f['limbs']['nearArm'],'Arm','near',h)
    if f['view'].startswith('rear'):limb(d,f['limbs']['farArm'],'Arm','far',h)
    equipment(d,{**f,'equipment':[e for e in f['equipment'] if e.get('attachment')!='back-straps']},im)
    f['opaqueBounds']=list(im.getbbox())
    return im

def rig_overlay(im,f,scale=5):
    out=im.resize((64*scale,64*scale),Image.Resampling.NEAREST)
    d=ImageDraw.Draw(out)
    colors={'nearArm':'#ffca40','farArm':'#d291fb','nearLeg':'#52dcda','farLeg':'#71a4ff'}
    for key,c in f['limbs'].items():
        pts=[(q[0]*scale,q[1]*scale) for q in (c['start'],c['joint'],c['end'])]
        d.line(pts,fill=colors[key],width=1)
        for x,y in pts:d.ellipse((x-2,y-2,x+2,y+2),fill=colors[key],outline=EDGE)
    return out

def sheet(frames,images):
    rows=math.ceil(len(images)/8);atlas=Image.new('RGBA',(512,rows*64))
    for n,im in enumerate(images):atlas.alpha_composite(im,(n%8*64,n//8*64))
    return atlas

def label_sheet(hero,frames,images,rig=False):
    scale=4;w=64*scale;title=38;foot_h=28;rows=math.ceil(len(frames)/8)
    out=Image.new('RGB',(8*w,rows*(w+foot_h)+title),BACK);d=ImageDraw.Draw(out)
    font=ImageFont.truetype('C:/Windows/Fonts/consola.ttf',14)
    d.text((10,8),hero.upper()+' / native 64x64 / 4x nearest / '+('JOINT PROJECTION' if rig else 'ANATOMICAL GUIDE'),fill=EDGE,font=font)
    for n,(f,im) in enumerate(zip(frames,images)):
        x=n%8*w;y=n//8*(w+foot_h)+title
        tile=Image.new('RGBA',(w,w),'#edece2')
        td=ImageDraw.Draw(tile)
        for gx in range(0,w,16):td.line([(gx,0),(gx,w)],fill='#e3e2d7')
        for gy in range(0,w,16):td.line([(0,gy),(w,gy)],fill='#e3e2d7')
        td.line([(0,62*scale),(w,62*scale)],fill='#a2aba3')
        art=rig_overlay(im,f,scale) if rig else im.resize((w,w),Image.Resampling.NEAREST)
        tile.alpha_composite(art);out.paste(tile.convert('RGB'),(x,y))
        d.text((x+5,y+w+1),f'{n:02} {f["action"]} {f["phase"]}',fill=EDGE,font=font)
        d.rectangle((x,y,x+w-1,y+w+foot_h-1),outline='#b9c0b6')
    return out

def animation(hero,frames,images,action,scale=6):
    chosen=[(f,im) for f,im in zip(frames,images) if f['action']==action]
    if not chosen:return
    font=ImageFont.truetype('C:/Windows/Fonts/consola.ttf',16)
    seq=[]
    for f,im in chosen:
        can=Image.new('RGB',(64*scale*2,64*scale+46),BACK);d=ImageDraw.Draw(can)
        if 'climb' in action:
            for origin in (0,64*scale):
                for rail in (25.6,38.4):d.line([(origin+round(rail*scale),18*scale),(origin+round(rail*scale),62*scale)],fill='#a8b3a7',width=3)
                for rung in range(27,63,7):d.line([(origin+26*scale,rung*scale),(origin+38*scale,rung*scale)],fill='#b8bdb0',width=3)
        d.line([(0,62*scale),(128*scale,62*scale)],fill='#8d9b90',width=1)
        art=im.resize((64*scale,64*scale),Image.Resampling.NEAREST)
        can.paste(art,(0,0),art);mir=art.transpose(Image.Transpose.FLIP_LEFT_RIGHT);can.paste(mir,(64*scale,0),mir)
        d.text((8,64*scale+4),f'{hero} {action} {f["phase"]} | RIGHT / MIRRORED LEFT',font=font,fill=EDGE)
        seq.append(can)
    durations=140 if 'walk' in action else 260 if 'climb' in action else 300
    seq[0].save(OUT/f'{hero}-{action}-6x.gif',save_all=True,append_images=seq[1:],duration=durations,loop=0,disposal=2)

def actions_for(hero,first=False):
    actions=[('walk',8),('idle',4),('look-up',1),('look-down',1),('climb',4)]
    if first:return actions
    actions += [('rise',2),('fall',2),('land',3),('hurt',1)]
    if hero=='erik':actions += [('bash',6)]
    elif hero=='baleog':actions += [('sword',6),('bow',6)]
    else:actions += [('overhead-walk',8),('overhead-idle',4),('shield-raise',7),('shield-lower',7),('overhead-climb',4),('float',4)]
    return actions

def save_hero(hero,first=False):
    frames=[];images=[]
    for action,count in actions_for(hero,first):
        for phase in range(count):
            f=base_pose(hero,action,phase);f['cell']=len(frames)
            im=render(f);frames.append(f);images.append(im)
    atlas=sheet(frames,images);atlas.save(OUT/f'{hero}-guide-native.png')
    atlas.resize((atlas.width*2,atlas.height*2),Image.Resampling.NEAREST).save(OUT/f'{hero}-guide-2x.png')
    atlas.resize((atlas.width*4,atlas.height*4),Image.Resampling.NEAREST).save(OUT/f'{hero}-guide-4x.png')
    density=Image.new('RGB',(atlas.width*3+30,atlas.height*2+40),BACK)
    dd=ImageDraw.Draw(density);font=ImageFont.truetype('C:/Windows/Fonts/consola.ttf',14)
    dd.text((10,8),f'{hero}: actual native source 1x',fill=EDGE,font=font)
    dd.text((atlas.width+20,8),'same source, 2x nearest-neighbor / GUIDE ONLY',fill=EDGE,font=font)
    density.paste(atlas,(10,32),atlas)
    twice=atlas.resize((atlas.width*2,atlas.height*2),Image.Resampling.NEAREST)
    density.paste(twice,(atlas.width+20,32),twice)
    density.save(OUT/f'{hero}-native-density-review.png')
    label_sheet(hero,frames,images).save(OUT/f'{hero}-frame-key.png')
    label_sheet(hero,frames,images,True).save(OUT/f'{hero}-joint-key.png')
    data={'schema':'vikings78.anatomical-guide.v1','hero':hero,'cell':[64,64],
          'worldCell':[128,128],'nativePixelWorldSize':2,'origin':[32,40],
          'groundSoleExclusive':62,'neutralOpaqueBodyHeight':HEROES[hero]['height'],
          'coordinates':'native XYZ; +x forward in side view, +y down, +z toward ladder in rear view',
          'limbIdentity':{'near':'anatomical right, nearest viewer in side view; screen right in rear view',
                          'far':'anatomical left, farthest from viewer in side view; screen left in rear view'},
          'jointNames':{'Arm':['shoulder','elbow','wrist'],'Leg':['hip','knee','ankle']},
          'palette':HEROES[hero],'frames':frames}
    (OUT/f'{hero}-guide.json').write_text(json.dumps(data,indent=2)+'\n')
    for action in ('idle','walk','climb','overhead-walk','overhead-climb','float','sword','bow','bash','shield-raise','shield-lower'):
        animation(hero,frames,images,action)
    print(f'{hero}: {len(frames)} frames; {atlas.size}; files saved in {OUT}')

if __name__=='__main__':
    import argparse
    parser=argparse.ArgumentParser();parser.add_argument('--hero',choices=list(HEROES),default=None);parser.add_argument('--first',action='store_true')
    args=parser.parse_args()
    for hero in ([args.hero] if args.hero else HEROES):save_hero(hero,args.first)
