/* ==========================================================================
   STEP 5B PROTOTYPE — NOT PRODUCTION
   Kreated V2 · APERTURE intro → hero

   SET TRUE — three behaviours only:
     UNCOVER  a mask edge travels across content that is already there
     SEAT     a weighted landing with one decisive stop
     ALIGN    edges and hairlines resolving into precise register

   What this file does NOT do: it does not draw, simulate, or fake the
   material. THE POUR is a pre-rendered sequence (tools/render-pour.py). This
   only advances it against a clock and runs the two DOM beats around it.

   Rules honoured here:
     · plays once on load, hard stop at 1.45s, no loop, no replay control
     · headline, support line and all three routes are painted at 0.00s,
       never animated and never covered
     · reduced motion, no JS, save-data and narrow viewports render the
       finished hero with no intermediate state
   ========================================================================== */
(function () {
  'use strict';

  var root  = document.documentElement;
  var pour  = document.querySelector('.pour');
  var seq   = document.querySelector('.pour-seq');
  var mark  = document.querySelector('.wordmark');
  var base  = document.querySelector('.baseline');
  if (!pour) return;

  /* ---------- easings ---------------------------------------------------- */
  var UNCOVER = 'cubic-bezier(.42,.10,.22,1)';   /* mask edge travel         */
  var ALIGN   = 'cubic-bezier(.62,.02,.16,1)';   /* decisive final register  */

  /* ---------- should the intro play at all? ------------------------------ */
  var mq       = window.matchMedia;
  var reduce   = mq && mq('(prefers-reduced-motion: reduce)').matches;
  var narrow   = mq && mq('(max-width: 860px)').matches;
  var conn     = navigator.connection || {};
  var saveData = !!conn.saveData;
  var lowPower = (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
                 (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

  var running = [];

  /* ---------------------------------------------------------------- ALIGN --
     Applied to layout, not to motion. The rendered surface carries embossed
     relief hairlines; the copy block is nudged so its own hairline sits on the
     second of them, so one line reads across the whole composition into the
     CTA block. Without JS both blocks are simply centred — a correct fallback.
     ------------------------------------------------------------------------ */
  var copy = document.querySelector('.hero__copy');
  function alignHairline() {
    if (!copy || !base || !pour) return;
    copy.style.transform = '';
    if (narrow) return;
    var r = pour.getBoundingClientRect();
    var css = getComputedStyle(document.documentElement);
    var ruleY = r.top + (parseFloat(css.getPropertyValue('--pour-rule')) / 620) * r.height;
    var delta = ruleY - base.getBoundingClientRect().top;
    if (delta > 90) delta = 90; else if (delta < -90) delta = -90;
    copy.style.transform = 'translateY(' + Math.round(delta) + 'px)';
  }
  alignHairline();
  window.setTimeout(alignHairline, 0);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(alignHairline);
  window.addEventListener('resize', alignHairline);
  if (window.ResizeObserver) new ResizeObserver(alignHairline).observe(document.documentElement);

  function settle() {
    root.classList.remove('js-intro');
    root.classList.remove('js-panel');
    running.forEach(function (a) { a.cancel(); });
    running = [];
    /* hard stop. nothing in this page moves again. */
    window.setTimeout(function () { pour.classList.add('is-resolved'); }, 30);
  }

  function play(el, frames, duration, delay, easing) {
    if (!el) return;
    var a = el.animate(frames, {
      duration: duration, delay: delay,
      easing: easing || 'linear', fill: 'both'
    });
    running.push(a);
    return a;
  }

  /* ======================================================================
     NARROW VIEWPORT — the wordmark already carries a static material fill,
     so the panel gets exactly one short uncover and nothing else. On low
     power or save-data it does not even get that.
     ====================================================================== */
  function runNarrow() {
    if (reduce || saveData || lowPower) { settle(); return; }
    var still = document.querySelector('.pour-still');
    root.classList.add('js-panel');
    play(still,
      [{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)' }],
      600, 140, UNCOVER);
    window.setTimeout(settle, 800);
  }

  /* ======================================================================
     DESKTOP — APERTURE
     ====================================================================== */
  function runIntro(manifest) {
    var frames = manifest.frames;
    var urls = frames.map(function (f) { return 'assets/pour/' + f.file; });
    var last = frames.length - 1;
    var end = manifest.duration * 1000;          /* 1450ms */

    /* --- the two DOM beats that sit around the material -------------------
       The wordmark is UNCOVERED into its identity position while the pour is
       escaping the letters, so the name is handed off from the aperture to
       the header rather than flying across the screen as a logo animation.  */
    play(mark,
      [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }],
      420, 560, UNCOVER);

    /* ALIGN: the one hairline draws taut as the surface finishes levelling */
    play(base,
      [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
      380, 1050, ALIGN);

    /* --- advance the pre-rendered material against a real clock ---------- */
    var t0 = null, i = -1;
    function step(now) {
      if (t0 === null) t0 = now;
      var t = now - t0;
      var want = 0;
      while (want < last && frames[want + 1].t * 1000 <= t) want++;
      if (want !== i) {
        i = want;
        seq.style.backgroundImage = 'url(' + urls[i] + ')';
      }
      if (t < end) { requestAnimationFrame(step); return; }
      /* the sequence's final frame and .pour-still are the same state; the
         still is the 2x asset, so dropping the sequence just hands the
         resting surface back at full resolution. */
      settle();
    }
    requestAnimationFrame(step);
  }

  /* ---------- preload, then start ---------------------------------------- */
  function preload(urls) {
    return Promise.all(urls.map(function (u) {
      return new Promise(function (res) {
        var im = new Image();
        im.onload = im.onerror = res;
        im.src = u;
      });
    }));
  }

  function start() {
    if (narrow) { runNarrow(); return; }
    if (reduce || saveData) { settle(); return; }

    var failsafe = window.setTimeout(settle, 6000);

    fetch('assets/pour/manifest.json')
      .then(function (r) { return r.json(); })
      .then(function (manifest) {
        return preload(manifest.frames.map(function (f) {
          return 'assets/pour/' + f.file;
        })).then(function () { return manifest; });
      })
      .then(function (manifest) {
        window.clearTimeout(failsafe);
        /* a hidden tab never fires requestAnimationFrame. Rather than settle
           to the finished hero behind the visitor's back, hold the 0.00s state
           — which is a legitimate designed frame — and run the intro the
           moment they actually look at it. */
        if (document.visibilityState === 'hidden') {
          document.addEventListener('visibilitychange', function once() {
            document.removeEventListener('visibilitychange', once);
            if (document.visibilityState === 'hidden') return;
            runIntro(manifest);
          });
          return;
        }
        runIntro(manifest);
      })
      .catch(function () { window.clearTimeout(failsafe); settle(); });
  }

  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });

  /* Review affordance only — no control is rendered and nothing in the design
     depends on it. Press R to replay the intro while judging the prototype. */
  window.addEventListener('keydown', function (e) {
    if ((e.key === 'r' || e.key === 'R') && !e.metaKey && !e.ctrlKey && !e.altKey) {
      running.forEach(function (a) { a.cancel(); });
      running = [];
      pour.classList.remove('is-resolved');
      root.classList.add(narrow ? 'js-panel' : 'js-intro');
      start();
    }
  });
})();
