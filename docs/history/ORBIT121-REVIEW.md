# Orbit121 art richness: independent inventory and brief

Reviewer: orbit110_review. Initial inventory/critique only; no runtime/art implementation edits. Applied native-sprite-art, grounded-parallax and visual review requirements. Latest user direction adds an independent aesthetic gate: native correctness is necessary, but simplification that loses the intended volume/material character is not acceptable.

**Final reviewVersion2 verdict: source, runtime, aesthetic and cooperation gates ACCEPTED. All reviewed general scene captures use imagegen90 for all three Vikings.** Initial rejections/pending conditions below are historical; final closure records their resolution. No runtime/art implementation edits by this reviewer.

## Diagnosis and references

Inspected preferred `assets/orbit113/gear-raw-v1.png` and `assets/orbit120/plate-raw-v1.png`/`plate-raw-v3.png` against shipped `gear-native.png`, `plate-native-4x.png` and120 production captures. The preferred originals have weighted metal bevels, layered rim thickness, dark cavities, substantial rivets and varied worked/worn metal. Some source accents were below target density, but that did not require discarding the larger modeling and material qualities.

The shipped gear reads as a clean outlined wheel with long uniform blue bands; its hub and spokes have little thickness. The120 carrier solved density/registration but reduced the reference to a shallow diagram of rectangles, cyan cells and a flat brown strip. Those are aesthetic regressions despite technically clean grids. Earlier120 native approval did not separately enforce this richness requirement.121 must preserve the modeled form while expressing its details in intentional native clusters, rather than using further simplification as the default correction.

Do not blindly reinstate fine source speckle or downsample painterly art. Rebuild the same strong volumes at the actual intended size. Do not impose16/24 colors, two/three flat planes or a rigid per-material shade count. Use enough related shadow, midtone, reflected light and edge colors to make the object tangible; each meaningful mark must occupy deliberate native pixels.

## Replacement inventory, in priority order

| Asset | Fixed target and anchors | Required richness and states |
|---|---|---|
| Carrier and matching roof rail |192×96 native canvas; opaque body172×24 native ->344×48 world; pivot96,48; existing flat rim and elliptical end contacts | Preserve hefty rim thickness, recessed coil channels, copper winding/fasteners and a dimensional center bearing. Upper-left light with darker lower/side faces; rivets must read as raised metal, not bright square stickers. Coil activity animates authored recessed chunks. No flat cyan rectangle repaint. |
| Large background gear |256×256 native ->512×512 world; pivot128,128; existing16 teeth/pitch114native and contacts | Heavy toothed rim and spokes with visible bevel/sidewall thickness, layered hub/bearing and raised bolts. Controlled rust/wear clusters around joints and stress points. Preserve originalv1's mass and warm iron/brass character; eliminate only below-grid stipple, not its relief. Check actual runtime brightness/parallax so shading survives depth treatment. |
| Complete spring-switch/shutter/button kit |64×64 native per state ->128×128 world; unchanged target center/housing/visible hit face and cable ports | Generate one coherent machine, not an unrelated gear pasted into a shutter. Recessed strike face, surrounding guard thickness, visible return springs/rods and bolted housing. Closed/open/intermediate/pressed/latched/reset/disassembly parts must belong to the same construction. Press depth and spring travel must read beyond a mere color toggle. Preserve causal switch/rope differences. |
| Magnetic coils and end mounts |Current64×64 native/128×128 world housing and existing mounting ports; preserve visible attachment to posts | Replace reused hollow fan-ring appearance with wound copper, nested iron pole pieces, ceramic insulation and bolted sockets. Give the bore real shadow and frame thickness; field lighting comes from believable internal surfaces. Left/right orientation and dormant/charging/powered states retain the same physical size. |
| Structural iron kit: piers/beams, tray, brake shoes, push handle |Preserve current crop footprints/contact planes: typical cap20×9 native, shaft14×24 native, foot20×8 native; receiver tray top348world/support376world | Existing long flat blue strips need a modeled I-beam/recessed web, side shadow, bolted joints and restrained native wear. Design coherent caps, shaft/infill, corners and guide lips, rather than stretching a painted column. Tray remains open receiving space, brake shoes have physical gripping faces, push handle remains a solid reachable part. All contact/cable endpoints survive. |

The large gear, carrier and switch kit are mandatory replacements. Structural/coil pieces should be refreshed wherever their broad uniform faces visibly undercut those replacements; do not stop with an ornate moving carrier pasted onto placeholder mounts.

## Retain deliberately quieter work

Keep119 tiny dim floating scraps/far silhouettes: their reduced contrast/shape is intentional depth and hazard separation, not an invitation to restore bright foreground copies. Keep rich far/middle architectural layers, room walls and native tiled terrain unless a concrete clash appears. Current crane claw, cables and ladder have more useful modeled material than the flat replacements; retain their registration and only adjust matching material if needed. Do not repaint entire levels to satisfy a superficial asset-count target.

## Review protocol for replacements

