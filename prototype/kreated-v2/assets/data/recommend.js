/* ==========================================================================
   KREATED — THE RECOMMENDATION ENGINE
   Deterministic. Rules, prices, inclusions and selections. 🚫 No LLM, no
   heuristics that cannot be read off docs/PACKAGE-MATCHING-RULES.md.

   Two consumers, one engine:
     · price(selection)            -> the Build Your Package configurator
     · recommendFromNeeds(needs)   -> the Free Website Audit, next phase

   Both return the same shape, which is why they can share a renderer.

   🚫 This file holds NO prices. Everything comes from offers.js.
   ========================================================================== */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) { module.exports = factory(require('./offers.js')); }
  else { root.KreatedRecommend = factory(root.KreatedOffers); }
}(typeof self !== 'undefined' ? self : this, function (Offers) {
  'use strict';

  /* ---- tuning, all of it named and justified ---------------------------- */
  var RULES = {
    /* PACKAGE-MATCHING-RULES.md §Coverage */
    RECOMMEND_AT: 0.80,
    MENTION_AT:   0.55,

    /* ⚠ NOT IN THE DOCS — introduced 2026-09-01, flagged in the build report.
       Coverage alone would push a buyer who wants one $450 service page into
       a $2,950 Growth engagement, because Growth "covers" service pages and
       coverage would compute as 1.0. That is exactly the outcome Scenario D
       forbids. A package is only offered when it is either cheaper, or within
       this multiple of what the buyer actually asked for. */
    MAX_UPSELL_MULTIPLE: 1.6
  };

  function money(n) { return '$' + n.toLocaleString('en-US'); }
  var Rec_money = money;

  /* =======================================================================
     1. SELECTION -> PRICED PROJECT
     selection: { 'offer.id': qty }  (qty 1 for non-quantity offers)
     ======================================================================= */
  function price(selection) {
    var chosen = Object.keys(selection || {})
      .filter(function (id) { return selection[id] > 0 && Offers.get(id); })
      .map(function (id) { return { offer: Offers.get(id), qty: selection[id] }; });

    /* ---- coverage: what a chosen package already includes ---------------
       Walks every chosen package's `covers` map. A `full` cover means the
       buyer must NOT be charged again — PACKAGE-MATCHING-RULES, hard rule.
       A `partial` cover is an ALLOWANCE, and allowances are descriptive copy
       rather than contractual numbers (OFFER-MAP §3), so this engine will not
       silently deduct against them. It surfaces the allowance and lets the
       buyer decide. 🚫 Do not turn partial into arithmetic until the
       allowances are confirmed contractual. */
    var included = {};   /* id -> {by, note}      charged at zero            */
    var overlaps = {};   /* id -> {by, allowance} descriptive, still charged   */
    var allowances = {}; /* pool -> {left, by, label}  REAL included units     */

    chosen.forEach(function (c) {
      var cov = c.offer.covers; if (!cov) return;
      Object.keys(cov).forEach(function (target) {
        var rule = cov[target];
        var level = (typeof rule === 'string') ? rule : rule.level;
        var note  = (typeof rule === 'string') ? null : (rule.note || rule.allowance);
        if (level === 'full' || level === 'ongoing') {
          included[target] = { by:c.offer.id, byName:c.offer.name, note:note, level:level };
        } else if (level === 'allowance') {
          /* ⚠ CONTRACTUAL, owner decision 2026-09-01. A pooled allowance is
             real included scope: the buyer is charged only BEYOND it. Service
             and location pages share one pool because the published copy says
             "up to two service or location pages", not two of each. */
          var pool = rule.pool || target;
          if (!allowances[pool] || allowances[pool].left < rule.allow) {
            allowances[pool] = { left:rule.allow, total:rule.allow,
                                 by:c.offer.id, byName:c.offer.name, label:rule.allowance };
          }
        } else if (level === 'sized') {
          /* the package's own page count. NOT a credit against buying more. */
          overlaps[target] = { by:c.offer.id, byName:c.offer.name, allowance:note, sized:true };
        }
      });
    });

    /* ⚠ AEO CREDIT IS ARITHMETIC, owner decision 2026-09-01: the full $750.
       Both lines are charged and a real credit line is subtracted, so the
       buyer sees the money they already paid coming off. 🚫 Do not go back to
       silently zeroing the audit — a credit the buyer cannot see is a claim,
       not a calculation. */
    var credits = [];
    chosen.forEach(function (c) {
      var cr = c.offer.creditsToward;
      if (cr && selection[cr.id]) {
        credits.push({ from:c.offer.id, fromName:c.offer.name,
                       toward:cr.id, towardName:(Offers.get(cr.id) || {}).name,
                       amount:cr.amount });
      }
    });

    var lines = [], oneTimeLow = 0, oneTimeHigh = 0, monthly = 0, monthlyHigh = 0;
    var isFrom = false, hasRange = false, hasThirdParty = false;

    /* ⚠ allowance consumption is ORDER-DEPENDENT, so the pool is drawn down in
       a fixed order — dearest first, which spends the included units on the
       most expensive pages and is the answer favourable to the buyer. */
    var ordered = chosen.slice().sort(function (a, b) { return b.offer.price - a.offer.price; });
    var priced = {};

    ordered.forEach(function (c) {
      var o = c.offer, qty = o.qty ? c.qty : 1;
      var inc = included[o.id] || null;
      var coveredUnits = 0, pool = null;

      if (!inc && o.covers === undefined) {
        var rulePool = null;
        Object.keys(allowances).forEach(function (p) {
          chosen.forEach(function (other) {
            var cov = other.offer.covers; if (!cov || !cov[o.id]) return;
            if ((cov[o.id].pool || o.id) === p) rulePool = p;
          });
        });
        if (rulePool && allowances[rulePool] && allowances[rulePool].left > 0) {
          pool = allowances[rulePool];
          coveredUnits = Math.min(qty, pool.left);
          pool.left -= coveredUnits;
        }
      }

      var billable = Math.max(0, qty - coveredUnits);
      var low  = inc ? 0 : o.price * billable;
      var high = inc ? 0 : (o.high ? o.high * billable : o.price * billable);

      var floored = false;
      if (!inc && o.minimum && low > 0 && low < o.minimum) { low = o.minimum; high = o.minimum; floored = true; }

      priced[o.id] = { id:o.id, name:o.name, kind:o.kind, qty:qty, unit:o.unit || null,
        low:low, high:high, from:!!o.from, range:!!o.high,
        included:inc, floored:floored, plusThirdParty:!!o.plusThirdParty,
        overlap: overlaps[o.id] || null,
        coveredUnits:coveredUnits, billable:billable,
        allowanceBy: coveredUnits ? (pool && pool.byName) : null };
    });

    var lines = [], oneTimeLow = 0, oneTimeHigh = 0, monthly = 0, monthlyHigh = 0;
    var isFrom = false, hasRange = false, hasThirdParty = false;

    chosen.forEach(function (c) {
      var l = priced[c.offer.id], o = c.offer;
      if (!l.included) {
        if (o.kind === 'monthly') { monthly += l.low; monthlyHigh += l.high; }
        else { oneTimeLow += l.low; oneTimeHigh += l.high; }
        if (o.from && l.low > 0) isFrom = true;
        if (o.high && l.low > 0) hasRange = true;
        if (o.plusThirdParty) hasThirdParty = true;
      }
      lines.push(l);
    });

    /* the credit lands on the one-time side and can never take a total below 0 */
    var creditTotal = credits.reduce(function (s2, c2) { return s2 + c2.amount; }, 0);
    if (creditTotal) {
      creditTotal = Math.min(creditTotal, oneTimeLow);
      oneTimeLow  = Math.max(0, oneTimeLow - creditTotal);
      oneTimeHigh = Math.max(0, oneTimeHigh - creditTotal);
    }

    return {
      lines: lines,
      oneTime:  { low:oneTimeLow, high:oneTimeHigh, isFrom:isFrom, hasRange:hasRange, thirdParty:hasThirdParty },
      monthly:  { low:monthly,    high:monthlyHigh },
      included: included,
      overlaps: overlaps,
      allowances: allowances,
      credits: credits,
      creditTotal: creditTotal,
      count: chosen.length
    };
  }

  /* =======================================================================
     2. PACKAGE MATCHING
     ======================================================================= */

  /* Brand + Website is the one match that is triggered by a PAIR of
     selections rather than by coverage. OFFER-MAP: "For matching purposes it
     is two selections, not one." 🚫 Never compute a saving for it. */
  function combinedMatch(selection) {
    var web = null, brand = null;
    Object.keys(selection).forEach(function (id) {
      if (!selection[id]) return;
      var o = Offers.get(id); if (!o) return;
      if (o.exclusive === 'website-base') web = o;
      if (o.exclusive === 'brand-tier')   brand = o;
    });
    if (!web || !brand) return null;
    var combined = Offers.get('pkg.combined.brandweb');
    return {
      kind:'combined', offer:combined, replaces:[web.id, brand.id],
      separately: web.price + brand.price,
      /* 🚫 noSaving: the page already says buying separately costs about the
         same. A matcher that contradicts the page is worse than no matcher. */
      saving:null,
      why:'The identity gets settled before the pages are designed around it, which is the order that avoids building the site twice.'
    };
  }

  function packageMatch(selection, priced) {
    var combined = combinedMatch(selection);
    if (combined) return combined;

    /* only individual, non-package selections can be "covered" by a package */
    var loose = priced.lines.filter(function (l) {
      var o = Offers.get(l.id);
      return o && o.kind === 'one-time' && !o.exclusive && !l.included;
    });
    if (!loose.length) return null;

    var selectionValue = loose.reduce(function (s, l) { return s + l.low; }, 0);
    if (selectionValue <= 0) return null;

    /* a base website package is already chosen: nothing to upgrade to */
    var hasBase = priced.lines.some(function (l) {
      var o = Offers.get(l.id); return o && o.exclusive === 'website-base';
    });

    var best = null;
    Offers.offers.forEach(function (pkg) {
      if (pkg.exclusive !== 'website-base') return;
      if (hasBase) return;
      if (!pkg.covers) return;

      var coveredValue = 0;
      loose.forEach(function (l) {
        var rule = pkg.covers[l.id]; if (!rule) return;
        /* partial counts toward coverage — the package genuinely does that
           kind of work — but the allowance is surfaced, never deducted */
        coveredValue += l.low;
      });
      var coverage = coveredValue / selectionValue;
      if (coverage < RULES.MENTION_AT) return;

      var saving = coveredValue - pkg.price;
      var affordable = pkg.price <= selectionValue * RULES.MAX_UPSELL_MULTIPLE;
      if (saving <= 0 && !affordable) return;   /* Scenario D guard */

      var cand = {
        kind:'upgrade', offer:pkg, coverage:coverage,
        separately:coveredValue, saving:saving,
        strength: coverage >= RULES.RECOMMEND_AT ? 'recommend' : 'mention',
        covered: loose.filter(function (l) { return !!pkg.covers[l.id]; }).map(function (l) { return l.id; }),
        remainder: loose.filter(function (l) { return !pkg.covers[l.id]; }).map(function (l) { return l.id; })
      };
      /* prefer the strongest coverage, then the cheaper package */
      if (!best || cand.coverage > best.coverage ||
         (cand.coverage === best.coverage && cand.offer.price < best.offer.price)) best = cand;
    });
    return best;
  }

  /* =======================================================================
     3. FIT GUIDANCE — per offer, responds to the rest of the selection
     ======================================================================= */
  function guidance(selection, priced) {
    var out = {};
    priced.lines.forEach(function (l) {
      if (l.included) {
        out[l.id] = { tone:'included',
          text:'Included in ' + l.included.byName + (l.included.note ? ' — ' + l.included.note : '') + '. Not charged again.' };
      } else if (l.overlap) {
        out[l.id] = { tone:'overlap',
          text:l.overlap.byName + ' already covers ' + (l.overlap.allowance || 'some of this') +
               '. Add these only if you need them on top.' };
      }
    });

    /* a page paid for out of a package's included allowance says so */
    priced.lines.forEach(function (l) {
      if (l.coveredUnits > 0 && !l.included) {
        var beyond = l.billable;
        out[l.id] = { tone:'included',
          text: beyond
            ? (l.coveredUnits + ' of these ' + (l.coveredUnits === 1 ? 'is' : 'are') +
               ' included in ' + l.allowanceBy + '. Only the other ' + beyond + ' ' +
               (beyond === 1 ? 'is' : 'are') + ' charged.')
            : ('Included in ' + l.allowanceBy + '. Not charged again.') };
      }
    });
    priced.credits.forEach(function (c) {
      out[c.from] = { tone:'included',
        text: Rec_money(c.amount) + ' credited toward ' + c.towardName + '.' };
    });

    /* ongoing answer engine work sits inside Local Growth where scope
       overlaps — /pricing/. Not a charge to remove: Foundation is one-time
       implementation and the ladder is ongoing. A note, not a deduction. */
    var ladder = ['pkg.local.growth','pkg.local.expansion'];
    if (selection['pkg.aeo.foundation'] && ladder.some(function (id) { return selection[id]; })) {
      out['pkg.aeo.foundation'] = { tone:'note',
        text:'One-time implementation. The ongoing answer engine work is already part of your monthly programme where the scope overlaps.' };
    }
    return out;
  }

  /* =======================================================================
     4. THE PUBLIC RESULT — one shape, both consumers
     ======================================================================= */
  /* the packages a buyer can choose, in the order they headline a project */
  var PRIMARY_ORDER = ['website-base', 'brand-tier', 'local-tier', 'care-tier'];

  /* ⚠ "package" is any pkg.* offer, not only the exclusive tiers. AEO Audit
     and AEO Foundation are packages with no exclusivity group, and checking
     `exclusive` alone made a selection of two AEO packages report "Individual
     services are the better fit" — advice that contradicts what was chosen. */
  function isPackage(id) { return id.indexOf('pkg.') === 0; }

  function hasPackage(selection) {
    return Object.keys(selection || {}).some(function (id) {
      return selection[id] && isPackage(id) && Offers.get(id);
    });
  }
  function primaryPackage(selection) {
    for (var i = 0; i < PRIMARY_ORDER.length; i++) {
      var found = Object.keys(selection || {}).filter(function (id) {
        var o = Offers.get(id); return o && o.exclusive === PRIMARY_ORDER[i] && selection[id];
      })[0];
      if (found) return Offers.get(found);
    }
    /* no tier chosen: the dearest package present is what headlines the project */
    var pkgs = Object.keys(selection || {}).filter(function (id) {
      return selection[id] && isPackage(id) && Offers.get(id);
    }).map(Offers.get).sort(function (a, b) { return b.price - a.price; });
    return pkgs[0] || null;
  }

  function evaluate(selection) {
    var priced = price(selection);
    var match  = priced.count ? packageMatch(selection, priced) : null;
    return {
      lines: priced.lines,
      oneTime: priced.oneTime,
      monthly: priced.monthly,
      included: priced.included,
      overlaps: priced.overlaps,
      allowances: priced.allowances,
      credits: priced.credits,
      creditTotal: priced.creditTotal,
      guidance: guidance(selection, priced),
      match: match,
      /* ⚠ 'individual' is the "you do not need a package" verdict and it must
         only fire when the buyer has actually chosen loose services. With a
         package already selected it read "Individual services are the better
         fit" underneath a selected Growth, which contradicts the thing the
         buyer just clicked. 'chosen' is the confirming case. */
      verdict: !priced.count ? 'empty'
             : (match && match.kind === 'combined') ? 'combined'
             : (match && match.strength === 'recommend') ? 'package'
             : (match && match.strength === 'mention') ? 'compare'
             : hasPackage(selection) ? 'chosen'
             : 'individual',
      primary: primaryPackage(selection)
    };
  }

  /* =======================================================================
     5. FUTURE AUDIT ENTRY POINT
     The audit classifies findings, never prices them:
       recommendFromNeeds({ website:'critical', brand:'alreadyStrong',
                            localSeo:'recommended', tracking:'optional' })
     ⚠ 'alreadyStrong' MUST yield nothing for that category. The credibility
     of the whole audit rests on it being willing to recommend buying nothing.
     🚫 Never add a "but you could still…" fallback here.
     ======================================================================= */
  var WEIGHT = { critical:3, recommended:2, optional:1, alreadyStrong:0 };

  function recommendFromNeeds(needs, opts) {
    opts = opts || {};
    var selection = {}, skipped = [];
    Object.keys(needs || {}).forEach(function (cat) {
      var level = needs[cat];
      var ids = Offers.needCategories[cat];
      if (!ids) return;
      if (!WEIGHT[level]) { skipped.push(cat); return; }   /* alreadyStrong -> nothing */
      if (level === 'optional' && !opts.includeOptional) { skipped.push(cat); return; }

      /* pick the LOWEST rung that answers the need. PACKAGE-MATCHING-RULES:
         the ladder makes it easy to reach for the middle by habit. */
      var pool = ids.map(Offers.get).filter(Boolean).filter(function (o) { return !o.recommendOnly; });
      var idx = level === 'critical' ? Math.min(1, pool.length - 1) : 0;
      var pick = pool[idx];
      if (pick) selection[pick.id] = 1;
    });
    var result = evaluate(selection);
    result.needs = needs;
    result.nothingRecommendedFor = skipped;   /* rendered as "already strong" */
    return result;
  }

  return {
    rules: RULES,
    price: price,
    evaluate: evaluate,
    packageMatch: packageMatch,
    recommendFromNeeds: recommendFromNeeds,
    money: money
  };
}));
