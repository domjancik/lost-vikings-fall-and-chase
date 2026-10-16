# Orbit134 independent mechanics and motion review

Scope: `src/levels/orbit/campaign.js`, magnetic attachment integration, `tests/unit/orbit134.test.js`, and actual browser evidence in `output/orbit134/browser/`. Applied cooperative-world-design and the visual review gate. No runtime edits made.

## Findings

The crane correction addresses the reproduced cause: USE now clears walking displacement, body velocity, local magnetic velocity and residual bash both on engagement and on subsequent control steps. Hook direction input no longer carries the operator out of interaction range. It does not pin world position or cancel vertical physics. Existing switch, damage and distance cancellation remain active.

Independently reran all six new regressions: passed, including a booted operator whose magnetic rail coordinate remains fixed. Additional inline probes passed for active-hero switching followed by ordinary walking, damage cancelling operation, and gravity advancing an engaged hero above the platform. USE release and subsequent walking are covered by the focused regression. No confirmed attachment or control regression found.

Carrier lift, docking translation/rotation and receiver seating use continuous smoothstep travel with the same target and nominal duration. This changes the velocity profile: zero endpoint speed and a peak 1.5 times the former linear speed. Initial orbit rotation ramps to the existing steady rate over 0.4 seconds. Track targets are stable in the authored one-way phases; no target-reset jump was found. Passenger placement still derives from current carrier geometry and magnetic rail position. The interpolation is a mechanical easing improvement, not a physics simulation of inertia or cable swing.

## Visible evidence

Inspected initial browser `captures/crane-gripped-2x.png`, `crane-lifting-2x.png`, `crane-lifting-landscape.png`, and `receiving-dock-{1x,2x,portrait}.png`; also inspected successful touch-route `captures/crane-gripped-landscape.png`, `crane-lifting-portrait.png` and `crew-departure-1x.png`. Hook cable, clamp eye, carrier and riders remain visibly connected; soles follow the carrier and retained native artwork keeps its material depth.

Independently sampled actual browser `output/orbit134/touch/motion.json`: first-carrier lift speed rises from about 6 to 180 world units/s and returns to about 6 in the last observed samples. Dock translation peaks near 225 and finishes near 4.6. These frame traces substantiate easing in the running browser, rather than inferring motion from stills. The companion motion summary contains 180 lift and 203 translation samples.

`output/orbit134/touch/route.json` records `won: true`, HP `[3,3,3]`, 102.8917 seconds, 26 captures, `coarse: true` and no browser errors. `touch-crane.json` plus the harness assertions cover actual touch release/reclamp, right/up hook movement and USE leave/reengage. Operator x remains 1730.2035 while hook x moves from 2540 to 2600.9167; attempts increase from 2 to 3 and the carrier remains attached after reclamping. This independently resolves the mobile control/completion evidence.

No source bitmap was changed. Existing source/aesthetic approvals are retained rather than replaced by a new asset approval. The reviewed runtime placements introduce no visible art-density regression.

## Failed attempts and corrected desktop verification

The initial `output/orbit134/browser/failure.json` and subsequent `desktop/failure.json` record a failed full-route HP assertion: expected `[3,3,3]`, actual `[2,3,3]`; the game reached `won: true` and browser errors were empty. The implementing agent traced a hit at 84.425 seconds to released debris passing the parked Erik: reported positions give body-distance 41.31 against the unchanged 42-unit hazard radius. Moving him to x1845 at crew reunion is a sensible ordinary-control recovery position, with 103.66-unit separation at those same debris coordinates.

The resulting `output/orbit134/desktop-safe/failure.json` again records HP `[2,3,3]`, `won: true`, simulation time 103.0333 and no browser errors. The x1845 attempt therefore did not resolve the failed route and is retained as a failed driver attempt, not accepted evidence.

The final ordinary-control route instead leaves the controls, walks Erik to x1960 and waits for his descent onto the existing lower recovery floor before the exit bow shot. This changes the driver route, not damage rules, hazards or character immunity. Independently inspected `output/orbit134/desktop-final/route.json`: `won: true`, HP `[3,3,3]`, 101.9250 seconds, 26 captures, `coarse: false`, errors `[]`. Its `operator-recovery-floor` milestone at 80.5917 seconds records Erik x1958.2816, y1136, ground true, HP3; his feet meet floor1180. Final `captures/crane-lifting-2x.png` and `crew-departure-1x.png` retain the reviewed mechanical connections and show the reunited living crew. Capture receipts report ready imagegen90 assets.

Durable successful mobile evidence is retained at `assets/orbit134/touch-route.json` and `touch-touch-crane.json`, with motion summary `touch-motion-summary.json`; the full browser frame trace remains in `output/orbit134/touch/motion.json`. The mobile result is still HP `[3,3,3]`, coarse true, errors `[]`, 102.8917 seconds. These successful receipts supersede the failed driver attempts for completion acceptance without rewriting their history.

**Mechanics/code and actual browser easing: accepted. Coarse-touch runtime/control gate: accepted. Desktop runtime completion gate: accepted. Source/aesthetic: unchanged prior approvals; visible placement checks accepted within the scope above. No remaining mechanics or runtime publication blocker found for this change.**
