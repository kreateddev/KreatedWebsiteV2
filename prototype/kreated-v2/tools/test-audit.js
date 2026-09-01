#!/usr/bin/env node
/* ==========================================================================
   KREATED — AUDIT TESTS
   node prototype/kreated-v2/tools/test-audit.js

   Three jobs:
     1. SSRF — the checks that stop the audit endpoint becoming a proxy into
        private infrastructure. These are the tests that matter most.
     2. Classification — signals produce the right statuses, and a good site
        can come out Already Strong with nothing recommended.
     3. Handoff — audit needs go through the SAME engine the builder uses.
   ========================================================================== */
'use strict';
const path = require('path');
const SF = require('../netlify/functions/lib/safe-fetch.js');
const S  = require('../netlify/functions/lib/signals.js');
const C  = require('../netlify/functions/lib/classify.js');
const R  = require('../assets/data/recommend.js');
const Offers = require('../assets/data/offers.js');

let pass = 0, fail = 0; const results = [];
function t(name, fn) {
  try { const r = fn(); if (r && r.then) throw new Error('async test must use ta()'); pass++; results.push(['ok', name]); }
  catch (e) { fail++; results.push(['FAIL', name + '\n        ' + e.message]); }
}
async function ta(name, fn) {
  try { await fn(); pass++; results.push(['ok', name]); }
  catch (e) { fail++; results.push(['FAIL', name + '\n        ' + e.message]); }
}
function eq(a, b, m) { const A = JSON.stringify(a), B = JSON.stringify(b);
  if (A !== B) throw new Error((m || '') + ' expected ' + B + ', got ' + A); }
function ok(v, m) { if (!v) throw new Error(m || 'expected truthy'); }
async function rejects(fn, m) {
  try { await fn(); } catch (e) { return e; }
  throw new Error(m || 'expected a rejection, got none');
}

/* ======================================================================
   1. SSRF
   ====================================================================== */
t('literal private and loopback IPv4 are blocked', () => {
  ['127.0.0.1','10.0.0.5','192.168.1.1','172.16.0.1','169.254.169.254','0.0.0.0','100.64.0.1','224.0.0.1']
    .forEach(ip => ok(SF.v4Blocked(ip), ip + ' must be blocked'));
});
t('public IPv4 is allowed', () => {
  ['8.8.8.8','1.1.1.1','93.184.216.34','172.15.0.1','172.32.0.1']
    .forEach(ip => eq(SF.v4Blocked(ip), null, ip + ' should pass:'));
});
t('IPv6 loopback, ULA, link-local and IPv4-mapped forms are blocked', () => {
  ['::1','::','fc00::1','fd12:3456::1','fe80::1','ff02::1','::ffff:127.0.0.1','::ffff:10.0.0.1']
    .forEach(ip => ok(SF.v6Blocked(ip), ip + ' must be blocked'));
});
t('public IPv6 is allowed', () => {
  eq(SF.v6Blocked('2606:4700:4700::1111'), null);
});
t('non-http schemes are rejected', () => {
  ['file:///etc/passwd','ftp://example.com','gopher://example.com','data:text/html,x','javascript:alert(1)']
    .forEach(u => {
      let threw = false;
      try { SF.parseAndCheck(u); } catch (e) { threw = true; ok(/scheme|address/i.test(e.message)); }
      ok(threw, u + ' must be rejected');
    });
});
t('localhost and internal hostnames are rejected', () => {
  ['http://localhost/','http://localhost:80/','http://foo.local/','http://svc.internal/',
   'http://metadata.google.internal/','http://intranet/']
    .forEach(u => {
      let threw = false;
      try { SF.parseAndCheck(u); } catch (e) { threw = true; }
      ok(threw, u + ' must be rejected');
    });
});
t('credentials in the URL are rejected', () => {
  let threw = false;
  try { SF.parseAndCheck('http://user:pass@example.com/'); } catch (e) { threw = true; }
  ok(threw);
});
t('non-standard ports are rejected', () => {
  ['http://example.com:22/','http://example.com:6379/','http://example.com:8080/']
    .forEach(u => { let threw = false; try { SF.parseAndCheck(u); } catch (e) { threw = true; } ok(threw, u); });
});
t('ordinary public URLs parse', () => {
  ok(SF.parseAndCheck('https://example.com/'));
  ok(SF.parseAndCheck('http://example.com:80/path?q=1'));
});

