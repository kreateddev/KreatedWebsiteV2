/* ==========================================================================
   KREATED — SSRF-HARDENED FETCHER
   The audit takes a URL from an anonymous form and fetches it server-side.
   That is a Server-Side Request Forgery primitive unless every one of the
   checks below holds, so this file is deliberately paranoid and deliberately
   separate from the audit logic. 🚫 Do not import this to fetch anything the
   user did not name, and 🚫 do not add a bypass flag "for testing".

   What it refuses:
     · any scheme but http/https              · credentials in the URL
     · any port but 80/443                    · localhost and *.local
     · loopback, private, link-local, CGNAT, multicast, reserved IPv4
     · IPv6 loopback, ULA, link-local, and IPv4-mapped forms of all the above
     · a redirect whose destination fails any of the above
     · a response that is not HTML, or is larger than the cap

   ⚠ THE DNS CHECK IS THE ONE THAT MATTERS. A hostname like `evil.example`
   can resolve to 127.0.0.1. Blocking literal IPs in the string is not enough:
   every address the name resolves to is checked, and every redirect hop is
   resolved and checked again.
   ========================================================================== */
'use strict';

const dns = require('dns').promises;
const http = require('http');
const https = require('https');
const { URL } = require('url');

const LIMITS = {
  /* ⚠ 6s, raised from 4s on 2026-09-01 when the platform ceiling turned out
     to be 60s rather than the 10s this file had assumed. Three pages at 6s is
     18s, which fits the 22s budget in audit-core.js with the ~2s rate limiter
     in front of it. Measured real crawls run 0.3-4s for ALL THREE pages
     together, so this only bites a genuinely slow host — which is exactly the
     case it was raised for. 🚫 Tied to BUDGET.PAGE_RESERVE_MS: change both. */
  TIMEOUT_MS: 6000,
  MAX_BYTES: 1200000,     /* 1.2MB of HTML is far more than any real homepage */
  MAX_REDIRECTS: 3,
  ALLOWED_PORTS: new Set([80, 443]),
  ALLOWED_TYPES: [/^text\/html/i, /^application\/xhtml\+xml/i]
};

/* ---- IPv4 -------------------------------------------------------------- */
function v4Blocked(ip) {
  const p = ip.split('.').map(Number);
  if (p.length !== 4 || p.some(n => !Number.isInteger(n) || n < 0 || n > 255)) return 'malformed address';
  const [a, b] = p;
  if (a === 0)                      return 'this network';
  if (a === 10)                     return 'private range';
  if (a === 127)                    return 'loopback';
  if (a === 169 && b === 254)       return 'link-local';
  if (a === 172 && b >= 16 && b <= 31) return 'private range';
  if (a === 192 && b === 168)       return 'private range';
  if (a === 192 && b === 0)         return 'reserved';
  if (a === 100 && b >= 64 && b <= 127) return 'carrier-grade NAT';
  if (a >= 224)                     return 'multicast or reserved';
  return null;
}

/* ---- IPv6, including the IPv4-mapped forms ------------------------------ */
function v6Blocked(ip) {
  const s = ip.toLowerCase().split('%')[0];
  if (s === '::1' || s === '::')    return 'loopback';
  /* ::ffff:127.0.0.1 and ::ffff:7f00:1 both reach the loopback */
  const mapped = s.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return v4Blocked(mapped[1]) || null;
  if (/^::ffff:/.test(s))           return 'IPv4-mapped address';
  if (/^f[cd]/.test(s))             return 'unique local address';
  if (/^fe[89ab]/.test(s))          return 'link-local';
  if (/^ff/.test(s))                return 'multicast';
  return null;
}

function addressBlocked(addr) {
  return addr.family === 6 ? v6Blocked(addr.address) : v4Blocked(addr.address);
}

