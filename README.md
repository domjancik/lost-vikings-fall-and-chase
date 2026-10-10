# Last Call — six different arcade puzzles

Live game: https://united-marsh-6ppd.here.now/?creative=13

No bridge or latch puzzles remain. The pub teaches the three abilities; the five arcade worlds use different machinery, room layouts and exit locations.

| World | Teamwork puzzle | Spatial layout |
| --- | --- | --- |
| The Neon Stag | Erik repairs the fuse; Olaf grounds the rogue arcade’s armor; Baleog shuts it down. | Pub shelves and a continuous bar floor |
| Starfall Cargo | Olaf charges the reactor, Erik starts the lift, Baleog releases the hatch. The lift carries everyone. | Lower cargo bay, control balcony and upper-deck exit |
| Tilt! Bank Shot | Erik chooses a bank angle; Olaf reflects Baleog’s arrows into MIDDLE → LOW → HIGH. Wrong shots reset the combo; a jackpot stays unlocked. | A plunger, one high control perch and three target heights; return to the left exit |
| The Haunted Loop | Erik bashes a stone bell, Olaf reflects a ghost into its own eye, Baleog cuts the cursed seal. USE doors to move everyone. | Three walled chambers at three different elevations |
| Road Rage Rescue | Erik stops the conveyor, Baleog changes the traffic signal, Olaf physically pushes the stalled kart into its garage. | Road, underpass, garage and traffic gate |
| The Dragon Forge | Baleog releases ore, Erik pumps the bellows by run-bashing, Olaf redirects dragon fire into the crucible. Each flame consumes pressure and adds heat. | A central forge arena with an exit beside the crucible |

## Controls

Arrows / A D move. 1 / 2 / 3 or Tab switches heroes. Erik uses Space to jump and X to run-bash after building speed. Baleog uses Z for sword and X for bow. Olaf uses X for his front shield and Space for overhead shielding. E / USE operates consoles, dials and haunted doors. R restarts; Escape pauses.

Fullscreen overlay buttons work alongside keyboard input. Click DEBUG or press F2 to skip, go back or load any level. Its status panel shows the current world’s machine state.

## Development and verification

Run npm run dev, npm test, or npm run build. Static output is dist. publish-update.mjs updates the existing authenticated here.now site with its current base version.

The campaign routes in campaign.test.js use real movement and abilities at both 60 and 120 Hz. Browser routes under output/playwright/creative drive the live game with normal keyboard inputs and read-only diagnostics, then assert everyone reaches the actual exit. Haunted teleportation happens through the game’s USE mechanic; tests never modify hero positions or puzzle flags. Screenshots and the report live in that folder.

Physics retains accelerated movement, braking, air steering, jump buffering, edge grace and shield support. Different Viking speeds and attacks remain intact.

## Generated artwork

All PNG generation used the built-in image generation tool.

- assets/arcade-pub.png — original pixel-art pub environment.
- assets/arcade-worlds.png — five themed background strips.
- assets/foreground-tiles.png — 8-column, 6-row terrain/lever/plate/collectible sheet.
- assets/world-objects.png — 4-column, 6-row portal/barrier/target sheet.
- assets/puzzle-machines.png — NEW transparent 5-column, 2-row machinery sheet, saved in the workspace and consumed by world-render.js.

Final machinery prompt:

“A transparent sprite sheet of original detailed 16-bit pixel-art foreground puzzle machinery for five arcade videogame worlds. EXACT grid of 5 columns and 2 rows, ten equal square cells, generous transparent margins, no backgrounds and no words or labels. Top row left to right: cyan science fiction reactor collecting energy sparks, sci-fi cargo elevator platform with hydraulic rails, colorful pinball triple brass bell assembly, angular pink chrome arrow reflector prism, haunted stone portal with spectral green spiral. Bottom row left to right: orange racing arcade broken tow kart with wheels facing right, red orange striped speed-trap drum, purple dragon dungeon hanging iron ore basket on chain, flaming stone crucible forge with glowing molten metal, huge expressive purple dragon head in side view facing left breathing orange fire. Isolated readable game sprites, rich crisp pixels and bright accents, consistent orthographic side elevation. Real alpha transparency between objects. Keep each prop completely inside its cell.”

The new sheet’s RGBA transparency was checked. Sprite cells are cropped to alpha bounds during loading; generated image files are preserved.
