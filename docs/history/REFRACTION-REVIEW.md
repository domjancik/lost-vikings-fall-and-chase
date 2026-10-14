# Refraction Gate independent review

## Concept verdict

**Conditional conceptual pass; resolve the optical/state contracts below before implementation acceptance.** The concept has a distinct causal identity: crystal-latch release enables mirror/vent, a raised shield catches air, persistent mirror alignment delivers energy, and a powered passenger lift reunites the crew. No mandatory hero-ID lock or stranded beam holder is required. This is source/spec critique only; no implementation, new art, simulation or browser playthrough has been validated.

## Geometry and recovery assessment

Floor feet900 place Olaf atY856 and his raised shield support at820. Erik's -570 jump under1250 gravity reaches about129.96 units; shield-to-shelf700 is120, leaving roughly10 units clearance. The200-unit floor-to-shelf rise cannot be reached by Erik alone. Shield staging1280 lies within shelf1200..1500, so horizontal landing distance is not a problem; prove actual boarding/rejump at60/120Hz rather than using theoretical apex alone.

Draft feet310 gives80 clearance over gallery390. Draft right edge720 to gallery start780 is60 units: Olaf at150 horizontal speed can cover it within0.4seconds, and his raised-shield terminal descent100 gives about0.8seconds before reaching gallery level. This is plausible with a settled continuous draft, but must be tested from real controls at both rates and with horizontal acceleration. Specify the actual vertical velocity/cutoff behavior so the stated clearance is achieved rather than merely asserted.

Olaf's return is essential: walk off the gallery away from its supports and lower the shield before reentering the draft if necessary. Retaining a raised shield in an always-on updraft can prevent return. Record a repeatable normal-input descent and safe floor landing, not teleportation. Returning by the gallery's right edge is also valid if it avoids the draft column. No lethal fall, beam damage, or offscreen death threshold should invalidate that recovery path.

Passenger lift2080..2240 overlaps the upper exit deck2200..2800 by40. That creates a valid upper step-off, but overlapping static deck and moving lift surfaces must not capture stationary deck occupants or overwrite existing lift support. Keep explicit support ownership and preserve carried riders across overlap. All three fit on the160-wide lift and may ride separately; after alignment latches, every operator has a floor route to the dock. Prove separate trips and last-operator reunion, not just simultaneous boarding.

## Required specification corrections

**R1 — Reflected rays must follow physical reflector orientation.** Describe incident/outgoing rays and angle endpoints for A, B and C. A receives a rightward ray and redirects upward; B receives upward and redirects down-right toward(1400,676); C redirects that diagonal horizontally toward(2200,676). Mirror normal/rotation must visibly correspond to these directions. During0.8-second rotation the beam must sweep from the actual fixed pivot according to the current angle, not merely interpolate or teleport its endpoint between named targets. A receiver accepts a ray only when it actually intersects its visible lens and orientation/settling tolerance is met. Ray continuity and endpoint contact need own-pixel before/moving/after evidence.

**R2 — Distinguish energy dependency from arbitrary control order.** The phrase source order cannot be bypassed must mean no downstream light/charge before an upstream ray reaches it. Handles should remain universal and prealignment should be allowed; turning C before B is physically sensible and must not require repeating C solely because a stage flag changed. Test all relevant alignment orders, and require receiver charge to reset or pause consistently if the beam leaves it. Mirror orientations remain visibly latched and powered reunion remains recoverable.

**R3 — Declare beam and support interaction rules.** State whether heroes/shields occlude light and whether the beam is harmless. Do not add accidental body/shield beam interruption after the conceptual route was accepted. If occlusion is intended, demonstrate safe mirror-operation pads and persistent power or a no-holder reunion route. A and C need broad pedestal bases at their support planes; B must visibly join a ceiling/axle support. The wheel at860 needs a continuous visible axle to B at600, with no detached or arbitrary remote behavior. The shared glass latch/damper must show its physical link and retained broken state.

