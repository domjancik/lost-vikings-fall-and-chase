# Campaign redo — independent review

## Review status

Initial review is pending `CAMPAIGN-REDO-SPEC.md`. Existing `FIRST-CAMPAIGN-SPEC.md`, `story-campaign.js`, `movement.js`, and `story-render.js` were inspected for context. This document is critique and validation evidence, not a claim of playable completion.

## Review gates

1. **Narrative progression:** each descent reveals a new underlying system and that revelation changes the world and the puzzle rules. Environmental evidence must foreshadow the brass bodies and make the final transfer understandable.
2. **Fresh visual language:** newly authored scenery, foreground structures, doors, enemies, and machine silhouettes; no reused forge/organ/observatory/gallery imagery. Distinguish depth through architecture and scale rather than merely tinting previous scenes.
3. **Common-sense affordances:** material and mechanism appearance predicts the effective action. Ordinary USE controls work for any Viking who can reach them. Jump, weapon reach, shield protection, floating, and body support supply natural differences; hero-ID locks do not.
4. **Physical cooperation:** doors exist at their collision positions and connect adjacent spaces. Every required separation has a causal route to reunion. Holding a switch alone is insufficient if the final holder cannot leave it.
5. **Continuous causality:** cables route from controls to gates; released pieces fall along continuous trajectories; lifts carry occupants; gate collision follows visible gate movement. Distant results need visible conduits or camera framing, never unmotivated instant relocations.
6. **All-Viking feasibility:** Baleog and Olaf cannot jump. Every mandatory ledge needs a walkable slope, lift, support-assisted descent, or supported transport. Olaf’s raised shield is narrow and caps downward speed; no assumption of arbitrary upward flight.
7. **Recoverability:** quest items cannot be consumed by wrong use; lifts return; early gate operation does not trap anyone; fallen objects reset or remain reachable; destroying optional resources cannot invalidate the chapter.
8. **Hazards and combat:** closed gates stop shots and enemies; shields act before body collisions from their real facing direction; hazards have telegraphs and safe recovery space. Enemies must not spawn, patrol, or attack through doors or exit staging.
9. **Readable artwork:** authored sign lettering on the final grid, silhouettes distinguish material affordances, stable sprite pivots and native pixel density, no baked moving effects or background normalization speckles.
10. **Independent proof:** distinguish conceptual design review, normal-input simulation routes, actual browser playthrough, and visual inspection. None substitutes for the others.

## Required implementation evidence

- Full production-control route per chapter at 60 Hz and 120 Hz; no teleports, forced flags, injected keys, or disabled hazards.
- Real-browser keyboard playthrough per chapter, plus actual pointer overlay actions on portrait mobile and landscape checks.
- Screenshots at every major gate and transition, including blocked, moving, open, reunited crew, and completed states.
- Tests for premature operation, wrong item/action, unattended holder, blocked gate during movement, lift reset and rider retention, enemy/projectile gate collision, item drop recovery, and whole-crew exit.
- Brief causal explanation for each puzzle: what the player can see, infer, do, and verify afterward.
- Independent second review after implementation, with evidence paths and explicit unresolved findings.

## Context-only findings from the old campaign

These are problems to avoid, not findings against the pending redo:

- Many USE devices reject ordinary reachable characters using `s.active === 0` or `s.active === 2`, without physical justification.
- Most doors teleport characters to remote coordinates and erase velocity instead of dividing connected physical spaces.
- Several attacks flip remote gate booleans immediately; visible motion and collision are not causally coupled.
- Foreground art is selected from earlier level themes, weakening the intended descent into a newly revealed underlying reality.

## First design review — CAMPAIGN-REDO-SPEC.md

**Verdict: conditional design pass; layout and puzzle-variety blockers must be resolved before implementation is accepted.** The narrative progression, new material vocabulary, universal handles, final material embodiment, removal of teleport doors, and continuous machinery contract address the previous campaign's principal failures. This is conceptual review only: no new route simulation, browser playthrough, asset inspection, or implementation validation has occurred.

### Blocking findings and concrete corrections

