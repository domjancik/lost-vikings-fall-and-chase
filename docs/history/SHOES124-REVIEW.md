# Magnetic shoes124 independent visual review

Reviewer: shoes124_review. Scope: shared equipment shelf, world pickups/drops and inventory icon in both Scrap Orbit and The Lode Engine. Applied native-sprite-art and VISUAL-REVIEW-GATE. No runtime implementation edits by reviewer.

## Targets and required evidence

Requested atlas160×96 native, with shelf in128×96 and separate boot pair32×32; one native pixel represents2world units. Shelf feet must meet each level's actual spawn floor. Three removable pairs must sit on the visible opaque shelf plane, decrement on genuine pickup, and show the same readable footwear design in the bag/HUD and grounded drops. General production captures must resolve ready imagegen90 Erik/Baleog and olaf111 Olaf, at1x/2x and actual coarse-pointer mobile contexts.

## Sourcev1: rejected

Inspected `assets/shoes124/source-v1.png`, `prompt-v1.txt` and the one-uniform-normalization preview `density-preview-v1.png`. The raw shelf has useful modeled bevels, thick feet, rivets, copper cornice, deep brace recesses and a clear storage bay. Preserve those qualities. However, fine painted grain on the large brown/iron planes and undersized boot-strap highlights are below the intended160×96 grid. At the intended native footprint these become mottled surfaces and uneven edge clusters; colored fringe appears along the right post. The isolated boot pair is also wider than its declared32-native region. Source density is rejected; do not use processing to rescue it. Regenerate deliberate native-scale clusters while retaining the structure and richness.

## Publication status

Source gate pending corrected source. Runtime, aesthetic and interaction/grounding gates remain pending native and actual production evidence. No publication approval is granted by dimensions, this initial review, or the attractive raw design.

## Sourcev2: accepted for native preparation

Inspected `source-v2.png` and its one-uniform-size `density-preview-v2.png`. Deliberate broad material clusters replacev1 grain, retaining dimensional copper cornice/feet, steel uprights, substantial cross-braces, raised fasteners and legible cyan horseshoe/boot soles. This source is suitable for native preparation without flattening its relief. The actual boot pair is wider than the literal32-native region; preserve its aspect and honest dimensions instead of squeezing that cell.

The preview has isolated red/blue/white boundary pixels beneath feet and along posts/braces. Native approval requires verifying/removing alpha-edge contamination while preserving intended material highlights and complete silhouettes. Actual broad shelf-top and exclusive material bottoms must establish anchors, rather than assuming the requested y48 or source canvas bounds. Native/runtime, final aesthetic scene fit and pickup/drop state gates remain pending.

## Sourcev3 and processed native: accepted

Inspected `source-v3.png`, `rack-native-5x.png`, `boots-native-5x.png`, `icon-native-5x.png` and `registration.json`. The imagegen edit removes uneven shelf pegs while retaining the structure, deliberate material clusters and relief of acceptedv2. Rack is normalized uniformly once from original crop[0,0,1225,971], then translated on128×96 canvas; material box[3,7,120,89] retains both complete anchored feet. Alpha>=240 and clearing hidden RGB removes boundary contaminants without erasing intentional highlights or flattening the metal planes.

The independent boot subject is normalized once directly from original crop[1236,163,1568,416] into27×21 material pixels on32×32 canvas, translated[2,6], exclusive sole27. Its two cuffs, dimensional copper toes and separate cyan soles remain readable at54×42world. The small16-square icon separately uses its original source crop and retains recognizable paired footwear. No atlas-cell squeeze or repeated resampling is used.

Actual shelf surface occupies the perspective deck around native45..53; y49 is its highlighted front rim. Placing boot exclusive soles at49 is a coherent front-edge resting contact, with rack painted first and shoes in front. Rack exclusive ground sole89 is authoritative. Source and processed/native density are accepted; scene fit, actual ground/shelf contact and interaction-state gate remain pending production evidence.

## Final production verdict: accepted

Independently inspected both actual levels: Scrap Orbit `8-stock-3-1x.png`, `8-stock-3-2x.png`, `8-stock-2-2x.png`, `8-stock-1-portrait.png`, `8-stock-0-2x.png`, `8-dropped-2x.png`; Lode `9-stock-3-1x.png`, `9-stock-3-2x.png`, `9-stock-2-landscape.png`, `9-dropped-2x.png`, `9-dropped-portrait.png`, plus recorded interaction states in `browser/evidence.json`. Both shelf uprights/feet meet actual floors1000/1260 with no visible sky gap. Three separated readable pairs rest on the opaque front deck and disappear one at a time as the corresponding hero receives a real inventory item. Empty shelf remains intact. On-floor pair is clearly visible after Olaf moves aside to306.625, with exclusive sole27 landing exactly on the floor (drawY946+54=1000 and1206+54=1260). Dropped items are not incorrectly restocked onto the shelf.

The rack retains the source's modeled copper/steel, dark recesses, bevels and dimensional braces, fitting both richly modeled environments and the complete latest Viking set at actual1x/2x. Footwear remains identifiable in world and compact HUD; captured HUD icon checks report52opaque pixels and11cyan pixels for each of3heroes in both levels. Browser harness uses actual `hasTouch:true` context, portrait/landscape viewports and tap controls for hero selection, pickup, item recovery and activation. Final receipt contains40captures, errors[], both levels finish the focused scenario with all3heroes at3HP and Olaf boots=true after normal inventory item activation.

Capture sidecars explicitly resolve ready imagegen90 art to vikings90 Erik/Baleog and olaf111 Olaf. Independently executed `node --test tests/unit/shoes124.test.js`:2/2pass, covering stocked grounded rack, native sole/deck geometry, pickup decrement, loose drop and recovery in both levels. No unrelated level-puzzle change is approved or claimed by this focused fix.

Source, runtime, aesthetic and focused interaction/cooperation gates are accepted. Publication permitted subject to final build/release checks; no additional user approval is needed for this internal correction loop.
