#!/usr/bin/env python3
"""
KREATED FLUID — identity layer generator
========================================
Renders the Kreated fluid system as pre-composed raster art.

Why pre-composed: the morphology this needs — a membrane with packed cellular
pockets, each pocket rimmed in cobalt, the whole thing marbled and grained — is
not something CSS gradients can fake without looking cheap. It is generated
here, deterministically, from a seed, and shipped as a static asset. Motion in
the page is masks and transforms only. No runtime simulation, no WebGL.

What is actually modelled
-------------------------
1. A BAND: an organic diagonal region, the only place fluid exists. Its edge is
   a smooth-noise-perturbed distance field, so the fluid ends in a liquid
   contour rather than a rectangle.
2. DOMAIN WARP: the whole coordinate system is displaced by two low-frequency
   noise fields before anything is evaluated. This is what turns circles into
   organic cells and produces the marbling. It is the single most important
   step for not looking like stock bubbles.
3. CELLS: seeds packed with a Poisson-ish rejection rule, radii weighted toward
   the small end the way real foam is. For each pixel the strongest seed wins,
   giving packed rounded pockets that merge where they touch.
4. BANDING: the cell field is sliced into pocket / rim / membrane by value, the
   same way the reference art reads — dark pocket, bright cobalt rim, white
   membrane between.
5. GRAIN: fine monochrome noise over everything, so it prints rather than
   renders. Kept light — grain is expensive to compress, and this is the
   single biggest lever on the asset's weight.

Usage:  python3 tools/render-fluid.py
Output: assets/fluid/*.webp  (+ the Work mask as PNG)
"""

import os
import numpy as np
from PIL import Image
from scipy import ndimage

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(os.path.dirname(HERE), 'assets', 'fluid')

# ---- palette -----------------------------------------------------------------
MEMBRANE = np.array([242, 245, 249], float)   # white film
MEMBRANE_2 = np.array([176, 188, 205], float) # marbling in the film
POCKET = np.array([5, 8, 14], float)          # the cavity
POCKET_2 = np.array([28, 40, 62], float)      # smoke inside the cavity
COBALT = np.array([10, 71, 240], float)       # #0A47F0 — the identity blue
COBALT_HI = np.array([120, 160, 255], float)  # where the rim catches light


def smooth_noise(shape, sigma, rng):
    n = ndimage.gaussian_filter(rng.standard_normal(shape), sigma)
    return n / (np.abs(n).max() + 1e-9)


def warp(shape, rng, amp, sigma):
    """Two low-frequency displacement fields. This is the marbling."""
    return (smooth_noise(shape, sigma, rng) * amp,
            smooth_noise(shape, sigma, rng) * amp)


def pack_seeds(w, h, rng, n, rmin, rmax, tries=60, clump=0.46, density=None):
    """Tight packing — cells must touch, because foam is cells sharing walls,
    not circles scattered on a field. `clump` below ~0.5 lets them overlap so
    the walls between them become thin.

    `density` is a coarse field in [0,1] that gates acceptance. Without it the
    pockets spread evenly and the result reads as a web of struts; with it they
    clump, and the film is left broad and open in between — which is what the
    reference actually looks like."""
    seeds = []
    dh, dw = (density.shape if density is not None else (1, 1))
    for _ in range(n):
        for _ in range(tries):
            x, y = rng.uniform(-0.14, 1.14) * w, rng.uniform(-0.14, 1.14) * h
            if density is not None:
                gy = min(dh - 1, max(0, int(y / h * dh)))
                gx = min(dw - 1, max(0, int(x / w * dw)))
                if rng.random() > density[gy, gx]:
                    continue
            r = rmin + (rmax - rmin) * (rng.random() ** 2.4)
            ok = True
            for (sx, sy, sr) in seeds:
                if (x - sx) ** 2 + (y - sy) ** 2 < (clump * (r + sr)) ** 2:
                    ok = False
                    break
            if ok:
                seeds.append((x, y, r))
                break
    return seeds


