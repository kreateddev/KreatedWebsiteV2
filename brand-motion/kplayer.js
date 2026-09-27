/* ============================================================================
   KPLAYER — plays brand-motion moments live on the website.
   ----------------------------------------------------------------------------
   <span data-kmotion="gbp"></span> becomes that moment, drawn as SVG at the
   element's own size (no video, no captions).

   HOW IT PLAYS (Skyler, 2026-09-27):
   · A moment plays once when it comes on screen and HOLDS ITS LAST FRAME.
     It only replays after it has left the screen and come back.
   · Inside a [data-kgroup] container the moments play ONE BY ONE, in page
     order: the next starts when the one before it finishes. A card that is
     not on screen yet (a lower row, a card off to the side of a phone swipe
     row) is skipped and plays when it arrives. The whole group resets when
     the container leaves the screen, so scrolling away and back replays the
     set from the first card.
   · PHONES (≤760px, Skyler 2026-09-27): no sequence. Cards stack or swipe
     there, so each one starts by itself when you scroll (or swipe) to it,
     once half of it is on screen, and resets when it is fully gone.
   · Wordless loops (pulse, kaleido: loopOnly) loop while on screen.
   · prefers-reduced-motion: every moment shows its final frame, still.
   · Resized: redrawn at the new size, keeping its place.
   · data-kzoom scales the scene; data-ky moves it down, in the moment's units.
   Source of truth: brand-motion/kplayer.js. The site copy is produced by
   brand-motion/sync-site.sh. 🚫 Do not edit the copy under assets/motion/.
   ========================================================================== */
