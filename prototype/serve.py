#!/usr/bin/env python3
"""STEP 5 PROTOTYPE — NOT PRODUCTION.
Local static server for the prototype, with caching disabled so edits are
always picked up on reload. Review tool only; not a deployment target."""
import functools, http.server, os, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'every-surface')

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
    def log_message(self, fmt, *args):
        sys.stderr.write("%s\n" % (fmt % args))

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5178
    http.server.ThreadingHTTPServer(
        ('127.0.0.1', port),
        functools.partial(Handler, directory=ROOT)
    ).serve_forever()
