# The Last Exit — verification

## Automated validation

170 tests pass. All eight Story chapters complete through normal movement/actions at 60 and 120 Hz. Route tests never teleport Vikings, inject quest inventory, force completion flags, or disable enemies. Classic campaign regression routes remain passing.

Additional coverage: per-level world bounds and camera, reciprocal door support and spawn clearance, item/door interaction priority, sword damage and defeated patrols, directional shield blocking, quest item preservation, ghost/door clearance over time, floor/projectile collisions, shield-assisted archive geometry, and terrain alpha-padding alignment.

## Real browser playthrough

All eight chapters were played with production keyboard controls and cleared with all three Vikings alive and no JavaScript runtime errors. Chapter 6 was completed in a 390 × 844 portrait viewport. Revised chapters 3 and 5 were replayed after their ghost-door and shield-boost changes; both cleared.

Initial run health by chapter: 1 [2,3,3], 2 [3,3,3], 3 [1,3,3], 4 [3,3,3], 5 [1,2,3], 6 [3,3,3], 7 [3,3,3], 8 [3,3,3]. After doorway collision correction, chapter 3 cleared with [3,3,3]. The revised archive cleared with [1,2,3].

Scripts: `browser-story41-routes.js`, `browser-story41-memory.js`, `browser-story41-archive.js`. Completion screenshots: `output/playwright/story41-chapter-1-clear.png` through `story41-chapter-8-clear.png`.

## UI and visual verification

`browser-story41-ui.js` verifies separate campaign save keys, eleven preserved Arcade choices, eight Story choices, chapter-card pause, Enter/Space continuation, real overlay pointer movement, overhead/front shield buttons, non-overlapping mobile action controls, fullscreen availability, Story debug skipping, and the archive visible in Olaf's final inventory.

The screenshot review caught transparent padding in terrain cells that visually separated feet from collision surfaces. Static terrain and object cells now crop to alpha bounds; animated enemies and doors retain fixed full-cell coordinates. New regression tests cover the alpha-bound behavior. Updated portrait screenshots were inspected after the fix.

## Artwork

Generated with the built-in image tool. Four new sheets: distant environments, transparent grounded architecture, animated enemies, and paired hinged-door states. Prompts and normalized asset sizes are recorded in `output/imagegen/story41-prompts.md`.

## Scope

Eight new Story chapters, worlds 2880 units wide, including a tall two-stage observatory, moving sentries/wraiths/crawlers, multiple reciprocal doors, inventory locks, bomb vault, shield boost, cart rescue, dragon-fire forging, three individual transfers, and a physical escape epilogue. The original eleven levels remain in the independently selectable Arcade campaign.
