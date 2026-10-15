# Method-aware transitions126 independent review

Reviewer: sewer125_review. Scope: docs/history/TRANSITIONS126-REVIEW.md only. Applies repository native-sprite-art and VISUAL-REVIEW-GATE principles to existing latest90 sprites and native scene distortion; no new generated art or changes to125 asset verdicts.

## Initial policy and implementation review

Read TRANSITIONS126-SPEC.md, level-transition.js, transition-render.js, game lifecycle/render ordering and targeted tests. Departure policy follows real construction: teal Machine Rooms portals, authored story accents, sewer right/down water, physical final rain door and story body transfer. Arrival preserves prior method while the sewer explicitly uses actual gravity through its ceiling. Simulation is held for other visual arrivals; current frame/source samples remain integer native rectangles, bounded scratch copying uses no pixel readback, and world distortion occurs before HUD/resources/text. Existing generated sheets are reused without resampling them into a new art source.

Initial design accepted conditionally. Required production evidence: real portal exit/wait/entry; sewer completion/current/wait/water arrival; physical ceiling fall; door/transfer samples;1x/2x and genuine coarse mobile; latest90 ready receipts. Need actual spawn camera initialization, input release/held-key isolation, pause freeze, restart/new selection cancellation, chapter-card pause, resize sampling and zero page errors. No final acceptance before visual evidence.

## Initial blocker

Only continuation Enter/Space codes were quarantined. OS autorepeat from an ArrowRight/action key held through continuation/arrival can re-enter controls.press after arrival ends, despite controls.clear. Requested quarantine of all held gameplay keys until a physical keyup, with browser proof holding direction through the entire entry. Reset correctly discards old transition objects; opening a menu can pause the same entry while selecting a new scene must cancel it. Document this distinction rather than imply all menu opening cancels.

## Pending verdict

Policy, lifecycle, runtime/native visual and performance gates pending corrected input handling and actual production screenshots/routes. No code edits or commits by reviewer.

## First production entry survey

Inspected initial assets/transitions126/entry desktop2x portal, water, fall, door and transfer, plus coarse-touch water. Screens confirm actual scene warp, true falling trio, right/down water cover, correct teal portal language and separate transfer beams. HUD button stacking was being corrected; early door frames were too early/opaque to establish a walking pose, so root added a real distance-derived walking gait and planted only near-floor default spawn offsets before final recapture. Initial7 targeted tests independently passed, including all-key quarantine added after the first critique. Production entry matrix reports10 desktop/coarse cases with pause, no-input-leak, normal movement and zero-readback optics; final browser lifecycle evidence still pending.

## Arrival causality correction requested

Local menu/retry story round6 originally inherited its own departure method (body transfer), which would visually grant the chapter's earned result before the player completed it. Normal5->6 correctly carries a portal, and6->7 correctly carries the body transfer. Requested local policy to derive the known preceding chapter method: round6 portal, round7 transfer, with actual previous-method body-transfer handoff evidence rather than treating a menu start in round6 as narrative proof. Physical outside-door departure remains correct for final round7. Sewer intentionally overrides prior method with its authored tavern ceiling fall.

## Lifecycle and policy corrections verified

Independently reran10 targeted transition/audio tests: all pass. Held-key state now tracks all pressed codes, captures preheld keys on reset, quarantines gameplay keys pressed during entry and releases only on physical keyup. Modal close also captures all currently held codes, covering directions pressed during a chapter card. Current production entry matrix reports10 desktop/coarse contexts: four actual entry methods on each pointer mode plus chapter/restart lifecycle checks. Pause freezes entry, held direction autorepeat after idle is ignored, release/new movement works, and restart replaces the previous phase. Story cards hold arrival and closing Enter/direction cannot leak. Scene selection/reset clears old objects; merely opening/closing a menu pauses/resumes the existing entry.

