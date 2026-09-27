/* ============================================================================
   KPLAYER — plays brand-motion moments live on the website.
   ----------------------------------------------------------------------------
   <span data-kmotion="gbp"></span> becomes that moment, drawn as SVG at the
   element's own size (no video, no captions).

   HOW IT PLAYS (Skyler, 2026-09-27):
   · Every moment starts by itself as soon as it is on screen, so a row of
     cards plays together (the one-by-one sequence was too slow to watch).
   · It plays once and HOLDS ITS LAST FRAME; it replays only after it has
     left the screen entirely and come back.
   · On screen means a third of it shows on desktop, half of it on phones
     (≤760px), where cards stack or swipe.
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
  var wideMQ = window.matchMedia ? matchMedia('(min-width: 761px)') : { matches: true };

  /* one hidden sheet of shared defs (the mark, its gradients, its filters) for the whole page */
  var shared = document.createElementNS(NS, 'svg');
  shared.setAttribute('aria-hidden', 'true'); shared.setAttribute('focusable', 'false');
  shared.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
  document.body.appendChild(shared);
  K.defs(shared);

  var players = [], running = false;

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

  function tick(now) {
    var busy = false;
    players.forEach(function (pl) {
      if (pl.state !== 'playing') return;
      busy = true;
      pl.frame(now);
    });
    running = busy || players.some(function (pl) { return pl.state === 'playing'; });
    if (running) requestAnimationFrame(tick);
  }
  function wake() { if (!running && !reduce) { running = true; requestAnimationFrame(tick); } }

  var hasIO = 'IntersectionObserver' in window;
  var io = hasIO ? new IntersectionObserver(function (entries) {
    var now = performance.now();
    entries.forEach(function (en) {
      var pl = en.target.__kp; if (!pl) return;
      pl.vis = en.isIntersecting && en.intersectionRatio >= (wideMQ.matches ? .34 : .5);
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
    [].forEach.call(document.querySelectorAll('[data-kmotion]'), function (el) {
      var pl = new Player(el); if (!pl.M) return;
      el.__kp = pl; players.push(pl);
      if (ro) ro.observe(el);
    });
    if (reduce) return;
    if (hasIO) players.forEach(function (pl) { io.observe(pl.el); });
    else { players.forEach(function (pl) { pl.vis = true; pl.start(performance.now()); }); wake(); }
  }
  /* the moments draw text in General Sans; wait for it so labels are measured in the right face */
  var go = function () { (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(init); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
