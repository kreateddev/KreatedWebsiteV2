#!/usr/bin/env node
/* ==========================================================================
   KREATED — RECOMMENDATION ENGINE TESTS
   Dependency-free. Run:  node prototype/kreated-v2/tools/test-engine.js

   Two jobs:
     1. PRICING INTEGRITY — assert offers.js against the locked catalogue in
        docs/PRICING-SOURCE-OF-TRUTH-AUDIT.md. If someone edits a price in one
        place and not the other, this fails. That is the whole point.
     2. BEHAVIOUR — the scenarios in the build brief, plus the rules in
        docs/PACKAGE-MATCHING-RULES.md that are easy to regress.
   ========================================================================== */
'use strict';
const Offers = require('../assets/data/offers.js');
const R = require('../assets/data/recommend.js');

let pass = 0, fail = 0;
const results = [];
function t(name, fn) {
  try { fn(); pass++; results.push(['ok  ', name]); }
  catch (e) { fail++; results.push(['FAIL', name + '\n        ' + e.message]); }
}
function eq(a, b, m) {
  const A = JSON.stringify(a), B = JSON.stringify(b);
  if (A !== B) throw new Error((m || '') + ' expected ' + B + ', got ' + A);
}
function ok(v, m) { if (!v) throw new Error(m || 'expected truthy'); }

/* ======================================================================
   1. PRICING INTEGRITY — the locked catalogue, typed out independently
   ====================================================================== */
const LOCKED = {
  'pkg.web.onepage':      ['one-time', 750,  null],
  'pkg.web.launch':       ['one-time', 1750, null],
  'pkg.web.growth':       ['one-time', 2950, null],
  'pkg.web.leader':       ['one-time', 4500, null],
  'pkg.brand.refresh':    ['one-time', 750,  null],
  'pkg.brand.identity':   ['one-time', 1500, null],
  'pkg.brand.full':       ['one-time', 2500, null],
  'pkg.combined.brandweb':['one-time', 3950, 5950],
  'pkg.aeo.audit':        ['one-time', 750,  null],
  'pkg.aeo.foundation':   ['one-time', 1250, 1750],
  'pkg.local.presence':   ['monthly',  500,  null],
  'pkg.local.growth':     ['monthly',  900,  null],
  'pkg.local.expansion':  ['monthly',  1500, null],
  'pkg.care.base':        ['monthly',  149,  null],
  'pkg.care.plus':        ['monthly',  279,  null],
  'svc.page.standard':    ['one-time', 250,  null],
  'svc.page.service':     ['one-time', 450,  null],
  'svc.page.location':    ['one-time', 550,  null],
  'svc.page.landing':     ['one-time', 850,  null],
  'svc.search.gbp':       ['one-time', 450,  null],
  'svc.track.analytics':  ['one-time', 400,  null],
  'svc.prod.photo':       ['one-time', 350,  null],
  'svc.copy.full':        ['one-time', 275,  null]
};

t('every locked offer exists with the locked price and kind', () => {
  Object.keys(LOCKED).forEach(id => {
    const o = Offers.get(id);
    ok(o, 'missing offer ' + id);
    eq([o.kind, o.price, o.high || null], LOCKED[id], id + ':');
  });
});

t('offers.js contains no offer outside the locked catalogue', () => {
  const extra = Offers.offers.map(o => o.id).filter(id => !LOCKED[id]);
  eq(extra, [], 'unlocked offers present:');
});

t('Google Ads appears nowhere in the offer data', () => {
  const s = JSON.stringify(Offers.offers).toLowerCase();
  ok(s.indexOf('google ads') === -1, 'Google Ads must remain excluded');
});

t('the $1,200 copy minimum is internal, not a displayed price', () => {
  const o = Offers.get('svc.copy.full');
  eq(o.minimum, 1200);
  eq(o.price, 275, 'the public figure is per page:');
});

/* ======================================================================
   2. TOTALS, QUANTITIES, RANGES, RECURRING SEPARATION
   ====================================================================== */
t('zero selections produce zero and an empty verdict', () => {
  const r = R.evaluate({});
  eq([r.oneTime.low, r.monthly.low, r.verdict], [0, 0, 'empty']);
});

