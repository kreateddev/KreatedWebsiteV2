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


  /* The Canvas-2D / WebGL mark sculpture that used to live here has been
     removed. It mounted on #heroArt + #heroGlass, which the L9 SVG hero no
     longer renders, so the guard never passed and ~410 lines never ran. Its
     dynamic import of hero3d.js and the three.js import map went with it.
     Archived verbatim (this repo is not versioned) in
     _removed/2026-08-28-webgl-and-dead-assets/. The visible hero is unchanged. */


})();
