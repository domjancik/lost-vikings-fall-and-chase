# Saved Viking skins73 and shield layering review

Scope: selector between approved70locomotion/63actions and approved63allposes,
plus front shield face painting after the body. No new74art or unrelated skin/
puzzle work is accepted here. Sources are unchanged; prior source/native gates
remain the applicable source evidence. Actual runtime gate is separate.

Independently read hero-skins.js, hero-frames.js, hero-art.js, sprite-render.js
and game.js. Storage normalization/failure fallback and explicit previous-sheet
routing are coherent; global selected skin also covers direct inset drawing.
Shield retains its authored fixed dimensions/transform and now covers its grip
instead of allowing palm/body pixels over the opaque face. A rear-climb/back
shield and raised-shield passenger still require actual visual inspection.

Independently ran hero-skins, hero-shield-occlusion, hero-frames and
hero-locomotion tests:12passed,0failed. This is not full browser verification.

## Initial integration blocker

The selector onchange handler saves and sets the skin but does not repaint HUD
portraits. paintPortraits runs only once after loading. Changing the setting
therefore leaves old portraits until reload. Repaint them immediately and verify
the actual canvas pixels before/after selection. The code claim of consistent
gameplay/HUD/inset routing is not accepted while this integration gap remains.

**RAW/source gate: prior approved assets unchanged; no new source generated.**
**PROCESSED/actual selector and contact gate: PENDING corrected integration and
actual1x/2x/mobile, persistence and shield/climb/mirror evidence.** Both74source
candidates remain rejected independently in VIKINGS74-REVIEW.md.

## Final changed-scope verdict (2026-10-12)

**Portrait integration blocker: RESOLVED.** The isolatedrelease onchange handler
now calls paintPortraits when heroesReady after saving/setting the skin. The
implementer's actual browser check first reproduced unchanged portrait pixels,
then passed portraitsChange and reload persistence after correction. This is
stronger evidence than merely testing storage helpers.

**PROCESSED/actual73selector and front shield layering: ACCEPTED.** Inspected
fresh skins73-menu-current and menu-previous, current-front-2x/current-left-2x,
current-overhead-mobile, previous-front-1x and previous-overhead-2x. The44px dark
select is readable and fits the existing settings dialog. The two options visibly
select their distinct existing poses, and mirrored front shields cover the
gripping hand instead of exposing palm pixels across the face. The overhead
plate retains its fixed shape/position with hands underneath; feet remain on the
deck. No newly introduced shield contact/layering blocker is apparent.

Climb-specific painting remains as before: its shield was already painted after
the body, and the existing raised-climb transform is unchanged. This review does
not claim fresh climb own-pixel evidence from this packet or reapprove all prior
locomotion anatomy. The current63/70 assets retain the known gait, idle, look and
splice limitations recorded for the outstanding74guide rework. A selectable
previous skin is not a fix for those limitations.

**RAW/source gate: unchanged approved63/70art reused; no new73source.**
**Final limited73release verdict: ACCEPTED; no remaining material blocker.**
The independent12focused tests passed; implementer reports333root tests and
ordinary selector/persistence checks with zero page errors. The reviewer inspected
actual captures/code and did not run a separate browser route. Both74generated
Erik candidates and the incomplete74rework remain REJECTED/UNACCEPTED and must
not be published under this verdict. No unrelated runtime/art is accepted.
