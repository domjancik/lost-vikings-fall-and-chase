# Orbit119 scenery depth review

Independent reviewer: orbit110_review. Scope: distinguish floating background scrap from real foreground hazards. Applied native-sprite-art, grounded-parallax and the visual review gate. No runtime edits by this reviewer.

## Source/native gate — ACCEPTED

Retained approved source `assets/orbit113/parts-native.png` is unchanged. Middle scenery derives once from approved cells6/7:64×64 to32×32 nearest sampling, with an intentionally restricted opaque cool palette. This is an explicit distant miniature with a new64-world footprint, not an attempt to rescue oversized source art. Source/native comparisons in `assets/orbit119/depth/native-{12,13}.png` (and initial superseded export views) retain coherent plate/rim silhouettes and deliberate clustered material. No translucent alpha halos or bright gold hazard outline remains. Rotation works at native density before2× world presentation.

Far silhouettes are purpose-authored24×24 cells, displayed48world: broken girder, hollow rim and separated plate. Source code uses deliberate solid pixel clusters RGB(32,51,68), with no imagegen/downsampling path. The initial capture filter accidentally excluded far blue68; the corrected harness explicitly accepts that palette and asserts both24/32 sizes. Independently inspected actual `native-{0,1,2,3,4}.png`: intentional solid girders, open rims and plate clusters remain readable at their tiny native size and through rotated states. Current evidence records64 native exports. Both source/native art classes are accepted.

## Runtime gate — accepted reviewed views

Reviewed actual `depth/first-field-wide-2x.png`, `upper-gallery-wide-1x.png`, `upper-gallery-portrait.png`, `upper-gallery-landscape.png` and `local/captures/magnetic-corner-1x.png`. Tiny cool distant fragments read as scenery; full bright/brass foreground hazard remains visibly larger and more detailed. Neither decorative layer obscures platforms, hero contacts, shutters or ropes. Middle architectural walls correctly occlude both decorative passes. Far silhouettes remain opaque and distant rather than translucent duplicate hazards. Grounding and adult-human scale of existing machinery are unaffected.

Source confirms far then middle scrap render after far scenery and before middle architecture/foreground. Their x/y camera responses differ coherently (.87/.67 far, .48/.30 middle); final positions snap to2world units, with cached4degree native raster rotations. Existing foreground hazard rendering/192-world footprint and all collision/puzzle states are unchanged.

`assets/orbit119/local/route.json`: feedback:true, HP[3,3,3], errors[],30 captures. `depth/evidence.json`:8 actual first-field/upper-gallery views,8 middle and12 far pieces per view,2 actual foreground hazards, errors[]. `node --test tests/unit/orbit-depth119.test.js` passed3/3 independently, covering native sizes,XY parallax/native-grid motion and quiet material palette. These are focused depth checks; previous full campaign clearability remains applicable because physics and puzzle states are unchanged.

## Publication

Source/native, runtime and unchanged-cooperation gates are **ACCEPTED**. The corrected capture receipt has8 actual first-field/upper-gallery views and errors[]. No runtime fixes requested. Publication may proceed after normal package/release checks.
