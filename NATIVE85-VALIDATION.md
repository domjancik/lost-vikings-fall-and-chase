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
