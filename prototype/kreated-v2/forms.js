/* ==========================================================================
   KREATED V2 — CONVERSION FORMS
   Progressive enhancement only. With this file absent or JavaScript off, both
   forms are still ordinary Netlify POST forms that land on /thanks/ — the
   conversion path never depends on script.

   What this adds on top of that baseline:
     1. inline validation with real messages, so a mistyped email does not cost
        a page load
     2. AJAX submit, so the reader stays where they are and gets an inline
        confirmation instead of a redirect
     3. ONE success event per form, fired only after the POST is accepted

   ANALYTICS — docs/CONVERSION.md §5. V1 shipped `window.kreatedTrack(name,
   detail)`, wired by delegated click/submit listeners on [data-evt]. Two things
   are deliberately different here:

     · V1 fired on the `submit` EVENT. That counts attempts, not conversions —
       a rejected POST would have looked like a lead. The success events below
       fire only after the request resolves OK.
     · No personal data is ever passed. The detail object carries the form name
       and two booleans; never a name, email, phone, URL or message body.

   No tag is installed and no third-party origin is contacted — V1's zero
   third-party-request property is intact. kreatedTrack pushes to dataLayer /
   plausible only if a container is already present, so GA4 via GTM works the
   day a container is added, with no markup change.
   ========================================================================== */
(function () {
  'use strict';

  /* ⚠ THE EMITTER AND THE [data-evt] LISTENER MOVED TO /track.js on
     2026-09-01. They lived here, so they only existed on the seven routes that
     load this file, while [data-evt] is on all nineteen — twelve routes' worth
     of header and footer CTA clicks were never tracked. track.js loads
     everywhere and is loaded BEFORE this file. 🚫 Do not bring them back.

     This stub only guarantees the call below never throws if track.js is
     missing; it is not a second implementation. */
  if (typeof window.kreatedTrack !== 'function') { window.kreatedTrack = function () {}; }

  /* ⚠ [data-own-submit] opts a form OUT of this file entirely. The website
     audit form is taken over by /free-website-audit/audit.js, which runs the
     analysis and renders results in place; without this both scripts would
     handle the same submit and the visitor would get a "thank you" message on
     top of their audit. 🚫 Do not remove the attribute from that form. */
  var forms = Array.prototype.slice.call(
    document.querySelectorAll('form.kform:not([data-own-submit])'));
  if (!forms.length) return;

  function fieldOf(input) { return input.closest('.field'); }

  function messageFor(input) {
    var label = (fieldOf(input).querySelector('label').childNodes[0].textContent || 'This field').trim();
    if (input.validity.valueMissing) {
      return input.tagName === 'SELECT' ? 'Choose an option.' : label + ' is required.';
    }
    if (input.type === 'email' && input.validity.typeMismatch) {
      return 'Check this email address.';
    }
    if (input.type === 'url' && input.validity.typeMismatch) {
      return 'Include https:// at the start.';
    }
    return 'Please check this field.';
  }

  function validate(input) {
    var wrap = fieldOf(input);
    if (!wrap) return true;
    var slot = wrap.querySelector('.err');
    /* an empty optional URL is valid — browsers disagree on partial input */
    if (!input.required && !input.value.trim()) {
      wrap.classList.remove('is-bad');
      input.removeAttribute('aria-invalid');
      if (slot) slot.textContent = '';
      return true;
    }
    var ok = input.checkValidity();
    wrap.classList.toggle('is-bad', !ok);
    if (ok) input.removeAttribute('aria-invalid');
    else input.setAttribute('aria-invalid', 'true');
    if (slot) slot.textContent = ok ? '' : messageFor(input);
    return ok;
  }

  forms.forEach(function (form) {
    var status = form.querySelector('.kform__status');
    var fields = Array.prototype.slice.call(
      form.querySelectorAll('.field input, .field select, .field textarea'));

    fields.forEach(function (input) {
      /* validate on blur, then live once it has been corrected — never while
         someone is still mid-word on their first pass */
      input.addEventListener('blur', function () { validate(input); });
      input.addEventListener('input', function () {
        if (fieldOf(input).classList.contains('is-bad')) validate(input);
      });
      input.addEventListener('change', function () {
        if (input.tagName === 'SELECT') validate(input);
      });
    });

    form.addEventListener('submit', function (e) {
      var bad = fields.filter(function (i) { return !validate(i); });
      if (bad.length) {
        e.preventDefault();
        status.className = 'kform__status is-bad';
        status.textContent = bad.length === 1
          ? 'One field needs checking — it is marked above.'
          : bad.length + ' fields need checking — they are marked above.';
        bad[0].focus();
        return;
      }

      /* no fetch (very old browser): let the native POST to /thanks/ happen */
      if (typeof window.fetch !== 'function' || typeof FormData !== 'function') return;

      e.preventDefault();
      var btn = form.querySelector('button[type=submit]');
      var label = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      status.className = 'kform__status';
      status.textContent = 'Sending…';

      var data = new FormData(form);
      /* Netlify attributes an AJAX post by the hidden form-name input */
      fetch(form.getAttribute('action') || '/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString()
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);

        /* SUCCESS — and only here does the conversion event fire, exactly once */
        var evt = form.getAttribute('data-success-event');
        if (evt) {
          window.kreatedTrack(evt, {
            form_name: form.getAttribute('name'),   /* not personal data */
            has_website: !!(data.get('website') || '').trim(),
            has_phone: !!(data.get('phone') || '').trim()
          });
        }

        form.classList.add('is-sent');
        status.className = 'kform__status is-ok';
        /* No response-time promise and no founder voice: neither is documented. */
        status.textContent = 'Thank you — that came through. The reply will come from '
          + 'contact@kreated.dev.';
        status.setAttribute('tabindex', '-1');
        status.focus();
      }).catch(function () {
        if (btn) { btn.disabled = false; btn.textContent = label; }
        status.className = 'kform__status is-bad';
        /* never pretend a failed send succeeded — give a route that works */
        status.innerHTML = 'That did not send. Email '
          + '<a href="mailto:contact@kreated.dev">contact@kreated.dev</a> '
          + 'or call <a href="tel:+19198058217">(919) 805-8217</a>.';
      });
    });
  });

  /* a CTA pointing at the form should land the reader ON the first field,
     not merely near it — keyboard and screen-reader users especially */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href="#project"]');
    if (!a) return;
    var first = document.querySelector('#project .field input');
    if (!first) return;
    setTimeout(function () {
      try { first.focus({ preventScroll: true }); } catch (err) { first.focus(); }
    }, 420);
  });
})();

