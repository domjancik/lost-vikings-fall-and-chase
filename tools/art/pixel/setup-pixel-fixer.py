"""Apply the tracked reconstruction fix without discarding local tool edits."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[3]


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def configuration():
    return json.loads((ROOT / 'tools/art/pixel/toolchain.json').read_text())


def verify_checkout(checkout):
    config = configuration()
    actual = subprocess.check_output(['git', '-C', str(checkout), 'rev-parse', 'HEAD'], text=True).strip()
    if actual != config['upstreamCommit']:
        raise RuntimeError('Pixel-fixer checkout is not the pinned upstream commit')
    changed = subprocess.check_output(['git', '-C', str(checkout), 'diff', 'HEAD', '--name-only'], text=True).splitlines()
    if any(name != config['file'] for name in changed):
        raise RuntimeError('Pixel-fixer contains additional tracked edits; refusing an unverified toolchain')
    return actual


def apply_fix(checkout, check_only=False):
    config = configuration()
    patch = ROOT / config['patch']
    if sha256(patch.read_bytes()) != config['patchSha256']:
        raise RuntimeError('Tracked patch checksum differs from toolchain.json')
    target = checkout / config['file']
    current = sha256(target.read_bytes().replace(b'\r\n', b'\n'))
    if current == config['patchedSha256']:
        return 'already-applied'
    if current != config['originalSha256']:
        raise RuntimeError('Refusing to overwrite unrecognized pixel-fixer edits: ' + str(target))
    if check_only:
        raise RuntimeError('Pixel-fixer patch is missing; run setup-pixel-fixer.py')
    env = {**os.environ, 'GIT_CEILING_DIRECTORIES': str(checkout.parent)}
    subprocess.run(['git', 'apply', '--check', str(patch)], cwd=checkout, env=env, check=True)
    subprocess.run(['git', 'apply', str(patch)], cwd=checkout, env=env, check=True)
    if sha256(target.read_bytes().replace(b'\r\n', b'\n')) != config['patchedSha256']:
        raise RuntimeError('Patched source checksum mismatch')
    return 'applied'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--checkout', type=Path, default=ROOT / 'tools/pixel-art-fixer')
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    checkout = args.checkout.resolve()
    actual = verify_checkout(checkout)
    print(json.dumps({'upstreamCommit': actual, 'patch': apply_fix(checkout, args.check)}))


if __name__ == '__main__':
    main()
