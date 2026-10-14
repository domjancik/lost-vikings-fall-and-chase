# Viking90 final verification

The complete candidate retains the verified Warden91 game and replaces the
reviewed whole-pose walk/climb cells for all three heroes. Erik's corrected
walking hands are selected as phases3V5,4V6,5V5 and6V5. Original procedural
and prior generated skins remain selectable.

## Technical and browser evidence

- Root gameplay suite:391passed,0failed
  (`output/vikings90-root-tests-final.txt`).
- Whole-pose registration regression:4passed
  (`tools/test-vikings90-registration.py`).
- Actual ordinary gait:72exact phase captures over three loops, all heroes;
  desktop1x/2x, mobile1x/2x and reversed movement; no browser errors
  (`output/playwright/vikings90/evidence.json`).
- Actual raised Olaf gait:24exact phase captures over three loops, plus
  desktop/mobile1x/2x and reverse; no browser errors
  (`output/playwright/vikings90-overhead/evidence.json`).
- Ladder movement:34normal and10raised captures, stopped and reversed
  poses, material consistency and floating; no browser errors
  (`ladder-detail-evidence.json` in the respective folders above).
- All three gallery action bindings checked; mobile canvas remains native
 340pixels wide with no CSS shrink (`output/viking-gallery90/evidence.json`).
- Actual Erik-on-Olaf walking:12captures across all eight gait phases,
  mirrored movement, desktop/mobile1x/2x; exact central support height and
  constant horizontal passenger offset; no browser errors
  (`output/vikings90-rider/evidence.json`). The test asserts that production
  fullscreen styling loads. Its initial unstyled capture set was discarded.
- Warden route using the final skin:won, HP3/3/3, time102.6083; restart and
  Enter continuation verified; no browser errors
  (`output/vikings90-warden-final/browser-route.json`).

The ordinary Olaf contact regression first failed against six old registered
phases, then passed after explicitly authored planted-sole Y registration.
The previous packer imposed guide head motion on an entire source pose and
lifted its planted boot. The correction translates the whole pose, preserving
its pixels, anatomical phase and helmet X; it does not fit an alpha box.
The raised phase0 support regression likewise failed against an automatic
anchor shifted by a broad shading row, then passed with the independently
reviewed disc interior/boss/palm plane19. This preserves the physical central
passenger plane; no shield or rider physics changed. Four whole-source leg
contact edits retain the approved upper bodies and source anatomy.

These checks do not substitute for visual approval. The separate source/native
and processed/runtime verdicts are recorded in `VIKINGS90-CYCLE-REVIEW.md`
and `assets/vikings90/visual-gates.json`. Both final visual gates are accepted
for all three heroes, including grounded Olaf movement and moving shield
passengers. The publication manifest is prepared over the verified Warden91
base; live content verification is the final deployment check.

An additional independent focused contact audit accepted the final24raised
gait captures, eight moving-rider phases, reversed and desktop/mobile1x/2x
views. Evidence sheets: `output/v90-independent-overhead-contacts.png` and
`output/v90-independent-rider-contacts.png`. It inspected actual pixels and
made no code, art or gate-log changes.

## Published verification

Published the complete reviewed skin to the existing here.now site.
All79selected Viking90 and retained Warden91 files matched the frozen build
(`output/vikings90-live-hashes.json`; only the documented bounded here.now HTML
metadata normalization applies).

Live gallery: all three heroes/action bindings pass, no browser errors, and
mobile native/display widths remain340/340
(`output/viking-gallery90-live/evidence.json`).

Live Warden with `skin=imagegen90`: won, HP3/3/3, simulation time99.0000;
restart and Enter continuation pass, no browser errors. Actual desktop/mobile
1x/2x brace, machine and carrier captures are retained alongside
`output/vikings90-warden-live/live-browser-route.json`.

Play: https://united-marsh-6ppd.here.now/?skin=imagegen90&release=90

Full set: https://united-marsh-6ppd.here.now/viking-gallery90.html?release=90
