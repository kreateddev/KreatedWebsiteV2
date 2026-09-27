// ============================================================================
// KREATED MOTION RENDERER
// Drives stage.html frame by frame through headless Chrome, so every frame is
// exact and repeatable, then hands the frames to ffmpeg.
//
//   node render.mjs stills  [moment|all|blue|color] [format]      → exports/stills/<m>-<f>-sheet.jpg
//   node render.mjs video   [moment|all] [format|all]  → exports/<format>/<m>.mp4
//   node render.mjs gif     [moment|all] [format]      → exports/gif/<m>-<f>.gif
//
// Formats: feed 1080×1350 · story 1080×1920 · wide 1920×1080 · square 1080×1080 · sig 480×480
// ============================================================================
import { spawn, spawnSync } from 'node:child_process';
import { writeFileSync, mkdirSync, rmSync, mkdtempSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BLUE = ['face', 'pin', 'build', 'seven', 'halves', 'search', 'neon', 'before', 'call', 'pulse'];
const COLOR = ['open', 'stars', 'lighthouse', 'kaleido', 'swatch', 'blocks', 'notify', 'route', 'unveil', 'chrome'];
const SERVICE = ['webdesign', 'redesign', 'localseo', 'gbp', 'aeo', 'brand', 'social'];
const ORDER = BLUE.concat(COLOR, SERVICE);
const FMT = { feed: [1080, 1350], story: [1080, 1920], wide: [1920, 1080], square: [1080, 1080], sig: [480, 480] };
const FPS = 30;
const [cmd = 'stills', which = 'all', fmtArg = 'feed'] = process.argv.slice(2);
const moments = which === 'all' ? ORDER : which === 'blue' ? BLUE : which === 'color' ? COLOR : which === 'service' ? SERVICE : which.split(',');
const formats = fmtArg === 'all' ? ['feed', 'story', 'wide'] : fmtArg.split(',');
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function browser() {
  const port = 9400 + Math.floor(Math.random() * 400);
  const prof = mkdtempSync(tmpdir() + '/kmprof-');
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    ['--headless=new', '--hide-scrollbars', '--force-color-profile=srgb', `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, 'about:blank'], { stdio: 'ignore' });
  let ws;
  for (let t = 0; t < 60 && !ws; t++) {
    try { const j = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); const pg = j.find(x => x.type === 'page'); if (pg) ws = new WebSocket(pg.webSocketDebuggerUrl); } catch {}
    if (!ws) await sleep(200);
  }
  if (ws.readyState !== 1) await new Promise(r => ws.addEventListener('open', r));
  let id = 0; const pend = new Map();
  ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m.result || { error: m.error }); pend.delete(m.id); } });
  const send = (method, params = {}) => new Promise(res => { const i = ++id; pend.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async x => (await send('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true })).result?.value;
  await send('Page.enable'); await send('Runtime.enable');
  return { send, ev, close: () => { try { ws.close(); } catch {} chrome.kill(); } };
}

async function open(b, m, f) {
  const [W, H] = FMT[f];
  await b.send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
  await b.send('Page.navigate', { url: `file://${HERE}/stage.html?m=${m}&f=${f}&mode=frame` });
  for (let t = 0; t < 60; t++) { if (await b.ev('window.kReady === true')) break; await sleep(100); }
  const err = await b.ev('window.__err || null');
  if (err) throw new Error(err);
  return { W, H, info: await b.ev('window.kInfo') };
}
// JPEG at 95 is ~6× faster to capture than PNG and indistinguishable after the H.264 pass; stills keep PNG.
let FRAME_FMT = 'png';
async function frame(b, p) { await b.ev(`window.kSet(${p})`); const r = await b.send('Page.captureScreenshot', FRAME_FMT === 'png' ? { format: 'png' } : { format: 'jpeg', quality: 95 }); return Buffer.from(r.data, 'base64'); }

async function stills() {
  const b = await browser(); mkdirSync(`${HERE}/exports/stills`, { recursive: true });
  for (const f of formats) for (const m of moments) {
    await open(b, m, f);
    const ps = (m === 'pulse' || m === 'kaleido') ? [0, .25, .5, .75] : [.08, .3, .5, .68, .84, 1];
    const files = [];
    for (const p of ps) { const fn = `${tmpdir()}/km-${m}-${f}-${Math.round(p * 100)}.png`; writeFileSync(fn, await frame(b, p)); files.push(fn); }
    const out = `${HERE}/exports/stills/${m}-${f}-sheet.jpg`;
    const py = `from PIL import Image\nfs=${JSON.stringify(files)}\nims=[Image.open(x).convert('RGB') for x in fs]\nw,h=ims[0].size\ns=360/w\nth=[i.resize((360,int(h*s))) for i in ims]\nsheet=Image.new('RGB',(370*len(th),th[0].height),'#000')\nfor k,t in enumerate(th): sheet.paste(t,(k*370,0))\nsheet.save('${out}',quality=84)`;
    spawnSync('python3', ['-c', py]);
    console.log('sheet', m, f);
  }
  b.close();
}

async function video(asGif) {
  FRAME_FMT = 'jpg';
  const b = await browser();
  for (const f of formats) for (const m of moments) {
    const { info } = await open(b, m, f);
    const total = info.dur + info.hold;
    const n = Math.round(total / 1000 * FPS);
    const dir = mkdtempSync(`${tmpdir()}/kmf-${m}-${f}-`);
    for (let i = 0; i < n; i++) {
      const t = i / FPS * 1000; const p = info.loopOnly ? (i / n) : Math.min(1, t / info.dur);
      writeFileSync(`${dir}/${String(i).padStart(4, '0')}.${FRAME_FMT}`, await frame(b, p));
    }
    if (asGif) {
      mkdirSync(`${HERE}/exports/gif`, { recursive: true });
      const out = `${HERE}/exports/gif/${m}-${f}.gif`;
      const size = f === 'sig' ? 480 : 600;
      spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', `${dir}/%04d.${FRAME_FMT}`,
        '-vf', `fps=20,scale=${size}:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=bayer:bayer_scale=4`, out]);
      console.log('gif', out.split('/').slice(-2).join('/'));
    } else {
      mkdirSync(`${HERE}/exports/${f}`, { recursive: true });
      const out = `${HERE}/exports/${f}/${m}.mp4`;
      const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', `${dir}/%04d.${FRAME_FMT}`,
        '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '17', '-preset', 'slow', '-movflags', '+faststart', out]);
      if (r.status !== 0) console.error(String(r.stderr));
      console.log('video', out.split('/').slice(-2).join('/'), n + ' frames');
    }
    rmSync(dir, { recursive: true, force: true });
  }
  b.close();
}

