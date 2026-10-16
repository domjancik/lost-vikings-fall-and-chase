# Before the descent — The Familiar Hearth

Status: corrected concept and independent critique; implementation pending. The critique corrections below supersede the original brainstorming order. User rejected modern/neon pub framing. That concept is retained as rejected history only.

## Story contract
This is the friends’ regular alehall in their own Norse world. No electricity, arcade cabinets, modern darts, modern pub naming or imported machine-room furniture. Their relationships precede the plot. Period timber, peat, wool, iron, coopered casks and wooden cups establish home. Seriousness comes from familiarity and consequence, not portentous exposition. The sea-recovered object is the first intrusion of the unknown.

The hall belongs to Astrid’s household, which hosts the friends and their neighbors. They help with work because they belong here. Astrid knows Olaf’s usual order; a fisher teases Baleog about his practice shooting; Erik already knows the loft. Brief conversations are optional to repeat. Chores have ordinary purposes and visible results. No unrelated tutorial task opens a magical switch.

## Play sequence
1. Keeper asks Olaf to put the delivery sledge in its bay; forward shield and walking pushes it left. Parking it clears the working aisle and leaves an ordinary step beneath the loft. Grounded wheels/skids, continuous movement, recoverable from either side.
2. Erik jumps from the parked cask/bench to fetch the service key on the loft. It opens the salvage chest itself, with a continuous hand/lid movement; never a distant unrelated door.
3. Optional familiar activity, not a story prerequisite: Olaf raises his shield under the keeper’s hands. USE loads four wooden ale cups with short individually staggered arcs. Carry them across the hall and USE by the friends’ usual table to serve the regulars. Lowering the shield visibly spills them; the keeper refills without consuming progress or softlocking.
4. Optional familiar activity, not a story prerequisite: in the fenced practice yard Baleog shoots a broad straw archery butt. No civilians in the firing lane. This is a familiar invitation from a regular, not a mechanism that unlocks the mystery. Sword cuts a taut, visibly soft rope lashing on the recovered chest’s wrapping; cloth falls away locally. A bow cannot substitute for cutting the close wrapped binding.
5. The fisher has placed the cloth-wrapped recovered object in Astrid’s own storage chest. The key belongs to this chest and is kept on the loft peg above stored bedding, not mysteriously matched to a foreign lock. Astrid gives permission to cut the close wrapping once the chest is open; its lashing lies against a wooden packing batten, rather than hanging as an archery target. Key and severed binding physically let them inspect the find. Serving and practice do not gate this. Their approach, not an arbitrary three-switch machine, begins the final conversation: a fisher describes the find, each friend notices something troubling. All three must gather on the old cellar boards. Wet wood is foreshadowed by drip stains and an earlier creak.
6. Before the collapse, an ordinary domestic setting remains visible: damp earth beneath the boards, timber and a small stone-lined runoff cavity. The vast built sewer below is an unexplained discovery, not infrastructure the friends recognize as their village’s own. Beams crack, bend and tilt over about two seconds, people pull back, then the three fall through with splinters and earth. No explosion, portal or neon glow. Physical fall is the exit and the sewer’s ceiling fall is the entry. Continue goes immediately to sewer stable ID10; sewer still continues to Drowned Regulator ID4.

## Spatial and motion contract
Adult standing person:72world/36native pixels. Native pixel2world units. Hall roughly2400world wide; common floor760. Cart top714; loft610: Erik’s130world jump envelope clears both stages comfortably. Wide landing, no precision threading. Olaf shield48world wide, four cups at8world plus small gaps. Longhouse supports meet floor760, fixed rear walls share world transform with shelves/fixtures. Distant coastal view appears only through real openings and receives x/y parallax. Foreground props have true native alpha and no enlarged conceptual crops. Fire/smoke/patrons animate independently.

## Art contract
Fresh generated art, not reused arcade rooms. Concept `assets/pub133/norse-alehall-concept.png` is a composition reference only. Runtime room plates, props and patrons must be generated separately at declared native density. Deep worn timber, directional hearth warmth, cool overcast openings, dimensional restrained materials. No flattened overlay mockups. Shuttered openings, door and roof smoke opening replace glazed windows; hearth is the principal interior light. Do not copy the concept’s theatrical vaulted undercroft or ambiguous instrument. Preserve prompts and raw sources.

## Review requirements
Independent critique before shipping: period/story consistency; no arbitrary tutorial locks; shield cups physically attached; key/chest causal relationship; safe bow lane; all three ordinary-input route; spill/reload retry; correct sword/bow interactions; no premature collapse; continuous collapse/fall; stable IDs/menu order; 1x/2x/touch art evidence with imagegen90 Vikings. Separate source/runtime/aesthetic verdicts, grounded soles/props/supports, adult scale. A concept acceptance is not runtime approval.

## Generation
Built-in imagegen. Corrected prompt: `assets/pub133/concept-prompt.txt`; source copied without modification to `assets/pub133/norse-alehall-concept.png`. Rejected modern image/prompt retained with explicit rejected names and never used as production references.

## Source rejection and retained studies
`room-study-not-runtime.png` / `room-prompt.txt` is a second built-in imagegen architectural study. It does not meet the requested1152×256native composition/density and is not runtime-approved. No resampling or grid-detection rescue is authorized. Source gate: rejected for production; runtime gate: not evaluated; aesthetic fit: useful timber/material reference only, not acceptance. No game code, asset manifest or live deployment includes either study.

## Critique resolutions
Applied the concept reviewer’s six main concerns: named household host; optional social tutorials; key belongs to host’s chest; close lashing against packing timber; monumental sewer treated as unknown; concepts not literal runtime references. A single recoverable cart with end stops, civilian-excluding yard entrance/backstop, one survivable fall and source/runtime evidence remain mandatory implementation acceptance criteria. See `ALEHALL133-CONCEPT-REVIEW.md`.
