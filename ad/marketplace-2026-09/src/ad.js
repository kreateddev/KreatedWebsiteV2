/* ==========================================================================
   KREATED — MARKETPLACE AD · TEMPLATE RENDERER
   Reads window.AD and writes the canvas. Both crops load this unchanged;
   everything that differs between 1:1 and 4:5 is CSS.
   ========================================================================== */
(function () {
  var AD = window.AD;
  var $ = function (s) { return document.querySelector(s); };

  var esc = function (t) {
    return String(t).replace(/[&<>]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c];
    });
  };

  /* {run} -> Cormorant italic, \n -> <br>. Escaping happens per segment so a
     client name containing an ampersand cannot break the markup. */
  var headline = AD.headline.split(/(\{[^}]*\})/).map(function (part) {
    if (part.charAt(0) === '{') return '<em>' + esc(part.slice(1, -1)) + '</em>';
    return esc(part).replace(/\n/g, '<br>');
  }).join('');

  $('.ad-mark').textContent = AD.wordmark;
  $('.ad-headline').innerHTML = headline;
  $('.ad-sub').textContent = AD.sub;
  $('.ad-price__k').textContent = AD.price.label;
  $('.ad-price__v').textContent = AD.price.value;
  $('.ad-cta__t').textContent = AD.cta;

  var services = $('.ad-services');
  if (AD.services) services.textContent = AD.services; else services.remove();

  /* The fan is painted back to front: the two outer windows first, then the
     centre one over them. Source order IS the paint order here — z-index in
     layout-campaign.css agrees with it, and both are stated so that editing
     one without the other shows up immediately rather than silently
     reversing which headline survives. */
  var SLOT = { left: 'is-left', centre: 'is-centre', right: 'is-right' };
  var order = ['left', 'right', 'centre'];
  var fan = $('.ad-fan');

  order.forEach(function (slot) {
    var p = AD.projects.filter(function (x) { return x.slot === slot; })[0];
    if (!p) return;
    var win = document.createElement('div');
    win.className = 'win ' + SLOT[slot];
    win.innerHTML =
      '<div class="win__bar">' +
        '<i class="win__dot"></i><i class="win__dot"></i><i class="win__dot"></i>' +
        '<span class="win__url">' + esc(p.url) + '</span>' +
      '</div>' +
      '<img class="win__shot" src="' + p.shot + '" alt="">';
    fan.appendChild(win);
  });
})();
