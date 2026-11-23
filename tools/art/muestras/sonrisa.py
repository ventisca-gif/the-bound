# Muestra de la transformación «Sonrisa Carmesí» con el propio motor (10 estructuras, 4 vistas).
# Uso: python3 tools/art/muestras/sonrisa.py file://$PWD/dist/test.html salida.png [zoom.png]
import sys
from playwright.sync_api import sync_playwright
url, out = sys.argv[1], sys.argv[2]
zoom = sys.argv[3] if len(sys.argv) > 3 else None
JS = r"""(ZOOM => { const P = G.P, S = 3, cols = [['', 'idle', 'down', 0], ['s1', 'idle', 'down', 0], ['s2', 'idle', 'down', 0], ['s2', 'walk', 'left', 1], ['s2', 'walk', 'right', 2], ['s2', 'idle', 'up', 0]];
  const heads = ['Normal', 'Media forma', 'Forma completa', 'Izquierda', 'Derecha', 'Espalda'];
  const rows = []; for (const g of ['m', 'f']) for (let bt = 0; bt < BODY_T[g].length; bt++) rows.push([g, bt]);
  const atl = (g, bt, smp) => { const app = Object.assign({}, normApp(P.app), { g, bt }); if (smp) app.smp = smp; return buildHeroAtlas(heroLook(P.cls, app, gearTiers(P), P.cos || {}, {})); };
  const A0 = atl('m', 0, ''), CW = A0.fw, CH = A0.fh, c = document.createElement('canvas'); c.id = 'sheet';
  const Z = ZOOM ? 1 : 0; c.width = 130 + cols.length * CW * S; c.height = 30 + rows.length * CH * S; const x = c.getContext('2d'); x.fillStyle = '#3a4a5a'; x.fillRect(0, 0, c.width, c.height); x.imageSmoothingEnabled = false;
  x.font = 'bold 14px sans-serif'; x.fillStyle = '#fff'; heads.forEach((h, k) => x.fillText(h, 130 + k * CW * S + 6, 20));
  rows.forEach(([g, bt], r) => { const cache = {}; cols.forEach(([smp, an, d, fr], k) => { const A = cache[smp] || (cache[smp] = atl(g, bt, smp)); x.drawImage(A.img, (A.idx[an] + fr) * A.fw, ['down', 'left', 'right', 'up'].indexOf(d) * A.fh, A.fw, A.fh, 130 + k * CW * S, 30 + r * CH * S, CW * S, CH * S); });
    x.fillStyle = '#fff'; x.font = 'bold 13px sans-serif'; x.fillText((g === 'm' ? '♂ ' : '♀ ') + (LANG_EN ? BODY_T[g][bt].n[1] : BODY_T[g][bt].n[0]), 6, 30 + r * CH * S + CH * S / 2); });
  if (ZOOM) { const c2 = document.createElement('canvas'), Z2 = 9, list = [['m', 1, ''], ['m', 1, 's2'], ['f', 0, 's2']]; c2.width = list.length * CW * Z2; c2.height = CH * Z2; const y = c2.getContext('2d'); y.fillStyle = '#2a2030'; y.fillRect(0, 0, c2.width, c2.height); y.imageSmoothingEnabled = false;
    list.forEach(([g, bt, smp], i) => { const A = atl(g, bt, smp); y.drawImage(A.img, A.idx.idle * A.fw, 0, A.fw, A.fh, i * CW * Z2, 0, CW * Z2, CH * Z2); }); c2.id = 'zoom'; document.body.innerHTML = ''; document.body.appendChild(c2); document.body.appendChild(c); return 2; }
  document.body.innerHTML = ''; document.body.appendChild(c); return 1; })"""
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--allow-file-access-from-files']); pg = b.new_page(viewport={'width': 1600, 'height': 2600}); pg.goto(url); pg.wait_for_timeout(2500)
    pg.click('#tNew'); pg.wait_for_timeout(400); pg.fill('#ccName', 'Sergio'); pg.click('#ccGo'); pg.wait_for_timeout(1500)
    try: pg.click('#introOk', timeout=2000)
    except Exception: pass
    pg.add_script_tag(path='tools/art/muestras/muestra_sonrisa.js')
    print(pg.evaluate('(' + JS + ')(' + ('true' if zoom else 'false') + ')'))
    pg.locator('#sheet').screenshot(path=out)
    if zoom: pg.locator('#zoom').screenshot(path=zoom)
    b.close()
