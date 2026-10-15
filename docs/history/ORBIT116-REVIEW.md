# Scrap Orbit 116 — causal and interaction critique

Reviewer: orbit110_review, reviewing the proposed116 correction independently of its implementation. This reviewer implemented113 mechanics; the116 correction and its runtime evidence have not been implemented or approved by this reviewer.

Read: cooperative-world-design, grounded-parallax, native-sprite-art and VISUAL-REVIEW-GATE. Inspected current Orbit campaign/magnetic/render/view modules, ordinary-input route and unit regressions.

**Final verdict: source gate ACCEPTED for unchanged approved113 rasters; runtime gate ACCEPTED; cooperation gate ACCEPTED.** The initial critique below describes the pre116 implementation; the dated audit at the end records the corrections and actual evidence closing those findings. Prior113 clearability evidence was not substituted for116 discoverability.

## Why the end currently feels unclear

The normal route knows coordinates and future actions that the scene does not teach:

- A clamp succeeds near the carrier eye, but there is no equivalent visible destination berth at2900,324. Docking requires both coordinates within12world units. This is hidden precision rather than an interpretable crane puzzle.
- ACTION closes only if a payload is found. The rendered jaw follows `plateId!==null`, so an empty attempt produces no movement or feedback. The control can appear broken.
- Docking silently sets `hookDocked`, releases the load and leaves `operator` active. ALT still means crane release; it does not mean Baleog's bow. The player must infer USE to leave the panel, select Baleog, then shoot a second remote rope.
- `orbitObjects.done=hookDocked` makes the panel display ACTIVE while the exit remains locked. That is an ambiguous completion signal.
- The final target is at3180,248, while the usual passenger stands around2984. On a narrow2x mobile view, it can be offscreen even after selecting Baleog. The old automated route fires at a target it knows exists beyond that view. A similar visibility risk exists for the first distant rope.

Required causal repair:

1. Give the departure cradle an actual supported funnel/socket, matching the carrier's eye/lugs. Illuminate its existing cable/rail route after a successful clamp; show a visible empty berth before movement. Keep control instructions visible while operating, independently of optional puzzle hints.
2. Use a broad, visible capture mouth; its physical approach can guide the load smoothly into final alignment. Do not retain an invisible12-unit bullseye inside a much larger-looking socket. The load must slide/seat continuously, then mechanically latch and stop before hook release.
3. On seating, visibly engage the landing pawl, open the hook and move a connected guard exposing the next restraint. Report LOAD SEATED rather than implying the whole level is complete. Either automatically release panel ownership after this completed delivery, or make the persistent LEAVE CONTROL input explicit. Camera/HUD/action labels must agree in that same step.
4. Put the next rope and its physical connection inside the first legitimate inspection/firing view, or lead the eye there through a visible shaft/rail and a safe walking path. A mobile player must not need a blind arrow, unexplained camera pan or a code-known destination.

## Make magnetic shoes useful and legible

Currently they are toggled through inventory and can adhere only when upright soles are within6world units of a carrier. The route's ceiling walk is an optional demonstration: the ordinary top ride can solve the same progression. This explains the weak usefulness feedback.

- Give the shoes distinct states: carried, worn/unattached, attracting, attached and released. Show the worn state on both the hero's sole/boot and the small HUD item, with a brief attachment sound/spark at the actual rail contact. Use shape/state change as well as color.
- Introduce a fixed overhead steel attraction rail, visibly bolted to a service arch or deliberately suspended by the field. A safe floor-to-ceiling commissioning area should demonstrate its reach before placing an essential underside task there.
- Attraction must have a clearly bounded short field and an intentional entry/UP action. Accelerate and rotate the wearer continuously into the underside contact. Measure per-step displacement; do not snap an upright foot to a ceiling or let the body rotate through solid steel. All three heroes follow the same equipment rules.
- Context ownership must remain explicit: panel/ladder input takes priority, magnetic acquisition is offered only inside its visible field, and UP elsewhere remains the existing look-around control. Inactive parked heroes must not be pulled into a new field without a prior deliberate attachment.
- Make one physical task require the underside route: a restraint or inspection opening faces downward and is shielded from top shots. A conventional top ride must not give the same clean shot. Erik's exploration/jump can establish access, while Baleog subsequently uses the opened route; do not invent hero-exclusive magnet polarity.
- Keep the approved344x48 carrier and its312-unit flat rim. New rails/plates need their own reviewed native footprint and true mounting/contact anchors, not resized copies.

