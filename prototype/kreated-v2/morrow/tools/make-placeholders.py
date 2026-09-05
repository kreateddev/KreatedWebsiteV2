#!/usr/bin/env python3
"""MORROW — development placeholder generator. NOT PRODUCTION ART.

Writes one labelled SVG per photograph the homepage needs, at the final
aspect ratio, into assets/img/placeholder/. Each file reads as shadow +
one shaft of light (the photographic brief) so type contrast and section
geometry can be judged, and carries a mono label so it can never be
mistaken for a finished image. Project rule: missing art is marked, never
faked.

Re-run after editing the SHOTS table:  python3 tools/make-placeholders.py
Swap-in instructions live in assets/img/README.md.
"""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'assets', 'img', 'placeholder')

SHADOW = '#3B372F'   # olive-tinted shadow, never true black
MID    = '#6E6353'
LIGHT  = '#D6C2A3'   # caramel lives in photography only
HI     = '#EADDC6'

# name, width, height, ratio label, brief, light composition
SHOTS = [
    ('01-hero',         1600,  900, '16:9', 'cortado at the point of light, counter diagonal', 'diag'),
    ('01-hero-mobile',  1200, 1500, '4:5',  'hero recrop, centred on the cortado',              'diag-tall'),
    ('02-statement',     800, 2000, '2:5',  'mullion shadow on lime plaster',                   'mullion'),
    ('03-season-01',    1200, 1600, '3:4',  'sorghum cold brew, stoneware tumbler',             'side'),
    ('03-season-02',    1200, 1600, '3:4',  'brown butter latte, olive cup, wool sleeve',       'side-r'),
    ('03-season-03',    1200, 1600, '3:4',  'fig leaf cortado beside a fig leaf',               'top'),
    ('03-season-04',    1200, 1600, '3:4',  'black cardamom chai, steam on dark window',        'low'),
    ('04-bakery-a',     1200, 1500, '4:5',  'torn croissant on parchment, raking light',        'rake'),
    ('04-bakery-b',     1200, 1200, '1:1',  'hands scoring a loaf, 4am tungsten',               'warm'),
    ('05-sourcing',     2100,  900, '21:9', 'green coffee in a burlap-lined crate',             'wide'),
    ('06-room-01',      1800, 1200, '3:2',  'long table from the end, sun path on floor',       'floor'),
    ('06-room-02',      1000, 1500, '2:3',  'window seat with a sun patch',                     'patch'),
    ('06-room-03',      1000, 1500, '2:3',  'the bar from a customer seat',                     'side'),
    ('06-room-04',      1200, 1200, '1:1',  'oak stair detail',                                 'diag'),
    ('06-room-05',      1200, 1200, '1:1',  'terrazzo floor, chair shadow',                     'floor'),
    ('07-exterior',     1200, 1600, '3:4',  'door and signage mark at 6:45am, tree shadow',     'diag-tall'),
]

# small square drink images for the bar's cursor-follow effect
DRINKS = ['espresso', 'macchiato', 'cortado', 'flat-white', 'cappuccino', 'latte',
          'batch-brew', 'pour-over', 'cold-brew', 'flash-chilled', 'iced-cortado',
          'espresso-tonic']


