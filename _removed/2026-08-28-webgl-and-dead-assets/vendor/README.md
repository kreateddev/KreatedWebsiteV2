# assets/vendor/

Vendored, not fetched at runtime. The project rule is **zero third-party requests**, so
nothing here loads from a CDN.

| File | Source (three.js 0.170.0) | raw | gzip |
|---|---|---|---|
| `three.module.min.js` | official prebuilt `build/three.module.min.js` | 691 KB | 172 KB |
| `SVGLoader.min.js` | `examples/jsm/loaders/SVGLoader.js`, minified, `three` external | 22 KB | 8 KB |
| `three-LICENSE.txt` | three.js MIT licence | — | — |

Obtained with `npm pack three@0.170.0` into a temp directory. **No `package.json` was
added to this repository** — CLAUDE.md forbids introducing a build step or manifest
without an explicit decision, so the two addons were minified once, by hand, and the
result committed.

RoomEnvironment was evaluated and dropped: it is a neutral white room, and the
brand accent has to live in the reflection, so `hero3d.js` builds its own studio
environment instead.

Resolved through the import map in `index.html`. Loaded only by `hero3d.js`, which is
itself dynamically imported after first paint and only when WebGL2 is actually
available, so none of this sits on the critical path or reaches devices that fall back.
