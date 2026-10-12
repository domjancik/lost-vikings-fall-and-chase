# Saved skin selection

Local implementation offers Reworked Vikings (70locomotion/63actions) and
Previous Vikings (63allposes) in the existing help/settings dialog, without
another crowded HUD button. Preference persists as last-call-skin and applies
to gameplay, HUD portraits and direct character drawing including inset views.
No asset regeneration, physics or inventory change. Earlier uncommitted55
sprites are deliberately excluded from selectable production assets.

Focused pose-routing/storage tests observed red then green. Usage restored;
actual browser selector verification now passes persistence and changed portraits.
Reviewer found missing immediate portrait repaint, reproduced in browser and
fixed before acceptance. Changed-scope selector/shield runtime gate accepted in
SKINS73-REVIEW.md;333tests pass. Full carrier/inset browser passed. Published
to the existing here.now site; seven live runtime files match the reviewed build,
and live selector, portrait repaint and reload persistence pass without page
errors. Momentum72was
separately completed/published.

Character guide rework requested by user remains outstanding: actual front/back
leg crossings, exactly two arms, alpha halos, organic supported torso/shoulder
motion, modest whole-body breathing with planted feet, up/down look poses,
midbody seams. Front hand/shield draw occlusion is corrected in73; this does not
repair the underlying sprite anatomy. Use native procedural pose and occlusion
guides with imagegen material rendering and review every affected action before
adding another selectable skin. Existing skin selection does not fix those flaws.
