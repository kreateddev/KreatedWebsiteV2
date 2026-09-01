/* ==========================================================================
   KREATED V2 — THE PRICING SWITCHER
   /pricing/ only. Two states: Packages (default) and Individual Services.

   ⚠ PROGRESSIVE ENHANCEMENT, NOT A TOGGLE ON A HIDDEN THING.
   Without this file the page is one long document with both panels open and
   every price present — which is exactly what it was before the switcher
   existed. The tablist itself is display:none until this script adds `is-live`
   to the section, because a tablist with no script behind it is a row of
   buttons that do nothing. 🚫 Do not hide the panels in CSS. The only thing
   that may hide a panel is this file, and only after it has proven it is
   running.

   ⚠ `hidden`, not opacity or a class. An inactive panel must leave the tab
   order completely: a keyboard user tabbing through Packages must never fall
   into an invisible Individual Services panel, and a screen reader must not
   read a catalog twice. `hidden` is the only thing that does all of that in
   one attribute.
   ========================================================================== */
(function () {
  'use strict';

  var sw = document.getElementById('pswitch');
  if (!sw) return;

  var tablist = sw.querySelector('[role="tablist"]');
  if (!tablist) return;

  var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
  if (tabs.length < 2) return;

  var panels = tabs.map(function (t) {
    return document.getElementById(t.getAttribute('aria-controls'));
  });
  /* if any panel is missing, leave the page in its no-script state rather than
     hiding content that has nothing to bring it back */
  for (var i = 0; i < panels.length; i++) { if (!panels[i]) return; }

  var section = sw.closest ? sw.closest('.invest') : null;
  if (section) section.classList.add('is-live');

  /* ⚠ Scroll preservation. Switching panels changes the document height by a
     couple of thousand pixels, so without this the browser keeps the raw
     scrollTop and the reader is thrown somewhere arbitrary. What is preserved
     is the position of the SWITCHER, not the scroll value: wherever the tabs
     were on screen before the swap, that is where they are after it. If the
     tabs were above the viewport the page lands on them instead, which is the
     only sensible answer when the thing you were reading no longer exists. */
  function select(idx, moveFocus) {
    var before = tablist.getBoundingClientRect().top;

    tabs.forEach(function (tab, i) {
      var on = (i === idx);
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
      panels[i].hidden = !on;
    });

    var after = tablist.getBoundingClientRect().top;
    var delta = after - before;
    if (delta) window.scrollBy(0, delta);
    if (before < 0) {
      /* the switcher had already scrolled off the top; bring it back into view
         rather than leaving the reader mid-panel with no controls visible */
      tablist.scrollIntoView({ block: 'start', behavior: 'auto' });
    }

    if (moveFocus) tabs[idx].focus();
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { select(i, false); });
  });

  /* Arrow keys move between tabs, Home and End jump to the ends. This is the
     documented tab pattern and keyboard users expect it; without it the two
     buttons are reachable only by tabbing, which is not how a tablist behaves. */
  tablist.addEventListener('keydown', function (e) {
    var cur = tabs.indexOf(document.activeElement);
    if (cur < 0) return;
    var next = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (cur + 1) % tabs.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (cur - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = tabs.length - 1;
    if (next < 0) return;
    e.preventDefault();
    select(next, true);
  });

  /* Deep links. /pricing/#panelIndividual, or any in-page link carrying
     data-tab, opens the right panel instead of scrolling to something hidden.
     Without this the "Start With A Package" button inside Individual Services
     would target a panel that is currently `hidden` and simply do nothing. */
  function byId(id) {
    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].id === id || tabs[i].getAttribute('aria-controls') === id) return i;
    }
    return -1;
  }
  function fromHash() {
    var h = (window.location.hash || '').replace('#', '');
    if (!h) return;
    var i = byId(h);
    if (i >= 0) { select(i, false); return; }
    /* a hash pointing at something INSIDE a panel should open that panel */
    var el = document.getElementById(h);
    if (!el) return;
    for (var p = 0; p < panels.length; p++) {
      if (panels[p].contains(el)) { select(p, false); break; }
    }
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('[data-tab]') : null;
    if (!a) return;
    var i = byId(a.getAttribute('data-tab'));
    if (i < 0) return;
    e.preventDefault();
    select(i, false);
    tablist.scrollIntoView({ block: 'start', behavior: 'auto' });
  });

  window.addEventListener('hashchange', fromHash);

  /* default state first, then let a hash override it */
  select(0, false);
  fromHash();
}());