**B1 — Repeated cooperative gate sequence dominates the campaign.** Chapters 1, 2, 4, 5, 6, 7, and 8 describe a pressure tread followed by downstream ratchet or an unspecified version of that sequence. This may be a useful shared vocabulary, but repeating it as the main obstacle contradicts puzzle evolution. Keep it as the introductory lesson in chapter 1 and one later combination. In other chapters, use causally distinct cooperation: hold the routing track in alignment while an independently controlled cradle docks (2); shield an exposed operator while a purge finishes (3); change a stamp's position so it becomes a traversable safe deck (4); carry an archive and crew through separate access routes before closing the copy loop (5); use an asymmetric float route and upper release (6); restore three visibly connected output routes before committing crew to cradles (7); shelter the last latch operator under persistent leaks while a gutter diverts them (8). Do not replace these with differently named pressure pads.

**B2 — Required spatial evidence is missing.** Each chapter needs numeric floors, ledges, closed/moving/open gate rectangles, tread/handle positions, lift endpoints, boarding pads, hazard lanes and exits. Specify the exact normal-control order and last-holder reunion path. Without those, the statement that levels are clearable is unproven. Record these in data or a route map before treating the conceptual design as accepted. Baleog/Olaf cannot jump and a narrow overhead shield is not a general-purpose elevator.

**B3 — Chapter 3 protection is currently optional scenery.** Directed deletion pulses plus an isolation handle do not require cooperation if one Viking can simply kill the patrol and USE once. Make the operator stand in a visibly exposed channel for a finite purge; Olaf's shield blocks incoming pulses from the emitter while a second Viking operates or sustains the handle. Distinguish the emitter from the killable patrol. Purge progress must pause rather than erase or kill instantly if protection lapses. A safe alcove allows retreat and recovery. This ties protection directly to preserving endangered names.

**B4 — Chapter 6 float route risks being cosmetic or an arbitrary character restriction.** A tread accepts any body, and the reusable lift may deliver everyone to its lower landing, so nothing currently makes the drop meaningful. Put the safety tread on a separated shelf reached by a clearly shown downwind descent from the upper ledge; locate the lift endpoints on the main shaft, not that shelf. Olaf's globally slow fall makes this route safe; faster-falling characters may take the clearly visible main lift. The tread opens a physical connecting gate so an upper-route teammate can secure it and call/restore a reunion lift. Do not special-case the tread to Olaf. Confirm the float landing tolerance and return path numerically.

**B5 — Archive custody must be explicit across chapters 5–8.** After copying, the returned physical archive must be reachable and held by an actual inventory slot before exit. Chapter 7 mounting must not silently remove it forever; show its attachment to the output cradle, transfer to brass bodies, and pickup/custody in chapter 8. Define what happens if the carrier dies, drops it, fills the bag, or boards a locked transfer cradle. Wrong use and full inventory must never destroy it. Do not manufacture a fresh archive in each chapter while claiming continuity.

**B6 — Final transfer commitment needs a safe sequence.** Before any cradle immobilizes a Viking, verify all required gates/lifts and archive mounting are secured, all remaining cradles are reachable by Baleog and Olaf, and hazards are disabled or blocked. Allow reversible dismount before final transfer, or make the precondition demonstrably sufficient. Test all six boarding orders. Any mapping of arbitrary cradle to Viking must be reflected outside or explained by automatically routing channels; the machinery should not require hidden identities.

### Chapter-specific observations

- **1:** Good introduction. Shelf must be within Erik's actual boosted reach; service-wafer socket should be beside its shutter and match shape. Thread must visibly hold a counterweight, and the cable must visibly raise the final shutter only when the weight lands. Limit to one tutorial gate and avoid stacking three identical locked corridors.
- **2:** Parcel loop should visibly break or divert into a stationary output after track alignment, otherwise the story card describes a consequence the world never shows. Shared lift needs stable stationary boarding time and repeatable calls at both ends.
- **3:** The saved names/windows should visibly resume when isolation succeeds. That establishes the resident stakes without another exposition card.
- **4:** Keep stamp motion slow and telegraphed with a visibly hazardous bed. The safe alternate lane and upper lift must be shown; do not force crew to wait under a descending heavy object. Gate dependency is the stamp's final seated state, not a sword boolean.
- **5:** A shelf pickup and terminal alone are a fetch quest. The copying process should provide the chapter's distinct spatial problem: protect the carrier, move between physical stations, or free a visibly stalled path while the archive stays mounted. Avoid arbitrary additional action locks.
- **6:** Revealing the pub requires a newly exposed view through the canopy with recognizable brass silhouettes, not just text saying the sky is false. Moving shutter must remain in its local track.
- **7:** Reset reservoirs should contain recognizable crew traces and visibly drain into archive capacity. Confirmation must be a reachable ordinary USE interaction. Do not label unexplained bars as a moral choice.
- **8:** Brass body palette alone is insufficient: provide distinct scale cues, tangible joints, paper fibres and non-repeating rain. Gutter movement visibly diverts drops away from a route/lever; releasing it should not merely toggle the exit boolean.

