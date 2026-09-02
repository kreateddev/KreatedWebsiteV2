/* ==========================================================================
   TESTIMONIALS — a horizontally scrollable track of full-length reviews.

   ⚠ THE TRACK IS A REAL SCROLL CONTAINER. Drag, swipe, trackpad and keyboard
   all work natively because the cards are laid out in an overflow-x element
   with scroll-snap; this script only nudges it along. 🚫 Do not reimplement
   this with transforms or absolute positioning — that takes away the native
   scrolling the owner specifically asked to keep.

   ⚠ THE READER ALWAYS WINS. Auto-advance yields the moment they touch the
   track and resumes a beat after they let go. Because a programmatic
   scrollTo fires the same 'scroll' events a human does, the script marks its
   own moves with `self` and ignores those — without that flag the carousel
   reads its own animation as user input and stops forever on the first tick.

   🚫 Never render a review count, star glyph or rating here. PROOF.md §5
   forbids count framing outright and allows stars only with evidence AND a
   design approval logged in DECISIONS.md; §6 bans review schema site-wide.
   ========================================================================== */
(function () {
  var root = document.querySelector('.revs');
  if (!root) return;
  var track = root.querySelector('.revs__track');
  var cards = track ? [].slice.call(track.querySelectorAll('.rev')) : [];
  var dotWrap = root.querySelector('.revs__dots');
  if (!track || cards.length < 2 || !dotWrap) return;

  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

  /* ⚠ 15s. These are FULL reviews, not pull quotes — the longest runs four
     paragraphs. The previous 7s was called out as too fast to read. This is a
     nudge for someone who has stopped reading, not a slideshow. */
  var HOLD = 15000;
  var SETTLE = 1600;          /* quiet time after a human scroll before resuming */

  var timer = null, settleTimer = null, self = false, idx = 0;
  var hidden = false, hovered = false, focused = false, touching = false;

  function moving() { return !(mq && mq.matches); }
  function stop() { if (timer) { clearTimeout(timer); timer = null; } }
  function sync() {
    stop();
    if (moving() && !hidden && !hovered && !focused && !touching) {
      timer = setTimeout(advance, HOLD);
    }
  }

  function current() {
    /* nearest card to the track's left edge — survives manual scrolling */
    var best = 0, bestD = Infinity, x = track.scrollLeft;
    cards.forEach(function (c, k) {
      var d = Math.abs(c.offsetLeft - track.offsetLeft - x);
      if (d < bestD) { bestD = d; best = k; }
    });
    return best;
  }

  function go(n, smooth) {
    idx = Math.max(0, Math.min(cards.length - 1, n));
    self = true;
    var left = cards[idx].offsetLeft - track.offsetLeft;
    try { track.scrollTo({ left: left, behavior: smooth === false ? 'auto' : 'smooth' }); }
    catch (e) { track.scrollLeft = left; }
    /* release the flag after the smooth scroll has finished emitting events */
    setTimeout(function () { self = false; paint(); }, 700);
    paint();
    sync();
  }

  function advance() {
    var n = current() + 1;
    go(n >= cards.length ? 0 : n);
  }

  function paint() {
    var k = current();
    [].slice.call(dotWrap.children).forEach(function (d, i) {
      d.setAttribute('aria-selected', i === k ? 'true' : 'false');
      d.tabIndex = i === k ? 0 : -1;
    });
  }

  cards.forEach(function (c, k) {
    var d = document.createElement('button');
    d.type = 'button';
    d.className = 'revs__dot';
    d.setAttribute('role', 'tab');
    d.setAttribute('aria-label', 'Testimonial ' + (k + 1) + ' of ' + cards.length);
    d.addEventListener('click', function () { go(k); });
    dotWrap.appendChild(d);
  });

  var prev = root.querySelector('[data-rev-prev]');
  var fwd  = root.querySelector('[data-rev-next]');
  if (prev) prev.addEventListener('click', function () { go(current() - 1); });
  if (fwd)  fwd.addEventListener('click', function () { go(current() + 1); });

  /* ⚠ A human scroll pauses; letting go resumes after SETTLE. `self` keeps the
     script's own smooth scroll from tripping this. */
  track.addEventListener('scroll', function () {
    if (self) return;
    touching = true;
    stop();
    if (settleTimer) clearTimeout(settleTimer);
    settleTimer = setTimeout(function () { touching = false; paint(); sync(); }, SETTLE);
  }, { passive: true });

  root.addEventListener('mouseenter', function () { hovered = true;  sync(); });
  root.addEventListener('mouseleave', function () { hovered = false; sync(); });
  root.addEventListener('focusin',    function () { focused = true;  sync(); });
  root.addEventListener('focusout',   function () { focused = false; sync(); });

  root.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft')  { go(current() - 1); e.preventDefault(); }
    if (e.key === 'ArrowRight') { go(current() + 1); e.preventDefault(); }
  });

  /* re-derive on the way back in rather than trusting a stale queued event */
  function resume() { hidden = document.hidden; sync(); }
  document.addEventListener('visibilitychange', resume);
  window.addEventListener('pageshow', resume);

  if (mq) {
    var onMQ = function () { sync(); };
    if (mq.addEventListener) mq.addEventListener('change', onMQ);
    else if (mq.addListener) mq.addListener(onMQ);
  }

  root.classList.add('is-live');
  paint();
  sync();
}());
