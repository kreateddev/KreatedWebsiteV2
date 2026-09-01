#!/usr/bin/env python3
"""
KREATED FLUID — capability membrane
===================================
Emits the SVG path data for the capabilities section: one irregular membrane
with five pockets in it, one per service family.

Why paths and not raster: each pocket has to be a real link with its own hover
state and its own label, so the geometry has to be addressable. These are
closed curves built from a few low harmonics — organic, but designed, and
deterministic from a seed. Sampled points are converted to cubic Beziers via
Catmull-Rom so the outlines are smooth rather than faceted.

Usage: python3 tools/render-cells.py   (prints path data to paste into index.html)
"""
import math
import numpy as np

W, H = 900, 760

# five pockets, irregular on purpose — a ring would just be the old orbit again
CELLS = [
    ("Web Design & Development", 250, 190, 152),
    ("Website Redesign",         604, 150, 126),
    ("Local SEO",                762, 402, 108),
    ("Google Business Profile",  470, 432, 166),
    ("Brand Strategy & Identity",182, 572, 136),
]


def blob(cx, cy, r, rng, harmonics=(2, 3, 5), amp=(0.085, 0.055, 0.030), n=64):
    """A closed curve = circle + a few low harmonics. Fluid, but designed."""
    phase = [rng.uniform(0, math.tau) for _ in harmonics]
    pts = []
    for i in range(n):
        t = i / n * math.tau
        rr = r * (1 + sum(a * math.sin(k * t + p)
                          for k, a, p in zip(harmonics, amp, phase)))
        pts.append((cx + rr * math.cos(t), cy + rr * math.sin(t)))
    return pts


def to_path(pts, closed=True):
    """Catmull-Rom through the samples, emitted as cubic Beziers."""
    n = len(pts)
    d = "M %.1f %.1f" % pts[0]
    for i in range(n if closed else n - 1):
        p0 = pts[(i - 1) % n]; p1 = pts[i]
        p2 = pts[(i + 1) % n]; p3 = pts[(i + 2) % n]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d += " C %.1f %.1f %.1f %.1f %.1f %.1f" % (c1[0], c1[1], c2[0], c2[1], p2[0], p2[1])
    return d + (" Z" if closed else "")


def membrane(cells, rng):
    """One outline that contains every pocket — the film they sit in."""
    cx = sum(c[1] for c in cells) / len(cells)
    cy = sum(c[2] for c in cells) / len(cells)
    pts = []
    for i in range(96):
        t = i / 96 * math.tau
        dx, dy = math.cos(t), math.sin(t)
        # push out far enough to clear the furthest pocket in this direction
        reach = max((c[1] - cx) * dx + (c[2] - cy) * dy + c[3] * 1.30 for c in cells)
        wob = 1 + 0.045 * math.sin(3 * t + 1.1) + 0.028 * math.sin(5 * t + 2.4)
        pts.append((cx + dx * reach * wob, cy + dy * reach * wob))
    return to_path(pts)


rng = np.random.default_rng(9)
print('<!-- membrane -->')
print('<path class="mem__film" d="%s"/>' % membrane(CELLS, rng))
print()
for i, (label, cx, cy, r) in enumerate(CELLS):
    print('<!-- %s -->' % label)
    print('d="%s"' % to_path(blob(cx, cy, r, rng)))
    print('label anchor: %d %d' % (cx, cy))
    print()
