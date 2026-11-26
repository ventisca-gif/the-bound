"""Hoja con el motor: auras de transformación (TR_AURA), destellos (TR_FLASH) y pose del Engranaje 2.
Uso: python3 tools/art/muestras/auras_formas.py file://$PWD/dist/test.html salida.png [muestra.js|-] [filas JSON]
Fila: [etiqueta, forma, [fases], {fus, fus2, modo: 'aura'|'flash'|'pose'}]
"""
import sys, json
from playwright.sync_api import sync_playwright
url, out = sys.argv[1], sys.argv[2]
extra = sys.argv[3] if len(sys.argv) > 3 and sys.argv[3] != '-' else None
A = {}
rows = json.loads(sys.argv[4]) if len(sys.argv) > 4 else [
 ['Despertar Dorado', 'dorado', [1, 2, 3], A], ['Tejedor Primordial', 'tejedor', [1, 2], A], ['Mitad Lobo', 'lobo', [1, 2], A], ['Mitad Fantasma', 'fantasma', [1], A],
 ['Mitad Vampiro', 'vampiro', [1], A], ['Mitad Dragón (Mitad · 2.0)', 'dragon', [1, 3], A], ['Alado Caído (ángel)', 'alado', [1, 2], A], ['Eco sin Pintar', 'eco', [1, 2], A],
 ['Guardián de Hielo (Forma · Cristal 2.0)', 'hielo', [1, 3], A], ['Engranaje 2', 'vapor', [1], A],
 ['Fusión · Dragón de Hielo', 'dragon', [1, 3], {'fus': 1}], ['Fusión · Boceto de Fuego', 'dragon', [1, 3], {'fus2': 'bf'}], ['Fusión · Ángel de Niebla', 'alado', [1, 2], {'fus2': 'an'}],
 ['Engranaje 2 · pose al transformarse (4 direcciones)', 'vapor', ['down', 'left', 'right', 'up'], {'modo': 'pose'}],
 ['Destello · Dorado', 'dorado', [0.08, 0.3, 0.55, 0.85], {'modo': 'flash', 'F': 2}], ['Destello · Alado', 'alado', [0.08, 0.3, 0.55, 0.85], {'modo': 'flash'}],
 ['Destello · Fantasma', 'fantasma', [0.08, 0.3, 0.55, 0.85], {'modo': 'flash'}], ['Destello · Vampiro', 'vampiro', [0.08, 0.3, 0.55, 0.85], {'modo': 'flash'}],
 ['Destello · Engranaje 2 (con la pose)', 'vapor', [0.08, 0.3, 0.55, 0.85], {'modo': 'flash', 'pose': 1}], ['Destello · Dragón de Hielo', 'dragon', [0.08, 0.3, 0.55, 0.85], {'modo': 'flash', 'fus': 1}]]
JS = r"""(ROWS => { const P = G.P; const S = 3, CW = 110, CH = 100, T0 = G.t;
const c = document.createElement('canvas'); c.width = CW * S * 4 + 10; c.height = ROWS.length * (CH * S + 26); const x = c.getContext('2d'); x.fillStyle = '#20242c'; x.fillRect(0, 0, c.width, c.height); x.imageSmoothingEnabled = false;
const ox0 = P.x, oy0 = P.y; P.x += -200; P.y += -300; P._dzTest = 1; P._tejTest = 1; const lv = P.lv; P.lv = 1000; G.paused = true;
ROWS.forEach(([lab, sr, fs, o], ri) => { const oy = ri * (CH * S + 26), modo = o.modo || 'aura'; x.fillStyle = '#fff'; x.font = 'bold 18px sans-serif'; x.fillText(lab, 6, oy + 19);
  const cols = modo === 'aura' ? [[fs[0], 1]].concat(fs.map(f => [f, 0])) : fs.map(f => [f, 0]);
  cols.forEach(([v, off], ci) => { P.sr = sr; P.srOwn = [sr]; P.fus = o.fus || 0; P.fus2 = o.fus2 || null; P.dir = modo === 'pose' ? v : 'down'; P.moving = false; P.anim = 'idle';
    const F = modo === 'aura' ? v : (o.F || 1); P.srF = F; P.trAuraOff = off; P._trK = trKeyP(P); P._trF = F; P._trOff = off; P._trSeen = 1; P._trAt = -1; P._trFl = 0; P._poseT = 0; refreshLook();
    if (modo === 'flash') { P._trFl = G.t - v * TRF_DUR; if (o.pose) P._poseT = G.t + 1; }
    if (modo === 'pose') P._poseT = G.t + 1;
    G.t = T0 + ci * 0.41; if (modo === 'flash') P._trFl = G.t - v * TRF_DUR; if (P._poseT) P._poseT = G.t + 1;
    G.cam.x = P.x - VW / 2; G.cam.y = P.y - VH / 2; render();
    const hds = cv.width / VW, px = (P.x - Math.round(G.cam.x)) * hds, py = (P.y - Math.round(G.cam.y)) * hds;
    x.drawImage(cv, px - CW / 2 * hds, py - (CH - 24) * hds, CW * hds, CH * hds, ci * CW * S + 4, oy + 24, CW * S, CH * S);
    x.fillStyle = '#ffd'; x.font = '14px sans-serif'; x.fillText(modo === 'flash' ? Math.round(v * 450) + ' ms' : modo === 'pose' ? v : (off ? 'sin aura · ' : 'aura · ') + 'fase ' + v, ci * CW * S + 10, oy + 24 + CH * S - 6); }); });
P.lv = lv; P.x = ox0; P.y = oy0; P.trAuraOff = 0; P.fus = 0; P.fus2 = null; document.body.innerHTML = ''; document.body.appendChild(c); c.id = 'sheet'; return 'ok'; })"""
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--allow-file-access-from-files']); pg = b.new_page(viewport={'width': 1400, 'height': 900})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: m.type == 'warning' and 'aura' in m.text.lower() and errs.append(m.text)); pg.goto(url); pg.wait_for_timeout(2500)
    pg.click('#tNew'); pg.wait_for_timeout(400); pg.fill('#ccName', 'Sergio'); pg.click('#ccGo'); pg.wait_for_timeout(1500)
    try: pg.click('#introOk', timeout=2000)
    except Exception: pass
    pg.wait_for_timeout(800)
    if extra: pg.add_script_tag(path=extra)
    print(pg.evaluate('(' + JS + ')(' + json.dumps(rows) + ')'), errs[:5]); pg.evaluate("window.__w = (typeof ERRS!=='undefined'?ERRS:null)"); pg.locator('#sheet').screenshot(path=out); b.close()
