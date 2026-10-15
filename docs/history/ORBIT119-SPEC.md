# Scrap Orbit scenery depth119

Background fragments must read as distant scenery rather than collision hazards.
Keep all hazard sprites, collisions, physics and puzzle states unchanged.

Middle-distance fragments: eight native32-square cells displayed64 world units,
reduced once from retained approved orbit113 parts6/7 using nearest sampling.
Cool opaque material range RGB(18,32,43) to(32,50,63); no hazard gold highlights,
no low-opacity duplicate. Slow drift/rotation, camera response x.48/y.30.

Far silhouettes: twelve purpose-authored native24-square cells displayed48
world units. Broken girders, hollow rims and disconnected plates in solid
RGB(32,51,68). Slower drift/rotation, camera response x.87/y.67.

Both scenery passes precede middle architecture and all gameplay. Positions
snap to2 world units and raster rotations use nearest native sampling. Far
scenery is deliberately small; middle architecture occludes both depth passes.
Foreground hazard raster remains192 world units and full original material.

Review raw native cells alongside retained original parts, real1x/2x and touch
portrait/landscape. Reject scenery resembling a live hazard, opaque halos,
subpixel edges, foreground occlusion, or loss of the floating-field atmosphere.
