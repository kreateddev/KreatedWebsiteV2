#!/usr/bin/env python3
"""
KREATED FLUID FIELD — the art direction layer
=============================================
Replaces render-fluid.py / render-cells.py, which read the references as a
system to generate rather than artwork to compose, and produced an evenly
distributed cellular texture with no composition. See
research/OMC_FIDELITY_CORRECTION.md.

What the references actually are: broad continuous fields, stretched membranes,
marbling, soft diffusion, big negative space, one strong gesture, editorial
crop. Not cells. Not outlines. Not a pattern.

So this renders ONE form, composed, not a system tiled across a band:

1. GESTURE — a handful of large blobs placed along a single sweeping spine.
   This is the composition, and it is deliberately simple; OMC's hero is one
   ring, and one shape is what reads at scale.
2. STRETCH — the field is scaled anisotropically before evaluation, so the
   forms pull along the spine rather than sitting as round masses. This is what
   makes it read as a membrane under tension instead of a cloud.
3. MARBLE — two octaves of domain warp displace everything. The low octave
   bends the whole gesture; the high one gives the edges their liquid quality.
4. DIFFUSE — the density is mapped through a soft ramp: navy haze, cobalt body,
   white where it is thickest. Wide transitions, because diffusion is the point.
5. GRAIN — light. It is also the biggest lever on file size.

Deterministic from a seed. Static art; the page only masks and crops it.

Usage:  python3 tools/render-field.py
Output: assets/fluid/field-hero.webp, field-hero-mobile.webp,
        field-services.webp, mask-work.png
"""

import os
import numpy as np
from PIL import Image
from scipy import ndimage

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(os.path.dirname(HERE), 'assets', 'fluid')

NAVY_HAZE = np.array([18, 34, 78], float)     # where the ink is thinnest
COBALT = np.array([10, 71, 240], float)       # #0A47F0 — the identity blue
COBALT_HI = np.array([96, 148, 255], float)   # the lit side of a fold
WHITE = np.array([238, 243, 250], float)      # where it piles up


def smooth_noise(shape, sigma, rng):
    n = ndimage.gaussian_filter(rng.standard_normal(shape), sigma)
    return n / (np.abs(n).max() + 1e-9)


def gesture(h, w, rng, spine, blobs, stretch):
    """One sweeping form: a few large masses strung along a single spine.

    `spine` is a list of (x, y) in 0..1. Masses are placed along it with
    varying weight, then the whole field is stretched along the spine's axis so
    the result pulls rather than pools."""
    yy, xx = np.mgrid[0:h, 0:w].astype(float)
    ang = np.arctan2(spine[-1][1] - spine[0][1], spine[-1][0] - spine[0][0])
    ca, sa = np.cos(-ang), np.sin(-ang)

    field = np.zeros((h, w))
    for i in range(blobs):
        t = i / max(1, blobs - 1)
        # position along the spine, with a little lateral wander
        k = t * (len(spine) - 1)
        i0, fr = int(k), k - int(k)
        p0, p1 = spine[i0], spine[min(i0 + 1, len(spine) - 1)]
        cx = (p0[0] + (p1[0] - p0[0]) * fr) * w + rng.normal(0, 0.035 * w)
        cy = (p0[1] + (p1[1] - p0[1]) * fr) * h + rng.normal(0, 0.035 * h)
        r = (0.065 + 0.075 * rng.random()) * w
        wgt = 0.55 + 0.75 * rng.random()

        dx, dy = xx - cx, yy - cy
        # rotate into spine space and stretch, so masses elongate along it
        rx = (dx * ca - dy * sa) / stretch
        ry = (dx * sa + dy * ca)
        field += wgt * np.exp(-(rx * rx + ry * ry) / (2 * r * r))
    return field / (field.max() + 1e-9)


