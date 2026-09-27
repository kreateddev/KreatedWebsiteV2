# Service moments: version 1 (saved 2026-09-27)

This is the first version of the seven service moments and of the homepage service cards that play them, saved before the second creative pass.

- `engine/kmotion-services.js`: the v1 moments. `kplayer.js` and `lab.html` are as they were at the time.
- `site/`: the homepage files as they were. `index.html` also holds that day's other uncommitted homepage work (the fit cards and the reviews carousel).
- `*-feed-sheet.jpg`: v1 contact sheets.
- The v1 videos, posters and GIFs are real copies in `assets/generated/motion/_archive/services-v1/`.

## To go back to v1

```
cp brand-motion/versions/services-v1/engine/kmotion-services.js brand-motion/
bash brand-motion/sync-site.sh
```

That puts v1 art back on the homepage cards; the card layout does not change between versions. To bring back the v1 videos too, re-render them with `node brand-motion/render.mjs video service all`, then `node brand-motion/render.mjs library`.
