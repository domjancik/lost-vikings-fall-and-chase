"""Focused81 guide checks; native visual review is still a separate gate."""
from pathlib import Path
import importlib.util
import json
import math
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('guide81_checks78',Path(__file__).with_name('validate-vikings78.py'))
C=importlib.util.module_from_spec(spec);spec.loader.exec_module(C)

def main():
    errors=[]
    def check(ok,msg):
        if not ok:errors.append(msg)
    for hero,height in [('erik',36),('baleog',38),('olaf',36)]:
        data=json.loads((ROOT/'assets'/'vikings81'/f'{hero}-guide.json').read_text())
        atlas=Image.open(ROOT/'assets'/'vikings81'/f'{hero}-guide-native.png').convert('RGBA')
        legacy=C.validate(data,atlas)
        #81 intentionally adds horns above the anatomical body. No other legacy
        #failure is waived; verify the separately rasterized anatomical bounds.
        expected_exception=f'{hero}:8:idle neutral visible height changed'
        errors.extend(e for e in legacy if e!=expected_exception)
        idle=data['frames'][8]['bodyOpaqueBoundsWithoutEquipmentOrCostume']
        check(idle[3]-idle[1]==height,f'{hero}: anatomical body height changed')
        check(set(atlas.getchannel('A').tobytes()) <= {0,255},f'{hero}: nonbinary alpha')
        for f in data['frames']:
            check(f['bodyHeightTargetExcludesCostume']==height,f'{hero}: body target changed')
            beard=f.get('secondaryMotion',{}).get('beard',{})
            points=beard.get('points',[])
            if points:
                actual=[math.dist(a,b) for a,b in zip(points,points[1:])]
                check(all(abs(a-b)<1e-5 for a,b in zip(actual,beard['segmentLengthsNative'])),f'{hero}: beard length changes')
            if hero=='erik' and f['action']=='walk':
                airborne=all(ft['contact']=='airborne' for ft in f['feet'].values())
                check(airborne==(f['phase'] in (3,7)),f'Erik phase{f["phase"]}: wrong flight contact')
                check(f['dynamicRun']['flight']==airborne,'Erik: flight metadata disagrees')
                check(beard.get('lengthNative')==9,'Erik: beard is not long')
                check(points and points[-1][0]<points[0][0]-6,'Erik: beard fails to trail')
            if hero=='olaf':
                eq=next(e for e in f['equipment'] if e['type']=='shield')
                check(eq['physicalDiameterNative']==24,'Olaf: physical shield resized')
                for side,grip in eq.get('grips',{}).items():
                    check(math.dist(f['limbs'][side+'Arm']['end'],grip)<1e-5,'Olaf: hand misses moving grip')
                if f['action'] in ('idle','walk'):
                    check(eq['actualGroundClearanceNative']>=4,'Olaf: held shield touches floor')
                    check(abs(eq['projectionSize'][0]-24/math.sqrt(2))<1e-5,'Olaf: oblique projection lost')
                    check(eq['rollDegrees']==-8,'Olaf: slight roll lost')
                    check(f['costume']['helmet']['eyeCovered'],'Olaf: eye-covering helmet lost')
                if f['action'].startswith('overhead') or f['action']=='float':
                    check(eq['walkingPlaneNativeY']==22,'Olaf: rider plane changed')
                    check(eq['undersideNativeY']==25,'Olaf: overhead underside changed')
                    check(min(p[1] for chain in f['costume']['horns']['chains'] for p in chain)>=25,'Olaf: horns intersect overhead shield')
        print(f'{hero}: {len(data["frames"])} native frames checked')
    if errors:raise AssertionError('\n'.join(errors))
    print('PASS: fixed anatomy, ground/flight contacts,9px flexible beard, oblique held shield, eye-covering helmet and horn clearance.')
    print('Visual source acceptance and actual-game runtime approval remain separate.')

if __name__=='__main__':main()