1. Review raw source at its stated native footprint and same apparent size as preferred reference. Assess mass, bevel depth, cavities, fasteners, coherent lighting and material variation separately from grid correctness. A source can pass density and fail aesthetics.
2. Review processed native art against the original: meaningful richness must survive. Reject simplified redraws, flattened palettes, missing relief, over-clean vector-like bands and lost silhouettes, even if alpha/dimensions pass. Reject speckle/undersized detail too; richer means better clustered modeling, not more noise.
3. Review complete animation/state sets and connection/contact extremes. Physics, footprint and puzzle rules stay unchanged. No new halos, empty-alpha contacts or artificially resized equipment.
4. Use **latest imagegen90 for Erik, Baleog and Olaf in every121 review/gameplay capture**. Verify all three `skin` receipts equal`imagegen90`; procedural/current fallbacks cannot establish visual harmony. Include actual1x/2x/portrait/landscape and live unobscured contacts.
5. Evaluate in the actual scene: detailed foreground hardware must still dominate quiet distant fragments; background gears remain behind architecture; opaque native shading stays crisp at both camera axes/zooms. Adult Viking scale and all grounding rules remain mandatory.

## Initial gate verdicts

Current shipped flattened carrier/gear fail the new **aesthetic gate**. New121 source, runtime and aesthetic verdicts remain pending replacements. Record exact accepted verdicts only after independent raw/native plus real latest-skin gameplay inspection. No121 publication approval at this inventory stage.

## Generated v1 candidates — aesthetic direction correct, source density rejected

Inspected original plate `exec-c793c0bd-15c8-4a0c-b30b-18cdb4581900.png` and gear `exec-c8edb9fa-d3ac-408c-ac29-735f9896b080.png` from the retained generated-image directory, alongside exactv1 prompts. Reread updated native-sprite-art artistic fidelity gate and latest-skin requirement.

The plate restores the right broad qualities: rounded weighted brass rim, dark recessed channels, raised rivets and layered bearing/copper hardware. However, meaningful tiny bolt bevels, cyan checker segments and wear are again below one pixel at the intended172×24-native body. **Production source rejected for density**, not for its modeling/material ambition.

The gear retains magnificent rim/spoke mass, thick sidewalls, layered hub and raised fasteners. Its dense rust/grain still uses numerous2–4-source-pixel flecks while the256-native presentation requires roughly5-source-pixel logical cells. That microtexture is not authored at the intended native grid. **Production source rejected for density**; do not discard its relief as the solution.

Aesthetic concept direction is accepted for both, but neither is approved runtime art. Use true-native construction guides that retain modeled shadow planes, raised hardware, broad multi-step bevels, layered cavities and material variation; have imagegen render those intentional native clusters. Remove or consolidate only subnative noise. Do not answer the density rejection by reverting to flat bands, arbitrary small palettes or missing rivets. Source/native, processed/runtime and aesthetic gates remain pending accepted replacements.

## Visibly reauthored platev3/gearv3/hardwarev2

Inspected retained raw sources `plate-raw-v3.png` (`exec-667a9e72-e89f-48a6-a57a-1adc95553e19.png`), `gear-raw-v3.png` (`exec-add494eb-4901-433d-b44a-2e66a49a53c0.png`) and `hardware-raw-v2.png` (`exec-217e0723-a45e-4b61-9092-394ef561891f.png`). These are imagegen reauthorings, not CPU grid-rescue processing. Their broad relief clusters are now materially closer to intended native construction while preserving the desired modeled qualities.

- **Platev3 density/aesthetic direction accepted**, physical source geometry not yet approved: warm weighted rims, raised round rivets, dark coil recesses and layered bearing remain. Measured material1608×250 has ratio6.432 rather than target172/24=7.167; uniform normalization cannot fit the fixed rail body. Regenerate the silhouette about10% slimmer while retaining this shading, rather than stretching axes or flattening it.
- **Gearv3 density/aesthetic direction accepted**, complete-source gate pending clipping correction. Larger clustered rust, thick dark sidewalls, layered hub and raised bolts retain mass without the earlier fine stipple. However, real opaque tooth material reaches all canvas boundaries: top tooth includes opaque pixels atx593 onward on row0; left tooth includes opaque pixels aty595 onward on column0. This is clipped material, not merely exterior alpha noise. Regenerate/outpaint full teeth with deliberate transparent margin; padding an already clipped source cannot restore missing edges.
- **Hardwarev2 main cells accepted for density/aesthetic direction**: modeled rim, deep frame cavity, domed plunger/spring, bronze shutters, copper coil, recessed panel, open U-tray and thick brake assembly form a coherent detailed kit. Cell3's upper column cap begins at canvas row0 and appears clipped; correct or exclude that cap rather than claiming a complete approved set. Keep the accepted modeling of the other cells. Processed64-native states/contacts remain subject to review.

No overall source/publication approval yet: geometry/clipping corrections are concrete asset conditions, not reasons to simplify the art. Preserve this iteration's richer relief while correcting them.

## Selected complete sources and explicit plate geometry

Reinspected `gear-raw-v4.png`: **source accepted**. All cardinal teeth have complete caps/sidewall shadow and real transparent margins; the source retains the accepted heavy rim, layered hub, domed bolts and controlled clustered wear. Whole-canvas uniform normalization to256×256 native preserves this framing; do not crop away the margins to enlarge the gear.

