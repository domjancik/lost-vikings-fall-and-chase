# Optional Imagegen trial skin

The user explicitly requested deploying the displayed sprites as a new skin
after the81 guide/source verdict was reported. This release is an experimental
opt-in preview; it does not retroactively approve the rejected source art.
The current reworked skin remains the default and previous/procedural options
remain available.

Help (`?`) → Viking skin → **Imagegen trial · run/walk** selects it and saves
the choice. Erik uses81's corrected eight-run-frame raw atlas; Olaf uses81's
eight-walk-frame raw atlas with its baked-in oblique round shield; Baleog uses
the first eight running cells of80's full raw atlas. Unsupported actions,
idle, climbing, jumping and Olaf's raised-shield gait use existing reworked
art. These fallback transitions are visible; this is not a complete new skin.

Original sources are unchanged. `tools/register-imagegen81.py` derives a single
display scale per hero and translates each raw cell to the physical floor.
Erik's two flight phases preserve four world units of foot clearance. It does
not detect a pixel grid, recolor, edit, or individually rescale raw frames.
The native source-quality failures recorded in VIKINGS81-REVIEW.md remain.

`tools/build-trial82.mjs` overlays only this integration onto the previously
verified release76. Unrelated workspace build/publishing edits are preserved.
Before publishing,9 existing live files matched release76. Automated336tests
passed, including eight-phase selection, fallback and preference regressions.
The browser route verifies normal selection, movement, raised shield fallback,
1x/2x/mobile captures, three asset loads and saved preference; no JS errors.

Evidence: `output/playwright/trial82-run-{0,1,2}.png`,
`trial82-overview.png`, `trial82-raised-fallback.png`, `trial82-mobile.png`.
Independent integration review: VIKINGS82-REVIEW.md. Source aesthetic acceptance
is intentionally not claimed under the explicit experimental deployment request.

Published at https://united-marsh-6ppd.here.now/?release=82. All10changed
deployed files/raw sources match the tested build by SHA-256. The same browser
route passed on the live site: saved skin `imagegen81`, three raw asset loads,
all movement samples, mobile/zoom captures and no JavaScript errors.