## Mandatory implementation and art evidence

Retain original source/prompt, target native/world dimensions and registered pivot/base for each new family. Before packing, inspect RAW native density separately from processed64-native cells and actual128-world gameplay. Inspect mirror-angle, glass-release, wheel/vent and receiver initial/moving/completed states, lift rim/passenger support, beam contact and portal powered state at1x/2x/mobile. Do not reuse fine source density hidden by downsampling, procedural replacement arms, canvas-bound grounding, or a prior broad survey approval.

Required route regressions: no airflow/light before A settles; prealigned B/C work when energy arrives; beam sweep remains continuous and registered; draft ascent/steer/return; shield shelf boarding/rejump; lift overlap ownership/corners/reversal and missed boarding; three separate reunion trips; all heroes alive full routes60/120Hz and real browser full clear/Enter. Record independent checks separately from reported route evidence. No pending Vikings55 work is accepted by this review.

## First machine RAW source review — rejected pending regeneration

Independently inspected `assets/refraction62/machines-source.png`, the4x4 sheet proposed for64-native cells displayed128world. Broad cyan facet planes are suitable, but the contour/bevel detail, fan grille bars and wheel spokes/highlights include source-scale1–3-pixel elements within roughly313-pixel cells. A64-native target requires roughly5-source-pixel logical steps; those fine features would merge or turn into isolated noise. Receiver frames additionally contain speckled/glowing pixels in their transparent recesses, rather than clear binary gaps. This RAW gate fails; packing, grid detection or alpha cleanup must not be used to rescue inappropriate density.

Regenerate fan/receiver/wheel with deliberately coarse minimum~5-source-pixel squares, thick1–2-native grille/spokes, broad bevel tones and clear transparent gaps. Generate receiver state through clean retained facets; runtime supplies glow. Wheel source poses appear almost identical and need visibly rotated authored spokes plus persistent completed state. The mirror row is separately unaccepted because its illustrated angles do not yet implement the specified optics; a stable authored reflector/pivot must be visually consistent with actual reflected rays.

This verdict is on RAW source density/state preflight only. No processed or gameplay machine art is accepted. Preserve this initial rejected source and exact prompt, then review the regenerated original before packing.

## Dedicated mirror RAW source review — rejected pending native/angle correction

Independently inspected `assets/refraction62/mirrors-source.png` (4x3 proposed64-native cells). Broad cyan surfaces are readable, but fine mottled stone/purple-column shading, thin silver bevels and noisy contour fringes still exceed the target detail density. Packing this sheet would erase or alias those features; reject/regenerate instead of rescuing through sampling.

The apparent long-axis endpoint of mirrorA is also closer to roughly30 degrees than the required45. The perspectival elliptical plate makes the actual reflecting plane ambiguous. Generate a coarse flat side-profile plate with a clearly straight reflecting edge, fixed hinge/base registration, and angle directions matching physical optics. Alternatively, after RAW approval of one coarse plate, native-raster rotation around a fixed pivot may follow the same authoritative angle as the outgoing ray; processed/runtime silhouette and ray-contact evidence is still mandatory. No source or runtime mirror acceptance is established by passing route simulations.

## Coarse fan/receiver/wheel RAW density preflight — accepted; transparency/runtime pending

Independently inspected `assets/refraction62/machines-coarse-source.png`. Broad fan blades/grille, crystal facets, simple metal bevel planes and thick wheel spokes now match the64-native-cell detail budget. Wheel direction and retained completed indicator visibly differ. RAW detail-density preflight passes for these three families; the rejected first sheet remains superseded.

Visible noisy blue/gold fringe pixels remain around transparent recesses and edges. An independent PIL read confirms source1448x1086 and intermediate alpha. Simple source alpha normalization may clean extraction fringes, but the processed/native gate must explicitly inspect clean binary gaps, absence of colored halo and preservation of structural clusters. Do not use aggressive cleanup or resampling to rescue lost geometry; regenerate if recess speckles or outline damage survive. No processed/in-game gate is accepted yet. Mirrors remain under their separate RAW/physical-angle gate.

