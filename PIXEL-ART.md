# Pixel artwork pipeline

The game uses Retro-Diffusion/pixel-art-fixer at commit ef376e57e1c272633ca2dbf5f29ec3fcf6596465 (MIT): https://github.com/Retro-Diffusion/pixel-art-fixer.

Original PNGs remain in assets/. Processed versions live in assets/pixel/ and are the only artwork published by publish-update.mjs. normalize-art.py runs the upstream two-stage reconstruction: explicit pixel density for backgrounds and cell-divisible dimensions for transparent sprite sheets. Automatic detection was evaluated but classified the cargo scene as 72×40, destroying useful detail; explicit resolution retains it. output/pixel-preview/manifest.json records all ten conversions and the pinned upstream revision.

Reproduce with tools/pixel-fixer-venv/Scripts/python.exe normalize-art.py. Dependencies are installed in this project-local environment; upstream code is in tools/pixel-art-fixer/python. No image-generation service is required.

pixel-grid.js defines the shared 2-world-unit pixel size. The complete game scene—including procedural Vikings, rotation, particles and generated raster assets—is composed on a half-resolution surface and enlarged by exactly 2 using nearest-neighbor rendering. Display aspect ratio and physical movement remain independent of this visual grid. Camera positions snap to the grid. Canvas stays pixelated on mobile.

Text labels use a separate full-resolution overlay with a minimum 11 CSS-pixel font. The shared two-pixel grid applies to game artwork; text remains readable at every display size.
Visual object translation and dimensions snap to two world units. Rotations use five-degree steps. Environment animation clocks advance at 12 fps; fractional sprite scaling is removed. Simulation velocities and collisions keep their original smooth precision.

Exploration: V or the top-bar zoom button toggles 1x overview / 2x exploration. The default is 2x. Three background planes scroll at 0.22, 0.55 and 0.82 of camera movement with snapped offsets. normalize-parallax.py rebuilds the transparent decoration atlas using pixel-art-fixer.
