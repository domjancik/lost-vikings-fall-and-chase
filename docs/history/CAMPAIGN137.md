# The Fall & The Chase

Create a distinct campaign, preserving stable level IDs and existing gameplay.
Default new visits to this campaign. Keep other campaigns available.

| Chapter | Existing level | Stable ID |
| --- | --- | --- |
| 1 | The Familiar Hearth (ale tavern) | 11 |
| 2 | The Last Lamplighter | 10 |
| 3 | The Drowned Regulator | 4 |
| 4 | The Momentum Works | 2 |
| 5 | Inside the Clockwork | 3 |
| 6 | The Ember Freight | 7 |
| 7 | The Fourfold Warden | 5 |
| 8 | Scrap Orbit | 8 |
| 9 | The Lode Engine | 9 |
| 10 | The Cycle of Depths | 0 |

Machine Rooms retains the two unselected levels (IDs 1 and 6). Both groups use
the original cycle simulation family. Their save keys and selectable orders are
separate. A valid legacy machine save migrates into the new campaign if it
belongs there and no dedicated campaign save exists; invalid or unrelated saves
start at the group's first chapter. Existing dedicated progress takes precedence.

Regression checks cover exact membership, order, completion/replay endpoints,
simulation identity, migration, corrupt saves, thumbnails, mobile selection and
debug navigation. No art, level geometry or puzzle mechanics change.

Validation: 698/698 tests pass. Production build/release validation passes for
495 explicit build files (496 publication files including the release manifest).
`tests/browser/campaign137.mjs` checks all ten chapter loads, counter 1/10 to
10/10, previous/next boundaries, legacy save migration, dedicated save resume,
mobile selection, Machine Rooms membership and its 1/2 to 2/2 counters.
`npm run test:browser` passes against source and production build: four campaigns,
31 unique previews, movement, hero switching, inventory, zoom, pause, restart,
mobile layout and gallery pages. Both browser suites report zero errors.
Screenshots were inspected using the current imagegen90 Viking skin.

Published runtime commit: `c421d01`.
Hosting version: `01M5268H20A900BEKZZ5N6TKHE`.
Live URL: https://united-marsh-6ppd.here.now/?campaign=fall&release=campaign137
Seven changed modules/manifests match production bytes; HTML matches after
removing hosting social metadata. The live browser suite passes all ten chapter
loads, save migration/resume, mobile menus and both remaining Machine Rooms,
with zero browser errors. Hash receipt: `CAMPAIGN137-LIVE.json`.
