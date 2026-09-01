#!/usr/bin/env python3
"""
KREATED — Work reveal mask
==========================
The one fluid-derived asset still in the live prototype.

It shapes the bottom edge of the Work photograph so the picture ends in a
liquid contour instead of a straight line, which doubles as the transition into
the next section. Luminance is never touched: the mask value lives in ALPHA, so
it needs no mask-mode and behaves identically in every engine, and the
photograph is only shaped — never recoloured, blurred or obscured.

Usage: python3 tools/render-mask.py
"""
import os
import numpy as np
from PIL import Image
from scipy import ndimage

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                   'assets', 'img')


def smooth_noise(shape, sigma, rng):
    n = ndimage.gaussian_filter(rng.standard_normal(shape), sigma)
    return n / (np.abs(n).max() + 1e-9)


def main():
    os.makedirs(OUT, exist_ok=True)
    rng = np.random.default_rng(77)
    w, h = 1400, 900
    yy, _ = np.mgrid[0:h, 0:w].astype(float)
    dy = smooth_noise((h, w), 150, rng) * 46
    edge = (yy + dy) / h
    contour = (smooth_noise((h, w), 170, rng) * 0.26
               + smooth_noise((h, w), 70, rng) * 0.09)
    m = np.clip((0.82 - edge + contour) / 0.022, 0, 1)
    z = np.zeros_like(m)
    p = os.path.join(OUT, 'mask-work.png')
    Image.fromarray(np.uint8(np.dstack([z, z, z, m]) * 255), 'RGBA').save(
        p, optimize=True)
    print('%s  %.0f KB' % (p, os.path.getsize(p) / 1024))


if __name__ == '__main__':
    main()