### Required before second review

Provide chapter-specific route/geometry data, causal dependency descriptions, implemented state transition modules, all-Viking 60/120 Hz route logs, browser routes/screenshots, and asset sources/native dimensions. Report which B1–B6 corrections were made and which remain unresolved. The independent second review will separate simulation results from actual visual and browser evidence.

## Revised blockout review

**Verdict: the revised puzzle sequence passes the conceptual variety/affordance gate, subject to the concrete geometry fixes below.** Chapter 2 now uses packet arrival and transport, chapter 3 uses sustained protected work, chapter 4 uses continuous construction, chapter 7 uses a shared commitment, and chapter 8 changes the established holding-gate lesson to two simultaneous holders. The introductory prose still describes obsolete treads in chapters 2 and 4; the numeric blockout explicitly overrides those, but remove the stale prose to avoid implementation ambiguity.

### Verified movement assumptions

Ground feet are y610. Olaf's raised shield surface is y530 (`h.y566 + SHIELD.upTop-36`). Erik's jump is -570 with gravity1250, giving a theoretical rise of129.96 units. A shield-supported jump therefore reaches approximately y400.04. The specified y410 shelves are feasible with about10 units clearance; direct jumps from ground are not. Keep the y410 shelf elevation, do not round it upward to y400. Boarding and the second jump must be proven at both60 and120Hz. Olaf's48-unit shield width and32-unit body collisions make close staging important; x1190 to shelf1250, x590 to shelf600, and x690 to shelf750 are plausible with controlled horizontal movement.

A120-unit lift can geometrically carry three32-unit bodies, but barely enough for distinct separated boarding positions. Require defined left/center/right positions and tests for late boarding, acceleration, descending, landing, and standing inactive crew. A wider144–180-unit platform would make this more robust without weakening puzzles.

### Remaining geometry blockers

**G1 — Chapter6 ground truncation is not defined.** A continuous y610 ground would intercept Olaf's intended descent to y810. End the ground before the designated drop region and define the lower approach as an explicit walk-off descent into a catch floor at810. The ordinary route for Erik/Baleog must not require jumping or surviving an undefined fall hazard.

**G2 — Chapter6 upper reunion/exit deck is missing.** Upper deck ends atx2500, but the second lift isx2700 and upper gate/ratchet/exit are2870/2950/3100. Add an upper deck serving that entire route with an explicit shaft/catch/landing gap around the moving platform. Do not let crew ride to y130 and then fall because the landing exists only in prose.

**G3 — Floor/lift intersections need explicit shaft geometry.** Chapters2/4/6/8 put lifts inside or under continuous upper platforms. Define cutouts around the moving platform and landing lips; otherwise descent may collide with a deck or characters may be able to stand on a nonmoving floor while the cradle leaves. Rendered shafts, moving collision surfaces, and static support must agree. One-way floor behavior alone is not a sufficient visual explanation.

**G4 — Chapter3 damage cancellation needs visible causal feedback.** Damage should abort/retract or visibly pause the isolation stroke, with the partly completed reed/window response preserved or reset continuously. Operator1500 and Olaf1600 correctly place the shield between the left-firing1800 emitter and the worker. The killable patrol must not replace the fixed emitter or make shielding unnecessary accidentally. Test pulses at their actual y-coordinate against shield bounds.

**G5 — Archive custody remains an implementation gate.** Chapters5–8 must carry the same item through `game.js` transitions/save/load; current old per-level archive creation is unacceptable as continuity evidence. Show the socket→dock→return path continuously, preserve wrong-use/full-bag/drop recovery, and account for custody during cradle commitment and physical arrival. This will be rechecked independently during final review.

