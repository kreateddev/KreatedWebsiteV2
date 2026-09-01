> # ⛔ SUPERSEDED — 2026-08-21
>
> This prototype is **historical reference only.** It does not drive the current
> creative direction and must not be used as a source for new design work.
>
> Superseded by the OMC-inspired direction:
> [`research/OMC_TEARDOWN.md`](../../research/OMC_TEARDOWN.md) ·
> [`concepts/OMC_KREATED_TRANSLATION.md`](../../concepts/OMC_KREATED_TRANSLATION.md) ·
> [`prototype/omc-kreated-home/`](../omc-kreated-home/)
>
> **Kept, not deleted** — the build, the measurements and the findings are real project
> history and some of it is reusable. See the note at the end of this banner for what.
>
> _Reusable:_ the demonstration itself — one client presence across desktop, mobile and search — returns **below the fold** as the *One connected presence* section. This prototype stays the working reference for how that demonstration behaves. The LLEC asset work and the shared-photograph register technique are both still good.
>
> _Retired:_ Every Surface **as a hero system**. It is not the hero and will not be.
>
> ---

# STEP 5 PROTOTYPE — NOT PRODUCTION

**Kreated V2 · EVERY SURFACE hero motion prototype**
Motion discipline: **SET TRUE** — uncover / seat / align.
Built 2026-08-21, revised 2026-08-21 (composition pass). **Review artifact only.**
Not the homepage, not merged, not deployed.

Timing, sequence, CTAs, placeholder-copy status and the two-zone assumption are
unchanged from the first build. The revision was visual composition only.

---

## How to open it

```bash
python3 /Users/skylerreyes/Documents/GitHub/KreatedWebsiteV2/prototype/serve.py 5178
```

Then open <http://localhost:5178>. Reload to replay, or press **R** (a review
affordance only — no replay control is rendered, and nothing in the design depends
on it).

`file://` also works, but the self-hosted `.woff2` faces may be blocked by local
file policy in some browsers, so the server is preferred.

---

## What is real, and where it came from

Nothing on the client side is invented. Every string, colour, typeface and image
below is the real Leak Locators East Coast material captured 2026-08-21.

| Thing | Source |
|---|---|
| Hero photograph | `hero-sunset-as-used-on-site-2400x1800.jpg` from the LLEC asset pack, resized to 1900×1425 |
| Headline, support line, bullets, buttons, phone number, nav | Read off the live desktop capture `homepage-desktop-1440x8903.png` (its hero occupies exactly the top 1440×942, verified) |
| Mobile arrangement | Read off `homepage-mobile-390x13038.png` |
| Media card still | Cropped straight out of the desktop capture at 896,366–1325,601 |
| Logo lockup | `logo-lockup-800x309.png` from the pack |
| Typefaces | Playfair Display 500/600 + Manrope 400/500/600 — the actual `.woff2` files the live site serves, confirmed from its stylesheet (`--font-serif: "Playfair Display"`, `--font-sans: "Manrope"`) and self-hosted here |
| Search-panel values | Skyler's current GBP screenshot: **Leak Locators East Coast · Swimming pool contractor · 4.8 · 22 Google reviews · (919) 633-4975 · Open · Closes 7 PM · Wilmington and nearby areas** |

### Two derived assets, and why

1. **`llec-logo-lockup-light.png`** — the supplied lockup has a near-black
   wordmark. On its own dark navy nav the live site renders that wordmark
   **white**. Only the near-black wordmark pixels were recoloured to white; the
   red "EastCoast", the pipe and the target are untouched. This reproduces the
   live rendering; it does not invent a mark. The unmodified lockup is kept
   alongside as `llec-logo-lockup-dark.png`.
2. **The desktop and mobile surfaces are reconstructed in DOM, not pasted
   screenshots.** This is required by the brief's anti-card device (§5.5): the
   photograph has to run *continuously behind both masks*, which a flattened
   screenshot cannot do — and a flattened screenshot also cannot reflow, which
   is the whole point of the first transition. The reconstruction uses the real
   photo, the real typefaces, the real logo and the real text, laid out to the
   measured coordinates of the captures. The captures remain in the asset pack
   as the fidelity reference.

### The stale review count — suppressed, not replaced

LLEC's live site says **"19 five-star Google reviews"** in its hero bullet list.
Their current Google Business Profile says **22**. Both are true; the site is
simply behind its profile. Showing both put contradictory numbers a few hundred
pixels apart, so that bullet is **omitted** from the reconstructed desktop and
mobile surfaces. Nothing is substituted in its place and no claim is invented —
the list simply runs two items instead of three. The real site is unchanged.

### The GBP capture

`04-gbp-search/` in the asset pack contains no screenshot — the packager could
not capture one (Google serves a CAPTCHA to an automated browser). The values
used here come from **Skyler's own current GBP screenshot supplied with this
task**, which is the newest source and therefore the truth for this prototype.
An older note in the pack mentions *19 reviews*; that is stale. **22** is
current. See "Problems found" below for the one visible consequence.

