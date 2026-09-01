#!/usr/bin/env node
/* ==========================================================================
   LOCAL DEV ONLY. Runs a Netlify function handler from the command line so
   serve.py can serve /.netlify/functions/* without the Netlify CLI.
   Reads the event JSON on stdin, writes the response JSON on stdout.
   🚫 Not deployed, not referenced by anything in the site.
   ========================================================================== */
'use strict';
let raw = '';
process.stdin.on('data', d => raw += d);
process.stdin.on('end', async () => {
  try {
    const event = JSON.parse(raw || '{}');
    const fn = require('../netlify/functions/' + process.argv[2] + '.js');
    const res = await fn.handler(event, {});
    process.stdout.write(JSON.stringify(res));
  } catch (e) {
    process.stdout.write(JSON.stringify({ statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Local function runner failed: ' + e.message }) }));
  }
});