The chapter7 route is conceptually safe only after shutter1500 is fully open and all three cradle approaches remain traversable. Test all six boarding orders and allow pre-transfer dismount or establish sufficient safe preconditions. Do not infer this merely from the absence of hero-ID checks.

No implementation routes or browser playthroughs have been independently observed at this stage.

## Required grounding review gate — user-requested

**Grounding is a blocking visual and behavioral acceptance criterion.** A route passing in simulation does not establish that scenery, enemies, props, riders, or moving mechanisms visibly touch their support. Independently inspect screenshots and representative animation frames before accepting the rebuilt campaign.

### Structural scenery and parallax

- Every grounded mid/far-layer structure has a documented base anchor and a visible supporting surface in the same layer. A structural base and its supporting surface use the same parallax transform; foreground floor coordinates must not be used as an unsupported substitute.
- Inspect each chapter at both zooms, camera extremes, and vertical landings. Bases must not detach as the camera scrolls. Floating or suspended structures require visible suspension, not an unexplained gap.
- Preserve sprite aspect ratios and alpha-safe bounding boxes. Transparent padding is not a ground anchor. Decorative scenery must not imply a walkable support absent from collision geometry.

### Enemies, heroes, props and moving machinery

- Enemy sheets use one stable authored foot pivot for every walk, attack, hurt and defeated frame. For living grounded enemies, the render pivot equals the simulated support surface at every frame, allowing only explicit authored squash/step motion relative to that pivot.
- Hit/death animation must not shift the entire sprite because a differently trimmed frame was resized. Fixed animation cells keep the same origin, scale and ground pivot.
- Props, item sockets, gate tracks, lift rails and pressure treads anchor to actual visible supports. Released pieces keep their local trajectory and contact their destination visibly.
- Lift visual surface and collision surface share one source of position. Rider feet track the platform displacement through acceleration, steady travel, deceleration and both landings; inactive riders remain supported.
- Olaf shield passengers contact the rendered shield support plane, and character shadows remain projected on actual floor/support surfaces rather than following the character in air.

### Required tests and independent visual evidence

1. Geometry test: scenery base and support anchors remain coincident under their layer transform at representative camera x/y positions, both zooms, and the chapter's vertical extrema.
2. Atlas test: every living enemy animation frame has a stable foot-pivot definition and does not derive its origin from per-frame alpha trimming; compare rendered foot coordinate to simulated floor.
3. State/render test: gate leaves, payloads, platform surfaces and attached props derive drawing and collision coordinates from the same mechanism state.
4. Motion test: each lift carries all three crew at60/120Hz with bounded foot-to-platform error, including inactive characters and reversals, without floating above or falling through its rendered deck.
5. Support test: grounded enemies patrol and change direction on supported terrain; they do not walk elevated above it or across unmodeled gaps.
6. Screenshot matrix per chapter: grounded scenery plus enemies at rest/walking, lift boarding/midtravel/landing, and major payload before/during/after release. Record camera, zoom and animation frame/time so defects can be reproduced.
7. Independent screenshot critique must explicitly report ground contact and bases. A passing pixel-color/normalization check alone is insufficient.

This gate is pending implementation and independent screenshot evidence. No grounding fixes have been implemented by the reviewer.

## Second review — implemented code and independent simulation

Inspected `story-layout.js`, `story-campaign.js`, `story-mechanisms.js`, `story-render.js`, `story-custody.js`, `game.js`, route drivers and tests. Independently ran `npm test`: **182/182 pass**, including all eight normal-input chapter routes at60 and120Hz. This verifies current simulation evidence, not browser or visual acceptance; no browser was operated by the reviewer because the implementation agent is running playthroughs.

### Improvements verified

- Physical retraction gates replace teleport doors, and pressure holders can be freed by downstream ratchets.
- Every reachable ordinary handle works without hero identity locks; sword/thread and fragile target interactions follow the specified reusable grammar.
- Lifts and released payloads have continuous shared simulation positions; final arrival enables dependent outputs.
- Upper deck geometry now has shaft-adjacent landings, and chapter6 includes lower810 support plus upper reunion deck beyond the second lift.
- Copying moves the physical archive to a visible dock and returns a loose item; custody checkpoint functions preserve its actual crew carrier on normal continuation and map core custody into the brass body.
- Reset cradle commitment is reversible before the last crossing, and tests cover all six boarding orders.
- Enemy patrol support/door clearance is tested. The fresh enemy atlas uses fixed cells; alpha bounds for cells24–31 reach the same128-pixel bottom. Full game-frame visual grounding remains pending.

