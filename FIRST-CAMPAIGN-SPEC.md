# Last Call — The Last Exit

## Intent and campaign separation

Implement the first Astra narrative: escaping ownership during an arcade's permanent shutdown. Cabinets contain inhabited worlds; ordinary victory doors lead deeper into the system. The Vikings recover an archive, surrender their reset copies, transfer into three brass marquee bodies, and escape into real rain. The existing eleven Arcade levels remain unchanged and independently selectable. The new Story campaign has separate progress, level selection, and debug destinations.

## Eight authored chapters

1. **Last Orders**: a 2880-unit pub and service corridor. Erik retrieves the high service key; the crew opens the locked staff gate; Baleog cuts the cabinet tether. The opening marquee foreshadows their future bodies.
2. **Freight Without Arrival**: cargo and racing machinery. Erik reaches the elevated dispatch control, Baleog opens the delivery lock from range, Olaf physically pushes the stranded cart into a stationary berth. Moving freight sentries oppose traversal.
3. **Rooms That Remember**: three separated haunted rooms connected by reciprocal doors. Erik wakes the first door with a running bash; Olaf reflects a moving wraith back to its source; Baleog cuts the final restraint. Door readiness and destination are visible, and ghosts never spawn over doors.
4. **Borrowed Fire**: forge and kitchen production halls. Baleog releases ore, Erik charges bellows, Olaf redirects dragon projectiles. The resulting ticket must be picked up and used at a separate departure lock. Machines animate their working states.
5. **The Unwritten Archive**: gallery and vault. A loft reached through Olaf’s overhead shield holds a red lens; its installed projection opens a gallery. A renewable bomb dispenser allows a guarded vault to be breached; the archive is carried in inventory to the departure terminal. Failed item use never destroys quest items.
6. **The False Summit**: a two-stage vertical observatory. Olaf raises his shield and carries both companions in drafts, Baleog activates the second stage from range, Erik reaches the final lens. The apparent sky reveals the outside, but is still glass. Repeatable return doors prevent stranding.
7. **No More Resets**: the maintenance core and organ. Three independent, spatially separated transfer terminals must be reached. Each transfer freezes that Viking's old body and lights a physical counterpart. The last transfer completes the crossing; nobody is abandoned on a switch.
8. **Real Rain**: the physical pub at miniature scale. Erik opens the service hatch, Baleog cuts the cord, Olaf shelters the group through falling leaks. All three reach the outside carrying the archive. The ending does not reveal another screen.

## Level and puzzle construction

- Larger worlds use explicit width, top, bottom, spawn, death bounds, floors, platforms, walls, doors, patrol routes, devices, and exits. Target 2600–3200 units wide with multiple rooms; tall chapters extend above the old camera boundary.
- Doors are genuine USE interactions with visible locked/open states, named destination, reciprocal travel, safe landing clearance, reset velocity, and no automatic re-entry. Item locks consume only the correct item at the correct location.
- Floors, patrols, projectiles, exits, and cameras use per-level bounds. No inherited 1440-width or 700-height limits may truncate a Story world.
- Each chapter must use a distinct system. Avoid repeated bridge/latch corridors. Backtracking and doors connect rooms; upper routes and shield boarding create exploration.
- Puzzle changes persist for the current attempt. Every required object and renewable resource remains recoverable. No hidden countdown can permanently invalidate a chapter.
- All three Vikings must survive. Normal exits require the whole crew; the core has the explicitly different three-transfer completion rule.

## Controls and motion lessons

- Preserve acceleration, braking, coyote time, jump buffering, character weights, and independent input sources. Smooth simulation at 120 Hz, rendering interpolated then snapped to the 2-unit world grid.
- Primary Action: Erik jump, Baleog sword, Olaf shield overhead. Alternate Action: Erik running bash, Baleog bow, Olaf shield front. USE operates doors/devices and picks up items. Keyboard and touch use the same action map.
- Olaf has exactly two always-active shield states. Changing poses never depends on cooldown or special pads. Raised shield supports both teammates, moves them with Olaf, blocks falling hazards, and caps descent speed.
- Mobile controls overlay the viewport at opposing lower corners. HUD remains compact; fullscreen and 1×/2× zoom stay accessible. Avoid new permanent text strips.

## Enemies, hazards, combat and inventory

- Moving sentries have deterministic patrol bounds, facing, independent animation phases, health, melee and arrow hit responses, telegraphed shots, and a visible defeated state. Never patrol through closed gates or doors.
- Contact and projectiles damage all Vikings. Shield collision precedes body collision; a front shield protects from its facing side, an overhead shield protects from above. Enemy bullets collide with terrain/gates. Invulnerability prevents per-frame health deletion.
- Baleog's sword and bow are separate attacks. Erik's running bash can stun light sentries. Combat must not force Olaf or Erik to possess a weapon they lack.
- Keep four inventory slots, tiny bag items in the main HUD, nearby transfers, food, renewable bombs, and recoverable dropped objects. Add service key and archive types with clear visual identities.

## Art, audio, and storytelling

- Generate new pixel-art backgrounds and animated enemy assets. Use fixed sprite-sheet cells, common scale and pivots; preserve true alpha and normalize with Retro-Diffusion pixel-art-fixer.
- Every world has an opaque distant layer, grounded middle-distance architecture, actual foreground tiles, and animated machinery/effects. Preserve proportions and use different parallax speeds. Never ghost a complete transparent copy of a scene over itself.
- Keep large semantic silhouettes intact; no rectangular object cutouts. Ground middle-distance structures with bases and supporting scenery. Remove baked smoke/fire where effects are meant to move.
- Crop transparent padding from static terrain cells so visible ground matches collision height. Keep animated enemy/door cells fixed; never resize each animation frame to its own bounding box.
- Quantize translation, rotation, particles, sprite dimensions, camera, and animation clocks. Character breathing phases remain independent. Shadows project to actual floors beneath the feet.
- Serious story is delivered through brief chapter cards and environmental evidence, not puzzle instructions. Cards pause, can be dismissed with Enter/Space or touch, and can be skipped. Hints default off. Device state labels remain readable on the high-resolution text layer.
- Sound follows actual simulation events: footsteps, attacks, patrol shots, impacts, shields, doors, machine work, pickup, damage, death, transfer, and arrival. Respect persisted mute and browser gesture unlock.

## Architecture and validation gates

- Story data, simulation, enemies, and rendering live in dedicated modules. Reuse shared motion, controls, inventory, sprites, sound and transitions; preserve classic defaults.
- Write failing tests before behavioral changes. Cover wider bounds, door landing/locking, enemy movement and wall blocking, directional shield collision, lethal hazards, correct item consumption, all three transfers, and campaign save separation.
- Every chapter needs a full normal-control route at 60 and 120 Hz; routes may select Vikings/items, but may not teleport positions, inject required items, force puzzle flags, or disable enemies.
- Play each chapter in a real browser, with keyboard or actual overlay controls, using the production state diagnostics. Verify all three alive and the intended completion. Include portrait mobile, landscape, fullscreen control, debug skips, and campaign switching.
- Inspect representative screenshots for foreground/background anchoring, stateful animations, readable text and enemies/door clearance. Test build outputs and live deployed assets. Publish only after the required routes pass.

## Completion report

The critique cycle must also enforce HUMAN-SCALE.md: adult Vikings, plausible
ordinary doors, furniture and inhabited rooms, coherent depth scaling, and no
unintended miniature reading. Human-scale review is required with grounding.

Report campaign link, chapter count, meaningful mechanics, fresh test results, browser-playthrough evidence, and any actual limitations. Keep generated asset prompts and validation notes in the workspace.
