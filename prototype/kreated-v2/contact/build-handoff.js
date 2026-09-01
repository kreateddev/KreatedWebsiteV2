/* ==========================================================================
   KREATED — BUILD HANDOFF INTO /contact/
   Reads the configuration the visitor built on /pricing/ and does two things:
     1. shows it back to them, so they do not retype what they just chose
     2. writes it into the form as hidden fields, so the lead arrives usable

   ⚠ WHAT TRAVELS IS IDS AND QUANTITIES. Prices are re-derived here from the
   same engine. 🚫 Never carry a price across a boundary: a tab left open for a
   week would arrive quoting a number Kreated no longer charges.

   🚫 Nothing here may touch the form's existing behaviour. Netlify's build-time
   detection reads the STATIC markup, so every field this adds is invisible to
   it — which is exactly why the summary is written as hidden inputs at submit
   time rather than as markup Netlify would try to parse. The honeypot, the
   validation in forms.js, the JS-off POST and the contact_form_submit event
   are all untouched.
   ========================================================================== */
(function () {
  'use strict';

  var Offers = window.KreatedOffers, Rec = window.KreatedRecommend;
  if (!Offers || !Rec) return;

  var form = document.querySelector('form[name="project-enquiry"]');
  var slot = document.getElementById('buildSummary');
  if (!form || !slot) return;

  var payload = null;
  try {
    var raw = sessionStorage.getItem('kreated.build.handoff.v1');
    if (raw) payload = JSON.parse(raw);
  } catch (e) { return; }
  if (!payload || !payload.selection || !Object.keys(payload.selection).length) return;

  var r = Rec.evaluate(payload.selection);
  if (r.verdict === 'empty') return;

  /* ---- 1. show it back ------------------------------------------------- */
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) {
    return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]; }); }

  var rows = r.lines.map(function (l) {
    var amt = l.included ? 'included'
            : l.range ? Rec.money(l.low) + '–' + Rec.money(l.high)
            : Rec.money(l.low) + (l.kind === 'monthly' ? '/mo' : '');
    return '<li><span>' + esc(l.name) + (l.qty > 1 ? ' ×' + l.qty : '') +
           '</span><span>' + amt + '</span></li>';
  }).join('');

  var totals = '';
  if (r.oneTime.low) {
    totals += '<p class="bsum__t"><span>' +
      (r.oneTime.isFrom || r.oneTime.hasRange ? 'Estimated from' : 'One-time') + '</span><b>' +
      (r.oneTime.hasRange && r.oneTime.high !== r.oneTime.low
        ? Rec.money(r.oneTime.low) + '–' + Rec.money(r.oneTime.high)
        : Rec.money(r.oneTime.low)) + '</b></p>';
  }
  if (r.monthly.low) {
    totals += '<p class="bsum__t"><span>Ongoing</span><b>' + Rec.money(r.monthly.low) + '/mo</b></p>';
  }

  var fit = '';
  if (r.match) fit = '<p class="bsum__fit">Best fit: <b>' + esc(r.match.offer.name) + '</b></p>';
  else if (r.primary) fit = '<p class="bsum__fit">Best fit: <b>' + esc(r.primary.name) + '</b></p>';

  slot.innerHTML =
    '<h2 class="bsum__h">Selected project</h2>' +
    '<ul class="bsum__list">' + rows + '</ul>' +
    totals + fit +
    '<p class="bsum__note">Carried over from the pricing builder. These are starting ' +
    'estimates, not a quote. <a class="ilink" href="/pricing/#panelIndividual">Change the selection</a>.</p>';
  slot.hidden = false;

  /* ---- 2. write it into the form --------------------------------------- */
  function hidden(name, value) {
    var el = form.querySelector('input[type="hidden"][name="' + name + '"]');
    if (!el) {
      el = document.createElement('input');
      el.type = 'hidden'; el.name = name;
      form.appendChild(el);
    }
    el.value = value;
  }

  var plain = r.lines.map(function (l) {
    return l.name + (l.qty > 1 ? ' ×' + l.qty : '') + (l.included ? ' (included)' : '');
  }).join(', ');

  hidden('build-services', plain);
  hidden('build-quantities', Object.keys(payload.selection).map(function (id) {
    var o = Offers.get(id); return o ? o.name + ':' + payload.selection[id] : id;
  }).join(', '));
  hidden('build-best-fit', r.match ? r.match.offer.name : (r.primary ? r.primary.name : 'Individual services'));
  hidden('build-one-time', r.oneTime.low
    ? (r.oneTime.isFrom || r.oneTime.hasRange ? 'from ' : '') + Rec.money(r.oneTime.low) +
      (r.oneTime.hasRange && r.oneTime.high !== r.oneTime.low ? '–' + Rec.money(r.oneTime.high) : '')
    : 'none');
  hidden('build-monthly', r.monthly.low ? Rec.money(r.monthly.low) + '/mo' : 'none');
  hidden('build-ids', Object.keys(payload.selection).map(function (id) {
    return id + '=' + payload.selection[id]; }).join(';'));

  /* the existing "Investment range" select should agree with what they built
     rather than sitting on "Prefer not to say yet" beneath a $3,400 summary */
  var sel = form.querySelector('select[name="range"]');
  if (sel && !sel.value) {
    var want = r.primary ? r.primary.name : null;
    for (var i = 0; i < sel.options.length && want; i++) {
      if (sel.options[i].text.indexOf(want) >= 0) { sel.selectedIndex = i; break; }
    }
    if (!want) {
      for (var j = 0; j < sel.options.length; j++) {
        if (sel.options[j].text.toLowerCase().indexOf('individual services') === 0) { sel.selectedIndex = j; break; }
      }
    }
  }
}());
