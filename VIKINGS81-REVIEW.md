# Independent review: Erik run/beard and Olaf angled shield/helmet

Reviewed2026-10-12 against native-sprite-art, VISUAL-REVIEW-GATE.md and
HUMAN-SCALE.md. No generator/runtime changes by reviewer. This is a scoped
guide and raw-render checkpoint, not production replacement approval.

## Native procedural guide source / geometry — ACCEPTED

Read tools/guide-vikings81.py and VIKINGS81-GUIDE-SPEC.md. Inspected all
three native atlases, Erik/Olaf native-density comparison boards, their full
frame keys, erik-run-review.png and olaf-shield-helmet-review.png. Reviewed
the final stronger Erik beard contrast and corrected Olaf raised-head duck.
First-game authority remains the retained original SNES Olaf sheet8335,
not the sequel or Heroes of the Storm.

Cells remain64x64 native /128x128 world; origin(32,40), sole exclusive62,
anatomical body heights36/38/36. Costume horns extend3native pixels above
the anatomical body; no individual frame is fitted/rescaled. Guide source
is authored directly at native density and enlarged by nearest neighbor.

Erik's run has visible contact/compression, drive/knee lift, folded recovery
and extended flight families;3/7 put both feet above the local sole plane.
Forward body lean and strong arm counter-swing make it distinct from the
earlier walk. Near/far limb tones retain identities. The long beard has a
jaw anchor and three3-native-pixel articulated segments: it trails during
the run with phase-dependent follow-through and hangs in quieter poses.
Stronger coarse beard color separates it from the chest cloth. Rear climb
occludes the beard rather than attaching it to the back of the helmet.

Olaf retains80's full belly/broad back and thick limbs. Front shield now
reads as an oblique ellipse with45-degree yaw and slight-8-degree roll,
approximately17native pixels wide at unchanged24-native physical diameter.
The projected strap and gripping arm follow the same plate transform;
the opaque face hides the palm. Held floor clearance/bob remain visible.
Overhead disc remains24x6 projected profile, rider plane22 and underside25.
Low helmet rim covers the eye while nose/beard remain visible.

The initial costume horns entered the raised-shield profile. Final additional
head duck resolves that collision while preserving the shield and arm planes;
the final raised review images show head/horns below the underside. Raised
climb still separates one support palm from the opposite ladder hand.

Independently ran tools/check-vikings81-guides.py: all32Erik/38Baleog/60Olaf
native poses passed fixed anatomy, ground/flight contacts, articulated beard,
oblique shield, eye cover and horn-clearance checks. Visual poses, not these
measurements alone, establish this guide acceptance. Sampled keys still do
not establish production transfer/timing or scene contacts.

## Raw generated Erik run — REJECTED

Inspected assets/vikings81/erik-imagegen-raw.png and its intended-size
erik-imagegen-native-diagnostic.png; read erik-imagegen-prompt.txt.
Dynamic leg/arm families and the earthy red/steel material direction are
present. The requested freely trailing beard, however, becomes a short
front beard plus an orange mass originating behind the helmet/neck over
the rear shoulder. That reads as rear hair/ponytail rather than one clearly
chin-connected articulated flowing beard. It fails the guide's anatomical
attachment and visible follow-through contract.

The raw render also uses finer irregular helmet/leather/beard pixels and
soft multi-tone edges/shading instead of uniform enlarged native clusters.
At intended size these compress into fine textured edges. Thus the native
source gate fails independently of the beard attachment failure.

## Targeted Erik beard correction — REJECTED

Separately inspected erik-beard-correction-raw.png and its native diagnostic;
read erik-beard-correction-prompt.txt. The correction retains an orange rear
helmet/shoulder tuft and short front beard; it still does not clearly show
the required single long jaw-attached trailing beard. Fine soft material
detail/edges also remain. Keep this retained correction as failed evidence,
not as a repaired source or accepted density conversion.

## Raw generated Olaf walk — REJECTED

Inspected olaf-imagegen-raw.png and its intended-size diagnostic; read
olaf-imagegen-prompt.txt. The stout earthy body and oblique round shield are
successful changes; shield stays visibly above the boot reference and has
an angled rather than face-on appearance. But bright visible eye/pupil
features remain below the helmet rim in the generated cells, despite the
explicit requirement to conceal both eyes. Raw guide-fidelity gate fails.

Steel highlights, beard/boot shading and outlines again contain small
irregular detail/soft edges finer than the intended native density. The
diagnostic view is uniform nearest sampling solely for review and cannot
repair that source. Native-source gate is rejected independently of the
eye-cover failure. Eight walk cells cannot approve the other52Olaf actions.

## Processed / actual-game runtime — NOT ASSESSABLE; NOT APPROVED

No81replacement is wired into production. Source-review/native-diagnostic
boards are review-only; they are not accepted processed art or gameplay.
Do not downsample, quantize, detect a grid or fit frames to rescue rejected
generated sources. Regenerate natively while preserving accepted guide
geometry, chin attachment, concealed eyes and oblique physical shield.

The separate vikings81-materials experiment is explicitly unselected and
unreviewed by this critic. It supplies no approval for a runtime replacement.
Actual1x/2x/mobile, mirrors, scene-relative adult scale, floor and ladder
contacts, stop/reverse climb, continuous shield hand transfer and passenger
soles remain required before any production publication.
