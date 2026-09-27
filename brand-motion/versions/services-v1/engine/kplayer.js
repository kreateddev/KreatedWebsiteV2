/* ============================================================================
   KPLAYER — plays brand-motion moments live on the website.
   ----------------------------------------------------------------------------
   <span data-kmotion="gbp"></span> becomes that moment, drawn as SVG at the
   element's own size (no video, no captions). It plays through, holds on the
   final frame, fades and starts again, only while it is on screen.
   · prefers-reduced-motion: the final frame, still.
   · Resized: redrawn at the new size.
   · data-kdelay="ms" staggers a set so the cards do not move in lockstep.
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
  var HOLD = 1600, FADE = 500;

  /* one hidden sheet of shared defs (the mark, its gradients, its filters) for the whole page */
  var shared = document.createElementNS(NS, 'svg');
  shared.setAttribute('aria-hidden', 'true'); shared.setAttribute('focusable', 'false');
  shared.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
  document.body.appendChild(shared);
  K.defs(shared);

  var players = [], running = false;

  function Player(el) {
    this.el = el; this.M = K.moments[el.getAttribute('data-kmotion')];
    this.delay = parseFloat(el.getAttribute('data-kdelay') || '0');
    this.t0 = null; this.vis = false; this.W = 0;
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
    this.draw(reduce ? (M.loopOnly ? 0 : 1) : 0);
  };
  Player.prototype.frame = function (now) {
    if (!this.draw) return;
    if (this.t0 == null) this.t0 = now + this.delay;
    var M = this.M, e = now - this.t0;
    if (e < 0) { this.draw(0); this.svg.style.opacity = 1; return; }
    var T = M.loopOnly ? M.dur : M.dur + HOLD + FADE, t = e % T;
    this.draw(M.loopOnly ? t / M.dur : Math.min(1, t / M.dur));
    this.svg.style.opacity = !M.loopOnly && t > M.dur + HOLD ? 1 - (t - M.dur - HOLD) / FADE : 1;
  };

  function tick(now) {
    var any = false;
    for (var i = 0; i < players.length; i++) if (players[i].vis) { players[i].frame(now); any = true; }
    running = any;
    if (any) requestAnimationFrame(tick);
  }
  function wake() { if (!running && !reduce) { running = true; requestAnimationFrame(tick); } }

  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      var pl = en.target.__kp; if (!pl) return;
      pl.vis = en.isIntersecting;
      if (!pl.vis) pl.t0 = null;          /* leaving resets: it replays from the start next time */
      else wake();
    });
  }, { threshold: .15 }) : null;

  var ro = 'ResizeObserver' in window ? new ResizeObserver(function (entries) {
    entries.forEach(function (en) {
      var pl = en.target.__kp; if (!pl) return;
      clearTimeout(pl.rt);
      pl.rt = setTimeout(function () {
        if (Math.abs(pl.el.clientWidth - pl.W) > 2 || Math.abs(pl.el.clientHeight - pl.H) > 2) { pl.build(); if (!pl.vis && reduce) return; }
      }, 160);
    });
  }) : null;

  function init() {
    [].forEach.call(document.querySelectorAll('[data-kmotion]'), function (el) {
      var pl = new Player(el); if (!pl.M) return;
      el.__kp = pl; players.push(pl);
      if (io) io.observe(el); else { pl.vis = true; wake(); }
      if (ro) ro.observe(el);
    });
  }
  /* the moments draw text in General Sans; wait for it so labels are measured in the right face */
  var go = function () { (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(init); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
