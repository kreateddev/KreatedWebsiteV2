#!/usr/bin/env python3
"""
STEP-5B PROTOTYPE — NOT PRODUCTION
Kreated V2 · APERTURE intro · THE POUR material

Renders THE POUR as a PRE-RENDERED IMAGE SEQUENCE, per the plan of record:
the material is a pre-rendered asset masked into the type, never a runtime
simulation and never a CSS effect.

What is actually simulated
--------------------------
A thick self-levelling coating. A height field starts mid-pour (low-frequency
waviness plus a few pour bulges under the letterforms) and relaxes. Relaxation
is modelled as progressive diffusion, which is what self-levelling physically
is: the finest ripples disappear first, long-wavelength waviness last, and the
motion decays to zero on its own. A slow decaying advection gives the material
somewhere to flow before it settles.

Lighting is one soft raked source plus one broad elongated highlight band that
narrows as the surface levels. The specular lobe is deliberately wide — satin,
not gloss. Colour stays inside the locked family: deep navy body, navy-black in
thickness, graphite in shadow, one controlled off-white highlight.

The aperture
------------
The mask is the KREATED wordmark in Cormorant Garamond. The escape is a true
dilation of the letterforms — a Euclidean distance transform grown outward with
an irregular, softening front — so the material visibly comes OUT of the
strokes rather than a panel arriving beside them.

At rest the surface carries a faint embossed hairline relief aligned to the
layout grid, and a subtle wordmark deboss: the material remembers the letters.

Usage:  python3 tools/render-pour.py
Output: assets/pour/frame-NN.jpg  ·  assets/pour/pour-rest@2x.jpg
"""

import json
import os

import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage

# ---------------------------------------------------------------- geometry --
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, 'assets', 'pour')
FONT = os.path.join(ROOT, 'assets', 'fonts', 'CormorantGaramond-Light.ttf')

W, H = 800, 620          # panel design size (CSS px at the 1440 reference width)
SS = 2                   # internal supersample
IW, IH = W * SS, H * SS

WORDMARK = 'KREATED'
WM_TARGET_W = 624        # CSS px — sized to fit the visible panel, not cropped
WM_LEFT = 58             # CSS px, from panel left
WM_TRACK = 0.18          # em
WM_CENTER_Y = 298        # CSS px, from panel top

# ------------------------------------------------------------ palette (locked)
BG        = np.array([11, 18, 30], dtype=np.float64)    # page field
NAVY_BODY = np.array([40, 66, 108], dtype=np.float64)   # deep navy
NAVY_DEEP = np.array([8, 15, 27], dtype=np.float64)     # navy-black in thickness
GRAPHITE  = np.array([52, 62, 78], dtype=np.float64)    # shadow side
OFFWHITE  = np.array([226, 233, 243], dtype=np.float64) # the one highlight

# ---------------------------------------------------------------- timeline --
# Non-uniform: the escape is the fastest-moving beat and gets the most frames.
TIMES = ([0.000, 0.090, 0.180, 0.270]                       # 0.00–0.35 hold
         + [0.350 + 0.050 * i for i in range(15)]           # 0.35–1.05 escape
         + [1.100, 1.190, 1.280, 1.370, 1.450])             # 1.05–1.45 settle
T_END = TIMES[-1]
T_ESCAPE_IN, T_ESCAPE_OUT = 0.35, 1.05
T_RELIEF_IN = 1.05


def smoothstep(edge0, edge1, x):
    t = np.clip((x - edge0) / (edge1 - edge0 + 1e-9), 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)


