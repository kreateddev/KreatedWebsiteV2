/* ==========================================================================
   STEP 5 PROTOTYPE — NOT PRODUCTION
   Kreated V2 · EVERY SURFACE hero motion

   SET TRUE — three behaviours only:
     UNCOVER  a clip-path mask edge travels across content that is already there
     SEAT     a weighted landing with one decisive stop
     ALIGN    edges and hairlines resolving into precise register

   Rules honoured here:
     · autoplay once, no loop, no scroll-scrub, no gating of copy or CTAs
     · transform / opacity / clip-path only — no layout animation
     · prefers-reduced-motion, no-JS and save-data all render the final state
     · the desktop surface never moves and never leaves the screen
     · the shared photograph stays in register while its surface moves, by
       counter-translating .photo-plane--mobile against .surface--mobile
   ========================================================================== */
(function () {
  'use strict';

  var root  = document.documentElement;
  var stage = document.querySelector('.stage');
  if (!stage) return;

  var $ = function (s) { return stage.querySelector(s); };

  /* ---------- easings ---------------------------------------------------- */
  var UNCOVER = 'cubic-bezier(.42,.10,.22,1)';   /* mask edge travel          */
  var REFLOW  = 'cubic-bezier(.32,.58,.24,1)';   /* content re-laying out     */
  var SEAT    = 'cubic-bezier(.30,.62,.20,1)';   /* weighted stop, no bounce  */
  var ALIGN   = 'cubic-bezier(.62,.02,.16,1)';   /* decisive final register   */

  /* ---------- should we animate at all? ---------------------------------- */
  var narrow    = window.matchMedia('(max-width: 860px)').matches;
  var reduce    = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var conn      = navigator.connection || {};
  var saveData  = !!conn.saveData;
  var lowPower  = (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
                  (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

  /* Narrow + low-power renders fully static, per the mobile spec. */
  var still = reduce || saveData || (narrow && lowPower);

  /* ---------- fit the stage to the viewport ------------------------------
     Kept in script because CSS cannot divide a length by a length reliably.
     styles.css carries stepped fallbacks so the no-JS composition is right. */
  var zone = document.querySelector('.zone--artifact');
  function fit() {
    if (!zone) return;
    var isNarrow = window.matchMedia('(max-width: 860px)').matches;
    var vw = window.innerWidth, vh = window.innerHeight, k;
    if (isNarrow) {
      k = Math.min((vw - 44) / 300, 1.30);
    } else {
      k = Math.min(vw / 1560, (vh - 200) / 700, 1.06);
    }
    k = Math.max(k, 0.46);
    zone.style.setProperty('--k', k);
    zone.style.height = ((isNarrow ? 540 : 700) * k) + 'px';
    alignCopyBaseline(isNarrow, k);
  }

  /* ALIGN, applied to layout rather than to motion: nudge the copy block so the
     Kreated route row sits on exactly the same baseline as the CLIENT'S OWN CTA
     row inside the desktop surface (stage y 490.4). That is a felt alignment
     across the whole composition rather than a drawn line across the gutter, and
     it needs only a small nudge, so the two blocks stay optically balanced.
     Without JS both are simply centred — a correct fallback, not a break. */
  var copyZone = document.querySelector('.zone--copy');
  var routes   = document.querySelector('.k-routes');
  function alignCopyBaseline(isNarrow, k) {
    if (!copyZone || !routes || !zone) return;
    copyZone.style.transform = '';
    if (isNarrow) return;
    var baselineY = zone.getBoundingClientRect().top + (7.5 + 490.4) * k;
    var delta = baselineY - routes.getBoundingClientRect().bottom;
    if (delta > 60) delta = 60; else if (delta < -60) delta = -60;
    copyZone.style.transform = 'translateY(' + Math.round(delta) + 'px)';
  }
  fit();
  /* the first pass measures before the row height has fully settled, so run it
     again once layout and webfonts are done — it converges in one more pass */
  window.setTimeout(fit, 0);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  root.classList.add('js-fit');   /* the copy block is now baseline-aligned */
  window.addEventListener('resize', fit);
  window.addEventListener('orientationchange', fit);
  /* a resize event is not guaranteed for every viewport change (device
     emulation, zoom, dynamic toolbars), so observe the element too */
  if (window.ResizeObserver) new ResizeObserver(fit).observe(document.documentElement);

  function settle() {
    root.classList.remove('js-motion');
    /* one tick later, so applying the hover transition can never itself
       animate the jump back from a "from" state */
    window.setTimeout(function () { stage.classList.add('is-resolved'); }, 30);
  }

  if (still) { settle(); return; }

  /* ---------- timeline --------------------------------------------------- */
  var running = [];

  /* fill defaults to 'both' so an animation holds its "from" state through its
     delay. Anything that is the SECOND animation of a property on the same
     element must pass 'forwards', or its backwards fill would override the
     earlier animation's "from" state from t=0. */
  function play(el, frames, duration, delay, easing, fill) {
    if (!el) return;
    var a = el.animate(frames, {
      duration: duration,
      delay: delay,
      easing: easing || 'linear',
      fill: fill || 'both'
    });
    running.push(a);
    return a;
  }

  /* a hard cut with no visible fade — used only for brand hand-offs */
  function cutIn(el, at) {
    play(el, [{ opacity: 0 }, { opacity: 1 }], 1, at, 'linear');
  }

  function buildWide() {
    var t = { end: 2450 };

    /* One transform animation per moving surface spans seat -> hold -> align.
       Offsets are expressed as fractions of that single span. */
    var SPAN     = 2050,                      /* 0.40s -> 2.45s              */
        SEAT_IN  = (880  - 400) / 2050,       /* seat begins                 */
        SEAT_OUT = (1200 - 400) / 2050,       /* seat lands, residual held   */
        ALIGN_IN = (2050 - 400) / 2050;       /* collective align begins     */

    var SE_SPAN  = 1100,                      /* 1.35s -> 2.45s              */
        SE_SEAT  = (1910 - 1350) / 1100,
        SE_ALIGN = (2050 - 1350) / 1100;

    /* --- 0.00–0.40s · hold. The desktop surface and all copy are already
           painted and static. Nothing is scheduled here. ------------------- */

    /* --- 0.40–1.20s · DESKTOP → MOBILE ------------------------------------
           1. a tall phone-proportioned mask UNCOVERS downward, in place, with
              the photograph behind it already in exact register with the
              desktop — so the column reads as drawn out of the desktop, not
              as a second picture arriving.                                   */
    play($('.surface--mobile'),
      [{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)' }],
      480, 400, UNCOVER);

    /*     2. the brand block travels a visible path out of the desktop nav
              and into the emerging surface (match-move: it starts exactly on
              top of the desktop logo, which itself never moves).             */
    play($('.hop--1'), [
      { opacity: 1, transform: 'translate(183.22px,-62.9px) scale(1.9603)' },
      { opacity: 1, transform: 'translate(0px,10px) scale(1)', offset: .97 },
      { opacity: 0, transform: 'translate(0px,10px) scale(1)' }
    ], 420, 460, REFLOW);
    cutIn($('.mb-logo'), 879);

    /*     3. content visibly reflows into LLEC's real mobile layout:
              headline re-stacks smaller and centres, support and points
              centre, the media block moves below the copy, and the two
              buttons stop sitting side by side and stack full-width.        */
    cutIn($('.mb-nav'), 619);   /* the scrim arrives with the content, not before */
    play($('.mb-h1'),
      [{ transform: 'translate(637.9px,168.1px) scale(2.528)' }, { transform: 'none' }],
      400, 620, REFLOW);
    play($('.mb-sub'),
      [{ transform: 'translate(565.7px,279.3px) scale(1.637)' }, { transform: 'none' }],
      380, 670, REFLOW);
    play($('.mb-points'),
      [{ transform: 'translate(427px,337.8px) scale(1.396)' }, { transform: 'none' }],
      360, 710, REFLOW);
    play($('.mb-media'),
      [{ transform: 'translate(560px,90px) scale(1.5)' }, { transform: 'none' }],
      380, 740, REFLOW);
    play($('.mb-btn--solid'),
      [{ transform: 'translate(431.3px,190.3px) scale(1.211)' }, { transform: 'none' }],
      340, 790, REFLOW);
    play($('.mb-btn--outline'),
      [{ transform: 'translate(771.5px,132.3px) scale(1.172)' }, { transform: 'none' }],
      340, 840, REFLOW);

    /*     4. the nav condenses — the wide "Call a Leak Detection Expert /
              (919) 633-4975" block stays visible on the desktop behind, while
              the phone resolves to a single compact Call affordance.        */
    play($('.mb-navline'), [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
      300, 880, UNCOVER);
    play($('.mb-call'),
      [{ clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)' }],
      240, 900, UNCOVER);

    /*     5. SEAT (0.88–1.20s) then ALIGN (2.05–2.45s), authored as ONE
              animation per element so a finished sub-beat can never be
              auto-removed and snap the element back to its CSS value.
              The surface holds a 10px residual through the search beat and
              gives it up in the collective align. The photograph
              counter-translates by exactly the same amount at every step, so
              it never breaks register while its surface moves.              */
    play($('.surface--mobile'), [
      { transform: 'translate(-16px,20px)', offset: 0,      easing: SEAT  },
      { transform: 'translate(-16px,20px)', offset: SEAT_IN, easing: SEAT },
      { transform: 'translate(0px,10px)',   offset: SEAT_OUT             },
      { transform: 'translate(0px,10px)',   offset: ALIGN_IN, easing: ALIGN },
      { transform: 'translate(0px,0px)',    offset: 1                     }
    ], SPAN, 400, 'linear');
    play($('.photo-plane--mobile'), [
      { transform: 'translate(29px,-36.2px)',  offset: 0,      easing: SEAT },
      { transform: 'translate(29px,-36.2px)',  offset: SEAT_IN, easing: SEAT },
      { transform: 'translate(0px,-18.1px)',   offset: SEAT_OUT             },
      { transform: 'translate(0px,-18.1px)',   offset: ALIGN_IN, easing: ALIGN },
      { transform: 'translate(0px,0px)',       offset: 1                     }
    ], SPAN, 400, 'linear');

    /* --- 1.20–1.35s · micro-hold. Nothing is scheduled. ------------------- */

    /* --- 1.35–2.05s · MOBILE → SEARCH -------------------------------------
           dealt from the phone's lower edge; the smallest and quietest of the
           three; overlaps the phone's corner and crosses the desktop's
           bottom edge, so nothing in the composition floats alone.          */
    play($('.surface--search'),
      [{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)' }],
      420, 1350, UNCOVER);
    play($('.surface--search'), [
      { transform: 'translate(34px,-46px) scale(.965)', offset: 0,        easing: SEAT },
      { transform: 'translate(-12px,0px) scale(1)',     offset: SE_SEAT                },
      { transform: 'translate(-12px,0px) scale(1)',     offset: SE_ALIGN, easing: ALIGN },
      { transform: 'translate(0px,0px) scale(1)',       offset: 1                      }
    ], SE_SPAN, 1350, 'linear');

    /*     the brand block makes its third and final hop.                     */
    play($('.hop--2'), [
      { opacity: 1, transform: 'translate(-7px,-383px) scale(1.6667)' },
      { opacity: 1, transform: 'translate(-12px,0px) scale(1)', offset: .97 },
      { opacity: 0, transform: 'translate(-12px,0px) scale(1)' }
    ], 320, 1400, REFLOW);
    cutIn($('.se-logo'), 1719);

    /* --- 2.05–2.50s · COLLECTIVE ALIGN ------------------------------------
           all three surfaces take out their residual offsets together and the
           shared hairlines draw taut. Then everything stops.                */
    /*     the surfaces' own residual offsets resolve inside the single
              transform animations authored above; here the hairlines draw. */
    play($('.rule--h1'), [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], 350, 2100, ALIGN);
    play($('.rule--v1'), [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], 350, 2100, ALIGN);
    play($('.rule--h2'), [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], 300, 2150, ALIGN);

    return t;
  }

  /* ---------- narrow viewport: one entrance, under a second --------------- */
  function buildNarrow() {
    play($('.surface--mobile'),
      [{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)' }],
      440, 120, UNCOVER);

    play($('.sliver'),
      [{ clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)' }],
      340, 260, UNCOVER);

    play($('.surface--search'),
      [{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)' }],
      360, 440, UNCOVER);
    play($('.surface--search'),
      [{ transform: 'translate(20px,-30px) scale(.97)' }, { transform: 'none' }],
      420, 440, SEAT);

    play($('.rule--h1'), [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], 260, 600, ALIGN);
    play($('.rule--v1'), [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], 260, 600, ALIGN);
    play($('.rule--h2'), [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], 240, 640, ALIGN);

    return { end: 900 };
  }

  function run() {
    running.forEach(function (a) { a.cancel(); });
    running = [];
    stage.classList.remove('is-resolved');
    root.classList.add('js-motion');

    var t = narrow ? buildNarrow() : buildWide();

    /* the animations' backwards fill already holds the "from" state, so the
       class can come off with no flash */
    root.classList.remove('js-motion');

    window.setTimeout(function () {
      running.forEach(function (a) { a.cancel(); });   /* CSS default === final state */
      running = [];
      stage.classList.add('is-resolved');              /* hard stop. no loop. */
    }, t.end + 30);
  }

  /* Start once the first paint is genuinely complete — copy and CTAs are in
     the document from the beginning either way and are never gated by this.
     A hidden tab never fires requestAnimationFrame, so the sequence waits for
     visibility rather than hanging in its "from" state, and a failsafe drops
     straight to the finished composition if it somehow never starts. */
  var started = false;

  function kick() {
    if (started) return;
    started = true;
    /* a hidden tab never fires requestAnimationFrame, so don't wait on one */
    if (window.requestAnimationFrame && document.visibilityState !== 'hidden') requestAnimationFrame(run);
    else run();
  }

  function start() {
    var ready = window.Promise
      ? Promise.race([
          Promise.all([
            new Promise(function (r) {
              if (document.readyState === 'complete') r();
              else window.addEventListener('load', r, { once: true });
            }),
            document.fonts ? document.fonts.ready : Promise.resolve()
          ]),
          new Promise(function (r) { window.setTimeout(r, 1800); })
        ])
      : null;

    if (ready) ready.then(kick); else kick();

    /* never leave the artifact half-built */
    window.setTimeout(function () { if (!started) { started = true; settle(); } }, 6000);
  }

  start();

  /* Review affordance only — no control is rendered, and nothing about the
     design depends on it. Press R to replay while judging the prototype. */
  window.addEventListener('keydown', function (e) {
    if ((e.key === 'r' || e.key === 'R') && !e.metaKey && !e.ctrlKey && !e.altKey) { started = true; run(); }
  });
})();