---

## The shared photograph — how the continuity actually works

This is the mechanism the whole concept rests on, so it is worth stating exactly.

Every `.photo-plane` places the **same image at the same size and position in
stage coordinates**, expressed in whatever local coordinate system its surface
happens to use:

```
photo plane, in stage px:   left -390   top -101.4   1600 × 1200

  desktop page (scale 0.722222, surface at stage 155,0)
      -> left -754.6  top -140.4  2215.4 × 1661.5

  mobile page  (scale 0.50,     surface at stage 0,66.4)
      -> left -780    top -335.6  3200   × 2400

  search      (no page scale,   surface at stage 0,451.4)
      -> left -390    top -552.8  1600   × 1200
```

Measured in the browser at 1440×900, all three render to the **same screen
rect — 197.0, 53.4 · 1476.9 × 1107.7**. Not approximately: identically.

Each surface's `overflow:hidden` is therefore a **window onto one photograph**,
not a second picture. The treatment is deliberately scale-independent — a flat
`opacity` over a flat base colour, no gradients — so the two windows match
exactly at the seam regardless of how differently the two pages are scaled.

While a surface moves, its photo plane **counter-translates by exactly the
inverse**, so the image stays in register through the seat and the align. At
t=2.25s, for instance, the phone sits at `translateY(2.646px)` and its photo at
`translateY(-4.789px)` in page units — which is `-2.646px` in stage units.
The register never breaks at any frame.

Verified by stripping every UI layer and screenshotting the masks alone: the
image is continuous across every seam with no visible discontinuity.

### Making it visible, not just true (revision pass)

Exact register was never the problem — being *noticeable* was. The plane was
re-anchored vertically so the photograph's far shoreline, the sunset band above
it and the dock silhouette all fall at stage y ≈ 435. That is deliberately
chosen: it is simultaneously inside the phone's largest uninterrupted photo band
(page y 704–770, below its CTAs → stage 418.4–451.4) and inside the desktop's
own clear band between its bullet list and its CTA row (page y 563–631 → stage
406.6–455.6). So the horizon crosses the seam **in the open on both sides**, with
no UI over it on either surface.

Two supporting changes: the photograph's opacity went from .165 to .30, so the
water and sunset actually read; and the phone's nav scrim is now held out until
the content arrives, so the mask opens on completely clean photograph — every
other element of the mobile page is already off-mask at its "from" position.

---

## Composition and alignment (stage coordinates)

```
stage 1200 × 685

  desktop   155,   0   1040 × 680.4      dominant, bleeds off the right edge
  mobile      0,  66.4   195 × 385       56.6% of desktop height
  search      0, 451.4   195 × 108       15.9% of desktop height
```

The revision reduced the phone from 215.5×442 to 195×385 and its overlap of the
desktop from 60px to **37px** — enough for the photograph to cross the seam and
no more. The search surface went from a 330×175 bordered panel overlapping two
other surfaces to a 195×108 washed extension sitting flush under the phone, on
its own left edge, with no border, no shadow, no map chip and no action chips.
The composition now carries far more open photograph.

Every edge below was measured in the browser and lands exactly:

| Alignment | Measured at 1440×900 |
|---|---|
| desktop nav rule = phone top edge = `rule--h1` | 208.4 / 208.3 / 208.3 |
| phone left = search left = `rule--v1` | 557.0 / 557.0 / 557.0 |
| phone bottom = search top = `rule--h2` | 563.7 / 563.7 / 563.7 |
| Kreated route row = the CLIENT'S OWN CTA-row bottom | 599.7 / 599.7 |

Overlap: phone∩desktop 37×355. The search touches only the phone, flush along a
shared edge. Nothing floats alone; no equal-sized grid; the desktop bleeds 220px
past the viewport at 1440.

The copy block's alignment is now **felt rather than drawn**: script nudges it so
the Kreated route row sits on exactly the same baseline as LLEC's own CTA row
inside the desktop surface, rather than dragging a hairline across the gutter.
That needs only a ~18px nudge, so the two blocks stay optically balanced; the
earlier version forced a 120px shift and threw the copy off centre. Without
script both are simply centred and `.k-baseline` renders instead — a correct
fallback, not a break.

---

## Motion

| Time | Beat |
|---|---|
| 0.00 | Complete first paint: copy, all three routes, and the desktop surface. Still. |
| 0.00–0.40 | Hold. |
| 0.40–0.88 | Phone-proportioned mask **uncovers** downward, in place, over a photograph already in exact register with the desktop. |
| 0.46–0.88 | Brand block travels out of the desktop nav into the phone — a match-move, starting exactly on top of the desktop logo (which never moves) and handing off with a hard cut. |
| 0.62–1.18 | Content **reflows** to the real mobile layout: headline restacks smaller and centres, support and points centre, media moves below the copy, the two buttons stop sitting side by side and stack full-width, nav resolves to a single compact Call. |
| 0.88–1.20 | **Seat** — one weighted stop, no bounce, holding a 10px residual. |
| 1.20–1.35 | Micro-hold. Nothing scheduled. |
| 1.35–1.77 | Search panel **uncovers**, dealt from the phone's lower edge. |
| 1.40–1.72 | Brand block's third and final hop. |
| 1.35–1.91 | **Seat**, holding a 12px residual. |
| 2.05–2.45 | **Collective align** — residuals resolve together, three hairlines draw taut. **Hard stop.** |

