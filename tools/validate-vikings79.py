"""Independent held-shield checks; visual review remains mandatory."""
import copy, importlib.util, json, math
from pathlib import Path
from PIL import Image

spec = importlib.util.spec_from_file_location('guide_checks', Path(__file__).with_name('validate-vikings78.py'))
checks = importlib.util.module_from_spec(spec)
spec.loader.exec_module(checks)

def validate(meta, sheet):
    errors = checks.validate(meta, sheet)
    centers = []
    for f in meta['frames']:
        shield = next(e for e in f['equipment'] if e['type'] == 'shield')
        if f['action'] in ('walk', 'idle'):
            centers.append(shield['center'][1])
            if shield['center'][1] + 12 > 58:
                errors.append('held shield drags or nearly touches floor')
            for side, grip in shield.get('grips', {}).items():
                if math.dist(f['limbs'][side+'Arm']['end'], grip) > 1e-5:
                    errors.append('hand loses shield grip')
        if f['action'].startswith('overhead') or f['action'] == 'float':
            if shield['walkingPlaneNativeY'] != 22:
                errors.append('overhead rider plane changes')
    if not centers or not .2 <= max(centers)-min(centers) <= 2:
        errors.append('held shield bob absent or excessive')
    return errors

if __name__ == '__main__':
    root = Path('assets/vikings79')
    meta = json.loads((root/'olaf-guide.json').read_text())
    sheet = Image.open(root/'olaf-guide-native.png').convert('RGBA')
    errors = validate(meta, sheet)
    if errors:
        raise AssertionError('\n'.join(errors))
    bad = copy.deepcopy(meta)
    next(e for e in bad['frames'][0]['equipment'] if e['type']=='shield')['center'][1] = 50
    assert any('drags' in e for e in validate(bad, sheet))
    print('Olaf79: fixed bones, native scale, soles, shield clearance, held bob and rider plane pass.')
    print('Visual source and runtime gates remain separate.')
