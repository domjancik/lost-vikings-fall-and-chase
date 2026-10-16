# Persistent Drowned Regulator foliage

The flora atlas rows are different authored plants, not interchangeable
animation frames. The renderer swapped rows at phases5→6 and11→0, every two
seconds, changing leaves and root pixels. The native before proof measures
294→303 opaque pixels at the swap; the regression test reproduced the changing
source identity before implementation.

Each placed plant now retains one source cell. Both atlas rows remain as fixed
environment variants. Twelve quantized bend phases move the existing native
rows without altering their material, dimensions or roots. Water recession
gradually reduces sway strength instead of abruptly resetting the pose. The
original flora atlas, two-world-unit pixel density and all gameplay are unchanged.

Verification:721 tests pass. Native browser proof retains294 leaf pixels and
unchanged roots across all12 phases. A platform plant retains303 pixels through
six receding-water states. Actual desktop and coarse-touch gameplay each record
eight zoom-asserted1x/2x views across the former5→6 and11→0 boundaries, with
paused-time checks, all Vikings at full health and no browser errors. The
independent review is recorded in WATER142-REVIEW.md.
