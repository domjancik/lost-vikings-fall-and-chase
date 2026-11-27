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
The intro, Warden and Clockwork demonstrations stage production simulation states.
Revision 89 receives the current retry loader and complete-image cache guards
through the capture server, retaining its original renderer and artwork.
Its cached sprite canvases must also contain visible pixels before recording.
The final verifier checks frame count, resolution, frame rate and chapter markers,
then decodes the whole video to catch corrupt frames.
