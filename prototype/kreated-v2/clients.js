/* ==========================================================================
   KREATED V2 — the client strip, as an infinite marquee
   Homepage only. Rewritten 2026-09-02 at owner request.

   ⚠ THIS REVERSES A DOCUMENTED DECISION. From 2026-08-31 this strip ran an
   emphasis cycle — all three marks always on screen, a "lit" class walking
   between them — chosen specifically because an earlier infinite conveyor
   "needed six marks on screen for three clients and masked whichever name
   happened to be leaving". The owner asked for the carousel back on
   2026-09-02. The old failure is designed around here rather than repeated:

     · The track holds TWO copies of the set and translates exactly -50%, so
       the loop is seamless and no mark is ever caught half-out at a hard edge.
     · Every mark renders at full strength the whole way across. Nothing is
       dimmed, so nothing is "masked" while leaving.
     · The edges fade with a mask rather than clipping, so a logo entering or
       leaving reads as continuing past the strip instead of being cut.
     · It pauses on hover and on keyboard focus, so the links are actually
       clickable — a moving link is a hostile target.

   🚫 THE CLONE IS NOT CONTENT. It is aria-hidden and removed from the tab
   order. A screen reader and a keyboard user each meet the three clients once,
   in DOM order, exactly as before. If you add a fourth client, add it to the
   HTML only — the clone is built here at runtime and will follow.

   Under reduced motion this file does nothing at all: no clone, no animation,
   and the stylesheet leaves the original three-up grid in place. That is a
   finished state, not a degraded one.
   ========================================================================== */
(function () {
  'use strict';

  var list = document.querySelector('.clients__list');
  if (!list) return;

  var items = [].slice.call(list.children);
  if (items.length < 2) return;

  /* Reduced motion is a hard stop. Leaving the DOM untouched means the static
     grid in styles.css is what renders, which is a complete design. */
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  if (mq && mq.matches) return;

  /* ---- build the second set ------------------------------------------- */
  var clones = items.map(function (li) {
    var c = li.cloneNode(true);
    c.setAttribute('aria-hidden', 'true');
    /* every focusable thing inside the clone leaves the tab order */
    [].slice.call(c.querySelectorAll('a,button,input,[tabindex]')).forEach(function (el) {
      el.setAttribute('tabindex', '-1');
    });
    c.classList.add('is-clone');
    return c;
  });
  clones.forEach(function (c) { list.appendChild(c); });

  /* ---- speed follows content, so the strip always reads at one pace ----- */
  var setWidth = 0;
  items.forEach(function (li) { setWidth += li.getBoundingClientRect().width; });
  var gap = parseFloat(getComputedStyle(list).columnGap || getComputedStyle(list).gap || 0) || 0;
  setWidth += gap * items.length;
  /* ⚠ ~22px per second, halved on 2026-09-02. With only three marks the loop
     comes round quickly whatever the speed, so pace is the only thing telling
     the reader this is a standing list rather than a ticker. The floor moved
     with it: 34s is roughly a full lap of a phone-width track. */
  var seconds = Math.max(34, Math.round(setWidth / 22));
  list.style.setProperty('--marquee-duration', seconds + 's');

  list.classList.add('is-marquee');

  /* ---- stop the timer when nobody can see it --------------------------- */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        list.classList.toggle('is-paused', !e.isIntersecting);
      });
    }, { threshold: 0 }).observe(list);
  }
  document.addEventListener('visibilitychange', function () {
    list.classList.toggle('is-paused', document.hidden);
  });
}());
