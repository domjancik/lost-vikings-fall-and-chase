# Viking shortcut inventory cycling

Repeated deliberate1/2/3 presses on the already selected Viking now use the same
inventory-slot cycling as HUD re-selection. Switching heroes preserves their
selected slot. Auto-repeat remains ignored; Tab/Control keep switching heroes.

Verification:718 tests pass; build/release500 files pass. The dedicated real
browser regression first reproduced the missing keyboard cycle, then passed
against both source and production:12 press/switch checks, four-slot wrapping,
independent bags, held-repeat suppression, HUD parity and Tab behavior, no errors.

Published runtime commit: `4f24fb2`; hosting version:
`01M529CTEDRZN5PDJ5ETBV9NWP`.
Live URL: https://united-marsh-6ppd.here.now/?campaign=fall&release=hero140
Live module/manifest hashes and HTML match. The public browser regression also
passes all12 checks with repeat suppression and HUD parity, zero errors.
