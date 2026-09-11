# Held pages — built, deliberately NOT published

Netlify publishes `prototype/kreated-v2/` only, so nothing in this folder is live.

## `work-kreated.html` → `/work/kreated/`

Kreated's own site, recorded the way a client case is: the first week of Search Console
data (2–8 Sep 2026: 220 impressions, 8 clicks, 42 queries), the 1 Sep launch and the 6 Sep move
to Wilmington, in the case studies' dated-record format.

**HELD by owner decision, 2026-09-11:** "I want to wait for a stronger reading, then we can reveal
the first weak weeks." Publish it when a stronger reading exists, **with the weak first week kept
as the first entry** — the point of the page is that nothing is left out.

To publish: add the new reading as a dated entry, move the file to
`prototype/kreated-v2/work/kreated/index.html`, link it from the "What these show" section of
`/work/` (a link, not a fifth card), and add it to `sitemap.xml`. `build_work_kreated.py` is the
generator it was built with (it copies the header and footer from the Rare Raleigh case study).