/* the DNS check is the one that actually stops rebinding */
async function dnsTests() {
  await ta('a hostname resolving to loopback is rejected', async () => {
    const e = await rejects(() => SF.resolveAndCheck('localtest.me'),
      'localtest.me resolves to 127.0.0.1 and must be refused');
    ok(/private network|not be found/i.test(e.message), 'got: ' + e.message);
  });
  await ta('a normal public hostname resolves and passes', async () => {
    const addrs = await SF.resolveAndCheck('example.com');
    ok(addrs.length > 0);
  });
  await ta('safeFetch refuses a private target end to end', async () => {
    const e = await rejects(() => SF.safeFetch('http://127.0.0.1:80/'));
    ok(e.expose, 'the error must be safe to show a user');
    ok(!/stack|ECONN|EAI_/.test(e.message), 'no internals in the message: ' + e.message);
  });
}

/* ======================================================================
   2. CLASSIFICATION
   ====================================================================== */
const WEAK = '<html><head><title>Home</title></head><body><h1>Welcome</h1>' +
             '<p>We do things.</p><a href="/about">About</a></body></html>';

const STRONG = `<html><head>
  <title>Pool Leak Detection in Wilmington, NC | Example Leak Co</title>
  <meta name="viewport" content="width=device-width">
  <meta name="description" content="Pool leak detection across Wilmington, NC and coastal North Carolina. Same-week appointments.">
  <script type="application/ld+json">{"@type":"LocalBusiness","name":"Example Leak Co"}</script>
  <script src="https://www.googletagmanager.com/gtm.js?id=GTM-ABCDEF"></script>
  </head><body>
  <h1>Pool leak detection in Wilmington, NC</h1>
  <h2>Do you cover Wrightsville Beach?</h2><p>Yes. We cover Wrightsville Beach and the surrounding coast.</p>
  <h2>How much does leak detection cost?</h2><p>Detection starts at $350.</p>
  <p>Licensed and insured since 2009. Over 300 reviews from customers across Wilmington, NC.
  We have been finding pool leaks on the North Carolina coast for fifteen years, and every
  technician on the team is certified. Our warranty covers the repair for a full year.</p>
  <p>Most pool leaks are not where the owner thinks they are. A wet patch by the deck is
  usually the last place water arrives rather than the first place it left, which is why
  guessing at the repair costs more than finding the leak properly. We use pressure testing,
  acoustic listening equipment and dye tracing to locate the break before anyone breaks
  concrete, and we show you what we found before any repair is agreed.</p>
  <p>We work across Wilmington, Wrightsville Beach, Carolina Beach, Leland and Hampstead,
  and we can usually be on site the same week. Most detections take two to three hours.
  If we cannot find the leak, there is no charge for the visit, which is a promise we can
  make because we very rarely have to keep it.</p>
  <p>Vinyl liners, fibreglass shells, gunite pools, spas and the plumbing that runs between
  them are all work we do every week. Commercial pools, hotel spas and community pools are
  handled by the same team, and we carry the certificates those sites usually ask for
  before anyone is allowed on the property.</p>
  <a href="/services/pool-leak-detection">Pool leak detection</a>
  <a href="/services/spa-leak-detection">Spa leak detection</a>
  <a href="/locations/wilmington-nc">Wilmington NC</a>
  <a href="/about">About</a><a href="/contact">Contact</a><a href="/pricing">Pricing</a>
  <a href="tel:+19105551234">Call us</a>
  <form action="/contact"><input name="email"></form>
  <a href="/contact">Request an estimate</a>
  </body></html>`;

function statuses(html, url) {
  const sig = S.extract(html, url || 'https://example.com/');
  const sum = S.summarise([sig]);
  const f = C.classify(sum);
  return { f, sum, by: Object.fromEntries(f.map(x => [x.category, x.status])) };
}

