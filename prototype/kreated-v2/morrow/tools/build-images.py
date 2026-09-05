#!/usr/bin/env python3
"""MORROW — photography build.

Reads tools/photo-manifest.json, and for every entry:
  1. opens the original from the source directory (never modified),
  2. crops to the slot's aspect ratio around a chosen focal point,
  3. applies the restrained house grade (saturation -8%, blacks lifted to
     ~#231B16, highlights nudged warm, shadows nudged olive),
  4. resizes to each requested width (never upscales),
  5. writes AVIF + WebP + JPEG into assets/img/photo/.

Usage:  python3 tools/build-images.py            # build everything
        python3 tools/build-images.py 01-hero    # one slot

Manifest entry:
  { "slot": "01-hero", "src": "18579918-busranur-aydin.jpg",
    "ar": [16, 9], "focus": [0.5, 0.5], "widths": [2400, 1600, 1000],
    "grade": true, "sat": 0.92 }   # sat is optional; lower it for a frame that runs hot
`focus` is the fractional x/y of the crop window within the original
(0 = left/top, 1 = right/bottom). Optional: `zoom` (1.2 = a 20% tighter
window), `sat` (saturation multiplier), `warm` (+red/-blue in 0–255 units),
and `overlays` — brand elements composited onto the crop:
  {"type":"mark","x":.28,"y":.45,"size":.09,"color":"#F2ECE1","opacity":.92}
  {"type":"text","text":"MON–FRI 6:30 — 15:00","x":.28,"y":.52,"size":.012,
   "anchor":"center","tracking":.08,"font":"JetBrainsMono.ttf"}
Overlays are how the Morrow mark appears on the door glass and the takeaway
cup: disclosed in SOURCES.md, never passed off as photographed.
Sizes/ratios come from assets/img/README.md.
"""
import json, os, sys
from PIL import Image, ImageEnhance, ImageOps, ImageDraw, ImageFont, ImageChops

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, '..')
SRC = os.path.join(ROOT, '..', '..', '..', 'assets', 'photography', 'morrow')
OUT = os.path.join(ROOT, 'assets', 'img', 'photo')

def crop_ar(im, ar, fx, fy, zoom=1.0):
    """Largest window of the given ratio, divided by `zoom` (1.2 = 20% tighter),
    placed at fractional offsets fx/fy within the source."""
    w, h = im.size
    target = ar[0] / ar[1]
    if w / h > target:
        cw, ch = int(round(h * target)), h
    else:
        cw, ch = w, int(round(w / target))
    cw, ch = int(round(cw / zoom)), int(round(ch / zoom))
    x = int(round((w - cw) * fx)); y = int(round((h - ch) * fy))
    return im.crop((x, y, x + cw, y + ch))

def warm(im, amount):
    """Colour-temperature nudge: +amount to red, -amount to blue (0–255 scale)."""
    r, g, b = im.split()
    r = r.point(lambda v: min(255, v + amount)); b = b.point(lambda v: max(0, v - amount))
    return Image.merge('RGB', (r, g, b))

FONTS = os.path.join(HERE, 'fonts')

def draw_mark(size, color, opacity, squash=1.0, stroke=None):
    """The Morrow mark as an RGBA layer: circle + chord 40% from the bottom.
    Drawn at 4x and downsampled for clean edges."""
    S = 4; d = size * S
    layer = Image.new('RGBA', (d, d), (0, 0, 0, 0)); dr = ImageDraw.Draw(layer)
    sw = stroke or max(2, int(round(d * 0.045)))
    pad = sw
    dr.ellipse((pad, pad, d - pad, d - pad), outline=color + (255,), width=sw)
    r = (d - 2 * pad) / 2; cy = d / 2 + 0.2 * r; half = (r ** 2 - (0.2 * r) ** 2) ** 0.5
    dr.line((d / 2 - half, cy, d / 2 + half, cy), fill=color + (255,), width=sw)
    layer = layer.resize((max(1, int(round(size * squash))), size), Image.LANCZOS)
    a = layer.getchannel('A').point(lambda v: int(v * opacity)); layer.putalpha(a)
    return layer

