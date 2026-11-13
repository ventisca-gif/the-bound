# Muestra ampliada de héroes con el propio motor, opcionalmente junto a una imagen de referencia.
# usage: python3 tools/dev/mock.py URL out.png "<js: [[label, L], ...]>" [scale] [ref.png] [cols]
# cols por defecto: idle abajo, walk abajo f1, walk izquierda f1, idle arriba
import sys, base64
from playwright.sync_api import sync_playwright
url, out, spec = sys.argv[1], sys.argv[2], sys.argv[3]
S = int(sys.argv[4]) if len(sys.argv) > 4 else 6
ref = sys.argv[5] if len(sys.argv) > 5 and sys.argv[5] != '-' else None
cols = sys.argv[6] if len(sys.argv) > 6 else "[['idle','down',0],['walk','down',1],['walk','left',1],['idle','up',0]]"
JS = r"""(([LIST, S, COLS, REF]) => new Promise(done => { const CW = 34, CH = 40, X0 = 7, Y0 = 6;
const c = document.createElement('canvas'); c.id = 'sheet'; const rows = LIST.length, per = COLS.length; c.width = CW * S * per + 120; c.height = (CH * S + 22) * rows; const x = c.getContext('2d'); x.fillStyle = '#4a7a3a'; x.fillRect(0, 0, c.width, c.height); x.imageSmoothingEnabled = false;
LIST.forEach(([lab, L], r) => { const A = buildHeroAtlas(L); COLS.forEach(([an, dir, f], k) => { x.drawImage(A.img, (A.idx[an] + f) * A.fw + X0, ['down','left','right','up'].indexOf(dir) * A.fh + Y0, CW, CH, k * CW * S, r * (CH * S + 22) + 22, CW * S, CH * S); }); x.font = 'bold 16px sans-serif'; x.fillStyle = '#fff'; x.fillText(lab, 6, r * (CH * S + 22) + 17); });
document.body.innerHTML = ''; document.body.style.margin = 0; document.body.appendChild(c);
if (!REF) return done(1); const im = new Image(); im.onload = () => { const h = Math.min(c.height, CH * S * 1.1), w = im.width * h / im.height; const c2 = document.createElement('canvas'); c2.width = c.width + w + 10; c2.height = c.height; c2.id = 'sheet'; const y = c2.getContext('2d'); y.fillStyle = '#4a7a3a'; y.fillRect(0, 0, c2.width, c2.height); y.drawImage(c, 0, 0); y.imageSmoothingEnabled = false; y.drawImage(im, c.width + 5, 22, w, h); y.font = 'bold 16px sans-serif'; y.fillStyle = '#fff'; y.fillText('Referencia', c.width + 10, 17); c.remove(); document.body.appendChild(c2); done(1); }; im.src = REF; }))"""
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--allow-file-access-from-files'])
    pg = b.new_page(viewport={'width': 1400, 'height': 1000}); pg.goto(url); pg.wait_for_timeout(2500)
    refu = ('data:image/png;base64,' + base64.b64encode(open(ref, 'rb').read()).decode()) if ref else None
    pg.evaluate('(a => (' + JS + ')(a))(' + '[%s, %d, %s, %s]' % (spec, S, cols, ('"' + refu + '"') if refu else 'null') + ')')
    pg.wait_for_timeout(300); pg.locator('#sheet').screenshot(path=out)
    b.close()