## Sequential timed shooting around a carrier

Use a visible three-pawl restraint assembly around one gravity center, rather than three unexplained lamps. A cut rope releases its pawl, turns a shared cam and physically exposes the next rope. Retain cut ends and locked-open pawls. A miss costs another rotation; it does not repair earlier ropes or reset the sequence.

The first exposure can be reached from the top. A downward-facing second exposure requires magnetic underside traversal. A third uses a side/ceiling firing notch and releases the carrier's docking brake. Steel guards must block wrong-angle arrows; their travel and exposure use the same authoritative state as collision. Ordinary exposed rope remains cuttable by a sword if genuinely reachable.

Keep targets in the firing view, show their approach before exposure and allow roughly1.3–1.5seconds of fully open time after the shutter finishes moving. Account for arrow flight and hero switching. Provide safe waiting portions of the rail and inactive-crew parking outside debris sweeps. The camera remains upright; only the hero, machinery and local bow basis rotate.

## Actual code causes of the reported physical defects

**Ladder pose after attachment:** `magneticMotion` assigns adhesion but never clears `h.climbing`/`h.climbMoving`. Orbit then skips its nonmagnetic ladder branch, leaving the old climbing flag available to `animationFor`. Clear ladder ownership and moving/grip state on magnetic acquisition; rebuild climb ownership only after a later real ladder interaction. Check idle, walking and stopped states after attachment for every hero.

**Olaf pushes air:** the current proximity condition allows45units either side of the ideal pusher root. At its outer edge, the body can be nearly49world units from the frame and still move it. There is also a vertical construction problem: the carrier's top is flush with the walking floor, so its solid body is below Olaf's hand height. Narrowing proximity alone cannot make the hand touch it.

Add a real bolted end handle/brace at Olaf's hand or shield-rim height, with an authored material-consistent sprite if needed. Drive pushing only from the registered hand/shield plane contacting that handle, within native-grid rounding, while standing and facing into it. Keep the contact seated during acceleration, stop and capture release. Do not move Olaf toward the frame by an unexplained pose snap. Record pusher/handle ports and test far-side, wrong-facing, airborne and boots-attached attempts.

**Empty clamp:** jaw state needs its own authoritative desired/open/closing/closed/opening state, independent of payload ownership. ACTION always closes; ALT always opens. An empty close visibly finishes and makes a mechanical sound. A load attaches only when the eye is physically enclosed, using its actual rotated mount; preserve the attachment offset and cable endpoints. Repositioning a closed empty claw should not acquire cargo invisibly without a new closing action.

## Continuous debris, floating depth and distortion

Current debris stops for a long rest portion of a7.8second cycle. For the requested continuous metallic orbit, keep angular phase advancing and place several solid pieces around a visible gravity center. Danger windows should emerge from their positions and safe radial/occluded zones, not from a stopped piece becoming damaging without moving. If a warning changes a piece's hazard state, animate the actual charged/armed material state too. Preserve persistent motion when debug danger is disabled; only damage is disabled.

Olaf's block must change the approaching piece's trajectory, temporarily stop/deflect it or otherwise prevent it from passing directly through his shield into Baleog. Current self-immunity alone is not a shield interception. Retain collision with the same moving silhouette and real damage for exposed heroes.

Use deliberate floating background assemblies with complete local transforms, tethers or visible field suspension. Do not shift a standing building away from its foundation. Background debris/gears have slower motion and lower contrast than the actual dangerous pieces; their visual language must separate collision from decoration. No semi-transparent duplicate scenery or unsupported foreground pillars.

Reuse a viewport-limited, native-grid refraction pass around the gravity centers. Distort the background before drawing solid actors, rail contacts, targets, HUD and text. Keep displacement subtle enough that a target or sole does not appear elsewhere than its collision; do not blur native edges or add a new full-screen readback for every piece. Compare mobile frame time and memory/cache bounds on the same scene before/after.

## Required116 acceptance evidence