## Parts and landscape RAW preflight — accepted

Independently inspected `assets/refraction62/parts-source.png` and `scene-source.png`. The four-part strip uses broad flat clusters suited to64-native square crops, with a straight side-on reflector edge and clear hinge rather than an ambiguous ellipse. Pedestal, emitter and lift structure preserve coarse bands. RAW density preflight accepted; processed review must measure the plate/pedestal hinge centers independently and register their physical joint. The lift needs its visible walking rim at the support plane rather than aligning its decorative underside.

The2079x756 landscape has intentional fine environmental clusters compatible with the stated1400x509 native background and preserved landscape ratio. RAW background-density preflight accepted. Runtime must register the substantial visible foundation near sourceY614 to floor900, conceal small foundation irregularities with actual foreground terrain, and prove no air strip appears across parallax/camera positions. Its distant arch bridge should remain subdued so decorative scenery cannot be mistaken for a traversable foreground route. These are source preflights; processed and actual1x/2x/mobile gates remain pending.

## First implementation/processed review — blocking ray continuity and superseded receiver evidence

Independently read refraction campaign/renderer/art-layout/connections, preparation script and retained README; ran `node --test refraction.test.js`: **10 pass**, including complete60/120 routes, draft recovery, separate reunion, prealignment and reflection-plane consistency. These establish meaningful simulated feasibility. Current source uses persistent universal handles; harmless rays interact with authored optics, while shields retain only their airflow/support role.

The accepted coarse machine/parts/scene originals are processed once at fixed scale; base translation and detached extraction-fringe removal preserve meaningful clusters. Independently viewed native machine atlas/base/reflector/lift. Native clusters, clean facet boundaries and thick spokes remain readable; rotation uses the accepted straight plate on a fixed native raster, driven by the same declared plane as the mathematical reflection. Inspected initial1x/2x and mobile, catch moving/settled, upper moving/settled, lower moving, shield-step and refreshed draft views. Shield soles and both upper/lower operator supports contact their actual terrain; upper mirror hangs from its bracket and axle. Scene foundation is covered by continuous foreground without an exposed air strip in inspected initial/mobile views.

**P1 — Reflected ray endpoint jumps at settling.** `refractionBeam` currently renders every rotating outgoing ray with length170, then changes it immediately to the target when `pose === 1`. The first three target distances are approximately362/816/840 world units. Correct angular reflection therefore still produces an abrupt hundreds-of-units beam extension at the settled frame. This fails the user's continuous-causal-animation requirement. Render the moving ray continuously to a physical boundary/intersection, preserve downstream energy gating, and add a near-completion endpoint-continuity regression. Do not equate passing reflection-angle tests with continuous rendered motion.

**P2 — Receiver base evidence superseded pending corrected captures.** The implementation agent identified neighboring-row extraction pixels beneath the receiver, making base detection report a false bottom. Preparation now retains the connected physical sprite and changes its translation from0 to5native pixels, but previous receiver/lift screenshots are explicitly excluded from final grounding acceptance. Inspect fresh charging/powered/three lift trips and clear views after this correction, plus final glass-origin correction824. Ground contact must come from actual opaque feet rather than nominal contact diagnostic alone.

RAW accepted-source preflights stand; final processed/runtime verdict remains pending P1 correction and current receiver/lift evidence. No separate browser playthrough was performed by this reviewer, and pending Vikings55 is excluded.

## Corrected implementation re-review

P1 resolved in current source: outgoing rays cast continuously to room boundaries throughout rotation, with receiving-aperture interception as their angles reach each next optic. The old170-unit cap and pose1 length extension are removed. Independently reran `node --test refraction.test.js refraction-art.test.js`: **13 pass**, including near-completion continuity for all three rays, physical reflection plane, prealignment, full60/120 routes and actual PNG support validation.

