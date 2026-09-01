/* ==========================================================================
   KREATED V2 — /services/web-design/ · GROUNDWORK SPECIMEN
   Two jobs, both small, neither of which any content depends on.

   1. SCALE. The specimen is a real 1240x926 page and a real 208x436 phone
      render. Showing them at the size the layout allows means a transform
      scale, and `transform: scale()` needs a UNITLESS number. CSS cannot
      divide a length by a length, so the factor cannot be expressed in CSS —
      `calc(100cqw / 1240)` is invalid and drops the transform entirely.
      This measures the lane and sets `--gs` / `--gp`.

      ⚠ WITH THIS SCRIPT ABSENT the page is still correct: groundwork.css
      carries a per-breakpoint default for both variables. The script makes an
      already-correct render exact between the steps. Nothing is gated on it.

   2. REVEAL. The structure marks fade in and the phone rises 8px, once, when
      the module scrolls into view. Fully gated: no IntersectionObserver, or
      prefers-reduced-motion, and the finished state is applied immediately.

   ES5 only — var, function, IIFE. No globals are added.
   ========================================================================== */
(function () {
  'use strict';

  var spec = document.querySelector('.spec');
  if (!spec) return;

  /* ---- 1 · scale ------------------------------------------------------- */
  var page = spec.querySelector('.spec__page');
  var screen = spec.querySelector('.spec__screen');
  var phscreen = spec.querySelector('.spec__phscreen');

  function fit() {
    if (page && screen) {
      var w = page.clientWidth;
      /* below 640 the page box carries the phone render, not the desktop one */
      var design = screen.offsetWidth > 400 ? 1240 : 208;
      if (w > 0) page.style.setProperty('--gs', (w / design).toFixed(5));
    }
    if (phscreen) {
      var pw = phscreen.clientWidth;
      if (pw > 0) phscreen.style.setProperty('--gp', (pw / 208).toFixed(5));
    }
  }

  fit();
  /* re-fit on resize. Passive, and coalesced with rAF so a drag does not
     thrash layout. */
  var queued = false;
  function onResize() {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(function () { queued = false; fit(); });
  }
  window.addEventListener('resize', onResize, { passive: true });
  /* ResizeObserver is more accurate than `resize` here — the lane can change
     width without the window doing so — but it is an enhancement, not a
     requirement. */
  if ('ResizeObserver' in window && page) {
    new ResizeObserver(onResize).observe(page);
  }
  /* the web fonts settle after first paint and can change nothing about the
     scale, but the lane width can still be 0 if this runs before layout */
  if (document.fonts && document.fonts.ready && document.fonts.ready.then) {
    document.fonts.ready.then(fit);
  }

  /* ---- 2 · reveal ------------------------------------------------------ */
  var reduce = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: true };

  if (!('IntersectionObserver' in window) || reduce.matches) return;

  spec.setAttribute('data-anim', '');
  var io = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) {
        spec.classList.add('is-in');
        io.unobserve(entries[i].target);   /* reveal once, never replay */
      }
    }
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });
  io.observe(spec);
})();
