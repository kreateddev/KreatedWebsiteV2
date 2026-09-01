/* ==========================================================================
   KREATED V2 — BELOW-THE-HERO BEHAVIOUR
   Everything under the hero that needs state. The hero is FROZEN and owned
   entirely by hero.js — nothing in this file touches it.

   Four behaviours, all state — no scroll-linked motion anywhere:
     1. Services Index + Stage (hover/focus on desktop, accordion on mobile —
        the ONE stage element is re-seated beneath the active row on touch)
     2. How-It-Works stepper (click to jump; one gentle auto-advance pass
        that stops forever on first interaction; never runs under
        prefers-reduced-motion)
     3. FAQ accordion (one open at a time; native <details> still works
        without this file)
     4. Add-ons tray

   Everything degrades: with this file absent, service scene 01, process
   step 1's visual, all FAQ items and the add-ons list content remain
   reachable or visible in their no-JS states.
   ========================================================================== */
(function () {
  'use strict';

  var mq = window.matchMedia
         ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function reduced() { return mq ? mq.matches : false; }

  /* ======================================================================
     1 · SERVICES — INDEX + STAGE
     ====================================================================== */
  (function services() {
    var stage = document.getElementById('svcStage');
    var items = Array.prototype.slice.call(document.querySelectorAll('.svc__item'));
    if (!stage || !items.length) return;

    var grid = stage.closest('.svc__grid');
    var desktopSlot = stage.parentNode === grid ? null : stage.parentNode;
    /* remember where the stage lives on desktop so it can go home */
    var homeParent = stage.parentNode;
    var homeNext = stage.nextSibling;

    var mobile = window.matchMedia('(max-width: 900px)');

    function setActive(idx, seat) {
      items.forEach(function (li, i) {
        var on = i === idx;
        li.classList.toggle('is-active', on);
        var btn = li.querySelector('.svc__row');
        if (btn) btn.setAttribute('aria-expanded', String(on));
      });
      stage.setAttribute('data-active', String(idx));
      if (seat && mobile.matches) {
        /* accordion: the one stage panel re-seats beneath the active row */
        items[idx].appendChild(stage);
      }
    }

    function seatForViewport() {
      if (mobile.matches) {
        var idx = parseInt(stage.getAttribute('data-active') || '0', 10);
        items[idx].appendChild(stage);
      } else if (homeParent) {
        homeParent.insertBefore(stage, homeNext);
      }
    }

    items.forEach(function (li, i) {
      var btn = li.querySelector('.svc__row');
      if (!btn) return;
      /* desktop: hover or keyboard focus activates; click also activates
         (touch fires click) — one input model, no hover dependency */
      btn.addEventListener('click', function () { setActive(i, true); });
      btn.addEventListener('mouseenter', function () {
        if (!mobile.matches) setActive(i, false);
      });
      btn.addEventListener('focus', function () {
        if (!mobile.matches) setActive(i, false);
      });
    });

    if (mobile.addEventListener) mobile.addEventListener('change', seatForViewport);
    else if (mobile.addListener) mobile.addListener(seatForViewport);
    seatForViewport();
  })();

  /* ======================================================================
     2 · HOW IT WORKS — stepper + accumulating visualization
     ====================================================================== */
  (function process() {
    var viz = document.getElementById('procViz');
    var items = Array.prototype.slice.call(document.querySelectorAll('.proc__item'));
    if (!viz || !items.length) return;

    var section = viz.closest('.proc');
    var mobile = window.matchMedia('(max-width: 900px)');
    var timer = null;
    var interacted = false;

    function setStep(idx) {
      items.forEach(function (li, i) {
        li.classList.toggle('is-active', i === idx);
        /* completed steps STAY lit — the process accumulates */
        li.classList.toggle('is-on', i <= idx);
        var btn = li.querySelector('.proc__row');
        if (btn) {
          if (i === idx) btn.setAttribute('aria-current', 'step');
          else btn.removeAttribute('aria-current');
        }
      });
      viz.setAttribute('data-step', String(idx + 1));
    }

    function stopAuto() {
      if (timer) { clearInterval(timer); timer = null; }
      if (section) section.classList.remove('proc--auto');
    }

    items.forEach(function (li, i) {
      var btn = li.querySelector('.proc__row');
      if (!btn) return;
      btn.addEventListener('click', function () {
        interacted = true;
        stopAuto();
        setStep(i);
      });
    });

    /* Reduced motion rests on step 1 — the natural first state — rather than
       jumping to the end. Every step is still marked is-on so nothing reads as
       suppressed: the only thing removed is the advance, not the content.
       Checked before the mobile branch so a reduced-motion phone gets this too.

       Mobile (normal motion): no auto-advance; render the complete final state
       statically. Desktop: one pass, 1 -> 5, then it rests. */
    if (reduced()) {
      setStep(0);
      items.forEach(function (li) { li.classList.add('is-on'); });
      return;
    }
    if (mobile.matches) {
      setStep(items.length - 1);
      return;
    }

    /* Rest on step 1 until the reader actually gets here. The interval used
       to start at load, and on a page this tall the whole 1 -> 5 sequence had
       played out roughly 20s before the section ever came into view — so a
       reader scrolling down arrived at a process that had already finished
       without them.

       The observer uses a -25% top/bottom rootMargin instead of a visibility
       threshold: it fires when the step list enters the middle band of the
       viewport, which behaves identically whether the list is shorter or
       taller than the screen (a threshold like 0.4 can never fire on a list
       taller than the viewport). It runs once, then disconnects — the pass
       still rests when it reaches 5 and still stops forever on interaction. */
    function startAuto() {
      if (timer || interacted) return;
      var current = 0;
      setStep(current);
      if (section) section.classList.add('proc--auto');
      timer = setInterval(function () {
        if (interacted) { stopAuto(); return; }
        /* a backgrounded tab must not burn through the sequence either */
        if (document.hidden) return;
        current++;
        if (current >= items.length) { stopAuto(); return; }
        setStep(current);
      }, 5000);
    }

    setStep(0);

    var watch = (section && section.querySelector('.proc__steps')) || viz;
    if (!('IntersectionObserver' in window)) { startAuto(); return; }

    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) { io.disconnect(); startAuto(); return; }
      }
    }, { rootMargin: '-25% 0px -25% 0px', threshold: 0 });
    io.observe(watch);
  })();

  /* ======================================================================
     3 · FAQ — one open at a time
     ====================================================================== */
  (function faq() {
    var all = Array.prototype.slice.call(document.querySelectorAll('.qa'));
    if (!all.length) return;
    all.forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (!d.open) return;
        all.forEach(function (other) {
          if (other !== d) other.open = false;
        });
      });
    });
  })();

  /* ======================================================================
     4 · INVESTMENT — engagement accordion (approved 2026-08-27).
     One engagement open at a time; re-click collapses. Expansion is
     max-height animated in CSS (.offer__x); this only toggles state.
     ====================================================================== */
  (function offers() {
    var list = Array.prototype.slice.call(document.querySelectorAll('.offer'));
    if (!list.length) return;
    list.forEach(function (offer) {
      var btn = offer.querySelector('.offer__see');
      if (!btn) return;
      btn.addEventListener('click', function () {
        var open = offer.classList.contains('is-open');
        list.forEach(function (o) {
          o.classList.remove('is-open');
          var b = o.querySelector('.offer__see');
          if (b) b.setAttribute('aria-expanded', 'false');
        });
        if (!open) {
          offer.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  })();
})();