/* ==========================================================================
   INTENT CARRIED IN FROM /pricing/ — added 2026-09-01
   The Build Your Package CTA links to /contact/?intent=build. Without this the
   parameter is decoration: a URL that claims to carry something and carries
   nothing. It now does one real, small thing — it preselects the investment
   band that matches how the visitor said they want to buy, so the form opens
   already agreeing with the page they came from.

   ⚠ This is NOT the configurator. When the builder is real it will pass
   `items=` as well, and this is the function that will read it. Until then it
   handles the one parameter that actually exists.
   🚫 Do not read a PRICE from the URL. See docs/PACKAGE-MATCHING-RULES.md.
   ========================================================================== */
(function () {
  'use strict';
  var q;
  try { q = new URLSearchParams(window.location.search); } catch (e) { return; }
  var intent = q.get('intent');
  if (!intent) return;

  var sel = document.querySelector('select[name="range"]');
  if (!sel) return;

  /* match by the option's own text so this cannot drift out of step with the
     bands when they change — there is no second copy of the wording here */
  var want = (intent === 'build') ? 'individual services' : null;
  if (!want) return;

  for (var i = 0; i < sel.options.length; i++) {
    if (sel.options[i].text.toLowerCase().indexOf(want) === 0) {
      sel.selectedIndex = i;
      return;
    }
  }
}());
