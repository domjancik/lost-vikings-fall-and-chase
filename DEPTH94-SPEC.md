# Machine campaign decorative depth pass

Scope: six cycle/machine levels (Cycle, Refraction, Momentum, Clockwork, Water,
Warden). Looks only. No edits to engine, movement, collision, levels, mechanisms,
controls, triggers or hazard state. Freeze against verified published Clockwork93.

Two generated atlases:256x192 native,4columns x3rows,64x64cells,2worldunits per
native pixel. Each theme has a narrow floor pipe fixture (about108world high),
a low welded spare-parts rack (40world high), a bolted recessed wall grille
(80world high), and a quiet masonry/metal wall tile (source60native square; its seamless opaque
interior uses54x52native=108x104world without stretching).
Rows atlasA: Cycle/Refraction/Momentum; atlasB: Clockwork/Water/Warden.
Grounded cells0/1 use native base62; wall fixtures attach within visible wall
patches. Whole source normalized once uniformly; no per-part stretching.

Guides control pixel geometry, detail density and footprints. Final material
art uses generated worn Clockwork/Water92 shading, restrained bronze/iron and
room-specific stone/glass. No bright controls, levers, loot boxes, pickups,
icons or moving machinery. Broad deliberate clusters, no AA/fine texture rescue.
The Vikings are adult humans: low rack40world=roughlyhalf standingheight72,
industrial pipe108world is not furniture. All art opaque except real gaps.

Decorative placements remain fixed in world space to retain floor attachment;
depth comes from rear-wall ordering, lower contrast and foreground occlusion.
Wall textures vary existing solid vertical faces below their walking top; sparse
wall-mounted patches sit behind heroes/machinery. Do not create fake walkable
ledges or obscure rails, beams, exit portals, air cavities or action targets.

Independent reviewer accepts raw/native source gate and processed/gameplay
1x/2x/mobile gate separately, covering six levels and all upper/right placements.
Geometry tests enumerate footprints/supports; reviewed captures include walls,
attachment, human scale, foreground cue readability. Source prompts and originals
retained; publish only final accepted candidate and verify live identity.