def cell_field(xx, yy, seeds):
    """Top TWO seeds, not one.

    A soap wall forms where two bubbles meet — i.e. where the two strongest
    fields are equal. Tracking the runner-up gives a multiplicatively-weighted
    Voronoi ridge, which is the actual morphology of foam. Returns (best,
    margin): margin is small on a wall and large deep inside a cell."""
    best = np.full(xx.shape, -9.0)
    second = np.full(xx.shape, -9.0)
    for (sx, sy, sr) in seeds:
        v = 1.0 - np.sqrt((xx - sx) ** 2 + (yy - sy) ** 2) / sr
        np.maximum(second, np.minimum(best, v), out=second)
        np.maximum(best, v, out=best)
    return best, best - second


def band_field(xx, yy, w, h, rng, angle=-0.62, width=0.40, sigma=90):
    """The organic diagonal region the fluid occupies."""
    nx, ny = np.cos(angle), np.sin(angle)
    # signed distance to a line through the centre, normalised
    s = ((xx - w * 0.52) * ny - (yy - h * 0.5) * nx) / (w * width)
    s = s + smooth_noise(xx.shape, sigma, rng) * 0.55
    return s


def render(w, h, seed, n_cells, rmin, rmax, warp_amp, band_w, grain=0.032,
           band_sigma=90, cell_warp_sigma=160):
    rng = np.random.default_rng(seed)
    yy, xx = np.mgrid[0:h, 0:w].astype(float)

    # 1. marbling — displace the whole coordinate system
    dx, dy = warp((h, w), rng, warp_amp, cell_warp_sigma)
    dx2, dy2 = warp((h, w), rng, warp_amp * 0.42, cell_warp_sigma * 0.32)
    wx, wy = xx + dx + dx2, yy + dy + dy2

    # 2. the band the fluid lives in
    s = band_field(wx, wy, w, h, rng, width=band_w, sigma=band_sigma)
    band = np.clip(1.0 - np.abs(s) * 1.9, 0.0, 1.0)
    band = ndimage.gaussian_filter(band, 3)
    alpha = np.clip(band * 3.4, 0, 1) ** 0.85

    # 3. cells, evaluated in warped space
    dens = smooth_noise((96, 96), 9, rng) * 0.5 + 0.5
    dens = np.clip((dens - 0.28) / 0.46, 0, 1) ** 0.85
    seeds = pack_seeds(w, h, rng, n_cells, rmin, rmax, density=dens)
    best, margin = cell_field(wx, wy, seeds)
    best = ndimage.gaussian_filter(best, 1.0)
    margin = ndimage.gaussian_filter(margin, 1.0)

    # wall thickness varies the way a drawn line varies, not the way a stroke does
    # 4. banding.
    #    The pocket is INSET inside its cell rather than filling it. That is the
    #    difference between a white film with holes punched through it — the
    #    reference — and a web of white struts, which is what filling each cell
    #    to its wall produces. `best` is distance from a cell's own centre, so
    #    thresholding it shrinks the hole and leaves film all the way round.
    #    `margin` is only used to keep a wall where two cells overlap hard.
    jitter = smooth_noise((h, w), 46, rng) * 0.5 + 0.5
    hole_t = 0.34 + 0.20 * jitter                  # hole size varies cell to cell
    soft = 0.055

    hole = np.clip((best - hole_t) / soft, 0, 1)
    hole = hole * np.clip(margin / 0.045, 0, 1)    # never swallow a shared wall

    # not every pocket is rimmed, and the rims that exist vary in weight
    rim_gate = np.clip(smooth_noise((h, w), 70, rng) * 1.5 + 0.62, 0, 1)
    rim = np.clip(1.0 - np.abs(best - hole_t) / (soft * 1.5), 0, 1) ** 1.15 * rim_gate
    rim_hi = np.clip(1.0 - np.abs(best - (hole_t + soft * 0.55)) / (soft * 0.5), 0, 1) ** 1.7 * rim_gate
    inner = hole

    marble = smooth_noise((h, w), 26, rng) * 0.5 + 0.5
    smoke = smooth_noise((h, w), 15, rng) * 0.5 + 0.5

    col = (MEMBRANE[None, None, :] * (1 - marble * 0.30)[..., None]
           + MEMBRANE_2[None, None, :] * (marble * 0.30)[..., None])
    pocket_col = (POCKET[None, None, :] * (1 - smoke * 0.55)[..., None]
                  + POCKET_2[None, None, :] * (smoke * 0.55)[..., None])
    col = col * (1 - inner)[..., None] + pocket_col * inner[..., None]
    col = col * (1 - rim)[..., None] + COBALT[None, None, :] * rim[..., None]
    col = col * (1 - rim_hi * 0.42)[..., None] + COBALT_HI[None, None, :] * (rim_hi * 0.42)[..., None]

    # a cobalt fringe where the whole band ends, as in the reference
    edge = np.clip(1.0 - np.abs(band - 0.40) / 0.09, 0, 1) ** 2.2
    col = col * (1 - edge * 0.42)[..., None] + COBALT[None, None, :] * (edge * 0.42)[..., None]

    # 5. grain
    g = rng.standard_normal((h, w)) * (255 * grain)
    col = col + g[..., None]

    rgba = np.dstack([np.clip(col, 0, 255), np.clip(alpha * 255, 0, 255)])
    return Image.fromarray(np.uint8(rgba), 'RGBA')