# ------------------------------------------------------- the aperture mask --
def letterform_alpha():
    """KREATED in Cormorant Garamond, tracked, as an antialiased alpha field."""
    # solve for the size that makes the tracked wordmark exactly WM_TARGET_W
    probe = ImageFont.truetype(FONT, 100 * SS)
    unit = (sum(probe.getlength(c) for c in WORDMARK)
            + WM_TRACK * 100 * SS * (len(WORDMARK) - 1)) / (100 * SS)
    size = int(round(WM_TARGET_W * SS / unit))

    font = ImageFont.truetype(FONT, size)
    track = WM_TRACK * size
    advances = [font.getlength(ch) for ch in WORDMARK]

    img = Image.new('L', (IW, IH), 0)
    d = ImageDraw.Draw(img)
    x = WM_LEFT * SS
    asc, desc = font.getmetrics()
    y = WM_CENTER_Y * SS - (asc - desc) / 2.0
    for ch, adv in zip(WORDMARK, advances):
        d.text((x, y), ch, font=font, fill=255)
        x += adv + track
    return np.asarray(img, dtype=np.float64) / 255.0


# -------------------------------------------------------- the height field --
def smooth_noise(shape, sigma, rng):
    n = rng.standard_normal(shape)
    n = ndimage.gaussian_filter(n, sigma)
    return n / (np.abs(n).max() + 1e-9)


def build_initial_height(mask):
    rng = np.random.default_rng(20260821)
    h = np.zeros((IH, IW))
    for sigma, weight in ((5 * SS, 0.22), (13 * SS, 0.42), (32 * SS, 0.78), (70 * SS, 1.0)):
        h += weight * smooth_noise((IH, IW), sigma, rng)
    h /= np.abs(h).max()

    # pour bulges — where the material is being fed in, under the wordmark band
    yy, xx = np.mgrid[0:IH, 0:IW].astype(np.float64)
    for cx, cy, amp, sig in ((0.24, 0.46, 1.5, 0.16), (0.55, 0.50, 1.15, 0.20),
                             (0.80, 0.44, 0.95, 0.14)):
        h += amp * np.exp(-(((xx - cx * IW) ** 2 + (yy - cy * IH) ** 2)
                            / (2.0 * (sig * IW) ** 2)))
    h -= h.mean()
    return h / (np.abs(h).max() + 1e-9)


def build_relief(mask):
    """Embossed hairline relief + wordmark deboss, present only at rest."""
    r = np.zeros((IH, IW))
    # hairlines on the layout grid — the same rules the composition uses
    for y_css, strength in ((150, 0.9), (452, 1.0), (556, 0.5)):
        y = int(y_css * SS)
        half = max(1, int(0.9 * SS))
        r[max(0, y - half):y + half, :] += strength
    r = ndimage.gaussian_filter(r, 0.7 * SS) * 0.21
    # the material remembers the letters
    r -= ndimage.gaussian_filter(mask, 1.2 * SS) * 0.020
    return r


# -------------------------------------------------------------- shading -----
def shade(h, t):
    u = np.clip(t / T_END, 0.0, 1.0)

    gy, gx = np.gradient(h)
    strength = 34.0 * SS
    nx, ny = -gx * strength, -gy * strength
    inv = 1.0 / np.sqrt(nx * nx + ny * ny + 1.0)
    nx, ny, nz = nx * inv, ny * inv, inv

    # one soft raked source, low elevation
    L = np.array([-0.58, -0.46, 0.34])
    L /= np.linalg.norm(L)
    diffuse = np.clip(nx * L[0] + ny * L[1] + nz * L[2], 0.0, 1.0)

    Hv = L + np.array([0.0, 0.0, 1.0])
    Hv /= np.linalg.norm(Hv)
    ndh = np.clip(nx * Hv[0] + ny * Hv[1] + nz * Hv[2], 0.0, 1.0)
    spec = ndh ** 13.0                      # broad lobe: satin, never gloss

    # the elongated highlight band — narrows and steadies as the surface levels
    yy, xx = np.mgrid[0:IH, 0:IW].astype(np.float64)
    axis = (yy / IH) - 0.30 * (xx / IW) - 0.30
    width = (0.30 - 0.11 * u)
    band = np.exp(-(axis / width) ** 2)

    thickness = np.clip(h * 0.5 + 0.5, 0.0, 1.0)

    col = (NAVY_BODY[None, None, :] * (0.52 + 0.56 * diffuse)[..., None]
           + (NAVY_DEEP - NAVY_BODY)[None, None, :] * (thickness * 0.52)[..., None]
           + GRAPHITE[None, None, :] * ((1.0 - diffuse) * 0.20)[..., None]
           + OFFWHITE[None, None, :] * (spec * (0.20 + 0.86 * band))[..., None]
           + OFFWHITE[None, None, :] * (band * diffuse * 0.13)[..., None])
    return np.clip(col, 0, 255)


