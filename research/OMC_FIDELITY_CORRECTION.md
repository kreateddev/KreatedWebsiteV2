# OMC FIDELITY CORRECTION

**Date:** 2026-08-22
**Re-inspected live:** <https://www.omc.com/> at 1440×900, full-page capture, after the
fluid pass had already shipped into the prototype.
**Companion to:** [`OMC_TEARDOWN.md`](OMC_TEARDOWN.md) — that document is still accurate.
This one records where the *implementation* drifted from it and why.

---

## 1. What re-inspection actually showed

Three things I had measured but not internalised, and they are the whole correction.

### OMC uses exactly THREE decorative devices on the entire homepage
An orange ring in the hero. A column of hairline circles in capabilities. A blue arc in
the news band. That is all. Each appears **once**, each is **enormous**, each is a
**single simple form** — not a texture, not a system, not a pattern.

### Every one of them is huge and cropped by the frame
The hero ring spans roughly **45% of the viewport width and the full hero height**, and
bleeds off the top and right. The capability circles are **302px each** and bleed off
the *left* edge. Nothing is a corner accent. Nothing is contained.

### The capability section is mostly empty
Left half: near-white, holding a few 302px hairline outlines at maybe 8% opacity, with
capability names in Cormorant italic **floating near them** — not centred inside them
like badges. Right 40%: pill label, h2, serif lead, black pill + arrow. The ratio of
empty space to marks is enormous.

Also confirmed: the Omni band and the Investors band are both **image-led at full
width** — a blurred metallic field with a bleeding card row, and a full-bleed
photograph with type over it. OMC's image scale is much larger than Kreated's was.

---

## 2. Where Kreated drifted

| # | Drift | What it should have been |
|---|---|---|
| 1 | **The fluid became a texture, not a form.** A dense cellular foam patch. | One large, simple, readable shape — the way the orange ring is one shape. |
| 2 | **Scale collapsed.** The hero field ended up a corner accent bleeding one edge. | ~45% of viewport width, full hero height, bleeding two edges. |
| 3 | **The capability section became a diagram.** Five filled pockets packed into one compact centred membrane, labels centred inside them like badges. | Huge, sparse, hairline-only marks bleeding off the left, labels floating in an editorial arrangement, most of the half empty. |
| 4 | **Contrast was too high in the wrong place.** Filled dark pockets with visible outlines read as UI. | OMC's marks are barely there — hairlines at very low opacity. The *type* carries the section. |
| 5 | **Decorative devices multiplied.** Fluid appeared in four places plus 8px pocket-shaped markers. | One device per section at most, and only three on the whole page. |
| 6 | **Image scale was too small.** Work was a compressed band with a lot of UI around it. | OMC gives a photograph an entire section at full bleed. |
| 7 | **The conversion band became SaaS cards.** Two outlined boxes with kickers and arrow buttons. | Editorial, minimal chrome, type-led. |

The root error: **I read the fluid references as a system to generate rather than
artwork to compose.** Reference 1 is a macro photograph with a strong single gesture
and a lot of empty black. I built a procedural cell-packer and then tuned it, which is
how it ended up as an evenly-distributed texture with no composition.

---

## 3. What moves closer to OMC now

- **Hero graphic**: one large fluid field at OMC's ring scale and crop.
- **Capabilities**: rebuilt directly on OMC's composition — big sparse hairline
  contours bleeding off the left, floating Cormorant labels, text block right.
- **Work**: bigger image, less UI around it.
- **Conversion band**: editorial split, minimal chrome, no cards.
- **Decorative count**: down to three devices on the page.

## 4. What stays uniquely Kreated

- Navy-dominant value rhythm, inverted from OMC's white.
- Cobalt `#0A47F0` as the one accent, used selectively.
- The fluid *art direction* — marbling, diffusion, grain, cobalt/white/navy — as the
  material the shapes are made of. OMC uses flat vector; Kreated uses fluid artwork.
  That is the difference in brand, expressed inside OMC's structure.
- General Sans + Cormorant Garamond, with Cormorant kept rare.
- The three conversion routes present in the hero at first paint, which OMC has none of.
- The five service families and the real client work.

## 5. The rule this pass is built on

> **OMC controls the page. Fluid controls the art direction.**

If the fluid ever changes a section's structure, spacing, or scale, it has overstepped.
Its only job is to be what the shapes are made of.