def main():
    os.makedirs(OUT, exist_ok=True)

    print('hero field …')
    hero = render(w=1680, h=1560, seed=414, n_cells=420, rmin=52, rmax=250,
                  warp_amp=74, band_w=0.42)
    # q76 + lighter grain: 323 KB against 575 KB at q86, and the difference is
    # not visible at the size the field is actually displayed
    hero.save(os.path.join(OUT, 'fluid-hero.webp'), quality=76, method=6)

    print('hero field, mobile crop …')
    mob = render(w=900, h=1000, seed=414, n_cells=230, rmin=44, rmax=200,
                 warp_amp=52, band_w=0.50)
    mob.save(os.path.join(OUT, 'fluid-hero-mobile.webp'), quality=74, method=6)

    # The Work photograph is revealed through a fluid edge rather than a
    # rectangle. This is a mask only — luminance drives CSS mask-image, so the
    # photograph itself is never recoloured or obscured, only shaped.
    print('work reveal mask …')
    rng = np.random.default_rng(77)
    w, h = 1400, 900
    yy, xx = np.mgrid[0:h, 0:w].astype(float)
    dx, dy = warp((h, w), rng, 46, 150)
    # The boundary goes on the BOTTOM edge, not the left. On the left it sits
    # under the scrim and the type, where nobody can see it; on the bottom it is
    # where the photograph meets the next section, so the liquid contour does
    # double duty as the section transition.
    edge = (yy + dy) / h
    contour = (smooth_noise((h, w), 170, rng) * 0.26
               + smooth_noise((h, w), 70, rng) * 0.09)
    m = np.clip((0.80 - edge + contour) / 0.020, 0, 1)
    # the mask value lives in ALPHA, not luminance: alpha masking is the default
    # everywhere, so this needs no mask-mode and behaves the same in every engine
    rgba = np.dstack([np.zeros_like(m), np.zeros_like(m), np.zeros_like(m), m])
    mask = Image.fromarray(np.uint8(rgba * 255), 'RGBA')
    mask.save(os.path.join(OUT, 'mask-work.png'), optimize=True)

    for f in sorted(os.listdir(OUT)):
        print('   %-26s %6.0f KB' % (f, os.path.getsize(os.path.join(OUT, f)) / 1024))


if __name__ == '__main__':
    main()
