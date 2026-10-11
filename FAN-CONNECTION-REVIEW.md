# Fan66 connection review

Independent review of the Cycle fan attachment correction. No source asset,
native pixel scale or puzzle physics is changed; existing art gates remain
applicable. Scope: grounded fan housing, brake cable, upper air duct and all
four authored animation frames.

## Cause and corrected invariant

The earlier grounding correction moved the visible housing onto its support,
but the brake cable's endpoint retained a hardcoded y850. Inspecting only the
fan base did not certify that its attached machinery followed it. This is the
failed assumption in the earlier review.

cycle-fan-connections.js derives the terminal positions from the same actual
fan placement used for drawing: authored left port (8,31) and top port (32,6)
within the 64-native cell. Both routes are painted behind the housing. Their
far endpoints stay at the brake/damper controls, while the fan endpoints and
last bends follow the translated housing. There is no extra source trimming,
rescaling or physics offset.

## Verification and visible evidence

Independently ran cycle-fan-connections.test.js, entity-grounding.test.js and
connection-layout.test.js: eight tests passed. The shift regression requires
both housing terminals to inherit a 22-world-unit placement change while the
control endpoints remain fixed; connection planning still validates the paths.

Inspected actual output/playwright/fan66-idle-1x-detail.png,
fan66-idle-2x-detail.png and fan66-moving-{0,1,2,3}-detail.png, plus the complete
idle-2x view. The left cable visibly enters the housing rim without exposed sky
between terminal and housing. The upper duct ends within its top socket/flange.
The broad fan base meets the platform top throughout the four changing blade
poses. The animation changes the rotor, not the apparent housing scale or either
attachment. The full scene preserves the connected paths and supporting deck.

Parent reports actual four-frame browser sampling with zero contact gap and
page errors, and 269 root tests passing. These supplement independent source,
focused-test and screenshot inspection; I did not perform a separate browser
playthrough. No mobile-specific screenshot was supplied for this correction;
the 1x/2x contacts and shared placement/path logic are the reviewed scope.

## Verdict

**ACCEPTED for Fan66 placement/attachment runtime correction.** No remaining
contact blocker is visible in the reviewed frames. The central visual gate's
new requirement to review every cable/duct terminal after grounding changes
addresses the missed dependency. This verdict does not certify unrelated
machinery connections or uncaptured legacy props.
