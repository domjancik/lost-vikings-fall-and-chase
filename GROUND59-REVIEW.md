# Ground59 independent review

## Placement/runtime findings

The previously accepted fan review missed transparent bottom padding: its full128-world cell was positioned atY812, but the broad visible base ends at native row60 of64, giving visible bottom932 and an8-world gap above the940 floor. Canvas-edge alignment and earlier broad scene approval were insufficient evidence. That prior assumption is explicitly superseded.

Independently read `sprite-atlas.js`, `cycle-render.js`, `entity-grounding.test.js` and the updated `VISUAL-REVIEW-GATE.md`. Independently audited all four fan cells with PIL: each is64x64; each substantial bottom is60, with bottom-row coverage57–58 pixels. The new original-scale Y820 placement gives actual visible bottom940 for every frame. The fan uses untrimmed atlas drawing and the authored floor1280..1440 atY940, so its broad base rests on the actual supporting surface without resizing.

Independently viewed `output/playwright/ground59-2x.png`, `ground59-1x.png` and `ground59-mobile.png`: the bronze base meets the visible stone surface, with no exposed background strip between them. No art source was changed or regenerated; this is a corrected placement/runtime gate, not new source-art acceptance. Vikings55 remains excluded.

Independently ran `node --test entity-grounding.test.js`: **3 pass**, zero failures/skips. The implementation agent separately reports246 root tests passing. No separate browser playthrough was performed by this reviewer.

## Reusable-helper finding awaiting resolution

`createAtlas(..., trim=true).drawGrounded` initially calculates its foot against the original full cell, then delegates to `draw`, which stretches the trimmed crop into the destination. Those two coordinate systems differ and can place the visible base below the surface. The current fan is correct because it uses `trim=false`, but the shared helper must either reject trim-enabled use explicitly or use the actual rendered crop coordinates before it is presented as the mandatory general grounding path.

The tightened visual gate appropriately requires alpha-derived substantial contact, identified support and frame diagnostics, narrow-foot/hanging exceptions, missing-support failure, and actual close1x/2x/mobile inspection. It does not allow previous approvals or route completion to waive visible gaps. Final helper verdict awaits the coordinate-system safeguard above.

## Final helper and runtime verdict — accepted

The reusable-helper issue above is resolved: current `drawGrounded` calls `ctx.drawImage` on the full original atlas cell directly, regardless of ordinary drawing's trim setting. Independently reread the corrected function and reran the three focused tests successfully. Cell scale and the measured cell-relative foot now share the same coordinate system.

Read the refreshed `browser-ground59.js`: its offscreen production-atlas check scans rendered alpha pixels, rather than trusting returned placement alone. The implementation agent reports all eight combinations (frames0–3, trimfalse/true) render atY820 with both logical and scanned actual bottom940. The running production fan sampled all four frames with zero contact gap; refreshed1x/2x/mobile captures were produced without page errors. These browser executions are reported evidence; independent source/alpha/image inspections and the three-test run are this reviewer's checks.

**Ground59 accepted for the existing fan placement and corrected grounding helper. No remaining blocker in this scope.** Earlier canvas-bottom/scene-survey assumptions failed and must not be reused. This verdict does not certify every other standing prop or support in the game, and does not approve the pending Vikings55 art.
