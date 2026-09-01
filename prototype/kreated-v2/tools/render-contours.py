#!/usr/bin/env python3
"""
KREATED — capability contours
=============================
Emits the SVG paths for the capabilities section.

This follows OMC's actual capability composition, re-measured live: a few very
large hairline outlines, sparsely placed, bleeding off the LEFT edge, with the
labels floating near them rather than centred inside them. Most of that half of
the page is empty. OMC uses circles; Kreated uses fluid-derived contours, which
is the whole of the brand difference here — the composition is OMC's.

Closed curves from a few low harmonics: organic, but designed, and deterministic.

Usage: python3 tools/render-contours.py
"""
import math
import numpy as np

W, H = 860, 1080          # viewBox; the left ~22% is allowed to bleed off-frame

# x, y, r, label, label-x, label-y, label-anchor
# Deliberately sparse and deliberately uneven. Two bleed off the left edge.
SHAPES = [
    (110, 165, 250, "Web Design & Development", 250, 120, "start"),
    (505, 330, 205, "Website Redesign",         470, 500, "start"),
    (95,  620, 268, "Local SEO",                300, 640, "start"),
    (520, 815, 190, "Google Business Profile",  430, 985, "start"),
    (105, 1010, 175, "Brand Strategy & Identity", 250, 1055, "start"),
]


def blob(cx, cy, r, rng, n=72):
    ks = (2, 3, 5)
    amp = (0.075, 0.048, 0.026)
    ph = [rng.uniform(0, math.tau) for _ in ks]
    return [(cx + r * (1 + sum(a * math.sin(k * t + p) for k, a, p in zip(ks, amp, ph)))
             * math.cos(t),
             cy + r * (1 + sum(a * math.sin(k * t + p) for k, a, p in zip(ks, amp, ph)))
             * math.sin(t))
            for t in (i / n * math.tau for i in range(n))]


def to_path(pts):
    n = len(pts)
    d = "M %.1f %.1f" % pts[0]
    for i in range(n):
        p0, p1 = pts[(i - 1) % n], pts[i]
        p2, p3 = pts[(i + 1) % n], pts[(i + 2) % n]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d += " C %.1f %.1f %.1f %.1f %.1f %.1f" % (c1 + c2 + p2)
    return d + " Z"


rng = np.random.default_rng(31)
for cx, cy, r, label, lx, ly, anchor in SHAPES:
    print('LABEL %s | %d %d %s' % (label, lx, ly, anchor))
    print('PATH  %s' % to_path(blob(cx, cy, r, rng)))
    print()
