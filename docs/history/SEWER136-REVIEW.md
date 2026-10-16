# Sewer136 independent review

Status: accepted after integrated v3 and dynamic evidence review; earlier pending/rejection notes below preserve the critique history. Reviewed `SEWER136.md`, `light.js`, `stream.js`, `stream-render.js`, globe state/art, app control/camera integration, actual captures and focused tests. No runtime edits or commits made. Unrelated archive/vikings55/pixel-art-fixer work is outside this review and remains untouched.

## Causality and controls

The design preserves the Creation Globe's identity and scale: a small object encountered in the alehall becomes a self-moving mechanism rather than changing into a large enemy. Impact, rebound, a real settled pause, a powered hop and leg deployment must be distinct readable events. Frame the globe ahead of the falling crew without cutting away their landings, especially in portrait. Input quarantine should prevent early route movement while ordinary physics and mechanism time continue; it must end reliably and never become a gameplay prerequisite. The globe's departure is atmospheric and must not consume inventory, alter the valve/refuge puzzle or require following it.

The water correction has a local physical explanation: pressure sends water left, gravity bends it onto floor760, and a correctly oriented shield redirects the intercepted portion back toward the source side. Preserve the incoming portion and show the downstream floor splash. Only the pressurized incoming stream causes knockback/wetting; reflected runoff being cosmetic is an intentional gameplay convention that keeps the protected path recoverable. Do not render it as another equally forceful horizontal attack.

## Code checked so far

Independently ran four firelight and five stream regressions: all nine passed. Mild intensity variation is bounded approximately .885-.995, wick movement is snapped to at most2world units per axis and beam slope stays within .018. Separate flame keys have independent phases. The rigid housing coordinates are distinct from the sampled flame origin. AI illumination and cone geometry use the same origin, intensity, slope and wall policy. Actual flame rendering and the darkness mask still require inspection after integration.

The shared jet starts at its registered mouth center, falls continuously and reaches floor760 with its underside. The shield test derives its forward plane and vertical span from Olaf's position and shared shield dimensions, rather than the former hardcoded x zone. Reversed, raised, elevated and remote shields retain the unblocked jet; relocated pipe geometry is tested. Rendering samples the same curved incoming/reflected paths used by wet/damage checks. No confirmed blocker found in these reviewed mechanics.

## Initial leg-parts source review

Inspected `assets/sewer136/leg-parts-source.png` (1774x887), native128x64 and6x review against the retained geometry guide and exact prompt. Source/native-density gate: accepted for these parts in isolation. Aesthetic gate: accepted for the deliberate bronze highlight bands, dark recessed joint centers and modeled iron undersides, which match the accepted alehall globe rather than introducing painted micrograin.

The32px cells contain upper/lower links, feet and joint caps with stable native pivots. Joint diameter approximately6native pixels and foot14x6 are substantial beside a20px ball. They are acceptable individual parts; the assembled six-leg silhouette is not approved by this result. Inspect all six hips/knees/ankles, fixed segment lengths, near/far identity, alternating contacts, folding and floor support. Reject merged feet reading as a single bar, only three visible legs, body resizing, sliding planted feet, disconnected pivots or using a clipped antenna/stray pixel as contact. Alpha cleanup may remove low-alpha generated wisps; zero hiddenRGB where alpha0 before judging apparent matte fringes.

The rejected whole-atlas attempt is not an approved animation source. Reusing the accepted globe body while generating native-density articulated parts is a sound correction, provided the final composition preserves the same glass rim, bronze base and tiny internal making mechanism.

### V2 parts supersede the first assembly

The art agent self-rejected the v1 assembled gold mass. The preceding isolated-parts acceptance is historical and does not approve v1 as final art. Inspected `leg-parts-v2-source.png` (1774x887), its exact prompt/guide and the replacement `leg-parts-native.png` (64x32;16px cells) plus native enlargement and `output/sewer136/globe-rig-proof.png`.

V2 source/native-density gate: accepted. V2 isolated aesthetic gate: accepted. Smaller4px joints,2px shafts and approximately7x5px feet preserve bronze highlights and recessed centers while reducing excessive mass relative to the unchanged20px globe. The six-pose assembly proof shows improved negative gaps and contact silhouettes. Source richness and density are both retained rather than hiding the v1 mass by shrinking the globe.

Assembled runtime acceptance remains pending. Crossings beneath the chassis make some complete leg identities ambiguous in the proof, so actual deployment and representative walking keys must establish the six-leg construction across the sequence. Natural far-leg occlusion is acceptable; all six full chains need not be visible in every frame. Verify measured generated joint centers and link lengths against component pivots, rather than assuming the prompt guide was preserved exactly. No definitive v2 source-density blocker found.

## Pending evidence and gates

Require actual1x/2x/coarse-mobile entry states: first impact, bounce, settled pause, powered hop, deployment contacts, running stance/swing and disappearance into unlit space. Compare original/native parts and assembled art at matching apparent size. Record the actual rendered six-leg count and supports, not merely `legCount:6` in state. Test reset and camera handoff after departure.

