/* ============================================================================
   KREATED BRAND MOTION — the service set (moments 21–27)
   ----------------------------------------------------------------------------
   One moment per service page. Each caption is a heading already on that
   page, so the words are approved copy, not new claims:
     webdesign  → /services/web-design/                "A finished site that is live and working"
     redesign   → /services/website-redesign/          "Keep what works, rebuild what doesn't"
     localseo   → /services/local-seo/                 "Four parts that move together"
     gbp        → /services/google-business-profile/   "The panel buyers see before your website"
     aeo        → /services/answer-engine-optimization/"One version of the facts"
     brand      → /services/brand-strategy/            "One mark, everywhere it appears"
     social     → /services/social-media-management/   "Accounts that don't go quiet"
   🚫 Phone numbers are 555 numbers; business names are "Your Business".
   ========================================================================== */
(function (K) {
  'use strict';
  var el = K.el, seg = K.seg, E = K.E, mark = K.mark, spark = K.spark, drawn = K.drawn, lerp = K.lerp, rng = K.rng, cl = K.cl;
  var cmark = K.cmark, txt = K.txt, star = K.star;
  var M = K.moments;
  var TAU = Math.PI * 2;
  function rr(parent, x, y, w, h, r, a) { return el('rect', Object.assign({ x: x, y: y, width: w, height: h, rx: r }, a || {}), parent); }
  function flat(parent, fill, x, y, s, a) { var g = el('g', Object.assign({ transform: 'translate(' + x + ',' + y + ') scale(' + s + ') translate(-300,-318)' }, a || {}), parent);
    el('use', { href: '#kR', fill: fill }, g); el('use', { href: '#kL', fill: fill }, g); return g; }
  function lgrad(root, id, stops, a) { var d = root.ownerSVGElement.querySelector('defs'); var g = el('linearGradient', Object.assign({ id: id, x1: 0, y1: 0, x2: 1, y2: 1 }, a || {}), d);
    stops.forEach(function (s) { el('stop', { offset: s[0], 'stop-color': s[1] }, g); }); return 'url(#' + id + ')'; }

  /* 21 · WEB DESIGN — a pencil wireframe inks itself into a finished site, then a phone, then Live */
  M.webdesign = {
    title: 'Web Design', page: '/services/web-design/', dur: 8000, cap: [.76, .92],
    bg: 'radial-gradient(80% 70% at 50% 40%, #FFFFFF 0%, #F1F2F5 55%, #E0E3EA 100%)', ink: '#15181D', accent: '#E0473A', wm: '#8A90A0',
    line: 'A finished site that is <em>live and working.</em>',
    build: function (root, u) {
      var FW = 760 * u, FH = 500 * u, fx = -FW / 2 - 50 * u, fy = -FH / 2 + 10 * u;
      var hero = lgrad(root, 'wdHero', [['0', '#FF8A6A'], ['.55', '#F0473A'], ['1', '#7A1F3A']]);
      var desk = el('g', {}, root), phoneG = el('g', {}, root);
      /* each part: [x, y, w, h, radius, fill] relative to the frame */
      function parts(W) {
        return [
          [24, 58, 26, 26, 6, '#15181D', 'logo'], [W - 250, 66, 50, 10, 5, '#15181D'], [W - 184, 66, 50, 10, 5, '#15181D'], [W - 118, 60, 94, 22, 11, '#E0473A'],
          [30, 118, 330, 28, 6, '#15181D'], [30, 158, 250, 28, 6, '#15181D'], [30, 206, 290, 11, 5, '#9098A8'], [30, 226, 240, 11, 5, '#9098A8'],
          [30, 262, 160, 46, 23, '#E0473A'], [W - 340, 104, 310, 214, 16, hero, 'img'],
          [30, 346, (W - 80) / 3, 120, 14, '#FFE3C2'], [40 + (W - 80) / 3, 346, (W - 80) / 3, 120, 14, '#CFF5E4'], [50 + 2 * (W - 80) / 3, 346, (W - 80) / 3, 120, 14, '#E4DAFF']
        ];
      }
      function build(g, x0, y0, W, H, sc, list) {
        rr(g, x0 + 6 * u, y0 + 10 * u, W, H, 20 * u, { fill: '#000', opacity: .06 });
        var frame = rr(g, x0, y0, W, H, 20 * u, { fill: '#FFFFFF', stroke: '#15181D', 'stroke-width': 2 * u });
        var bar = rr(g, x0, y0, W, 40 * u * sc, 20 * u, { fill: '#F1F2F5' });
        var out = { frame: frame, sketch: [], ink: [], extra: [] };
        list.forEach(function (q) {
          var x = x0 + q[0] * u * sc, y = y0 + q[1] * u * sc, w = q[2] * u * sc, h = q[3] * u * sc;
          var sk = rr(g, x, y, w, h, q[4] * u * sc, { fill: 'none', stroke: '#6A7080', 'stroke-width': 2 * u, 'stroke-dasharray': '' });
          var L = drawn(sk);
          var ink = rr(g, x, y, w, h, q[4] * u * sc, { fill: q[5], opacity: 0 });
          out.sketch.push({ e: sk, L: L }); out.ink.push(ink);
          if (q[6] === 'img') {
            var cross = el('path', { d: 'M' + x + ' ' + y + 'L' + (x + w) + ' ' + (y + h) + 'M' + (x + w) + ' ' + y + 'L' + x + ' ' + (y + h), stroke: '#6A7080', 'stroke-width': 2 * u, fill: 'none' }, g);
            out.cross = { e: cross, L: drawn(cross) };
            out.extra.push(flat(g, '#FFFFFF', x + w / 2, y + h / 2 + 6 * u * sc, .32 * u * sc, { opacity: 0 }));
          }
          if (q[6] === 'logo') out.extra.push(flat(g, '#FFFFFF', x + w / 2, y + h / 2 + 1 * u * sc, .055 * u * sc, { opacity: 0 }));
        });
        return out;
      }
      var D = build(desk, fx, fy, FW, FH, 1, parts(760));
      var dots = [0, 1, 2].map(function (i) { return el('circle', { cx: fx + (22 + i * 18) * u, cy: fy + 20 * u, r: 5 * u, fill: ['#FF6B5A', '#FFB23F', '#3DDC97'][i] }, desk); });
      var url = rr(desk, fx + 110 * u, fy + 9 * u, FW - 220 * u, 22 * u, 11 * u, { fill: '#FFFFFF' });
      var urlT = txt(desk, 'yourbusiness.com', { x: fx + FW / 2, y: fy + 25 * u, 'font-size': 14 * u, fill: '#15181D', opacity: 0 });
      var live = el('g', { opacity: 0 }, desk);
      rr(live, fx + FW - 100 * u, fy + 8 * u, 80 * u, 24 * u, 12 * u, { fill: '#DDF8EC' });
      var liveDot = el('circle', { cx: fx + FW - 84 * u, cy: fy + 20 * u, r: 5 * u, fill: '#1FC98A' }, live);
      txt(live, 'Live', { x: fx + FW - 52 * u, y: fy + 25 * u, 'font-size': 14 * u, 'font-weight': 600, fill: '#0A6A4A' });
      /* the phone: the same site, stacked */
      var PW = 210 * u, PH = 420 * u, px = fx + FW - 120 * u, py = fy + 150 * u;
      var ph = el('g', {}, phoneG);
      rr(ph, px - 8 * u, py - 8 * u, PW + 16 * u, PH + 16 * u, 34 * u, { fill: '#15181D' });
      rr(ph, px, py, PW, PH, 28 * u, { fill: '#FFFFFF' });
      rr(ph, px + PW / 2 - 30 * u, py + 8 * u, 60 * u, 14 * u, 7 * u, { fill: '#15181D' });
      [[16, 36, 20, 20, 5, '#15181D'], [PW / u - 60, 40, 44, 12, 6, '#E0473A'], [16, 70, PW / u - 32, 120, 12, hero], [16, 204, 150, 16, 4, '#15181D'], [16, 226, 120, 16, 4, '#15181D'], [16, 254, 150, 8, 4, '#9098A8'],
        [16, 276, 110, 32, 16, '#E0473A'], [16, 322, PW / u - 32, 80, 12, '#FFE3C2']].forEach(function (q) { rr(ph, px + q[0] * u, py + q[1] * u, q[2] * u, q[3] * u, q[4] * u, { fill: q[5] }); });
      flat(ph, '#FFFFFF', px + PW / 2, py + 132 * u, .16 * u);
      flat(ph, '#FFFFFF', px + 26 * u, py + 46.5 * u, .04 * u);
      var pencil = el('g', {}, root);
      el('path', { d: 'M0 0 L 14 -8 L 150 -8 L 150 8 L 14 8Z', fill: '#FFB23F', transform: 'scale(' + u + ')' }, pencil);
      el('path', { d: 'M0 0 L 14 -8 L 14 8Z', fill: '#2A2E36', transform: 'scale(' + u + ')' }, pencil);
      el('rect', { x: 150 * u, y: -8 * u, width: 22 * u, height: 16 * u, rx: 3 * u, fill: '#F28AA0' }, pencil);
      return function (p) {
        var inT = E.out(seg(p, 0, .08));
        desk.style.opacity = inT;
        /* sketch */
        var sk = seg(p, .04, .34), tip = null;
        D.sketch.forEach(function (s, i) {
          var t = seg(sk, i / D.sketch.length * .85, i / D.sketch.length * .85 + .2);
          s.e.style.strokeDashoffset = s.L * (1 - t);
          if (t > 0 && t < 1) tip = s.e.getPointAtLength(s.L * t);
          s.e.style.opacity = 1 - seg(p, .52, .62);
        });
        if (D.cross) { D.cross.e.style.strokeDashoffset = D.cross.L * (1 - seg(p, .3, .36)); D.cross.e.style.opacity = 1 - seg(p, .44, .5); }
        if (tip) pencil.setAttribute('transform', 'translate(' + tip.x + ',' + tip.y + ') rotate(-35)');
        pencil.style.opacity = sk > 0 && sk < 1 ? 1 : 0;
        /* ink: the colour arrives block by block */
        D.ink.forEach(function (e, i) { var t = seg(p, .36 + i * .018, .44 + i * .018); e.style.opacity = E.out(t); });
        D.extra.forEach(function (e) { e.style.opacity = seg(p, .5, .56); });
        var pt = E.out(seg(p, .56, .7));
        phoneG.setAttribute('transform', 'translate(' + lerp(420 * u, 0, pt) + ',' + lerp(40 * u, 0, pt) + ')'); phoneG.style.opacity = pt;
        urlT.style.opacity = seg(p, .64, .68);
        var lt = seg(p, .68, .74); live.style.opacity = lt;
        liveDot.setAttribute('r', 5 * u * (1 + .5 * Math.max(0, Math.sin((p - .68) * 40))));
      };
    }
  };

  /* 22 · REDESIGN — the old site is scanned; keepers glow, the rest is swapped out */
  M.redesign = {
    title: 'Website Redesign', page: '/services/website-redesign/', dur: 8000, cap: [.76, .92],
    bg: 'radial-gradient(70% 60% at 50% 42%, #1E2128 0%, #111318 60%, #0A0B0E 100%)', accent: '#5BF0B0', wm: '#6E7384',
    line: 'Keep what works, <em>rebuild what doesn’t.</em>',
    build: function (root, u) {
      var rows = [
        ['Your name and logo', 1, 'Same name, sharper'],
        ['Slow hero image', 0, 'A fast new hero'],
        ['Your reviews', 1, 'Your reviews, up front'],
        ['Contact form that fails', 0, 'A form that reaches you'],
        ['Pages that already rank', 1, 'Same pages, same addresses'],
        ['Dated footer', 0, 'Hours, phone, map']
      ];
      var BW = 640 * u, BH = 78 * u, GAP = 14 * u, top = -(rows.length * (BH + GAP)) / 2 - 40 * u;
      var fresh = lgrad(root, 'rdNew', [['0', '#4F74FF'], ['1', '#7A4DFF']], { x1: 0, y1: 0, x2: 1, y2: 0 });
      var R = rows.map(function (r, i) {
        var y = top + i * (BH + GAP);
        var g = el('g', {}, root);
        var box = rr(g, -BW / 2, 0, BW, BH, 14 * u, { fill: '#2A2E36', stroke: '#3A3F4A', 'stroke-width': 2 * u });
        var t = txt(g, r[0], { x: -BW / 2 + 26 * u, y: BH / 2 + 8 * u, 'text-anchor': 'start', 'font-size': 24 * u, 'font-weight': 500, fill: '#9AA2B2' });
        var tag = el('g', { opacity: 0 }, g);
        rr(tag, BW / 2 - 150 * u, BH / 2 - 17 * u, 130 * u, 34 * u, 17 * u, { fill: r[1] ? '#12382A' : '#3A1618' });
        txt(tag, r[1] ? 'KEEP' : 'REBUILD', { x: BW / 2 - 85 * u, y: BH / 2 + 6 * u, 'font-size': 16 * u, 'font-weight': 600, 'letter-spacing': 2 * u, fill: r[1] ? '#5BF0B0' : '#FF7A6B' });
        var n = null;
        if (!r[1]) {
          n = el('g', { opacity: 0 }, root);
          rr(n, -BW / 2, 0, BW, BH, 14 * u, { fill: fresh });
          txt(n, r[2], { x: -BW / 2 + 26 * u, y: BH / 2 + 8 * u, 'text-anchor': 'start', 'font-size': 24 * u, 'font-weight': 600, fill: '#FFFFFF' });
          flat(n, '#FFFFFF', BW / 2 - 50 * u, BH / 2 + 2 * u, .08 * u, { opacity: .9 });
        }
        return { g: g, box: box, t: t, tag: tag, n: n, y: y, keep: r[1], label: r[2] };
      });
      if (R[0].keep) flat(R[0].g, '#5BF0B0', BW / 2 - 190 * u, BH / 2 + 2 * u, .07 * u, { opacity: .9 });
      var scan = rr(root, -BW / 2 - 30 * u, 0, BW + 60 * u, 4 * u, 2 * u, { fill: '#5BF0B0', filter: 'url(#kGlow)', opacity: 0 });
      var sp = [[340, -300, .8], [-360, 180, .6]].map(function (a) { var s = spark(root, a[0] * u, a[1] * u, a[2] * u); s.setAttribute('fill', '#CFFCE8'); return s; });
      return function (p) {
        var sc = seg(p, .26, .46), sy = lerp(top - 20 * u, top + R.length * (BH + GAP), sc);
        scan.setAttribute('y', sy); scan.style.opacity = sc > 0 && sc < 1 ? 1 : 0;
        R.forEach(function (r, i) {
          var inT = E.out(seg(p, .02 + i * .03, .12 + i * .03));
          var hit = sy > r.y + BH / 2 ? 1 : 0;
          r.tag.style.opacity = hit;
          if (r.keep) {
            var gl = seg(p, .5, .58);
            r.box.setAttribute('stroke', hit ? '#5BF0B0' : '#3A3F4A');
            r.box.setAttribute('fill', gl > 0 ? '#16362B' : '#2A2E36');
            r.t.setAttribute('fill', hit ? '#E8FFF4' : '#9AA2B2');
            r.g.setAttribute('transform', 'translate(' + (1 - inT) * -60 * u + ',' + r.y + ')');
            r.g.style.opacity = inT;
          } else {
            if (hit) r.box.setAttribute('stroke', '#FF7A6B');
            var out = E.in(seg(p, .48 + i * .015, .6 + i * .015));
            r.g.setAttribute('transform', 'translate(' + ((1 - inT) * -60 * u - out * 900 * u) + ',' + (r.y + out * 60 * u) + ') rotate(' + (-out * 8) + ')');
            r.g.style.opacity = inT * (1 - out);
            var ni = E.out(seg(p, .6 + i * .02, .72 + i * .02));
            r.n.setAttribute('transform', 'translate(' + (1 - ni) * 700 * u + ',' + r.y + ')'); r.n.style.opacity = ni;
          }
        });
        sp.forEach(function (s, i) { var t = seg(p, .72 + i * .06, .84 + i * .06); s.style.opacity = t > 0 && t < 1 ? Math.sin(t * Math.PI) : 0; });
      };
    }
  };

  /* 23 · LOCAL SEO — four gears, one per part, turning a centre gear that carries the mark */
  function gearPath(Rp, N, a) {
    var d = '', add = a || 14, ro = Rp + add, ri = Rp - add;
    for (var i = 0; i < N; i++) {
      var c = i * TAU / N, w = TAU / N;
      var pts = [[ri, c - w * .5], [ri, c - w * .26], [ro, c - w * .15], [ro, c + w * .15], [ri, c + w * .26]];
      pts.forEach(function (q, k) { d += (i === 0 && k === 0 ? 'M' : 'L') + (Math.cos(q[1]) * q[0]).toFixed(2) + ' ' + (Math.sin(q[1]) * q[0]).toFixed(2); });
    }
    return d + 'Z';
  }
  M.localseo = {
    title: 'Local SEO', page: '/services/local-seo/', dur: 8000, cap: [.74, .9],
    bg: 'radial-gradient(70% 60% at 50% 44%, #231A10 0%, #140F09 60%, #0A0805 100%)', accent: '#FFB23F', wm: '#8A7A5A',
    line: 'Four parts that <em>move together.</em>',
    build: function (root, u) {
      var R1 = 180, N1 = 18, R2 = 120, N2 = 12, CD = R1 + R2;
      var parts = [
        ['Google Business', 'Profile', 'amber', 225], ['Service and', 'location pages', 'mint', 315],
        ['The site', 'itself', 'coral', 135], ['Measurement', '', 'violet', 45]
      ];
      var glow = el('circle', { r: 480 * u, fill: 'url(#kB_amber)', opacity: .5 }, root);
      var G = parts.map(function (q) {
        var a = q[3] * Math.PI / 180, cx = Math.cos(a) * CD * u, cy = Math.sin(a) * CD * u;
        var g = el('g', {}, root);
        var spin = el('g', {}, g);
        el('path', { d: gearPath(R2, N2), fill: 'url(#kF_' + q[2] + ')', transform: 'scale(' + u + ')' }, spin);
        el('circle', { r: 62 * u, fill: '#140F09', opacity: .55 }, spin);
        el('circle', { r: 20 * u, fill: '#140F09' }, spin);
        [0, 1, 2, 3].forEach(function (k) { el('rect', { x: -5 * u, y: -60 * u, width: 10 * u, height: 40 * u, rx: 5 * u, fill: '#140F09', opacity: .55, transform: 'rotate(' + k * 90 + ')' }, spin); });
        var up = cy < 0, ly = cy + (up ? -170 : 170) * u;
        var lab = el('g', { opacity: 0 }, root);
        txt(lab, q[0], { x: cx, y: ly + (up && q[1] ? -14 * u : 0), 'font-size': 26 * u, 'font-weight': 600, fill: '#FFF1DA' });
        if (q[1]) txt(lab, q[1], { x: cx, y: ly + (up ? 16 * u : 30 * u), 'font-size': 26 * u, 'font-weight': 600, fill: '#FFF1DA' });
        return { g: g, spin: spin, lab: lab, cx: cx, cy: cy, phi: q[3] };
      });
      var cg = el('g', {}, root), cs = el('g', {}, cg);
      el('path', { d: gearPath(R1, N1), fill: 'url(#kF_ink)', stroke: '#4A4030', 'stroke-width': 2, transform: 'scale(' + u + ')' }, cs);
      el('circle', { r: 128 * u, fill: '#0E0B07' }, cs);
      var k = cmark(cg, 'chrome', { beamFill: 'url(#kBeamWarm)' });
      return function (p) {
        /* the drive: stopped while the parts arrive, then turning, easing up to speed */
        var run = seg(p, .36, 1), th = (run * run * .5 + run * .5) * 260;
        var cIn = E.back(seg(p, .02, .12));
        cg.setAttribute('transform', 'scale(' + (cIn || .0001) + ')');
        cs.setAttribute('transform', 'rotate(' + th + ')');
        k.set({ sx: .56 * u, beam: p * 520 });
        G.forEach(function (g, i) {
          var t = seg(p, .1 + i * .06, .2 + i * .06), e = t ? E.back(t) : 0;
          var th2 = g.phi + 180 + 180 / N2 - (th - g.phi) * N1 / N2;
          g.g.setAttribute('transform', 'translate(' + g.cx + ',' + g.cy + ') scale(' + (e || .0001) + ')');
          g.spin.setAttribute('transform', 'rotate(' + th2 + ')');
          g.lab.style.opacity = E.out(seg(p, .24 + i * .05, .34 + i * .05));
        });
        glow.style.opacity = .3 + .4 * run;
      };
    }
  };

  /* 24 · GOOGLE BUSINESS PROFILE — the listing assembles itself out of a loading skeleton */
  M.gbp = {
    title: 'Google Business Profile', page: '/services/google-business-profile/', dur: 8000, cap: [.76, .92],
    bg: 'radial-gradient(75% 65% at 50% 42%, #134541 0%, #0B2C29 55%, #061917 100%)', accent: '#7CF2DC', wm: '#5E8A84',
    line: 'The panel buyers see <em>before your website.</em>',
    build: function (root, u) {
      var PW = 580 * u, PH = 800 * u, px = -PW / 2, py = -PH / 2 - 10 * u;
      var g1 = lgrad(root, 'gbA', [['0', '#FFB36B'], ['1', '#E0473A']]), g2 = lgrad(root, 'gbB', [['0', '#8FF0C8'], ['1', '#1FA374']]), g3 = lgrad(root, 'gbC', [['0', '#B9A2FF'], ['1', '#5A33D6']]);
      var card = el('g', {}, root);
      rr(card, px + 8 * u, py + 14 * u, PW, PH, 30 * u, { fill: '#000', opacity: .25 });
      rr(card, px, py, PW, PH, 30 * u, { fill: '#FFFFFF' });
      /* skeleton, then the real thing on top, section by section */
      var S = [], Rl = [];
      function section(sk, real) { S.push(sk); Rl.push(real); }
      var clipId = 'gbClip'; var cp = el('clipPath', { id: clipId }, root.ownerSVGElement.querySelector('defs')); rr(cp, px, py, PW, PH, 30 * u);
      var photos = el('g', { 'clip-path': 'url(#' + clipId + ')' }, card);
      var sk0 = rr(photos, px, py, PW, 230 * u, 0, { fill: '#E8EBEF' });
      var ph = el('g', {}, photos);
      rr(ph, px, py, PW * .62 - 3 * u, 230 * u, 0, { fill: g1 });
      rr(ph, px + PW * .62 + 3 * u, py, PW * .38, 113 * u, 0, { fill: g2 });
      rr(ph, px + PW * .62 + 3 * u, py + 117 * u, PW * .38, 113 * u, 0, { fill: g3 });
      /* a house on the first photo: roof, door, window */
      el('path', { d: 'M' + (px + 70 * u) + ' ' + (py + 175 * u) + ' L ' + (px + 70 * u) + ' ' + (py + 118 * u) + ' L ' + (px + 170 * u) + ' ' + (py + 64 * u) + ' L ' + (px + 270 * u) + ' ' + (py + 118 * u) + ' L ' + (px + 270 * u) + ' ' + (py + 175 * u) + 'Z', fill: '#FFF3E6', opacity: .92 }, ph);
      rr(ph, px + 150 * u, py + 128 * u, 40 * u, 47 * u, 4 * u, { fill: '#A3202A' });
      rr(ph, px + 0, py + 175 * u, PW * .62, 55 * u, 0, { fill: '#7A1F2A', opacity: .5 });
      flat(ph, '#FFFFFF', px + PW * .81, py + 60 * u, .12 * u, { opacity: .9 });
      section(sk0, ph);
      var y = py + 272 * u, L = px + 34 * u;
      var sk1 = rr(card, L, y - 28 * u, 300 * u, 30 * u, 8 * u, { fill: '#E8EBEF' });
      var nm = txt(card, 'Your Business', { x: L, y: y, 'text-anchor': 'start', 'font-size': 36 * u, 'font-weight': 600, fill: '#15181D' });
      section(sk1, nm);
      y += 46 * u;
      var sk2 = rr(card, L, y - 20 * u, 240 * u, 22 * u, 8 * u, { fill: '#E8EBEF' });
      var st = el('g', {}, card);
      for (var i = 0; i < 5; i++) el('path', { d: star(12 * u, 5.4 * u), fill: '#F5B82E', transform: 'translate(' + (L + 12 * u + i * 28 * u) + ',' + (y - 8 * u) + ')' }, st);
      txt(st, 'Reviews', { x: L + 152 * u, y: y, 'text-anchor': 'start', 'font-size': 20 * u, fill: '#1A73E8' });
      section(sk2, st);
      y += 38 * u;
      var sk3 = rr(card, L, y - 20 * u, 330 * u, 22 * u, 8 * u, { fill: '#E8EBEF' });
      var ct = txt(card, 'Home services · Wilmington, NC', { x: L, y: y, 'text-anchor': 'start', 'font-size': 20 * u, fill: '#5F6570' });
      section(sk3, ct);
      y += 38 * u;
      var sk4 = rr(card, L, y - 20 * u, 260 * u, 22 * u, 8 * u, { fill: '#E8EBEF' });
      var hr = el('g', {}, card);
      var open = el('text', { x: L, y: y, 'font-family': K.FONT, 'font-size': 20 * u, 'font-weight': 600, fill: '#188038' }, hr); open.textContent = 'Open';
      txt(hr, '· Closes 6 PM', { x: L + 58 * u, y: y, 'text-anchor': 'start', 'font-size': 20 * u, fill: '#5F6570' });
      section(sk4, hr);
      y += 52 * u;
      var btns = [['Call', 'M-9 -9 C -9 3, 3 9, 9 9 L 9 4 L 4 2 L 2 5 C -2 3, -3 2, -5 -2 L -2 -4 L -4 -9Z'], ['Directions', 'M0 -11 L 11 0 L 0 11 L -11 0Z M-4 3 L -4 -1 L 2 -1 L 2 -4 L 6 0 L 2 4 L 2 1 L -2 1 L -2 3Z'], ['Website', 'M0 -10 A 10 10 0 1 0 0.01 -10Z M-10 0 L 10 0 M0 -10 C -5 -4, -5 4, 0 10 C 5 4, 5 -4, 0 -10']]
        .map(function (b, i) {
          var bx = L + 44 * u + i * 150 * u;
          var skb = el('circle', { cx: bx, cy: y + 34 * u, r: 32 * u, fill: '#E8EBEF' }, card);
          var gb = el('g', {}, card);
          el('circle', { cx: bx, cy: y + 34 * u, r: 32 * u, fill: '#E6F4F1' }, gb);
          el('path', { d: b[1], fill: i === 2 ? 'none' : '#0E7C6B', stroke: i === 2 ? '#0E7C6B' : 'none', 'stroke-width': 2, 'fill-rule': 'evenodd', transform: 'translate(' + bx + ',' + (y + 34 * u) + ') scale(' + 1.5 * u + ')' }, gb);
          txt(gb, b[0], { x: bx, y: y + 96 * u, 'font-size': 18 * u, 'font-weight': 500, fill: '#0E7C6B' });
          section(skb, gb);
          return { x: bx, y: y + 34 * u };
        });
      y += 128 * u;
      var sk5 = rr(card, L, y, PW - 68 * u, 130 * u, 16 * u, { fill: '#E8EBEF' });
      var map = el('g', {}, card);
      rr(map, L, y, PW - 68 * u, 130 * u, 16 * u, { fill: '#E3F1EA' });
      var mclip = 'gbMap'; var mc = el('clipPath', { id: mclip }, root.ownerSVGElement.querySelector('defs')); rr(mc, L, y, PW - 68 * u, 130 * u, 16 * u);
      var roads = el('g', { 'clip-path': 'url(#' + mclip + ')', stroke: '#FFFFFF', 'stroke-width': 8 * u }, map);
      [[-40, 70, 600, 30], [0, 130, 600, 90], [140, 0, 200, 160], [330, 0, 380, 160]].forEach(function (r) { el('line', { x1: L + r[0] * u, y1: y + r[1] * u, x2: L + r[2] * u, y2: y + r[3] * u }, roads); });
      el('path', { d: 'M' + (L + 380 * u) + ' ' + y + ' C ' + (L + 420 * u) + ' ' + (y + 50 * u) + ', ' + (L + 470 * u) + ' ' + (y + 60 * u) + ', ' + (L + 520 * u) + ' ' + (y + 130 * u), stroke: '#A9D8F0', 'stroke-width': 26 * u, fill: 'none', 'clip-path': 'url(#' + mclip + ')' }, map);
      el('path', { d: 'M' + (L + 250 * u) + ' ' + (y + 78 * u) + ' l -12 -22 l 24 0Z', fill: '#E0473A' }, map);
      el('circle', { cx: L + 250 * u, cy: y + 50 * u, r: 16 * u, fill: '#E0473A' }, map);
      flat(map, '#FFFFFF', L + 250 * u, y + 51 * u, .05 * u);
      section(sk5, map);
      var shimmerCp = el('g', { 'clip-path': 'url(#' + clipId + ')' }, card);
      var shim = rr(shimmerCp, px - 200 * u, py, 160 * u, PH, 0, { fill: '#FFFFFF', opacity: .55, transform: 'skewX(-20)' });
      var tap = el('circle', { cx: btns[0].x, cy: btns[0].y, r: 0, fill: '#0E7C6B', opacity: 0 }, card);
      var finger = el('circle', { r: 20 * u, fill: '#FFFFFF', stroke: '#15181D', 'stroke-width': 3 * u, opacity: 0 }, root);
      return function (p) {
        var inT = E.out(seg(p, 0, .08));
        card.setAttribute('transform', 'translate(0,' + (1 - inT) * 60 * u + ')'); card.style.opacity = inT;
        var sh = (p * 3) % 1; shim.setAttribute('x', lerp(px - 200 * u, px + PW + 200 * u, sh)); shim.style.opacity = .5 * (1 - seg(p, .5, .6));
        S.forEach(function (s, i) {
          var t = seg(p, .18 + i * .042, .24 + i * .042);
          s.style.opacity = 1 - t; Rl[i].style.opacity = t;
          Rl[i].setAttribute('transform', 'translate(0,' + (1 - E.out(t)) * 10 * u + ')');
        });
        var ft = seg(p, .66, .74), fx2 = lerp(btns[0].x + 200 * u, btns[0].x, E.inOut(ft)), fy2 = lerp(btns[0].y + 220 * u, btns[0].y, E.inOut(ft));
        finger.setAttribute('cx', fx2); finger.setAttribute('cy', fy2 + (1 - inT) * 60 * u); finger.style.opacity = ft > 0 ? (1 - seg(p, .84, .88)) * .95 : 0;
        var tp = seg(p, .74, .84); tap.setAttribute('r', 70 * u * E.out(tp)); tap.style.opacity = tp > 0 ? (1 - tp) * .35 : 0;
      };
    }
  };

  /* 25 · AEO — conflicting facts collapse into one card, then an answer quotes it */
  M.aeo = {
    title: 'Answer Engine Optimization', page: '/services/answer-engine-optimization/', dur: 8500, cap: [.78, .92],
    bg: 'radial-gradient(70% 60% at 50% 42%, #2A1E52 0%, #160F30 60%, #0B0719 100%)', accent: '#B69CFF', wm: '#7C6EA8',
    line: 'One version <em>of the facts.</em>',
    build: function (root, u) {
      var facts = [
        ['Hours', 'Mon–Fri, 8–5', 1, [-250, -330, -7]], ['Hours', 'Mon–Sat, 9–6', 0, [230, -270, 6]],
        ['Phone', '(910) 555-0142', 1, [-260, -110, 4]], ['Phone', '(910) 555-0199', 0, [240, -40, -5]],
        ['Address', '12 Market St', 1, [-230, 120, -3]], ['Address', '12 Market Street, Ste B', 0, [210, 180, 7]]
      ];
      var CW = 380 * u, CH = 92 * u;
      var F = facts.map(function (f, i) {
        var g = el('g', {}, root);
        var box = rr(g, -CW / 2, -CH / 2, CW, CH, 18 * u, { fill: '#241A48', stroke: '#4A3C84', 'stroke-width': 2 * u });
        txt(g, f[0].toUpperCase(), { x: -CW / 2 + 24 * u, y: -8 * u, 'text-anchor': 'start', 'font-size': 15 * u, 'font-weight': 600, 'letter-spacing': 2 * u, fill: '#9C8BD6' });
        txt(g, f[1], { x: -CW / 2 + 24 * u, y: 24 * u, 'text-anchor': 'start', 'font-size': 25 * u, 'font-weight': 500, fill: '#F1ECFF' });
        var strike = el('line', { x1: -CW / 2 + 16 * u, y1: 0, x2: CW / 2 - 16 * u, y2: 0, stroke: '#FF6B8A', 'stroke-width': 4 * u, 'stroke-linecap': 'round' }, g);
        var sL = drawn(strike);
        return { g: g, box: box, strike: strike, sL: sL, ok: f[2], x: f[3][0] * u, y: f[3][1] * u, r: f[3][2], row: Math.floor(i / 2), ph: i * 1.3 };
      });
      var ne = [0, 1, 2].map(function (i) { return txt(root, '≠', { x: 0, y: (F[i * 2].y + F[i * 2 + 1].y) / 2 + 14 * u, 'font-size': 56 * u, 'font-weight': 600, fill: '#FF6B8A', opacity: 0 }); });
      /* the one card */
      var one = el('g', { opacity: 0 }, root);
      var OW = 520 * u, OH = 250 * u, oy = -330 * u;
      rr(one, -OW / 2, oy, OW, OH, 24 * u, { fill: '#F4F0FF' });
      flat(one, '#5A33D6', OW / 2 - 50 * u, oy + 46 * u, .09 * u);
      txt(one, 'Your Business', { x: -OW / 2 + 30 * u, y: oy + 52 * u, 'text-anchor': 'start', 'font-size': 28 * u, 'font-weight': 600, fill: '#1B1530' });
      [['Hours', 'Mon–Fri, 8–5'], ['Phone', '(910) 555-0142'], ['Address', '12 Market St']].forEach(function (r, i) {
        txt(one, r[0], { x: -OW / 2 + 30 * u, y: oy + (104 + i * 44) * u, 'text-anchor': 'start', 'font-size': 20 * u, fill: '#6A5F8E' });
        txt(one, r[1], { x: -OW / 2 + 150 * u, y: oy + (104 + i * 44) * u, 'text-anchor': 'start', 'font-size': 22 * u, 'font-weight': 600, fill: '#1B1530' });
      });
      /* the answer */
      var ans = el('g', { opacity: 0 }, root);
      var AW = 600 * u, ay = -30 * u;
      rr(ans, -AW / 2, ay, AW, 196 * u, 28 * u, { fill: '#352866' });
      el('circle', { cx: -AW / 2 + 40 * u, cy: ay + 42 * u, r: 18 * u, fill: 'url(#kF_violet)' }, ans);
      el('path', { d: star(9 * u, 4 * u), fill: '#FFFFFF', transform: 'translate(' + (-AW / 2 + 40 * u) + ',' + (ay + 42 * u) + ')' }, ans);
      var dotsG = el('g', {}, ans);
      var dots = [0, 1, 2].map(function (i) { return el('circle', { cx: -AW / 2 + 80 * u + i * 20 * u, cy: ay + 44 * u, r: 6 * u, fill: '#CBBDF0' }, dotsG); });
      var aText = el('g', { opacity: 0 }, ans);
      txt(aText, 'They’re open Monday to Friday, 8 to 5.', { x: -AW / 2 + 70 * u, y: ay + 50 * u, 'text-anchor': 'start', 'font-size': 23 * u, fill: '#FFFFFF' });
      txt(aText, 'Call (910) 555-0142.', { x: -AW / 2 + 70 * u, y: ay + 84 * u, 'text-anchor': 'start', 'font-size': 23 * u, fill: '#FFFFFF' });
      var chip = el('g', {}, aText);
      rr(chip, -AW / 2 + 70 * u, ay + 116 * u, 230 * u, 44 * u, 22 * u, { fill: '#4A3C84' });
      flat(chip, '#C9B6FF', -AW / 2 + 96 * u, ay + 139 * u, .045 * u);
      txt(chip, 'yourbusiness.com', { x: -AW / 2 + 118 * u, y: ay + 145 * u, 'text-anchor': 'start', 'font-size': 18 * u, fill: '#E4DCF8' });
      return function (p) {
        F.forEach(function (f, i) {
          var inT = E.out(seg(p, .02 + i * .03, .12 + i * .03));
          var drift = Math.sin(p * 14 + f.ph) * 6 * u;
          var cf = seg(p, .2 + f.row * .04, .26 + f.row * .04);
          f.box.setAttribute('stroke', cf > 0 && cf < 1 && !f.ok ? '#FF6B8A' : cf >= 1 && !f.ok ? '#FF6B8A' : '#4A3C84');
          var st = seg(p, .3 + f.row * .04, .36 + f.row * .04);
          if (!f.ok) f.strike.style.strokeDashoffset = f.sL * (1 - st); else f.strike.style.opacity = 0;
          var go = E.inOut(seg(p, .42, .54));
          if (f.ok) {
            f.g.setAttribute('transform', 'translate(' + lerp(f.x, 0, go) + ',' + lerp(f.y + drift, -205 * u, go) + ') rotate(' + lerp(f.r, 0, go) + ') scale(' + (inT * lerp(1, .6, go)) + ')');
            f.g.style.opacity = inT * (1 - seg(p, .5, .55));
          } else {
            var fall = E.in(seg(p, .38 + f.row * .02, .5 + f.row * .02));
            f.g.setAttribute('transform', 'translate(' + (f.x + fall * 80 * u) + ',' + (f.y + drift + fall * 700 * u) + ') rotate(' + (f.r + fall * 30) + ') scale(' + inT + ')');
            f.g.style.opacity = inT * (1 - fall);
          }
        });
        ne.forEach(function (n, i) { var t = seg(p, .2 + i * .04, .26 + i * .04); n.style.opacity = t * (1 - seg(p, .36, .4)); });
        var ot = seg(p, .5, .58);
        one.style.opacity = ot; one.setAttribute('transform', 'scale(' + lerp(.92, 1, E.back(ot)) + ')');
        var at = seg(p, .58, .64); ans.style.opacity = at; ans.setAttribute('transform', 'translate(0,' + (1 - E.out(at)) * 30 * u + ')');
        var typing = p > .6 && p < .68;
        dotsG.style.opacity = typing ? 1 : 0;
        dots.forEach(function (d, i) { d.setAttribute('cy', (-30 + 44) * u + Math.sin(p * 90 - i) * 4 * u); });
        aText.style.opacity = seg(p, .68, .72);
      };
    }
  };

  /* 26 · BRAND — the mark stamps itself onto six things a business owns */
  M.brand = {
    title: 'Brand Strategy & Identity', page: '/services/brand-strategy/', dur: 8000, cap: [.76, .92],
    bg: 'radial-gradient(80% 70% at 50% 40%, #FFFFFF 0%, #EDEEF2 55%, #DCDFE6 100%)', ink: '#15181D', accent: '#7A4DFF', wm: '#8A90A0',
    line: 'One mark, <em>everywhere it appears.</em>',
    build: function (root, u) {
      var CX = 300 * u, CY = 300 * u, cells = [];
      for (var r = 0; r < 2; r++) for (var c = 0; c < 3; c++) cells.push({ x: (c - 1) * CX, y: (r - .5) * CY - 30 * u });
      function sh(g, d, s) { el('path', { d: d, fill: '#000', opacity: .08, transform: 'translate(' + 6 * u + ',' + 10 * u + ') scale(' + s + ')' }, g); }
      var obj = [], stamp = [];
      /* 1 business card */
      (function (g) {
        g.setAttribute('transform', 'rotate(-7)');
        rr(g, -112 * u, -58 * u, 230 * u, 132 * u, 10 * u, { fill: '#000', opacity: .08 });
        rr(g, -120 * u, -68 * u, 230 * u, 132 * u, 10 * u, { fill: '#FFFFFF' });
        rr(g, -10 * u, -20 * u, 100 * u, 12 * u, 6 * u, { fill: '#15181D' }); rr(g, -10 * u, 2 * u, 76 * u, 9 * u, 4 * u, { fill: '#9098A8' }); rr(g, -10 * u, 20 * u, 88 * u, 9 * u, 4 * u, { fill: '#9098A8' });
        stamp.push({ g: g, x: -62 * u, y: -2 * u, s: .15, fill: '#7A4DFF' });
      })(obj[0] = el('g', {}, root));
      /* 2 polo shirt */
      (function (g) {
        var d = 'M-60 -95 L -26 -108 C -18 -92, 18 -92, 26 -108 L 60 -95 L 108 -52 L 82 -20 L 62 -36 L 62 100 L -62 100 L -62 -36 L -82 -20 L -108 -52Z';
        sh(g, d, u); el('path', { d: d, fill: '#1B2A55', transform: 'scale(' + u + ')' }, g);
        el('path', { d: 'M-26 -108 L 0 -70 L 26 -108', fill: 'none', stroke: '#2E4380', 'stroke-width': 5, transform: 'scale(' + u + ')' }, g);
        stamp.push({ g: g, x: 30 * u, y: -38 * u, s: .075, fill: '#FFFFFF' });
      })(obj[1] = el('g', {}, root));
      /* 3 van */
      (function (g) {
        var d = 'M-130 30 L -130 -50 C -130 -60, -122 -66, -112 -66 L 60 -66 C 78 -66, 90 -58, 100 -44 L 126 -10 C 132 -2, 134 6, 134 14 L 134 30Z';
        sh(g, d, u); el('path', { d: d, fill: '#FFFFFF', transform: 'scale(' + u + ')' }, g);
        el('path', { d: 'M70 -56 L 100 -18 L 70 -18Z', fill: '#2A2E36', transform: 'scale(' + u + ')' }, g);
        rr(g, -130 * u, 4 * u, 264 * u, 12 * u, 0, { fill: '#F0473A' });
        [-84, 80].forEach(function (x) { el('circle', { cx: x * u, cy: 32 * u, r: 22 * u, fill: '#15181D' }, g); el('circle', { cx: x * u, cy: 32 * u, r: 9 * u, fill: '#9098A8' }, g); });
        stamp.push({ g: g, x: -30 * u, y: -24 * u, s: .14, fill: '#1B3FC4' });
      })(obj[2] = el('g', {}, root));
      /* 4 yard sign */
      (function (g) {
        [-60, 60].forEach(function (x) { rr(g, x * u - 2 * u, -10 * u, 4 * u, 120 * u, 1 * u, { fill: '#6A7080' }); });
        rr(g, -104 * u, -88 * u, 216 * u, 136 * u, 8 * u, { fill: '#000', opacity: .08 });
        rr(g, -110 * u, -96 * u, 216 * u, 136 * u, 8 * u, { fill: '#FFB23F' });
        rr(g, -20 * u, 14 * u, 110 * u, 10 * u, 5 * u, { fill: '#15181D', opacity: .8 });
        stamp.push({ g: g, x: -2 * u, y: -38 * u, s: .17, fill: '#15181D' });
      })(obj[3] = el('g', {}, root));
      /* 5 app icon on a phone dock */
      (function (g) {
        rr(g, -78 * u, -70 * u, 156 * u, 156 * u, 38 * u, { fill: '#000', opacity: .1 });
        rr(g, -84 * u, -80 * u, 156 * u, 156 * u, 38 * u, { fill: 'url(#kF_violet)' });
        stamp.push({ g: g, x: -6 * u, y: 0, s: .3, fill: '#FFFFFF' });
        txt(g, 'Your Business', { x: -6 * u, y: 116 * u, 'font-size': 20 * u, 'font-weight': 500, fill: '#15181D' });
      })(obj[4] = el('g', {}, root));
      /* 6 mug */
      (function (g) {
        el('path', { d: 'M62 -40 C 112 -40, 112 40, 62 40', fill: 'none', stroke: '#1FC98A', 'stroke-width': 16 * u / u, transform: 'scale(' + u + ')' }, g);
        rr(g, -76 * u, -76 * u, 146 * u, 170 * u, 22 * u, { fill: '#000', opacity: .08 });
        rr(g, -80 * u, -84 * u, 146 * u, 170 * u, 22 * u, { fill: '#1FC98A' });
        el('ellipse', { cx: -7 * u, cy: -84 * u, rx: 73 * u, ry: 12 * u, fill: '#0A6A4A' }, g);
        stamp.push({ g: g, x: -7 * u, y: 2 * u, s: .19, fill: '#FFFFFF' });
      })(obj[5] = el('g', {}, root));
      var marks = stamp.map(function (s) { return { m: flat(s.g, s.fill, 0, 0, 1), s: s }; });
      var rings = stamp.map(function (s) { return el('circle', { r: 0, fill: 'none', stroke: s.fill === '#FFFFFF' ? '#7A4DFF' : s.fill, 'stroke-width': 3 * u, opacity: 0 }, s.g); });
      return function (p) {
        obj.forEach(function (g, i) {
          var c = cells[i], t = E.back(seg(p, .02 + i * .03, .12 + i * .03));
          var base = i === 0 ? ' rotate(-7)' : '';
          var bump = seg(p, .2 + i * .085, .26 + i * .085), sq = bump > 0 && bump < 1 ? 1 - Math.sin(bump * Math.PI) * .06 : 1;
          g.setAttribute('transform', 'translate(' + c.x + ',' + c.y + ') scale(' + ((t || .0001) * (2 - sq)) + ',' + ((t || .0001) * sq) + ')' + base);
        });
        marks.forEach(function (m, i) {
          var t = seg(p, .16 + i * .085, .22 + i * .085), e = E.in(t);
          var s = m.s.s * u * lerp(2.4, 1, e);
          m.m.setAttribute('transform', 'translate(' + m.s.x + ',' + (m.s.y - (1 - e) * 60 * u) + ') scale(' + s + ') translate(-300,-318)');
          m.m.style.opacity = t > 0 ? Math.min(1, t * 3) : 0;
          var rt = seg(p, .22 + i * .085, .32 + i * .085);
          rings[i].setAttribute('cx', m.s.x); rings[i].setAttribute('cy', m.s.y);
          rings[i].setAttribute('r', 90 * u * m.s.s / .17 * E.out(rt)); rings[i].style.opacity = rt > 0 ? (1 - rt) * .8 : 0;
        });
      };
    }
  };

  /* 27 · SOCIAL — a month fills: posts on Monday, Wednesday, Friday, a video every Thursday */
  M.social = {
    title: 'Social Media Management', page: '/services/social-media-management/', dur: 8000, cap: [.76, .92],
    bg: 'radial-gradient(80% 70% at 50% 40%, #FFFFFF 0%, #F1EEF8 55%, #E2DDF0 100%)', ink: '#1B1530', accent: '#E0358F', wm: '#8C84A8',
    line: 'Accounts that <em>don’t go quiet.</em>',
    build: function (root, u) {
      var CW = 96 * u, GW = CW * 7, GX = -GW / 2, top = -330 * u;
      var card = el('g', {}, root);
      rr(card, GX - 30 * u + 6 * u, top - 10 * u, GW + 60 * u, 710 * u, 30 * u, { fill: '#000', opacity: .06 });
      rr(card, GX - 30 * u, top - 20 * u, GW + 60 * u, 710 * u, 30 * u, { fill: '#FFFFFF' });
      txt(card, 'October', { x: GX, y: top + 40 * u, 'text-anchor': 'start', 'font-size': 38 * u, 'font-weight': 600, fill: '#1B1530' });
      flat(card, '#E0358F', GX + GW - 20 * u, top + 26 * u, .09 * u);
      'SMTWTFS'.split('').forEach(function (d, i) { txt(card, d, { x: GX + i * CW + CW / 2, y: top + 92 * u, 'font-size': 18 * u, 'font-weight': 600, fill: '#9A92B8' }); });
      var gy = top + 112 * u, first = 4, cells = {};
      for (var day = 1; day <= 31; day++) {
        var idx = first + day - 1, c = idx % 7, r = Math.floor(idx / 7);
        var x = GX + c * CW, y = gy + r * CW;
        cells[day] = { x: x, y: y };
        rr(card, x + 4 * u, y + 4 * u, CW - 8 * u, CW - 8 * u, 14 * u, { fill: '#F5F3FA' });
        txt(card, String(day), { x: x + 14 * u, y: y + 26 * u, 'text-anchor': 'start', 'font-size': 15 * u, fill: '#9A92B8' });
      }
      var posts = [2, 5, 7, 9, 12, 14, 16, 19, 21, 23, 26, 28], vids = [8, 15, 22, 29];
      var cols = [['#FF8A6A', '#F0473A'], ['#FFD27A', '#FF951F'], ['#9DFAD0', '#1FC98A'], ['#C9B6FF', '#7A4DFF'], ['#FFA3DA', '#F23FA0'], ['#9FB6FF', '#1B3FC4']];
      var tiles = [];
      posts.forEach(function (d, i) { var cc = cols[i % cols.length]; tiles.push({ d: d, v: 0, fill: lgrad(root, 'soP' + i, [['0', cc[0]], ['1', cc[1]]]) }); });
      vids.forEach(function (d, i) { tiles.push({ d: d, v: 1, fill: '#1B1530' }); });
      tiles.sort(function (a, b) { return a.d - b.d; });
      tiles.forEach(function (t, i) {
        var c = cells[t.d], g = el('g', {}, root);
        rr(g, -CW / 2 + 8 * u, -CW / 2 + 8 * u, CW - 16 * u, CW - 16 * u, 14 * u, { fill: t.fill });
        if (t.v) { el('path', { d: 'M-10 -14 L 16 0 L -10 14Z', fill: '#FFFFFF', transform: 'scale(' + u + ')' }, g); }
        else { el('circle', { cx: 14 * u, cy: -12 * u, r: 9 * u, fill: '#FFFFFF', opacity: .85 }, g); el('path', { d: 'M-30 26 L -8 0 L 8 14 L 18 6 L 30 26Z', fill: '#FFFFFF', opacity: .7, transform: 'scale(' + u + ')' }, g); }
        t.g = g; t.cx = c.x + CW / 2; t.cy = c.y + CW / 2; t.i = i;
      });
      var chips = el('g', { opacity: 0 }, root);
      [['12 posts', '#F0473A'], ['4 videos', '#1B1530']].forEach(function (c, i) {
        var x = -210 * u + i * 230 * u, y = top + 612 * u;
        rr(chips, x, y, 190 * u, 50 * u, 25 * u, { fill: c[1] });
        txt(chips, c[0], { x: x + 95 * u, y: y + 33 * u, 'font-size': 22 * u, 'font-weight': 600, fill: '#FFFFFF' });
      });
      return function (p) {
        var inT = E.out(seg(p, 0, .1));
        card.setAttribute('transform', 'translate(0,' + (1 - inT) * 40 * u + ')'); card.style.opacity = inT;
        tiles.forEach(function (t) {
          var s = seg(p, .12 + t.i * .028, .2 + t.i * .028), e = s ? E.back(s) : 0;
          t.g.setAttribute('transform', 'translate(' + t.cx + ',' + (t.cy - (1 - E.out(s)) * 80 * u + (1 - inT) * 40 * u) + ') scale(' + (e || .0001) + ')');
          t.g.style.opacity = s ? 1 : 0;
        });
        var ct = seg(p, .68, .76); chips.style.opacity = ct; chips.setAttribute('transform', 'translate(0,' + (1 - E.out(ct)) * 20 * u + ')');
      };
    }
  };

  K.order = K.order.concat(['webdesign', 'redesign', 'localseo', 'gbp', 'aeo', 'brand', 'social']);
})(window.KMotion);
