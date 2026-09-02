/* ==========================================================================
   REVIEWS — a rotating carousel over four published Google reviews.

   ⚠ CONTENT RULES LIVE IN THE MARKUP, NOT HERE. This file only moves panels.
   🚫 It must never render a review count, a star glyph or a rating: PROOF.md
   §5 forbids count framing outright and allows stars only with evidence plus a
   logged design approval, and §6 bans review schema site-wide.

   ⚠ NO-JS SHOWS EVERY REVIEW. The panels are visible by default in CSS and this
   script opts INTO the carousel by adding .is-carousel, so if the script never
   runs the reader gets four stacked quotes — complete content, no interaction.
   🚫 Do not invert that by hiding panels in CSS.
   ⚠ REDUCED MOTION IS DIFFERENT: the carousel stays, the movement stops. The
   preference means "do not animate", not "do not paginate", so auto-advance and
   the panel transition are disabled while the arrows and dots keep working.
   ========================================================================== */
(function () {
  var root = document.querySelector('.revs');
  if (!root) return;
  var stage = root.querySelector('.revs__stage');
  var panels = [].slice.call(root.querySelectorAll('.rev'));
  var dotWrap = root.querySelector('.revs__dots');
  if (!stage || panels.length < 2 || !dotWrap) return;

  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var HOLD = 7000;            /* long enough to actually read a quote */
  var i = 0, timer = null;

  /* ⚠ THREE REASONS, ONE STATE — the same trap that froze the client marquee.
     Each pause reason is tracked separately and the timer is derived from all
     of them, so a late callback for one reason cannot clear another's pause.
     🚫 Do not collapse these into a single boolean. */
  var hidden = false, hovered = false, focused = false;

  function auto() { return !(mq && mq.matches); }
  function stop() { if (timer) { clearTimeout(timer); timer = null; } }
  function sync() {
    stop();
    if (auto() && !hidden && !hovered && !focused) timer = setTimeout(next, HOLD);
  }

  function show(n) {
    i = (n + panels.length) % panels.length;
    panels.forEach(function (p, k) {
      var on = k === i;
      p.classList.toggle('is-on', on);
      /* inert to AT and to the tab order while off-screen */
      p.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
    [].slice.call(dotWrap.children).forEach(function (d, k) {
      d.setAttribute('aria-selected', k === i ? 'true' : 'false');
      d.tabIndex = k === i ? 0 : -1;
    });
    sync();
  }
  function next() { show(i + 1); }

  panels.forEach(function (p, k) {
    var d = document.createElement('button');
    d.type = 'button';
    d.className = 'revs__dot';
    d.setAttribute('role', 'tab');
    d.setAttribute('aria-label', 'Review ' + (k + 1) + ' of ' + panels.length);
    d.addEventListener('click', function () { show(k); });
    dotWrap.appendChild(d);
  });

  var prev = root.querySelector('[data-rev-prev]');
  var fwd  = root.querySelector('[data-rev-next]');
  if (prev) prev.addEventListener('click', function () { show(i - 1); });
  if (fwd)  fwd.addEventListener('click', function () { show(i + 1); });

  root.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft')  { show(i - 1); e.preventDefault(); }
    if (e.key === 'ArrowRight') { show(i + 1); e.preventDefault(); }
  });

  root.addEventListener('mouseenter', function () { hovered = true;  sync(); });
  root.addEventListener('mouseleave', function () { hovered = false; sync(); });
  root.addEventListener('focusin',    function () { focused = true;  sync(); });
  root.addEventListener('focusout',   function () { focused = false; sync(); });

  /* ⚠ Re-derive on the way back in rather than trusting whatever fired last —
     a backgrounded tab or a bfcache restore can deliver stale events. */
  function resume() { hidden = document.hidden; sync(); }
  document.addEventListener('visibilitychange', resume);
  window.addEventListener('pageshow', resume);

  if (mq) {
    var onMQ = function () { sync(); };
    if (mq.addEventListener) mq.addEventListener('change', onMQ);
    else if (mq.addListener) mq.addListener(onMQ);
  }

  root.classList.add('is-carousel');
  show(0);
}());
