"""Validate the retained pixel recipes; optionally refresh reviewed input hashes."""
import argparse
import hashlib
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[3]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--refresh-source-hashes', action='store_true', help='Explicitly accept changed source files after reviewing them')
    args = parser.parse_args()
    manifest = ROOT / 'tools/pixel-assets.json'
    specs = json.loads(manifest.read_text())
    targets = set()
    for spec in specs:
        if spec['target'] in targets:
            raise ValueError('Duplicate target: ' + spec['target'])
        targets.add(spec['target'])
        source = (ROOT / spec['source']).resolve()
        if not source.is_relative_to((ROOT / 'assets').resolve()):
            raise ValueError('Source must be inside repository assets/: ' + spec['source'])
        digest = hashlib.sha256(source.read_bytes()).hexdigest()
        if not args.refresh_source_hashes and digest != spec['sourceSha256']:
            raise ValueError('Source checksum mismatch: ' + spec['source'])
        spec['sourceSha256'] = digest
        with Image.open(source) as image:
            for part in spec.get('pieces', [spec]):
                if 'crop' in part:
                    x0, y0, x1, y1 = part['crop']
                    if not (0 <= x0 < x1 <= image.width and 0 <= y0 < y1 <= image.height):
                        raise ValueError('Crop leaves original image: ' + spec['target'])
                if 'at' in part:
                    x, y = part['at']
                    w, h = part['size']
                    if not (0 <= x and 0 <= y and x + w <= spec['size'][0] and y + h <= spec['size'][1]):
                        raise ValueError('Piece leaves target atlas: ' + spec['target'])
    if args.refresh_source_hashes:
        manifest.write_text(json.dumps(specs, indent=2) + '\n')
    print(f'Validated {len(specs)} local pixel recipes and their original-source checksums')


if __name__ == '__main__':
    main()
