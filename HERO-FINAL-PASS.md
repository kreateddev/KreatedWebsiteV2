# KREATED V2 — HERO FINAL PASS

**For:** Claude Code (Opus 5)
**Repo:** `/Users/skylerreyes/Documents/GitHub/KreatedWebsiteV2` · **Prototype:** `prototype/omc-kreated-home/`
**Status:** The hero concept is APPROVED after review against the finished page. This is a refinement pass — the last one. Not a redesign, not a rendering experiment.

---

## 0. Scope fence

The rest of the homepage is done and is not part of this task. Do not touch: anything below the hero, hero copy, the typewriter (behavior, timing, phrases), CTA labels/hierarchy, the 55/45 grid and left column, nav, section order, V1, or the docs. Add NO new rendering technology: no new libraries, shaders, render passes, lighting systems, SSAO, HDRIs, contact shadows, particles, glass, lenses, orbs, or any object other than the mark itself. The monogram alone remains the artwork. Work within the existing renderer (`hero3d.js` + the hero blocks in `index.html`/`styles.css`) by changing values, colors, timing, and layout — not architecture.

## 1. Why this pass (verdict from the art-direction review)

Measured against the finished site, the hero mark is under-presented, not wrong:

- It is the only major visual on the page that respects the safe gutter — the art region measured ~467×467px at 1440 with ~177px of empty canvas to its right, while Services and Work surfaces bleed to the viewport edge.
- Front faces are too dark: measured luminance ~69 vs ~18 canvas — the silhouette reads, the faces go muddy.
- Cobalt is only a hairline edge on a page where cobalt now confidently marks active rows, offer edges, and buttons.
- In a headless capture the live canvas rendered **pixel-identical frames across 12 seconds**. Whether that is environment throttling or near-zero amplitude: if the idle can read as static, it is too subtle.

Direction: **"The mark, at signage scale."** Same object, same renderer — larger, cropped off the right edge like every other major surface on the page, faces lifted, cobalt moved into the extrusion depth, and the split/rejoin promoted to the one clearly-timed signature event.

## 2. Changes — exactly four

### 2.1 Scale + placement (desktop, 1440 reference)

- Grow the hero art region ~1.3–1.35×: target ≈600–640px (from the current ~467px).
- Shift right so the mark's outer arm tips crop **4–8% off the right viewport edge** — a confident crop; every arm must remain identifiable. No arm fully amputated.
- Vertical: align the mark's optical center with the midline of the headline block (the static lines + the rotating line) — roughly 40–60px above true hero-center. Keep clear of the nav.
- The left column, grid split, and copy positions do not move. Watch that the enlarged region never overlaps the headline column at ≤1200px widths — adjust the clamp rather than the grid if it does.

### 2.2 Material / color

- **Front faces:** lift to roughly 2× current luminance — a legible top-lit graphite (judge visually; territory ≈ `#2A3550` lighting down to `#1B2440`). The letterform must read as a surface, not a silhouette.
- **Extrusion side/return faces: cobalt.** `#0A47F0`, shading toward `#08339E` in shadowed returns. This is where the brand color lives — revealed and hidden as the mark breathes in yaw.
- Keep exactly one crisp edge line at `#5B86FF`.
- Ground shadow stays; deepen slightly to seat the larger object.
- Hard caps: no bloom, no glow halos, no neon. Cobalt as planes, not light.

### 2.3 Motion — same three behaviors, retimed

**First: verify the idle actually animates in a real browser.** If the renderer paints once, or amplitude is effectively zero, fix that as part of this pass — that finding gates everything else here.

- **Idle:** one slow breathing rotation — yaw ±6–8°, pitch ±2–3°, ~14s period, eased sine, continuous. Acceptance test: two frames 3 seconds apart must be visibly different at a glance.
- **Split/rejoin — THE signature event, every ~18–22s:** arms ease apart along their own axes 8–12px over ~0.8s → hold one beat (~0.4s) → fast settle back with a barely-there overshoot (~1.5% scale). Heavy and precise, never springy.
- **Light sweep:** fires ONCE per cycle, timed to the rejoin settle (~1s pass). No ambient shimmer between events.
- **Cursor:** damped attraction only — up to ±3° toward the pointer, seconds-scale easing; releases to idle when the cursor leaves. Fine pointers only.
- **Reduced motion:** the composed, rejoined pose, statically lit, cobalt sides visible — at the new scale/colors. No-JS/canvas-failure fallback unchanged in behavior, just consistent with the new presentation if it's cheap to match.

### 2.4 Mobile (390 reference)

Order unchanged (copy + CTAs first, artwork below). The mark renders LARGE in its band — a wide crop with the arms clipping both side edges slightly, never a small centered logo in a letterbox. Same lifted faces and cobalt returns. Static or minimal breathing; no cursor logic; keep it light.

## 3. Validation

1. Real-browser check that idle motion is visible (see 2.3).
2. Screenshots at 1440: idle, mid-split, rejoin + sweep moment.
3. Screenshot at 390.
4. Reduced-motion screenshot (composed pose).
5. No horizontal overflow at 1440/768/390; no console errors.
6. Typewriter, CTAs, and left column pixel-unchanged.
7. Nothing below the hero modified — verify by diff.

## 4. Report back

- The actual values changed (scale, offsets, colors, timings) and where.
- Whether the idle was in fact animating before this pass, and what was wrong if not.
- The three hero screenshots + mobile.
- Confirmation: no new tech, nothing below the hero touched, V1 untouched, nothing pushed or deployed.

**Final rule:** this pass finishes the hero. If something still looks off after these four changes, report it with a screenshot — do not open a new exploration.