def render(w, h, seed, warp=0.30, grain=0.024, bands=None, edge_soft=0.16):
    """A continuous banded flow, cropped by the frame — reference 3's language.

    The earlier attempts built an isolated silhouette and had to get that
    silhouette right, which is where they failed: an isolated soft mass on a
    dark page reads as light, not ink. Here the field FILLS the crop and the
    frame does the cropping, the way a detail of a marbled sheet would. There
    is no silhouette to get wrong; the composition is in the flow and the crop.
    """
    rng = np.random.default_rng(seed)
    yy, xx = np.mgrid[0:h, 0:w].astype(float)
    m = min(w, h)

    # a smooth base gradient across the frame, so the bands have a direction
    base = (xx / w) * 0.62 + (yy / h) * 0.38

    # marbling: displace it hard, twice, then once more finely
    for sigma, amp in ((m * 0.42, 0.52), (m * 0.17, 0.26), (m * 0.06, 0.09)):
        dx = smooth_noise((h, w), sigma, rng) * (warp * amp * w)
        dy = smooth_noise((h, w), sigma, rng) * (warp * amp * h)
        base = ndimage.map_coordinates(
            base, [np.clip(yy + dy, 0, h - 1), np.clip(xx + dx, 0, w - 1)],
            order=1, mode='nearest')

    d = base - base.min()
    d = d / (d.max() + 1e-9)
    d = ndimage.gaussian_filter(d, m * 0.006)

    # tonal bands, in order across the flow. Wide, soft, overlapping — the
    # quality wanted is diffusion, so no hard steps.
    if bands is None:
        bands = [(0.00, NAVY_HAZE), (0.30, COBALT), (0.52, COBALT_HI),
                 (0.66, WHITE), (0.82, COBALT), (1.00, NAVY_HAZE)]
    col = np.tile(bands[0][1], (h, w, 1)).astype(float)
    for (stop, c) in bands[1:]:
        prev = max(0.0, stop - 0.24)
        t = np.clip((d - prev) / (stop - prev + 1e-9), 0, 1)[..., None]
        col = col * (1 - t) + np.array(c, float)[None, None, :] * t

    col += rng.standard_normal((h, w))[..., None] * (255 * grain)

    # the crop's own edge is soft and organic on the left, so the field does not
    # end in a straight line where it meets the page
    ex = xx / w + smooth_noise((h, w), m * 0.22, rng) * 0.20
    crop = np.clip((ex - 0.02) / edge_soft, 0, 1)

    # NEGATIVE SPACE, inside the artwork as well as around it. The tonal
    # sequence starts and ends on the navy stop, so those zones are dropped to
    # transparent and the page shows through the field. Without this the crop is
    # a solid blue rectangle, which floods the page — and the references are
    # mostly empty, not mostly ink.
    pres = np.clip(np.minimum(d, 1.0 - d) / 0.20, 0, 1) ** 0.85
    alpha = crop * pres

    rgba = np.dstack([np.clip(col, 0, 255), np.clip(alpha * 255, 0, 255)])
    return Image.fromarray(np.uint8(rgba), 'RGBA')


def main():
    os.makedirs(OUT, exist_ok=True)

    # HERO — one gesture sweeping top-right to bottom-left, cropped so it runs
    # off two edges the way OMC's ring does.
    print('hero field …')
    render(1240, 1560, seed=1207, warp=0.30).save(os.path.join(OUT, 'field-hero.webp'), quality=80, method=6)

    print('hero field, mobile crop …')
    render(760, 900, seed=1207, warp=0.30, edge_soft=0.22).save(os.path.join(OUT, 'field-hero-mobile.webp'), quality=78, method=6)

    # SERVICES — a much quieter crop, used only as a faint edge intrusion behind
    # the capability contours. Secondary by design.
    print('services edge …')
    render(900, 1100, seed=88, warp=0.28, edge_soft=0.30).save(os.path.join(OUT, 'field-services.webp'), quality=76, method=6)

    # WORK — the photograph's bottom edge, so it ends in a liquid contour that
    # doubles as the transition into the next section. Mask only: alpha carries
    # the value, so it needs no mask-mode and behaves the same in every engine.
    print('work reveal mask …')
    rng = np.random.default_rng(77)
    w, h = 1400, 900
    yy, _ = np.mgrid[0:h, 0:w].astype(float)
    dy = smooth_noise((h, w), 150, rng) * 46
    edge = (yy + dy) / h
    contour = (smooth_noise((h, w), 170, rng) * 0.26
               + smooth_noise((h, w), 70, rng) * 0.09)
    m = np.clip((0.80 - edge + contour) / 0.020, 0, 1)
    z = np.zeros_like(m)
    Image.fromarray(np.uint8(np.dstack([z, z, z, m]) * 255), 'RGBA').save(
        os.path.join(OUT, 'mask-work.png'), optimize=True)

    for f in sorted(os.listdir(OUT)):
        print('   %-26s %6.0f KB' % (f, os.path.getsize(os.path.join(OUT, f)) / 1024))


if __name__ == '__main__':
    main()
