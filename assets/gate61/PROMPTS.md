# Gate61 source contract

Target: 64×64 native pixels, displayed at 128×128 world units. One native
pixel is two world units. Copper/brass and dark teal iron, transparent cavity,
broad flat base, bevelled material shading through broad readable clusters.

## Initial prompt (rejected source)

Generate a game-ready pixel-art doorway sprite for Last Call, an industrial arcade cyberspace platformer. SINGLE sprite centered on transparent background, no text. CRITICAL NATIVE GRID: designed as exactly a 64x64 native-pixel canvas, display one deliberate native pixel as a uniform 16x16 square in a 1024x1024 output. No higher-resolution drawing, no antialiasing, no smooth outlines, no fine texture/noise. Every contour and shading cluster follows this 64x64 logical grid. Intended displayed size128x128 world units at2world units/nativepixel. Human-sized industrial arched portal, tarnished copper/brass rim, riveted dark petroleum-teal cast iron uprights, broad bronze sill with two solid feet touching a shared baseline near bottom row61, readable cut metal bevels and directional warm material highlights matching detailed Victorian arcade machinery. Rich material depth through restrained broad pixel shading clusters, NOT flat vector/cartoon rendering. Approx54nativepixels wide and60 high; at least2nativepixels transparent outside silhouette. The arch is front-facing, symmetric enough for a doorway, a tall dark open cavity in the center roughly22pixels wide and42high, utterly transparent inside that cavity (the engine supplies animated portal light behind). Small pale turquoise lens on arch apex and two turquoise lamps in metal uprights, lamps unlit/dim in this base asset, no baked bloom or smoke or magic particles. Grounded base broad/flat; no shadow baked in; no characters, floor, background, extra decorative loose pieces. Preserve material richness without increasing native detail density.

## Coarser redraw prompt

Edit this portal sprite. Preserve the arch design, brass/teal materials, transparent cavity and transparent background. CORRECT PIXEL DENSITY: the current artwork has about120 logical pixels of height and is too fine. REDRAW with half as many logical pixels: a strict64x64 logical pixel canvas, subject58logicalpixels high. Each visible pixel block must be a large uniform square around20x20 output pixels on the output1254x1254canvas. All silhouette steps have this large uniform square size. Absolutely no lines narrower than one of these large native blocks and no smaller shading blocks. Simplify rivets to one or two64-grid pixels. Simplify gem/lenses to broad4x4logicalpixel clusters. Keep beveled brass depth with3to4 broad tones, darkteal castiron with3shades; no dither, no fine texture. This is a deliberate low-resolution pixel sprite, NOT detailedpixelpainting scaleddown. No blur or antialias. Frame must retain a broad flat base and clear22logicalpixelwide open arch. Center glyph-free doorway with margins2logicalpixels. Transparent aperture and background. This edit is for matching actual64pixel game rendering, so native visible cluster count, NOT outputfiledimensions, is the key requirement.

The initial source was rejected by the critique reviewer for about100–110
logical rows; it is retained as rejected-source.png and never used at runtime.
The edited original is source.png. Registration is uniform sampling once plus
translation of its broad base, with no grid detection or per-part resizing.
