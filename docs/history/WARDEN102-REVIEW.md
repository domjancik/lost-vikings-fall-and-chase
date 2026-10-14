# Warden 102 independent review

Scope: mobile rendering cost, laser/stomp distortion, boss sound weight, and
native-density refinement of the existing articulated Warden. This review owns
no runtime code. Gameplay causality and existing physical anchors must remain
intact.

## Baseline inspection

Read `src/levels/warden/{render,art,audio,combat,campaign}.js`,
`src/render/depth-{render,layout}94.js`, and `src/audio/sound-effects.js`.
Inspected `assets/warden97/parts-native.png` directly.

Likely costs requiring measurement, rather than assumption:

- The entire world pass uses a per-frame saturation/brightness canvas filter,
  including hundreds of wall tiles and articulated parts.
- Room wall plans and exposed-border plans are rebuilt and all offscreen rooms
  drawn every frame; no view rejection is apparent.
- Rotation caches retain square canvases indexed by angle without an explicit
  memory budget. Body rotation uses a much larger padded canvas than its part.
- Laser rasterization issues many separate rectangle calls for beam and core.

Existing sounds reuse a short generic impact for stomps and a rising chime for
the beam. Neither communicates a heavy leg's pre-impact movement or a sustained
pressurized laser discharge. New events should follow physical transitions and
not retrigger every held frame.

Existing native parts have readable volume but several outlines are 3–5 native
pixels thick and limb bars lack purposeful structure. A 512-pixel atlas is not
proof that its intended 1-native-pixel contour/detail language is preserved.
Retain registered anchors/world scale; improve contour bevels, piston seams,
exposed cables and material plane shading rather than noisy speckle texture.

## Required evidence

Performance: same mobile viewport, camera, actor skin, and boss phase before and
after; frame-time distribution and render cost with the main suspected costs
isolated. Distortion must be bounded/local and composited once, not require a
full-resolution CPU readback each frame. State any device/emulation limitation.

Effects: locked beam, firing beam, terrain/shield contact, unbraced stomp, braced
stomp, and moving shockwaves. Distortion must follow the true emitter/contact
and return to zero. It must preserve the readable warning, solid floors,
Viking silhouettes, and first-contact collision. Only an actual heavy floor
impact may emit the heavy stomp event.

Audio: inspect event transition tests and listen to rendered examples of the
laser and stomp. Review rush/charge/body/tail layers and onset synchronization;
recipe existence alone is insufficient.

Art: retained raw imagegen source beside native-size view; processed/native and
nearest-neighbor enlargement; actual production 1×/2× and mobile at all relevant
poses/contacts. Inspect feet, joint pivots, walking deck, head aperture, cradle
rim, clamps and source/runtime palette agreement.

## Gate verdicts

- Native-density/source gate, v1: **reject**. Directly inspected
  `assets/warden102/parts-raw-v1.png` (1280×1280, declared 512×512 native).
  Iron volume, finer contour and piston structure improve the prior asset, but
  rust stipples and bevel micro-highlights contain isolated 1–2-source-pixel
  marks, finer than the declared 2.5-source-pixel native proof scale. The source
  does not satisfy the prompt's exact native-grid presentation. Do not remove
  these through a downsampling rescue. Regenerate deliberate coherent clusters
  with the same material improvements and fixed registration.
- Native-density/source gate, v2: **accept for density**. Inspected retained
  `assets/warden102/parts-raw-v2.png` and a nearest-neighbor intended 512×512
  proof at `output/warden102/review-native-v2.png`. Piston rails, segmented hose
  joints, steel planes, rivet ownership and thin contour bevels remain deliberate
  readable clusters at target size. Fine painted corrosion was removed in the
  new source rather than filtered out during preparation. Directional caveat:
  this revision is overly pristine; restoring sparse broad 3–6-native-pixel
  weathering clusters would better retain rusty Clockwork character. A new
  revision still requires its own source review. Thin colored alpha fringe is
  a runtime-preparation item, not permission to erode bevels.
- Native-density/source gate, v3: **accept**. Inspected
  `assets/warden102/parts-raw-v3.png` and intended-density proof
  `output/warden102/review-native-v3.png`. Distinct inspection hatches, vents,
  piston rails, connected hose segments and restrained steel planes remain
  readable at 512×512. Rust occupies coherent structural patches near joints
  and panel seams rather than defining the asset with overall fine stippling.
  Minor low-contrast microdots do not establish shape/material; do not add
  processing passes to rescue them. Final alpha cleanup must remove colored
  exterior fringe while preserving the authored thin contour/bevel.
- Processed/in-game gate: **accept**, final art/contact/effects evidence reviewed
  below. This includes source/native comparisons and actual 1×/2×/mobile.
- Publication: **allowed after final package/build/release checks**. No remaining
  visual or mechanical review blocker; retain the stated real-phone/audio
  audition limitations in the delivery record.

The existing Warden97 approval was not used to approve this replacement or newly
introduced distortion; both received fresh evidence review.

## Baseline performance evidence

Read `output/warden102/profile-before.json`: Chrome headless, 844×390, DPR2,
CPU throttle 6, camera-only boss-bay diagnostic. 1× median draw 46.9 ms / p95
66.9 ms; 2× median 25.0 ms / p95 33.1 ms. Approximately 763 drawImage calls
per frame, of which 759 use a canvas filter. This supports investigating the
filtered full-world pass; it is not a real-phone frame-rate measurement.

