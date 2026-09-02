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
  /* ⚠ Speed is px/second, not a fixed duration — the strip's width changes with
     viewport and with the marks in it, so a hard duration would run at a
     different apparent speed on every screen. 38px/s with a 20s floor.
     History: 46 was too fast to read, 22 (34s floor) was called too slow. */
  var seconds = Math.max(20, Math.round(setWidth / 38));
  list.style.setProperty('--marquee-duration', seconds + 's');

  list.classList.add('is-marquee');

  /* ---- stop the timer when nobody can see it ---------------------------
     ⚠ TWO REASONS, ONE CLASS — track them separately. Both of these used to
     call classList.toggle('is-paused', ...) directly, so whichever fired last
     won and the other reason was silently discarded.

     That is the bug behind "the carousel stops after visiting a client": the
     logo links are target="_blank", so opening one backgrounds this tab. While
     a tab is hidden the browser throttles rendering, and it can deliver the
     IntersectionObserver callback it computed during that time AFTER the tab is
     visible again — carrying isIntersecting:false. That late callback re-added
     is-paused on top of the visibilitychange handler that had just cleared it,
     and since the strip's intersection never changes again, nothing ever fired
     to un-pause it. The marquee stayed frozen for the rest of the visit.

     🚫 Do not collapse these back into one toggle. */
  var offscreen = false, hidden = false;
  function sync() { list.classList.toggle('is-paused', offscreen || hidden); }

  /* geometry, read synchronously — the ground truth a stale queued observer
     callback cannot contradict */
  function outOfView() {
    var r = list.getBoundingClientRect();
    return r.bottom <= 0 || r.top >= (window.innerHeight || 0);
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { offscreen = !e.isIntersecting; });
      sync();
    }, { threshold: 0 }).observe(list);
  }

  /* ⚠ On the way back IN, re-measure instead of trusting the observer. This is
     what makes a late callback harmless: whatever it claimed, the next resume
     recomputes from the box itself. */
  function resume() {
    hidden = document.hidden;
    if (!hidden) offscreen = outOfView();
    sync();
  }
  document.addEventListener('visibilitychange', resume);
  window.addEventListener('focus', resume);
  /* bfcache restores skip load entirely, so pageshow is the only signal */
  window.addEventListener('pageshow', resume);
}());
