#!/usr/bin/env python3
"""
KREATED — Marketplace ad renderer.

Renders any concept/final HTML in src/ to a flat PNG (and a Marketplace-ready
JPG) at the exact pixel size of its .canvas element.

Everything is rendered at 2x and resampled down with Lanczos. Chromium's own
1x rasteriser leaves visibly soft hairlines and rounded corners at this size;
supersampling is what makes the browser-window strokes read as crisp at
1080px and still hold together when Marketplace scales the thumbnail down.

    python3 render.py                 # everything in the manifest
    python3 render.py concept-2       # one target

🚫 Do not "fix" a soft edge by adding a CSS shadow. Re-check SCALE first.
"""
import os, subprocess, sys, time
from PIL import Image
from playwright.sync_api import sync_playwright

HERE   = os.path.dirname(os.path.abspath(__file__))
SRC    = os.path.join(HERE, "src")
OUT    = os.path.join(HERE, "out")
CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
SCALE  = 2          # supersample factor
PORT   = 8912

# name -> (source file, canvas selector)
# Output name -> (source file, canvas selector). The four carousel slides are
# numbered so a directory listing is already the posting order.
MANIFEST = {
    "kreated-marketplace-01-cover":     ("final-1x1.html",          ".canvas"),
    "kreated-marketplace-01-cover-4x5": ("final-4x5.html",          ".canvas"),
    "kreated-marketplace-02-web-design":("slide-2-web-design.html", ".canvas"),
    "kreated-marketplace-03-local-seo": ("slide-3-local-seo.html",  ".canvas"),
    "kreated-marketplace-04-social":    ("slide-4-social.html",     ".canvas"),
    "kreated-marketplace-05-mobile":    ("slide-5-mobile.html",     ".canvas"),
    "concept-1":     ("concept-1.html",     ".canvas"),
    "concept-2":     ("concept-2.html",     ".canvas"),
    "concept-3":     ("concept-3.html",     ".canvas"),
}


def render(pw, name, src_file, selector):
    path = os.path.join(SRC, src_file)
    if not os.path.exists(path):
        print(f"  skip {name} (no {src_file})")
        return None

    browser = pw.chromium.launch(
        executable_path=CHROME,
        args=["--no-sandbox", "--disable-dev-shm-usage",
              "--force-color-profile=srgb", "--font-render-hinting=none"],
    )
    ctx = browser.new_context(viewport={"width": 1500, "height": 1500},
                              device_scale_factor=SCALE,
                              reduced_motion="reduce")
    page = ctx.new_page()
    page.goto(f"http://127.0.0.1:{PORT}/{src_file}", wait_until="networkidle")
    page.wait_for_timeout(500)
    # The final crops build their windows from ad.config.js AFTER load, so the
    # shots are requested late. networkidle usually covers it; this makes the
    # guarantee explicit rather than a timing accident.
    page.wait_for_function(
        "Array.from(document.images).every(i => i.complete && i.naturalWidth > 0)",
        timeout=30000)
    # fonts must be resolved before the shot or Cormorant falls back to Georgia
    page.evaluate("document.fonts.ready")
    page.wait_for_timeout(400)

    raw = os.path.join(OUT, f".{name}@{SCALE}x.png")
    page.locator(selector).screenshot(path=raw)
    ctx.close(); browser.close()

    im = Image.open(raw).convert("RGB")
    w, h = im.size[0] // SCALE, im.size[1] // SCALE
    im = im.resize((w, h), Image.LANCZOS)
    png = os.path.join(OUT, f"{name}.png")
    jpg = os.path.join(OUT, f"{name}.jpg")
    im.save(png)
    im.save(jpg, quality=92, subsampling=0, optimize=True)
    os.remove(raw)
    print(f"  {name}  {w}x{h}  png {os.path.getsize(png)//1024}KB  jpg {os.path.getsize(jpg)//1024}KB")
    return png


def main():
    os.makedirs(OUT, exist_ok=True)
    targets = sys.argv[1:] or list(MANIFEST)
    srv = subprocess.Popen([sys.executable, "-m", "http.server", str(PORT), "--bind", "127.0.0.1"],
                           cwd=SRC, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1.2)
    try:
        with sync_playwright() as pw:
            for t in targets:
                if t not in MANIFEST:
                    print(f"  unknown target: {t}"); continue
                render(pw, t, *MANIFEST[t])
    finally:
        srv.terminate()


if __name__ == "__main__":
    main()