t('one individual item totals exactly that item', () => {
  const r = R.evaluate({ 'svc.page.service': 1 });
  eq([r.oneTime.low, r.monthly.low], [450, 0]);
});

t('quantities multiply', () => {
  const r = R.evaluate({ 'svc.page.location': 3 });
  eq(r.oneTime.low, 1650, '3 x 550:');
});

t('a range-priced item keeps both ends', () => {
  const r = R.evaluate({ 'pkg.aeo.foundation': 1 });
  eq([r.oneTime.low, r.oneTime.high, r.oneTime.hasRange], [1250, 1750, true]);
});

t('one-time and monthly never merge — Scenario E', () => {
  const r = R.evaluate({ 'pkg.web.onepage': 1, 'pkg.local.presence': 1 });
  eq([r.oneTime.low, r.monthly.low], [750, 500]);
});

t('the copy minimum floors the line without appearing as a quantity', () => {
  const r = R.evaluate({ 'svc.copy.full': 2 });          /* 2 x 275 = 550 */
  eq(r.oneTime.low, 1200, 'floored to the internal minimum:');
  const line = r.lines.find(l => l.id === 'svc.copy.full');
  eq([line.qty, line.floored], [2, true]);
});

t('above the minimum, per-page pricing is exact', () => {
  const r = R.evaluate({ 'svc.copy.full': 6 });          /* 6 x 275 = 1650 */
  eq(r.oneTime.low, 1650);
});

/* ======================================================================
   3. NO DOUBLE CHARGING
   ====================================================================== */
t('Growth covers GBP Optimization — not charged twice', () => {
  const r = R.evaluate({ 'pkg.web.growth': 1, 'svc.search.gbp': 1 });
  eq(r.oneTime.low, 2950, 'GBP must not be added:');
  ok(r.included['svc.search.gbp'], 'GBP should be marked included');
  eq(r.included['svc.search.gbp'].byName, 'Growth');
});

t('Launch covers Analytics — not charged twice', () => {
  const r = R.evaluate({ 'pkg.web.launch': 1, 'svc.track.analytics': 1 });
  eq(r.oneTime.low, 1750);
  ok(r.included['svc.track.analytics']);
});

t('Market Leader covers landing pages — not charged twice', () => {
  const r = R.evaluate({ 'pkg.web.leader': 1, 'svc.page.landing': 2 });
  eq(r.oneTime.low, 4500);
});

t('Scenario C — Local Growth covers ongoing profile work, no duplicate', () => {
  const r = R.evaluate({ 'pkg.local.growth': 1, 'svc.search.gbp': 1 });
  eq([r.oneTime.low, r.monthly.low], [0, 900], 'GBP absorbed by the programme:');
  ok(r.included['svc.search.gbp']);
});

/* ⚠ SUPERSEDED 2026-09-01: the credit is arithmetic now, not a zeroed line.
   See "RULE: AEO Audit gives a full $750 credit" in section 3b. */

/* ⚠ SUPERSEDED 2026-09-01. This asserted that allowances were NOT deducted,
   which was correct while they were descriptive copy. The owner has since
   ruled them contractual, so the assertion inverted — see section 3b. */

/* ======================================================================
   3b. THE THREE RULES LOCKED 2026-09-01
   ====================================================================== */
t('RULE: page allowances are real included scope — 2 location pages in Growth', () => {
  const r = R.evaluate({ 'pkg.web.growth': 1, 'svc.page.location': 2 });
  eq(r.oneTime.low, 2950, 'both pages fall inside the allowance:');
  const l = r.lines.find(x => x.id === 'svc.page.location');
  eq([l.coveredUnits, l.billable], [2, 0]);
});

t('RULE: only pages BEYOND the allowance are charged', () => {
  const r = R.evaluate({ 'pkg.web.growth': 1, 'svc.page.location': 3 });
  eq(r.oneTime.low, 2950 + 550, 'one page beyond the allowance of two:');
  const l = r.lines.find(x => x.id === 'svc.page.location');
  eq([l.coveredUnits, l.billable], [2, 1]);
});