P2 geometry resolved: independent alpha inspection finds receiver frames4..7 have53–54 opaque pixels on their true final native row, and the PNG validator establishes connected silhouettes and broad two-row foundation. Fresh lift0/1/2 show receiver feet directly registered to its deck and all three heroes boarding the grounded rim on separate trips. The old false-foot extraction evidence is superseded. Fresh clear shows all crew reunited on the actual exit deck. Updated glass fragment origin824 remains above the supporting floor at initial state.

Independently viewed the refreshed catch/upper/lower moving views, receiver-labelled captures, three lift boardings, clear, and latest mobile initial/draft1x. Source/native scale, plate/ray agreement, harmless beam rules and support recovery pass in this inspected evidence. However, the refreshed files named receiver-charging/powered initially frame C/Erik while the receiver itself is offscreen. Their names and successful flags cannot substitute for actual receiver pixels. Final processed/runtime verdict awaits the announced full-room receiver-own-pixel initial/charging/powered captures.

## Final independent acceptance — RAW source and PROCESSED/runtime gates

**RAW native-density/source gate: ACCEPTED for the regenerated coarse machines, straight-edge parts and landscape sources.** Rejected original machines/elliptical mirrors remain unused. Targets are64-native cells/128world, fixed2world pixels, and1400x509 landscape/2800x1018world. Retained prompts/originals and once-from-original preparation preserve the accepted density; connected-fringe cleanup and base translation do not replace artwork or rescale individual silhouettes.

**PROCESSED/in-game gate: ACCEPTED.** Independently inspected final native assets and refreshed actual gameplay state/contact evidence. P1's arbitrary beam-length extension and P2's false receiver-base pixels are resolved in current source and meaningful regressions. The final `refraction62-receiver-review-start.png`, `refraction62-receiver-review-receiver-charging.png` and `refraction62-receiver-review-receiver-powered.png` show the receiver's own dark initial facets, genuinely partially cyan lower facets, then white-cyan full lens plus retained base indicator. The portal remains dark during charging and lights only at completed power. These wide1x captures use normal pause to retain brief intermediate states; receiver/portal lie outside the dim pause overlay. Earlier offscreen/too-early charging captures are superseded.

Other final evidence inspected includes catch/upper/lower moving and settled views, shield-step, all three separate lift boardings, clear, initial/draft1x/2x and mobile. Fixed plate pivots, source-to-runtime clusters, beam reflection direction, broad feet/deck boundaries, operator soles, lift rim and hanging upper bracket remain readable and physically registered. Background foundation has no exposed floating gap in inspected camera contexts. No colored extraction halo or disconnected receiver fragment remains in the accepted native matrix/contact views. Mirror handles can prealign without energy, directions latch, Olaf can return, and all crew can independently reach the powered reunion lift.

Independently executed **13 passing focused tests**, including actual native-PNG validation and full60/120Hz routes. The implementation agent reports latest full ordinary-input browser clear at103.266seconds, all heroesHP3, Enter continuation and zero page errors, with no mechanic edits afterward; latest mobile pointer movement/bow releases the draft. It separately reports265 root tests passing. This reviewer independently read source, ran focused tests/alpha checks and inspected production captures; no separate browser playthrough was performed. These evidence boundaries are explicit and no prior route/survey approval substitutes for the corrected final images.

**No remaining blocking finding in the Refraction Gate scope.** Both required art gates are separately accepted. This does not approve pending Vikings55 art or certify unrelated legacy scenery.

## Published release verification — 2026-10-12

Implementation commit b954c3b published to the existing here.now site. Live HTML,
10 runtime modules and all6 native Refraction assets match the isolated reviewed
release by SHA256. Real live-browser1x/2x and844x390 mobile checks pass; pointer
movement and bow release the draft, every measured support contact has gap0,
and no page errors occurred. Captures: output/playwright/refraction62-live-*.
