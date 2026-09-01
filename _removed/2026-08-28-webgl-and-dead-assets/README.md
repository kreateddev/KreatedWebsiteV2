# Removed 2026-08-28 — retired WebGL path + dead assets

This repo is not under version control, so everything deleted in the Launch
Decisions + Cleanup pass is archived here verbatim rather than discarded.
Nothing in this folder is referenced by the running site. It exists only so the
deletion is reversible.

| File | Why it was removed |
|---|---|
| `hero3d.js` | three.js mark renderer. Only ever reached by a dynamic import guarded on `#heroArt`, which the L9 SVG hero does not render. |
| `vendor/` | Vendored three.js + SVGLoader + licence. Imported only by `hero3d.js`. |
| `hero.js` | Pre-cleanup copy, 557 lines. Lines 120-555 were the `markSculpture` comment block and IIFE (Canvas-2D + WebGL renderer). The live typewriter was untouched. |
| `index.html` | Pre-cleanup copy, still containing the `<script type="importmap">` block. |
| `Archive.zip` | Stray archive sitting inside the deliverable folder. |
| `llec-work.jpg`, `llec-work-sm.jpg` | Superseded by the current proof captures. |
| `mask-work.png` | Artefact of a retired render pipeline. |
| `favicon-48.png` | Unused; the `.ico` already carries a 48px entry. |

To restore the WebGL path you would need all of: `hero3d.js`, `vendor/`, the
import map in `<head>`, the `markSculpture` IIFE, and `#heroArt`/`#heroGlass`
elements in the hero markup. Design history is in
`research/OMC_MOTION_TEARDOWN.md`.