t('RULE: service and location pages share ONE pooled allowance', () => {
  const r = R.evaluate({ 'pkg.web.growth': 1, 'svc.page.service': 1, 'svc.page.location': 2 });
  /* pool of 2, drawn dearest-first: 2 location covered, 1 service charged */
  eq(r.oneTime.low, 2950 + 450, 'pool is two pages total, not two of each:');
});

t('RULE: Market Leader allows four, the documented floor', () => {
  const r = R.evaluate({ 'pkg.web.leader': 1, 'svc.page.location': 5 });
  eq(r.oneTime.low, 4500 + 550, 'four included, one charged:');
});

t('RULE: standard pages get NO allowance — the page count is the site', () => {
  const r = R.evaluate({ 'pkg.web.growth': 1, 'svc.page.standard': 2 });
  eq(r.oneTime.low, 2950 + 500, 'additional standard pages are additional:');
});

t('RULE: allowance only applies when the package is actually selected', () => {
  const r = R.evaluate({ 'svc.page.location': 2 });
  eq(r.oneTime.low, 1100);
});

t('RULE: AEO Audit gives a full $750 credit, as arithmetic', () => {
  const r = R.evaluate({ 'pkg.aeo.audit': 1, 'pkg.aeo.foundation': 1 });
  eq(r.creditTotal, 750, 'the credit is a real number:');
  eq([r.oneTime.low, r.oneTime.high], [1250, 1750], '750 + 1250 - 750:');
  eq(r.credits[0].towardName, 'AEO Foundation');
});

t('RULE: the credit does not apply to an audit bought alone', () => {
  const r = R.evaluate({ 'pkg.aeo.audit': 1 });
  eq([r.oneTime.low, r.creditTotal], [750, 0]);
});

t('RULE: 1.6x ceiling blocks the upsell', () => {
  /* $450 selection vs a $2,950 package = 6.6x. Never offered. */
  const r = R.evaluate({ 'svc.page.service': 1 });
  eq(r.match, null);
  eq(R.rules.MAX_UPSELL_MULTIPLE, 1.6);
});

t('RULE: 1.6x ceiling permits a package that is close enough', () => {
  const r = R.evaluate({ 'svc.page.standard': 4, 'svc.page.service': 1,
                         'svc.page.location': 1, 'svc.track.analytics': 1 });
  ok(r.match, 'a $2,400 selection should reach a $2,950 package');
  ok(r.match.offer.price <= 2400 * 1.6);
});

t('RULE: the ceiling is internal — never rendered to a customer', () => {
  const fs = require('fs');
  ['../pricing/builder.js', '../contact/build-handoff.js'].forEach(f => {
    const src = fs.readFileSync(__dirname + '/' + f, 'utf8');
    ok(src.indexOf('1.6') === -1, '1.6 must not appear in ' + f);
    ok(!/MAX_UPSELL/.test(src), 'the ceiling must not be surfaced in ' + f);
  });
});

/* ======================================================================
   4. PACKAGE MATCHING
   ====================================================================== */
t('Scenario D — one service page does NOT get upsold into Growth', () => {
  const r = R.evaluate({ 'svc.page.service': 1 });
  eq(r.verdict, 'individual', 'must stay individual:');
  eq(r.match, null);
});

t('Scenario A — enough loose website work recommends a package', () => {
  const r = R.evaluate({ 'svc.page.standard': 4, 'svc.page.service': 1,
                         'svc.page.location': 1, 'svc.track.analytics': 1 });
  ok(r.match, 'expected a package match');
  eq(r.match.kind, 'upgrade');
  ok(['pkg.web.growth', 'pkg.web.leader'].indexOf(r.match.offer.id) >= 0,
     'expected Growth or Market Leader, got ' + r.match.offer.id);
});

t('Scenario B — brand tier plus website tier offers Brand + Website', () => {
  const r = R.evaluate({ 'pkg.web.growth': 1, 'pkg.brand.identity': 1 });
  ok(r.match, 'expected a combined match');
  eq(r.match.kind, 'combined');
  eq(r.match.offer.id, 'pkg.combined.brandweb');
  eq(r.match.saving, null, 'Brand + Website must never show a saving:');
  eq(r.verdict, 'combined');
});

