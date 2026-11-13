# Cuadrícula de héroes dibujados con el motor: filas x columnas de looks, un fotograma cada uno.
# usage: python3 tools/dev/grid.py URL out.png "<js: {rows:[label..], cols:[label..], L:[[L..]..]}>" [scale] [anim] [dir] [frame]
import sys
from playwright.sync_api import sync_playwright
url, out, spec = sys.argv[1], sys.argv[2], sys.argv[3]
S = int(sys.argv[4]) if len(sys.argv) > 4 else 4
an, dr, fr = (sys.argv[5] if len(sys.argv) > 5 else 'idle'), (sys.argv[6] if len(sys.argv) > 6 else 'down'), int(sys.argv[7] if len(sys.argv) > 7 else 0)
JS = r"""((D, S, an, dir, fr) => { const CW = 40, CH = 42, X0 = 4, Y0 = 4, LW = 130, TH = 20;
const c = document.createElement('canvas'); c.id = 'sheet'; c.width = LW + CW * S * D.cols.length; c.height = TH + (CH * S) * D.rows.length; const x = c.getContext('2d'); x.fillStyle = '#4a7a3a'; x.fillRect(0, 0, c.width, c.height); x.imageSmoothingEnabled = false; x.font = 'bold 14px sans-serif'; x.fillStyle = '#fff';
D.cols.forEach((t, k) => x.fillText(t, LW + k * CW * S + 6, 15));
D.L.forEach((row, r) => { x.fillStyle = '#fff'; x.fillText(D.rows[r], 6, TH + r * CH * S + CH * S / 2); row.forEach((L, k) => { const A = buildHeroAtlas(L), col = A.idx[an] + fr, rw = ['down','left','right','up'].indexOf(dir); if (typeof hdEnsure === 'function' && HDS > 1 && A.hdL && hdEnsure(A, col, rw, true)) x.drawImage(A.hd, (col * A.fw + X0) * 2, (rw * A.fh + Y0) * 2, CW * 2, CH * 2, LW + k * CW * S, TH + r * CH * S, CW * S, CH * S); else x.drawImage(A.img, col * A.fw + X0, rw * A.fh + Y0, CW, CH, LW + k * CW * S, TH + r * CH * S, CW * S, CH * S); }); });
document.body.innerHTML = ''; document.body.style.margin = 0; document.body.appendChild(c); return 1; })"""
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--allow-file-access-from-files'])
    pg = b.new_page(viewport={'width': 1600, 'height': 1200}); pg.goto(url); pg.wait_for_timeout(2500)
    pg.evaluate('(' + JS + ')(' + spec + ', %d, "%s", "%s", %d)' % (S, an, dr, fr))
    pg.wait_for_timeout(200); pg.locator('#sheet').screenshot(path=out)
    b.close()
