# Clouded sewer darkness

Flat black shadow-mask pixels are replaced by two slowly drifting dark blue/green cloud fields. Each texture is generated once at640×384native pixels, with one texel per two world units. Periodic multi-octave noise gives seamless broad cloud clusters. Drift snaps to the native grid, uses simulation time and freezes with pause. Zoom changes view framing, never texture density.

Fog is opaque in unrevealed regions. The existing visibility polygons and lamp falloff cut through the colored fog mask exactly as before; no ambient visibility is added and hidden geometry/enemies remain hidden. Native shutter and landing face lighting remains above the mask. No source assets are replaced or rescaled.

Performance: two cached native rasters; no per-frame noise generation, scene readback or viewport allocation. Manifest ships the new sewer-fog.js module. Regression tests cover bounded opaque colors, deterministic variation, seamless wrapping, native-grid drift/pause and cache reuse/readback prohibition.

Verification:647 tests pass; build and release check match472files. Desktop/coarse-mobile browser views pass1×/1.5×/2×, drift, pause, movement and no errors. Evidence assets/sewer130/views. Full ordinary-control coarse-touch route completed60.85s with allHP3,24captures, continuation4 and no page errors (assets/sewer130/route). Independent source/runtime/aesthetic gates accepted: coherent subtle native cloud masses, no visible tiling/grain/grid drift, retained warm machinery/hero/water readability, fully opaque unrevealed regions. Reviewer independently passed all four fog regressions. Latest imagegen90 review skin resolves vikings90/olaf111 in receipts.

Published version01M50VXBMN1MZC1VJX9ZGF2F4T. Live HTML and8 release files match build; hosted desktop/coarse-touch1×/1.5×/2×, drift, pause and movement checks pass with no errors. Implementation commit1a7fd12.