Inspect early/sustained fire variation and paused simulation, including wall contact and safe refuge; visible flame, moving wick, cone, mask and enemy sampling must agree without moving the lantern housing. Inspect curved unblocked spray, correct shield interception/reflection, reverse/overhead states, valve decay and floor impact. Complete ordinary60/120Hz and affected browser routes with all three alive after final integration. Report automated touch limits accurately.

**Overall source gate: pending final assembled globe. Overall runtime gate: pending. Overall aesthetic gate: pending scene comparisons. Cooperation/mechanics: provisionally acceptable within the reviewed scope; no publication approval yet.**

## Integrated v3 review

The final articulated correction bends fore/aft knees outward and darkens far components to .70 while retaining the measured native pivots and unchanged globe body. Independently ran all four `sewer136-*.test.js` files:17/17 pass, including fixed link lengths, airborne deployment, planted contacts and outward hinges. Reviewed actual `output/sewer136/entry-v3` unfold/six-feet at1x/2x and portrait, bounce2x, settle/darkness landscape, plus the refreshed six-pose rig proof. Latest imagegen90 sidecars resolve the expected Erik/Baleog and Olaf111 sheets.

Source/native gate: accepted for the v2 parts used by v3. Assembled aesthetic gate: accepted in the inspected runtime views. The negative arches now separate limbs from the glass chassis; near/far contrast gives a readable articulated creature rather than the earlier crossed gold mass. The six-chain construction is established across the deployment/gait keys; natural far-leg occlusion at side view is acceptable. No enlarged globe, detached joint, stretched shaft, matte fringe or unsupported resting sole was visible. Small overlapping limbs remain dense at1x, consistent with a small bronze mechanism rather than a reason to enlarge it.

The earliest fall key at.158s is nearly invisible outside real lamp reach. The later bounce key resolves the staging: the globe is already at the illuminated floor while all three Vikings remain airborne. Thus the first impact is perceptible without adding ambient fill. The settled ball, airborne powered unfolding and floor-supported walking pose are distinct. Portrait framing retains globe and crew; departure restores ordinary framing and `controlsResumed:true` is recorded with `errors:[]`.

Inspected actual curved unshielded spray2x and shielded1x/2x. Incoming water remains attached to the pipe mouth and is occluded at the front shield; runoff turns down/right onto the masonry floor with a local splash. It does not disappear wholesale or continue through Olaf. The unblocked stream's underside reaches the floor. Rendering retains native stepped pixels and the established subdued water palette. Shared geometry and the wrong-facing/raised/remote tests support consistent control consequences.

`output/sewer136/route-floor/evidence.json` records ordinary browser completion at63.4167s, allHP3, `errors:[]`, continuation4. This is completion evidence, independent of staged entry stills. Input quarantine is confined to the live globe sequence in the app; simulation continues and controls clear at handoff. No arbitrary task flag, inventory dependency or lasting camera lock was found.

Refreshed coarse-mobile `entry-mobile-v3` portrait six-feet and landscape unfolding retain the same grounded articulation and keep the crew/globe in frame. Its24 captures record `errors:[]` and `controlsResumed:true`. Independently reran the ordinary-input full route test at60/120Hz; both complete healthy. `output/sewer136/touch/touch.json` supplies targeted coarse-touch control/layout proof with no errors; this is not described as a complete manual mobile playthrough.

Final runtime gate remains pending dynamic fire evidence. Static paused screenshots establish spatial agreement, but cannot prove restrained temporal variation or paused simulation stability. No confirmed mechanical blocker remains in the code and evidence reviewed so far.

## Final motion evidence and verdicts

The final `output/sewer136/motion/motion.json` closes that gap:120 actual production browser samples span2.0917 simulation seconds, with intensity .9054-.9899, aim span .017997, fixed housing coordinates and wick offsets at most2world units per axis. Sample `paused` fields are the DOM string `"false"`. Inspected fire-early/mid/late screenshots: the scene remains readable with small local brightness/aim changes, rigid carried housing and no blanket ambient reveal. Fixed-world8x8 canvas luminance varies1.1790; this is supporting evidence only because the measurement also includes fog/composition. A400ms pause check leaves simulation time9.2333 and all lamp metadata identical.

The326-frame unpaused intro trace records fall, bounce, settle, hop, run and gone. At the first bounce all three Vikings are still airborne; powered-hop velocity and deployed running contacts support the distinct authored sequence seen in the actual keyframes. The unedited browser WebM is retained via `motion/video.json`; this review used actual scene keys and the frame trace, and does not claim a separate full-video playback inspection. Parent full-suite log `output/sewer136-tests.txt` confirms695/695 pass; the independent17 focused regressions and60/120Hz healthy route rerun are recorded above.

**Final source/native gate: accepted. Final runtime gate: accepted. Final aesthetic gate: accepted. Cooperation/causality/control gate: accepted. No remaining concrete blocker found within this change.** Approval applies to v2 generated parts with the v3 outward-hinge/near-far runtime assembly and unchanged accepted globe body, not the rejected whole atlas or heavy v1 assembly. Ordinary browser completion is desktop; coarse-mobile entry/camera/action checks are targeted evidence, not a complete manual mobile playthrough. Natural six-leg overlap in the side view is the remaining limited aesthetic caveat; it does not break the readable deployment or grounded gait.
