/* ==========================================================================
   MORROW COFFEE CO. — BEHAVIOUR
   Nothing here is required for first paint. The page renders complete with
   no script; this file adds the reveals, the hero cover, the nav states,
   the bar's cursor image, the seasonal drag, the lightbox, the hours and
   the email copy. One easing lives in CSS; script only sets state and a
   handful of custom properties.

   Every scroll-linked effect is skipped under prefers-reduced-motion, and
   parallax, cursor effects and drag physics are skipped on touch/mobile.
   ========================================================================== */
(function () {
  'use strict';

  var doc = document, root = doc.documentElement, body = doc.body;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  var wide = window.matchMedia('(min-width: 1024px)');
  var desktop = function () { return fine.matches && wide.matches; };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  /* ======================================================================
     ENTRANCE — wait for the fonts (capped) so the headline rises in the
     serif, then let CSS run the 1.8s sequence.
     ====================================================================== */
  (function entrance() {
    var go = function () { requestAnimationFrame(function () { body.classList.add('is-loaded'); }); };
    if (reduce.matches || !doc.fonts) return go();
    var done = false, fire = function () { if (!done) { done = true; go(); } };
    doc.fonts.ready.then(fire);
    setTimeout(fire, 500);
  })();

  /* ======================================================================
     NAV — transparent over the hero, Ivory after 80px, hidden on a
     deliberate scroll-down past 400px, back on scroll-up.
     ====================================================================== */
  var nav = doc.getElementById('nav');
  var menu = doc.getElementById('menu');
  (function navState() {
    if (!nav) return;
    var last = window.scrollY, ticking = false;
    function update() {
      ticking = false;
      var y = window.scrollY;
      nav.classList.toggle('is-scrolled', y > 80);
      if (!menu || menu.hidden) {
        if (y > 400 && y > last + 6) nav.classList.add('is-hidden');
        else if (y < last - 6 || y <= 400) nav.classList.remove('is-hidden');
      }
      last = y;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  })();

  /* ======================================================================
     MOBILE MENU — full-screen layer, focus trapped, ESC closes, scroll locked.
     ====================================================================== */
  (function mobileMenu() {
    var toggle = doc.querySelector('.nav__toggle');
    if (!toggle || !menu) return;
    var closeBtn = menu.querySelector('.menu__close');
    var main = doc.getElementById('main'), footer = doc.getElementById('footer');
    var focusables = function () {
      return Array.prototype.slice.call(menu.querySelectorAll('a[href], button:not([disabled])'));
    };
    function open() {
      menu.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      body.classList.add('is-locked');
      nav.classList.remove('is-hidden');
      if (main) main.setAttribute('aria-hidden', 'true');
      if (footer) footer.setAttribute('aria-hidden', 'true');
      closeBtn.focus();
    }
    function close(returnFocus) {
      menu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      body.classList.remove('is-locked');
      if (main) main.removeAttribute('aria-hidden');
      if (footer) footer.removeAttribute('aria-hidden');
      if (returnFocus !== false) toggle.focus();
    }
    toggle.addEventListener('click', function () { menu.hidden ? open() : close(); });
    closeBtn.addEventListener('click', function () { close(); });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') close(false);
    });
    menu.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab') return;
      var f = focusables(), first = f[0], lastEl = f[f.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && doc.activeElement === lastEl) { e.preventDefault(); first.focus(); }
    });
    window.matchMedia('(min-width: 768px)').addEventListener('change', function (m) {
      if (m.matches && !menu.hidden) close(false);
    });
  })();

  /* ======================================================================
     REVEALS — clip-path lines, image masks, rises. Once only, at ~20%
     entry. Tall elements trigger as soon as a viewport-fifth of them shows.
     ====================================================================== */
  (function reveals() {
    var els = doc.querySelectorAll('.reveal-lines:not(.hero__title), .mask, .rise');
    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(els, function (el) { el.classList.add('is-in'); });
      return;
    }
    // stagger children of a [data-stagger] container
    Array.prototype.forEach.call(doc.querySelectorAll('[data-stagger]'), function (group) {
      Array.prototype.forEach.call(group.querySelectorAll('.rise'), function (el, i) {
        el.style.setProperty('--d', (i * 80) + 'ms');
      });
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var need = Math.min(entry.boundingClientRect.height * 0.2, window.innerHeight * 0.2);
        if (entry.intersectionRect.height >= need || entry.intersectionRatio >= 0.2) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: [0, 0.1, 0.2, 0.35, 0.5] });
    Array.prototype.forEach.call(els, function (el) { io.observe(el); });
  })();

  /* ======================================================================
     SCROLL-LINKED — one rAF, four consumers:
       hero    --hero-p   0→1 over the first viewport (scale + drift)
       photos  parallax   [data-parallax] factor, desktop only
       sourcing --zoom    1→1.05 across its travel through the viewport
     ====================================================================== */
  (function scrollLinked() {
    if (reduce.matches) return;
    var hero = doc.querySelector('.hero');
    var parallax = Array.prototype.slice.call(doc.querySelectorAll('[data-parallax]'));
    var zoom = doc.querySelector('[data-zoom]');
    var ticking = false;

    function frame() {
      ticking = false;
      var vh = window.innerHeight, y = window.scrollY;
      if (hero) hero.style.setProperty('--hero-p', clamp(y / vh, 0, 1).toFixed(4));
      if (desktop()) {
        parallax.forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.bottom < -vh || r.top > vh * 2) return;
          var centre = r.top + r.height / 2 - vh / 2;   // 0 when centred in the viewport
          el.style.transform = 'translate3d(0,' + (centre * parseFloat(el.dataset.parallax)).toFixed(1) + 'px,0)';
        });
      }
      if (zoom) {
        var z = zoom.getBoundingClientRect();
        if (z.bottom > 0 && z.top < vh) {
          var p = clamp((vh - z.top) / (vh + z.height), 0, 1);
          zoom.style.setProperty('--zoom', (1 + 0.05 * p).toFixed(4));
        }
      }
    }
    function request() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', function () {
      if (!desktop()) parallax.forEach(function (el) { el.style.transform = ''; });
      request();
    });
    frame();
  })();

  /* ======================================================================
     THE BAR — a 240px image follows the cursor over a menu row, at 60% lag.
     Desktop only; the element is display:none below 1024px or on touch.
     ====================================================================== */
  (function barCursor() {
    var menuEl = doc.querySelector('.bar__menu');
    var cur = doc.querySelector('.bar__cursor');
    if (!menuEl || !cur || !desktop() || reduce.matches) return;
    var img = cur.querySelector('img');
    var tx = 0, ty = 0, x = 0, y = 0, on = false, raf = null, src = '';
    function loop() {
      x += (tx - x) * 0.4; y += (ty - y) * 0.4;
      cur.style.transform = 'translate(' + (x - 120).toFixed(1) + 'px,' + (y - 120).toFixed(1) + 'px)';
      if (on || Math.abs(tx - x) > 0.5 || Math.abs(ty - y) > 0.5) raf = requestAnimationFrame(loop);
      else raf = null;
    }
    menuEl.addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY;
      var row = e.target.closest('.row');
      if (row && row.dataset.img) {
        if (src !== row.dataset.img) { src = row.dataset.img; img.src = src; }
        if (!on) { on = true; x = tx; y = ty; cur.classList.add('is-on'); }
        if (!raf) raf = requestAnimationFrame(loop);
      } else if (on) { on = false; cur.classList.remove('is-on'); }
    });
    menuEl.addEventListener('mouseleave', function () { on = false; cur.classList.remove('is-on'); });
  })();

  /* ======================================================================
     THIS SEASON — counter; desktop drag with inertia (snap suspended while
     the strip is moving, restored when it settles). Mobile is native.
     ====================================================================== */
  (function season() {
    var strip = doc.querySelector('.season__strip');
    if (!strip) return;
    var items = strip.querySelectorAll('.season__item');
    var current = doc.querySelector('.season__current');
    var count = items.length;

    function updateCounter() {
      if (!current || !count) return;
      // progress through the strip's travel, not item starts: the last items
      // can never reach the left edge, so 04 must mean "scrolled to the end"
      var max = strip.scrollWidth - strip.clientWidth;
      var i = max > 0 ? clamp(Math.round((strip.scrollLeft / max) * (count - 1)), 0, count - 1) : 0;
      var label = (i + 1 < 10 ? '0' : '') + (i + 1);
      if (current.textContent !== label) current.textContent = label;
    }
    strip.addEventListener('scroll', updateCounter, { passive: true });
    window.addEventListener('resize', updateCounter);
    updateCounter();

    if (!desktop() || reduce.matches) return;

    var down = false, startX = 0, startLeft = 0, lastX = 0, lastT = 0, vel = 0, moved = false, raf = null;
    strip.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; moved = false;
      startX = lastX = e.clientX; startLeft = strip.scrollLeft; lastT = performance.now(); vel = 0;
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      strip.classList.add('is-dragging');
      strip.setPointerCapture(e.pointerId);
    });
    strip.addEventListener('pointermove', function (e) {
      if (!down) return;
      var now = performance.now(), dt = Math.max(1, now - lastT);
      vel = (lastX - e.clientX) / dt;             // px per ms
      lastX = e.clientX; lastT = now;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 3) moved = true;
      strip.scrollLeft = startLeft - dx;
    });
    function settle() {
      strip.classList.remove('is-dragging');
      // snap-type returns and the browser snaps to the nearest item
    }
    function release() {
      if (!down) return;
      down = false;
      var v = vel * 16;                           // px per frame
      if (Math.abs(v) < 0.5) return settle();
      function step() {
        strip.scrollLeft += v;
        v *= 0.92;
        if (Math.abs(v) > 0.4) raf = requestAnimationFrame(step);
        else { raf = null; settle(); }
      }
      raf = requestAnimationFrame(step);
    }
    strip.addEventListener('pointerup', release);
    strip.addEventListener('pointercancel', release);
    strip.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
  })();

  /* ======================================================================
     CURSOR LABEL — VIEW over gallery images, DRAG over the strip. Desktop
     only; the element is display:none elsewhere.
     ====================================================================== */
  (function cursorLabel() {
    var label = doc.querySelector('.cursor-label');
    if (!label || !desktop() || reduce.matches) return;
    var zones = [
      { sel: '.season__strip', text: 'DRAG' },
      { sel: '.g__btn', text: 'VIEW' }
    ];
    var active = null;
    doc.addEventListener('mousemove', function (e) {
      var hit = null;
      for (var i = 0; i < zones.length; i++) {
        if (e.target.closest(zones[i].sel)) { hit = zones[i]; break; }
      }
      if (hit !== active) {
        active = hit;
        if (hit) { label.textContent = hit.text; label.classList.add('is-on'); }
        else label.classList.remove('is-on');
      }
      if (hit) label.style.transform = 'translate(' + (e.clientX + 14) + 'px,' + (e.clientY + 14) + 'px)';
    }, { passive: true });
  })();

  /* ======================================================================
     THE ROOM — lightbox. Native <dialog>: modal, focus contained, ESC
     closes. Arrow keys move, image crossfades 400ms, counter updates.
     ====================================================================== */
  (function lightbox() {
    var dlg = doc.getElementById('lightbox');
    var buttons = Array.prototype.slice.call(doc.querySelectorAll('.g__btn'));
    if (!dlg || !buttons.length || typeof dlg.showModal !== 'function') return;
    var img = dlg.querySelector('.lightbox__img');
    var cap = dlg.querySelector('.lightbox__caption');
    var counter = dlg.querySelector('.lightbox__counter');
    var items = buttons.map(function (b) {
      var i = b.querySelector('img');
      var fc = b.parentNode.querySelector('figcaption');
      return { src: i.currentSrc || i.src, alt: i.alt, caption: fc ? fc.textContent : '' };
    });
    var index = 0, opener = null, switching = null;

    function show(i, instant) {
      index = (i + items.length) % items.length;
      var it = items[index];
      function apply() {
        img.src = it.src; img.alt = it.alt;
        cap.textContent = it.caption;
        counter.textContent = (index + 1 < 10 ? '0' : '') + (index + 1) + ' / ' + (items.length < 10 ? '0' : '') + items.length;
      }
      if (instant || reduce.matches) { apply(); dlg.classList.remove('is-switching'); return; }
      dlg.classList.add('is-switching');
      clearTimeout(switching);
      switching = setTimeout(function () {
        apply();
        img.decode ? img.decode().catch(function () {}).then(function () { dlg.classList.remove('is-switching'); })
                   : dlg.classList.remove('is-switching');
      }, 400);
    }
    function open(i, btn) {
      opener = btn;
      show(i, true);
      dlg.showModal();
      body.classList.add('is-locked');
      dlg.querySelector('[data-lb="close"]').focus();
    }
    buttons.forEach(function (b, i) { b.addEventListener('click', function () { open(i, b); }); });
    dlg.addEventListener('click', function (e) {
      var act = e.target.closest('[data-lb]');
      if (act) {
        var a = act.dataset.lb;
        if (a === 'close') dlg.close();
        else if (a === 'prev') show(index - 1);
        else if (a === 'next') show(index + 1);
        return;
      }
      if (e.target === dlg) dlg.close();   // backdrop
    });
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); show(index - 1); }
    });
    dlg.addEventListener('close', function () {
      body.classList.remove('is-locked');
      if (opener) opener.focus();
    });
  })();

  /* ======================================================================
     VISIT — the current day highlights in Clay from the client clock. If we
     are open now, OPEN NOW; otherwise the next opening time. Deterministic
     and pure: read the clock once, write two things.
     ====================================================================== */
  (function hours() {
    var rows = Array.prototype.slice.call(doc.querySelectorAll('.hours__row'));
    var status = doc.getElementById('hours-status');
    if (!rows.length) return;
    var now = new Date();
    var day = now.getDay(), mins = now.getHours() * 60 + now.getMinutes();
    var toMin = function (s) { var p = s.split(':'); return parseInt(p[0], 10) * 60 + parseInt(p[1], 10); };
    var fmt = function (s) { var p = s.split(':'); return String(parseInt(p[0], 10)) + ':' + p[1]; };
    var rowFor = function (d) {
      for (var i = 0; i < rows.length; i++) {
        if (rows[i].dataset.days.split(',').indexOf(String(d)) !== -1) return rows[i];
      }
      return null;
    };
    var today = rowFor(day);
    if (today) today.classList.add('is-today');
    if (!status || !today) return;
    var openAt = toMin(today.dataset.open), closeAt = toMin(today.dataset.close);
    if (mins >= openAt && mins < closeAt) status.textContent = 'OPEN NOW';
    else if (mins < openAt) status.textContent = 'OPENS ' + fmt(today.dataset.open);
    else {
      var tomorrow = rowFor((day + 1) % 7);
      status.textContent = 'OPENS ' + fmt((tomorrow || today).dataset.open) + ' TOMORROW';
    }
  })();

  /* ======================================================================
     FOOTER — the email link copies the address; COPIED replaces the text
     for 1.5s. Falls through to mailto: where the clipboard is unavailable.
     ====================================================================== */
  (function copyEmail() {
    var link = doc.querySelector('.copy[data-copy]');
    if (!link || !navigator.clipboard) return;
    var t = null;
    link.addEventListener('click', function (e) {
      e.preventDefault();
      navigator.clipboard.writeText(link.dataset.copy).then(function () {
        link.classList.add('is-copied');
        clearTimeout(t);
        t = setTimeout(function () { link.classList.remove('is-copied'); }, 1500);
      }).catch(function () { window.location.href = link.getAttribute('href'); });
    });
  })();
})();
