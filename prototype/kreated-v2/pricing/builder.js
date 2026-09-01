/* ==========================================================================
   KREATED — BUILD YOUR PACKAGE
   The DOM layer, and only the DOM layer. Every price, rule and recommendation
   comes from assets/data/offers.js and assets/data/recommend.js.

   🚫 No pricing logic in this file. If you find yourself adding a number here,
   it belongs in offers.js and the tests belong in tools/test-engine.js.

   PROGRESSIVE ENHANCEMENT. The markup ships with a working no-script state:
   two real links to /contact/ and /pricing/. This script hides that and shows
   the configurator only once it has proven it can run. 🚫 Do not author the
   configurator in HTML and hide it with CSS — a keyboard user without script
   would tab through a dead form.
   ========================================================================== */
(function () {
  'use strict';

  var Offers = window.KreatedOffers, Rec = window.KreatedRecommend;
  var root = document.getElementById('byp');
  if (!Offers || !Rec || !root) return;

  var app   = root.querySelector('.byp__app');
  var nojs  = root.querySelector('.byp__nojs');
  if (!app || !nojs) return;

  var STORE = 'kreated.build.v1';
  var selection = {};

  /* ---- state -----------------------------------------------------------
     sessionStorage, not the URL. The brief asks that refresh and back both
     survive without a giant JSON blob in the address bar, and that returning
     from /contact/ keeps the build. One key does all three. */
  try {
    var saved = sessionStorage.getItem(STORE);
    if (saved) selection = JSON.parse(saved) || {};
  } catch (e) { selection = {}; }

  function persist() {
    try { sessionStorage.setItem(STORE, JSON.stringify(selection)); } catch (e) {}
  }

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) {
    return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]; }); }

  /* ---- price rendering -------------------------------------------------
     "from" and ranges survive to the screen. A total that contains a from
     price is a from total; it is never presented as a quote. */
  function tag(o) {
    var p = Rec.money(o.price);
    if (o.high) p = Rec.money(o.price) + '&ndash;' + Rec.money(o.high);
    if (o.kind === 'monthly') p += '/mo';
    else if (o.unit) p += '/' + o.unit;
    var pre = o.from ? 'from ' : '';
    var post = o.plusThirdParty ? ' + third-party costs' : (o.plus ? '+' : '');
    return pre + p + post;
  }

  /* =====================================================================
     RENDER — the picker
     ===================================================================== */
  function buildPicker() {
    var html = '';
    Offers.groups.forEach(function (g) {
      var items = Offers.inGroup(g.id);
      if (!items.length) return;
      var exclusive = items[0].exclusive;
      html += '<fieldset class="bg">' +
              '<legend class="bg__legend"><span class="bg__name">' + esc(g.label) + '</span>' +
              '<span class="bg__hint">' + esc(g.hint) + '</span></legend>';
      items.forEach(function (o) {
        var type = o.exclusive ? 'radio' : 'checkbox';
        var nm   = o.exclusive ? ('grp-' + o.exclusive) : ('opt-' + o.id);
        html +=
          '<div class="bo" data-id="' + o.id + '">' +
            '<label class="bo__pick">' +
              '<input type="' + type + '" name="' + nm + '" value="' + o.id + '"' +
                    ' class="bo__input" data-id="' + o.id + '">' +
              '<span class="bo__box" aria-hidden="true"></span>' +
              '<span class="bo__text">' +
                '<span class="bo__name">' + esc(o.name) + '</span>' +
                '<span class="bo__price">' + tag(o) + '</span>' +
              '</span>' +
            '</label>' +
            '<div class="bo__detail">' +
              '<p class="bo__what">' + esc(o.what) + '</p>' +
              '<p class="bo__does"><b>What it can do:</b> ' + esc(o.does) + '</p>' +
              '<p class="bo__fit"><b>Good fit if:</b> ' + esc(o.fit) + '</p>' +
              (o.note ? '<p class="bo__caveat">' + esc(o.note) + '</p>' : '') +
              (o.term ? '<p class="bo__caveat">' + esc(o.term) + '</p>' : '') +
            '</div>' +
            (o.qty ?
              '<div class="bo__qty" hidden>' +
                '<button type="button" class="bo__step" data-step="-1"' +
                       ' aria-label="One fewer ' + esc(o.name) + '">&minus;</button>' +
                '<label class="bo__qtylab"><span class="sr-only">Number of ' + esc(o.name) + '</span>' +
                  '<input type="number" class="bo__num" min="1" max="40" step="1" value="1"' +
                        ' inputmode="numeric" data-id="' + o.id + '"></label>' +
                '<button type="button" class="bo__step" data-step="1"' +
                       ' aria-label="One more ' + esc(o.name) + '">+</button>' +
                '<span class="bo__unit">' + esc(o.unit || '') + 's</span>' +
              '</div>' : '') +
            '<p class="bo__flag" hidden></p>' +
          '</div>';
      });
      html += '</fieldset>';
      if (exclusive) {
        html = html.replace(/<\/fieldset>$/,
          '<p class="bg__clear"><button type="button" class="bg__clearbtn" data-clear="' +
          exclusive + '">Clear ' + esc(Offers.exclusive[exclusive]) + '</button></p></fieldset>');
      }
    });
    root.querySelector('.byp__picker').innerHTML = html;
  }

  /* =====================================================================
     RENDER — Your Project
     ===================================================================== */
  function renderSummary(r) {
    var box = root.querySelector('.byp__sumbody');
    if (r.verdict === 'empty') {
      box.innerHTML = '<p class="bs__empty">Nothing selected yet. Choose what the business ' +
        'needs and the estimate builds here.</p>';
      root.querySelector('.byp__go').setAttribute('disabled', 'disabled');
      return;
    }
    root.querySelector('.byp__go').removeAttribute('disabled');

    var out = '<ul class="bs__lines">';
    r.lines.forEach(function (l) {
      var amount;
      if (l.included) amount = '<em>Included</em>';
      else if (l.range) amount = Rec.money(l.low) + '&ndash;' + Rec.money(l.high);
      else amount = Rec.money(l.low) + (l.kind === 'monthly' ? '/mo' : '');
      out += '<li class="bs__line' + (l.included ? ' is-included' : '') + '">' +
             '<span class="bs__nm">' + esc(l.name) +
             (l.qty > 1 ? ' <i>&times;' + l.qty + '</i>' : '') + '</span>' +
             '<span class="bs__amt">' + amount + '</span>' +
             (l.included ? '<span class="bs__note">Included in ' + esc(l.included.byName) + '</span>' : '') +
             (l.floored ? '<span class="bs__note">Project minimum applies</span>' : '') +
             '</li>';
    });
    out += '</ul>';

    /* ⚠ one-time and monthly are two totals, always. Never one number. */
    if (r.oneTime.low > 0) {
      var ot = r.oneTime.hasRange && r.oneTime.high !== r.oneTime.low
        ? Rec.money(r.oneTime.low) + '&ndash;' + Rec.money(r.oneTime.high)
        : Rec.money(r.oneTime.low);
      out += '<div class="bs__total"><span class="bs__tl">' +
             (r.oneTime.isFrom || r.oneTime.hasRange ? 'Estimated from' : 'One-time estimate') +
             '</span><span class="bs__tv">' + ot + '</span></div>';
      if (r.oneTime.thirdParty)
        out += '<p class="bs__sub">Plus the photographer&rsquo;s own fee, billed to you directly and never marked up.</p>';
    }
    if (r.monthly.low > 0) {
      out += '<div class="bs__total bs__total--mo"><span class="bs__tl">Ongoing</span>' +
             '<span class="bs__tv">' + Rec.money(r.monthly.low) + '/mo</span></div>';
    }
    box.innerHTML = out;
  }

  /* =====================================================================
     RENDER — the fit verdict
     ===================================================================== */
  function renderVerdict(r) {
    var el = root.querySelector('.byp__verdict');
    if (r.verdict === 'empty') { el.innerHTML = ''; el.hidden = true; return; }
    el.hidden = false;
    var m = r.match, h = '';

    if (r.verdict === 'combined') {
      h = '<h4 class="bv__h">' + esc(m.offer.name) + ' is the better fit</h4>' +
          '<p class="bv__p">You have chosen a brand tier and a website engagement. Run together they are ' +
          Rec.money(m.offer.price) + '&ndash;' + Rec.money(m.offer.high) + '+, scoped as one project.</p>' +
          /* 🚫 no saving, ever. The page says buying separately costs about
             the same and a matcher must not contradict the page. */
          '<p class="bv__why">Why: ' + esc(m.why) + ' Bought separately it costs about the same. ' +
          'The reason to combine them is the order of the work, not the price.</p>';
    } else if (r.verdict === 'package') {
      h = '<h4 class="bv__h">' + esc(m.offer.name) + ' is the better fit</h4>' +
          '<p class="bv__p">Your selections overlap heavily with what ' + esc(m.offer.name) + ' already includes.</p>' +
          '<dl class="bv__cmp">' +
            '<div><dt>Selected individually</dt><dd>' + Rec.money(m.separately) + '</dd></div>' +
            '<div><dt>' + esc(m.offer.name) + '</dt><dd>' + Rec.money(m.offer.price) + '</dd></div>' +
            (m.saving > 0
              ? '<div class="bv__win"><dt>Difference</dt><dd>' + Rec.money(m.saving) + ' less</dd></div>'
              : '') +
          '</dl>' +
          (m.saving > 0
            ? '<p class="bv__why">The difference is the two approved prices, nothing else.</p>'
            : '<p class="bv__why">' + esc(m.offer.name) + ' costs more than these pieces bought separately. ' +
              'What it adds is the research that decides what to build.</p>');
    } else if (r.verdict === 'compare') {
      h = '<h4 class="bv__h">' + esc(m.offer.name) + ' is worth comparing</h4>' +
          '<p class="bv__p">It covers some of what you have chosen but not all of it. ' +
          'The rest would still be scoped separately.</p>';
    } else if (r.verdict === 'chosen') {
      var p = r.primary;
      h = '<h4 class="bv__h">' + esc(p ? p.name + ' is your engagement' : 'Your selections fit together') + '</h4>' +
          '<p class="bv__p">Nothing you have chosen is better bought a different way, and nothing ' +
          'overlaps into a second charge.</p>';
    } else {
      /* 🚫 Do not force everyone into a package. */
      h = '<h4 class="bv__h">Individual services are the better fit</h4>' +
          '<p class="bv__p">Nothing here is better bought as a package. What you have chosen is ' +
          'what you need, and a larger engagement would be paying for scope you have not asked for.</p>';
    }
    el.innerHTML = h;
  }

  /* =====================================================================
     RENDER — per-row guidance
     ===================================================================== */
  function renderFlags(r) {
    root.querySelectorAll('.bo').forEach(function (row) {
      var id = row.getAttribute('data-id');
      var flag = row.querySelector('.bo__flag');
      var g = r.guidance[id];
      row.classList.toggle('is-included', !!(r.included[id]));
      if (g) {
        flag.textContent = g.text;
        flag.className = 'bo__flag bo__flag--' + g.tone;
        flag.hidden = false;
      } else { flag.hidden = true; flag.textContent = ''; }
    });
  }

  /* =====================================================================
     RENDER — the mobile bar and the polite status line
     ===================================================================== */
  var statusTimer = null;
  function renderStatus(r) {
    var bar = root.querySelector('.byp__bar');
    var n = r.lines.filter(function (l) { return !l.included; }).length;
    var bits = [];
    if (r.oneTime.low) bits.push('from ' + Rec.money(r.oneTime.low));
    if (r.monthly.low) bits.push(Rec.money(r.monthly.low) + '/mo');
    bar.querySelector('.byp__barcount').textContent =
      n ? (n + (n === 1 ? ' service' : ' services') + (bits.length ? ' · ' + bits.join(' · ') : ''))
        : 'Nothing selected yet';
    bar.hidden = false;

    /* ⚠ aria-live on ONE short sentence, debounced. Announcing the whole
       summary on every keystroke of a quantity field would make the page
       unusable with a screen reader. */
    if (statusTimer) clearTimeout(statusTimer);
    statusTimer = setTimeout(function () {
      root.querySelector('.byp__status').textContent =
        n ? (n + ' selected. ' + bits.join(', ') + '.') : 'Nothing selected.';
    }, 700);
  }

  /* =====================================================================
     the loop
     ===================================================================== */
  function update() {
    persist();
    var r = Rec.evaluate(selection);
    renderSummary(r);
    renderVerdict(r);
    renderFlags(r);
    renderStatus(r);
    root.__result = r;
  }

  function syncControls() {
    root.querySelectorAll('.bo__input').forEach(function (input) {
      var id = input.getAttribute('data-id');
      var on = !!selection[id];
      input.checked = on;
      var row = input.closest('.bo');
      row.classList.toggle('is-on', on);
      var qty = row.querySelector('.bo__qty');
      if (qty) {
        qty.hidden = !on;
        var num = qty.querySelector('.bo__num');
        if (on) num.value = selection[id];
      }
    });
  }

  function setOffer(id, on, qty) {
    var o = Offers.get(id); if (!o) return;
    if (on) {
      /* exclusivity: selecting one member clears the rest of its group */
      if (o.exclusive) {
        Offers.offers.forEach(function (other) {
          if (other.exclusive === o.exclusive && other.id !== id) delete selection[other.id];
        });
      }
      selection[id] = qty || selection[id] || 1;
    } else { delete selection[id]; }
    syncControls();
    update();
  }

  /* ---- events ---------------------------------------------------------- */
  root.addEventListener('change', function (e) {
    var input = e.target.closest('.bo__input');
    if (input) { setOffer(input.getAttribute('data-id'), input.checked); return; }
    var num = e.target.closest('.bo__num');
    if (num) {
      var id = num.getAttribute('data-id');
      var v = Math.max(1, Math.min(40, parseInt(num.value, 10) || 1));
      num.value = v; selection[id] = v; update();
    }
  });

  root.addEventListener('click', function (e) {
    var step = e.target.closest('.bo__step');
    if (step) {
      var row = step.closest('.bo'), id = row.getAttribute('data-id');
      var num = row.querySelector('.bo__num');
      var v = Math.max(1, Math.min(40, (parseInt(num.value, 10) || 1) + parseInt(step.getAttribute('data-step'), 10)));
      num.value = v; selection[id] = v; update();
      return;
    }
    var clear = e.target.closest('.bg__clearbtn');
    if (clear) {
      var grp = clear.getAttribute('data-clear');
      Offers.offers.forEach(function (o) { if (o.exclusive === grp) delete selection[o.id]; });
      syncControls(); update();
      return;
    }
    var view = e.target.closest('.byp__barlink');
    if (view) {
      e.preventDefault();
      root.querySelector('.byp__summary').scrollIntoView({ block:'start' });
      root.querySelector('.byp__sumh').focus();
    }
  });

  /* ---- the handoff ------------------------------------------------------
     Ids and quantities only. 🚫 No prices in the payload: a stale link would
     arrive quoting a number Kreated no longer charges. /contact/ re-derives
     everything from the same engine. */
  root.querySelector('.byp__go').addEventListener('click', function (e) {
    var r = root.__result;
    if (!r || r.verdict === 'empty') { e.preventDefault(); return; }
    try {
      sessionStorage.setItem('kreated.build.handoff.v1', JSON.stringify({
        selection: selection,
        match: r.match ? r.match.offer.id : null,
        at: 'builder'
      }));
    } catch (err) {}
  });

  /* ---- go ---------------------------------------------------------------- */
  buildPicker();
  syncControls();
  update();
  nojs.hidden = true;
  app.hidden = false;
}());
