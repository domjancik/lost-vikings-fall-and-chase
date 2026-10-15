# Scrap Orbit: retain richness on the native grid

The previous carrier and gear replacements passed technical checks but lost the
modeled weight and material depth of the preferred generated designs. This pass
replaces those assets and extends the same treatment to the impact buttons,
sliding guards, magnetic coils, control panel and structural iron.

Original generations, prompts, native geometry guides and rejected candidates
remain in `assets/orbit121/`. Selected sources are plate v4, gear v4 and hardware
v2. `tools/art/orbit/prepare121.py` performs one uniform normalization from each
selected source. It excludes the clipped upper column cap and assembles the
complete lower cap at both ends by translation. The physical rail stays 344×48
world units; a documented single native row of lower bevel makes its visual
body 344×50. The walking rim and pivot are unchanged. Native contact/alpha checks
are in `tools/art/orbit/validate121.py`.

Buttons use a coherent generated housing, domed plunger with return spring and
two separate sliding guards. Native quantized translation animates opening,
impact, latched and resetting states. Existing release/disassembly physics,
collision, puzzle timing and camera behavior remain in place. The control panel,
coil windings and tiled recessed structural webs share the new material kit.
Detailed background architecture, crane and deliberately dim distant debris
retain their established art.

The review skill and visual standard now require a separate aesthetic verdict:
native-grid compliance cannot excuse flatter or less polished art. Version 2
publication records require accepted source, runtime and aesthetic gates plus
the latest complete `imagegen90` scene skin. Historical receipts stay unchanged.

`current` now resolves to the complete latest set: Erik and Baleog from vikings90,
Olaf from olaf111. All 35 general browser capture harnesses use the shared
`reviewNavigate` helper, which explicitly selects that skin, waits for readiness
and writes a receipt beside each full-scene screenshot. Intentional historical
character comparison harnesses retain their labeled skin comparisons. Earlier
selectable skins remain available.

Verification before publication:

- 566 package tests pass, including new gate rejection and complete-skin checks.
- Source and built browser smoke pass: three campaigns, 28 previews, movement,
  character switching, inventory, zoom, pause, restart and mobile; no errors.
- Ordinary-input production browser route wins at 104.37 simulated seconds with
  all three heroes at full health, 131 captures and no errors.
- Deliberate revolution timeout and retry also win at 135.68 seconds with full
  health, 151 captures and no errors; switch return and reactivation are captured.
- Coarse-touch pickup, item use, movement, switching and shield controls pass.
- Native alpha, deck/underside, gear margins and connected cap checks pass.
- Build/release byte verification passes for 437 declared files.

Independent visual verdicts and the final publication receipt are recorded
separately in ORBIT121-REVIEW.md and ORBIT121-PUBLICATION.md.