- Demonstrate worn/unattached, attraction, first ceiling contact, underside travel, release and transfer for all three heroes. Record real foot/rail contact at1x/2x and coarse mobile, including the full transition and camera movement.
- A normal-input route must actually use the essential underside shot; a top-only route must fail for a visible steel obstruction, not an invisible role flag. Reviewer should infer the next mechanical subgoal from the current viewport and active controls before reading the route code or hint.
- Record all sequential targets before, moving, fully exposed, cut and reset. Capture a miss/retry and prove completed cuts persist. Include actual arrow obstruction and local muzzle direction.
- Show Olaf touching the authored push handle in early push, sustained travel, stop and coil capture. Proximity flags or a route success do not establish visible contact.
- Capture empty closing/closed/opening and loaded closing/clamped/released states under production controls, including pause/resume and operator change/death. Show berth approach, seating, automatic release/explicit control exit, and the next target within mobile inspection range.
- Record continuously orbiting debris early/mid/late, real damage, shield deflection protecting another hero and recovery. Include safe inactive-hero parking and a clear retry.
- Full healthy ordinary-control completion at60/120Hz plus actual desktop/coarse browser completion; source and runtime gates remain separate for any new or altered art. Final evidence must contain unobscured live contacts, not only paused badges or successful state flags.

The previous113 review established that the implementation could clear. The116 review must additionally establish that the next task, tool state and physical cause are understandable without source-code knowledge.

## Independent implementation audit — 2026-10-15

Inspected current campaign, magnetic, render, view and field-optics modules, the eight116 unit tests, desktop/mobile route receipts and actual production captures. `node --test tests/unit/orbit116.test.js` passed all8 tests. Both saved ordinary-control routes report won, allHP3 and empty browser errors; desktop102.95seconds, coarse mobile102.875seconds. These establish route feasibility, not discoverability.

### Source/native-density gate — ACCEPTED, unchanged-source scope

116 introduces no replacement generated raster. It reuses retained approved113 source art and source-cell fragments without increasing native density: plate192×96 native, physical opaque body172×24 native ->344×48 world; parts256×128 native with64×64 cells; backgrounds768×512 ->1536×1024 world; gear256×256 ->512×512 world. Reinspected `assets/orbit113/parts-raw-v2.png`, `parts-native.png` and `plate-native.png`, and renderer source crops/placement. The source's broad deliberate iron/brass clusters survive in the native parts; the rail rim, eye and shell retain their intended physical scale. Inherited selected-source evidence remains in `assets/orbit113/visual-gates.json`; this does not transfer its old runtime verdict to116.

### Corrected source behavior

- Roof pull interpolates the sole over0.6seconds, rotates continuously, and clears climbing flags. Actual `overhead-shoes-live.png` shows underside sole contact and visible mounted steel, rather than a floating ceiling prop.
- Carrier contact now requires Olaf at its actual left end; the renderer adds a raised handle using existing native steel fragments. Numerical contact test passes. A sustained-push visual is still required: current `push-first-frame-*` milestone precedes pushing and shows Baleog with Olaf absent.
- Empty ACTION drives an independent grab timer. Wider30-unit capture and52×46 berth tolerance remove the old hidden12-unit target. The cradle is visibly supported and loaded-claw captures preserve the plate eye contact.
- Rope cuts and sequence count now persist across timeout. The shutter drive cools for4seconds, then retries the next intact restraint. The revised retry unit test passes; final actual retry evidence remains required.
- Debris angle advances continuously at the actual field centers. Current source reverses its orbit on a front-shield interception and gives brief deflector grace, replacing self-immunity alone. A companion-behind-shield runtime test/capture remains required to confirm protection ordering.
- Field refraction is confined to viewport-clipped boundary strips, copied before actors/contacts/text, with a reusable canvas; no full-screen per-piece readback or bilinear smoothing is introduced.

### Runtime/cooperation gate — PENDING, concrete remaining conditions