t('six categories are always returned', () => {
  eq(statuses(WEAK).f.length, 6);
  eq(statuses(STRONG).f.length, 6);
});
t('a weak site produces critical findings', () => {
  const { by } = statuses(WEAK);
  ok(['website','search','local'].some(c => by[c] === 'critical'), JSON.stringify(by));
});
t('a strong site produces Already Strong, not manufactured problems', () => {
  const { by } = statuses(STRONG);
  const strong = Object.values(by).filter(v => v === 'alreadyStrong').length;
  ok(strong >= 4, 'expected mostly alreadyStrong, got ' + JSON.stringify(by));
  eq(by.search, 'alreadyStrong');
  eq(by.local, 'alreadyStrong');
});
t('every finding carries evidence', () => {
  statuses(WEAK).f.concat(statuses(STRONG).f).forEach(x => {
    ok(Array.isArray(x.evidence) && x.evidence.length, x.category + ' has no evidence');
  });
});
t('the local finding always says the profile was not inspected', () => {
  const local = statuses(STRONG).f.find(x => x.category === 'local');
  ok(local.evidence.some(e => /not inspected|website only/i.test(e)));
});
t('the AEO finding refuses to claim it measures any AI system', () => {
  const aeo = statuses(STRONG).f.find(x => x.category === 'aeo');
  ok(aeo.evidence.some(e => /does not and cannot measure/i.test(e)));
  /* ⚠ look for PROMISSORY language, not the word "guarantee". The brand
     finding legitimately reports that no guarantees were found on the site,
     and the first version of this test failed on that sentence. */
  const all = JSON.stringify(statuses(WEAK).f) + JSON.stringify(statuses(STRONG).f);
  ok(!/(we|you.?ll|this will) (guarantee|rank)|guaranteed (ranking|result|placement|citation)|will rank|ranking increase|AI Overview|get you (to )?(number one|#1)/i.test(all),
     'no promissory claim may appear');
});
t('measurement never claims to know whether events are configured', () => {
  const m = statuses(STRONG).f.find(x => x.category === 'tracking');
  ok(m.evidence.some(e => /cannot be seen from outside/i.test(e)));
});
t('poor fit is reachable for an already-strong site', () => {
  const { f, sum } = statuses(STRONG);
  const v = C.fitVerdict(f, sum);
  ok(['poor','good'].includes(v.fit));
  if (v.fit === 'poor') ok(/should not be sold/i.test(v.reason));
});

/* ======================================================================
   2b. PAGE SELECTION — maximum three, chosen by score
   ====================================================================== */
const P = require('../netlify/functions/lib/pick-pages.js');
const HOME = 'https://ex.com/';
function picked(urls, max) {
  return P.pick(HOME, urls.map(u => 'https://ex.com' + u), max).map(c => c.pathname);
}

t('the hard maximum is three pages, so two are picked beside the homepage', () => {
  eq(P.MAX_PAGES, 3);
  const got = picked(['/services/roof-repair','/services/gutters','/about','/contact','/pricing']);
  eq(got.length, 2, 'homepage plus two:');
});

t('a specific service page outranks everything else', () => {
  const got = picked(['/about','/contact','/services/roof-repair']);
  eq(got[0], '/services/roof-repair');
});

t('the services hub is taken when no specific service page exists', () => {
  const got = picked(['/about','/services','/contact']);
  eq(got[0], '/services');
});

t('low-value routes are never chosen when anything else exists', () => {
  const got = picked(['/privacy','/terms','/cart','/checkout','/login','/thank-you',
                      '/tag/roofing','/2026/01/post','/about']);
  eq(got, ['/about'], 'only the about page is worth a slot:');
});

t('blog posts lose to real pages', () => {
  const got = picked(['/blog/five-tips','/services/roof-repair','/about']);
  ok(!got.some(p => /blog/.test(p)), got.join(','));
});

t('the second and third pages prefer DIFFERENT kinds of page', () => {
  const got = picked(['/services/a','/services/b','/services/c','/about']);
  ok(got.includes('/about'), 'expected a non-service page in the pair: ' + got.join(','));
});

t('two service pages are allowed when nothing else exists', () => {
  const got = picked(['/services/a','/services/b']);
  eq(got.length, 2);
});

t('selection is deterministic regardless of link order', () => {
  const a = ['/contact','/services/roof-repair','/about','/pricing'];
  const b = ['/pricing','/about','/services/roof-repair','/contact'];
  eq(picked(a), picked(b), 'same links in any order must give the same pages:');
});

t('a site with only utility pages still gets a second page rather than none', () => {
  const got = picked(['/privacy','/terms']);
  eq(got.length, 1, 'the least-bad candidate is used as a fallback:');
});

t('the homepage is never picked as a second page', () => {
  const got = picked(['/', '/about']);
  ok(!got.includes('/'), got.join(','));
});

/* ======================================================================
   2c. SHARED RATE LIMITING
   ====================================================================== */
const os = require('os'), fsx = require('fs'), pathx = require('path');
const RL_DIR = pathx.join(os.tmpdir(), 'kreated-rl-test-' + process.pid);

async function rlTests() {
  process.env.KREATED_AUDIT_STATE_DIR = RL_DIR;
  const RL = require('../netlify/functions/lib/rate-limit.js');
  RL.resetBackendForTests();

  /* ⚠ backend() is ASYNC since the move to @netlify/blobs — selecting the
     store now means a dynamic import and a live probe of it. */
  await ta('the store is shared, not process memory', async () => {
    const b = await RL.backend();
    eq(b.kind, 'file', 'a shared backend must be selected:');
    ok(!b.degraded);
  });

  /* 🚨 The failure the production deploy actually hit: Blobs unavailable meant
     the limiter fell through to memory. It must still LIMIT, and still say so. */
  await ta('with no store available at all, the limiter still limits and reports it', async () => {
    const saved = process.env.KREATED_AUDIT_STATE_DIR;
    delete process.env.KREATED_AUDIT_STATE_DIR;
    RL.resetBackendForTests();
    const ip = 'nostore-' + Math.random();
    let last;
    for (let i = 0; i < 5; i++) last = await RL.check(ip);
    ok(last.limited, 'the 5th request must still be refused');
    eq(last.backend, 'memory');
    eq(last.degraded, true, 'and it must announce that it is degraded:');
    process.env.KREATED_AUDIT_STATE_DIR = saved;
    RL.resetBackendForTests();
  });

  await ta('the LOCKED public default is 4 per IP per hour', () => {
    delete process.env.KREATED_AUDIT_MAX_PER_HOUR;
    const src = fsx.readFileSync(pathx.resolve(__dirname, '../netlify/functions/lib/rate-limit.js'), 'utf8');
    ok(/KREATED_AUDIT_MAX_PER_HOUR \|\| 4\)/.test(src), 'the function limiter default must be 4');
    const edge = fsx.readFileSync(pathx.resolve(__dirname, '../netlify/edge-functions/audit-rate-limit.js'), 'utf8');
    ok(/KREATED_AUDIT_MAX_PER_HOUR'\) \|\| 4\)/.test(edge), 'the edge limiter default must be 4');
  });

  await ta('the first 4 audits from one IP succeed', async () => {
    RL.resetBackendForTests();
    for (let i = 0; i < 4; i++) {
      const r = await RL.check('1.1.1.1');
      eq(r.limited, false, 'request ' + (i + 1) + ' of 4:');
    }
  });

  await ta('the 5th is refused, with a retry hint', async () => {
    const r = await RL.check('1.1.1.1');
    eq(r.limited, true, 'the 5th must be refused:');
    ok(r.retryAfterSeconds > 0 && r.retryAfterSeconds <= 3600);
  });

  await ta('separate IPs do not share a quota', async () => {
    const r = await RL.check('2.2.2.2');
    eq(r.limited, false, 'a different address starts fresh:');
  });

  await ta('the threshold is never exposed to the caller', () => {
    const src = fsx.readFileSync(pathx.resolve(__dirname, '../netlify/functions/lib/audit-core.js'), 'utf8');
    const at = src.indexOf('rate-limited');
    ok(at > 0, 'the rate-limited branch must exist');
    /* the 429 branch may carry only the message and Retry-After — never the
       threshold, the remaining count, the backend, or the caller's address */
    const branch = src.slice(at - 500, at + 200);
    ok(!/limit\.remaining|limit\.backend|limit\.degraded|MAX_PER_HOUR/.test(branch),
       'the 429 response must not leak the threshold, remaining count or store');
  });

  await ta('the window expires and the quota resets', async () => {
    const ip = '3.3.3.3';
    await RL.check(ip, { max: 1, windowMs: 60 });
    const blocked = await RL.check(ip, { max: 1, windowMs: 60 });
    eq(blocked.limited, true, 'second request inside the window:');
    await new Promise(r => setTimeout(r, 90));
    const after = await RL.check(ip, { max: 1, windowMs: 60 });
    eq(after.limited, false, 'after the window has passed:');
  });

  await ta('expired entries are swept rather than accumulating', async () => {
    for (let i = 0; i < 5; i++) await RL.check('sweep' + i, { max: 9, windowMs: 30 });
    await new Promise(r => setTimeout(r, 60));
    await RL.check('trigger', { max: 9, windowMs: 30 });   /* write triggers a sweep */
    const left = fsx.readdirSync(RL_DIR).filter(f => /sweep/.test(f));
    eq(left, [], 'expired keys must not survive:');
  });

  await ta('state genuinely crosses process boundaries', async () => {
    /* ⚠ THE POINT OF THE WHOLE EXERCISE. A separate node process must see the
       count written by this one — that is what an in-memory Map could never
       do, and what makes this limiter real on serverless. */
    const ip = 'cross.process';
    await RL.check(ip, { max: 2 });
    const script =
      'process.env.KREATED_AUDIT_STATE_DIR=' + JSON.stringify(RL_DIR) + ';' +
      'const R=require(' + JSON.stringify(pathx.resolve(__dirname, '../netlify/functions/lib/rate-limit.js')) + ');' +
      'R.check(' + JSON.stringify(ip) + ',{max:2}).then(r=>{' +
      'return R.check(' + JSON.stringify(ip) + ',{max:2})}).then(r=>{' +
      'process.stdout.write(JSON.stringify(r))});';
    const out = require('child_process').execFileSync(process.execPath, ['-e', script], { encoding: 'utf8' });
    const r = JSON.parse(out);
    eq(r.limited, true, 'the other process must see this one\u2019s count:');
  });

  await ta('a store failure degrades loudly rather than silently allowing', async () => {
    RL.resetBackendForTests();
    process.env.KREATED_AUDIT_STATE_DIR = '/proc/nonexistent-should-fail';
    RL.resetBackendForTests();
    const r = await RL.check('4.4.4.4', { max: 2 });
    ok(r.backend === 'memory' || r.degraded, 'a fallback must be reported as degraded');
    process.env.KREATED_AUDIT_STATE_DIR = RL_DIR;
    RL.resetBackendForTests();
  });

  try { fsx.rmSync(RL_DIR, { recursive: true, force: true }); } catch (e) {}
}

/* ======================================================================
   2d. MODEL ENRICHMENT — every failure mode must still yield a real audit
   ⚠ The audit is deterministic first. A model is a prose pass and nothing
   else, so "no key", "timeout", "500" and "garbage" must all produce the same
   findings, statuses and needs as a clean run. Only the wording may differ.
   ====================================================================== */
async function modelTests() {
  const http = require('http');
  const handler = require('../netlify/functions/lib/audit-core.js').handler;

  /* ⚠ SPEAKS THE OPENAI RESPONSES SHAPE, because that is what the function
     now parses: { output: [ { type:"message", content:[ {type:"output_text",
     text} ] } ] }. A stub that still returned the Anthropic
     { content:[{text}] } shape would pass while production failed. */
  function stub(behaviour) {
    return new Promise(resolve => {
      const srv = http.createServer((req, res) => {
        if (behaviour === 'hang') return;                        /* never responds */
        if (behaviour === '500') { res.writeHead(500); return res.end('nope'); }
        if (behaviour === '429') { res.writeHead(429); return res.end('slow down'); }
        if (behaviour === 'garbage') {
          res.writeHead(200, { 'content-type': 'application/json' });
          return res.end(JSON.stringify({ output: [{ type: 'message',
            content: [{ type: 'output_text', text: 'not json at all' }] }] }));
        }
        if (behaviour === 'empty') {
          res.writeHead(200, { 'content-type': 'application/json' });
          return res.end(JSON.stringify({ output: [] }));
        }
        if (behaviour === 'hostile') {
          /* tries to change status, category and evidence, and to inject a price */
          res.writeHead(200, { 'content-type': 'application/json' });
          return res.end(JSON.stringify({ output: [{ type: 'message', content: [{ type: 'output_text',
            text: JSON.stringify({ rewrites: [{ i: 0,
              finding: 'Everything is perfect', why: 'Buy the $9,999 package',
              status: 'alreadyStrong', category: 'brand', evidence: ['invented'],
              need: 'brand', price: 9999 }] }) }] }] }));
        }
        /* the well-formed case, including the auth header the function must send */
        lastAuth = req.headers['authorization'] || null;
        let body = '';
        req.on('data', c => body += c);
        req.on('end', () => {
          lastBody = body;
          res.writeHead(200, { 'content-type': 'application/json' });
          res.end(JSON.stringify({ output: [{ type: 'message', content: [{ type: 'output_text',
            text: JSON.stringify({ rewrites: [{ i: 0,
              finding: 'A rewritten finding sentence.',
              why: 'A rewritten reason that is long enough to pass the length check.' }] }) }] }] }));
        });
        return;
      });
      srv.listen(0, '127.0.0.1', () => resolve(srv));
    });
  }
  let lastAuth = null, lastBody = null;

  async function run(behaviour) {
    const srv = await stub(behaviour);
    const port = srv.address().port;
    /* ⚠ THE FLAG IS PART OF THE FIXTURE. Enrichment is off by default in
       production (owner decision 2026-09-01), so every test below that wants a
       model call has to opt in exactly the way a future re-enable would. */
    process.env.KREATED_AUDIT_ENRICH    = '1';
    process.env.KREATED_AUDIT_MODEL_KEY = 'test-key-not-a-secret';
    process.env.KREATED_AUDIT_MODEL_URL = 'http://127.0.0.1:' + port + '/';
    const res = await handler({
      httpMethod: 'POST', headers: { 'x-forwarded-for': 'model-' + behaviour + '-' + Math.random() },
      body: JSON.stringify({ url: 'https://example.com', email: 'a@b.com' })
    });
    srv.close();
    delete process.env.KREATED_AUDIT_ENRICH;
    delete process.env.KREATED_AUDIT_MODEL_KEY;
    delete process.env.KREATED_AUDIT_MODEL_URL;
    return JSON.parse(res.body);
  }

  const baseline = await (async () => {
    const res = await handler({ httpMethod: 'POST', headers: { 'x-forwarded-for': 'baseline-' + Math.random() },
      body: JSON.stringify({ url: 'https://example.com', email: 'a@b.com' }) });
    return JSON.parse(res.body);
  })();

  await ta('no key configured: a full deterministic audit', () => {
    ok(baseline.ok);
    eq(baseline.meta.modelUsed, false);
    eq(baseline.findings.length, 6);
  });

  /* ---- THE PRODUCTION DEFAULT ------------------------------------------
     🚨 The point of the whole phase: with a KEY CONFIGURED but no flag, the
     function must not open a socket to the model. Counting requests at a stub
     server is the only assertion that actually proves "zero calls" — checking
     modelUsed:false would also pass if the call was made and then failed. */
  await ta('PRODUCTION DEFAULT: a configured key with no flag makes ZERO model requests', async () => {
    let hits = 0;
    const srv = await new Promise(resolve => {
      const s2 = http.createServer((req, res) => { hits++; res.writeHead(200); res.end('{}'); });
      s2.listen(0, '127.0.0.1', () => resolve(s2));
    });
    const port = srv.address().port;
    delete process.env.KREATED_AUDIT_ENRICH;                 /* the default */
    process.env.KREATED_AUDIT_MODEL_KEY = 'test-key-not-a-secret';
    process.env.KREATED_AUDIT_MODEL_URL = 'http://127.0.0.1:' + port + '/';
    const res = await handler({ httpMethod: 'POST',
      headers: { 'x-forwarded-for': 'noflag-' + Math.random() },
      body: JSON.stringify({ url: 'https://example.com', email: 'a@b.com' }) });
    srv.close();
    delete process.env.KREATED_AUDIT_MODEL_KEY;
    delete process.env.KREATED_AUDIT_MODEL_URL;
    const r = JSON.parse(res.body);
    eq(hits, 0, 'the model endpoint must not be contacted at all:');
    ok(r.ok, 'and the audit must still succeed');
    eq(r.meta.modelUsed, false);
    eq(r.findings.length, 6, 'a full deterministic audit, not a reduced one:');
    eq(r.needs, baseline.needs, 'needs identical to the deterministic run:');
  });

  await ta('an off-ish flag value does not enable enrichment', async () => {
    let hits = 0;
    const srv = await new Promise(resolve => {
      const s2 = http.createServer((req, res) => { hits++; res.writeHead(200); res.end('{}'); });
      s2.listen(0, '127.0.0.1', () => resolve(s2));
    });
    const port = srv.address().port;
    process.env.KREATED_AUDIT_MODEL_KEY = 'test-key-not-a-secret';
    process.env.KREATED_AUDIT_MODEL_URL = 'http://127.0.0.1:' + port + '/';
    for (const v of ['', '0', 'false', 'off', 'no']) {
      process.env.KREATED_AUDIT_ENRICH = v;
      const res = await handler({ httpMethod: 'POST',
        headers: { 'x-forwarded-for': 'off-' + v + '-' + Math.random() },
        body: JSON.stringify({ url: 'https://example.com', email: 'a@b.com' }) });
      ok(JSON.parse(res.body).ok, 'audit must succeed for flag value "' + v + '"');
    }
    srv.close();
    delete process.env.KREATED_AUDIT_ENRICH;
    delete process.env.KREATED_AUDIT_MODEL_KEY;
    delete process.env.KREATED_AUDIT_MODEL_URL;
    eq(hits, 0, 'no off-ish value may open a model connection:');
  });

  await ta('the flag alone, with no key, is still safe', async () => {
    process.env.KREATED_AUDIT_ENRICH = '1';
    const res = await handler({ httpMethod: 'POST',
      headers: { 'x-forwarded-for': 'flagonly-' + Math.random() },
      body: JSON.stringify({ url: 'https://example.com', email: 'a@b.com' }) });
    delete process.env.KREATED_AUDIT_ENRICH;
    const r = JSON.parse(res.body);
    ok(r.ok); eq(r.meta.modelUsed, false);
    eq(r.findings.length, 6);
  });

  await ta('model 500: findings and needs identical to the deterministic run', async () => {
    const r = await run('500');
    ok(r.ok); eq(r.meta.modelUsed, false);
    eq(r.needs, baseline.needs, 'needs must not change:');
    eq(r.findings.map(f => f.status), baseline.findings.map(f => f.status));
  });

  await ta('malformed model response is ignored', async () => {
    const r = await run('garbage');
    ok(r.ok); eq(r.meta.modelUsed, false);
    eq(r.findings.map(f => f.finding), baseline.findings.map(f => f.finding));
  });

  await ta('model timeout still returns the audit', async () => {
    const r = await run('hang');
    ok(r.ok, 'a hanging model must not fail the audit');
    eq(r.meta.modelUsed, false);
    eq(r.needs, baseline.needs);
  });

  await ta('the request matches the OpenAI Responses contract', async () => {
    await run('ok');
    ok(/^Bearer /.test(lastAuth || ''), 'must send an Authorization: Bearer header, got ' + lastAuth);
    const b = JSON.parse(lastBody);
    eq(b.model, 'gpt-5.6-luna', 'the locked model:');
    ok(typeof b.instructions === 'string' && b.instructions.length > 40, 'instructions field required');
    ok(typeof b.input === 'string', 'input field required');
    eq(b.text.format.type, 'json_schema');
    eq(b.text.format.strict, true, 'strict schema is part of the safety story:');
    /* 🚫 the model must never be sent anything priceable */
    ok(!/price|\$|offer|package|pkg\.|svc\./i.test(b.input), 'no pricing may reach the model');
    ok(!/anthropic|x-api-key/i.test(lastBody + String(lastAuth)), 'no Anthropic remnants');
  });

  await ta('HTTP 429 from the model degrades to the deterministic audit', async () => {
    const r = await run('429');
    ok(r.ok); eq(r.meta.modelUsed, false);
    eq(r.needs, baseline.needs);
  });

  await ta('an empty model response degrades cleanly', async () => {
    const r = await run('empty');
    ok(r.ok); eq(r.meta.modelUsed, false);
    eq(r.findings.map(f => f.finding), baseline.findings.map(f => f.finding));
  });

  await ta('a good model response rewrites ONLY the prose', async () => {
    const r = await run('ok');
    ok(r.ok); eq(r.meta.modelUsed, true);
    eq(r.findings[0].finding, 'A rewritten finding sentence.', 'prose is taken:');
    eq(r.findings.map(f => f.status), baseline.findings.map(f => f.status), 'statuses untouched:');
    eq(r.needs, baseline.needs, 'needs untouched:');
  });

  await ta('a HOSTILE model response cannot change status, category or evidence', async () => {
    const r = await run('hostile');
    ok(r.ok);
    eq(r.findings[0].status, baseline.findings[0].status, 'status must be ignored:');
    eq(r.findings[0].category, baseline.findings[0].category, 'category must be ignored:');
    eq(r.findings[0].evidence, baseline.findings[0].evidence, 'evidence must be ignored:');
    eq(r.needs, baseline.needs);
    /* the injected price text lands in a prose field, which is the only thing
       the model may write — and no price ever reaches the engine */
    ok(!JSON.stringify(r.needs).includes('9,999'));
  });

  /* ---- THE FUNCTION SHAPE ----------------------------------------------
     🚨 v1 vs v2 is not a style choice. Netlify injects NETLIFY_BLOBS_CONTEXT
     into the v2 runtime ONLY. Measured in production 2026-09-01: a v1
     exports.handler function saw SITE_ID and nothing else, getStore() threw,
     the limiter fell back to per-instance memory, and eight consecutive
     requests were all served. A v2 function on the same deploy read and wrote
     Blobs successfully. Reverting the shape silently removes rate limiting,
     so it is pinned here. */
  /* 🚨 Eventual consistency silently disables the limiter: every request
     inside the 60s propagation window reads the same stale count and is
     allowed. It cannot be caught locally, because the file backend is
     immediately consistent. Pinned in the source instead. */
  await ta('Blobs reads are strongly consistent', () => {
    const src = fsx.readFileSync(pathx.resolve(__dirname, '../netlify/functions/lib/rate-limit.js'), 'utf8');
    ok(/consistency:\s*'strong'/.test(src), "the store must be opened with consistency: 'strong'");
    ok(!/store\.get\([^)]*type:\s*'json'\s*\}\)/.test(src),
       'every read must name its consistency, not fall back to the default');
  });

  await ta('the deployed entry is a v2 function, not a v1 handler', () => {
    const entry = fsx.readFileSync(pathx.resolve(__dirname, '../netlify/functions/audit.js'), 'utf8');
    ok(/export default/.test(entry), 'v2 requires an export default');
    /* ⚠ anchored, because the file's own comment says the words
       "exports.handler" and an unanchored guard matches that instead. */
    ok(!/^\s*exports\.handler\s*=/m.test(entry), 'a v1 exports.handler does not receive the Blobs context');
    ok(/from '\.\/lib\/audit-core\.js'/.test(entry), 'the entry must delegate to the CommonJS core');
  });

  await ta('the v2 adapter maps a Request onto the core and back', async () => {
    const mod = await import(pathx.resolve(__dirname, '../netlify/functions/audit.js'));
    const req = new Request('https://kreated.dev/.netlify/functions/audit', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-nf-client-connection-ip': 'v2-' + Math.random() },
      body: JSON.stringify({ url: 'https://example.com', email: 'a@b.com' })
    });
    const res = await mod.default(req, { ip: '203.0.113.9' });
    eq(res.status, 200);
    const b = await res.json();
    ok(b.ok, 'the adapter must return the core\'s body');
    eq(b.findings.length, 6);
    /* a GET must still be refused, and must not need a body */
    const bad = await mod.default(new Request('https://kreated.dev/x', { method: 'GET' }), {});
    eq(bad.status, 405, 'method check still applies through the adapter:');
  });

  await ta('at most three pages are ever analysed', async () => {
    ok(baseline.pagesInspected.length <= 3, 'got ' + baseline.pagesInspected.length);
    ok(baseline.pagesRead.length <= 3);
    eq(baseline.pagesRead[0].why, 'the homepage', 'the homepage is always first:');
  });
}

