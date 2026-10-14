# Warden104 feedback review

Scope: traveling shockwave refraction/fade, Olaf's holding strain sweat, and
crew HUD strength/recovery/air meters visible for inactive heroes. No bitmap
sprite replacement is involved; Warden103's corrected contact registration
must remain in force.

Read current combat/refraction/strain-effects, resource HUD model/update code,
renderer integration and resource CSS. Shockwave lifetime remains 2.8 seconds;
the final 0.9 seconds smoothly reduces both particle and refracted-copy opacity.
Refraction keeps snapped 2-world-unit displacement instead of rounding a
diminishing amplitude abruptly to zero. Wave bounds expand only to a local
80×48 world region, with canvas copies rather than CPU pixel readback.

Sweat uses two-world-unit cool-toned pixels, simulation time, and gradual
drop count/alpha changes. It stops when the brace ends, guardian shuts down or
Olaf dies. The initial logical-body placement was corrected to the generated
skin forehead at hero.y−30; actual evidence is inspected below.
HUD resources are computed per hero, not selected hero; DOM paint is throttled
by quantized state keys. Strength/recovery and air have distinct labels and
numeric remaining seconds. Actual inventory/health/name spacing and mobile
visibility were inspected below. Initial desktop cards were too short; current
resource campaigns use 44px cards within the existing HUD container.

## Gates

- Source/native-density gate: **accept unchanged reviewed bitmap art and
  native-grid procedural effect construction**. No resampling/regeneration or
  asset scale change is introduced.
- Processed/in-game visual gate: **accept**.
- Publication: **allowed after final build/release checks**; no remaining
  visual or resource correctness blocker.

Required evidence: live traveling wave early/middle/late/expired, readable
forehead drops in early/late brace and disappearing on release, inactive Olaf
strength and all water-hero air values with no crew inventory/health overlap,
and retained performance/normal-input routes. Tests alone cannot approve these.

## Runtime evidence reviewed

Inspected fresh `output/warden104/route/brace-desktop-2x.png`,
`brace-mobile-2x.png`, `cap-full-desktop-1x.png`, and
`cap-middle-mobile-1x.png`. Forehead/temple drops stay tiny, cool toned and local;
late brace has more falling drops without halos or large world-space overlays.
Olaf's resource remains visible when Erik is selected; late brace shows 5s,
coherent with 9.68s spent of the 14s limit. The 2× cap camera omits Olaf, so it
was not used as sweat evidence. A nearest-neighbor late-brace head crop is saved
as `output/warden104/sweat-late-review.png` for placement inspection.

Inspected `air-desktop-mouse.png`, `air-mobile.png`, `air-portrait.png`, and
`strength-desktop-mouse.png`: crew meters fit below inventory rows and beside
health pips. Inactive submerged Erik retains AIR9s while active Baleog and Olaf
show AIR12s. Portrait and landscape keep all three timers visible; names,
inventory boxes and health do not overlap resource text. Crew cards stay inside
their existing overlay and gameplay canvas remains fullscreen.

Inspected `wave-0.25-2x.png`, `wave-2.5-2x.png`, and `wave-2.72-1x.png`:
traveling distortion is local to the visible low shockwave, stronger early,
faint near expiration, with native-grid floor/contact readability preserved.
Recorded opacity changes 1 → .988 → .247 → .0197 at ages .25/1.95/2.5/2.72;
refracted strips remain active through the late phase rather than rounding away.
The 2.8s physical expiry and first-contact blocking are unchanged.

Read feedback browser evidence: 14 captures, empty browser errors and no meter/
bag overlap assertions. Active-wave CPU6 proxy medians are 9.6ms at 1× and
7.7ms at 2×, p95 11.8/10.1ms (101/115 samples), preserving optimized performance.
Normal-input boss route reports victory, HP[3,3,3] and no browser errors.

## Paint-cache correction

Found one minor correctness issue independently: rounding the paint key to
0.1 seconds can leave the ceil-based visible counter at 14s while the internal
value has crossed to just below 13.0s. Include displayed integer seconds in
the cache key and test 13.01→12.99; this affects water/recovery too. No additional
full encounter capture is needed for that localized DOM-cache fix. Final
publication confirmation waited its regression test.

**Resolved:** `resourcePaintKey` includes the displayed `Math.ceil(remaining)`
value. Independently ran all four `warden-feedback104.test.js` checks, including
the integer-boundary regression: passed. Inspected
`output/warden104/timer-boundary.json`: actual built production DOM updates for
strength, recovery and air each change 2s→1s at 1.01s→.99s on a cloned crew card.
This verifies the former stale display across all affected resource kinds.
Implementation agent reports final full suite 453/453 passing.

## Retained evidence

Review evidence is retained under
[assets/warden104/evidence](../../assets/warden104/evidence/): actual crew/air/
strength captures, wave age 1×/2× images, early/late brace captures,
normal-input route, feedback/performance JSON and
[built timer-boundary results](../../assets/warden104/evidence/timer-boundary.json).
The late-brace nearest crop aids forehead placement review but full production
captures remain authoritative. Final source/native-grid and processed/in-game
verdicts are separately **accepted**. Performance is a desktop Chrome CPU6
proxy, not certification of every physical mobile GPU.
