# Human-scale scenery correction

Prepared by tools/prepare-scale50.py with the corrected positive-weight pixel
packer. Chapters 1–7 repack original mid49 source panels directly at 192×128
native pixels, drawn at 384×256 world units. Connected supports and binary alpha
are preserved; none of the movement or collision geometry changes.

New pub art was generated with built-in imagegen. The prompts specified adult
human Vikings, ordinary doors/counters/chairs/windows, panoramic side elevation,
quiet pixel clusters, and explicitly rejected giant screws, magnified grain,
miniature/dwarf scale, people and text. The middle art additionally requested
true transparent empty space and an opaque connected bottom foundation.

Original generated images are pub-far-source.png and pub-middle-source.png.
The middle retains its authored silhouette and proportions after trimming only
empty outside margins. Far768×512 source is retained for runtime display-sized
preparation. Fixed pub world dimensions prevent furniture growing at 1× zoom.
