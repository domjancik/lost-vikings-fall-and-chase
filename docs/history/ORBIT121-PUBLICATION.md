# Scrap Orbit121 publication

Published 2026-10-15 to the existing game:
https://united-marsh-6ppd.here.now/?campaign=cycle&release=orbit121&skin=imagegen90

Implementation commit: `9c806fe`.
Hosting version: `01M4ZMMR3TD56SA2D7Q5QGDWWZ`.

The carrier, roof rail, background gears, impact buttons, shutter housings,
magnetic coils, control panel and supporting iron now retain modeled material
depth on their native grids. Original sources/prompts and same-size comparisons
are preserved. Review standards require aesthetic acceptance independently of
native correctness, and general scene captures explicitly select all three
latest corrected Viking sheets with readiness/identity receipts.

Verified before publication:

- 566/566 package tests pass.
- Source and built cross-campaign browser smoke pass: three campaigns,
  28 level previews and control/menu flows; no browser errors.
- Normal and reset/retry production browser routes win with HP [3,3,3],
  131/151 captures, no errors; actual 1x/2x and mobile evidence retained.
- Native alpha, deck/underside, full gear margins and connected caps pass.
- Independent source, runtime, aesthetic and cooperation gates accepted.
- Build/release byte verification passes for 437 declared files; publication
  preflight passes for 438 including the emitted release manifest.

Verified after publication:

- All 21 critical live module, native-art, registration, gate and manifest files
  match the reviewed build. HTML matches after removing hosting social metadata.
  See `assets/orbit121/live-hashes.json`.
- Live coarse-touch pickup, inventory use, walking, character selection and
  Olaf shield controls pass with no browser errors. Its screenshot receipt
  confirms all three imagegen90 Vikings. See
  `assets/orbit121/live-touch/touch.json`.

No runtime changes followed the reviewed implementation. Unrelated archive
scripts, Viking55 experiments and pixel-fixer work remain untouched.
