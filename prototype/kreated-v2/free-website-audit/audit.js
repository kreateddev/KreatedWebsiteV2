/* ==========================================================================
   KREATED — FREE WEBSITE AUDIT, CLIENT
   Submit -> Analyzing -> Results -> Recommendation -> handoff.

   ⚠ THE RECOMMENDATION IS NOT COMPUTED HERE. The function returns `needs`;
   window.KreatedRecommend turns those into offers and prices, exactly as the
   pricing builder does. 🚫 There is no second recommendation system and no
   price in this file.

   ⚠ PROGRESSIVE ENHANCEMENT. The page ships with the ordinary Netlify form.
   This script takes it over only once it has proven it can run, so with
   JavaScript off the visitor gets a working form and a plain explanation
   rather than a dead interface.

   LEAD CAPTURE. The original form still POSTs to Netlify, with the findings
   summary and recommended offer ids added as hidden fields. 🚫 Never post the
   fetched page content: the lead needs context, not a page dump.
   ========================================================================== */
(function () {
  'use strict';

  var Rec = window.KreatedRecommend, Offers = window.KreatedOffers;
  var form = document.querySelector('form[name="website-audit"]');
  var app  = document.getElementById('auditApp');
  if (!form || !app || !Rec || !Offers) return;

  var noJs = document.getElementById('auditNoJs');
  if (noJs) noJs.hidden = true;
  app.hidden = false;

  var stage  = app.querySelector('.aud__stage');
  var result = app.querySelector('.aud__result');
  var live   = app.querySelector('.aud__live');

  var STAGES = ['Website', 'Search foundations', 'Local visibility',
                'Brand and trust', 'Answer readiness', 'Measurement'];

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]; }); }

  /* ---- analyzing --------------------------------------------------------
     ⚠ The stage list is the REAL list of categories the function returns, and
     it advances on a timer only because the request is a single round trip
     with no progress events to read. 🚫 Do not add a percentage: there is no
     measured quantity behind one. The live region is written ONCE, not per
     stage, so a screen reader is told the audit is running rather than
     narrating six ticks. */
  var stageTimer = null;
  function startAnalyzing() {
    result.innerHTML = ''; result.hidden = true;
    stage.hidden = false;
    stage.innerHTML =
      '<p class="aud__stageh">Reading the site</p><ul class="aud__stages">' +
      STAGES.map(function (s, i) {
        return '<li class="aud__st" data-i="' + i + '"><span class="aud__dot" aria-hidden="true"></span>' + esc(s) + '</li>';
      }).join('') + '</ul>' +
      '<p class="aud__wait">This usually takes a couple of minutes. The result appears on this page.</p>';
    live.textContent = 'Checking your website. The result will appear on this page.';
    var i = 0;
    stageTimer = setInterval(function () {
      var el = stage.querySelector('.aud__st[data-i="' + i + '"]');
      if (el) el.classList.add('is-done');
      i++;
      if (i >= STAGES.length && stageTimer) { clearInterval(stageTimer); stageTimer = null; }
    }, 900);
  }
  function stopAnalyzing() {
    if (stageTimer) { clearInterval(stageTimer); stageTimer = null; }
    stage.hidden = true;
  }

  /* ---- results ---------------------------------------------------------- */
  var ORDER = [
    { k:'critical',      h:'Critical',      note:'Costing you enquiries now.' },
    { k:'recommended',   h:'Recommended',   note:'Worth doing next.' },
    { k:'optional',      h:'Optional',      note:'Real, but not urgent.' },
    { k:'alreadyStrong', h:'Already strong', note:'Nothing to spend money on here.' }
  ];

  function findingHtml(f) {
    return '<article class="af af--' + esc(f.status) + '">' +
      '<h4 class="af__h"><span class="af__cat">' + esc(f.label) + '</span>' + esc(f.finding) + '</h4>' +
      (f.why ? '<p class="af__why">' + esc(f.why) + '</p>' : '') +
      (f.evidence && f.evidence.length
        ? '<ul class="af__ev">' + f.evidence.map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('') + '</ul>'
        : '') +
      (f.next ? '<p class="af__next">Next: ' + esc(f.next) + '</p>' : '') +
      '</article>';
  }

  function planHtml(rec, fit) {
    /* 🚫 Already Strong across the board means nothing is recommended, and the
       page says so instead of finding something to sell. */
    if (!rec || rec.verdict === 'empty') {
      return '<section class="aud__plan aud__plan--none">' +
        '<h3 class="aud__h3">Recommended for your business</h3>' +
        '<p class="aud__none">Nothing. Every area checked is either already in good shape or ' +
        'not urgent enough to spend money on right now. If that changes, the audit will say so.</p>' +
        '</section>';
    }
    var lines = rec.lines.map(function (l) {
      var amt = l.included ? 'included'
              : l.range ? Rec.money(l.low) + '&ndash;' + Rec.money(l.high)
              : Rec.money(l.low) + (l.kind === 'monthly' ? '/mo' : '');
      return '<li><span>' + esc(l.name) + (l.qty > 1 ? ' &times;' + l.qty : '') + '</span><span>' + amt + '</span></li>';
    }).join('');

    var totals = '';
    if (rec.oneTime.low) totals += '<p class="aud__t"><span>' +
      (rec.oneTime.isFrom || rec.oneTime.hasRange ? 'Estimated from' : 'One-time') + '</span><b>' +
      (rec.oneTime.hasRange && rec.oneTime.high !== rec.oneTime.low
        ? Rec.money(rec.oneTime.low) + '&ndash;' + Rec.money(rec.oneTime.high)
        : Rec.money(rec.oneTime.low)) + '</b></p>';
    if (rec.monthly.low) totals += '<p class="aud__t"><span>Ongoing</span><b>' +
      Rec.money(rec.monthly.low) + '/mo</b></p>';

    var why = rec.match
      ? esc(rec.match.offer.name) + ' covers most of what the audit found.'
      : (rec.primary ? esc(rec.primary.name) + ' answers what the audit found.'
                     : 'These are the individual pieces the audit found, and nothing more.');

    var poor = fit && fit.fit !== 'good'
      ? '<p class="aud__poor">' + esc(fit.reason) + '</p>' : '';

    return '<section class="aud__plan">' +
      '<h3 class="aud__h3">Recommended for your business</h3>' +
      poor +
      '<p class="aud__why">' + why + '</p>' +
      '<ul class="aud__lines">' + lines + '</ul>' + totals +
      '<p class="aud__terms">Starting estimates, not a quote. Every project is scoped and priced ' +
      'in writing, and you approve the number before any work starts.</p>' +
      '<div class="aud__ctas">' +
        '<a class="btn btn--cobalt" id="auditToBuilder" href="/pricing/#panelIndividual">Customize This Plan</a>' +
        '<a class="btn btn--ghost" id="auditToContact" href="/contact/?intent=audit">Start This Project</a>' +
      '</div></section>';
  }

  /* ⚠ THE WRAPPER MATTERS. render() used to be called inside the fetch
     chain, so any exception in it landed in .catch() and told the visitor the
     service could not be reached. A rendering bug is not a network problem and
     must not be reported as one. */
  function show(data) {
    try { render(data); }
    catch (e) {
      fail('The audit ran, but the result could not be displayed. Send the site over and you will get the findings directly.', false);
      if (window.console && console.error) console.error('audit render failed', e);
    }
  }

  function render(data) {
    var rec = Rec.recommendFromNeeds(data.needs);

    var groups = ORDER.map(function (g) {
      var items = data.findings.filter(function (f) { return f.status === g.k; });
      if (!items.length) return '';
      return '<section class="aud__group aud__group--' + g.k + '">' +
        '<h3 class="aud__h3">' + g.h + ' <span>' + esc(g.note) + '</span></h3>' +
        items.map(findingHtml).join('') + '</section>';
    }).join('');

    var crit = data.findings.filter(function (f) { return f.status === 'critical'; }).length;
    var strong = data.findings.filter(function (f) { return f.status === 'alreadyStrong'; }).length;
    var summary = crit
      ? crit + (crit === 1 ? ' thing is' : ' things are') + ' costing you enquiries right now. ' +
        (strong ? strong + ' ' + (strong === 1 ? 'area is' : 'areas are') + ' already fine.' : '')
      : strong >= 4
        ? 'This site is in good shape. There is little here worth paying to change.'
        : 'Nothing is broken. There are improvements worth making when you are ready.';

    result.innerHTML =
      '<div class="aud__head">' +
        '<h2 class="aud__h2" id="auditResultH" tabindex="-1">What the audit found</h2>' +
        '<p class="aud__site">' + esc(data.site.host) + ' &middot; ' +
          data.pagesInspected.length + ' ' + (data.pagesInspected.length === 1 ? 'page' : 'pages') + ' read</p>' +
        '<p class="aud__summary">' + esc(summary) + '</p>' +
      '</div>' + groups + planHtml(rec, data.fit) +
      '<p class="aud__scope">This audit read your public website only. It did not see your ' +
        'analytics, Search Console, Google Business Profile or any private business data, ' +
        'and it does not predict rankings.</p>';

    result.hidden = false;
    live.textContent = 'Your audit is ready. ' + summary;
    var h = document.getElementById('auditResultH');
    if (h) { h.focus(); h.scrollIntoView({ block:'start' }); }

    /* ---- handoffs: the SAME payload shape the builder writes ------------ */
    var selection = {};
    rec.lines.forEach(function (l) { if (!l.included) selection[l.id] = l.qty; });
    function stash() {
      try {
        sessionStorage.setItem('kreated.build.v1', JSON.stringify(selection));
        sessionStorage.setItem('kreated.build.handoff.v1', JSON.stringify({
          selection: selection,
          match: rec.match ? rec.match.offer.id : null,
          at: 'audit'
        }));
      } catch (e) {}
    }
    var b = document.getElementById('auditToBuilder');
    var c = document.getElementById('auditToContact');
    if (b) b.addEventListener('click', stash);
    if (c) c.addEventListener('click', stash);

    /* ---- lead capture: the original Netlify form, plus context ---------- */
    postLead(data, rec, selection);
  }

  function hidden(name, value) {
    var el = form.querySelector('input[type="hidden"][name="' + name + '"]');
    if (!el) { el = document.createElement('input'); el.type = 'hidden'; el.name = name; form.appendChild(el); }
    el.value = value;
  }

  function postLead(data, rec, selection) {
    /* 🚫 summaries only. Never the fetched HTML. */
    hidden('audit-site', data.site.url);
    hidden('audit-findings', data.findings.map(function (f) {
      return f.label + ': ' + f.status;
    }).join(' | '));
    hidden('audit-critical', data.findings.filter(function (f) { return f.status === 'critical'; })
      .map(function (f) { return f.label; }).join(', ') || 'none');
    hidden('audit-recommended-ids', Object.keys(selection).join(';') || 'none');
    hidden('audit-one-time', rec.oneTime.low ? Rec.money(rec.oneTime.low) : 'none');
    hidden('audit-monthly', rec.monthly.low ? Rec.money(rec.monthly.low) + '/mo' : 'none');
    hidden('audit-fit', (data.fit && data.fit.fit) || 'good');

    var body = new URLSearchParams(new FormData(form)).toString();
    fetch('/', { method:'POST', headers:{ 'Content-Type':'application/x-www-form-urlencoded' }, body: body })
      .catch(function () { /* the audit is already on screen; a failed lead post must not disturb it */ });
  }

  function fail(message, retryable) {
    stopAnalyzing();
    result.hidden = false;
    result.innerHTML = '<div class="aud__fail" role="alert">' +
      '<h2 class="aud__h2" id="auditResultH" tabindex="-1">The audit could not run</h2>' +
      '<p>' + esc(message) + '</p>' +
      (retryable ? '<p><button type="button" class="btn btn--ghost" id="auditRetry">Try again</button></p>' : '') +
      '<p class="aud__failalt">You can also <a class="ilink" href="/contact/">tell Skyler what is going on</a> ' +
      'and get a straight answer without the automated check.</p></div>';
    live.textContent = 'The audit could not run. ' + message;
    var h = document.getElementById('auditResultH'); if (h) h.focus();
    var r = document.getElementById('auditRetry');
    if (r) r.addEventListener('click', function () { form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event('submit', { cancelable:true, bubbles:true })); });
  }

  /* ---- submit ----------------------------------------------------------- */
  var busy = false;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (busy) return;

    var url = (form.querySelector('[name="website"]') || {}).value || '';
    var email = (form.querySelector('[name="email"]') || {}).value || '';
    if (!url.trim()) { fail('Enter the website address you would like checked.', false); return; }
    if (!email.includes('@')) { fail('Enter an email address so the result can reach you.', false); return; }

    busy = true;
    var btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = 'Checking…'; }
    startAnalyzing();

    /* ⚠ A CLIENT DEADLINE, because fetch has none. If the function is killed
       mid-flight the browser can otherwise wait indefinitely on a request that
       is never going to answer. 30s sits above the function's own 22s budget
       with room to spare, so this only fires when something has genuinely
       gone wrong rather than racing a slow but healthy audit. */
    var ctl = window.AbortController ? new AbortController() : null;
    var giveUp = setTimeout(function () { if (ctl) ctl.abort(); }, 30000);

    fetch('/.netlify/functions/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: ctl ? ctl.signal : undefined,
      body: JSON.stringify({
        url: url.trim(),
        business: (form.querySelector('[name="business"]') || {}).value || '',
        email: email.trim(),
        phone: (form.querySelector('[name="phone"]') || {}).value || '',
        'company-website': (form.querySelector('[name="company-website"]') || {}).value || ''
      })
    })
      /* ⚠ TEXT, THEN PARSE. r.json() throws on a non-JSON body, and the
         browser cannot tell that throw apart from a dead network. When the
         function is killed at its timeout Netlify answers with its own error
         page, which is HTML, and the page used to blame the network for what
         was really the audit running out of time. */
      .then(function (r) {
        return r.text().then(function (text) {
          var body = null;
          try { body = JSON.parse(text); } catch (e) {}
          return { status: r.status, ok: r.ok, body: body };
        });
      })
      .then(function (res) {
        stopAnalyzing();

        if (res.body && res.body.ok) { show(res.body); return; }

        /* a JSON error from our own function: it already says the right thing */
        if (res.body && res.body.error) { fail(res.body.error, res.status !== 400); return; }

        /* no JSON at all. The status is the only honest signal left, and it
           has to be read carefully: some of these are worth retrying and some
           will never succeed however many times the visitor presses. */
        if (res.status === 429) {
          fail('You have reached the audit limit for now. Try again later, or send the site over and get a straight answer instead.', false);

        } else if (res.status === 504 || res.status === 502 || res.status === 500 || res.status === 0) {
          /* the function ran and was cut off, or crashed. Worth one retry. */
          fail('That site took too long to read. Large or slow sites can run past the time the check has. Send it over and it can be looked at properly.', true);

        } else if (res.status === 404 || res.status === 405 || res.status === 501) {
          /* ⚠ THE ENDPOINT IS NOT THERE. 🚫 NOT RETRYABLE — the button would
             fail identically every time, which is worse than no button.
             In production this means the function did not deploy. In local
             development it means the site is being served by something that
             only serves files: `python3 -m http.server` answers a POST with
             501 and an HTML body, which is exactly this branch. Run
             `python3 serve.py <port>` from prototype/kreated-v2 instead — it
             shims /.netlify/functions/* through node. */
          fail('The audit service is not available on this address. If you are running the site locally, start it with serve.py so the audit endpoint exists.', false);

        } else {
          fail('The check did not complete. Try again in a moment.', true);
        }
      })
      .catch(function (err) {
        stopAnalyzing();
        /* 🚫 Do not lump every throw together as a network failure. That is
           what produced "the audit service could not be reached" for a request
           that had in fact been answered. */
        if (err && err.name === 'AbortError') {
          fail('That site took too long to read. Send it over and it can be looked at properly.', true);
        } else {
          fail('The check could not be reached. Your connection dropped, or the service is briefly unavailable.', true);
        }
      })
      .finally(function () {
        clearTimeout(giveUp);
        busy = false;
        if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || 'Run the audit'; }
      });
  });
}());
