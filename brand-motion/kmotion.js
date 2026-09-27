/* ============================================================================
   KREATED BRAND MOTION — the engine and the moments
   ----------------------------------------------------------------------------
   Every moment is built from the K mark and driven by ONE number, p, from 0 to
   1. Nothing runs on its own clock, so the same moment can be:
     · scrolled (the reader's scroll is the playhead, on the site),
     · looped (the studio page, a screen in the office),
     · rendered frame by frame into video (Instagram, Reels, decks, email).
   The beam that sweeps through the mark is driven by p as well, which is what
   makes the rendered video frame-exact.

   A moment is { title, line, dur, cap:[in,out], build(root,u,W,H) → draw(p) }.
   u is the unit: min(width, height) / 1000, so every moment scales to any
   format without its own layout code.

   🚫 Lines are the site's own copy or claim nothing. No rankings, no leads, no
   numbers. A moment that needs a claim to work is the wrong moment.
   ========================================================================== */
(function (global) {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var PATH_R = 'M465.33,450.75l-142.53-123.63,1.06,15.68,7.85,140.34h-61.41s5.2-95.45,5.2-95.45c.53-13.64,2.38-26.04,6.34-39.01,4.67-15.3,7.55-30.71,7.43-46.75-.21-26.93-12.73-47.45-14.18-73.97l-2.53-53.65-2.36-56.98h58.62s-.85,28.18-.85,28.18l-4.63,104.45-.53,15.89,120.57-96.56,22.13-16.88.11,79.58-46.42,32.08-52.53,35.58,98.91,69.23-.24,81.87Z';
  var PATH_L = 'M206.34,390.2l-71.61,61.09-.07-81.36,100.13-69.93-100.18-68.64.32-78.3,112.64,90.32c19.08,13.57,29.48,35.02,28.37,58.62-.79,16.57-6.42,33.54-19.17,44.57l-50.43,43.62Z';
  var SPARK = 'M0-22 4-4 22 0 4 4 0 22-4 4-22 0-4-4Z';

  /* ---- small tools -------------------------------------------------------- */
  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function seg(p, a, b) { return cl((p - a) / (b - a)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  var E = {
    inOut: function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
    out: function (t) { return 1 - Math.pow(1 - t, 3); },
    in: function (t) { return t * t * t; },
    back: function (t) { var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    elastic: function (t) { return t === 0 || t === 1 ? t : Math.pow(2, -10 * t) * Math.sin((t * 10 - .75) * (2 * Math.PI / 3)) + 1; },
    bounce: function (t) {
      var n = 7.5625, d = 2.75;
      if (t < 1 / d) return n * t * t;
      if (t < 2 / d) return n * (t -= 1.5 / d) * t + .75;
      if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + .9375;
      return n * (t -= 2.625 / d) * t + .984375;
    }
  };
  /* a seeded random, so the pixels and the scatter are the same on every render */
  function rng(seed) { return function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }

  /* ---- shared defs: the mark, the gradients, the glow -------------------------- */
  function defs(svg) {
    var d = el('defs', {}, svg);
    function lg(id, stops, a) { var g = el('linearGradient', Object.assign({ id: id }, a), d);
      stops.forEach(function (s) { el('stop', { offset: s[0], 'stop-color': s[1], 'stop-opacity': s[2] == null ? 1 : s[2] }, g); }); }
    function rg(id, stops) { var g = el('radialGradient', { id: id }, d);
      stops.forEach(function (s) { el('stop', { offset: s[0], 'stop-color': s[1], 'stop-opacity': s[2] == null ? 1 : s[2] }, g); }); }
    lg('kFill', [['0', '#2A55E6'], ['.55', '#1234B0'], ['1', '#0A1F78']], { x1: 0, y1: 0, x2: 1, y2: 1 });
    lg('kBeam', [['.30', '#5B86FF', 0], ['.50', '#8FB0FF', .95], ['.56', '#EEF3FF', .95], ['.72', '#0A47F0', 0]], { x1: 0, y1: 0, x2: 1, y2: 0 });
    lg('kLine', [['0', '#5B86FF'], ['.5', '#DCE6FF'], ['1', '#5B86FF']], { x1: 0, y1: 0, x2: 1, y2: 0 });
    lg('kGrey', [['0', '#56648F'], ['1', '#3A4670']], { x1: 0, y1: 0, x2: 1, y2: 1 });
    rg('kBloom', [['0', '#5B86FF', .55], ['.45', '#2A55E6', .18], ['1', '#2A55E6', 0]]);
    rg('kFlash', [['0', '#FFFFFF', .95], ['.3', '#BFD0FF', .6], ['1', '#5B86FF', 0]]);
    el('path', { id: 'kR', d: PATH_R }, d);
    el('path', { id: 'kL', d: PATH_L }, d);
    var both = el('clipPath', { id: 'kClip' }, d); el('use', { href: '#kR' }, both); el('use', { href: '#kL' }, both);
    var cr = el('clipPath', { id: 'kClipR' }, d); el('use', { href: '#kR' }, cr);
    var cL = el('clipPath', { id: 'kClipL' }, d); el('use', { href: '#kL' }, cL);
    var f = el('filter', { id: 'kGlow', x: '-60%', y: '-60%', width: '220%', height: '220%' }, d);
    el('feGaussianBlur', { stdDeviation: '14', result: 'b' }, f);
    var m = el('feMerge', {}, f); el('feMergeNode', { in: 'b' }, m); el('feMergeNode', { in: 'SourceGraphic' }, m);
    return d;
  }

  /* ---- a mark, or one piece of it, with its own beam ------------------------- */
  function mark(parent, o) {
    o = o || {};
    var which = o.piece || 'both';
    var g = el('g', {}, parent);
    var inner = el('g', { transform: 'translate(-300,-304)' }, g);
    var fill = o.fill || 'url(#kFill)';
    var parts = [];
    if (which !== 'L') parts.push(el('use', { href: '#kR', fill: fill }, inner));
    if (which !== 'R') parts.push(el('use', { href: '#kL', fill: fill }, inner));
    var clip = which === 'R' ? 'kClipR' : which === 'L' ? 'kClipL' : 'kClip';
    var bc = el('g', { 'clip-path': 'url(#' + clip + ')' }, inner);
    var beam = el('rect', { x: -320, y: -320, width: 1240, height: 1240, fill: o.beamFill || 'url(#kBeam)', opacity: o.beamOp == null ? .75 : o.beamOp }, bc);
    return {
      g: g, inner: inner, parts: parts, beam: beam,
      set: function (s) {
        var x = s.x || 0, y = s.y || 0, sx = s.sx == null ? 1 : s.sx, sy = s.sy == null ? sx : s.sy, r = s.rot || 0;
        g.setAttribute('transform', 'translate(' + x + ',' + y + ') rotate(' + r + ') scale(' + sx + ',' + sy + ')');
        g.style.opacity = s.op == null ? 1 : s.op;
        beam.setAttribute('transform', 'rotate(' + (s.beam || 0) + ' 300 262)');
      }
    };
  }
  function spark(parent, x, y, s) { return el('path', { d: SPARK, fill: '#DCE6FF', transform: 'translate(' + x + ',' + y + ') scale(' + s + ')', opacity: 0 }, parent); }
  function drawn(path) { var L = path.getTotalLength(); path.style.strokeDasharray = L; path.style.strokeDashoffset = L; return L; }

  /* =========================================================================
     THE MOMENTS
     ========================================================================= */
  var M = {};

  /* 1 · THE FACE — the mark alone, a second mark, a smile, a blink */
  M.face = {
    title: 'The face', dur: 7000, cap: [.74, .9],
    line: 'Every search ends with <em>a person deciding.</em>',
    build: function (root, u) {
      var glow = el('circle', { r: 330 * u, fill: 'url(#kBloom)' }, root);
      var face = el('g', {}, root);
      var bL = el('g', {}, face), bR = el('g', {}, face);
      var eL = mark(bL), eR = mark(bR);
      var sm = el('path', { d: 'M' + (-165 * u) + ' ' + (150 * u) + ' C ' + (-95 * u) + ' ' + (240 * u) + ', ' + (95 * u) + ' ' + (240 * u) + ', ' + (165 * u) + ' ' + (150 * u),
        fill: 'none', stroke: 'url(#kLine)', 'stroke-width': 30 * u, 'stroke-linecap': 'round' }, face);
      var Ls = drawn(sm);
      var sp = [[-300, -190, 1.2], [320, -150, .8], [260, 210, .6]].map(function (a) { return spark(face, a[0] * u, a[1] * u, a[2] * u); });
      return function (p) {
        var a = E.inOut(seg(p, .10, .32));
        var sL = lerp(1.18, .48, a) * u, xL = lerp(0, -175, a) * u, yL = lerp(0, -50, a) * u;
        var b = seg(p, .30, .46), sR = .48 * u * (b ? E.back(b) : 0);
        var c = E.inOut(seg(p, .48, .68));
        var d = E.inOut(seg(p, .68, .80));
        var bl = seg(p, .80, .86), bk = bl > 0 && bl < 1 ? 1 - Math.sin(bl * Math.PI) * .88 : 1;
        var beam = p * 520;
        eL.set({ x: xL, y: yL, sx: sL, beam: beam });
        eR.set({ x: 175 * u, y: -50 * u, sx: -sR, sy: sR, beam: beam + 90 });
        bL.setAttribute('transform', 'translate(' + xL + ',' + yL + ') scale(1,' + bk + ') translate(' + (-xL) + ',' + (-yL) + ')');
        bR.setAttribute('transform', 'translate(' + (175 * u) + ',' + (-50 * u) + ') scale(1,' + bk + ') translate(' + (-175 * u) + ',' + (50 * u) + ')');
        glow.setAttribute('transform', 'translate(' + xL + ',' + yL + ') scale(' + lerp(1.15, 0, a) + ')'); glow.style.opacity = 1 - a;
        sm.style.strokeDashoffset = Ls * (1 - c); sm.style.opacity = c > 0 ? 1 : 0;
        face.setAttribute('transform', 'translate(0,' + lerp(0, -26, d) * u + ') scale(' + lerp(1, 1.05, d) + ')');
        sp.forEach(function (s, i) { var t = seg(p, .66 + i * .05, .76 + i * .05); s.style.opacity = t > 0 && t < 1 ? Math.sin(t * Math.PI) : 0; });
      };
    }
  };

  /* 2 · THE PIN — the mark drops onto a map like a pin; the others dim */
  M.pin = {
    title: 'The pin', dur: 7000, cap: [.72, .88],
    line: 'Found at the moment someone <em>nearby is looking.</em>',
    build: function (root, u) {
      var map = el('g', {}, root);
      var grid = el('g', { stroke: '#2B3C6B', 'stroke-width': 1.2 * u }, map);
      for (var i = -13; i <= 13; i++) {
        el('line', { x1: -1500 * u, y1: i * 95 * u, x2: 1500 * u, y2: i * 95 * u + (i % 2 ? 36 : -24) * u }, grid);
        el('line', { x1: i * 120 * u, y1: -1100 * u, x2: i * 120 * u + 70 * u, y2: 1100 * u }, grid);
      }
      var sea = el('path', { d: 'M' + (-1500 * u) + ' ' + (330 * u) + ' C ' + (-500 * u) + ' ' + (250 * u) + ', ' + (-200 * u) + ' ' + (410 * u) + ', ' + (120 * u) + ' ' + (320 * u) + ' S ' + (560 * u) + ' ' + (210 * u) + ', ' + (1500 * u) + ' ' + (280 * u) + ' L ' + (1500 * u) + ' ' + (1200 * u) + ' L ' + (-1500 * u) + ' ' + (1200 * u) + 'Z', fill: '#0A1A55', opacity: .9 }, map);
      var coast = el('path', { d: 'M' + (-1500 * u) + ' ' + (330 * u) + ' C ' + (-500 * u) + ' ' + (250 * u) + ', ' + (-200 * u) + ' ' + (410 * u) + ', ' + (120 * u) + ' ' + (320 * u) + ' S ' + (560 * u) + ' ' + (210 * u) + ', ' + (1500 * u) + ' ' + (280 * u),
        fill: 'none', stroke: '#5B86FF', 'stroke-width': 3 * u }, root);
      var river = el('path', { d: 'M' + (-70 * u) + ' ' + (-1100 * u) + ' C ' + (-10 * u) + ' ' + (-500 * u) + ', ' + (-150 * u) + ' ' + (-100 * u) + ', ' + (-40 * u) + ' ' + (320 * u),
        fill: 'none', stroke: '#2F4FB8', 'stroke-width': 22 * u, 'stroke-linecap': 'round', opacity: .45 }, root);
      var Lc = drawn(coast), Lr = drawn(river);
      var pts = [[-340, -150], [270, -250], [360, 40], [-230, 130], [140, -380], [-430, -330], [420, -420], [-120, -470]];
      var others = pts.map(function (a) { return el('circle', { cx: a[0] * u, cy: a[1] * u, r: 11 * u, fill: '#8C9CC8', opacity: 0 }, root); });
      var IX = 40 * u, IY = 70 * u;
      var shadow = el('ellipse', { cx: IX, cy: IY, rx: 0, ry: 0, fill: '#000', opacity: .45 }, root);
      var rings = [0, 1, 2].map(function () { return el('circle', { cx: IX, cy: IY, r: 0, fill: 'none', stroke: '#8FB0FF', 'stroke-width': 3 * u, opacity: 0 }, root); });
      var pinG = el('g', {}, root);
      var tip = el('path', { d: 'M' + (-24 * u) + ' ' + (-118 * u) + ' L 0 0 L ' + (24 * u) + ' ' + (-118 * u) + 'Z', fill: '#1B3FC4' }, pinG);
      var head = mark(pinG);
      var sp = [[-140, -300, 1], [170, -260, .7]].map(function (a) { return spark(root, (IX + a[0] * u), (IY + a[1] * u), a[2] * u); });
      return function (p) {
        var m = E.out(seg(p, 0, .14));
        map.style.opacity = m; coast.style.strokeDashoffset = Lc * (1 - E.inOut(seg(p, .02, .24))); river.style.strokeDashoffset = Lr * (1 - E.inOut(seg(p, .04, .26)));
        others.forEach(function (o, i) { var t = seg(p, .08 + i * .02, .16 + i * .02); var dim = seg(p, .48 + i * .025, .56 + i * .025); o.style.opacity = t * lerp(1, .18, dim); o.setAttribute('r', 11 * u * (t ? E.back(t) : 0)); });
        var f = seg(p, .16, .36), fall = E.bounce(f);
        var py = lerp(-1100 * u, 0, fall);
        var sq = seg(p, .36, .44), squash = sq > 0 && sq < 1 ? 1 - Math.sin(sq * Math.PI) * .18 : 1;
        pinG.setAttribute('transform', 'translate(' + IX + ',' + (IY + py) + ') scale(' + (1 / squash * .98 + .02) + ',' + squash + ')');
        head.set({ y: -175 * u, sx: .48 * u, beam: p * 480 });
        tip.style.opacity = 1;
        var sh = seg(p, .16, .36); shadow.setAttribute('rx', 70 * u * E.in(sh)); shadow.setAttribute('ry', 16 * u * E.in(sh));
        rings.forEach(function (r, i) { var t = seg(p, .36 + i * .1, .66 + i * .1); r.setAttribute('r', 260 * u * E.out(t)); r.style.opacity = t > 0 ? (1 - t) * .9 : 0; });
        sp.forEach(function (s, i) { var t = seg(p, .42 + i * .06, .54 + i * .06); s.style.opacity = t > 0 && t < 1 ? Math.sin(t * Math.PI) : 0; });
      };
    }
  };

  /* 3 · THE BUILD — the mark becomes the logo of a site that draws itself beneath it */
  M.build = {
    title: 'The build', dur: 7500, cap: [.8, .94],
    line: 'Built from <em>the name up.</em>',
    build: function (root, u) {
      var W = 780 * u, H = 600 * u, X0 = -W / 2, Y0 = -H / 2 - 30 * u;
      var frame = el('rect', { x: X0, y: Y0, width: W, height: H, fill: 'none', stroke: '#8C9CC8', 'stroke-width': 2 * u, rx: 6 * u }, root);
      var Lf = drawn(frame);
      var bar = el('line', { x1: X0, y1: Y0 + 70 * u, x2: X0 + W, y2: Y0 + 70 * u, stroke: '#3A4E86', 'stroke-width': 1.5 * u, opacity: 0 }, root);
      function block(x, y, w, h, fill, extra) { return el('rect', Object.assign({ x: X0 + x * u, y: Y0 + y * u, width: w * u, height: h * u, fill: fill, opacity: 0 }, extra || {}), root); }
      var blocks = [
        block(560, 30, 44, 10, '#56648F'), block(620, 30, 44, 10, '#56648F'), block(680, 30, 60, 10, '#56648F'),
        block(50, 130, 320, 36, '#E6ECFF'), block(50, 180, 250, 36, '#E6ECFF'),
        block(50, 250, 300, 12, '#8C9CC8'), block(50, 272, 270, 12, '#8C9CC8'), block(50, 294, 220, 12, '#8C9CC8')
      ];
      var img = el('g', { opacity: 0 }, root);
      el('rect', { x: X0 + 430 * u, y: Y0 + 120 * u, width: 300 * u, height: 250 * u, fill: '#0F2378' }, img);
      var imgMark = mark(img, { beamOp: .9 });
      var btn = el('g', { opacity: 0 }, root);
      var btnR = el('rect', { x: X0 + 50 * u, y: Y0 + 340 * u, width: 190 * u, height: 58 * u, fill: '#2A55E6', rx: 4 * u }, btn);
      el('rect', { x: X0 + 80 * u, y: Y0 + 363 * u, width: 110 * u, height: 12 * u, fill: '#EEF3FF' }, btn);
      var rows = [0, 1, 2].map(function (i) { return block(50 + i * 245, 450, 215, 110, '#101C4E', { stroke: '#2B3C6B', 'stroke-width': 1 * u }); });
      var ripple = el('circle', { cx: X0 + 145 * u, cy: Y0 + 369 * u, r: 0, fill: 'none', stroke: '#DCE6FF', 'stroke-width': 3 * u, opacity: 0 }, root);
      var cursor = el('path', { d: 'M0 0 L0 46 L12 34 L22 56 L31 52 L21 31 L38 31 Z', fill: '#FFFFFF', stroke: '#050B24', 'stroke-width': 2, opacity: 0 }, root);
      var logo = mark(root);
      return function (p) {
        var a = E.inOut(seg(p, .10, .30));
        logo.set({ x: lerp(0, X0 + 58 * u, a), y: lerp(-10 * u, Y0 + 36 * u, a), sx: lerp(1.05, .13, a) * u, beam: p * 520 });
        frame.style.strokeDashoffset = Lf * (1 - E.inOut(seg(p, .22, .42)));
        bar.style.opacity = seg(p, .36, .42);
        blocks.forEach(function (b, i) { var t = E.out(seg(p, .40 + i * .025, .50 + i * .025)); b.style.opacity = t; b.setAttribute('transform', 'translate(0,' + (1 - t) * 14 * u + ')'); });
        var ti = E.out(seg(p, .50, .62)); img.style.opacity = ti; imgMark.set({ x: X0 + 580 * u, y: Y0 + 245 * u, sx: .48 * u * lerp(.8, 1, ti), beam: p * 700 });
        var tb = E.back(seg(p, .58, .66)); btn.style.opacity = seg(p, .58, .62); btn.setAttribute('transform', 'translate(' + (X0 + 145 * u) + ',' + (Y0 + 369 * u) + ') scale(' + (seg(p, .58, .66) ? tb : 0) + ') translate(' + (-(X0 + 145 * u)) + ',' + (-(Y0 + 369 * u)) + ')');
        rows.forEach(function (r, i) { var t = E.out(seg(p, .62 + i * .03, .70 + i * .03)); r.style.opacity = t; r.setAttribute('transform', 'translate(0,' + (1 - t) * 20 * u + ')'); });
        var c = E.inOut(seg(p, .68, .78)), cx = lerp(X0 + W + 60 * u, X0 + 150 * u, c), cy = lerp(Y0 + H + 80 * u, Y0 + 372 * u, c);
        cursor.style.opacity = seg(p, .68, .70); cursor.setAttribute('transform', 'translate(' + cx + ',' + cy + ') scale(' + (1.3 * u) + ')');
        var k = seg(p, .78, .82), press = k > 0 && k < 1 ? 1 - Math.sin(k * Math.PI) * .07 : 1;
        btnR.setAttribute('transform', 'translate(' + (X0 + 145 * u) + ',' + (Y0 + 369 * u) + ') scale(' + press + ') translate(' + (-(X0 + 145 * u)) + ',' + (-(Y0 + 369 * u)) + ')');
        var rp = seg(p, .79, .92); ripple.setAttribute('r', 120 * u * E.out(rp)); ripple.style.opacity = rp > 0 ? (1 - rp) : 0;
      };
    }
  };

  /* 4 · THE SEVEN — seven marks spin out onto an orbit, each a service */
  M.seven = {
    title: 'The seven', dur: 8000, cap: [.76, .92],
    line: 'Seven ways a business <em>gets chosen.</em>',
    build: function (root, u) {
      var names = ['Web Design', 'Redesign', 'Local SEO', 'Google Profile', 'Brand', 'Answer Engines', 'Social'];
      var R = 300 * u;
      var ring = el('circle', { r: R, fill: 'none', stroke: '#3A4E86', 'stroke-width': 1.5 * u, transform: 'rotate(-90)' }, root);
      var Lr = drawn(ring);
      var ring2 = el('circle', { r: R + 90 * u, fill: 'none', stroke: '#1C2A5E', 'stroke-width': 1 * u, 'stroke-dasharray': (4 * u) + ' ' + (10 * u), opacity: 0 }, root);
      var glow = el('circle', { r: 300 * u, fill: 'url(#kBloom)' }, root);
      var big = mark(root);
      var small = names.map(function () { return mark(root, { beamOp: .9 }); });
      var labels = names.map(function (n) {
        var t = el('text', { 'font-family': 'General Sans, system-ui, sans-serif', 'font-weight': 500, 'font-size': 25 * u, fill: '#DDE4F7', opacity: 0 }, root);
        var ls = n.indexOf(' ') > 0 && n.length > 10 ? n.split(' ') : [n];
        ls.forEach(function (w, k) { var ts = el('tspan', { dy: k ? 29 * u : 0 }, t); ts.textContent = w; });
        t.lines = ls.length; return t;
      });
      var dots = names.map(function () { return el('circle', { r: 4 * u, fill: '#5B86FF', opacity: 0 }, root); });
      return function (p) {
        var g = E.out(seg(p, 0, .12));
        big.set({ sx: lerp(.9, .62, E.inOut(seg(p, .12, .3))) * u * (g ? E.back(g) : 0), beam: p * 540 });
        glow.style.opacity = lerp(1, .55, seg(p, .12, .3));
        ring.style.strokeDashoffset = Lr * (1 - E.inOut(seg(p, .14, .36)));
        ring2.style.opacity = seg(p, .3, .45) * .9;
        var spin = -90 + p * 50;
        small.forEach(function (m, i) {
          var t = seg(p, .22 + i * .045, .40 + i * .045), e = t ? E.back(t) : 0;
          var ang = (spin + i * 360 / 7) * Math.PI / 180, r = R * E.out(t);
          var x = Math.cos(ang) * r, y = Math.sin(ang) * r;
          m.set({ x: x, y: y, sx: .15 * u * e, op: t ? 1 : 0, beam: p * 700 + i * 50 });
          var lt = seg(p, .46 + i * .03, .58 + i * .03);
          var lx = Math.cos(ang) * (R + 62 * u), ly = Math.sin(ang) * (R + 62 * u);
          var lab = labels[i]; lab.style.opacity = lt;
          lab.setAttribute('text-anchor', Math.abs(Math.cos(ang)) < .25 ? 'middle' : (Math.cos(ang) > 0 ? 'start' : 'end'));
          var vy = Math.abs(Math.cos(ang)) < .25 ? (Math.sin(ang) > 0 ? 22 * u : -8 * u - (lab.lines - 1) * 29 * u) : 9 * u - (lab.lines - 1) * 14.5 * u;
          lab.setAttribute('x', lx); lab.setAttribute('y', ly + vy);
          for (var k = 0; k < lab.childNodes.length; k++) lab.childNodes[k].setAttribute('x', lx);
          var dt = dots[i]; dt.setAttribute('cx', Math.cos(ang) * (R + 30 * u)); dt.setAttribute('cy', Math.sin(ang) * (R + 30 * u)); dt.style.opacity = lt * .9;
        });
      };
    }
  };

  /* 5 · THE TWO HALVES — the mark is two pieces; they find each other */
  M.halves = {
    title: 'The two halves', dur: 6500, cap: [.7, .88],
    line: 'One person, <em>start to launch.</em>',
    build: function (root, u) {
      var glow = el('circle', { r: 360 * u, fill: 'url(#kBloom)', opacity: 0 }, root);
      var L = mark(root, { piece: 'L' }), R = mark(root, { piece: 'R' });
      var flash = el('circle', { cx: -40 * u, cy: -10 * u, r: 0, fill: 'url(#kFlash)', opacity: 0 }, root);
      var ring = el('circle', { cx: -40 * u, cy: -10 * u, r: 0, fill: 'none', stroke: '#DCE6FF', 'stroke-width': 3 * u, opacity: 0 }, root);
      var sp = [[-260, -220, 1.2], [230, -250, .8], [-200, 240, .7], [260, 200, 1]].map(function (a) { return spark(root, a[0] * u, a[1] * u, a[2] * u); });
      return function (p) {
        var t = E.inOut(seg(p, .04, .46));
        var snap = seg(p, .46, .52), kick = snap > 0 && snap < 1 ? Math.sin(snap * Math.PI) : 0;
        var s = 1.05 * u;
        L.set({ x: lerp(-760 * u, 0, t) - kick * 10 * u, y: lerp(-120 * u, 0, t), rot: lerp(-38, 0, t), sx: s, beam: p * 420 });
        R.set({ x: lerp(760 * u, 0, t) + kick * 10 * u, y: lerp(140 * u, 0, t), rot: lerp(32, 0, t), sx: s, beam: p * 420 + 40 });
        var f = seg(p, .46, .62); flash.setAttribute('r', 380 * u * E.out(f)); flash.style.opacity = f > 0 ? (1 - f) : 0;
        var rr = seg(p, .47, .72); ring.setAttribute('r', 520 * u * E.out(rr)); ring.style.opacity = rr > 0 ? (1 - rr) * .8 : 0;
        glow.style.opacity = E.out(seg(p, .48, .7));
        sp.forEach(function (sk, i) { var q = seg(p, .5 + i * .04, .62 + i * .04); sk.style.opacity = q > 0 && q < 1 ? Math.sin(q * Math.PI) : 0; });
      };
    }
  };

  /* 6 · THE SEARCH — a search is typed; the top result turns into the mark */
  M.search = {
    title: 'The search', dur: 7500, cap: [.76, .92],
    line: 'Built to be <em>found.</em>',
    build: function (root, u) {
      var q = 'contractor near me';
      var BW = 780 * u, BX = -BW / 2, BY = -330 * u, BH = 96 * u;
      var bar = el('rect', { x: BX, y: BY, width: BW, height: BH, rx: 12 * u, fill: '#0B1437', stroke: '#8C9CC8', 'stroke-width': 2 * u, opacity: 0 }, root);
      var mg = el('g', { opacity: 0, stroke: '#8C9CC8', 'stroke-width': 4 * u, fill: 'none' }, root);
      el('circle', { cx: BX + 52 * u, cy: BY + 44 * u, r: 17 * u }, mg); el('line', { x1: BX + 64 * u, y1: BY + 57 * u, x2: BX + 78 * u, y2: BY + 71 * u }, mg);
      var txt = el('text', { x: BX + 104 * u, y: BY + 60 * u, 'font-family': 'General Sans, system-ui, sans-serif', 'font-size': 38 * u, 'font-weight': 400, fill: '#F2F5FF' }, root);
      var caret = el('rect', { x: 0, y: BY + 26 * u, width: 3 * u, height: 44 * u, fill: '#8FB0FF', opacity: 0 }, root);
      var rows = [0, 1, 2].map(function (i) {
        var g = el('g', { opacity: 0 }, root), y = -150 * u + i * 150 * u;
        var box = el('rect', { x: BX, y: y, width: BW, height: 124 * u, fill: '#0B1437', stroke: '#2B3C6B', 'stroke-width': 1.5 * u, rx: 8 * u }, g);
        var sq = el('rect', { x: BX + 26 * u, y: y + 22 * u, width: 80 * u, height: 80 * u, fill: '#1C2A5E', rx: 4 * u }, g);
        el('rect', { x: BX + 130 * u, y: y + 30 * u, width: (i === 0 ? 330 : 290 - i * 30) * u, height: 22 * u, fill: '#8C9CC8' }, g);
        el('rect', { x: BX + 130 * u, y: y + 70 * u, width: (440 - i * 40) * u, height: 13 * u, fill: '#3A4E86' }, g);
        return { g: g, box: box, sq: sq, y: y };
      });
      var k = mark(root, { beamOp: .9 });
      var sp = [[BX + BW - 40 * u, -170 * u, 1], [BX + 20 * u, -190 * u, .7]].map(function (a) { return spark(root, a[0], a[1], a[2] * u); });
      return function (p) {
        var b = E.out(seg(p, 0, .1)); bar.style.opacity = b; mg.style.opacity = b;
        bar.setAttribute('transform', 'translate(0,' + (1 - b) * 20 * u + ')');
        var n = Math.floor(q.length * seg(p, .1, .4));
        txt.textContent = q.slice(0, n);
        var tw = 0; try { tw = txt.getComputedTextLength(); } catch (e) {}
        caret.setAttribute('x', BX + 108 * u + tw);
        var typing = p > .08 && p < .44; caret.style.opacity = typing ? (Math.floor(p * 60) % 2 ? 1 : .15) : 0;
        var enter = seg(p, .42, .46), nudge = enter > 0 && enter < 1 ? Math.sin(enter * Math.PI) : 0;
        bar.setAttribute('stroke', nudge ? '#8FB0FF' : '#8C9CC8');
        rows.forEach(function (r, i) {
          var t = E.out(seg(p, .46 + i * .05, .56 + i * .05));
          var dim = seg(p, .62, .7);
          r.g.style.opacity = t * (i === 0 ? 1 : lerp(1, .25, dim));
          r.g.setAttribute('transform', 'translate(0,' + (1 - t) * 24 * u + ')');
          if (i === 0) { var hl = seg(p, .6, .68); r.box.setAttribute('stroke', hl ? '#5B86FF' : '#2B3C6B'); r.box.setAttribute('stroke-width', (1.5 + hl * 1.5) * u); r.sq.style.opacity = 1 - seg(p, .6, .64); }
        });
        var kt = seg(p, .6, .7), ke = kt ? E.back(kt) : 0;
        k.set({ x: BX + 66 * u, y: rows[0].y + 62 * u, sx: .2 * u * ke, op: kt ? 1 : 0, beam: p * 700 });
        sp.forEach(function (s, i) { var t = seg(p, .66 + i * .05, .78 + i * .05); s.style.opacity = t > 0 && t < 1 ? Math.sin(t * Math.PI) : 0; });
      };
    }
  };

  /* 7 · NEON — the mark flickers on like a sign, then floods with colour */
  M.neon = {
    title: 'Neon', dur: 6500, cap: [.62, .82],
    line: 'Live. <em>And it&rsquo;s yours.</em>',
    build: function (root, u) {
      var halo = el('g', { filter: 'url(#kGlow)', opacity: 0 }, root);
      var hm = el('g', { transform: 'scale(' + (1.2 * u) + ') translate(-300,-304)' }, halo);
      el('use', { href: '#kR', fill: 'none', stroke: '#5B86FF', 'stroke-width': 10 }, hm);
      el('use', { href: '#kL', fill: 'none', stroke: '#5B86FF', 'stroke-width': 10 }, hm);
      var tube = el('g', { transform: 'scale(' + (1.2 * u) + ') translate(-300,-304)', opacity: 0 }, root);
      el('use', { href: '#kR', fill: 'none', stroke: '#EEF3FF', 'stroke-width': 3.2 }, tube);
      el('use', { href: '#kL', fill: 'none', stroke: '#EEF3FF', 'stroke-width': 3.2 }, tube);
      var solid = mark(root);
      var bloom = el('circle', { r: 420 * u, fill: 'url(#kBloom)', opacity: 0 }, root);
      /* the flicker: a fixed pattern, so every render is identical */
      var pat = [0, 0, 1, 0, 0, .6, 0, 1, 1, 0, 1, 1, 1, .7, 1, 1, 1, 1, 1, 1];
      return function (p) {
        var f = seg(p, .06, .36), idx = Math.min(pat.length - 1, Math.floor(f * pat.length));
        var on = f > 0 ? pat[idx] : 0;
        tube.style.opacity = on; halo.style.opacity = on * .9;
        var fl = E.inOut(seg(p, .4, .6));
        solid.set({ sx: 1.2 * u, op: fl, beam: p * 460 });
        bloom.style.opacity = fl * .9;
        tube.style.opacity = on * (1 - fl * .7);
      };
    }
  };

  /* 8 · BEFORE / AFTER — a pixelated, tired mark is wiped into the real one */
  M.before = {
    title: 'Before / after', dur: 7000, cap: [.7, .88],
    line: 'Your business is better <em>than your website.</em>',
    build: function (root, u) {
      var S = 1.1 * u;
      /* sample the mark into a coarse grid of squares — the "old website" version */
      var probeSvg = root.ownerSVGElement || root;
      var probe = el('path', { d: PATH_R + PATH_L, opacity: 0 }, root);
      var cells = [], step = 16, rand = rng(7);
      for (var y = 120; y <= 490; y += step) for (var x = 130; x <= 470; x += step) {
        var pt = probeSvg.createSVGPoint(); pt.x = x + step / 2; pt.y = y + step / 2;
        if (probe.isPointInFill(pt)) cells.push({ x: x, y: y, vx: (rand() - .3) * 900, vy: (rand() - .5) * 700, r: (rand() - .5) * 160, g: rand() });
      }
      probe.remove();
      var old = el('g', {}, root);
      var oldIn = el('g', { transform: 'rotate(-5) scale(' + S + ') translate(-300,-304)' }, old);
      var rects = cells.map(function (c) { return el('rect', { x: c.x, y: c.y, width: step - 2, height: step - 2, fill: c.g > .55 ? '#6F7FAE' : '#56648F' }, oldIn); });
      var clipId = 'wipe' + Math.floor(Math.random() * 1e9);
      var cp = el('clipPath', { id: clipId }, root); var cr = el('rect', { x: -2000 * u, y: -2000 * u, width: 0, height: 4000 * u }, cp);
      var newG = el('g', { 'clip-path': 'url(#' + clipId + ')' }, root);
      var fresh = mark(newG);
      var bloom = el('circle', { r: 380 * u, fill: 'url(#kBloom)', opacity: 0 }, root);
      var line = el('rect', { x: 0, y: -520 * u, width: 6 * u, height: 1040 * u, fill: '#DCE6FF', filter: 'url(#kGlow)', opacity: 0 }, root);
      return function (p) {
        var w = E.inOut(seg(p, .2, .64)), wx = lerp(-560 * u, 560 * u, w);
        cr.setAttribute('width', (wx + 2000 * u));
        line.setAttribute('x', wx - 3 * u); line.style.opacity = w > 0 && w < 1 ? 1 : 0;
        fresh.set({ sx: S, beam: p * 460 });
        var scr = seg(p, .2, .9);
        rects.forEach(function (r, i) {
          var c = cells[i];
          /* each pixel stays until the wipe reaches it, then flies off */
          var px = (-300 + c.x) * S, hit = seg(wx, px - 20 * u, px + 160 * u);
          var t = E.out(hit);
          r.setAttribute('transform', 'translate(' + c.vx * t * .35 + ',' + c.vy * t * .35 + ') rotate(' + c.r * t + ' ' + (c.x + 7) + ' ' + (c.y + 7) + ')');
          r.style.opacity = 1 - t;
        });
        old.style.opacity = scr < 1 ? 1 : 0;
        bloom.style.opacity = E.out(seg(p, .55, .78)) * .9;
      };
    }
  };

  /* 9 · THE CALL — a phone buzzes with the mark on its screen, and is answered */
  M.call = {
    title: 'The call', dur: 7000, cap: [.72, .9],
    line: 'Easy to call. <em>Easy to choose.</em>',
    build: function (root, u) {
      var PW = 400 * u, PH = 780 * u;
      var phone = el('g', {}, root);
      var body = el('rect', { x: -PW / 2, y: -PH / 2, width: PW, height: PH, rx: 56 * u, fill: '#060C2A', stroke: '#8C9CC8', 'stroke-width': 3 * u }, phone);
      var screen = el('rect', { x: -PW / 2 + 16 * u, y: -PH / 2 + 16 * u, width: PW - 32 * u, height: PH - 32 * u, rx: 42 * u, fill: '#0B1437' }, phone);
      var flood = el('rect', { x: -PW / 2 + 16 * u, y: -PH / 2 + 16 * u, width: PW - 32 * u, height: PH - 32 * u, rx: 42 * u, fill: '#1B3FC4', opacity: 0 }, phone);
      var notch = el('rect', { x: -60 * u, y: -PH / 2 + 30 * u, width: 120 * u, height: 26 * u, rx: 13 * u, fill: '#060C2A' }, phone);
      var logo = mark(phone);
      var lab = el('text', { x: 0, y: 20 * u, 'text-anchor': 'middle', 'font-family': 'General Sans, system-ui, sans-serif', 'font-size': 30 * u, fill: '#DDE4F7' }, phone); lab.textContent = 'Incoming call';
      var timer = el('text', { x: 0, y: 160 * u, 'text-anchor': 'middle', 'font-family': 'General Sans, system-ui, sans-serif', 'font-size': 28 * u, fill: '#C9D6FF', opacity: 0, 'font-variant-numeric': 'tabular-nums' }, phone);
      var track = el('rect', { x: -140 * u, y: 250 * u, width: 280 * u, height: 70 * u, rx: 35 * u, fill: '#16225A' }, phone);
      var knob = el('circle', { cx: -105 * u, cy: 285 * u, r: 28 * u, fill: '#EEF3FF' }, phone);
      var arcs = [];
      [-1, 1].forEach(function (side) {
        [0, 1, 2].forEach(function (i) {
          var r = (90 + i * 50) * u, cx = side * (PW / 2 + 10 * u), cy = -PH / 2 + 110 * u;
          arcs.push({ side: side, i: i, el: el('path', { d: 'M ' + (cx + side * r * .2) + ' ' + (cy - r * .9) + ' A ' + r + ' ' + r + ' 0 0 ' + (side > 0 ? 1 : 0) + ' ' + (cx + side * r * .2) + ' ' + (cy + r * .9), fill: 'none', stroke: '#8FB0FF', 'stroke-width': 4 * u, 'stroke-linecap': 'round', opacity: 0 }, root) });
        });
      });
      return function (p) {
        var inT = E.out(seg(p, 0, .1));
        phone.style.opacity = inT;
        var ring = p > .1 && p < .5, bz = ring ? Math.sin(p * 900) : 0, burst = ring && (Math.floor(p * 12) % 2 === 0);
        phone.setAttribute('transform', 'translate(' + (burst ? bz * 8 * u : 0) + ',' + (1 - inT) * 40 * u + ') rotate(' + (burst ? bz * 1.8 : 0) + ')');
        arcs.forEach(function (a) { var ph = ((p * 6) + a.i * .3) % 1; a.el.style.opacity = ring ? (1 - ph) * .9 : 0; });
        var sl = E.inOut(seg(p, .52, .64)); knob.setAttribute('cx', lerp(-105 * u, 105 * u, sl));
        var fl = E.inOut(seg(p, .62, .74)); flood.style.opacity = fl; track.style.opacity = 1 - fl; knob.style.opacity = 1 - fl;
        lab.textContent = fl > .5 ? 'Kreated' : 'Incoming call';
        lab.setAttribute('y', lerp(20 * u, 110 * u, fl)); lab.setAttribute('font-size', lerp(30, 40, fl) * u); lab.setAttribute('font-weight', fl > .5 ? 600 : 400);
        var secs = Math.max(0, Math.floor((p - .7) * 7000 / 1000 * 1.6));
        timer.textContent = '00:0' + Math.min(9, secs); timer.style.opacity = E.out(seg(p, .7, .8));
        logo.set({ y: lerp(-150 * u, -130 * u, fl), sx: lerp(.34, .42, fl) * u, beam: p * 600 });
      };
    }
  };

  /* 10 · PULSE — a seamless loop with no words: loaders, avatars, signatures */
  M.pulse = {
    title: 'Pulse', dur: 3000, cap: null, loopOnly: true,
    line: '',
    build: function (root, u) {
      var bloom = el('circle', { r: 360 * u, fill: 'url(#kBloom)' }, root);
      var k = mark(root);
      return function (p) {
        var s = Math.sin(p * Math.PI * 2);
        k.set({ sx: (1 + s * .035) * 1.1 * u, beam: p * 360 });
        bloom.style.opacity = .7 + s * .3;
        bloom.setAttribute('transform', 'scale(' + (1 + s * .06) + ')');
      };
    }
  };

  global.KMotion = { moments: M, defs: defs, el: el, seg: seg, E: E, mark: mark, spark: spark, drawn: drawn, lerp: lerp, rng: rng, cl: cl, PATH_R: PATH_R, PATH_L: PATH_L, order: ['face', 'pin', 'build', 'seven', 'halves', 'search', 'neon', 'before', 'call', 'pulse'] };
})(window);
