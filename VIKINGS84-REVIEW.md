# Independent Viking height / cadence correction review

Review opened2026-10-12 under native-sprite-art and VISUAL-REVIEW-GATE.md.
Reviewer owns this record only; no implementation/source edits.

## Scope and source gate — previous rejection remains

The user requested correction of the optional trial's excessive apparent
height and rapid limited gait. This does not accept the finer-than-native
raw art rejected in VIKINGS80-REVIEW.md and VIKINGS81-REVIEW.md. The explicit
experimental deployment exception recorded in VIKINGS82-REVIEW.md remains
the authority for an opt-in preview. Native-density/source gate: REJECTED.

Read hero-frames.js, tools/register-imagegen81.py and VIKINGS70-REVIEW.md.
The current trial registration uses broad total-alpha heights78/82/78world;
helmet horns, fringe and equipment must not define anatomical body height.
Use the baseline broad helmet-to-support-sole body at36/38/36native, excluding
horns and weapons, and verify against actual current-skin gameplay. The
approved70Erik body has native top27 and exclusive sole62; direct comparison
matters alongside nominal height metadata. Retain one scale per hero and
translations only; no per-frame anatomy fitting or finer-source rescue.

Current70 deliberately has four authored gait families held across eight
indices. Its earlier final acceptance made no eight-unique-phase promise.
Changing cadence cannot create missing leg families. Review any new claim
of eight meaningful contacts/downs/passings/ups from inspected art, not
index count or byte uniqueness.

## Runtime height / cadence correction — ACCEPTED, limited correction

Read VIKINGS84-FIX.md, viking-cadence84.test.js and the revised distance-based
grounded-run selection in sprite-render.js. Registration now budgets the
whole visible silhouette at72/76/72world, including horns. This reduces the
former78/82/78budget uniformly per hero. It is not an anatomical36/38/36native
body claim: trial helmet-to-sole bodies are somewhat shorter to make room
for horns within the same overall height. No raw pixels are rewritten.

Inspected output/playwright/vikings84/same-size-gaits-4x.png, which renders
current70on the left and trial81on the right through production art code at
the same floor/apparent size. The trial horn-inclusive height is comparable
to the current cap-to-sole silhouette. Erik remains a lean adult, Baleog an
armored adult, and Olaf a stout barrel-bodied adult; there is no obvious
child-sized body introduced by this modest reduction. Costume/width changes
remain obvious between skins and at current-art idle fallback.

Independently inspected actual1440×900Cycle gameplay samples:
imagegen81-0-phase0-2x.png, imagegen81-1-phase2-2x.png,
imagegen81-2-phase4-2x.png, current-0-phase4-2x.png,
imagegen81-{0,1}-running-1x.png, imagegen81-0-reverse.png and
imagegen81-2-idle.png. Also inspected390×844
imagegen81-1-running-mobile-1x.png and imagegen81-2-running-mobile-2x.png.
Moving heroes are isolated from parked companions. Sampled support boots
meet the visible floor; mirrored Erik is grounded, and Olaf's stopped pose
uses the existing current body with one front shield. Scene-relative height
is comparable across current/trial evidence at1x/2x/mobile. The deliberate
flight phases remain a source/run feature, not accidental floor registration.

The full stride now takes128/112/104world units rather than72. At full speeds
230/175/150world units per second, this gives1.80/1.56/1.44cycles per second
instead of3.19/2.43/2.08. Phase accumulation is actual travel, and stopping
selects existing idle rather than running on an elapsed-time clock. This
substantially addresses rapid playback without changing physical speed.
The held screenshots establish pose visibility/registration, not a separate
reviewer realtime playthrough or video timing judgment.

Independently checked evidence.json:48phase captures, zero phase-label
mismatches and zero recorded browser errors. Independently ran
viking-cadence84, hero-frames, hero-skins and hero-art tests:12passed. Tests
and capture metadata supplement the inspected pixels; they do not establish
new source quality or eight anatomically distinct gait families.

## Unresolved gait / full-art verdict

The same-size board plainly retains four meaningful current70families held
twice. Trial Erik and Olaf have substantially more leg/arm phase variation,
but trial Baleog's eight cells remain near-duplicate guarded stances with weak
leg exchange. Slowing this cycle does not repair that source defect. Thus the
height and cadence correction is accepted for the previously authorized
optional experiment, while a complete eight-family gait fix is NOT COMPLETE.
Full native-density/processed sprite approval is NOT GRANTED. Retain the
raw-source failures and experimental exception; do not describe this as a
finished new character animation kit.
