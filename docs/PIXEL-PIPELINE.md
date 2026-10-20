# Reproducing the pixel-fixing pipeline

The game runs from checked-in runtime PNGs; Python and this tool are only needed
to reproduce asset processing. This workflow reproduces the historical **43-asset
pixel pack** described by [`tools/pixel-assets.json`](../tools/pixel-assets.json).
It does not regenerate AI images from prompts or automatically rebuild every
later native-art atlas. Original image generation is not deterministic; the
retained source images are the reproducible inputs.

## What is included

- The Retro Diffusion [pixel-art-fixer](https://github.com/Retro-Diffusion/pixel-art-fixer)
  submodule pinned at `ef376e57e1c272633ca2dbf5f29ec3fcf6596465`.
- The project's [nonnegative cell-weight patch](../tools/art/pixel/patches/nonnegative-cell-weights.patch),
  including original, patched and patch SHA256 checksums in
  [`toolchain.json`](../tools/art/pixel/toolchain.json).
- Exact Python library versions in
  [`requirements.txt`](../tools/art/pixel/requirements.txt).
- All 41 original images needed by the 43 recipes: 12 previously retained
  originals under `assets/`, plus 29 previously cache-only originals now under
  [`assets/pixel-sources44/`](../assets/pixel-sources44/). Each manifest entry
  records its source checksum, target dimensions and any crop/piece placement.
  Original cache identifiers are retained as provenance, not read as file paths.
- A rebuild command that seeds NumPy/OpenCV quantization, uses one OpenCV thread,
  validates dimensions, binary alpha and source-cell color bounds, and records
  environment and output hashes.
- [Reference decoded-pixel hashes](../tools/art/pixel/reference-hashes.json) for
  checking repeatability without depending on PNG encoder metadata.

## Why the patch is necessary

`two_stage_pack` assigns source pixels to output cells, selects the winning color
cluster in each cell, then averages original pixels in that cluster. With
fractional cell sizes, triangular center weights could become negative. Those
negative votes extrapolated colors beyond the source pixels' ranges, producing
repeated dark or colored speckles. The patch clamps both weight axes to zero
before adding the existing tiny positive floor. It changes no grid dimensions.

The regression test intentionally fails on the unpatched pinned upstream version
and passes on the patched version. The fix is a project patch; it is not asserted
to have been merged upstream. Upstream code and its MIT license remain in the
submodule. Keep the upstream pin and patch/checksums together when updating them.

## Setup from a fresh clone

Install Git and **CPython 3.12** (validated with 3.12.8), then clone the repository.
Run commands from its root. No image-generation cache, API key or hosting
credential is needed.

```sh
git submodule update --init tools/pixel-art-fixer
python tools/art/pixel/setup-pixel-fixer.py
```

The setup helper verifies the upstream commit and source hashes, checks and
applies the tracked patch, and accepts an already-patched copy. It refuses unknown
local edits rather than resetting or overwriting them. A dirty submodule after
setup is expected: the modification is exactly the tracked patch in the parent
repository. A parent commit alone does not store submodule working-tree edits,
which is why the explicit patch is needed.

On Windows PowerShell:

```powershell
py -3.12 -m venv tools/pixel-fixer-venv
$python = ".\tools\pixel-fixer-venv\Scripts\python.exe"
& $python -m pip install -r tools/art/pixel/requirements.txt
& $python tools/art/pixel/setup-pixel-fixer.py --check
& $python tests/art/test_pixel_tooling.py
& $python tools/art/pixel/test-pixel-pipeline.py
```

On macOS/Linux, with Python 3.12 selected:

```sh
python3.12 -m venv tools/pixel-fixer-venv
tools/pixel-fixer-venv/bin/python -m pip install -r tools/art/pixel/requirements.txt
tools/pixel-fixer-venv/bin/python tools/art/pixel/setup-pixel-fixer.py --check
tools/pixel-fixer-venv/bin/python tests/art/test_pixel_tooling.py
tools/pixel-fixer-venv/bin/python tools/art/pixel/test-pixel-pipeline.py
```

The toolchain check requires the pinned dependency versions. The setup helper
itself uses only Python's standard library and Git. Do not run
`git submodule update --remote`: it advances upstream beyond the validated pin.

## Rebuild and validate

Using the virtual environment's Python (`$python` on Windows, the full `bin/python`
path on macOS/Linux):

```sh
python tools/art/pixel/rebuild-pixel-assets.py --verify-reference
python tools/art/pixel/rebuild-pixel-assets.py --check --verify-reference
```

Substitute the correct Python executable above; for example in PowerShell:

```powershell
& $python tools/art/pixel/rebuild-pixel-assets.py --verify-reference
& $python tools/art/pixel/rebuild-pixel-assets.py --check --verify-reference
```

Results go to `output/pixel-rebuild/assets/pixel/`; `report.json` records the input
and output hashes, decoded RGBA hashes, crop/size recipe references, environment,
seed and validation results. The command never installs results into `assets/`.
`--output-root` must remain inside a subdirectory of the repository's ignored
`output/` directory. This also protects original sources and reviewed runtime art.

For a smaller experiment, select targets by substring:

```sh
python tools/art/pixel/rebuild-pixel-assets.py --only puzzle-machines --output-root output/pixel-example --verify-reference
```

To repeat the full run in another output tree:

```sh
python tools/art/pixel/rebuild-pixel-assets.py --output-root output/pixel-repeat --verify-reference
```

`--check` validates existing generated files against source dimensions, cell color
bounds and binary alpha without rebuilding them. With `--verify-reference`, it
also compares decoded pixels to the pinned reference. A mismatch fails loudly;
do not silently update reference hashes to make it pass. Investigate dependency,
platform, source and recipe differences first. Cross-platform bit identity has
not been established; the checked-in reference records its validated platform.

## Historical results versus current art direction

The reference is a repeatable **new normalization of the retained inputs** with
explicit RNG/thread settings. Older checked-in runtime images may differ because
their historical runs did not record those settings, or because later artwork
and registration superseded them. Reproducing the process is not a claim of
bit-for-bit reconstruction of every historical image-generation session.

Some older preparation scripts remain development records and may refer to
private cache paths. Use this documented manifest-driven entrypoint for the
pixel pack. It no longer reads the archived publisher or a local generated-image
cache to discover its inputs.

For new art, follow [native-sprite-art](../skills/native-sprite-art/SKILL.md):
generate at the intended display density first. Pixel fixing cannot restore
details that were designed at the wrong resolution. Compare original, processed
and real gameplay images through the [visual review gate](standards/VISUAL-REVIEW-GATE.md)
before choosing to ship any rebuilt asset. This tooling update does not replace
the live game's artwork.