1. **Mobile target visibility:** `mobile/captures/pawl-1-portrait.png` has the whole first restraint beyond the right edge; `pawl-3-portrait.png` shows only the left frame edge of the third. Neither shows the exposed rope. Knowing coordinates lets the automated route shoot, but does not tell a player what to aim at. Add a mild target lookahead/temporary well overview or another explicit inspectable directional cue; review live portrait captures with the exposed target and local bow together.
2. **Crane controls:** current `crane-gripped-portrait.png` and `crane-lifting-live.png` have two world-space instruction lines obscured by the right picker. Parent is preparing a compact badge. Review latest cold-build mobile evidence before closing this finding. Core operation must remain visible with hints off.
3. **Contact/state evidence:** capture Olaf during sustained push at1x/2x, final target after returning to Baleog camera, actual empty closed/reopened jaws, and the timeout retry with already-cut restraints staying cut. Full-route success and pre-action milestones do not substitute for these contacts/transitions.
4. **Physical shot constraints:** arrows currently test restraint rectangles but do not intersect carrier steel or target supports. Thus a shot can pass through an intervening solid carrier to a remote rope. If the sequence claims an essential underside firing route, block wrong-angle paths using the same visible solid rail/guard geometry. Otherwise do not describe the underside route as mechanically required. Validate both an obstructed shot and the intended exposed shot.

Visually accepted in the inspected captures: local rotated hero marker and sole registration on the carrier end/underside, native steel volume, stable plate dimensions, overhead rail mounting, loaded eye/claw alignment, and all-three exit feasibility. The newly extended target supports, compact HUD and field-ring revisions have not yet been independently accepted from final rebuilt evidence. Their publication remains pending, not rejected merely for missing captures.

### Final correction evidence received

Reviewed `assets/orbit116/final-mobile/route.json`: ordinary coarse/mobile route including timeout retry wins at135.2917seconds withHP[3,3,3], errors[] and116 captures. The recovery and resumed milestones both retain sequence1 and `[true,false,false,false]` cut state. Final source geometry blocks arrows crossing the carrier interior. `orbit-projectiles116.test.js` and `orbit-shield116.test.js` pass2/2: tangent arrows survive, crossing arrows stop; scrap reverses and a hero behind Olaf stays healthy.

Accepted final captures: `sustained-push-live.png` and `-2x.png` show shield/handle contact and handle/carrier attachment; `pawl-1-portrait.png`, `pawl-2-portrait.png`, `pawl-3-live.png` show both local bow/hero and complete respective targets after minimum360-world working view/target lookahead; `circuit-recovery-live.png`/`circuit-resumed-live.png` plus receipts establish persistent progress; `empty-clamp-live.png` shows visibly moving unloaded jaws, and `crane-gripped-portrait.png`/`crane-lifting-live.png` show loaded grip with all controls now readable clear of the picker. New target posts meet the actual opaque frame bottoms and recovery floor. Bounded ring optics precede foreground geometry, preserving real contact positions. Source and focused regression fixes above are accepted.

Only final pending visual condition: `departure-bow-restraint-*` is recorded before selecting Baleog and still shows Erik at the remote panel. Record the actual final Baleog aiming view before cutting the exit restraint, with the target and bow together, to verify the new+100 camera lookahead resolves the originally reported end-state confusion. No further full-route repeat is needed for that capture alone.

### Final closure — all three gates accepted

Reviewed `assets/orbit116/exit-aim/captures/exit-aim-portrait.png` and `exit-aim-2x.png`: active Baleog is on the departure carrier, the complete shutter/rope assembly is visibly on the same firing plane to his right, and the next door is visible in the wide view. `exit-aim/route.json` finishes healthyHP[3,3,3], errors[],102.825seconds. This closes the final target-discoverability condition. The immediate live image catches the camera in its ordinary follow transition after changing heroes; the settled production portrait/2x views establish the final framing without moving any hero or target.

Also inspected `final-hook/captures/crane-lifting-portrait.png` and its successful healthy hook-route receipt: the loaded crane's90-world lookahead reveals the receiving deck while keeping the load and readable controls visible. `touch/captures/coarse-touch.png` shows the final single-line MAG ON equipment indicator beneath the bag slots; touch state confirms boots worn. No clipped picker/badge text remains in the reviewed final controls.

The initially identified faults now have source fixes, meaningful focused regressions and actual production evidence. Source/native-density, processed/runtime and cooperation gates are **ACCEPTED** for116. Publication may proceed subject to the parent release's normal package/build checks; no review-requested runtime corrections remain.