def light(kind, w, h):
    """Return SVG for the lit region. Shadow is 40–60% of every frame."""
    if kind == 'diag':
        return f'<polygon fill="{LIGHT}" points="{w*0.42},{h} {w},{h*0.18} {w},{h}"/>' \
               f'<polygon fill="{HI}" points="{w*0.70},{h} {w},{h*0.55} {w},{h}"/>'
    if kind == 'diag-tall':
        return f'<polygon fill="{LIGHT}" points="{w*0.15},{h} {w},{h*0.35} {w},{h}"/>' \
               f'<polygon fill="{HI}" points="{w*0.55},{h} {w},{h*0.72} {w},{h}"/>'
    if kind == 'mullion':
        return f'<rect fill="{LIGHT}" x="{w*0.30}" y="0" width="{w*0.36}" height="{h}"/>' \
               f'<rect fill="{SHADOW}" x="{w*0.46}" y="0" width="{w*0.04}" height="{h}"/>'
    if kind == 'side':
        return f'<rect fill="{LIGHT}" x="0" y="0" width="{w*0.44}" height="{h}"/>' \
               f'<rect fill="{HI}" x="0" y="{h*0.55}" width="{w*0.22}" height="{h*0.45}"/>'
    if kind == 'side-r':
        return f'<rect fill="{LIGHT}" x="{w*0.58}" y="0" width="{w*0.42}" height="{h}"/>'
    if kind == 'top':
        return f'<rect fill="{LIGHT}" x="0" y="0" width="{w}" height="{h*0.42}"/>' \
               f'<polygon fill="{MID}" points="0,{h*0.42} {w},{h*0.30} {w},{h*0.62} 0,{h*0.70}"/>'
    if kind == 'low':
        return f'<rect fill="{MID}" x="0" y="{h*0.68}" width="{w}" height="{h*0.32}"/>'
    if kind == 'rake':
        # light enters from the top: the bakery headline overlaps this edge
        return f'<polygon fill="{LIGHT}" points="0,0 {w},0 {w},{h*0.42} 0,{h*0.56}"/>' \
               f'<polygon fill="{HI}" points="0,{h*0.16} {w},{h*0.06} {w},{h*0.18} 0,{h*0.30}"/>'
    if kind == 'warm':
        return f'<rect fill="#8A6A48" x="0" y="0" width="{w}" height="{h}"/>' \
               f'<circle fill="#C99A66" cx="{w*0.62}" cy="{h*0.40}" r="{w*0.30}"/>'
    if kind == 'wide':
        return f'<rect fill="{LIGHT}" x="{w*0.30}" y="0" width="{w*0.45}" height="{h}"/>' \
               f'<rect fill="{MID}" x="{w*0.30}" y="{h*0.62}" width="{w*0.45}" height="{h*0.38}"/>'
    if kind == 'floor':
        return f'<polygon fill="{LIGHT}" points="{w*0.20},{h} {w*0.55},{h*0.45} {w*0.85},{h*0.45} {w*0.62},{h}"/>'
    if kind == 'patch':
        return f'<polygon fill="{HI}" points="{w*0.30},{h*0.40} {w*0.85},{h*0.30} {w*0.90},{h*0.62} {w*0.40},{h*0.72}"/>'
    return ''


def svg(name, w, h, ratio, brief, kind, small=False):
    fs = max(14, round(w / 72))
    pad = round(w / 40)
    label = f'AWAITING PHOTOGRAPHY · {name.upper()} · {ratio}'
    lines = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img" aria-label="Placeholder: {brief}">',
             f'<rect width="{w}" height="{h}" fill="{SHADOW}"/>',
             light(kind, w, h),
             f'<rect x="{pad}" y="{pad}" width="{w-2*pad}" height="{h-2*pad}" fill="none" stroke="{HI}" stroke-opacity=".35" stroke-width="1"/>']
    if not small:
        lines.append(f'<text x="{pad*2}" y="{h-pad*2}" font-family="JetBrains Mono, ui-monospace, Menlo, monospace" '
                     f'font-size="{fs}" letter-spacing="{fs*0.08}" fill="{HI}" fill-opacity=".85">{label}</text>')
        lines.append(f'<text x="{pad*2}" y="{h-pad*2-fs*1.6}" font-family="JetBrains Mono, ui-monospace, Menlo, monospace" '
                     f'font-size="{fs}" letter-spacing="{fs*0.08}" fill="{HI}" fill-opacity=".55">{brief.upper()}</text>')
    lines.append('</svg>')
    return '\n'.join(lines)


def main():
    os.makedirs(OUT, exist_ok=True)
    for name, w, h, ratio, brief, kind in SHOTS:
        with open(os.path.join(OUT, name + '.svg'), 'w') as f:
            f.write(svg(name, w, h, ratio, brief, kind))
    kinds = ['side', 'side-r', 'top', 'diag', 'low', 'patch']
    for i, d in enumerate(DRINKS):
        with open(os.path.join(OUT, 'bar-' + d + '.svg'), 'w') as f:
            f.write(svg('bar-' + d, 480, 480, '1:1', d.replace('-', ' '), kinds[i % len(kinds)], small=True))
    print('wrote', len(SHOTS) + len(DRINKS), 'placeholders to', os.path.relpath(OUT))


if __name__ == '__main__':
    main()
