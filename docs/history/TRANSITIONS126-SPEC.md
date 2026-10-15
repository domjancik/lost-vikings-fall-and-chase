# Method-aware departure and arrival126

Keep the completion interstitial enabled. Model departure, wait and arrival as
separate phases; continuing carries the departure method into the next room.
Future seamless continuation can reuse the same handoff without new effects.

Methods: true portal (Machine Rooms teal, story authored accent, arcade violet),
sewer current/waterfall, tavern ceiling fall, physical outside door, story body
transfer. Water travel never duplicates already-swept heroes or shrinks them into
a portal. Story body transfer and rain exit never use an unrelated vortex.

Departure and arrival distort actual scene pixels, not HUD/health/text. Use
integer native samples with a bounded scratch copy, no full-screen readback.
Portal distortion converges/departs, then expands/settles on arrival; water keeps
its right/down travel in BOTH directions. Intro fall uses actual gravity while
its visual settles; other entry scenes hold simulation until actors visibly
reach their real spawn. Input held through continue cannot leak into gameplay.
Pause and opening menus/dialogs freeze entry; restarting or selecting a new level cancels the old transition. Closing a dialog quarantines every currently held key before resuming. Story cards can
remain before arrival, then release it. Initial menu entry and retries also have
an arrival appropriate to the room. Arrival camera initializes on actual spawn,
not at x0 on a distant world.

Verify policy/phase/input/resize sampling tests, full old suite, ordinary water
handoff and portal completion/arrival in production browser,1x/2x and coarse
mobile. Latest imagegen90 sheets. Preserve unrelated WIP; commit and publish.