### Blocking findings

**I1 — The final escape can abandon the archive.** Round7 power/win only checks hatch, gutter arrival, secured rain gate and crew exit; no held archive is required. Independently reproduced using the legal item-drop action before the normal route: `won:true`, `archiveHeld:false`, loose archive atx210/y566, all crew alive. Require actual archive custody on the departing crew and test drop-before-exit, no completion, recovery and successful completion. Preserve custody after final completion.

**I2 — Chapter6 narrative reveal has no corresponding world transformation.** Cutting the local screen moves a small gill atx1310/y490..570 and enables a lift, but rendering does not visibly expose the pub or three brass bodies through an opened canopy. The fixed generated backdrop plus story card cannot demonstrate the promised discovery. Add a locally animated opening surface with a revealed view/recognizable brass bodies and persistent solved state. Its material motion must remain attached to its track.

**I3 — Grounding acceptance lacks independent game screenshots.** Code anchoring and atlas measurements do not prove enemy feet, background bases, lift riders, payload endpoints or props look grounded at all zooms. Supply screenshots for the matrix in the required grounding gate and independently inspect before publishing.

### Nonblocking but material critique

- Chapter6 deletion curtain described in the revised spec is not implemented. Floating is a safe optional traversal shortcut in the current simulation. Update the spec honestly or implement the visibly telegraphed curtain without arbitrary character restrictions.
- Chapter8 gutter arrival stops spawning the leak but shows no diverted water path. Add a visible shifted drip stream/end-state so the causal benefit is legible.
- Chapter3 interruption instantly resets its work progress; the render then removes the work carrier immediately. Prefer visible retraction or an eased pause/restart state to meet the continuous-progression promise.
- Generated frame objects should be judged for actual material readability: the fragile target looks like a red lamp rather than plainly exposed breakable glass, and the thread cue needs a visible frayed section. Browser screenshots are needed before deciding these are blockers.

These findings are not a publication approval. Resolve I1/I2 and supply independent grounding/browser evidence for I3, then rerun affected tests/routes.

## Visual follow-up and repaired blockers

Independently reran the suite after repairs: **183/183 pass**. I1 is repaired in code by requiring held archive custody for the final escape; a new drop→blocked→recover→clear regression passes. I2 now has an animated canopy viewing window in code; its actual open-view/brass recognition screenshot remains pending. Gutter diversion and eased work-pose retraction are implemented, and chapter6 now emits real falling deletion pulses.

Independently viewed `campaign46-scene-0.png` through `campaign46-scene-7.png`, `campaign46-mobile.png`, chapter4/5 machinery, and chapter6 restraint before/after files. At the eight spawn frames, crew feet meet the foreground platform tops and background architecture has coherent support/base silhouettes rather than detached rectangular cutouts. Fresh visual vocabulary is visibly distinct across chapters. Portrait mobile brass-body feet also meet their floor. The far art is denser/softer than authored crew sprites; this is a stylistic density difference, not evidence of the previous negative-weight defect.

The chapter6 restraint screenshots demonstrate a local rail-guided descent between the before/after positions, but both have a PAUSED overlay and are not full unobstructed grounding evidence. Chapter4 upper deck has visible supports and crew feet contact its surface. Chapter5 crew contact is also correct.

**New visual blocker V1 — open gate frame looks like an intact wall.** In `campaign46-chapter-5-machinery.png`, the secured/open inhabited gate leaves a large solid dark vertical rectangle. `drawStoryWorld` draws a filled frame rectangle behind the retracting gate leaf. After opening, that fill still covers the entire aperture. Replace the full fill with side rails and header, leaving the passage center transparent; the player should visibly recognize the newly traversable opening. Test/capture closed, moving and open states.

Enemy walking-frame and lift-midtravel screenshot evidence is still pending. No browser operation has been performed by this reviewer.

## Final independent verdict — rebuilt campaign

**Accepted for the inspected design, implementation and visual evidence. No unresolved blocking finding remains from this review.** The grounding criterion remains mandatory for later asset/layout changes; passing tests alone is not an exemption.

