/* ============================================================================
   KREATED BRAND MOTION — the service set, pass 2 (moments 21–27)
   ----------------------------------------------------------------------------
   One moment per service page; each caption is a heading already on that page.
     webdesign  → /services/web-design/                "A finished site that is live and working"
     redesign   → /services/website-redesign/          "Keep what works, rebuild what doesn't"
     localseo   → /services/local-seo/                 "Four parts that move together"
     gbp        → /services/google-business-profile/   "The panel buyers see before your website"
     aeo        → /services/answer-engine-optimization/"One version of the facts"
     brand      → /services/brand-strategy/            "One mark, everywhere it appears"
     social     → /services/social-media-management/   "Accounts that don't go quiet"
   Pass 1 is kept at brand-motion/versions/services-v1/ (RESTORE.md there).
   🚫 Phone numbers are 555 numbers; business names are "Your Business".
   ========================================================================== */
(function (K) {
  'use strict';
  var el = K.el, seg = K.seg, E = K.E, mark = K.mark, spark = K.spark, drawn = K.drawn, lerp = K.lerp, rng = K.rng, cl = K.cl;
  var cmark = K.cmark, txt = K.txt, star = K.star;
  var M = K.moments;
  var TAU = Math.PI * 2;
  var uid = 0;
  function id(n) { return n + '_' + (++uid); }
  function rr(parent, x, y, w, h, r, a) { return el('rect', Object.assign({ x: x, y: y, width: w, height: h, rx: r }, a || {}), parent); }
  function flat(parent, fill, x, y, s, a) { var g = el('g', Object.assign({ transform: 'translate(' + x + ',' + y + ') scale(' + s + ') translate(-300,-318)' }, a || {}), parent);
    el('use', { href: '#kR', fill: fill }, g); el('use', { href: '#kL', fill: fill }, g); return g; }
  function defsOf(root) { return root.ownerSVGElement.querySelector('defs'); }
  function lgrad(root, name, stops, a) { var i = id(name); var g = el('linearGradient', Object.assign({ id: i, x1: 0, y1: 0, x2: 1, y2: 1 }, a || {}), defsOf(root));
    stops.forEach(function (s) { el('stop', { offset: s[0], 'stop-color': s[1], 'stop-opacity': s[2] == null ? 1 : s[2] }, g); }); return 'url(#' + i + ')'; }
  function clip(root, name) { var i = id(name); var c = el('clipPath', { id: i }, defsOf(root)); return { id: i, el: c, url: 'url(#' + i + ')' }; }
  function setR(e, x, y, w, h) { e.setAttribute('x', x); e.setAttribute('y', y); e.setAttribute('width', Math.max(0, w)); e.setAttribute('height', Math.max(0, h)); }
  function bump(p, c, w) { var d = (p - c) / w; return Math.exp(-d * d); }

  /* 21 · WEB DESIGN — a wireframe draws itself, inks in, then the desktop layout reflows into the phone, block by block */
  M.webdesign = {
    title: 'Web Design', page: '/services/web-design/', dur: 9000, cap: [.8, .94],
    bg: 'radial-gradient(80% 70% at 50% 40%, #FFFFFF 0%, #F1F2F5 55%, #E0E3EA 100%)', ink: '#15181D', accent: '#E0473A', wm: '#8A90A0',
    line: 'A finished site that is <em>live and working.</em>',
    build: function (root, u) {
      var hero = lgrad(root, 'wdHero', [['0', '#FF8A6A'], ['.55', '#F0473A'], ['1', '#7A1F3A']]);
      /* frame: desktop 760×500 → phone 250×500, both centred */
      var D = { x: -380, y: -270, w: 760, h: 500, r: 20 }, P = { x: -125, y: -270, w: 250, h: 500, r: 38 };
      /* [desktop rect], [phone rect], fill, kind */
      var B = [
        [[24, 58, 26, 26, 6], [18, 42, 22, 22, 6], '#15181D', 'logo'],
        [[510, 66, 50, 10, 5], [196, 44, 32, 5, 2], '#15181D'],
        [[576, 66, 50, 10, 5], [196, 55, 32, 5, 2], '#15181D'],
        [[642, 60, 94, 22, 11], [16, 446, 218, 38, 19], '#E0473A', 'cta'],
        [[420, 104, 310, 214, 16], [16, 80, 218, 128, 14], hero, 'img'],
        [[30, 118, 330, 28, 6], [16, 224, 196, 20, 5], '#15181D'],
        [[30, 158, 250, 28, 6], [16, 250, 150, 20, 5], '#15181D'],
        [[30, 206, 290, 11, 5], [16, 282, 206, 8, 4], '#9098A8'],
        [[30, 226, 240, 11, 5], [16, 296, 170, 8, 4], '#9098A8'],
        [[30, 262, 160, 46, 23], [16, 316, 124, 34, 17], '#E0473A'],
        [[30, 346, 220, 120, 14], [16, 366, 105, 66, 12], '#FFE3C2'],
        [[270, 346, 220, 120, 14], [129, 366, 105, 66, 12], '#CFF5E4'],
        [[510, 346, 220, 120, 14], [250, 366, 0, 66, 12], '#E4DAFF', 'drop']
      ];
      var ghost = rr(root, D.x * u, D.y * u, D.w * u, D.h * u, D.r * u, { fill: 'none', stroke: '#9098A8', 'stroke-width': 2 * u, 'stroke-dasharray': (8 * u) + ' ' + (8 * u), opacity: 0 });
      var shadow = rr(root, 0, 0, 0, 0, 0, { fill: '#000', opacity: .07 });
      var frame = rr(root, 0, 0, 0, 0, 0, { fill: '#FFFFFF', stroke: '#15181D' });
      var bar = rr(root, 0, 0, 0, 0, 0, { fill: '#F1F2F5' });
      var dots = [0, 1, 2].map(function (i) { return el('circle', { r: 5 * u, fill: ['#FF6B5A', '#FFB23F', '#3DDC97'][i] }, root); });
      var parts = B.map(function (b) {
        var sk = rr(root, (D.x + b[0][0]) * u, (D.y + b[0][1]) * u, b[0][2] * u, b[0][3] * u, b[0][4] * u, { fill: 'none', stroke: '#6A7080', 'stroke-width': 2 * u });
        var L = drawn(sk);
        var ink = rr(root, 0, 0, 0, 0, 0, { fill: b[2], opacity: 0 });
        var o = { b: b, sk: sk, L: L, ink: ink };
        if (b[3] === 'img' || b[3] === 'logo') o.k = flat(root, '#FFFFFF', 0, 0, 1, { opacity: 0 });
        if (b[3] === 'cta') o.t = txt(root, 'Call now', { 'font-size': 15 * u, 'font-weight': 600, fill: '#FFFFFF', opacity: 0 });
        return o;
      });
      var tap = el('circle', { r: 0, fill: '#E0473A', opacity: 0 }, root);
      var live = el('g', { opacity: 0 }, root);
      rr(live, 150 * u, -318 * u, 196 * u, 40 * u, 20 * u, { fill: '#FFFFFF', stroke: '#DDE1E8', 'stroke-width': 2 * u });
      var liveDot = el('circle', { cx: 172 * u, cy: -298 * u, r: 6 * u, fill: '#1FC98A' }, live);
      txt(live, 'yourbusiness.com', { x: 262 * u, y: -292 * u, 'font-size': 15 * u, 'font-weight': 600, fill: '#15181D' });
      return function (p) {
        var inT = E.out(seg(p, 0, .06));
        /* the reflow: each block leaves on its own beat, so the layout pours rather than jumps */
        var mf = E.inOut(seg(p, .5, .66));
        var fx = lerp(D.x, P.x, mf), fy = D.y, fw = lerp(D.w, P.w, mf), fh = D.h, frr = lerp(D.r, P.r, mf);
        setR(frame, fx * u, fy * u, fw * u, fh * u); frame.setAttribute('rx', frr * u);
        frame.setAttribute('stroke-width', lerp(2, 9, mf) * u);
        setR(shadow, (fx + 8) * u, (fy + 12) * u, fw * u, fh * u); shadow.setAttribute('rx', frr * u);
        frame.style.opacity = shadow.style.opacity = inT;
        /* browser bar → phone notch */
        setR(bar, lerp(fx, fx + fw / 2 - 32, mf) * u, lerp(fy, fy + 12, mf) * u, lerp(fw, 64, mf) * u, lerp(40, 16, mf) * u);
        bar.setAttribute('rx', lerp(18, 8, mf) * u); bar.setAttribute('fill', mf > .5 ? '#15181D' : '#F1F2F5'); bar.style.opacity = inT;
        dots.forEach(function (d, i) { d.setAttribute('cx', (fx + 22 + i * 18) * u); d.setAttribute('cy', (fy + 20) * u); d.style.opacity = inT * (1 - seg(mf, 0, .3)); });
        /* the wireframe draws itself slowly, one block after another; no pencil */
        var sk = seg(p, .04, .32), n = parts.length;
        parts.forEach(function (o, i) {
          var b = o.b;
          var t = E.inOut(seg(sk, i / n * .7, i / n * .7 + .3));
          o.sk.style.strokeDashoffset = o.L * (1 - t);
          o.sk.style.opacity = 1 - seg(p, .36, .44);
          var it = E.out(seg(p, .32 + i * .012, .4 + i * .012));
          var m = E.inOut(seg(p, .5 + i * .008, .62 + i * .008));
          var q = [0, 1, 2, 3, 4].map(function (k) { return lerp(b[0][k], b[1][k], m); });
          setR(o.ink, (fx + q[0]) * u, (fy + q[1]) * u, q[2] * u, q[3] * u); o.ink.setAttribute('rx', q[4] * u);
          o.ink.style.opacity = it * (b[3] === 'drop' ? 1 - seg(m, .3, .7) : 1);
          if (o.k) {
            var s = b[3] === 'img' ? lerp(.3, .17, m) : lerp(.052, .044, m);
            o.k.setAttribute('transform', 'translate(' + (fx + q[0] + q[2] / 2) * u + ',' + (fy + q[1] + q[3] / 2 + (b[3] === 'img' ? 6 : 1)) * u + ') scale(' + s * u + ') translate(-300,-318)');
            o.k.style.opacity = seg(p, .4, .46);
          }
          if (o.t) { o.t.setAttribute('x', (fx + q[0] + q[2] / 2) * u); o.t.setAttribute('y', (fy + q[1] + q[3] / 2 + 5) * u); o.t.style.opacity = seg(m, .7, 1); }
          if (b[3] === 'cta') o.cta = [(fx + q[0] + q[2] / 2) * u, (fy + q[1] + q[3] / 2) * u];
        });
        ghost.style.opacity = seg(p, .58, .68) * .8;
        var tt = seg(p, .74, .84), c = parts[3].cta;
        tap.setAttribute('cx', c[0]); tap.setAttribute('cy', c[1]); tap.setAttribute('r', 80 * u * E.out(tt)); tap.style.opacity = tt > 0 ? (1 - tt) * .4 : 0;
        var lt = seg(p, .68, .76); live.style.opacity = lt; live.setAttribute('transform', 'translate(0,' + (1 - E.out(lt)) * 14 * u + ')');
        liveDot.setAttribute('r', 6 * u * (1 + .5 * Math.max(0, Math.sin((p - .68) * 40))));
      };
    }
  };

  /* 22 · REDESIGN — a before/after slider across one site: a tired template becomes the new site, and what was kept sits in the same place on both */
  M.redesign = {
    title: 'Website Redesign', page: '/services/website-redesign/', dur: 8500, cap: [.78, .93],
    bg: 'radial-gradient(70% 60% at 50% 42%, #1E2128 0%, #111318 60%, #0A0B0E 100%)', accent: '#5BF0B0', wm: '#6E7384',
    line: 'Keep what works, <em>rebuild what doesn’t.</em>',
    build: function (root, u) {
      var W = 760 * u, H = 500 * u, x0 = -W / 2, y0 = -H / 2 - 20 * u;
      var cOld = clip(root, 'rdOld'), cNew = clip(root, 'rdNew');
      var rOld = rr(cOld.el, x0, y0, W, H, 0), rNew = rr(cNew.el, x0, y0, 0, H, 0);
      var frameC = clip(root, 'rdFrame'); rr(frameC.el, x0, y0, W, H, 20 * u);
      var shell = el('g', {}, root);
      rr(shell, x0 + 8 * u, y0 + 12 * u, W, H, 20 * u, { fill: '#000', opacity: .35 });
      var site = el('g', { 'clip-path': frameC.url }, shell);
      /* OLD: a tired template, not a joke: slate header, grey stock photo, cramped grey text, a small blue button */
      var old = el('g', { 'clip-path': cOld.url }, site);
      rr(old, x0, y0, W, H, 0, { fill: '#EDEDEB' });
      rr(old, x0, y0, W, 100 * u, 0, { fill: '#5B6B7A' });
      ['Home', 'About', 'Services', 'Contact'].forEach(function (n, i) { txt(old, n, { x: x0 + 300 * u + i * 62 * u, y: y0 + 72 * u, 'font-size': 13 * u, fill: '#D5DCE3' }); });
      rr(old, x0 + 30 * u, y0 + 122 * u, 300 * u, 190 * u, 2 * u, { fill: '#C9CCD1' });
      el('path', { d: 'M' + (x0 + 60 * u) + ' ' + (y0 + 290 * u) + ' L ' + (x0 + 140 * u) + ' ' + (y0 + 200 * u) + ' L ' + (x0 + 200 * u) + ' ' + (y0 + 260 * u) + ' L ' + (x0 + 240 * u) + ' ' + (y0 + 225 * u) + ' L ' + (x0 + 300 * u) + ' ' + (y0 + 290 * u) + 'Z', fill: '#B3B8BF' }, old);
      el('circle', { cx: x0 + 260 * u, cy: y0 + 170 * u, r: 18 * u, fill: '#B3B8BF' }, old);
      rr(old, x0 + 360 * u, y0 + 130 * u, 300 * u, 16 * u, 2 * u, { fill: '#4A5058' });
      rr(old, x0 + 360 * u, y0 + 154 * u, 210 * u, 16 * u, 2 * u, { fill: '#4A5058' });
      for (var j = 0; j < 7; j++) rr(old, x0 + 360 * u, y0 + (186 + j * 13) * u, (360 - (j % 3) * 30) * u, 6 * u, 1 * u, { fill: '#A4A9B0' });
      rr(old, x0 + 360 * u, y0 + 286 * u, 104 * u, 28 * u, 3 * u, { fill: '#3E7CB1' });
      txt(old, 'Click Here', { x: x0 + 412 * u, y: y0 + 305 * u, 'font-size': 13 * u, fill: '#FFFFFF' });
      for (var cc2 = 0; cc2 < 3; cc2++) for (var j2 = 0; j2 < 5; j2++) rr(old, x0 + 30 * u + cc2 * 236 * u, y0 + (404 + j2 * 13) * u, (200 - (j2 % 2) * 40) * u, 6 * u, 1 * u, { fill: '#B7BBC1' });
      /* NEW: navy, a real hero, a real button */
      var nw = el('g', { 'clip-path': cNew.url }, site);
      rr(nw, x0, y0, W, H, 0, { fill: lgrad(root, 'rdBg', [['0', '#16204A'], ['1', '#0B1030']]) });
      rr(nw, x0 + 30 * u, y0 + 130 * u, 330 * u, 28 * u, 6 * u, { fill: '#FFFFFF' });
      rr(nw, x0 + 30 * u, y0 + 170 * u, 250 * u, 28 * u, 6 * u, { fill: '#FFFFFF' });
      rr(nw, x0 + 30 * u, y0 + 216 * u, 280 * u, 10 * u, 5 * u, { fill: '#8C97C8' });
      rr(nw, x0 + 30 * u, y0 + 234 * u, 230 * u, 10 * u, 5 * u, { fill: '#8C97C8' });
      rr(nw, x0 + 30 * u, y0 + 264 * u, 170 * u, 46 * u, 23 * u, { fill: '#E0473A' });
      txt(nw, 'Get a quote', { x: x0 + 115 * u, y: y0 + 293 * u, 'font-size': 17 * u, 'font-weight': 600, fill: '#FFFFFF' });
      rr(nw, x0 + 400 * u, y0 + 110 * u, 330 * u, 220 * u, 18 * u, { fill: lgrad(root, 'rdImg', [['0', '#6E8FFF'], ['1', '#7A4DFF']]) });
      flat(nw, '#FFFFFF', x0 + 565 * u, y0 + 226 * u, .3 * u);
      [0, 1, 2].forEach(function (k) { rr(nw, x0 + 30 * u + k * 236 * u, y0 + 400 * u, 220 * u, 80 * u, 14 * u, { fill: '#1E2A5E' }); });
      /* KEPT: drawn once, over both halves; colour follows the side it sits on */
      var kept = [
        { x: x0 + 24 * u, y: y0 + 50 * u, w: 210 * u, h: 34 * u },
        { x: x0 + W - 230 * u, y: y0 + 50 * u, w: 206 * u, h: 34 * u },
        { x: x0 + 24 * u, y: y0 + 340 * u, w: 250 * u, h: 34 * u }
      ];
      var kg = el('g', {}, site);
      /* the name and the number are white on both sides: they were kept, so they look the same */
      flat(kg, '#FFFFFF', x0 + 44 * u, y0 + 67 * u, .06 * u); txt(kg, 'Your Business', { x: x0 + 66 * u, y: y0 + 74 * u, 'text-anchor': 'start', 'font-size': 21 * u, 'font-weight': 600, fill: '#FFFFFF' });
      txt(kg, '(910) 555-0142', { x: x0 + W - 36 * u, y: y0 + 74 * u, 'text-anchor': 'end', 'font-size': 20 * u, 'font-weight': 600, fill: '#FFFFFF' });
      var stars = [];
      for (var s = 0; s < 5; s++) stars.push(el('path', { d: star(10 * u, 4.5 * u), fill: '#E6A700', transform: 'translate(' + (x0 + 42 * u + s * 24 * u) + ',' + (y0 + 356 * u) + ')' }, kg));
      var revT = txt(kg, 'Your reviews', { x: x0 + 168 * u, y: y0 + 362 * u, 'text-anchor': 'start', 'font-size': 16 * u, 'font-weight': 600, fill: '#3A3F46' });
      var outlines = kept.map(function (k) { return rr(shell, k.x - 6 * u, k.y - 6 * u, k.w + 12 * u, k.h + 12 * u, 10 * u, { fill: 'none', stroke: '#5BF0B0', 'stroke-width': 3 * u, opacity: 0 }); });
      var tags = kept.map(function (k) {
        var g = el('g', { opacity: 0 }, shell), tx = k.x + k.w - 70 * u, ty = k.y + k.h + 12 * u;
        rr(g, tx, ty, 76 * u, 26 * u, 13 * u, { fill: '#5BF0B0' });
        txt(g, 'KEPT', { x: tx + 38 * u, y: ty + 18 * u, 'font-size': 13 * u, 'font-weight': 700, 'letter-spacing': 1.5 * u, fill: '#06281B' });
        return g;
      });
      var handle = el('g', {}, shell);
      rr(handle, -2 * u, y0 - 16 * u, 4 * u, H + 32 * u, 2 * u, { fill: '#FFFFFF' });
      el('circle', { cx: 0, cy: y0 + H / 2, r: 26 * u, fill: '#FFFFFF' }, handle);
      el('path', { d: 'M-8 -8 L -16 0 L -8 8 M 8 -8 L 16 0 L 8 8', stroke: '#15181D', 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round', transform: 'translate(0,' + (y0 + H / 2) + ') scale(' + u + ')' }, handle);
      var lab = [txt(shell, 'AFTER', { x: x0 + 62 * u, y: y0 + H + 44 * u, 'font-size': 15 * u, 'font-weight': 700, 'letter-spacing': 3 * u, fill: '#5BF0B0', opacity: 0 }),
        txt(shell, 'BEFORE', { x: x0 + W - 70 * u, y: y0 + H + 44 * u, 'font-size': 15 * u, 'font-weight': 700, 'letter-spacing': 3 * u, fill: '#6E7384', opacity: 0 })];
      return function (p) {
        var inT = E.out(seg(p, 0, .08));
        shell.setAttribute('transform', 'translate(0,' + (1 - inT) * 40 * u + ')'); shell.style.opacity = inT;
        /* the slider: starts at the left edge (all old), sweeps right revealing the new, then settles in the middle */
        var a = E.inOut(seg(p, .16, .48)), b = E.inOut(seg(p, .52, .64));
        var hx = lerp(lerp(x0, x0 + W, a), 0, b);
        handle.setAttribute('transform', 'translate(' + hx + ',0)'); handle.style.opacity = seg(p, .12, .16);
        setR(rOld, hx, y0, x0 + W - hx, H); setR(rNew, x0, y0, hx - x0, H);
        var sS = x0 + 140 * u < hx;
        revT.setAttribute('fill', sS ? '#DCE4FF' : '#3A3F46');
        stars.forEach(function (st) { st.setAttribute('fill', sS ? '#F5B82E' : '#C9A227'); });
        outlines.forEach(function (o, i) { o.style.opacity = seg(p, .66 + i * .03, .72 + i * .03); });
        tags.forEach(function (g, i) { var t = seg(p, .68 + i * .03, .74 + i * .03); g.style.opacity = t; g.setAttribute('transform', 'translate(0,' + (1 - E.back(t)) * 10 * u + ')'); });
        lab.forEach(function (l) { l.style.opacity = seg(p, .6, .66); });
      };
    }
  };

  /* 23 · LOCAL SEO — four parts drawn as one mechanism: a technical drawing of meshing gears, each part labelled */
  function gearPath(Rp, N, a) {
    var d = '', add = a || 14, ro = Rp + add, ri = Rp - add;
    for (var i = 0; i < N; i++) {
      var c = i * TAU / N, w = TAU / N;
      [[ri, c - w * .5], [ri, c - w * .26], [ro, c - w * .15], [ro, c + w * .15], [ri, c + w * .26]].forEach(function (q, k) {
        d += (i === 0 && k === 0 ? 'M' : 'L') + (Math.cos(q[1]) * q[0]).toFixed(2) + ' ' + (Math.sin(q[1]) * q[0]).toFixed(2); });
    }
    return d + 'Z';
  }
  M.localseo = {
    title: 'Local SEO', page: '/services/local-seo/', dur: 8000, cap: [.76, .92],
    bg: 'linear-gradient(180deg, #F6F7F9 0%, #ECEEF2 100%)', ink: '#15181D', accent: '#D9661F', wm: '#8A90A0',
    line: 'Four parts that <em>move together.</em>',
    build: function (root, u) {
      /* a technical drawing, not a glow: grid paper, flat colour, ink lines, callouts */
      var R1 = 180, N1 = 18, R2 = 120, N2 = 12, CD = R1 + R2, INK = '#15181D', PAPER = '#F2F3F6';
      var grid = el('g', {}, root);
      for (var i = -25; i <= 25; i++) {
        var c = i % 5 ? '#E4E7EC' : '#D6DAE1';
        el('line', { x1: i * 40 * u, y1: -1000 * u, x2: i * 40 * u, y2: 1000 * u, stroke: c, 'stroke-width': 1 * u }, grid);
        el('line', { x1: -1000 * u, y1: i * 40 * u, x2: 1000 * u, y2: i * 40 * u, stroke: c, 'stroke-width': 1 * u }, grid);
      }
      var parts = [
        ['Google Business', 'Profile', '#FFB23F', 225], ['Service and', 'location pages', '#1FC98A', 315],
        ['The site', 'itself', '#F0473A', 135], ['Measurement', '', '#7A4DFF', 45]
      ];
      function arrow(parent, r, a0, a1, dir) {
        var p0 = [Math.cos(a0) * r, Math.sin(a0) * r], p1 = [Math.cos(a1) * r, Math.sin(a1) * r];
        var g = el('g', {}, parent);
        el('path', { d: 'M' + p0[0] + ' ' + p0[1] + ' A ' + r + ' ' + r + ' 0 0 ' + (a1 > a0 ? 1 : 0) + ' ' + p1[0] + ' ' + p1[1], fill: 'none', stroke: INK, 'stroke-width': 2.2 * u, 'stroke-linecap': 'round' }, g);
        var t = a1 + (a1 > a0 ? Math.PI / 2 : -Math.PI / 2), h = 9 * u;
        el('path', { d: 'M' + (p1[0] + Math.cos(t + 2.6) * h) + ' ' + (p1[1] + Math.sin(t + 2.6) * h) + ' L ' + p1[0] + ' ' + p1[1] + ' L ' + (p1[0] + Math.cos(t - 2.6) * h) + ' ' + (p1[1] + Math.sin(t - 2.6) * h), fill: 'none', stroke: INK, 'stroke-width': 2.2 * u, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
        return g;
      }
      var G = parts.map(function (q) {
        var a = q[3] * Math.PI / 180, cx = Math.cos(a) * CD * u, cy = Math.sin(a) * CD * u;
        var g = el('g', {}, root), spin = el('g', {}, g);
        el('path', { d: gearPath(R2, N2), fill: q[2], stroke: INK, 'stroke-width': 2.5, 'stroke-linejoin': 'round', transform: 'scale(' + u + ')' }, spin);
        /* an open wheel with four spokes, the way a drawn gear is built */
        el('circle', { r: 82 * u, fill: PAPER, stroke: INK, 'stroke-width': 2.2 * u }, spin);
        [0, 1, 2, 3].forEach(function (k) { rr(spin, -8 * u, -84 * u, 16 * u, 84 * u, 2 * u, { fill: q[2], stroke: INK, 'stroke-width': 2.2 * u, transform: 'rotate(' + (k * 90 + 45) + ')' }); });
        el('circle', { r: 26 * u, fill: q[2], stroke: INK, 'stroke-width': 2.5 * u }, spin);
        el('circle', { r: 7 * u, fill: INK }, spin);
        /* direction arrow on the outside of the gear: the small gears turn against the centre */
        var out = Math.atan2(cy, cx);
        var arr = arrow(g, (R2 + 34) * u, out + .45, out - .15, -1); arr.style.opacity = 0;
        /* callout: a dot on the rim, a leader, the name */
        var up = cy < 0, ly = cy + (up ? -178 : 178) * u, rim = cy + (up ? -(R2 + 16) : (R2 + 16)) * u;
        var lead = el('path', { d: 'M' + cx + ' ' + rim + ' L ' + cx + ' ' + (ly + (up ? 30 : -34) * u), stroke: INK, 'stroke-width': 1.6 * u, fill: 'none' }, root);
        var dot = el('circle', { cx: cx, cy: rim, r: 4.5 * u, fill: INK, opacity: 0 }, root);
        var lab = el('g', { opacity: 0 }, root);
        txt(lab, q[0], { x: cx, y: ly + (up && q[1] ? -14 * u : 0), 'font-size': 24 * u, 'font-weight': 600, fill: INK });
        if (q[1]) txt(lab, q[1], { x: cx, y: ly + (up ? 16 * u : 30 * u), 'font-size': 24 * u, 'font-weight': 600, fill: INK });
        return { g: g, spin: spin, lab: lab, lead: lead, L: drawn(lead), dot: dot, arr: arr, cx: cx, cy: cy, phi: q[3], a: a };
      });
      var cg = el('g', {}, root), cs = el('g', {}, cg);
      var cOut = el('path', { d: gearPath(R1, N1), fill: INK, 'fill-opacity': 0, stroke: INK, 'stroke-width': 2.5, 'stroke-linejoin': 'round', transform: 'scale(' + u + ')' }, cs);
      var cL = drawn(cOut);
      el('circle', { r: (R1 - 14) * u, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 1 * u, 'stroke-dasharray': (6 * u) + ' ' + (5 * u), opacity: .3 }, cs);
      var kg = el('g', { opacity: 0 }, cg);
      flat(kg, '#FFFFFF', 0, 2 * u, .5 * u);
      var carr = arrow(cg, (R1 + 36) * u, -2.2, -1.5, 1); carr.style.opacity = 0;
      return function (p) {
        /* the centre gear is drawn, then filled; the four slide in along their axes and mesh */
        cOut.style.strokeDashoffset = cL * (1 - E.inOut(seg(p, .02, .16)));
        cOut.setAttribute('fill-opacity', E.out(seg(p, .14, .2)));
        kg.style.opacity = seg(p, .18, .23);
        var run = seg(p, .42, 1), th = (run * run * .5 + run * .5) * 230;
        cs.setAttribute('transform', 'rotate(' + th + ')');
        G.forEach(function (g, i) {
          var t = E.out(seg(p, .16 + i * .05, .3 + i * .05)), d = lerp(1.9, 1, t);
          g.g.setAttribute('transform', 'translate(' + g.cx * d + ',' + g.cy * d + ')');
          g.g.style.opacity = seg(p, .16 + i * .05, .2 + i * .05);
          g.spin.setAttribute('transform', 'rotate(' + (g.phi + 180 + 180 / N2 - (th - g.phi) * N1 / N2) + ')');
          var lt = seg(p, .36 + i * .04, .46 + i * .04);
          g.lead.style.strokeDashoffset = g.L * (1 - E.inOut(lt)); g.dot.style.opacity = lt > 0 ? 1 : 0;
          g.lab.style.opacity = E.out(seg(p, .42 + i * .04, .5 + i * .04));
          g.arr.style.opacity = seg(p, .56, .62);
        });
        carr.style.opacity = seg(p, .56, .62);
      };
    }
  };

  /* 24 · GOOGLE BUSINESS PROFILE — a search, the listing assembling under it, then the page's three verbs stamped on */
  M.gbp = {
    title: 'Google Business Profile', page: '/services/google-business-profile/', dur: 9000, cap: [.78, .93],
    bg: 'radial-gradient(75% 65% at 50% 42%, #134541 0%, #0B2C29 55%, #061917 100%)', accent: '#7CF2DC', wm: '#5E8A84',
    line: 'The panel buyers see <em>before your website.</em>',
    build: function (root, u) {
      var S = .84, OY = 70 * u;
      var PW = 580 * u, PH = 800 * u, px = -PW / 2, py = -PH / 2 - 10 * u;
      var g1 = lgrad(root, 'gbA', [['0', '#FFB36B'], ['1', '#E0473A']]), g1b = lgrad(root, 'gbA2', [['0', '#FFD27A'], ['1', '#FF951F']]),
        g2 = lgrad(root, 'gbB', [['0', '#8FF0C8'], ['1', '#1FA374']]), g3 = lgrad(root, 'gbC', [['0', '#B9A2FF'], ['1', '#5A33D6']]);
      /* the search that summons it */
      var sb = el('g', {}, root);
      rr(sb, -250 * u, -392 * u, 500 * u, 58 * u, 29 * u, { fill: '#FFFFFF' });
      el('circle', { cx: -214 * u, cy: -365 * u, r: 11 * u, fill: 'none', stroke: '#5F6570', 'stroke-width': 3 * u }, sb);
      el('line', { x1: -206 * u, y1: -357 * u, x2: -197 * u, y2: -348 * u, stroke: '#5F6570', 'stroke-width': 3 * u, 'stroke-linecap': 'round' }, sb);
      var q = txt(sb, '', { x: -180 * u, y: -356 * u, 'text-anchor': 'start', 'font-size': 22 * u, fill: '#15181D' });
      var caret = rr(sb, 0, -378 * u, 2 * u, 26 * u, 1, { fill: '#1A73E8' });
      var Q = 'home services near me';
      var card = el('g', {}, root), inner = el('g', { transform: 'translate(0,' + OY + ') scale(' + S + ')' }, card);
      rr(inner, px + 8 * u, py + 14 * u, PW, PH, 30 * u, { fill: '#000', opacity: .25 });
      rr(inner, px, py, PW, PH, 30 * u, { fill: '#FFFFFF' });
      var cc = clip(root, 'gbClip'); rr(cc.el, px, py, PW, PH, 30 * u);
      var SK = [], RL = [];
      var photos = el('g', { 'clip-path': cc.url }, inner);
      SK.push(rr(photos, px, py, PW, 230 * u, 0, { fill: '#E8EBEF' }));
      var ph = el('g', {}, photos); RL.push(ph);
      var bigC = clip(root, 'gbBig'); rr(bigC.el, px, py, PW * .62 - 3 * u, 230 * u, 0);
      var big = el('g', { 'clip-path': bigC.url }, ph);
      var slide = el('g', {}, big);
      rr(slide, px, py, PW * .62 - 3 * u, 230 * u, 0, { fill: g1 });
      el('path', { d: 'M' + (px + 70 * u) + ' ' + (py + 175 * u) + ' L ' + (px + 70 * u) + ' ' + (py + 118 * u) + ' L ' + (px + 170 * u) + ' ' + (py + 64 * u) + ' L ' + (px + 270 * u) + ' ' + (py + 118 * u) + ' L ' + (px + 270 * u) + ' ' + (py + 175 * u) + 'Z', fill: '#FFF3E6', opacity: .92 }, slide);
      rr(slide, px + 150 * u, py + 128 * u, 40 * u, 47 * u, 4 * u, { fill: '#A3202A' });
      var slide2 = el('g', {}, big);
      rr(slide2, px, py, PW * .62 - 3 * u, 230 * u, 0, { fill: g1b });
      el('circle', { cx: px + 120 * u, cy: py + 90 * u, r: 36 * u, fill: '#FFF3E6', opacity: .9 }, slide2);
      el('path', { d: 'M' + px + ' ' + (py + 230 * u) + ' L ' + (px + 110 * u) + ' ' + (py + 140 * u) + ' L ' + (px + 190 * u) + ' ' + (py + 200 * u) + ' L ' + (px + 260 * u) + ' ' + (py + 150 * u) + ' L ' + (px + PW * .62) + ' ' + (py + 230 * u) + 'Z', fill: '#B8500B', opacity: .75 }, slide2);
      rr(ph, px + PW * .62 + 3 * u, py, PW * .38, 113 * u, 0, { fill: g2 });
      rr(ph, px + PW * .62 + 3 * u, py + 117 * u, PW * .38, 113 * u, 0, { fill: g3 });
      flat(ph, '#FFFFFF', px + PW * .81, py + 60 * u, .12 * u, { opacity: .9 });
      var dotsP = [0, 1].map(function (i) { return el('circle', { cx: px + PW * .31 - 8 * u + i * 16 * u, cy: py + 212 * u, r: 4 * u, fill: '#FFFFFF' }, ph); });
      var y = py + 272 * u, L = px + 34 * u;
      SK.push(rr(inner, L, y - 28 * u, 300 * u, 30 * u, 8 * u, { fill: '#E8EBEF' }));
      RL.push(txt(inner, 'Your Business', { x: L, y: y, 'text-anchor': 'start', 'font-size': 36 * u, 'font-weight': 600, fill: '#15181D' }));
      y += 46 * u;
      SK.push(rr(inner, L, y - 20 * u, 240 * u, 22 * u, 8 * u, { fill: '#E8EBEF' }));
      var sg = el('g', {}, inner); RL.push(sg);
      for (var i = 0; i < 5; i++) el('path', { d: star(12 * u, 5.4 * u), fill: '#F5B82E', transform: 'translate(' + (L + 12 * u + i * 28 * u) + ',' + (y - 8 * u) + ')' }, sg);
      txt(sg, 'Reviews', { x: L + 152 * u, y: y, 'text-anchor': 'start', 'font-size': 20 * u, fill: '#1A73E8' });
      y += 38 * u;
      SK.push(rr(inner, L, y - 20 * u, 330 * u, 22 * u, 8 * u, { fill: '#E8EBEF' }));
      RL.push(txt(inner, 'Home services · Wilmington, NC', { x: L, y: y, 'text-anchor': 'start', 'font-size': 20 * u, fill: '#5F6570' }));
      y += 38 * u;
      SK.push(rr(inner, L, y - 20 * u, 260 * u, 22 * u, 8 * u, { fill: '#E8EBEF' }));
      var hr = el('g', {}, inner); RL.push(hr);
      var op = el('text', { x: L, y: y, 'font-family': K.FONT, 'font-size': 20 * u, 'font-weight': 600, fill: '#188038' }, hr); op.textContent = 'Open';
      txt(hr, '· Closes 6 PM', { x: L + 58 * u, y: y, 'text-anchor': 'start', 'font-size': 20 * u, fill: '#5F6570' });
      y += 52 * u;
      var btn0 = null;
      [['Call', 'M-9 -9 C -9 3, 3 9, 9 9 L 9 4 L 4 2 L 2 5 C -2 3, -3 2, -5 -2 L -2 -4 L -4 -9Z'], ['Directions', 'M0 -11 L 11 0 L 0 11 L -11 0Z M-4 3 L -4 -1 L 2 -1 L 2 -4 L 6 0 L 2 4 L 2 1 L -2 1 L -2 3Z'], ['Website', 'M0 -10 A 10 10 0 1 0 0.01 -10Z M-10 0 L 10 0 M0 -10 C -5 -4, -5 4, 0 10 C 5 4, 5 -4, 0 -10']]
        .forEach(function (b, i) {
          var bx = L + 44 * u + i * 150 * u;
          SK.push(el('circle', { cx: bx, cy: y + 34 * u, r: 32 * u, fill: '#E8EBEF' }, inner));
          var gb = el('g', {}, inner); RL.push(gb);
          el('circle', { cx: bx, cy: y + 34 * u, r: 32 * u, fill: '#E6F4F1' }, gb);
          el('path', { d: b[1], fill: i === 2 ? 'none' : '#0E7C6B', stroke: i === 2 ? '#0E7C6B' : 'none', 'stroke-width': 2, 'fill-rule': 'evenodd', transform: 'translate(' + bx + ',' + (y + 34 * u) + ') scale(' + 1.5 * u + ')' }, gb);
          txt(gb, b[0], { x: bx, y: y + 96 * u, 'font-size': 18 * u, 'font-weight': 500, fill: '#0E7C6B' });
          if (!i) btn0 = [bx * S, (y + 34 * u) * S + OY];
        });
      y += 128 * u;
      SK.push(rr(inner, L, y, PW - 68 * u, 130 * u, 16 * u, { fill: '#E8EBEF' }));
      var map = el('g', {}, inner); RL.push(map);
      rr(map, L, y, PW - 68 * u, 130 * u, 16 * u, { fill: '#E3F1EA' });
      var mc = clip(root, 'gbMap'); rr(mc.el, L, y, PW - 68 * u, 130 * u, 16 * u);
      var roads = el('g', { 'clip-path': mc.url, stroke: '#FFFFFF', 'stroke-width': 8 * u }, map);
      [[-40, 70, 600, 30], [0, 130, 600, 90], [140, 0, 200, 160], [330, 0, 380, 160]].forEach(function (r) { el('line', { x1: L + r[0] * u, y1: y + r[1] * u, x2: L + r[2] * u, y2: y + r[3] * u }, roads); });
      el('path', { d: 'M' + (L + 380 * u) + ' ' + y + ' C ' + (L + 420 * u) + ' ' + (y + 50 * u) + ', ' + (L + 470 * u) + ' ' + (y + 60 * u) + ', ' + (L + 520 * u) + ' ' + (y + 130 * u), stroke: '#A9D8F0', 'stroke-width': 26 * u, fill: 'none', 'clip-path': mc.url }, map);
      el('path', { d: 'M' + (L + 250 * u) + ' ' + (y + 78 * u) + ' l -12 -22 l 24 0Z', fill: '#E0473A' }, map);
      el('circle', { cx: L + 250 * u, cy: y + 50 * u, r: 16 * u, fill: '#E0473A' }, map);
      flat(map, '#FFFFFF', L + 250 * u, y + 51 * u, .05 * u);
      var shC = el('g', { 'clip-path': cc.url }, inner);
      var shim = rr(shC, px - 200 * u, py, 160 * u, PH, 0, { fill: '#FFFFFF', opacity: .55, transform: 'skewX(-20)' });
      var stamps = [['CREATED', 150, -150, -9], ['CLAIMED', 175, -30, -4], ['CORRECTED', 150, 90, -11]].map(function (s) {
        var g = el('g', { opacity: 0 }, root);
        var w = (s[0].length * 17 + 44) * u;
        rr(g, -w / 2, -30 * u, w, 60 * u, 12 * u, { fill: '#FFFFFF', 'fill-opacity': .85, stroke: '#0E7C6B', 'stroke-width': 5 * u });
        rr(g, -w / 2 + 7 * u, -23 * u, w - 14 * u, 46 * u, 7 * u, { fill: 'none', stroke: '#0E7C6B', 'stroke-width': 2 * u });
        txt(g, s[0], { x: 0, y: 10 * u, 'font-size': 26 * u, 'font-weight': 700, 'letter-spacing': 3 * u, fill: '#0E7C6B' });
        return { g: g, x: s[1] * u, y: s[2] * u + OY, r: s[3] };
      });
      var tap = el('circle', { r: 0, fill: '#0E7C6B', opacity: 0 }, root);
      var finger = el('circle', { r: 20 * u, fill: '#FFFFFF', stroke: '#15181D', 'stroke-width': 3 * u, opacity: 0 }, root);
      return function (p) {
        sb.style.opacity = E.out(seg(p, 0, .06));
        var n = Math.round(seg(p, .04, .16) * Q.length); q.textContent = Q.slice(0, n);
        caret.setAttribute('x', -180 * u + (n ? q.getComputedTextLength() : 0) + 3 * u); caret.style.opacity = p < .2 && Math.sin(p * 80) > 0 ? 1 : 0;
        var inT = E.out(seg(p, .16, .24));
        card.setAttribute('transform', 'translate(0,' + (1 - inT) * 60 * u + ')'); card.style.opacity = inT;
        var sh = (p * 3) % 1; shim.setAttribute('x', lerp(px - 200 * u, px + PW + 200 * u, sh)); shim.style.opacity = .5 * (1 - seg(p, .52, .6));
        SK.forEach(function (s, i) {
          var t = seg(p, .24 + i * .028, .29 + i * .028);
          s.style.opacity = 1 - t; RL[i].style.opacity = t;
          RL[i].setAttribute('transform', 'translate(0,' + (1 - E.out(t)) * 10 * u + ')');
        });
        var sw = E.inOut(seg(p, .56, .62)) - E.inOut(seg(p, .86, .92));
        slide2.setAttribute('transform', 'translate(' + (1 - sw) * -PW * .62 + ',0)');
        dotsP.forEach(function (d, i) { d.style.opacity = (i === (sw > .5 ? 1 : 0)) ? 1 : .45; });
        stamps.forEach(function (s, i) {
          var t = seg(p, .6 + i * .05, .64 + i * .05), e = E.in(t), since = p - .64 - i * .05;
          var shake = t >= 1 ? Math.exp(-since * 60) * Math.sin(since * 400) * 4 * u : 0;
          s.g.setAttribute('transform', 'translate(' + (s.x + shake) + ',' + s.y + ') rotate(' + s.r + ') scale(' + lerp(1.7, 1, e) + ')');
          s.g.style.opacity = t > 0 ? Math.min(1, t * 2.5) : 0;
        });
        var ft = seg(p, .78, .84), fx2 = lerp(btn0[0] + 220 * u, btn0[0], E.inOut(ft)), fy2 = lerp(btn0[1] + 220 * u, btn0[1], E.inOut(ft));
        finger.setAttribute('cx', fx2); finger.setAttribute('cy', fy2); finger.style.opacity = ft > 0 ? (1 - seg(p, .94, .98)) * .95 : 0;
        var tp = seg(p, .84, .94); tap.setAttribute('cx', btn0[0]); tap.setAttribute('cy', btn0[1]); tap.setAttribute('r', 70 * u * E.out(tp)); tap.style.opacity = tp > 0 ? (1 - tp) * .35 : 0;
      };
    }
  };

  /* 25 · AEO — facts from four sources disagree; a scan reads them, the right ones merge, and three kinds of answer quote it */
  M.aeo = {
    title: 'Answer Engine Optimization', page: '/services/answer-engine-optimization/', dur: 9000, cap: [.8, .94],
    bg: 'radial-gradient(70% 60% at 50% 42%, #2A1E52 0%, #160F30 60%, #0B0719 100%)', accent: '#B69CFF', wm: '#7C6EA8',
    line: 'One version <em>of the facts.</em>',
    build: function (root, u) {
      var facts = [
        ['Website', 'Hours', 'Mon–Fri, 8–5', 1, [-240, -300, -6]], ['Old directory', 'Hours', 'Mon–Sat, 9–6', 0, [230, -240, 5]],
        ['Map listing', 'Phone', '(910) 555-0142', 1, [-250, -80, 4]], ['Social page', 'Phone', '(910) 555-0199', 0, [240, -10, -5]],
        ['Website', 'Address', '12 Market St', 1, [-220, 150, -3]], ['Old directory', 'Address', '12 Market Street, Ste B', 0, [200, 210, 6]]
      ];
      var CW = 380 * u, CH = 104 * u;
      var F = facts.map(function (f, i) {
        var g = el('g', {}, root);
        var box = rr(g, -CW / 2, -CH / 2, CW, CH, 18 * u, { fill: '#241A48', stroke: '#4A3C84', 'stroke-width': 2 * u });
        rr(g, -CW / 2 + 18 * u, -CH / 2 - 14 * u, (f[0].length * 9.5 + 26) * u, 28 * u, 14 * u, { fill: '#4A3C84' });
        txt(g, f[0], { x: -CW / 2 + 31 * u, y: -CH / 2 + 5 * u, 'text-anchor': 'start', 'font-size': 15 * u, 'font-weight': 600, fill: '#E4DCF8' });
        txt(g, f[1].toUpperCase(), { x: -CW / 2 + 24 * u, y: -2 * u, 'text-anchor': 'start', 'font-size': 14 * u, 'font-weight': 600, 'letter-spacing': 2 * u, fill: '#9C8BD6' });
        txt(g, f[2], { x: -CW / 2 + 24 * u, y: 30 * u, 'text-anchor': 'start', 'font-size': 25 * u, 'font-weight': 500, fill: '#F1ECFF' });
        var strike = el('line', { x1: -CW / 2 + 16 * u, y1: 22 * u, x2: CW / 2 - 16 * u, y2: 22 * u, stroke: '#FF6B8A', 'stroke-width': 4 * u, 'stroke-linecap': 'round' }, g);
        var tick = el('path', { d: 'M-10 0 L -3 8 L 12 -9', stroke: '#7CF5C4', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', transform: 'translate(' + (CW / 2 - 34 * u) + ',' + (4 * u) + ') scale(' + u + ')', opacity: 0 }, g);
        return { g: g, box: box, strike: strike, sL: drawn(strike), tick: tick, ok: f[3], x: f[4][0] * u, y: f[4][1] * u, r: f[4][2], row: Math.floor(i / 2), ph: i * 1.3 };
      });
      var beam = rr(root, -520 * u, 0, 1040 * u, 6 * u, 3 * u, { fill: '#C9B6FF', filter: 'url(#kGlow)', opacity: 0 });
      var one = el('g', { opacity: 0 }, root);
      var OW = 520 * u, oy = -360 * u;
      rr(one, -OW / 2, oy, OW, 250 * u, 24 * u, { fill: '#F4F0FF' });
      flat(one, '#5A33D6', OW / 2 - 50 * u, oy + 46 * u, .09 * u);
      txt(one, 'Your Business', { x: -OW / 2 + 30 * u, y: oy + 52 * u, 'text-anchor': 'start', 'font-size': 28 * u, 'font-weight': 600, fill: '#1B1530' });
      [['Hours', 'Mon–Fri, 8–5'], ['Phone', '(910) 555-0142'], ['Address', '12 Market St']].forEach(function (r, i) {
        txt(one, r[0], { x: -OW / 2 + 30 * u, y: oy + (104 + i * 44) * u, 'text-anchor': 'start', 'font-size': 20 * u, fill: '#6A5F8E' });
        txt(one, r[1], { x: -OW / 2 + 150 * u, y: oy + (104 + i * 44) * u, 'text-anchor': 'start', 'font-size': 22 * u, 'font-weight': 600, fill: '#1B1530' });
      });
      var ans = el('g', { opacity: 0 }, root);
      var AW = 600 * u, ay = -70 * u;
      rr(ans, -AW / 2, ay, AW, 196 * u, 28 * u, { fill: '#352866' });
      el('circle', { cx: -AW / 2 + 40 * u, cy: ay + 42 * u, r: 18 * u, fill: 'url(#kF_violet)' }, ans);
      el('path', { d: star(9 * u, 4 * u), fill: '#FFFFFF', transform: 'translate(' + (-AW / 2 + 40 * u) + ',' + (ay + 42 * u) + ')' }, ans);
      var lines = ['They’re open Monday to Friday, 8 to 5.', 'Call (910) 555-0142.'].map(function (s, i) {
        var c = clip(root, 'aeoL'); var r = rr(c.el, -AW / 2 + 70 * u, ay + (24 + i * 34) * u, 0, 36 * u, 0);
        var t = txt(ans, s, { x: -AW / 2 + 70 * u, y: ay + (50 + i * 34) * u, 'text-anchor': 'start', 'font-size': 23 * u, fill: '#FFFFFF', 'clip-path': c.url });
        return { r: r, t: t };
      });
      var chip = el('g', { opacity: 0 }, ans);
      rr(chip, -AW / 2 + 70 * u, ay + 116 * u, 230 * u, 44 * u, 22 * u, { fill: '#4A3C84' });
      flat(chip, '#C9B6FF', -AW / 2 + 96 * u, ay + 139 * u, .045 * u);
      txt(chip, 'yourbusiness.com', { x: -AW / 2 + 118 * u, y: ay + 145 * u, 'text-anchor': 'start', 'font-size': 18 * u, fill: '#E4DCF8' });
      var kinds = [['Search', 'M-14 -6 a 8 8 0 1 0 16 0 a 8 8 0 1 0 -16 0 M 0 0 L 9 9'], ['Assistant', 'M0 -12 L 3 -3 L 12 0 L 3 3 L 0 12 L -3 3 L -12 0 L -3 -3Z'], ['Voice', 'M-3 -11 h 6 a 3 3 0 0 1 3 3 v 7 a 6 6 0 0 1 -12 0 v -7 a 3 3 0 0 1 3 -3Z M-10 1 a 10 10 0 0 0 20 0 M0 11 v 5']].map(function (k, i) {
        var g = el('g', { opacity: 0 }, root), cx = (i - 1) * 190 * u, cy = 190 * u;
        rr(g, cx - 82 * u, cy - 28 * u, 164 * u, 56 * u, 28 * u, { fill: '#241A48', stroke: '#7CF5C4', 'stroke-width': 2 * u });
        el('path', { d: k[1], fill: i === 1 ? '#7CF5C4' : 'none', stroke: i === 1 ? 'none' : '#7CF5C4', 'stroke-width': 2.4, 'stroke-linecap': 'round', transform: 'translate(' + (cx - 48 * u) + ',' + cy + ') scale(' + 1.1 * u + ')' }, g);
        txt(g, k[0], { x: cx + 14 * u, y: cy + 7 * u, 'font-size': 19 * u, 'font-weight': 600, fill: '#E4DCF8' });
        return g;
      });
      return function (p) {
        var sc = seg(p, .16, .34), by = lerp(-380 * u, 300 * u, sc);
        beam.setAttribute('y', by); beam.style.opacity = sc > 0 && sc < 1 ? .9 : 0;
        F.forEach(function (f, i) {
          var inT = E.out(seg(p, .02 + i * .025, .1 + i * .025)), drift = Math.sin(p * 14 + f.ph) * 6 * u;
          var read = by > f.y;
          f.box.setAttribute('stroke', read ? (f.ok ? '#7CF5C4' : '#FF6B8A') : '#4A3C84');
          f.tick.style.opacity = f.ok && read ? 1 - seg(p, .42, .46) : 0;
          if (!f.ok) f.strike.style.strokeDashoffset = f.sL * (1 - seg(p, .34 + f.row * .025, .39 + f.row * .025)); else f.strike.style.opacity = 0;
          var go = E.inOut(seg(p, .44, .54));
          if (f.ok) {
            f.g.setAttribute('transform', 'translate(' + lerp(f.x, 0, go) + ',' + lerp(f.y + drift, -235 * u, go) + ') rotate(' + lerp(f.r, 0, go) + ') scale(' + (inT * lerp(1, .6, go)) + ')');
            f.g.style.opacity = inT * (1 - seg(p, .5, .55));
          } else {
            var fall = E.in(seg(p, .4 + f.row * .02, .52 + f.row * .02));
            f.g.setAttribute('transform', 'translate(' + (f.x + fall * 80 * u) + ',' + (f.y + drift + fall * 700 * u) + ') rotate(' + (f.r + fall * 30) + ') scale(' + inT + ')');
            f.g.style.opacity = inT * (1 - fall);
          }
        });
        var ot = seg(p, .5, .58); one.style.opacity = ot; one.setAttribute('transform', 'scale(' + lerp(.92, 1, E.back(ot)) + ')');
        var at = seg(p, .58, .63); ans.style.opacity = at; ans.setAttribute('transform', 'translate(0,' + (1 - E.out(at)) * 30 * u + ')');
        lines.forEach(function (l, i) { var t = seg(p, .63 + i * .06, .69 + i * .06); l.r.setAttribute('width', (l.t.getComputedTextLength() + 6 * u) * t); });
        chip.style.opacity = seg(p, .74, .77);
        kinds.forEach(function (g, i) { var t = seg(p, .76 + i * .025, .8 + i * .025); g.style.opacity = t; g.setAttribute('transform', 'translate(0,' + (1 - E.back(t)) * 16 * u + ')'); });
      };
    }
  };

  /* 26 · BRAND — three questions become the mark; the mark becomes a press; six things ride a belt under it */
  function objects(parent, u) {
    function sh(g, d) { el('path', { d: d, fill: '#000', opacity: .08, transform: 'translate(' + 6 * u + ',' + 10 * u + ') scale(' + u + ')' }, g); }
    var O = [], g, d;
    g = el('g', {}, parent);
    var c = el('g', { transform: 'rotate(-6)' }, g);
    rr(c, -112 * u, -58 * u, 230 * u, 132 * u, 10 * u, { fill: '#000', opacity: .08 });
    rr(c, -120 * u, -68 * u, 230 * u, 132 * u, 10 * u, { fill: '#FFFFFF' });
    rr(c, -10 * u, -20 * u, 100 * u, 12 * u, 6 * u, { fill: '#15181D' }); rr(c, -10 * u, 2 * u, 76 * u, 9 * u, 4 * u, { fill: '#9098A8' }); rr(c, -10 * u, 20 * u, 88 * u, 9 * u, 4 * u, { fill: '#9098A8' });
    O.push({ g: g, host: c, sx: -62 * u, sy: -2 * u, s: .15, fill: '#7A4DFF', dy: 62 * u });
    g = el('g', {}, parent);
    d = 'M-60 -95 L -26 -108 C -18 -92, 18 -92, 26 -108 L 60 -95 L 108 -52 L 82 -20 L 62 -36 L 62 100 L -62 100 L -62 -36 L -82 -20 L -108 -52Z';
    sh(g, d); el('path', { d: d, fill: '#1B2A55', transform: 'scale(' + u + ')' }, g);
    el('path', { d: 'M-26 -108 L 0 -70 L 26 -108', fill: 'none', stroke: '#2E4380', 'stroke-width': 5, transform: 'scale(' + u + ')' }, g);
    O.push({ g: g, host: g, sx: 30 * u, sy: -38 * u, s: .075, fill: '#FFFFFF', dy: 8 * u });
    g = el('g', {}, parent);
    d = 'M-130 30 L -130 -50 C -130 -60, -122 -66, -112 -66 L 60 -66 C 78 -66, 90 -58, 100 -44 L 126 -10 C 132 -2, 134 6, 134 14 L 134 30Z';
    sh(g, d); el('path', { d: d, fill: '#FFFFFF', transform: 'scale(' + u + ')' }, g);
    el('path', { d: 'M70 -56 L 100 -18 L 70 -18Z', fill: '#2A2E36', transform: 'scale(' + u + ')' }, g);
    rr(g, -130 * u, 4 * u, 264 * u, 12 * u, 0, { fill: '#F0473A' });
    [-84, 80].forEach(function (x) { el('circle', { cx: x * u, cy: 32 * u, r: 22 * u, fill: '#15181D' }, g); el('circle', { cx: x * u, cy: 32 * u, r: 9 * u, fill: '#9098A8' }, g); });
    O.push({ g: g, host: g, sx: -30 * u, sy: -24 * u, s: .14, fill: '#1B3FC4', dy: 56 * u });
    g = el('g', {}, parent);
    [-60, 60].forEach(function (x) { rr(g, x * u - 2 * u, -10 * u, 4 * u, 120 * u, 1 * u, { fill: '#6A7080' }); });
    rr(g, -104 * u, -88 * u, 216 * u, 136 * u, 8 * u, { fill: '#000', opacity: .08 });
    rr(g, -110 * u, -96 * u, 216 * u, 136 * u, 8 * u, { fill: '#FFB23F' });
    rr(g, -20 * u, 14 * u, 110 * u, 10 * u, 5 * u, { fill: '#15181D', opacity: .8 });
    O.push({ g: g, host: g, sx: -2 * u, sy: -38 * u, s: .17, fill: '#15181D', dy: -2 * u });
    g = el('g', {}, parent);
    rr(g, -78 * u, -70 * u, 156 * u, 156 * u, 38 * u, { fill: '#000', opacity: .1 });
    rr(g, -84 * u, -80 * u, 156 * u, 156 * u, 38 * u, { fill: 'url(#kF_violet)' });
    O.push({ g: g, host: g, sx: -6 * u, sy: -2 * u, s: .3, fill: '#FFFFFF', dy: 32 * u });
    g = el('g', {}, parent);
    el('path', { d: 'M62 -40 C 112 -40, 112 40, 62 40', fill: 'none', stroke: '#1FC98A', 'stroke-width': 16, transform: 'scale(' + u + ')' }, g);
    rr(g, -76 * u, -76 * u, 146 * u, 170 * u, 22 * u, { fill: '#000', opacity: .08 });
    rr(g, -80 * u, -84 * u, 146 * u, 170 * u, 22 * u, { fill: '#1FC98A' });
    el('ellipse', { cx: -7 * u, cy: -84 * u, rx: 73 * u, ry: 12 * u, fill: '#0A6A4A' }, g);
    O.push({ g: g, host: g, sx: -7 * u, sy: 2 * u, s: .19, fill: '#FFFFFF', dy: 18 * u });
    return O;
  }
  M.brand = {
    title: 'Brand Strategy & Identity', page: '/services/brand-strategy/', dur: 9500, cap: [.8, .94],
    bg: 'radial-gradient(80% 70% at 50% 40%, #FFFFFF 0%, #EDEEF2 55%, #DCDFE6 100%)', ink: '#15181D', accent: '#7A4DFF', wm: '#8A90A0',
    line: 'One mark, <em>everywhere it appears.</em>',
    build: function (root, u) {
      var Qs = [['Who it’s for', -230, -300], ['What it stands for', 210, -210], ['How it sounds', -190, -90]].map(function (q) {
        var g = el('g', { opacity: 0 }, root);
        var w = (q[0].length * 12.5 + 44) * u;
        rr(g, -w / 2, -26 * u, w, 52 * u, 26 * u, { fill: '#FFFFFF', stroke: '#D5D9E2', 'stroke-width': 2 * u });
        txt(g, q[0], { x: 0, y: 8 * u, 'font-size': 22 * u, 'font-weight': 500, fill: '#15181D' });
        return { g: g, x: q[1] * u, y: q[2] * u };
      });
      var BELT = 250 * u, KY = -150 * u;
      var draw = el('g', {}, root);
      var oR = el('path', { d: K.PATH_R, fill: 'none', stroke: '#7A4DFF', 'stroke-width': 9 }, draw), oL = el('path', { d: K.PATH_L, fill: 'none', stroke: '#7A4DFF', 'stroke-width': 9 }, draw);
      var LR = drawn(oR), LL = drawn(oL);
      var fillK = el('g', { opacity: 0 }, draw); el('use', { href: '#kR', fill: 'url(#kF_violet)' }, fillK); el('use', { href: '#kL', fill: 'url(#kF_violet)' }, fillK);
      var belt = el('g', { opacity: 0 }, root);
      rr(belt, -1000 * u, BELT, 2000 * u, 26 * u, 13 * u, { fill: '#2A2E36' });
      var ticks = el('g', {}, belt);
      for (var i = -40; i <= 40; i++) rr(ticks, i * 60 * u, BELT + 9 * u, 30 * u, 8 * u, 4 * u, { fill: '#4A5060' });
      var riders = el('g', {}, root);
      var O = objects(riders, u);
      var stamps = O.map(function (o) {
        var m = flat(o.host, o.fill, o.sx, o.sy, o.s * u, { opacity: 0 });
        var ring = el('circle', { cx: o.sx, cy: o.sy, r: 0, fill: 'none', stroke: o.fill === '#FFFFFF' ? '#7A4DFF' : o.fill, 'stroke-width': 3 * u, opacity: 0 }, o.host);
        return { m: m, ring: ring };
      });
      /* the press: drawn after the riders so it comes down in front of them */
      var press = el('g', { opacity: 0 }, root);
      rr(press, -14 * u, -1400 * u, 28 * u, 1300 * u, 6 * u, { fill: '#9098A8' });
      rr(press, -90 * u, -110 * u, 180 * u, 70 * u, 14 * u, { fill: '#2A2E36' });
      rr(press, -76 * u, -40 * u, 152 * u, 36 * u, 8 * u, { fill: '#7A4DFF' });
      flat(press, '#FFFFFF', 0, -22 * u, .08 * u);
      var world = el('g', {}, root); world.appendChild(belt); world.appendChild(riders); world.appendChild(press);
      var GAP = 330 * u, T0 = .42, DT = .066;
      function yOf(o) { return BELT - 100 * u + o.dy; }
      return function (p) {
        Qs.forEach(function (q, i) {
          var t = E.out(seg(p, .02 + i * .03, .08 + i * .03)), c = E.in(seg(p, .13, .19));
          q.g.style.opacity = t * (1 - c);
          q.g.setAttribute('transform', 'translate(' + lerp(q.x, 0, c) + ',' + lerp(q.y + Math.sin(p * 12 + i) * 5 * u, KY, c) + ') scale(' + lerp(1, .4, c) + ')');
        });
        var dt = seg(p, .17, .27);
        oR.style.strokeDashoffset = LR * (1 - E.inOut(dt)); oL.style.strokeDashoffset = LL * (1 - E.inOut(seg(p, .19, .27)));
        var ft = seg(p, .27, .31); fillK.style.opacity = ft; oR.style.opacity = oL.style.opacity = dt > 0 ? 1 - ft * .8 : 0;
        var up = E.inOut(seg(p, .31, .37));
        draw.setAttribute('transform', 'translate(0,' + lerp(KY, -330 * u, up) + ') scale(' + lerp(.62, .12, up) * u + ') translate(-300,-318)');
        draw.style.opacity = 1 - seg(p, .35, .38);
        belt.style.opacity = seg(p, .31, .38);
        /* the belt stops after the last stamp, so the final frame holds the stamped set, not an empty belt */
        var tau = p < .75 ? p : .75 + .024 * E.out(seg(p, .75, .82));
        var shift = (tau - T0) / DT * GAP;
        ticks.setAttribute('transform', 'translate(' + (-(shift % (60 * u))) + ',0)');
        /* then the camera pulls back and the set lines up: six things, one mark */
        var z = E.inOut(seg(p, .78, .88));
        world.setAttribute('transform', 'translate(0,' + lerp(0, -70 * u, z) + ') scale(' + lerp(1, .56, z) + ')');
        var down = 0, near = O[0], nd = 9;
        O.forEach(function (o, i) {
          var tc = T0 + i * DT, x = (tc - tau) / DT * GAP;
          x = lerp(x, (i - 2.5) * GAP * .9, z);
          o.g.setAttribute('transform', 'translate(' + x + ',' + yOf(o) + ')');
          o.g.style.opacity = seg(p, .33, .38);
          var hit = p >= tc;
          stamps[i].m.style.opacity = hit ? 1 : 0;
          stamps[i].m.setAttribute('transform', 'translate(' + o.sx + ',' + o.sy + ') scale(' + o.s * u * (hit ? lerp(1.3, 1, E.out(seg(p, tc, tc + .02))) : 1) + ') translate(-300,-318)');
          var rt = seg(p, tc, tc + .05); stamps[i].ring.setAttribute('r', 70 * u * E.out(rt) * o.s / .15); stamps[i].ring.style.opacity = rt > 0 && rt < 1 ? (1 - rt) * .8 : 0;
          down = Math.max(down, bump(p, tc, .011));
          if (Math.abs(p - tc) < nd) { nd = Math.abs(p - tc); near = o; }
        });
        var target = yOf(near) + near.sy - 20 * u;
        press.setAttribute('transform', 'translate(0,' + (lerp(-240 * u, target, down) - z * 1200 * u) + ')'); press.style.opacity = seg(p, .35, .38) * (1 - seg(p, .8, .86));
      };
    }
  };

  /* 27 · SOCIAL — a month fills, folds into a phone, the grid scrolls, and one video plays full screen */
  M.social = {
    title: 'Social Media Management', page: '/services/social-media-management/', dur: 9500, cap: [.8, .94],
    bg: 'radial-gradient(80% 70% at 50% 40%, #FFFFFF 0%, #F1EEF8 55%, #E2DDF0 100%)', ink: '#1B1530', accent: '#E0358F', wm: '#8C84A8',
    line: 'Accounts that <em>don’t go quiet.</em>',
    build: function (root, u) {
      var CW = 96 * u, GW = CW * 7, GX = -GW / 2, top = -330 * u;
      var cal = el('g', {}, root);
      rr(cal, GX - 24 * u, top - 10 * u, GW + 60 * u, 640 * u, 30 * u, { fill: '#000', opacity: .06 });
      rr(cal, GX - 30 * u, top - 20 * u, GW + 60 * u, 640 * u, 30 * u, { fill: '#FFFFFF' });
      txt(cal, 'October', { x: GX, y: top + 40 * u, 'text-anchor': 'start', 'font-size': 38 * u, 'font-weight': 600, fill: '#1B1530' });
      flat(cal, '#E0358F', GX + GW - 20 * u, top + 26 * u, .09 * u);
      'SMTWTFS'.split('').forEach(function (d, i) { txt(cal, d, { x: GX + i * CW + CW / 2, y: top + 92 * u, 'font-size': 18 * u, 'font-weight': 600, fill: '#9A92B8' }); });
      var gy = top + 112 * u, cells = {};
      for (var day = 1; day <= 31; day++) {
        var idx = 3 + day, c = idx % 7, r = Math.floor(idx / 7);
        cells[day] = { x: GX + c * CW, y: gy + r * CW };
        rr(cal, cells[day].x + 4 * u, cells[day].y + 4 * u, CW - 8 * u, CW - 8 * u, 14 * u, { fill: '#F5F3FA' });
        txt(cal, String(day), { x: cells[day].x + 14 * u, y: cells[day].y + 26 * u, 'text-anchor': 'start', 'font-size': 15 * u, fill: '#9A92B8' });
      }
      var cols = [['#FF8A6A', '#F0473A'], ['#FFD27A', '#FF951F'], ['#9DFAD0', '#1FC98A'], ['#C9B6FF', '#7A4DFF'], ['#FFA3DA', '#F23FA0'], ['#9FB6FF', '#1B3FC4']];
      var tiles = [];
      [2, 5, 7, 9, 12, 14, 16, 19, 21, 23, 26, 28].forEach(function (d, i) { var cc = cols[i % cols.length]; tiles.push({ d: d, v: 0, fill: lgrad(root, 'soP', [['0', cc[0]], ['1', cc[1]]]) }); });
      [8, 15, 22, 29].forEach(function (d) { tiles.push({ d: d, v: 1, fill: '#1B1530' }); });
      tiles.sort(function (a, b) { return a.d - b.d; });
      function tileArt(g, t, s) {
        rr(g, -s / 2, -s / 2, s, s, s * .16, { fill: t.fill });
        if (t.v) el('path', { d: 'M-10 -14 L 16 0 L -10 14Z', fill: '#FFFFFF', transform: 'scale(' + s / 80 + ')' }, g);
        else { el('circle', { cx: s * .18, cy: -s * .15, r: s * .11, fill: '#FFFFFF', opacity: .85 }, g); el('path', { d: 'M-30 26 L -8 0 L 8 14 L 18 6 L 30 26Z', fill: '#FFFFFF', opacity: .7, transform: 'scale(' + s / 80 + ')' }, g); }
      }
      tiles.forEach(function (t, i) { var c = cells[t.d]; t.g = el('g', {}, root); tileArt(t.g, t, CW - 16 * u); t.cx = c.x + CW / 2; t.cy = c.y + CW / 2; t.i = i; });
      /* the phone: a profile grid of the same month, newest first */
      var PW = 330 * u, PH = 660 * u, phx = -PW / 2, phy = -PH / 2 - 20 * u;
      var phone = el('g', { opacity: 0 }, root);
      rr(phone, phx - 10 * u, phy - 10 * u, PW + 20 * u, PH + 20 * u, 50 * u, { fill: '#1B1530' });
      rr(phone, phx, phy, PW, PH, 42 * u, { fill: '#FFFFFF' });
      var sc = clip(root, 'soScr'); rr(sc.el, phx, phy, PW, PH, 42 * u);
      var scr = el('g', { 'clip-path': sc.url }, phone);
      var feed = el('g', {}, scr);
      el('circle', { cx: phx + 60 * u, cy: phy + 90 * u, r: 34 * u, fill: 'url(#kF_magenta)' }, feed);
      flat(feed, '#FFFFFF', phx + 60 * u, phy + 91 * u, .08 * u);
      txt(feed, 'yourbusiness', { x: phx + 110 * u, y: phy + 84 * u, 'text-anchor': 'start', 'font-size': 20 * u, 'font-weight': 600, fill: '#1B1530' });
      rr(feed, phx + 110 * u, phy + 96 * u, 150 * u, 8 * u, 4 * u, { fill: '#D8D2E8' });
      var TS = (PW - 8 * u) / 3, grid = [];
      tiles.slice().reverse().concat(tiles.slice().reverse()).forEach(function (t, i) {
        var g = el('g', {}, feed), c = i % 3, r = Math.floor(i / 3);
        var gx = phx + 2 * u + c * (TS + 2 * u) + TS / 2, gyy = phy + 150 * u + r * (TS + 2 * u) + TS / 2;
        rr(g, gx - TS / 2, gyy - TS / 2, TS, TS, 0, { fill: t.fill });
        if (t.v) el('path', { d: 'M-10 -14 L 16 0 L -10 14Z', fill: '#FFFFFF', transform: 'translate(' + gx + ',' + gyy + ') scale(' + TS / 90 + ')' }, g);
        else el('circle', { cx: gx + TS * .2, cy: gyy - TS * .18, r: TS * .09, fill: '#FFFFFF', opacity: .85 }, g);
        grid.push({ v: t.v, x: gx, y: gyy, r: r });
      });
      var pick = grid.filter(function (x) { return x.v && x.r >= 3 && x.r <= 5; })[0] || grid.filter(function (x) { return x.v; })[0];
      var reel = el('g', { opacity: 0 }, scr);
      var rbg = rr(reel, 0, 0, 0, 0, 0, { fill: lgrad(root, 'soReel', [['0', '#2A1A4A'], ['1', '#E0358F']]) });
      var rk = cmark(reel, 'chrome', { beamFill: 'url(#kBeamWarm)' });
      var progBg = rr(reel, phx + 20 * u, phy + PH - 40 * u, PW - 40 * u, 6 * u, 3 * u, { fill: '#FFFFFF', opacity: .3 });
      var prog = rr(reel, phx + 20 * u, phy + PH - 40 * u, 0, 6 * u, 3 * u, { fill: '#FFFFFF' });
      var tap = el('circle', { r: 0, fill: '#E0358F', opacity: 0 }, scr);
      var chips = el('g', { opacity: 0 }, root);
      [['12 posts', '#F0473A', -1], ['4 videos', '#1B1530', 1]].forEach(function (c) {
        var x = c[2] * 300 * u, y = 40 * u;
        rr(chips, x - 88 * u, y - 25 * u, 176 * u, 50 * u, 25 * u, { fill: c[1] });
        txt(chips, c[0], { x: x, y: y + 8 * u, 'font-size': 22 * u, 'font-weight': 600, fill: '#FFFFFF' });
      });
      return function (p) {
        var inT = E.out(seg(p, 0, .06)), fold = E.inOut(seg(p, .4, .5));
        cal.setAttribute('transform', 'translate(0,' + (1 - inT) * 40 * u + ') scale(' + lerp(1, .5, fold) + ')'); cal.style.opacity = inT * (1 - seg(p, .42, .5));
        tiles.forEach(function (t) {
          var s = seg(p, .06 + t.i * .02, .12 + t.i * .02), e = s ? E.back(s) : 0;
          t.g.setAttribute('transform', 'translate(' + lerp(t.cx, 0, fold) + ',' + (lerp(t.cy, -20 * u, fold) - (1 - E.out(s)) * 80 * u) + ') scale(' + ((e || .0001) * lerp(1, .3, fold)) + ')');
          t.g.style.opacity = s ? 1 - seg(p, .46, .5) : 0;
        });
        var ph = E.out(seg(p, .46, .54));
        phone.style.opacity = ph; phone.setAttribute('transform', 'translate(0,' + (1 - ph) * 120 * u + ')');
        var scroll = E.inOut(seg(p, .54, .68)) * 3 * (TS + 2 * u);
        feed.setAttribute('transform', 'translate(0,' + (-scroll) + ')');
        var tp = seg(p, .68, .74);
        tap.setAttribute('cx', pick.x); tap.setAttribute('cy', pick.y - scroll); tap.setAttribute('r', 60 * u * E.out(tp)); tap.style.opacity = tp > 0 && tp < 1 ? (1 - tp) * .5 : 0;
        var ex = E.inOut(seg(p, .72, .8));
        reel.style.opacity = ex > 0 ? 1 : 0;
        var rx = lerp(pick.x - TS / 2, phx, ex), ry = lerp(pick.y - scroll - TS / 2, phy, ex), rw = lerp(TS, PW, ex), rh = lerp(TS, PH, ex);
        setR(rbg, rx, ry, rw, rh);
        rk.set({ x: rx + rw / 2, y: ry + rh / 2, sx: .5 * u * ex + .0001, beam: p * 700 });
        prog.setAttribute('width', (PW - 40 * u) * seg(p, .8, 1)); prog.style.opacity = seg(p, .78, .82); progBg.style.opacity = seg(p, .78, .82) * .3;
        chips.style.opacity = seg(p, .56, .62);
      };
    }
  };

  K.order = K.order.concat(['webdesign', 'redesign', 'localseo', 'gbp', 'aeo', 'brand', 'social']);
})(window.KMotion);
