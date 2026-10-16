# Sewer machinery axle registration

The valve and inspection winch previously rotated circular atlas crops around
assumed cell centers. The winch's real axle was two native pixels left of that
center; the valve hub was two native pixels lower. Those crops also carried
stationary bearings, pieces of an oval rim and the winch drum around the axle.

The retained native art is now separated into fixed housing, turning spokes and
a fixed axle cap. The valve uses source pivot32,34 at world1050,580; the winch
uses22,30 at1820,572. Both complete source bases meet floor640. Original source
pixels, shading and two-world-unit pixel density are retained. No art is resized
or regenerated, and no interaction, movement or puzzle rule changes.

`tools/art/orbit/prepare-sewer141.py` reproduces the layers from the preserved
sewer125 source. `tests/unit/sewer141.test.js` prevents mount/axis regressions.
`tests/browser/sewer141-rotors.mjs` checks the entire visible shaft cap at72
angles per mechanism using the actual production renderer, then renders a
comparison matrix. `tests/browser/sewer141-route.mjs` exercises ordinary input,
unobscured before/moving/held/reversed/reset views and correct1x/2x camera waits.

Independent source, runtime and artistic findings are recorded in
[SEWER141-REVIEW.md](SEWER141-REVIEW.md). Earlier obscured, pre-cap or incomplete
route captures are retained only as ignored local diagnostics under
`output/sewer141/superseded-*`. The reversal test originally exposed a fixed-aim
assumption in the route harness: the enemy had time to patrol behind Baleog.
Those route variations were rejected. The accepted checks separate the focused
reverse/reset inspection from the normal healthy completion, avoiding altered
enemy timing. Runtime is unchanged.

Verification:720 automated tests pass; source/build campaign smoke covers all31
previews and four campaigns with no errors. The144-pose production pixel check
passes. Normal desktop route: win, full3/3/3 health,34 captures, Enter continues
to Drowned Regulator. Coarse-touch reverse/reset route: full3/3/3 health,
45 captures, no errors. Requested capture zooms are asserted against rendered
camera values and every scene capture records the current imagegen90 sheets.

Deployment receipts will be appended after publication.
