# The Familiar Hearth — implementation contract

This supersedes ALEHALL133's chest-opening ending. The campaign begins in the
Vikings' familiar Norse longhouse, in their own time: timber, wool, tallow, iron,
wooden cups, rain outside, a plucked lyre and familiar neighbours. No neon,
arcade cabinets, contemporary bar equipment or electronic ambience.

## Player route and causality

Stable level ID11 precedes sewer ID10 and Drowned Regulator ID4. Older saved IDs
are preserved. A fresh machine campaign starts here.

Olaf parks a cask sledge against its storage stop using his forward shield.
The sledge remains a solid object; short timber steps permit the non-jumping
friends to pass its storage bay. Erik can jump from the cask/steps to the loft,
collect Astrid's iron key, descend and open the storeroom. The key uses the
existing transferable inventory and is consumed by the lock. Door art and
collision change continuously together.

Optional scenes establish their ordinary lives: Astrid loads three cups onto
Olaf's raised shield, which he carries to their regular table. Lowering the
shield spills them and permits a refill. Baleog shoots a straw butt in the empty
yard and cuts a plainly visible delivery lashing backed by a packing board.
Conversation identifies the fishers' find; these activities never become hidden
flags controlling access to the ending.

## Creation Globe and committed ending

The find is a small Creation Globe on a low bench in a dim back room. Tiny bronze
arms work inside its smoky glass, reach toward material, work a pale cup, display
it and begin again. The ball is approximately40 world units across, not a giant
portal. Its local light reveals the nearby bench and worn floorboards.

All three living friends crossing the broad room threshold ends free play.
No extra USE press or precise standing location is required. Erik and Baleog
walk to either side and inspect. Olaf visibly waits, then walks over. His weight
loads the rotten span: boards sag, creak, break and fall with the heroes and
bench. There is no attack or explosion from the globe. Dialogue is brief and
grounded in what they can see. The staged route works regardless of entry order.

The fall continues during the departure transition, with soil/darkness and
distortion covering the change into the sewer's broken-ceiling arrival. This
connection advances automatically, without a completion interstitial.

## Art, anchors and review

World pixel pitch is2 units. Adult patrons occupy36–37 native pixels, comparable
to the corrected Viking skins. Props/architecture use64px cells; patrons use56px
cells; the globe uses48px cells and a roughly20px ball. All transparent assets
are grounded by detected opaque bottoms. Each generated source and exact prompt
is retained. Rejected painted studies are retained under explicit rejected names
and are excluded from the release manifest.

`tools/art/prepare-alehall135.py` is the current preparation entrypoint. It uses
one nearest-neighbour native conversion and explicit alpha-matte extraction;
there is no grid detection, bilinear resampling or repeated image processing.
Native reviews enlarge with nearest neighbour. The independent source, processed,
runtime and aesthetic verdicts live in ALEHALL135-REVIEW.md. Publication requires
accepted verdicts, actual1x/2x/portrait/landscape views and latest Viking skin
evidence; numeric image checks alone do not establish quality.

## Verification

`tests/routes/alehall135-route.js` clears every activity and the ending using
ordinary inputs at60 and120Hz. Unit regressions cover physical pushing, shield
carry/spill/refill, broad all-three entry, alternate entry orders, optional-scene
independence, continuous door movement, scripted approach and healthy falling.
`tests/browser/alehall135-route.mjs` drives actual controls and captures state
milestones, cutscene, fall and automatic sewer arrival. Touch mode tests action
buttons with taps and uses keyboard movement; it does not claim a fully manual
touch-device playthrough. Review evidence uses `skin=imagegen90`.

## Separate crane correction

The reported motionless Scrap Orbit hook was reproduced with a still-clamped
brake. The panel advertised steering and took control while the mechanism
rejected motion. Panel readiness and entry now agree: a locked brake refuses
ownership, keeps the worker camera and identifies its release cable. The cable
puzzle remains intact. A regression covers locked entry, brake release and real
hook motion after entry. This supplements the already published operator-drift
and eased-motion fixes.

## Published verification

Runtime commit `7b0acb5` is published at
`https://united-marsh-6ppd.here.now/?campaign=cycle&release=alehall135`.
Hosting version: `01M52374DSGH3J3ZANN40FHCJA`.

All678 tests passed. The487-file build passed release verification and the488-file
publication preflight. Live verification matched43 changed modules/assets and
the HTML after removing hosting-added social metadata. A fresh public Chrome
smoke loaded level11 with every scene atlas ready and no JavaScript errors.
Receipts are `assets/alehall135/{validation,live-hashes,deployment}.json` and
`assets/alehall135/evidence/live/`. Unrelated archived/Vikings55 work is preserved.
