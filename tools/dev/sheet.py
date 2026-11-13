# Renders hero sprites side by side to inspect art. usage: python3 tools/dev/sheet.py URL out.png "<js returning [[label, cls, app, gear], ...]>"
import sys
from playwright.sync_api import sync_playwright
url, out, spec = sys.argv[1], sys.argv[2], sys.argv[3]
JS = r"""(LIST => { const c = document.createElement('canvas'), S = 3, cols = [['idle','down'],['walk','down'],['walk','left'],['atk','left'],['idle','up'],['walk','right']]; c.width = 48 * S * cols.length; c.height = (48 * S + 14) * LIST.length; c.id = 'sheet'; const x = c.getContext('2d'); x.fillStyle = '#4a7a3a'; x.fillRect(0, 0, c.width, c.height); x.imageSmoothingEnabled = false; x.font = '12px monospace'; x.fillStyle = '#fff';
LIST.forEach(([lab, cls, app, gear, L0], r) => { const L = L0 || heroLook(cls, app, gear || { weapon: 1 }, {}, {}); const A = buildHeroAtlas(L); cols.forEach(([an, dir], k) => { const f = an === 'walk' ? 1 : an === 'atk' ? 1 : 0; x.drawImage(A.img, (A.idx[an] + f) * A.fw, ['down','left','right','up'].indexOf(dir) * A.fh, A.fw, A.fh, k * 48 * S, r * (48 * S + 14) + 14, 48 * S, 48 * S); }); x.fillStyle = '#fff'; x.fillText(lab, 4, r * (48 * S + 14) + 11); });
document.body.innerHTML = ''; document.body.appendChild(c); return 1; })(%s)"""
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--allow-file-access-from-files'])
    pg = b.new_page(viewport={'width': 1000, 'height': 800}); pg.goto(url); pg.wait_for_timeout(2500)
    pg.evaluate(JS % spec); pg.wait_for_timeout(200); pg.locator('#sheet').screenshot(path=out)
    b.close()
