"""Reproduce the historical pixel pack from tracked originals, into output only."""
import argparse
import hashlib
import importlib.metadata
import importlib.util
import json
import os
from pathlib import Path
import platform
import sys
import time

ROOT = Path(__file__).resolve().parents[3]
TOOL_ROOT = Path(os.environ.get('PIXEL_FIXER_ROOT', ROOT / 'tools/pixel-art-fixer')).resolve()
sys.path.insert(0, str(TOOL_ROOT / 'python'))
import cv2
import numpy as np
from PIL import Image
from pixelfixer.reconstruct import two_stage_pack


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def safe_output_root(value):
    result = value.resolve()
    if not result.is_relative_to((ROOT / 'output').resolve()) or result == (ROOT / 'output').resolve():
        raise ValueError('Rebuild destination must be a subdirectory of repository output/, never reviewed assets')
    return result


def verify_source(source, expected):
    if sha256(source.read_bytes()) != expected:
        raise ValueError('Original source checksum mismatch: ' + str(source))


def out_of_range(source, fixed):
    h, w = source.shape[:2]
    rows, cols = fixed.shape[:2]
    if cols > w or rows > h:
        raise ValueError('This historical pack supports downsampling only')
    xs = np.ceil(np.arange(cols) * w / cols).astype(int)
    ys = np.ceil(np.arange(rows) * h / rows).astype(int)
    rgb = source[:, :, :3]
    lo = np.minimum.reduceat(np.minimum.reduceat(rgb, xs, axis=1), ys, axis=0)
    hi = np.maximum.reduceat(np.maximum.reduceat(rgb, xs, axis=1), ys, axis=0)
    return int(np.any((fixed[:, :, :3] < lo) | (fixed[:, :, :3] > hi), axis=2).sum())


def normalize(image, size):
    # Fix OpenCV's separate global RNG as well as upstream's NumPy seed.
    cv2.setNumThreads(1)
    cv2.setRNGSeed(42)
    source = np.array(image.convert('RGBA'))
    fixed = two_stage_pack(source, *size)
    if out_of_range(source, fixed):
        raise ValueError('Normalization invented colors outside their source cells')
    if not set(np.unique(fixed[:, :, 3])).issubset({0, 255}):
        raise ValueError('Nonbinary alpha')
    return Image.fromarray(fixed)


def validate(spec, source, image):
    if list(image.size) != spec['size']:
        raise ValueError('Changed atlas dimensions: ' + spec['target'])
    if not set(np.unique(np.array(image)[:, :, 3])).issubset({0, 255}):
        raise ValueError('Nonbinary alpha: ' + spec['target'])
    if 'pieces' in spec:
        invalid = 0
        for part in spec['pieces']:
            x, y = part['at']
            w, h = part['size']
            invalid += out_of_range(np.array(source.crop(tuple(part['crop']))), np.array(image.crop((x, y, x + w, y + h))))
    else:
        if 'crop' in spec:
            source = source.crop(tuple(spec['crop']))
        invalid = out_of_range(np.array(source), np.array(image))
    if invalid:
        raise ValueError(f"{spec['target']}: {invalid} colors outside source cells")


def verify_toolchain():
    module_spec = importlib.util.spec_from_file_location('pixel_setup', Path(__file__).with_name('setup-pixel-fixer.py'))
    setup = importlib.util.module_from_spec(module_spec)
    module_spec.loader.exec_module(setup)
    config = setup.configuration()
    setup.verify_checkout(TOOL_ROOT)
    setup.apply_fix(TOOL_ROOT, check_only=True)
    versions = {name: importlib.metadata.version(name) for name in config['dependencies']}
    if versions != config['dependencies'] or '.'.join(map(str, sys.version_info[:2])) != config['python']:
        raise RuntimeError('Use Python ' + config['python'] + ' and tools/art/pixel/requirements.txt; detected ' + json.dumps(versions))
    return {'python': platform.python_version(), 'platform': platform.platform(), 'packages': versions, 'upstreamCommit': config['upstreamCommit'], 'patchSha256': config['patchSha256'], 'seed': 42, 'opencvThreads': 1}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--only', help='Select target paths containing this text')
    parser.add_argument('--output-root', type=Path, default=ROOT / 'output/pixel-rebuild')
    parser.add_argument('--check', action='store_true', help='Validate an existing output tree without rebuilding')
    parser.add_argument('--verify-reference', action='store_true', help='Compare decoded pixel hashes with the checked-in reference run')
    args = parser.parse_args()
    environment = verify_toolchain()
    destination = safe_output_root(args.output_root)
    specs = json.loads((ROOT / 'tools/pixel-assets.json').read_text())
    specs = [s for s in specs if not args.only or args.only in s['target']]
    if not specs:
        raise ValueError('No targets match --only')
    # Check every selected source before creating any output.
    for spec in specs:
        source = (ROOT / spec['source']).resolve()
        if not source.is_relative_to((ROOT / 'assets').resolve()):
            raise ValueError('Source must be a tracked original under assets/')
        verify_source(source, spec['sourceSha256'])
    reference = {}
    if args.verify_reference:
        reference = json.loads((ROOT / 'tools/art/pixel/reference-hashes.json').read_text())['decodedRgbaSha256']
    rows = []
    for spec in specs:
        start = time.time()
        source = Image.open(ROOT / spec['source']).convert('RGBA')
        target = (destination / spec['target']).resolve()
        if not target.is_relative_to(destination):
            raise ValueError('Target escapes output tree')
        if args.check:
            result = Image.open(target).convert('RGBA')
        elif 'pieces' in spec:
            result = Image.new('RGBA', tuple(spec['size']))
            for part in spec['pieces']:
                result.paste(normalize(source.crop(tuple(part['crop'])), part['size']), tuple(part['at']))
        else:
            cell = source.crop(tuple(spec['crop'])) if 'crop' in spec else source
            result = normalize(cell, spec['size'])
        validate(spec, source, result)
        digest = sha256(np.array(result).tobytes())
        if args.verify_reference and digest != reference.get(spec['target']):
            raise ValueError('Decoded pixels differ from reference: ' + spec['target'])
        if not args.check:
            target.parent.mkdir(parents=True, exist_ok=True)
            result.save(target)
        row = {'target': spec['target'], 'source': spec['source'], 'sourceSha256': spec['sourceSha256'], 'size': spec['size'], 'decodedRgbaSha256': digest, 'pngSha256': sha256(target.read_bytes()), 'invalidColors': 0, 'seconds': round(time.time() - start, 2)}
        rows.append(row)
        print(json.dumps(row), flush=True)
    destination.mkdir(parents=True, exist_ok=True)
    (destination / 'report.json').write_text(json.dumps({'environment': environment, 'assets': rows, 'checkOnly': args.check}, indent=2) + '\n')
    print(f"{'Checked' if args.check else 'Rebuilt'} {len(rows)} assets in {destination}; reviewed runtime art was not modified", flush=True)


if __name__ == '__main__':
    main()
