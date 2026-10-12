# Momentum Works68 verification

One new third Puzzle Lab room, built from an imagegen brainstorm and a written
numerical spec before implementation. The rolling relay and timing lane are two
acts in the same chamber. The Story and Arcade collections retain their levels.

`npm test` runs the root test files, excluding archived release copies under
output. Final local run:291 tests passed. Seventeen Momentum mechanics tests
cover both full60/120Hz normal-input routes with all three health3, circle/deck
sweeps, crown contacts, wrong-route recovery, occupied reset deferral, crumble
rebuilding, laser phases/damage/death, fireball shield/rebound, furnace solidity,
padded-wall jumps, lift rim registration and parked-ball/ladder clearance.
The native-art test independently inspects actual PNG alpha, bases and flanges.

Actual keyboard browser full route:129.708 simulated seconds, all three health3,
all three exit, Enter continues, no JavaScript errors. The expanded failure/retry
run also completes:153.408s, health2/3/3, after a missed fork, return hoist, tile
fall, rebuilding and reunion. That run takes a real rebounding-fireball hit.
Final focused checks verify the corrected silver walking rim, furnace footing,
charge/live beam joint and down/up recovery ladder at1900 with all health3.

Retained source/prompts and native atlases:assets/momentum68. Review/spec:
MOMENTUM-REVIEW.md and MOMENTUM-SPEC.md. Actual captures:
output/playwright/momentum68-*.png; relevant desktop1x/2x,390x844 portrait and
844x390 landscape variants. Canonical browser drivers include the full route,
expanded failure/state validation, return endpoint framing and outlet checks.

Publication uses tools/build-momentum68.mjs, an isolated snapshot of accepted
df0f471 plus only owned runtime changes and assets. Existing uncommitted build/
publisher/Vikings55/submodule work is preserved. Accepted build and publisher
blobs are staged directly into Git's index without overwriting those working
copies. Raw generation sources and evidence are excluded from the public upload
manifest. Live verification is recorded after publishing below.

## Live release — 2026-10-12

Implementation commit: f6596bd. Published to the existing here.now site:
https://united-marsh-6ppd.here.now/?campaign=cycle&puzzle=momentum&release=68

The live entry, eight runtime modules and seven native art files match the
reviewed isolated release byte-for-byte by SHA256. Live Playwright smoke opens
Puzzle Lab round2 on1440x900 desktop and390x844 mobile, with generated art ready,
all three characters healthy and zero JavaScript errors. Retained captures:
output/playwright/momentum68-live-desktop.png and momentum68-live-mobile.png.
Full route and recovery verification above was performed on the identical
reviewed local runtime; the live check confirms deployment and initial layout.
