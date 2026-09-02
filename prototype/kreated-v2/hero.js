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

    var i = 0, n = 0, timer = null, gen = 0;

    /* ⚠ ONE CHAIN, EVER. `i`, `n` and `out` are shared state and `timer` holds a
       SINGLE handle, so if two typing chains are ever live at once they both
       mutate the same counters, both write to the same node, and only the most
       recently scheduled one can be cleared — the other runs forever. The
       visible result is slices of two different phrases interleaved into one
       string: "GwfGwfirst imp" (Google results. + first impression.).

       It took two entry points racing to produce that, which is why it appeared
       for some visitors and not others:
         · start() is deferred until document.fonts.ready resolves, and
         · the visibilitychange handler starts typing on its own.
       Open the site in a BACKGROUND tab — which is what every target="_blank"
       link on this site does — and the tab can become visible before the fonts
       promise settles. The visibility handler sees timer === null, starts chain
       A, then fonts.ready resolves and start() begins chain B on top of it.

       The generation counter is the guard: cancel() invalidates every chain
       scheduled before it, so a stale callback returns instead of writing.
       🚫 Do not schedule with a bare setTimeout here — use next(). */
    function cancel() {
      gen++;
      if (timer) { clearTimeout(timer); timer = null; }
    }
    function next(fn, ms) {
      var g = gen;
      timer = setTimeout(function () {
        if (g !== gen) return;          /* superseded — this chain is dead */
        timer = null;
        fn();
      }, ms);
    }

    function hold(on) { h1.classList.toggle('is-holding', !!on); }

    function type() {
      var p = PHRASES[i];
      hold(false);
      if (n < p.length) {
        n++;
        out.textContent = p.slice(0, n);
        next(type, TYPE);
        return;
      }
      hold(true);
      next(del, HOLD);
    }

    function del() {
      var p = PHRASES[i];
      hold(false);
      if (n > 0) {
        n--;
        out.textContent = p.slice(0, n);
        next(del, DEL);
        return;
      }
      i = (i + 1) % PHRASES.length;
      next(type, PAUSE);
    }

    function stopToStatic() {
      cancel();
      out.textContent = PHRASES[0];          /* the locked static fallback */
      h1.classList.remove('js-type', 'is-holding');
    }

    function start() {
      cancel();                         /* supersede any chain already running */
      if (mq && mq.matches) { stopToStatic(); return; }
      h1.classList.add('js-type');
      /* begin from the phrase already rendered in the HTML, so the first
         thing the visitor sees is a complete sentence, not an empty line */
      i = 0;
      n = PHRASES[0].length;
      out.textContent = PHRASES[0];
      hold(true);
      next(del, HOLD);
    }

    /* Start only once fonts have settled — typing through a font swap looks
       broken and shifts the caret. */
    if (document.fonts && document.fonts.ready && document.fonts.ready.then) {
      /* ⚠ then(start, start), not then(start).catch(start): the catch form
         re-runs start() when start() itself throws, which is a second chain. */
      document.fonts.ready.then(start, start);
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
      else if (!document.hidden && !timer) { cancel(); type(); }
    });
  })();


  /* The Canvas-2D / WebGL mark sculpture that used to live here has been
     removed. It mounted on #heroArt + #heroGlass, which the L9 SVG hero no
     longer renders, so the guard never passed and ~410 lines never ran. Its
     dynamic import of hero3d.js and the three.js import map went with it.
     Archived verbatim (this repo is not versioned) in
     _removed/2026-08-28-webgl-and-dead-assets/. The visible hero is unchanged. */


})();
