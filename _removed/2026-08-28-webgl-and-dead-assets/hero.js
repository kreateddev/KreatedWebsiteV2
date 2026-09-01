/* ==========================================================================
   KREATED V2 — HERO
   Implements KREATED-V2-HERO-HANDOFF.md. Hero only. Nothing else on the page
   is touched by this file.

   Two behaviours live here:
     1. the rotating terminal phrase (typewriter)
     2. the FLUTED GLASS artwork

   Both are gated on prefers-reduced-motion, both resolve to a designed static
   state, and neither is scroll-linked.
   ========================================================================== */
(function () {
  'use strict';

  var mq = window.matchMedia
         ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var reduce = mq ? mq.matches : false;

  /* Reduced motion is a live preference, not a load-time constant. Reading it
     once means a visitor who turns it on mid-session keeps the motion they
     just asked to stop. Both behaviours below subscribe. */
  function onReduceChange(fn) {
    if (!mq) return;
    if (mq.addEventListener) mq.addEventListener('change', fn);
    else if (mq.addListener) mq.addListener(fn);
  }

  /* ======================================================================
     1 · TYPEWRITER — terminal phrase only

     The static phrase never animates. Width for the LONGEST phrase is
     reserved in CSS by an invisible copy, so nothing here can reflow the
     line: this JS only ever writes textContent into an absolutely
     positioned span. Assistive tech reads the .sr-only sentence instead.
     ====================================================================== */
  (function typewriter() {
    var out = document.getElementById('heroTyped');
    var h1 = out && out.closest ? out.closest('.hero__h1') : null;
    if (!out || !h1) return;

    /* LOCKED copy — exactly these three, in exactly this order. */
    var PHRASES = ['website.', 'Google results.', 'first impression.'];

    var TYPE = 52;      /* per character                                   */
    var DEL = 26;       /* deletion is visibly faster than typing          */
    var HOLD = 2600;    /* long enough to read comfortably twice           */
    var PAUSE = 420;    /* beat between phrases                            */

    var i = 0, n = 0, timer = null;

    function hold(on) { h1.classList.toggle('is-holding', !!on); }

    function type() {
      var p = PHRASES[i];
      hold(false);
      if (n < p.length) {
        n++;
        out.textContent = p.slice(0, n);
        timer = setTimeout(type, TYPE);
        return;
      }
      hold(true);
      timer = setTimeout(del, HOLD);
    }

    function del() {
      var p = PHRASES[i];
      hold(false);
      if (n > 0) {
        n--;
        out.textContent = p.slice(0, n);
        timer = setTimeout(del, DEL);
        return;
      }
      i = (i + 1) % PHRASES.length;
      timer = setTimeout(type, PAUSE);
    }

    function stopToStatic() {
      if (timer) { clearTimeout(timer); timer = null; }
      out.textContent = PHRASES[0];          /* the locked static fallback */
      h1.classList.remove('js-type', 'is-holding');
    }

    function start() {
      if (mq && mq.matches) { stopToStatic(); return; }
      h1.classList.add('js-type');
      /* begin from the phrase already rendered in the HTML, so the first
         thing the visitor sees is a complete sentence, not an empty line */
      i = 0;
      n = PHRASES[0].length;
      out.textContent = PHRASES[0];
      hold(true);
      timer = setTimeout(del, HOLD);
    }

    /* Start only once fonts have settled — typing through a font swap looks
       broken and shifts the caret. */
    if (document.fonts && document.fonts.ready && document.fonts.ready.then) {
      document.fonts.ready.then(start)['catch'](start);
    } else {
      start();
    }

    onReduceChange(function (e) {
      if (e.matches) stopToStatic();
      else if (!timer) start();
    });

    /* Don't burn timers on a hidden tab. */
    document.addEventListener('visibilitychange', function () {
      if (mq && mq.matches) return;
      if (document.hidden && timer) { clearTimeout(timer); timer = null; }
      else if (!document.hidden && !timer) { type(); }
    });
  })();


  /* ======================================================================
     2 · THE MARK AS ARTWORK — dimensional extrusion + light choreography

     RESET. Two earlier renderers put an object in FRONT of the logo: first
     repeated fluted glass, then composed optical slabs. Both were rejected,
     and the second rejection was conceptual — the interest was coming from
     the overlay, not from the mark. Nothing is layered over the logo now.
     The only subject is the approved Kreated mark, and every bit of the
     visual comes from what the mark itself does.

     Technique: Canvas 2D, Path2D, no dependency.

       depth   the real path is stamped ~18x along a depth vector to build
               genuine side faces, darkening backwards. Not a drop shadow —
               the side walls are the same geometry, so they are always
               exactly the approved silhouette.
       turn    a small-angle matrix approximating a Y/X rotation. The depth
               vector is DERIVED from that angle, so the sides appear as the
               mark turns and close up as it comes front-on.
       pieces  the SVG's own two structural paths are the two pieces. They
               separate by a few px on a long, mostly-flat envelope, then
               resolve. At rest the separation is exactly 0, so the resting
               silhouette IS the approved logo, not an approximation.
       light   a rim on the lit side, a cobalt rim opposite, and one slow
               specular sweep. The light moves more than the object does.
     ====================================================================== */
  (function markSculpture() {
    var art = document.getElementById('heroArt');
    var cv = document.getElementById('heroGlass');
    if (!art || !cv || !cv.getContext || !window.Path2D) return;

    /* ------------------------------------------------------------------
       RENDERER SELECTION

       Preferred:  hero3d.js — true 3D. Real normals, a depth buffer doing
                   real self-occlusion, real perspective, environment
                   response. Everything below is the FALLBACK.
       Fallback:   this Canvas 2D sculpture, kept deliberately. It is the
                   same approved composition and it needs no WebGL context,
                   no 700 KB of library and no module support, which makes
                   it the right answer for save-data, weak GPUs, blocked
                   WebGL and any import failure.
       Last:       the <img> of the approved mark, already in the markup.

       Only ONE ever paints. The 3D path is taken only after it has actually
       succeeded, so a failure mid-init falls back rather than showing an
       empty canvas.
       ------------------------------------------------------------------ */
    function webglOK() {
      if (lite) return false;                     /* save-data / low core   */
      if (!window.WebGL2RenderingContext) return false;
      if (!HTMLScriptElement.supports ||
          !HTMLScriptElement.supports('importmap')) return false;
      try {
        var t = document.createElement('canvas');
        var gl = t.getContext('webgl2', { failIfMajorPerformanceCaveat: true });
        if (!gl) return false;
        var lose = gl.getExtension('WEBGL_lose_context');
        if (lose) lose.loseContext();
        return true;
      } catch (e) { return false; }
    }

    /* Deliberately NOT acquired here. A canvas element can only ever hold one
       context type for its lifetime, so calling getContext('2d') at load would
       permanently prevent the 3D renderer from getting WebGL on the same
       element — the fallback would silently win every time. It is taken in
       mount(), which only runs when the canvas renderer is actually chosen. */
    var ctx = null;

  /* Path data extracted verbatim from assets/img/kreated-mark.svg (viewBox
     0 0 600 600). Kept as Path2D rather than an <img> so the mark can carry
     the chrome gradient and stay crisp at any size with no extra request.
     If the .svg is ever re-exported, re-extract these. */
  var MARK_VB = 600;
  var MARK_0 = 'M396.23,392.55l.14-47.26-57.1-39.97,30.32-20.54,26.8-18.52-.06-45.94-12.78,9.74-69.6,55.74.31-9.17,2.67-60.3.49-16.27h-33.84s1.36,32.9,1.36,32.9l1.46,30.97c.84,15.31,8.07,27.16,8.19,42.7.07,9.26-1.59,18.16-4.29,26.99-2.28,7.48-3.36,14.64-3.66,22.52l-3,55.1h35.45s-4.53-81.02-4.53-81.02l-.61-9.05,82.28,71.37ZM246.72,357.58l29.11-25.18c7.36-6.37,10.61-16.16,11.07-25.73.65-13.63-5.36-26.01-16.38-33.84l-65.03-52.14-.19,45.21,57.83,39.63-57.8,40.37.04,46.97,41.34-35.27Z';
  var MARK_1 = 'M465.33,450.75l-142.53-123.63,1.06,15.68,7.85,140.34h-61.41s5.2-95.45,5.2-95.45c.53-13.64,2.38-26.04,6.34-39.01,4.67-15.3,7.55-30.71,7.43-46.75-.21-26.93-12.73-47.45-14.18-73.97l-2.53-53.65-2.36-56.98h58.62s-.85,28.18-.85,28.18l-4.63,104.45-.53,15.89,120.57-96.56,22.13-16.88.11,79.58-46.42,32.08-52.53,35.58,98.91,69.23-.24,81.87Z';
  var MARK_2 = 'M206.34,390.2l-71.61,61.09-.07-81.36,100.13-69.93-100.18-68.64.32-78.3,112.64,90.32c19.08,13.57,29.48,35.02,28.37,58.62-.79,16.57-6.42,33.54-19.17,44.57l-50.43,43.62Z';

    var VB = MARK_VB, HALF = VB / 2;

    /* The mark's own structural paths. MARK_2 is the left arrow, MARK_1 the
       K body; MARK_0 is the inner facet the source artwork carries. These are
       the pieces — no geometry is invented, cut or rounded. */
    var pFacet, pBody, pArrow;

    var STEPS = 18;                 /* extrusion stamps                     */
    var DEPTH = 0.128;              /* depth vector length, in mark units   */
    var TURN_S = 23, TILT_S = 31;   /* rotation periods, non-harmonic       */
    var SEP_S = 19, LIGHT_S = 13;

    var dpr = 1, cw = 0, ch = 0, k = 1, unit = 0, bb = null;
    var wallG = null, faceG = null, bevelG = null, rimG = null;
    var raf = 0, last = 0, visible = true, mounted = false;
    var pointerX = null, pointerY = null, curX = 0, curY = 0;

    var fine = window.matchMedia &&
               window.matchMedia('(hover:hover) and (pointer:fine)').matches;
    var nav = navigator;
    var lite = (nav.connection && nav.connection.saveData === true) ||
               (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 2) ||
               (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 2);
    /* mobile keeps the concept and the material, with fewer extrusion stamps
       and a slightly smaller separation — it is a deliberate brand moment on
       small screens, not a shrunken leftover */
    var simple = !fine;

    /* ---- the mark's true ink bounds -----------------------------------
       The artwork sits inset inside its 600x600 viewBox, so scaling by the
       viewBox wastes about 40% of the box and the mark reads small. Measured
       once by rasterising the paths and scanning alpha, so it stays correct
       if the logo is ever re-exported rather than being a hardcoded guess. */
    function measure() {
      var N = 240, oc = document.createElement('canvas');
      oc.width = N; oc.height = N;
      var o = oc.getContext('2d');
      o.setTransform(N / VB, 0, 0, N / VB, 0, 0);
      o.fillStyle = '#fff';
      o.fill(pBody); o.fill(pArrow); o.fill(pFacet);
      var d = o.getImageData(0, 0, N, N).data;
      var minx = N, miny = N, maxx = 0, maxy = 0, x, y;
      for (y = 0; y < N; y++) {
        for (x = 0; x < N; x++) {
          if (d[(y * N + x) * 4 + 3] > 10) {
            if (x < minx) minx = x; if (x > maxx) maxx = x;
            if (y < miny) miny = y; if (y > maxy) maxy = y;
          }
        }
      }
      var sc = VB / N;
      bb = { cx: (minx + maxx + 1) / 2 * sc, cy: (miny + maxy + 1) / 2 * sc,
             w: (maxx - minx + 1) * sc, h: (maxy - miny + 1) * sc };
    }

    /* ---- place the mark under the small-angle turn --------------------- */
    function place(ry, rx, ox, oy) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.translate(cw / 2 + ox, ch / 2 + oy);
      /* small-angle approximation of a Y/X rotation: horizontal and vertical
         foreshortening plus a light shear. Enough to read as a turn at the
         few degrees this ever uses, with none of the cost of a 3D pipeline. */
      ctx.transform(Math.cos(ry), rx * 0.30, -ry * 0.16, Math.cos(rx), 0, 0);
      ctx.scale(k, k);
      ctx.translate(-bb.cx, -bb.cy);
    }

    /* ---- the material palette, built once per resize -------------------
       Every gradient is authored in MARK space and reused, so the cost is
       paid at resize, not per frame.

       The important change: the side walls are no longer one flat tone per
       depth layer. Each layer is filled with a gradient running along the KEY
       LIGHT axis, so a wall facing the light is graphite and a wall facing
       away falls to cobalt-tinted black. That is a cheap stand-in for N·L —
       on a shape this convex, screen position correlates well with wall
       orientation — and it is what stops the extrusion reading as one solid
       slab of identical colour. */
    var LX0 = VB * 0.06, LY0 = -VB * 0.10;   /* key light origin, upper-left */
    var LX1 = VB * 1.02, LY1 = VB * 1.12;    /* falls away to lower-right    */

    function buildMaterial() {
      var i, g, m, lit, mid;
      wallG = [];
      var steps = simple ? 14 : STEPS;
      for (i = 0; i <= steps; i++) {
        m = i / steps;                        /* 0 = deepest, 1 = at front   */
        g = ctx.createLinearGradient(LX0, LY0, LX1, LY1);
        lit = 22 + m * 62;                    /* lit wall brightens forward  */
        mid = 11 + m * 24;
        /* lit side: cool graphite */
        g.addColorStop(0.00, 'rgb(' + Math.round(lit * 0.92) + ',' +
                                       Math.round(lit * 0.98) + ',' +
                                       Math.round(lit * 1.10) + ')');
        g.addColorStop(0.42, 'rgb(' + Math.round(mid * 0.86) + ',' +
                                       Math.round(mid * 0.94) + ',' +
                                       Math.round(mid * 1.14) + ')');
        /* shadow side: cobalt bounce gathering in the deep faces. This is
           where the accent earns its place — illumination, not an outline. */
        g.addColorStop(1.00, 'rgb(' + Math.round(7 + m * 7) + ',' +
                                       Math.round(11 + m * 11) + ',' +
                                       Math.round(22 + m * 30) + ')');
        wallG.push(g);
      }

      /* front face: darker than the walls it sits on, but with a real
         directional falloff so the plane is readable rather than muddy */
      faceG = ctx.createLinearGradient(LX0, LY0, LX1, LY1);
      faceG.addColorStop(0.00, '#39404e');
      faceG.addColorStop(0.34, '#242a36');
      faceG.addColorStop(0.68, '#151a24');
      faceG.addColorStop(1.00, '#0c1018');

      /* the chamfer between front face and side wall — one bright stamp sits
         just behind the face, and the sliver that shows past it is the catch */
      bevelG = ctx.createLinearGradient(LX0, LY0, LX1, LY1);
      bevelG.addColorStop(0.00, 'rgba(206,224,255,.95)');
      bevelG.addColorStop(0.30, 'rgba(126,152,196,.70)');
      bevelG.addColorStop(0.62, 'rgba(34,42,58,.80)');
      bevelG.addColorStop(1.00, 'rgba(10,71,240,.62)');

      rimG = ctx.createLinearGradient(LX0, LY0, LX1, LY1);
      rimG.addColorStop(0.00, 'rgba(244,249,255,.96)');
      rimG.addColorStop(0.36, 'rgba(176,199,234,.34)');
      rimG.addColorStop(0.68, 'rgba(10,71,240,.52)');
      rimG.addColorStop(1.00, 'rgba(91,134,255,.82)');
    }

    /* ---- one piece: side walls, then bevel, then front face, then light -- */
    function piece(path, ry, rx, ox, oy, ex, ey, light, depthScale) {
      var i, f;
      var steps = simple ? 14 : STEPS;

      /* side faces — same geometry stamped back along the depth vector, each
         layer lit by its own orientation-aware gradient */
      for (i = steps; i >= 1; i--) {
        f = i / steps;
        place(ry, rx, ox + ex * f * depthScale, oy + ey * f * depthScale);
        ctx.fillStyle = wallG[steps - i];
        ctx.fill(path);
      }

      /* the bevel catch */
      place(ry, rx, ox + ex * 0.13 * depthScale, oy + ey * 0.13 * depthScale);
      ctx.fillStyle = bevelG;
      ctx.fill(path);

      /* front face */
      place(ry, rx, ox, oy);
      ctx.fillStyle = faceG;
      ctx.fill(path);

      /* one specular band travelling across the face */
      ctx.save();
      ctx.clip(path);
      var lx = (light * 2.0 - 0.5) * VB;
      var sg = ctx.createLinearGradient(lx - VB * 0.34, -VB * 0.2, lx + VB * 0.22, VB * 1.1);
      sg.addColorStop(0.00, 'rgba(206,226,255,0)');
      sg.addColorStop(0.42, 'rgba(206,226,255,.10)');
      sg.addColorStop(0.50, 'rgba(240,248,255,.26)');
      sg.addColorStop(0.58, 'rgba(206,226,255,.10)');
      sg.addColorStop(1.00, 'rgba(206,226,255,0)');
      ctx.fillStyle = sg;
      ctx.fillRect(-VB, -VB, VB * 3, VB * 3);

      /* a slow cobalt wash through the shadowed half — the accent doing real
         work inside the object instead of only sitting on edges */
      var cx = ((light + 0.42) % 1) * 2.0 - 0.5;
      var cg = ctx.createLinearGradient(cx * VB - VB * 0.5, VB * 1.2,
                                        cx * VB + VB * 0.5, -VB * 0.1);
      cg.addColorStop(0.00, 'rgba(10,71,240,0)');
      cg.addColorStop(0.50, 'rgba(10,71,240,.11)');
      cg.addColorStop(1.00, 'rgba(10,71,240,0)');
      ctx.fillStyle = cg;
      ctx.fillRect(-VB, -VB, VB * 3, VB * 3);
      ctx.restore();

      /* rim: cool white on the key side, cobalt on the turn-away side */
      place(ry, rx, ox, oy);
      ctx.lineWidth = Math.max(1.0, 1.7 * dpr) / k;
      ctx.strokeStyle = rimG;
      ctx.stroke(path);
    }

    function sepEnv(p) {
      if (p < 0.40 || p > 0.92) return 0;
      var a;
      if (p < 0.57) { a = (p - 0.40) / 0.17; return a * a * (3 - 2 * a); }
      if (p < 0.70) return 1;                                   /* the hold  */
      a = (p - 0.70) / 0.22; a = 1 - a;
      return a * a * (3 - 2 * a);
    }

    function frame(t, sepAmount) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, cw, ch);

      var ry = Math.sin(t * Math.PI * 2 / TURN_S) * 0.155 + curX * 0.085;
      var rx = Math.sin(t * Math.PI * 2 / TILT_S) * 0.048 + curY * 0.055;

      /* the depth vector follows the turn — sides open as it rotates and
         close as it comes front-on. A small constant keeps a little body
         under the mark even at dead front. */
      var D = DEPTH * VB;
      var ex = Math.sin(ry) * D * 2.3;
      var ey = Math.sin(rx) * D * 1.8 + D * 0.16;

      var light = (t % LIGHT_S) / LIGHT_S;

      /* Separation envelope: flat, smooth open, HOLD, smooth settle, flat.
         Smoothstep both ways so it is mechanical and precise — no spring, no
         overshoot. The hold is what makes it readable: the previous pow()
         curve peaked for a moment and was easy to miss entirely. */
      var sep = sepAmount * sepEnv((t % SEP_S) / SEP_S);
      var s = sep * VB * 0.058;

      /* arrow drifts out and slightly back; body holds nearer the front */
      piece(pArrow, ry, rx, -s * 1.25, -s * 0.42, ex, ey, light, 1.22);
      piece(pBody,  ry, rx,  s * 0.55,  s * 0.30, ex, ey, light, 1.00);

      /* the source artwork's own inner facet, as a light catch on top */
      place(ry, rx, s * 0.55, s * 0.30);
      ctx.save();
      ctx.clip(pFacet);
      var ig = ctx.createLinearGradient(0, VB * 0.2, VB, VB * 0.9);
      ig.addColorStop(0.00, 'rgba(226,238,255,.30)');
      ig.addColorStop(0.55, 'rgba(120,150,200,.10)');
      ig.addColorStop(1.00, 'rgba(10,71,240,.22)');
      ctx.fillStyle = ig;
      ctx.fillRect(0, 0, VB, VB);
      ctx.restore();

      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    function resize() {
      var r = art.getBoundingClientRect();
      if (!r.width || !r.height) return false;
      var cap = fine ? 1.7 : 1.35;
      dpr = Math.min(window.devicePixelRatio || 1, cap);
      cw = Math.round(r.width * dpr);
      ch = Math.round(r.height * dpr);
      cv.width = cw; cv.height = ch;
      unit = Math.min(cw, ch);
      if (!pBody) {
        pFacet = new Path2D(MARK_0);
        pBody  = new Path2D(MARK_1);
        pArrow = new Path2D(MARK_2);
        measure();
      }
      /* nearly sculptural: fit the real ink to most of the box, leaving room
         for the extrusion to swing without clipping */
      k = (unit * (simple ? 0.90 : 0.74)) / Math.max(bb.w, bb.h);
      buildMaterial();
      return true;
    }

    /* ---- the designed resting state -----------------------------------
       Separation exactly 0, so the silhouette is the approved mark, held at
       a turn that shows the extrusion and puts the specular across it. */
    function staticFrame() { curX = 0; curY = 0; frame(5.75, 0); }

    function loop(now) {
      raf = window.requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      if (now - last < 33) return;
      last = now;

      if (fine && pointerX !== null) {
        curX += ((pointerX - 0.5) - curX) * 0.015;
        curY += ((pointerY - 0.5) - curY) * 0.015;
      } else {
        curX += (0 - curX) * 0.015; curY += (0 - curY) * 0.015;
      }
      frame(now / 1000, simple ? 0.72 : 1);
    }

    function mount() {
      if (mounted) return;
      if (!ctx) {
        ctx = cv.getContext('2d');
        if (!ctx) return;
      }
      if (!resize()) return;
      mounted = true;
      staticFrame();
      art.classList.add('is-live');

      onReduceChange(function (e) {
        if (e.matches) {
          if (raf) { window.cancelAnimationFrame(raf); raf = 0; }
          staticFrame();
        } else if (!raf && !lite) { last = 0; raf = window.requestAnimationFrame(loop); }
      });

      if ((mq && mq.matches) || lite) return;

      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (es) {
          visible = es[0].isIntersecting;
        }, { rootMargin: '120px' }).observe(art);
      }
      if (fine) {
        art.addEventListener('pointermove', function (e) {
          var r = art.getBoundingClientRect();
          pointerX = (e.clientX - r.left) / r.width;
          pointerY = (e.clientY - r.top) / r.height;
        }, { passive: true });
        art.addEventListener('pointerleave', function () {
          pointerX = null; pointerY = null;
        }, { passive: true });
      }
      raf = window.requestAnimationFrame(loop);
    }

    var rt = null;
    window.addEventListener('resize', function () {
      if (!mounted) return;
      clearTimeout(rt);
      rt = setTimeout(function () {
        if (resize() && ((mq && mq.matches) || lite)) staticFrame();
      }, 180);
    }, { passive: true });

    function boot() {
      if (webglOK()) {
        /* new Function keeps the dynamic import out of THIS file's parse, so
           a browser without import() support does not choke on the whole
           script and lose the typewriter along with the artwork */
        var load;
        try { load = new Function('return import("./hero3d.js?v=1")'); }
        catch (e) { load = null; }
        if (load) {
          try {
            load()
              .then(function (mod) {
                return mod.mount(cv, art, {
                  reduce: !!(mq && mq.matches),
                  fine: fine,
                  tier: fine ? 'full' : 'lite'
                });
              })
              .then(function () {
                art.classList.add('is-live');
              })
              ['catch'](function () { mount(); });   /* any failure -> canvas */
            return;
          } catch (e) { /* fall through to canvas */ }
        }
      }
      if (document.fonts && document.fonts.ready && document.fonts.ready.then) {
        document.fonts.ready.then(mount)['catch'](mount);
      } else { mount(); }
    }
    if (window.requestIdleCallback) window.requestIdleCallback(boot, { timeout: 1200 });
    else setTimeout(boot, 200);
  })();

})();
