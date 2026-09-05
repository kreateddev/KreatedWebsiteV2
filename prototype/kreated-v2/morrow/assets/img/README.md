# Morrow — image slots

**As of 2026-09-03 every slot carries sourced photography** (`photo/`), built
by `tools/build-images.py` from `tools/photo-manifest.json` and the originals
in `KreatedWebsiteV2/assets/photography/morrow/`. Provenance for each image is
in `SOURCES.md`. The labelled placeholders (`placeholder/*.svg`, from
`tools/make-placeholders.py`) are kept for any slot that gets re-shot.

## Rebuilding or replacing a photograph

1. Drop the new original into `assets/photography/morrow/` and record it in
   `SOURCES.md`.
2. Point the slot's `src` at it in `tools/photo-manifest.json`; set `focus`
   (fractional x/y of the crop window) and the `widths` to export.
3. Run `python3 tools/build-images.py <slot>`. It crops to the slot ratio,
   applies the house grade, and writes AVIF/WebP/JPEG at each width.
4. The `<picture>` in `index.html` already references `photo/<slot>-<width>.*`,
   so nothing changes there unless the widths change.

## Swapping in final photography

1. Export the shot as AVIF + WebP + JPEG at the sizes below, named after the
   slot (`01-hero.avif`, `01-hero.webp`, `01-hero.jpg`), into this folder.
2. In `index.html`, find the `<figure data-slot="…">` for that shot and replace
   its `<img>` with a `<picture>`:

   ```html
   <picture>
     <source type="image/avif" srcset="assets/img/01-hero-1600.avif 1600w, assets/img/01-hero-2400.avif 2400w" sizes="100vw">
     <source type="image/webp" srcset="assets/img/01-hero-1600.webp 1600w, assets/img/01-hero-2400.webp 2400w" sizes="100vw">
     <img src="assets/img/01-hero-1600.jpg" width="1600" height="900" alt="…">
   </picture>
   ```
3. Keep the `width`/`height` attributes, the `alt` (written for the final
   image, not the placeholder) and any `style="--pos: …"` object-position hint.
4. For the hero, also update the two `<link rel="preload" as="image">` tags in
   the head (desktop + mobile) so the LCP image is preloaded.

## The shot list (from Creative Direction v1.0 §7)

| Slot | File | Ratio | Export | Notes |
|---|---|---|---|---|
| Hero | `01-hero` | 16:9 | 2400×1350 · ~180 KB AVIF | counter diagonal, cortado at the point of light |
| Hero mobile | `01-hero-mobile` | 4:5 | 1200×1500 | recrop of the hero, centred on the cortado |
| Statement | `02-statement` | 2:5 | 800×2000 | mullion shadow on lime plaster, no product |
| Seasonal 01–04 | `03-season-0N` | 3:4 | 1200×1600 | see §7 for each |
| Bakery A | `04-bakery-a` | 4:5 | 1200×1500 | torn croissant, raking light. **The top ~20% must be a lit area**: the Espresso headline overlaps it on desktop |
| Bakery B | `04-bakery-b` | 1:1 | 1200×1200 | hands scoring a loaf, 4am tungsten |
| Sourcing | `05-sourcing` | 21:9 | 2100×900 | burlap crate / roaster drum — materials, not landscape |
| Room 01 | `06-room-01` | 3:2 | 1800×1200 | long table from the end |
| Room 02 | `06-room-02` | 2:3 | 1000×1500 | window seat with a sun patch |
| Room 03 | `06-room-03` | 2:3 | 1000×1500 | the bar from a customer seat |
| Room 04 | `06-room-04` | 1:1 | 1200×1200 | oak stair detail |
| Room 05 | `06-room-05` | 1:1 | 1200×1200 | terrazzo floor, chair shadow |
| Room 06 | `06-room-06` | 21:9 | 2100×900 | the plain takeaway cup with the mark, shown once (CD §7). Mark composited via manifest `overlays` |
| Exterior | `07-exterior` | 3:4 | 1200×1600 | door + signage mark, 6:45am; cropped to 3:2 on mobile. Mark + hours composited on the glass via `overlays` |
| Bar drinks | `bar-<drink>` | 1:1 | 480×480 | twelve small images for the cursor-follow effect |

Grade: warm highlights, olive-tinted shadows, blacks lifted to `#231B16`,
saturation −10%, −0.3 EV. Film grain is applied in CSS — do not bake it in.
