# Method-aware level travel126

Implementation commit: `f536a2a`.
Live: https://united-marsh-6ppd.here.now/?campaign=cycle&release=transitions126
Hosted version: `01M50CAMSSY8A24JZZBJFB9X4N`.

Actual escape methods choose departure and matching arrival: campaign-colored
portals, right/down water travel, actual ceiling fall, physical walking doors,
and earned brass-body transfer. The current interstitial remains enabled with
Enter/Space continuation. Departure/wait/arrival are separate phases so future
automatic continuation can use the same handoff. Scene pixels distort on the
native grid; HUD/health/text remain separate. Entry input is quarantined until
keyup, including OS repeats and held keys across chapter cards. Pause, restart,
zoom and new-level selection were exercised.

Local verification:632 tests; source/build browser checks across30 previews;
12 desktop/coarse entry/lifecycle contexts; ordinary full-health portal1->2,
body-transfer6->7 and sewer->water4 routes. Independent review accepted source
policy, runtime visuals, native sampling and lifecycle behavior. No new bitmap
asset or character processing pipeline was introduced.

After publication,14 changed modules/styles/manifest hashes plus HTML matched
the tested build. All12 hosted desktop/coarse entry/lifecycle contexts passed
with no errors. The hosted ordinary sewer route completed in60.2667seconds,
allHP3,26 captures, no errors, continued to stable water4, verified matching
arrival and rejected held movement/Enter autorepeat after entry.

Evidence:
- assets/transitions126/live-hashes.json
- assets/transitions126/live-entry/evidence.json
- assets/transitions126/water-live-route/evidence.json
- docs/history/TRANSITIONS126-REVIEW.md

Baseline archive scripts, Vikings55 experiments and pixel-art-fixer work remain
untouched/uncommitted. Additional campaign source edits only stamp changed
shared-module imports for cache invalidation.
