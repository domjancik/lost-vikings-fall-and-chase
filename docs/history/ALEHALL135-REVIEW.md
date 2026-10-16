# Alehall135 independent concept and control review

Scope: revised user direction, `ALEHALL133.md`, cooperative-world-design and native-sprite-art requirements. Concept review only; no implementation or new art is approved here. No runtime edits made.

## Corrected story contract

**Direction accepted for implementation subject to these explicit corrections.** The find is the **Creation Globe**: a small ball containing tiny articulated arms that make objects. It waits in a dim back room of Astrid's familiar Norse hall. Preserve that concrete behavior; do not substitute an ominous stone, generic glowing orb, modern machine exterior or a chest-opening puzzle.

`ALEHALL133.md` still names a service key opening a salvage chest, binding as an inspection prerequisite and key/chest acceptance checks. Those passages are superseded. The host's own key may open the storeroom door, with visible lock/door motion. Any permitted cutting applies locally to packing around the salvage; it must not resurrect the abandoned chest puzzle. Ale serving and archery remain optional, without hidden completion flags.

All three entering the room ends player-controlled gameplay. No further inspection input, USE prompt, optional errand, inventory selection or precision standing requirement may hold the story hostage. Erik and Baleog inspect first; Olaf then joins them, followed by the floor collapse. Establish a broad room-entry threshold and a deterministic, recoverable staging plan. If Olaf enters first or all three cross together, the scripted approach must still produce that order through visible walking and pauses, not teleportation or an unexplained reset. Lock controls only when the third living friend has entered and the scene is committed; clear held input on transition.

## Causality, relationships and tone

- Astrid/fisher should invite them into the room because of the find itself, rather than withholding it until chores are done. One familiar personal exchange is enough to establish trust. Keep ordinary people curious and cautious, not inexplicably careless custodians of a deadly floor.
- Show one short readable making cycle: arms reach, grip/manipulate, an object takes form and is placed/released. Friends' gaze, a pause and a restrained response establish its significance. Do not bury the central discovery under dialogue or three consecutive lore speeches.
- Retain localized damp/rotting timber as the physical collapse cause unless the user changes it. The globe should not visibly attack or trigger an explosion by implication. The host can notice the creak too late and reach toward them from secure boards; no NPC needs to stand inexplicably on the failing span.
- The small domestic underfloor cavity can connect to unfamiliar works below. Do not revive the concept image's monumental vaulted sewer as ordinary ninth-century village plumbing. Make the scale/material discontinuity an uncanny discovery, retaining serious Norse home-world framing above.
- Maintain one connected collapse and survivable fall into sewer stable ID10. Match the exit pose/velocity and broken ceiling entry, rather than showing a second unrelated drop. Preserve sewer continuation to stable ID4.

## Art and verification conditions

The globe's scale creates a readability risk: tiny arms inside a few native pixels cannot support detailed animation. Declare world size, native body/arm clusters, pivots, light source and the cinematic apparent size before generation. A separately authored native close-up may establish the making cycle; it does not authorize downsampling a painted concept into world sprites. Keep its scene placement and material identity consistent across views. Interior detail should be revealed by a motivated local light or restrained object light, not blanket ambient illumination.

**Source gate: pending. Runtime gate: pending. Aesthetic gate: pending.** Require ordinary-control all-three entry in different orders, skipped optional activities, safe backtracking before commitment, visible staged inspection, continuous arms/contact/making action, grounded feet/boards and uninterrupted collapse-to-sewer evidence at 1x/2x/coarse touch. Earlier concept acceptance does not waive these gates.

## Independent crane diagnosis supplied alongside this review

The latest stuck-hook report is independently reproducible with the current code. With panel open and brake still clamped, `orbitObjects()` reports ready and advertises steering; USE sets an operator. The hero parks and `game.js` switches labels/input mapping to crane mode, but `mechanisms()` rejects all steering until `brakePose >= .999`. Holding right/up for 120 simulation steps leaves the hook exactly at (2540,380). This is separate from the corrected residual walking velocity bug.