# ------------------------------------------------------------ the escape ----
# The material does NOT dilate the letterforms. Growing a letter outward by an
# even distance inflates it into rounded gel — which is slime, and slime is
# banned. What a thick coating actually does when a cavity overflows is spread
# as a SHEET: the letters keep their own edges and are simply submerged as the
# sheet widens. So the escape is a sheet growing out of the wordmark's band,
# with an undulating viscous edge, unioned with the crisp letterforms.

WORD_MID_Y = 298.0        # CSS px, the wordmark's optical centre in the panel
SHEET_H0 = 14.0           # the ribbon it starts as, hidden inside the letters
SHEET_H1 = 332.0          # enough to reach both panel edges from WORD_MID_Y
SHEET_X0L, SHEET_X0R = 150.0, 590.0
SHEET_X1L, SHEET_X1R = -60.0, 880.0


def escape_front(t):
    """How far the pour has run, 0..1, and its shape parameters."""
    if t <= T_ESCAPE_IN:
        return None
    p = smoothstep(T_ESCAPE_IN, T_ESCAPE_OUT, t)
    half = (SHEET_H0 + (SHEET_H1 - SHEET_H0) * (p ** 1.25)) * SS
    xl = (SHEET_X0L + (SHEET_X1L - SHEET_X0L) * (p ** 0.85)) * SS
    xr = (SHEET_X0R + (SHEET_X1R - SHEET_X0R) * (p ** 0.85)) * SS
    return p, half, xl, xr


def _edges(shape, wave, t):
    """Top/bottom of the spreading sheet, with a viscous undulating edge."""
    p, half, xl, xr = escape_front(t)
    amp = (26.0 * SS) * (1.0 - p) ** 0.7
    mid = WORD_MID_Y * SS
    top = mid - half - wave[0] * amp
    bot = mid + half + wave[1] * amp
    return p, top, bot, xl, xr


def aperture_alpha(mask, wave, t):
    if escape_front(t) is None:
        return mask                                   # the crisp letterforms
    p, top, bot, xl, xr = _edges(mask.shape, wave, t)
    yy = np.arange(mask.shape[0], dtype=np.float64)[:, None]
    xx = np.arange(mask.shape[1], dtype=np.float64)[None, :]
    soft = (2.6 - 1.6 * p) * SS
    a = (smoothstep(top - soft, top + soft, yy)
         * smoothstep(bot + soft, bot - soft, yy)
         * smoothstep(xl - soft, xl + soft, xx)
         * smoothstep(xr + soft, xr - soft, xx))
    return np.maximum(mask, a)                        # letters are never lost


def leading_bead(mask, wave, t):
    """The slightly raised bead a self-levelling coating carries at its front.

    It catches the raked light, which is what makes the advancing edge read as
    liquid rather than as a shape. It flattens as the surface levels."""
    e = escape_front(t)
    if e is None or e[0] >= 0.999:
        return 0.0
    p, top, bot, xl, xr = _edges(mask.shape, wave, t)
    yy = np.arange(mask.shape[0], dtype=np.float64)[:, None]
    xx = np.arange(mask.shape[1], dtype=np.float64)[None, :]
    w = 9.0 * SS
    ridge = (np.exp(-((yy - top) / w) ** 2) + np.exp(-((yy - bot) / w) ** 2)
             + 0.7 * np.exp(-((xx - xl) / w) ** 2) + 0.7 * np.exp(-((xx - xr) / w) ** 2))
    return (0.26 * (1.0 - p) ** 0.85) * np.clip(ridge, 0.0, 1.0)


