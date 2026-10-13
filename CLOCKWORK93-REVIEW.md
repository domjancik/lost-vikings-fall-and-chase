# Mobile clockwork inset correction

Erik's captive/release inset now uses the left side whenever the same
max-width960/coarse-pointer condition places character selection on the right.
The desktop position remains on the right. The mobile top anchor accounts for
the actual toolbar height and current zoom; the pause badge sits below the inset.

Verification:395 unit tests pass, including the failing-before-fix left-side,
release-state, both-zoom and safe-header regressions. Desktop and mobile layout
bounds were checked against actual character cards and action buttons during
normal-control clockwork gameplay. Eighteen cases cover docked/driving/release
views at390x844,844x390,1440x900 and both zooms, with no overlaps.

Published scripts/controls match the frozen candidate. Live ordinary-control
route completes in89.850 simulation seconds with HP3/3/3, no page errors and
working continuation. Evidence: output/clockwork93/live-inset-route.json and
output/playwright/clockwork93-* captures. Implementation commit e536ea7.
