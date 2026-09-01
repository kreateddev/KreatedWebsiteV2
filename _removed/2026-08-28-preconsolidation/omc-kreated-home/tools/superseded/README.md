# SUPERSEDED FLUID EXPERIMENTS

Kept as history. **None of these drive the live prototype.**

| Script | What it made | Why it was retired |
|---|---|---|
| `render-fluid.py` | Cellular foam: packed pockets, cobalt rims, grain | Read the references as a *system to generate* rather than artwork to compose. Produced an evenly distributed texture with no composition — and at thin walls it read as a neon web. |
| `render-cells.py` | The five-pocket capability membrane, as SVG paths | Turned OMC's huge, sparse, hairline capability composition into a dense centred diagram with labels centred inside shapes like badges. |
| `render-field.py` | Four attempts at a broad marbled field | Closer, but never reached the reference quality. On a dark page a soft mass reads as **light** (a beam, a nebula); banded to fix that it became a **solid blue wash** with no negative space. |

The judgement recorded here: **this art direction is not reachable procedurally at the
quality the references set.** The references are composed artwork with intent, not
fields with parameters. Attempting it produced five results that each failed in a
different, characteristic way.

The live prototype therefore ships a clearly labelled art placeholder in the hero,
holding the intended composition, per the standing rule that missing art is marked and
never faked. See `research/OMC_FIDELITY_CORRECTION.md`.

To run any of these for reference: `python3 tools/superseded/<script>.py` — note they
write into `assets/fluid/`, which the live prototype no longer reads.
