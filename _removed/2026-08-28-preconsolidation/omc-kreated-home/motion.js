/* ==========================================================================
   OMC-INSPIRED KREATED HOMEPAGE SHELL — NOT PRODUCTION

   The whole motion budget, measured from the live OMC homepage 2026-08-24.
   Full measurements: research/OMC_MOTION_TEARDOWN.md

   CORRECTION. An earlier version of this comment said OMC was "almost
   nothing moves" and that no scroll-driven signature existed because the
   page was essentially static. Half of that was wrong. The measurement it
   rested on was taken while a OneTrust consent lock pinned the page at
   scroll 0 and while the browser was throttling requestAnimationFrame, so
   nothing time-based could be seen to move. Re-measured properly:

     · NO scroll-linked motion — CONFIRMED, and confirmed twice. GSAP's
       ScrollTrigger is loaded but registers ZERO instances. No parallax, no
       scroll-reveal, no pinning. Every element tracks scroll exactly 1:1.
       This is still most of why the page feels fast.
     · CONTINUOUS motion — the part that was missed. Four animations run
       from load and never wait for scroll: a 12.2s infinite 9-item orbit, a
       1.33s infinite Lottie loop, and two ~11.6s Lottie passes. All of it
       lives inside decorative artwork. No type, no layout, ever moves.

   So the grammar is: THE ARTWORK NEVER STOPS. THE LAYOUT NEVER MOVES.

   That motion is entirely CSS — see the AMBIENT MOTION block in styles.css.
   It needs no JavaScript, so it survives script failure, and it stops at a
   composed resting frame under prefers-reduced-motion, which OMC does not
   bother to do.

   This file therefore still carries only two things, both of them state
   rather than motion: the header's scroll-up return (a deliberate Kreated
   divergence, recorded in concepts/OMC_KREATED_TRANSLATION.md, because a
   contractor needs a route back to conversion) and the mobile drawer.
   ========================================================================== */
(function () {
  'use strict';

  var reduce = window.matchMedia &&
               window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ======================================================================
     HEADER — absolute at the top like OMC's, then fixed and hidden, then
     revealed on scroll-up. Never covers the hero.
     ====================================================================== */
  (function header() {
    var head = document.getElementById('head');
    if (!head) return;
    var last = window.scrollY, shown = false, fixed = false;

    function onScroll() {
      var y = window.scrollY;
      var past = y > window.innerHeight * 0.9;

      if (past !== fixed) {
        fixed = past;
        head.classList.toggle('is-fixed', fixed);
        if (!fixed) { head.classList.remove('is-shown'); shown = false; }
      }
      if (fixed) {
        var up = y < last - 4;
        var down = y > last + 4;
        if (up && !shown) { head.classList.add('is-shown'); shown = true; }
        else if (down && shown) { head.classList.remove('is-shown'); shown = false; }
      }
      last = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();

  /* ======================================================================
     MOBILE DRAWER
     ====================================================================== */
  (function drawer() {
    var btn = document.querySelector('.head__burger');
    var panel = document.getElementById('drawer');
    if (!btn || !panel) return;

    function set(open) {
      btn.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    btn.addEventListener('click', function () {
      set(btn.getAttribute('aria-expanded') !== 'true');
    });
    panel.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') set(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') set(false);
    });
  })();

  /* No ambient-motion code lives here on purpose. The capability contour
     orbit and the hero art slot's drift are CSS keyframe animations, phase
     offset with negative animation-delay so they are already mid-cycle
     before the section is scrolled to — exactly like OMC's orbit, which is
     never caught at a start frame. Driving them from rAF here would cost
     script, main-thread work and a reduced-motion branch, and buy nothing.

     The header, above, remains the only scroll-driven behaviour on the page. */
})();
