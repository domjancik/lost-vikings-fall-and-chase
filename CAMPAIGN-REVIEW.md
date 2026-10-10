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