Reinspected `plate-raw-v4.png` andv5. V4 retains richness with a1595×232 material footprint;v5 overshoots to an overly thin silhouette. **Selectv4 for uniform normalization to172×25 native**, without axis stretch. Register upper walking rim36 and pivot96,48 on192×96 canvas. Explicit contract: visual body344×50world, existing physical rail344×48world, with one lower decorative bevel row extending past the collider. This is an intentional small visual overhang, not a claim that opaque material exactly matches the24-row collider, and not grid rescue.

That one-native-pixel bevel is permitted for preparation; it does **not** preapprove runtime contact. Final actual1x/2x/mobile must show underside magnetic soles do not visibly float or bury in the bevel, and seated tray contact remains coherent. Reject/correct visible contact damage if it appears. Preserve this exception in registration/tests and final gate rationale rather than silently reporting172×24 alpha.

Hardwarev2 source is accepted **excluding its clipped upper column cap**. Construct that cap from the intact lower cap by translation only, retaining original lighting, native scale and contact edges. The other accepted frame/plunger/shutter/coil/panel/tray/brake cells retain their modeled material; native composed states still require inspection.

Overall selected source gate is now **ACCEPTED** with those explicit selections/exclusions/geometry. Processed/runtime and aesthetic gates remain pending actual native art and latest-imagegen90 scene comparisons. No publication approval yet.

## Final processed-native and aesthetic review

Independently inspected `comparison.png`, `hardware-native-4x.png`, `switch-states.png`, selected raw sources and `registration.json`. Same-apparent-size comparison establishes a real improvement over the shipped120 flat carrier/113 outlined gear. The replacement preserves rounded raised rivets, weighted bronze/steel bevels, shadowed coil channels, copper bearing hardware, thick gear sidewalls, layered hub and clustered wear. This richness survives native processing rather than existing only in a large source preview. The gear's runtime brightness.78 retains relief while architectural occlusion keeps its depth role. Complete tooth margins remain intact. The redesigned switch has one coherent modeled housing/cartridge/shutter/return-spring machine through open, intermediate, depressed/latched and reset poses; it is no longer a flat pasted gear/button.

Plate native body is explicitly172×25 with alpha[10,36,182,61], pivot96,48; physical344×48 and visual344×50 are preserved in registration. Gear is256square with alpha[9,8,247,245] and pivot128,128. Hardware256×128 contains64-square native cells; clipped column cap is excluded, intact cap reused by translation. Independent `python tools/art/orbit/validate121.py` passes native binary alpha/hiddenRGB,312-world flat deck/underside material, single lower bevel row, gear margins and connected translated caps. These measurements support, rather than replace, the visual judgment above. **Processed native and aesthetic gates accepted.**

## Actual gameplay/contacts and character harmony

Sampled production `route/captures/magnetic-ceiling-2x.png`, `magnetic-corner-portrait.png`, `receiving-dock-1x.png`, `crane-lifting-2x.png`, `ceiling-brake-aim-live.png`, `ceiling-brake-aim-portrait.png` and `pawl-2-portrait.png`, including unobscured live contacts. The one-native-row decorative lower bevel does not create an obvious floating/embedded underside boot or tray contact in those actual views. Upper rim riders stay seated, curved-end sole rotation remains coherent, and the roof's actual underside is inspectable beside the brake rope. Loaded claw/bearing and receiving structure remain joined. New coils clearly contain copper windings; columns/beam caps, switch housings and panel base meet their existing supports. Existing adult-human scale, dark room depth and quiet119 distant scrap language remain intact.

The new warm modeled metal fits the complete latest Vikings materially: dimensional armor/shields, helmets and distinct beards share the scene's relief rather than standing beside flat diagram art. Checked all131 route capture states: every hero skin equals imagegen90. Checked130 general `.png.review.json` sidecars: skin=imagegen90, ready:true and all resolved hero identities match; sheets are `assets/vikings90/erik-native.png`, `assets/vikings90/baleog-native.png`, `assets/olaf111/olaf-native.png`. The additional intermediate native-claw capture retains latest-skin state in the main receipt. No old procedural screenshot is repurposed as121 scene-fit evidence. Independent latest-skin regression passes1/1.

Full real-browser ordinary-input route `assets/orbit121/route/route.json`: won,HP[3,3,3], errors[],104.3667seconds,131 captures. Mechanism/physics remain unchanged from120; this route verifies the richer replacement art preserves clear cooperative interactions and all-three exit feasibility. **Runtime and cooperation gates accepted.**

Source/native correctness and richness have both been independently accepted, with actual latest-character scene evidence. Publication may proceed subject to normal package/build checks. No review-requested art or runtime correction remains.

Additional final retry evidence: `assets/orbit121/retry/route.json` winsHP[3,3,3], errors[],135.675seconds with151 captures. Inspected its actual `circuit-recovery-live.png`: reusable switch hardware returns coherently with the richer art, crew/rail contacts remain stable and safe. This reinforces the already accepted unchanged cooperative reset behavior.
