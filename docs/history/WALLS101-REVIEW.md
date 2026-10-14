# WALLS101 independent visual review

Reviewer: wall-edge critique subagent. Scope: decorative room enclosure edges;
no collision or movement changes.

## Source gate — accepted for reuse

Inspected `assets/depth94/b-raw-v2.png`, `b-native-proof-v2.png` and
`b-native.png`, alongside the original `assets/depth94/visual-gates.json`
and registration. The accepted Warden masonry row has deliberate broad
charcoal planes, quiet rust clusters and readable courses. Runtime reuse
does not reprocess or resize the native source: one native pixel remains
two world units. The border crops are four native pixels deep/eight world
units; horizontal strips are 54 × 4 native pixels, vertical strips 4 × 52,
and corners 4 × 4. Original source and prompts remain intact.

This accepts source density and reuse, not the effectiveness of the border
at gameplay size. The original silhouette is subtle, so a finished end face
must be established by runtime evidence.

## Topology and grounding checks

Read `src/render/wall-boundaries.js`, `src/render/depth-render94.js` and
`tests/unit/wall-boundaries.test.js`. Ran the five focused tests: all pass.
Shared neighboring room spans are suppressed; enabled collision walls and
floor/platform contacts suppress covered border spans; disabled barriers
leave borders visible. Exposed corners are paired from remaining adjoining
edges. Border drawing remains inside the room footprint, with native-grid
snapped positions, nearest-neighbor sampling and clipped final repeats.
Room infill and vertical courses remain floor anchored. State snapshots
are unchanged by the planner. There are no physics writes.

## Runtime gate — accepted

Inspected the production-renderer captures under `output/walls101/`:
`after-normal-{1,2}x.png`, `after-left-upper-{1,2}x.png`,
`after-service-stage-{1,2}x.png`, `after-right-upper-{1,2}x.png`,
`after-lower-room-{1,2}x.png` and `after-service-mobile.png`, with matching
before captures for comparison. `evidence.json` records camera coordinates,
room/border plans and unchanged actor snapshots; browser errors are empty.
These are paused actual gameplay frames with camera-only survey positions,
not proof of a normal-control puzzle route or dynamic topology animation.
Neither is required by this static decorative-only change.

The upper coping is visibly a continuous narrow charcoal stone lip with a
light top plane, replacing exposed partial brick courses. Vertical end faces
retain quiet native masonry material and terminate complete edge clusters
instead of arbitrary clipped interior bricks. They are intentionally subtler
than the coping, but remain coherent with the wall silhouette at both zooms
and mobile. Corners meet the coping without an exposed background gap.
Repeated border tiles preserve pixel density and do not draw a bright trim
over gameplay targets. Floor contacts remain intact across all four authored
rooms, including the lower corridor; the foreground terrain can occlude its
upper coping naturally. Camera travel changes neither attachment nor scale.
Vikings retain adult-human dimensions relative to the machinery.

Standalone grille backing tiles (`p.kind === 2`) read as finished device
backing rather than free-standing room enclosures, so their existing artwork
is outside the room-border treatment. Synthetic shared-room, partial floor
and collision-barrier topology cases are covered by the five tests; these
arrangements are not authored in the current Warden room layout and therefore
have no real-game screenshot claim.

Publication allowed: **true — source and runtime gates accepted for the
existing authored decorative room enclosures**. No new generated art, alpha
processing, source-size normalization, interaction changes or physics changes.

## Extension: isolated device masonry backings

After the room review, scope expanded to exposed masonry behind grille props
in all six environments. Existing rooms cover these backing caps when the
backing lies inside a continuous wall, preventing an arbitrary framed patch.
The added regression passes, bringing focused topology tests to six/six.

Source gate: **accepted for reuse**. Also inspected `a-raw-v1.png`,
`a-native-proof-v1.png` and `a-native.png`. The A-family retains broad teal,
slate and charcoal masonry planes at the same deliberate density. Renderer
uses the actual A perimeter interval [196,252), B [197,251), retaining the
54-native-pixel/108-world-unit horizontal repeat and four-native-pixel caps.
The source is not rescaled to fit the backing, and no new image processing
is introduced. The retained registration/source gate documents remain valid.

Runtime gate: **accepted**. Inspected all 18 production captures
`output/walls101/after-backing-{0,1,2,3,4,5}-{1x,2x,mobile}.png` and
`backing-evidence.json` (18 captures, no browser errors). The six indices
are Cycle, Refraction, Momentum, Clockwork, Water and Warden respectively.
The standalone masonry backing has a narrow contiguous top cap and quiet
complete stone ends at both zooms and landscape mobile. It meets its deck,
while machine/grille artwork stays legible in front; existing pipes, ladders
and control targets retain their hierarchy. Clockwork's backing stays
behind the two ladder structures, while Water's visible backing meets the
underwater floor without a light air gap. Warden's backing remains an
unframed continuation of the larger room wall, as required.

The captures use real gameplay composition with camera-only survey pans;
they do not introduce actors or resize scenery to frame the evidence. The
extension neither changes the camera transform nor adds collision. Exact
native pixel density survives all three display contexts. No blocker found.

Final publication verdict: **allowed — both source and runtime gates
accepted for room borders and isolated masonry backing edges**. Source
images/prompts remain untouched; original source-to-native proofs establish
the material baseline, and the new gameplay captures establish the finished
edge treatment.

## Retained review evidence

The full survey receipts and representative inspected frames are retained
in `tests/evidence/walls101/`:

- [Room survey receipt](../../tests/evidence/walls101/evidence.json)
- [Six-material backing survey receipt](../../tests/evidence/walls101/backing-evidence.json)
- [Service room before](../../tests/evidence/walls101/before-service-stage-2x.png)
- [Service room finished edges](../../tests/evidence/walls101/after-service-stage-2x.png)
- [Service room mobile](../../tests/evidence/walls101/after-service-mobile.png)
- [Cycle backing at 2x](../../tests/evidence/walls101/after-backing-0-2x.png)
- [Underwater backing mobile](../../tests/evidence/walls101/after-backing-4-mobile.png)
- [Warden continuous room suppression](../../tests/evidence/walls101/after-backing-5-1x.png)