Local WHAT A RESET COSTS arrival now uses a portal; the premature body-transfer entry proof is explicitly rejected and archived. Earned transfer is instead tested through actual normal-control6->7 completion. Authored portal anchors now use actual story/machine aperture centers, with a targeted regression. Door entry uses distance-derived walking poses and only near-floor default spawns are planted; actual sewer fall is never repositioned or visually duplicated.

## Production visual and ordinary route survey

Inspected current entry desktop/coarse portal, water, door and real fall at early and late phases, and desktop1x/2x. Portal actors emerge through an appropriately colored native aperture onto their real spawn, water carries/tips them at full size toward the spawn, door entry walks with planted gait, and sewer falls under actual gravity. Camera frames the true spawn, including distant/tall scenes. No new bitmap assets were generated or substituted.

Inspected actual earned story portal departure/tunnel/interstitial/arrival and body-transfer departure/beam/interstitial/brass-body arrival under assets/transitions126/story. Both ordinary routes have full crew health. Portal color carries from the departing authored story accent; transfer uses vertical body beams and no unrelated vortex. Inspected the normal sewer route receipt60.2417seconds HP3/errors[] continuing to stable4 with water method. Early continue and held-key leakage are rejected. Existing interstitial remains; no premature seamless advance.

The bounded native warp copies current scene pixels with integer rectangles and no readback; effects finish cleanly. World resources/feedback are excluded and HUD text remains crisp. Requested final minor fix to blank paused badge caused by blanket label suppression; root retains only PAUSED label outside discarded world text. Final water-arrival receding wash is being made translucent/channel-shaped so the actual warped scene remains visible. Await final refreshed captures for those cosmetic changes before the final verdict.

## Final acceptance

**Accepted for release. No blocking findings remain.** Final evidence independently inspected:

- assets/transitions126/entry/evidence.json:12 contexts, errors[]. Five real method policies on desktop and genuine coarse touch, plus chapter/held-key/restart checks in both pointer modes. Actual1x/2x and coarse screenshots include the corrected walking door pose, full-size water ride, teal portal emergence, actual sewer gravity and earned/local brass-body transfer.
- assets/transitions126/story/evidence.json: ordinary story portal1->2 in60.1417seconds and earned body transfer6->7 in41.125seconds, bothHP3/3/3 and no errors. Inspected early departure, tunnel/beam, preserved interstitial, late arrival and settled scenes. The transfer is earned in the real machine rather than fabricated by a menu fixture.
- assets/transitions126/water-route/evidence.json: complete ordinary sewer route60.2833seconds, HP3/3/3, errors[], continuation to stable water4. Water departure uses already-swept crew; arrival preserves right/down motion and full character size. Receding translucent channel-shaped wash exposes actual warped destination pixels.
- Current desktop-door-late, desktop-water-late, touch-water-late and desktop-transfer-late visuals: PAUSED text restored above the scene effect, HUD/health/text crisp, native sprites retain source scale/identity and settled feet meet real spawn floors.

Policy/lifecycle verdict accepted: local chapter6 portal and local chapter7 transfer correctly reflect preceding events, while chapter7 departure remains the physical outside door. Previous escape method carries through wait/continue; sewer's deliberate ceiling fall override remains actual physics. Early continue is ignored. Held keys from gameplay, arrival or chapter cards remain blocked until keyup, including synthetic autorepeat after entry. Restart/new scene selection cancels old state; modal opening pauses and closing resumes it. Near-floor planting is narrowly bounded and never changes the authored fall.

Native rendering/performance verdict accepted: integer source/destination strips remain within the native framebuffer, bounded scratch copying has zero readbacks, portal locality is capped, and effects exhaust cleanly on tiny/mobile/desktop raster tests. HUD/resources/labels are drawn outside distortion; no new bitmap source or character resampling pipeline was introduced. Actual mobile contexts complete phases without errors. This is bounded-code and functional-browser evidence, not a claimed device-wide FPS benchmark.

Reviewer independently reran all11 targeted transition/audio tests successfully. Root reports632 full-suite passes,30 source/build preview smoke checks and471 matching release bytes. Final Git/release/live-byte verification remains root's responsibility; no code or125 gate edits by reviewer.
