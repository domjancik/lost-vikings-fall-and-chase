# Viking runtime scale and cadence correction

This updates the existing optional Imagegen trial skin's registration and all
grounded skin playback. Original generated sources and skin choices are retained.
It does not approve the trial source as finished native pixel art.

## Cause and correction

`movement.js` accumulates `walk` as actual grounded travel divided by nine.
`sprite-render.js` previously consumed that value directly as one animation
phase: a complete eight-phase stride took only 72 world units. At full movement
speed Erik completed 3.19 cycles per second, Baleog 2.43 and Olaf 2.08.
The new stride distances are 128, 112 and 104 world units respectively, giving
1.80, 1.56 and 1.44 full cycles per second. Acceleration, braking and physical
movement speed are unchanged. Animation remains tied to distance rather than
an unrelated time clock, and stopping uses the existing planted idle.

All eight trial cells are reachable sequentially at 60 Hz. The current70 skin
still has four meaningful authored gait families, each held for two phase
indices. Slower playback improves cadence; it cannot create missing leg poses.
In particular the trial Baleog source contains weak leg changes across its
eight cells. Do not describe this correction as a complete animation redesign.

Trial registration formerly budgeted 78/82/78 world units for the broad total
visible silhouette, including horns. This now uses 72/76/72, matching the
existing locomotion's overall display budget. These are whole-silhouette
measurements, **not** a claim of 36/38/36 native anatomical body approval.
Each hero retains one uniform scale across the entire atlas; frames are
translated to the existing physical sole at local world y=44. Erik's two
airborne run phases retain their four-world-unit flight clearance. No image
has been resampled, repainted, palette-processed or overwritten.

## Verification evidence

- `viking-cadence84.test.js`: initial two tests failed against the previous
  cadence and missing size contract, then passed after correction. Also checks
  actual full-speed 60 Hz travel can display every phase without skipping.
- `tools/browser-vikings84.mjs`: production Cycle of Depths, keyboard movement,
  normal skin selector and restart/pause/zoom controls. Each moving hero first
  walks away from the parked group onto the uninterrupted floor. Eight held
  phases are captured with the actual `data-frame` recorded, plus reverse,
  stop/idle fallback, desktop 1x/2x and mobile 1x/2x running evidence.
- `output/playwright/vikings84/evidence.json`: actual phase IDs and hero
  positions for both current and trial skins. All 48 held phase IDs must match
  their labels; a capture harness timeout is failed evidence, not approval.
- `output/playwright/vikings84/same-size-native-gaits.png` and its nearest
  4x diagnostic show both skins at the same apparent floor/display size.
  The first eight columns are current70, the next eight trial81. These are
  diagnostic renders through the production art function, not replacement art.

Independent verdicts belong to `VIKINGS84-REVIEW.md`. The native source gate
remains failed for the inherited trial; this is a correction to the already
explicitly requested optional experiment, not publication of newly approved art.