/* ---- the URL itself ----------------------------------------------------- */
function parseAndCheck(raw) {
  let u;
  try { u = new URL(raw); }
  catch (e) { throw new AuditError('bad-url', 'That does not look like a web address.'); }

  if (u.protocol !== 'http:' && u.protocol !== 'https:')
    throw new AuditError('bad-scheme', 'Only http and https addresses can be checked.');
  if (u.username || u.password)
    throw new AuditError('bad-url', 'Addresses with credentials in them are not accepted.');

  const port = u.port ? Number(u.port) : (u.protocol === 'https:' ? 443 : 80);
  if (!LIMITS.ALLOWED_PORTS.has(port))
    throw new AuditError('bad-port', 'Only standard web ports can be checked.');

  const host = u.hostname.toLowerCase().replace(/\.$/, '');
  if (host === 'localhost' || host.endsWith('.localhost') ||
      host.endsWith('.local') || host.endsWith('.internal') ||
      host.endsWith('.home.arpa') || host === 'metadata.google.internal' ||
      !host.includes('.'))
    throw new AuditError('blocked-host', 'That address is not a public website.');

  return u;
}

async function resolveAndCheck(hostname) {
  let addrs;
  try { addrs = await dns.lookup(hostname, { all: true, verbatim: true }); }
  catch (e) { throw new AuditError('dns', 'That domain could not be found.'); }
  if (!addrs.length) throw new AuditError('dns', 'That domain could not be found.');
  for (const a of addrs) {
    const why = addressBlocked(a);
    /* ⚠ ANY blocked address disqualifies the host. A name that resolves to
       both a public and a private address is a DNS-rebinding attempt. */
    if (why) throw new AuditError('blocked-host', 'That address resolves to a private network.');
  }
  return addrs;
}

class AuditError extends Error {
  constructor(code, message) { super(message); this.code = code; this.expose = true; }
}

/* ---- the fetch ---------------------------------------------------------- */
function once(u, addr) {
  return new Promise((resolve, reject) => {
    const lib = u.protocol === 'https:' ? https : http;
    const req = lib.request({
      protocol: u.protocol,
      /* ⚠ connect to the ADDRESS WE VALIDATED, not to the hostname again.
         Resolving twice is a TOCTOU window a rebinding attack lives in. */
      host: addr.address,
      port: u.port || (u.protocol === 'https:' ? 443 : 80),
      path: u.pathname + u.search,
      method: 'GET',
      servername: u.hostname,
      headers: {
        'Host': u.hostname,
        'User-Agent': 'KreatedAudit/1.0 (+https://kreated.dev; website audit requested by the site owner)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      timeout: LIMITS.TIMEOUT_MS
    }, res => {
      const type = String(res.headers['content-type'] || '');
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        return resolve({ redirect: res.headers.location, status: res.statusCode });
      }
      if (res.statusCode >= 400) {
        res.resume();
        return reject(new AuditError('http-' + res.statusCode,
          res.statusCode === 403 || res.statusCode === 401
            ? 'That site refused an automated request.'
            : 'That site returned an error (' + res.statusCode + ').'));
      }
      if (!LIMITS.ALLOWED_TYPES.some(rx => rx.test(type))) {
        res.resume();
        return reject(new AuditError('not-html', 'That address did not return a web page.'));
      }
      let size = 0; const chunks = [];
      res.on('data', c => {
        size += c.length;
        if (size > LIMITS.MAX_BYTES) { req.destroy(); return reject(new AuditError('too-large', 'That page is too large to check.')); }
        chunks.push(c);
      });
      res.on('end', () => resolve({ html: Buffer.concat(chunks).toString('utf8'), status: res.statusCode, finalUrl: u.href }));
    });
    req.on('timeout', () => { req.destroy(); reject(new AuditError('timeout', 'That site took too long to respond.')); });
    req.on('error', () => reject(new AuditError('unreachable', 'That site could not be reached.')));
    req.end();
  });
}

/* every hop is re-parsed, re-resolved and re-checked from scratch */
async function safeFetch(raw) {
  let target = parseAndCheck(raw);
  for (let hop = 0; hop <= LIMITS.MAX_REDIRECTS; hop++) {
    const addrs = await resolveAndCheck(target.hostname);
    const out = await once(target, addrs[0]);
    if (!out.redirect) return { html: out.html, finalUrl: target.href };
    target = parseAndCheck(new URL(out.redirect, target).href);
  }
  throw new AuditError('too-many-redirects', 'That address redirected too many times.');
}

module.exports = { safeFetch, parseAndCheck, resolveAndCheck, v4Blocked, v6Blocked, AuditError, LIMITS };
