# Viking shortcut inventory cycling

Repeated deliberate1/2/3 presses on the already selected Viking now use the same
inventory-slot cycling as HUD re-selection. Switching heroes preserves their
selected slot. Auto-repeat remains ignored; Tab/Control keep switching heroes.

Verification:718 tests pass; build/release500 files pass. The dedicated real
browser regression first reproduced the missing keyboard cycle, then passed
against both source and production:12 press/switch checks, four-slot wrapping,
independent bags, held-repeat suppression, HUD parity and Tab behavior, no errors.
