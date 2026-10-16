# Pub138 independent review

Reviewed against `PUB138.md`, `PUB138-REVIEW-CHECKLIST.md`,
`cooperative-world-design`, `native-sprite-art` and the visual review gate.
This review changes no gameplay or artwork. **No blocking findings remain.**

## Source gate — accepted, retained artwork

Inspected `assets/alehall135/props-source.png` and `patrons-source.png`, their
`*-native-review.png` views, `props-opaque-comparison.png`, `cup-native.png`,
registration and the prior corrective review. Git reports no changes to the
alehall135 asset directory. This is continuity acceptance of the previously
corrected production sources, not approval of the rejected first-generation
studies or a new processing pipeline.

Props/architecture retain 256×256 atlases with 64px cells; patrons retain a
224×224 atlas with 56px cells and approximately 36–37px adult figures. The globe
retains 96×96/48px cells and approximately 20px glass body. One native pixel is
two world units. No art resampling was introduced. The loading berth reuses
native timber crops over an opaque structural body; each 24-world-unit tread
uses the exact collision geometry and continues to floor 760.

## Aesthetic gate — accepted

Raw/native comparisons and actual scene views retain modeled cask bands,
timber bevels, straw rings, cloth volume and carved posts. The berth remains
visually subordinate to the cask rather than introducing transparent strips.
The straw face now reads in front of the fence/backstop; its stronger impact
lean does not require a flattened replacement asset. Cup placement preserves
the existing dimensional table/patron art. The warm, lived-in Norse hall and
quiet, locally lit globe room remain coherent and adult-human scale.

## Runtime gate — accepted

Inspected these production-render captures under `assets/pub138/evidence/`:

- `desktop/carry-ale-{1x,2x}.png` and `touch/carry-ale-portrait.png`: parked cask,
  opaque steps, continuous floor contact and readable adult scale.
- `desktop/serving-arc-2x.png`, `touch/serving-arc-landscape.png`,
  `desktop/cups-landed-{1x,2x}.png`: carried/serving cups and tabletop placement.
  Landed cups are behind Olaf, while airborne cups use the foreground pass.
  The later `desktop/door-open-2x.png` also shows three cups still anchored at
  the distant table after Olaf has departed.
- `desktop/throw-windup-2x.png`, `cup-in-flight-2x.png`, `cup-missed-2x.png`,
  `cup-blocked-2x.png`, and `touch/cup-blocked-landscape.png`: visible Hakon
  anticipation/extension, released cup, harmless miss and front-shield block.
  Dialogue agrees with the actual defense phase and offers a retry.
- `yard/desktop-{1x,2x}.png`, `yard/touch-2x.png` and
  `yard/touch-landscape.png`: unobscured straw face, grounded pivot and strong
  backward bash lean. Dedicated readbacks assert Erik is active, the target
  and Erik are on camera, and bash pose exceeds .75. Six captures in
  `yard/results.json` finish with no errors.
- `desktop/loft-key-2x.png`, `touch/loft-key-portrait.png`,
  `desktop/key-picked-1x.png`: Erik boards Olaf's raised shield, then reaches
  the supported loft/key. Route readbacks explicitly record `support === 2`.
- `desktop/delivery-open-2x.png`, `key-picked-1x.png` and `door-open-2x.png`:
  released lashing/continuous cloth movement, later open basket and completed
  storeroom opening.
- `desktop/inspection-2x.png`, `cracking-2x.png`, and
  `touch/floor-break-landscape.png`: grounded crew, visible globe, sagging
  boards and collapse. The globe inspection remains the narrative destination.

Screenshot sidecars confirm ready `skin=imagegen90`, resolving Erik/Baleog to
`assets/vikings90/*-native.png` and Olaf to `assets/olaf111/olaf-native.png`.
True coarse-pointer/mobile contexts are included, not viewport resizing alone.

An early full-route `bash-lean-portrait.png` centered on Baleog after the next
hero switch and did **not** establish mobile target readability. It was rejected
as evidence for that purpose. The dedicated active-Erik yard captures above
correct this evidence gap; the failed framing is not silently treated as proof.

## Causality, cooperation and clearability — accepted

Code review finds no new mandatory social flags. Serving, bow practice, dash,
cutting and defense remain optional; the iron key visibly opens the storeroom.
Nearby patrons volunteer the bow/sword/key/bash invitations without USE or hint
mode. Both arrows and Erik's running head-bash affect the same padded straw
material; the latter produces a stronger local sway rather than an arbitrary
character-specific breakability rule. The lashed delivery visually explains
sword use. Shield practice uses the real swept shield collider, checks body
contact order and remains harmless/retryable.

Independently ran 23 focused tests: pub138 logic/render and alehall135 suites,
all passing. These cover actual 60/120Hz ordinary-control completion, missed and
blocked cups, saved serving origins, per-cup landing passes, opaque physical
treads, optional-task bypass and alternate crew entry orders.

Read final ordinary-input browser receipts: `desktop/route.json` completes in
53.7009 simulation seconds and `touch/route.json` in 54.0469, both HP 3/3/3,
81 captures, no page errors and automatic fall entry into sewer ID10. Both
include deliberate shield miss/retry/block, arrow hit, running bash, sword,
Erik-on-Olaf support, key/door and globe/collapse. Touch actions use actual
button taps with keyboard directional movement; this is not a full manual
touch-device traversal. The fall-arrival receipt proves transition continuity,
not a new review of sewer artwork. Final build/release/live checks remain the
publisher's separate responsibility.

## Final isolated retry correction

Re-reviewed the final `!p.bounced` guard on cup landing: an old, already
deflected cup may finish its bounce while a fresh throw is in flight, and must
not overwrite that throw's defense phase. This preserves the reviewed artwork,
trajectories, shield contacts and normal state matrix; the existing visual
verdicts remain accepted. Independently reran the focused suites with its new
overlapping-throws regression: **24/24 pass**. Evidence promotion to
`assets/pub138/evidence/` retains the exact inspected captures and receipts.

## First-visit invitation correction

Accepted the removal of the blanket dialogue-busy guard: once-per-offer flags
already prevent repeated invitations, while an unrelated opening greeting must
not swallow Baleog's first approach. Inspected the regenerated production
`yard/desktop-bow-invitation.png` and `yard/touch-bow-invitation.png`: Baleog is
selected immediately, Torsten's arrow/straw/outside invitation is visibly
readable in both layouts, and the current skin remains in use. The yard harness
asserts the invitation before its capture delay; the regenerated receipt has
both contexts and no page errors. No art, layout or collision changed, so the
source, aesthetic and runtime verdicts remain accepted. Independently reran the
focused suites including the first-greeting regression: **25/25 pass**.
