# Sewer prelude: The Last Lamplighter

Status: visual brainstorm and design proposal only. No runtime changes, insertion
or deployment. Place immediately before The Drowned Regulator if implemented.
Concept source: assets/concepts/sewer-prelude/concepts.png. Retain exact imagegen
prompt alongside it. Concept art is not native-density-approved runtime art.

## Three directions

1. The Last Lamplighter: carry, protect, focus and relay one portable flame through
   wet, dark maintenance galleries. Light permanent refuges to free the lamp for
   another Viking. Strongest inventory/cooperation identity.
2. The Lantern Ferry: a mobile lit refuge over a lock basin. Attractive reflections
   and moving illumination, but too close to the following level's floating
   compressor/Olaf push. Keep as an alternative, not the recommended main mechanic.
3. The Borrowed Sun: carry a real reflector into a street-grate sunshaft and reveal
   the depths with reflected daylight. Strong discovery/payoff, but use it as a
   final reveal rather than another collection of beam-operated doors.

## Recommended synthesis

A claustrophobic, abandoned lamplighters' service sewer opens into a vast pressure
chamber. The crew restores safe working light, then lowers a physical service
stair into the already flooded Regulator. Their actions do not magically flood
that next level or reverse its established failed-drain story. Water is spilling
through the district already; pipe routes and windows establish the connection.

Rich wet brick vaults, modeled iron/copper lamp housings, quiet moss/algae and
amber reflections against cool dark depth. Human service doors set scale. Far
arches, grounded middle galleries, pipes/wall enclosures and active foreground
channels are separate coherent planes with both-axis parallax. Darkness frames
architecture rather than removing all scenery. A street-grate sunshaft provides
an earned high-route reveal before the final descent.

## Inventory verbs and invariants

- Inspection lamp: carried in a bag slot with an attached visible belt/hand light;
  USE places it in a nearby visibly fitting wall hook/stand or retrieves it.
  Existing GIVE transfers it between nearby Vikings. Mounted lamps keep shining
  while their former carrier moves elsewhere. No separate precision placement UI.
- Refillable oil can: fills an obviously empty fixed wick reservoir with a visible
  pouring/fill animation. Portable flame then lights that wick. Use on unrelated
  scenery consumes nothing. Refill points are sheltered and inexhaustible.
- Bullseye lens: fits the inspection lamp's visibly threaded empty bezel. Broad
  local glow becomes a long, generous cone; brightness is redistributed, not new
  energy conjured. USE toggles fitted wide/focused modes. Paired hook housings set
  useful aim, avoiding pixel-perfect rotation. Show this tradeoff at a safe bench.

No fuel countdown, consumable softlock or pitch-black return walk. A soaked lamp
stays recoverable and relights from any permanent flame. Only one or two fixed
lamps require deliberate filling; subsequent refuges can already contain oil,
so the level does not become a repeated fill-and-click chore.

## Puzzle progression

1. Sheltered lamphouse. Pick up the portable lamp and can; fill/light a dry nearby
   wall wick. Demonstrate placed light continuing to protect an empty position.
   A harmless light-shy scavenger retreat makes light behavior explicit.
2. Wet culvert. A visible side pipe's water spray sputters/extinguishes the open
   inspection flame, never deleting the item. Olaf physically blocks the stream
   with his front shield while Erik carries the flame through its actual sheltered
   wake. Erik's jump reaches a dry valve gallery; closing that ordinary valve
   gives everyone a permanent safe crossing. Any hero can turn it if they reach it.
3. Two work sites, one lamp. Lower pump-floor position and high lampwalk need
   light concurrently. Fill/light a permanent lower refuge before taking the
   portable lamp and lens up Erik's broken, jumpable upper route. That frees
   Baleog to wait safely below while Erik works above. Passing items is useful,
   and all lamp rules work equally for all three heroes.
4. Upper sight hatch and hanging stair. Erik opens a real inspection hatch from
   the high service landing, physically exposing a frayed supporting rope across
   the shaft. Mount/focus the portable lamp to illuminate that generous target
   and its moving counterweight; Baleog cuts it with an ordinary arrow. The rope
   recoils, weight descends and the stair unfolds continuously along real links.
   Upper access is constrained by jump geometry, not a hero-colored lock.
5. Reunion/reveal. Stair provides an ordinary route for all three and recovery
   to both lampwalks. A large real sunshaft and damp reflections reveal the final
   approach: beyond a grating the flooded Regulator and failed inlet are visible.
   Follow the stairs down into its existing opening. Keep a lasting lit refuge at
   the transition. A reflector can enrich this reveal, but is not a fourth
   required inventory item or another mandatory mirror-lock puzzle.

## Light behavior and fair danger

Pale sewer scavengers shelter in recesses under steady light, telegraphing with
visible eyes/antennae before emerging when a light moves. Establish this safely.
They are ordinary moving enemies and can be fought; light controls territory,
not arbitrary invulnerability. Keep silhouettes, ledge edges, water glints and
hazard warnings faintly legible outside illumination. Never hide a lethal pit.
Pillars and walls occlude world light; the HUD and health stay crisp above it.

Light helps the player read targets; it must not be an invisible permission flag.
If Baleog makes the shot in darkness after physically opening the hatch, it counts.
No tiny aiming requirement, sun-powered machine driven by a handlamp, or flame
that inexplicably repairs a mechanism. Flood/valve behavior remains consistent
with the following water level. No need to teach full swimming/air management here.

## Implementation/review requirements if selected

Prototype source placement and inventory interactions before art production.
Generate runtime art separately at actual display density, preserving modeled
richness and latest90 Vikings. Animated flames, wicks, pours, lamp hoods, lenses,
rope recoil, stair travel, drip occlusion, enemies and reflected water must show
real state. Test putting down/picking up/giving the lamp in both modes, wetting
and relighting it, oil refill/wrong target behavior, lamp left behind, a fall to
recovery, all hero swaps during the shield crossing, dark successful shots and
continuous stair carrying. Full ordinary-input routes all alive at60/120, actual
1x/2x/mobile evidence, and independent source/runtime/aesthetic/cooperation gates
are required before any publication. Bound light buffers, cache static shadow
geometry and quantize masks/effects to the2world grid; no per-frame full-screen
readback blur or darkness applied to UI.
