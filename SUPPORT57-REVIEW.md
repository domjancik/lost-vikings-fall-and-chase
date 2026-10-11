# Support57 independent review

## Live deployment verification (implementation record)

Live entry point and all 11 changed modules exactly match the tested release.
Ordinary keyboard boarding and carrier travel also passed on the public site:
528 horizontal frames, maximum relative drift 1.14e-13 world units, both heroes
healthy and attached to their respective supports, zero page errors.
The expanded seven-test regression set additionally verifies walking across
and off a moving shield. Root-only suite: 241 pass, zero failures or skips.

## Source and simulation verdict

**Code and focused regression gate accepted; actual browser contact evidence remains pending.** No art or collision plane changes are included, and this review does not approve the unfinished Vikings55 assets.

The frame order is `prepareMotion` → `advanceCycleCarrier` → `integrateMotion`. `prepareMotion` records Olaf's `prevX` before the carrier changes his position. The updated origin therefore includes both carrier displacement and Olaf's own integrated walking displacement when shield riders are processed after Olaf. The carrier directly moves only heroes with `support === 'cycle-carrier'`; shield passengers have numeric support `2`, so they do not receive that carrier delta a second time. Their own directional movement is then added once by normal integration.

Jump detachment occurs in `prepareMotion`, before either carry stage. A jumping Erik clears support and receives no carried shield displacement. Lowering the shield also disables the shield-passenger branch and removes its collision surface. Vertical carrier travel continues to place riders on the authoritative shield support plane; the horizontal origin correction does not alter shield dimensions, support height, or physics.

Independently read `movement.js`, `cycle-campaign.js`, and `shield-carrier.test.js`, then ran `node --test shield-carrier.test.js shield-platform.test.js cycle-campaign.test.js`: **22 pass, zero failures or skips**. The new six regressions cover left/right travel at 60/120 Hz, two simultaneous shield riders, a complete circuit including corners, and actual jump detachment. Existing shield walking/contact and complete Cycle routes also pass. The implementation agent separately reports 240 root tests passing; that broader count was not independently rerun here.

## Remaining evidence gate

Await a fresh ordinary-keyboard browser stack on Olaf while he rides the horizontally moving carrier. Compare rider-to-Olaf offsets before and during travel; verify the visible contact stays attached and that jumping or walking off still detaches normally. No separate browser playthrough has been performed by this reviewer. Passing simulation tests alone are not final visual acceptance.

## Final ordinary-input visual/contact gate — accepted

Independently inspected `output/playwright/support57-boarded.png` and `output/playwright/support57-horizontal.png`. Erik remains visibly centered on Olaf's raised shield in both the initial boarded state and the horizontally moving upper circuit. Olaf's soles remain registered to the carrier deck, with no visible relative displacement or detached contact in the inspected pair.

The implementation agent reports this fresh run used ordinary keyboard boarding, shield raising, and restraint cutting without state injection. Across 527 horizontal frames the measured relative drift was at most 1.14e-13 world units; final carrier coordinates were (1494, 500), Olaf retained `cycle-carrier` support, Erik retained support `2`, both had HP3, and there were no page errors. The earlier unsuccessful driver timing run is not acceptance evidence. The browser measurements are reported evidence; this reviewer independently inspected the captures rather than running a separate browser playthrough.

**Support57 is accepted within its movement-fix scope. No remaining blocking finding.** Existing focused tests independently establish jump detachment and two-passenger/corner behavior; the browser pair establishes actual rendered contact during normal-input travel. No art assets changed, and the unfinished Vikings55 replacement remains outside this acceptance.
