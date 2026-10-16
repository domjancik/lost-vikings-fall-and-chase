# Scrap Orbit134 — carrier motion and crane operation

## Report and reproduced cause
User reported constant-speed kinetic animations and a stuck crane. Reproduced ordinary running entry into an open, unbraked crane panel at x1799, vx230: within40steps the operator left the76world operating radius; the hook moved only0.52world units before control was cancelled. A residual Erik bash or booted rail velocity could similarly carry the operator. This was a real simulation bug, not a remapping problem.

## Correction
On panel engagement and during operation, park body walking displacement/velocity, magnetic walking velocity and residual bash. Gravity, grounding, damage, active-character switching and distance validity still apply. USE leaves normally and walking resumes immediately. Hook controls retain acceleration and their existing bounds. Real touch checks cover ACTIONclamp, ALTrelease, horizontal/vertical steering and USEleave/re-engage.

Carrier lift, docking rotation/translation and final seating use smoothstep travel over their original nominal duration and exact endpoints. They accelerate from rest and brake to rest; peak speed is1.5times the old constant speed. Orbit drive ramps to the same steady angular rate over0.4s. Deadlines still depend on actual angular travel, not a new hidden timer. Renderer retains native-pixel snapping; there are no bitmap replacements.

## Verification
Six regressions cover running/bashing/magnetic operator capture and lift/dock/spin velocity profiles. Original five failed before the change. Full suite:664/664. Normal simulations:60Hz and120Hz full-health completion, existing debris injury and timed-switch reset tests retained. Maintained source/build browser smoke:30previews, controls/mobile, errors[]. Build/release:475explicitfiles verified; publish preflight476files.

Actual browser route on touch-capable Chromium completed102.892sim seconds, HP3/3/3,26captures, errors[]. At the crane, real taps and CDPtouch holds verified release/reclamp, right/up loaded movement, operator stationary, exit/re-engage. The rest of that route uses keyboard input. This is desktop browser touch emulation, not physical iOS hardware.

An initial desktop route reached the exit but failed its full-health expectation with HP2/3/3; that failed evidence is retained under output/orbit134/browser. The traced desktop rerun located the hit at84.425s: released debris1 was41.31world units from Erik’s body at the panel (hazard radius42). A first attempt to park him farther along the same landing also failed because the released trajectory varies with the clamp/seating timing. The route now returns Erik to the lower recovery floor immediately after crane operation, before the other two depart. This uses ordinary movement and gravity; hazards and collision remain unchanged. Final desktop browser route passed:101.925sim seconds, HP3/3/3,26captures, errors[]. The operator-recovery-floor milestone at80.5917s confirms ordinary descent before the final bow shot. Independent review: ORBIT134-REVIEW.md.

## Motion evidence
Browser-frame samples, not static screenshots alone, establish easing. Touch motion trace: first lift180samples, first/last decile mean speeds37.6/37.0vspeak180; docking203samples,39.4/44.9vspeak225world/s. Unit regressions check first/last individual steps below10world/s and exact arrival. All scene evidence uses imagegen90 (Erik/Baleog vikings90, Olaf olaf111) with per-file skin sidecars.

Retained evidence: assets/orbit134/. Full browser traces and initial failed run: output/orbit134/ (local development records). No new art files are shipped; release asset inputs remain unchanged.
