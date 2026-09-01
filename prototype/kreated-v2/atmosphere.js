/* ==========================================================================
   KREATED V2 — THE THEME FLIP DRIVER
   Homepage only. Writes four numbers to :root and nothing else. Every colour
   decision lives in theme.css; this file only says WHERE on the page the
   journey is.

     --p1   0 -> 1   the light half.  Ground travels #F4F5FA -> #6B80C5.
     --k    0 -> 1   the inversion.   One frame. Never a fraction.
     --p2   0 -> 1   the dark half.   Ground travels #5F72B0 -> #020C2E.
     --p    0 -> 1   the whole journey, for the atmosphere layer only.

   ⚠ Read the dead-band note at the top of theme.css before changing any
   offset in here. --k is not a convenience flag: it is the single frame on
   which the ground jumps the band where no ink reaches AA. If --k ever holds
   a fractional value, or drifts away from the frame the ground jumps on, the
   page has unreadable body copy. That is the entire failure mode being
   engineered around.

   THE INVERSION IS PLACED AT A SECTION, NOT AT A TIME.
   It fires as Services ARRIVES — when the top of that section reaches 60% of
   the way down the viewport. Anchoring to an element rather than to a scroll
   percentage is the part that matters: a percentage landed mid-paragraph at
   1024 while landing between sections at 1440. Anchored to Services, it lands
   in the same place at every width.

   ⚠ The light territory is therefore the hero and the clients strip only.
   Services onward is night.
   ========================================================================== */
(function () {
  'use strict';

  var room = document.querySelector('.room');
  var work = document.getElementById('work');
  if (!room || !work) return;

  var root = document.documentElement;

  /* Under reduced motion the four properties keep their :root defaults, which
     is full night with no movement. The page is complete and readable in that
     state — it is the same theme every other route on the site renders. */
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  if (mq && mq.matches) return;

  var start = 0, cross = 1, end = 2;
  var lastP1 = -1, lastP2 = -1, lastK = -1, lastP = -1;
  var queued = false, y = 0;

  function measure() {
    var vh = window.innerHeight || root.clientHeight;
    var roomTop = room.getBoundingClientRect().top + window.pageYOffset;

    /* ⚠ RE-TIMED 2026-09-01, owner direction: "more aggressively and about
       right when the user scrolls to services."

       It used to invert at the Services/Work boundary, roughly 1,500px later,
       which meant the whole of Services was read in light territory and the
       change arrived long after the reader had stopped expecting one. The
       inversion now fires as Services ARRIVES: the moment its top edge reaches
       60% of the way down the screen, which is the point at which the heading
       has just appeared and nothing of it has been read yet.

       That also makes Services dark territory rather than light. `work` is no
       longer part of the timing at all, only of the guard at the top of the
       file. 🚫 Do not move `cross` back to a boundary between two sections; it
       belongs at the arrival of one. */
    cross = roomTop - vh * 0.45;

    /* AGGRESSIVE, not gradual. The approach used to run about 1.7 viewports;
       it now runs 0.55, so the ground visibly moves rather than drifting. The
       eased curve below concentrates most of that change in the last third. */
    start = cross - vh * 0.55;

    /* and the night closes in over 0.85 of a viewport after the flip rather
       than 1.6, so Services is fully dark by the time the second row is read */
    end = cross + vh * 0.85;

    if (cross <= start) cross = start + 1;
    if (end <= cross) end = cross + 1;
  }

  /* ⚠ THE EASING IS WHAT "AGGRESSIVE" MEANS.
     A linear ramp spends most of its travel in the middle tones, which is
     exactly where the ground looks least like either state and most like an
     accident. These two curves hold the day longer, rush the last stretch into
     the inversion, then drop hard into the night and settle.

     Both are monotonic and both still terminate at exactly 0 and 1, so every
     colour the page can paint is still on the verified path between the same
     endpoints — the contrast sweep is unaffected by the timing, only by the
     endpoints. */
  function easeIn(t)  { return t * t * t; }            /* slow, then rushes  */
  function easeOut(t) { var u = 1 - t; return 1 - u * u * u; }  /* drops, then settles */

  function frame() {
    queued = false;

    var p1, p2, k;

    /* ⚠ 6px of hysteresis around the inversion. Without it a scroll that
       stalls exactly on the boundary — a trackpad settling, or the rubber-band
       at the end of a fling — flips --k back and forth every frame, and the
       page strobes. The band is smaller than one wheel notch, so a real scroll
       never notices it. */
    if (lastK === 1) { k = (y < cross - 6) ? 0 : 1; }
    else             { k = (y > cross + 6) ? 1 : 0; }

    if (k === 0) {
      p1 = (y - start) / (cross - start);
      p2 = 0;
    } else {
      p1 = 1;
      p2 = (y - cross) / (end - cross);
    }
    if (p1 < 0) p1 = 0; else if (p1 > 1) p1 = 1;
    if (p2 < 0) p2 = 0; else if (p2 > 1) p2 = 1;
    p1 = easeIn(p1);
    p2 = easeOut(p2);

    var p = (y - start) / (end - start);
    if (p < 0) p = 0; else if (p > 1) p = 1;

    /* two decimals is one step per ~1.5px of a 1500px journey, well under the
       point at which a further step is a different painted colour */
    p1 = Math.round(p1 * 100) / 100;
    p2 = Math.round(p2 * 100) / 100;
    p  = Math.round(p  * 100) / 100;

    if (p1 === lastP1 && p2 === lastP2 && k === lastK && p === lastP) return;

    /* ⚠ --k and the two segment values are written in the same batch, so the
       ground jumps the dead band and the ink changes sides on ONE frame. If
       these are ever split across frames the page shows a readable-failure
       frame at every inversion. */
    lastP1 = p1; lastP2 = p2; lastK = k; lastP = p;
    root.style.setProperty('--p1', p1);
    root.style.setProperty('--p2', p2);
    root.style.setProperty('--k',  k);
    root.style.setProperty('--p',  p);
  }

  function onScroll() {
    y = window.pageYOffset;
    if (queued) return;
    queued = true;
    requestAnimationFrame(frame);
  }

  var rt = null;
  function onResize() {
    if (rt) clearTimeout(rt);
    rt = setTimeout(function () {
      measure();
      lastP1 = lastP2 = lastK = lastP = -1;
      onScroll();
    }, 150);
  }

  measure();
  y = window.pageYOffset;
  /* seed --k from position rather than from the :root default of 1, or a
     reload partway down the page starts on the wrong side of the inversion
     and corrects itself visibly on the first scroll event */
  lastK = (y > cross) ? 1 : 0;
  frame();

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('load', function () {
    measure();
    lastP1 = lastP2 = lastP = -1;
    onScroll();
  });
}());
