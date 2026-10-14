# The Fourfold Warden — level proposal

Status: visual brainstorming and puzzle design; not implemented or published.

Built-in imagegen study: assets/warden86/concept-raw.png, retained unchanged.
Exact prompt: FOURFOLD-WARDEN-IMAGE-PROMPT.txt. The board establishes the four-leg
silhouette, shield brace, visible back plunger and gondola reward. It is not
accepted runtime sprite source: fine painted detail does not match our native
density. The main view depicts an open eye for readability; gameplay must start
with closed shutters. The illustrated cage/exit rail relationship also needs
one coherent supported lift track rather than the board's separate viewpoints.

A four-legged guardian straddles an archive's cargo-lift bay. Its protected
optical eye directs the machine. An empty maintenance gondola is locked under
its belly, visibly attached to the lift rails leading to the upper exit. Adult
maintenance doors and railings establish Viking scale around the giant machine.

## Cooperation and physical cause

1. **Olaf braces a step.** The guardian shifts weight, raises a front foot and
   clearly telegraphs the coming impact. Olaf walks beneath that foot and raises
   his normal shield. The forked ankle catches its edge; a sprung knee yields
   sideways and the guardian settles into a three-foot-supported kneel. Olaf
   remains visibly holding the bent leg. This depends on actual foot/shield
   contact and facing, not a designated interaction point or distant shield flag.
   He cannot lift the whole animal; the joint's instability explains the effect.
2. **Erik trips the shutter mechanism.** Lowering the back makes a maintenance
   foothold reachable from the approach walkway. Erik jumps aboard, then runs
   into a heavy spring-loaded impact plunger with his shoulder bash. It travels
   along its guide and physically pulls the short linkage opening the eye's
   shutters. This is pressing a stout mechanism, not deciding that a random metal
   box can only be destroyed by Erik. Sword scratches leave that reinforced
   plate intact. Access and the required impact explain the role; no hero-ID lock.
3. **Baleog shoots the exposed lens.** He waits on the opposite service ledge.
   The eye remains visibly open for approximately eight seconds, enough to
   switch heroes, aim and fire. Closed shutters physically stop arrows. Hitting
   the exposed glass interrupts the guardian; it lowers into a stable kneel,
   powers down and its fail-safe cargo restraints release. It remains terrain.
4. **The reward is the exit route.** The freed gondola deploys onto its existing
   rail guides. All three board and use its handwheel to ride to the upper exit.
   The lift can be recalled from either landing, so nobody can be abandoned.
   No invisible key, teleport or detached reward flag replaces the physical lift.

## Recoverability and animation

Olaf can hold the braced pose while another Viking is selected. Eye closure
does not throw Erik off or reset the whole puzzle: he can operate the plunger
again from a safe back platform. If Olaf walks away, the leg unloads and rights
itself gradually; the spine route tilts continuously, and Erik has a supported
retreat. Once disabled, the guardian stays disabled. Misplaced arrows strike
armor without cancelling established progress. The final kneel must provide
Olaf a visible escape clearance rather than crushing him during victory.

Foot lift, impact, knee compression, torso tilt, plunger travel, shutter opening,
lens fracture, shutdown and gondola release are separate continuous animations.
No actor or mechanism teleports between stages. Supporting colliders follow the
same articulated geometry as the art. Exactly four legs remain identifiable;
near/far shading separates them without translucent duplicate limbs. Indicated
times and dimensions are provisional until measured against actual movement.

## Required implementation review

Before production, apply native-sprite-art, HUMAN-SCALE and VISUAL-REVIEW-GATE.
Concept art is composition evidence only and must not be downsampled into
runtime sprites. Choose native density from actual intended world dimensions.
Record separate raw-source and processed/in-game1x/2x/mobile verdicts.

Critique must inspect four grounded feet, joint load paths, safe Olaf clearance,
the reachable-before/after jump difference, physical eye shutter occlusion,
plunger-to-shutter linkage, recoverable missed timing and the gondola's actual
rail/landing registration. Test shields away from the foot, wrong-side impacts,
closed/open eye shots, actor carriage on the tilting back, inactive Olaf holding,
moving support collision, restart and lift recall. Complete a normal-input route
with all three heroes and inspect each intermediate state at both zooms.
