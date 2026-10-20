import importlib.util
from pathlib import Path
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[2]
TEMP_ROOT = ROOT / 'output/pixel-tooling-tests'
TEMP_ROOT.mkdir(parents=True, exist_ok=True)
spec = importlib.util.spec_from_file_location('pixel_setup', ROOT / 'tools/art/pixel/setup-pixel-fixer.py')
setup = importlib.util.module_from_spec(spec)
spec.loader.exec_module(setup)


class PatchTests(unittest.TestCase):
    def test_checked_in_patch_matches_pinned_upstream_and_repaired_source(self):
        import subprocess
        config = setup.configuration()
        original = subprocess.check_output(['git', '-C', str(ROOT / 'tools/pixel-art-fixer'), 'show', config['upstreamCommit'] + ':' + config['file']])
        with tempfile.TemporaryDirectory(dir=TEMP_ROOT) as directory:
            target = Path(directory) / config['file']
            target.parent.mkdir(parents=True)
            target.write_bytes(original)
            self.assertEqual(setup.apply_fix(Path(directory)), 'applied')
            self.assertEqual(setup.apply_fix(Path(directory)), 'already-applied')
            self.assertEqual(setup.sha256(target.read_bytes().replace(b'\r\n', b'\n')), config['patchedSha256'])

    def test_unknown_local_edits_are_preserved_and_rejected(self):
        config = setup.configuration()
        with tempfile.TemporaryDirectory(dir=TEMP_ROOT) as directory:
            target = Path(directory) / config['file']
            target.parent.mkdir(parents=True)
            target.write_bytes(b'local experiment\n')
            with self.assertRaisesRegex(RuntimeError, 'unrecognized'):
                setup.apply_fix(Path(directory))
            self.assertEqual(target.read_bytes(), b'local experiment\n')

    def test_all_manifest_sources_are_local_originals_with_hashes(self):
        import hashlib
        import json
        for item in json.loads((ROOT / 'tools/pixel-assets.json').read_text()):
            self.assertTrue(item['source'].startswith('assets/'))
            source = ROOT / item['source']
            self.assertTrue(source.is_file(), source)
            self.assertEqual(hashlib.sha256(source.read_bytes()).hexdigest(), item['sourceSha256'])


class RebuildSafetyTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        module_spec = importlib.util.spec_from_file_location('pixel_rebuild', ROOT / 'tools/art/pixel/rebuild-pixel-assets.py')
        cls.rebuild = importlib.util.module_from_spec(module_spec)
        module_spec.loader.exec_module(cls.rebuild)

    def test_rebuild_cannot_overwrite_reviewed_assets_or_sources(self):
        for unsafe in [ROOT, ROOT / 'assets', ROOT / 'src', ROOT / '.git', ROOT / 'output/../assets']:
            with self.assertRaises(ValueError):
                self.rebuild.safe_output_root(unsafe)
        self.assertEqual(self.rebuild.safe_output_root(ROOT / 'output/reproduction-test'), ROOT / 'output/reproduction-test')

    def test_manifest_verification_rejects_source_tampering(self):
        with tempfile.TemporaryDirectory(dir=TEMP_ROOT) as directory:
            source = Path(directory) / 'original.png'
            source.write_bytes(b'changed source')
            with self.assertRaisesRegex(ValueError, 'checksum'):
                self.rebuild.verify_source(source, '0' * 64)

    def test_reconstruction_does_not_depend_on_previous_opencv_random_calls(self):
        import cv2
        import numpy as np
        from PIL import Image
        rng = np.random.default_rng(7)
        pixels = rng.integers(0, 256, size=(25, 37, 4), dtype=np.uint8)
        pixels[:, :, 3] = 255
        image = Image.fromarray(pixels)
        cv2.setRNGSeed(1)
        first = np.array(self.rebuild.normalize(image, [19, 13]))
        cv2.setRNGSeed(999)
        second = np.array(self.rebuild.normalize(image, [19, 13]))
        self.assertTrue(np.array_equal(first, second))


if __name__ == '__main__':
    unittest.main()
