# Native85 release validation

Native motion rework is an optional skin, alongside the existing reworked,
imagegen trial, previous and original procedural skins. The eight gait poses
are distinct native drawings, with the accepted72/76/72 world-unit standing
budgets and distance-driven128/112/104 world-unit strides.

Both independent visual gates are accepted in VIKINGS85-REVIEW.md. Raw imagegen
attempts remain rejected and retained; production art is directly native-authored.
The review covers actual1x/2x/mobile walking, mirrors, rear ladders, attacks,
held/raised shield and rider contacts.

`node --test *.test.js`:358 tests passed, zero failures
(`output/native85-all-tests.txt`). Five new collision regressions reproduced
the legacy rectangle mismatches before implementation. The native skin now
sweeps its source-matched rotated shield ellipse, including mirrored facing,
overhead thickness, back stow and actor-relative motion. Other skins preserve
their existing collision geometry. Production hero skin/pose binding was
verified in real browser front/overhead/ladder states.

The isolated builder overlays only reviewed sprites, registration, physical
shield integration and game binding over the verified water83b distribution.
Immutable assets use hard links to avoid duplicating graphics on a full disk;
editable modules are copied and all module cache identities are unified.

## Combined water playthrough

The isolated3038 distribution was played with ordinary keyboard controls and native85 selected. Actual runtime metadata confirmed all three selected skins plus Olaf's source ellipse before play. The full route cleared in90.466667simulation seconds with health[3,3,3], Enter continued, mobile views rendered, grounded machine/portal baselines matched their floors, and no browser errors occurred (output/water-native85-route.json).

## Published85 verification

Published https://united-marsh-6ppd.here.now/?campaign=cycle&puzzle=water&skin=native85&release=85. All23 critical deployed files matched the reviewed frozen build (HTML normalized only for host-added social tags). Actual390×844 portrait browser loaded native85, confirmed real shield geometry, switched to original procedural via Help, restored native85 and retained it after navigation without the skin URL override; no browser errors. Evidence: output/native85-live-smoke.json and output/playwright/native85-water-live-portrait.png.