if (cmd === 'stills') await stills();
else if (cmd === 'video') await video(false);
else if (cmd === 'gif') await video(true);
else if (cmd !== 'library') console.log('usage: node render.mjs stills|video|gif [moment|all] [format|all]');

// ---------------------------------------------------------------------------
// LIBRARY: node render.mjs library
// Files every rendered export into ../assets/generated/motion/<NN-moment>/, one folder per
// moment, with a poster still (the final frame) for static posts. Files are
// hard-linked, not copied, so the library costs no extra disk space.
// ---------------------------------------------------------------------------
if (cmd === 'library') {
  const { linkSync, readdirSync, unlinkSync, statSync } = await import('node:fs');
  const LIB = path.resolve(HERE, '../assets/generated/motion');
  mkdirSync(LIB, { recursive: true });
  const put = (src, dst) => { if (!existsSync(src)) return; if (existsSync(dst)) unlinkSync(dst); linkSync(src, dst); };
  ORDER.forEach((m, i) => {
    const dir = `${LIB}/${String(i + 1).padStart(2, '0')}-${m}`; mkdirSync(dir, { recursive: true });
    for (const f of ['feed', 'story', 'wide', 'square']) put(`${HERE}/exports/${f}/${m}.mp4`, `${dir}/${m}-${f}.mp4`);
    for (const g of readdirSync(`${HERE}/exports/gif`)) if (g.startsWith(m + '-')) put(`${HERE}/exports/gif/${g}`, `${dir}/${g}`);
    for (const f of ['feed', 'story', 'wide']) {
      const v = `${HERE}/exports/${f}/${m}.mp4`; if (!existsSync(v)) continue;
      spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-sseof', '-0.2', '-i', v, '-frames:v', '1', '-q:v', '2', `${dir}/${m}-${f}-poster.jpg`]);
    }
  });
  for (const r of readdirSync(`${HERE}/exports`)) if (r.startsWith('reel-')) put(`${HERE}/exports/${r}`, `${LIB}/${r}`);
  console.log('library', LIB);
}