(function () {
  'use strict';
  var K = window.KMotion;
  if (!K) return;
  var NS = 'http://www.w3.org/2000/svg';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var GAP = 250;   /* ms between one card finishing and the next starting */
  /* the one-by-one sequence is a desktop behaviour; phones play each card as it arrives */
  var wideMQ = window.matchMedia ? matchMedia('(min-width: 761px)') : { matches: true };
  function seq(pl) { return !!pl.group && wideMQ.matches; }

  /* one hidden sheet of shared defs (the mark, its gradients, its filters) for the whole page */
  var shared = document.createElementNS(NS, 'svg');
  shared.setAttribute('aria-hidden', 'true'); shared.setAttribute('focusable', 'false');
  shared.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
  document.body.appendChild(shared);
  K.defs(shared);

  var players = [], groups = [], running = false;

  function Player(el) {
    this.el = el; this.M = K.moments[el.getAttribute('data-kmotion')];
    this.vis = false; this.W = 0;
    this.state = 'idle';          /* idle → playing → done */
    this.t0 = 0; this.p = 0;
    if (this.M) this.build();
  }
  Player.prototype.build = function () {
    var el = this.el, M = this.M, W = el.clientWidth, H = el.clientHeight;
    if (!W || !H) return;
    if (this.svg) this.svg.remove();
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', (-W / 2) + ' ' + (-H / 2) + ' ' + W + ' ' + H);
    svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false');
    svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;overflow:hidden';
    svg.appendChild(document.createElementNS(NS, 'defs'));
    el.appendChild(svg);
    var wide = W / H > 1.4, zoom = parseFloat(el.getAttribute('data-kzoom') || '1');
    var u = Math.min(W, H) / 1000 * (wide ? (M.wideScale || .92) : 1) * zoom;
    /* data-ky nudges the scene down (in the moment's own units): scenes were composed with room for a caption */
    var ky = parseFloat(el.getAttribute('data-ky') || '0') * u;
    this.draw = M.build(K.el('g', { transform: 'translate(0,' + ky + ')' }, svg), u, W, H);
    this.svg = svg; this.W = W; this.H = H;
    if (M.bg && !el.style.background) el.style.background = M.bg;
    this.draw(reduce ? (M.loopOnly ? 0 : 1) : this.p);
  };
  Player.prototype.start = function (now) { this.state = 'playing'; this.t0 = now; };
  Player.prototype.reset = function () { this.state = 'idle'; this.p = 0; if (this.draw && !reduce) this.draw(0); };
  /* returns true when it has just finished */
  Player.prototype.frame = function (now) {
    if (!this.draw || this.state !== 'playing') return false;
    var M = this.M, e = now - this.t0;
    if (e < 0) return false;
    if (M.loopOnly) { this.p = (e % M.dur) / M.dur; this.draw(this.p); return false; }
    this.p = Math.min(1, e / M.dur); this.draw(this.p);
    if (this.p >= 1) { this.state = 'done'; return true; }
    return false;
  };

  function Group(el) { this.el = el; this.list = []; this.current = null; this.vis = false; }
  Group.prototype.next = function (now) {
    if (this.current || !this.vis) return;
    for (var i = 0; i < this.list.length; i++) {
      var pl = this.list[i];
      if (pl.state === 'idle' && pl.vis) { pl.start(now + GAP); this.current = pl; wake(); return; }
    }
  };
  Group.prototype.reset = function () { this.current = null; this.list.forEach(function (pl) { pl.reset(); }); };

  function tick(now) {
    var busy = false;
    players.forEach(function (pl) {
      if (pl.state !== 'playing') return;
      busy = true;
      var finished = pl.frame(now);
      if (finished && seq(pl)) { pl.group.current = null; pl.group.next(now); }
    });
    running = busy || players.some(function (pl) { return pl.state === 'playing'; });
    if (running) requestAnimationFrame(tick);
  }
  function wake() { if (!running && !reduce) { running = true; requestAnimationFrame(tick); } }

  /* two observers: a card counts as on screen when a third of it shows; a group counts as gone
     only when none of it shows (a single threshold would miss the moment it leaves entirely) */
  var hasIO = 'IntersectionObserver' in window;
  var gio = hasIO ? new IntersectionObserver(function (entries) {
    var now = performance.now();
    entries.forEach(function (en) {
      var g = en.target.__kg; if (!g) return;
      g.vis = en.isIntersecting;
      if (!g.vis) g.reset(); else if (wideMQ.matches) g.next(now);
    });
  }, { threshold: 0 }) : null;
  var io = hasIO ? new IntersectionObserver(function (entries) {
    var now = performance.now();
    entries.forEach(function (en) {
      var pl = en.target.__kp; if (!pl) return;
      pl.vis = en.isIntersecting && en.intersectionRatio >= (wideMQ.matches ? .34 : .5);
      if (seq(pl)) { if (pl.vis) pl.group.next(now); return; }
      if (pl.vis) { if (pl.state === 'idle') { pl.start(now); wake(); } }
      else if (!en.isIntersecting) pl.reset();          /* fully gone: replay next time */
    });
  }, { threshold: [0, .35, .5] }) : null;

  var ro = 'ResizeObserver' in window ? new ResizeObserver(function (entries) {
    entries.forEach(function (en) {
      var pl = en.target.__kp; if (!pl) return;
      clearTimeout(pl.rt);
      pl.rt = setTimeout(function () {
        if (Math.abs(pl.el.clientWidth - pl.W) > 2 || Math.abs(pl.el.clientHeight - pl.H) > 2) pl.build();
      }, 160);
    });
  }) : null;

  function init() {
    [].forEach.call(document.querySelectorAll('[data-kgroup]'), function (el) { var g = new Group(el); el.__kg = g; groups.push(g); });
    [].forEach.call(document.querySelectorAll('[data-kmotion]'), function (el) {
      var pl = new Player(el); if (!pl.M) return;
      el.__kp = pl; players.push(pl);
      var gEl = el.closest('[data-kgroup]');
      if (gEl && gEl.__kg) { pl.group = gEl.__kg; gEl.__kg.list.push(pl); }
      if (ro) ro.observe(el);
    });
    if (reduce) return;
    if (hasIO) {
      /* observe the players first, so a group's first "next" already knows which cards are on screen */
      players.forEach(function (pl) { io.observe(pl.el); });
      groups.forEach(function (g) { gio.observe(g.el); });
    } else {
      groups.forEach(function (g) { g.vis = true; });
      players.forEach(function (pl) { pl.vis = true; if (!seq(pl)) pl.start(performance.now()); });
      groups.forEach(function (g) { g.next(performance.now()); });
      wake();
    }
  }
  /* the moments draw text in General Sans; wait for it so labels are measured in the right face */
  var go = function () { (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(init); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