def overlay(im, spec):
    """Composite a brand element onto the graded crop. spec.x/y are fractions
    of the crop; spec.size is a fraction of the crop width."""
    W, H = im.size
    kind = spec['type']; color = tuple(int(spec.get('color', '#231B16').lstrip('#')[i:i + 2], 16) for i in (0, 2, 4))
    op = spec.get('opacity', 1.0)
    if kind == 'mark':
        size = int(round(W * spec['size']))
        layer = draw_mark(size, color, op, spec.get('squash', 1.0))
        x = int(round(W * spec['x'] - layer.width / 2)); y = int(round(H * spec['y'] - layer.height / 2))
    elif kind == 'text':
        font = ImageFont.truetype(os.path.join(FONTS, spec.get('font', 'JetBrainsMono.ttf')), int(round(W * spec['size'])))
        lines = spec['text'].split('\n'); tracking = spec.get('tracking', 0.0)
        tmp = Image.new('RGBA', (W, H), (0, 0, 0, 0)); dr = ImageDraw.Draw(tmp)
        y0 = int(round(H * spec['y'])); lh = int(round(W * spec['size'] * spec.get('leading', 1.6)))
        for i, line in enumerate(lines):
            # letter-by-letter for tracking
            cx = 0; widths = [dr.textlength(ch, font=font) + tracking * W * spec['size'] for ch in line]
            total = sum(widths); anchor = spec.get('anchor', 'left')
            x0 = int(round(W * spec['x'] - (total / 2 if anchor == 'center' else 0)))
            for ch, cw in zip(line, widths):
                dr.text((x0 + cx, y0 + i * lh), ch, font=font, fill=color + (int(255 * op),)); cx += cw
        layer = tmp; x = y = 0
    else:
        return im
    base = im.convert('RGBA')
    if spec.get('blend') == 'multiply':
        # multiply the element's colour into the photo, respecting its alpha
        solid = Image.new('RGBA', base.size, color + (255,))
        mult = ImageChops.multiply(base.convert('RGB'), solid.convert('RGB')).convert('RGBA')
        mask = Image.new('L', base.size, 0); mask.paste(layer.getchannel('A'), (x, y))
        base = Image.composite(mult, base, mask)
    else:
        base.alpha_composite(layer, (x, y))
    return base.convert('RGB')

def grade(im, sat=0.92):
    """One restrained grade for every image so they read as one shoot."""
    im = ImageEnhance.Color(im).enhance(sat)             # saturation -8% by default
    # tone: lift blacks a touch, hold whites just under clip
    lut = [int(round(10 + i * (247 - 10) / 255)) for i in range(256)]
    im = im.point(lut * 3)
    # warm highlights / olive shadows, weighted by luminance
    r, g, b = im.split()
    lum = ImageOps.grayscale(im)
    hi = lum.point(lambda v: max(0, (v - 150)) * 255 // 105)   # 0 below 150 → 255 at 255
    lo = lum.point(lambda v: max(0, (110 - v)) * 255 // 110)   # 255 at 0 → 0 above 110
    r = Image.composite(r.point(lambda v: min(255, v + 5)), r, hi)
    b = Image.composite(b.point(lambda v: max(0, v - 4)), b, hi)
    g = Image.composite(g.point(lambda v: min(255, v + 3)), g, lo)
    b = Image.composite(b.point(lambda v: max(0, v - 3)), b, lo)
    return Image.merge('RGB', (r, g, b))

def build(entry):
    src = os.path.join(SRC, entry['src'])
    im = Image.open(src); im = ImageOps.exif_transpose(im).convert('RGB')
    fx, fy = entry.get('focus', [0.5, 0.5])
    im = crop_ar(im, entry['ar'], fx, fy, entry.get('zoom', 1.0))
    if entry.get('grade', True):
        im = grade(im, entry.get('sat', 0.92))
    if entry.get('warm'):
        im = warm(im, entry['warm'])
    for spec in entry.get('overlays', []):
        im = overlay(im, spec)
    os.makedirs(OUT, exist_ok=True)
    report = []
    for w in entry['widths']:
        if w > im.width:
            report.append(f'  skip {w}w (source is {im.width}w — never upscale)'); continue
        h = int(round(im.height * w / im.width))
        r = im.resize((w, h), Image.LANCZOS)
        base = os.path.join(OUT, f"{entry['slot']}-{w}")
        r.save(base + '.avif', quality=entry.get('avif_q', 58), speed=4)
        r.save(base + '.webp', quality=entry.get('webp_q', 80), method=6)
        r.save(base + '.jpg', quality=entry.get('jpg_q', 82), optimize=True, progressive=True)
        sizes = {ext: os.path.getsize(base + ext) // 1024 for ext in ('.avif', '.webp', '.jpg')}
        report.append(f"  {w}x{h}  avif {sizes['.avif']}K  webp {sizes['.webp']}K  jpg {sizes['.jpg']}K")
    return im.size, report

if __name__ == '__main__':
    manifest = json.load(open(os.path.join(HERE, 'photo-manifest.json')))
    only = sys.argv[1:]
    for e in manifest:
        if only and e['slot'] not in only: continue
        size, rep = build(e)
        print(e['slot'], 'crop', size); print('\n'.join(rep))