Smallest clear correction: guard operator entry in the panel's `run()` while the brake is closed/moving; report a persistent local brake-locked state and the short cable above the gallery. Make ready/reason agree with that state. Changing only `ready` is insufficient because the direct interaction path calls `run()` without checking it. Preserve the cable-release puzzle; do not silently release the brake. Existing game control remapping is coherent once operator entry is restricted to an operable crane. Add closed-brake and opening-brake entry regressions plus actual normal-input evidence, because Orbit134 fixtures start with the brake already released.

## Initial production-source review

Inspected the actual `assets/alehall135/{architecture,props,patrons,globe,coast}-source.png` originals beside their native outputs and available 3x native reviews, plus exact prompts and the preparation script. This review supersedes no earlier rejected study. No runtime screenshots were supplied at this stage.

| Set | Dimensions, source to native | Source/native-density gate | Aesthetic gate |
| --- | --- | --- | --- |
| Architecture | 1254x1254 to 256x256; 64px cells | Accepted for the predominantly deliberate timber/stone clusters; processed-alpha acceptance pending | Pending corrections: colored edge contamination and the hearth construction described below |
| Guided props | 1254x1254 to 256x256; 64px cells | Rejected: guide occupancy fixes size but does not constrain the rendered material detail to its intended grid | Rejected: native cask/table/dog/straw/rope become mottled and lose the raw material definition; colored edge remnants remain |
| Patrons | 1254x1254 to 224x224; 56px cells, approximately 35-38px people | Rejected: fine hair, weave and facial treatment operate below the final person grid | Rejected: faces/hands and cloth lose definition, with conspicuous red/green fringe at heads and extended hands |
| Creation Globe | 1254x1254 to 96x96; 48px cells, approximately 20px ball | Accepted: raw rim, arms, cup and base use readable deliberate clusters at the intended scale | Accepted in isolation: smoky glass, bronze arms and pale cup remain distinct; material depth is retained |
| Coast | 1774x887 to 384x192, opaque | Accepted for the broad layered silhouettes and readable small architecture at far-plane density | Pending: visibly baked vertical rain streaks conflict with the prompt's separately animated rain requirement |

The globe is the successful density reference here: the raw image already describes its small elements as explicit chunky clusters. Its native conversion preserves those elements rather than inventing them by sampling. Arm ownership, actual articulation/contact and the making cycle still require runtime review; an attractive four-frame sheet cannot approve the story action.

Props need focused regeneration at the actual native detail density, preserving the guide's occupied bounds. Prioritize the cask/skids, table/bench, basket/cloth, dog and straw; do not rescue the current painted grain by palette reduction, filtering or grid detection. Patrons similarly need native-density regeneration, retaining adult proportions, row identities, legible palms, facial clusters and the lyre. Uniform sheet scale and sole translation are technically appropriate, but they cannot recover discarded anatomy/material features.

Colored fringe is an independent blocker, not proof of density. Native-review images visibly retain magenta beneath the bench, red around Astrid's head and the fisher's pointing hand, and green/red outlines at structural edges. The preparation script computes an alpha-threshold mask for bounds but saves the original RGBA pixels without applying it. Correct alpha/edge extraction from the retained source where that is sufficient; regenerate where contamination belongs to actual opaque material. Reinspect the result over real scene colors. Do not treat a dimensions/alpha count as visual acceptance.

The architecture's hooded wall fireplace/chimney should not become the default household hearth. This reintroduces the construction concern from the concept review; use an open central hearth and roof smoke opening, or revise the affected cell. The coast's static rain should be removed/re-authored before accepting the layered scene, rather than moving frozen rain with the camera plane.

**Overall production source gate: rejected for the current props/patrons set. Overall aesthetic gate: pending the corrections above. Runtime gate: pending. Publication of the affected assets is blocked.** Architecture/coast/globe do not require wholesale regeneration on density grounds; apply only the focused issues identified and repeat the affected source/processed/gameplay comparisons.


## Final corrective review — accepted

This section supersedes the initial production-source verdicts above; rejected originals and that history remain intact. `ALEHALL135.md` is the authoritative implementation contract, replacing the old chest sequence.

