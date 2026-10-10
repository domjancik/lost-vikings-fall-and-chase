# The Return Address — arc46 verification

## Automated evidence

2026-10-10: `npm test` passed 188 tests, zero failed or skipped. `npm run build` succeeded. `git diff --check` passed. All eight new Story chapters clear through normal simulation inputs at both 60 and 120 Hz; routes do not teleport heroes, inject inventory, force flags or disable enemies. Existing Arcade regression routes remain passing.

Coverage includes continuous gate collision/render positions, transparent open apertures, accelerated lift travel with inactive passengers, persistent local payload trajectories, material-specific sword/glass behavior, universal reachable handles, cooperative pressure/ratchet doors, shield protection, archive custody/drop/recovery, all six output boarding orders, patrol floor support and door clearance. The projection lift cannot bypass its screen/glass restraint puzzle.

Art validation preserves every scenery pixel from its source crop, checks all eight enemy frame foot pivots, binary sprite alpha, and zero invented cell colors. Sources and prompts are in CAMPAIGN-ART.md; the positive-weight fixer patch is versioned.

## Browser evidence

All eight chapters cleared through production keyboard controls with all three crew alive and zero JavaScript runtime errors. Initial remaining HP by chapter: 2/3/3, 3/3/3, 3/3/3, 3/3/3, 3/1/3, 3/3/3, 3/3/3, 3/3/3. Affected chapters2/5/6 were replayed with unobscured mechanism captures; chapter6's visual rerun ended at3/3/2; its subsequent post-dependency-fix replay ended at3/3/3. Test driver resumes the real pause UI after browser focus loss and waits on simulation time.

Evidence files are in output/playwright/campaign46-*.png and output/campaign-redo/browser-*.log. Drivers browser-campaign46-0.js through -7.js are versioned. They send production keyboard events and read diagnostic DOM state; no private gameplay state is changed.

## Independent critique

CAMPAIGN-REVIEW.md records conceptual, implementation and screenshot reviews by the independent campaign_review subagent. Its final verdict has no unresolved blocker in inspected evidence. Reviewer independently ran188 tests and inspected actual spawn, mobile, upper-deck, enemy walking, lift travel, gate aperture, restraint and canopy-reveal captures. It did not independently operate the browser playthroughs.

Grounding is a mandatory acceptance gate: backgrounds retain connected bases/supports under parallax, enemy animation uses a fixed foot pivot on the collision floor, props contact supports, and riders remain attached to moving decks. Representative multi-camera evidence is recorded; this does not claim manual inspection of every possible camera position. Older chapter8 screenshots include a pause overlay and are weaker visual evidence.

## Version control

Git contains a pre-rebuild baseline, design/review specifications, and the implementation with reproducible generated-art sources. Credentials and local runtimes are ignored. The vendored pixel-art-fixer submodule retains the corrected local positive-weight change; tools/pixel-fixer-positive-weights.patch reproduces it on a fresh checkout.

Additional UI checks: Enter continued chapter6 into chapter7 retaining exactly one archive. Sixteen spawn captures cover both zooms for every chapter. A real pointer hold moved Erik129.6 units and the mobile ACTION button jumped him; the canvas fills the390×844 viewport. Browser auto-pause on focus loss is handled through the production pause button in the driver.
`Space` continued the completed ownership core into chapter8 with exactly one archive; all crew survived the core replay at3/3/3.

## Published build

arc46 published to https://united-marsh-6ppd.here.now/ on2026-10-10. Real-browser live check confirmed Story chapter1, all8 chapter choices,13 new module/art requests atHTTP200, hints false,390x844 canvas and zero page errors. Live captures: output/playwright/campaign46-live.png and campaign46-live-mobile.png.
