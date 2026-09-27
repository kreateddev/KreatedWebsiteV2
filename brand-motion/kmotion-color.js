/* ============================================================================
   KREATED BRAND MOTION — the colour set (moments 11–20)
   ----------------------------------------------------------------------------
   Same engine, same mark, same single playhead p. What changes is the light:
   each moment owns one colour family and its own ground, so the set stops
   reading as "the blue brand". docs/BRAND.md: the brand must not become
   all-blue; chrome, silver, charcoal and white are in the palette.

   A colour moment may add { bg, ink, accent, wm } — stage.html paints the
   ground, the caption and the wordmark from them.

   🚫 Same rule as the first ten: lines claim nothing. UI text inside a scene
   (a lock-screen clock, a notification) is illustration, never a result.
   ========================================================================== */
(function (K) {
  'use strict';
  var el = K.el, seg = K.seg, E = K.E, mark = K.mark, spark = K.spark, drawn = K.drawn, lerp = K.lerp, rng = K.rng, cl = K.cl;
  var M = K.moments;
  var FONT = 'General Sans, system-ui, sans-serif';
  var TAU = Math.PI * 2;

  /* ---- the colour families ------------------------------------------------ */
  var P = {
    coral:   ['#FF9A7A', '#F0473A', '#A3202A'],
    amber:   ['#FFD27A', '#FF951F', '#B8500B'],
    gold:    ['#FFE9A8', '#F5B82E', '#9E6508'],
    mint:    ['#9DFAD0', '#1FC98A', '#0A6A4A'],
    violet:  ['#C9B6FF', '#7A4DFF', '#35178F'],
    magenta: ['#FFA3DA', '#F23FA0', '#8A0F5A'],
    cobalt:  ['#6E8FFF', '#1B3FC4', '#0A1F78'],
    ink:     ['#3A3F4A', '#1A1D23', '#0B0D10'],
    chrome:  ['#FFFFFF', '#AEB5C2', '#4A5160']
  };
  var HUES = ['coral', 'amber', 'mint', 'cobalt', 'violet', 'magenta'];

  var baseDefs = K.defs;
  K.defs = function (svg) {
    var d = baseDefs(svg);
    function lg(id, stops, a) { var g = el('linearGradient', Object.assign({ id: id }, a || { x1: 0, y1: 0, x2: 1, y2: 1 }), d);
      stops.forEach(function (s) { el('stop', { offset: s[0], 'stop-color': s[1], 'stop-opacity': s[2] == null ? 1 : s[2] }, g); }); return g; }
    function rg(id, stops) { var g = el('radialGradient', { id: id }, d);
      stops.forEach(function (s) { el('stop', { offset: s[0], 'stop-color': s[1], 'stop-opacity': s[2] == null ? 1 : s[2] }, g); }); return g; }
    Object.keys(P).forEach(function (n) {
      var c = P[n];
      lg('kF_' + n, [['0', c[0]], ['.5', c[1]], ['1', c[2]]]);
      rg('kB_' + n, [['0', c[1], .6], ['.45', c[1], .18], ['1', c[1], 0]]);
    });
    lg('kF_spectrum', [['0', '#FF6B5A'], ['.25', '#FFB23F'], ['.5', '#3DDC97'], ['.75', '#4F74FF'], ['1', '#A77BFF']]);
    lg('kBeamWarm', [['.30', '#FFFFFF', 0], ['.5', '#FFF4DA', .9], ['.56', '#FFFFFF', .95], ['.72', '#FFFFFF', 0]], { x1: 0, y1: 0, x2: 1, y2: 0 });
    lg('kBeamSoft', [['.30', '#FFFFFF', 0], ['.52', '#FFFFFF', .55], ['.72', '#FFFFFF', 0]], { x1: 0, y1: 0, x2: 1, y2: 0 });
    /* chrome: hard reflective bands that slide (the moment moves gradientTransform) */
    lg('kChrome', [['0', '#FFFFFF'], ['.18', '#C9CFDA'], ['.34', '#3A404C'], ['.42', '#1A1D24'], ['.5', '#E9EDF3'], ['.62', '#8C95A6'], ['.78', '#FFFFFF'], ['.9', '#6B7384'], ['1', '#F4F6FA']],
      { x1: 0, y1: 0, x2: .35, y2: 1, spreadMethod: 'reflect' });
    var nf = el('filter', { id: 'kNeon', x: '-40%', y: '-40%', width: '180%', height: '180%' }, d);
    el('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: '4', result: 'a' }, nf);
    el('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: '16', result: 'b' }, nf);
    var nm = el('feMerge', {}, nf); el('feMergeNode', { in: 'b' }, nm); el('feMergeNode', { in: 'b' }, nm); el('feMergeNode', { in: 'a' }, nm); el('feMergeNode', { in: 'SourceGraphic' }, nm);
    var sf = el('filter', { id: 'kSoft', x: '-50%', y: '-50%', width: '200%', height: '200%' }, d);
    el('feGaussianBlur', { stdDeviation: '10' }, sf);
    return d;
  };
  function cmark(parent, name, o) { o = o || {}; o.fill = 'url(#kF_' + name + ')'; if (!o.beamFill) o.beamFill = 'url(#kBeamWarm)'; return mark(parent, o); }
  function star(R, r) { var d = ''; for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r : R; d += (i ? 'L' : 'M') + (Math.cos(a) * rr).toFixed(2) + ' ' + (Math.sin(a) * rr).toFixed(2); } return d + 'Z'; }
  function txt(parent, s, a) { var t = el('text', Object.assign({ 'font-family': FONT, 'text-anchor': 'middle' }, a), parent); t.textContent = s; return t; }

  /* 11 · OPEN — a hanging sign flips from CLOSED to a neon OPEN */
  M.open = {
    title: 'Open late', dur: 7000, cap: [.7, .88],
    bg: 'radial-gradient(70% 60% at 50% 40%, #2A1620 0%, #160C12 60%, #0C070A 100%)', accent: '#FF7A6B', wm: '#8A6A72',
    line: 'Open, even <em>after you close.</em>',
    build: function (root, u, W, H) {
      var wall = el('g', { stroke: '#2E1C24', 'stroke-width': 2 * u, fill: 'none' }, root);
      for (var r = -12; r <= 12; r++) {
        el('line', { x1: -1400 * u, y1: r * 64 * u, x2: 1400 * u, y2: r * 64 * u }, wall);
        for (var c = -12; c <= 12; c++) el('line', { x1: (c * 150 + (r % 2 ? 75 : 0)) * u, y1: r * 64 * u, x2: (c * 150 + (r % 2 ? 75 : 0)) * u, y2: (r + 1) * 64 * u }, wall);
      }
      var pool = el('ellipse', { cx: 0, cy: -20 * u, rx: 620 * u, ry: 420 * u, fill: 'url(#kB_coral)', opacity: 0 }, root);
      var AY = -H / 2 - 20;
      var swing = el('g', {}, root);
      var chains = [-240, 240].map(function (x) { return el('line', { x1: x * u * .6, y1: AY, x2: x * u, y2: -118 * u, stroke: '#6B5560', 'stroke-width': 4 * u, 'stroke-dasharray': (10 * u) + ' ' + (6 * u) }, swing); });
      var board = el('g', { transform: 'translate(0,' + (72 * u) + ') scale(1.14)' }, swing);
      var flip = el('g', {}, board);
      el('rect', { x: -330 * u, y: -170 * u, width: 660 * u, height: 280 * u, rx: 34 * u, fill: '#1B1216', stroke: '#4A3440', 'stroke-width': 4 * u }, flip);
      var closed = txt(flip, 'CLOSED', { x: 0, y: 12 * u, 'font-size': 118 * u, 'font-weight': 600, 'letter-spacing': 6 * u, fill: 'none', stroke: '#5E4A52', 'stroke-width': 5 * u, 'stroke-linejoin': 'round' });
      var openG = el('g', { opacity: 0 }, flip);
      var openT = txt(openG, 'OPEN', { x: 62 * u, y: 20 * u, 'font-size': 150 * u, 'font-weight': 600, 'letter-spacing': 10 * u, fill: 'none', stroke: '#FF6B5A', 'stroke-width': 7 * u, 'stroke-linejoin': 'round', filter: 'url(#kNeon)' });
      var kG = el('g', { transform: 'translate(' + (-248 * u) + ',' + (-30 * u) + ') scale(' + (.24 * u) + ') translate(-300,-304)', opacity: 0, filter: 'url(#kNeon)' }, openG);
      el('use', { href: '#kR', fill: 'none', stroke: '#FFC061', 'stroke-width': 16 }, kG); el('use', { href: '#kL', fill: 'none', stroke: '#FFC061', 'stroke-width': 16 }, kG);
      var sp = [[300, -210, .9], [-330, 150, .6]].map(function (a) { return spark(root, a[0] * u, a[1] * u, a[2] * u); });
      sp.forEach(function (s) { s.setAttribute('fill', '#FFD9C9'); });
      return function (p) {
        var inT = seg(p, 0, .16);
        /* the sign drops in and swings to rest on its chains */
        var drop = lerp(-700 * u, 0, E.out(inT));
        var ang = Math.exp(-p * 7) * Math.sin(p * 30) * 9 * (inT > 0 ? 1 : 0);
        swing.setAttribute('transform', 'translate(0,' + drop + ') rotate(' + ang + ' 0 ' + AY + ')');
        wall.style.opacity = .5 + .5 * E.out(seg(p, .4, .6));
        /* the flip: scaleX 1 → 0 → 1, the face changes at the edge */
        var f = seg(p, .3, .44), sx = Math.abs(Math.cos(f * Math.PI));
        flip.setAttribute('transform', 'scale(' + Math.max(.02, sx) + ',1)');
        var isOpen = f >= .5;
        closed.style.opacity = isOpen ? 0 : 1;
        /* neon: dead tube, stutter, then lit, with a faint buzz that never quite settles */
        var n = seg(p, .44, .6);
        var flick = n <= 0 ? 0 : n >= 1 ? 1 : ([.9, 0, .7, 0, 0, 1, .2, 1, 1, .5, 1, 1][Math.floor(n * 12)] || 1);
        var buzz = p > .6 ? .92 + .08 * Math.sin(p * 190) : 1;
        openG.style.opacity = isOpen ? .25 + .75 * flick * buzz : 0;
        openT.setAttribute('stroke', flick > .5 ? '#FF6B5A' : '#6E3A3A');
        kG.style.opacity = E.out(seg(p, .56, .66)) * buzz;
        pool.style.opacity = isOpen ? flick * .75 * buzz : 0;
        sp.forEach(function (s, i) { var t = seg(p, .62 + i * .06, .74 + i * .06); s.style.opacity = t > 0 && t < 1 ? Math.sin(t * Math.PI) : 0; });
      };
    }
  };

  /* 12 · STARS — five stars land in gold, then gather into the mark */
  M.stars = {
    title: 'Five stars', dur: 7000, cap: [.72, .9],
    bg: 'radial-gradient(70% 60% at 50% 42%, #2A2010 0%, #140F07 55%, #0A0804 100%)', accent: '#F5C451', wm: '#8A7A55',
    line: 'Earned by the work. <em>Shown by the site.</em>',
    build: function (root, u) {
      var bloom = el('circle', { r: 420 * u, fill: 'url(#kB_gold)', opacity: 0 }, root);
      var S = [], sparks = [];
      for (var i = 0; i < 5; i++) {
        var g = el('g', {}, root);
        var outline = el('path', { d: star(64 * u, 28 * u), fill: 'none', stroke: '#F5C451', 'stroke-width': 4 * u, 'stroke-linejoin': 'round' }, g);
        var fillS = el('path', { d: star(64 * u, 28 * u), fill: 'url(#kF_gold)', opacity: 0 }, g);
        S.push({ g: g, o: outline, f: fillS, L: drawn(outline) });
        for (var k = 0; k < 4; k++) sparks.push({ i: i, k: k, e: spark(root, 0, 0, 1) });
      }
      sparks.forEach(function (s) { s.e.setAttribute('fill', '#FFE9A8'); });
      var crown = [0, 1, 2, 3, 4].map(function () { return el('path', { d: star(20 * u, 9 * u), fill: '#F5C451', opacity: 0 }, root); });
      var k1 = cmark(root, 'gold');
      return function (p) {
        S.forEach(function (s, i) {
          var x0 = (i - 2) * 158 * u;
          var dr = seg(p, .06 + i * .07, .2 + i * .07), pop = seg(p, .14 + i * .07, .26 + i * .07);
          s.o.style.strokeDashoffset = s.L * (1 - E.inOut(dr));
          s.f.style.opacity = E.out(pop);
          /* gather: spin in to the centre and vanish into the mark */
          var gt = E.in(seg(p, .54, .68));
          var x = lerp(x0, 0, gt), sc = (pop ? E.back(Math.min(1, pop * 1.2)) : dr ? .9 : 0) * (1 - gt);
          s.g.setAttribute('transform', 'translate(' + x + ',' + lerp(0, -10 * u, gt) + ') rotate(' + (gt * 220 + (1 - E.out(pop)) * -30) + ') scale(' + Math.max(0, sc) + ')');
        });
        sparks.forEach(function (s) {
          var t = seg(p, .16 + s.i * .07, .3 + s.i * .07), a = s.k * TAU / 4 + .5;
          var x = (s.i - 2) * 158 * u + Math.cos(a) * (70 + 60 * t) * u, y = Math.sin(a) * (70 + 60 * t) * u;
          s.e.setAttribute('transform', 'translate(' + x + ',' + y + ') scale(' + (.45 * u) + ')');
          s.e.style.opacity = t > 0 && t < 1 ? Math.sin(t * Math.PI) : 0;
        });
        var kt = seg(p, .64, .8);
        k1.set({ sx: (kt ? E.back(kt) : 0) * .95 * u, beam: p * 520, op: kt ? 1 : 0 });
        bloom.style.opacity = E.out(kt) * .9;
        crown.forEach(function (c, i) {
          var t = seg(p, .76 + i * .025, .86 + i * .025), a = (-150 + i * 30) * Math.PI / 180;
          c.setAttribute('transform', 'translate(' + Math.cos(a) * 250 * u + ',' + (Math.sin(a) * 250 * u + 20 * u) + ') scale(' + (t ? E.back(t) : 0) + ')');
          c.style.opacity = t ? 1 : 0;
        });
      };
    }
  };

  /* 13 · LIGHTHOUSE — dusk on the coast; the lamp is the mark and its beam sweeps the sea */
  M.lighthouse = {
    title: 'The lighthouse', dur: 8000, cap: [.7, .88],
    bg: '#120C28', accent: '#FFC061', wm: '#8C7AA8',
    line: 'A light people <em>can find.</em>',
    build: function (root, u, W, H) {
      var HZ = 150 * u, X = W, Y = H;
      var d = root.ownerSVGElement.querySelector('defs');
      function vg(id, stops) { var g = el('linearGradient', { id: id, x1: 0, y1: 0, x2: 0, y2: 1 }, d); stops.forEach(function (s) { el('stop', { offset: s[0], 'stop-color': s[1], 'stop-opacity': s[2] == null ? 1 : s[2] }, g); }); }
      vg('lhSky', [['0', '#140C33'], ['.45', '#4A2270'], ['.78', '#D2556A'], ['1', '#FFB15C']]);
      vg('lhSea', [['0', '#3A1F52'], ['.25', '#1A1238'], ['1', '#07061A']]);
      var bg = el('g', {}, root);
      el('rect', { x: -X, y: -Y, width: 2 * X, height: Y + HZ, fill: 'url(#lhSky)' }, bg);
      var sun = el('circle', { cx: -170 * u, cy: HZ, r: 120 * u, fill: '#FFC27A' }, bg);
      el('rect', { x: -X, y: HZ, width: 2 * X, height: Y, fill: 'url(#lhSea)' }, bg);
      var rand = rng(11);
      var skyStars = []; for (var i = 0; i < 60; i++) skyStars.push(el('circle', { cx: (rand() - .5) * W * 1.1, cy: -H / 2 + rand() * (H / 2 + HZ - 200 * u), r: (rand() * 1.8 + .6) * u, fill: '#FFFFFF', opacity: 0 }, bg));
      var shimmer = []; for (var j = 0; j < 46; j++) { var sy = HZ + 12 * u + Math.pow(rand(), 1.6) * 520 * u; shimmer.push({ e: el('rect', { x: (rand() - .5) * W, y: sy, width: (20 + rand() * 80) * u * (1 + (sy - HZ) / (300 * u)), height: 2.2 * u, rx: 1 * u, fill: j % 3 ? '#FF9E6A' : '#FFD9A8', opacity: 0 }, bg), ph: rand() * TAU, sp: 1 + Math.floor(rand() * 3) }); }
      var night = el('rect', { x: -X, y: -Y, width: 2 * X, height: 2 * Y, fill: '#07051A', opacity: 0 }, root);
      /* the beam lives behind the tower */
      var LX = 190 * u, LY = -250 * u;
      var beams = el('g', { transform: 'translate(' + LX + ',' + LY + ')' }, root);
      var bgr = el('linearGradient', { id: 'lhBeam', x1: 0, y1: 0, x2: 1, y2: 0 }, d);
      el('stop', { offset: 0, 'stop-color': '#FFE3A8', 'stop-opacity': .95 }, bgr); el('stop', { offset: .5, 'stop-color': '#FFC061', 'stop-opacity': .35 }, bgr); el('stop', { offset: 1, 'stop-color': '#FFC061', 'stop-opacity': 0 }, bgr);
      var cone = 'M0 -10 L 1500 -150 L 1500 150 L 0 10Z';
      var b1 = el('path', { d: cone, fill: 'url(#lhBeam)', transform: 'scale(' + u + ')' }, beams);
      var b2 = el('path', { d: cone, fill: 'url(#lhBeam)', transform: 'scale(' + u + ')', opacity: .5 }, beams);
      /* rock, tower, bands, gallery, lantern */
      var tower = el('g', {}, root);
      el('path', { d: 'M' + (40 * u) + ' ' + (HZ + 8 * u) + ' C ' + (90 * u) + ' ' + (HZ - 60 * u) + ', ' + (300 * u) + ' ' + (HZ - 70 * u) + ', ' + (360 * u) + ' ' + (HZ + 8 * u) + 'Z', fill: '#0B0716' }, tower);
      var tb = HZ - 40 * u, tt = -210 * u;
      function tw(y) { var k = (y - tt) / (tb - tt); return lerp(34, 62, k) * u; }
      for (var b = 0; b < 5; b++) {
        var y1 = lerp(tt, tb, b / 5), y2 = lerp(tt, tb, (b + 1) / 5);
        el('path', { d: 'M' + (LX - tw(y1)) + ' ' + y1 + ' L ' + (LX + tw(y1)) + ' ' + y1 + ' L ' + (LX + tw(y2)) + ' ' + y2 + ' L ' + (LX - tw(y2)) + ' ' + y2 + 'Z', fill: b % 2 ? '#1A1426' : '#E9E2EE' }, tower);
      }
      el('rect', { x: LX - 50 * u, y: tt - 10 * u, width: 100 * u, height: 12 * u, fill: '#1A1426' }, tower);
      el('rect', { x: LX - 30 * u, y: tt - 62 * u, width: 60 * u, height: 52 * u, fill: '#2A1F3A' }, tower);
      el('path', { d: 'M' + (LX - 38 * u) + ' ' + (tt - 62 * u) + ' L ' + LX + ' ' + (tt - 96 * u) + ' L ' + (LX + 38 * u) + ' ' + (tt - 62 * u) + 'Z', fill: '#1A1426' }, tower);
      var halo = el('circle', { cx: LX, cy: LY, r: 90 * u, fill: 'url(#kB_amber)', opacity: 0 }, root);
      var lamp = cmark(root, 'amber', { beamOp: .9 });
      /* a small boat on the water, heading for the light */
      var boat = el('g', {}, root);
      el('path', { d: 'M-34 0 L 34 0 L 24 12 L -24 12Z', fill: '#0B0716', transform: 'scale(' + u + ')' }, boat);
      el('path', { d: 'M0 -2 L 0 -58 L 28 -6Z', fill: '#E9E2EE', transform: 'scale(' + u + ')' }, boat);
      el('path', { d: 'M-4 -6 L -4 -44 L -26 -6Z', fill: '#C9B6D8', transform: 'scale(' + u + ')' }, boat);
      var wake = el('path', { d: '', fill: 'none', stroke: '#FFD9A8', 'stroke-width': 2 * u, opacity: .6 }, root);
      return function (p) {
        var dusk = E.inOut(seg(p, .05, .7));
        sun.setAttribute('cy', HZ + dusk * 140 * u);
        night.style.opacity = dusk * .62;
        skyStars.forEach(function (s, i) { s.style.opacity = seg(dusk, .35 + (i % 7) * .06, .8) * (.5 + .5 * Math.sin(p * 40 + i)); });
        shimmer.forEach(function (s) { s.e.style.opacity = (.25 + .45 * (1 - dusk)) * (.5 + .5 * Math.sin(p * TAU * s.sp * 3 + s.ph)); });
        var on = seg(p, .22, .3);
        var th = p * TAU * 1.75;
        b1.setAttribute('transform', 'scale(' + (Math.cos(th) * u) + ',' + u + ')');
        b2.setAttribute('transform', 'scale(' + (-Math.cos(th) * u) + ',' + u + ')');
        beams.style.opacity = on * (.35 + .65 * dusk);
        lamp.set({ x: LX, y: LY + 2 * u, sx: .15 * u, beam: p * 900, op: .4 + .6 * on });
        halo.style.opacity = on * (.6 + .4 * Math.abs(Math.cos(th)));
        var bx = lerp(-560 * u, -150 * u, E.inOut(seg(p, 0, 1))), by = HZ + 70 * u;
        boat.setAttribute('transform', 'translate(' + bx + ',' + (by + Math.sin(p * 30) * 3 * u) + ') rotate(' + Math.sin(p * 24) * 3 + ')');
        wake.setAttribute('d', 'M' + (bx - 40 * u) + ' ' + (by + 12 * u) + ' Q ' + (bx - 140 * u) + ' ' + (by + 16 * u) + ', ' + (bx - 260 * u) + ' ' + (by + 30 * u));
      };
    }
  };

  /* 14 · KALEIDOSCOPE — a seamless loop, no words, every colour at once */
  M.kaleido = {
    title: 'Kaleidoscope', dur: 6000, cap: null, loopOnly: true,
    bg: 'radial-gradient(60% 60% at 50% 50%, #1A1030 0%, #0A0714 60%, #050409 100%)',
    line: '',
    build: function (root, u) {
      var rings = [
        { n: 6, r: 170, s: .2, spin: 60 },
        { n: 12, r: 330, s: .17, spin: -30 },
        { n: 18, r: 490, s: .14, spin: 20 },
        { n: 24, r: 650, s: .11, spin: -15 }
      ];
      var glow = el('circle', { r: 520 * u, fill: 'url(#kB_violet)', opacity: .8 }, root);
      rings.forEach(function (R, ri) {
        R.g = el('g', {}, root);
        R.marks = [];
        for (var i = 0; i < R.n; i++) {
          var m = cmark(R.g, HUES[(i + ri * 2) % HUES.length], { beamFill: 'url(#kBeamSoft)', beamOp: .6 });
          m.g.style.mixBlendMode = 'screen';
          R.marks.push(m);
        }
      });
      var core = cmark(root, 'chrome', { beamFill: 'url(#kBeamWarm)' });
      return function (p) {
        var w = Math.sin(p * TAU);
        rings.forEach(function (R, ri) {
          var rot = p * R.spin, rr = R.r * u * (1 + .05 * Math.sin(p * TAU + ri * 1.3));
          R.marks.forEach(function (m, i) {
            var a = (i / R.n) * 360 + rot, ar = a * Math.PI / 180;
            m.set({ x: Math.cos(ar) * rr, y: Math.sin(ar) * rr, rot: a + 90 + (ri % 2 ? 180 : 0), sx: R.s * u * (1 + .12 * Math.sin(p * TAU * 2 + i * TAU / R.n * 2)), beam: p * 360 + i * 30, op: .55 + .45 * Math.sin(p * TAU + i * TAU / R.n + ri) });
          });
        });
        core.set({ sx: (.62 + .03 * w) * u, beam: p * 360, rot: 0 });
        glow.setAttribute('transform', 'scale(' + (1 + .05 * w) + ')');
      };
    }
  };

  /* 15 · SWATCH — a colour fan opens and paints the mark; it lands on ink */
  M.swatch = {
    title: 'The swatch', dur: 7500, cap: [.72, .9],
    bg: 'radial-gradient(80% 70% at 50% 40%, #FFFFFF 0%, #EEF0F4 55%, #DDE1E8 100%)', ink: '#15181D', accent: '#E0473A', wm: '#8A90A0',
    line: 'A brand that looks <em>like nobody else.</em>',
    build: function (root, u) {
      var cards = [
        ['Signal Coral', '#F0473A'], ['Porch Amber', '#FF951F'], ['Marsh Green', '#1FC98A'], ['Harbor Cobalt', '#1B3FC4'],
        ['Dusk Violet', '#7A4DFF'], ['Azalea', '#F23FA0'], ['Ink', '#1A1D23']
      ];
      var names = ['coral', 'amber', 'mint', 'cobalt', 'violet', 'magenta', 'ink'];
      var PX = 0, PY = 390 * u, CH = 470 * u, CW = 140 * u;
      var fan = el('g', {}, root);
      var C = cards.map(function (c, i) {
        var g = el('g', {}, fan);
        el('rect', { x: -CW / 2 + 4 * u, y: -CH + 8 * u, width: CW, height: CH, rx: 14 * u, fill: '#000', opacity: .08 }, g);
        el('rect', { x: -CW / 2, y: -CH, width: CW, height: CH, rx: 14 * u, fill: '#FFFFFF' }, g);
        el('rect', { x: -CW / 2 + 10 * u, y: -CH + 10 * u, width: CW - 20 * u, height: CH * .62, rx: 8 * u, fill: c[1] }, g);
        txt(g, c[0], { x: -CW / 2 + 14 * u, y: -CH + CH * .62 + 46 * u, 'text-anchor': 'start', 'font-size': 17 * u, 'font-weight': 600, fill: '#15181D' });
        txt(g, c[1], { x: -CW / 2 + 14 * u, y: -CH + CH * .62 + 72 * u, 'text-anchor': 'start', 'font-size': 15 * u, fill: '#6A7080' });
        el('circle', { cx: 0, cy: -26 * u, r: 7 * u, fill: '#DDE1E8' }, g);
        return g;
      });
      var ks = names.map(function (n) { return cmark(root, n, { beamFill: 'url(#kBeamSoft)', beamOp: .5 }); });
      var shadow = el('ellipse', { cx: 0, cy: -130 * u, rx: 150 * u, ry: 18 * u, fill: '#000', opacity: .08, filter: 'url(#kSoft)' }, root);
      root.insertBefore(shadow, ks[0].g);
      return function (p) {
        var inT = E.out(seg(p, 0, .14));
        fan.setAttribute('transform', 'translate(' + PX + ',' + (PY + (1 - inT) * 500 * u) + ')');
        var open = E.out(seg(p, .12, .42)), close = E.inOut(seg(p, .6, .76));
        C.forEach(function (g, i) {
          var a = (i - 3) * 17 * open * (1 - close * .85);
          g.setAttribute('transform', 'rotate(' + a + ')');
        });
        /* the paint: one colour at a time, sweeping left to right as the fan opens, landing on ink */
        var t = seg(p, .16, .66) * (names.length - 1);
        var kin = E.back(seg(p, .04, .18));
        ks.forEach(function (k, i) {
          var w = cl(1 - Math.abs(t - i));
          if (i === names.length - 1 && t >= names.length - 1) w = 1;
          k.set({ y: -300 * u, sx: .62 * u * (kin || 0.0001), beam: p * 420, op: w });
        });
        shadow.style.opacity = .1 * inT;
      };
    }
  };

  /* 16 · BLOCKS — coloured blocks fall and stack into the mark */
  M.blocks = {
    title: 'The blocks', dur: 7500, cap: [.74, .9],
    bg: 'radial-gradient(70% 60% at 50% 42%, #1C1F27 0%, #111318 60%, #0A0B0E 100%)', accent: '#FFB23F', wm: '#6E7384',
    line: 'Every piece <em>in its place.</em>',
    build: function (root, u) {
      var S = 1.25 * u, step = 22, rand = rng(21);
      var probe = el('path', { d: K.PATH_R + K.PATH_L, opacity: 0 }, root);
      var svg = root.ownerSVGElement, cells = [];
      for (var y = 130; y <= 490; y += step) for (var x = 125; x <= 475; x += step) {
        var pt = svg.createSVGPoint(); pt.x = x + step / 2; pt.y = y + step / 2;
        if (probe.isPointInFill(pt)) cells.push({ x: x, y: y, c: ['#FF6B5A', '#FFB23F', '#3DDC97', '#4F74FF', '#A77BFF', '#F23FA0'][Math.floor(rand() * 6)], d: rand() });
      }
      probe.remove();
      var maxY = 490;
      var g = el('g', { transform: 'scale(' + S + ') translate(-300,-304)' }, root);
      var R = cells.map(function (c) { return el('rect', { x: c.x + 1, y: c.y + 1, width: step - 2, height: step - 2, rx: 3, fill: c.c }, g); });
      var bloom = el('circle', { r: 420 * u, fill: 'url(#kB_amber)', opacity: 0 }, root);
      var k1 = mark(root, { fill: 'url(#kF_spectrum)', beamFill: 'url(#kBeamWarm)' });
      var flash = el('circle', { r: 300 * u, fill: 'url(#kFlash)', opacity: 0 }, root);
      return function (p) {
        R.forEach(function (r, i) {
          var c = cells[i];
          var start = .04 + (maxY - c.y) / 360 * .42 + c.d * .08;
          var t = seg(p, start, start + .1), f = E.bounce(t);
          r.setAttribute('transform', 'translate(0,' + (-(1 - f) * 900) + ')');
          r.style.opacity = t > 0 ? 1 - seg(p, .66, .74) : 0;
        });
        var kt = seg(p, .64, .74);
        k1.set({ sx: S, beam: p * 500, op: E.out(kt) });
        flash.style.opacity = Math.sin(seg(p, .64, .74) * Math.PI) * .8;
        bloom.style.opacity = E.out(seg(p, .68, .82)) * .6;
      };
    }
  };

  /* 17 · NIGHT SHIFT — a lock screen at 2am fills with things the website did */
  M.notify = {
    title: 'The night shift', dur: 7500, cap: [.74, .9],
    bg: 'radial-gradient(70% 60% at 50% 40%, #3A1F6B 0%, #1C1038 55%, #0D0820 100%)', accent: '#FF8AD0', wm: '#8C7AB0',
    line: 'Your website works <em>the night shift.</em>',
    build: function (root, u) {
      var PW = 440 * u, PH = 860 * u;
      var d = root.ownerSVGElement.querySelector('defs');
      var wg = el('linearGradient', { id: 'nsWall', x1: 0, y1: 0, x2: .4, y2: 1 }, d);
      el('stop', { offset: 0, 'stop-color': '#4A2A8A' }, wg); el('stop', { offset: .6, 'stop-color': '#1E1244' }, wg); el('stop', { offset: 1, 'stop-color': '#0E0826' }, wg);
      var phone = el('g', {}, root);
      el('rect', { x: -PW / 2, y: -PH / 2, width: PW, height: PH, rx: 60 * u, fill: '#0A0618', stroke: '#8C7AB0', 'stroke-width': 3 * u }, phone);
      var scr = el('rect', { x: -PW / 2 + 14 * u, y: -PH / 2 + 14 * u, width: PW - 28 * u, height: PH - 28 * u, rx: 48 * u, fill: 'url(#nsWall)' }, phone);
      var wmk = cmark(phone, 'violet', { beamFill: 'url(#kBeamSoft)', beamOp: .4 });
      el('rect', { x: -58 * u, y: -PH / 2 + 30 * u, width: 116 * u, height: 30 * u, rx: 15 * u, fill: '#0A0618' }, phone);
      var clock = txt(phone, '2:14', { x: 0, y: -210 * u, 'font-size': 128 * u, 'font-weight': 300, fill: '#F4EEFF', 'letter-spacing': -3 * u });
      txt(phone, 'Saturday', { x: 0, y: -330 * u, 'font-size': 26 * u, 'font-weight': 500, fill: '#CBBDF0' });
      var dim = el('rect', { x: -PW / 2 + 14 * u, y: -PH / 2 + 14 * u, width: PW - 28 * u, height: PH - 28 * u, rx: 48 * u, fill: '#000' }, phone);
      var N = [
        ['#1FC98A', 'Website', 'New quote request', 'Kitchen remodel, this spring'],
        ['#FF951F', 'Maps', 'Someone asked for directions', 'to your front door'],
        ['#F23FA0', 'Calendar', 'Estimate booked', 'Monday, 9:00 AM']
      ].map(function (n, i) {
        var g = el('g', { opacity: 0 }, phone);
        el('rect', { x: -PW / 2 + 30 * u, y: -60 * u, width: PW - 60 * u, height: 108 * u, rx: 26 * u, fill: '#FFFFFF', opacity: .14 }, g);
        el('rect', { x: -PW / 2 + 48 * u, y: -40 * u, width: 50 * u, height: 50 * u, rx: 13 * u, fill: n[0] }, g);
        var ic = el('g', { transform: 'translate(' + (-PW / 2 + 73 * u) + ',' + (-15 * u) + ') scale(' + (.1 * u) + ') translate(-300,-318)' }, g);
        el('use', { href: '#kR', fill: '#FFFFFF' }, ic); el('use', { href: '#kL', fill: '#FFFFFF' }, ic);
        txt(g, n[1].toUpperCase(), { x: -PW / 2 + 114 * u, y: -24 * u, 'text-anchor': 'start', 'font-size': 15 * u, 'font-weight': 600, 'letter-spacing': 1.5 * u, fill: '#D8CCF5' });
        txt(g, 'now', { x: PW / 2 - 48 * u, y: -24 * u, 'text-anchor': 'end', 'font-size': 15 * u, fill: '#B0A2D6' });
        txt(g, n[2], { x: -PW / 2 + 114 * u, y: 4 * u, 'text-anchor': 'start', 'font-size': 21 * u, 'font-weight': 600, fill: '#FFFFFF' });
        txt(g, n[3], { x: -PW / 2 + 114 * u, y: 30 * u, 'text-anchor': 'start', 'font-size': 18 * u, fill: '#E4DCF8' });
        return g;
      });
      var moon = el('g', {}, root);
      el('circle', { cx: 330 * u, cy: -420 * u, r: 46 * u, fill: '#FFE9C4' }, moon);
      el('circle', { cx: 350 * u, cy: -434 * u, r: 42 * u, fill: '#2A1654' }, moon);
      var zz = [0, 1, 2].map(function (i) { return txt(root, 'z', { x: 0, y: 0, 'font-size': (26 + i * 8) * u, 'font-weight': 600, fill: '#CBBDF0', opacity: 0 }); });
      return function (p) {
        var inT = E.out(seg(p, 0, .12));
        phone.setAttribute('transform', 'translate(0,' + (1 - inT) * 60 * u + ')');
        phone.style.opacity = inT;
        moon.style.opacity = inT;
        wmk.set({ y: 200 * u, sx: .5 * u, beam: p * 300, op: .22 });
        clock.textContent = p > .62 ? '2:15' : '2:14';
        /* screen sleeps between arrivals and wakes for each one */
        var wakes = [.2, .38, .56], lit = 0;
        wakes.forEach(function (w) { lit = Math.max(lit, seg(p, w, w + .03) * (1 - seg(p, w + .12, w + .16))); });
        if (p > .72) lit = Math.max(lit, seg(p, .72, .76));
        dim.style.opacity = .55 * (1 - lit);
        N.forEach(function (g, i) {
          var t = seg(p, wakes[i], wakes[i] + .08), e = E.back(t);
          /* newest on top: each new arrival pushes the others down */
          var below = 0; for (var j = i + 1; j < N.length; j++) below += E.out(seg(p, wakes[j], wakes[j] + .08));
          g.style.opacity = t ? Math.min(1, t * 2) : 0;
          g.setAttribute('transform', 'translate(0,' + (-60 * u + lerp(-140 * u, 0, e) + below * 124 * u) + ') scale(' + lerp(.9, 1, e) + ')');
        });
        zz.forEach(function (z, i) {
          var t = (p * 2.2 + i / 3) % 1;
          z.setAttribute('x', 300 * u + t * 60 * u + i * 8 * u); z.setAttribute('y', -330 * u - t * 160 * u);
          z.style.opacity = Math.sin(t * Math.PI) * .8 * inT;
        });
      };
    }
  };

  /* 18 · ROUTE — a night map; the route draws itself to the pin */
  M.route = {
    title: 'The route', dur: 7500, cap: [.74, .9], wideScale: .76,
    bg: 'radial-gradient(75% 65% at 50% 42%, #0C2A1F 0%, #071A13 55%, #040E0A 100%)', accent: '#5BF0B0', wm: '#5E8A78',
    line: 'From a search <em>to your front door.</em>',
    build: function (root, u) {
      var world = el('g', {}, root);
      var streets = el('g', { stroke: '#123B2C', 'stroke-width': 10 * u, 'stroke-linecap': 'round' }, world);
      for (var i = -8; i <= 8; i++) { el('line', { x1: -1400 * u, y1: i * 110 * u, x2: 1400 * u, y2: i * 110 * u }, streets); el('line', { x1: i * 130 * u, y1: -1400 * u, x2: i * 130 * u, y2: 1400 * u }, streets); }
      var minor = el('g', { stroke: '#0E2E22', 'stroke-width': 4 * u }, world);
      for (var j = -8; j <= 8; j++) { el('line', { x1: -1400 * u, y1: (j * 110 + 55) * u, x2: 1400 * u, y2: (j * 110 + 55) * u }, minor); el('line', { x1: (j * 130 + 65) * u, y1: -1400 * u, x2: (j * 130 + 65) * u, y2: 1400 * u }, minor); }
      el('path', { d: 'M' + (-1400 * u) + ' ' + (560 * u) + ' C ' + (-600 * u) + ' ' + (480 * u) + ', ' + (-200 * u) + ' ' + (660 * u) + ', ' + (400 * u) + ' ' + (590 * u) + ' S ' + (1100 * u) + ' ' + (520 * u) + ', ' + (1400 * u) + ' ' + (570 * u) + ' L ' + (1400 * u) + ' ' + (1400 * u) + ' L ' + (-1400 * u) + ' ' + (1400 * u) + 'Z', fill: '#0A2233' }, world);
      [[-380, -420, 200, 150], [240, 120, 180, 120], [-520, 80, 150, 190]].forEach(function (b) { el('rect', { x: b[0] * u, y: b[1] * u, width: b[2] * u, height: b[3] * u, rx: 18 * u, fill: '#0F3324' }, world); });
      var pts = [[-390, 440], [-390, 220], [-130, 220], [-130, 0], [130, 0], [130, -220]];
      var dStr = pts.map(function (q, k) { return (k ? 'L' : 'M') + q[0] * u + ' ' + q[1] * u; }).join(' ');
      var glow = el('path', { d: dStr, fill: 'none', stroke: '#1FC98A', 'stroke-width': 26 * u, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', opacity: .25, filter: 'url(#kSoft)' }, root);
      var route = el('path', { d: dStr, fill: 'none', stroke: '#5BF0B0', 'stroke-width': 10 * u, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, root);
      var L = drawn(route); glow.style.strokeDasharray = L; glow.style.strokeDashoffset = L;
      var rings = [0, 1].map(function () { return el('circle', { cx: 130 * u, cy: -220 * u, r: 0, fill: 'none', stroke: '#5BF0B0', 'stroke-width': 3 * u }, root); });
      var pinG = el('g', {}, root);
      el('path', { d: 'M' + (-22 * u) + ' ' + (-112 * u) + ' L 0 0 L ' + (22 * u) + ' ' + (-112 * u) + 'Z', fill: '#1FC98A' }, pinG);
      var pin = cmark(pinG, 'mint');
      var car = el('g', {}, root);
      el('circle', { r: 30 * u, fill: '#5BF0B0', opacity: .25 }, car);
      el('path', { d: 'M 0 -20 L 15 16 L 0 8 L -15 16Z', fill: '#FFFFFF', transform: 'scale(' + u + ')' }, car);
      var chip = el('g', { opacity: 0 }, root);
      el('rect', { x: 180 * u, y: -330 * u, width: 190 * u, height: 58 * u, rx: 29 * u, fill: '#F2FFF8' }, chip);
      el('circle', { cx: 212 * u, cy: -301 * u, r: 9 * u, fill: '#1FC98A' }, chip);
      txt(chip, 'Arrived', { x: 234 * u, y: -293 * u, 'text-anchor': 'start', 'font-size': 24 * u, 'font-weight': 600, fill: '#06281B' });
      return function (p) {
        var z = lerp(1.18, 1, E.out(seg(p, 0, .3)));
        world.setAttribute('transform', 'scale(' + z + ')'); world.style.opacity = E.out(seg(p, 0, .12));
        var pt = seg(p, .06, .2);
        pinG.setAttribute('transform', 'translate(' + 130 * u + ',' + (-220 * u + lerp(-900 * u, 0, E.bounce(pt))) + ')');
        pin.set({ y: -175 * u, sx: .42 * u, beam: p * 480 });
        pinG.style.opacity = pt ? 1 : 0;
        var dr = E.inOut(seg(p, .22, .66));
        route.style.strokeDashoffset = L * (1 - dr); glow.style.strokeDashoffset = L * (1 - dr);
        var at = route.getPointAtLength(L * dr), ah = route.getPointAtLength(Math.min(L, L * dr + 2));
        var ang = Math.atan2(ah.y - at.y, ah.x - at.x) * 180 / Math.PI + 90;
        car.setAttribute('transform', 'translate(' + at.x + ',' + at.y + ') rotate(' + ang + ')');
        car.style.opacity = seg(p, .2, .24) * (1 - seg(p, .66, .7));
        rings.forEach(function (r, k) { var t = seg(p, .66 + k * .08, .86 + k * .08); r.setAttribute('r', 200 * u * E.out(t)); r.style.opacity = t > 0 ? (1 - t) : 0; });
        var ct = seg(p, .68, .76); chip.style.opacity = ct; chip.setAttribute('transform', 'translate(0,' + (1 - E.out(ct)) * 16 * u + ')');
      };
    }
  };

  /* 19 · UNVEIL — a cloth pulled off the mark, confetti from both sides */
  M.unveil = {
    title: 'The unveiling', dur: 7000, cap: [.66, .84],
    bg: 'radial-gradient(70% 60% at 50% 42%, #22202C 0%, #121118 60%, #09080C 100%)', accent: '#FFC061', wm: '#77738A',
    line: 'Launch day <em>feels like this.</em>',
    build: function (root, u, W, H) {
      var spot = el('ellipse', { cx: 0, cy: 0, rx: 420 * u, ry: 480 * u, fill: 'url(#kB_amber)', opacity: .25 }, root);
      var plinth = el('rect', { x: -220 * u, y: 250 * u, width: 440 * u, height: 26 * u, rx: 13 * u, fill: '#2C2A36' }, root);
      var k1 = mark(root, { fill: 'url(#kF_spectrum)', beamFill: 'url(#kBeamWarm)' });
      var cloth = el('g', {}, root);
      var cg = el('linearGradient', { id: 'uvCloth', x1: 0, y1: 0, x2: 1, y2: .3 }, root.ownerSVGElement.querySelector('defs'));
      el('stop', { offset: 0, 'stop-color': '#8E93A6' }, cg); el('stop', { offset: .35, 'stop-color': '#E4E7EF' }, cg); el('stop', { offset: .7, 'stop-color': '#B7BCCB' }, cg); el('stop', { offset: 1, 'stop-color': '#7C8196' }, cg);
      /* peaks where the mark's arms and stem push the cloth up; a loose, wavy hem */
      el('path', { d: 'M -262 262 C -250 120, -205 -40, -165 -168 C -140 -120, -100 -110, -62 -128 C -36 -168, -16 -196, 0 -198 C 16 -196, 36 -168, 62 -128 C 100 -110, 140 -120, 165 -168 C 205 -40, 250 120, 262 262 C 220 250, 190 272, 150 258 C 110 246, 80 270, 40 256 C 0 244, -30 270, -70 256 C -110 244, -140 272, -180 258 C -215 248, -240 270, -262 262Z',
        fill: 'url(#uvCloth)', transform: 'scale(' + u + ')' }, cloth);
      var folds = el('g', { stroke: '#7C8196', 'stroke-width': 2.5, fill: 'none', transform: 'scale(' + u + ')', 'stroke-linecap': 'round', opacity: .8 }, cloth);
      ['M -165 -162 C -200 20, -205 140, -215 252', 'M -165 -162 C -150 0, -140 130, -120 250', 'M 0 -194 C -20 -40, -40 120, -30 250', 'M 0 -194 C 25 -30, 50 120, 60 252', 'M 165 -162 C 150 10, 150 140, 130 250', 'M 165 -162 C 205 20, 212 140, 220 252'].forEach(function (dd) { el('path', { d: dd }, folds); });
      el('path', { d: 'M -62 -128 C -36 -168, -16 -196, 0 -198 C 16 -196, 36 -168, 62 -128', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5, transform: 'scale(' + u + ')', opacity: .7, 'stroke-linecap': 'round' }, cloth);
      var rand = rng(5), cols = ['#FF6B5A', '#FFB23F', '#3DDC97', '#4F74FF', '#A77BFF', '#F23FA0', '#FFFFFF'];
      var bits = [];
      for (var i = 0; i < 110; i++) {
        var side = i % 2 ? 1 : -1, kind = rand();
        var e = kind < .12 ? el('g', {}, root) : el(kind < .55 ? 'rect' : kind < .8 ? 'circle' : 'path', {}, root);
        var c = cols[Math.floor(rand() * cols.length)];
        if (kind < .12) { var mm = el('g', { transform: 'scale(.06) translate(-300,-318)' }, e); el('use', { href: '#kR', fill: c }, mm); el('use', { href: '#kL', fill: c }, mm); }
        else if (kind < .55) { e.setAttribute('x', -7); e.setAttribute('y', -3.5); e.setAttribute('width', 14); e.setAttribute('height', 7); e.setAttribute('fill', c); }
        else if (kind < .8) { e.setAttribute('r', 4.5); e.setAttribute('fill', c); }
        else { e.setAttribute('d', 'M-8 0 Q -4 -6 0 0 T 8 0'); e.setAttribute('stroke', c); e.setAttribute('stroke-width', 2.5); e.setAttribute('fill', 'none'); }
        bits.push({ e: e, side: side, vx: (320 + rand() * 900) * -side, vy: -(1100 + rand() * 900), spin: (rand() - .5) * 1440, fl: 4 + rand() * 10, d: rand() * .05, s: .9 + rand() * 1.2 });
      }
      return function (p) {
        /* anticipation wiggle, then the pull */
        var wig = seg(p, .08, .26), pull = E.in(seg(p, .26, .4));
        var wg = Math.sin(wig * Math.PI * 6) * (wig > 0 && wig < 1 ? 2.5 : 0);
        cloth.setAttribute('transform', 'translate(' + pull * 260 * u + ',' + (-pull * 1300 * u) + ') rotate(' + (wg + pull * 38) + ' 0 ' + (260 * u) + ') scale(' + (1 + pull * .2) + ',' + (1 - pull * .25) + ')');
        cloth.style.opacity = 1 - seg(p, .36, .42);
        var rev = seg(p, .3, .5);
        k1.set({ y: -10 * u, sx: lerp(.92, 1.02, E.back(rev)) * u, beam: p * 520, op: p > .27 ? 1 : 0 });
        spot.style.opacity = .25 + .75 * E.out(rev);
        plinth.style.opacity = 1;
        var t0 = .34;
        bits.forEach(function (b) {
          var t = (p - t0 - b.d) * 7000 / 1000;
          if (t < 0) { b.e.style.opacity = 0; return; }
          var x0 = b.side * (W / 2 + 20), y0 = H / 2 - 40;
          var drag = 1 - Math.exp(-t * 1.2);
          var x = x0 + b.vx * u * drag / 1.2, y = y0 + b.vy * u * drag / 1.2 + 520 * u * t * t;
          var flutter = Math.cos(t * b.fl);
          b.e.setAttribute('transform', 'translate(' + x + ',' + y + ') rotate(' + b.spin * t + ') scale(' + b.s * u * flutter + ',' + b.s * u + ')');
          b.e.style.opacity = 1 - seg(t, 3, 4);
        });
      };
    }
  };

  /* 20 · CHROME — a polished chrome mark turns into the light, reflection on the floor */
  M.chrome = {
    title: 'Chrome', dur: 6500, cap: [.66, .84],
    bg: 'radial-gradient(70% 55% at 50% 40%, #1C1E24 0%, #0B0C0F 55%, #030304 100%)', accent: '#C9CFDA', wm: '#6A6F7C',
    line: 'Made to be <em>remembered.</em>',
    build: function (root, u) {
      var chromeG = root.ownerSVGElement.querySelector('#kChrome');
      var floor = el('line', { x1: -900 * u, y1: 200 * u, x2: 900 * u, y2: 200 * u, stroke: '#2A2D35', 'stroke-width': 2 * u }, root);
      var d = root.ownerSVGElement.querySelector('defs');
      var fm = el('linearGradient', { id: 'crFade', x1: 0, y1: 0, x2: 0, y2: 1 }, d);
      el('stop', { offset: 0, 'stop-color': '#fff', 'stop-opacity': .35 }, fm); el('stop', { offset: .5, 'stop-color': '#fff', 'stop-opacity': 0 }, fm);
      var mk = el('mask', { id: 'crMask', maskContentUnits: 'userSpaceOnUse' }, d);
      el('rect', { x: -1000 * u, y: 200 * u, width: 2000 * u, height: 420 * u, fill: 'url(#crFade)' }, mk);
      var refl = el('g', { mask: 'url(#crMask)' }, root);
      var r1 = mark(refl, { fill: 'url(#kChrome)', beamFill: 'url(#kBeamSoft)', beamOp: 0 });
      var k1 = mark(root, { fill: 'url(#kChrome)', beamFill: 'url(#kBeamSoft)', beamOp: .9 });
      var sp = [[-190, -190, 1.2], [210, -80, .8], [120, 150, .6]].map(function (a) { return spark(root, a[0] * u, a[1] * u, a[2] * u); });
      return function (p) {
        /* one and a half turns down to rest, like a coin settling */
        var tt = E.out(seg(p, 0, .5)), turn = (1 - tt) * Math.PI * 3;
        var sx = Math.cos(turn), S = 1.02 * u;
        var bob = Math.sin(p * TAU) * 6 * u;
        /* measured bounds: the mark's bottom sits ~180 units below its origin */
        var y = 200 * u - 180 * S - 6 * u + bob * .3;
        k1.set({ y: y, sx: S * (Math.abs(sx) < .02 ? .02 : sx), sy: S, beam: p * 540 });
        r1.set({ y: 400 * u - y, sx: S * (Math.abs(sx) < .02 ? .02 : sx), sy: -S });
        chromeG.setAttribute('gradientTransform', 'translate(' + (p * 1.6 - .4) + ',0)');
        floor.style.opacity = E.out(seg(p, .1, .4));
        sp.forEach(function (s, i) { var t = seg(p, .5 + i * .08, .62 + i * .08); s.style.opacity = t > 0 && t < 1 ? Math.sin(t * Math.PI) : 0; });
      };
    }
  };

  K.cmark = cmark; K.txt = txt; K.star = star; K.FONT = FONT;
  K.order = K.order.concat(['open', 'stars', 'lighthouse', 'kaleido', 'swatch', 'blocks', 'notify', 'route', 'unveil', 'chrome']);
})(window.KMotion);
