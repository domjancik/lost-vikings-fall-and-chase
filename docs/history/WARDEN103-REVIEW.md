# Warden 103 independent contact correction review

The prior Warden102 contact acceptance missed opaque fork pixels extending
below the declared floor. It accepted the visual impression without measuring
the actual near/far bottom row. That verdict was incorrect for those contacts.
This review replaces the grounding portion with explicit component measurement
and actual floor-plane evidence.

## Source and registration inspection

Read `tools/art/warden/prepare-warden102.py`, current registration metadata,
`src/levels/warden/render.js` and `src/levels/warden/campaign.js`. The source and
native artwork remain the reviewed V3/retained contact components; this change
adjusts registration, not art density or character scale.

Near fork opaque material reaches row 42 inclusive, therefore its exclusive
bottom anchor is 43. Far fork reaches row 41 inclusive, exclusive bottom 42.
The previous common anchor 39 placed near/far bottoms 8/6 world units below the
physical floor at two world units per native pixel. The preparer now derives
each broad opaque bottom separately and fails if none exists. Renderer uses
those explicit anchors; visible ankle offsets are computed from each sole to
the existing ankle pivot. The visual skeleton retains rigid articulated
segments while physical collision geometry remains unchanged.

## Final contact evidence

Require exact first opaque terrain row and sprite bottom-exclusive agreement,
not a bright floor highlight or logical sole coordinate. Inspect normal-input
route at 1×/2×/mobile, each near/far foot and braced/disabled positions. Inspect
ankle-to-fork continuity as well as bottom contact. Existing Warden102 route or
gate cannot substitute for corrected captures.

- Source/native-density gate: **accept unchanged reviewed art**. No regeneration
  or destructive processing is proposed; V3 source review remains valid.
- Processed/in-game registration/contact gate: **accept**.
- Publication: **allowed after final release checks**.

Directly inspected `output/warden103/route/initial-1x.png`,
`initial-2x.png`, `brace-desktop-1x.png`, `brace-desktop-2x.png`,
`brace-mobile-2x.png`, `brace-portrait-2x.png`,
`disabled-lens-desktop-1x.png`, `disabled-lens-desktop-2x.png`,
`disabled-lens-mobile-2x.png`, `boarded-1x.png`,
`boarded-mobile-1x.png`, and `boarded-mobile-2x.png`.
Near/far forks end above the physical terrain plane instead of burying their
lower material rows. There is no exposed background strip between their black
material contour and the terrain's first structural strip. Ankle housings,
joint caps and pistons remain connected through the braced and released poses.
The held fork still meets Olaf's raised shield, with no change to shield scale.

Nearest-neighbor contact-only review crops were saved under the same route
directory: `initial-1x-review-contact.png`, `brace-desktop-2x-review-contact.png`
and `boarded-1x-review-contact.png`. These make the first terrain strip and
bottom contour distinguishable; they do not replace the full gameplay evidence.

The image named `shutdown-complete.png` is actually a late intermediate state:
route data gives shutdown .9056 and active footY 935.424, so the visible gap to
the floor is expected. It was not accepted as final-rest evidence. The boarded
captures instead give shutdown 1 and footY 940, and visibly prove final contact.

Independently ran `tests/unit/warden-contact103.py`: passed. It measures shipped
PNG alpha rather than trusting sole metadata, verifies exclusive near/far
bottoms 43/42, checks every material pixel stays at or above the support at
native world scale 2 and doubled scale 4, and requires a broad last material row.
Inspected the JS geometry check preserving translated pivot continuity and
148-unit articulated segment lengths.

Read route JSON directly: victory true, HP [3,3,3], simulated time 98.8333 s,
browser errors empty. Final source and runtime verdicts are separate and accepted.

Also inspected repeated normal-route `shutdown-settled-desktop-1x.png`,
`shutdown-settled-desktop-2x.png`, and `shutdown-settled-mobile-2x.png` after an
explicit wait for shutdown 1 and footY 940. The 1× bay view confirms the previously
held fork now sits on the floor, without sinking or a remaining air gap. The 2×
views keep character/optic state readable but crop some lower feet; full-floor
coverage still comes from the 1× bay and boarded/mobile captures above.

Permanent evidence is retained under
[assets/warden103/evidence](../../assets/warden103/evidence/), including
[independent source contact measurements](../../assets/warden103/evidence/contact-measurements.json),
[browser route](../../assets/warden103/evidence/browser-route.json),
[initial near/far contact crop](../../assets/warden103/evidence/initial-1x-review-contact.png),
[braced 2× contact crop](../../assets/warden103/evidence/brace-desktop-2x-review-contact.png)
and [settled near/far contact crop](../../assets/warden103/evidence/boarded-1x-review-contact.png).
Source and runtime gates are both accepted; no remaining contact publication
blocker.
