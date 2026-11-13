"""Renders the launcher icon (192x192 PNG) with the game's own sprite renderer."""
import sys, base64
from playwright.sync_api import sync_playwright

JS = r"""
(() => {
  const S = 192, c = document.createElement('canvas'); c.width = c.height = S; const x = c.getContext('2d'); x.imageSmoothingEnabled = false;
  // pixel sunset sky with dithered bands
  const sky = ['#1a0f2e', '#2a1640', '#45204e', '#6a2c56', '#9a3a52', '#c8524a', '#e8743a', '#f4a048'];
  const bh = S / sky.length;
  for (let i = 0; i < sky.length; i++) { x.fillStyle = sky[i]; x.fillRect(0, Math.floor(i * bh), S, Math.ceil(bh) + 1); if (i + 1 < sky.length) { x.fillStyle = sky[i + 1]; for (let px = 0; px < S; px += 4) for (let py = 0; py < 6; py += 3) x.fillRect(px + (py % 2 ? 2 : 0), Math.floor((i + 1) * bh) - 6 + py, 2, 2); } }
  // stars
  x.fillStyle = '#fff4d0'; for (const [sx, sy] of [[20, 14], [44, 30], [150, 18], [170, 40], [120, 10], [90, 26], [30, 52], [160, 64]]) x.fillRect(sx, sy, 2, 2);
  // big pale moon
  x.fillStyle = '#ffe9b0'; x.beginPath(); x.arc(148, 46, 18, 0, 7); x.fill(); x.fillStyle = '#f4d48a'; x.fillRect(140, 40, 4, 4); x.fillRect(152, 52, 3, 3);
  // hills
  x.fillStyle = '#3a1e3a'; x.beginPath(); x.moveTo(0, 150); for (let px = 0; px <= S; px += 8) x.lineTo(px, 138 + Math.sin(px / 23) * 8); x.lineTo(S, S); x.lineTo(0, S); x.fill();
  x.fillStyle = '#24122a'; x.beginPath(); x.moveTo(0, 168); for (let px = 0; px <= S; px += 8) x.lineTo(px, 160 + Math.cos(px / 17) * 6); x.lineTo(S, S); x.lineTo(0, S); x.fill();
  // hero
  const L = heroLook('guerrero', normApp({ g: 'm', skin: 1, hair: 'castano', hs: 3, eyes: 'azul' }), { weapon: 10, head: 9, body: 10, legs: 10, feet: 10 }, { back: 'c_capa_real' }, { hideHelm: true });
  const A = buildHeroAtlas(L), f = A.idx.idle;
  // crop the frame to its visible pixels so the hero fills the icon
  const t = document.createElement('canvas'); t.width = A.fw; t.height = A.fh; const tx = t.getContext('2d'); tx.drawImage(A.img, f * A.fw, 0, A.fw, A.fh, 0, 0, A.fw, A.fh);
  const id = tx.getImageData(0, 0, A.fw, A.fh).data; let x0 = A.fw, y0 = A.fh, x1 = 0, y1 = 0;
  for (let yy = 0; yy < A.fh; yy++) for (let xx = 0; xx < A.fw; xx++) if (id[(yy * A.fw + xx) * 4 + 3] > 20) { x0 = Math.min(x0, xx); x1 = Math.max(x1, xx); y0 = Math.min(y0, yy); y1 = Math.max(y1, yy); }
  const cw = x1 - x0 + 1, ch = y1 - y0 + 1, sc = Math.max(1, Math.floor(Math.min(150 / ch, 150 / cw)));
  const w = cw * sc, h = ch * sc;
  x.fillStyle = 'rgba(0,0,0,.35)'; x.beginPath(); x.ellipse(S / 2, 178, w * 0.4, 7, 0, 0, 7); x.fill();
  x.drawImage(t, x0, y0, cw, ch, Math.round((S - w) / 2), Math.round(180 - h), w, h);
  // gold frame
  x.strokeStyle = '#7a4f14'; x.lineWidth = 8; x.strokeRect(4, 4, S - 8, S - 8); x.strokeStyle = '#f0c84a'; x.lineWidth = 4; x.strokeRect(4, 4, S - 8, S - 8); x.fillStyle = '#fff0a0'; for (const [cx, cy] of [[2, 2], [S - 8, 2], [2, S - 8], [S - 8, S - 8]]) x.fillRect(cx, cy, 6, 6);
  return c.toDataURL('image/png');
})()
"""

if __name__ == '__main__':
    url, out = sys.argv[1], sys.argv[2]
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--allow-file-access-from-files'])
        pg = b.new_page()
        pg.goto(url)
        pg.wait_for_timeout(2500)
        d = pg.evaluate(JS)
        open(out, 'wb').write(base64.b64decode(d.split(',', 1)[1]))
        b.close()
    print('icon', out)
