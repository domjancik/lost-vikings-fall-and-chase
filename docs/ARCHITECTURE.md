# Repository navigation

## Active code

| Folder | Responsibility |
| --- | --- |
| `src/app/` | Main game, controls, campaign selection, previews and hint preference |
| `src/core/` | Simulation, movement, collision, damage, inventory and interactions |
| `src/campaigns/arcade/` | Original arcade/inventory/vertical worlds |
| `src/campaigns/story/` | Story campaign, enemies, machinery, world layout and custody |
| `src/campaigns/machines/` | Machine Rooms dispatch and shared mechanisms |
| `src/levels/` | Norse pub, clockwork, sewer, water, Warden, Loom, freight, momentum, refraction, orbit and lode; local mechanics/render/art together |
| `src/heroes/` | Viking animation, procedural and generated skin registration |
| `src/render/` | Scene composition, terrain, parallax, camera, text and pixel grid |
| `src/audio/` | Shared sound event processing and recipes |

Current level modules use meaningful names such as `src/levels/loom/render.js`,
rather than release numbers. Explicit `legacy-*` modules preserve older interfaces
still used by tests or supported comparisons. Skin revision names distinguish
selectable art sets and are intentionally retained.

## Validation and assets

`tests/unit/` contains the existing simulation, collision, art and input tests.
`tests/routes/` contains ordinary-input simulation playthrough fixtures.
`tests/build/` guards the manifest, dependency closure, path bounds and clean output.
`tests/browser/runners/` retains browser validation harnesses; the maintained
cross-campaign smoke entrypoint is `tests/browser/reorg-smoke.mjs`.

Art preparation and validators are grouped in `tools/art/` by subject. Commands
continue to run from the repository root. `assets/` retains source images, exact
prompts, runtime images, registrations and review evidence at their original paths.

## Build and release boundary

`config/release-manifest.json` explicitly lists source modules, document entrypoints
and runtime assets. `tools/build/` validates the complete import graph before
cleaning the bounded `dist/` directory, then emits the existing flat public module
URLs. No build copies every historical asset or relies on stale output.

Machine Rooms uses `src/campaigns/machines/cycle-order.js` for menu, navigation
and continuation order. Stable level IDs remain unchanged when a new room is
inserted: Norse alehall ID11 precedes sewer ID10, then Drowned Regulator ID4.

`npm run dev` serves nested source paths; `npm run build` produces deployable flat
paths. `npm run release:check` checks emitted bytes against the same manifest.
Release commands consume the generated file list; old incremental freeze scripts
are history, not the current source of truth.

## History and unfinished work

`docs/standards/` holds the current visual, scale and art-direction policies.
`docs/history/` keeps revision specifications, reviews and receipts. Root prompt
texts moved into `docs/history/prompts/` without changing their contents.
`archive/` preserves old mutation scripts, browser probes and toolchains; their
old paths/patch assumptions are documentary and must not be executed blindly.

`config/source-map.json` maps every migrated old path to its new location. The
one-time migration tool preserves original bytes and HEAD versions under ignored
`output/reorg99/`. It stages transformed HEAD separately so pre-existing local
changes remain unstaged at their new paths. Local sprite experiments and the
pixel-fixer submodule remain outside the release manifest.

Level travel policy and native distortion geometry live in
`src/render/level-transition.js`; `transition-render.js` composes their effects.
The app keeps departure, interstitial wait and arrival separate. Arrival accepts
the outgoing method while initial/retry entries use the destination's own entry
construction. Input quarantine lasts until keyup, including across dialog close.