def main():
    os.makedirs(OUT, exist_ok=True)
    print('rendering THE POUR …')

    mask = letterform_alpha()
    solid = mask > 0.5
    rng = np.random.default_rng(7)
    # one low-frequency profile per sheet edge — the front undulates, it does
    # not ripple or fizz
    wave = [ndimage.gaussian_filter1d(rng.standard_normal(IW), 90.0 * SS)
            for _ in range(2)]
    wave = [w / (np.abs(w).max() + 1e-9) for w in wave]

    h0 = build_initial_height(mask)
    relief = build_relief(mask)

    manifest = []
    for i, t in enumerate(TIMES):
        u = np.clip(t / T_END, 0.0, 1.0)

        # self-levelling: progressive diffusion + decaying drift, motion -> 0
        drift = (1.0 - np.exp(-3.2 * u))
        hs = ndimage.shift(h0, (18.0 * SS * drift, -30.0 * SS * drift),
                           order=1, mode='nearest')
        sigma_c = 2.0 * SS + 118.0 * SS * (u ** 1.65)
        amp = (1.0 - u) ** 0.85
        h = ndimage.gaussian_filter(hs, sigma_c) * amp

        h = h + relief * smoothstep(T_RELIEF_IN, T_END, t)
        h = h + leading_bead(mask, wave, t)

        rgb = shade(h, t)
        a = aperture_alpha(mask, wave, t)[..., None]

        # RGBA, not composited onto the field: the aperture must paint ONLY the
        # material. A baked-in background would put a faint rectangle on the
        # page at 0.00s, before any panel is supposed to exist.
        rgba = np.dstack([rgb, np.clip(a[..., 0] * 255.0, 0, 255)])
        img = Image.fromarray(np.uint8(np.clip(rgba, 0, 255)), 'RGBA')
        small = img.resize((W, H), Image.LANCZOS)
        name = 'frame-%02d.webp' % i
        small.save(os.path.join(OUT, name), quality=80, method=5)
        manifest.append({'file': name, 't': round(t, 3)})
        print('  %-15s t=%.3fs' % (name, t))

    # the resting still, at 2x — this is the reduced-motion / no-JS / mobile state
    img.convert('RGB').save(os.path.join(OUT, 'pour-rest@2x.jpg'), quality=86,
                            optimize=True, progressive=True, subsampling=0)

    # the wordmark carrying a static material fill, at 2x, for the mobile
    # treatment (mobile gets no escape choreography — the filled name alone
    # carries the idea). Cropped from the first frame, so it is literally the
    # same material, on the same page field.
    ys, xs = np.where(solid)
    pad = 10 * SS
    box = (max(0, xs.min() - pad), max(0, ys.min() - pad),
           min(IW, xs.max() + pad), min(IH, ys.max() + pad))
    rgb0 = shade(ndimage.gaussian_filter(h0, 2.0 * SS), 0.0)
    a0 = aperture_alpha(mask, wave, 0.0)[..., None]
    first = np.dstack([rgb0, np.clip(a0[..., 0] * 255.0, 0, 255)])
    Image.fromarray(np.uint8(np.clip(first, 0, 255)), 'RGBA').crop(box).save(
        os.path.join(OUT, 'wordmark-pour@2x.webp'), quality=92, method=5)
    print('  wordmark crop %dx%d' % (box[2] - box[0], box[3] - box[1]))

    with open(os.path.join(OUT, 'manifest.json'), 'w') as fh:
        json.dump({'width': W, 'height': H, 'frames': manifest,
                   'duration': T_END}, fh, indent=1)
    print('done ->', OUT)


if __name__ == '__main__':
    main()