### Fresh independent evidence

- Independently reran current `npm test`: **188 tests passed, zero failed/skipped**. This includes all eight normal-input simulation routes at60/120Hz, reversible output boarding, archive drop/recovery completion guard, local payload travel, physical moving gates, riders and patrol support.
- Inspected the actual newest unobstructed `campaign46-2-lift-travel.png`, `campaign46-5-enemy-grounded.png`, `campaign46-chapter-5-machinery.png`, `campaign46-6-canopy-reveal.png`, `campaign46-6-enemy-grounded.png`, `campaign46-6-lift-travel.png` and chapter6 restraint before/after captures.
- The implementation agent reports normal production-keyboard completion of all eight chapters, with recent affected reruns of2/5/6 alive. This reviewer inspected their screenshots and simulation evidence; it did not independently drive those browser playthroughs.

### Grounding and causal visual findings

- All three crew feet visibly contact the moving lift deck in chapters2/6. Tracks remain attached to the moving cradle and landings, while upper platforms have visible downward structural supports.
- Walking enemies in the inspected chapters5/6 frames have feet at the visible terrain plane, without the earlier elevated-body gap. Code uses a stable fixed-cell pivot at simulated `e.y+44`, and art validation checks every living enemy frame's bottom extent. Patrol support tests cover the full simulated bounds.
- The eight previously inspected spawn scenes plus the new upper-deck/camera positions preserve coherent scenery bases or visibly suspended structure. Background landmarks do not appear as detached transparent cutouts in this evidence. This is representative multi-camera evidence, not a claim to have manually watched every pixel at every possible camera position.
- V1 is resolved: the secured chapter5 gate now leaves a transparent passage between side rails. It visibly reads as open.
- Chapter6 restrained gill travels down its local track between the unoccluded before/after captures; it does not teleport to a distant output. The opened canopy now reveals three recognizable brass figures, making the narrative discovery visible in the world.
- Chapter8 older captures still include the pause overlay. They support local gutter trajectory and foot contact but are weaker evidence than the unoccluded latest chapters2/5/6 files. Code and inspected after-state show the gutter directing water into a supported drain.

### Remaining nonblocking observations

The distant scenery has finer, softer detail than crew sprites/foreground tiles; this remains a stylistic density difference rather than evidence of false normalization colors. Narrative/puzzle progression is substantially stronger than the previous campaign, while still using a deliberately repeated tread/ratchet material vocabulary. Future refinement should add more inhabited reactions and less dependence on story-card explanation, without introducing arbitrary identity locks.

### Blocker closure

- B1/G1–G3: revised distinct puzzle beats and explicit supported lift/deck blockouts, demonstrated by normal-control routes and inspected travel frames.
- B3/G4: protected timed isolation is implemented and tested; work pose retracts smoothly.
- B5/G5/I1: checkpoint custody plus physical archive return and final held-item completion guard are implemented and tested.
- B6: all six cradle orders and reversible precommitment are tested.
- I2: visible canopy/pub/brass reveal now inspected.
- I3/V1: representative grounding screenshots independently inspected and the misleading filled open-gate frame repaired.

No implementation or assets were edited by this reviewer.

## Zoom and continuation follow-up

Independently inspected the new1x/2x screenshot pairs for chapter6 (`campaign46-zoom-5-1.png`, `campaign46-zoom-5-2.png`) and chapter8 (`campaign46-zoom-7-1.png`, `campaign46-zoom-7-2.png`). In both views, crew feet meet their terrain plane, distant structural silhouettes remain coherent, image proportions are preserved, and the zoom change introduces no visible background seam, detached cutout, or new grounding gap. Chapter8 at1x exposes the lift track/upper landing as physically connected structure. These representative pairs strengthen the visual acceptance gate; the remaining chapter pairs were supplied but not individually inspected by this reviewer in this follow-up.

The implementation agent reports chapter6's dependency-fixed real-browser rerun completed with HP3/3/3 and Enter continuation produced exactly one actual archive in chapter7. It also reports real mobile pointer movement/jump, a390×844 full canvas and no new page errors. These are clearly attributed browser results, separate from this reviewer's direct screenshot inspection and independently run188-test suite. No new blocker found.
