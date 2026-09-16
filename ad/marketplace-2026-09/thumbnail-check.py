#!/usr/bin/env python3
"""
KREATED — Marketplace ad · the thumbnail check.

The brief's acceptance test, kept as a script so it is repeatable rather than
a thing someone remembers to eyeball. It resamples a finished creative down to
the sizes a Marketplace tile actually occupies and lays them out on a neutral
card, magnified with NEAREST so the small renders are inspected exactly as
they were resampled — a smooth upscale would hide the very softness being
looked for.

Five things have to survive at 172px, in this order:
  1 headline   2 three distinct websites   3 KREATED   4 $700   5 the CTA

If any of them has gone, simplify the creative. 🚫 Do not fix it by enlarging
that one element until the composition stops being a composition.

    python3 thumbnail-check.py
"""
import os
from PIL import Image

HERE  = os.path.dirname(os.path.abspath(__file__))
OUT   = os.path.join(HERE, "out")
SIZES = [120, 172, 240]          # 120 = a dense phone grid, 240 = a roomy one
PAD   = 24
CARD  = (233, 234, 239)          # roughly a Marketplace card ground


def sheet(name, widths):
    src = Image.open(os.path.join(OUT, f"{name}.png")).convert("RGB")
    ar = src.size[1] / src.size[0]
    ims = [src.resize((w, round(w * ar)), Image.LANCZOS) for w in widths]
    W = sum(widths) + PAD * (len(ims) + 1)
    H = max(i.size[1] for i in ims) + PAD * 2
    out = Image.new("RGB", (W, H), CARD)
    x = PAD
    for im in ims:
        out.paste(im, (x, PAD + (H - PAD * 2 - im.size[1]) // 2))
        x += im.size[0] + PAD
    out = out.resize((W * 3, H * 3), Image.NEAREST)
    path = os.path.join(OUT, f"{name}--thumbnail-check.png")
    out.save(path)
    print(f"  {os.path.basename(path)}  {out.size[0]}x{out.size[1]}")


def carousel(names, width=178):
    """The four slides as a strip, at the size a Marketplace tile occupies.
    This is the check the individual sheets cannot make: whether the set reads
    as ONE campaign — same masthead, same ground, same type — while each slide
    still says a different thing at a glance."""
    return contact(names, width, "carousel--thumbnail-check")


def contact(names, width=172, name="concepts--thumbnail-check"):
    ims = [Image.open(os.path.join(OUT, f"{n}.png")).convert("RGB")
             .resize((width, width), Image.LANCZOS) for n in names]
    W = len(ims) * width + PAD * (len(ims) + 1)
    H = width + PAD * 2
    out = Image.new("RGB", (W, H), CARD)
    for i, im in enumerate(ims):
        out.paste(im, (PAD + i * (width + PAD), PAD))
    out = out.resize((W * 3, H * 3), Image.NEAREST)
    path = os.path.join(OUT, f"{name}.png")
    out.save(path)
    print(f"  {os.path.basename(path)}  {out.size[0]}x{out.size[1]}")


SLIDES = ["kreated-marketplace-01-cover",
          "kreated-marketplace-02-web-design",
          "kreated-marketplace-03-local-seo",
          "kreated-marketplace-04-social",
          "kreated-marketplace-05-mobile"]

if __name__ == "__main__":
    contact(["concept-1", "concept-2", "concept-3"])
    carousel(SLIDES)
    for n in SLIDES:
        sheet(n, SIZES)
    sheet("kreated-marketplace-01-cover-4x5", SIZES)
