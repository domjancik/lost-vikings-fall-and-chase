# Reusable mechanical connections

Generated native sprites replace plain cable/pipe/rail rectangles. Preserve
mechanical distinctions: flexible braided cable communicates control/tension;
flanged rigid pipe communicates airflow; bolted rail communicates carriage load.
No arbitrary glowing line connects unrelated puzzle objects.

Atlas:8×4 source cells, reconstructed once to16×16native cells;32world-unit
tiles. Horizontal/vertical straights, elbows, tees, crosses, attachment clamps,
pipe valve, four horizontal and four vertical gentle cable animation frames,
and two actuator states. Fixed edge ports remain at the tile midpoint. Cable
motion changes its belly only; endpoints and collision geometry never move.

Routes consist of explicitly authored orthogonal world-space anchor points.
Corners use elbows; terminal clamps attach to real machine ports. Straight
segments repeat without scaling; a final clipped segment reaches the exact
next anchor. All source/destination positions, clips and animation frames
remain on the2world-unit grid. Short segments and incompatible bends reject
before rendering. Crossings use appropriate tees/crosses rather than pretending
two unrelated circuits are mechanically joined.

First installation:Cycle of Depths. Brake control cable joins blower housing;
damper has a separate flanged air duct to that blower; selector cable reaches
the upper rail turnout. Rails receive an independent heavy structural set.
Subtle, phase-offset cable sway; rigid plumbing and supporting rails stay still.

Review:trace every endpoint to an equipment port; inspect corners/seams at
1x/2x/mobile; cables must not obscure the arrow catch. Verify no change in
gameplay physics or puzzle sequencing. Retain source, prompts, packing tool
and port metadata so later levels can reuse the system.
