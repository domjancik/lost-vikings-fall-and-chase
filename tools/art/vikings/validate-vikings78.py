"""Independent geometry/registration checks. These never replace visual review."""
from pathlib import Path
from PIL import Image
import argparse, copy, json, math

EXPECTED_HEIGHT = {'erik': 36, 'baleog': 38, 'olaf': 36}

def validate(meta, sheet):
    errors = []
    def check(ok, message):
        if not ok: errors.append(message)
    hero = meta['hero']
    check(meta['cell'] == [64, 64], 'cell must be native64x64')
    check(meta['origin'] == [32, 40], 'origin changed')
    check(meta['groundSoleExclusive'] == 62, 'ground plane changed')
    check(meta['neutralOpaqueBodyHeight'] == EXPECTED_HEIGHT[hero], 'native body target changed')
    check(sheet.width % 64 == 0 and sheet.height % 64 == 0, 'sheet is not an integer cell grid')
    columns = sheet.width // 64
    check(columns * (sheet.height // 64) >= len(meta['frames']), 'missing cells')
    lengths, walk_frames, foot_spreads = {}, [], []
    for index, frame in enumerate(meta['frames']):
        label = f'{hero}:{index}:{frame["action"]}'
        check(frame['registration']['origin'] == [32, 40], label + ' root changed')
        for name, chain in frame['limbs'].items():
            joints = [chain[key] for key in ['start', 'joint', 'end']]
            check(all(len(p) == 3 and all(math.isfinite(v) for v in p) for p in joints), label + ' invalid XYZ')
            actual = [math.dist(joints[0], joints[1]), math.dist(joints[1], joints[2])]
            declared = chain['lengths']
            check(all(abs(a-b) < 1e-5 for a, b in zip(actual, declared)), label + ':' + name + ' stretched bone')
            if name not in lengths: lengths[name] = declared
            check(all(abs(a-b) < 1e-5 for a, b in zip(declared, lengths[name])), label + ':' + name + ' nominal length changed')
            check(all(0 <= p[0] < 64 and 0 <= p[1] < 64 for p in joints), label + ':' + name + ' outside cell')
            if frame['action'] == 'idle' and name.endswith('Leg'):
                check(chain['flexionDegrees'] <= 25, label + ':' + name + ' crouched neutral knee')
        rect = (index % columns * 64, index // columns * 64,
                index % columns * 64 + 64, index // columns * 64 + 64)
        cell = sheet.crop(rect)
        bbox = cell.getbbox()
        check(bbox is not None, label + ' empty art')
        grounded = any(c.get('limb', '').endswith('Leg') and c.get('soleExclusive') == 62
                       for c in frame.get('contacts', []))
        if grounded:
            check(bbox and bbox[3] == 62, label + ' actual opaque sole misses declared plane')
        if frame['action'] == 'idle' and frame['phase'] == 0:
            check(bbox and bbox[3]-bbox[1] == EXPECTED_HEIGHT[hero], label + ' neutral visible height changed')
        if frame['action'] == 'walk':
            walk_frames.append(cell.tobytes())
            foot_spreads.append(frame['limbs']['nearLeg']['end'][0] - frame['limbs']['farLeg']['end'][0])
    check(len(walk_frames) == 8, 'missing eight-phase walk')
    check(len(set(walk_frames)) == 8, 'duplicate native walk cells')
    check(foot_spreads and min(foot_spreads) < -2 and max(foot_spreads) > 2, 'near/far feet never exchange')
    check(sum(f['action'] == 'climb' for f in meta['frames']) == 4, 'missing four-phase rear climb')
    return errors

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--hero', choices=list(EXPECTED_HEIGHT))
    parser.add_argument('--self-test', action='store_true')
    args = parser.parse_args()
    for hero in ([args.hero] if args.hero else list(EXPECTED_HEIGHT)):
        root = Path('assets/vikings78')
        meta = json.loads((root / f'{hero}-guide.json').read_text())
        sheet = Image.open(root / f'{hero}-guide-native.png').convert('RGBA')
        errors = validate(meta, sheet)
        if errors: raise AssertionError('\n'.join(errors))
        if args.self_test:
            stretched = copy.deepcopy(meta)
            stretched['frames'][0]['limbs']['nearArm']['end'][0] += 2
            assert any('stretched bone' in e for e in validate(stretched, sheet))
            bad_sole = sheet.copy(); bad_sole.putpixel((32, 63), (255, 255, 255, 255))
            assert any('sole misses' in e for e in validate(meta, bad_sole))
        print(f'{hero}: {len(meta["frames"])}cells, fixed XYZ limb lengths, native scale and sole checks pass')
    print('Visual gate still required; these checks do not approve final art or gameplay.')
