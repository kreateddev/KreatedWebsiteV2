/* ==========================================================================
   KREATED V2 — the client strip's emphasis cycle
   Homepage only. Added 2026-08-31.

   All three marks stay on screen at all times. This walks a single "lit"
   class along them, so what cycles is the light, not the logos: nothing
   enters, leaves, duplicates or scrolls, and every mark stays legible in
   every frame. See the .client rules in styles.css for why emphasis rather
   than movement is the right model at three clients.

   Cost: one timer, one IntersectionObserver, one class swap every 3.4s. No
   rAF loop, no scroll listener, no layout read. The timer does not exist at
   all when the strip is off screen, when the tab is hidden, when the visitor
   is pointing at or tabbed into the strip, or under reduced motion.

   ⚠ ACCESSIBILITY: this changes ONE presentational property (opacity) and
   never the content, the order or the DOM. There is nothing to announce, so
   there is deliberately no aria-live and no role="region" here — adding
   either would make a screen reader narrate a lighting effect every 3.4
   seconds. Every mark is a real link, always present, always in tab order,
   never moved. Focus cannot be trapped because nothing is ever removed.
   ========================================================================== */
(function () {
  'use strict';

  var list = document.querySelector('.clients__list');
  if (!list) return;

  var marks = [].slice.call(list.querySelectorAll('.client'));
  if (marks.length < 2) return;

  /* Reduced motion is a hard stop, not a slower cycle. Without `is-cycling`
     the stylesheet renders every mark at one stable strength, which is the
     finished state — nothing is hidden and nothing is waiting to appear. */
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  if (mq && mq.matches) return;

  var STEP = 3400;
  var i = 0, timer = null, visible = false, held = false;

  function paint() {
    for (var k = 0; k < marks.length; k++) {
      marks[k].classList.toggle('is-lit', k === i);
    }
  }
  function tick() { i = (i + 1) % marks.length; paint(); }

  function run() {
    if (timer || !visible || held || document.hidden) return;
    timer = setInterval(tick, STEP);
  }
  function stop() {
    if (!timer) return;
    clearInterval(timer); timer = null;
  }

  /* hold while the visitor is actually looking at one mark */
  function hold(on) { held = on; if (on) { stop(); } else { run(); } }
  list.addEventListener('pointerenter', function () { hold(true); });
  list.addEventListener('pointerleave', function () { hold(false); });
  list.addEventListener('focusin', function () { hold(true); });
  list.addEventListener('focusout', function () { hold(false); });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { stop(); } else { run(); }
  });

  list.classList.add('is-cycling');
  paint();

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) { run(); } else { stop(); }
    }, { rootMargin: '0px 0px -10% 0px' }).observe(list);
  } else {
    visible = true; run();
  }

  /* if the visitor turns reduced motion on mid-session, honour it immediately */
  if (mq) {
    var onChange = function () {
      if (mq.matches) { stop(); list.classList.remove('is-cycling'); }
    };
    if (mq.addEventListener) { mq.addEventListener('change', onChange); }
    else if (mq.addListener) { mq.addListener(onChange); }
  }
}());
