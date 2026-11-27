# Development overview video

Run from the repository root. The capture uses Chrome, the existing Playwright
runtime, FFmpeg, and archived builds at `E:/Lost Vikings - Playable Archive/versions`.
Historical baseline inputs live under `output/timelapse`. Current game footage
comes from `dist`. The Python edit uses Pillow and NumPy in the pixel-fixer venv.

```powershell
npm run build
node tools/video/capture-overview.mjs
tools/pixel-fixer-venv/Scripts/python.exe tools/video/render-overview.py
tools/pixel-fixer-venv/Scripts/python.exe tools/video/verify-overview.py
```

Capture individual shots by passing their IDs, or pass `--tour` for all 31
levels. Raw clips, the shot list, chapter metadata and the final video go into
`output/overview-60`. The edit also uses historical review captures already in
`assets` and `output`.

Gameplay runs at 60 simulation/render samples per second. Captures wait for scene
and character readiness, fail on resource errors, and use the latest Viking skin.
Level tours use 2.4-second eased pans and wider views bounded by each world's
height. The earlier collections share three brief mosaic cards. The Fall & The
Chase keeps individual level shots, including the held-lantern walk for its sewer.
Mechanics demonstrations record active input, including shield jumps,
rail switching and magnetic attachment/walking, with their outcomes checked.
The intro and mechanics demonstrations stage production simulation states, then
advance them with ordinary controls and physics.
Revision 89 receives the current retry loader and complete-image cache guards
through the capture server, retaining its original renderer and artwork.
Its cached sprite canvases must also contain visible pixels before recording.
The final verifier checks frame count, resolution, frame rate and chapter markers,
then decodes the whole video to catch corrupt frames.