**Source gate: accepted.** Inspected corrected raw `props-source.png` and `patrons-source.png` against native and 3x opaque comparisons, retaining the first rejected sources under `*-source-first-rejected.png`. Guided regeneration now uses deliberate native clusters: cask bands/skids, timber bevels, straw rings, dog silhouette, cloth planes, readable hands and faces. Props use 64px cells on a 256px sheet; patrons use uniform 56px cells on a 224px sheet, with 36-37px people and sole translation only. Architecture remains 256px/64px cells. Globe remains 96px/48px cells, approximately20px ball/26px total prop, with registered glass rim/base and distinct arm/cup phases. Coast remains384x192. One native pixel occupies2world units.

Built-in imagegen edits replaced the hooded fireplace with an open stone hearth in architecturecell11 and removed the coast's baked rain. Their exact edit prompts and outputs are retained as `architecture-hearth-edit-*` and `coast-rain-edit-*`; former hood/rain originals are retained separately. Native conversion uses the retained originals once with nearest-neighbor sampling, without grid detection or filtering.

Correction to the initial alpha diagnosis: opaque-comparison inspection established that much of the alarming red/yellow displayed by the transparent-image viewer was hidden RGB in fully transparent texels, not visible painted outlines. The preparation script retains binary alpha128 extraction and now zeros RGB only where alpha is0. No opaque recoloring or higher threshold was needed. Actual composites and final game captures show clean outlines. This correction does not rescind the earlier density rejection of the first props/patrons sources.

**Aesthetic gate: accepted.** Compared raw, processed native and actual scene views at matching apparent sizes. Regeneration removes fine painted grain while retaining dimensional cask bands, carved posts, recessed wood, stone relief, material shading and adult character volumes. The globe's small bronze arms and pale cup read within smoky glass; its four authored states remain distinct. The open hearth, smoke opening and quiet rainless coastal plane fit the Norse home setting. Separate animated rain supplies weather. Repeated transparent roof-cell gaps found during runtime review were corrected with continuous dark structural backing; the final key-picked2x view confirms no repeated sky holes. A single intentional smoke opening remains. Baleog's final stopped pose faces the globe.

**Runtime gate: accepted.** Inspected final committed evidence under `assets/alehall135/evidence/desktop/` and `touch/`: tray-loaded1x/2x/landscape, key-picked2x, door-open1x, inspection1x/2x/portrait/landscape, cracking2x, floor-break2x/portrait/landscape, fall and sewer-arrival, plus earlier final views for the same asset set. Cart contact and706world walking top, loft supports, native three-cup load spanning Olaf's48world shield, table contacts, grounded patrons/hearth/bench and globe placement remain coherent. Dark back-room lighting preserves the making display. Inspection staging, sagging boards, broken span and falling crew/bench are visible. Camera travel retains wall-mounted fixtures. The final roof backing and face-direction corrections are covered by refreshed desktop pictures; mobile was captured before those small corrections, with unchanged geometry/contact behavior.

Desktop receipt:39.7811s, HP3/3/3,33captures, errors[]. Touch receipt:39.9340s, HP3/3/3,33captures, errors[]. Both reach automatic sewer ID10 with arrival methodfall; sewer remains followed by ID4. Sidecars identify ready imagegen90, vikings90 Erik/Baleog and olaf111 Olaf. Touch evidence tests actual action taps in a coarse context with keyboard movement; it is not a complete manual touch-device playthrough. The earliest sewer-arrival frame is transitional and obscured, so it establishes the handoff alongside the asserted round/arrival receipt rather than approving new sewer art.

**Cooperation/story gate: accepted.** Independently ran the focused alehall and brake suites successfully. Regressions cover grounded cart contact/recovery stops, spill/refill/serve, closed-door/key causality, normal60/120Hz routes, three entry orders with optional activities skipped, no early collapse, continuous scripted positions and healthy falling. The final key drop/settle/recover/transfer regression also passes; that recovery edge was not separately browser-photographed. All-three broad room entry ends free play, Erik/Baleog inspect before Olaf's approach and the collapse; social activities and delivery binding do not gate it. No chest puzzle or modern/neon home-world framing remains.

The separate crane brake guard is accepted within this change: a locked/opening brake refuses ownership instead of advertising dead steering; the focused regression and retained crane browser/touch evidence cover later entry, motion, clamp and release. This preserves the actual release-cable puzzle.

No remaining blocking finding for the reviewed deliverable. Publication approval is recorded in `assets/alehall135/visual-gates.json`; ordinary final build/release checks remain the implementing agent's responsibility.
