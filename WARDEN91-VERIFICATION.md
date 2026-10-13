# Warden91 release verification

Independent source/native, actual1x/2x/mobile and puzzle-causality acceptance:
WARDEN91-REVIEW.md. Sources/prompts and rejected emitterv1 are preserved in
assets/warden91. Native targets: plunger80x64 per cell, emitter32x32;
one native pixel=2world units. Original Warden89 components/panorama retained.

Final normal-input Chrome run: output/warden91/browser-route.json,
won=true, HP3/3/3, simulation102.85833333336126seconds, errors[]. Restart and
Enter continuation passed. Pause is used only to inspect the same actual
state at desktop/mobile and1x/2x; no hero or mechanism flags/positions are set.
Earlier HP3/3/2 captures document real damage; they are not full-health proof.

Actual attack/contact/state matrix: output/warden91/danger/evidence.json,
87views, errors[]. Covers four warning/lift/impact cycles, incoming/stopped
waves, tracking/locked/firing beams, platform cover, strained/exhausted brace
and Erik carried through unloading. Independent reviewer inspected these.

Full root test suite:388passed,0failed, output/warden91-tests.txt. Focused
combat tests rerun after removing false shield effects from terrain contacts.
Native art regressions: tools/test-warden91-art.py,2passed. Ordinary and
missed-window/unload/recall routes pass at60/120Hz withHP3/3/3; verify frozen
release routes before publishing as well.

Release is frozen over verified Warden89, using approved Imagegen88 Vikings.
Only boss modules and the reviewed plunger/emitter assets are overlaid.
Unpublished Viking90 and unrelated working files are excluded. Publication
is followed by live hashes and an actual normal-input live completion.

Published Warden91: all12 deployment files match the frozen release (HTML
differs only by the bounded hosting sharing metadata). Evidence:
output/warden91/live-hashes.json. Actual deployed Chrome normal-input route:
won=true, HP3/3/3, simulation137.39166666670604seconds, errors[], restart and
Enter continuation passed; output/warden91/live-browser-route.json and
live-*.png captures. Remote loading needed a longer document/art timeout.
The first completed load exposed route braking leaving Olaf facing away while
waiting for incoming waves; an ordinary ArrowRight input now deliberately
faces the shield toward them. No gameplay code changed for that correction.
An additional native angled idle-shield shockwave regression passes.
Final root-only suite:390passed,0failed,
output/warden91-root-tests-final.txt. Archived release copies are excluded.
