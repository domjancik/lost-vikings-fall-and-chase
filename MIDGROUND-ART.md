# Campaign middle scenery

Replace the temporary translucent pillars with eight distinct generated architecture sets.
Keep the original far scenery and its display-sized native raster preparation unchanged.

Each 768×512 source panel becomes a 384×256 native sprite displayed at 768×512
world units. Empty space has alpha zero; structures have alpha 255. The corrected
positive-weight pixel packer samples each panel independently, avoiding cross-panel
bleed. Preserve complete silhouettes and fixed aspect ratios.

Coin return, routing loom, memory reeds, ceramic world manufacture, archive,
ownership core and pub fittings stand on the common 610-unit scenery support plane.
The canopy hangs from the world ceiling at -100. Camera movement uses a shared
transform for each structure and its foundation. Every draw coordinate is snapped
to the two-unit world grid. Middle scenery moves at 45% of camera speed.

Review all eight chapters at both zooms and mobile size. Check visible foundations
and ceiling attachments, opaque silhouettes, quiet contrast behind puzzle objects,
no false interactive controls, no placeholder geometry, no fractional-grid motion,
and preservation of the canopy reveal's full-resolution source crop.

## Verification

- 199 automated tests pass, including the new middle-layout grid/support test and
  the original full-resolution canopy crop regression. Static build succeeds.
- All eight chapters surveyed at 1× and 2×, plus 390×844 mobile: every middle
  asset ready, far-scene native scale remains two world units per pixel, no page errors.
- Chapter 6 replayed through its upper/lower routes using production keyboard
  controls: completed with all three Vikings at 3 health. The upper canopy reveal,
  moving lift and grounded enemy have captured screenshots in output/playwright.
- Preparation checks all eight runtime sprites for binary alpha and support-edge
  contact. Source panels retain their aspect ratio; no background repaint or
  forced full-scene 256×256 downsampling is introduced.
- Published mid49 verified live: 26 relevant modules/assets return HTTP 200,
  eight chapter menu entries, ready middle artwork, full 390×844 mobile canvas,
  zero page errors. Game modules and the complete HTML body match local UTF-8
  sources exactly; hosting-added head metadata is excluded from that comparison.
