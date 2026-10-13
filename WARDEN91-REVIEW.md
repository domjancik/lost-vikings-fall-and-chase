# Warden91 — independent refinement review

Reviewer: Warden critique agent. Source and actual runtime gates are separate.

## Specification and implementation review — 2026-10-13

Read WARDEN91-SPEC.md, warden-campaign.js, warden-combat.js, warden-render.js
and the ordinary-input route. The accepted Warden89 cooperative mechanism and
human-scale geometry remain; this pass adds active defence and finite strain.

**Causality/fairness design: ACCEPT provisionally.** Four identifiable feet
alternate their warning/lift/hold/stamp stroke; real contact launches swept low
waves. Jumping, facing a front shield and visible raised ledges/posts provide
physical responses. Tracking0.85seconds followed by fixedaim0.7seconds and
fire0.35seconds is a readable dodge opportunity, provided actual warning/lock
states differ and the danger line stops on visible first-contact surfaces.
Only the selected chamber intruder is initially targeted; parked heroes may
still physically intercept a ray and must not be implicitly invulnerable.

A14second brace has a visible strain gauge, smooth release and2second recapture
cooldown. Recovery must carry the spine rider rather than teleport/drop it, and
the normal route must demonstrate adequate time to access/bash/switch/shoot
without perfect subframe timing. A missedwindow must be repeatable. Existing
waves persist after shutdown until their own lifetime ends.

The rightward impact cap correction must be verified against actual before,
intermediate and heldcap pixels, not merely reversing frame indices. Body/base,
source scale and spring/hand contact must remain registered.

## Native-density/source gate

**ACCEPT for unchanged approved Warden89 sources only.** Source reuse retains
parts-raw-v2.png, the approved processed512native component atlas and the
960×720native panorama. The renderer applies saturation0.62/brightness0.88;
this changes color presentation, not source density, silhouette or registration.
No new generated sprite or Viking90 source is approved by this review.

## Processed/actual runtime gate

**PENDING.** New color grading, alternating extreme leg poses, foot/shield
contacts, strain depletion/unload, wave cover and laser track/lock/fire require
actual1x/2x/mobile production-control captures. Warden89 approval does not waive
those changed contexts. No runtime approval is granted from simulation alone.

## Replacement plunger source/native review — 2026-10-13

The initial frame-reversal assumption was invalid: source89 moved cap, housing
and base together. Reviewed new assets/warden91/plunger-raw-v1.png (1983×793),
exact plunger-prompt.txt, plunger-native.png (320×64, four80×64cells),
plunger-native-4x.png and registration.json. The source uses deliberate enlarged
approximately8pixel material clusters; uniformsourceScale8 is a reasonable native
normalization. Wholecell translations register the broadtealbase right/bottom
at76/50; no individualpart stretching or bodysplice is used.

**Replacement native-density/source gate: ACCEPT.**
**Replacement processed-isolated-native gate: ACCEPT.**
Fourcells preserve readable brass/steel volumes and stablehousing/base. Thecap
advancesright approximately29→33→35→38native while coilspacing compresses. The
lastcell's1nativepixel sourcebasevariation is acceptable gridrounding rather than
an actorjump. Preserve the rawfailed89stroke observation and finalgeneration
provenance. Actualgame before/intermediate/held/reversecap remains to be checked.

Footperiod is now6.5seconds with liftedhold2.2..4.5, after the realbrowser showed
the oldapproachwindow was too tight. This gives Olaf travel/command margin without
changing hero speed. Actualwarning/contact must still share that authoritative
phase; the currentruntime gate remains PENDING.

## Optical causality and separate emitter source review — 2026-10-13

The draft defenceopened the mainshutters to0.3 while requiring>0.97 for arrows.
That left a visibly32world-highglassslot that anarrow could physicallyfit, yet
logic rejected it. **Draftopticalcausality REJECTED.** Use a separate visibly
orangeaiming/emissionport so weakcyanlens shutters staysealed until the mechanical
plunger; beamorigin must meet that emitter's actualopaque pupil.

Inspected new assets/warden91/emitter-raw-v2.png, emitter-native.png/+16x,
emitter-prompt-v2.txt and proposed32×32native/64×64world contract. The generated
original preserves the guideblocksize with broad2–4native shadingclusters and
retains brassring, darksteelrecess, connectedtealmount and orange pupil. Uniform
fullcanvas→32native normalization and wholecell+1y translation preserve native
silhouette without repeatedprocessing, scaling bybbox or partsplice.

**Emitterv2 native-density/source gate: ACCEPT.**
**Emitterv2 processed-isolated-native gate: ACCEPT.**
Rejected emitter-raw-v1-rejected.png remains failedprovenance. Actualhelmetmount,
pupil-to-beam registration and weaklensclosedwarning states remain PENDING.

Actual replacementplunger before/full desktop1x and middlemobile2x captures
were inspected. Capmovesright relativefixedhousing/base, springscompress and
Erik'simpactcontact is readable. Colorgrading preserves Clockworkvolume while
heroes and danger remain distinct. This affectedplunger runtime aspect is ACCEPT;
overalldanger/runtime gate still awaits complete newemitter/state evidence.

## Final danger and contact review — 2026-10-13

Independently inspected final output/warden91/brace-desktop-1x.png,
cap-before-desktop-1x.png and the danger matrix: laser-track-desktop-1x,
laser-lock-desktop-1x, laser-fire-shield-desktop-2x/mobile-1x,
laser-ledge-cover-mobile-1x, leg-2-raised-desktop-1x,
leg-0-raised-mobile-1x, leg-1-impact-desktop-1x, leg-3-raised-desktop-1x,
brace-strained-rider-desktop-1x, brace-exhausted-desktop-1x and
unloaded-rider-mobile-2x. These paused captures freeze real production state;
the completed danger/evidence.json reports errors[].

**Processed/actual1x/2x/mobile visual gate: ACCEPT.** The separate orange emitter
seats onto the optic helmet and remains distinct from the sealedcyanweaklens.
Trackdashes, fixedlockline and brightthickerfire are readable; native-gridbeam
ends on the actual shieldface and physical cover. The previous arbitrary narrow
slit exception is removed. All four foot identities/loadpaths remain coherent
in alternating warning/lift/impact; impactwaves and frontshield responses read
at mobile size. Strain depletion and carriedrider unload preserve grounded
support instead of teleporting actors. Materialcolorgrading retains Clockwork
volume and adultscale, while heroes and danger remain distinct.

**Native-density/source gate: ACCEPT.** Reused Warden89 sources remain accepted;
new plunger-raw-v1.png and emitter-raw-v2.png plus once-normalizednative versions
are explicitly accepted as reviewed above. Emitterv1 remains rejected.

Independently ran node --test warden-combat.test.js warden-audio.test.js
warden89.test.js warden-route.test.js:17passed,0failed. This includes genuine
hazard/shield/terrain, alternatelegs/finitebrace, separateemitter, persistedwaves,
fullhealthyordinary60/120Hz routes and missedwindow/unload/recall recovery.
**Mechanical causality/recoverability gate: ACCEPT.**

Current actual browser-route.json reports won=true,HP3/3/2,time107.25,errors[].
This is a valid completion with realdamage, not a fullhealth browser proof.
Do not describe that run as HP3/3/3. Root is rerunning the ordinary route; record
its finalmanifest separately. No unresolved visual blocker was found in the
inspected final contexts. Livebuild hashes/browser success remain publication
verification responsibilities; this gate does not attest unseen deployment.