Autoplay once. No loop, no scroll-scrub, no click, no loader, nothing gated.
After resolve the only movement is a 3px transform-only depth response on hover.

Narrow viewports get an independent 880ms entrance: one uncover, one seat.

Everything animated is `transform`, `opacity` or `clip-path`. No layout is
animated. No WebGL, no canvas, no video, no 3D, no dependencies, no build step.

### Two implementation notes worth keeping

- Each moving surface has **one** transform animation spanning seat → hold →
  align, not two. With two, Chrome auto-removes the finished first animation and
  the element snaps back to its CSS value mid-sequence.
- A hidden tab never fires `requestAnimationFrame`, so the sequence must not
  wait on one — otherwise the artifact hangs in its "from" state, invisible. A
  6s failsafe drops straight to the finished composition if anything else stalls.

---

## Reduced motion / no JS / save-data

`prefers-reduced-motion: reduce`, `navigator.connection.saveData`, and
narrow + low-power all render **the finished composition and nothing else**.
The `.js-motion` "from" states are set by a head script that only runs when the
sequence is actually going to play, so the CSS default *is* the final state.
Verified by loading the page with both scripts removed: full composition, all
three surfaces, all hairlines, no partial state at any point.

---

## Files

```
prototype/
  README.md                     isolation notice
  serve.py                      local no-cache static server (review tool)
  every-surface/
    index.html                  markup, real LLEC content, the search panel's SVG map chip
    styles.css                  layout, stage geometry, the "from" states
    motion.js                   stage fitting, baseline alignment, the timeline
    assets/
      llec-hero-sunset.jpg          1900×1425, 284 KB
      llec-hero-media-still.jpg     858×470, 23 KB
      llec-logo-lockup-light.png    derived (see above)
      llec-logo-lockup-dark.png     unmodified
      fonts/*.woff2                 5 faces, 89 KB total
```

Total page weight ~0.5 MB, all local, no external requests, no console errors.

The `?v=` query on the stylesheet and script exists only to defeat the local
review cache.

---

## Known problems and compromises

1. **The desktop surface's photo crop is not the live site's crop.** The phone
   sits at the far left of the composition and the photograph's readable content
   is central, so the shared plane is pushed left and scaled up: the desktop
   panel shows roughly the right 66% of the photograph at about 1.5× the live
   site's zoom, and the horizon sits lower in the panel than on the real site.
   Everything else about the desktop surface matches the capture. This is art
   direction of a crop, not an alteration of content, and the brief asks for "a
   cropped, art-directed view" — but it is a real difference from the live site.

2. **80% of the phone's width now opens over empty background, not over the
   desktop.** That is the direct cost of reducing the overlap to 37px. The
   extraction still reads — the photograph continues leftward out of the site's
   frame into a new surface — but the mask is no longer mostly "a hole cut in the
   desktop" the way it was at 60px of overlap. Overlap and extraction pull
   against each other; this build is set where Skyler asked for it.

3. **The clean-photo moment during extraction is short and dark.** Holding the
   phone's nav scrim out means the mask opens on pure photograph, but the
   approved timeline starts the reflow at 0.62s, by which point the mask is only
   ~42% open — and that upper part of the frame is night sky. The effect is
   real but modest. Starting the reflow later would strengthen it, and that would
   mean changing the timing, which was explicitly out of scope.

4. **The search surface is small.** At 15.9% of the desktop's height its type
   runs 8–11.5px at stage scale. Quiet was the instruction, and it is legible at
   1280 and above, but it is close to the floor.

5. **The photo treatment is lighter than the live site.** The real hero is
   crushed very dark — a bright sunset pixel renders around RGB 45,41,45. This
   sits at .30 opacity so the water, shoreline and sunset survive at the phone's
   size, which the continuity depends on.

6. **No 4K review.** Judged at 1280, 1440 and 1680 wide, and at 375×812. Above
   1680 the stage caps at scale 1.06 and simply sits in more negative space.

## What this prototype is NOT

No homepage. No nav system. No services, Method, Work, diagnosis, founder,
testimonials, footer, forms or audit flow. No final copy — every Kreated string
is a bracketed placeholder. No typeface decision (system-ui only; Cormorant
Garamond appears nowhere). No palette decision (a placeholder navy inside the
locked family; no accent colour invented). No SEO, analytics or deployment.

One interaction, isolated, for judgement.
