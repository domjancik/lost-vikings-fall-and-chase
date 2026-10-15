# Water115 corrective review

The previous atlas matched cell dimensions but not character mass. Corrected
generated poses use64-native authoring cells (the selected retained originals
normalized uniformly to256x128), registered whole into80x80 runtime cells.
World density remains2 units/native pixel and renderer magnification is unchanged.
Helmet target52,48; actor core remains around40,58; physical floor plane70.
Compare against unchanged generated standing Erik:510 opaque native pixels.
Target swim occupied area is comparable across all8 keys, not a larger body
hidden inside an identically sized atlas cell.

The original procedural skin has its own smaller silhouette:407 opaque native
pixels in its actual native renderer. Author its swim rectangles at75% guide
coordinates around40,58, rounded to integer native clusters. Expected351..433
opaque pixels. Do not apply a fractional draw-time canvas transform.

Preserve selected complete source poses and near/far arm ownership. User accepts
the existing swim style; evaluate smaller hands, horns, beard and outlines before
regenerating anything. Reject lost identities or broken connected limbs.

Stroke phase is driven by deliberate swimming travel along input intent. No
elapsed-time stroke at rest, while another Viking is selected, under passive
drift or while blocked by solid ground. Release freezes the current key; movement
resumes continuously from it. Other skins retain their falling fallback.

Mandatory review now includes unchanged standing versus swimming in the same
native-render comparison and actual water-entry/pocket transitions at1x/2x/mobile.
Explicitly inspect body mass, helmet size, arm depth/hand ownership, loop keys,
release/inactive/blocked freeze and resume. Retain both visual verdicts before
publication; dimensions and alpha counts supplement actual visual assessment.
## Additional water corrections in this release

AIR meters above actors and in the picker are visible only when that actor is
actually submerged; surface breathing, dry docks and dry bell interiors hide them.
This applies independently to inactive crew members.

Entering water carries downward jump/fall momentum into swimming drag instead of
replacing it with stale zero swim velocity. A returning breach clears on downward
surface crossing. Deliberate descent works immediately without another jump.

Health pips and selection feedback are composed after water and Warden optical
passes, so the sampled scene does not contain HUD feedback. Existing rotation
anchors remain unchanged.

Evidence: supplemental actual keyboard jump and1x/2x water captures, complete
normal-control healthy water route, and focused entry/swim tests. Both independent
source and runtime gates accepted in WATER115-REVIEW.md.
