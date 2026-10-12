# Momentum72 correction review

## Scope and independent mechanics review

Reviewed MOMENTUM72-SPEC.md, current momentum-campaign/render, correction tests
and native preparer. Do not change unrelated fragile-ground behaviour or prior
puzzle geometry. No implementation/art edits by this reviewer. Apply repository
native-sprite-art and VISUAL-REVIEW-GATE; source/native and actual gameplay gates
are separate. Existing68art outside the ball remains reference scope.

**Current code/causality preflight: ACCEPTED.** Front-held Olaf shield outer edge
is h.x+42 (shield center28 plus halfwidth14). Cradle push contact and side collision
now use that same reach rather than permitting penetration until body16 then
correcting backwards to42. The focused repeated-push check verifies monotonic
Olaf advance to rolling mode. It does not replace actual shield/ball own-pixel
contact inspection or prove every contact direction; this cradle pushes right.

Safety now disables new furnace shots and live laser damage/power, while existing
fireballs continue via advanceShots through motion, body/shield impact, rebound
and normal expiry. Removing the safety-deletes-shot branch is the correct causal
fix; no magic cleanup of already launched objects. Renderer selects safe emitter
state, avoiding a visually live laser whose simulation has been disabled.
Fragile ceramic tile cracking/drop/restoration remains driven by occupancy and
its own timer. Removing safety-driven restoration prevents unrelated terrain
repair. Real upper safety still starts the crew lift and powers the portal.

Independently ran momentum-corrections.test.js, momentum.test.js and
momentum-art.test.js:21passed,0failed, including60/120ordinary-input routes,
push consistency, launched-shot survival and fragile lifecycle separation.
The implementer reports330root checks; only the focused suite was independently
run in this review.

## Rigid ball source/native preflight

Inspected assets/momentum72/ball-source.png, ball-native-review.png and
ball-review.png plus tools/prepare-momentum72.py. Native64x64 cell displays
128x128world; physical radius56world/28native. Retained original single material
face is normalized once uniformly61/sourceWidth into the padded64cell.
Broad copper/teal rim, three spokes and hub read at native density, with no
high-resolution rescue/grid reconstruction or independent per-frame fitting.

**RAW/source and prepared native/atlas gate: ACCEPTED.** All64frames are inverse
nearest-sampled clockwise from that same native face about31.5,31.5, with a
fixed28native circular boundary. Rim/hub/spokes retain identity; there is no
independent generative pattern drift. Measured opaque boxes span55–56native
across rotation, the expected one-pixel raster alias, rather than frame scaling.
No claim of mathematically identical alpha outlines at every angle is made.
Spec initially says32frames/pivot32; update to actual64frames/31.5sample center.
This documentation correction does not require changing approved art or physics.

## Pending actual runtime gate

**PROCESSED/actual1x/2x/mobile gate: PENDING production captures.** Need actual
front shield pushing, several rolling phases with coherent spokes and rail/rider
contact, safety crank initial/working/done while an already launched fireball
continues, and unchanged ceramic crack/fall/rebuild after safety. Actual ordinary
completion and page-error result supplement these visual/causal checks; they
cannot replace own-pixel evidence of the changed states. No current code/source
blocker identified; publication remains pending this gameplay gate.

## Final retained-evidence verdict (2026-10-12)

This verdict supersedes the pending section above for Momentum72 only. It does
not accept later73skins or74experimental changes.

**RAW/source gate: ACCEPTED.** The retained single coarse material face and
uniform native preparation remain accepted. Current MOMENTUM72-SPEC.md now
correctly records64rotations and the31.5pixel-center pivot. The independent
actual-PNG validator passed all64same-source rotations, binary alpha and circular
registration. One-pixel rotating outline aliasing is not independent art drift.

**PROCESSED/actual1x/2x/mobile gate: ACCEPTED.** Independently inspected retained
momentum72-start, rolling, rider, rider-1x, upper-rail-mobile and
upper-dock-0-mobile own pixels. The rim, hub and three spokes retain one coherent
material topology across the sampled angles. The ball follows the rail; Erik's
crown support is readable at both zooms and on mobile. The upper lift capture
places his soles on the actual silver walking rim. The rolling image shows the
front shield facing the departing sphere; it is not a continuous measurement of
the entire push. Push consistency is additionally established by the focused
repeated-input regression, not inferred from this single still.

**Safety/fragile-ground causal gate: ACCEPTED.** Same-camera safety-before,
safety-after and safety-travel show the authored crank becoming active while
both launched fireballs remain visible and continue moving. The reported
ordinary-control diagnostics corroborate their positions:2247/2419 before,
2262/2404 after,2381/2285 later. The furnace returns to its stopped state rather
than erasing the volley. Post-shutdown safety-floor-crack and safety-floor-fall
show ceramic cracking and dropping independently of power. The recovered still
follows Erik on the lower floor, with the rebuilt upper tiles offscreen; it is
not visual proof of their restoration. Restoration is supported by the reported
later t0/drop0 diagnostics and the independent lifecycle regression. This
continuation ended with ErikHP1 after residual-shot exposure during idle time;
it is not described as damage-free or as a full completion.

The separate ordinary-controls full route reportedly cleared in124.85simulation
seconds with all threeHP3, no page errors and Enter continuation. Enter was
verified on that full route only, not the safety prefix whose inherited wrapper
label was corrected. This reviewer independently inspected the captures and ran
the21focused tests and64frame PNG validator; the reviewer did not perform a
second browser playthrough. The implementer's broader suite result is separate
evidence.

**Final changed-scope verdict: ACCEPTED; no material blocker found.** Preserve
the stated evidence boundaries. Additional direct push captures may strengthen
the record but do not change the accepted native art, safety semantics or
unchanged recovery mechanics.

### Direct push supplement

Independently inspected momentum72-push-486/500/512 and500-mobile. The front
shield stays immediately behind the same rotating rim through the sampled
cradle travel; no body penetration or backwards snap is apparent. The mobile
crop shows Olaf and shield clearly but clips part of the sphere, so the desktop
sequence carries the full contact evidence. Reported ordinary-input roots
387.781→402.017→413.747 and sphere centers486.25→501.507→513.351 advance together,
all grounded withHP3 and the front shield state. These sampled captures plus the
repeated-input regression close the push-specific evidence note; still images
alone do not establish every intervening frame. The implementer reports the
isolated72release now passes330tests after restoring validator tooling, with no
runtime change. Source and actual-runtime acceptance above remain final.
