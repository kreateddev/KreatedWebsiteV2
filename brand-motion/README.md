# Kreated brand motion

Twenty-seven short animations built from the K mark. Each one shows the mark doing something a customer does: searching, finding, calling, choosing. They are made for social posts, decks, email and the website. This folder is **not deployed**; it is the studio that produces the files.

| Moment | Line | Best use |
|---|---|---|
| `face` | Every search ends with a person deciding. | Homepage "who it's for", Reel opener, form thank-you, email signature |
| `pin` | Found at the moment someone nearby is looking. | Local SEO / Google Profile pages, audit report cover |
| `build` | Built from the name up. | Web Design page, proposal deck opener |
| `seven` | Seven ways a business gets chosen. | Services index, "what we do" slide, carousel cover |
| `halves` | One person, start to launch. | About page, founder intro Reel |
| `search` | Built to be found. | Local SEO / Answer Engines pages, Meta ad creative |
| `neon` | Live. And it's yours. | Client launch-day posts and Stories, "now live" emails |
| `before` | Your business is better than your website. | Redesign page, before/after posts |
| `call` | Easy to call. Easy to choose. | Contact page, click-to-call CTA, ad end card |
| `pulse` | (no words, seamless 3s loop) | Loader, 404, avatar, email signature, idle screen |

### The colour set (moments 11 to 20, `kmotion-color.js`)

`open` (coral neon), `stars` (gold), `lighthouse` (dusk), `kaleido` (every hue, wordless loop), `swatch` (full palette on white), `blocks` (multicolor to spectrum), `notify` (violet and magenta), `route` (mint), `unveil` (spectrum and confetti), `chrome` (silver). A colour moment declares its own `bg`, `ink`, `accent` and `wm`. `render.mjs` takes `all`, `blue` or `color` as the moment list.

### The service set (moments 21 to 27, `kmotion-services.js`)

There is one moment per service page, and each caption is a heading already on that page: `webdesign`, `redesign`, `localseo`, `gbp`, `aeo`, `brand`, `social`. `render.mjs` also takes `service` as the moment list.

### On the website

The homepage service cards play these moments live as SVG, with no video files. `kplayer.js` draws any `<span data-kmotion="gbp">` at that element's size and plays it only while it is on screen. `bash sync-site.sh` copies the engine and player into `prototype/kreated-v2/assets/motion/`. Always edit here, then sync; never edit the site copy.

**The organized library for daily use is `../assets/generated/motion/`**: one folder per moment with posters, created by `node render.mjs library`.

## Files

- `exports/feed/` 1080×1350, `exports/story/` 1080×1920 and `exports/wide/` 1920×1080 hold every moment as a 30fps H.264 .mp4 with a 1.6s hold on the final frame.
- `exports/square/` 1080×1080: face, neon, call, pulse.
- `exports/reel-{feed,story,wide}.mp4` plays the nine moments with captions back to back (about 70 seconds).
- `exports/gif/`: 600px square GIFs (face, neon, seven, call), `pulse-sig.gif` (480) and `pulse-160-email.gif` (114 KB, the one to use in an email signature).
- `exports/stills/` holds the contact sheets; `_all-<format>.jpg` shows everything at once.

## Studio

`lab.html` plays all ten at once, switches format, and opens any moment with a scrubber and its export links. Serve the folder, because file:// blocks the scrubber:

```
python3 -m http.server 8790 --directory brand-motion
```

Then open http://localhost:8790/lab.html. There is also a `brand-motion` preview config.

## Rendering

```
node render.mjs video all all          # every moment, feed + story + wide
node render.mjs video face square      # one moment, one format
node render.mjs gif pulse sig          # GIF
node render.mjs stills all feed        # contact sheets
```

This needs Google Chrome and `ffmpeg` (Homebrew). Frames are captured one at a time through headless Chrome, so each render is exact and repeatable. A full `video all all` takes about 2.5 minutes when the formats run in parallel.

## How a moment works

`kmotion.js` holds the ten moments. Each one is `{ title, line, dur, cap:[in,out], build(root, u, W, H) → draw(p) }`, and everything on screen comes from one number `p` running from 0 to 1. The same moment can therefore follow scroll on the site, loop in the studio, or render frame by frame to video. `u` is min(W,H)/1000, so one drawing fits every format. `stage.html?m=<id>&f=<format>&mode=loop|frame` hosts a single moment.

Rules: no invented numbers or claims in captions; clean sans only (General Sans); the mark is never distorted beyond squash-and-stretch on landing.
