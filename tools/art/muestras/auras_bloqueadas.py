"""Hoja de muestra con el motor: auras del Despertar Dorado y del Tejedor Primordial + destello al transformarse.
Uso: python3 tools/art/muestras/auras_bloqueadas.py file://$PWD/dist/test.html salida.png [muestra.js]
"""
import sys
from playwright.sync_api import sync_playwright
url, out = sys.argv[1], sys.argv[2]
extra = sys.argv[3] if len(sys.argv) > 3 else 'tools/art/muestras/muestra_auras_bloqueadas.js'
JS = r"""(() => { const P = G.P; const S = 3, CW = 110, CH = 104, T0 = G.t; const old = dzAura;
const rows = [
 ['Dorado · aura ACTUAL', 'dorado', [1, 2, 3], 'old'], ['Dorado · aura NUEVA (propuesta)', 'dorado', [1, 2, 3], 'new'],
 ['Tejedor · SIN aura (hoy)', 'tejedor', [1, 2], 'none'], ['Tejedor · aura NUEVA (propuesta)', 'tejedor', [1, 2], 'new'],
 ['Destello al transformarse · Dorado', 'dorado', [0.05, 0.25, 0.5, 0.8], 'flash'], ['Destello al transformarse · Tejedor', 'tejedor', [0.05, 0.3, 0.55, 0.85], 'flash'] ];
const c = document.createElement('canvas'); c.width = CW * S * 4 + 10; c.height = rows.length * (CH * S + 26); const x = c.getContext('2d'); x.fillStyle = '#20242c'; x.fillRect(0, 0, c.width, c.height); x.imageSmoothingEnabled = false;
const ox0 = P.x, oy0 = P.y; P.x = +(window.MX||ox0); P.y = +(window.MY||oy0); G.cam.x = P.x - VW / 2; G.cam.y = P.y - VH / 2; P._dzTest = 1; P._tejTest = 1; const lv = P.lv; P.lv = 1000; G.paused = true;
rows.forEach(([lab, sr, cols, mode], ri) => { const oy = ri * (CH * S + 26); x.fillStyle = '#fff'; x.font = 'bold 18px sans-serif'; x.fillText(lab, 6, oy + 19);
  cols.forEach((v, ci) => { P.sr = sr; P.srOwn = [sr]; P.dir = 'down'; P.moving = false;
    const F = mode === 'flash' ? (sr === 'dorado' ? 2 : 1) : v; P.srF = F; refreshLook();
    dzAura = mode === 'old' ? old : (mode === 'new' && sr === 'dorado' ? dzAura2 : () => {});
    const wd = WORLD_DRAW.slice(); if (mode === 'new' && sr === 'tejedor') WORLD_DRAW.push((cx, cy) => tjAura(P, cx, cy, F));
    if (mode === 'flash') { const u = v; WORLD_DRAW.push((cx, cy) => { if (sr === 'dorado') dzAura2(P, cx, cy, F); else tjAura(P, cx, cy, F); trFlash(P.x - cx, P.y - cy, sr, u); }); }
    G.t = T0 + ci * 0.37; G.cam.x = P.x - VW / 2; G.cam.y = P.y - VH / 2; render(); WORLD_DRAW.length = 0; WORLD_DRAW.push(...wd);
    const hds = cv.width / VW, px = (P.x - Math.round(G.cam.x)) * hds, py = (P.y - Math.round(G.cam.y)) * hds;
    x.drawImage(cv, px - CW / 2 * hds, py - (CH - 22) * hds, CW * hds, CH * hds, ci * CW * S + 4, oy + 24, CW * S, CH * S);
    x.fillStyle = '#ffd'; x.font = '14px sans-serif'; x.fillText(mode === 'flash' ? Math.round(v * 450) + ' ms' : 'Fase ' + v, ci * CW * S + 10, oy + 24 + CH * S - 6); }); });
dzAura = old; P.lv = lv; P.x = ox0; P.y = oy0; document.body.innerHTML = ''; document.body.appendChild(c); c.id = 'sheet'; return [VW, cv.width]; })"""
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--allow-file-access-from-files']); pg = b.new_page(viewport={'width': 1400, 'height': 900}); pg.goto(url); pg.wait_for_timeout(2500)
    pg.click('#tNew'); pg.wait_for_timeout(400); pg.fill('#ccName', 'Sergio'); pg.click('#ccGo'); pg.wait_for_timeout(1500)
    try: pg.click('#introOk', timeout=2000)
    except Exception: pass
    pg.wait_for_timeout(800); pg.add_script_tag(path=extra); print(pg.evaluate('[G.map&&G.map.id,G.P.x,G.P.y]')); pg.evaluate('window.MX=G.P.x+(%s); window.MY=G.P.y+(%s)' % tuple(__import__('os').environ.get('MXY','0,0').split(',')))
    print(pg.evaluate(JS)); pg.locator('#sheet').screenshot(path=out); b.close()
