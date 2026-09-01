#!/usr/bin/env python3
"""STEP 5B PROTOTYPE — NOT PRODUCTION.
Local static server for the prototype, with caching disabled so edits are
always picked up on reload. Review tool only; not a deployment target."""
import functools, http.server, os, sys

ROOT = os.path.dirname(os.path.abspath(__file__))

import json, subprocess

class Handler(http.server.SimpleHTTPRequestHandler):
    # ⚠ LOCAL DEV ONLY. Netlify serves /.netlify/functions/* in production;
    # this shim runs the same handler through node so the audit can be tested
    # end to end without the Netlify CLI. 🚫 Not a production code path.
    def do_POST(self):
        if not self.path.startswith('/.netlify/functions/'):
            self.send_error(404); return
        name = self.path.rsplit('/', 1)[-1].split('?')[0]
        length = int(self.headers.get('Content-Length') or 0)
        body = self.rfile.read(length).decode('utf-8', 'replace')
        event = {
            'httpMethod': 'POST',
            'path': self.path,
            'headers': {k.lower(): v for k, v in self.headers.items()},
            'body': body,
        }
        try:
            # ⚠ every local request is a FRESH node process, so an in-memory
            # limiter would never count past one. Pointing the store at a
            # directory exercises the same shared-store path production uses
            # via Netlify Blobs. 🚫 Never set this variable in production.
            env = dict(os.environ)
            env.setdefault('KREATED_AUDIT_STATE_DIR',
                           os.path.join(os.path.dirname(ROOT), '.audit-state'))
            out = subprocess.run(
                ['node', os.path.join(ROOT, 'tools', 'run-function.js'), name],
                input=json.dumps(event), capture_output=True, text=True,
                timeout=45, env=env)
            res = json.loads(out.stdout or '{}')
        except Exception as e:
            res = {'statusCode': 500,
                   'headers': {'Content-Type': 'application/json'},
                   'body': json.dumps({'error': 'local runner: %s' % e})}
        payload = (res.get('body') or '').encode('utf-8')
        self.send_response(res.get('statusCode', 200))
        for k, v in (res.get('headers') or {}).items():
            self.send_header(k, v)
        self.send_header('Content-Length', str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
    def log_message(self, fmt, *args):
        sys.stderr.write("%s\n" % (fmt % args))

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5180
    http.server.ThreadingHTTPServer(
        ('127.0.0.1', port),
        functools.partial(Handler, directory=ROOT)
    ).serve_forever()
