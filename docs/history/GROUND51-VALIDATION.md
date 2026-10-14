# Ground51 grounding and authored interaction correction

The prior overlay controls were rejected and superseded by 32 generated frames:
eight each for locking levers, wafer insertion, reversible lift selectors and
archive mounting. Original source, fixed-cell runtime atlas and registration
data are retained under `assets/ground51`. Work-station motion follows the
authoritative work stroke; its housing sits beside the exposed handle.

Middle scenery uses a broad opaque foundation row rather than stray bottom
pixels. Contact overlaps the floor by two world units. Each platform support
selects a real lower floor/deck and reaches that footing instead of stopping
after an arbitrary fixed length.

Validation on 2026-10-11:

- `npm test`: 208 passed, zero failed or skipped. Includes all normal-input
  campaign routes, actual mechanism atlas opacity/base/state checks, reversible
  frame selection, every platform support, substantial foundation selection,
  persistent flags and a red-to-green partial-work-stroke regression.
- `npm run build` passed; `git diff --check` passed.
- All eight campaign chapters surveyed at both zooms, plus portrait mobile.
- Production-control browser routes for chapters 1, 2, 3, 7 and 8 cleared with
  health 3/3/3. Final canopy route cleared with health 3/3/2.
- Generated-art state matrices use `sprite51-first-*` and `sprite51-matrix-*`
  captures. Work includes `work-working` and `work-done`; lifts include reverse
  selector motion. Canopy upper/lower footing captures overlap because the game
  deliberately retains a 790-world-unit viewport at 1× even on taller screens.
- Initial browser capture naming errors and a diagnostic pause/input race were
  repaired and the affected routes repeated. Failed runs were not acceptance
  evidence. Critical shield raise is now checked before leaving the deck.

Independent visual findings and inspected captures are recorded in
`CAMPAIGN-REVIEW.md`. The mandatory future gate is `VISUAL-REVIEW-GATE.md`;
logic success cannot substitute for visible own-object state or pixel contact.

## Published verification

Deployed to the existing authenticated here.now site. Nineteen changed modules
and assets match local bytes exactly. Live browser smoke checked 31 asset URLs,
all eight chapter entries, native-grid rendering, hidden hints and a full-screen
390×844 mobile canvas with no page errors. The live normal-control first chapter
cleared with health 3/3/3; its generated lever and socket states were captured.
The persistent browser's existing capture callback initially retained local
capture filenames, so these actual live captures were copied to `sprite51-live-*`
and the standalone live driver now renames its entire binding prefix consistently.