/* ======================================================================
   3. NEEDS -> THE SHARED ENGINE
   ====================================================================== */
function needsOf(html) {
  const { f } = statuses(html);
  const rank = { critical:3, recommended:2, optional:1, alreadyStrong:0 };
  const needs = {};
  f.forEach(x => { if (!(x.need in needs) || rank[x.status] > rank[needs[x.need]]) needs[x.need] = x.status; });
  return needs;
}

t('audit needs map through the SAME engine the builder uses', () => {
  const r = R.recommendFromNeeds(needsOf(WEAK));
  ok(r.lines.length > 0, 'a weak site should produce recommendations');
  ok(r.oneTime.low > 0 || r.monthly.low > 0);
  ok('verdict' in r && 'match' in r, 'the audit result must be the builder shape');
});
t('a strong site recommends nothing at all', () => {
  const needs = needsOf(STRONG);
  const r = R.recommendFromNeeds(needs);
  const buying = r.lines.filter(l => !l.included);
  eq(buying.length, 0, 'nothing should be recommended for ' + JSON.stringify(needs));
  eq(r.verdict, 'empty');
});
t('alreadyStrong categories are reported, not silently dropped', () => {
  const r = R.recommendFromNeeds({ brand:'alreadyStrong', website:'critical' });
  ok(r.nothingRecommendedFor.includes('brand'));
});
t('priority: critical outranks three optionals', () => {
  const critical = R.recommendFromNeeds({ website:'critical' });
  const optional = R.recommendFromNeeds({ brand:'optional', content:'optional', tracking:'optional' });
  ok(critical.lines.length > 0, 'a critical need must recommend something');
  eq(optional.lines.length, 0, 'optional needs alone must not (they are excluded by default)');
});
t('the recommendation never invents a price', () => {
  const r = R.recommendFromNeeds(needsOf(WEAK));
  r.lines.forEach(l => {
    const o = Offers.get(l.id);
    ok(o, 'unknown offer ' + l.id);
    ok(l.low === 0 || l.low % o.price === 0 || l.low === o.minimum,
       l.id + ' priced at ' + l.low + ' which is not derived from ' + o.price);
  });
});
t('audit handoff carries ids and quantities only', () => {
  const r = R.recommendFromNeeds(needsOf(WEAK));
  const handoff = {};
  r.lines.forEach(l => { handoff[l.id] = l.qty; });
  Object.keys(handoff).forEach(id => {
    ok(Offers.get(id), id + ' is not a real offer id');
    ok(typeof handoff[id] === 'number');
  });
  /* and it must re-evaluate to the same numbers on the other side */
  const round = R.evaluate(handoff);
  eq(round.oneTime.low, r.oneTime.low, 'handoff must round-trip:');
  eq(round.monthly.low, r.monthly.low);
});

/* ====================================================================== */
(async function () {
  await dnsTests();
  await rlTests();
  await modelTests();
  console.log('\nKREATED — free website audit\n');
  results.forEach(([s, n]) => console.log('  ' + (s === 'ok' ? '✓' : '✗') + ' ' + n));
  console.log('\n  ' + pass + ' passed, ' + fail + ' failed\n');
  process.exit(fail ? 1 : 0);
}());
