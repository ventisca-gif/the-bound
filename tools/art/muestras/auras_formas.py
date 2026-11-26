"""Hoja con el motor: auras de transformación (TR_AURA) de cada forma, sin aura / con aura por fase.
Uso: python3 tools/art/muestras/auras_formas.py file://$PWD/dist/test.html salida.png [muestra.js] [formas]
"""
import sys, json
from playwright.sync_api import sync_playwright
url, out = sys.argv[1], sys.argv[2]
extra = sys.argv[3] if len(sys.argv) > 3 and sys.argv[3] != '-' else None
rows = json.loads(sys.argv[4]) if len(sys.argv) > 4 else [['Mitad Lobo', 'lobo', [1, 2]], ['Mitad Fantasma', 'fantasma', [1]], ['Mitad Vampiro', 'vampiro', [1]], ['Mitad Dragón', 'dragon', [1, 3]], ['Alado Caído', 'alado', [1, 2]], ['Eco sin Pintar', 'eco', [1, 2]], ['Guardián de Hielo', 'hielo', [1, 3]], ['Engranaje 2', 'vapor', [1]]]
JS = r"""(ROWS => { const P = G.P; const S = 3, CW = 110, CH = 100, T0 = G.t;
const c = document.createElement('canvas'); c.width = CW * S * 3 + 10; c.height = ROWS.length * (CH * S + 26); const x = c.getContext('2d'); x.fillStyle = '#20242c'; x.fillRect(0, 0, c.width, c.height); x.imageSmoothingEnabled = false;
const ox0 = P.x, oy0 = P.y; P.x += -200; P.y += -300; P._dzTest = 1; P._tejTest = 1; const lv = P.lv; P.lv = 1000; G.paused = true;
ROWS.forEach(([lab, sr, fs], ri) => { const oy = ri * (CH * S + 26); x.fillStyle = '#fff'; x.font = 'bold 18px sans-serif'; x.fillText(lab, 6, oy + 19);
  const cols = [[fs[0], 1]].concat(fs.map(f => [f, 0]));
  cols.forEach(([F, off], ci) => { P.sr = sr; P.srOwn = [sr]; P.dir = 'down'; P.moving = false; P.srF = F; P.trAuraOff = off; P._trF = F; P._trFl = 0; refreshLook();
    G.t = T0 + ci * 0.41; G.cam.x = P.x - VW / 2; G.cam.y = P.y - VH / 2; render();
    const hds = cv.width / VW, px = (P.x - Math.round(G.cam.x)) * hds, py = (P.y - Math.round(G.cam.y)) * hds;
    x.drawImage(cv, px - CW / 2 * hds, py - (CH - 24) * hds, CW * hds, CH * hds, ci * CW * S + 4, oy + 24, CW * S, CH * S);
    x.fillStyle = '#ffd'; x.font = '14px sans-serif'; x.fillText((off ? 'sin aura · ' : 'aura · ') + 'fase ' + F, ci * CW * S + 10, oy + 24 + CH * S - 6); }); });
P.lv = lv; P.x = ox0; P.y = oy0; P.trAuraOff = 0; document.body.innerHTML = ''; document.body.appendChild(c); c.id = 'sheet'; return 'ok'; })"""
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--allow-file-access-from-files']); pg = b.new_page(viewport={'width': 1400, 'height': 900})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e))); pg.goto(url); pg.wait_for_timeout(2500)
    pg.click('#tNew'); pg.wait_for_timeout(400); pg.fill('#ccName', 'Sergio'); pg.click('#ccGo'); pg.wait_for_timeout(1500)
    try: pg.click('#introOk', timeout=2000)
    except Exception: pass
    pg.wait_for_timeout(800)
    if extra: pg.add_script_tag(path=extra)
    print(pg.evaluate('(' + JS + ')(' + json.dumps(rows) + ')'), errs[:5]); pg.locator('#sheet').screenshot(path=out); b.close()