## Interim implementation review

Inspected `assets/warden102/parts-native.png` and nearest 2× enlargement.
Source vents, bevels, piston rails and hose structure survive one uniform
normalization. Existing complete carriage/foot/hinge/spoke parts are explicitly
retained; their registration is preserved without stretching individual parts.
The heavier retained fork pads are an acceptable construction distinction, not
a conflicting art style. Actual joint/sole/deck contacts remain pending gameplay.

Read `output/warden102/profile-optimized.json`, same Chrome/viewport/throttle
proxy: 1× median draw 11.2 ms / p95 16.2 ms, 2× median 10.6 ms / p95 17.9 ms;
zero filtered calls per frame; approximately 81/59 drawImage calls. This is
substantial measured improvement over the baseline, subject to final boss-phase
and actual browser route evidence.

Found a cache correctness blocker: `fixedWorld` initially cached the dynamic
cradle boarding ladder using only chunk coordinates. Its release/boarding state
must render outside immutable scenery so art follows the active ladder physics.
**Resolved:** immutable cache now uses `wardenLevel.ladders`; dynamic ladder
partition renders outside it. Inspected `boarded-2x.png`, showing the boarding
ladder and all three riders with correct deck contact.

Refraction code uses canvas-to-canvas region copies and snapped strip displacements,
not per-frame CPU pixel readback. The first-contact beam core is drawn afterward.
Final live impact/fire/brace and performance evidence was reviewed below.

## Production art/contact review

Directly inspected actual route captures under `output/warden102/route/`:
`brace-desktop-1x.png`, `brace-desktop-2x.png`, `brace-mobile-2x.png`,
`cap-full-desktop-2x.png`, `cap-middle-mobile-1x.png`,
`disabled-lens-desktop-2x.png`, `boarded-2x.png`, and
`boarded-mobile-1x.png`. The new vents, bevels, dimensional iron and piston
detail remain readable and coherent with Clockwork scenery at both zooms.
No visible colored external halo, contour erosion or enlarged outline language
remains. Fork feet meet the structural floor; Olaf's raised shield visibly
supports the held fork; Erik is planted on the walking spine; the cradle's rider
soles meet its reviewed top strip. Opening glass and broken lens have distinct
states. Viking/guardian scale stays coherent.

**Processed/in-game art subgate: accept.** A successful route alone cannot replace
the separate effects inspection below.

Read dedicated sound recipes and transition hook code. Charging/drop use rising
noise envelopes; fire uses layered rush/discharge/tail; stomp combines transient,
low body, metal resonance and longer debris tail. Events follow state transitions,
and a braced/non-floor contact suppresses the heavy stomp. Inspected
`output/warden102/audio.json`: all four OfflineAudioContext renders are nonzero
and unclipped. Playback is unavailable to this review context, so no subjective
listening approval or claim about perceived sound weight is made.

## Final effects and performance review

Directly inspected `output/warden102/laser-mobile-1x.png`,
`laser-mobile-2x.png`, `stomp-mobile-1x.png`, and `stomp-mobile-2x.png`.
The bright beam core remains straight, distinct from the displaced neighborhood,
and visibly terminates at the actual victim/contact rather than continuing
through it. Low impact displacement and shockwave distortions remain localized
near the floor; floor plane and guardian foot contact remain readable. Braced
captures above do not show the unbraced floor impact. Background/iron structure
retains contrast and coherent native clusters; the effect does not become
full-screen blur or hide the warning/selected hero. Code inspection verifies
zero-envelope decay and first-contact trace ownership.

Read concise phase evidence in `output/warden102/combat.json`: same CPU6
mobile proxy gives laser median draw 12.0/10.3 ms (1×/2×), stomp 11.9/9.0 ms.
Region copies are 94,900/63,875 pixels for laser and 65,520/44,100 for stomp,
not full-frame CPU readbacks. Audio history includes actual charge/drop/fire/
stomp transitions. Browser errors are empty. Full ordinary-input encounter
route reports victory with all three heroes at HP3 and no page errors.

**Final source gate: accept V3. Final processed/in-game gate: accept.**
Measured optimization and phase-active rendering support the mobile improvement
claim, although desktop Chrome CPU throttling cannot certify all real-phone GPU
and thermal behavior. Audio layering/transition validity and non-clipping are
verified; subjective audition remains an explicitly unverified dimension.

## Retained evidence and final release checks

Permanent review evidence lives in [assets/warden102/evidence](../../assets/warden102/evidence/):
[before profile](../../assets/warden102/evidence/profile-before.json),
[optimized profile](../../assets/warden102/evidence/profile-optimized.json),
[combat phase measurements](../../assets/warden102/evidence/combat.json),
[normal-input browser route](../../assets/warden102/evidence/browser-route.json),
and [offline audio measurements](../../assets/warden102/evidence/audio.json).
The same directory retains laser/stomp mobile 1×/2× captures, brace 1×/2×/mobile,
boarded 2×, disabled-lens 2×, and the four WAV audition files. Raw V3, exact
prompts, processed native/2× atlas and registration remain in `assets/warden102/`.

Implementation agent's final verification reports 448 passing tests, 366 clean
build files with 366 verified source/output hashes, and 367 explicit publisher
dry-run files. This reviewer verified retained evidence presence and the
`visual-gates.json` record's separate accepted source/runtime verdicts. No
remaining publication blocker. Real-phone and subjective audition limitations
remain as stated above.