t('a saving is only ever the real difference between approved numbers', () => {
  const r = R.evaluate({ 'svc.page.standard': 8, 'svc.track.analytics': 1 });
  if (r.match && r.match.saving !== null) {
    eq(r.match.saving, r.match.separately - r.match.offer.price, 'saving arithmetic:');
  }
});

t('no package match when the selection is purely recurring', () => {
  const r = R.evaluate({ 'pkg.local.growth': 1, 'pkg.care.base': 1 });
  eq(r.match, null);
  eq([r.oneTime.low, r.monthly.low], [0, 1049]);
});

t('choosing a base package suppresses website upgrade matching', () => {
  const r = R.evaluate({ 'pkg.web.launch': 1, 'svc.page.standard': 2 });
  ok(!r.match || r.match.kind === 'combined', 'should not upsell over a chosen base');
});

t('a chosen package is confirmed, not contradicted with "individual is better"', () => {
  const r = R.evaluate({ 'pkg.web.growth': 1, 'svc.search.gbp': 1 });
  eq(r.verdict, 'chosen', 'a selected package must not read as "buy individually":');
  eq(r.primary.id, 'pkg.web.growth');
});

t('loose services with no match still say individual is better', () => {
  const r = R.evaluate({ 'svc.page.service': 1 });
  eq(r.verdict, 'individual');
  eq(r.primary, null);
});

t('AEO packages read as a chosen engagement, not as "buy individually"', () => {
  const r = R.evaluate({ 'pkg.aeo.foundation': 1, 'pkg.aeo.audit': 1 });
  eq(r.verdict, 'chosen');
  eq(r.primary.id, 'pkg.aeo.foundation', 'the dearer package headlines it:');
});

t('recurring-only selections are confirmed by their own rung', () => {
  const r = R.evaluate({ 'pkg.local.growth': 1 });
  eq(r.verdict, 'chosen');
  eq(r.primary.id, 'pkg.local.growth');
});

/* ======================================================================
   5. FUTURE AUDIT COMPATIBILITY
   ====================================================================== */
t('audit findings map to offers', () => {
  const r = R.recommendFromNeeds({ website:'critical', localSeo:'recommended' });
  ok(r.lines.length > 0, 'expected recommendations');
  ok(r.oneTime.low > 0 || r.monthly.low > 0);
});

t('ALREADY STRONG recommends nothing in that category', () => {
  const r = R.recommendFromNeeds({ brand:'alreadyStrong', website:'critical' });
  const brandIds = Offers.needCategories.brand;
  const recommendedBrand = r.lines.filter(l => brandIds.indexOf(l.id) >= 0);
  eq(recommendedBrand, [], 'brand must not be recommended when already strong:');
  ok(r.nothingRecommendedFor.indexOf('brand') >= 0, 'and it must be reported as such');
});

t('an all-strong audit recommends nothing at all', () => {
  const r = R.recommendFromNeeds({
    website:'alreadyStrong', brand:'alreadyStrong', localSeo:'alreadyStrong',
    tracking:'alreadyStrong', content:'alreadyStrong'
  });
  eq(r.lines.length, 0, 'nothing to sell is a valid outcome:');
  eq(r.verdict, 'empty');
});

t('optional findings are excluded unless explicitly asked for', () => {
  const a = R.recommendFromNeeds({ tracking:'optional' });
  const b = R.recommendFromNeeds({ tracking:'optional' }, { includeOptional:true });
  eq(a.lines.length, 0);
  ok(b.lines.length > 0);
});

t('the audit result has the same shape as a builder result', () => {
  const audit = R.recommendFromNeeds({ website:'critical' });
  const build = R.evaluate({ 'pkg.web.launch': 1 });
  eq(Object.keys(build).filter(k => !(k in audit)), [], 'audit result missing keys:');
});

/* ====================================================================== */
console.log('\nKREATED — recommendation engine\n');
results.forEach(([s, n]) => console.log('  ' + (s === 'ok  ' ? '✓' : '✗') + ' ' + n));
console.log('\n  ' + pass + ' passed, ' + fail + ' failed\n');
process.exit(fail ? 1 : 0);
