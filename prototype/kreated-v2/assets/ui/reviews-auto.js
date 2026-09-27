/* Pilot, 2026-09-19: the reviews run as a continuous automatic carousel (owner).
   The set is cloned once so the loop is seamless; clones are hidden from assistive tech.
   Hovering a review card pauses it so a full review can be finished; reduced-motion keeps it still. */
(function () {
  var root = document.querySelector('.revs');
  if (!root) return;
  var track = root.querySelector('.revs__track');
  var cards = track ? [].slice.call(track.querySelectorAll('.rev')) : [];
  if (!track || cards.length < 2) return;
  cards.forEach(function (c) {
    var k = c.cloneNode(true);
    k.setAttribute('aria-hidden', 'true');
    [].slice.call(k.querySelectorAll('a')).forEach(function (a) { a.tabIndex = -1; });
    track.appendChild(k);
  });
  root.classList.add('is-auto');
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  /* ⚠ 16px/s, slowed from 38 on 2026-09-26 (owner): a reviewer's own words are
     the slowest thing on the page to read, and 38 moved a 160-word review out
     of view before it could be finished. */
  var SPEED = 16;
  var paused = false, held = false, last = 0, pos = 0;
  function loopWidth() { return track.children[cards.length].offsetLeft - track.children[0].offsetLeft; }
  function tick(t) {
    if (last && !paused && !held && !(mq && mq.matches) && !document.hidden) {
      pos += SPEED * Math.min(t - last, 64) / 1000;
      var w = loopWidth();
      if (pos >= w) pos -= w;
      track.scrollLeft = pos;
    }
    last = t;
    requestAnimationFrame(tick);
  }
  /* ⚠ HOLD TO STOP IT, added 2026-09-26 (owner): press and it stays put, let go
     and it carries on from where it was. Pointer events cover mouse, touch and
     pen in one path, and the listener is passive so a touch-hold never blocks
     the page's own scrolling. 🚫 Do not preventDefault here. */
  function hold() { held = true; }
  function release() { held = false; }
  track.addEventListener('pointerdown', hold, { passive: true });
  window.addEventListener('pointerup', release, { passive: true });
  window.addEventListener('pointercancel', release, { passive: true });

  /* only a review card pauses it on hover; the gaps between cards do not */
  track.addEventListener('mouseover', function (e) { paused = !!(e.target.closest && e.target.closest('.rev')); });
  track.addEventListener('mouseleave', function () { paused = false; });
  track.addEventListener('focusin', function (e) { paused = !!e.target.closest('.rev'); });
  track.addEventListener('focusout', function () { paused = false; });
  requestAnimationFrame(tick);
}());
